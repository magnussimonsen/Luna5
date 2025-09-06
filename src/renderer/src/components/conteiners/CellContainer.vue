<template>
  <div
    ref="rootEl"
    class="cell-container"
    :class="{
      'is-selected': selected,
      'is-in-bin': inBin,
      'is-locked': locked,
      'is-disabled': disabled,
      'is-hidden': hidden
    }"
    :data-kind="kind"
    role="group"
    :aria-label="ariaLabel"
    :aria-selected="selected ? 'true' : 'false'"
    tabindex="0"
    @click="onSelect($event)"
    @blur="emit('blur', cellId)"
  >
    <div class="cell-margin" @click.stop="onMarginClick">
      <div class="cell-index" :title="`Cell ${displayIndex}`">{{ displayIndex }}</div>
    </div>
    <div class="cell-body">
      <!-- 
      Optional top tools slot (e.g., toolbar) 
      <div v-if="$slots.tools" class="cell-tools"><slot name="tools" /></div>
      -->
      <!-- Main cell content -->
      <div class="cell-content">
        <template v-if="!hidden">
          <slot />
        </template>
        <template v-else>
          <div
            class="cell-hidden-placeholder hidden-stripes-bg"
            aria-label="Hidden cell placeholder"
          ></div>
        </template>
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
  inBin?: boolean
  locked?: boolean
  disabled?: boolean
  hidden?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', cellId: string): void
  (e: 'deselect'): void
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

function onSelect(e?: MouseEvent): void {
  if (props.disabled) return
  // Always mark as selected
  emit('select', props.cellId)
  // If the click originated inside an interactive/editable element, don't steal focus
  const target = (e?.target as HTMLElement | null) || null
  // Prefer an explicit primary editor marker, then fall back to generic editors
  const primarySelector = '[data-primary-editor="true"]'
  const fallbackSelector = '[contenteditable="true"], input, textarea, [role="textbox"]'
  // Expand interactive detection so clicks on controls don't get overridden by container focus
  const detectionSelector = `${primarySelector}, ${fallbackSelector}, button, [role="button"], a[href], select, [tabindex]:not([tabindex="-1"])`
  const interactive = target?.closest(detectionSelector)
  if (interactive) return
  // Otherwise, try to focus the first inner editor; fallback to container for keyboard nav
  nextTick(() => {
    const contentRootEl = rootEl.value?.querySelector('.cell-content') as HTMLElement | null
    const contentRoot = contentRootEl || rootEl.value
    const editor =
      (contentRoot?.querySelector(primarySelector) as HTMLElement | null) ||
      (contentRoot?.querySelector(fallbackSelector) as HTMLElement | null)
    if (editor) {
      editor.focus({ preventScroll: true })
    } else {
      rootEl.value?.focus()
    }
  })
}

function onMarginClick(): void {
  // Click in the margin toggles selection: deselect if selected, otherwise select this cell
  if (props.disabled) return
  if (props.selected) {
    emit('deselect')
  } else {
    emit('select', props.cellId)
    nextTick(() => rootEl.value?.focus())
  }
}
</script>

<style scoped>
.cell-container {
  display: flex;
  width: 100%;
  border: solid 1px var(--cell-margin-background-color); /* invisible border to avoid layout shift on selection */
  border-left: 0.5rem solid var(--cell-border-color, blue); /* THIS DO NOT DO ANYTHING VISIBLE ANYMORE */
  border-radius: var(--cell-container-border-radius, 0px);
  background: var(--cell-background, blue);
  margin-block: 0rem;
  position: relative;
  outline: none;
}

.cell-container:focus-visible {
  border-left: solid 0.5rem var(--focus-visible-border-color, blue);
}

.cell-container.is-selected {
  border: solid 1px var(--active-border-color);
  border-left: solid 0.5rem var(--active-border-color);
  background: var(transparent, yellow);
}

/* When a cell is locked and selected, highlight with softLockedColor */
.cell-container.is-locked.is-selected {
  border-color: var(--soft-locked-border-color, orange);
  border: solid 1px var(--soft-locked-border-color, orange);
  border-left: 0.5rem solid var(--soft-locked-border-color, blue); /* THIS DO NOT DO ANYTHING VISIBLE ANYMORE */
}

/* Bin view styling */
.cell-container.is-in-bin {
  border-style: dashed;
  opacity: 0.9;
}
.cell-container.is-in-bin.is-selected {
  opacity: 1;
  border-color: var(--active-border-color);
  background: var(--active-background-color, rgba(37, 99, 235, 0.08));
}

.cell-container.is-hidden {
  background: var(--hide-cell-color, cyan);
}
.cell-container.is-hidden .cell-body {
  padding: 0;
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
  background: var(--cell-locked-overlay, rgba(0, 0, 0, 0.06));
  pointer-events: none;
  border-radius: 0px;
}

.cell-margin {
  flex: 0 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem 0.1em 0em 0.1em /* top right bottom left */;
  gap: 0rem;
  background: var(--cell-margin-background-color, black);
  border-right: 0px solid var(--cell-border-color);
  cursor: pointer;
}

/* Subtle affordance on hover; disabled state shows not-allowed */
.cell-container.is-disabled .cell-margin {
  cursor: not-allowed;
}

.cell-margin:hover {
  border-right-color: var(--active-border-color);
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
  border-radius: 0px;
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
  /*padding: 0.75rem 0.9rem 0.9rem;*/
  padding: 0rem 0rem 0rem 0rem;
  gap: 0.5rem;
}

.cell-hidden-placeholder {
  height: 1em;
  width: 100%;
  opacity: 1;
  border-radius: 0px;
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
