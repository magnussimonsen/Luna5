<script setup lang="ts">
const props = defineProps<{ onClick: () => void }>()
</script>

<template>
  <button class="close-btn" @click="props.onClick">Close</button>
</template>

<style scoped>
.close-btn {
  color: var(--button-off-color, #e45858);
  position: sticky;
  top: 0;
  float: right;
  z-index: 10;
  background: transparent;
  border: none;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  padding: 0em;
  border-radius: 4px;
  margin: 0em 0em 0em 0em; /* top, right, bottom, left */
}
.close-btn:hover {
  opacity: 0.8;
}
</style>
