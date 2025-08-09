import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'

export function initializeWorkspace(force = false): Workspace {
  const store = useWorkspaceStore()
  return store.initEmpty(force)
}

// Note: initialization is triggered explicitly from initialize-app.ts
