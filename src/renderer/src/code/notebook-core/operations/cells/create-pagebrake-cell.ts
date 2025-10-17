import type { PageBrakeCell } from '@renderer/types/notebook-cell-types'
import { uuid } from '@renderer/utils/core/id-utils'

/**
 * Create a page brake cell object (does not register into workspace or notebook).
 */
export function createPageBrakeCell(): PageBrakeCell {
  const id = uuid()
  const now = new Date().toISOString()
  return {
    cellIndex: -1,
    id,
    kind: 'page-break',
    createdAt: now,
    updatedAt: now
  }
}
