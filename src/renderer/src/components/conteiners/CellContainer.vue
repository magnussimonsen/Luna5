<template>
  <div
    ref="rootEl"
    class="cell-container"
    :class="{
      'is-selected': selected,
      'is-in-bin': inBin,
      'is-locked': locked,
      'is-disabled': disabled,
      'is-hidden': hidden,
      'is-flagged': flagged
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
import { computed, ref, nextTick, toRefs } from 'vue'
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
  flagged?: boolean
}

const props = defineProps<Props>()
// Expose individual prop refs so template class bindings (selected, flagged, etc.) react correctly
const { selected, inBin, locked, disabled, hidden, flagged } = toRefs(props)

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
      // If the selection originated from a mouse click, avoid scrolling
      // the page (preserve current viewport). If selection was caused by
      // keyboard navigation or programmatic select (no MouseEvent), allow
      // the browser to scroll the editor into view so the caret stays visible.
      const preventScroll = e instanceof MouseEvent
      try {
        editor.focus({ preventScroll })
      } catch {
        try {
          // Fallback to default focus call if options unsupported
          editor.focus()
        } catch {
          /* ignore */
        }
      }
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
    nextTick(() => {
      try {
        rootEl.value?.focus()
      } catch {
        /* ignore */
      }
    })
  }
}
</script>

<style scoped>
.cell-container {
  position: relative;
  display: flex; /* row: .cell-margin + .cell-body */
  flex-direction: row;
  width: 100%;
  height: 100%;
  min-height: 0; /* allow inner scrollers to work */
  min-width: 0; /* prevent horizontal overflow from .cell-body */
  align-items: stretch; /* let .cell-body fill height */
  overflow: scroll; /* this container should not scroll */

  border: solid 1px var(--cell-margin-background-color); /* invisible border to avoid layout shift on selection */
  border-left: 0.5em solid var(--cell-border-color, blue);
  border-radius: var(--cell-container-border-radius, 0px);
  background: var(--cell-background, blue);

  outline: none;
}

.cell-container:focus-visible {
  border-left: solid 0.5em var(--focus-visible-border-color, blue);
}

.cell-container.is-selected {
  border: solid 1px var(--active-border-color);
  border-left: solid 0.5em var(--active-border-color);
  background: var(transparent, yellow);
}

/* When a cell is locked and selected, highlight with softLockedColor */
.cell-container.is-locked.is-selected {
  border-color: var(--soft-locked-border-color, orange);
  border: solid 1px var(--soft-locked-border-color, orange);
  border-left: 0.5em solid var(--soft-locked-border-color, blue); /* Keep left bar as-is */
}

/* When a cell is locked but NOT selected, tint top/right/bottom borders with locked color */
.cell-container.is-locked:not(.is-selected) {
  border-top: 1px solid var(--soft-locked-border-color, orange);
  border-right: 1px solid var(--soft-locked-border-color, orange);
  border-bottom: 1px solid var(--soft-locked-border-color, orange);
  /* Keep the existing left bar as-is */
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
  flex: 1 1 1em;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0em 0.25em 0em 0.1em /* top right bottom left */;
  gap: 0em;
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
  padding: 0em 0.25em;
  font-size: 0.75em;
  font-weight: 600;
  color: var(--text-color, #555);
  user-select: none;
}

/* Flagged state: highlight index background only */
.cell-container.is-flagged .cell-index {
  background: var(--flagged-cell-color, gold);
  padding: 0em 0.25em;
  border-radius: 0px;
}

.cell-body {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  width: 100%;

  padding: 0em 0em 0em 0em;
  gap: 0.5em;
  border: 1px blue solid;
}

.cell-hidden-placeholder {
  height: 1em;
  width: 100%;
  opacity: 1;
  border-radius: 0px;
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
}
</style>
