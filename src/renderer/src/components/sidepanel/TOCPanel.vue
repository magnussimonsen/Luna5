<template>
  <div
    :class="[
      'sidepanel-row-flex-wrap',
      'sidepanel-color-font-styling',
      'util-sub-sidepanel-container-padding'
    ]"
  >
    <h3 class="util-margin-zero">Table of Contents</h3>
  </div>
  <div
    :class="[
      'sidepanel-flex-column-overflow-y',
      'sidepanel-color-font-styling',
      'util-sub-sidepanel-container-padding'
    ]"
  >
    <div v-if="!headings.length" class="sidepanel__text-message--empty">
      No headings yet. Add H1–H4 in text cells.
    </div>
    <ol
      v-else
      :class="[
        'sidepanel-flex-column-overflow-y',
        'util-liststyle-none',
        'util-margin-zero',
        'util-padding-zero'
      ]"
      role="list"
    >
      <li v-for="h in headings" :key="h.id" :class="['sidepanel__toc-item']">
        <span
          class="sidepanel__toc-link"
          tabindex="0"
          @click="scrollToHeading(h)"
          @keydown.enter.prevent="scrollToHeading(h)"
          @keydown.space.prevent="scrollToHeading(h)"
        >
          <span class="sidepanel__toc-numbering" aria-hidden="true">{{ h.numbering }}</span>
          <span>{{ h.text || '(empty)' }}</span>
        </span>
      </li>
    </ol>
  </div>
</template>
|

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

/**
 * Type: TocHeading
 * Describes a single heading entry shown in the table of contents.
 * Use descriptive names; avoid abbreviations to help new contributors.
 */
interface TocHeading {
  id: string
  cellId: string
  level: number
  text: string
  numbering: string
}

// Pinia store for accessing workspace and notebook state.
const workspaceStore = useWorkspaceStore()

// Lightweight trigger used to force recomputation when the workspace changes.
const refreshTick = ref(0)

/**
 * Compute the list of headings for the current notebook.
 * Implementation notes:
 * - We iterate the notebook's cell order and parse text-cell HTML for H1-H4 tags.
 * - Outline numbering is computed incrementally using outlineCounters[].
 * - This is intentionally simple and robust; consider replacing polling with events
 *   if performance becomes a concern.
 */
const headings = computed<TocHeading[]>(() => {
  // Reference the tick so changes cause recompute (light polling in onMounted)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  refreshTick.value

  const workspace = workspaceStore.getWorkspace?.()
  if (!workspace) return []

  const currentNotebookId = workspaceStore.currentNotebookId
  if (!currentNotebookId) return []

  const notebook = workspace.notebooks[currentNotebookId]
  if (!notebook) return []

  const result: TocHeading[] = []
  const outlineCounters: number[] = [] // outline counters per level (index 0 -> h1)
  const cellOrder = notebook.cellOrder || []

  for (const cellId of cellOrder) {
    const cell = workspace.cells[cellId]
    if (!cell || cell.kind !== 'text-cell' || cell.softDeleted || cell.hidden) continue
    const html = cell.cellInputContent || cell.source || ''
    if (!html) continue

    // Regex to find heading tags <h1 ...>...</h1> up to h4
    const headingTagRegex = /<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi
    let match: RegExpExecArray | null
    while ((match = headingTagRegex.exec(html))) {
      const level = parseInt(match[1], 10)
      const rawInner = match[3]

      // Convert inner HTML to plain text (basic approach)
      const text = rawInner
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
      if (!text) continue

      const id = `${cellId}-h-${match.index}`

      // --- Outline numbering logic -------------------------------------------------
      // Maintain outlineCounters[] where length == deepest level encountered.
      // Encounter level L:
      //  - Ensure outlineCounters has at least L entries (pad with 0s)
      //  - Increment outlineCounters[L-1]
      //  - Truncate any deeper levels
      //  - For any leading zeros (if user started with h2/h3), backfill with 1 so we don't show 0.x
      while (outlineCounters.length < level) outlineCounters.push(0)
      outlineCounters[level - 1] += 1
      outlineCounters.splice(level) // drop deeper levels
      for (let i = 0; i < level - 1; i++) if (outlineCounters[i] === 0) outlineCounters[i] = 1
      const numbering = outlineCounters.slice(0, level).join('.')
      // -----------------------------------------------------------------------------

      result.push({ id, cellId, level, text, numbering })
    }
  }
  return result
})

/**
 * Scroll to the selected heading inside the notebook. Uses multiple fallbacks
 * to find the correct DOM element: data attribute, id, or heading text match.
 */
function scrollToHeading(heading: TocHeading): void {
  try {
    const cellElement =
      document.querySelector(`[data-cell-id="${heading.cellId}"]`) ||
      document.getElementById(heading.cellId) ||
      (Array.from(document.querySelectorAll('h1,h2,h3,h4')).find(
        (el) => el.textContent?.trim() === heading.text
      ) as HTMLElement | undefined)

    if (cellElement) {
      cellElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Brief highlight to draw attention to the target cell
      cellElement.classList.add('toc-highlight')
      setTimeout(() => cellElement.classList.remove('toc-highlight'), 1200)
    }
  } catch {
    // Ignore DOM errors – this is a non-critical UI enhancement
  }
}

// Light polling to detect workspace changes. This is intentionally simple.
let intervalHandle: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  intervalHandle = setInterval(() => {
    refreshTick.value++
  }, 2000) // light polling interval; replace with event-driven updates later if needed
})
onBeforeUnmount(() => {
  if (intervalHandle) clearInterval(intervalHandle)
})

// Also trigger recompute when the current notebook changes
watch(
  () => workspaceStore.currentNotebookId,
  () => {
    refreshTick.value++
  }
)
</script>

<style scoped>
/* Styles are in the css folder */
</style>
