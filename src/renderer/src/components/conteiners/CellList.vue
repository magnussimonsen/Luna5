<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->
<!-- ONGOING MAJOR CSS DEBUGGING AND REFACTORING -->

<template>
  <div class="cell-containers-list">
    <CellContainer
      v-for="(cellId, idx) in orderedCellIds"
      :key="cellId"
      :index="idx"
      :cell-id="cellId"
      :kind="cells[cellId].kind"
      :in-bin="workspaceStore.viewMode === 'bin'"
      :selected="selectionStore.selectedCellId === cellId"
      :locked="!!cells[cellId].softLocked"
      :hidden="!!cells[cellId].hidden"
      :flagged="!!cells[cellId].flagged"
      @select="onSelect"
      @deselect="onDeselect"
    >
      <component :is="resolveCellComponent(cells[cellId].kind)" :cell="cells[cellId]" />
    </CellContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import CellContainer from './CellContainer.vue'
import TextCell from '@renderer/components/cells/TextCell.vue'
import PythonCell from '@renderer/components/cells/PythonCell.vue'
import type { Cell } from '@renderer/types/notebook-cell-types'

const workspaceStore = useWorkspaceStore()
const selectionStore = useCellSelectionStore()

const workspace = computed(() => workspaceStore.getWorkspace())

if (!workspaceStore.currentNotebookId) {
  // Auto-select / create default if missing so UI always shows something
  workspaceStore.ensureDefaultNotebook()
}

const currentNotebook = computed(() => {
  const workspaceObj = workspace.value
  if (!workspaceStore.currentNotebookId) return null
  return workspaceObj.notebooks[workspaceStore.currentNotebookId] || null
})

// Compute ordered cell ids based on view mode and bin selection
const orderedCellIds = computed(() => {
  const workspaceObj = workspace.value
  const mode = workspaceStore.viewMode
  if (mode === 'notebooks') {
    const currentNotebookValue = currentNotebook.value
    if (!currentNotebookValue) return []
    return currentNotebookValue.cellOrder.filter((cid) => !workspaceObj.cells[cid]?.softDeleted)
  }
  // Bin mode
  const binId = workspaceStore.binSelectedNotebookId
  if (!binId) return []
  // If the selected bin notebook still exists (active notebook with soft-deleted cells),
  // show only its soft-deleted cells in original order
  const activeNotebook = workspaceObj.notebooks[binId]
  if (activeNotebook) {
    return activeNotebook.cellOrder.filter((cid) => workspaceObj.cells[cid]?.softDeleted)
  }
  // Otherwise, the notebook itself was deleted. Build list from recycleBin metadata ordered by originalIndex
  const entries = Object.values(workspaceObj.recycleBin.cells).filter(
    (meta) => meta.notebookId === binId
  )
  entries.sort((a, b) => a.originalIndex - b.originalIndex)
  return entries.map((e) => e.id).filter((cid) => !!workspaceObj.cells[cid])
})

const cells = computed<Record<string, Cell>>(() => workspace.value.cells)

function resolveCellComponent(kind: string): Component {
  switch (kind) {
    case 'text-cell':
      return TextCell
    case 'python-cell':
      return PythonCell
    default:
      return TextCell // fallback
  }
}

function onSelect(id: string): void {
  const cell = cells.value[id]
  selectionStore.setSelectCell(id, cell.kind)
  // Remember last selection for current view
  if (workspaceStore.viewMode === 'notebooks') {
    const nbId = workspaceStore.currentNotebookId
    if (nbId) workspaceStore.setNotebookLastSelectedCell(nbId, id)
  } else if (workspaceStore.viewMode === 'bin') {
    const binNbId = workspaceStore.binSelectedNotebookId
    if (binNbId) workspaceStore.setBinLastSelectedCell(binNbId, id)
  }
}

function onDeselect(): void {
  selectionStore.clearSelection()
}
</script>
