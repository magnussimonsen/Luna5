/* filepath: src/renderer/src/types/colorThemeTypes.d.ts */

// This file defines the ThemeColors type used in the color theme store
// and ensures that the color theme is consistent across the application.

// This file will be replaced by the types from  colorThemeStoreTestingNewSchema.ts
// once that store is fully adopted and the old one removed.

export type ThemeColorTypes = {
  // Palette (branding / accent colors)
  lunaPalatte1: string
  lunaPalatte2: string
  lunaPalatte3: string
  lunaPalatte4: string
  lunaPalatte5: string
  lunaPalatte6: string
  lunaPalatte7: string

  // Development / debug
  debugColor: string

  // Core backgrounds
  appBackground: string
  webWorkspaceBackground: string
  webWorkspaceBorderColor: string
  modalBackground: string

  // Menu / Toolbar
  menuBackground: string
  topToolbarBackground: string
  topToolbarBorderColor: string

  // A4 / paper workspace
  a4WorkspaceBackground: string
  a4WorkspaceBorderColor: string

  // Sidepanel
  sidepanelBackground: string
  sidepanelBorderColor: string
  resizeRailColor: string
  resizeRailLineColor: string

  // Paper preview
  paperColor: string
  paperBorderColor: string

  // Cell (general)
  cellBackground: string
  cellBorderColor: string
  cellMarginBackgroundColor: string

  // Python cell outputs
  pythonStdOutBackground: string
  pythonImageBackground: string

  // Text / UI
  textColor: string
  UITextColor: string
  UITextHoverColor: string

  // Borders & dividers
  borderColor: string
  dropdownBorderColor: string
  dividerColor: string
  dropdownDividerColor: string

  // Active / selection
  activeBackgroundColor: string
  activeBorderColor: string
  activeBorderColorHover: string

  // Run / action buttons
  runcodeBackgroundColor: string
  runcodeHoverBackgroundColor: string

  // Standard buttons
  buttonBackgroundColor: string
  buttonBorderColor: string
  buttonHoverColor: string
  buttonBorderHoverColor: string
  buttonTransparentOffColor: string

  // Toggle button states
  buttonOnColor: string
  buttonOnColorHover: string
  buttonBorderOnColor: string
  buttonHardOffColor: string

  // Disabled button styles
  buttonDisabledColor: string
  buttonDisabledBorderColor: string
  buttonDisabledTextColor: string
  buttonDisabledHoverColor: string

  // Reset / destructive buttons
  buttonResetColor: string
  buttonResetHoverColor: string
  deleteButtonHoverColor: string

  // Soft lock / locked / hidden
  softLockedColor: string
  cellLockedOverlay: string
  hideCellColor: string

  // Focus / accessibility
  focusVisibleBorderColor: string
  highContrastColor: string

  // Sliders
  sliderBackground: string
  sliderThumbColor: string
  sliderTrackColor: string

  // Zoom controls
  resetZoomButtonColorCenter: string
  resetZoomButtonColorOffCenter: string

  // Flagged cells
  flaggedCellColor: string

  // Links
  linkColor: string

  // Scrollbar
  scrollbarThumbColor: string
  scrollbarTrackColor: string

  // Input fields
  inputFieldBackgroundColor: string
}
