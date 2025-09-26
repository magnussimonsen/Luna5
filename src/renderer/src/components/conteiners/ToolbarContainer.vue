<!--
ToolbarContainer.vue

This component displays the appropriate toolbar for the currently selected cell in the workspace.
- It dynamically chooses which toolbar to show (e.g., text cell, python cell) based on the cell type.
- If no cell is selected, it shows a placeholder message.
- Toolbar styles are in: src/renderer/src/css/main-imports-this-css/top-toolbar-container.css
-->

<template>
  <!--
    Main container for the top toolbar area.
    Renders the correct toolbar component for the selected cell type.
    If no cell is selected, shows a placeholder.
  -->
  <div class="top-toolbar-container">
    <component
      :is="currentToolbarComponent"
      v-if="currentToolbarComponent"
      :cell-id="selectedCellId"
      :kind="selectedCellKind"
      :is-cell-hidden="selectedCellIsHidden"
      :is-soft-locked="selectedCellIsSoftLocked"
      :is-hard-locked="selectedCellIsHardLocked"
      :is-flagged="selectedCellIsFlagged"
      :in-bin="workspaceStore.viewMode === 'bin'"
      :parent-notebook-id="ownerNotebookId"
    />
    <div v-else class="top-toolbar-container" aria-hidden="true">No Cell Selected here</div>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import NoCellSelectedToolbar from '@renderer/components/toolbars/NoCellSelectedToolbar.vue'
import TextCellToolbar from '@renderer/components/toolbars/TextCellToolbar.vue'
import PythonCellToolbar from '@renderer/components/toolbars/PythonCellToolbar.vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
// Store for cell selection state (selected cell type, etc.)
const selectionStore = useCellSelectionStore()
const workspaceStore = useWorkspaceStore()

// Mapping of cell types to their corresponding toolbar components
const toolbarComponents = {
  'text-cell': TextCellToolbar,
  'python-cell': PythonCellToolbar
  // future: markdown: MarkdownCellToolbar, etc.
} as const

const selectedCellId = computed(() => unref(selectionStore.selectedCellId))
const selectedCellKind = computed(() => unref(selectionStore.selectedCellKind))

// IMPORTANT Always read live state from the workspace
const selectedCell = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = selectedCellId.value
  return id ? (ws.cells[id] ?? null) : null
})

const selectedCellIsHidden = computed(() => !!selectedCell.value?.hidden)
const selectedCellIsSoftLocked = computed(() => !!selectedCell.value?.softLocked)
const selectedCellIsHardLocked = computed(() => !!selectedCell.value?.hardLocked)
const selectedCellIsFlagged = computed(() => !!selectedCell.value?.flagged)

// Computes which toolbar component to show based on the selected cell type
const currentToolbarComponent = computed(() => {
  const kind = selectionStore.selectedCellKind
  if (!kind) return NoCellSelectedToolbar
  return toolbarComponents[kind as keyof typeof toolbarComponents] || null
})

// Notebook id that owns the cells currently rendered by this list.
const ownerNotebookId = computed(() =>
  unref(workspaceStore.viewMode) === 'notebooks'
    ? unref(workspaceStore.currentNotebookId)
    : unref(workspaceStore.binSelectedNotebookId)
)
</script>
