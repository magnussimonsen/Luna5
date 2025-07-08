/* Types for keyboard shortcuts */
export type ShortcutHandler = (e: KeyboardEvent) => void

export interface Shortcut {
  keys: string[] // e.g. ["Ctrl+S", "Cmd+S"]
  handler: ShortcutHandler
}
