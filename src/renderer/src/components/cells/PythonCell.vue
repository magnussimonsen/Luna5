<template>
  <div class="python-cell" :data-locked="isCellLocked ? 'true' : null">
    <div
      ref="editorElementRef"
      class="python-cell-editor"
      data-primary-editor="true"
      role="textbox"
      :aria-readonly="isCellLocked ? 'true' : 'false'"
      tabindex="0"
    ></div>
    <!-- Outputs -->
    <PythonOutputText :text="props.cell.stdoutText ?? ''" />
    <PythonOutputImages :images="props.cell.stdoutImages ?? []" />
    <div v-if="props.cell.workerError || props.cell.stderrText" class="py-out-error" role="alert">
      <div class="section-title">Errors</div>
      <pre v-if="props.cell.stderrText" class="stderr">{{ props.cell.stderrText }}</pre>
      <pre v-if="props.cell.workerError" class="stderr">{{ props.cell.workerError }}</pre>
    </div>
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
import PythonOutputText from './python-output/PythonOutputText.vue'
import PythonOutputImages from './python-output/PythonOutputImages.vue'

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

// DOM reference to the Monaco editor container
const editorElementRef = ref<HTMLDivElement | null>(null)
// Monaco editor instance
let editor: monaco.editor.IStandaloneCodeEditor | null = null
// Collect Monaco disposables so we can clean up on unmount
let disposables: Array<{ dispose: () => void }> = []
// Resize observer to re-layout the editor when the container size changes
let resizeObserver: ResizeObserver | null = null
// Guard flag to avoid echoing local edits back into the model watcher
let isApplyingLocalEdit = false

// Convert CSS pixel string values (e.g., "14px") to a numeric value for Monaco options
function parsePixelsToNumber(px: string | undefined, fallback = 14): number {
  try {
    if (!px) return fallback
    const m = /([0-9]+(?:\.[0-9]+)?)/.exec(px)
    return m ? Number(m[1]) : fallback
  } catch {
    return fallback
  }
}

// Cells can be locked/hidden via several flags; reflect that in editor readOnly state
const isCellLocked = computed(
  () =>
    !!props.cell.hidden ||
    !!props.cell.softLocked ||
    !!props.cell.hardLocked ||
    !!props.cell.softDeleted
)

// Resolve theme id from settings + dark mode; falls back to Monaco built-ins
// The actively selected Monaco theme id, derived from light/dark mode and settings
const selectedMonacoThemeId = computed(() =>
  themeStore.isDarkMode
    ? codeSettingsStore.darkCodeEditorTheme
    : codeSettingsStore.lightCodeEditorTheme
)

// Ensure themes are globally registered once
function registerCuratedMonacoThemesIfNeeded(): void {
  ensureAllMonacoThemesDefined()
}

function initializeMonacoEditor(): void {
  if (!editorElementRef.value) return
  const initialValue = props.cell.cellInputContent ?? props.cell.source ?? ''
  // Make sure any custom themes are registered before creating editor
  // (built-ins like 'vs' / 'vs-dark' work without this).
  registerCuratedMonacoThemesIfNeeded()
  editor = monaco.editor.create(editorElementRef.value, {
    value: initialValue,
    language: 'python',
    // Start with a safe built-in theme; we'll apply the selected theme right after init
    theme: 'vs',
    readOnly: isCellLocked.value,
    lineNumbers: 'on',
    renderLineHighlightOnlyWhenFocus: true,
    lineNumbersMinChars: 3,
    lineDecorationsWidth: 1,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    // Let mouse wheel scroll bubble to the outer container (so the page scrolls)
    scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false },
    overviewRulerLanes: 0,
    automaticLayout: true,
    // Monaco font settings
    fontFamily: fontStore.fonts.codingFont,
    fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
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
  applyMonacoTheme(selectedMonacoThemeId.value)
  // Ensure font options are respected after creation as well
  try {
    editor.updateOptions({
      fontFamily: fontStore.fonts.codingFont,
      fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
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
  const updateEditorHeightToContent = (): void => {
    if (!editor || !editorElementRef.value) return
    const contentHeight = editor.getContentHeight()
    let minHeightPx = 0
    try {
      const computedStyle = window.getComputedStyle(editorElementRef.value)
      const minHeightCss = computedStyle.minHeight || '0px'
      if (minHeightCss.endsWith('px')) {
        minHeightPx = parseFloat(minHeightCss)
      }
    } catch {
      /* ignore */
    }
    const targetHeight = Math.max(contentHeight, minHeightPx)
    editorElementRef.value.style.height = `${Math.ceil(targetHeight)}px`
    editor.layout()
  }
  // Update on content size changes
  disposables.push(
    editor.onDidContentSizeChange(() => {
      updateEditorHeightToContent()
    })
  )
  // Initial apply
  updateEditorHeightToContent()
  // Re-layout on container width changes
  if (editorElementRef.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      updateEditorHeightToContent()
    })
    resizeObserver.observe(editorElementRef.value)
  }
}

onMounted(() => {
  initializeMonacoEditor()
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
    registerCuratedMonacoThemesIfNeeded()
    applyMonacoTheme(selectedMonacoThemeId.value)
    if (editor) {
      editor.layout()
    }
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
      editor.updateOptions({
        fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
      })
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
watch(isCellLocked, (locked) => {
  if (!editor) return
  editor.updateOptions({ readOnly: locked })
})

onBeforeUnmount(() => {
  disposables.forEach((d) => d.dispose())
  disposables = []
  if (resizeObserver) {
    try {
      resizeObserver.disconnect()
    } catch {
      /* ignore */
    }
    resizeObserver = null
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
  min-height: 1em;
  height: auto;
  overflow: hidden;
  border: 0px solid var(--cell-border-color);
  /*Right border radius*/
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.py-out-error {
  margin-top: 0rem;
  border: 0px solid var(--error-border, #d92c2c);
  background: var(--error-bg, #fff1f1);
  color: var(--error-fg, #7a1010);
  border-radius: 0px;
  padding: 0.5rem 0.75rem;
}
.section-title {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
}
.stderr {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
  cursor: text;
}
.py-out-error,
.py-out-error * {
  user-select: text;
}
.python-cell[data-locked='true'] {
  /* WHAT DOES THIS DO? */
  opacity: 0.9;
  filter: grayscale(0.1);
}
</style>
