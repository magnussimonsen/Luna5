<template>
  <nav
    class="menu-bar"
    :style="{
      fontFamily: fontStore.fonts.uiFont || 'Arial, sans-serif',
      fontSize: fontSizeStore.fontSizes.menuBarFontSize || '1em'
    }"
  >
    <!-- App brand icon -->
    <img
      :src="LunaSmallIcon"
      alt="Luna"
      class="brand-icon"
      title="About Luna"
      tabindex="0"
      @click.stop="handleAboutLuna"
      @keydown.enter.stop.prevent="handleAboutLuna"
      @keydown.space.stop.prevent="handleAboutLuna"
    />
    <DropdownMenu label="File">
      <div class="dropdown-menu-item" @click="handleNewFile">
        New File <span class="shortcut-not-implemented">Ctrl + n</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleOpenFile">
        Open File <span class="shortcut-not-implemented">Ctrl + o</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleSaveFile">
        Save File <span class="shortcut-not-implemented">Ctrl + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleSaveFileAs">
        Save File As <span class="shortcut-not-implemented">Ctrl + Shift + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleSavePDFForSubmission">
        <strong>Save PDF For Submission</strong>
        <span class="shortcut-not-implemented">Ctrl + Alt + s</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleSettings">
        Settings <span class="shortcut-not-implemented">Alt + Shift + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleAboutLuna">
        About Luna <span class="shortcut-not-implemented"></span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleQuitLuna">
        Quit Luna <span class="shortcut-not-implemented">Ctrl + Shift + Q</span>
        <ImplementedMark :implemented="true" />
      </div>
    </DropdownMenu>
    <DropdownMenu label="Edit">
      <div class="dropdown-menu-item" @click="handleMoveCellUp">
        Move cell up <span class="shortcut-not-implemented">Ctrl + Shift + Up</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveCellDown">
        Move cell down <span class="shortcut-not-implemented">Ctrl + Shift + Down</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveFocusToCellAbove">
        Move focus to cell above <span class="shortcut-not-implemented">Ctrl + Up</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveFocusToCellBelow">
        Move focus to cell below <span class="shortcut-not-implemented">Ctrl + Down</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleUndo">
        Undo
        <span class="shortcut-not-implemented">Ctrl + z</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleRedo">
        Redo
        <span class="shortcut-not-implemented">Ctrl + y</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleCut">
        Cut
        <span class="shortcut-not-implemented">Ctrl + x</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleCopy">
        Copy
        <span class="shortcut-not-implemented">Ctrl + c</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handlePaste">
        Paste
        <span class="shortcut-not-implemented">Ctrl + v</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleFind">
        Find
        <span class="shortcut-not-implemented">Ctrl + f</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleReplace">
        Replace
        <span class="shortcut-not-implemented">Ctrl + h</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div
        class="dropdown-menu-item"
        :class="{
          disabled: isSelectedCellLocked || isSelectedCellHidden,
          'cell-is-locked-menubar-option': isSelectedCellLocked,
          'cell-is-hidden-menubar-option': isSelectedCellHidden,
          'hidden-stripes-bg': isSelectedCellHidden
        }"
        :aria-disabled="isSelectedCellLocked || isSelectedCellHidden ? 'true' : undefined"
        @click="handleMoveCellToBin"
      >
        Move cell to Bin
        <span class="shortcut-not-implemented">Ctrl + 0</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveNotebookToBin">
        Move notebook to Bin
        <span class="shortcut-not-implemented">Ctrl + Shift + 0</span>
        <ImplementedMark :implemented="true" />
      </div>
    </DropdownMenu>
    <DropdownMenu ref="insertMenu" label="Insert">
      <div class="dropdown-menu-item" @click="handleInsertTextCell">
        Insert Text Cell <span class="shortcut-not-implemented">Ctrl + 1</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item">
        Insert Graphical Calculator Cell <span class="shortcut-not-implemented">Ctrl + 2</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert CAS (Computer Algebra System) Cell
        <span class="shortcut-not-implemented">Ctrl + 3</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Geometry Cell <span class="shortcut-not-implemented">Ctrl + 4</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Spreadsheet Cell <span class="shortcut-not-implemented">Ctrl + 5</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Probability Calculator Cell <span class="shortcut-not-implemented">Ctrl + 6</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleInsertPythonCell">
        Insert Python Cell <span class="shortcut-not-implemented">Ctrl + 7</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item">
        Insert Markdown Cell <span class="shortcut-not-implemented">Ctrl + 8</span>
        <ImplementedMark :implemented="false" />
      </div>
    </DropdownMenu>
    <div class="toggle-button" @click="handleMoveCellUp"><strong>Move cell up </strong></div>
    <div class="toggle-button" @click="handleMoveCellDown">
      <strong>Move cell down</strong>
    </div>
    <div
      class="toggle-button"
      :class="{ active: isSelectedCellHidden }"
      :title="isSelectedCellHidden ? 'Show selected cell' : 'Hide selected cell'"
      @click="handleToggleHidden"
    >
      {{ isSelectedCellHidden ? 'Hide' : 'Hide' }}
    </div>
    <div
      class="toggle-button lock-toggle"
      :class="{ active: isSelectedCellSoftLocked }"
      :title="isSelectedCellSoftLocked ? 'Unlock selected cell' : 'Lock selected cell'"
      @click="handleToggleSoftLock"
    >
      {{ isSelectedCellSoftLocked ? 'Lock' : 'Lock' }}
    </div>

    <!-- Workspace Layout Toggle -->
    <div
      class="toggle-button"
      :class="{ active: isA4Preview }"
      :title="isA4Preview ? 'Switch to fluid layout' : 'Switch to A4 preview layout'"
      @click="handleToggleWorkspaceLayout"
    >
      {{ isA4Preview ? 'A4 Preview' : 'A4 Preview' }}
    </div>

    <div
      class="toggle-button"
      :style="
        isDarkMode
          ? {
              background: 'var(--button-on-color, lightgreen)',
              color: 'var(--ui-text-color, #fff)'
            }
          : {}
      "
      @click="handleToggleDark"
    >
      Dark
    </div>
    <div class="right-buttons">
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'notebooks' }"
        @click="handleTogglePanel('notebooks')"
      >
        Notebooks
      </div>
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'toc' }"
        @click="handleTogglePanel('toc')"
      >
        Table of Contents
      </div>
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'variables' }"
        @click="handleTogglePanel('variables')"
      >
        Variables
      </div>
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'flashcards' }"
        @click="handleTogglePanel('flashcards')"
      >
        Flashcards
      </div>
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'settings' }"
        @click="handleTogglePanel('settings')"
      >
        Settings
      </div>
      <div
        class="side-panel-toggle-button"
        :class="{ active: sidePanelStore.activePanel === 'help' }"
        @click="handleTogglePanel('help')"
      >
        Get help
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import LunaSmallIcon from '@renderer/assets/icons/Luna05-logo.png'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import DropdownMenu from '@renderer/components/UI/DropdownMenu.vue'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useSidePanelStore } from '@renderer/stores/UI/sidePanelStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import { computed, ref } from 'vue'
import { saveAsCurrentWorkspace } from '@renderer/code/files/save-as'
import { saveOrSaveAs } from '@renderer/code/files/save-file'
import { openWorkspaceFromDisk } from '@renderer/code/files/open-file'
import { createNewWorkspaceWithPrompt } from '@renderer/code/files/new-file'

const modalStore = useModalStore()
const sidePanelStore = useSidePanelStore()
const themeStore = useThemeStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const menubarStore = useMenubarStore()
const workspaceStore = useWorkspaceStore()
const cellSelectionStore = useCellSelectionStore()
// ref to Insert dropdown menu to programmatically close after action
const insertMenu = ref<{ closeDropdown: () => void } | null>(null)
// Computed properties
const isA4Preview = computed(() => menubarStore.isA4Preview)
const isDarkMode = computed(() => themeStore.isDarkMode)
const isSelectedCellSoftLocked = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  return id ? !!ws.cells[id]?.softLocked : false
})
const isSelectedCellHidden = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  return id ? !!ws.cells[id]?.hidden : false
})
const isSelectedCellLocked = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  if (!id) return false
  const c = ws.cells[id]
  return !!(c?.softLocked || c?.hardLocked)
})
// Handle workspace layout toggle
function handleToggleWorkspaceLayout(): void {
  menubarStore.toggleA4Preview()
}

function isWorkspaceEffectivelyEmpty(): boolean {
  const ws: Workspace | null = workspaceStore.workspace
  if (!ws) return true
  const notebookIds = Object.keys(ws.notebooks || {})
  if (notebookIds.length !== 1) return false
  const nb = ws.notebooks[notebookIds[0]]
  if (!nb) return false
  const hasActiveCells = (nb.cellOrder || []).some((cid: string) => {
    const c = ws.cells?.[cid]
    return c && !c.softDeleted && !c.hardDeleted
  })
  if (hasActiveCells) return false
  const binHasCells = Object.keys(ws.recycleBin?.cells || {}).length > 0
  const binHasNotebooks = Object.keys(ws.recycleBin?.notebooks || {}).length > 0
  if (binHasCells || binHasNotebooks) return false
  return true
}

// Placeholder handlers
const handleNewFile = async (): Promise<void> => {
  const res = await createNewWorkspaceWithPrompt()
  if (!res.success && !res.canceled) {
    console.warn('New File failed', res.error)
  }
}

const handleOpenFile = async (): Promise<void> => {
  const res = await openWorkspaceFromDisk()
  if (!res.success) console.warn('Open canceled or failed', res.error)
}

const handleSaveFile = async (): Promise<void> => {
  const res = await saveOrSaveAs()
  if (!res.success) console.warn('Save canceled or failed', res.error)
}

const handleSaveFileAs = async (): Promise<void> => {
  const res = await saveAsCurrentWorkspace()
  if (!res.success) console.warn('Save As canceled or failed', res.error)
}

const handleSavePDFForSubmission = (): void => {}

const handleSettings = (): void => {
  modalStore.openSettingsModal()
}

const handleAboutLuna = (): void => {
  modalStore.openAboutLunaModal()
}

const handleQuitLuna = async (): Promise<void> => {
  const opts = {
    isSaved: workspaceStore.isSaved,
    isEffectivelyEmpty: isWorkspaceEffectivelyEmpty()
  }
  if (window.electron && typeof window.electron.quitApp === 'function') {
    try {
      await window.electron.quitApp(opts)
    } catch (e) {
      console.error('Failed to quit Luna:', e)
    }
  } else {
    console.warn('Quit function not available in this environment.')
  }
}

// Edit handlers
const handleMoveCellUp = (): void => {
  const ok = workspaceStore.moveSelectedCellUp()
  if (!ok) console.warn('Cannot move cell up: no selection or at top')
}
const handleMoveCellDown = (): void => {
  const ok = workspaceStore.moveSelectedCellDown()
  if (!ok) console.warn('Cannot move cell down: no selection or at bottom')
}

const handleMoveFocusToCellAbove = (): void => {}
const handleMoveFocusToCellBelow = (): void => {}

const handleUndo = (): void => {}
const handleRedo = (): void => {}
const handleCut = (): void => {}
const handleCopy = (): void => {}
const handlePaste = (): void => {}
const handleFind = (): void => {}
const handleReplace = (): void => {}

const handleInsertTextCell = (): void => {
  workspaceStore.addTextCell()
  // Close Insert menu after action
  try {
    insertMenu.value?.closeDropdown()
  } catch {
    /* ignore */
  }
}

const handleInsertPythonCell = (): void => {
  workspaceStore.addPythonCell()
  // Close Insert menu after action
  try {
    insertMenu.value?.closeDropdown()
  } catch {
    /* ignore */
  }
}

const handleTogglePanel = (panel: string): void => {
  sidePanelStore.togglePanel(panel)
}

const handleToggleDark = (): void => {
  themeStore.toggleIsDarkMode()
}

// Toggle soft lock on selected cell
const handleToggleSoftLock = (): void => {
  const ok = workspaceStore.toggleSoftLockSelectedCell()
  if (!ok) console.warn('No cell selected to lock/unlock')
}

// Toggle hidden on selected cell
const handleToggleHidden = (): void => {
  const ok = workspaceStore.toggleHiddenSelectedCell()
  if (!ok) console.warn('No cell selected to hide/show')
}

// Edit → Bin actions
const handleMoveCellToBin = (): void => {
  if (isSelectedCellLocked.value || isSelectedCellHidden.value) {
    console.warn('Cannot move locked/hidden cell to Bin')
    return
  }
  const ok = workspaceStore.softDeleteSelectedCell()
  if (!ok) console.warn('No cell selected or cannot move to Bin')
}
const handleMoveNotebookToBin = (): void => {
  const id = workspaceStore.currentNotebookId
  if (!id) {
    console.warn('No notebook selected to move to Bin')
    return
  }
  const ok = window.confirm('Move the current notebook to the Bin?')
  if (!ok) return
  workspaceStore.deleteNotebook(id)
}
</script>

<style scoped>
.brand-icon {
  height: var(--menu-bar-height, 1.2em);
  width: auto;
  margin-right: 0em;
  margin-left: 0.5em;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
.menu-bar {
  /* Alignment */
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  gap: 0em;
  /* Border */
  border-bottom: 0px solid var(--border-color, #444);
  /* Adjusted to fit button height */
  background: var(--menu-background, #222);
  color: var(--ui-text-color, #fff);
  display: flex;
  align-items: center;
  padding: var(--menu-bar-padding, 0.5em);
  /* top, right, bottom, left */
  box-sizing: border-box;
  z-index: var(--menu-bar-z-index, 3000);
  /* Higher than toolbar, consistent with dropdown z-index */
  position: relative;
  /* Ensure z-index works correctly */
  /* Store controled Font */
  font-family: var(--ui-font, 'Arial', sans-serif);
  font-size: var(--menu-bar-font-size, 1em);
  /* Not controlled by store yet*/
  line-height: var(--menu-bar-line-height, 1em);
  font-weight: var(--menu-bar-font-weight, normal);
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  background-color: var(--menu-background, #f9f9f9);
  /*padding: var(--button-padding);*/ /* top, right, bottom, left */
  padding: var(--dropdown-items-padding, 0.5em);
  border: var(--border-thickness, 2px) solid var(--menu-background, #ccc);
  cursor: pointer;
  transition: background-color 0s ease;
  white-space: nowrap;
}

.shortcut {
  margin-left: auto;
  opacity: 0.7;
  font-size: 0.95em;
  padding-left: 4em;
}

.shortcut-not-implemented {
  text-decoration: line-through;
  margin-left: auto;
  opacity: 0.7;
  font-size: 0.95em;
  padding-left: 4em;
}

.not-implemented {
  color: #e53935;
  margin-left: 0.75em;
  font-size: 1.1em;
  vertical-align: middle;
}

.implemented {
  color: #43a047;
  /* green */
  margin-left: 0.75em;
  font-size: 1.1em;
  vertical-align: middle;
}

.dropdown-menu-item:hover {
  background-color: var(--button-hover-color, red);
  border: var(--border-thickness, 2px) solid var(--button-border-hover-color, red);
}

/* Disabled state: cursor only; visual styles are controlled by specific state classes */
.dropdown-menu-item.disabled,
.dropdown-menu-item.cell-is-locked-menubar-option,
.dropdown-menu-item.cell-is-hidden-menubar-option {
  cursor: not-allowed !important;
}
.dropdown-menu-item.disabled *,
.dropdown-menu-item.cell-is-locked-menubar-option *,
.dropdown-menu-item.cell-is-hidden-menubar-option * {
  cursor: not-allowed !important;
}

/* Locked: use soft-locked theme color, keep disabled cursor */
.dropdown-menu-item.cell-is-locked-menubar-option {
  opacity: 0.85;
  background-color: var(--soft-locked-border-color, orange);
  border: var(--border-thickness, 2px) solid var(--soft-locked-border-color, orange);
}
.dropdown-menu-item.cell-is-locked-menubar-option:hover {
  background-color: var(--soft-locked-border-color, orange);
  border: var(--border-thickness, 2px) solid var(--soft-locked-border-color, orange);
}

/* Hidden: reuse hidden-cell stripe pattern and color tokens */
.dropdown-menu-item.cell-is-hidden-menubar-option {
  opacity: 0.9;
  border: var(--border-thickness, 2px) solid var(--hide-cell-color, red);
}
.dropdown-menu-item.cell-is-hidden-menubar-option:hover {
  border: var(--border-thickness, 2px) solid var(--hide-cell-color, red);
}

/* Combined state: hidden + locked.
   - Keep hidden stripes background
   - Use locked color for border
   - Add a left accent bar with the locked color */
.dropdown-menu-item.cell-is-hidden-menubar-option.cell-is-locked-menubar-option {
  border: var(--border-thickness, 2px) solid var(--soft-locked-border-color, orange);
  box-shadow: inset 6px 0 0 0 var(--soft-locked-border-color, orange);
}
.dropdown-menu-item.cell-is-hidden-menubar-option.cell-is-locked-menubar-option:hover {
  border: var(--border-thickness, 2px) solid var(--soft-locked-border-color, orange);
  box-shadow: inset 6px 0 0 0 var(--soft-locked-border-color, orange);
}

.dropdown-menu-divider {
  height: 1px;
  background-color: var(--dropdown-divider-color, red);
  margin: 0.25em 0;
}

.toggle-button {
  background: var(--menu-background, #222);
  color: var(--text-color, #fff);
  border: none;
  padding: var(--menu-bar-button-padding);
  /* top, right, bottom, left */
  cursor: pointer;
  font: inherit;
  border-radius: var(--menu-bar-button-border-radius, 0px);
}

.toggle-button.active {
  background: var(--button-on-color, lightgreen);
  color: var(--text-color, #fff);
}

/* Locked button uses soft-locked theme color when active */
.toggle-button.lock-toggle.active {
  background: var(--soft-locked-border-color, orange);
  color: var(--ui-text-color, #fff);
}

.toggle-button:hover {
  background: var(--button-hover-color, #333);
  color: var(--text-color, #fff);
}

.side-panel-toggle-button {
  background: var(--button-transparent-off-color, transparent);
  color: var(--text-color, #fff);
  border: none;
  padding: var(--menu-bar-button-padding);
  cursor: pointer;
  font: inherit;
  border-radius: var(--menu-bar-button-border-radius, 4px);
  transition: background 0.15s;
}

.side-panel-toggle-button.active {
  background: var(--button-on-color, lightgreen);
  color: var(--text-color, #fff);
}
.side-panel-toggle-button:hover {
  background: var(--button-hover-color, #333);
  color: var(--text-color, #fff);
}

.right-buttons {
  margin-left: auto;
  display: flex;
  gap: 0.1em;
  /* Optional: space between right buttons */
}
</style>
