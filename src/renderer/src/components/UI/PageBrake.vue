<!-- PageBreak.vue - Fills remaining space to next A4 page boundary in preview mode -->
<template>
  <div ref="pageBreakEl" class="page-break" :style="pageBreakStyle">
    <span class="page-break-label">— Page Break —</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'

const MM_TO_PX = 96 / 25.4
const A4_HEIGHT_PX = 297 * MM_TO_PX // Full A4 page height in px
const A4_TOP_MARGIN_PX = 25 * MM_TO_PX // Top margin/padding (25 mm)
const A4_BOTTOM_MARGIN_PX = 25 * MM_TO_PX // Bottom margin/padding (25 mm)
// Content band heights matching preview/print: first page has no top margin (header) but 25mm bottom
const FIRST_PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - A4_BOTTOM_MARGIN_PX // 272mm
// Subsequent pages have 25mm top and 25mm bottom
const OTHER_PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - A4_TOP_MARGIN_PX - A4_BOTTOM_MARGIN_PX // 247mm

const menubarStore = useMenubarStore()
const pageBreakEl = ref<HTMLElement | null>(null)
const calculatedHeight = ref<string>('auto')

const isA4Preview = computed(() => menubarStore.isA4Preview)

// Dynamic height calculation for A4 preview mode
const calculateFillHeight = (): void => {
  if (!isA4Preview.value || !pageBreakEl.value) {
    calculatedHeight.value = 'auto'
    return
  }

  // Find the cell containers list (A4 paper wrapper)
  const cellList = document.querySelector('.cell-containers-list')
  if (!cellList) {
    calculatedHeight.value = 'auto'
    return
  }

  try {
    // Get the page break element's position relative to the document
    const pageBreakRect = pageBreakEl.value.getBoundingClientRect()
    const cellListRect = cellList.getBoundingClientRect()

    // Position within the cell list container (0 = top of paper)
    const positionInContainer = pageBreakRect.top - cellListRect.top

    // Measure from the first page's content start (i.e., skip the paper's 25mm top padding)
    const positionFromFirstContentStart = positionInContainer - A4_TOP_MARGIN_PX

    let remainingHeightPx = 0
    if (positionFromFirstContentStart <= FIRST_PAGE_CONTENT_HEIGHT_PX) {
      // Still on first page's content band
      remainingHeightPx = FIRST_PAGE_CONTENT_HEIGHT_PX - positionFromFirstContentStart
    } else {
      // Past the first page's content band: use repeating bands of OTHER_PAGE_CONTENT_HEIGHT_PX
      const afterFirst = positionFromFirstContentStart - FIRST_PAGE_CONTENT_HEIGHT_PX
      const pagesAfter = Math.floor(afterFirst / OTHER_PAGE_CONTENT_HEIGHT_PX)
      const nextBoundaryFromFirstStart =
        FIRST_PAGE_CONTENT_HEIGHT_PX + (pagesAfter + 1) * OTHER_PAGE_CONTENT_HEIGHT_PX
      remainingHeightPx = nextBoundaryFromFirstStart - positionFromFirstContentStart
    }

    const clamped = Math.max(0, remainingHeightPx)
    calculatedHeight.value = `${clamped}px`
  } catch (error) {
    console.warn('[PageBreak] Height calculation failed:', error)
    calculatedHeight.value = 'auto'
  }
}

// Update height when A4 preview mode changes or component mounts
watch(isA4Preview, () => {
  if (isA4Preview.value) {
    nextTick(() => calculateFillHeight())
  } else {
    calculatedHeight.value = 'auto'
  }
})

onMounted(() => {
  calculateFillHeight()
  // Recalculate on resize to handle dynamic content changes
  const resizeObserver = new ResizeObserver(() => calculateFillHeight())
  const cellList = document.querySelector('.cell-containers-list')
  if (cellList) {
    resizeObserver.observe(cellList)
  }
  // Cleanup on unmount
  onBeforeUnmount(() => resizeObserver.disconnect())
})

// Style object combining base styles + dynamic height
const pageBreakStyle = computed(() => {
  const baseStyles = {
    borderTop: '2px dashed silver',
    borderBottom: '2px dashed silver',
    backgroundColor: 'rgba(200, 200, 200, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: 'gray',
    position: 'relative' as const,
    userSelect: 'none' as const
  }

  return {
    ...baseStyles,
    height: isA4Preview.value ? calculatedHeight.value : '2px',
    pageBreakAfter: 'always' as const,
    breakAfter: 'page' as const
  }
})
</script>

<style scoped>
.page-break {
  page-break-after: always; /* CSS print directive */
  break-after: page; /* CSS3 standard */
  position: relative;
  margin: 1em 0;
  user-select: none;
}

/* Print-specific styles: collapse the visual height, keep only the page-break directive */
@media print {
  .page-break {
    height: 0 !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: none !important;
    page-break-after: always;
    break-after: page;
  }

  .page-break-label {
    display: none !important;
  }
}

.page-break-label {
  background: white;
  padding: 0 8px;
  font-size: 11px;
  color: #999;
}
</style>
