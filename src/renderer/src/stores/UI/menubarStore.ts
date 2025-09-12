import { defineStore } from 'pinia'
import type { WorkspaceLayoutMode, MenuBarState } from '@renderer/types/workspace-layout-mode-type'

export const useMenuBarStore = defineStore('menubar', {
  state(): MenuBarState {
    return {
      workspaceLayoutMode: 'web'
    }
  },
  actions: {
    setWorkspaceLayoutMode(mode: WorkspaceLayoutMode): void {
      this.workspaceLayoutMode = mode
    },
    toggleA4Preview(): void {
      this.workspaceLayoutMode = this.workspaceLayoutMode === 'a4Preview' ? 'web' : 'a4Preview'
    }
  },
  getters: {
    isA4Preview(state): boolean {
      return state.workspaceLayoutMode === 'a4Preview'
    }
  }
})
