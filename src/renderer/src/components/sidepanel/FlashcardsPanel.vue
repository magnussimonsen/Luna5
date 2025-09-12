<template>
  <div class="flashcards-panel sidepanel-ui-base sidepanel-padding-margin-base">
    <h2>🚧 Work in progres</h2>
  <h3>Flashcards</h3>
    <p class="hint">This is a placeholder panel. Design and features to come.</p>
    <div class="actions">
      <button class="btn" disabled>New deck</button>
      <button class="btn" disabled>Import deck</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Placeholder only; wired via sidepanelStore as 'flashcards'
</script>

<style scoped>
@import '@renderer/css/sidepanel-base.css';
.flashcards-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.hint {
  margin: 0;
  opacity: 0.75;
  font-style: italic;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn {
  cursor: not-allowed;
  border: var(--border-thickness, 2px) solid var(--button-border-color, #ccc);
  background: var(--button-background-color, #fff);
  color: var(--text-color, #222);
  padding: 0 0.4rem;
  border-radius: 4px;
  line-height: 1.2;
  min-height: 1.6rem;
  font-weight: bold;
  font: inherit;
}
</style>
