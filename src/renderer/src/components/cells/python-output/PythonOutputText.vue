<template>
  <div v-if="text && text.length" class="py-out-text">
    <div class="section-title">Output</div>
    <pre class="stdout" data-testid="python-stdout">{{ text }}</pre>
  </div>
  <div v-else class="py-out-text empty" aria-hidden="true"></div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<style scoped>
.py-out-text {
  margin-top: 0.5rem;
}
.section-title {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
}
.stdout {
  margin: 0;
  padding: 0.5rem 0.75rem;
  background: var(--code-bg, #0f172a0d);
  border: 1px solid var(--cell-border-color);
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--coding-font, monospace);
  font-size: var(--default-cells-font-size, 14px);
}
.empty {
  display: none;
}
</style>
