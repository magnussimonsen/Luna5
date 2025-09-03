/* eslint-disable */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { getCustomThemes } from '@renderer/assets/code-editor-themes'

// Eagerly discover local JSON themes placed under assets/code-editor-themes
// NOTE: Vite alias @renderer points to src/renderer/src
const localThemeModules = import.meta.glob('@renderer/assets/code-editor-themes/*.json', {
  eager: true
})

let themesDefined = false

function toSafeId(id: string): string {
  // Lowercase, replace any non-alphanumeric with hyphens, collapse repeats, trim edges
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ensureAllMonacoThemesDefined(): void {
  if (themesDefined) return
  // 1) Curated npm themes from central registry
  const curated = getCustomThemes()
  for (const [id, data] of Object.entries(curated)) {
    const themeData = data as unknown as monaco.editor.IStandaloneThemeData
    const safeId = toSafeId(id)
    try {
      // Define only the safe ID to avoid "Illegal theme name" on IDs with spaces/uppercase
      monaco.editor.defineTheme(safeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }
  // 2) Local JSON themes
  for (const [p, mod] of Object.entries(localThemeModules)) {
  const rawId = p.split('/').pop()?.replace(/\.json$/, '') || 'custom-theme'
  const data = (mod as any).default
  if (!data) continue
  const themeData = data as unknown as monaco.editor.IStandaloneThemeData
  const safeId = toSafeId(rawId)
    try {
      monaco.editor.defineTheme(safeId, themeData)
    } catch {
      // ignore define errors for individual themes
    }
  }
  themesDefined = true
}

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
