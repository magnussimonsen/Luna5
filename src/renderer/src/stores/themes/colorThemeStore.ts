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
      // Background colors
      appBackground: '#ffffff',
      // Menu background colors
      menuBackground: 'white',
      // Toolbar background
      toolbarBackground: '#f0f0f0',
      // Main panel
      mainPanelBackground: '#ffffff',
      //Side panel
      sidePanelBackground: '#f0f0f0',
      // Text colors
      textColor: '#222222',
      UITextColor: '#222222',
      // Borders
      borderColor: '#dddddd',
      dropdownBorderColor: '#cccccc',
      // Active borders
      activeBorderColor: 'lightgreen',
      activeBorderColorHover: 'lightgreen',
      // Slider colors
      sliderBackground: '#cccccc',
      // Divider color
      dropdownDividerColor: '#cccccc',
      // Button colors
      buttonHoverColor: 'lightgray',
      buttonOnColor: 'lightgreen',
      buttonTransparentOffColor: 'transparent',
      buttonHardOffColor: 'salmon',
      /* Reset zoom button color */
      resetZoomButtonColor: 'lightblue'
    } as ThemeColorTypes,

    darkTheme: {
      lunaPalatte1: '', // Example color for Luna Palette (For later use)
      lunaPalatte2: '',
      lunaPalatte3: '',
      lunaPalatte4: '',
      // Background colors
      appBackground: '#222222',
      // Menu background colors
      menuBackground: '#333333',
      // Toolbar background
      toolbarBackground: '#333333',
      // Main panel
      mainPanelBackground: '#222222',
      //Side panel
      sidePanelBackground: '#333333',
      // Text colors
      textColor: '#cccccc',
      UITextColor: '#cccccc',
      // Borders
      borderColor: '#000000',
      dropdownBorderColor: '#555555',
      // Active borders
      activeBorderColor: 'green',
      activeBorderColorHover: 'green',
      // Slider colors
      sliderBackground: '#cccccc',
      // Divider color
      dropdownDividerColor: '#555555',
      // Button colors
      buttonHoverColor: 'dimgray',
      buttonOnColor: 'green',
      buttonTransparentOffColor: 'transparent',
      buttonHardOffColor: 'firebrick',
      /* Reset zoom button color */
      resetZoomButtonColor: 'darkgreen'
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
      root.style.setProperty('--app-background', colors.appBackground)
      root.style.setProperty('--menu-background', colors.menuBackground)
      root.style.setProperty('--toolbar-background', colors.toolbarBackground)
      root.style.setProperty('--main-panel-background', colors.mainPanelBackground)
      root.style.setProperty('--side-panel-background', colors.sidePanelBackground)
      root.style.setProperty('--text-color', colors.textColor)
      root.style.setProperty('--ui-text-color', colors.UITextColor)
      root.style.setProperty('--border-color', colors.borderColor)
      root.style.setProperty('--dropdown-border-color', colors.dropdownBorderColor)
      root.style.setProperty('--active-border-color', colors.activeBorderColor)
      root.style.setProperty('--active-border-color-hover', colors.activeBorderColorHover)
      root.style.setProperty('--slider-background', colors.sliderBackground)
      root.style.setProperty('--dropdown-divider-color', colors.dropdownDividerColor)
      root.style.setProperty('--button-hover-color', colors.buttonHoverColor)
      root.style.setProperty('--button-on-color', colors.buttonOnColor)
      root.style.setProperty('--button-transparent-off-color', colors.buttonTransparentOffColor)
      root.style.setProperty('--button-hard-off-color', colors.buttonHardOffColor)
      root.style.setProperty('--reset-zoom-button-color', colors.resetZoomButtonColor)
    },
    getLightTheme() {
      return this.lightTheme
    },
    getDarkTheme() {
      return this.darkTheme
    }
  }
})
