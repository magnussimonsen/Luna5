import { defineStore } from 'pinia'

// Local storage keys for persistence
const LS_LIGHT = 'codeSettings.lightCodeEditorTheme'
const LS_DARK = 'codeSettings.darkCodeEditorTheme'

function readFromLS(key: string, fallback: string): string {
  try {
    const v = window.localStorage?.getItem(key)
    return v && v.trim() ? v : fallback
  } catch {
    return fallback
  }
}

function writeToLS(key: string, value: string): void {
  try {
    window.localStorage?.setItem(key, value)
  } catch {
    // ignore storage failures (e.g., private mode)
  }
}

// Normalize incoming theme IDs to a safe, kebab-case form to match monaco-theme ids
function normalizeThemeId(id: string): string {
  try {
    return id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  } catch {
    return 'vs'
  }
}

export const useCodeSettingsStore = defineStore('codeSettings', {
  state: () => ({
    // Load persisted values if available, otherwise default to Monaco built-ins
    lightCodeEditorTheme: normalizeThemeId(readFromLS(LS_LIGHT, 'vs')) as string,
    darkCodeEditorTheme: normalizeThemeId(readFromLS(LS_DARK, 'vs-dark')) as string
  }),
  actions: {
    setLightCodeEditorTheme(theme: string) {
      const t = normalizeThemeId(theme)
      this.lightCodeEditorTheme = t
      writeToLS(LS_LIGHT, t)
    },
    setDarkCodeEditorTheme(theme: string) {
      const t = normalizeThemeId(theme)
      this.darkCodeEditorTheme = t
      writeToLS(LS_DARK, t)
    }
  }
})
