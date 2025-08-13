import type { Workspace, Notebook } from '../../model/schema'
import { uuid } from '../../utils/id-utils'

/**
 * Create a new notebook and append it to the workspace.
 * Returns the created notebook.
 */
export function createNotebook(workspace: Workspace, title = 'Untitled Notebook'): Notebook {
  const id = uuid()
  const notebook: Notebook = { id, title, cellOrder: [] }
  workspace.notebooks[id] = notebook
  return notebook
}
