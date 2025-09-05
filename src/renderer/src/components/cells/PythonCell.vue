<template>
  <div class="python-cell" :data-locked="isLocked ? 'true' : null">
    <div
      ref="editorEl"
      class="python-cell-editor"
      data-primary-editor="true"
      role="textbox"
      :aria-readonly="isLocked ? 'true' : 'false'"
      tabindex="0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PythonCell } from '@renderer/types/notebook-cell-types'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { ensureAllMonacoThemesDefined, applyMonacoTheme } from '@renderer/code/monaco/monaco-theme'

// Monaco ESM API + CSS + worker (Vite-friendly)
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/min/vs/editor/editor.main.css'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
// Editor worker: required for Monaco to function under Vite
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// Configure worker factory (safe to set multiple times)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(self as any).MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  }
}

const props = defineProps<{ cell: PythonCell }>()

const workspaceStore = useWorkspaceStore()
const themeStore = useThemeStore()
const codeSettingsStore = useCodeSettingsStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()

const editorEl = ref<HTMLDivElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let disposables: Array<{ dispose: () => void }> = []
let ro: ResizeObserver | null = null
let isApplyingLocalEdit = false

function pxToNumber(px: string | undefined, fallback = 14): number {
  try {
    if (!px) return fallback
    const m = /([0-9]+(?:\.[0-9]+)?)/.exec(px)
    return m ? Number(m[1]) : fallback
  } catch {
    return fallback
  }
}

// Cells can be locked/hidden via several flags; reflect that in editor readOnly state
const isLocked = computed(
  () =>
    !!props.cell.hidden ||
    !!props.cell.softLocked ||
    !!props.cell.hardLocked ||
    !!props.cell.softDeleted
)

// Resolve theme id from settings + dark mode; falls back to Monaco built-ins
const desiredTheme = computed(() =>
  themeStore.isDarkMode
    ? codeSettingsStore.darkCodeEditorTheme
    : codeSettingsStore.lightCodeEditorTheme
)

// Ensure themes are globally registered once
function ensureCustomThemesDefined(): void {
  ensureAllMonacoThemesDefined()
}

function initEditor(): void {
  if (!editorEl.value) return
  const initialValue = props.cell.cellInputContent ?? props.cell.source ?? ''
  // Make sure any custom themes are registered before creating editor
  // (built-ins like 'vs' / 'vs-dark' work without this).
  ensureCustomThemesDefined()
  editor = monaco.editor.create(editorEl.value, {
    value: initialValue,
    language: 'python',
    // Start with a safe built-in theme; we'll apply the selected theme right after init
    theme: 'vs',
    readOnly: isLocked.value,
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    scrollbar: { vertical: 'hidden' },
    overviewRulerLanes: 0,
    automaticLayout: true,
    // Monaco font settings
    fontFamily: fontStore.fonts.codingFont,
    fontSize: pxToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
  })
  // Propagate edits into the workspace
  disposables.push(
    editor.onDidChangeModelContent(() => {
      if (!editor) return
      const value = editor.getValue()
      // Mark that this change originated from the editor to avoid echoing
      // the store update back into setValue (which would reset the cursor)
      isApplyingLocalEdit = true
      workspaceStore.setCellInputContent(props.cell.id, value)
      // Release the flag on next tick
      setTimeout(() => {
        isApplyingLocalEdit = false
      }, 0)
    })
  )
  // Now switch to the desired theme
  applyMonacoTheme(desiredTheme.value)
  // Ensure font options are respected after creation as well
  try {
    editor.updateOptions({
      fontFamily: fontStore.fonts.codingFont,
      fontSize: pxToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
    })
  } catch {
    /* ignore */
  }
  // Defensive: ensure placeholder source appears if model started empty
  try {
    if (editor && !editor.getValue() && props.cell.source) {
      isApplyingLocalEdit = true
      editor.setValue(props.cell.source)
      setTimeout(() => {
        isApplyingLocalEdit = false
      }, 0)
    }
  } catch {
    /* ignore */
  }
  // Sync editor container height to content height for auto-grow
  const applyHeight = (): void => {
    if (!editor || !editorEl.value) return
    const contentHeight = editor.getContentHeight()
    let minH = 0
    try {
      const cs = window.getComputedStyle(editorEl.value)
      const mh = cs.minHeight || '0px'
      if (mh.endsWith('px')) {
        minH = parseFloat(mh)
      }
    } catch {
      /* ignore */
    }
    const h = Math.max(contentHeight, minH)
    editorEl.value.style.height = `${Math.ceil(h)}px`
    editor.layout()
  }
  // Update on content size changes
  disposables.push(
    editor.onDidContentSizeChange(() => {
      applyHeight()
    })
  )
  // Initial apply
  applyHeight()
  // Re-layout on container width changes
  if (editorEl.value && 'ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      applyHeight()
    })
    ro.observe(editorEl.value)
  }
}

onMounted(() => {
  initEditor()
})

// Theme reactivity: when dark mode or selected theme changes,
// ensure themes are registered and then switch via setTheme().
watch(
  [
    () => themeStore.isDarkMode,
    () => codeSettingsStore.lightCodeEditorTheme,
    () => codeSettingsStore.darkCodeEditorTheme
  ],
  () => {
    ensureCustomThemesDefined()
    applyMonacoTheme(desiredTheme.value)
    if (editor) editor.layout()
  }
)

// Font reactivity: update Monaco options when coding font or size changes
watch(
  () => fontStore.fonts.codingFont,
  () => {
    if (!editor) return
    try {
      editor.updateOptions({ fontFamily: fontStore.fonts.codingFont })
      editor.layout()
    } catch {
      /* ignore */
    }
  }
)

watch(
  () => fontSizeStore.fontSizes.codeEditorCellFontSize,
  () => {
    if (!editor) return
    try {
      editor.updateOptions({ fontSize: pxToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize) })
      editor.layout()
    } catch {
      /* ignore */
    }
  }
)

// External content changes (e.g., load/undo) -> reflect in editor
watch(
  () => [props.cell.cellInputContent, props.cell.source] as const,
  ([nextInput, nextSource]) => {
    if (!editor) return
    if (isApplyingLocalEdit) return
    // Prefer explicit input content; otherwise fall back to original source text
    const targetValue = nextInput ?? nextSource ?? ''
    const normalize = (s: string): string =>
      s
        .replace(/\r\n/g, '\n')
        .replace(/\u00A0/g, ' ')
        .replace(/\n+$/g, '')
    const current = normalize(editor.getValue())
    const incoming = normalize(targetValue)
    if (current !== incoming) {
      editor.setValue(targetValue)
    }
  }
)

// Lock state changes -> toggle readOnly
watch(isLocked, (locked) => {
  if (!editor) return
  editor.updateOptions({ readOnly: locked })
})

onBeforeUnmount(() => {
  disposables.forEach((d) => d.dispose())
  disposables = []
  if (ro) {
    try {
      ro.disconnect()
    } catch {
      /* ignore */
    }
    ro = null
  }
  if (editor) {
    const model = editor.getModel()
    editor.dispose()
    if (model) model.dispose()
    editor = null
  }
})
</script>

<style scoped>
.python-cell {
  font-family: var(--content-font, inherit);
  color: var(--text-color, #222);
}
.python-cell-editor {
  width: 100%;
  /* Let the editor auto-grow with content; JS sets explicit height in px. */
  min-height: 3em;
  height: auto;
  overflow: hidden;
  border: 1px solid var(--cell-border-color);
}
.python-cell[data-locked='true'] {
  opacity: 0.9;
  filter: grayscale(0.1);
}
</style>
