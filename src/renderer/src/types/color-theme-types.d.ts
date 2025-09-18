/* filepath: src/renderer/src/types/colorThemeTypes.d.ts */

// This file defines the ThemeColors type used in the color theme store
// and ensures that the color theme is consistent across the application.

export type ThemeColorTypes = {
  lunaPalatte1: string
  lunaPalatte2: string
  lunaPalatte3: string
  lunaPalatte4: string

  debugColor: string

  appBackground: string
  menuBackground: string
  menuBackgroundHover: string

  cellBackground: string
  cellBorderColor: string
  cellMarginBackgroundColor: string

  // Python cell
  pythonStdOutBackground: string
  pythonImageBackground: string

  topToolbarBackground: string
  topToolbarBorderColor: string

  // Workspace
  workspaceBackground: string
  workspaceBorderColor: string

  // Main panel

  mainPanelBackground: string
  mainPanelBorderColor: string

  // Paper preview background
  paperColor: string
  paperBorderColor: string
  // paperMarginBackgroundColor: string --- IGNORE ---
  // paperCellBackground: string --- IGNORE ---
  sidePanelBackground: string

  // Text colors
  textColor: string
  UITextColor: string

  // Main border colors
  borderColor: string
  dropdownBorderColor: string

  // Active elements
  activeBackgroundColor: string
  activeBorderColor: string
  activeBorderColorHover: string

  // Locked/hidden elements
  softLockedColor: string
  cellLockedOverlay: string
  hideCellColor: string

  focusVisibleBorderColor: string

  // Slider colors
  sliderBackground: string
  sliderThumbColor: string
  sliderTrackColor: string

  // Dropdown colors
  dropdownDividerColor: string

  // Button colors
  buttonBackgroundColor: string
  buttonBorderColor: string
  buttonHoverColor: string
  buttonBorderHoverColor: string

  // Toggle button colors
  buttonOnColor: string
  buttonBorderOnColor: string
  buttonTransparentOffColor: string
  buttonHardOffColor: string

  // Delete button colors
  deleteButtonHoverColor: string

  // Disabled button colors
  buttonDisabledColor: string
  buttonDisabledBorderColor: string
  buttonDisabledTextColor: string
  buttonDisabledHoverColor: string

  // Python worker Reset button colors
  buttonResetColor: string
  buttonResetHoverColor: string

  // Zoom buttons
  resetZoomButtonColorCenter: string
  resetZoomButtonColorOffCenter: string

  // Flagged cells
  flaggedCellColor: string

  // Links
  linkColor: string

  // Sctollbar colors
  scrollbarThumbColor: string
  scrollbarTrackColor: string
}
