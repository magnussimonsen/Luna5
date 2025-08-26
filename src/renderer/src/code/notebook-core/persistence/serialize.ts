import type { Workspace } from '@renderer/code/notebook-core/model/schema'

/**
 * Convert a Workspace object into a JSON string for persistence or transport.
 * Pass pretty=true to pretty-print with 2-space indentation; otherwise compact.
 */
export function toWorkspaceJSON(workspace: Workspace, pretty = false): string {
  return JSON.stringify(workspace, null, pretty ? 2 : 0)
}

/**
 * Parse a JSON string back into a Workspace and enforce a minimal version check.
 * Throws if the input is not valid JSON, not an object, or version !== 1.
 * Note: No normalization or migration is performed here.
 */
export function fromWorkspaceJSON(json: string): Workspace {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    throw new Error('Invalid JSON: unable to parse workspace file')
  }
  if (!isObject(data)) {
    throw new Error('Invalid workspace: expected an object at top level')
  }
  const versionVal = (data as Record<string, unknown>).version
  if (versionVal !== 1) {
    throw new Error(`Unsupported workspace version: ${String(versionVal)}`)
  }
  return data as unknown as Workspace
}

/**
 * Type guard: returns true for plain objects (non-null and not arrays).
 */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
