/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'
import type { Cell } from '@renderer/types/notebook-cell-types'

/**
 * Register a cell in the workspace and insert its id into the notebook's order.
 * Optionally, a position index can be provided; otherwise appends to the end.
 */
export function addCellToNotebook(
	workspace: Workspace,
	notebookId: string,
	cell: Cell,
	position?: number
): void {
	const notebook = workspace.notebooks[notebookId]
	if (!notebook) throw new Error(`Notebook ${notebookId} not found`)
	// Register cell object (create or overwrite same id)
	workspace.cells[cell.id] = cell
	// Insert into order
	if (typeof position === 'number' && position >= 0 && position <= notebook.cellOrder.length) {
		notebook.cellOrder.splice(position, 0, cell.id)
	} else {
		notebook.cellOrder.push(cell.id)
	}
}
