// src/renderer/src/code/highlight/highlight-colors.ts

import type { HighlightColor, HighlightTokenName } from '../../types/highlight-colors-types'

// Local runtime token maps (keep these here to avoid circular/runtime
// import issues when bundling). These mirror the values defined in the
// types file but are safe runtime values for the app.

/*
TO DO: Currently the highlighting colors for dark and light themes are equal. This is because the editor does not automatically
change the colors when the theme changes. THIS NEEDS TO BE FIXED WHEN I FIGURE OUT HOW TO DO IT.

Possible short-term solution notes:
- Preferred (non-destructive): use a CSS-variable approach. Store token names on marks (e.g. `green-highlighting`) and render
  highlights via attribute selectors/classnames that read per-theme CSS variables on the editor root (toggle `.editor.dark`/`.editor.light`
  or update the variables). Visuals update instantly without rewriting document marks.
- Alternative (destructive): when the theme changes, walk the document and rewrite highlight mark `color` attributes to the
  theme-specific hex values via a TipTap transaction. Works with current hex-based marks but mutates document/history.

Note: TipTap's Highlight extension will inline `background-color` when you pass a hex. To use the CSS approach you'll need to
store token names (or extend the mark renderer to emit a token attribute/class instead of an inline style).
*/

export const HIGHLIGHT_TOKEN_MAP_LIGHT: Record<HighlightTokenName, string> = {
  'orange-highlighting': '#C76E00',
  'green-highlighting': '#5CB85C', // balanced green
  'blue-highlighting': '#4A90E2', // medium blue
  'red-highlighting': '#D9534F' // vivid red
}

export const HIGHLIGHT_TOKEN_MAP_DARK: Record<HighlightTokenName, string> = {
  'orange-highlighting': '#C76E00',
  'green-highlighting': '#5CB85C', // balanced green
  'blue-highlighting': '#4A90E2', // medium blue
  'red-highlighting': '#D9534F' // vivid red
}

// Token list for UI display (names only)
export const HIGHLIGHT_TOKEN_NAMES: HighlightTokenName[] = [
  'orange-highlighting',
  'green-highlighting',
  'blue-highlighting',
  'red-highlighting'
]

// Helper to resolve a token name to a theme-specific hex value
export function resolveTokenToHex(token: HighlightTokenName, isDark: boolean): HighlightColor {
  return (
    isDark ? HIGHLIGHT_TOKEN_MAP_DARK[token] : HIGHLIGHT_TOKEN_MAP_LIGHT[token]
  ) as HighlightColor
}

// Given any HighlightColor (token name or hex), return a concrete hex (still typed as HighlightColor)
export function resolveHighlightColor(color: HighlightColor, isDark: boolean): HighlightColor {
  // If the value matches one of our token names, resolve via map
  if (HIGHLIGHT_TOKEN_NAMES.includes(color as HighlightTokenName)) {
    return resolveTokenToHex(color as HighlightTokenName, isDark)
  }
  // Otherwise assume it's a hex already
  return color
}

// Return array of concrete hex colors suitable for rendering swatches
export function colorsForTheme(isDark: boolean): HighlightColor[] {
  return HIGHLIGHT_TOKEN_NAMES.map((t) => resolveTokenToHex(t, isDark))
}

export function isHighlightColor(v: unknown): v is HighlightColor {
  return typeof v === 'string'
}
