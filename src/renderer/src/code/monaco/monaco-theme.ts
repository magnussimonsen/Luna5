// Monaco Theme Management
//
// This module registers a fixed set of curated Monaco Editor themes for Luna.
// To add or change themes, import the JSON files here and update the 'themes' array below.
// Usage:
//   - Call applyMonacoTheme('theme-id') to switch themes (e.g. 'dracula', 'solarized-light').
//   - Theme IDs are normalized to lowercase and hyphens.
//   - Only themes listed in 'themes' are available; built-in Monaco themes are also supported.
//
// If you add a new theme JSON file, import it at the top and add it to the 'themes' array.
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import SlushAndPoppies from '@renderer/code/monaco/monaco-curated-light-themes/Slush and Poppies.json'
import SolarizedLight from '@renderer/code/monaco/monaco-curated-light-themes/Solarized-light.json'
import Dracula from '@renderer/code/monaco/monaco-curated-dark-themes/Dracula.json'

// Monaco's built-in themes (always available)
export const builtinMonacoThemes: string[] = ['vs', 'vs-dark', 'hc-black']

// Curated Luna themes. Add new themes here as needed.
const themes = [
  { id: 'slush-and-poppies', data: SlushAndPoppies },
  { id: 'solarized-light', data: SolarizedLight },
  { id: 'dracula', data: Dracula }
]

let themesRegistered = false

// Normalize theme IDs to lowercase and hyphens for consistency
function toSafeThemeId(themeId: string): string {
  return themeId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Returns IDs of available light themes
export function getCuratedLightMonacoThemeIds(): string[] {
  return ['slush-and-poppies', 'solarized-light']
}

// Returns IDs of available dark themes
export function getCuratedDarkMonacoThemeIds(): string[] {
  return ['dracula']
}

// Registers all curated themes with Monaco (safe to call multiple times)
export function ensureAllMonacoThemesDefined(): void {
  if (themesRegistered) return
  for (const theme of themes) {
    try {
      monaco.editor.defineTheme(theme.id, theme.data as monaco.editor.IStandaloneThemeData)
    } catch {
      // ignore define errors for individual themes
    }
  }
  themesRegistered = true
}

// Applies a theme by ID (falls back to 'vs' if not found)
export function applyMonacoTheme(id: string): void {
  ensureAllMonacoThemesDefined()
  const safeThemeId = toSafeThemeId(id)
  try {
    monaco.editor.setTheme(safeThemeId)
  } catch {
    // ignore errors
  }
  try {
    monaco.editor.setTheme('vs')
  } catch {
    // ignore errors
  }
}
