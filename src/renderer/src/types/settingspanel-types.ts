/**
 * Central definition of all settings panel keys used throughout the app.
 *
 * Note: The 'code' key refers to the Python editor panel. Keep the value as 'code'
 * because it must align with persisted state and existing component logic.
 */
export const SETTINGS_PANEL_KEYS = [
  'general',
  'code',
  'cas',
  'geometry',
  'graphical-calculator',
  'spreadsheets',
  'probability',
  'text-editor',
  'llm-assistant'
] as const

export type SettingsPanelKey = (typeof SETTINGS_PANEL_KEYS)[number]

export const DEFAULT_SETTINGS_PANEL: SettingsPanelKey = 'general'

export const isSettingsPanelKey = (value: string): value is SettingsPanelKey =>
  (SETTINGS_PANEL_KEYS as readonly string[]).includes(value)
