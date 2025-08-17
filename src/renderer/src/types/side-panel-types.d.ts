/* Types for side panel management in the application */
const allowedPanels = ['flashcards', 'notebooks', 'toc', 'variables', 'help']
export type PanelName = (typeof allowedPanels)[number]
