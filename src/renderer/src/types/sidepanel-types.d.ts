/* Types for side panel management in the application */
const allowedPanels = [
  'flashcards',
  'notebooks',
  'toc',
  'variables',
  'help',
  'settings',
  'localLLMclient',
  'insertKatexMath'
]
export type PanelName = (typeof allowedPanels)[number]
