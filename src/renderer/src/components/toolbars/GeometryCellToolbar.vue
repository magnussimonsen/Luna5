<template>
  <div class="row-flex-wrap-base" role="toolbar" aria-label="Geometry cell toolbar">
    <div class="row-flex-wrap-base-child util-transparent-border">
      <!-- Test Button -->
      <button
        class="top-toolbar__button"
        type="button"
        title="Test Geometry Function"
        aria-label="Test Geometry Function"
        :disabled="isCellLocked"
        @click="handleTestGeometry"
      >
        Test
      </button>

      <!-- Clear Canvas Button -->
      <button
        class="top-toolbar__button"
        type="button"
        title="Clear Canvas"
        aria-label="Clear Canvas"
        :disabled="isCellLocked"
        @click="handleClearCanvas"
      >
        Clear
      </button>

      <!-- Parse Text Button -->
      <button
        class="top-toolbar__button"
        type="button"
        title="Parse Geometry Commands"
        aria-label="Parse Geometry Commands"
        :disabled="isCellLocked"
        @click="handleParseText"
      >
        Parse
      </button>

      <!-- Placeholder buttons for future geometry tools -->
      <button
        class="top-toolbar__button"
        type="button"
        title="Add Point (placeholder)"
        aria-label="Add Point"
        :disabled="isCellLocked"
        @click="handleAddPoint"
      >
        Point
      </button>

      <button
        class="top-toolbar__button"
        type="button"
        title="Add Line (placeholder)"
        aria-label="Add Line"
        :disabled="isCellLocked"
        @click="handleAddLine"
      >
        Line
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeometryCellStore } from '@renderer/stores/geometrycell/geometryCellStore'
import type { GeometryCell } from '@renderer/types/notebook-cell-types'

// Stores
const cellSelection = useCellSelectionStore()
const workspaceStore = useWorkspaceStore()
const geometryStore = useGeometryCellStore()

// Computed properties
const selectedCellId = computed(() => cellSelection.selectedCellId)
const selectedKind = computed(() => cellSelection.selectedCellKind)

const selectedCell = computed((): GeometryCell | null => {
  const id = selectedCellId.value
  if (!id || selectedKind.value !== 'geometry-cell') return null

  const workspace = workspaceStore.getWorkspace()
  const cell = workspace.cells[id]
  if (!cell || cell.kind !== 'geometry-cell') return null

  return cell as GeometryCell
})

const isCellLocked = computed(() => {
  const cell = selectedCell.value
  if (!cell) return true
  return !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
})

// Event handlers
function handleTestGeometry(): void {
  console.log('Test Geometry clicked')
  // Placeholder for geometry testing functionality
  const cell = selectedCell.value
  if (cell) {
    console.log('Testing geometry for cell:', cell.id)
  }
}

function handleClearCanvas(): void {
  console.log('Clear Canvas clicked')
  geometryStore.clearAll()
}

function handleParseText(): void {
  console.log('Parse Text clicked')
  const cell = selectedCell.value
  if (cell && cell.cellInputContent) {
    geometryStore.parseGeometryCommands(cell.cellInputContent)
  }
}

function handleAddPoint(): void {
  console.log('Add Point clicked (placeholder)')
  // Placeholder for adding a point
}

function handleAddLine(): void {
  console.log('Add Line clicked (placeholder)')
  // Placeholder for adding a line
}
</script>

<style scoped>
/* Inherit base toolbar styles from the imported CSS */
</style>
