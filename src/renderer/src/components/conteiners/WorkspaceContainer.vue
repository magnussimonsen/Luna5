<template>
  <div
    class="workspace-container"
    :class="{
      'workspace-container--fluid': layoutMode === 'fluid',
      'workspace-container--a4': layoutMode === 'a4Preview'
    }"
  >
    <div class="workspace-scroll">
      <slot />
    </div>
    <!-- Render the SidePanel only when layoutMode is 'fluid'.
         In 'a4Preview' mode, the SidePanel should appear as an overlay
         sliding in from the right, without affecting the workspace layout. -->
    <SidePanel v-if="layoutMode === 'fluid'" />
    <!-- <SidePanel v-if="layoutMode === 'a4Preview'" class="side-panel-overlay" />-->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import SidePanel from '@renderer/components/side_panel/SidePanel.vue'

const menubarStore = useMenubarStore()
const { workspaceLayoutMode: layoutMode } = storeToRefs(menubarStore)
</script>

<style scoped>
.workspace-container {
  padding: 0;
  margin: 0 auto;
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  /* No scrolling here; delegate to inner wrapper to avoid flex overflow bugs? */
  overflow: hidden;
}

.workspace-scroll {
  flex: 1 1 auto;
  min-height: 0; /* critical for Chrome flex overflow */
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0rem 0.25rem 0.25rem 0.25rem; /* top right bottom left */
  /* Apply zoom to the content area; default to 1 (100%) */
  transform: scale(var(--workspace-zoom, 1));
  transform-origin: top left;
}

.workspace-container--fluid {
  background: var(--main-panel-background, #f0f0f0);
  max-width: 100%;
  width: 100%;
}

/* A4: fixed page width, centered, never pushes the StatusBar */
.workspace-container--a4 {
  /* Keep the container flexible vertically inside the flex column parent */
  flex: 1 1 auto;
  /* Exact page width but responsive fallback on small screens */
  width: min(210mm, 100%);
  max-width: 210mm;
  margin: 0 auto;
  background: var(--color-surface-paper, #fff);
  border: 1px solid var(--color-border-light, #e0e0e0);
  position: relative; /* keeps any local abs children positioned correctly */
  /* Optional polish */
  box-shadow: 0 2px 16px rgba(0,0,0,.08);
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
