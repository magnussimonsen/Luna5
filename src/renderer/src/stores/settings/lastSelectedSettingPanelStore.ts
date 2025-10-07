import { defineStore } from 'pinia'
import {
  DEFAULT_SETTINGS_PANEL,
  SETTINGS_PANEL_KEYS,
  isSettingsPanelKey,
  type SettingsPanelKey
} from '@renderer/types/settingspanel-types'

type State = {
  lastSelectedPanel: SettingsPanelKey
}

export const useLastSelectedSettingPanelStore = defineStore('lastSelectedSettingPanel', {
  state: (): State => ({
    lastSelectedPanel: DEFAULT_SETTINGS_PANEL
  }),
  getters: {
    /** Returns the most recently selected settings panel. */
    currentPanel: (state): SettingsPanelKey => state.lastSelectedPanel
  },
  actions: {
    /** Persist the provided settings panel key. */
    setLastSelectedPanel(panel: SettingsPanelKey) {
      if (this.lastSelectedPanel === panel) return

      this.lastSelectedPanel = panel
    },
    /**
     * Guarded setter for values coming from persisted storage or URLs where type safety is weaker.
     */
    applyPersistedPanel(value: string | null | undefined) {
      if (!value) {
        this.lastSelectedPanel = DEFAULT_SETTINGS_PANEL
        return
      }

      this.lastSelectedPanel = isSettingsPanelKey(value) ? value : DEFAULT_SETTINGS_PANEL
    },
    /**
     * Returns a shallow copy of the available panel keys for UI rendering.
     */
    listAvailablePanels(): SettingsPanelKey[] {
      return [...SETTINGS_PANEL_KEYS]
    }
  }
})
