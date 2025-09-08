import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'

export function initializeFonts(): void {
  // Apply CSS variables like --ui-font, --default-cell-font, etc., from the store
  const fontStore = useFontStore()
  fontStore.applyFonts()
}
