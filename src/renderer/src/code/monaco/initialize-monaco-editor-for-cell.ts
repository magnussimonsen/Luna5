import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { ensureAllMonacoThemesDefined, applyMonacoTheme } from '@renderer/code/monaco/monaco-theme'

/*
  initialize-monaco-editor.ts

  Purpose:
  - Provide a focused, reusable helper that creates and configures a Monaco
    editor instance for a cell mount node.
  - Wire up common concerns such as automatic layout, content-sync callbacks,
    caret-following (scrolling outer ancestor when the caret moves), and
    resize observation.

  Motivation:
  - Move heavy editor initialization logic out of large Vue components so it
    can be re-used and kept testable. The component (e.g. PythonCell.vue)
    remains responsible for wiring selection, readOnly state and integration
    with the workspace store; this module focuses purely on editor setup.

  Contract (inputs/outputs):
  - Inputs (options):
    - mount: DOM element where Monaco will be mounted
    - initialValue: initial text for the editor
    - fontFamily, fontSizePx: visual options
    - onContentChange: callback when user edits content
    - selectedThemeId: theme to apply after creation
  - Returns: an object containing the created editor instance, an array of
    disposables to be disposed when tearing down, and an optional
    ResizeObserver used for automatic layout.

  Error handling:
  - The function is defensive and swallows non-fatal errors to avoid breaking
    the host component during editor initialization. Callers are expected to
    handle lifecycle (dispose observers, editor) using the returned values.
*/

// Prefer Monaco's built-in IDisposable type for disposables returned by
// editor APIs. This gives stronger typing and aligns with Monaco's contracts.
type Disposeable = monaco.IDisposable

/**
 * Create and configure a Monaco editor instance for a cell mount node.
 *
 * This function encapsulates the common initialization steps required by
 * the app when mounting Monaco inside a cell component. It performs the
 * following responsibilities:
 *  - Registers curated themes (if needed)
 *  - Creates a standalone Monaco editor on the provided mount node
 *  - Sets up event listeners that keep the mount height in sync with the
 *    editor's content, and calls back to the caller with content changes
 *  - Wires caret-following helpers so keyboard navigation keeps the caret
 *    visible in the outer scroll container
 *  - Returns the editor instance, a list of disposables (to be disposed by
 *    the caller when tearing down), and an optional ResizeObserver used for
 *    automatic layout.
 *
 * Note: the editor is created in readOnly mode by default. The caller
 * (typically the Vue component) is responsible for toggling writable state
 * for the selected cell, focusing the editor, and performing final
 * lifecycle disposal.
 *
 * Inputs: options.mount (HTMLElement), options.initialValue (string),
 * options.fontFamily, options.fontSizePx, options.onContentChange (callback),
 * and options.selectedThemeId (string).
 *
 * Returns: { editor, disposables, resizeObserver }
 */
export function initializeMonacoEditorForCell(options: {
  mount: HTMLElement
  initialValue: string
  fontFamily: string
  fontSizePx: number
  onContentChange: (value: string) => void
  selectedThemeId: string
}): {
  editor: monaco.editor.IStandaloneCodeEditor
  disposables: Disposeable[]
  resizeObserver: ResizeObserver | null
} {
  const { mount, initialValue, fontFamily, fontSizePx, onContentChange, selectedThemeId } = options

  // Ensure any curated Monaco themes used by the app are registered before
  // creating the editor. This is a no-op if themes are already registered.
  ensureAllMonacoThemesDefined()

  const editor = monaco.editor.create(mount, {
    value: initialValue,
    language: 'python',
    // Start in readOnly mode by default. The caller (component) will set
    // writable state when the cell is selected.
    readOnly: true,
    automaticLayout: true,
    wordWrap: 'on',
    wrappingIndent: 'same',
    scrollBeyondLastLine: false,
    scrollbar: { vertical: 'hidden', horizontal: 'auto', alwaysConsumeMouseWheel: false },
    mouseWheelScrollSensitivity: 1,
    fastScrollSensitivity: 5,
    smoothScrolling: true,
    cursorSurroundingLines: 3,
    cursorSurroundingLinesStyle: 'all',
    cursorSmoothCaretAnimation: 'on',
    minimap: { enabled: false },
    lineNumbers: 'on',
    lineNumbersMinChars: 3,
    lineDecorationsWidth: 1,
    fontFamily,
    fontSize: fontSizePx
  })

  const disposables: Disposeable[] = []

  let fontRefreshHandle: number | null = null
  const scheduleFontMetricsRefresh = (): void => {
    if (fontRefreshHandle !== null) return
    fontRefreshHandle = window.requestAnimationFrame(() => {
      fontRefreshHandle = null
      try {
        monaco.editor.remeasureFonts()
      } catch {
        /* ignore */
      }
      try {
        editor.layout()
      } catch {
        /* ignore */
      }
    })
  }
  disposables.push({
    dispose: () => {
      if (fontRefreshHandle !== null) {
        cancelAnimationFrame(fontRefreshHandle)
        fontRefreshHandle = null
      }
    }
  })

  /**
   * Sync the mount node height to Monaco's content height.
   *
   * Monaco manages its internal viewport; the surrounding layout expects
   * the mount node to report an appropriate height. This helper reads
   * Monaco's content height (or an optionally supplied value) and writes
   * the mount element's inline height. A requestAnimationFrame is used to
   * coalesce writes and avoid layout thrash.
   */
  const syncHeight = (editorHeight?: number): void => {
    const contentHeight = editorHeight ?? editor.getContentHeight()
    // Use requestAnimationFrame to ensure DOM writes happen after layout
    // and to avoid jank. We set the mount node height so the outer layout
    // can calculate positions for scrolling and visual flow.
    requestAnimationFrame(() => {
      mount.style.height = `${Math.ceil(contentHeight)}px`
      try {
        editor.layout()
      } catch {
        /* ignore layout failures */
      }
    })
  }

  disposables.push(
    editor.onDidContentSizeChange((e: { contentHeight: number }) => syncHeight(e.contentHeight))
  )

  /**
   * Walk up the DOM tree from `el` and return the closest ancestor that
   * scrolls vertically. Prefers the application-specific
   * `.workspace-web-layout-container` when present. Returns the document
   * scrolling element as a fallback.
   *
   * This is used by caret-following code to know which ancestor to scroll
   * when the editor caret moves out of view.
   */
  const findClosestScrollableAncestor = (el: HTMLElement | null): HTMLElement | null => {
    let node: HTMLElement | null = el
    while (node) {
      // Prefer an application-specific outer scroll container when present
      if (node.classList && node.classList.contains('workspace-web-layout-container')) return node
      const style = window.getComputedStyle(node)
      const overflowY = style.overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') return node
      node = node.parentElement
    }
    return (document.scrollingElement as HTMLElement) || document.body
  }

  /**
   * Ensure the editor caret is visible inside the nearest outer scrollable
   * ancestor.
   *
   * Steps:
   *  - Compute the caret pixel position relative to the page.
   *  - Find the nearest scrollable ancestor and compare the caret Y to the
   *    ancestor's bounding rect.
   - If the caret is above/below the visible window of the ancestor, scroll
   *    the ancestor smoothly to reveal the caret.
   *
   * This keeps keyboard-driven cursor movement pleasant for users by
   * scrolling the outer container, not the internal Monaco viewport.
   */
  const ensureCaretVisibleInAncestor = (): void => {
    try {
      if (!editor || !mount) return
      const pos = editor.getPosition()
      if (!pos) return
      const scPos = editor.getScrolledVisiblePosition(pos)
      if (!scPos) return
      const editorDom = editor.getDomNode()
      if (!editorDom) return
      const caretViewportY = editorDom.getBoundingClientRect().top + scPos.top
      // If the caret moved outside the visible region of the outer
      // scrollable ancestor, scroll that ancestor so the caret becomes
      // visible. This helps keyboard navigation keep the user in context.
      const ancestor = findClosestScrollableAncestor(mount)
      if (!ancestor) return
      const ancRect = ancestor.getBoundingClientRect()
      const margin = 20

      if (caretViewportY < ancRect.top + margin) {
        const delta = caretViewportY - (ancRect.top + margin)
        ancestor.scrollBy({ top: delta, behavior: 'smooth' })
      } else if (caretViewportY > ancRect.bottom - margin) {
        const delta = caretViewportY - (ancRect.bottom - margin)
        ancestor.scrollBy({ top: delta, behavior: 'smooth' })
      }
    } catch {
      /* ignore */
    }
  }

  try {
    // When the cursor moves or the editor receives focus, ensure the caret
    // is visible inside the nearest outer scrollable ancestor. We schedule
    // the call inside requestAnimationFrame to avoid layout thrash. Each
    // subscription returns a disposable which we store in `disposables` so
    // the caller can cleanly remove the listeners during teardown.
    disposables.push(
      editor.onDidChangeCursorPosition(() => {
        requestAnimationFrame(() => ensureCaretVisibleInAncestor())
      })
    )
    disposables.push(
      editor.onDidFocusEditorText(() => {
        requestAnimationFrame(() => ensureCaretVisibleInAncestor())
      })
    )
  } catch {
    /* ignore */
  }

  // Propagate edits into consumer via callback
  disposables.push(
    editor.onDidChangeModelContent(() => {
      try {
        const value = editor.getValue()
        onContentChange(value)
        setTimeout(() => {
          try {
            const contentHeight = editor.getContentHeight()
            const targetHeight = Math.max(contentHeight, 0)
            mount.style.height = `${Math.ceil(targetHeight)}px`
            try {
              editor.layout()
            } catch {
              /* ignore */
            }
          } catch {
            /* ignore */
          }
        }, 0)
      } catch {
        /* ignore */
      }
    })
  )

  // Initial sizing
  syncHeight()
  scheduleFontMetricsRefresh()

  if ('fonts' in document) {
    const fontSet = (document as unknown as { fonts?: FontFaceSet }).fonts
    if (fontSet) {
      void fontSet.ready
        .then(() => scheduleFontMetricsRefresh())
        .catch(() => {
          scheduleFontMetricsRefresh()
        })
      const handle = (): void => scheduleFontMetricsRefresh()
      if (typeof fontSet.addEventListener === 'function') {
        fontSet.addEventListener('loadingdone', handle)
        disposables.push({
          dispose: () => {
            fontSet.removeEventListener('loadingdone', handle)
          }
        })
      }
    }
  }

  let resizeObserver: ResizeObserver | null = null
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => syncHeight())
    resizeObserver.observe(mount)
  }

  // Apply theme and font options now that the editor exists. These calls are
  // best-effort and non-fatal; failures are swallowed to keep the host
  // component resilient.
  try {
    applyMonacoTheme(selectedThemeId)
    editor.updateOptions({ fontFamily, fontSize: fontSizePx })
  } catch {
    /* ignore */
  }

  // If initial value missing but source present, set value
  try {
    if (editor && !editor.getValue() && initialValue) {
      editor.setValue(initialValue)
    }
  } catch {
    /* ignore */
  }

  return { editor, disposables, resizeObserver }
}
