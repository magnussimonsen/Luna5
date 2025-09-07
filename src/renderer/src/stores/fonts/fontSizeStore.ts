// Filepath: src/renderer/src/stores/UI/fontSizeStore.ts

import { defineStore } from 'pinia'
import type { FontSizeTypes } from '@renderer/types/font-size-types'
import type { fontSizeOptionsType } from '@renderer/types/font-size-options-types'

export const fontSizeOptions: fontSizeOptionsType[] = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
  44, 46, 48
]

export const useFontSizeStore = defineStore('fontSize', {
  state: () => ({
    fontSizes: {
      menuBarFontSize: '12px',
      statusBarFontSize: '11px',
      sidePanelMenuBarFontSize: '12px',
      sidePanelFontSize: '12px',
      toolbarFontSize: '13px',
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
      this.fontSizes.fallbackFontSize = size
      document.documentElement.style.setProperty('--fallback-font-size', size)
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
