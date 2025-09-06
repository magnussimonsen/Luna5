<template>
  <div class="text-editor-settings side-panel-ui-base">
    <h3>Text Editor Settings</h3>
    <div class="setting-row">
      <label for="text-font-select">Text Editor Font:</label>
      <select
        id="text-font-select"
        v-model="fontStore.fonts.textFont"
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
      <ImplementedMark :implemented="false" />
    </div>
    <div class="setting-row">
      <label for="text-editor-cells-font-size-select">Text Editor Font Size:</label>
      <select
        id="text-editor-cells-font-size-select"
        v-model="fontSizeStore.fontSizes.textEditorCellFontSize"
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
      <ImplementedMark :implemented="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'

const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
</script>

<style scoped>
.text-editor-settings {
  width: 100%;
}
@import '@renderer/css/side-panel-base.css';
</style>
