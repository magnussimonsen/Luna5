/* eslint-disable prettier/prettier */
import type { Workspace } from '../../model/schema'

/**
 * Soft-delete a notebook: move metadata to recycle bin and keep cells data mapped.
 * Returns the id of the next available notebook to select (or null).
 */
export function deleteNotebookSoft(
	workspace: Workspace,
	notebookId: string
): { nextNotebookId: string | null } {
	const nb = workspace.notebooks[notebookId]
	if (!nb) return { nextNotebookId: null }

	const deletedAt = new Date().toISOString()
	// Move notebook meta into recycle bin
	workspace.recycleBin.notebooks[notebookId] = {
		id: notebookId,
		title: nb.title,
		deletedAt
	}
	workspace.recycleBin.notebookOrder.unshift(notebookId)

	// Record each cell position for potential future restore
	nb.cellOrder.forEach((cellId, index) => {
		if (!workspace.recycleBin.cells[cellId]) {
			workspace.recycleBin.cells[cellId] = {
				id: cellId,
				notebookId,
				originalIndex: index,
				deletedAt
			}
			workspace.recycleBin.cellOrder.unshift(cellId)
		}
	})

	// Remove notebook from active list
	delete workspace.notebooks[notebookId]

	const remaining = Object.keys(workspace.notebooks)
	return { nextNotebookId: remaining.length ? remaining[0] : null }
}