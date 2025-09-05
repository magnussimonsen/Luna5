import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

/**
 * Monaco theme management (curated, simple, well-documented).
 *
 * How it works:
 * - Place JSON theme files under the split folders:
 *   - src/renderer/src/code/monaco/monaco-curated-light-themes
 *   - src/renderer/src/code/monaco/monaco-curated-dark-themes
 * - We eagerly import those JSON files at build time (fast and synchronous)
 * - We define each theme in Monaco using a sanitized, safe theme id
 * - Consumers can call applyMonacoTheme('friendly id') without worrying about exact filenames
 *
 * Why curated local files instead of importing straight from node_modules?
 * - Stability: node_modules internal file layouts can change; our app shouldn’t rely on them
 * - Size control: we can pick a subset instead of bundling every theme
 * - Clarity: the folder clearly shows what ships with the app
 */

// Discover curated JSON themes (split into light and dark collections).
// NOTE: Vite alias @renderer points to src/renderer/src
const curatedLightThemeModules = import.meta.glob<{
  default: monaco.editor.IStandaloneThemeData
}>('@renderer/code/monaco/monaco-curated-light-themes/*.json', { eager: true })

const curatedDarkThemeModules = import.meta.glob<{
  default: monaco.editor.IStandaloneThemeData
}>('@renderer/code/monaco/monaco-curated-dark-themes/*.json', { eager: true })

// No legacy fallback: curated themes must live in the split folders above

let themesDefined = false

function toSafeId(id: string): string {
  // Lowercase, replace any non-alphanumeric with hyphens, collapse repeats, trim edges
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Monaco's built-in theme IDs (always available)
export const builtinMonacoThemes: string[] = ['vs', 'vs-dark', 'hc-black']

/**
 * Return the list of curated theme IDs derived from JSON filenames in the curated folder.
 * IDs are normalized via toSafeId (e.g., "GitHub Dark" -> "github-dark").
 */
export function getCuratedLightMonacoThemeIds(): string[] {
  const ids = new Set<string>()
  // New split folder
  for (const p of Object.keys(curatedLightThemeModules)) {
    const rawId =
      p
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    ids.add(toSafeId(rawId))
  }
  return Array.from(ids).sort()
}

export function getCuratedDarkMonacoThemeIds(): string[] {
  const ids = new Set<string>()
  // New split folder
  for (const p of Object.keys(curatedDarkThemeModules)) {
    const rawId =
      p
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    ids.add(toSafeId(rawId))
  }
  return Array.from(ids).sort()
}

/**
 * Define all curated themes once per app lifetime.
 * Safe to call multiple times.
 */
export function ensureAllMonacoThemesDefined(): void {
  if (themesDefined) return

  // 1) Curated local JSON themes (light)
  for (const [p, mod] of Object.entries(curatedLightThemeModules)) {
    const rawId =
      p
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    const data = mod.default
    if (!data) continue
    const themeData = data as unknown as monaco.editor.IStandaloneThemeData
    const safeId = toSafeId(rawId)
    try {
      monaco.editor.defineTheme(safeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }

  // 2) Curated local JSON themes (dark)
  for (const [p, mod] of Object.entries(curatedDarkThemeModules)) {
    const rawId =
      p
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    const data = mod.default
    if (!data) continue
    const themeData = data as unknown as monaco.editor.IStandaloneThemeData
    const safeId = toSafeId(rawId)
    try {
      monaco.editor.defineTheme(safeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }

  // 3) No legacy folder is supported anymore; themes must be present in the split folders

  themesDefined = true
}

/**
 * Apply a theme by id. Falls back to Monaco's built-in 'vs' first.
 * Accepts either the filename (without .json) or any string – it will be normalized.
 */
export function applyMonacoTheme(id: string): void {
  ensureAllMonacoThemesDefined()
  const safeId = toSafeId(id)
  try {
    monaco.editor.setTheme('vs')
  } catch {
    /* ignore */
  }
  try {
    monaco.editor.setTheme(safeId)
  } catch {
    /* ignore */
  }
}
