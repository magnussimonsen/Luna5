import { defineStore } from 'pinia'
import { normalizeStringToSafeKebab } from '@renderer/utils/miscellaneous/normalize-string-to-safe-kebab'

/**
 * Code settings store
 * - Persists the selected Monaco Editor theme for light and dark app modes.
 * - On startup, normalizes any previously saved theme IDs and falls back to a curated default.
 * - Public API (state keys + action names) is stable to avoid breaking existing consumers.
 */

// Initial themes: use Monaco built-ins (no persistence)
// const initialLightMonacoThemeId = 'vs'
// const initialDarkMonacoThemeId = 'vs-dark'
const initialLightMonacoThemeId = 'slush-and-poppies' // from monaco-themes
const initialDarkMonacoThemeId = 'vs-dark'

export const useCodeSettingsStore = defineStore('codeSettings', {
  state: () => ({
    // Use curated defaults if saved values aren't curated; ensures selects have a value on startup
    lightCodeEditorTheme: initialLightMonacoThemeId as string,
    darkCodeEditorTheme: initialDarkMonacoThemeId as string,
    // Code quality toggles (moved from generalSettingsStore)
    enableLineNumbersState: true,
    enableCodeLintingState: false,
    enableCodeFormattingState: false,
    enableCodeSuggestionsState: false,
    // Maximum number of Monaco editor instances allowed (user-configurable)
    maxNumberOfMonacoInstances: 4
  }),
  actions: {
    setLightCodeEditorTheme(themeId: string) {
      const normalizedThemeId = normalizeStringToSafeKebab(themeId, 'vs')
      this.lightCodeEditorTheme = normalizedThemeId
    },
    setDarkCodeEditorTheme(themeId: string) {
      const normalizedThemeId = normalizeStringToSafeKebab(themeId, 'vs-dark')
      this.darkCodeEditorTheme = normalizedThemeId
    },
    // Setters for code quality toggles
    setEnableLineNumbers(value: boolean) {
      this.enableLineNumbersState = value
    },
    setEnableCodeLinting(value: boolean) {
      this.enableCodeLintingState = value
    },
    setEnableCodeFormatting(value: boolean) {
      this.enableCodeFormattingState = value
    },
    setEnableCodeSuggestions(value: boolean) {
      this.enableCodeSuggestionsState = value
    },
    // Setter for max number of Monaco instances
    setMaxNumberOfMonacoInstances(value: number) {
      this.maxNumberOfMonacoInstances = value
    }
  }
})
