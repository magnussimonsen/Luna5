import type { Workspace } from '../../model/schema'
import type { TextCell } from '@renderer/types/notebook-cell-types'
import { uuid } from '../../utils/id-utils'

/**
 * Create a text cell and append to the end of the notebook's cellOrder.
 */
export function createTextCell(
  workspace: Workspace,
  notebookId: string,
  content = 'New text cell'
): TextCell {
  const notebook = workspace.notebooks[notebookId]
  if (!notebook) {
    throw new Error(`Notebook ${notebookId} not found`)
  }
  const id = uuid()
  const now = new Date().toISOString()
  const cell: TextCell = {
    id,
    kind: 'text',
    source: content,
    createdAt: now,
    updatedAt: now
  }
  workspace.cells[id] = cell
  notebook.cellOrder.push(id)
  return cell
}
