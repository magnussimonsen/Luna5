import { defineStore } from 'pinia'
import type { WorkspaceLayoutMode, MenubarState } from '@renderer/types/workspace-layout-mode-type'

export const useMenubarStore = defineStore('menubar', {
  state(): MenubarState {
    return {
      workspaceLayoutMode: 'fluid'
    }
  },
  actions: {
    setWorkspaceLayoutMode(mode: WorkspaceLayoutMode): void {
      this.workspaceLayoutMode = mode
    },
    toggleA4Preview(): void {
      this.workspaceLayoutMode = this.workspaceLayoutMode === 'a4Preview' ? 'fluid' : 'a4Preview'
    }
  },
  getters: {
    isA4Preview(state): boolean {
      return state.workspaceLayoutMode === 'a4Preview'
    }
  }
})
