<template>
  <div
    ref="elRef"
    class="text-cell-input"
    :contenteditable="!isLocked"
    data-primary-editor="true"
    :data-locked="isLocked ? 'true' : null"
    :data-empty="!localText ? 'true' : null"
    :data-placeholder="placeholderText"
    role="textbox"
    aria-multiline="true"
    :aria-placeholder="placeholderText"
    @input="onInput"
    @blur="onBlur"
  ></div>
  <!-- Note: using contenteditable with plain text via innerText; no HTML rendering. -->
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { TextCell } from '@renderer/types/notebook-cell-types'

// Accept the cell object as a pro
const { cell } = defineProps<{ cell: TextCell }>()

const workspaceStore = useWorkspaceStore()
const elRef = ref<HTMLDivElement | null>(null)
const placeholderText =
  'This is a simple text cell. A proper text editor will be implemented in the future.'

const isLocked = computed<boolean>(
  () => !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
)

// Keep a simple local mirror to avoid cursor jumps when external updates occur
const localText = ref<string>(cell.cellInputContent ?? '')

// Sync prop -> DOM on mount and when external changes happen
onMounted(() => {
  if (elRef.value) elRef.value.innerText = localText.value
})
watch(
  () => cell.cellInputContent,
  (next) => {
    const value = next ?? ''
    if (value !== localText.value) {
      localText.value = value
      if (elRef.value && elRef.value.innerText !== value) {
        elRef.value.innerText = value
      }
    }
  }
)

function commit(value: string): void {
  // Store in canonical workspace state (no-op if locked/deleted)
  workspaceStore.setCellInputContent(cell.id, value)
}

function onInput(e: Event): void {
  const target = e.target as HTMLDivElement
  const value = target.innerText
  localText.value = value
  commit(value)
}

function onBlur(): void {
  commit(localText.value)
}
</script>

<style scoped>
.text-cell-input {
  font-size: 0.9rem;
  line-height: 1.4;
  font-family: var(--content-font, inherit);
  color: var(--text-color, #222);
  white-space: pre-wrap;
  outline: none;
  min-height: 1.5rem;
  border: 1px solid var(--cell-border-color); /* FOR DEV OUTLINE OF DIV ONLY */
  position: relative; /* for placeholder positioning */
}
.text-cell-input[data-locked='true'] {
  cursor: not-allowed;
  opacity: 0.8;
  filter: grayscale(0.2);
}

/* Placeholder shown only when empty */
.text-cell-input[data-empty='true']::before {
  content: attr(data-placeholder);
  color: var(--placeholder-color, #888);
  pointer-events: none;
  position: absolute;
  top: 0.15rem;
  left: 0.25rem;
  right: 0.25rem;
  white-space: pre-wrap;
  opacity: 0.8;
}
</style>
