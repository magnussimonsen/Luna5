import { initializeShortcutsGlobal as initializeShortcutsGlobalImpl } from '@renderer/code/shortcuts/shortcuts-global'

export function initializeShortcutsGlobal(): void {
  // Wire up global keyboard shortcuts (renderer scope)
  initializeShortcutsGlobalImpl()
}
