<template>
  <div class="python-cell-toolbar" role="toolbar" aria-label="Python cell toolbar">
    <button
      class="toolbar-btn run"
      :class="{ 'is-running': isRunning }"
      type="button"
      :disabled="!canRun || isRunning"
      :title="isRunning ? 'Run (working)…' : 'Run selected Python cell'"
      @click="onRun"
    >
      <span class="ascii-spinner" :style="{ visibility: isRunning ? 'visible' : 'hidden' }">
        {{ spinnerChar }}
      </span>
      <span class="label">Run python code</span>
      <span class="spin-wrap" aria-hidden="true"> </span>
    </button>
    <button
      class="toolbar-btn reset-python-worker"
      type="button"
      :disabled="!canReset"
      :title="
        isRunning
          ? 'Kill Python worker and clear outputs'
          : 'Clear outputs for selected Python cell'
      "
      @click="onReset"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import {
  executePythonInNotebook,
  resetWorkerForNotebook
} from '@renderer/code/pyodide-worker/client'

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

async function onRun(): Promise<void> {
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
  } catch (err) {
    const e = err as Error & { category?: string }
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
        const message2 = err2 instanceof Error ? err2.message : String(err2)
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
</script>

<style scoped>
@import '../../css/main-imports-this-css/design.css';
@import '../../css/toolbar-base.css';
/*--------------------------------------------------------*/
/* COMPONENT SPECIFIC STYLES (NOT BASE CSS)
/*--------------------------------------------------------*/
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

.toolbar-btn.reset-python-worker {
  background: var(--button-reset-python-worker-color, transparent);
}
.toolbar-btn.reset-python-worker:hover {
  background: var(--button-reset-python-worker-hover-color, firebrick);
  border: var(--toolbar-button-border-hover);
}
</style>
