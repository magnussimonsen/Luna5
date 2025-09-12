<template>
  <div class="toolbar-container">
    <component :is="currentToolbarComponent" v-if="currentToolbarComponent" />
    <div v-else class="toolbar-placeholder" aria-hidden="true">No cell selected</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import TextCellToolbar from '@renderer/components/toolbars/TextCellToolbar.vue'
import PythonCellToolbar from '@renderer/components/toolbars/PythonCellToolbar.vue'

const selectionStore = useCellSelectionStore()

const toolbarComponents = {
  'text-cell': TextCellToolbar,
  'python-cell': PythonCellToolbar
  // future: markdown: MarkdownCellToolbar, etc.
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
  height: calc(
    var(--menu-bar-height, 1.2em) + var(--toolbar-height, 2.5em) - 0 *
      var(--toolbar-border-width, 1px)
  ); /* start below top bars */
  display: flex;
  align-items: center;
  background: var(--toolbar-background, #f4f4f4);
  color: var(--ui-text-color, #333);
  /* UI font family from font store */
  font-family: var(--ui-font);
  /* Toolbar font size from font store */
  font-size: var(--toolbar-font-size);
  box-sizing: border-box;
  padding: var(--toolbar-container-padding, 0.2rem 0.5rem);
  z-index: var(--toolbar-z-index, 2000);
  /* Lower than MenuBar dropdown (3000) */
  position: relative;
  /* Ensure z-index works correctly */
  margin-bottom: 5px; /* Space below toolbar */
}

.toolbar-placeholder {
  opacity: 0.6;
  font-size: 1em;
  padding: 0.3em 0;
}
</style>
