<template>
  <aside v-if="sidePanelStore.activePanel" class="side-panel" :style="{ width: panelWidth + 'px' }">
    <div class="resize-handle" @mousedown="startResize"></div>
    <div ref="panelContentRef" class="panel-content" @scroll="onScrollPanelContent">
      <component :is="currentPanelComponent" v-if="currentPanelComponent" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, nextTick, computed } from 'vue'
import { useSidePanelStore } from '@renderer/stores/UI/sidePanelStore'
import HelpPanel from './HelpPanel.vue'
import NotebooksPanel from './NotebooksPanel.vue'
import TOCPanel from './TOCPanel.vue'
import VariablesPanel from './VariablesPanel.vue'

const sidePanelStore = useSidePanelStore()
const panelWidth = ref(sidePanelStore.lastPanelWidth)
const panelContentRef = ref<HTMLElement | null>(null)
//let minWidthScalingFactor: number = 0.01 // use 0 here and 1em in CSS
let maxWidthScalingFactor: number = 1
let startX: number = 0
let startWidth: number = 0
let resizing: boolean = false

// Map panel names to their component references
const panelComponents = {
  help: HelpPanel,
  notebooks: NotebooksPanel,
  toc: TOCPanel,
  variables: VariablesPanel
}

// Dynamically select the current panel component based on active panel in store
const currentPanelComponent = computed(() => {
  if (!sidePanelStore.activePanel) return null
  return panelComponents[sidePanelStore.activePanel] || null
})

// Handle resizing of the side panel
function startResize(e: MouseEvent): void {
  resizing = true
  startX = e.clientX
  startWidth = panelWidth.value
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault() // Prevent text selection during resize
}

function onResize(e: MouseEvent): void {
  if (!resizing) return
  const dx = startX - e.clientX
  // const minWidth: number = window.innerWidth * minWidthScalingFactor
  const minWidth: number = 0 // use 0 here and 1em in CSS
  const maxWidth: number = window.innerWidth * maxWidthScalingFactor
  panelWidth.value = Math.max(minWidth, Math.min(maxWidth, startWidth + dx))
  sidePanelStore.setLastPanelWidth(panelWidth.value)
}

function stopResize(): void {
  resizing = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  sidePanelStore.setLastPanelWidth(panelWidth.value)
}

// Handle scrolling and store scroll position
function onScrollPanelContent(): void {
  if (panelContentRef.value) {
    sidePanelStore.setLastPanelScrollY(panelContentRef.value.scrollTop)
  }
}

onMounted(() => {
  nextTick(() => {
    if (panelContentRef.value) {
      // Use timeout to ensure DOM is fully rendered before scrolling
      setTimeout(() => {
        if (panelContentRef.value) {
          panelContentRef.value.scrollTop = sidePanelStore.lastPanelScrollY
        }
      }, 0)
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.side-panel {
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  min-width: 1em;
  max-width: calc(100vw * maxWidthScalingFactor);
  background: var(--menu-background, #f9f9f9);
  color: var(--text-color, #222);
  z-index: 2000;
  /* Ensure it overlaps workspace-container */
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border: 0.2em solid var(--button-on-color, lightgreen);
  border-radius: 0;
}

.resize-handle {
  width: 0.5em;
  cursor: ew-resize;
  background: var(--button-on-color, lightgreen);
  height: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle:hover {
  background: var(--active-border-color-hover, green);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5em;
  /* Simplified top/bottom and left/right padding */
  height: 100%;
  display: flex;
  flex-direction: column;
  scrollbar-width: normal; /* For Firefox */
  /* For Firefox */
}
</style>
