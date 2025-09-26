<template>
  <div
    class="button-row-flex-wrap-base flex-start"
    :class="{ 'is-dark': isDarkMode }"
    role="toolbar"
    aria-label="Python cell toolbar"
  >
    <!-- Run button with spinner when running -->
    <button
      class="top-toolbar__button"
      :class="{ 'top-toolbar__button--active': isRunning }"
      type="button"
      :disabled="!canRun || isRunning || isLocked || isHidden"
      :title="isRunning ? 'Run (working)…' : 'Run selected Python cell (Ctrl + Enter)'"
      @click="() => onRun(false)"
    >
      <span class="ascii-spinner" :style="{ visibility: isRunning ? 'visible' : 'hidden' }">
        {{ spinnerChar }}
      </span>
      <span class="label">Run python code</span>
      <span class="spin-wrap" aria-hidden="true"> </span>
    </button>
    <!-- Clear python outputs  -->
    <button
      class="top-toolbar__button"
      :class="{ 'top-toolbar__button--active': !canRun }"
      type="button"
      :disabled="!canRun || isRunning || isLocked || isHidden"
      :title="'Delete output (Ctrl + Shift + Enter)'"
      @click="onClearOutputs"
    >
      <span class="label">Delete output from selected cell</span>
    </button>
    <!-- Core idea: (not implemented yet)
    Add Button that when pressed opens a electron built in "modal" with theese options: 
    (1) Export code from selected cell 
    (2) Export code from selected notebook 
     -->
    <button
      class="top-toolbar__button top-toolbar__button--disabled"
      type="button"
      title="Export code from selected cell (not implemented)"
      @click="onCodeExport"
    >
      <span class="label">Export code</span>
    </button>

    <!-- Section: Using margin-left-auto instead of flex-end -->
    <!-- <div
      class="button-row-flex-wrap-base flex-end"
      :class="{ 'is-dark': isDarkMode }"
      role="toolbar"
      aria-label="Python cell toolbar"
    >
    -->
    <button
      class="top-toolbar__button top-toolbar__button--reset"
      type="button"
      :disabled="!canReset || isLocked || isHidden"
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
  <!-- </div> -->
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
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

const isDarkMode = computed(() => !!themeStore.isDarkMode)

const isLocked = computed(() => {
  const id = selectedCellId.value
  if (!id) return false
  const ws = workspaceStore.getWorkspace()
  const cell = ws.cells[id]
  if (!cell || cell.kind !== 'python-cell') return false
  return !!cell.softLocked
})

const isHidden = computed(() => {
  const id = selectedCellId.value
  if (!id) return false
  const ws = workspaceStore.getWorkspace()
  const cell = ws.cells[id]
  if (!cell || cell.kind !== 'python-cell') return false
  return !!cell.hidden
})

const isRunning = computed(() => {
  const id = selectedCellId.value
  if (!id) return false
  const ws = workspaceStore.getWorkspace()
  const cell = ws.cells[id]
  if (!cell || cell.kind !== 'python-cell') return false
  return cell.exec?.status === 'running'
})

const canRun = computed(() => selectedCellId.value && selectedKind.value === 'python-cell')
const canReset = canRun

import { spinnerChar, startSpinner, stopSpinner } from '@renderer/code/animations/ascii-spinner'

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

/*
---------------------------------------------------------------
Styles used in this component are global styles from css-folder
---------------------------------------------------------------
*/
</script>
