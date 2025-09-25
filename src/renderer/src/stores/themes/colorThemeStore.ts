/* Filepath: \src\renderer\src\stores\colorThemeStore.ts */
import { defineStore } from 'pinia'
import type { ThemeColorTypes } from '@renderer/types/color-theme-types'

// Remember to update the color-theme.css file with the new color-theme values

// TO DO: REMOVE BUTTON ON AND REPLACE WITH BUTTON ACTIVE. INCONSISTENT NAMING IN CURRENT IMPLEMENTATION */

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false,
    lightTheme: {
      lunaPalatte1: 'red', // Example color for Luna Palette (For later use)
      lunaPalatte2: 'blue',
      lunaPalatte3: 'green',
      lunaPalatte4: 'yellow',
      // Development debug color
      debugColor: 'red',
      // Background colors
      appBackground: '#ffffff',
      // Menu background colors
      menuBackground: 'gainsboro',
      // Toolbar background
      topToolbarBackground: 'whitesmoke',
      topToolbarBorderColor: 'whitesmoke',
      // Web workspace background
      webWorkspaceBackground: '#FFFFFF', // light gray
      webWorkspaceBorderColor: 'gainsboro', // slightly darker gray
      // A4 paper workspace background
      a4WorkspaceBackground: '#e0e0e0', // light gray
      a4WorkspaceBorderColor: 'gainsboro', // slightly darker gray
      // Sidepanel
      sidepanelBackground: 'gainsboro',
      sidepanelBorderColor: 'whitesmoke',
      // Main panel
      mainPanelBackground: 'blue' /* debug IS THIS USED?*/,
      mainPanelBorderColor: 'blue' /* debug IS THIS USED?*/,
      // High contranst colors for accessibility
      highContrastColor: 'black',
      // Divider color
      dividerColor: 'silver',
      // Paper preview background
      paperColor: '#ffffff',
      paperBorderColor: 'transparent',
      // Cell
      cellBackground: '#ffffff',
      cellBorderColor: 'whitesmoke',
      cellMarginBackgroundColor: '#f0f0f0',
      // Python cell
      pythonStdOutBackground: '#ffffff',
      pythonImageBackground: '#ffffff',
      // Markdown cell background
      // Text colors
      textColor: '#222222',
      UITextColor: '#222222',
      // Borders
      borderColor: '#dddddd',
      dropdownBorderColor: '#cccccc',
      // Active
      activeBackgroundColor: 'lightgreen',
      activeBorderColor: 'lightgreen',
      activeBorderColorHover: 'lightgreen',
      // Soft locked
      softLockedColor: 'orange',
      // Locked overlay
      cellLockedOverlay: 'rgba(0, 0, 0, 0.06)',
      // Hidden cell color
      hideCellColor: 'whitesmoke',
      // Focus-visible (for tab key outline)
      focusVisibleBorderColor: 'blue',
      // Slider colors
      sliderBackground: '#cccccc',
      sliderThumbColor: '#ffffff',
      sliderTrackColor: '#888888',
      // Divider color
      dropdownDividerColor: '#cccccc',
      // Button colors
      buttonBorderColor: 'lightgray',
      buttonHoverColor: 'lightgray',
      buttonBorderHoverColor: 'black',
      buttonBackgroundColor: 'transparent',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'lightgreen',
      buttonBorderOnColor: 'green',
      buttonHardOffColor: 'salmon',
      deleteButtonHoverColor: 'firebrick',
      // Disabled button colors
      buttonDisabledColor: 'transparent',
      buttonDisabledBorderColor: 'darkgray',
      buttonDisabledTextColor: '#aaa',
      buttonDisabledHoverColor: 'gray',
      // General reset or delete button colors
      buttonResetColor: 'darksalmon',
      buttonResetHoverColor: 'tomato',
      /* Reset zoom button color */
      resetZoomButtonColorCenter: 'lightgreen',
      resetZoomButtonColorOffCenter: 'salmon',
      /* Flagged cells */
      flaggedCellColor: 'salmon', // flagged cell index background
      /* Links */
      linkColor: 'green',
      /* Scrollbar colors */
      scrollbarThumbColor: 'gray',
      scrollbarTrackColor: 'lightgray',
      /* Input field colors */
      inputFieldBackgroundColor: 'white'
    } as ThemeColorTypes,

    darkTheme: {
      lunaPalatte1: 'red', // Example color for Luna Palette (For later use)
      lunaPalatte2: 'blue',
      lunaPalatte3: 'green',
      lunaPalatte4: 'yellow',
      // Development debug color
      debugColor: 'red',
      // Background colors
      appBackground: '#222222',
      // Menu background colors
      menuBackground: '#111111',
      // Toolbar background
      topToolbarBackground: '#111111',
      topToolbarBorderColor: '#111111',
      // Web workspace
      webWorkspaceBackground: '#222222',
      webWorkspaceBorderColor: '#444444',
      // A4 paper workspace
      a4WorkspaceBackground: '#222222',
      a4WorkspaceBorderColor: '#444444',
      // Sidepanel
      sidepanelBackground: '#444444',
      sidepanelBorderColor: '#111111',
      // Main panel  (NOT USED?)
      mainPanelBackground: '#9B2E2E', // Replace this with workspace background color
      mainPanelBorderColor: '#444444', // Replace this with workspace border color
      // High contranst colors for accessibility
      highContrastColor: 'white',
      // Divider color
      dividerColor: '#242424',
      // Paper preview background
      paperColor: '#333333',
      paperBorderColor: 'transparent',
      // Cell
      cellBackground: '#222222',
      cellBorderColor: '#444444',
      cellMarginBackgroundColor: '#333333',
      // Python cell
      pythonStdOutBackground: '#222222',
      pythonImageBackground: 'black',
      // Text colors
      textColor: '#cccccc',
      UITextColor: '#cccccc',
      // Borders
      borderColor: '#111111',
      dropdownBorderColor: '#555555',
      // Active
      activeBackgroundColor: 'darkgreen',
      activeBorderColor: 'darkgreen',
      activeBorderColorHover: 'darkgreen',
      // Soft locked
      softLockedColor: 'saddlebrown',
      // Locked overlay
      cellLockedOverlay: 'rgba(255, 255, 255, 0.06)',
      // Hidden cell color
      hideCellColor: '#555555',
      // Focus-visible (for tab key outline)
      focusVisibleBorderColor: 'blue',
      // Slider colors
      sliderBackground: '#cccccc',
      sliderThumbColor: '#ffffff',
      sliderTrackColor: '#888888',
      // Divider color
      dropdownDividerColor: '#555555',
      // Button colors
      buttonBorderColor: '#555555',
      buttonHoverColor: 'dimgray',
      buttonBorderHoverColor: 'whitesmoke',
      buttonBackgroundColor: 'transparent',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'darkgreen',
      buttonBorderOnColor: 'darkgreen',
      buttonHardOffColor: 'darkred',
      deleteButtonHoverColor: 'darkred',
      // Disabled button colors
      buttonDisabledColor: 'transparent',
      buttonDisabledBorderColor: 'darkgray',
      buttonDisabledTextColor: '#555555',
      buttonDisabledHoverColor: 'gray',
      // General reset button colors
      buttonResetColor: 'firebrick',
      buttonResetHoverColor: 'red',
      /* Reset zoom button color */
      resetZoomButtonColorCenter: 'darkgreen',
      resetZoomButtonColorOffCenter: 'darkred',
      /* Flagged cells */
      flaggedCellColor: 'darkred', // red for flagged cells
      /* Links */
      linkColor: 'limegreen',
      /* Scrollbar colors */
      scrollbarThumbColor: '#555555',
      scrollbarTrackColor: '#111111',
      /* Input field colors */
      inputFieldBackgroundColor: '#333333'
    } as ThemeColorTypes
  }),

  actions: {
    getIsDarkMode() {
      return this.isDarkMode
    },
    toggleIsDarkMode() {
      this.isDarkMode = !this.isDarkMode
      const themeColors = this.isDarkMode ? this.darkTheme : this.lightTheme
      this.applyTheme(themeColors)
    },
    setLightTheme(colors: ThemeColorTypes) {
      this.isDarkMode = false
      this.lightTheme = colors
      this.applyTheme(colors)
    },
    setDarkTheme(colors: ThemeColorTypes) {
      this.isDarkMode = true
      this.darkTheme = colors
      this.applyTheme(colors)
    },
    applyTheme(colors: ThemeColorTypes) {
      const root = document.documentElement
      root.style.setProperty('--debug-color', colors.debugColor)
      root.style.setProperty('--app-background', colors.appBackground)
      root.style.setProperty('--menu-background', colors.menuBackground)
      root.style.setProperty('--top-toolbar-background', colors.topToolbarBackground)
      root.style.setProperty('--top-toolbar-border-color', colors.topToolbarBorderColor)
      root.style.setProperty('--web-workspace-background', colors.webWorkspaceBackground)
      root.style.setProperty('--web-workspace-border-color', colors.webWorkspaceBorderColor)
      root.style.setProperty('--a4-workspace-background', colors.a4WorkspaceBackground)
      root.style.setProperty('--a4-workspace-border-color', colors.a4WorkspaceBorderColor)
      root.style.setProperty('--sidepanel-background', colors.sidepanelBackground)
      root.style.setProperty('--sidepanel-border-color', colors.sidepanelBorderColor)
      root.style.setProperty('--main-panel-background', colors.mainPanelBackground)
      root.style.setProperty('--main-panel-border-color', colors.mainPanelBorderColor)
      root.style.setProperty('--high-contrast-color', colors.highContrastColor)
      root.style.setProperty('--divider-color', colors.dividerColor)
      root.style.setProperty('--paper-color', colors.paperColor)
      root.style.setProperty('--paper-border-color', colors.paperBorderColor)
      // root.style.setProperty('--paper-margin-background-color', colors.paperMarginBackgroundColor) --- IGNORE ---
      // root.style.setProperty('--paper-cell-background', colors.paperCellBackground) --- IGNORE ---
      root.style.setProperty('--cell-background', colors.cellBackground)
      root.style.setProperty('--cell-border-color', colors.cellBorderColor)
      root.style.setProperty('--cell-margin-background-color', colors.cellMarginBackgroundColor)
      root.style.setProperty('--python-stdout-background', colors.pythonStdOutBackground)
      root.style.setProperty('--python-image-background', colors.pythonImageBackground)
      root.style.setProperty('--text-color', colors.textColor)
      root.style.setProperty('--ui-text-color', colors.UITextColor)
      root.style.setProperty('--border-color', colors.borderColor)
      root.style.setProperty('--dropdown-border-color', colors.dropdownBorderColor)
      root.style.setProperty('--active-background-color', colors.activeBackgroundColor)
      root.style.setProperty('--active-border-color', colors.activeBorderColor)
      root.style.setProperty('--active-border-color-hover', colors.activeBorderColorHover)
      root.style.setProperty('--soft-locked-border-color', colors.softLockedColor)
      root.style.setProperty('--hide-cell-color', colors.hideCellColor)
      root.style.setProperty('--cell-locked-overlay', colors.cellLockedOverlay)
      root.style.setProperty('--focus-visible-border-color', colors.focusVisibleBorderColor)
      root.style.setProperty('--slider-background', colors.sliderBackground)
      root.style.setProperty('--slider-thumb-color', colors.sliderThumbColor)
      root.style.setProperty('--slider-track-color', colors.sliderTrackColor)
      root.style.setProperty('--dropdown-divider-color', colors.dropdownDividerColor)
      root.style.setProperty('--button-background-color', colors.buttonBackgroundColor)
      root.style.setProperty('--button-border-color', colors.buttonBorderColor)
      root.style.setProperty('--button-hover-color', colors.buttonHoverColor)
      root.style.setProperty('--button-border-hover-color', colors.buttonBorderHoverColor)
      root.style.setProperty('--button-on-color', colors.buttonOnColor)
      root.style.setProperty('--button-border-on-color', colors.buttonBorderOnColor)
      root.style.setProperty('--button-transparent-off-color', colors.buttonTransparentOffColor)
      root.style.setProperty('--button-hard-off-color', colors.buttonHardOffColor)
      root.style.setProperty('--button-disabled-color', colors.buttonDisabledColor)
      root.style.setProperty('--button-disabled-border-color', colors.buttonDisabledBorderColor)
      root.style.setProperty('--button-disabled-text-color', colors.buttonDisabledTextColor)
      root.style.setProperty('--button-disabled-hover-color', colors.buttonDisabledHoverColor)
      root.style.setProperty('--button-reset-color', colors.buttonResetColor)
      root.style.setProperty('--button-reset-hover-color', colors.buttonResetHoverColor)
      root.style.setProperty('--delete-button-hover-color', colors.deleteButtonHoverColor)
      root.style.setProperty('--reset-zoom-button-color-Center', colors.resetZoomButtonColorCenter)
      root.style.setProperty(
        '--reset-zoom-button-color-OffCenter',
        colors.resetZoomButtonColorOffCenter
      )
      root.style.setProperty('--slider-background', colors.sliderBackground)
      root.style.setProperty('--slider-thumb-color', colors.sliderThumbColor)
      root.style.setProperty('--slider-track-color', colors.sliderTrackColor)
      root.style.setProperty('--flagged-cell-color', colors.flaggedCellColor)
      root.style.setProperty('--link-color', colors.linkColor)
      root.style.setProperty('--scrollbar-thumb-color', colors.scrollbarThumbColor)
      root.style.setProperty('--scrollbar-track-color', colors.scrollbarTrackColor)
      root.style.setProperty('--input-field-background-color', colors.inputFieldBackgroundColor)
    },
    getLightTheme() {
      return this.lightTheme
    },
    getDarkTheme() {
      return this.darkTheme
    }
  }
})
