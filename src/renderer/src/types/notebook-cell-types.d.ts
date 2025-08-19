/**
 * Central notebook cell type declarations.
 * (Moved from notebook-core/cell-types/* for unified type management.)
 */

export type CellKind = 'text-cell' | 'markdown-cell' | 'python-cell'

export interface BaseCell {
  id: string
  kind: CellKind
  createdAt: string
  updatedAt: string
  softLocked?: boolean
  hardLocked?: boolean
  hidden?: boolean
  softDeleted?: boolean
  hardDeleted?: boolean // If true the cell is listed for permanent deletion
  baseCellInputContent?: string // Mostly for development
  baseCellOutputContent?: string // Mostly for development
  metadata?: Record<string, unknown>
}

export interface TextCell extends BaseCell {
  kind: 'text-cell'
  source: string
  cellInputContent?: string
  cellOutputContent?: string // Intended for rendered output like markdown or katex (to be decided)
  cellErrorContent?: string
}

export interface MarkdownCell extends BaseCell {
  kind: 'markdown-cell'
  source: string
  cellInputContent?: string
  cellOutputContent?: string
  cellErrorContent?: string
}

export interface PythonCell extends BaseCell {
  kind: 'python-cell'
  language: 'python'
  source: string
  cellInputContent?: string
  cellOutputContent?: string // this can be for example stdout from pyodide (inc. errors this must be captured)
  cellErrorContent?: string
}

export type Cell = TextCell | MarkdownCell | PythonCell
