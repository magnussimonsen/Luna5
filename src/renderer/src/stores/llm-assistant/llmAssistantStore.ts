// Path : src/renderer/src/stores/llm-assistant/llmAssistantStore.ts

import { defineStore } from 'pinia'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

// All path to ollama and latest used run command lives in the main workspace store.
// In this store we store a list of all available models (fetched from the server) when
// the user interacts with the LLM assistant.
export const useLlmAssistantStore = defineStore('llmAssistant', () => {
  const workspace = useWorkspaceStore()

  return {
    // state
    availableModels: [], // List of available models fetched from the server
    // Do we need to add type in type folder?
    connectionFlag: false, // Flag to indicate if we are connected to the server

    // actions
    getAvailableModels: async () => {
      // placholder
      // runs olama list command and gets a list of models and stores them in the list
      // must be async
    },

    getconnectionFlag() {
      // placeholder move function to this store from workspace store
      return workspace.getConnectionFlag
    },

    // setters
    setAvailableModels: (models: string[]) => {
      // sets the list of available models
      this.availableModels = models
    }, // ERROR: Object is possibly 'undefined'.

    setConnectionFlag: (flag: boolean) => {
      // sets the connection flag
      this.connectionFlag = flag
    }, // ERROR: Object is possibly 'undefined'.

    // gettersand setters to call workspace store such that we can only import this store in components
    // that need to interact with the LLM assistant.
    getRunLlmAssistantCommand: () => workspace.getRunLlmAssistantCommand,
    getUseLlmAssistantStoreServerPath: () => workspace.getUseLlmAssistantStoreServerPath,
    // actions (forwarders)
    setRunLlmAssistantCommand: (command: string) => workspace.setRunLlmAssistantCommand(command),
    setLlmAssistantServerPath: (path: string) => workspace.setLlmAssistantServerPath(path)
  }
})
