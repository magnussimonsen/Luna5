import { decompressAndDeserialize } from '@renderer/code/notebook-core/utils/compression-utils'
import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

export type OpenFileResult =
  | { success: true; filePath: string }
  | { success: false; error?: string }

/**
 * Open a .luna file using the native Open dialog, then read, decompress, and load the workspace.
 */
export async function openWorkspaceFromDisk(): Promise<OpenFileResult> {
  try {
    // 1) Ask for a .luna file
    const dlg = await window.api.showOpenDialog({ properties: ['openFile'] })
    if (dlg.canceled || !dlg.filePaths?.length) {
      return { success: false }
    }
    const filePath = dlg.filePaths[0]

    // 2) Read file content (base64 string)
    const read = await window.api.readFile({ filePath })
    if (!read.success || !read.content) {
      return { success: false, error: read.error || 'Failed to read file' }
    }

    // 3) Decompress and deserialize to Workspace
    const workspace = await decompressAndDeserialize<Workspace>(read.content)

    // 4) Replace current workspace in the store and mark as saved with the file path
    const store = useWorkspaceStore()
    // Replace the entire workspace and mark as initialized/saved
    store.workspace = workspace
    store.initialized = true
    store.markAsSaved(filePath)

    return { success: true, filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
