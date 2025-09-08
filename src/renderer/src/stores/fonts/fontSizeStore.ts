// Filepath: src/renderer/src/stores/UI/fontSizeStore.ts

import { defineStore } from 'pinia'
import type { FontSizeTypes } from '@renderer/types/font-size-types'
import type { FontSizeOptionsType } from '@renderer/types/font-size-options'
import { fontSizeOptions as fontSizeOptionsList } from '@renderer/types/font-size-options'

export const fontSizeOptions: FontSizeOptionsType[] = Array.from(
  fontSizeOptionsList
) as FontSizeOptionsType[]

export const useFontSizeStore = defineStore('fontSize', {
  state: () => ({
    fontSizes: {
      menuBarFontSize: '13px',
      statusBarFontSize: '12px',
      sidePanelMenuBarFontSize: '14px',
      sidePanelFontSize: '14px',
      toolbarFontSize: '14px',
      /* This (defaultCellFontSize)is the fontsize that will be set for the
      selected cell when user click the "reset font size"-button in the statusbar. */
      defaultCellFontSize: '14px',
      codeEditorCellFontSize: '14px',
      textEditorCellFontSize: '14px',
      fallbackFontSize: '14px' /* NOT USED */
    } as FontSizeTypes
  }),
  actions: {
    setMenuBarFontSize(size: string) {
      this.fontSizes.menuBarFontSize = size
      document.documentElement.style.setProperty('--menu-bar-font-size', size)
    },
    setStatusBarFontSize(size: string) {
      this.fontSizes.statusBarFontSize = size
      document.documentElement.style.setProperty('--status-bar-font-size', size)
    },
    setSidePanelMenuBarFontSize(size: string) {
      this.fontSizes.sidePanelMenuBarFontSize = size
      document.documentElement.style.setProperty('--side-panel-menu-bar-font-size', size)
    },
    setSidePanelFontSize(size: string) {
      this.fontSizes.sidePanelFontSize = size
      document.documentElement.style.setProperty('--side-panel-font-size', size)
    },
    setToolbarFontSize(size: string) {
      this.fontSizes.toolbarFontSize = size
      document.documentElement.style.setProperty('--toolbar-font-size', size)
    },
    // This sets the default font size for cells when user clicks "reset font size" in statusbar
    setDefaultCellFontSize(size: string) {
      this.fontSizes.defaultCellFontSize = size
      document.documentElement.style.setProperty('--default-cells-font-size', size)
    },
    setCodeEditorCellFontSize(size: string) {
      this.fontSizes.codeEditorCellFontSize = size
      document.documentElement.style.setProperty('--code-editor-cells-font-size', size)
    },
    setTextEditorCellFontSize(size: string) {
      this.fontSizes.textEditorCellFontSize = size
      document.documentElement.style.setProperty('--text-editor-cells-font-size', size)
    },
    setFallbackFontSize(size: string) {
      // NOT USED, Placeholder for future cell types
      this.fontSizes.fallbackFontSize = size
      document.documentElement.style.setProperty('--fallback-font-size', size)
    },
    setFontSizeForCellType(cellType: string, size: string) {
      if (cellType === 'python-cell') {
        this.setCodeEditorCellFontSize(size)
      } else if (cellType === 'text' || cellType === 'text-cell') {
        this.setTextEditorCellFontSize(size)
      } else {
        console.warn(
          `setFontSizeForCellType: Unrecognized cell type "${cellType}", applying fallback font size.`
        )
        this.setFallbackFontSize(size) // NOT USED, Placeholder for future cell types, cluld also return void
      }
    },

    applyFontSizes() {
      document.documentElement.style.setProperty(
        '--menu-bar-font-size',
        this.fontSizes.menuBarFontSize
      )
      document.documentElement.style.setProperty(
        '--status-bar-font-size',
        this.fontSizes.statusBarFontSize
      )
      document.documentElement.style.setProperty(
        '--side-panel-menu-bar-font-size',
        this.fontSizes.sidePanelMenuBarFontSize
      )
      document.documentElement.style.setProperty(
        '--side-panel-font-size',
        this.fontSizes.sidePanelFontSize
      )
      document.documentElement.style.setProperty(
        '--toolbar-font-size',
        this.fontSizes.toolbarFontSize
      )
      document.documentElement.style.setProperty(
        '--default-cells-font-size',
        this.fontSizes.defaultCellFontSize
      )
      document.documentElement.style.setProperty(
        '--code-editor-cells-font-size',
        this.fontSizes.codeEditorCellFontSize
      )
      document.documentElement.style.setProperty(
        '--text-editor-cells-font-size',
        this.fontSizes.textEditorCellFontSize
      )
      document.documentElement.style.setProperty(
        '--fallback-font-size',
        this.fontSizes.fallbackFontSize
      )
    }
  }
})
