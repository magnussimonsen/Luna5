// Reusable utilities for keyboard shortcuts in Luna5
// Centralizes key-combo parsing, focus gating (incl. Monaco),
// simple debug logging, single-registration guard, and event names.

// Toggle debug logging at runtime by setting localStorage key:
//   localStorage.setItem('SHORTCUTS_DEBUG', '1')  // on
//   localStorage.removeItem('SHORTCUTS_DEBUG')     // off
export function shortcutsDebugEnabled(): boolean {
  try {
    return localStorage.getItem('SHORTCUTS_DEBUG') === '1'
  } catch {
    return false
  }
}

export function dlog(...args: unknown[]): void {
  if (shortcutsDebugEnabled()) console.log('[Shortcuts]', ...args)
}

export function getKeyCombo(event: KeyboardEvent): string {
  const keys: string[] = []
  if (event.ctrlKey) keys.push('Ctrl')
  if (event.shiftKey) keys.push('Shift')
  if (event.altKey) keys.push('Alt')
  if (event.metaKey) keys.push('Meta')
  const ignoreKeys = ['Control', 'Shift', 'Alt', 'Meta']
  if (!ignoreKeys.includes(event.key)) {
    keys.push(event.key.length === 1 ? event.key.toUpperCase() : event.key)
  }
  if (keys.length > 1) {
    const mainKey = keys[keys.length - 1]
    const modifiers = keys.slice(0, -1).sort()
    return [...modifiers, mainKey].join('+')
  }
  return keys.join('+')
}

export function getElementContext(target: EventTarget | null): {
  tag: string
  editable: boolean
  insideMonaco: boolean
} {
  if (target instanceof HTMLElement) {
    const tag = target.tagName
    const editable = target.isContentEditable
    const insideMonaco = !!target.closest('.monaco-editor')
    return { tag, editable, insideMonaco }
  }
  return { tag: 'UNKNOWN', editable: false, insideMonaco: false }
}

export function shouldIgnoreKeydown(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const element = target as HTMLElement
  const isEditableTag = ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
  const isContentEditable = element.isContentEditable
  const insideMonaco = !!element.closest('.monaco-editor')
  // Allow inside Monaco; otherwise ignore editable targets
  if (insideMonaco) return false
  return isEditableTag || isContentEditable
}

export function ensureSingleRegistration(flagKey = '__lunaShortcutsRegistered'): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (w[flagKey]) return false
  w[flagKey] = true
  return true
}

export const SHORTCUT_EVENTS = {
  RUN_ACTIVE_PYTHON_CELL: 'luna:run-active-python-cell',
  RUN_ACTIVE_PYTHON_CELL_NEXT: 'luna:run-active-python-cell-next',
  RESET_ACTIVE_PYTHON_CELL: 'luna:reset-active-python-cell'
} as const
