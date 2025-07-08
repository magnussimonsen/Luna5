<script setup lang="ts">
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import { useFontStore } from '@renderer/stores/fonts/fontFamilyStore'
import { useFontSizeStore, fontSizeOptions } from '@renderer/stores/fonts/fontSizeStore'
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'

const generalSettingsStore = useGeneralSettingsStore()
const fontStore = useFontStore()
const fontSizeStore = useFontSizeStore()
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
            <input v-model="generalSettingsStore.enableCodeLintingState" type="checkbox" />
            Enable code linting <ImplementedMark :implemented="false" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <input v-model="generalSettingsStore.enableCodeFormattingState" type="checkbox" />
            Enable code formatting <ImplementedMark :implemented="false" />
          </label>
        </div>
        <div class="setting-row">
          <label>
            <input v-model="generalSettingsStore.enableCodeSuggestionsState" type="checkbox" />
            Enable code suggestions <ImplementedMark :implemented="false" />
          </label>
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
