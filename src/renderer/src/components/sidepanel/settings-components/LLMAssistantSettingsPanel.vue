<!-- Path: src/renderer/src/components/sidepanel/settings-components/LLMAssistantPanel.vue -->
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
      >LLM Assistant Settings</strong
    >
    <ol class="llm-assistant-steps sidepanel-bottom-row-margin">
      <li>
        Install Ollama from and a model by following the instructions at
        <a href="https://ollama.com" target="_blank" rel="noopener noreferrer"
          >https://ollama.com</a
        >
      </li>
      <li>Enter run command in field below.</li>
      <li>Enter url to Ollama server in field below.</li>
    </ol>
    <hr />
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="llm-run-command">Run command:</label>
      <input
        id="llm-run-command"
        v-model="runCommandField"
        type="text"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        placeholder="e.g., ollama run llama2"
      />
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <label for="llm-server-path">Ollama server URL:</label>
      <input
        id="llm-server-path"
        v-model="serverPathField"
        type="text"
        :class="{ 'sidepanel__setting-row--dark-mode': themeStore.isDarkMode }"
        placeholder="e.g., http://localhost:1234"
      />
      <ImplementedMark :implemented="true" />
    </div>
    <div :class="['sidepanel__selector-row-with-gap-and-x-padding', 'sidepanel-bottom-row-margin']">
      <button
        :class="[
          'sidepanel__button  sidepanel-bottom-row-margin sidepanel-color-font-styling sidepanel__button--border sidepanel__button--box-shadow',
          { 'sidepanel__button--active': false }
        ]"
        @click="testConnection"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
      >
        Click me to test connection
      </button>
      <!-- show connection status and an ImplementedMark that reflects the flag -->
      <span class="llm-connection-status">{{
        connectionFlag ? 'Connection ok' : isButtonPressed ? 'Button is pressed' : 'Not connected'
      }}</span>
      <ImplementedMark :implemented="false" />
    </div>
    <hr />
    When test connection is clicked and connectionFlag is true and the LLM assistan chat will be
    enabled in the LLM sidepanel. Luna then runs "ollama list" in the background and a list of
    models is fetched to populate the dropdown list of available models in the LLM assistant chat
    sidepanel.
    <p>Dev check for reactivity run Command Field: {{ runCommandField }}</p>
    <p>Dev check for reactivity server Path Field: {{ serverPathField }}</p>
  </div>
</template>

<script setup lang="ts">
import ImplementedMark from '@renderer/components/UI/ImplementedMark.vue'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { computed, ref } from 'vue'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

const themeStore = useThemeStore()

// Use workspace store for persisted LLM assistant state (migration)
const workspaceStore = useWorkspaceStore()
const runCommandField = computed({
  get: () => workspaceStore.getRunLlmAssistantCommand,
  set: (v: string) => workspaceStore.setRunLlmAssistantCommand(v)
})
const serverPathField = computed({
  get: () => workspaceStore.getUseLlmAssistantStoreServerPath,
  set: (v: string) => workspaceStore.setLlmAssistantServerPath(v)
})
// connection flag binding
const connectionFlag = computed({
  get: () => workspaceStore.getConnectionFlag,
  set: (v: boolean) => workspaceStore.setConnectionFlag(v)
})

// local UI state for press detection
const isButtonPressed = ref(false)

function onPointerDown(): void {
  isButtonPressed.value = true
}

function onPointerUp(): void {
  isButtonPressed.value = false
}

// simple test connection handler (mock) — toggles the flag for now
function testConnection(): void {
  // In a real implementation, you'd perform an HTTP request or socket check.
  connectionFlag.value = false
}
</script>

<style scoped>
.llm-connection-status {
  margin-left: 1em;
  font-weight: bold;
}
</style>
