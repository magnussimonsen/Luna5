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
      rootFontSize: '16px', // Used to set the rem unit at app initialization, not user changeable
      menubarFontSize: '13px',
      statusbarFontSize: '10px',
      sidepanelMenubarFontSize: '14px',
      sidepanelFontSize: '14px',
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
    setMenubarFontSize(size: string) {
      this.fontSizes.menubarFontSize = size
      document.documentElement.style.setProperty('--menubar-font-size', size)
    },
    setStatusBarFontSize(size: string) {
      this.fontSizes.statusbarFontSize = size
      document.documentElement.style.setProperty('--statusbar-font-size', size)
    },
    setSidepanelMenubarFontSize(size: string) {
      this.fontSizes.sidepanelMenubarFontSize = size
      document.documentElement.style.setProperty('--sidepanel-menubar-font-size', size)
    },
    setSidepanelFontSize(size: string) {
      this.fontSizes.sidepanelFontSize = size
      document.documentElement.style.setProperty('--sidepanel-font-size', size)
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
      // Apply root font size first so any subsequent rem-based calculations use it
      if (this.fontSizes.rootFontSize) {
        // Directly set the <html> font-size so rem units resolve from this value
        document.documentElement.style.fontSize = this.fontSizes.rootFontSize
        // Also expose as a CSS variable if components want the literal value
        document.documentElement.style.setProperty('--root-font-size', this.fontSizes.rootFontSize)
      }
      document.documentElement.style.setProperty(
        '--menubar-font-size',
        this.fontSizes.menubarFontSize
      )
      document.documentElement.style.setProperty(
        '--statusbar-font-size',
        this.fontSizes.statusbarFontSize
      )
      document.documentElement.style.setProperty(
        '--sidepanel-menubar-font-size',
        this.fontSizes.sidepanelMenubarFontSize
      )
      document.documentElement.style.setProperty(
        '--sidepanel-font-size',
        this.fontSizes.sidepanelFontSize
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
