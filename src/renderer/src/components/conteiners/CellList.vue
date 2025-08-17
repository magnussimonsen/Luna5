<template>
  <div class="cell-list">
    <CellContainer
      v-for="(cellId, idx) in orderedCellIds"
      :key="cellId"
      :index="idx"
      :cell-id="cellId"
      :kind="cells[cellId].kind"
      :in-bin="workspaceStore.viewMode === 'bin'"
      :selected="selectionStore.selectedCellId === cellId"
      :soft-locked="cells[cellId].softLocked"
      :hard-locked="cells[cellId].hardLocked"
      @select="onSelect"
    >
      <component :is="resolveCellComponent(cells[cellId].kind)" :cell="cells[cellId]" />
    </CellContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import CellContainer from './CellContainer.vue'
import TextCell from '@renderer/components/cells/TextCell.vue'
import type { Cell } from '@renderer/types/notebook-cell-types'

const workspaceStore = useWorkspaceStore()
const selectionStore = useCellSelectionStore()

const workspace = computed(() => workspaceStore.getWorkspace())

if (!workspaceStore.currentNotebookId) {
  // Auto-select / create default if missing so UI always shows something
  workspaceStore.ensureDefaultNotebook()
}

const currentNotebook = computed(() => {
  const ws = workspace.value
  if (!workspaceStore.currentNotebookId) return null
  return ws.notebooks[workspaceStore.currentNotebookId] || null
})

// Compute ordered cell ids based on view mode and bin selection
const orderedCellIds = computed(() => {
  const ws = workspace.value
  const mode = workspaceStore.viewMode
  if (mode === 'active') {
    const nb = currentNotebook.value
    if (!nb) return []
    return nb.cellOrder.filter((cid) => !ws.cells[cid]?.softDeleted)
  }
  // Bin mode
  const binId = workspaceStore.binSelectedNotebookId
  if (!binId) return []
  // If the selected bin notebook still exists (active notebook with soft-deleted cells),
  // show only its soft-deleted cells in original order
  const activeNb = ws.notebooks[binId]
  if (activeNb) {
    return activeNb.cellOrder.filter((cid) => ws.cells[cid]?.softDeleted)
  }
  // Otherwise, the notebook itself was deleted. Build list from recycleBin metadata ordered by originalIndex
  const entries = Object.values(ws.recycleBin.cells).filter((meta) => meta.notebookId === binId)
  entries.sort((a, b) => a.originalIndex - b.originalIndex)
  return entries.map((e) => e.id).filter((cid) => !!ws.cells[cid])
})

const cells = computed<Record<string, Cell>>(() => workspace.value.cells)

function resolveCellComponent(kind: string): Component {
  switch (kind) {
    case 'text-cell':
      return TextCell
    default:
      return TextCell // fallback
  }
}

function onSelect(id: string): void {
  const cell = cells.value[id]
  selectionStore.setSelectCell(id, cell.kind)
}
</script>

<style scoped>
.cell-list {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
}
</style>
