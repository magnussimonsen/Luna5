import { defineStore } from 'pinia'

export interface SelectedCellInfo {
  id: string
  kind: string
}

interface State {
  selectedCell: SelectedCellInfo | null
}

export const useCellSelectionStore = defineStore('cellSelection', {
  state: (): State => ({
    selectedCell: null
  }),
  actions: {
    setSelectCell(id: string, kind: string) {
      this.selectedCell = { id, kind }
    },
    clearSelection() {
      this.selectedCell = null
    }
  },
  getters: {
    hasSelection: (s) => !!s.selectedCell,
    selectedCellKind: (s) => s.selectedCell?.kind || null,
    selectedCellId: (s) => s.selectedCell?.id || null
  }
})
