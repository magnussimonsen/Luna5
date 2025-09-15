<template>
  <aside
    v-if="sidepanelStore.activePanel"
    class="sidepanel sidepanel-ui-base"
    :style="{ width: panelWidth + 'px', flex: '0 0 ' + panelWidth + 'px' }"
  >
    <div
      class="resize-handle left"
      role="separator"
      aria-label="Resize side panel"
      @mousedown="startResize"
    ></div>
    <div ref="panelContentRef" class="panel-content" @scroll="onScrollPanelContent">
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

const sidepanelStore = useSidepanelStore()
const panelWidth = ref(sidepanelStore.lastPanelWidth)
const panelContentRef = ref<HTMLElement | null>(null)
//let minWidthScalingFactor: number = 0.01 // use 0 here and 1em in CSS
let maxWidthScalingFactor: number = 0.75
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
  settings: SettingsPanel
}

// Dynamically select the current panel component based on active panel in store
const currentPanelComponent = computed(() => {
  if (!sidepanelStore.activePanel) return null
  return panelComponents[sidepanelStore.activePanel] || null
})

// Handle resizing of the side panel
function startResize(e: MouseEvent): void {
  resizing = true
  startX = e.clientX
  startWidth = panelWidth.value
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.body.classList.add('sidepanel-resizing')
  e.preventDefault() // Prevent text selection during resize
}

function onResize(e: MouseEvent): void {
  if (!resizing) return
  // Right edge is fixed; dragging handle (left edge) left increases width.
  // So delta = startX - e.clientX (positive when moving left)
  const delta = startX - e.clientX
  const minWidth: number = 160
  const maxWidth: number = window.innerWidth * maxWidthScalingFactor
  const next = Math.max(minWidth, Math.min(maxWidth, startWidth + delta))
  panelWidth.value = next
  sidepanelStore.setLastPanelWidth(next)
}

function stopResize(): void {
  if (!resizing) return
  resizing = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
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
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.sidepanel {
  position: relative; /* participate in flex layout of parent */
  min-width: 1em;
  max-width: calc(100vw * maxWidthScalingFactor);
  background: var(--sidepanel-background, #f0f0f0);
  color: var(--text-color, #222);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border-left: 0.1em solid var(--button-on-color, lightgreen);
  border-top: 0.1em solid var(--button-on-color, lightgreen);
  border-bottom: 0.1em solid var(--button-on-color, lightgreen);
  border-radius: 0;
  box-sizing: border-box;
}

/* While resizing: prevent text selection & show consistent cursor */
body.sidepanel-resizing {
  cursor: ew-resize !important;
  user-select: none;
}

/* Left-edge resize handle (panel anchored to the right) */
.resize-handle.left {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  cursor: ew-resize;
  background: var(--button-on-color, lightgreen);
  height: 100%;
  flex-shrink: 0;
  display: block;
}

.resize-handle.left:hover,
.resize-handle.left:active {
  background: var(--active-border-color-hover, green);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5em 0 0.75em; /* left padding for handle space */
  height: 100%;
  display: flex;
  flex-direction: column;
  scrollbar-width: normal;
}
</style>
