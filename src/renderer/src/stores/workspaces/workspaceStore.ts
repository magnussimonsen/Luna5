import { defineStore } from 'pinia'
import { createEmptyWorkspace } from '@renderer/code/notebook-core/model/workspace-initial'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'

interface State {
  workspace: Workspace | null
  initialized: boolean
}

export const useWorkspaceStore = defineStore('workspace', {
  state: (): State => ({
    workspace: null,
    initialized: false
  }),
  actions: {
    initEmpty(force = false): Workspace {
      if (!this.initialized || force) {
        this.workspace = createEmptyWorkspace()
        this.initialized = true
      }
      return this.workspace!
    },
    reset(): Workspace {
      this.workspace = createEmptyWorkspace()
      this.initialized = false
      return this.workspace
    },
    getWorkspace(): Workspace {
      if (!this.initialized || !this.workspace) {
        return this.initEmpty()
      }
      return this.workspace
    }
  }
})
