<template>
  <div v-if="images && images.length" class="py-out-images">
    <div class="section-title">
      <div class="zoom">
        <label
          :for="sliderId"
          title="Click to reset zoom to default"
          :style="resetZoomBtnStyle"
          @click="resetZoom"
          >Figure zoom <span class="zoom-percent-fixed">{{ zoomPercentFixed }}</span></label
        >
        <input
          :id="sliderId"
          v-model.number="zoom"
          type="range"
          min="5"
          max="100"
          step="1"
          :aria-valuemin="5"
          :aria-valuemax="100"
          :aria-valuenow="zoom"
          aria-label="Zoom figures"
        />
      </div>
    </div>
    <div class="img-list">
      <figure v-for="(src, idx) in images" :key="idx" class="img-item">
        <img :src="src" :alt="`Figure ${idx + 1}`" :style="imgWidthStyle" loading="lazy" />
      </figure>
    </div>
  </div>
  <div v-else class="py-out-images empty" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useZoomStatesStore } from '@renderer/stores/UI/zoomStatesStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'

const props = defineProps<{ images: string[]; cellId?: string }>()

// Zoom percent (5 - 100)
const zoom = ref<number>(50)
const sliderId = `py-fig-zoom-${Math.random().toString(36).slice(2, 8)}`

const workspaceStore = useWorkspaceStore()
const zoomStatesStore = useZoomStatesStore()
const fontSizeStore = useFontSizeStore()
const fontStore = useFontStore()

// Reset zoom to default value
const resetZoom = (): void => {
  zoom.value = zoomStatesStore.resetPythonImageZoom()
}

// Check if zoom is at default value (for styling)
const isZoomAtDefault = computed(() => zoom.value === zoomStatesStore.resetPythonImageZoom())

// Style for reset button based on whether zoom is at default
const resetZoomBtnStyle = computed(() => ({
  '--py-zoom-btn-bg': isZoomAtDefault.value
    ? 'var(--reset-zoom-button-color-Center, var(--debug-color, lightgreen))'
    : 'var(--reset-zoom-button-color-OffCenter, var(--debug-color, lightcoral))',
  fontSize: fontSizeStore.fontSizes.statusbarFontSize,
  fontFamily: fontStore.fonts.uiFont
}))

// Fixed-width zoom percentage to prevent wobbling
const zoomPercentFixed = computed(() => {
  return `${zoom.value}`.padStart(4, ' ') + ' %' // Pad the percentage, then add space after
})

// Load stored zoom for this cell (if present) when component mounts
onMounted(() => {
  try {
    const cellId = props.cellId
    if (!cellId) return
    const stored = workspaceStore.getCellUiHint(cellId, 'stdoutImagesZoomSliderValue')
    if (typeof stored === 'number') {
      zoom.value = Math.max(5, Math.min(100, stored))
    }
  } catch {
    /* ignore */
  }
})

// Debounced writer to persist zoom; avoid rapid writes while sliding
let writeTimer: number | null = null
watch(
  () => zoom.value,
  (next) => {
    try {
      const cellId = props.cellId
      if (!cellId) return
      if (writeTimer) {
        clearTimeout(writeTimer)
      }
      writeTimer = window.setTimeout(() => {
        try {
          workspaceStore.setCellUiHint(
            cellId,
            'stdoutImagesZoomSliderValue',
            Math.max(5, Math.min(100, Math.round(next)))
          )
        } catch {
          /* ignore */
        }
        writeTimer = null
      }, 150)
    } catch {
      /* ignore */
    }
  }
)

// Luna4-style smooth zoom: image width follows slider percent directly
const imgWidthStyle = computed(() => ({ width: `${zoom.value}%` }))
</script>

<style scoped>
.py-out-images {
  margin-top: 0.5rem;
  background: var(--cell-background);
}
.section-title {
  opacity: 0.8;
  margin-bottom: 0.25rem;
}
.zoom {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  font-weight: normal;
}
.zoom label {
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;
  background: var(--py-zoom-btn-bg, transparent);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  border: 1px solid transparent;
}
.zoom label:hover {
  opacity: 0.8;
}
.zoom input[type='range'] {
  width: 110px;
  height: 0.3rem;
}
/* Fixed-width zoom percentage to prevent wobbling */
.zoom-percent-fixed {
  display: inline-block;
  width: 5ch; /* Reserve space for up to 5 characters (e.g., "100% ") */
  text-align: right; /* Align shorter values to the right for consistency */
  font-variant-numeric: tabular-nums; /* Use tabular numbers for consistent digit width */
  white-space: nowrap; /* Prevent wrapping */
}
.img-list {
  display: block;
}
.img-item {
  margin: 0 0 0.5rem 0;
  border: 0px solid var(--cell-border-color);
  border-radius: 0px;
  background: var(--python-image-background);
  overflow: visible;
}
img {
  display: block;
  width: 100%; /* overridden by inline style for zoom */
  height: auto;
}
.empty {
  display: none;
}
</style>
