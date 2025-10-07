/**
 * Central definition of all help panel keys used throughout the app.
 *
 * Note: The 'code' key refers to the Python help section. Keep the value as 'code'
 * so existing logic and persisted state remain compatible.
 */
export const HELP_PANEL_KEYS = [
  'general',
  'code',
  'cas',
  'geometry',
  'graphical-calculator',
  'spreadsheets',
  'probability',
  'text-editor'
] as const

export type HelpPanelKey = (typeof HELP_PANEL_KEYS)[number]

export const DEFAULT_HELP_PANEL: HelpPanelKey = 'general'

export const isHelpPanelKey = (value: string): value is HelpPanelKey =>
  (HELP_PANEL_KEYS as readonly string[]).includes(value)
