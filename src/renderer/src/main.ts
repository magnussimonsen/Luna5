import './css/main.css'

import { createApp, watch } from 'vue'
import App from '@renderer/App.vue'
import { createPinia } from 'pinia'
import { initializeApp } from '@renderer/code/initialize-app/initialize-app'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import { applyMonacoTheme, ensureAllMonacoThemesDefined } from '@renderer/code/monaco/monaco-theme'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

initializeApp()

app.mount('#app')

// Global Monaco theme sync: react to app dark/light mode and code theme selections
const themeStore = useThemeStore(pinia)
const codeSettingsStore = useCodeSettingsStore(pinia)
ensureAllMonacoThemesDefined()
const computeCurrentTheme = (): string => {
  return themeStore.isDarkMode
    ? codeSettingsStore.darkCodeEditorTheme
    : codeSettingsStore.lightCodeEditorTheme
}

watch(
  [
    () => themeStore.isDarkMode,
    () => codeSettingsStore.lightCodeEditorTheme,
    () => codeSettingsStore.darkCodeEditorTheme
  ],
  () => {
    applyMonacoTheme(computeCurrentTheme())
  },
  { immediate: true }
)
