// Path : src/renderer/src/stores/llm-assistant/llmAssistantStore.ts

import { defineStore } from 'pinia'

export const useLlmAssistantStore = defineStore('llmAssistant', {
  state: () => ({
    runCommand: '',
    serverPath: ''
  }),
  getters: {
    getRunCommand: (state) => state.runCommand,
    getServerPath: (state) => state.serverPath
  },
  actions: {
    setRunCommand(command: string) {
      this.runCommand = command
    },
    setServerPath(path: string) {
      this.serverPath = path
    }
  }
})
