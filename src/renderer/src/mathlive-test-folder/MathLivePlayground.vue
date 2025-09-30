<template>
  <section class="mathlive-playground">
    <header class="mathlive-playground__header">
      <h1>MathLive Playground</h1>
      <p>
        Type with your keyboard or use the virtual keyboard. The current LaTeX value is shown below.
      </p>
    </header>

    <div ref="mathFieldHost" class="mathlive-playground__field">
      <math-field ref="mathFieldEl"></math-field>
    </div>

    <div class="mathlive-playground__controls">
      <div class="mathlive-playground__controls-group">
        <button type="button" @click="toggleVirtualKeyboard">Toggle Keyboard</button>
        <button
          type="button"
          class="mathlive-playground__menu-button"
          aria-label="Open math tools menu"
          @click="toggleContextMenu"
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>
      <div class="mathlive-playground__controls-group">
        <button type="button" @click="resetExample">Reset Example</button>
        <button type="button" @click="copyLatex">Copy LaTeX</button>
      </div>
    </div>

    <section class="mathlive-playground__output">
      <h2>LaTeX Output</h2>
      <pre>{{ currentLatex }}</pre>
      <p v-if="copied" class="mathlive-playground__copied">Copied to clipboard ✓</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MathfieldElement } from 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

type MathfieldInstance = InstanceType<typeof MathfieldElement>

if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('math-field')) {
    try {
      customElements.define('math-field', MathfieldElement)
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'NotSupportedError') {
        throw error
      }
    }
  }
}

const mathFieldHost = ref<HTMLDivElement | null>(null)
const mathFieldEl = ref<MathfieldInstance | null>(null)
const currentLatex = ref('')
const copied = ref(false)
let pendingMatrixNavigation = false

const LOG_PREFIX = '[MathLivePlayground]'
const EXAMPLE_LATEX = String.raw`\frac{a}{b} + \sqrt{c} = d`

const handleInputEvent = (): void => {
  updateLatex('input event')
  if (pendingMatrixNavigation) {
    pendingMatrixNavigation = false
    focusFirstMatrixCell('input event')
  }
}

function getMathField(context: string): MathfieldInstance | null {
  const field = mathFieldEl.value
  if (!field) {
    console.warn(LOG_PREFIX, `${context}: mathFieldEl ref is null`)
    return null
  }
  const hasApi = typeof field.getValue === 'function' && typeof field.executeCommand === 'function'
  if (!hasApi) {
    console.warn(LOG_PREFIX, `${context}: field lacks MathLive API`, field)
    return null
  }
  return field
}

function updateLatex(reason = 'updateLatex'): void {
  const field = getMathField(reason)
  if (!field) return
  currentLatex.value = field.getValue('latex-expanded')
  console.debug(LOG_PREFIX, `${reason}: latex updated`, currentLatex.value)
}

function handleFocus(): void {
  console.debug(LOG_PREFIX, 'focus event received, clearing copied state')
  copied.value = false
}

type MenuSelectDetail = {
  id?: string
  data?: unknown
}

type MenuSelectEventListener = (event: Event) => void

const handleMenuSelect: MenuSelectEventListener = (event) => {
  const detail = (event as CustomEvent<MenuSelectDetail>).detail
  if (!detail) return
  if (isMatrixMenuSelection(detail)) {
    pendingMatrixNavigation = true
    if (import.meta.env.DEV) {
      console.debug(LOG_PREFIX, 'matrix menu item selected', detail)
    }
  }
}

onMounted(() => {
  console.debug(LOG_PREFIX, 'mounted, waiting for <math-field> definition')
  void customElements.whenDefined('math-field').then(() => {
    const host = mathFieldHost.value
    const field = getMathField('onMounted')
    console.debug(LOG_PREFIX, 'custom element defined', { host, field })
    if (!host || !field) return

    host.dataset.ready = 'true'
    field.inlineShortcuts = { ...field.inlineShortcuts }
    field.smartMode = true
    field.value = EXAMPLE_LATEX
    updateLatex('onMounted')

    field.addEventListener('input', handleInputEvent)
    field.addEventListener('focus', handleFocus)
    field.addEventListener('menu-select', handleMenuSelect)
    console.debug(LOG_PREFIX, 'event listeners attached')
  })
})

onBeforeUnmount(() => {
  const field = getMathField('onBeforeUnmount')
  if (!field) return
  field.removeEventListener('input', handleInputEvent)
  field.removeEventListener('focus', handleFocus)
  field.removeEventListener('menu-select', handleMenuSelect)
  console.debug(LOG_PREFIX, 'event listeners removed')
})

function toggleVirtualKeyboard(): void {
  const field = getMathField('toggleVirtualKeyboard')
  if (!field) return
  console.debug(LOG_PREFIX, 'toggling virtual keyboard')
  field.executeCommand('toggleVirtualKeyboard')
}

function toggleContextMenu(): void {
  const field = getMathField('toggleContextMenu')
  if (!field) return
  console.debug(LOG_PREFIX, 'toggling context menu')
  field.executeCommand('toggleContextMenu')
}

function resetExample(): void {
  const field = getMathField('resetExample')
  if (!field) return
  field.value = EXAMPLE_LATEX
  updateLatex('resetExample')
  copied.value = false
  console.debug(LOG_PREFIX, 'example reset to default value')
}

function focusFirstMatrixCell(context: string): void {
  const field = getMathField(context)
  if (!field) return
  requestAnimationFrame(() => {
    const moved = field.executeCommand('moveToNextPlaceholder')
    if (!moved) {
      field.executeCommand('moveToPreviousPlaceholder')
    }
  })
}

function isMatrixMenuSelection(detail: MenuSelectDetail): boolean {
  if (!detail) return false
  if (typeof detail.id === 'string' && detail.id.toLowerCase().includes('matrix')) {
    return true
  }
  if (detail.data && typeof detail.data === 'object') {
    const data = detail.data as Record<string, unknown>
    if ('rows' in data || 'columns' in data || 'cols' in data) {
      return true
    }
  }
  return false
}

async function copyLatex(): Promise<void> {
  if (!navigator.clipboard) {
    console.warn(LOG_PREFIX, 'Clipboard API unavailable')
    return
  }
  try {
    await navigator.clipboard.writeText(currentLatex.value)
    copied.value = true
    console.debug(LOG_PREFIX, 'latex copied to clipboard')
    setTimeout(() => {
      copied.value = false
      console.debug(LOG_PREFIX, 'copied flag reset after timeout')
    }, 1500)
  } catch (error) {
    console.warn(LOG_PREFIX, 'Failed to copy LaTeX:', error)
  }
}
</script>

<style scoped>
.mathlive-playground {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: var(--panel-background, rgba(60, 66, 74, 0.8));
  border: 1px solid var(--border-color, rgba(120, 130, 140, 0.4));
  border-radius: 8px;
  max-width: 720px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.mathlive-playground__header h1 {
  margin: 0;
  font-size: 1.4rem;
}

.mathlive-playground__header p {
  margin: 4px 0 0;
  opacity: 0.8;
}

.mathlive-playground__field {
  min-height: 120px;
  padding: 12px;
  background: var(--surface-background, rgba(24, 28, 32, 0.9));
  border-radius: 6px;
}

.mathlive-playground__field math-field {
  display: block;
  width: 100%;
  min-height: 80px;
  font-size: 1.4rem;
  background: #ffffff;
  color: #000000;
  border-radius: 4px;
}

.mathlive-playground__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.mathlive-playground__controls-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.mathlive-playground__controls button {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid var(--border-color, rgba(140, 150, 160, 0.4));
  background: var(--button-bg, rgba(70, 80, 90, 0.7));
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}

.mathlive-playground__controls button:hover {
  background: rgba(90, 104, 118, 0.9);
}

.mathlive-playground__controls button:active {
  background: rgba(70, 80, 90, 0.95);
}

.mathlive-playground__menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  min-width: 40px;
  padding: 6px;
  font-size: 1.2rem;
}

.mathlive-playground__controls button:hover {
  background: rgba(90, 104, 118, 0.9);
}

.mathlive-playground__controls button:active {
  background: rgba(70, 80, 90, 0.95);
}

.mathlive-playground__output pre {
  margin: 8px 0 0;
  padding: 12px;
  background: #ffffff;
  color: #000000;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.mathlive-playground__copied {
  color: #5cff94;
  font-weight: 600;
}
</style>
