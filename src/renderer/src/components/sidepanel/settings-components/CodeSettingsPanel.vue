<template>
  <div
    :class="[
      'sidepanel-flex-column-overflow-y',
      'sidepanel-color-font-styling',
      'util-padding-zero',
      'util-margin-zero',
      'sidepanel-top-row-margin',
      'util-liststyle-none'
    ]"
  >
    <strong :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-bottom-row-margin']"
      >Coding Font Options</strong
    >
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="coding-font-select">Coding Font:</label>
      <select
        id="coding-font-select"
        v-model="fontStore.fonts.codingFont"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontStore.setCodingFont(fontStore.fonts.codingFont)"
      >
        <option
          v-for="font in fontStore.availableCodingFonts"
          :key="'codingFont-' + font.value"
          :value="font.value"
        >
          {{ font.label }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="code-editor-cells-font-size-select">Coding Font Size:</label>
      <select
        id="code-editor-cells-font-size-select"
        v-model="fontSizeStore.fontSizes.codeEditorCellFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
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

    <strong :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-bottom-row-margin']"
      >Code Quality Options</strong
    >
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input
          v-model="codeSettingsStore.enableLineNumbersState"
          type="checkbox"
          :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        />
        Enable line numbers <ImplementedMark :implemented="false" />
      </label>
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input
          v-model="codeSettingsStore.enableCodeLintingState"
          type="checkbox"
          :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        />
        Enable code linting <ImplementedMark :implemented="false" />
      </label>
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input
          v-model="codeSettingsStore.enableCodeFormattingState"
          type="checkbox"
          :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        />
        Enable code formatting <ImplementedMark :implemented="false" />
      </label>
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input
          v-model="codeSettingsStore.enableCodeSuggestionsState"
          type="checkbox"
          :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        />
        Enable code suggestions <ImplementedMark :implemented="false" />
      </label>
    </div>

    <strong :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-bottom-row-margin']"
      >Code Editor Themes</strong
    >
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="light-code-theme">Light theme:</label>
      <select
        id="light-code-theme"
        v-model="codeSettingsStore.lightCodeEditorTheme"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
      >
        <option v-for="t in lightThemeOptions" :key="'light-theme-' + t" :value="t">
          {{ t }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="dark-code-theme">Dark theme:</label>
      <select
        id="dark-code-theme"
        v-model="codeSettingsStore.darkCodeEditorTheme"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
      >
        <option v-for="t in darkThemeOptions" :key="'dark-theme-' + t" :value="t">
          {{ t }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label
        for="max-monaco-instances"
        title="Limits the maximum number of Monaco code editors active at once. Lower values improve performance in large notebooks, higher values allow more cells to show syntax highlighting simultaneously."
      >
        Max Monaco Editors (not implemented):
      </label>
      <select
        id="max-monaco-instances"
        v-model.number="codeSettingsStore.maxNumberOfMonacoInstances"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        title="(Not implemented) Limits the maximum number of Monaco code editors active at once. Lower values improve performance in large notebooks, higher values allow more cells to show syntax highlighting simultaneously."
        @change="
          codeSettingsStore.setMaxNumberOfMonacoInstances(
            codeSettingsStore.maxNumberOfMonacoInstances
          )
        "
      >
        <option v-for="n in maxMonacoOptions" :key="'max-monaco-' + n" :value="n">
          {{ n }}
        </option>
      </select>
      <ImplementedMark :implemented="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Reasonable options for max Monaco instances
const maxMonacoOptions = [2, 4, 8, 12, 16, 24, 32]
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

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
const themeStore = useThemeStore()
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
</style>
