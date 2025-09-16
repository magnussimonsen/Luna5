/* To do: Move this to sidepanel store, and add the samme logic to get
the statusbar hight such that the sidepanel sits below menubar+toolbar and
above the statusbar */
import { defineStore } from 'pinia'

export const useToolbarStore = defineStore('toolbar', {
  state: () => ({
    toolbarHeight: 0,
    menubarHeight: 0
  }),
  actions: {
    setToolbarHeight(h: number) {
      this.toolbarHeight = h
    },
    setMenubarHeight(h: number) {
      this.menubarHeight = h
    }
  },
  getters: {
    topChromeHeight: (state) => state.toolbarHeight + state.menubarHeight
  }
})
