import type { PythonCell } from '@renderer/types/notebook-cell-types'
import { uuid } from '@renderer/utils/core/id-utils'

/**
 * Create a python cell object (does not register into workspace or notebook).
 */
export function createPythonCell(source = '# New Python cell'): PythonCell {
  const id = uuid()
  const now = new Date().toISOString()
  return {
    cellIndex: -1,
    id,
    kind: 'python-cell',
    language: 'python',
    source,
    createdAt: now,
    updatedAt: now
  }
}
