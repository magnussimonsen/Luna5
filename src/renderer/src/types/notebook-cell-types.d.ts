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
  baseInputContent?: string // Mostly for development
  baseOutputContent?: string // Mostly for development
  metadata?: Record<string, unknown>
}

export interface TextCell extends BaseCell {
  kind: 'text-cell'
  source: string
  inputContent?: string
  outputContent?: string
  errorContent?: string
}

export interface MarkdownCell extends BaseCell {
  kind: 'markdown-cell'
  source: string
  inputContent?: string
  outputContent?: string
  errorContent?: string
}

export interface PythonCell extends BaseCell {
  kind: 'python-cell'
  language: 'python'
  source: string
  inputContent?: string
  outputContent?: string // this can be for example stdout from pyodide (inc. errors this must be captured)
  errorContent?: string
}

export type Cell = TextCell | MarkdownCell | PythonCell
