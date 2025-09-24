// Shared Monaco editor pool and registry.
// Maintains two collections:
// - pooledEditors: detached editors available for fast re-use (out-of-view)
// - attachedEditors: editors currently attached to cells (in-view)
// The module exposes a small API to acquire/release editors and to enforce
// a maximum total number of editor instances. When the max is lowered the
// module will destroy pooled editors first, then attached editors (preferring
// non-focused ones) and will call an optional onExternalRelease callback so
// the owning component can clean up its local references.

type ModelLike = { dispose: () => void } | null

type EditorLike = {
  getDomNode: () => HTMLElement | null
  setModel: (m: ModelLike) => void
  updateOptions: (opts: Record<string, unknown>) => void
  layout: () => void
  getModel: () => ModelLike
  dispose: () => void
}

type MonacoLike = {
  editor: {
    create: (container: HTMLElement, options: Record<string, unknown>) => EditorLike
    createModel?: (value: string, language?: string) => ModelLike
  }
}

type PoolEntry = { editor: EditorLike; model: ModelLike }
const pooledEditors: PoolEntry[] = []

type AttachedEntry = {
  editor: EditorLike
  model: ModelLike
  cellId?: string
  isVisible?: () => boolean
  isFocused?: () => boolean
  onExternalRelease?: () => void
}
const attachedEditors: AttachedEntry[] = []

let currentMaxInstances = 3

export function getEditorFromPool(
  monaco: MonacoLike | unknown,
  container: HTMLElement,
  initialValue: string,
  options: Record<string, unknown>
): EditorLike | null {
  try {
    if (!monaco) return null
    const m = monaco as MonacoLike

    const entry = pooledEditors.pop()
    if (entry && entry.editor) {
      const pooledEditor = entry.editor
      const pooledModel: ModelLike =
        entry.model ??
        (m.editor.createModel
          ? m.editor.createModel(initialValue, options.language as string)
          : null)
      try {
        const dom = pooledEditor.getDomNode()
        if (dom) {
          if (dom.parentElement) dom.parentElement.removeChild(dom)
          container.appendChild(dom)
        }
      } catch {
        /* ignore DOM move errors */
      }
      pooledEditor.setModel(pooledModel)
      try {
        pooledEditor.updateOptions({ readOnly: (options.readOnly as boolean) ?? false })
        pooledEditor.layout()
      } catch {
        /* ignore */
      }
      return pooledEditor
    }

    // Create new editor when pool is empty
    return m.editor.create(container, {
      value: initialValue,
      language: (options.language as string) || 'plaintext',
      readOnly: (options.readOnly as boolean) ?? false,
      lineNumbers: 'on',
      renderLineHighlightOnlyWhenFocus: true,
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 1,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false },
      overviewRulerLanes: 0,
      automaticLayout: true,
      fontFamily: options.fontFamily as string,
      fontSize: options.fontSize as number
    })
  } catch (e) {
    console.error('editorPool.getEditorFromPool error', e)
    return null
  }
}

export function registerAttachedEditor(
  editor: EditorLike,
  opts?: {
    cellId?: string
    isVisible?: () => boolean
    isFocused?: () => boolean
    onExternalRelease?: () => void
  }
): void {
  if (!editor) return
  // Avoid duplicates
  if (attachedEditors.some((a) => a.editor === editor)) return
  const model = editor.getModel()
  attachedEditors.push({
    editor,
    model,
    cellId: opts?.cellId,
    isVisible: opts?.isVisible,
    isFocused: opts?.isFocused,
    onExternalRelease: opts?.onExternalRelease
  })
  // Enforce max in case this push caused us to exceed it
  enforceMaxInstances(currentMaxInstances)
}

export function unregisterAttachedEditor(editor: EditorLike): void {
  const idx = attachedEditors.findIndex((a) => a.editor === editor)
  if (idx >= 0) attachedEditors.splice(idx, 1)
}

export function releaseEditorToPool(
  editor: EditorLike | null,
  disposables: Array<{ dispose: () => void }> | null,
  maxPoolSize = currentMaxInstances
): void {
  if (!editor) return
  try {
    // Remove from attached registry if present
    unregisterAttachedEditor(editor)

    try {
      const dom = editor.getDomNode()
      if (dom && dom.parentElement) dom.parentElement.removeChild(dom)
    } catch {
      /* ignore */
    }

    if (disposables && disposables.length) {
      disposables.forEach((d) => d.dispose())
    }

    const model = editor.getModel()
    if (pooledEditors.length >= maxPoolSize) {
      try {
        editor.dispose()
        if (model) model.dispose()
      } catch {
        /* ignore */
      }
    } else {
      try {
        editor.updateOptions({ readOnly: true })
      } catch {
        /* ignore */
      }
      pooledEditors.push({ editor, model })
    }
  } catch {
    /* ignore */
  }
}

function disposePoolEntry(entry: PoolEntry): void {
  try {
    entry.editor.dispose()
  } catch {
    /* ignore */
  }
  try {
    if (entry.model) entry.model.dispose()
  } catch {
    /* ignore */
  }
}

function disposeAttachedEntry(entry: AttachedEntry): void {
  // Prefer to notify the owning component so it can clean up UI refs
  if (entry.onExternalRelease) {
    try {
      entry.onExternalRelease()
    } catch {
      /* ignore */
    }
  } else {
    try {
      entry.editor.dispose()
    } catch {
      /* ignore */
    }
    try {
      if (entry.model) entry.model.dispose()
    } catch {
      /* ignore */
    }
  }
}

export function setMaxPoolSize(max: number): void {
  currentMaxInstances = Math.max(0, Math.floor(max) || 0)
  enforceMaxInstances(currentMaxInstances)
}

function enforceMaxInstances(max: number): void {
  // Compute current total
  let total = pooledEditors.length + attachedEditors.length
  // Step 1: dispose pooled editors (out-of-view) first
  while (total > max && pooledEditors.length > 0) {
    const e = pooledEditors.pop()!
    disposePoolEntry(e)
    total--
  }
  if (total <= max) return
  // Step 2: dispose attached editors. Prefer non-focused ones, preserve focused if possible
  const nonFocused = attachedEditors.filter((a) => !(a.isFocused && a.isFocused()))
  // Choose from nonFocused first
  for (let i = nonFocused.length - 1; i >= 0 && total > max; i--) {
    const entry = nonFocused[i]
    const idx = attachedEditors.findIndex((a) => a === entry)
    if (idx >= 0) attachedEditors.splice(idx, 1)
    disposeAttachedEntry(entry)
    total--
  }
  // If still above max, reluctantly dispose focused ones as well (preserve as many as possible)
  for (let i = attachedEditors.length - 1; i >= 0 && total > max; i--) {
    const entry = attachedEditors[i]
    attachedEditors.splice(i, 1)
    disposeAttachedEntry(entry)
    total--
  }
}

// Expose helpers for inspections (helpful for tests / debug)
export function _debugPoolCounts(): { pooled: number; attached: number; max: number } {
  return {
    pooled: pooledEditors.length,
    attached: attachedEditors.length,
    max: currentMaxInstances
  }
}
