/**
 * Central notebook cell type declarations.
 * (Moved from notebook-core/cell-types/* for unified type management.)
 */

export type CellKind = 'text-cell' | 'python-cell' | 'page-break'

export interface BaseCell {
  cellIndex: number // Position in the notebook
  id: string
  kind: CellKind
  createdAt: string
  updatedAt: string
  softLocked?: boolean
  hardLocked?: boolean
  hidden?: boolean
  flagged?: boolean
  softDeleted?: boolean
  hardDeleted?: boolean // If true the cell is listed for permanent deletion
  baseCellInputContent?: string // Mostly for development
  baseCellOutputContent?: string // Mostly for development
  isCellVisible?: boolean // UI hint, not persisted
  isCellFocused?: boolean // UI hint, not persisted
  metadata?: Record<string, unknown>
}

export interface PageBrakeCell extends BaseCell {
  kind: 'page-break'
  cellInputContent?: string // Needed for uniformity functions with other cell types
  // to avoid type errors when processing cells generically
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

/**
 * Structured error information from Python (Pyodide) execution.
 * Keeps a plain-text traceback for quick rendering.
 */
export interface PythonErrorInfo {
  name?: string
  message: string
  tracebackText?: string
}

/**
 * A generic display item for rich outputs (future-friendly, Jupyter-like).
 * Example mimes: 'text/plain', 'text/markdown', 'image/png', 'image/svg+xml', 'text/html'.
 */
export interface PythonDisplayItem {
  mime: string
  data: string // For images, prefer data URLs; for text, raw text; for html/markdown, raw string
}

/**
 * Execution metadata to track status and timing for a run.
 */
export interface PythonExecutionMeta {
  status: 'idle' | 'running' | 'ok' | 'error'
  startedAt?: string
  endedAt?: string
  durationMs?: number
  runCount?: number // Similar to Jupyter execution_count
  packages?: string[] // Packages requested/loaded for this run
}

export interface PythonCell extends BaseCell {
  kind: 'python-cell'
  language: 'python'
  source: string
  cellInputContent?: string
  /**
   * Structured outputs from Pyodide execution.
   */
  stdoutText?: string // Full captured stdout
  stderrText?: string // Full captured stderr
  stdoutImages?: string[] // Data URLs extracted from stdout (e.g., matplotlib PNGs)
  stdoutImagesZoomSliderValue?: number // UI hint for image zoom level
  displayItems?: PythonDisplayItem[] // Rich display bundle (future-friendly)

  /**
   * Error channels.
   * - workerError: errors from our JS worker plumbing
   * - pyError: structured Python exception details
   */
  workerError?: string
  pyError?: PythonErrorInfo

  /**
   * Helpful execution context for UI features.
   */
  pythonFunctions?: string[] // Names of functions discovered in the user namespace
  pythonVariablesObjectString?: string // Stringified preview of selected variables
  exec?: PythonExecutionMeta
}

export type Cell = TextCell | PythonCell | PageBrakeCell
