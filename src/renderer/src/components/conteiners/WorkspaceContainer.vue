<template>
  <div class="workspace-wrapper">
    <div
      :class="{
        'workspace-container-fluid workspace-scroll': layoutMode === 'fluid',
        'workspace-container-a4 a4-preview-scroll': layoutMode === 'a4Preview'
      }"
    >
      <slot />
      <SidePanel v-if="layoutMode === 'fluid'" />
    </div>
    <SidePanel v-if="layoutMode === 'a4Preview'" class="side-panel-overlay" />
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
/* Wrapper to contain the workspace and side panel */
.workspace-wrapper {
  position: relative; /* for the side panel overlay */
  flex: 1 1 auto; /* take available space in parent flex column */
  background: var(--main-panel-background, #f0f0f0);
}

.workspace-container-fluid {
  flex: 1 1 auto;
  position: relative;
  display: flex;
  background: var(--main-panel-background, #f0f0f0);
  background: red;
  overflow: hidden;
}

.workspace-container--a4 {
  /* A4: fixed page width, centered, never pushes the StatusBar */
  /* Keep the container flexible vertically inside the flex column parent */
  flex: 1 1 auto;
  /* Exact page width but responsive fallback on small screens */
  width: min(210mm, 100%);
  max-width: 210mm;
  padding: var(--paper-margin-padding, 3em 2em 3em 3em);
  margin: 2em auto;
  background: var(--paper-color, #fff);
  border: 0px solid var(--paper-border-color, #e0e0e0);
  position: relative; /* keeps any local abs children positioned correctly */
  /* Optional polish */
  box-shadow: var(--paper-box-shadow, 0 8px 16px rgba(0, 0, 0, 1));
}

.workspace-scroll {
  flex: 1 1 auto;
  min-height: 0; /* critical for Chrome flex overflow */
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0rem 0.25rem 0.25rem 0.25rem; /* top right bottom left */
  border: 14px solid darkorchid /* debug */
}

.a4-preview-scroll {
overflow-y: auto;

}

/* The overlay: docked right, full container height, slides L->R */
.side-panel-overlay {
  position: absolute;
  inset-block: 0; /* top:0; bottom:0; */
  inset-inline-end: 0; /* right:0; (RTL-safe) */
  width: var(--sidepanel-width, 360px);
  max-width: 90vw;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: var(--side-panel-background, var(--debug-color, #fff));
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  overflow: auto; /* panel scrolls independently */
  overscroll-behavior: contain;
  pointer-events: auto;
}
/* .side-panel-overlay.is-open { transform: translateX(0); } */

/* remove transform from .workspace-container */
.workspace-zoom {
  transform: scale(var(--workspace-zoom, 1));
  transform-origin: top left;
  height: 100%;
}

.a4-preview-zoom {
  transform: scale(var(--workspace-zoom, 1));
  transform-origin: top left;
}

/* Border for A4 preview mode */
.workspace-container--a4 .workspace-zoom {
  border: 1px solid var(--paper-border-color, #ccc);
}

/* Border for fluid mode */
.workspace-container--fluid .workspace-zoom {
  border: 1px solid var(--main-panel-border-color, #ccc);
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
