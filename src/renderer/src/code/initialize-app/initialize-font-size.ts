import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

export function initializeFontSizes(): void {
  const fontSizeStore = useFontSizeStore()
  fontSizeStore.applyFontSizes()
}
