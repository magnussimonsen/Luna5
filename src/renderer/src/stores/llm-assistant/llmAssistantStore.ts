// Path : src/renderer/src/stores/llm-assistant/llmAssistantStore.ts

import { defineStore } from 'pinia'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

// Deprecated: this store is kept as a thin proxy for backwards compatibility.
// All state now lives in the main workspace store. Callers should migrate to
// useWorkspaceStore() directly.
export const useLlmAssistantStore = defineStore('llmAssistant', () => {
  const workspace = useWorkspaceStore()

  return {
    // getters
    getRunLlmAssistantCommand: () => workspace.getRunLlmAssistantCommand,
    getUseLlmAssistantStoreServerPath: () => workspace.getUseLlmAssistantStoreServerPath,
    getConnectionFlag: () => workspace.getConnectionFlag,
    // actions (forwarders)
    setRunLlmAssistantCommand: (command: string) => workspace.setRunLlmAssistantCommand(command),
    setLlmAssistantServerPath: (path: string) => workspace.setLlmAssistantServerPath(path),
    setConnectionFlag: (flag: boolean) => workspace.setConnectionFlag(flag)
  }
})
