<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'

const bottomPanelStore = useBottomPanelStore()

const isOpen = computed(() => bottomPanelStore.isOpen)
const panelHeight = computed(() => `${bottomPanelStore.panelHeight}px`)
const panelRef = ref<HTMLElement | null>(null)

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
        <section ref="panelRef" class="bottom-panel" :style="{ height: panelHeight }">
          <div
            class="bottom-panel__resize-rail"
            role="separator"
            aria-label="Resize bottom panel"
            @mousedown="handleResizeStart"
            @touchstart="handleResizeStart"
          >
            <span class="bottom-panel__rail-line"></span>
          </div>
          <header class="bottom-panel__header">
            <div class="bottom-panel__grab-handle">
              <span class="grab-bar"></span>
            </div>
            <div class="bottom-panel__title">Bottom panel (prototype)</div>
            <button
              class="bottom-panel__close"
              type="button"
              aria-label="Close bottom panel"
              @click="closePanel"
            >
              Close
            </button>
          </header>
          <div class="bottom-panel__content">
            <slot>
              <p class="bottom-panel__placeholder">Bottom panel content placeholder.</p>
            </slot>
          </div>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.bottom-panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 17, 23, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: var(--modal-overlay-z-index, 5000);
}

.bottom-panel {
  position: relative;
  width: min(560px, 95vw);
  background: var(--menu-background, #1e2228);
  color: var(--text-color, #f5f5f5);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -12px 48px rgba(0, 0, 0, 0.28);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - var(--bottom-chrome-height, 0px));
  min-height: 200px;
  width: clamp(420px, 60vw, 720px);
}

.bottom-panel__resize-rail {
  flex: 0 0 auto;
  height: 14px;
  cursor: row-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: 2px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.05));
  border-radius: 16px 16px 0 0;
  touch-action: none;
  user-select: none;
}

.bottom-panel__resize-rail:active,
.bottom-panel__resize-rail.bottom-panel__resize-rail--dragging {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.12));
}

.bottom-panel__rail-line {
  width: 72px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
}

.bottom-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 1rem 0.9rem;
  gap: 0.75rem;
}

.bottom-panel__grab-handle {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0.25rem 0 0.15rem;
}

.grab-bar {
  display: inline-block;
  width: 56px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
}

.bottom-panel__title {
  flex: 4;
  font-weight: 600;
  text-align: center;
  color: var(--text-color, #f5f5f5);
}

.bottom-panel__close {
  flex: 1;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
}

.bottom-panel__close:hover {
  background: rgba(255, 255, 255, 0.08);
}

.bottom-panel__content {
  padding: 1rem 1.25rem 1.5rem;
  overflow-y: auto;
  flex: 1 1 auto;
}

.bottom-panel__placeholder {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
}

.bottom-panel-fade-enter-active,
.bottom-panel-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bottom-panel-fade-enter-from,
.bottom-panel-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .bottom-panel {
    width: 96vw;
  }
}

:global(body.bottom-panel-resizing) {
  cursor: ns-resize !important;
  user-select: none;
}
</style>
