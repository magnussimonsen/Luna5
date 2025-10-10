import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { PanelName } from '@renderer/types/sidepanel-types'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const allowedPanels: PanelName[] = [
  'flashcards',
  'notebooks',
  'toc',
  'variables',
  'help',
  'settings',
  'localLlmClient',
  'formulabook'
]

const DEFAULT_FALLBACK_WIDTH_PX = 400
const DEFAULT_WIDTH_RATIO = 0.5

export const useSidepanelStore = defineStore('sidepanel', () => {
  // -------------------------------------------------------------------------
  // Layout chrome heights (used to anchor the sidepanel vertically)
  // -------------------------------------------------------------------------
  const menubarHeight = ref(0)
  const toolbarHeight = ref(0)
  const statusbarHeight = ref(0)

  // -------------------------------------------------------------------------
  // Panel selection state
  // -------------------------------------------------------------------------
  const activePanel = ref<PanelName | null>(null)

  // Compute a sensible starting width based on the current viewport.
  function computeInitialPanelWidth(): number {
    const appWidth =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

    if (typeof appWidth !== 'number' || Number.isNaN(appWidth)) {
      return DEFAULT_FALLBACK_WIDTH_PX
    }

    return appWidth * DEFAULT_WIDTH_RATIO
  }

  const lastPanelWidth = ref<number>(computeInitialPanelWidth())
  const lastPanelScrollY = ref(0)

  // -------------------------------------------------------------------------
  // Panel visibility helpers
  // -------------------------------------------------------------------------
  function showPanel(panel: PanelName): void {
    if (!allowedPanels.includes(panel)) return
    activePanel.value = panel
  }

  function hidePanel(): void {
    activePanel.value = null
  }

  function togglePanel(panel: PanelName): void {
    if (!allowedPanels.includes(panel)) return

    const isSamePanelActive = activePanel.value === panel
    activePanel.value = isSamePanelActive ? null : panel
  }

  // -------------------------------------------------------------------------
  // Persisted panel UI state
  // -------------------------------------------------------------------------
  function setLastPanelWidth(width: number): void {
    lastPanelWidth.value = width
  }

  function setLastPanelScrollY(scrollPosition: number): void {
    lastPanelScrollY.value = scrollPosition
  }

  // -------------------------------------------------------------------------
  // Chrome height setters (forwarded from layout observers)
  // -------------------------------------------------------------------------
  function setMenubarHeight(height: number): void {
    menubarHeight.value = height
  }

  function setToolbarHeight(height: number): void {
    toolbarHeight.value = height
  }

  function setStatusbarHeight(height: number): void {
    statusbarHeight.value = height
  }

  const topChromeHeight = computed(() => menubarHeight.value + toolbarHeight.value)
  const bottomChromeHeight = computed(() => statusbarHeight.value)

  return {
    // panel availability
    allowedPanels,
    activePanel,
    showPanel,
    hidePanel,
    togglePanel,
    // persisted UI state
    lastPanelWidth,
    setLastPanelWidth,
    lastPanelScrollY,
    setLastPanelScrollY,
    // chrome measurements
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
