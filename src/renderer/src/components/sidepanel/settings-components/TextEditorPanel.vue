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
      >Text Editor Settings</strong
    >
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="text-font-select">Text Editor Font:</label>
      <select
        id="text-font-select"
        v-model="fontStore.fonts.textFont"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="fontStore.setTextFont(fontStore.fonts.textFont)"
      >
        <option
          v-for="font in fontStore.availableFonts"
          :key="'textFont-' + font.value"
          :value="font.value"
        >
          {{ font.label }}
        </option>
      </select>
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="text-editor-cells-font-size-select">Text Editor Font Size:</label>
      <select
        id="text-editor-cells-font-size-select"
        v-model="fontSizeStore.fontSizes.textEditorCellFontSize"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        @change="
          fontSizeStore.setTextEditorCellFontSize(fontSizeStore.fontSizes.textEditorCellFontSize)
        "
      >
        <option
          v-for="size in fontSizeOptions"
          :key="'textEditorCellsFontSize-' + size"
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
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'

const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
const themeStore = useThemeStore()
</script>

<style scoped>
.text-editor-settings {
  width: 100%;
}
</style>
