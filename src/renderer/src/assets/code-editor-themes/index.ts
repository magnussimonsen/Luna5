/**
 * Monaco theme registry (curated and built-in IDs only, no runtime side effects).
 *
 * Architecture overview:
 * - Theme sources
 *   1) Built-in Monaco themes: 'vs', 'vs-dark', 'hc-black' (always available, no defineTheme needed).
 *   2) Curated npm themes: imported explicitly from 'monaco-themes' (keeps bundle size small).
 *   3) Local JSON themes: place files under 'assets/code-editor-themes/*.json' (auto-discovered elsewhere).
 *
 * - Responsibilities of this module
 *   • Declare a small curated set of npm themes (explicit imports).
 *   • Expose theme IDs via getAllThemeIds() for the Settings UI.
 *   • Expose the curated theme data via getCustomThemes() so consumers can call monaco.editor.defineTheme.
 *   • Avoid calling Monaco APIs directly here to keep this module side-effect free and tree-shake friendly.
 *
 * - Where themes are registered
 *   • PythonCell.vue calls defineTheme() for all curated themes from getCustomThemes(),
 *     and for any local JSON themes found via Vite import.meta.glob().
 *   • After registration, PythonCell switches theme with monaco.editor.setTheme(themeId)
 *     based on dark/light mode and the Code Settings store.
 *
 * - Why explicit imports (and not a node_modules glob)?
 *   • Glob-importing every theme from 'monaco-themes' would pull dozens of JSON files into the bundle.
 *     By importing a small allowlist, we keep the app lean while still offering popular options.
 *
 * - Adding a new curated theme
 *   1) Import it here from 'monaco-themes/themes/<Name>.json'.
 *   2) Add an entry in customThemes with the desired ID (string used by setTheme()).
 *   3) It will automatically appear in the Settings dropdown via getAllThemeIds().
 */

import type { editor } from 'monaco-editor'
// Curated themes from npm: monaco-themes
// Filenames are case-sensitive; using the canonical names from the package
// Dracula, One Dark, GitHub Light/Dark
// Note: these are JSON theme definitions compatible with monaco.editor.defineTheme
import dracula from 'monaco-themes/themes/Dracula.json'
import twilight from 'monaco-themes/themes/Twilight.json'
import githubLight from 'monaco-themes/themes/GitHub Light.json'
import githubDark from 'monaco-themes/themes/GitHub Dark.json'

export type MonacoThemeId = string

// Built-in Monaco themes
export const builtinThemes: MonacoThemeId[] = ['vs', 'vs-dark', 'hc-black']

// Optional: add your JSON theme files here (imported statically) or via Vite's import.meta.glob.
// Example (uncomment if you add a Dracula.json file to this folder):
// import dracula from './Dracula.json'

// Map of theme id to theme data
export const customThemes: Record<MonacoThemeId, editor.IStandaloneThemeData> = {
  Dracula: dracula as unknown as editor.IStandaloneThemeData,
  Twilight: twilight as unknown as editor.IStandaloneThemeData,
  'GitHub Light': githubLight as unknown as editor.IStandaloneThemeData,
  'GitHub Dark': githubDark as unknown as editor.IStandaloneThemeData
}

export function getAllThemeIds(): MonacoThemeId[] {
  return [...builtinThemes, ...Object.keys(customThemes)]
}

export function getCustomThemes(): Record<MonacoThemeId, editor.IStandaloneThemeData> {
  return customThemes
}
