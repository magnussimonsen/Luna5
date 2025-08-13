// Helper function that sets the cell input-field value
import type { Cell } from '@renderer/types/notebook-cell-types'

export function setCellContent(cell: Cell, content: string): void {
  // Here, content should later be a record<key: string, value: string?> for different input types (key, value)
  cell.baseInputContent = content
}
