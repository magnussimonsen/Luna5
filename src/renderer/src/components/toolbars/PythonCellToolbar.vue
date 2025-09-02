<template>
  <div class="python-cell-toolbar" role="toolbar" aria-label="Python cell toolbar">
    <button class="btn" type="button" title="Run (placeholder)">Run</button>
    <button class="btn" type="button" title="Reset (placeholder)">Reset</button>
  </div>
</template>

<script setup lang="ts">
// Placeholder only; no behavior yet.
</script>

<style scoped>
.python-cell-toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  background: var(--toolbar-bg, #f3f5f7);
  border-bottom: 1px solid var(--toolbar-border, #d0d7de);
}
.btn {
  appearance: none;
  border: 1px solid var(--border-color, #c7ccd1);
  background: var(--button-bg, #ffffff);
  color: var(--ui-text-color, #222);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover {
  background: var(--button-hover-bg, #eef2f6);
}
</style>
