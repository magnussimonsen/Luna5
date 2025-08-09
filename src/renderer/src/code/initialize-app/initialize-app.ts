import { preloadCriticalFonts, setFontFamilies } from './initialize-preload-font-familys'
import preloadFonts from '@renderer/assets/fonts/preload-fonts'
import fonts from '@renderer/assets/fonts/fonts'
import { initializeShortcutsGlobal } from '@renderer/code/initialize-app/initialize-shortcuts-global'
import { initializeTheme } from './initialize-theme'
import { initializeFontSizes } from './initialize-font-size'
import { initializeWorkspace } from './initialize-workspace'

export function initializeApp(): void {
  // Initialize new empty data workspace data structure schema first
  initializeWorkspace()
  // Preload fonts and set font families
  preloadCriticalFonts(preloadFonts)
  setFontFamilies(fonts.family)
  // Initialize the theme
  initializeTheme()
  // Initialize font sizes
  initializeFontSizes()
  // Initialize shortcuts globally
  initializeShortcutsGlobal()
}
