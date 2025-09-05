import { preloadCriticalFonts, setFontFamilies } from './initialize-preload-font-familys'
import preloadFonts from '@renderer/assets/fonts/preload-fonts'
import fonts from '@renderer/assets/fonts/fonts'
import { initializeShortcutsGlobal } from '@renderer/code/initialize-app/initialize-shortcuts-global'
import { initializeTheme } from './initialize-theme'
import { initializeFontSizes } from './initialize-font-size'
import { initializeWorkspace } from './initialize-workspace'

export function initializeApp(): void {
  // App bootstrap sequence (renderer). Order matters.
  // 1) Initialize a new empty workspace state/schema first
  initializeWorkspace()
  // 2) Preload fonts and set font-family CSS variables
  preloadCriticalFonts(preloadFonts)
  setFontFamilies(fonts.family)
  // 3) Initialize the theme
  initializeTheme()
  // 4) Initialize font sizes
  initializeFontSizes()
  // 5) Initialize shortcuts globally
  initializeShortcutsGlobal()
}
