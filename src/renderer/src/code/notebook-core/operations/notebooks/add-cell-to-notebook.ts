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
	const nb = workspace.notebooks[notebookId]
	if (!nb) throw new Error(`Notebook ${notebookId} not found`)
	// Register cell object (create or overwrite same id)
	workspace.cells[cell.id] = cell
	// Insert into order
	if (typeof position === 'number' && position >= 0 && position <= nb.cellOrder.length) {
		nb.cellOrder.splice(position, 0, cell.id)
	} else {
		nb.cellOrder.push(cell.id)
	}
}
