import { defineStore } from 'pinia'
import {
  getCuratedLightMonacoThemeIds,
  getCuratedDarkMonacoThemeIds,
  builtinMonacoThemes
} from '@renderer/code/monaco/monaco-theme'

/**
 * Code settings store
 * - Persists the selected Monaco Editor theme for light and dark app modes.
 * - On startup, normalizes any previously saved theme IDs and falls back to a curated default.
 * - Public API (state keys + action names) is stable to avoid breaking existing consumers.
 */

// LocalStorage keys used for persistence of the user's theme selections
const LOCAL_STORAGE_LIGHT_THEME_KEY = 'codeSettings.lightCodeEditorTheme'
const LOCAL_STORAGE_DARK_THEME_KEY = 'codeSettings.darkCodeEditorTheme'

// Safe LocalStorage read with fallback; trims empty strings to fallback
function readLocalStorageString(key: string, fallback: string): string {
  try {
    const value = window.localStorage?.getItem(key)
    return value && value.trim() ? value : fallback
  } catch {
    // In private mode or blocked storage, just use fallback
    return fallback
  }
}

// Safe LocalStorage write; ignore failures (private mode, quotas, etc.)
function writeLocalStorageString(key: string, value: string): void {
  try {
    window.localStorage?.setItem(key, value)
  } catch {
    // Intentionally ignored
  }
}

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

// Choose a valid theme ID: if a saved one is accepted, keep it; else pick the first curated or fall back to saved
function chooseBestAvailableThemeId(savedThemeId: string, curatedThemeIds: string[]): string {
  const acceptedThemesSet = new Set<string>([...curatedThemeIds, ...builtinMonacoThemes])
  if (acceptedThemesSet.has(savedThemeId)) return savedThemeId
  return curatedThemeIds.length ? (curatedThemeIds[0] ?? savedThemeId) : savedThemeId
}

// Compute initial light theme: normalize saved -> validate against curated/built-ins -> persist correction if needed
const initialLightMonacoThemeId = (() => {
  const savedThemeId = normalizeThemeIdToSafeKebab(
    readLocalStorageString(LOCAL_STORAGE_LIGHT_THEME_KEY, 'vs')
  )
  const curatedThemeIds = getCuratedLightMonacoThemeIds()
  const pickedThemeId = chooseBestAvailableThemeId(savedThemeId, curatedThemeIds)
  if (pickedThemeId !== savedThemeId) {
    writeLocalStorageString(LOCAL_STORAGE_LIGHT_THEME_KEY, pickedThemeId)
  }
  return pickedThemeId
})()

// Compute initial dark theme: normalize saved -> validate -> persist correction if needed
const initialDarkMonacoThemeId = (() => {
  const savedThemeId = normalizeThemeIdToSafeKebab(
    readLocalStorageString(LOCAL_STORAGE_DARK_THEME_KEY, 'vs-dark')
  )
  const curatedThemeIds = getCuratedDarkMonacoThemeIds()
  const pickedThemeId = chooseBestAvailableThemeId(savedThemeId, curatedThemeIds)
  if (pickedThemeId !== savedThemeId) {
    writeLocalStorageString(LOCAL_STORAGE_DARK_THEME_KEY, pickedThemeId)
  }
  return pickedThemeId
})()

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
      writeLocalStorageString(LOCAL_STORAGE_LIGHT_THEME_KEY, normalizedThemeId)
    },
    setDarkCodeEditorTheme(themeId: string) {
      const normalizedThemeId = normalizeThemeIdToSafeKebab(themeId)
      this.darkCodeEditorTheme = normalizedThemeId
      writeLocalStorageString(LOCAL_STORAGE_DARK_THEME_KEY, normalizedThemeId)
    }
  }
})
