import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { PanelName } from '@renderer/types/side-panel-types'

export const useSidepanelStore = defineStore('sidepanel', () => {
  // Heights used to position the sidepanel between top and bottom chrome
  const menubarHeight = ref<number>(0)
  const toolbarHeight = ref<number>(0)
  const statusbarHeight = ref<number>(0)

  // Existing sidepanel state
  const allowedPanels = ['flashcards', 'notebooks', 'toc', 'variables', 'help', 'settings']
  const activePanel = ref<PanelName | null>(null)

  function getAppWidthInPx(): number {
    const appWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    return typeof appWidth === 'number' && !isNaN(appWidth) ? appWidth * 0.50 : 400
  }

  const lastPanelWidth = ref<number>(getAppWidthInPx())
  const lastPanelScrollY = ref<number>(0)

  function showPanel(name: string): void {
    if (allowedPanels.includes(name as PanelName)) {
      activePanel.value = name as PanelName
    }
  }

  function hidePanel(): void {
    activePanel.value = null
  }

  function togglePanel(name: string): void {
    if (allowedPanels.includes(name as PanelName)) {
      activePanel.value = activePanel.value === name ? null : (name as PanelName)
    }
  }

  function setLastPanelWidth(width: number): void {
    lastPanelWidth.value = width
  }

  function setLastPanelScrollY(y: number): void {
    lastPanelScrollY.value = y
  }

  // Height setters for top/bottom chrome
  function setMenubarHeight(h: number): void {
    menubarHeight.value = h
  }
  function setToolbarHeight(h: number): void {
    toolbarHeight.value = h
  }
  function setStatusbarHeight(h: number): void {
    statusbarHeight.value = h
  }

  const topChromeHeight = computed(() => menubarHeight.value + toolbarHeight.value)
  const bottomChromeHeight = computed(() => statusbarHeight.value)

  return {
    // panel state
    activePanel,
    allowedPanels,
    showPanel,
    hidePanel,
    togglePanel,
    lastPanelWidth,
    setLastPanelWidth,
    lastPanelScrollY,
    setLastPanelScrollY,
    // chrome heights
    menubarHeight,
    toolbarHeight,
    statusbarHeight,
    setMenubarHeight,
    setToolbarHeight,
    setStatusbarHeight,
    topChromeHeight,
    bottomChromeHeight
  }
})
