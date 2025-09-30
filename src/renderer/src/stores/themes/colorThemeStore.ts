/* Filepath: \src\renderer\src\stores\colorThemeStore.ts */
import { defineStore } from 'pinia'
import type { ThemeColorTypes } from '@renderer/types/color-theme-types'

// Remember to update the color-theme.css file with the new color-theme values

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: false,
    lightTheme: {
      // Palette (branding / accent colors)
      lunaPalatte1: 'red',
      lunaPalatte2: 'blue',
      lunaPalatte3: 'green',
      lunaPalatte4: 'yellow',
      lunaPalatte5: 'purple',
      lunaPalatte6: 'orange',
      lunaPalatte7: 'teal',

      // Development/debug
      debugColor: 'red',

      // Core backgrounds
      appBackground: '#ffffff',
      webWorkspaceBackground: '#FFFFFF',
      webWorkspaceBorderColor: 'gainsboro',

      // Menu / Toolbar
      menuBackground: 'gainsboro',
      topToolbarBackground: 'whitesmoke',
      topToolbarBorderColor: 'whitesmoke',

      // A4 / paper workspace
      a4WorkspaceBackground: '#e0e0e0',
      a4WorkspaceBorderColor: 'gainsboro',

      // Sidepanel
      sidepanelBackground: 'gainsboro',
      sidepanelBorderColor: 'whitesmoke',

      // Paper preview
      paperColor: '#ffffff',
      paperBorderColor: 'transparent',

      // Cell (general)
      cellBackground: '#ffffff',
      cellBorderColor: 'whitesmoke',
      cellMarginBackgroundColor: '#f0f0f0',

      // Python-cell specific
      pythonStdOutBackground: '#ffffff',
      pythonImageBackground: '#ffffff',

      // Text & UI text
      textColor: '#222222',
      UITextColor: '#222222',

      // Borders & dividers
      borderColor: '#dddddd',
      dropdownBorderColor: '#cccccc',
      dividerColor: 'silver',
      dropdownDividerColor: '#cccccc',

      // Active / selection
      activeBackgroundColor: 'lightgreen',
      activeBorderColor: 'lightgreen',
      activeBorderColorHover: 'lightgreen',

      // Run / action buttons
      runcodeBackgroundColor: 'lightgreen',
      runcodeHoverBackgroundColor: '#aaaaaa',

      // Standard buttons
      buttonBackgroundColor: 'transparent',
      buttonBorderColor: 'gray',
      buttonHoverColor: '#aaaaaa',
      buttonBorderHoverColor: 'black',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'lightgreen',
      buttonBorderOnColor: 'lightgreen',
      buttonHardOffColor: 'salmon',

      // Disabled button styles
      buttonDisabledColor: 'transparent',
      buttonDisabledBorderColor: 'darkgray',
      buttonDisabledTextColor: '#aaa',
      buttonDisabledHoverColor: 'gray',

      // Reset / destructive buttons
      buttonResetColor: 'darksalmon',
      buttonResetHoverColor: '#aaaaaa',
      deleteButtonHoverColor: 'firebrick',

      // Soft lock / locked UI
      softLockedColor: '#ff994bff',
      hideCellColor: 'whitesmoke',

      // Focus / accessibility
      focusVisibleBorderColor: 'blue',
      highContrastColor: 'black',

      // Slider styles
      sliderBackground: '#cccccc',
      sliderThumbColor: '#ffffff',
      sliderTrackColor: '#888888',

      // Reset zoom button color
      resetZoomButtonColorCenter: 'lightgreen',
      resetZoomButtonColorOffCenter: 'darksalmon',

      // Flagged cells
      flaggedCellColor: 'darksalmon',

      // Links
      linkColor: 'green',

      // Scrollbars
      scrollbarThumbColor: 'gray',
      scrollbarTrackColor: 'lightgray',

      // Misc
      inputFieldBackgroundColor: 'white'
    } as ThemeColorTypes,

    darkTheme: {
      // Palette (branding / accent colors)
      lunaPalatte1: 'red',
      lunaPalatte2: 'blue',
      lunaPalatte3: 'green',
      lunaPalatte4: 'yellow',
      lunaPalatte5: 'purple',
      lunaPalatte6: 'orange',
      lunaPalatte7: 'teal',

      // Development/debug
      debugColor: 'red',

      // Core backgrounds
      appBackground: '#222222',
      webWorkspaceBackground: '#222222',
      webWorkspaceBorderColor: '#444444',

      // Menu / Toolbar
      menuBackground: '#111111',
      topToolbarBackground: '#111111',
      topToolbarBorderColor: '#111111',

      // A4 / paper workspace
      a4WorkspaceBackground: '#222222',
      a4WorkspaceBorderColor: '#444444',

      // Sidepanel
      sidepanelBackground: '#444444',
      sidepanelBorderColor: '#111111',

      // Paper preview
      paperColor: '#333333',
      paperBorderColor: 'transparent',

      // Cell (general)
      cellBackground: '#222222',
      cellBorderColor: '#444444',
      cellMarginBackgroundColor: '#333333',

      // Python-cell specific
      pythonStdOutBackground: '#222222',
      pythonImageBackground: 'black',

      // Text & UI text
      textColor: '#cccccc',
      UITextColor: '#cccccc',

      // Borders & dividers
      borderColor: '#111111',
      dropdownBorderColor: '#555555',
      dividerColor: '#242424',
      dropdownDividerColor: '#555555',

      // Active / selection
      activeBackgroundColor: 'darkgreen',
      activeBorderColor: 'darkgreen',
      activeBorderColorHover: 'darkgreen',

      // Run / action buttons
      runcodeBackgroundColor: 'darkgreen',
      runcodeHoverBackgroundColor: 'forestgreen',

      // Standard buttons
      buttonBackgroundColor: 'transparent',
      buttonBorderColor: '#787878',
      buttonHoverColor: 'gray',
      buttonBorderHoverColor: 'whitesmoke',
      buttonTransparentOffColor: 'transparent',
      buttonOnColor: 'darkgreen',
      buttonBorderOnColor: 'darkgreen',
      buttonHardOffColor: 'darkred',

      // Disabled button styles
      buttonDisabledColor: 'transparent',
      buttonDisabledBorderColor: 'darkgray',
      buttonDisabledTextColor: '#555555',
      buttonDisabledHoverColor: 'gray',

      // Reset / destructive buttons
      buttonResetColor: 'firebrick',
      buttonResetHoverColor: 'red',
      deleteButtonHoverColor: 'lightgray',

      // Soft lock / locked UI
      softLockedColor: 'sienna',
      cellLockedOverlay: 'rgba(255, 255, 255, 0.06)',
      hideCellColor: '#555555',

      // Focus / accessibility
      focusVisibleBorderColor: 'blue',
      highContrastColor: 'white',

      // Slider styles
      sliderBackground: '#cccccc',
      sliderThumbColor: '#ffffff',
      sliderTrackColor: '#888888',

      // Reset zoom button color
      resetZoomButtonColorCenter: 'darkgreen',
      resetZoomButtonColorOffCenter: 'darkred',

      // Flagged cells
      flaggedCellColor: 'darkred',

      // Links
      linkColor: 'limegreen',

      // Scrollbars
      scrollbarThumbColor: '#555555',
      scrollbarTrackColor: '#111111',

      // Misc
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

      // Debug / palette
      root.style.setProperty('--debug-color', colors.debugColor)

      // Palette (branding / accent colors)
      root.style.setProperty('--luna-palette-1', colors.lunaPalatte1)
      root.style.setProperty('--luna-palette-2', colors.lunaPalatte2)
      root.style.setProperty('--luna-palette-3', colors.lunaPalatte3)
      root.style.setProperty('--luna-palette-4', colors.lunaPalatte4)
      root.style.setProperty('--luna-palette-5', colors.lunaPalatte5)
      root.style.setProperty('--luna-palette-6', colors.lunaPalatte6)
      root.style.setProperty('--luna-palette-7', colors.lunaPalatte7)

      // Core backgrounds
      root.style.setProperty('--app-background', colors.appBackground)
      root.style.setProperty('--web-workspace-background', colors.webWorkspaceBackground)
      root.style.setProperty('--web-workspace-border-color', colors.webWorkspaceBorderColor)

      // Menu / Toolbar
      root.style.setProperty('--menu-background', colors.menuBackground)
      root.style.setProperty('--top-toolbar-background', colors.topToolbarBackground)
      root.style.setProperty('--top-toolbar-border-color', colors.topToolbarBorderColor)

      // A4 / paper workspace
      root.style.setProperty('--a4-workspace-background', colors.a4WorkspaceBackground)
      root.style.setProperty('--a4-workspace-border-color', colors.a4WorkspaceBorderColor)

      // Sidepanel
      root.style.setProperty('--sidepanel-background', colors.sidepanelBackground)
      root.style.setProperty('--sidepanel-border-color', colors.sidepanelBorderColor)

      // Accessibility / contrast
      root.style.setProperty('--high-contrast-color', colors.highContrastColor)

      // Dividers & paper
      root.style.setProperty('--divider-color', colors.dividerColor)
      root.style.setProperty('--paper-color', colors.paperColor)
      root.style.setProperty('--paper-border-color', colors.paperBorderColor)

      // Cell
      root.style.setProperty('--cell-background', colors.cellBackground)
      root.style.setProperty('--cell-border-color', colors.cellBorderColor)
      root.style.setProperty('--cell-margin-background-color', colors.cellMarginBackgroundColor)

      // Python cell outputs
      root.style.setProperty('--python-stdout-background', colors.pythonStdOutBackground)
      root.style.setProperty('--python-image-background', colors.pythonImageBackground)

      // Text
      root.style.setProperty('--text-color', colors.textColor)
      root.style.setProperty('--ui-text-color', colors.UITextColor)

      // Borders
      root.style.setProperty('--border-color', colors.borderColor)
      root.style.setProperty('--dropdown-border-color', colors.dropdownBorderColor)

      // Active / selection
      root.style.setProperty('--active-background-color', colors.activeBackgroundColor)
      root.style.setProperty('--active-border-color', colors.activeBorderColor)
      root.style.setProperty('--active-border-color-hover', colors.activeBorderColorHover)

      // Run / action buttons
      root.style.setProperty('--runcode-background-color', colors.runcodeBackgroundColor)
      root.style.setProperty('--runcode-hover-background-color', colors.runcodeHoverBackgroundColor)

      // Soft-locked / hidden
      root.style.setProperty('--soft-locked-color', colors.softLockedColor)
      root.style.setProperty(
        '--cell-locked-overlay',
        (colors as unknown as Record<string, string>)['cellLockedOverlay']
      )
      root.style.setProperty('--hide-cell-color', colors.hideCellColor)

      // Focus
      root.style.setProperty('--focus-visible-border-color', colors.focusVisibleBorderColor)

      // Sliders
      root.style.setProperty('--slider-background', colors.sliderBackground)
      root.style.setProperty('--slider-thumb-color', colors.sliderThumbColor)
      root.style.setProperty('--slider-track-color', colors.sliderTrackColor)

      // Dropdown divider
      root.style.setProperty('--dropdown-divider-color', colors.dropdownDividerColor)

      // Buttons (visual states)
      root.style.setProperty('--button-background-color', colors.buttonBackgroundColor)
      root.style.setProperty('--button-border-color', colors.buttonBorderColor)
      root.style.setProperty('--button-hover-color', colors.buttonHoverColor)
      root.style.setProperty('--button-border-hover-color', colors.buttonBorderHoverColor)
      root.style.setProperty('--button-on-color', colors.buttonOnColor)
      root.style.setProperty('--button-border-on-color', colors.buttonBorderOnColor)
      root.style.setProperty('--button-transparent-off-color', colors.buttonTransparentOffColor)
      root.style.setProperty('--button-hard-off-color', colors.buttonHardOffColor)

      // Disabled button styles
      root.style.setProperty('--button-disabled-color', colors.buttonDisabledColor)
      root.style.setProperty('--button-disabled-border-color', colors.buttonDisabledBorderColor)
      root.style.setProperty('--button-disabled-text-color', colors.buttonDisabledTextColor)
      root.style.setProperty('--button-disabled-hover-color', colors.buttonDisabledHoverColor)

      // Reset / delete
      root.style.setProperty('--button-reset-color', colors.buttonResetColor)
      root.style.setProperty('--button-reset-hover-color', colors.buttonResetHoverColor)
      root.style.setProperty('--delete-button-hover-color', colors.deleteButtonHoverColor)

      // Reset zoom colors
      root.style.setProperty('--reset-zoom-button-color-Center', colors.resetZoomButtonColorCenter)
      root.style.setProperty(
        '--reset-zoom-button-color-OffCenter',
        colors.resetZoomButtonColorOffCenter
      )

      // Flagged / links / scrollbars
      root.style.setProperty('--flagged-cell-color', colors.flaggedCellColor)
      root.style.setProperty('--link-color', colors.linkColor)
      root.style.setProperty('--scrollbar-thumb-color', colors.scrollbarThumbColor)
      root.style.setProperty('--scrollbar-track-color', colors.scrollbarTrackColor)

      // Input fields
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
