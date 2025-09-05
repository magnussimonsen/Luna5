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
// We eagerly import theme JSON files so we can synchronously enumerate and define them.
const curatedLightThemeModuleMap = import.meta.glob<{
  default: monaco.editor.IStandaloneThemeData
}>('@renderer/code/monaco/monaco-curated-light-themes/*.json', { eager: true })

const curatedDarkThemeModuleMap = import.meta.glob<{
  default: monaco.editor.IStandaloneThemeData
}>('@renderer/code/monaco/monaco-curated-dark-themes/*.json', { eager: true })

// No legacy fallback: curated themes must live in the split folders above

// Guard to define curated themes only once
let themesRegistered = false

function toSafeThemeId(themeId: string): string {
  // Lowercase, replace any non-alphanumeric with hyphens, collapse repeats, trim edges
  return themeId
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
  const themeIds = new Set<string>()
  // New split folder
  for (const filePath of Object.keys(curatedLightThemeModuleMap)) {
    const rawThemeId =
      filePath
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    themeIds.add(toSafeThemeId(rawThemeId))
  }
  return Array.from(themeIds).sort()
}

export function getCuratedDarkMonacoThemeIds(): string[] {
  const themeIds = new Set<string>()
  // New split folder
  for (const filePath of Object.keys(curatedDarkThemeModuleMap)) {
    const rawThemeId =
      filePath
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    themeIds.add(toSafeThemeId(rawThemeId))
  }
  return Array.from(themeIds).sort()
}

/**
 * Define all curated themes once per app lifetime.
 * Safe to call multiple times.
 */
export function ensureAllMonacoThemesDefined(): void {
  // Define curated themes one time per app lifetime. Safe to call repeatedly.
  if (themesRegistered) return

  // 1) Curated local JSON themes (light)
  for (const [filePath, module] of Object.entries(curatedLightThemeModuleMap)) {
    const rawThemeId =
      filePath
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    const imported = module.default
    if (!imported) continue
    const themeData = imported as unknown as monaco.editor.IStandaloneThemeData
    const safeThemeId = toSafeThemeId(rawThemeId)
    try {
      monaco.editor.defineTheme(safeThemeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }

  // 2) Curated local JSON themes (dark)
  for (const [filePath, module] of Object.entries(curatedDarkThemeModuleMap)) {
    const rawThemeId =
      filePath
        .split('/')
        .pop()
        ?.replace(/\.json$/, '') || 'custom-theme'
    const imported = module.default
    if (!imported) continue
    const themeData = imported as unknown as monaco.editor.IStandaloneThemeData
    const safeThemeId = toSafeThemeId(rawThemeId)
    try {
      monaco.editor.defineTheme(safeThemeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }

  // 3) No legacy folder is supported anymore; themes must be present in the split folders

  themesRegistered = true
}

/**
 * Apply a theme by id. Falls back to Monaco's built-in 'vs' first.
 * Accepts either the filename (without .json) or any string – it will be normalized.
 */
export function applyMonacoTheme(id: string): void {
  ensureAllMonacoThemesDefined()
  const safeThemeId = toSafeThemeId(id)
  try {
    monaco.editor.setTheme('vs')
  } catch {
    /* ignore */
  }
  try {
    monaco.editor.setTheme(safeThemeId)
  } catch {
    /* ignore */
  }
}
