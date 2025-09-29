/* Initialize the theme for the application 
   Path: src/renderer/src/code/initialize-app/initialize-theme.ts

   We are also initializing the new theme store here (intended to replace the old one).
   Path: src/renderer/src/stores/themes/colorThemeStoreTestingNewSchema.ts
*/
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
//import { useThemeStoreV2 } from '@renderer/stores/themes/colorThemeStoreTestingNewSchema'

export function initializeTheme(): void {
  const themeStore = useThemeStore()
  //const themeStoreV2 = useThemeStoreV2()

  // Apply the theme at startup; store may choose dark/light based on persisted settings later
  themeStore.applyTheme(themeStore.lightTheme)
  // Apply the theme at startup; store may choose dark/light based on persisted settings later
  //themeStoreV2.applyTheme(themeStoreV2.lightTheme)
}
