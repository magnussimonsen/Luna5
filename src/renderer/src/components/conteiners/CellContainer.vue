<template>
  <div
    ref="rootEl"
    class="cell-container"
    :class="{
      'is-selected': selected,
      'is-locked': locked,
      'is-disabled': disabled
    }"
    :data-kind="kind"
    role="group"
    :aria-label="ariaLabel"
    :aria-selected="selected ? 'true' : 'false'"
    tabindex="0"
    @click="onSelect"
    @keydown="onKeyDown"
    @blur="emit('blur', cellId)"
  >
    <div class="cell-margin">
      <div class="cell-index" :title="`Cell ${displayIndex}`">{{ displayIndex }}</div>
    </div>
    <div class="cell-body">
      <!-- 
      Optional top tools slot (e.g., toolbar) 
      <div v-if="$slots.tools" class="cell-tools"><slot name="tools" /></div>
      -->
      <!-- Main cell content -->
      <div class="cell-content">
        <slot />
      </div>
      <!-- 
      Optional status/footer slot 
      <div v-if="$slots.status" class="cell-status"><slot name="status" /></div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
const rootEl = ref<HTMLElement | null>(null)

interface Props {
  index: number
  cellId: string
  kind: string
  selected?: boolean
  locked?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', cellId: string): void
  (e: 'focus', cellId: string): void
  (e: 'blur', cellId: string): void
  (e: 'moveUp', cellId: string): void // Dont need this. Movement of cells is handled by buttons in menubar-component
  (e: 'moveDown', cellId: string): void // Dont need this. Movement of cells is handled by buttons in menubar-component
  (e: 'delete', cellId: string): void // Dont need this. This is handled by buttons in menubar-component
  (e: 'duplicate', cellId: string): void // Dont need this. This is handled by buttons in menubar-component
  (e: 'toggleLock', cellId: string): void // Dont need this. This is handled by buttons in menubar-component
  (e: 'requestFocusAbove', cellId: string): void // Dont need this. This is handled by buttons in menubar-component
  (e: 'requestFocusBelow', cellId: string): void // Dont need this. This is handled by buttons in menubar-component
}>()

const displayIndex = computed(() => props.index + 1)

const ariaLabel = computed(
  () => `Cell ${displayIndex.value}, type ${props.kind}${props.locked ? ' (locked)' : ''}`
)

function onSelect(): void {
  if (!props.disabled) {
    emit('select', props.cellId)
    // ensure focus for keyboard navigation + visible outline
    nextTick(() => rootEl.value?.focus())
  }
}
// Should be handled by buttons in menubar-component
function onKeyDown(e: KeyboardEvent): void {
  if (e.defaultPrevented) return
  switch (e.key) {
    case 'ArrowUp':
    case 'PageUp':
      emit('requestFocusAbove', props.cellId)
      e.preventDefault()
      break
    case 'ArrowDown':
    case 'PageDown':
      emit('requestFocusBelow', props.cellId)
      e.preventDefault()
      break
    case 'Delete':
      emit('delete', props.cellId)
      e.preventDefault()
      break
    case 'd':
      if (e.ctrlKey || e.metaKey) {
        emit('duplicate', props.cellId)
        e.preventDefault()
      }
      break
  }
}
</script>

<style scoped>
.cell-container {
  display: flex;
  width: 100%;
  border: 2px solid var(--cell-border-color);
  border-radius: var(--border-radius, 4px);
  background: var(--cell-background);
  margin-block: 0.2rem;
  position: relative;
  outline: none;
}

.cell-container:focus-visible {
  border: solid 2px var(--focus-visible-border-color, blue);
}

.cell-container.is-selected {
  border-color: var(--active-border-color);
  border: solid 2px var(--active-border-color);
  background: var(transparent, yellow);
}

/* Left bar removed for simpler visual; reintroduce if stronger affordance needed */

.cell-container {
  cursor: default;
}
.cell-container.is-selected {
  cursor: default;
}

.cell-container.is-locked::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--cell-locked-overlay);
  pointer-events: none;
  border-radius: inherit;
}

.cell-margin {
  flex: 0 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 0.2rem 0.2rem;
  gap: 0rem;
  background: var(--cell-margin-bg, lightgray);
  border-right: 1px solid var(--cell-border-color);
}

.cell-index {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-color, #555);
  user-select: none;
}

.cell-margin-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cell-btn {
  cursor: pointer;
  appearance: none;
  border: 1px solid var(--cell-border-color);
  background: #fff;
  padding: 0.15rem 0.35rem;
  font-size: 0.6rem;
  line-height: 1;
  border-radius: 4px;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}

.cell-btn:hover:not(:disabled) {
  background: var(--cell-selected-border);
  color: #fff;
  border-color: var(--cell-selected-border);
}

.cell-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cell-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0.75rem 0.9rem 0.9rem;
  gap: 0.5rem;
}

.cell-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--cell-tools-color, #555);
}

.cell-content {
  position: relative;
  display: block;
  overflow: hidden;
}

.cell-status {
  font-size: 0.65rem;
  color: var(--cell-status-color, #666);
  opacity: 0.85;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Responsive tweaks */
@media (max-width: 800px) {
  .cell-margin {
    flex-basis: 2.6rem;
  }
  .cell-container {
    margin-block: 0.6rem;
  }
}
</style>
