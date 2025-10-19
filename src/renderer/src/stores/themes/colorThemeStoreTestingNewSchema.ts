/*
Example use of CSS variables for theming in the application.
.app            { background: var(--primary-bg); color: var(--text-primary); }
.top-toolbar    { background: var(--toolbar-bg); border-bottom: 1px solid var(--divider); }
.sidepanel      { background: var(--sidepanel-bg); border-right: 1px solid var(--divider); }
.cell           { background: var(--primary-bg); border: 1px solid var(--border); }
.cell.flagged   { outline: 2px solid var(--flagged); }
.cell.locked    { background: var(--locked-bg); }
.cell.locked::after { content:''; position:absolute; inset:0; background: var(--locked-overlay); }

button.primary        { background: var(--primary-accent); border-color: var(--primary-accent); }
button.primary:hover  { background: var(--hover); }
button[disabled]      { color: var(--text-muted); border-color: var(--disabled); background: transparent; }
button.run            { background: var(--primary-success); }
button.run:hover      { background: var(--hover); }

.scroll-area::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); }
.scroll-area::-webkit-scrollbar-track { background: var(--scrollbar-track); }
*/

import { defineStore } from 'pinia'

// ----------------------
// Types
// ----------------------
type Mode = 'light' | 'dark'
type DualColor = { light: string; dark: string }
export type ThemeColorTypesV2 = Record<string, string>

/**
 * Descriptive palette keys (edit here only for now. Move to /types later)
 */
type Palette = {
  PrimaryBg: DualColor
  SecondaryBg: DualColor
  TertiaryBg: DualColor
  //QuaternaryBg: DualColor

  PrimaryAccent: DualColor
  SecondaryAccent: DualColor
  TertiaryAccent: DualColor
  //QuaternaryAccent: DualColor

  WebLayoutBg: DualColor
  A4LayoutBg: DualColor

  MenubarBg: DualColor
  MenubarBorder: DualColor

  TopToolbarBg: DualColor
  TopToolbarBorder: DualColor

  SidepanelBorder: DualColor
  SidepanelBg: DualColor

  BottomPanelBg: DualColor
  BottomPanelBorder: DualColor

  StatusbarBg: DualColor
  StatusbarBorder: DualColor

  CellGutterBg: DualColor
  CellBorder: DualColor
  CellSelectedBorder: DualColor
  CellNotSelectedBorder: DualColor

  SelectedButtonBorder: DualColor
  NotSelectedButtonBorder: DualColor
  PanelBorder: DualColor

  //resizeRailColor: DualColor
  //resizeRailLineColor: DualColor

  PrimarySuccess: DualColor
  //PrimarySuccsessHover: DualColor
  SecondarySuccess: DualColor
  //SecondarySuccessHover: DualColor
  Warning: DualColor
  //WarningHover: DualColor
  Danger: DualColor
  //DangerHover: DualColor
  Info: DualColor
  Selected: DualColor
  Disabled: DualColor

  TextPrimary: DualColor
  TextMuted: DualColor
  TextLink: DualColor

  Divider: DualColor

  BasicHover: DualColor
  KatexHoverBg: DualColor

  ScrollbarThumb: DualColor
  ScrollbarTrack: DualColor

  LockedOverlay: DualColor
  LockedBg: DualColor
  Flagged: DualColor

  Debug: DualColor
  HighContrastText: DualColor
}

// ----------------------
// Unified palette definition
// ----------------------
const basePalette: Palette = {
  PrimaryBg: { light: '#ffffff', dark: '#222222' },
  SecondaryBg: { light: '#f5f5f5', dark: '#2c2c2c' },
  TertiaryBg: { light: '#f0f0f0', dark: '#2f2f2f' },

  WebLayoutBg: { light: '#ffffff', dark: '#202020' },
  A4LayoutBg: { light: '#ffffff', dark: '#2b2b2b' },

  MenubarBg: { light: '#f7f7f7', dark: '#111111' },
  MenubarBorder: { light: 'gainsboro', dark: '#333333' },

  TopToolbarBg: { light: '#f7f7f7', dark: '#111111' },
  TopToolbarBorder: { light: 'gainsboro', dark: '#333333' },

  SidepanelBorder: { light: '#e0e0e0', dark: '#444444' },
  SidepanelBg: { light: '#eeeeee', dark: '#2a2a2a' },

  BottomPanelBg: { light: '#f9fafb', dark: '#1f1f1f' },
  BottomPanelBorder: { light: '#d1d5db', dark: '#3a3a3a' },

  StatusbarBg: { light: '#f7f7f7', dark: '#111111' },
  StatusbarBorder: { light: 'gainsboro', dark: '#333333' },

  CellGutterBg: { light: '#eaeaea', dark: '#333333' },
  CellBorder: { light: '#d1d5db', dark: '#3f3f46' },
  CellSelectedBorder: { light: '#2fc97f', dark: '#26b07c' },
  CellNotSelectedBorder: { light: '#d1d5db', dark: '#3f3f46' },

  PrimaryAccent: { light: '#2fc97f', dark: '#26b07c' },
  SecondaryAccent: { light: '#3b82f6', dark: '#60a5fa' },
  TertiaryAccent: { light: '#f59e0b', dark: '#f59e0b' },

  SelectedButtonBorder: { light: '#2fc97f', dark: '#26b07c' },
  NotSelectedButtonBorder: { light: '#3b82f6', dark: '#60a5fa' },
  PanelBorder: { light: '#f59e0b', dark: '#f59e0b' },

  PrimarySuccess: { light: '#22c55e', dark: '#22c55e' },
  SecondarySuccess: { light: '#16a34a', dark: '#16a34a' },
  Warning: { light: '#f59e0b', dark: '#f59e0b' },
  Danger: { light: '#ef4444', dark: '#ef4444' },
  Info: { light: '#3b82f6', dark: '#60a5fa' },
  Selected: { light: '#bbf7d0', dark: '#14532d' }, // Selected cell border, selected button bg
  Disabled: { light: '#bdbdbd', dark: '#555555' },

  TextPrimary: { light: '#222222', dark: '#cccccc' },
  TextMuted: { light: '#6b7280', dark: '#9ca3af' },
  TextLink: { light: '#3b82f6', dark: '#60a5fa' },
  Divider: { light: 'gainsboro', dark: '#444444' },

  BasicHover: { light: '#e5e7eb', dark: '#3a3a3a' },
  KatexHoverBg: { light: '#f0f9ff', dark: '#1e293b' },

  ScrollbarThumb: { light: 'gray', dark: '#555555' },
  ScrollbarTrack: { light: 'lightgray', dark: '#111111' },

  LockedOverlay: { light: 'rgba(0,0,0,0.04)', dark: 'rgba(255,255,255,0.06)' },
  LockedBg: { light: '#fff2cc', dark: '#3a301e' },
  Flagged: { light: 'darksalmon', dark: 'darkred' },

  Debug: { light: 'red', dark: 'red' },
  HighContrastText: { light: '#000000', dark: '#ffffff' }
}

// ----------------------
// Helpers
// ----------------------
function extractPalette(mode: Mode): ThemeColorTypesV2 {
  const out: ThemeColorTypesV2 = {}
  for (const [k, v] of Object.entries(basePalette) as [keyof Palette, DualColor][]) {
    out[k] = v[mode]
  }
  return out
}

function setCssVars(map: ThemeColorTypesV2): void {
  const root = document.documentElement
  for (const [key, value] of Object.entries(map)) {
    const varName = '--' + key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    root.style.setProperty(varName, value)
  }
}

// ----------------------
// Store with your original action names
// ----------------------
export const useThemeStoreV2 = defineStore('theme', {
  state: () => {
    const lightTokens = extractPalette('light')
    const darkTokens = extractPalette('dark')
    return {
      isDarkMode: false,
      lightTheme: { ...lightTokens },
      darkTheme: { ...darkTokens }
    }
  },

  actions: {
    getIsDarkMode() {
      return this.isDarkMode
    },

    toggleIsDarkMode() {
      this.isDarkMode = !this.isDarkMode
      const themeColors = this.isDarkMode ? this.darkTheme : this.lightTheme
      this.applyTheme(themeColors)
    },

    setLightTheme(colors: ThemeColorTypesV2) {
      const derived = extractPalette('light')
      this.isDarkMode = false
      this.lightTheme = { ...derived, ...colors }
      this.applyTheme(this.lightTheme)
    },

    setDarkTheme(colors: ThemeColorTypesV2) {
      const derived = extractPalette('dark')
      this.isDarkMode = true
      this.darkTheme = { ...derived, ...colors }
      this.applyTheme(this.darkTheme)
    },

    applyTheme(colors: ThemeColorTypesV2) {
      setCssVars(colors)
      const root = document.documentElement
      root.dataset.theme = this.isDarkMode ? 'dark' : 'light'
      root.style.setProperty('--color-scheme', this.isDarkMode ? 'dark' : 'light')
    },

    getLightTheme() {
      return this.lightTheme
    },
    getDarkTheme() {
      return this.darkTheme
    }
  }
})
