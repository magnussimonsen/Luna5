// shortcuts-global.ts
// ------------------------------------------------------
// Global keyboard shortcut system for the Luna5 renderer
// ------------------------------------------------------
// This module defines and registers global keyboard shortcuts
// for the application. Shortcuts are matched using normalized
// key combinations and can be extended easily by adding to the
// 'shortcuts' array. Shortcuts are ignored when the user is
// focused on an input, textarea, select, or contenteditable field.
//
// Usage:
//   - Add new shortcuts to the 'shortcuts' array.
//   - Each shortcut can have multiple key combinations (e.g., Ctrl+S, Cmd+S).
//   - Handlers can access Pinia stores or perform any action.
//   - Call initializeShortcutsGlobal() once during app startup.

import type { Shortcut } from '@renderer/types/shortcut-types'
import { useModalStore } from '@renderer/stores/UI/modalStore'

// Utility to normalize key events to a string like "Ctrl+S"
// Modifiers are sorted for order-insensitive matching.
function getKeyCombo(e: KeyboardEvent): string {
  const keys: string[] = []
  if (e.ctrlKey) keys.push('Ctrl')
  if (e.shiftKey) keys.push('Shift')
  if (e.altKey) keys.push('Alt')
  if (e.metaKey) keys.push('Meta')
  // Only add the main key if it's not a modifier
  const ignoreKeys = ['Control', 'Shift', 'Alt', 'Meta']
  if (!ignoreKeys.includes(e.key)) {
    keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key)
  }
  // Sort modifiers, keep main key last if present
  if (keys.length > 1) {
    const mainKey = keys[keys.length - 1]
    const modifiers = keys.slice(0, -1).sort()
    return [...modifiers, mainKey].join('+')
  }
  return keys.join('+')
}

// ---------------------------------------------
// Define your global shortcuts here
// Each shortcut can have multiple key combos
// ---------------------------------------------
const shortcuts: Shortcut[] = [
  {
    keys: ['Ctrl+N'],
    handler: () => {
      console.log('New File shortcut triggered')
    }
  },
  {
    keys: ['Ctrl+O'],
    handler: () => {
      console.log('Open File shortcut triggered')
    }
  },
  {
    keys: ['Ctrl+S'],
    handler: () => {
      console.log('Save File shortcut triggered')
    }
  },
  {
    keys: ['Alt+Shift+S', 'Shift+Alt+S'],
    handler: () => {
      // Open the settings modal using the Pinia modal store
      const modalStore = useModalStore()
      modalStore.openSettingsModal()
    }
  }
  // Add more shortcuts as needed...
]

// ------------------------------------------------------
// Registers the global keyboard shortcut listener
// Call this once during app initialization
// ------------------------------------------------------
export function initializeShortcutsGlobal(): void {
  window.addEventListener('keydown', (e) => {
    // Prevent shortcuts from firing when typing in input fields, textareas, selects, or contenteditable
    if (
      e.target instanceof HTMLElement &&
      (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable)
    ) {
      return
    }
    // Normalize the key combo for matching
    const combo = getKeyCombo(e)
    for (const shortcut of shortcuts) {
      if (shortcut.keys.includes(combo)) {
        e.preventDefault()
        shortcut.handler(e)
        break
      }
    }
  })
}
