/* filepath: src/renderer/src/types/colorThemeTypes.d.ts */

// This file defines the ThemeColors type used in the color theme store
// and ensures that the color theme is consistent across the application.

export type ThemeColorTypes = {
  lunaPalatte1: string
  lunaPalatte2: string
  lunaPalatte3: string
  lunaPalatte4: string

  appBackground: string
  menuBackground: string
  menuBackgroundHover: string

  cellBackground: string
  cellBorderColor: string
  cellMarginBackgroundColor: string

  // Python cell
  pythonStdOutBackground: string
  pythonImageBackground: string

  toolbarBackground: string

  mainPanelBackground: string
  sidePanelBackground: string

  textColor: string
  UITextColor: string

  borderColor: string
  dropdownBorderColor: string

  activeBackgroundColor: string
  activeBorderColor: string
  activeBorderColorHover: string

  softLockedColor: string
  cellLockedOverlay: string
  hideCellColor: string

  focusVisibleBorderColor: string

  sliderBackground: string

  dropdownDividerColor: string

  buttonBackgroundColor: string
  buttonBorderColor: string
  buttonHoverColor: string
  buttonBorderHoverColor: string

  buttonOnColor: string
  buttonTransparentOffColor: string
  buttonHardOffColor: string

  deleteButtonHoverColor: string

  // Python worker Reset button colors
  buttonResetPythonWorkerColor: string
  buttonResetPythonWorkerHoverColor: string

  resetZoomButtonColor: string
}
