<template>
  <div class="toolbar-container">
    <!-- Placeholder for the cell-specific toolbar component -->
    Toolbar
    <component :is="currentToolbarComponent" v-if="currentToolbarComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// Import your toolbar components here, e.g. CodeCellToolbar, MarkdownCellToolbar, etc.
// import CodeCellToolbar from './toolbars/CodeCellToolbar.vue'
// import MarkdownCellToolbar from './toolbars/MarkdownCellToolbar.vue'

// Example mapping (replace with your actual logic)
const toolbarComponents = {
  // code: CodeCellToolbar,
  // markdown: MarkdownCellToolbar,
} as const

// Replace this with your actual logic for determining the current toolbar
const currentToolbarType: string | null = null // e.g. 'code', 'markdown', etc.
const currentToolbarComponent = computed(() => {
  if (!currentToolbarType) return null
  return toolbarComponents[currentToolbarType as keyof typeof toolbarComponents] || null
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
</style>
