<template>
  <div class="cell-list">
    <CellContainer
      v-for="(cellId, idx) in orderedCellIds"
      :key="cellId"
      :index="idx"
      :cell-id="cellId"
      :kind="cells[cellId].kind"
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

const orderedCellIds = computed(() => currentNotebook.value?.cellOrder || [])

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
