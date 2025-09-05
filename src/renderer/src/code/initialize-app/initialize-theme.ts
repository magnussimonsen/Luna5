import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

export function initializeTheme(): void {
  const themeStore = useThemeStore()
  // Apply the theme at startup; store may choose dark/light based on persisted settings later
  themeStore.applyTheme(themeStore.lightTheme)
}
