<template>
  <nav
    class="menu-bar"
    :style="{
      fontFamily: fontStore.fonts.uiFont || 'Arial, sans-serif',
      fontSize: fontSizeStore.fontSizes.menuBarFontSize || '1em'
    }"
  >
    <DropdownMenu label="File">
      <div class="dropdown-menu-item" @click="handleNewFile">
        New File <span class="shortcut">Ctrl + n</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleOpenFile">
        Open File <span class="shortcut">Ctrl + o</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleSaveFile">
        Save File <span class="shortcut">Ctrl + s</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleSaveFileAs">
        Save File As <span class="shortcut">Ctrl + Shift + s</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleSaveFileForSubmission">
        <strong>Save File For Submission</strong> <span class="shortcut">Ctrl + Alt + s</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleSettings">
        Settings <span class="shortcut">Alt + Shift + s</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleAboutLuna">
        About Luna <span class="shortcut"></span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleQuitLuna">
        Quit Luna <span class="shortcut">Ctrl + Shift + Q</span>
        <ImplementedMark :implemented="false" />
      </div>
    </DropdownMenu>
    <DropdownMenu label="Edit">
      <div class="dropdown-menu-item" @click="handleMoveCellUp">
        Move cell up <span class="shortcut">Ctrl + Shift + Up</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveCellDown">
        Move cell down <span class="shortcut">Ctrl + Shift + Down</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveFocusToCellAbove">
        Move focus to cell above <span class="shortcut">Ctrl + Up</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleMoveFocusToCellBelow">
        Move focus to cell below <span class="shortcut">Ctrl + Down</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleUndo">
        Undo <span class="shortcut">Ctrl + z</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleRedo">
        Redo <span class="shortcut">Ctrl + y</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleCut">
        Cut <span class="shortcut">Ctrl + x</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleCopy">
        Copy <span class="shortcut">Ctrl + c</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handlePaste">
        Paste <span class="shortcut">Ctrl + v</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item" @click="handleFind">
        Find <span class="shortcut">Ctrl + f</span> <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item" @click="handleReplace">
        Replace <span class="shortcut">Ctrl + h</span> <ImplementedMark :implemented="false" />
      </div>
    </DropdownMenu>
    <DropdownMenu label="Insert">
      <div class="dropdown-menu-item" @click="handleInsertTextCell">
        Insert Text Cell <span class="shortcut">Ctrl + 1</span>
        <ImplementedMark :implemented="true" />
      </div>
      <div class="dropdown-menu-item">
        Insert Graphical Calculator Cell <span class="shortcut">Ctrl + 2</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert CAS (Computer Algebra System) Cell <span class="shortcut">Ctrl + 3</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Geometry Cell <span class="shortcut">Ctrl + 4</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Spreadsheet Cell <span class="shortcut">Ctrl + 5</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Probability Calculator Cell <span class="shortcut">Ctrl + 6</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Python Cell <span class="shortcut">Ctrl + 7</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-item">
        Insert Markdown Cell <span class="shortcut">Ctrl + 8</span>
        <ImplementedMark :implemented="false" />
      </div>
      <div class="dropdown-menu-divider"></div>
      <div class="dropdown-menu-item">
        Delete Cell <span class="shortcut">Ctrl + 0</span>
        <ImplementedMark :implemented="false" />
      </div>
    </DropdownMenu>
    <div class="toggle-button" @click="handleMoveCellUp"><strong>Move cell up </strong></div>
    <div class="toggle-button" @click="handleMoveCellDown">
      <strong>Move cell down</strong>
    </div>
    <div class="toggle-button">Hide</div>
    <div class="toggle-button">Lock</div>

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
          ? { background: 'var(--button-on-color, #43a047)', color: 'var(--ui-text-color, #fff)' }
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
        :class="{ active: sidePanelStore.activePanel === 'help' }"
        @click="handleTogglePanel('help')"
      >
        <strong>Help</strong>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import DropdownMenu from '@renderer/components/UI/DropdownMenu.vue'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useSidePanelStore } from '@renderer/stores/UI/sidePanelStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { computed } from 'vue'

const modalStore = useModalStore()
const sidePanelStore = useSidePanelStore()
const themeStore = useThemeStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const menubarStore = useMenubarStore()
const workspaceStore = useWorkspaceStore()
// Computed properties
const isA4Preview = computed(() => menubarStore.isA4Preview)
const isDarkMode = computed(() => themeStore.isDarkMode)
// Handle workspace layout toggle
function handleToggleWorkspaceLayout(): void {
  menubarStore.toggleA4Preview()
}

// Placeholder handlers
const handleNewFile = (): void => {
  console.log('New File clicked')
}

const handleOpenFile = (): void => {
  console.log('Open File clicked')
}

const handleSaveFile = (): void => {
  console.log('Save File clicked')
}

const handleSaveFileAs = (): void => {
  console.log('Save File As clicked')
}

const handleSaveFileForSubmission = (): void => {
  console.log('Save File For Submission clicked')
}

const handleSettings = (): void => {
  modalStore.openSettingsModal()
}

const handleAboutLuna = (): void => {
  modalStore.openAboutLunaModal()
}

const handleQuitLuna = async (): Promise<void> => {
  if (window.electron && typeof window.electron.quitApp === 'function') {
    try {
      await window.electron.quitApp()
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

const handleMoveFocusToCellAbove = (): void => {
  console.log('Move focus to cell above clicked')
}
const handleMoveFocusToCellBelow = (): void => {
  console.log('Move focus to cell below clicked')
}

const handleUndo = (): void => {
  console.log('Undo clicked')
}
const handleRedo = (): void => {
  console.log('Redo clicked')
}
const handleCut = (): void => {
  console.log('Cut clicked')
}
const handleCopy = (): void => {
  console.log('Copy clicked')
}
const handlePaste = (): void => {
  console.log('Paste clicked')
}
const handleFind = (): void => {
  console.log('Find clicked')
}
const handleReplace = (): void => {
  console.log('Replace clicked')
}

const handleInsertTextCell = (): void => {
  const cell = workspaceStore.addTextCell()
  console.log('Inserted text cell', cell.id)
}

const handleTogglePanel = (panel: string): void => {
  sidePanelStore.togglePanel(panel)
}

const handleToggleDark = (): void => {
  themeStore.toggleIsDarkMode()
}
</script>

<style scoped>
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
  border-bottom: 1px solid var(--border-color, #444);
  /* Adjusted to fit button height */
  background: var(--menu-background, #222);
  color: var(--ui-text-color, #fff);
  display: flex;
  align-items: center;
  padding: var(--menu-bar-padding, 0.5em);
  /* top, right, bottom, left */
  box-sizing: border-box;
  z-index: 3000;
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
  /*padding: var(--button-padding);*/ /* top, right, bottom, left */
  padding: var(--dropdown-items-padding, 0.5em);
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
  border-radius: var(--menu-bar-button-border-radius, 4px);
}

.toggle-button.active {
  background: var(--button-on-color, #43a047);
  color: var(--text-color, #fff);
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
  background: var(--button-on-color, #43a047);
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
