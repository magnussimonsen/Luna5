<template>
  <div class="python-cell" :data-locked="isCellLocked ? 'true' : null">
    <div
      ref="editorElementRef"
      class="python-cell-editor"
      data-primary-editor="true"
      role="textbox"
      :aria-readonly="isCellLocked ? 'true' : 'false'"
      tabindex="0"
    ></div>
    <!-- Outputs -->
    <PythonOutputText :text="props.cell.stdoutText ?? ''" />
    <PythonOutputImages :images="props.cell.stdoutImages ?? []" :cell-id="props.cell.id" />
    <div v-if="props.cell.workerError || props.cell.stderrText" class="py-out-error" role="alert">
      <div class="section-title">Errors</div>
      <pre v-if="props.cell.stderrText" class="stderr">{{ props.cell.stderrText }}</pre>
      <pre v-if="props.cell.workerError" class="stderr">{{ props.cell.workerError }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { useCellSelectionStore } from '@renderer/stores/toolbar-cell-communication/cellSelectionStore'
import type { PythonCell } from '@renderer/types/notebook-cell-types'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { ensureAllMonacoThemesDefined, applyMonacoTheme } from '@renderer/code/monaco/monaco-theme'

// Monaco will be lazy-loaded. See `lazyInitializeMonacoEditor` below.
// We load the ESM API, CSS, python contribution and the worker dynamically at runtime
// to avoid increasing the initial bundle size.
import PythonOutputText from './python-output/PythonOutputText.vue'
import PythonOutputImages from './python-output/PythonOutputImages.vue'

const props = defineProps<{ cell: PythonCell; parentNotebookId?: string | null }>()
const workspaceStore = useWorkspaceStore()
const cellSelection = useCellSelectionStore()
const themeStore = useThemeStore()
const codeSettingsStore = useCodeSettingsStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()

// DOM reference to the Monaco editor container
const editorElementRef = ref<HTMLDivElement | null>(null)
// Monaco editor instance (will be assigned after Monaco is loaded)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editor: any = null
// Collect Monaco disposables so we can clean up on unmount
let disposables: Array<{ dispose: () => void }> = []
// Resize observer to re-layout the editor when the container size changes
let resizeObserver: ResizeObserver | null = null
// Track whether the cell is currently visible in the viewport
let visibilityObserver: IntersectionObserver | null = null
const isVisible = ref<boolean>(true)
// Guard flag to avoid echoing local edits back into the model watcher
let isApplyingLocalEdit = false

import { parsePixelsToNumber } from '@renderer/utils/miscellaneous/parse-pixels-to-number'
// Previously we used an editor pool. That module is now archived and a shim
// remains at the same path. We will create/dispose Monaco instances per cell.

// Cells can be locked/hidden via several flags; reflect that in editor readOnly state
const isCellLocked = computed(
  () =>
    !!props.cell.hidden ||
    !!props.cell.softLocked ||
    !!props.cell.hardLocked ||
    !!props.cell.softDeleted
)

// Resolve theme id from settings + dark mode; falls back to Monaco built-ins
// The actively selected Monaco theme id, derived from light/dark mode and settings
const selectedMonacoThemeId = computed(() =>
  themeStore.isDarkMode
    ? codeSettingsStore.darkCodeEditorTheme
    : codeSettingsStore.lightCodeEditorTheme
)

// Ensure themes are globally registered once
function registerCuratedMonacoThemesIfNeeded(): void {
  ensureAllMonacoThemesDefined()
}

// Module-scoped references to the dynamically loaded Monaco and worker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let monaco: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let editorWorker: any = null
let monacoLoaded = false
let monacoInitializing = false
let monacoReadyPromise: Promise<void> | null = null
let monacoReadyResolve: (() => void) | null = null

// Use shared editor pool (see src/code/monaco/editorPool.ts)

// Lazy-load Monaco (API + CSS + python language) and the worker, then run
// the existing `initializeMonacoEditor` logic which expects Monaco to be present.
async function lazyInitializeMonacoEditor(): Promise<void> {
  if (monacoLoaded) {
    // Monaco already available => just initialize
    initializeMonacoEditor()
    return
  }

  // If another caller already started initializing Monaco, wait for it to finish
  if (monacoInitializing && monacoReadyPromise) {
    try {
      await monacoReadyPromise
    } catch {
      // ignore
    }
    // After the shared initialization completes, ensure editor exists
    initializeMonacoEditor()
    return
  }
  try {
    monacoInitializing = true
    monacoReadyPromise = new Promise((resolve) => {
      monacoReadyResolve = resolve
    })

    const results = await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.api'),
      import('monaco-editor/min/vs/editor/editor.main.css'),
      import('monaco-editor/esm/vs/basic-languages/python/python.contribution'),
      import('monaco-editor/esm/vs/editor/editor.worker?worker')
    ])
    monaco = results[0]
    // worker module default export is the worker constructor
    const workerMod = results[3]
    editorWorker = workerMod && (workerMod.default ?? workerMod)

    // Configure worker factory
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(self as any).MonacoEnvironment = {
      getWorker() {
        return new editorWorker()
      }
    }

    monacoLoaded = true
    monacoInitializing = false
    try {
      monacoReadyResolve && monacoReadyResolve()
    } catch {
      /* ignore */
    }
    // Now reuse the existing initialization logic which references `monaco` at runtime
    initializeMonacoEditor()
  } catch (err) {
    // Keep failure non-fatal in UI; log for debugging
    console.error('Failed to lazy-load Monaco editor', err)
    monacoInitializing = false
    try {
      monacoReadyResolve && monacoReadyResolve()
    } catch {
      /* ignore */
    }
  }
}

function initializeMonacoEditor(): void {
  // Guard against double-creation on the same DOM node
  if (editor) {
    try {
      console.debug('[PythonCell] initializeMonacoEditor: editor already exists, skipping')
    } catch {
      /* ignore */
    }
    return
  }
  if (!editorElementRef.value) return
  const initialValue = props.cell.cellInputContent ?? props.cell.source ?? ''
  // Make sure any custom themes are registered before creating editor
  // (built-ins like 'vs' / 'vs-dark' work without this).
  registerCuratedMonacoThemesIfNeeded()
  // Determine the desired starting readOnly state. If the cell is selected
  // it should be editable (unless locked); otherwise default to readOnly.
  const startingReadOnly =
    cellSelection.selectedCellId === props.cell.id ? !!isCellLocked.value : true
  // Create a dedicated Monaco editor instance for this cell.
  try {
    editor = monaco.editor.create(editorElementRef.value, {
      value: initialValue,
      language: 'python',
      readOnly: startingReadOnly,
      fontFamily: fontStore.fonts.codingFont,
      fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize),
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 1,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false }
    })
  } catch (e) {
    console.error('[PythonCell] failed to create Monaco editor', e)
    editor = null
  }
  // Debug: report editor creation and starting readonly state
  try {
    console.debug('[PythonCell] initializeMonacoEditor:', { id: props.cell.id, editor: !!editor })
    console.debug('[PythonCell] startingReadOnly', startingReadOnly)
  } catch {
    /* ignore */
  }
  // Propagate edits into the workspace
  disposables.push(
    editor.onDidChangeModelContent(() => {
      if (!editor) return
      const value = editor.getValue()
      // Mark that this change originated from the editor to avoid echoing
      // the store update back into setValue (which would reset the cursor)
      isApplyingLocalEdit = true
      workspaceStore.setCellInputContent(props.cell.id, value)
      // Release the flag on next tick
      setTimeout(() => {
        isApplyingLocalEdit = false
      }, 0)
      // Schedule a small resize after Monaco updates its internal layout
      try {
        setTimeout(() => {
          try {
            if (!editor || !editorElementRef.value) return
            const contentHeight = editor.getContentHeight()
            let minHeightPx = 0
            try {
              const computedStyle = window.getComputedStyle(editorElementRef.value)
              const minHeightCss = computedStyle.minHeight || '0px'
              if (minHeightCss.endsWith('px')) minHeightPx = parseFloat(minHeightCss)
            } catch {
              /* ignore */
            }
            const targetHeight = Math.max(contentHeight, minHeightPx)
            editorElementRef.value.style.height = `${Math.ceil(targetHeight)}px`
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
  // Debug: log key events to ensure keyboard reaches the editor
  try {
    // Skip attaching low-level key handlers here to avoid casting to `any`.
    // If you need key-level debugging, enable it temporarily in a local
    // branch or add a more specific type declaration for the Monaco editor.
  } catch {
    /* ignore */
  }
  // If this cell is currently selected, ensure the editor is writable (unless locked)
  try {
    if (cellSelection.selectedCellId === props.cell.id) {
      const shouldBeReadOnly = !!isCellLocked.value
      try {
        editor.updateOptions({ readOnly: shouldBeReadOnly })
        // Avoid calling editor.getOption (requires stronger types). We have
        // confirmed updateOptions was called; for deeper inspection enable
        // a typed Monaco import or run a temporary debug patch.
        console.debug('[PythonCell] updateOptions called for', props.cell.id)
      } catch {
        /* ignore */
      }
      // Focus and place caret at the end so keyboard input works immediately.
      // Do this after a tiny delay so the DOM move has settled.
      try {
        setTimeout(() => {
          try {
            editor.focus()
            console.debug('[PythonCell] focus attempt for', props.cell.id)
            const model = editor.getModel()
            if (model) {
              const lineCount = Math.max(1, model.getLineCount())
              try {
                editor.setPosition({
                  lineNumber: lineCount,
                  column: model.getLineMaxColumn(lineCount)
                })
                editor.revealPositionInCenterIfOutsideViewport({
                  lineNumber: lineCount,
                  column: 1
                })
                console.debug('[PythonCell] moved caret for', props.cell.id)
              } catch (e) {
                console.debug('[PythonCell] position error', e)
              }
            }
          } catch (e) {
            console.debug('[PythonCell] focus error', e)
          }
        }, 0)
      } catch (e) {
        console.debug('[PythonCell] scheduling focus error', e)
      }
      // Force writable for selected cell (double-check)
      try {
        if (!isCellLocked.value) {
          try {
            editor.updateOptions({ readOnly: false })
            console.debug('[PythonCell] forced readOnly=false for', props.cell.id)
          } catch (e) {
            console.debug('[PythonCell] error forcing readOnly=false', e)
          }
        }
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
  // Now switch to the desired theme
  applyMonacoTheme(selectedMonacoThemeId.value)
  // Ensure font options are respected after creation as well
  try {
    editor.updateOptions({
      fontFamily: fontStore.fonts.codingFont,
      fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
    })
  } catch {
    /* ignore */
  }
  // Defensive: ensure placeholder source appears if model started empty
  try {
    if (editor && !editor.getValue() && props.cell.source) {
      isApplyingLocalEdit = true
      editor.setValue(props.cell.source)
      setTimeout(() => {
        isApplyingLocalEdit = false
      }, 0)
    }
  } catch {
    /* ignore */
  }
  // Sync editor container height to content height for auto-grow
  const updateEditorHeightToContent = (): void => {
    if (!editor || !editorElementRef.value) return
    const contentHeight = editor.getContentHeight()
    let minHeightPx = 0
    try {
      const computedStyle = window.getComputedStyle(editorElementRef.value)
      const minHeightCss = computedStyle.minHeight || '0px'
      if (minHeightCss.endsWith('px')) {
        minHeightPx = parseFloat(minHeightCss)
      }
    } catch {
      /* ignore */
    }
    const targetHeight = Math.max(contentHeight, minHeightPx)
    editorElementRef.value.style.height = `${Math.ceil(targetHeight)}px`
    editor.layout()
  }
  // Update on content size changes
  // Use content height from the event to resize container precisely.
  disposables.push(
    editor.onDidContentSizeChange((e: { contentHeight: number }) => {
      if (!editorElementRef.value) return
      try {
        const contentHeight = e?.contentHeight ?? editor.getContentHeight()
        let minHeightPx = 0
        try {
          const computedStyle = window.getComputedStyle(editorElementRef.value)
          const minHeightCss = computedStyle.minHeight || '0px'
          if (minHeightCss.endsWith('px')) minHeightPx = parseFloat(minHeightCss)
        } catch {
          /* ignore */
        }
        const targetHeight = Math.max(contentHeight, minHeightPx)
        editorElementRef.value.style.height = `${Math.ceil(targetHeight)}px`
        try {
          editor.layout()
        } catch {
          /* ignore */
        }
      } catch {
        /* ignore */
      }
    })
  )
  // Ensure the cursor remains visible in the overall page viewport when it moves.
  // This helps when the cell shrinks (e.g. backspacing lines) so the caret doesn't
  // end up outside the browser viewport even though the editor internal viewport
  // may have adjusted.
  disposables.push(
    editor.onDidChangeCursorPosition(() => {
      try {
        if (!editor) return
        const pos = editor.getPosition()
        if (!pos) return
        // Ensure the editor's internal viewport shows the caret.
        try {
          editor.revealPositionInCenterIfOutsideViewport(pos)
        } catch {
          /* ignore */
        }

        // Additionally, ensure the caret stays inside the editor's internal
        // viewport. Use `getScrolledVisiblePosition` which returns visual
        // coordinates for the exact position (handles wrapped lines).
        try {
          let scrolledPos: { top: number; left: number; height: number } | null = null
          try {
            if (typeof editor.getScrolledVisiblePosition === 'function') {
              scrolledPos = editor.getScrolledVisiblePosition(pos)
            }
          } catch {
            scrolledPos = null
          }

          // Fallback to computing via getTopForLineNumber if `getScrolledVisiblePosition` is unavailable
          if (!scrolledPos && typeof editor.getTopForLineNumber === 'function') {
            try {
              const top = editor.getTopForLineNumber(pos.lineNumber)
              const nextTop = editor.getTopForLineNumber(pos.lineNumber + 1)
              scrolledPos = { top, left: 0, height: (nextTop && nextTop - top) || 16 }
            } catch {
              scrolledPos = null
            }
          }

          if (scrolledPos) {
            const layoutInfo =
              typeof editor.getLayoutInfo === 'function' ? editor.getLayoutInfo() : null
            const visibleHeight =
              layoutInfo && typeof layoutInfo.height === 'number' ? layoutInfo.height : null
            const currentScrollTop =
              typeof editor.getScrollTop === 'function' ? editor.getScrollTop() : null
            if (visibleHeight !== null && currentScrollTop !== null) {
              const marginPx = 8
              const caretTop = scrolledPos.top
              const caretBottom = scrolledPos.top + (scrolledPos.height ?? 16)
              const viewTop = currentScrollTop + marginPx
              const viewBottom = currentScrollTop + visibleHeight - marginPx
              if (caretTop < viewTop) {
                try {
                  editor.setScrollTop(Math.max(0, caretTop - marginPx))
                } catch {
                  /* ignore */
                }
              } else if (caretBottom > viewBottom) {
                try {
                  editor.setScrollTop(Math.max(0, caretBottom - visibleHeight + marginPx))
                } catch {
                  /* ignore */
                }
              }
            }
          }

          // Best-effort reveal (uses Monaco ScrollType when available)
          try {
            if (typeof (editor.revealPosition as unknown) === 'function') {
              if (
                typeof monaco !== 'undefined' &&
                monaco &&
                monaco.editor &&
                monaco.editor.ScrollType
              ) {
                try {
                  editor.revealPosition(pos, monaco.editor.ScrollType.Smooth)
                } catch {
                  try {
                    editor.revealPositionInCenterIfOutsideViewport(pos)
                  } catch {
                    /* ignore */
                  }
                }
              } else {
                try {
                  editor.revealPositionInCenterIfOutsideViewport(pos)
                } catch {
                  /* ignore */
                }
              }
            }
          } catch {
            /* ignore */
          }
        } catch {
          /* ignore */
        }

        // Finally, ensure the overall page viewport keeps the caret visible
        // when the editor itself is positioned off-screen due to container
        // collapsing or other layout changes.
        try {
          const scrolled =
            editor.getScrolledVisiblePosition && editor.getScrolledVisiblePosition(pos)
          const dom = editor.getDomNode && editor.getDomNode()
          if (scrolled && dom && dom.getBoundingClientRect) {
            // Only adjust the global page scroll if the editor currently has
            // text focus (user actively typing) or as a fallback when the
            // cell is selected but the focus API isn't available. This avoids
            // interfering with normal mouse-wheel scrolling when other cells
            // are active.
            const hasFocus =
              typeof editor.hasTextFocus === 'function'
                ? editor.hasTextFocus()
                : cellSelection.selectedCellId === props.cell.id
            if (!hasFocus) return

            const rect = dom.getBoundingClientRect()
            const caretAbsoluteY = window.scrollY + rect.top + scrolled.top
            const margin = 24 // px of breathing room
            const viewportTop = window.scrollY + margin
            const viewportBottom = window.scrollY + window.innerHeight - margin
            if (caretAbsoluteY < viewportTop || caretAbsoluteY > viewportBottom) {
              const target = Math.max(0, caretAbsoluteY - Math.floor(window.innerHeight / 2))
              window.scrollTo({ top: target, behavior: 'auto' })
            }
          }
        } catch {
          /* ignore */
        }
      } catch {
        /* ignore */
      }
    })
  )
  // Initial apply
  updateEditorHeightToContent()
  // Re-layout on container width changes
  if (editorElementRef.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      updateEditorHeightToContent()
    })
    resizeObserver.observe(editorElementRef.value)
  }
}

// Per-cell Monaco instances are created and disposed by this component.

onMounted(() => {
  // Use lazy loader so Monaco and its workers are only fetched when needed
  // Initialize only if this cell is selected at mount time
  if (cellSelection.selectedCellId === props.cell.id) {
    void lazyInitializeMonacoEditor()
  }

  // Observe visibility of the editor container so we can hybernate/destroy
  // Monaco instances when the cell scrolls out of view (to save memory).
  try {
    if (editorElementRef.value && 'IntersectionObserver' in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          const e = entries[0]
          const nowVisible = !!e && e.isIntersecting
          isVisible.value = nowVisible
          // If the cell becomes invisible and it is not selected, destroy the editor
          if (!nowVisible && cellSelection.selectedCellId !== props.cell.id) {
            try {
              disposeEditorInstance()
            } catch {
              /* ignore */
            }
            return
          }
          // If the cell becomes visible again and there is no editor, initialize
          // a lightweight read-only editor so the cell renders with syntax
          // highlighting. If the cell is selected we will make it writable in
          // the selection watcher.
          if (nowVisible && !editor) {
            try {
              // Use lazy loader which will create either a pooled editor or a
              // fresh one. The created editor will be read-only unless the
              // cell is selected (selection watcher will toggle it).
              void lazyInitializeMonacoEditor()
            } catch {
              /* ignore */
            }
          }
        },
        { root: null, threshold: 0.05 }
      )
      visibilityObserver.observe(editorElementRef.value)
    }
  } catch {
    /* ignore if IO not available */
  }
})

// React to notebook changes: initialize editors when this cell's parent notebook
// becomes the active notebook, and dispose when it is no longer active.
watch(
  () => props.parentNotebookId,
  (parentNbId) => {
    try {
      const currentNb = workspaceStore.currentNotebookId
      // If the notebook owning this cell is now the active notebook, ensure an editor exists.
      if (parentNbId && parentNbId === currentNb && !editor) {
        // Eagerly initialize the editor for this python cell even if it's not currently
        // fully visible. This implements the requested eager creation on notebook switch.
        void lazyInitializeMonacoEditor()
      }
      if (parentNbId && parentNbId !== currentNb) {
        try {
          if (editor) disposeEditorInstance()
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
  }
)

// Also react when the active notebook changes — props.parentNotebookId is static
// for the cell, so we must watch the workspace store to eagerly init/dispose
// editors when the user switches notebooks.
watch(
  () => workspaceStore.currentNotebookId,
  (currentNb) => {
    try {
      const parentNbId = props.parentNotebookId
      if (parentNbId && parentNbId === currentNb && !editor) {
        void lazyInitializeMonacoEditor()
      }
      if (parentNbId && parentNbId !== currentNb) {
        try {
          if (editor) disposeEditorInstance()
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
  }
)

// Watch the global settings for max Monaco instances and inform the pool
// Pool sizing is deprecated: editor pooling is archived and ignored.

// Dispose helper used when cell becomes unselected or on unmount
function disposeEditorInstance(): void {
  // Release to pool (the pool will either keep the editor for reuse or
  // dispose it depending on current max pool size). Pass the configured
  // max so the pool sizing is consistent.
  try {
    // Dispose all registered disposables
    try {
      disposables.forEach((d) => {
        try {
          d.dispose()
        } catch {
          /* ignore individual failures */
        }
      })
    } catch {
      /* ignore */
    }
    disposables = []

    // Disconnect and clear the resize observer if present
    if (resizeObserver) {
      try {
        resizeObserver.disconnect()
      } catch {
        /* ignore */
      }
      resizeObserver = null
    }

    if (editor) {
      try {
        // Dispose editor and its model
        try {
          const model = editor.getModel()
          editor.dispose()
          if (model) model.dispose()
        } catch {
          /* ignore */
        }
        // Clear any inline height previously set so layout can recalculate
        try {
          if (editorElementRef.value) editorElementRef.value.style.height = ''
        } catch {
          /* ignore */
        }
      } catch {
        /* ignore */
      }
    }
  } finally {
    editor = null
  }
}

// Clean up visibility observer when component is destroyed
function disconnectVisibilityObserver(): void {
  if (visibilityObserver && editorElementRef.value) {
    try {
      visibilityObserver.unobserve(editorElementRef.value)
    } catch {
      /* ignore */
    }
    try {
      visibilityObserver.disconnect()
    } catch {
      /* ignore */
    }
    visibilityObserver = null
  }
}

// Theme reactivity: when dark mode or selected theme changes,
// ensure themes are registered and then switch via setTheme().
watch(
  [
    () => themeStore.isDarkMode,
    () => codeSettingsStore.lightCodeEditorTheme,
    () => codeSettingsStore.darkCodeEditorTheme
  ],
  () => {
    registerCuratedMonacoThemesIfNeeded()
    applyMonacoTheme(selectedMonacoThemeId.value)
    if (editor) {
      editor.layout()
    }
  }
)

// Font reactivity: update Monaco options when coding font or size changes
watch(
  () => fontStore.fonts.codingFont,
  () => {
    if (!editor) return
    try {
      editor.updateOptions({ fontFamily: fontStore.fonts.codingFont })
      editor.layout()
    } catch {
      /* ignore */
    }
  }
)

watch(
  () => fontSizeStore.fontSizes.codeEditorCellFontSize,
  () => {
    if (!editor) return
    try {
      editor.updateOptions({
        fontSize: parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)
      })
      editor.layout()
    } catch {
      /* ignore */
    }
  }
)

// External content changes (e.g., load/undo) -> reflect in editor
watch(
  () => [props.cell.cellInputContent, props.cell.source] as const,
  ([nextInput, nextSource]) => {
    if (!editor) return
    if (isApplyingLocalEdit) return
    // Prefer explicit input content; otherwise fall back to original source text
    const targetValue = nextInput ?? nextSource ?? ''
    const normalize = (s: string): string =>
      s
        .replace(/\r\n/g, '\n')
        .replace(/\u00A0/g, ' ')
        .replace(/\n+$/g, '')
    const current = normalize(editor.getValue())
    const incoming = normalize(targetValue)
    if (current !== incoming) {
      editor.setValue(targetValue)
    }
  }
)

// Lock state changes -> toggle readOnly
watch(isCellLocked, (locked) => {
  if (!editor) return
  editor.updateOptions({ readOnly: locked })
})

onBeforeUnmount(() => {
  disposeEditorInstance()
  disconnectVisibilityObserver()
})

// React to selection changes: initialize when this cell becomes selected,
// dispose when it is no longer selected.
watch(
  () => cellSelection.selectedCellId,
  (newId, oldId) => {
    if (newId === props.cell.id) {
      // selected now
      // Initialize (or reuse) the editor, then ensure it's writable & focused
      void lazyInitializeMonacoEditor().then(() => {
        // Wait a tick so the editor DOM (possibly reparented) is settled,
        // then ensure it's editable and focused.
        void nextTick(() => {
          setTimeout(() => {
            try {
              if (editor) {
                editor.updateOptions({ readOnly: !!isCellLocked.value })
                try {
                  editor.focus()
                } catch {
                  /* ignore */
                }
              }
            } catch {
              /* ignore */
            }
          }, 0)
        })
      })
    } else if (oldId === props.cell.id) {
      // just unselected: if the cell remains visible, keep the editor around
      // (so it stays visible and responsive); if it is not visible, dispose it
      if (!isVisible.value) {
        disposeEditorInstance()
      } else {
        // If still visible, switch to read-only to avoid accidental edits
        try {
          if (editor) editor.updateOptions({ readOnly: true })
        } catch {
          /* ignore */
        }
      }
    }
  }
)
</script>

<style scoped>
.python-cell {
  font-family: var(--content-font, inherit);
  color: var(--text-color, #222);
}
.python-cell-editor {
  width: 100%;
  /* Let the editor auto-grow with content; JS sets explicit height in px. */
  min-height: 1em;
  height: auto;
  overflow: hidden;
  border: 0px solid var(--cell-border-color);
  /*Right border radius*/
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.py-out-error {
  margin-top: 0em;
  border: 0px solid var(--error-border, #d92c2c);
  background: var(--error-bg, #fff1f1);
  color: var(--error-fg, #7a1010);
  border-radius: 0px;
  padding: 0.5em 0.75em;
}
.section-title {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
}
.stderr {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
  cursor: text;
}
.py-out-error,
.py-out-error * {
  user-select: text;
}
.python-cell[data-locked='true'] {
  /* WHAT DOES THIS DO? */
  opacity: 0.9;
  filter: grayscale(0.1);
}
</style>
