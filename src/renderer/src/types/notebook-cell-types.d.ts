/**
 * Central notebook cell type declarations.
 * (Moved from notebook-core/cell-types/* for unified type management.)
 */

export type CellKind = 'text' | 'markdown' | 'code' | 'python'

export interface BaseCell {
  id: string
  kind: CellKind
  createdAt: string
  updatedAt: string
  locked?: boolean
  hidden?: boolean
  trashed?: boolean
  metadata?: Record<string, unknown>
}

export interface TextCell extends BaseCell {
  kind: 'text'
  source: string
}

export interface MarkdownCell extends BaseCell {
  kind: 'markdown'
  source: string
}

export interface CodeCell extends BaseCell {
  kind: 'code' | 'python'
  language: string
  source: string
  outputs: unknown[]
  status?: 'idle' | 'running' | 'error' | 'success'
  error?: { message: string; stack?: string } | null
}

export interface PythonCell extends CodeCell {
  kind: 'python'
  language: 'python'
}

export type Cell = TextCell | MarkdownCell | PythonCell
