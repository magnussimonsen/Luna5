<template>
  <div
    ref="rootEl"
    class="cell"
    :data-kind="kind"
    :data-selected="selected || null"
    :data-in-bin="inBin || null"
    :data-locked="locked || null"
    :data-disabled="disabled || null"
    :data-hidden="hidden || null"
    :data-flagged="flagged || null"
    role="group"
    :aria-label="ariaLabel"
    :aria-selected="selected ? 'true' : 'false'"
    tabindex="0"
    @click="onSelect($event)"
    @blur="$emit('blur', cellId)"
  >
    <div class="cell__gutter" :title="`Cell ${displayIndex}`" @click.stop="onMarginClick">
      <div class="cell__index">{{ displayIndex }}</div>
    </div>

    <div class="cell__content">
      <template v-if="!hidden">
        <slot />
      </template>
      <template v-else>
        <div
          class="cell__hidden-placeholder hidden-stripes-bg"
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
  emit('select', props.cellId)
  const target = (e?.target as HTMLElement | null) || null
  const primarySelector = '[data-primary-editor="true"]'
  const fallbackSelector = '[contenteditable="true"], input, textarea, [role="textbox"]'
  const detectionSelector = `${primarySelector}, ${fallbackSelector}, button, [role="button"], a[href], select, [tabindex]:not([tabindex="-1"])`
  const interactive = target?.closest(detectionSelector)
  if (interactive) return
  nextTick(() => {
    const contentRootEl = rootEl.value?.querySelector('.cell__content') as HTMLElement | null
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
          console.warn('Failed to focus cell editor')
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
        console.warn('Failed to focus cell container')
      }
    })
  }
}
</script>

<style scoped>
/* ===== Base cell ===== */
.cell {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  box-sizing: border-box;

  /* Card look */
  background: var(--cell-background, #fff);
  border: 2px solid var(--cell-border-color, #e6e6e6);
  border-radius: 6px;
  overflow: hidden;
  outline: none;
}

/* ===== States (attribute-driven) ===== */
.cell[data-selected] {
  border-color: var(--active-border-color, #2563eb);
}

.cell[data-in-bin] {
  opacity: 0.95;
  border-style: dashed;
}

.cell[data-locked]::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 6px;
  pointer-events: none;

}

.cell[data-disabled] {
  cursor: not-allowed;
  opacity: 0.8;
}

.cell[data-hidden] {
  opacity: 0.8;
}

/* ===== Gutter ===== */
.cell__gutter {
  flex: 0 0 1.5em; /* fixed gutter */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0em 0;
  box-sizing: border-box;
  cursor: pointer;
  background: var(--cell-margin-background-color, #f9fafb);
}

.cell[data-selected] .cell__gutter {
  background: var(--active-border-color, #eef2ff); /* light indigo */
}

.cell[data-locked] .cell__gutter {
  background: var(--soft-locked-color, #2563eb)
}

.cell[data-disabled] .cell__gutter {
  cursor: not-allowed;
}

/* Index badge */
.cell__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  font-size: 0.75em;
  color: var(--text-color, #374151);
  border-radius: 4px;
  margin-top: 0em;
  user-select: none;
}

.cell[data-flagged] .cell__index {
  background: var(--flagged-cell-color, #ef4444);
}

/* ===== Content ===== */
.cell__content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  gap: 0;
  min-width: 0;
  box-sizing: border-box;
  overflow: visible;
}

/* When hidden, collapse padding to make the placeholder tight */
.cell[data-hidden] .cell__content {
  justify-content: center;
  padding: 0;
}

/* Hidden placeholder */
.cell__hidden-placeholder {
  height: 100%;
  width: 100%;
  border-radius: 0px;
  
}
</style>
