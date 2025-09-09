/* Filepath: \src\renderer\src\stores\colorThemeStore.ts */
import { defineStore } from 'pinia'
import type { ThemeColorTypes } from '@renderer/types/color-theme-types'

// Remember to update the color-theme.css file with the new color-theme values

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false,
    lightTheme: {
      lunaPalatte1: '', // Example color for Luna Palette (For later use)
      lunaPalatte2: '',
      lunaPalatte3: '',
      lunaPalatte4: '',
      // Development debug color
      debugColor: 'red',
      // Background colors
      appBackground: '#ffffff',
      // Menu background colors
      menuBackground: 'whitesmoke',
      // Toolbar background
      toolbarBackground: 'whitesmoke',
      // Main panel
      mainPanelBackground: '#ffffff',
      // Side panel
      sidePanelBackground: '#f0f0f0',
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
      buttonBorderColor: '#cccccc',
      buttonHoverColor: 'lightgray',
      buttonBorderHoverColor: 'black',
      buttonBackgroundColor: 'transparent',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'lightgreen',
      buttonHardOffColor: 'salmon',
      deleteButtonHoverColor: 'lightcoral',
      // Python worker Reset button colors
      buttonResetPythonWorkerColor: 'transparent',
      buttonResetPythonWorkerHoverColor: 'lightcoral',
      /* Reset zoom button color */
      resetZoomButtonColorCenter: 'lightgreen',
      resetZoomButtonColorOffCenter: 'lightcoral',
      /* Flagged cells */
      flaggedCellColor: 'salmon' // red for flagged cells
    } as ThemeColorTypes,

    darkTheme: {
      lunaPalatte1: '', // Example color for Luna Palette (For later use)
      lunaPalatte2: '',
      lunaPalatte3: '',
      lunaPalatte4: '',
      // Development debug color
      debugColor: 'red',
      // Background colors
      appBackground: '#222222',
      // Menu background colors
      menuBackground: '#111111',
      // Toolbar background
      toolbarBackground: '#111111',
      // Main panel
      mainPanelBackground: '#222222',
      //Side panel
      sidePanelBackground: '#222222',
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
      buttonBorderHoverColor: '#FFFFFF',
      buttonBackgroundColor: 'transparent',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'darkgreen',
      buttonHardOffColor: 'darkred',
      deleteButtonHoverColor: 'darkred',
      // Python worker Reset button colors
      buttonResetPythonWorkerColor: 'transparent',
      buttonResetPythonWorkerHoverColor: 'darkred',
      /* Reset zoom button color */
      resetZoomButtonColorCenter: 'darkgreen',
      resetZoomButtonColorOffCenter: 'darkred',
      /* Flagged cells */
      flaggedCellColor: 'darkred' // red for flagged cells
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
      root.style.setProperty('--toolbar-background', colors.toolbarBackground)
      root.style.setProperty('--main-panel-background', colors.mainPanelBackground)
      root.style.setProperty('--side-panel-background', colors.sidePanelBackground)
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
      root.style.setProperty('--button-transparent-off-color', colors.buttonTransparentOffColor)
      root.style.setProperty('--button-hard-off-color', colors.buttonHardOffColor)
      root.style.setProperty(
        '--button-reset-python-worker-color',
        colors.buttonResetPythonWorkerColor
      )
      root.style.setProperty(
        '--button-reset-python-worker-hover-color',
        colors.buttonResetPythonWorkerHoverColor
      )
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
    },
    getLightTheme() {
      return this.lightTheme
    },
    getDarkTheme() {
      return this.darkTheme
    }
  }
})
