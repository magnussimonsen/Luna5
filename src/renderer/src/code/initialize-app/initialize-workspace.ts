import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'

export function initializeWorkspace(force = false): Workspace {
  const workspaceStore = useWorkspaceStore()
  // Create a new empty workspace state. When force=true, resets even if one exists.
  return workspaceStore.initEmpty(force)
}

// Note: initialization is triggered explicitly from initialize-app.ts
