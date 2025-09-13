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
    <component :is="currentToolbarComponent" v-if="currentToolbarComponent" />
    <div v-else class="top-toolbar-placeholder" aria-hidden="true">No cell selected</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import TextCellToolbar from '@renderer/components/toolbars/TextCellToolbar.vue'
import PythonCellToolbar from '@renderer/components/toolbars/PythonCellToolbar.vue'

// Store for cell selection state (selected cell type, etc.)
const selectionStore = useCellSelectionStore()

// Mapping of cell types to their corresponding toolbar components
const toolbarComponents = {
  'text-cell': TextCellToolbar,
  'python-cell': PythonCellToolbar
  // future: markdown: MarkdownCellToolbar, etc.
} as const

// Computes which toolbar component to show based on the selected cell type
const currentToolbarComponent = computed(() => {
  const kind = selectionStore.selectedCellKind
  if (!kind) return null // No cell selected
  return toolbarComponents[kind as keyof typeof toolbarComponents] || null
})
</script>
