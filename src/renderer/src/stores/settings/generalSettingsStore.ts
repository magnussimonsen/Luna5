import { defineStore } from 'pinia'
import { AutosaveOption } from '@renderer/types/auto-save-options-types'

// Not all general settings are stored here
// Language settings are stored in languageStore.ts
// Font related settings are stored in the fonts stores

export const useGeneralSettingsStore = defineStore('generalSettings', {
  state: () => ({
    autosaveChangeIntervalState: 0 as AutosaveOption, // 0 = off, 1/5/10/15/25/50/100 = save after N changes
    warnOnDeleteCellState: true,
    showCellIndexNumbersState: true,
    showUserMetadataInA4PreviewState: false
  }),
  // Code editor specific toggles moved to codeSettingsStore.ts
  actions: {
    setAutosaveChangeInterval(option: AutosaveOption) {
      this.autosaveChangeIntervalState = option
    },
    setWarnOnDeleteCell(value: boolean) {
      this.warnOnDeleteCellState = value
    },
    setShowCellIndexNumbers(value: boolean) {
      this.showCellIndexNumbersState = value
    },
    setShowUserMetadataInA4Preview(value: boolean) {
      this.showUserMetadataInA4PreviewState = value
    }
  },
  getters: {
    autosaveChangeIntervalGetter: (state) => {
      return state.autosaveChangeIntervalState
    },
    warnOnDeleteCellGetter: (state) => {
      return state.warnOnDeleteCellState
    },
    showCellIndexNumbersGetter: (state) => {
      return state.showCellIndexNumbersState
    },
    showUserMetadataInA4PreviewGetter: (state) => {
      return state.showUserMetadataInA4PreviewState
    }
  }
})
