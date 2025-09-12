/* filepath: src/renderer/src/types/fontSize.d.ts */

// This file defines the FontSizes type used in the font size store

export type FontSizeTypes = {
  rootFontSize?: string // Root <html> font size in px, used to set rem baseline (not user-changeable currently)
  menuBarFontSize: string
  statusBarFontSize: string
  sidePanelMenuBarFontSize: string
  sidePanelFontSize: string
  toolBarFontSize: string
  defaultCellFontSize: string
  codeEditorCellFontSize: string
  textEditorCellFontSize: string
  fallbackFontSize: string
}
