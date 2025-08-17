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
import {
  restoreNotebookFromBin as operationsRestoreNotebookFromBin,
  emptyRecycleBin as operationsEmptyRecycleBin
} from '@renderer/code/notebook-core/operations'
import { deleteCellSoft as operationsDeleteCellSoft } from '@renderer/code/notebook-core/operations'
import { restoreCellFromBin as operationsRestoreCellFromBin } from '@renderer/code/notebook-core/operations'
import { setCellContent as operationsSetCellBaseInputContent } from '@renderer/code/notebook-core/operations/cells/set-cell-content'

/**
 * Pinia store state for the Luna workspace.
 * Holds the Workspace plus UI/session metadata (e.g., init flag, current notebook id).
 */
interface LunaState {
  workspace: Workspace | null
  initialized: boolean
  currentNotebookId: string | null
  viewMode: 'active' | 'bin'
  binSelectedNotebookId: string | null
  binLastSelectedCellByNotebook?: Record<string, string | null>
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
    currentNotebookId: null, // Current notebook ID is null until set
    // Add example: currentBinNotebookId ? in order to keep track of the currently selected notebook in the bin
    viewMode: 'active',
    binSelectedNotebookId: null,
    binLastSelectedCellByNotebook: {}
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
    // Internal helper: set selection if cell exists
    _selectIfPossible(cellId: string | null): void {
      if (!cellId) return
      try {
        const ws = this.getWorkspace()
        const cell = ws.cells[cellId]
        if (cell?.kind) {
          const sel = useCellSelectionStore()
          sel.setSelectCell(cellId, cell.kind)
        }
      } catch {
        /* ignore */
      }
    },
    // --- View Mode ---
    setViewMode(mode: 'active' | 'bin'): void {
      this.viewMode = mode
      if (mode === 'bin') {
        const ws = this.getWorkspace()
        // If a previous bin selection is still valid, reuse it
        const prev = this.binSelectedNotebookId
        if (prev && this._isNotebookRepresentedInBin(ws, prev)) {
          // Also restore last-selected cell (or first soft-deleted) for UX
          this.selectNotebookInBin(prev)
          return
        }
        // Else try current active notebook if it has items in bin
        const cur = this.currentNotebookId
        if (cur && this._isNotebookRepresentedInBin(ws, cur)) {
          this.selectNotebookInBin(cur)
          return
        }
        // Else pick a reasonable default: most recently deleted notebook
        const recentDeleted = ws.recycleBin.notebookOrder[0]
        if (recentDeleted) {
          this.selectNotebookInBin(recentDeleted)
          return
        }
        // Else pick first active notebook that has any soft-deleted cells
        const withSoftDeleted = Object.values(ws.notebooks).find((nb) =>
          nb.cellOrder.some((cid) => ws.cells[cid]?.softDeleted)
        )
        if (withSoftDeleted) {
          this.selectNotebookInBin(withSoftDeleted.id)
          return
        }
        // No bin content; leave selection null
        this.binSelectedNotebookId = null
      }
    },
    // Helper: Is a notebook represented in the Bin view (deleted notebook or has soft-deleted cells)?
    _isNotebookRepresentedInBin(workspace: Workspace, notebookId: string): boolean {
      if (workspace.recycleBin.notebooks[notebookId]) return true
      const nb = workspace.notebooks[notebookId]
      if (!nb) return false
      return nb.cellOrder.some((cid) => workspace.cells[cid]?.softDeleted)
    },
    selectNotebookInBin(id: string): void {
      this.viewMode = 'bin'
      this.binSelectedNotebookId = id
      // Restore last selection for this bin notebook, else pick first soft-deleted cell
      try {
        const ws = this.getWorkspace()
        const remembered = this.binLastSelectedCellByNotebook?.[id] || null
        let targetId: string | null = remembered
        if (!targetId) {
          targetId = this.getFirstSoftDeletedCellId(ws, id)
        }
        this._selectIfPossible(targetId)
      } catch {
        /* ignore */
      }
    },
    setBinLastSelectedCell(notebookId: string, cellId: string | null): void {
      if (!this.binLastSelectedCellByNotebook) this.binLastSelectedCellByNotebook = {}
      this.binLastSelectedCellByNotebook[notebookId] = cellId
    },
    // --- Restore Notebook from Bin ---
    restoreNotebookFromBin(id: string): boolean {
      const workspace = this.getWorkspace()
      const restoredId = operationsRestoreNotebookFromBin(workspace, id)
      if (restoredId) {
        // Switch back to active view and select the restored notebook
        this.setViewMode('active')
        this.currentNotebookId = restoredId
        try {
          const sel = useCellSelectionStore()
          // Auto-focus first cell if present; otherwise clear selection
          const firstId = workspace.notebooks[restoredId]?.cellOrder?.[0]
          if (firstId && workspace.cells[firstId]?.kind) {
            sel.setSelectCell(firstId, workspace.cells[firstId]!.kind)
          } else {
            sel.clearSelection()
          }
        } catch {
          /* ignore */
        }
        return true
      }
      return false
    },
    // --- Empty Recycle Bin ---
    emptyRecycleBin(): void {
      const workspace = this.getWorkspace()
      operationsEmptyRecycleBin(workspace)
      // Clear remembered bin selections as entries were cleared
      this.binLastSelectedCellByNotebook = {}
    },
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
    // --- Soft-delete selected cell ---
    softDeleteSelectedCell(): boolean {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      try {
        const sel = useCellSelectionStore()
        const id = sel.selectedCellId
        if (!id) return false
        const ok = operationsDeleteCellSoft(workspace, notebookId, id)
        if (ok) {
          // Remember this cell as the last-selected for this notebook in bin view
          this.setBinLastSelectedCell(notebookId, id)
          // Do NOT switch to Bin; keep user in Active view per UX.
          // Update selection to a nearby non-deleted cell (next, else previous), or clear if none.
          try {
            const nb = workspace.notebooks[notebookId]
            const order = nb?.cellOrder || []
            const idx = order.indexOf(id)
            let nextId: string | null = null
            // Look forward for the next non-soft-deleted cell
            for (let i = idx + 1; i < order.length; i++) {
              const cid = order[i]
              if (!workspace.cells[cid]?.softDeleted) {
                nextId = cid
                break
              }
            }
            if (!nextId) {
              // Look backward if no next available
              for (let i = idx - 1; i >= 0; i--) {
                const cid = order[i]
                if (!workspace.cells[cid]?.softDeleted) {
                  nextId = cid
                  break
                }
              }
            }
            if (nextId && workspace.cells[nextId]?.kind) {
              sel.setSelectCell(nextId, workspace.cells[nextId]!.kind)
            } else {
              sel.clearSelection()
            }
          } catch {
            /* ignore */
          }
        }
        return ok
      } catch {
        return false
      }
    },

    // Helper: Find the first soft-deleted cell id for a given notebook id
    getFirstSoftDeletedCellId(workspace: Workspace, notebookId: string): string | null {
      const activeNb = workspace.notebooks[notebookId]
      if (activeNb) {
        const found = activeNb.cellOrder.find((cid) => workspace.cells[cid]?.softDeleted)
        return found || null
      }
      // Deleted notebook: look into recycle bin metadata ordered by originalIndex
      const entries = Object.values(workspace.recycleBin.cells)
        .filter((meta) => meta.notebookId === notebookId)
        .sort((a, b) => a.originalIndex - b.originalIndex)
      for (const e of entries) {
        if (workspace.cells[e.id]) return e.id
      }
      return null
    },
    // --- Restore selected cell from Bin (for active notebooks) ---
    restoreSelectedCellFromBin(): boolean {
      const workspace = this.getWorkspace()
      const notebookId =
        this.binSelectedNotebookId || this.currentNotebookId || this.ensureDefaultNotebook()
      try {
        const sel = useCellSelectionStore()
        const id = sel.selectedCellId
        if (!id || !notebookId) return false
        const ok = operationsRestoreCellFromBin(workspace, notebookId, id)
        if (ok) {
          // Keep selection on the restored cell
          sel.setSelectCell(id, workspace.cells[id]?.kind)
          // Switch back to active mode and keep the same notebook selected
          this.setViewMode('active')
          this.currentNotebookId = notebookId
        }
        return ok
      } catch {
        return false
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
