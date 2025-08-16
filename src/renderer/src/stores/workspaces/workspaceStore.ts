// This is one of the core stores
// It manages the workspace state and provides actions to manipulate it.

import { defineStore } from 'pinia'
import { createEmptyWorkspace } from '@renderer/code/notebook-core/model/workspace-initial'
import type { Workspace, Notebook } from '@renderer/code/notebook-core/model/schema'
import type { Cell, TextCell } from '@renderer/types/notebook-cell-types'
import { useCellSelectionStore } from '@renderer/stores/toolbar_cell_communication/cellSelectionStore'
import {
  createNotebook as operationsCreateNotebook,
  createTextCell as operationsCreateTextCell,
  addCellToNotebook as operationsAddCellToNotebook,
  deleteNotebookSoft as operationsDeleteNotebookSoft,
  moveCellIdUp as operationsMoveCellIdUp,
  moveCellIdDown as operationsMoveCellIdDown,
  moveNotebookIdUp as operationsMoveNotebookIdUp,
  moveNotebookIdDown as operationsMoveNotebookIdDown,
  renameNotebook as operationsRenameNotebook
} from '@renderer/code/notebook-core/operations'
import { setCellContent as operationsSetCellBaseInputContent } from '@renderer/code/notebook-core/operations/cells/set-cell-content'

/**
 * Pinia store state for the Luna workspace.
 * Holds the Workspace plus UI/session metadata (e.g., init flag, current notebook id).
 */
interface LunaState {
  workspace: Workspace | null
  initialized: boolean
  currentNotebookId: string | null
}

/** EXPLANATION (main structure)
 * The workspace and notebook interface is defined in the schema.ts
 * Workspace contains:
 *    - Record of notebook IDs and their corresponding Notebook objects
 *    - A unsorted Record of cell IDs and their corresponding Cell objects
 *    - Recycle Bin Object
 *    - Other metadata
 * Notebook contains:
 *    - A array of cell IDs, where the order of cell IDs in the array represents the order of cells in the notebook.
 *    - Other metadata
 * The Recycle Bin contains:
 *    - A record of deleted notebooks and their metadata
 *    - A record of deleted cells and their metadata
 */

export const useWorkspaceStore = defineStore('workspace', {
  state: (): LunaState => ({
    // In a pinia store the states are reactive and can be accessed
    // in components via the getter methods
    workspace: null, // Workspace is null until initialized
    initialized: false, // Indicates if the workspace has been initialized
    currentNotebookId: null // Current notebook ID is null until set
  }),
  getters: {
    getCurrentNotebook: (LunaState): Notebook | null => {
      // The currently active notebook object, or null when not initialized or available.
      // Note: the input parameter is the Pinia store state (LunaState), not the Workspace itself.
      // Guard: no workspace initialized or no current notebook id.
      if (!LunaState.workspace || !LunaState.currentNotebookId) {
        return null
      }
      // Lookup the notebook by id. If not found (e.g., was deleted), return null.
      return LunaState.workspace.notebooks[LunaState.currentNotebookId] ?? null
    },
    // A flat list of all active notebooks (excludes recycle bin entries).
    getNotebookList: (LunaState): Notebook[] => {
      // Ordered list of active notebooks based on workspace.notebookOrder
      if (!LunaState.workspace) return []
      const ws = LunaState.workspace
      const order = ws.notebookOrder || []
      if (!order.length) return Object.values(ws.notebooks)
      return order.map((id) => ws.notebooks[id]).filter(Boolean) as Notebook[]
    }
  },
  actions: {
    // Insert any cell into the current notebook after the selected cell (if any),
    // otherwise append to the end. Also selects the new cell.
    insertCellGeneric(cell: Cell): Cell {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const position = this.computeInsertPositionAfterSelection(notebookId)
      operationsAddCellToNotebook(workspace, notebookId, cell, position)
      try {
        const selectedCellStore = useCellSelectionStore()
        selectedCellStore.setSelectCell(cell.id, cell.kind)
      } catch {
        /* ignore */
      }
      return cell
    },
    // Compute the insertion index directly after the currently selected cell (if any)
    // for the given notebook. Returns undefined when no selection exists in this notebook
    // so callers can append to the end by default.
    computeInsertPositionAfterSelection(notebookId: string): number | undefined {
      const workspace = this.getWorkspace()
      try {
        const sel = useCellSelectionStore()
        const selectedId = sel.selectedCellId
        if (!selectedId) return undefined
        const nb = workspace.notebooks[notebookId]
        const idx = nb.cellOrder.indexOf(selectedId)
        if (idx === -1) return undefined
        return idx + 1
      } catch {
        return undefined
      }
    },
    // --- Initialize Workspace ---
    initEmpty(force = false): Workspace {
      let ws = this.workspace
      if (force || !this.initialized || !ws) {
        ws = createEmptyWorkspace()
        this.workspace = ws
        this.initialized = true
        // Clear current notebook selection; a caller can ensure/create one as needed.
        this.currentNotebookId = null
      }
      return ws
    },
    // --- Get Workspace ---
    getWorkspace(): Workspace {
      if (!this.initialized || !this.workspace) {
        return this.initEmpty()
      }
      return this.workspace
    },
    // Ensure there's a valid current notebook ID. If none, pick the first existing or create one.
    // Many actions (like adding/moving cells) need a current notebook.
    // This guard avoids null checks throughout the code.
    ensureDefaultNotebook(): string {
      // Get the current workspace, or initialize an empty one if no workspace exists.
      const workspace = this.getWorkspace()
      // If current points to a valid notebook, keep it.
      if (this.currentNotebookId && workspace.notebooks[this.currentNotebookId]) {
        return this.currentNotebookId
      }
      // Otherwise, select first existing notebook if any, preferring explicit order.
      const firstId = workspace.notebookOrder?.[0] || Object.keys(workspace.notebooks)[0]
      if (firstId) {
        this.currentNotebookId = firstId
        return this.currentNotebookId
      }
      // None exist: create a default one via operation.
      const nb = operationsCreateNotebook(workspace, 'Notebook 1 (double click to rename)')
      this.currentNotebookId = nb.id
      return nb.id
    },
    // --- Create Notebook ---
    createNotebook(title = 'New Notebook'): string {
      const workspace = this.getWorkspace()
      const nb = operationsCreateNotebook(workspace, title)
      this.currentNotebookId = nb.id
      return nb.id
    },
    // --- Delete Notebook ---
    deleteNotebook(id: string): void {
      const workspace = this.getWorkspace()
      const { nextNotebookId } = operationsDeleteNotebookSoft(workspace, id)
      if (this.currentNotebookId === id) {
        this.currentNotebookId = nextNotebookId
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    // --- Notebook order movement ---
    moveCurrentNotebookUp(): boolean {
      const workspace = this.getWorkspace()
      const id = this.currentNotebookId
      if (!id) return false
      return operationsMoveNotebookIdUp(workspace, id)
    },
    moveCurrentNotebookDown(): boolean {
      const workspace = this.getWorkspace()
      const id = this.currentNotebookId
      if (!id) return false
      return operationsMoveNotebookIdDown(workspace, id)
    },
    // --- Rename Notebook ---
    renameNotebook(newTitle: string, id?: string): boolean {
      const workspace = this.getWorkspace()
      const targetId = id || this.currentNotebookId
      if (!targetId) return false
      return operationsRenameNotebook(workspace, targetId, newTitle)
    },
    // --- Select Notebook ---
    selectNotebook(id: string): void {
      const workspace = this.getWorkspace()
      if (workspace.notebooks[id]) {
        this.currentNotebookId = id
        try {
          const sel = useCellSelectionStore()
          sel.clearSelection()
        } catch {
          /* ignore */
        }
      }
    },
    // --- Cell Movement ---
    // Move selected (or provided) cell up one position in the current notebook.
    moveSelectedCellUp(cellId?: string): boolean {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const sel = useCellSelectionStore()
      const id = cellId || sel.selectedCellId
      if (!id) return false
      return operationsMoveCellIdUp(workspace, notebookId, id)
    },
    // Move selected (or provided) cell down one position in the current notebook.
    moveSelectedCellDown(cellId?: string): boolean {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const sel = useCellSelectionStore()
      const id = cellId || sel.selectedCellId
      if (!id) return false
      return operationsMoveCellIdDown(workspace, notebookId, id)
    },
    //--- Cell Creation ---
    addTextCell(content = 'function: addTextCell in workspaceStore.ts'): TextCell {
      this.getWorkspace() // ensure initialized
      this.ensureDefaultNotebook()
      const newCell = operationsCreateTextCell(content)
      operationsSetCellBaseInputContent(newCell, 'Cell ID (dev mode): ' + newCell.id)
      this.insertCellGeneric(newCell)
      return newCell
    }
  }
})
