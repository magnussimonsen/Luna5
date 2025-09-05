import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

export function initializeFontSizes(): void {
  // Apply font size CSS variables from persisted settings into the document
  const fontSizeStore = useFontSizeStore()
  fontSizeStore.applyFontSizes()
}
