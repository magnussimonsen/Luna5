<!--
Performance tip: If Monaco editor causes the side panel to open slowly, defer Monaco initialization until after the panel animation completes.
For example, use setTimeout, requestAnimationFrame, or Vue's nextTick to delay editor setup.
You can also lazy-load Monaco only when the Python cell is visible or focused, or show a loading spinner while Monaco loads.
Changing the container structure will NOT fix the lag; the solution is to delay Monaco's setup until after the panel is open.

PYTHON CELL & MONACO EDITOR REFACTOR PLAN

Goal:
Refactor the PythonCell component and Monaco editor lifecycle to optimize performance, memory usage, and user experience in large notebooks.

Key Strategies:
1. Selected Cell: Interactive Monaco Editor
  - Only the selected cell has a fully interactive Monaco editor (read/write, all features).

2. Visible, Deselected Cells: Read-Only Monaco
  - Visible but deselected cells use Monaco in read-only mode for syntax highlighting.
  - Minimize decorations, disable minimap, and restrict interactions for performance.

3. Not Visible Cells: Hybernation/Rest State
  - Cells scrolled out of view either:
    a) Dispose their Monaco instance to free memory, or
    b) Detach the editor DOM node but keep the instance in memory for fast reactivation.
  - Use IntersectionObserver to track cell visibility.

4. Selection Switching
  - When a cell is selected: attach or initialize a full Monaco editor.
  - When a cell is deselected: switch to read-only/minimal mode.

5. Editor Pooling (Advanced)
  - Maintain a pool of Monaco editor instances, reusing them for visible cells.
  - Limit the total number of active editors (configurable in settings).

Functions to Implement:
function initializeFullMonacoEditor(cellId, container, initialValue, options) { }
function setMonacoEditorReadOnly(cellId) { }
function hybernateMonacoEditor(cellId) { }
function wakeUpMonacoEditor(cellId, container) { }
function destroyMonacoEditor(cellId) { }

// Pool management (optional)
function getMonacoEditorFromPool(container, initialValue, options) { }
function releaseMonacoEditorToPool(cellId) { }
-->

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
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import type { PythonCell } from '@renderer/types/notebook-cell-types'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { ensureAllMonacoThemesDefined, applyMonacoTheme } from '@renderer/code/monaco/monaco-theme'

// Monaco will be lazy-loaded. See `lazyInitializeMonacoEditor` below.
// We load the ESM API, CSS, python contribution and the worker dynamically at runtime
// to avoid increasing the initial bundle size.
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
const cellSelection = useCellSelectionStore()
const themeStore = useThemeStore()
const codeSettingsStore = useCodeSettingsStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()

// DOM reference to the Monaco editor container
const editorElementRef = ref<HTMLDivElement | null>(null)
// Monaco editor instance (will be assigned after Monaco is loaded)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editor: any = null
// Collect Monaco disposables so we can clean up on unmount
let disposables: Array<{ dispose: () => void }> = []
// Resize observer to re-layout the editor when the container size changes
let resizeObserver: ResizeObserver | null = null
// Guard flag to avoid echoing local edits back into the model watcher
let isApplyingLocalEdit = false

import { parsePixelsToNumber } from '@renderer/utils/miscellaneous/parse-pixels-to-number'

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

// Module-scoped references to the dynamically loaded Monaco and worker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let monaco: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editorWorker: any = null
let monacoLoaded = false

// Lazy-load Monaco (API + CSS + python language) and the worker, then run
// the existing `initializeMonacoEditor` logic which expects Monaco to be present.
async function lazyInitializeMonacoEditor(): Promise<void> {
  if (monacoLoaded) {
    // Monaco already available => just initialize
    initializeMonacoEditor()
    return
  }
  try {
    const [monacoEditor, workerMod] = await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api'),
      // load CSS (side-effect)
      import('monaco-editor/min/vs/editor/editor.main.css'),
      // python language contribution (side-effect)
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
      import('monaco-editor/esm/vs/editor/editor.worker?worker')
    ])
    monaco = monacoEditor
    // worker module default export is the worker constructor
    editorWorker = workerMod && (workerMod.default ?? workerMod)

    // Configure worker factory
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(self as any).MonacoEnvironment = {
      getWorker() {
        return new editorWorker()
      }
    }

    monacoLoaded = true
    // Now reuse the existing initialization logic which references `monaco` at runtime
    initializeMonacoEditor()
  } catch (err) {
    // Keep failure non-fatal in UI; log for debugging
    console.error('Failed to lazy-load Monaco editor', err)
  }
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
    // theme: 'vs', Not needed, we apply the correct theme below
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
  // Use lazy loader so Monaco and its workers are only fetched when needed
  // Initialize only if this cell is selected at mount time
  if (cellSelection.selectedCellId === props.cell.id) {
    void lazyInitializeMonacoEditor()
  }
})

// Dispose helper used when cell becomes unselected or on unmount
function disposeEditorInstance(): void {
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
    try {
      const model = editor.getModel()
      editor.dispose()
      if (model) model.dispose()
    } catch {
      /* ignore */
    }
    editor = null
  }
}

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
  disposeEditorInstance()
})

// React to selection changes: initialize when this cell becomes selected,
// dispose when it is no longer selected.
watch(
  () => cellSelection.selectedCellId,
  (newId, oldId) => {
    if (newId === props.cell.id) {
      // selected now
      void lazyInitializeMonacoEditor()
    } else if (oldId === props.cell.id) {
      // just unselected
      disposeEditorInstance()
    }
  }
)
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
  margin-top: 0em;
  border: 0px solid var(--error-border, #d92c2c);
  background: var(--error-bg, #fff1f1);
  color: var(--error-fg, #7a1010);
  border-radius: 0px;
  padding: 0.5em 0.75em;
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
