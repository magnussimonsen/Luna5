// Path : src/renderer/src/stores/llm-assistant/llmAssistantStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

// All path to ollama and latest used run command lives in the main workspace store.
// In this store we store a list of all available models (fetched from the server) when
// the user interacts with the LLM assistant.
export const useLlmAssistantStore = defineStore('llmAssistant', () => {
  const workspace = useWorkspaceStore()

  // Local reactive state
  const availableModels = ref<string[]>([])
  const connectionFlag = ref<boolean>(false)

  return {
    // state (expose the refs)
    availableModels,
    connectionFlag,

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
      availableModels.value = models
    },

    setConnectionFlag: (flag: boolean) => {
      // sets the connection flag
      connectionFlag.value = flag
    },

    // getters and setters to call workspace store such that we can only import this store in components
    // that need to interact with the LLM assistant.
    getRunLlmAssistantCommand: () => workspace.getRunLlmAssistantCommand,
    getUseLlmAssistantStoreServerPath: () => workspace.getUseLlmAssistantStoreServerPath,
    // actions (forwarders)
    setRunLlmAssistantCommand: (command: string) => workspace.setRunLlmAssistantCommand(command),
    setLlmAssistantServerPath: (path: string) => workspace.setLlmAssistantServerPath(path)
  }
})
