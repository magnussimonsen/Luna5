<template>
  <div
    class="workspace-container"
    :class="{
      'workspace-container--fluid': layoutMode === 'fluid',
      'workspace-container--a4': layoutMode === 'a4Preview'
    }"
  >
    <div class="workspace-scroll">
      <!-- Cell list slot / future cell renderer 
       (only way I got scrolling working was by adding this div)
       dont know why -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'

const menubarStore = useMenubarStore()
const { workspaceLayoutMode: layoutMode } = storeToRefs(menubarStore)
</script>

<style scoped>
.workspace-container {
  box-sizing: border-box;
  padding: 0;
  margin: 0 auto;
  height: 100%;
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  /* No scrolling here; delegate to inner wrapper to avoid flex overflow bugs? */
  overflow: hidden;
}

.workspace-scroll {
  flex: 1 1 auto;
  min-height: 0; /* critical for Chrome flex overflow */
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0rem 0.25rem 0.25rem 0.25rem; /* top right bottom left */
  box-sizing: border-box;
  /* Apply zoom to the content area; default to 1 (100%) */
  transform: scale(var(--workspace-zoom, 1));
  transform-origin: top left;
}

.workspace-container--fluid {
  background: var(--main-panel-background, #f0f0f0);
  max-width: 100%;
  width: 100%;
}

.workspace-container--a4 {
  /* A4 width in mm converted directly; let the browser handle it */
  width: 210mm;
  max-width: 210mm;
  min-height: 297mm;
  background: var(--color-surface-paper, #fff);
  border: 1px solid var(--color-border-light, #e0e0e0);
  position: relative;
}

/* Optional: nice background outside the page in preview mode (set on parent) */
:global(body.a4-preview-mode) {
  background: repeating-linear-gradient(45deg, #fafafa, #fafafa 10px, #f5f5f5 10px, #f5f5f5 20px);
}

/* Print adjustments (ensure full width when actually printing) */
@media print {
  .workspace-container--a4 {
    box-shadow: none;
    border: none;
    margin: 0;
    width: 100%;
    max-width: 100%;
  }
  body.a4-preview-mode {
    background: #fff !important;
  }
}
</style>
