<template>
  <div
    class="row-flex-wrap-base flex-start menubar-colors menubar-right-padding"
    role="menubar"
    aria-label="Application main menu"
  >
    <img
      :src="LunaSmallIcon"
      alt="Luna"
      class="menubar-about-icon"
      title="About Luna"
      tabindex="0"
      @click.stop="handleAboutLuna"
      @keydown.enter.stop.prevent="handleAboutLuna"
      @keydown.space.stop.prevent="handleAboutLuna"
    />
    <DropdownMenu label="File">
      <div class="menubar-dropdown-item" @click="handleNewFile">
        New File <span class="menubar-shortcut-not-implemented">Ctrl + n</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleOpenFile">
        Open File <span class="menubar-shortcut-not-implemented">Ctrl + o</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleSaveFile">
        Save File <span class="menubar-shortcut-not-implemented">Ctrl + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleSaveFileAs">
        Save File As <span class="menubar-shortcut-not-implemented">Ctrl + Shift + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleSavePDFForHandout">
        <em>For teachers: Save PDF for Handout</em>
        <span class="menubar-shortcut-not-implemented">Ctrl + Alt + h</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleSavePDFForSubmission">
        <strong>For students: Save PDF For Submission</strong>
        <span class="menubar-shortcut-not-implemented">Ctrl + Alt + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="menubar-dropdown-item" @click="handleTogglePanel('settings')">
        Settings <span class="menubar-shortcut-not-implemented">Alt + Shift + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleAboutLuna">
        About Luna <span class="menubar-shortcut-not-implemented"></span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="menubar-dropdown-item" @click="handleQuitLuna">
        Quit Luna <span class="menubar-shortcut-not-implemented">Ctrl + Shift + Q</span>
        <ImplementedMark :implemented="true" />
      </div>
    </DropdownMenu>
    <DropdownMenu label="Edit">
      <div class="menubar-dropdown-item" @click="handleMoveCellUp">
        Move cell up <span class="menubar-shortcut-not-implemented">Ctrl + Shift + Up</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleMoveCellDown">
        Move cell down <span class="menubar-shortcut-not-implemented">Ctrl + Shift + Down</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleMoveFocusToCellAbove">
        Move focus to cell above <span class="menubar-shortcut-not-implemented">Ctrl + Up</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleMoveFocusToCellBelow">
        Move focus to cell below <span class="menubar-shortcut-not-implemented">Ctrl + Down</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="menubar-dropdown-item" @click="handleUndo">
        Undo
        <span class="menubar-shortcut-not-implemented">Ctrl + z</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleRedo">
        Redo
        <span class="menubar-shortcut-not-implemented">Ctrl + y</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleCut">
        Cut
        <span class="menubar-shortcut-not-implemented">Ctrl + x</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleCopy">
        Copy
        <span class="menubar-shortcut-not-implemented">Ctrl + c</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handlePaste">
        Paste
        <span class="menubar-shortcut-not-implemented">Ctrl + v</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="menubar-dropdown-item" @click="handleFind">
        Find
        <span class="menubar-shortcut-not-implemented">Ctrl + f</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleReplace">
        Replace
        <span class="menubar-shortcut-not-implemented">Ctrl + h</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div
        class="menubar-dropdown-item"
        :class="{
          disabled: isSelectedCellLocked || isSelectedCellHidden,
          'cell-is-locked-menu-bar-option': isSelectedCellLocked,
          'cell-is-hidden-menu-bar-option': isSelectedCellHidden,
          'hidden-stripes-bg': isSelectedCellHidden
        }"
        :aria-disabled="isSelectedCellLocked || isSelectedCellHidden ? 'true' : undefined"
        @click="handleMoveCellToBin"
      >
        {{ isSelectedCellPageBreak ? 'Delete Page Break' : 'Move cell to Bin' }}
        <span class="menubar-shortcut-not-implemented">Ctrl + 0</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item" @click="handleMoveNotebookToBin">
        Move notebook to Bin
        <span class="menubar-shortcut-not-implemented">Ctrl + Shift + 0</span>
        <ImplementedMark :implemented="true" />
      </div>
    </DropdownMenu>
    <DropdownMenu ref="insertMenu" label="Insert">
      <div class="menubar-dropdown-item" @click="handleInsertTextCell">
        Insert Text Cell <span class="menubar-shortcut-not-implemented">Ctrl + 1</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="menubar-dropdown-item">
        Insert Graphical Calculator Cell
        <span class="menubar-shortcut-not-implemented">Ctrl + 2</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item">
        Insert CAS (Computer Algebra System) Cell
        <span class="menubar-shortcut-not-implemented">Ctrl + 3</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item">
        Insert Geometry Cell <span class="menubar-shortcut-not-implemented">Ctrl + 4</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item">
        Insert Spreadsheet Cell <span class="menubar-shortcut-not-implemented">Ctrl + 5</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item">
        Insert Probability Calculator Cell
        <span class="menubar-shortcut-not-implemented">Ctrl + 6</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="menubar-dropdown-item" @click="handleInsertPythonCell">
        Insert Python Cell <span class="menubar-shortcut-not-implemented">Ctrl + 7</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="menubar-dropdown-item" @click="handleInsertPageBreak">
        Insert Page Break <span class="menubar-shortcut-not-implemented"></span>
        <ImplementedMark :implemented="false" />
      </div>
    </DropdownMenu>
    <!--------------------------------------------------------------------->
    <!-- Cell Movement Controls Toggle buttons (no dropdown menues here) -->
    <!--------------------------------------------------------------------->
    <div class="menubar-button" title="Move cell up" @click="handleMoveCellUp">
      <span class="icon-move-up" aria-hidden="true"></span>
      <!-- <span class="sr-only">Move cell up</span> -->
    </div>
    <div class="menubar-button" title="Move cell down" @click="handleMoveCellDown">
      <span class="icon-move-down" aria-hidden="true"></span>
      <!--<span class="sr-only">Move cell down</span>-->
    </div>
    <!---------------------------->
    <!-- Cell Flagging Controls -->
    <!---------------------------->
    <div
      class="menubar-button"
      :class="{ 'flagged-cell-active': isSelectedCellFlagged }"
      :title="
        isSelectedCellFlagged
          ? 'Unflag selected cell (Feature is not implemented yet)'
          : 'Flag selected cell (Feature is not implemented yet)'
      "
      @click="handleFlagCell"
    >
      <span class="icon-flag" aria-hidden="true"></span>
      <!-- <span class="sr-only">Flag selected cell</span> -->
    </div>
    <!------------------------------->
    <!-- Cell Hide / Show Controls -->
    <!------------------------------->
    <div
      class="menubar-button"
      :class="{ 'hide-cell-active': isSelectedCellHidden }"
      :title="isSelectedCellHidden ? 'Show selected cell' : 'Hide selected cell'"
      @click="handleToggleHidden"
    >
      {{ isSelectedCellHidden ? 'Hide' : 'Hide' }}
    </div>
    <!--------------------------------->
    <!-- Cell Lock / Unlock Controls -->
    <!--------------------------------->
    <div
      class="menubar-button"
      :class="{ 'lock-cell-active': isSelectedCellSoftLocked }"
      :title="isSelectedCellSoftLocked ? 'Unlock selected cell' : 'Lock selected cell'"
      @click="handleToggleSoftLock"
    >
      {{ isSelectedCellSoftLocked ? 'Lock' : 'Lock' }}
    </div>

    <!------------------------->
    <!-- A4 Preview Controls -->
    <!------------------------->
    <div
      class="menubar-button"
      :class="{ 'a4-preview-active': isA4Preview }"
      disabled="true"
      :title="
        isA4Preview
          ? 'Switch to fluid layout (not implemented yet)'
          : 'Switch to A4 preview layout (not implemented yet)'
      "
      @click="handleToggleWorkspaceLayout"
    >
      {{ isA4Preview ? 'A4 Preview' : 'A4 Preview' }}
    </div>

    <!------------------------->
    <!-- Dark Mode Controls -->
    <!------------------------->
    <div
      class="menubar-button"
      :class="{ 'dark-mode-active': isDarkMode }"
      :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="handleToggleDark"
    >
      {{ isDarkMode ? 'Dark' : 'Dark' }}
      <!-- No point change in text -->
    </div>

    <!-------------------------------------------------------------------------------------------->
    <!-- Right side: Side panel toggles: Notebooks, TOC, Variables, Flashcards, Settings, Help -->
    <!-------------------------------------------------------------------------------------------->
    <div class="row-flex-wrap-base margin-left-auto">
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'notebooks' }"
        @click="handleTogglePanel('notebooks')"
      >
        Notebooks
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'toc' }"
        @click="handleTogglePanel('toc')"
      >
        Table of Contents
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'variables' }"
        @click="handleTogglePanel('variables')"
      >
        Variables
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'flashcards' }"
        @click="handleTogglePanel('flashcards')"
      >
        Cards
        <!-- Flashcards, but use 'Cards' in UI for brevity -->
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'formulabook' }"
        title="Open formula book (not implemented yet)"
        @click="handleTogglePanel('formulabook')"
      >
        <span class="icon-book" aria-hidden="true"></span>
        <!-- <span class="sr-only">Settings</span> -->
      </div>
      <div
        class="menubar-button"
        title="Open local AI assistant"
        :class="{ active: sidepanelStore.activePanel === 'localLlmClient' }"
        @click="handleTogglePanel('localLlmClient')"
      >
        <span class="icon-local-llm-client" aria-hidden="true"></span>
        <!-- <span class="sr-only">Settings</span> -->
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'settings' }"
        title="Open settings"
        @click="handleTogglePanel('settings')"
      >
        <span class="icon-settings" aria-hidden="true"></span>
        <!-- <span class="sr-only">Settings</span> -->
      </div>
      <div
        class="menubar-button"
        :class="{ active: sidepanelStore.activePanel === 'help' }"
        title="Get help"
        @click="handleTogglePanel('help')"
      >
        <span class="icon-help" aria-hidden="true"></span>
        <!-- <span class="sr-only">Get help</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LunaSmallIcon from '@renderer/assets/icons/Luna05-logo.png'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import DropdownMenu from '@renderer/components/UI/DropdownMenu.vue'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useSidepanelStore } from '@renderer/stores/UI/sidepanelStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
// import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
// import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import { computed, ref, nextTick } from 'vue'
import '@renderer/css/media-print-css/media-print.css'
import { saveAsCurrentWorkspace } from '@renderer/code/files/save-as'
import { saveOrSaveAs } from '@renderer/code/files/save-file'
import { openWorkspaceFromDisk } from '@renderer/code/files/open-file'
import { createNewWorkspaceWithPrompt } from '@renderer/code/files/new-file'

const modalStore = useModalStore()
const sidepanelStore = useSidepanelStore()
const themeStore = useThemeStore()
// const fontStore = useFontStore()
// const fontSizeStore = useFontSizeStore()
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
const isSelectedCellFlagged = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  return id ? !!ws.cells[id]?.flagged : false
})
const isSelectedCellLocked = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  if (!id) return false
  const c = ws.cells[id]
  return !!(c?.softLocked || c?.hardLocked)
})
const isSelectedCellPageBreak = computed(() => {
  const ws = workspaceStore.getWorkspace()
  const id = cellSelectionStore.selectedCellId
  return id ? ws.cells[id]?.kind === 'page-break' : false
})
// Handle workspace layout toggle
function handleToggleWorkspaceLayout(): void {
  menubarStore.toggleA4Preview()
  console.log('Toggle button pressed, new layout mode:', menubarStore.workspaceLayoutMode)
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

const handleSavePDFForSubmission = (): void => {
  modalStore.openStudentInfoModal()
}
const handleSavePDFForHandout = async (): Promise<void> => {
  // Placeholder for future implementation
  console.warn('Save PDF for Handout is not implemented yet.')
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

/**
 * Scrolls the selected cell into view in the viewport.
 * Uses the data-cell-id attribute to find the cell element.
 */
function scrollSelectedCellIntoView(): void {
  const cellId = cellSelectionStore.selectedCellId
  if (!cellId) return

  try {
    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`)
    if (cellElement) {
      cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  } catch (error) {
    // Ignore DOM errors – this is a non-critical UI enhancement
    console.debug('Could not scroll cell into view:', error)
  }
}
// Edit handlers
const handleMoveCellUp = (): void => {
  const ok = workspaceStore.moveSelectedCellUp()
  if (ok) {
    // Keep the moved cell visible in the viewport
    nextTick(() => {
      scrollSelectedCellIntoView()
    })
  } else {
    console.warn('Cannot move cell up: no selection or at top')
  }
}

const handleMoveCellDown = (): void => {
  const ok = workspaceStore.moveSelectedCellDown()
  if (ok) {
    // Keep the moved cell visible in the viewport
    nextTick(() => {
      scrollSelectedCellIntoView()
    })
  } else {
    console.warn('Cannot move cell down: no selection or at bottom')
  }
}

const handleFlagCell = (): void => {
  const ok = workspaceStore.toggleFlaggedSelectedCell()
  if (!ok) console.warn('No cell selected to flag/unflag')
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

/*Experimental page break feature*/
const handleInsertPageBreak = (): void => {
  workspaceStore.addPageBreakCell()
  // Close Insert menu after action
  try {
    insertMenu.value?.closeDropdown()
  } catch {
    /* ignore */
  }
}
const handleTogglePanel = (panel: string): void => {
  sidepanelStore.togglePanel(panel)
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
  // Page-break cells are hard-deleted (never go to bin)
  const selectedCellId = cellSelectionStore.selectedCellId
  if (selectedCellId) {
    const cell = workspaceStore.getWorkspace().cells[selectedCellId]
    if (cell?.kind === 'page-break') {
      const ok = workspaceStore.hardDeleteSelectedCell()
      if (!ok) console.warn('Failed to delete page break')
      return
    }
  }
  // Regular cells go to bin via soft delete
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
/* Visually hide but keep accessible.
  'sr-only' is a standard utility class pattern that removes an element from the visual layout
  while keeping it in the accessibility tree so screen readers announce it.
  Used here to give icon-only buttons an accessible name.
  See: https://www.w3.org/WAI/GL/wiki/Using_the_.27sr-only.27_class
  The element still participates in semantics (label/name computation) but is not visibly rendered.
  Avoid putting interactive controls inside an sr-only container; use it only for descriptive text. 

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}*/
</style>
