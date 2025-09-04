<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, type CSSProperties } from 'vue'
import CloseModalButton from '../modalUI/CloseModalButton.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import GeneralSettings from '@renderer/components/modals/settings_modals/settings_pages/GeneralSettings.vue'
import TextEditorSettings from '@renderer/components/modals/settings_modals/settings_pages/TextEditorSettings.vue'
import CasSettings from '@renderer/components/modals/settings_modals/settings_pages/CasSettings.vue'
import GeomentrySettings from '@renderer/components/modals/settings_modals/settings_pages/GeomentrySettings.vue'
import GraphicalCalculatorSettings from '@renderer/components/modals/settings_modals/settings_pages/GraphicalCalculatorSettings.vue'
import CodeSettings from '@renderer/components/modals/settings_modals/settings_pages/CodeSettings.vue'

const modalStore = useModalStore()
const themeStore = useThemeStore()
const selectedSettingsPage = ref('general')

// Movable modal state
const modalEl = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const posLeft = ref(0)
const posTop = ref(0)

const startPointer = { x: 0, y: 0 }
const startPos = { left: 0, top: 0 }

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min
  return Math.max(min, Math.min(max, n))
}

function centerModal(): void {
  const el = modalEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const left = Math.max((window.innerWidth - rect.width) / 2, 8)
  const top = Math.max((window.innerHeight - rect.height) / 2, 8)
  posLeft.value = Math.floor(left)
  posTop.value = Math.floor(top)
}

function onHandlePointerDown(e: PointerEvent): void {
  const el = modalEl.value
  if (!el) return
  try {
    el.setPointerCapture?.(e.pointerId)
  } catch {
    /* ignore */
  }
  isDragging.value = true
  startPointer.x = e.clientX
  startPointer.y = e.clientY
  startPos.left = posLeft.value
  startPos.top = posTop.value
  e.preventDefault()
}

function onWindowPointerMove(e: PointerEvent): void {
  if (!isDragging.value) return
  const el = modalEl.value
  const w = el?.offsetWidth || 0
  const h = el?.offsetHeight || 0
  const dx = e.clientX - startPointer.x
  const dy = e.clientY - startPointer.y
  posLeft.value = clamp(startPos.left + dx, 8, Math.max(8, window.innerWidth - w - 8))
  posTop.value = clamp(startPos.top + dy, 8, Math.max(8, window.innerHeight - h - 8))
}

function onWindowPointerUp(e: PointerEvent): void {
  isDragging.value = false
  try {
    modalEl.value?.releasePointerCapture?.(e.pointerId)
  } catch {
    /* ignore */
  }
}

function onWindowResize(): void {
  // Keep modal within viewport on resize
  const el = modalEl.value
  if (!el) return
  const w = el.offsetWidth
  const h = el.offsetHeight
  posLeft.value = clamp(posLeft.value, 8, Math.max(8, window.innerWidth - w - 8))
  posTop.value = clamp(posTop.value, 8, Math.max(8, window.innerHeight - h - 8))
}

const modalStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  left: `${posLeft.value}px`,
  top: `${posTop.value}px`
}))

const settingsPages = [
  { label: 'General Settings', value: 'general' },
  { label: 'Text Editor Settings', value: 'texteditor' },
  { label: 'Code Settings', value: 'codesettings' },
  { label: 'CAS Settings', value: 'cas' },
  { label: 'Geometry Settings', value: 'geometry' },
  { label: 'Graphical Calculator Settings', value: 'graphical' }
]

onMounted(() => {
  // Center after DOM paints so sizes are known
  nextTick(() => centerModal())
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
  <div ref="modalEl" class="settings-modal" :style="modalStyle">
    <div class="settings-modal__drag-handle" @pointerdown="onHandlePointerDown">
      <strong>Settings</strong>
    </div>
    <CloseModalButton :on-click="modalStore.closeSettingsModal" />
    <select
      v-model="selectedSettingsPage"
      class="settings-page-select"
      :class="{ 'dark-mode': themeStore.isDarkMode }"
    >
      <option v-for="page in settingsPages" :key="page.value" :value="page.value">
        {{ page.label }}
      </option>
    </select>
    <div class="settings-content">
      <GeneralSettings v-if="selectedSettingsPage === 'general'" />
      <TextEditorSettings v-else-if="selectedSettingsPage === 'texteditor'" />
      <CodeSettings v-else-if="selectedSettingsPage === 'codesettings'" />
      <CasSettings v-else-if="selectedSettingsPage === 'cas'" />
      <GeomentrySettings v-else-if="selectedSettingsPage === 'geometry'" />
      <GraphicalCalculatorSettings v-else-if="selectedSettingsPage === 'graphical'" />
    </div>
  </div>
</template>

<style scoped>
.settings-modal {
  position: fixed;
  max-width: 700px;
  max-height: 500px;
  width: 95%;
  background: var(--menu-background, #fff);
  color: var(--text-color, #222);
  border-radius: 4px;
  padding: 1em;
  margin: 0;
  line-height: 1;
  font-size: 0.9em;
  overflow: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.settings-modal__drag-handle {
  cursor: move;
  user-select: none;
  -webkit-user-select: none;
  margin: -0.5em -0.5em 0.5em -0.5em;
  padding: 0.5em;
  background: var(--menu-background, #fff);
  border-bottom: 1px solid var(--dropdown-divider-color, #ccc);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.settings-page-select {
  margin-bottom: 1.5em;
  font-size: 1em;
  padding: 0.25em 0.5em;
}
.settings-content {
  min-height: 300px;
}
select.dark-mode {
  background-color: black;
  color: #cccccc;
}
</style>
