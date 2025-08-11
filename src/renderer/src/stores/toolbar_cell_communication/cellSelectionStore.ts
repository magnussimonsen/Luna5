import { defineStore } from 'pinia'

export interface SelectedCellInfo {
  id: string
  kind: string
}

interface State {
  selected: SelectedCellInfo | null
}

export const useCellSelectionStore = defineStore('cellSelection', {
  state: (): State => ({
    selected: null
  }),
  actions: {
    selectCell(id: string, kind: string) {
      this.selected = { id, kind }
    },
    clearSelection() {
      this.selected = null
    }
  },
  getters: {
    hasSelection: (s) => !!s.selected,
    selectedKind: (s) => s.selected?.kind || null,
    selectedId: (s) => s.selected?.id || null
  }
})
