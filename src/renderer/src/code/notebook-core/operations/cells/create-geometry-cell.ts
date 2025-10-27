import { uuid } from '@renderer/utils/core/id-utils'
import type { GeometryCell } from '@renderer/types/notebook-cell-types'

/**
 * Creates a new geometry cell with default values.
 */
export function createGeometryCell(source = '# New geometry cell'): GeometryCell {
  const now = new Date().toISOString()

  return {
    cellIndex: -1, // Will be set when added to notebook
    id: uuid(),
    kind: 'geometry-cell',
    createdAt: now,
    updatedAt: now,
    source,
    cellInputContent: source,
    geometryCommands: [],
    geometryObjects: {}
  }
}
