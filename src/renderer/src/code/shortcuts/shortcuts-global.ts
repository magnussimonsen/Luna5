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

import {
  dlog,
  getKeyCombo,
  getElementContext,
  shouldIgnoreKeydown,
  ensureSingleRegistration,
  SHORTCUT_EVENTS
} from '@renderer/utils/shortcuts'

import type { Shortcut } from '@renderer/types/shortcut-types'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
// No direct execution imports needed when delegating to the toolbar button
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

// ---------------------------------------------
// Define your global shortcuts here
// Each shortcut can have multiple key combos
// ---------------------------------------------
const shortcuts: Shortcut[] = [
  // Run active cell (Ctrl/Cmd+Enter) - currently enabled for python cells only
  {
    keys: ['Ctrl+Enter', 'Meta+Enter'],
    handler: async () => {
      dlog('Ctrl/Cmd+Enter handler invoked')
      const selection = useCellSelectionStore()
      const workspace = useWorkspaceStore()
      const cellId = selection.selectedCellId as string | null
      const kind = selection.selectedCellKind as string | null
      // Guard: only when a python cell is selected
      if (!cellId || kind !== 'python-cell') {
        dlog('No python cell selected; abort', { cellId, kind })
        return
      }
      // Emit a global event; the Python toolbar listens and runs if possible
      window.dispatchEvent(new Event(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL))
      // Fallback: ensure a notebook is selected to keep app state consistent
      workspace.currentNotebookId || workspace.ensureDefaultNotebook()
      dlog('Dispatched global run event and ensured a notebook is selected')
    }
  },
  // Run active cell and select next (Shift+Enter) - python only for now
  {
    keys: ['Shift+Enter'],
    handler: async () => {
      dlog('Shift+Enter handler invoked')
      const selection = useCellSelectionStore()
      const workspace = useWorkspaceStore()
      const cellId = selection.selectedCellId as string | null
      const kind = selection.selectedCellKind as string | null
      if (!cellId || kind !== 'python-cell') {
        dlog('No python cell selected; abort run-next', { cellId, kind })
        return
      }
      window.dispatchEvent(new Event(SHORTCUT_EVENTS.RUN_ACTIVE_PYTHON_CELL_NEXT))
      workspace.currentNotebookId || workspace.ensureDefaultNotebook()
      dlog('Dispatched global run-next event and ensured a notebook is selected')
    }
  },
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
  // Idempotent: avoid attaching multiple listeners on HMR or double init
  if (!ensureSingleRegistration()) {
    dlog('Global keydown listener already attached; skipping')
    return
  }
  dlog('Attaching global keydown listener')
  window.addEventListener('keydown', (e) => {
    // Prevent shortcuts in typical editable fields, but allow inside Monaco
    const ctx = getElementContext(e.target)
    if (shouldIgnoreKeydown(e.target)) {
      dlog('Keydown ignored due to focus on editable element', ctx)
      return
    }
    if (ctx.insideMonaco) {
      dlog('Keydown allowed inside Monaco editor', ctx)
    }
    // Normalize the key combo for matching
    const combo = getKeyCombo(e)
    dlog('Keydown', {
      key: e.key,
      combo,
      ctrl: e.ctrlKey,
      shift: e.shiftKey,
      alt: e.altKey,
      meta: e.metaKey
    })
    for (const shortcut of shortcuts) {
      const match = shortcut.keys.includes(combo)
      if (match) {
        dlog('Shortcut match', { combo, keys: shortcut.keys })
        e.preventDefault()
        shortcut.handler(e)
        break
      } else {
        // Uncomment for very verbose logging of non-matches
        // dlog('No match for combo', { combo, candidate: shortcut.keys })
      }
    }
  })
}
