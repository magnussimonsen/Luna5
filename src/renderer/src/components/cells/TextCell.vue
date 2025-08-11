<template>
  <div class="text-cell-test">text cell component test</div>
</template>

<script setup lang="ts">
// Placeholder component for a text cell; will later accept props & editing.
</script>

<style scoped>
.text-cell-test {
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: var(--content-font, inherit);
  color: var(--text-color, #222);
  background-color: red;
  white-space: pre-wrap;
}
</style>
