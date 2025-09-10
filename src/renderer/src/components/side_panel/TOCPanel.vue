<template>
  <div class="side-panel-ui-base side-panel-padding-margin-base toc-panel">
    <h2>Table of Contents</h2>
    <div v-if="!headings.length" class="toc-empty">No headings yet. Add H1–H4 in text cells.</div>
    <ol v-else class="toc-list" role="list">
      <li v-for="h in headings" :key="h.id" class="toc-item" :class="'lvl-' + h.level">
        <button type="button" class="toc-link" @click="scrollToHeading(h)">
          <span class="toc-num" aria-hidden="true">{{ h.numbering }}</span>
          <span class="toc-text">{{ h.text || '(empty)' }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

interface TocHeading {
  id: string
  cellId: string
  level: number
  text: string
  numbering: string
}

const workspaceStore = useWorkspaceStore()
const refreshTick = ref(0) // cheap trigger when needed

// Extract headings from text-cell HTML (cellInputContent or source fallback)
const headings = computed<TocHeading[]>(() => {
  // reference tick so polling triggers recompute
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  refreshTick.value
  const ws = workspaceStore.getWorkspace?.()
  if (!ws) return []
  const nbId = workspaceStore.currentNotebookId
  if (!nbId) return []
  const nb = ws.notebooks[nbId]
  if (!nb) return []
  const result: TocHeading[] = []
  const counters: number[] = [] // outline counters per level (index 0 -> h1)
  const order = nb.cellOrder || []
  for (const cellId of order) {
    const cell = ws.cells[cellId]
    if (!cell || cell.kind !== 'text-cell' || cell.softDeleted || cell.hidden) continue
    const html = cell.cellInputContent || cell.source || ''
    if (!html) continue
    // Parse headings (h1-h4) via a lightweight regex fallback + DOM parse for text
    // Regex to find opening tags <h1 ...>...</h1>
    const tagRe = /<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi
    let m: RegExpExecArray | null
    while ((m = tagRe.exec(html))) {
      const level = parseInt(m[1], 10)
      const rawInner = m[3]
      // Strip HTML tags to plain text (basic)
      const text = rawInner
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
      if (!text) continue
      const id = `${cellId}-h-${m.index}`
      // --- Outline numbering logic -------------------------------------------------
      // Maintain counters[] where length == deepest level encountered.
      // Encounter level L:
      //  - Ensure counters has at least L entries (pad with 0s)
      //  - Increment counters[L-1]
      //  - Truncate any deeper levels
      //  - For any leading zeros (if user started with h2/h3), backfill with 1 so we don't show 0.x
      while (counters.length < level) counters.push(0)
      counters[level - 1] += 1
      counters.splice(level) // drop deeper levels
      for (let i = 0; i < level - 1; i++) if (counters[i] === 0) counters[i] = 1
      const numbering = counters.slice(0, level).join('.')
      // -----------------------------------------------------------------------------
      result.push({ id, cellId, level, text, numbering })
    }
  }
  return result
})

function scrollToHeading(h: TocHeading): void {
  // Strategy: find the TextCell DOM element, then query for heading text match inside.
  // Each text cell likely rendered with data attributes (not guaranteed) – fallback to text match search.
  try {
    const cellEl =
      document.querySelector(`[data-cell-id="${h.cellId}"]`) ||
      document.getElementById(h.cellId) ||
      // Fallback: any element containing the heading text and an h tag.
      (Array.from(document.querySelectorAll('h1,h2,h3,h4')).find(
        (el) => el.textContent?.trim() === h.text
      ) as HTMLElement | undefined)
    if (cellEl) {
      cellEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Brief highlight effect
      cellEl.classList.add('toc-highlight')
      setTimeout(() => cellEl.classList.remove('toc-highlight'), 1200)
    }
  } catch {
    /* ignore */
  }
}

// Listen for workspace save/unsave or tick updates (simplistic: poll mutation events via interval)
let interval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  interval = setInterval(() => {
    refreshTick.value++
  }, 2000) // light polling; could be optimized with event bus later
})
onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})

// Recompute when current notebook changes
watch(
  () => workspaceStore.currentNotebookId,
  () => {
    refreshTick.value++
  }
)
</script>

<style scoped>
@import '@renderer/css/side-panel-base.css';

.toc-panel {
  font-size: 0.9rem;
  line-height: 1.25;
}
.toc-empty {
  opacity: 0.7;
  font-style: italic;
  padding: 0.25rem 0;
}
.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.toc-item {
  display: block;
}
.toc-link {
  background: none;
  border: none;
  padding: 0.15rem 0.25rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: var(--text-color, #222);
  border-radius: 3px;
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
}
.toc-link:hover {
  background: var(--cell-margin-background-color, #eef2f5);
}
.toc-num {
  font-variant-numeric: tabular-nums;
  color: var(--text-dim-color, #555);
  min-width: 2.2rem;
  text-align: left;
  flex-shrink: 0;
}
.toc-num::after {
  content: ' ';
}
.toc-item.lvl-1 .toc-link {
  font-weight: 600;
}
.toc-item.lvl-2 .toc-link {
  padding-left: 0.5rem;
}
.toc-item.lvl-3 .toc-link {
  padding-left: 1rem;
  font-size: 0.95em;
}
.toc-item.lvl-4 .toc-link {
  padding-left: 1.25rem;
  font-size: 0.9em;
}

/* Temporary highlight style when jumping */
.toc-highlight {
  outline: 2px solid var(--active-border-color, #2563eb);
  outline-offset: 2px;
  transition: outline-color 1s ease;
}
</style>
