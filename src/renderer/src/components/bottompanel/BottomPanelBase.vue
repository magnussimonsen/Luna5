<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type Component } from 'vue'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import type { PanelName } from '@renderer/types/sidepanel-types'
import KatexInputTopToolbar from './KatexInputTopToolbar.vue'
import KatexInputAndPreviewPanel from './KatexInputAndPreviewPanel.vue'

const bottomPanelStore = useBottomPanelStore()

const isOpen = computed(() => bottomPanelStore.isOpen)
const panelHeight = computed(() => `${bottomPanelStore.panelHeight}px`)
const panelRef = ref<HTMLElement | null>(null)

const topToolbarByPanel: Partial<Record<PanelName, Component>> = {
  insertKatexMath: KatexInputTopToolbar
}

const contentByPanel: Partial<Record<PanelName, Component>> = {
  insertKatexMath: KatexInputAndPreviewPanel
}

const activeTopToolbarComponent = computed<Component | null>(() => {
  const panel = bottomPanelStore.activePanel
  if (!panel) return null
  return topToolbarByPanel[panel] ?? null
})

const activeContentComponent = computed<Component | null>(() => {
  const panel = bottomPanelStore.activePanel
  if (!panel) return null
  return contentByPanel[panel] ?? null
})

let startY = 0
let startHeight = 0
let previousBodyOverflow = ''
let previousAppPointerEvents = ''

const clampHeight = (height: number): number => {
  const min = bottomPanelStore.minHeight
  const max = bottomPanelStore.maxHeight
  return Math.min(Math.max(height, min), max)
}

const parseCssPxVar = (value: string | null | undefined): number => {
  if (!value) return 0
  const parsed = parseFloat(value.trim().replace('px', ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const refreshHeightBounds = (): void => {
  const viewportHeight = window.innerHeight || 800
  const bottomChrome = parseCssPxVar(
    getComputedStyle(document.documentElement).getPropertyValue('--bottom-chrome-height')
  )
  const margin = 48
  const max = Math.max(bottomPanelStore.minHeight + 50, viewportHeight - bottomChrome - margin)
  bottomPanelStore.setHeightBounds({ max })
  if (!bottomPanelStore.isOpen && bottomPanelStore.panelHeight > max) {
    bottomPanelStore.setPanelHeight(max)
  }
}

const appRoot = (): HTMLElement | null => document.getElementById('app')

const lockBackground = (): void => {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  const root = appRoot()
  if (root) {
    previousAppPointerEvents = root.style.pointerEvents
    root.style.pointerEvents = 'none'
    root.setAttribute('aria-hidden', 'true')
    try {
      root.setAttribute('inert', '')
    } catch {
      /* inert may be unsupported */
    }
  }
}

const unlockBackground = (): void => {
  document.body.style.overflow = previousBodyOverflow
  const root = appRoot()
  if (root) {
    root.style.pointerEvents = previousAppPointerEvents
    root.removeAttribute('aria-hidden')
    root.removeAttribute('inert')
  }
}

const closePanel = (): void => {
  bottomPanelStore.closeBottomPanel()
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (!isOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
  }
}

const handlePointerMove = (event: MouseEvent | TouchEvent): void => {
  const clientY = 'touches' in event ? (event.touches[0]?.clientY ?? startY) : event.clientY
  const delta = startY - clientY
  bottomPanelStore.setPanelHeight(clampHeight(startHeight + delta))
}

const stopResizing = (): void => {
  if (!bottomPanelStore.isResizing) return
  bottomPanelStore.endResize()
  window.removeEventListener('mousemove', handlePointerMove)
  window.removeEventListener('touchmove', handlePointerMove)
  window.removeEventListener('mouseup', stopResizing)
  window.removeEventListener('touchend', stopResizing)
  document.body.classList.remove('bottom-panel-resizing')
}

const startResizing = (clientY: number): void => {
  startY = clientY
  startHeight = bottomPanelStore.panelHeight
  bottomPanelStore.beginResize()
  window.addEventListener('mousemove', handlePointerMove, { passive: false })
  window.addEventListener('touchmove', handlePointerMove, { passive: false })
  window.addEventListener('mouseup', stopResizing, { passive: true })
  window.addEventListener('touchend', stopResizing, { passive: true })
  document.body.classList.add('bottom-panel-resizing')
}

const handleResizeStart = (event: MouseEvent | TouchEvent): void => {
  event.preventDefault()
  const clientY = 'touches' in event ? event.touches[0]?.clientY : event.clientY
  if (typeof clientY === 'number') {
    startResizing(clientY)
  }
}

watch(
  isOpen,
  (open) => {
    if (open) {
      refreshHeightBounds()
      lockBackground()
      window.addEventListener('keydown', handleKeydown)
    } else {
      unlockBackground()
      stopResizing()
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', refreshHeightBounds)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', refreshHeightBounds)
  stopResizing()
  unlockBackground()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <teleport to="body">
    <transition name="bottom-panel-fade">
      <div
        v-if="isOpen"
        class="bottom-panel-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Bottom panel"
        @click.self="closePanel"
      >
        <section
          ref="panelRef"
          class="bottom-panel-container-for-resize-rail-and-toolbars-and-content"
          :style="{ height: panelHeight }"
        >
          <div
            class="bottom-panel__resize-rail"
            role="separator"
            aria-label="Resize bottom panel"
            @mousedown="handleResizeStart"
            @touchstart="handleResizeStart"
          >
            <span class="bottom-panel__rail-line"></span>
          </div>
          <!--  Top toolbar component-->
          <component :is="activeTopToolbarComponent" v-if="activeTopToolbarComponent" />
          <!-- Main content area  with dynamic content-->
          <component :is="activeContentComponent" v-if="activeContentComponent" />
          <!-- Bottom toolbar component-->
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
/*
Styles live in
src/renderer/src/css/main-imports-this-css/bottompanel/bottompanel-base.css
*/
</style>
