<template>
  <div class="general-settings-content">
    <div class="settings-columns">
      <!-- First column: UI & Editor Options -->
      <div class="settings-column">
        <h3>User Interface & Editor Options</h3>
        <!-- Font Family Selectors -->
        <div class="setting-row">
          <label for="ui-font-select">User Interface Font:</label>
          <select
            id="ui-font-select"
            v-model="fontStore.fonts.uiFont"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
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
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label for="default-font-select">Default Cell Font:</label>
          <select
            id="default-font-select"
            v-model="fontStore.fonts.defaultCellFont"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontStore.setDefaultCellFont(fontStore.fonts.defaultCellFont)"
          >
            <option
              v-for="font in fontStore.availableFonts"
              :key="'textFont-' + font.value"
              :value="font.value"
            >
              {{ font.label }}
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <!-- Font Size Selectors -->
        <div class="setting-row">
          <label for="menu-bar-font-size-select">Menu Bar Font Size:</label>
          <select
            id="menu-bar-font-size-select"
            v-model="fontSizeStore.fontSizes.menuBarFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontSizeStore.setMenuBarFontSize(fontSizeStore.fontSizes.menuBarFontSize)"
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'menuBarFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="true" />
        </div>
        <div class="setting-row">
          <label for="toolbar-font-size-select">Toolbar Font Size:</label>
          <select
            id="toolbar-font-size-select"
            v-model="fontSizeStore.fontSizes.toolbarFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontSizeStore.setToolbarFontSize(fontSizeStore.fontSizes.toolbarFontSize)"
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'toolbarFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label for="status-bar-font-size-select">Status Bar Font Size:</label>
          <select
            id="status-bar-font-size-select"
            v-model="fontSizeStore.fontSizes.statusBarFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontSizeStore.setStatusBarFontSize(fontSizeStore.fontSizes.statusBarFontSize)"
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
        <div class="setting-row">
          <label for="side-panel-font-size-select">Side Panel Font Size:</label>
          <select
            id="side-panel-font-size-select"
            v-model="fontSizeStore.fontSizes.sidePanelFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontSizeStore.setSidePanelFontSize(fontSizeStore.fontSizes.sidePanelFontSize)"
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'sidePanelFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>

        <div class="setting-row">
          <label for="default-cell-font-size-select">Default Cell Font Size:</label>
          <select
            id="default-cell-font-size-select"
            v-model="fontSizeStore.fontSizes.defaultCellFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="
              fontSizeStore.setDefaultCellFontSize(fontSizeStore.fontSizes.defaultCellFontSize)
            "
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'defaultCellFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label for="fallback-font-size-select">Fallback Font Size:</label>
          <select
            id="fallback-font-size-select"
            v-model="fontSizeStore.fontSizes.fallbackFontSize"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="fontSizeStore.setFallbackFontSize(fontSizeStore.fontSizes.fallbackFontSize)"
          >
            <option
              v-for="size in fontSizeOptions"
              :key="'fallbackFontSize-' + size"
              :value="size + 'px'"
            >
              {{ size }} px
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
      </div>
      <!-- Second column: General checkboxes and autosave -->
      <div class="settings-column">
        <h3>General Options</h3>
        <div class="setting-row">
          <label> Set language:</label>
          <select
            v-model="languageStore.currentLanguage"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
            @change="languageStore.consoleLogCurrentLanguage()"
          >
            <option v-for="lang in languageStore.getAvailableLanguages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label>Enable autosave:</label>
          <select
            v-model.number="generalSettingsStore.autosaveChangeIntervalState"
            :class="{ 'dark-mode': themeStore.isDarkMode }"
          >
            <option v-for="opt in autosaveOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label>
            <input v-model="generalSettingsStore.warnOnDeleteCellState" type="checkbox" />
            Warn when deleting cells
          </label>
          <ImplementedMark :implemented="false" />
        </div>
        <div class="setting-row">
          <label>
            <input v-model="generalSettingsStore.showCellIndexNumbersState" type="checkbox" />
            Show cell index numbers
          </label>
          <ImplementedMark :implemented="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { fontSizeOptions, useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useLanguageStore } from '@renderer/stores/language/languageStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { AutosaveOption } from '@renderer/types/auto-save-options-types'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

const generalSettingsStore = useGeneralSettingsStore()
const fontSizeStore = useFontSizeStore()
const fontStore = useFontStore()
const languageStore = useLanguageStore()
const themeStore = useThemeStore()

const autosaveOptions: { label: string; value: AutosaveOption }[] = [
  { label: 'Off', value: 0 },
  { label: 'After 5 changes', value: 5 },
  { label: 'After 10 changes', value: 10 },
  { label: 'After 15 changes', value: 15 },
  { label: 'After 25 changes', value: 25 },
  { label: 'After 50 changes', value: 50 },
  { label: 'After 100 changes', value: 100 }
]
</script>

<style scoped>
.general-settings-content {
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
select.dark-mode {
  background-color: black;
  color: #cccccc;
}
</style>
