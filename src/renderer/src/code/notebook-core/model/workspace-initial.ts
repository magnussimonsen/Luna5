import type { Workspace } from './schema'

/**
 * Create a brand new empty Workspace structure.
 * Keeps shape aligned with schema version 1.
 */
export function createEmptyWorkspace(): Workspace {
  return {
    version: 1,
    notebooks: {},
    cells: {},
    notebookOrder: [],
    recycleBin: {
      cells: {},
      notebooks: {},
      cellOrder: [],
      notebookOrder: []
    }
  }
}
