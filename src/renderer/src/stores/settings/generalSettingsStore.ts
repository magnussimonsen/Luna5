import { defineStore } from 'pinia'
import { AutosaveOption } from '@renderer/types/auto-save-options-types'

// Not all general settings are stored here
// Language settings are stored in languageStore.ts
// Font related settings are stored in the fonts stores

export const useGeneralSettingsStore = defineStore('generalSettings', {
  state: () => ({
    autosaveChangeIntervalState: 0 as AutosaveOption, // 0 = off, 5/10/25/50 = save after N changes
    warnOnDeleteCellState: true,
    showCellIndexNumbersState: true,
    enableCodeLintingState: true,
    enableCodeFormattingState: true,
    enableCodeSuggestionsState: true,
    enableCodeNavigationState: true
  }),
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
    setEnableCodeLinting(value: boolean) {
      this.enableCodeLintingState = value
    },
    setEnableCodeFormatting(value: boolean) {
      this.enableCodeFormattingState = value
    },
    setEnableCodeSuggestions(value: boolean) {
      this.enableCodeSuggestionsState = value
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
    enableCodeLintingGetter: (state) => {
      return state.enableCodeLintingState
    },
    enableCodeFormattingGetter: (state) => {
      return state.enableCodeFormattingState
    },
    enableCodeSuggestionsGetter: (state) => {
      return state.enableCodeSuggestionsState
    }
  }
})
