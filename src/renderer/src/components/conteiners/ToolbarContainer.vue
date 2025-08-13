<template>
  <div class="toolbar-container">
    <component :is="currentToolbarComponent" v-if="currentToolbarComponent" />
    <div v-else class="toolbar-placeholder" aria-hidden="true">No cell selected</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import TextCellToolbar from '@renderer/components/toolbars/TextCellToolbar.vue'

const selectionStore = useCellSelectionStore()

const toolbarComponents = {
  'text-cell': TextCellToolbar
  // future: code: CodeCellToolbar, markdown: MarkdownCellToolbar, etc.
} as const

const currentToolbarComponent = computed(() => {
  const kind = selectionStore.selectedCellKind
  if (!kind) return null
  return toolbarComponents[kind as keyof typeof toolbarComponents] || null
})
</script>

<style scoped>
.toolbar-container {
  left: 0;
  width: 100vw;
  min-height: 2.5em;
  display: flex;
  align-items: center;
  background: var(--toolbar-background, #f4f4f4);
  color: var(--ui-text-color, #333);
  border-bottom: 1px solid var(--border-color, #ddd);
  box-sizing: border-box;
  padding: 0 1em;
  z-index: 2000;
  /* Lower than MenuBar dropdown (3000) */
  position: relative;
  /* Ensure z-index works correctly */
}

.toolbar-placeholder {
  opacity: 0.6;
  font-size: 0.75rem;
  padding: 0.3rem 0;
}
</style>
