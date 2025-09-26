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
    @blur="$emit('blur', cellId)"
  >
    <div
      class="cell-margin"
      :class="{
        'is-selected': selected,
        'is-in-bin': inBin,
        'is-locked': locked,
        'is-disabled': disabled,
        'is-hidden': hidden,
        'is-flagged': flagged
      }"
      @click.stop="onMarginClick"
    >
      <div class="cell-index" :title="`Cell ${displayIndex}`">{{ displayIndex }}</div>
    </div>
    <!-- Main cell content(cell-body div is deprecated) -->
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
  (e: 'moveUp', cellId: string): void
  (e: 'moveDown', cellId: string): void
  (e: 'delete', cellId: string): void
  (e: 'duplicate', cellId: string): void
  (e: 'toggleLock', cellId: string): void
  (e: 'requestFocusAbove', cellId: string): void
  (e: 'requestFocusBelow', cellId: string): void
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
      const preventScroll = e instanceof MouseEvent
      try {
        editor.focus({ preventScroll })
      } catch {
        try {
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
/* Jupyter-like notebook cell styling */
.cell-container {
  position: relative;
  display: flex; /* row: left gutter + content */
  flex-direction: row;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  box-sizing: border-box;

  /* Card look */
  background: var(--cell-background, #ffffff);
  border: 2px solid var(--cell-border-color, #e6e6e6);
  border-radius: 8px;
  margin-bottom: 2px;
  padding: 0; /* inner padding lives in .cell-content */
  overflow: hidden;
  outline: none;
}

.cell-container:focus-visible {
  outline: normal;
}

.cell-container.is-selected {
  border-color: var(--active-border-color, #2563eb);
}

.cell-container.is-in-bin {
  opacity: 0.95;
  border-style: dashed;
}

.cell-container.is-hidden {
  opacity: 0.8;
  filter: grayscale(0.06);
}

.cell-container.is-locked::after {
  content: '';
  position: absolute;
  inset: 0;
  border-color: var(--soft-locked-color, #2563eb);
  pointer-events: none;
  border-radius: 8px;
}

/* Left gutter (cell margin) */
.cell-margin {
  flex: 0 0 2.5em; /* fixed gutter */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0em 0em;
  box-sizing: border-box;
  cursor: pointer;
  background: var(--cell-margin-background-color, #f9fafb);
}

.cell-margin.is-selected {
  background: var(--active-border-color, #e0e7ff);
}

.cell-margin.is-locked {
  background: var(--soft-locked-color, #2563eb);
}

.cell-container.is-disabled .cell-margin {
  cursor: not-allowed;
}

.cell-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  font-size: 0.75em;
  font-weight: 600;
  color: var(--text-color, #374151);
  border-radius: 50%;
  margin-top: 0.4em;
  user-select: none;
}

.cell-container.is-flagged .cell-index {
  background: var(--flagged-cell-color, red);
  color: #fff;
}

.cell-hidden-placeholder {
  height: 1em;
  width: 100%;
  opacity: 1;
  border-radius: 4px;
}

.cell-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0.5em 0.5em;
  gap: 0em;
  min-width: 0;
  box-sizing: border-box;
  overflow: visible; /* outer scroller handles scrolling */
}

@media (max-width: 800px) {
  .cell-margin {
    flex: 0 0 3rem;
    padding: 0.5rem 0.4rem;
  }
  .cell-content {
    padding: 0.6rem 0.8rem;
  }
}
</style>
