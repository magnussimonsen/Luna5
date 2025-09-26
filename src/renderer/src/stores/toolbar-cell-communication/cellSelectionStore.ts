import { defineStore } from 'pinia'

/**
 * Cell Selection Store
 * Single source of truth for which cell is currently selected in the UI.
 * This enables toolbar and other components to react to selection changes
 * without tightly coupling them to specific cell components.
 */

export interface SelectedCellInfo {
  /** Unique identifier of the selected cell */
  id: string
  /** Cell type/kind (e.g., 'python', 'text', etc.) */
  kind: string
  /** Whether the cell is hidden (for UI purposes) */
  hidden?: boolean
  /** Whether the cell is soft-locked (for UI purposes) */
  softLocked?: boolean
  /** Whether the cell is hard-locked (for UI purposes) */
  hardLocked?: boolean
  /** Whether the cell is flagged (for UI purposes) */
  flagged?: boolean
}

interface State {
  /** The currently selected cell, or null if no selection. */
  selectedCell: SelectedCellInfo | null
}

export const useCellSelectionStore = defineStore('cellSelection', {
  state: (): State => ({
    selectedCell: null
  }),
  actions: {
    /** Set the current selection to a specific cell by id and kind. */
    setSelectCell(id: string, kind: string) {
      this.selectedCell = { id, kind }
    },
    /** Clear any active cell selection. */
    clearSelection() {
      this.selectedCell = null
    },
    /** Update the hidden state of the selected cell. */
    updateCellHidden(hidden: boolean) {
      if (this.selectedCell) {
        this.selectedCell.hidden = hidden
      }
    },

    /** Update the soft-locked state of the selected cell. */
    updateCellSoftLocked(softLocked: boolean) {
      if (this.selectedCell) {
        this.selectedCell.softLocked = softLocked
      }
    }
  },
  getters: {
    hasSelection: (state) => !!state.selectedCell,
    selectedCellKind: (state) => state.selectedCell?.kind || null,
    selectedCellId: (state) => state.selectedCell?.id || null,
    selectedCellIsHidden: (state) => state.selectedCell?.hidden || false,
    selectedCellIsSoftLocked: (state) => state.selectedCell?.softLocked || false,
    selectedCellIsHardLocked: (state) => state.selectedCell?.hardLocked || false,
    selectedCellIsFlagged: (state) => state.selectedCell?.flagged || false
  }
})
