<template>
  <div v-if="images && images.length" class="py-out-images">
    <div class="section-title">
      <div class="zoom">
        <label :for="sliderId">Figure zoom</label>
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
        <span class="zoom-value">{{ zoom }}%</span>
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

const props = defineProps<{ images: string[]; cellId?: string }>()

// Zoom percent (5 - 100)
const zoom = ref<number>(50)
const sliderId = `py-fig-zoom-${Math.random().toString(36).slice(2, 8)}`

const workspaceStore = useWorkspaceStore()

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
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
}
.zoom {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.5rem;
  font-weight: normal;
}
.zoom input[type='range'] {
  width: 110px;
  height: 0.3rem;
}
.zoom-value {
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
  font-size: 0.8em;
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
