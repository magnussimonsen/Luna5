// Shim: editor pool is deprecated/archived. Use per-cell Monaco instances.
// This shim keeps the module shape so legacy imports continue to work,
// while logging a deprecation warning when used.
console.warn('[editorPool] Deprecated: editor pooling archived. Use per-cell Monaco instances.')

export function getEditorFromPool(): null {
  return null
}

export function registerAttachedEditor(): void {
  /* no-op shim */
}

export function unregisterAttachedEditor(): void {
  /* no-op shim */
}

export function releaseEditorToPool(): void {
  /* no-op shim */
}

export function setMaxPoolSize(): void {
  /* no-op shim */
}

export function _debugPoolCounts(): { pooled: number; attached: number; max: number } {
  return { pooled: 0, attached: 0, max: 0 }
}
