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

export const useCodeSettingsStore = defineStore('codeSettings', {
  state: () => ({
    // Load persisted values if available, otherwise default to Monaco built-ins
    lightCodeEditorTheme: readFromLS(LS_LIGHT, 'vs') as string,
    darkCodeEditorTheme: readFromLS(LS_DARK, 'vs-dark') as string
  }),
  actions: {
    setLightCodeEditorTheme(theme: string) {
      this.lightCodeEditorTheme = theme
      writeToLS(LS_LIGHT, theme)
    },
    setDarkCodeEditorTheme(theme: string) {
      this.darkCodeEditorTheme = theme
      writeToLS(LS_DARK, theme)
    }
  }
})
