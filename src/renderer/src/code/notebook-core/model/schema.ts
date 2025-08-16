import type { Cell } from '@renderer/types/notebook-cell-types'

// A Notebook is an ordered list of cells.

export interface Notebook {
  id: string
  title: string
  cellOrder: string[]
  lastSelectedCellId?: string // Store this for when user switches between notebooks
  metadata?: Record<string, unknown>
  // When set, the notebook has been soft-deleted and lives in the recycle bin.
  deletedAt?: string
}

// Recycle bin entries keep origin + deletion metadata so we can restore precisely.
export interface RecycleBinCellEntryMetadata {
  id: string // cell id
  notebookId: string
  originalIndex: number
  deletedAt: string // ISO timestamp
}

export interface RecycleBinNotebookEntryMetadata {
  id: string // notebook id
  title: string // capture title at deletion time for display
  deletedAt: string // ISO timestamp
  // Potential future: counts, size metrics, etc.
}

export interface RecycleBin {
  // Quick lookup by cell id / notebook id
  cells: Record<string, RecycleBinCellEntryMetadata>
  notebooks: Record<string, RecycleBinNotebookEntryMetadata>
  // Optional ordering arrays (most recent deletion first, etc.)
  cellOrder: string[]
  notebookOrder: string[]
}

export interface Workspace {
  version: 1
  notebooks: Record<string, Notebook>
  cells: Record<string, Cell>
  // Order of active notebooks for stable display and reordering
  notebookOrder: string[]
  recycleBin: RecycleBin
}
