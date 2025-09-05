// Message types for the Pyodide worker

export type WorkerRequest = {
  type: 'execute'
  cellId: string
  code: string
  isDarkMode?: boolean
  packages?: string[]
  // Optional: object of python variable names to fetch after execution
  pythonVariables?: Record<string, true>
  /** Absolute base URL for public assets, e.g., http://localhost:5173/ */
  assetsBaseUrl?: string
}

export type WorkerResponse =
  | {
      type: 'result'
      cellId: string
      stdout: string
      stderr: string
      stdoutText: string
      stdoutImages: string[]
      pythonFunctions: string[]
      pythonVariables?: Record<string, string>
    }
  | {
      type: 'error'
      cellId: string
      message: string
      category: 'user' | 'internal'
    }
