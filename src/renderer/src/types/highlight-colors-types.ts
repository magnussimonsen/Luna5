// src/renderer/src/types/highlight-colors-types.ts

// Allowed highlight tokens used in the UI TipTap toolbar and elsewhere

// HighlightColor can be either a token name or a concrete hex color string
export type HexColor = `#${string}`
export type HighlightColor =
  | HexColor
  | 'orange-highlighting'
  | 'green-highlighting'
  | 'blue-highlighting'
  | 'red-highlighting'

// Named token keys used in some parts of the UI. These map to concrete
// hex values depending on theme (light/dark). Keeping the token names
// here ensures type-safety when storing or comparing token values.
export type HighlightTokenName =
  | 'orange-highlighting'
  | 'green-highlighting'
  | 'blue-highlighting'
  | 'red-highlighting'

// Map of token name -> hex for light theme
// Note: concrete hex maps live in the runtime helper
// `src/renderer/src/code/highlight/highlight-colors.ts` to avoid
// duplicating runtime values in a types-only module.
