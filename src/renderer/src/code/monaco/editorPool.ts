// Small shared Monaco editor pool used by PythonCell and other components.
// Keeps a limited number of detached editors + their models for fast re-use.
// The functions accept the `monaco` module reference to avoid assuming a
// global and to keep this module testable.

type PoolEntry = { editor: unknown; model: unknown }

const editorPool: PoolEntry[] = []

export function getEditorFromPool(
  monaco: unknown,
  container: HTMLElement,
  initialValue: string,
  options: unknown
): unknown {
  try {
    // monaco is expected to be the loaded monaco module; return null if missing
    // so callers can fall back.
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!monaco) {
      return null
    }

    const entry = editorPool.pop()
    if (entry && entry.editor) {
      // Work with unknown types but assume the runtime shape from Monaco
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pooledEditor: any = entry.editor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pooledModel: any =
        entry.model ?? (monaco as any).editor.createModel(initialValue, (options as any).language)
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
        pooledEditor.updateOptions({ readOnly: (options as any).readOnly ?? false })
        pooledEditor.layout()
      } catch {
        /* ignore */
      }
      return pooledEditor
    }

    // Create new editor when pool is empty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (monaco as any).editor.create(container, {
      value: initialValue,
      language: (options as any).language,
      readOnly: (options as any).readOnly ?? false,
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
      fontFamily: (options as any).fontFamily,
      fontSize: (options as any).fontSize
    })
  } catch (e) {
    // Log and return null to allow callers to fall back gracefully
    // eslint-disable-next-line no-console
    console.error('editorPool.getEditorFromPool error', e)
    return null
  }
}

export function releaseEditorToPool(
  editor: unknown,
  disposables: Array<{ dispose: () => void }> | null,
  maxPoolSize = 3
): void {
  if (!editor) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = editor
    try {
      const dom = e.getDomNode()
      if (dom && dom.parentElement) dom.parentElement.removeChild(dom)
    } catch {
      /* ignore */
    }

    if (disposables && disposables.length) {
      disposables.forEach((d) => d.dispose())
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = e.getModel()
    if (editorPool.length >= maxPoolSize) {
      try {
        e.dispose()
        if (model) model.dispose()
      } catch {
        /* ignore */
      }
    } else {
      try {
        e.updateOptions({ readOnly: true })
      } catch {
        /* ignore */
      }
      editorPool.push({ editor: e, model })
    }
  } catch {
    /* ignore */
  }
}
