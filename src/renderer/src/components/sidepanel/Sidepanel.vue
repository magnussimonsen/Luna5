<template>
  <!-- 
  THIS COMPONENT HAS A RESIZABLE SIDE PANEL 
  AND NO EXTRA PADDING.
  Use .sidepanel-container-inside-resize-border-padding in 
  "sidepanel-ui-base" class for padding.              
  -->
  <aside
    v-if="sidepanelStore.activePanel"
    class="sidepanel-main"
    :style="{ width: panelWidth + 'px' }"
  >
    <div
      class="sidepanel__resize-rail"
      role="separator"
      aria-label="Resize side panel"
      @mousedown="handleResizeStart"
      @touchstart="handleResizeStart"
    >
      <span class="sidepanel__rail-line"></span>
    </div>
    <div ref="panelContentRef" class="sidepanel-content-container" @scroll="onScrollPanelContent">
      <component :is="currentPanelComponent" v-if="currentPanelComponent" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, nextTick, computed } from 'vue'
import { useSidepanelStore } from '@renderer/stores/UI/sidepanelStore'
import HelpPanel from './HelpPanel.vue'
import FlashcardsPanel from './FlashcardsPanel.vue'
import NotebooksPanel from './NotebooksPanel.vue'
import TOCPanel from './TOCPanel.vue'
import VariablesPanel from './VariablesPanel.vue'
import SettingsPanel from './SettingsPanel.vue'
import LocalLlmClientPanel from './LocalLlmAssistantPanel.vue'

const sidepanelStore = useSidepanelStore()
const panelWidth = ref(sidepanelStore.lastPanelWidth)
const panelContentRef = ref<HTMLElement | null>(null)
let minWidthScalingFactor: number = 0.05
let maxWidthScalingFactor: number = 0.95
let startX: number = 0
let startWidth: number = 0
let resizing: boolean = false

// Map panel names to their component references
const panelComponents = {
  flashcards: FlashcardsPanel,
  help: HelpPanel,
  notebooks: NotebooksPanel,
  toc: TOCPanel,
  variables: VariablesPanel,
  settings: SettingsPanel,
  localLlmClient: LocalLlmClientPanel
}

// Dynamically select the current panel component based on active panel in store
const currentPanelComponent = computed(() => {
  if (!sidepanelStore.activePanel) return null
  return panelComponents[sidepanelStore.activePanel] || null
})

function beginResize(clientX: number): void {
  if (resizing) return
  resizing = true
  startX = clientX
  startWidth = panelWidth.value
  document.addEventListener('mousemove', onPointerMove, { passive: false })
  document.addEventListener('touchmove', onPointerMove, { passive: false })
  document.addEventListener('mouseup', stopResize, { passive: true })
  document.addEventListener('touchend', stopResize, { passive: true })
  document.body.classList.add('sidepanel-resizing')
}

function handleResizeStart(event: MouseEvent | TouchEvent): void {
  event.preventDefault()
  const clientX = 'touches' in event ? event.touches[0]?.clientX : event.clientX
  if (typeof clientX !== 'number') return
  beginResize(clientX)
}

function onPointerMove(event: MouseEvent | TouchEvent): void {
  if (!resizing) return
  const currentX = 'touches' in event ? event.touches[0]?.clientX : event.clientX
  if (typeof currentX !== 'number') return
  // Right edge is fixed; dragging handle (left edge) left increases width.
  // So delta = startX - currentX (positive when moving left)
  const delta = startX - currentX
  const minWidth: number = window.innerWidth * minWidthScalingFactor
  const maxWidth: number = window.innerWidth * maxWidthScalingFactor
  const next = Math.max(minWidth, Math.min(maxWidth, startWidth + delta))
  panelWidth.value = next
  sidepanelStore.setLastPanelWidth(next)
}

function stopResize(): void {
  if (!resizing) return
  resizing = false
  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('touchmove', onPointerMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchend', stopResize)
  document.body.classList.remove('sidepanel-resizing')
  sidepanelStore.setLastPanelWidth(panelWidth.value)
}

// Handle scrolling and store scroll position
function onScrollPanelContent(): void {
  if (panelContentRef.value) {
    sidepanelStore.setLastPanelScrollY(panelContentRef.value.scrollTop)
  }
}

onMounted(() => {
  nextTick(() => {
    if (panelContentRef.value) {
      // Use timeout to ensure DOM is fully rendered before scrolling
      setTimeout(() => {
        if (panelContentRef.value) {
          panelContentRef.value.scrollTop = sidepanelStore.lastPanelScrollY
        }
      }, 0)
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('touchmove', onPointerMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchend', stopResize)
})
</script>

<style scoped>
/* Styles are in the css folder */
</style>
