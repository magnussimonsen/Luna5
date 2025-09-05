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
  createPythonCell as operationsCreatePythonCell,
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
  viewMode: 'notebooks' | 'bin'
  binSelectedNotebookId: string | null
  // File save state
  isSaved: boolean
  lastSavedAtDateTime: string | null
  currentFilePath: string | null
  // Autosave support
  inputChangesSinceLastSave: number
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
    viewMode: 'notebooks', // 'notebooks' or 'bin' view mode
    binSelectedNotebookId: null,
    // File save state
    isSaved: false, // Workspace starts as unsaved
    lastSavedAtDateTime: null, // No save timestamp initially
    currentFilePath: null, // No file path initially
    // Autosave support
    inputChangesSinceLastSave: 0
  }),
  getters: {
    getCurrentNotebook: (state): Notebook | null => {
      // The currently active notebook object, or null when not initialized or available.
      // Note: the input parameter is the Pinia store state, not the Workspace itself.
      // Guard: no workspace initialized or no current notebook id.
      if (!state.workspace || !state.currentNotebookId) {
        return null
      }
      // Lookup the notebook by id. If not found (e.g., was deleted), return null.
      return state.workspace.notebooks[state.currentNotebookId] ?? null
    },
    // A flat list of all active notebooks (excludes recycle bin entries).
    getNotebookList: (state): Notebook[] => {
      // Ordered list of active notebooks based on workspace.notebookOrder
      if (!state.workspace) return []
      const workspace = state.workspace
      const order = workspace.notebookOrder || []
      if (!order.length) return Object.values(workspace.notebooks)
      return order.map((id) => workspace.notebooks[id]).filter(Boolean) as Notebook[]
    },
    // File status getters
    getIsSaved: (state): boolean => {
      return state.isSaved
    },
    getLastSavedAtDateTime: (state): string | null => {
      return state.lastSavedAtDateTime
    },
    getCurrentFilePath: (state): string | null => {
      return state.currentFilePath
    }
  },
  actions: {
    // Persist notebooks-view last selection on the notebook itself
    setNotebookLastSelectedCell(notebookId: string, cellId: string | null): void {
      const workspace = this.getWorkspace()
      const notebook = workspace.notebooks[notebookId]
      if (!notebook) return
      notebook.lastSelectedCellId = cellId ?? undefined
    },
    // Persist last selected notebook id for notebooks view
    setLastSelectedNotebookIdNotebooks(notebookId: string | null): void {
      const workspace = this.getWorkspace()
      if (notebookId && workspace.notebooks[notebookId]) {
        workspace.lastSelectedNotebookIdNotebooks = notebookId
      } else {
        workspace.lastSelectedNotebookIdNotebooks = undefined
      }
    },
    // Persist last selected notebook id for bin view
    setLastSelectedNotebookIdBin(notebookId: string | null): void {
      const workspace = this.getWorkspace()
      if (!workspace.recycleBin) return
      if (notebookId) {
        workspace.recycleBin.lastSelectedNotebookId = notebookId
      } else {
        workspace.recycleBin.lastSelectedNotebookId = undefined
      }
    },
    // Helper: first non-soft-deleted cell id in a notebook
    _getFirstActiveCellId(workspace: Workspace, notebookId: string): string | null {
      const notebook = workspace.notebooks[notebookId]
      if (!notebook) return null
      return notebook.cellOrder.find((cellId) => !workspace.cells[cellId]?.softDeleted) || null
    },
    // Internal helper: set selection if cell exists
    _selectIfPossible(cellId: string | null): void {
      if (!cellId) return
      try {
        const workspace = this.getWorkspace()
        const cell = workspace.cells[cellId]
        if (cell?.kind) {
          const cellSelectionStore = useCellSelectionStore()
          cellSelectionStore.setSelectCell(cellId, cell.kind)
          // Also remember last selection for current context
          if (this.viewMode === 'bin' && this.binSelectedNotebookId) {
            this.setBinLastSelectedCell(this.binSelectedNotebookId, cellId)
          } else if (this.viewMode === 'notebooks' && this.currentNotebookId) {
            this.setNotebookLastSelectedCell(this.currentNotebookId, cellId)
          }
        }
      } catch {
        /* ignore */
      }
    },
    // --- View Mode ---
    setViewMode(mode: 'notebooks' | 'bin'): void {
      this.viewMode = mode
      const workspace = this.getWorkspace()
      const cellSelectionStore = useCellSelectionStore()
      if (mode === 'notebooks') {
        // Choose notebook: prefer remembered notebooks-view id
        let selectedNotebookId = workspace.lastSelectedNotebookIdNotebooks || this.currentNotebookId
        if (!selectedNotebookId || !workspace.notebooks[selectedNotebookId])
          selectedNotebookId = this.ensureDefaultNotebook()
        this.currentNotebookId = selectedNotebookId
        this.setLastSelectedNotebookIdNotebooks(selectedNotebookId)
        // Select lastSelectedCellId if set; else clear selection
        const rememberedCellId = workspace.notebooks[selectedNotebookId]?.lastSelectedCellId || null
        const validCellId =
          rememberedCellId && !workspace.cells[rememberedCellId]?.softDeleted
            ? rememberedCellId
            : null
        if (validCellId) {
          const cell = workspace.cells[validCellId]!
          cellSelectionStore.setSelectCell(validCellId, cell.kind)
          this.setNotebookLastSelectedCell(selectedNotebookId, validCellId)
        } else {
          cellSelectionStore.clearSelection()
          this.setNotebookLastSelectedCell(selectedNotebookId, null)
        }
      } else if (mode === 'bin') {
        // Choose bin notebook: prefer remembered bin notebook id
        let selectedBinNotebookId =
          workspace.recycleBin.lastSelectedNotebookId || this.binSelectedNotebookId || null
        if (
          selectedBinNotebookId &&
          !this._isNotebookRepresentedInBin(workspace, selectedBinNotebookId)
        ) {
          selectedBinNotebookId = null
        }
        this.binSelectedNotebookId = selectedBinNotebookId
        this.setLastSelectedNotebookIdBin(selectedBinNotebookId)
        if (selectedBinNotebookId) {
          const rememberedBinMap = workspace.recycleBin.lastSelectedBinCellIdByNotebook || {}
          const rememberedCellId = rememberedBinMap[selectedBinNotebookId] || null
          const validCellId =
            rememberedCellId && workspace.cells[rememberedCellId] ? rememberedCellId : null
          if (validCellId) {
            const cell = workspace.cells[validCellId]!
            cellSelectionStore.setSelectCell(validCellId, cell.kind)
            this.setBinLastSelectedCell(selectedBinNotebookId, validCellId)
          } else {
            cellSelectionStore.clearSelection()
            this.setBinLastSelectedCell(selectedBinNotebookId, null)
          }
        } else {
          cellSelectionStore.clearSelection()
        }
      }
    },
    // Helper: Is a notebook represented in the Bin view (deleted notebook or has soft-deleted cells)?
    _isNotebookRepresentedInBin(workspace: Workspace, notebookId: string): boolean {
      if (workspace.recycleBin.notebooks[notebookId]) return true
      const notebook = workspace.notebooks[notebookId]
      if (!notebook) return false
      return notebook.cellOrder.some((cellId) => workspace.cells[cellId]?.softDeleted)
    },
    selectNotebookInBin(id: string): void {
      this.viewMode = 'bin'
      const workspace = this.getWorkspace()
      this.binSelectedNotebookId = id
      this.setLastSelectedNotebookIdBin(id)
      try {
        const rememberedMap = workspace.recycleBin.lastSelectedBinCellIdByNotebook || {}
        const rememberedCellId = rememberedMap[id] || null
        const targetCellId =
          rememberedCellId && workspace.cells[rememberedCellId] ? rememberedCellId : null
        const cellSelectionStore = useCellSelectionStore()
        if (targetCellId) {
          cellSelectionStore.setSelectCell(targetCellId, workspace.cells[targetCellId]!.kind)
          this.setBinLastSelectedCell(id, targetCellId)
        } else {
          cellSelectionStore.clearSelection()
          this.setBinLastSelectedCell(id, null)
        }
      } catch {
        /* ignore */
      }
    },
    setBinLastSelectedCell(notebookId: string, cellId: string | null): void {
      const workspace = this.getWorkspace()
      if (!workspace.recycleBin.lastSelectedBinCellIdByNotebook) {
        workspace.recycleBin.lastSelectedBinCellIdByNotebook = {}
      }
      workspace.recycleBin.lastSelectedBinCellIdByNotebook[notebookId] = cellId ?? null
    },
    // --- Restore Notebook from Bin ---
    restoreNotebookFromBin(id: string): boolean {
      const workspace = this.getWorkspace()
      const restoredId = operationsRestoreNotebookFromBin(workspace, id)
      if (restoredId) {
        // Switch back to notebooks view and select the restored notebook
        this.setViewMode('notebooks')
        this.currentNotebookId = restoredId
        try {
          const cellSelectionStore = useCellSelectionStore()
          // Auto-focus first cell if present; otherwise clear selection
          const firstId = workspace.notebooks[restoredId]?.cellOrder?.[0]
          if (firstId && workspace.cells[firstId]?.kind) {
            cellSelectionStore.setSelectCell(firstId, workspace.cells[firstId]!.kind)
          } else {
            cellSelectionStore.clearSelection()
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
      if (workspace.recycleBin) {
        workspace.recycleBin.lastSelectedBinCellIdByNotebook = {}
        workspace.recycleBin.lastSelectedNotebookId = undefined
      }
    },
    // Insert any cell into the current notebook after the selected cell (if any),
    // otherwise append to the end. Also selects the new cell.
    insertCellGeneric(cell: Cell): Cell {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const position = this.computeInsertPositionAfterSelection(notebookId)
      operationsAddCellToNotebook(workspace, notebookId, cell, position)
      try {
        const cellSelectionStore = useCellSelectionStore()
        cellSelectionStore.setSelectCell(cell.id, cell.kind)
        this.setNotebookLastSelectedCell(notebookId, cell.id)
        this.setLastSelectedNotebookIdNotebooks(notebookId)
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
        const cellSelectionStore = useCellSelectionStore()
        const selectedCellId = cellSelectionStore.selectedCellId
        if (!selectedCellId) return undefined
        const notebook = workspace.notebooks[notebookId]
        const index = notebook.cellOrder.indexOf(selectedCellId)
        if (index === -1) return undefined
        return index + 1
      } catch {
        return undefined
      }
    },
    // --- Initialize Workspace ---
    initEmpty(force = false): Workspace {
      let workspace = this.workspace
      if (force || !this.initialized || !workspace) {
        workspace = createEmptyWorkspace()
        this.workspace = workspace
        this.initialized = true
        // Clear current notebook selection; a caller can ensure/create one as needed.
        this.currentNotebookId = null

        // Reset save state for a new workspace
        this.resetSaveState()
      }
      return workspace
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
      const newNotebook = operationsCreateNotebook(workspace, 'Notebook 1 (double click to rename)')
      this.currentNotebookId = newNotebook.id
      return newNotebook.id
    },
    // --- Create Notebook ---
    createNotebook(title = 'New Notebook'): string {
      const workspace = this.getWorkspace()
      const newNotebook = operationsCreateNotebook(workspace, title)
      this.currentNotebookId = newNotebook.id
      this.markAsUnsaved()
      return newNotebook.id
    },
    // --- Delete Notebook ---
    deleteNotebook(id: string): void {
      const workspace = this.getWorkspace()
      const { nextNotebookId } = operationsDeleteNotebookSoft(workspace, id)
      if (this.currentNotebookId === id) {
        this.currentNotebookId = nextNotebookId
        try {
          const cellSelectionStore = useCellSelectionStore()
          cellSelectionStore.clearSelection()
        } catch {
          /* ignore */
        }
      }
      this.markAsUnsaved()
    },
    // --- Notebook order movement ---
    moveCurrentNotebookUp(): boolean {
      const workspace = this.getWorkspace()
      const id = this.currentNotebookId
      if (!id) return false
      const result = operationsMoveNotebookIdUp(workspace, id)
      if (result) {
        this.markAsUnsaved()
      }
      return result
    },
    moveCurrentNotebookDown(): boolean {
      const workspace = this.getWorkspace()
      const id = this.currentNotebookId
      if (!id) return false
      const result = operationsMoveNotebookIdDown(workspace, id)
      if (result) {
        this.markAsUnsaved()
      }
      return result
    },
    // --- Rename Notebook ---
    renameNotebook(newTitle: string, id?: string): boolean {
      const workspace = this.getWorkspace()
      const targetId = id || this.currentNotebookId
      if (!targetId) return false
      const result = operationsRenameNotebook(workspace, targetId, newTitle)
      if (result) {
        this.markAsUnsaved()
      }
      return result
    },
    // --- Select Notebook ---
    selectNotebook(id: string): void {
      const workspace = this.getWorkspace()
      if (!workspace.notebooks[id]) return
      this.currentNotebookId = id
      this.setLastSelectedNotebookIdNotebooks(id)
      try {
        const cellSelectionStore = useCellSelectionStore()
        const rememberedCellId = workspace.notebooks[id]?.lastSelectedCellId || null
        const validCellId =
          rememberedCellId && !workspace.cells[rememberedCellId]?.softDeleted
            ? rememberedCellId
            : null
        if (validCellId) {
          cellSelectionStore.setSelectCell(validCellId, workspace.cells[validCellId]!.kind)
          this.setNotebookLastSelectedCell(id, validCellId)
        } else {
          cellSelectionStore.clearSelection()
          this.setNotebookLastSelectedCell(id, null)
        }
      } catch {
        /* ignore */
      }
    },
    // --- Soft-delete selected cell ---
    softDeleteSelectedCell(): boolean {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      try {
        const cellSelectionStore = useCellSelectionStore()
        const cellId = cellSelectionStore.selectedCellId
        if (!cellId) return false
        // Block moving to Bin when the cell is locked or hidden
        const cell = workspace.cells[cellId]
        if (!cell) return false
        if (cell.softLocked || cell.hardLocked || cell.hidden) return false
        const deleted = operationsDeleteCellSoft(workspace, notebookId, cellId)
        if (deleted) {
          // Remember this cell as the last-selected for this notebook in bin view
          this.setBinLastSelectedCell(notebookId, cellId)
          // Do NOT switch to Bin; keep user in Active view per UX.
          // Update selection to a nearby non-deleted cell (next, else previous), or clear if none.
          try {
            const notebook = workspace.notebooks[notebookId]
            const order = notebook?.cellOrder || []
            const index = order.indexOf(cellId)
            let nextSelectableId: string | null = null
            // Look forward for the next non-soft-deleted cell

            // Mark workspace as unsaved after deleting a cell
            this.markAsUnsaved()
            for (let i = index + 1; i < order.length; i++) {
              const candidateCellId = order[i]
              if (!workspace.cells[candidateCellId]?.softDeleted) {
                nextSelectableId = candidateCellId
                break
              }
            }
            if (!nextSelectableId) {
              // Look backward if no next available
              for (let i = index - 1; i >= 0; i--) {
                const candidateCellId = order[i]
                if (!workspace.cells[candidateCellId]?.softDeleted) {
                  nextSelectableId = candidateCellId
                  break
                }
              }
            }
            if (nextSelectableId && workspace.cells[nextSelectableId]?.kind) {
              cellSelectionStore.setSelectCell(
                nextSelectableId,
                workspace.cells[nextSelectableId]!.kind
              )
              this.setNotebookLastSelectedCell(notebookId, nextSelectableId)
              this.setLastSelectedNotebookIdNotebooks(notebookId)
            } else {
              cellSelectionStore.clearSelection()
              this.setNotebookLastSelectedCell(notebookId, null)
              this.setLastSelectedNotebookIdNotebooks(notebookId)
            }
          } catch {
            /* ignore */
          }
        }
        return deleted
      } catch {
        return false
      }
    },

    // Helper: Find the first soft-deleted cell id for a given notebook id
    getFirstSoftDeletedCellId(workspace: Workspace, notebookId: string): string | null {
      const activeNotebook = workspace.notebooks[notebookId]
      if (activeNotebook) {
        const foundCellId = activeNotebook.cellOrder.find(
          (cellId) => workspace.cells[cellId]?.softDeleted
        )
        return foundCellId || null
      }
      // Deleted notebook: look into recycle bin metadata ordered by originalIndex
      const binEntries = Object.values(workspace.recycleBin.cells)
        .filter((meta) => meta.notebookId === notebookId)
        .sort((a, b) => a.originalIndex - b.originalIndex)
      for (const entry of binEntries) {
        if (workspace.cells[entry.id]) return entry.id
      }
      return null
    },
    // --- Restore selected cell from Bin (for active notebooks) ---
    restoreSelectedCellFromBin(): boolean {
      const workspace = this.getWorkspace()
      const notebookId =
        this.binSelectedNotebookId || this.currentNotebookId || this.ensureDefaultNotebook()
      try {
        const cellSelectionStore = useCellSelectionStore()
        const cellId = cellSelectionStore.selectedCellId
        if (!cellId || !notebookId) return false
        const ok = operationsRestoreCellFromBin(workspace, notebookId, cellId)
        if (ok) {
          // Keep selection on the restored cell
          cellSelectionStore.setSelectCell(cellId, workspace.cells[cellId]?.kind)
          this.setNotebookLastSelectedCell(notebookId, cellId)
          // Switch back to active mode and keep the same notebook selected
          // --------------------
          // Note: this is a UX decision to return to the active notebook view after restoring.
          // Uncomment the following lines to enable this behavior
          // --------------------
          // TO THINK ABOUT: Should focus behavior Focus set from bin deleted cell -> active notebook restored cell
          // and similar cases when moving cells and notebooks between notebooks and bin be an option in settings menu?
          // this.setViewMode('notebooks')
          // this.currentNotebookId = notebookId
          // this.setLastSelectedNotebookIdNotebooks(notebookId)
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
      const cellSelectionStore = useCellSelectionStore()
      const selectedCellId = cellId || cellSelectionStore.selectedCellId
      if (!selectedCellId) return false
      const result = operationsMoveCellIdUp(workspace, notebookId, selectedCellId)
      if (result) {
        this.markAsUnsaved()
      }
      return result
    },
    // Move selected (or provided) cell down one position in the current notebook.
    moveSelectedCellDown(cellId?: string): boolean {
      const workspace = this.getWorkspace()
      const notebookId = this.ensureDefaultNotebook()
      const cellSelectionStore = useCellSelectionStore()
      const selectedCellId = cellId || cellSelectionStore.selectedCellId
      if (!selectedCellId) return false
      const result = operationsMoveCellIdDown(workspace, notebookId, selectedCellId)
      if (result) {
        this.markAsUnsaved()
      }
      return result
    },
    //--- Cell Creation ---
    addTextCell(content = 'function: addTextCell in workspaceStore.ts'): TextCell {
      this.getWorkspace() // ensure initialized
      this.ensureDefaultNotebook()
      const newCell = operationsCreateTextCell(content)
      operationsSetCellBaseInputContent(newCell, 'Cell ID (dev mode): ' + newCell.id)
      this.insertCellGeneric(newCell)
      this.markAsUnsaved()
      return newCell
    },
    addPythonCell(source = `# Python demo\nfor i in range(5):\n    print(f"Item {i}")`): Cell {
      this.getWorkspace()
      this.ensureDefaultNotebook()
      const newCell = operationsCreatePythonCell(source)
      operationsSetCellBaseInputContent(newCell, 'Cell ID (dev mode): ' + newCell.id)
      this.insertCellGeneric(newCell)
      this.markAsUnsaved()
      return newCell
    },
    // --- Toggle soft lock on selected cell ---
    toggleSoftLockSelectedCell(): boolean {
      const workspace = this.getWorkspace()
      const cellSelectionStore = useCellSelectionStore()
      const cellId = cellSelectionStore.selectedCellId
      if (!cellId) return false
      const cell = workspace.cells[cellId]
      if (!cell) return false
      cell.softLocked = !cell.softLocked
      cell.updatedAt = new Date().toISOString()
      this.markAsUnsaved()
      return true
    },
    // --- Toggle hidden on selected cell ---
    toggleHiddenSelectedCell(): boolean {
      const workspace = this.getWorkspace()
      const cellSelectionStore = useCellSelectionStore()
      const cellId = cellSelectionStore.selectedCellId
      if (!cellId) return false
      const cell = workspace.cells[cellId]
      if (!cell) return false
      cell.hidden = !cell.hidden
      cell.updatedAt = new Date().toISOString()
      this.markAsUnsaved()
      return true
    },
    // --- Set content for a given cell (e.g., from TextCell input) ---
    setCellInputContent(cellId: string, content: string): boolean {
      const workspace = this.getWorkspace()
      const cell = workspace.cells[cellId]
      if (!cell) return false
      // Prevent writes when cell is hidden, locked or deleted (soft and hard policy)
      if (cell.hidden || cell.hardLocked || cell.softLocked || cell.softDeleted || cell.hardDeleted)
        return false
      // Normalize content to avoid false diffs (CRLF, NBSP, trailing newlines)
      const normalize = (text: string): string =>
        text
          .replace(/\r\n/g, '\n')
          .replace(/\u00A0/g, ' ')
          .replace(/\n+$/g, '')
      const next = normalize(content)
      const prev = normalize(cell.cellInputContent ?? '')
      if (prev === next) {
        return true
      }
      // All current cell kinds define optional cellInputContent
      cell.cellInputContent = next
      cell.updatedAt = new Date().toISOString()

      // Mark workspace as unsaved only when content actually changes
      this.markAsUnsaved()

      return true
    },

    // --- File Save State Management ---

    /**
     * Mark the workspace as unsaved
     * This should be called whenever a change is made to the workspace
     */
    markAsUnsaved(): void {
      this.isSaved = false
      // Increment autosave change counter on any change
      this.inputChangesSinceLastSave = (this.inputChangesSinceLastSave || 0) + 1
    },

    /**
     * Mark the workspace as saved and update the save timestamp and file path
     * @param filePath - Optional file path to update the current file path
     */
    markAsSaved(filePath?: string): void {
      this.isSaved = true
      this.lastSavedAtDateTime = new Date().toISOString()
      // Reset autosave change counter on successful save
      this.inputChangesSinceLastSave = 0

      // Update file path if provided
      if (filePath) {
        this.currentFilePath = filePath
      }
    },

    /**
     * Reset file save state (for new workspaces)
     */
    resetSaveState(): void {
      this.isSaved = false
      this.lastSavedAtDateTime = null
      this.currentFilePath = null
      this.inputChangesSinceLastSave = 0
    }
  }
})
