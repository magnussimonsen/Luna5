import type { TextCell } from '@renderer/types/notebook-cell-types'
import { uuid } from '@renderer/utils/core/id-utils'

/**
 * Create a text cell object (does not register into workspace or notebook).
 */
export function createTextCell(content = 'New text cell'): TextCell {
  const id = uuid()
  const now = new Date().toISOString()
  return {
    cellIndex: -1,
    id,
    kind: 'text-cell',
    source: content,
    createdAt: now,
    updatedAt: now
  }
}
