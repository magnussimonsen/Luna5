import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'

export async function initializeWorkspace(force = false): Promise<Workspace> {
  const workspaceStore = useWorkspaceStore()
  // Create a new empty workspace state. When force=true, resets even if one exists.
  const workspace = workspaceStore.initEmpty(force)

  // Add a text cell and wait for its editor to load
  const textCell = workspaceStore.addTextCell()
  await workspaceStore.waitForCellEditor(textCell.id)

  // Add a Python cell and wait for Monaco to load
  const pythonCell = workspaceStore.addPythonCell()
  await workspaceStore.waitForCellEditor(pythonCell.id)

  // Select the first cell now that editors are ready
  workspaceStore.selectFirstCellInNotebook()

  return workspace
}

// Note: initialization is triggered explicitly from initialize-app.ts
