import { defineStore } from 'pinia'
import {
  DEFAULT_FORMULABOOK_PANEL,
  FORMULABOOK_PANEL_KEYS,
  isFormulabookPanelKey,
  type FormulabookPanelKey
} from '@renderer/types/formulabook-panel-types'

type LastSelectedFormulabookPanelState = {
  lastSelectedPanel: FormulabookPanelKey
}

export const useLastSelectedFormulabookPanelStore = defineStore('lastSelectedFormulabookPanel', {
  state: (): LastSelectedFormulabookPanelState => ({
    lastSelectedPanel: DEFAULT_FORMULABOOK_PANEL
  }),
  getters: {
    currentPanel: (state): FormulabookPanelKey => state.lastSelectedPanel
  },
  actions: {
    setLastSelectedPanel(selectedPanel: FormulabookPanelKey) {
      if (this.lastSelectedPanel === selectedPanel) return

      this.lastSelectedPanel = selectedPanel
    },
    // Trust persisted values only when they match a known panel key; otherwise
    // fall back to the default to avoid displaying an unsupported panel.
    applyPersistedPanel(persistedValue: string | null | undefined) {
      if (!persistedValue) {
        this.lastSelectedPanel = DEFAULT_FORMULABOOK_PANEL
        return
      }

      if (!isFormulabookPanelKey(persistedValue)) {
        this.lastSelectedPanel = DEFAULT_FORMULABOOK_PANEL
        return
      }

      this.lastSelectedPanel = persistedValue
    },
    listAvailablePanels(): FormulabookPanelKey[] {
      return [...FORMULABOOK_PANEL_KEYS]
    }
  }
})
