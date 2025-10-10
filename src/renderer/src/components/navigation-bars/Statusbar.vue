<!-- Filepath: luna\src\renderer\src\components\StatusBar.vue
A statusbar located fixed at the bottom of the app, showing
- The current cell type (e.g., Text Cell, Python)
- if the current cell is hidden, locked or editable 
- the current file path and other information.
- A button for tuding on and off the autosave feature
- A slider for adjusting the zoom of the container that contains all the cells 
- A button to reset the zoom to default
For now only placeholders for the buttons and sliders are implemented.
-->

<template>
  <div class="status-bar-wrapper">
    <footer
      id="statusbar"
      class="status-bar"
      :style="{
        fontFamily: fontStore.fonts.uiFont,
        fontSize: fontSizeStore.fontSizes.statusbarFontSize
      }"
    >
      <div class="status-section left">
        <span class="cell-type">{{ cellTypeLabel }}</span>
        <span class="divider">|</span>
        <span class="cell-state">{{ cellStateLabel }}</span>
        <span class="divider">|</span>
        <span class="file-path">{{ filePathLabel }}</span>
        <button
          class="save-btn btn-status-bar"
          :style="saveBtnStyle"
          :title="saveBtnTitle"
          @click="handleSaveClick()"
        >
          {{ saveBtnLabel }}
        </button>
        <button
          class="autosave-btn btn-status-bar"
          :style="autosaveBtnStyle"
          :title="autosaveTooltip"
          @click="cycleAutosave()"
        >
          {{ autosaveLabel }}
        </button>
      </div>
      <div class="status-section right">
        <input
          id="font-size-slider"
          v-model.number="changeFontSizeIndex"
          class="zoom-slider"
          type="range"
          :min="0"
          :max="fontSizeOptions.length - 1"
          step="1"
        />
        <button
          type="button"
          class="reset-zoom-btn btn-status-bar"
          :style="resetFontSizeBtnStyle"
          @click="onResetBtnClick"
        >
          Font size <span class="fontsize-px-displayed-fixed">{{ displayedFontSize }}</span>
        </button>
        <input
          id="zoom-slider"
          v-model.number="zoomPercent"
          class="zoom-slider"
          type="range"
          min="25"
          max="200"
          step="5"
        />
        <button class="reset-zoom-btn btn-status-bar" :style="resetZoomBtnStyle" @click="resetZoom">
          <span class="zoom-percent-fixed">{{ zoomPercent }} %</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { saveOrSaveAs } from '@renderer/code/files/save-file'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useZoomStatesStore } from '@renderer/stores/UI/zoomStatesStore'
import type { AutosaveOption } from '@renderer/types/auto-save-options-types'

const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const cellSelection = useCellSelectionStore()
const workspaceStore = useWorkspaceStore()
const generalSettingsStore = useGeneralSettingsStore()
const zoomStore = useZoomStatesStore()

const cellTypeLabel = computed(() => {
  const kind = cellSelection.selectedCellKind as string | null
  switch (kind) {
    case 'text-cell':
      return 'Text Cell'
    case 'markdown-cell':
      return 'Markdown'
    case 'python-cell':
      return 'Python'
    case null:
    default:
      return 'No cell selected'
  }
})

const selectedCell = computed(() => {
  const id = cellSelection.selectedCellId as string | null
  const ws = workspaceStore.workspace
  if (!id || !ws) return null
  return ws.cells[id] || null
})

const cellStateLabel = computed(() => {
  const c = selectedCell.value as null | {
    hidden?: boolean
    softLocked?: boolean
    hardLocked?: boolean
    softDeleted?: boolean
    hardDeleted?: boolean
  }
  if (!c) return 'No cell selected'
  if (c.hidden) return 'Hidden'
  if (c.softLocked || c.hardLocked) return 'Locked'
  if (c.softDeleted || c.hardDeleted) return 'Deleted'
  return 'Editable'
})

// Save indicator (avoid flicker when autosave interval is 1)
const isSaved = computed(() => workspaceStore.isSaved)
const displayIsSaved = ref<boolean>(isSaved.value)

let flickerTimer: ReturnType<typeof setTimeout> | null = null

watch(
  [isSaved, () => generalSettingsStore.autosaveChangeIntervalGetter],
  ([saved, interval]) => {
    // When interval is 1, typing triggers autosave immediately. Debounce the switch to Not Saved
    // to avoid a brief flicker if a save turns it back to Saved right away.
    if (interval === 1 && !saved) {
      if (flickerTimer) clearTimeout(flickerTimer)
      flickerTimer = setTimeout(() => {
        displayIsSaved.value = false
        flickerTimer = null
      }, 200)
    } else {
      if (flickerTimer) {
        clearTimeout(flickerTimer)
        flickerTimer = null
      }
      displayIsSaved.value = saved
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (flickerTimer) clearTimeout(flickerTimer)
})

const saveBtnLabel = computed(() => (displayIsSaved.value ? 'Saved' : 'Not Saved'))
const saveBtnStyle = computed(() => ({
  // Drive base background via CSS var so :hover styles can override background
  '--sb-btn-bg': displayIsSaved.value
    ? 'var(--button-on-color, lightgreen)'
    : 'var(--button-hard-off-color, #f44336)'
}))
const saveBtnTitle = computed(() => 'Click to save')

async function handleSaveClick(): Promise<void> {
  await saveOrSaveAs()
}

// Current file path label
const filePathLabel = computed(() => workspaceStore.currentFilePath || 'Unsaved file')

// Autosave status from settings
const autosaveInterval = computed(() => generalSettingsStore.autosaveChangeIntervalGetter)
const autosaveEnabled = computed(() => autosaveInterval.value > 0)
const autosaveLabel = computed(() => {
  if (!autosaveEnabled.value) return 'Autosave: Off'
  const n = autosaveInterval.value
  const unit = n === 1 ? 'change' : 'changes'
  return `Autosave: ${n} ${unit}`
})
const autosaveBtnStyle = computed(() => ({
  '--sb-btn-bg': autosaveEnabled.value
    ? 'var(--button-on-color, lightgreen)'
    : 'var(--button-hard-off-color, #f44336)'
}))
const autosaveTooltip = computed(() =>
  autosaveEnabled.value
    ? `Saves after ${autosaveInterval.value} input ${
        autosaveInterval.value === 1 ? 'change' : 'changes'
      }`
    : 'Autosave is off — click to cycle (Off/1/5/10/15/25/50/100)'
)

// Click to cycle autosave options: Off -> 1 -> 5 -> 10 -> 15 -> 25 -> 50 -> 100 -> Off
function cycleAutosave(): void {
  const order: number[] = [0, 1, 5, 10, 15, 25, 50, 100]
  const current = autosaveInterval.value
  const idx = order.indexOf(current)
  const next = order[(idx + 1) % order.length]
  generalSettingsStore.setAutosaveChangeInterval(next as AutosaveOption)
}

// Font sizebindings
// const changeFontSizeForSelectedCellType = computed<number>({
//   get: () => 0,
//  set: () => {}
// })

// index into fontSizeOptions; slider controls this index
const changeFontSizeIndex = computed<number>({
  get: () => {
    const kind = cellSelection.selectedCellKind as string | null
    if (!kind) return 0
    let sizeStr: string | undefined
    if (kind === 'python-cell') sizeStr = fontSizeStore.fontSizes.codeEditorCellFontSize
    else if (kind === 'text-cell' || kind === 'text')
      sizeStr = fontSizeStore.fontSizes.textEditorCellFontSize
    else sizeStr = fontSizeStore.fontSizes.defaultCellFontSize
    const current = parseInt(sizeStr || fontSizeStore.fontSizes.defaultCellFontSize, 10)
    const idx = fontSizeOptions.findIndex((s) => s === current)
    return idx === -1 ? 0 : idx
  },
  set: (idx: number) => {
    const kind = cellSelection.selectedCellKind as string | null
    if (!kind) return
    const clamped = Math.max(0, Math.min(idx, fontSizeOptions.length - 1))
    const value = fontSizeOptions[clamped]
    try {
      fontSizeStore.setFontSizeForCellType(kind, `${value}px`)
    } catch (error) {
      console.warn('Error setting font size for cell type:', error)
    }
  }
})

const displayedFontSize = computed(() => {
  const idx = changeFontSizeIndex.value
  return fontSizeOptions[idx] ?? parseInt(fontSizeStore.fontSizes.defaultCellFontSize, 10)
})

function resetFontSizeForSelectedCellType(): void {
  // Reset the font size for the selected cell type to the configured default
  const kind = cellSelection.selectedCellKind as string | null
  if (!kind) return
  const defaultStr = fontSizeStore.fontSizes.defaultCellFontSize
  try {
    // set store value (store expects a string with px)
    fontSizeStore.setFontSizeForCellType(kind, defaultStr)
    // update slider index so the UI reflects the new value immediately
    try {
      const targetNum = parseInt(defaultStr, 10)
      const idx = fontSizeOptions.findIndex((s) => s === targetNum)
      changeFontSizeIndex.value = idx === -1 ? 0 : idx
    } catch {
      // if reactive assignment fails, ignore — store change will eventually update computed
    }
    console.log('resetFontSizeForSelectedCellType: set to', defaultStr, { kind })
  } catch (err) {
    console.warn('resetFontSizeForSelectedCellType error', err)
  }
}

function onResetBtnClick(): void {
  console.log('onResetBtnClick fired')
  resetFontSizeForSelectedCellType()
}

// Zoom bindings
const zoomPercent = computed<number>({
  get: () => zoomStore.zoomPercent,
  set: (val: number) => zoomStore.setZoomPercent(val)
})
function resetZoom(): void {
  zoomStore.resetZoom()
}

// Reset-zoom button color: Center vs OffCenter
const isZoomCentered = computed(() => zoomStore.zoomPercent === 100)
const resetZoomBtnStyle = computed(() => ({
  '--sb-btn-bg': isZoomCentered.value
    ? 'var(--reset-zoom-button-color-Center, var(--debug-color, lightgreen))'
    : 'var(--reset-zoom-button-color-OffCenter, var(--debug-color, lightcoral))'
}))

// Reset-font-size button color: green when selected cell font size equals the configured default
const isFontSizeDefault = computed(() => {
  const kind = cellSelection.selectedCellKind as string | null
  if (!kind) return false
  let sizeStr: string | undefined
  if (kind === 'python-cell') sizeStr = fontSizeStore.fontSizes.codeEditorCellFontSize
  else if (kind === 'text-cell' || kind === 'text')
    sizeStr = fontSizeStore.fontSizes.textEditorCellFontSize
  else sizeStr = fontSizeStore.fontSizes.defaultCellFontSize
  const current = parseInt(sizeStr || fontSizeStore.fontSizes.defaultCellFontSize, 10)
  const def = parseInt(fontSizeStore.fontSizes.defaultCellFontSize, 10)
  return current === def
})

const resetFontSizeBtnStyle = computed(() => ({
  '--sb-btn-bg': isFontSizeDefault.value
    ? 'var(--reset-zoom-button-color-Center, var(--debug-color, lightgreen))'
    : 'var(--reset-zoom-button-color-OffCenter, var(--debug-color, lightcoral))'
}))
</script>

<style scoped>
/* Implement classes from button-row-flex-wrap-base.css */
.status-bar-wrapper {
  height: fit-content;
  width: 100%;
  /* Removed position: fixed and z-index so StatusBar is part of flex layout */
}
.status-bar {
  position: relative;
  width: 100%;
  height: var(--status-bar-height, 2.5em);
  background: var(--menu-background, var(--debug-color, #222));
  color: var(--text-color, var(--debug-color, #fff));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2000;
  border: solid 1px var(--border-color, var(--debug-color, #444));
  margin-top: var(--statusbar-top-margin, 0.3em);
  padding: var(--statusbar-padding, 0em);
  /* top, right, bottom, left */
  box-sizing: border-box;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.status-section.left {
  flex: 1 1 0;
}

.status-section.right {
  gap: 0.5em;
  flex: 0 0 1;
}

.divider {
  opacity: 0.5;
}

.cell-type,
.cell-state {
  font-weight: normal;
  color: var(--text-color, var(--debug-color, #fff));
}

/* Base statusbar button style (local base; do not import toolbar base here) */
.btn-status-bar {
  border: var(--status-bar-button-border);
  /* Base bg uses a CSS var so hover can override background without fighting inline styles */
  background: var(--sb-btn-bg, var(--button-background-color, var(--debug-color, transparent)));
  color: var(--ui-text-color, var(--debug-color, #222));
  padding: var(--status-bar-button-padding, 0.1em 0.4em 0.1em 0.4em);
  border-radius: var(--status-bar-button-radius, 2px);
  font: inherit; /* inherit reactive ui font + size from footer */
  cursor: pointer;
  border-radius: var(--button-border-radius, 0.25em);
}

.btn-status-bar:hover {
  background: var(--button-hover-color, var(--debug-color, #e6f0ff));
  /* Keep border width constant (avoid visual shrink) */
  border-color: var(--button-border-hover-color, var(--debug-color, #2563eb));
}
.btn-status-bar:active {
  transform: scale(1);
}
.btn-status-bar:focus-visible {
  outline: normal;
}
.btn-status-bar:disabled {
  opacity: 1;
  transform: scale(1);
  cursor: not-allowed;
}

/* Status bar button styles extend local base .btn; minimal overrides only */

.save-btn,
.autosave-btn,
.reset-zoom-btn {
  color: var(--ui-text-color, var(--debug-color, #fff));
  margin: 0;
}

.reset-zoom-btn {
  /* Set base background via var to play nicely with :hover */
  --sb-btn-bg: var(--reset-zoom-button-color-OffCenter, var(--debug-color, #949494));
}

/* Save/Autosave fallback base background (in case inline var isn't set yet) */
.save-btn,
.autosave-btn {
  --sb-btn-bg: var(--button-hard-off-color, var(--debug-color, #f44336));
}

/* Hover color handled by .btn-status-bar:hover above */

.zoom-label {
  margin-right: 0em;
}

.zoom-slider {
  vertical-align: middle;
  margin: 0em 0em 0em 0em;
  width: 6em; /* simpler smaller width */
  height: 0.35em; /* slimmer track */
  appearance: none;
  background: var(--slider-background, var(--debug-color, #cccccc));
  border-radius: var(--slider-border-radius, 5px);
  outline: none;
  cursor: pointer;
}

.file-path {
  font-size: 0.9em;
  opacity: 1;
}

/* Fixed-width zoom percentage (digits + % sign) always reserve 4 character cells */
.zoom-percent-fixed {
  display: inline-block;
  width: 5ch;
  text-align: right; /* Align shorter values (e.g., 25%) to the right for consistency */
  font-variant-numeric: tabular-nums; /* Use tabular numbers if supported for consistent digit width */
  white-space: nowrap; /* Prevent wrapping */
}

/* Fixed-width font size (px value). Reserve 4 character cells (e.g., '100' + space). */
.fontsize-px-displayed-fixed {
  display: inline-block;
  width: 2ch; /* Supports up to 3 digits comfortably */
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
