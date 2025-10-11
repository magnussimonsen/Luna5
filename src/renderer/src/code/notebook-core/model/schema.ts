import type { Cell } from '@renderer/types/notebook-cell-types'
import type { ownerMetadataRecord } from '@renderer/types/owner-metadata-type'

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
  // UI/session metadata for Bin view
  // Remember the last selected notebook when viewing the Bin
  lastSelectedNotebookId?: string
  // Remember the last selected Bin cell per notebook (active or deleted)
  lastSelectedBinCellIdByNotebook?: Record<string, string | null>
}

export interface Workspace {
  ownerMetadata?: Record<string, ownerMetadataRecord>
  version: 1
  notebooks: Record<string, Notebook>
  cells: Record<string, Cell>
  // Order of active notebooks for stable display and reordering
  notebookOrder: string[]
  recycleBin: RecycleBin
  // UI/session metadata for Notebooks view
  // Remember which notebook was last selected in the Notebooks view
  lastSelectedNotebookIdNotebooks?: string
  // Remember the run command and the server path for the LLM assistant (ollama)
  runLlmAssistantCommand?: string
  useLlmAssistantStoreServerPath?: string
}
