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
      >General Settings</strong
    >
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>Set language:</label>
      <select
        v-model="languageStore.currentLanguage"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="languageStore.consoleLogCurrentLanguage()"
      >
        <option v-for="lang in languageStore.getAvailableLanguages" :key="lang" :value="lang">
          {{ lang }}
        </option>
      </select>
      <ImplementedMark :implemented="false" />
    </div>

    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>Enable autosave:</label>
      <select
        v-model.number="generalSettingsStore.autosaveChangeIntervalState"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
      >
        <option v-for="opt in autosaveOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>

    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input v-model="generalSettingsStore.warnOnDeleteCellState" type="checkbox" />
        Warn when deleting cells
      </label>
      <ImplementedMark :implemented="false" />
    </div>

    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label>
        <input v-model="generalSettingsStore.showCellIndexNumbersState" type="checkbox" />
        Show cell index numbers
      </label>
      <ImplementedMark :implemented="false" />
    </div>
    <strong :class="['sidepanel__notebook-item-transparent-border', 'sidepanel-bottom-row-margin']"
      >User Interface Settings</strong
    >

    <!-- Font Family Selectors -->
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="ui-font-select">User Interface Font:</label>
      <select
        id="ui-font-select"
        v-model="fontStore.fonts.uiFont"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontStore.setUIFont(fontStore.fonts.uiFont)"
      >
        <option
          v-for="font in fontStore.availableFonts"
          :key="'uiFont-' + font.value"
          :value="font.value"
        >
          {{ font.label }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>

    <!-- Font Size Selectors -->
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="default-cell-reset-font-size-select"> Default Cell Font Size: </label>
      <select
        id="default-cell-reset-font-size-select"
        v-model="fontSizeStore.fontSizes.defaultCellFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontSizeStore.setDefaultCellFontSize(fontSizeStore.fontSizes.defaultCellFontSize)"
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'defaultCellResetFontSize-' + size"
          :value="size + 'px'"
        >
          {{ size }} px
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="menubar-font-size-select">Menu Bar Font Size:</label>
      <select
        id="menubar-font-size-select"
        v-model="fontSizeStore.fontSizes.menubarFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontSizeStore.setMenubarFontSize(fontSizeStore.fontSizes.menubarFontSize)"
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'menubarFontSize-' + size"
          :value="size + 'px'"
        >
          {{ size }} px
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="top-toolbar-font-size-select">Toolbar Font Size:</label>
      <select
        id="top-toolbar-font-size-select"
        v-model="fontSizeStore.fontSizes.topToolbarFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontSizeStore.setTopToolbarFontSize(fontSizeStore.fontSizes.topToolbarFontSize)"
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'topToolbarFontSize-' + size"
          :value="size + 'px'"
        >
          {{ size }} px
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="sidepanel-font-size-select">Side Panel Font Size:</label>
      <select
        id="sidepanel-font-size-select"
        v-model="fontSizeStore.fontSizes.sidepanelFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontSizeStore.setSidepanelFontSize(fontSizeStore.fontSizes.sidepanelFontSize)"
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'SidepanelFontSize-' + size"
          :value="size + 'px'"
        >
          {{ size }} px
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="status-bar-font-size-select">Status Bar Font Size:</label>
      <select
        id="status-bar-font-size-select"
        v-model="fontSizeStore.fontSizes.statusbarFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontSizeStore.setStatusBarFontSize(fontSizeStore.fontSizes.statusbarFontSize)"
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'statusBarFontSize-' + size"
          :value="size + 'px'"
        >
          {{ size }} px
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useLanguageStore } from '@renderer/stores/language/languageStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { AutosaveOption } from '@renderer/types/auto-save-options-types'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { fontSizeOptions, useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'

const generalSettingsStore = useGeneralSettingsStore()
const languageStore = useLanguageStore()
const themeStore = useThemeStore()
const fontSizeStore = useFontSizeStore()
const fontStore = useFontStore()

const autosaveOptions: { label: string; value: AutosaveOption }[] = [
  { label: 'Off', value: 0 },
  { label: 'After 1 change', value: 1 },
  { label: 'After 5 changes', value: 5 },
  { label: 'After 10 changes', value: 10 },
  { label: 'After 15 changes', value: 15 },
  { label: 'After 25 changes', value: 25 },
  { label: 'After 50 changes', value: 50 },
  { label: 'After 100 changes', value: 100 }
]
</script>

<style scoped></style>
