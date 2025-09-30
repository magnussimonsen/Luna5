<template>
  <div v-if="text && text.length" class="py-out-text">
    <div class="section-title"></div>
    <pre class="stdout" data-testid="python-stdout">{{ text }}</pre>
  </div>
  <div v-else class="py-out-text empty" aria-hidden="true"></div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<style scoped>
.py-out-text {
  margin-top: 0rem;
}
.section-title {
  font-size: 0.8rem;
  padding-left: 0.75rem;
  background: var(--python-stdout-background, transparent);
  font-family: var(--coding-font, monospace);
  font-size: var(--code-editor-cells-font-size, 12px);
}
.stdout {
  margin: 0;
  padding: 0.25rem 0.75rem;
  background: var(--python-stdout-background, transparent);
  border: 1px solid transparent;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--coding-font, monospace);
  font-size: var(--code-editor-cells-font-size, 12px);
}
.empty {
  display: none;
}
</style>
