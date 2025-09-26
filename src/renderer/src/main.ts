import './css/main.css'
// Monaco editor base styles (required for tokens/selection/scrollbars)

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

// Reactive scrollbar color updates (only recompute these two vars when needed)
watch(
  () => [
    themeStore.isDarkMode,
    themeStore.lightTheme.scrollbarThumbColor,
    themeStore.lightTheme.scrollbarTrackColor,
    themeStore.darkTheme.scrollbarThumbColor,
    themeStore.darkTheme.scrollbarTrackColor
  ],
  () => {
    const c = themeStore.isDarkMode ? themeStore.darkTheme : themeStore.lightTheme
    const root = document.documentElement
    root.style.setProperty('--scrollbar-thumb-color', c.scrollbarThumbColor)
    root.style.setProperty('--scrollbar-track-color', c.scrollbarTrackColor)
  },
  { immediate: true }
)
