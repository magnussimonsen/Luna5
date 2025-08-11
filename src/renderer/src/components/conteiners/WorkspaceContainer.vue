<template>
  <div
    class="workspace-container"
    :class="{
      'workspace-container--fluid': layoutMode === 'fluid',
      'workspace-container--a4': layoutMode === 'a4Preview'
    }"
  >
    <!-- Cell list slot / future cell renderer -->
    <slot />
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
  padding: 1rem 1.25rem;
  transition:
    max-width 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
  margin: 0 auto;
  /* Shared typography scaling could go here */
}

.workspace-container--fluid {
  max-width: 100%;
  width: 100%;
}

.workspace-container--a4 {
  /* A4 width in mm converted directly; let the browser handle it */
  width: 210mm;
  max-width: 210mm;
  min-height: 297mm;
  background: var(--color-surface-paper, #fff);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.12),
    0 6px 18px rgba(0, 0, 0, 0.08);
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
