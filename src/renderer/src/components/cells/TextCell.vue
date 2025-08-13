<template>
  <div class="text-cell-test">{{ cell.baseInputContent }}</div>
  <!-- Later: swap to a contenteditable/markdown editor; keep simple view for now -->
  <!-- Consider safe rendering if content includes markdown/HTML in future -->
</template>

<script setup lang="ts">
import type { TextCell } from '@renderer/types/notebook-cell-types'

// Accept the cell object as a prop
const { cell } = defineProps<{ cell: TextCell }>()
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
