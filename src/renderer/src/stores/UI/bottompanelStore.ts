import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PanelName } from '@renderer/types/sidepanel-types' // Reuse PanelName type for bottom panel

const allowedPanels: PanelName[] = ['insertKatexMath']

const DEFAULT_PANEL_HEIGHT = 320
const DEFAULT_MIN_HEIGHT = 10
const DEFAULT_MAX_HEIGHT = 800
const MIN_MAX_HEIGHT_GAP = 50

const clamp = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min
  if (min > max) return min
  return Math.min(Math.max(value, min), max)
}

export const useBottomPanelStore = defineStore('bottompanel', () => {
  // -------------------------------------------------------------------------
  // Visibility and active panel state
  // -------------------------------------------------------------------------
  const isOpen = ref(false)
  const activePanel = ref<PanelName | null>(null)

  // -------------------------------------------------------------------------
  // Resizing state
  // -------------------------------------------------------------------------
  const isResizing = ref(false)
  const panelHeight = ref(DEFAULT_PANEL_HEIGHT)
  const minHeight = ref(DEFAULT_MIN_HEIGHT)
  const maxHeight = ref(DEFAULT_MAX_HEIGHT)

  const defaultPanel = computed<PanelName | null>(() => allowedPanels[0] ?? null)

  function setActivePanel(panel: PanelName | null): void {
    activePanel.value = panel
  }

  function openBottomPanel(): void {
    if (!activePanel.value && defaultPanel.value) {
      activePanel.value = defaultPanel.value
    }
    isOpen.value = true
  }

  function closeBottomPanel(): void {
    isOpen.value = false
    activePanel.value = null
  }

  function toggleBottomPanel(): void {
    if (isOpen.value) {
      closeBottomPanel()
      return
    }
    openBottomPanel()
  }

  function setPanelHeight(height: number): void {
    panelHeight.value = clamp(height, minHeight.value, maxHeight.value)
  }

  function setHeightBounds(bounds: { min?: number; max?: number }): void {
    if (typeof bounds.min === 'number' && bounds.min > 0) {
      minHeight.value = Math.min(bounds.min, bounds.max ?? bounds.min)
    }
    if (typeof bounds.max === 'number' && bounds.max > 0) {
      maxHeight.value = Math.max(bounds.max, minHeight.value + MIN_MAX_HEIGHT_GAP)
    }
    setPanelHeight(panelHeight.value)
  }

  function beginResize(): void {
    isResizing.value = true
  }

  function endResize(): void {
    isResizing.value = false
  }

  function showPanel(name: PanelName): void {
    if (!allowedPanels.includes(name)) return
    setActivePanel(name)
    openBottomPanel()
  }

  function hidePanel(): void {
    closeBottomPanel()
  }

  function togglePanel(name: PanelName): void {
    if (!allowedPanels.includes(name)) return
    if (activePanel.value === name && isOpen.value) {
      hidePanel()
    } else {
      setActivePanel(name)
      openBottomPanel()
    }
  }

  return {
    isOpen,
    isResizing,
    panelHeight,
    minHeight,
    maxHeight,
    allowedPanels,
    activePanel,
    openBottomPanel,
    closeBottomPanel,
    toggleBottomPanel,
    setPanelHeight,
    setHeightBounds,
    beginResize,
    endResize,
    showPanel,
    hidePanel,
    togglePanel,
    setActivePanel
  }
})
