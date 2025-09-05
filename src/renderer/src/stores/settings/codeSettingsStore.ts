import { defineStore } from 'pinia'
import {
  getCuratedLightMonacoThemeIds,
  getCuratedDarkMonacoThemeIds,
  builtinMonacoThemes
} from '@renderer/code/monaco/monaco-theme'

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

function pickCuratedOrSaved(saved: string, curated: string[]): string {
  const accepted = new Set<string>([...curated, ...builtinMonacoThemes])
  if (accepted.has(saved)) return saved
  return curated.length ? (curated[0] ?? saved) : saved
}

const initialLightThemeId = (() => {
  const saved = normalizeThemeId(readFromLS(LS_LIGHT, 'vs'))
  const curated = getCuratedLightMonacoThemeIds()
  const picked = pickCuratedOrSaved(saved, curated)
  if (picked !== saved) writeToLS(LS_LIGHT, picked)
  return picked
})()

const initialDarkThemeId = (() => {
  const saved = normalizeThemeId(readFromLS(LS_DARK, 'vs-dark'))
  const curated = getCuratedDarkMonacoThemeIds()
  const picked = pickCuratedOrSaved(saved, curated)
  if (picked !== saved) writeToLS(LS_DARK, picked)
  return picked
})()

export const useCodeSettingsStore = defineStore('codeSettings', {
  state: () => ({
    // Use curated defaults if saved values aren't curated; ensures selects have a value on startup
    lightCodeEditorTheme: initialLightThemeId as string,
    darkCodeEditorTheme: initialDarkThemeId as string
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
