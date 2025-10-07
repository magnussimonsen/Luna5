import { defineStore } from 'pinia'
import {
  DEFAULT_HELP_PANEL,
  HELP_PANEL_KEYS,
  isHelpPanelKey,
  type HelpPanelKey
} from '@renderer/types/helppanel-types'

type LastSelectedHelpPanelState = {
  lastSelectedPanel: HelpPanelKey
}

export const useLastSelectedHelpPanelStore = defineStore('lastSelectedHelpPanel', {
  state: (): LastSelectedHelpPanelState => ({
    lastSelectedPanel: DEFAULT_HELP_PANEL
  }),
  getters: {
    currentPanel: (state): HelpPanelKey => state.lastSelectedPanel
  },
  actions: {
    setLastSelectedPanel(selectedPanel: HelpPanelKey) {
      if (this.lastSelectedPanel === selectedPanel) return

      this.lastSelectedPanel = selectedPanel
    },
    // Trust persisted values only when they match a known panel key; otherwise
    // fall back to the default to avoid displaying an unsupported panel.
    applyPersistedPanel(persistedValue: string | null | undefined) {
      if (!persistedValue) {
        this.lastSelectedPanel = DEFAULT_HELP_PANEL
        return
      }

      if (!isHelpPanelKey(persistedValue)) {
        this.lastSelectedPanel = DEFAULT_HELP_PANEL
        return
      }

      this.lastSelectedPanel = persistedValue
    },
    listAvailablePanels(): HelpPanelKey[] {
      return [...HELP_PANEL_KEYS]
    }
  }
})
