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
  <footer
    class="status-bar"
    :style="{
      fontFamily: fontStore.fonts.uiFont,
      fontSize: fontSizeStore.fontSizes.statusBarFontSize
    }"
  >
    <div class="status-section left">
      <span class="cell-type">{{ cellTypeLabel }}</span>
      <span class="divider">|</span>
      <span class="cell-state">{{ cellStateLabel }}</span>
      <span class="divider">|</span>
      <span class="file-path">/path/to/current/file.luna</span>
      <button class="save-btn">Save/Not Saved</button>
      <button class="autosave-btn">Autosave: Off</button>
    </div>
    <div class="status-section right">
      <label class="zoom-label" for="zoom-slider">Zoom slider:</label>
      <input id="zoom-slider" class="zoom-slider" type="range" min="25" max="200" value="100" />
      <button class="reset-zoom-btn">Reset zoom</button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const cellSelection = useCellSelectionStore()
const workspaceStore = useWorkspaceStore()

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
</script>

<style scoped>
.status-bar {
  position: relative;
  width: 100%;
  height: 2em;
  background: var(--menu-background, #222);
  color: var(--text-color, #fff);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2000;
  border: solid 1px var(--border-color, #444);
  padding: var(--status-bar-padding, 0em);
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
  color: var(--text-color, #fff);
}

.save-btn,
.autosave-btn,
.reset-zoom-btn {
  background: var(--reset-zoom-button-color, #949494);
  color: var(--ui-text-color, #fff);
  border: none;
  border-radius: var(--border-radius, 2px);
  padding: var(--status-bar-button-padding);
  /* top, right, bottom, left */
  cursor: pointer;
  font: inherit;
  margin: 0em 0em 0em 0em;
}

.save-btn {
  background-color: var(--button-hard-off-color, #f44336);
}

.autosave-btn {
  background-color: var(--button-hard-off-color, #f44336);
}

.save-btu:hover,
.autosave-btn:hover,
.reset-zoom-btn:hover {
  background: var(--button-hover-color, #afafaf);
}

.zoom-label {
  margin-right: 0em;
}

.zoom-slider {
  vertical-align: middle;
  margin: 0em 0em 0em 0em;
  width: 10em;
  height: 0.5em;
  appearance: none;
  -webkit-appearance: none;
  background: var(--slider-background, #cccccc);
  border-radius: var(--slider-border-radius, 5px);
  outline: none;
  cursor: pointer;
}

.file-path {
  font-size: 0.9em;
  opacity: 1;
}
</style>
