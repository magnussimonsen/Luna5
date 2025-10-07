/* Filepath: luna/src/renderer/src/stores/UI/fontStore.ts */
import { defineStore } from 'pinia'
import type { FontTypes } from '@renderer/types/font-family-types'

const availableFonts = [
  { label: 'Arimo', value: 'Arimo, Arial, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Comic Neue', value: 'Comic Neue, Arial, sans-serif' },
  { label: 'Fira Code', value: 'Fira Code, monospace' },
  { label: 'Fira Mono', value: 'Fira Mono, monospace' },
  { label: 'Inter', value: 'Inter, Arial, sans-serif' },
  { label: 'OpenDyslexic', value: 'OpenDyslexic, Arial, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' }
]

const availableCodingFonts = [
  { label: 'Comic Neue', value: 'Comic Neue, Arial, sans-serif' },
  { label: 'Fira Code', value: 'Fira Code, monospace' },
  { label: 'Fira Mono', value: 'Fira Mono, monospace' },
  { label: 'OpenDyslexic', value: 'OpenDyslexic, Arial, sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' }
]

export const useFontStore = defineStore('fonts', {
  state: () => ({
    fonts: {
      uiFont: 'Inter, Arial, sans-serif',
      defaultCellFont: 'Inter, Arial, sans-serif',
      codingFont: 'Fira Code, monospace',
      textFont: 'Inter, Arial, sans-serif'
    } as FontTypes,
    availableFonts,
    availableCodingFonts
  }),
  actions: {
    setUIFont(font: string) {
      this.fonts.uiFont = font
      document.documentElement.style.setProperty('--ui-font', font)
    },
    setDefaultCellFont(font: string) {
      this.fonts.defaultCellFont = font
      document.documentElement.style.setProperty('--default-cell-font', font)
    },
    setCodingFont(font: string) {
      this.fonts.codingFont = font
      document.documentElement.style.setProperty('--coding-font', font)
    },
    setTextFont(font: string) {
      this.fonts.textFont = font
      document.documentElement.style.setProperty('--text-font', font)
      // Keep legacy/content alias so existing components using --content-font update
      document.documentElement.style.setProperty('--content-font', font)
    },
    applyFonts() {
      document.documentElement.style.setProperty('--ui-font', this.fonts.uiFont)
      document.documentElement.style.setProperty('--default-cell-font', this.fonts.defaultCellFont)
      document.documentElement.style.setProperty('--coding-font', this.fonts.codingFont)
      document.documentElement.style.setProperty('--text-font', this.fonts.textFont)
      document.documentElement.style.setProperty('--content-font', this.fonts.textFont)
    }
  }
})
