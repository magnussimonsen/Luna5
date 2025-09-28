<template>
  <div class="python-cell-wrapper" :data-locked="isCellLocked ? 'true' : null">
    <div
      ref="editorElementRef"
      class="python-editor"
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

// Monaco is imported eagerly and initialized synchronously.
// We import the API and python contribution statically for a simpler setup.
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
// Guard flag to avoid echoing local edits back into the model watcher
let isApplyingLocalEdit = false
// (No visibility-based disposal) keep editors mounted until unmount/notebook change

import { parsePixelsToNumber } from '@renderer/utils/miscellaneous/parse-pixels-to-number'
// Eagerly import Monaco for a simple, non-lazy setup
// Note: this avoids dynamic lazy-loading of the editor and worker.
// Monaco initialization moved to initialize-monaco-editor.ts
import { initializeMonacoEditorForCell } from '@renderer/code/monaco/initialize-monaco-editor-for-cell'
// Ensure the python language contribution (tokenizer) is loaded so Monaco can colorize python source
// Register the python language contribution so Monaco recognizes the language and tokenizer
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
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

/**
 * initializeMonacoEditor
 *
 * Purpose:
 * - Create and wire a Monaco editor instance for this cell's mount node.
 *
 * What it does:
 * - Uses `initializeMonacoEditorForCell` (shared initializer) to create the
 *   editor, disposables and optional ResizeObserver.
 * - Hooks editor content changes back into the workspace store via
 *   `workspaceStore.setCellInputContent` while guarding against echoing local
 *   edits (using `isApplyingLocalEdit`).
 * - Applies theme and font options and ensures placeholder/source text is
 *   present if the model started empty.
 * - When the cell is selected, it also sets the editor readOnly state
 *   appropriately, focuses the editor and places the caret at the end.
 *
 * Inputs/Dependencies (captured from outer scope):
 * - `editorElementRef` (mount node), `props.cell` for ids and text,
 *   `fontStore` / `fontSizeStore` for font settings, `selectedMonacoThemeId`
 *   for theme, and `workspaceStore` for content updates.
 *
 * Outputs/Side-effects:
 * - Assigns `editor`, `disposables` and `resizeObserver` in outer scope.
 * - Updates store content via `workspaceStore.setCellInputContent` on edits.
 * - Focuses and manipulates the editor when the cell is selected.
 *
 * Lifecycle contract:
 * - The function returns nothing; callers/components must call
 *   `disposeEditorInstance()` and `disconnectVisibilityObserver()` when the
 *   component is torn down to remove listeners, disconnect observers and
 *   release Monaco resources. Disposables pushed into `disposables` are
 *   expected to be disposed by `disposeEditorInstance()`.
 *
 * Notes:
 * - The editor is created read-only by default. The component toggles
 *   writable state for the selected cell after initialization.
 * - This function keeps the creation logic minimal — heavy init details
 *   live in the shared initializer module for better reuse and testing.
 */
function initializeMonacoEditor(): void {
  console.log('[PythonCell] initializeMonacoEditor start', { cellId: props.cell.id })
  // Guard: don't re-create if an editor already exists or mount node is missing
  if (editor || !editorElementRef.value) return

  // Compute the initial text value to show in the editor. Prefer explicit
  // `cellInputContent` (user edits) and fall back to the original `source`.
  const initialValue = props.cell.cellInputContent ?? props.cell.source ?? ''

  // Collect current font settings so the shared initializer can apply them
  const fontFamily = fontStore.fonts.codingFont
  const fontSizePx = parsePixelsToNumber(fontSizeStore.fontSizes.codeEditorCellFontSize)

  // Create the editor via the shared initializer. This moves the heavy
  // setup (monaco.editor.create, event wiring, resize observer) into a
  // reusable module and returns the created editor plus cleanup handles.
  const result = initializeMonacoEditorForCell({
    mount: editorElementRef.value,
    initialValue,
    fontFamily,
    fontSizePx,
    onContentChange: (value: string) => {
      // Mark local edits so the external watcher doesn't echo them back
      isApplyingLocalEdit = true
      workspaceStore.setCellInputContent(props.cell.id, value)
      setTimeout(() => {
        isApplyingLocalEdit = false
      }, 0)
    },
    selectedThemeId: selectedMonacoThemeId.value
  })

  // Store the returned editor and the disposables/observer so they can be
  // disposed later by `disposeEditorInstance()` when the component unmounts.
  editor = result.editor
  disposables = result.disposables
  resizeObserver = result.resizeObserver

  console.log('[PythonCell] initializeMonacoEditor done', {
    cellId: props.cell.id,
    editorPresent: !!editor
  })

  try {
    // If this cell is currently selected in the UI, make it writable (unless
    // it's locked) and focus the editor so the user can start typing.
    if (cellSelection.selectedCellId === props.cell.id) {
      const shouldBeReadOnly = !!isCellLocked.value
      try {
        editor.updateOptions({ readOnly: shouldBeReadOnly })
      } catch {
        /* ignore */
      }

      // Focus and move the caret to the end of the buffer. We do this inside
      // a small timeout so the DOM/Monaco internal layout has settled.
      try {
        setTimeout(() => {
          try {
            editor.focus()
            const model = editor.getModel()
            if (model) {
              const lineCount = Math.max(1, model.getLineCount())
              try {
                // Place caret at end of last line and reveal it in the
                // viewport so keyboard input starts at the end.
                editor.setPosition({
                  lineNumber: lineCount,
                  column: model.getLineMaxColumn(lineCount)
                })
                editor.revealPositionInCenterIfOutsideViewport({ lineNumber: lineCount, column: 1 })
              } catch {
                /* ignore */
              }
            }
          } catch {
            /* ignore */
          }
        }, 0)
      } catch {
        /* ignore */
      }

      // After focusing, ensure the editor is writable if the cell isn't
      // locked. We call updateOptions again defensively in case theme/font
      // application above touched options.
      try {
        if (!isCellLocked.value) editor.updateOptions({ readOnly: false })
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }

  // Apply the selected theme and font settings. These are best-effort and
  // non-fatal — failures here should not break the component.
  try {
    applyMonacoTheme(selectedMonacoThemeId.value)
    editor.updateOptions({ fontFamily, fontSize: fontSizePx })
  } catch {
    /* ignore */
  }

  // If the editor model started empty but the cell has source text, write
  // that source into the editor so the cell shows meaningful content.
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
}

/**
 * scheduleInitializeMonacoEditor
 * Ensures we only initialize Monaco when the mount node is attached to the
 * document. Vue may move DOM nodes during reorders which can cause Monaco to
 * render into a node that is not yet connected. This helper defers the
 * initialization until the node is connected (with a retry loop) and then
 * forces a layout shortly after creation.
 */
function scheduleInitializeMonacoEditor(): void {
  if (editor || isUnmounting) return
  // Postpone until nextTick so Vue has applied DOM updates for reorders
  void nextTick(() => {
    let retries = 0
    const MAX_RETRIES = 12 // ~600ms at 50ms interval
    const RETRY_MS = 50

    const tryInit = (): void => {
      if (editor || isUnmounting) return
      const mount = editorElementRef.value
      const attached = !!(mount && (mount.isConnected || document.contains(mount)))
      if (attached) {
        try {
          initializeMonacoEditor()
          // Force a layout after a short delay so Monaco renders correctly
          setTimeout(() => {
            try {
              if (editor) editor.layout()
            } catch {
              /* ignore */
            }
          }, 50)
        } catch {
          /* ignore */
        }
      } else if (retries < MAX_RETRIES) {
        retries += 1
        setTimeout(tryInit, RETRY_MS)
      } else {
        // Give up silently if the mount never appeared; this is non-fatal.
      }
    }

    tryInit()
  })
}

// Per-cell Monaco instances are created and disposed by this component.

onMounted(() => {
  // Use lazy loader so Monaco and its workers are only fetched when needed
  // Initialize only if this cell is selected at mount time
  if (cellSelection.selectedCellId === props.cell.id) {
    // Initialize Monaco eagerly, but schedule to ensure the mount node is attached
    void scheduleInitializeMonacoEditor()
  }

  // Adjust the visibility observer logic to prevent unnecessary disposal
  // No IntersectionObserver-based disposal: keep editors mounted unless
  // the notebook changes or the component unmounts. This simplifies lifecycle
  // and avoids transient disposal during DOM reorders.
})

// React to notebook changes: initialize editors when this cell's parent notebook
// becomes the active notebook, and dispose when it is no longer active.
watch(
  () => props.parentNotebookId,
  (parentNbId) => {
    try {
      const currentNb = workspaceStore.currentNotebookId
      // If the notebook owning this cell is now the active notebook, ensure an editor exists.
      if (parentNbId && parentNbId === currentNb && !editor && !isUnmounting) {
        // Initialize the editor for this python cell even if it's not currently
        // fully visible.
        initializeMonacoEditor()
      }
      if (parentNbId && parentNbId !== currentNb && !isUnmounting) {
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
      if (parentNbId && parentNbId === currentNb && !editor && !isUnmounting) {
        scheduleInitializeMonacoEditor()
      }
      if (parentNbId && parentNbId !== currentNb && !isUnmounting) {
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
  console.log('[PythonCell] disposeEditorInstance start', { cellId: props.cell.id })
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
    console.log('[PythonCell] disposeEditorInstance done', { cellId: props.cell.id })
  }
}

// No-op: we don't use an IntersectionObserver anymore.
function disconnectVisibilityObserver(): void {
  /* intentionally left blank */
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

// Also watch the resolved theme id directly so changes propagate reliably
// even if callers mutate the underlying settings in different ways.
watch(
  () => selectedMonacoThemeId.value,
  (id) => {
    try {
      registerCuratedMonacoThemesIfNeeded()
      applyMonacoTheme(id)
      if (editor) {
        try {
          editor.layout()
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
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
    if (isApplyingLocalEdit) return // Do not echo local edits back
    // Prefer explicit input content; otherwise fall back to original source text
    const targetValue = nextInput ?? nextSource ?? ''
    // Normalize text for comparison: convert CRLF -> LF, NBSP -> space,
    // and strip trailing newlines so we only treat meaningful changes as diffs.
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

let isUnmounting = false

onBeforeUnmount(() => {
  isUnmounting = true
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
      // Initialize sync and then focus after a tick
      scheduleInitializeMonacoEditor()
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
    } else if (oldId === props.cell.id) {
      // just unselected: keep the editor mounted to avoid churn; make it read-only
      try {
        if (editor) editor.updateOptions({ readOnly: true })
      } catch {
        /* ignore */
      }
    }
  }
)

// If a store-level reordering operation starts, cancel any pending dispose
// timers immediately so components don't accidentally dispose while the
// DOM is being patched/moved. Also, avoid scheduling new disposals while
// reordering is active (handled in the IntersectionObserver callback).
// Previously we cleared pending visibility disposals when reordering started.
// Since we removed visibility-based disposal, there's no need for this watcher.
</script>

<style scoped>
/* Wrapper should NOT scroll: it contains the editor mount and outputs */
.python-cell-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: visible; /* allow outer scroller (.cell-containers-list) to handle scrolling */
  border: 1px solid var(--cell-border-color);
  background: var(--cell-background, #fff);

  box-sizing: border-box;
}

/* Monaco mount node: give a sane default height but allow override via CSS var
   and JS (the component may set an inline height when auto-growing). */
.python-editor {
  display: block;
  width: 100%;
  min-height: 0;
  height: var(--editor-height, 320px);
  overflow: hidden; /* Monaco renders its own scrollbars inside the mount */
  box-sizing: border-box;
}

.py-out-error {
  margin-top: 0.5em;
  border: 0px solid var(--error-border, #d92c2c);
  background: var(--error-bg, #fff1f1);
  color: var(--error-fg, #7a1010);
  border-radius: 4px;
  padding: 0.5em 0.75em;
}
.section-title {
  font-size: 0.8rem;
  opacity: 0.85;
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
  /* Visual hint for locked cells; keeps content readable while indicating state */
  opacity: 0.9;
  filter: grayscale(0.06);
}
</style>
