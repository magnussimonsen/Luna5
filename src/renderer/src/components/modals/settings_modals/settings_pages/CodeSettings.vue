<script setup lang="ts">
import { computed } from 'vue'
// Code Editor Theme Settings
//
// This settings page presents theme IDs from our curated Monaco themes loader
// ('@renderer/code/monaco/monaco-theme'). Place JSON files in
// src/renderer/src/code/monaco/monaco-curated-light-themes and
// src/renderer/src/code/monaco/monaco-curated-dark-themes and they will auto-register.
//
// The selected theme is stored in Pinia (lightCodeEditorTheme/darkCodeEditorTheme).
// PythonCell.vue and a global watcher in main.ts observe those values and call
// monaco.editor.setTheme(id) after registering curated themes.
//
// Tip: The theme ID is the normalized filename (kebab-case), e.g., 'github-dark'.
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import {
  getCuratedLightMonacoThemeIds,
  getCuratedDarkMonacoThemeIds,
  builtinMonacoThemes
} from '@renderer/code/monaco/monaco-theme'
// Theme registration/application is handled globally; no direct apply calls here.

const codeSettingsStore = useCodeSettingsStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const themeStore = useThemeStore()
// Build options from Monaco theme registry (built-ins + curated JSON filenames)
// Note: IDs are normalized (kebab-case). We reuse the same list for light/dark.
const lightThemeOptions = ['vs', ...getCuratedLightMonacoThemeIds()]
const darkBuiltins = builtinMonacoThemes.filter((t) => t === 'vs-dark' || t === 'hc-black')
const darkThemeOptions = [...darkBuiltins, ...getCuratedDarkMonacoThemeIds()]

// Show the theme that would be applied right now based on app mode
const currentThemeId = computed(() =>
  themeStore.isDarkMode
    ? codeSettingsStore.darkCodeEditorTheme
    : codeSettingsStore.lightCodeEditorTheme
)
</script>

<template>
  <div class="code-settings-content">
    <div class="settings-columns">
      <div class="settings-column">
        <h3>Coding Font Options</h3>
        <div class="setting-row">
          <label for="coding-font-select">Coding Font:</label>
          <select
            id="coding-font-select"
            v-model="fontStore.fonts.codingFont"
            @change="fontStore.setCodingFont(fontStore.fonts.codingFont)"
          >
            <option
              v-for="font in fontStore.availableFonts"
              :key="'codingFont-' + font.value"
              :value="font.value"
            >
              {{ font.label }}
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label for="code-editor-cells-font-size-select">Coding Font Size:</label>
          <select
            id="code-editor-cells-font-size-select"
            v-model="fontSizeStore.fontSizes.codeEditorCellFontSize"
            @change="
              fontSizeStore.setCodeEditorCellFontSize(
                fontSizeStore.fontSizes.codeEditorCellFontSize
              )
            "
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'codeEditorCellsFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
      </div>
      <div class="settings-column">
        <h3>Code Quality Options</h3>
        <div class="setting-row">
          <label>
            <input v-model="codeSettingsStore.enableCodeLintingState" type="checkbox" />
            Enable code linting <ImplementedMark :implemented="false" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <input v-model="codeSettingsStore.enableCodeFormattingState" type="checkbox" />
            Enable code formatting <ImplementedMark :implemented="false" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <input v-model="codeSettingsStore.enableCodeSuggestionsState" type="checkbox" />
            Enable code suggestions <ImplementedMark :implemented="false" />
          </label>
        </div>
      </div>
      <div class="settings-column">
        <h3>Code Editor Themes</h3>
        <div class="setting-row">
          <label for="light-code-theme">Light theme:</label>
          <select id="light-code-theme" v-model="codeSettingsStore.lightCodeEditorTheme">
            <option v-for="t in lightThemeOptions" :key="'light-theme-' + t" :value="t">
              {{ t }}
            </option>
          </select>
          <ImplementedMark :implemented="true" />
        </div>
        <div class="setting-row">
          <label for="dark-code-theme">Dark theme:</label>
          <select id="dark-code-theme" v-model="codeSettingsStore.darkCodeEditorTheme">
            <option v-for="t in darkThemeOptions" :key="'dark-theme-' + t" :value="t">
              {{ t }}
            </option>
          </select>
          <ImplementedMark :implemented="true" />
        </div>
        <div class="setting-row">
          <span style="opacity: 0.7">Current: {{ currentThemeId }}</span>
          <ImplementedMark :implemented="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-settings-content {
  width: 100%;
}
.settings-columns {
  display: flex;
  gap: 2em;
}
.settings-column {
  flex: 1;
}
.setting-row {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
select {
  margin-left: 0.5em;
}
</style>
