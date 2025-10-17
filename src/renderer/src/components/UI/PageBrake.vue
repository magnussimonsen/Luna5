<!-- PageBreak.vue - Fills remaining space to next A4 page boundary in preview mode -->
<template>
  <div ref="pageBreakEl" class="page-break" :style="pageBreakStyle">
    <span class="page-break-label">— Page Break —</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useMenubarStore } from '@renderer/stores/UI/menubarStore'

const A4_HEIGHT_PX = 1123 // A4 height at 96 DPI in pixels
const A4_TOP_MARGIN_PX = 95 // Top padding of .cell-containers-list

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

    // Position within the cell list container (0 = top of cell list)
    const positionInContainer = pageBreakRect.top - cellListRect.top

    // Position within the A4 page content area (accounting for top margin)
    const positionInPage = positionInContainer - A4_TOP_MARGIN_PX

    // Determine which page we're on and the position within that page
    const currentPageNumber = Math.floor(positionInPage / A4_HEIGHT_PX)
    const nextPageBoundary = (currentPageNumber + 1) * A4_HEIGHT_PX

    // Calculate remaining space to fill (distance from current position to next page boundary)
    const remainingHeight = Math.max(0, nextPageBoundary - positionInPage)

    calculatedHeight.value = `${remainingHeight}px`
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

.page-break-label {
  background: white;
  padding: 0 8px;
  font-size: 11px;
  color: #999;
}
</style>
