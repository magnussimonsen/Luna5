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
import Eiffel from '@renderer/code/monaco/monaco-curated-light-themes/Eiffel.json'
import IDLE from '@renderer/code/monaco/monaco-curated-light-themes/IDLE.json'
import TextmateMacClassic from '@renderer/code/monaco/monaco-curated-light-themes/Textmate (Mac Classic).json'
import XcodeDefault from '@renderer/code/monaco/monaco-curated-light-themes/Xcode_default.json'
import Blackboard from '@renderer/code/monaco/monaco-curated-dark-themes/Blackboard.json'
import Sunburst from '@renderer/code/monaco/monaco-curated-dark-themes/Sunburst.json'
import VibrantInk from '@renderer/code/monaco/monaco-curated-dark-themes/Vibrant Ink.json'
// Monaco's built-in themes (always available)
export const builtinMonacoThemes: string[] = ['vs', 'vs-dark', 'hc-black']

// Curated Luna themes. Add new themes here as needed.
const themes = [
  // Light themes
  { id: 'idle', data: IDLE },
  { id: 'eiffel', data: Eiffel },
  { id: 'textmate-mac-classic', data: TextmateMacClassic },
  { id: 'xcode-default', data: XcodeDefault },
  // Dark themes
  { id: 'blackboard', data: Blackboard },
  { id: 'sunburst', data: Sunburst },
  { id: 'vibrant-ink', data: VibrantInk }
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
  // Only expose these curated light themes in the settings dropdown;
  // the builtin 'vs' is already prepended by the settings component.
  return ['idle', 'eiffel', 'textmate-mac-classic', 'xcode-default']
}

// Returns IDs of available dark themes
export function getCuratedDarkMonacoThemeIds(): string[] {
  // Only expose these curated dark themes in the settings dropdown.
  return ['vibrant-ink', 'sunburst', 'blackboard']
}

// Registers all curated themes with Monaco (safe to call multiple times)
export function ensureAllMonacoThemesDefined(): void {
  if (themesRegistered) return
  for (const theme of themes) {
    try {
      // Defensive normalization: ensure tokens and colors are in expected format
      const raw = theme.data as unknown
      const normalized: Record<string, unknown> = { ...(raw as Record<string, unknown>) }

      const rulesCandidate = (raw as Record<string, unknown>)['rules']
      if (Array.isArray(rulesCandidate)) {
        normalized.rules = rulesCandidate.map((r) => {
          const out = { ...(r as Record<string, unknown>) }
          if (typeof out.token === 'string') out.token = out.token.trim()
          if (typeof out.fontStyle === 'string') out.fontStyle = out.fontStyle.trim()
          if (typeof out.foreground === 'string') {
            const fg = (out.foreground as string).trim()
            out.foreground = fg.startsWith('#') ? fg : `#${fg}`
          }
          if (typeof out.background === 'string') {
            const bg = (out.background as string).trim()
            out.background = bg.startsWith('#') ? bg : `#${bg}`
          }
          return out
        })
      }

      const colorsCandidate = (raw as Record<string, unknown>)['colors']
      if (colorsCandidate && typeof colorsCandidate === 'object') {
        const colorsObj = colorsCandidate as Record<string, unknown>
        const colorsCopy: Record<string, string> = {}
        for (const [k, v] of Object.entries(colorsObj)) {
          if (typeof v === 'string') {
            const s = v.trim()
            colorsCopy[k] = s.startsWith('#') ? s : `#${s}`
          }
        }
        normalized.colors = colorsCopy
      }

      monaco.editor.defineTheme(
        theme.id,
        normalized as unknown as monaco.editor.IStandaloneThemeData
      )
    } catch (e) {
      try {
        console.debug('[monaco-theme] failed to define theme', theme.id, e)
      } catch {
        /* ignore */
      }
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
    // ignore errors and fall back to 'vs' only if the requested theme fails
    monaco.editor.setTheme('vs')
  }
}
