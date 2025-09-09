<template>
  <div class="python-cell-toolbar" role="toolbar" aria-label="Python cell toolbar">
    <button
      class="toolbar-btn run"
      :class="{ 'is-running': isRunning }"
      type="button"
      :disabled="!canRun || isRunning"
      :title="isRunning ? 'Run (working)…' : 'Run selected Python cell (Ctrl + Enter)'"
      @click="() => onRun(false)"
    >
      <span class="ascii-spinner" :style="{ visibility: isRunning ? 'visible' : 'hidden' }">
        {{ spinnerChar }}
      </span>
      <span class="label">Run python code</span>
      <span class="spin-wrap" aria-hidden="true"> </span>
    </button>
    <button
      class="toolbar-btn run"
      type="button"
      :disabled="!canRun"
      :title="'Delete output (Ctrl + Shift + Enter)'"
      @click="onClearOutputs"
    >
      <span class="label">Delete output from selected cell</span>
    </button>
    <!-- Add Button that when pressed opens a electron built in "modal" with theese options: (1)Export code from selected cell (2) Export code from selected notebook -->
    <button
      class="toolbar-btn export"
      type="button"
      title="Export code from selected cell (not implemented)"
      @click="onCodeExport"
    >
      <span class="label">Export code</span>
    </button>

    <button
      class="toolbar-btn reset-python-worker-margin-left-auto"
      type="button"
      :disabled="!canReset"
      :title="
        isRunning
          ? 'Reset Python worker'
          : 'Reset Python worker and clear outputs for selected Python cell'
      "
      @click="onReset"
    >
      Reset python
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import {
  executePythonInNotebook,
  resetWorkerForNotebook
} from '@renderer/code/pyodide-worker/client'
import { SHORTCUT_EVENTS } from '@renderer/utils/shortcuts'

const selectionStore = useCellSelectionStore()
const workspaceStore = useWorkspaceStore()
const themeStore = useThemeStore()

const selectedCellId = computed(() => selectionStore.selectedCellId)
const selectedKind = computed(() => selectionStore.selectedCellKind)

const canRun = computed(() => selectedCellId.value && selectedKind.value === 'python-cell')
const canReset = canRun

const isRunning = computed(() => {
  const id = selectedCellId.value
  if (!id) return false
  const ws = workspaceStore.getWorkspace()
  const cell = ws.cells[id]
  if (!cell || cell.kind !== 'python-cell') return false
  return cell.exec?.status === 'running'
})

// Luna4-style ASCII spinner (| / - \) shown while running
const spinnerChars = ['|', '/', '-', '\\']
const spinnerChar = ref(spinnerChars[0])
let spinnerInterval: ReturnType<typeof setInterval> | null = null

function startSpinner(): void {
  if (spinnerInterval) return
  let index = 0
  spinnerInterval = setInterval(() => {
    index = (index + 1) % spinnerChars.length
    spinnerChar.value = spinnerChars[index]
  }, 150)
}
function stopSpinner(): void {
  if (spinnerInterval) {
    clearInterval(spinnerInterval)
    spinnerInterval = null
  }
}

watch(isRunning, (running) => {
  if (running) startSpinner()
  else stopSpinner()
})

onUnmounted(() => stopSpinner())

async function onRun(selectNext = false): Promise<void> {
  const id = selectedCellId.value
  if (!id || selectedKind.value !== 'python-cell') return
  const ws = workspaceStore.getWorkspace()
  const cell = ws.cells[id]
  if (!cell || cell.kind !== 'python-cell') return
  const notebookId = workspaceStore.currentNotebookId || workspaceStore.ensureDefaultNotebook()
  // Source precedence: explicit input content if present, else original source
  const code = (cell.cellInputContent ?? cell.source ?? '').toString()
  // Mark running
  workspaceStore.setPythonRunBegin(id)
  try {
    const res = await executePythonInNotebook(notebookId, {
      type: 'execute',
      cellId: id,
      code,
      isDarkMode: !!themeStore.isDarkMode
    })
    workspaceStore.setPythonRunSuccess(id, {
      stdoutText: res.stdoutText,
      stderrText: res.stderr,
      stdoutImages: res.stdoutImages,
      pythonFunctions: res.pythonFunctions,
      pythonVariablesObjectString: res.pythonVariables
        ? JSON.stringify(res.pythonVariables)
        : undefined
    })
    if (selectNext) {
      // After success, select the next non-deleted cell in current notebook
      const nbId = workspaceStore.currentNotebookId || workspaceStore.ensureDefaultNotebook()
      const ws2 = workspaceStore.getWorkspace()
      const order = ws2.notebooks[nbId]?.cellOrder || []
      const startIdx = order.indexOf(id)
      for (let i = startIdx + 1; i < order.length; i++) {
        const candidate = order[i]
        if (!ws2.cells[candidate]?.softDeleted) {
          const kind2 = ws2.cells[candidate]?.kind
          if (kind2) selectionStore.setSelectCell(candidate, kind2)
          break
        }
      }
    }
  } catch (err) {
    const e = err as Error & { category?: string }
    // Ignore benign cancellations when a newer run superseded this one
    if (e.category === 'canceled') {
      return
    }
    // If the worker failed internally (e.g., after code updates), recreate and retry once
    if (e.category === 'internal') {
      try {
        resetWorkerForNotebook(notebookId)
        const res = await executePythonInNotebook(notebookId, {
          type: 'execute',
          cellId: id,
          code,
          isDarkMode: !!themeStore.isDarkMode
        })
        workspaceStore.setPythonRunSuccess(id, {
          stdoutText: res.stdoutText,
          stderrText: res.stderr,
          stdoutImages: res.stdoutImages,
          pythonFunctions: res.pythonFunctions,
          pythonVariablesObjectString: res.pythonVariables
            ? JSON.stringify(res.pythonVariables)
            : undefined
        })
        return
      } catch (err2) {
        const anyErr = err2 as Error & { category?: string }
        if (anyErr?.category === 'canceled') return
        const message2 = anyErr?.message || String(err2)
        workspaceStore.setPythonRunFailure(id, message2)
        return
      }
    }
    const message = e?.message || String(err)
    workspaceStore.setPythonRunFailure(id, message)
  }
}

function onReset(): void {
  const id = selectedCellId.value
  if (!id || selectedKind.value !== 'python-cell') return
  workspaceStore.resetPythonOutputs(id)
  const notebookId = workspaceStore.currentNotebookId || workspaceStore.ensureDefaultNotebook()
  resetWorkerForNotebook(notebookId)
}

function onClearOutputs(): void {
  const id = selectedCellId.value
  if (!id || selectedKind.value !== 'python-cell') return
  workspaceStore.resetPythonOutputs(id)
}

// Listen for global run/reset events from the shortcuts system
function onGlobalRunEvent(): void {
  if (canRun.value && !isRunning.value) {
    void onRun(false)
  }
}
function onGlobalRunNextEvent(): void {
  if (canRun.value && !isRunning.value) {
    void onRun(true)
  }
}
function onGlobalResetEvent(): void {
  if (canReset.value) {
    onReset()
  }
}

function onCodeExport(): void {
  const id = selectedCellId.value
  if (!id || selectedKind.value !== 'python-cell') return
  // Basic logging only (no modal yet): include notebook id, title (if available), and cell id
  const ws = workspaceStore.getWorkspace()
  const nbId = workspaceStore.currentNotebookId || '(none)'
  const nbTitle = nbId && ws.notebooks[nbId] ? ws.notebooks[nbId].title : '(unknown title)'
  console.log('[ExportCodeButton] pressed', {
    notebookId: nbId,
    notebookTitle: nbTitle,
    cellId: id
  })
}

onMounted(() => {
  const handleRunEvent = (): void => onGlobalRunEvent()
  const handleRunNextEvent = (): void => onGlobalRunNextEvent()
  const handleResetEvent = (): void => onGlobalResetEvent()
  // Store handlers on window so we can remove the exact same references
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__lunaHandleRunEvent = handleRunEvent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__lunaHandleRunNextEvent = handleRunNextEvent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__lunaHandleResetEvent = handleResetEvent
  window.addEventListener(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL, handleRunEvent)
  window.addEventListener(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL_NEXT, handleRunNextEvent)
  window.addEventListener(SHORTCUT_EVENTS.RESET_ACTIVE_PYTHON_CELL, handleResetEvent)
})
onUnmounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRunEvent = (window as any).__lunaHandleRunEvent as (() => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRunNextEvent = (window as any).__lunaHandleRunNextEvent as (() => void) | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResetEvent = (window as any).__lunaHandleResetEvent as (() => void) | undefined
  if (handleRunEvent) {
    window.removeEventListener(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL, handleRunEvent)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lunaHandleRunEvent = undefined
  }
  if (handleRunNextEvent) {
    window.removeEventListener(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL_NEXT, handleRunNextEvent)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lunaHandleRunNextEvent = undefined
  }
  if (handleResetEvent) {
    window.removeEventListener(SHORTCUT_EVENTS.RESET_ACTIVE_PYTHON_CELL, handleResetEvent)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lunaHandleResetEvent = undefined
  }
})
</script>

<style scoped>
@import '../../css/main-imports-this-css/design.css';
@import '../../css/toolbar-base.css';

/*--------------------------------------------------------*/
/* COMPONENT SPECIFIC STYLES (NOT BASE CSS)
/*--------------------------------------------------------*/
/* Layout: keep actions left, move reset button to far right */
.python-cell-toolbar {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 0; /* ensure no right gutter so the last button touches the edge */
}
/* Run button constant width with reserved spinner space */
.toolbar-btn.run {
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
}
.toolbar-btn.run .label {
  display: inline-block;
}
.toolbar-btn.run .spin-wrap {
  display: inline-flex;
  width: 0em; /* reserve space so width stays constant */
  height: 0em;
  align-items: center;
  justify-content: center;
}
.toolbar-btn.run.is-running {
  background: var(--button-on-color, lightgreen); /* uses theme var; light green fallback */
}

/* ASCII spinner styles */
.ascii-spinner {
  display: inline-block;
  width: 1ch; /* reserve exactly one character width */
  text-align: center;
  font-family: var(--ui-font, monospace);
  font-size: var(--toolbar-font-size, 12px);
  font-weight: bold;
}

.toolbar-btn.reset-python-worker-margin-left-auto {
  background: var(--button-reset-python-worker-color, transparent);
  margin-left: auto; /* push to far right */
}
.toolbar-btn.reset-python-worker:hover {
  background: var(--button-reset-python-worker-hover-color, firebrick);
  border: var(--toolbar-button-border-hover);
}

/* Class for export button not implemented cursor not allowed */
.toolbar-btn.export {
  background: var(--button-transparent-off-color, #3b82f6); /* blue */
  cursor: not-allowed;
}
.toolbar-btn.export:hover {
  background: var(--toolbar-button-border-hover, #2563eb); /* darker blue */
  border: var(--toolbar-button-border-hover);
}
</style>
