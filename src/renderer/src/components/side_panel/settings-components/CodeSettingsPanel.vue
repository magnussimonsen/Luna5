<template>
  <div class="code-settings-content side-panel-ui-base">
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
        <ImplementedMark :implemented="true" />
      </div>
      <div class="setting-row">
        <label for="code-editor-cells-font-size-select">Coding Font Size:</label>
        <select
          id="code-editor-cells-font-size-select"
          v-model="fontSizeStore.fontSizes.codeEditorCellFontSize"
          @change="
            fontSizeStore.setCodeEditorCellFontSize(fontSizeStore.fontSizes.codeEditorCellFontSize)
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
        <ImplementedMark :implemented="true" />
      </div>

      <h3>Code Quality Options</h3>
      <div class="setting-row">
        <label>
          <input v-model="codeSettingsStore.enableLineNumbersState" type="checkbox" />
          Enable line numbers <ImplementedMark :implemented="false" />
        </label>
      </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useCodeSettingsStore } from '@renderer/stores/settings/codeSettingsStore'
import {
  getCuratedLightMonacoThemeIds,
  getCuratedDarkMonacoThemeIds,
  builtinMonacoThemes
} from '@renderer/code/monaco/monaco-theme'

const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const codeSettingsStore = useCodeSettingsStore()

// Include Monaco built-ins at the top for each mode
const lightThemeOptions = ['vs', ...getCuratedLightMonacoThemeIds()]
const darkBuiltins = builtinMonacoThemes.filter((t) => t === 'vs-dark' || t === 'hc-black')
const darkThemeOptions = [...darkBuiltins, ...getCuratedDarkMonacoThemeIds()]
</script>

<style scoped>
.code-settings-content {
  width: 100%;
}
@import '@renderer/css/side-panel-base.css';
</style>
