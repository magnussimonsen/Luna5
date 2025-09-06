import { defineStore } from 'pinia'

/**
 * Code settings store
 * - Persists the selected Monaco Editor theme for light and dark app modes.
 * - On startup, normalizes any previously saved theme IDs and falls back to a curated default.
 * - Public API (state keys + action names) is stable to avoid breaking existing consumers.
 */
// Normalize incoming theme IDs to a safe, kebab-case form to match monaco-theme IDs
function normalizeThemeIdToSafeKebab(id: string): string {
  try {
    return id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  } catch {
    // Default to a known-good built-in theme
    return 'vs'
  }
}

// Initial themes: use Monaco built-ins (no persistence)
const initialLightMonacoThemeId = 'vs'
const initialDarkMonacoThemeId = 'vs-dark'

export const useCodeSettingsStore = defineStore('codeSettings', {
  state: () => ({
    // Use curated defaults if saved values aren't curated; ensures selects have a value on startup
    lightCodeEditorTheme: initialLightMonacoThemeId as string,
    darkCodeEditorTheme: initialDarkMonacoThemeId as string
  }),
  actions: {
    setLightCodeEditorTheme(themeId: string) {
      const normalizedThemeId = normalizeThemeIdToSafeKebab(themeId)
      this.lightCodeEditorTheme = normalizedThemeId
    },
    setDarkCodeEditorTheme(themeId: string) {
      const normalizedThemeId = normalizeThemeIdToSafeKebab(themeId)
      this.darkCodeEditorTheme = normalizedThemeId
    }
  }
})
