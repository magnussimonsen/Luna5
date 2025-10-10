import { defineStore } from 'pinia'

// Zoom store: controls UI zoom for the workspace (cells area)
// Persisting is not handled yet; defaults to 100% on startup.
export const useZoomStatesStore = defineStore('zoom', {
  state: () => ({
    zoomPercent: 100 as number,
    minZoom: 25 as number,
    maxZoom: 200 as number,
    step: 5 as number
  }),
  getters: {
    zoomScale(state): number {
      return state.zoomPercent / 100
    },
    zoomLabel(state): string {
      return `${state.zoomPercent}%`
    }
  },
  actions: {
    clamp(val: number): number {
      return Math.min(this.maxZoom, Math.max(this.minZoom, Math.round(val)))
    },
    applyCssVar(): void {
      const root = document.documentElement
      root.style.setProperty('--workspace-zoom', String(this.zoomScale))
    },
    setZoomPercent(val: number): void {
      this.zoomPercent = this.clamp(val)
      this.applyCssVar()
    },
    setZoomScale(scale: number): void {
      const val = Math.round(scale * 100)
      this.setZoomPercent(val)
    },
    resetZoom(): void {
      this.zoomPercent = 100
      this.applyCssVar()
    },
    resetPythonImageZoom(): number {
      // Returns the default zoom value for Python images
      return 50
    }
  }
})
