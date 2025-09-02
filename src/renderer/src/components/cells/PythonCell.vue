<template>
  <div
    class="python-cell-placeholder"
    data-primary-editor="true"
    role="textbox"
    aria-readonly="true"
    tabindex="0"
  >
    Python cell placeholder. Real editor (Monaco or Codemirror) will replace this.
  </div>
  <!-- Placeholder only; real editor/runner will replace this. -->
</template>

<script setup lang="ts">
import type { PythonCell } from '@renderer/types/notebook-cell-types'

defineProps<{ cell: PythonCell }>()
</script>

<style scoped>
.python-cell-placeholder {
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: var(--content-font, inherit);
  color: var(--text-color, #222);
  min-height: 1.5rem;
  border: 1px dashed var(--cell-border-color);
  padding: 0.25rem 0.4rem;
  user-select: none;
}
</style>
