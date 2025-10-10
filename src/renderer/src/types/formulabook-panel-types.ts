/**
 * Central definition of all formulabook panel keys used throughout the app.
 *
 * Note: The 'code' key refers to the Python formulabook section. Keep the value as 'code'
 * so existing logic and persisted state remain compatible.
 */
export const FORMULABOOK_PANEL_KEYS = [
  'calculus-formulas-panel',
  'series-formulas-panel',
  'geometry-formulas-panel',
  'combinatorics-formulas-panel',
  'probability-formulas-panel',
  'physics-formulas-panel',
  'chemistry-formulas-panel'
] as const

export type FormulabookPanelKey = (typeof FORMULABOOK_PANEL_KEYS)[number]

export const DEFAULT_FORMULABOOK_PANEL: FormulabookPanelKey = 'calculus-formulas-panel'

export const isFormulabookPanelKey = (value: string): value is FormulabookPanelKey =>
  (FORMULABOOK_PANEL_KEYS as readonly string[]).includes(value)
