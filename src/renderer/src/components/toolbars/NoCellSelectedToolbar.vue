<template>
  <div class="row-flex-wrap-base" role="toolbar" aria-label="No cell selected toolbar">
    <div class="row-flex-wrap-base-child util-transparent-border">
      <div class="top-toolbar__text">No cell selected</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * NoCellSelectedToolbar.vue
 * A placeholder toolbar displayed when no cell is selected.
 * Shows a simple message to indicate the current state.
 */
</script>

<style scoped>
/* Override global styles to ensure proper height matching with buttons */
.top-toolbar__text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--top-toolbar-button-height, 1em);
  padding: var(--top-toolbar-button-padding, 0.3em 0.6em);
  margin: 0em 2px;
  line-height: var(--toolbar-button-height, 1.3em);
  font-size: var(--top-toolbar-font-size);
  font-family: var(--ui-font);
  color: var(--text-color-secondary, #666);
  border: var(--top-toolbar-button-border, 2px solid transparent);
  border-radius: var(--top-toolbar-button-border-radius, min(4px, 0.5em));
  background: transparent;
  box-sizing: border-box;
}
</style>
