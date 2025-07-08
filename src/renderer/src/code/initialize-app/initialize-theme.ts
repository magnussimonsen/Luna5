import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

export function initializeTheme(): void {
  const themeStore = useThemeStore()
  themeStore.applyTheme(themeStore.lightTheme)
}
