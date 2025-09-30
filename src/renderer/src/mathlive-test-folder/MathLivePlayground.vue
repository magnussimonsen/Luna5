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
      <button type="button" @click="toggleVirtualKeyboard">Toggle Keyboard</button>
      <button type="button" @click="resetExample">Reset Example</button>
      <button type="button" @click="copyLatex">Copy LaTeX</button>
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
import type { MathfieldElement } from 'mathlive'
import 'mathlive/static.css'
import 'mathlive/fonts.css'

const mathFieldHost = ref<HTMLDivElement | null>(null)
const mathFieldEl = ref<MathfieldElement | null>(null)
const currentLatex = ref('')
const copied = ref(false)

const EXAMPLE_LATEX = String.raw`\frac{a}{b} + \sqrt{c} = d`

function updateLatex(): void {
  const field = mathFieldEl.value
  if (!field) return
  currentLatex.value = field.getValue('latex-expanded')
}

function handleFocus(): void {
  copied.value = false
}

onMounted(() => {
  const host = mathFieldHost.value
  const field = mathFieldEl.value
  if (!host || !field) return

  host.dataset.ready = 'true'
  field.inlineShortcuts = { ...field.inlineShortcuts }
  field.smartMode = true
  field.value = EXAMPLE_LATEX
  updateLatex()

  field.addEventListener('input', updateLatex)
  field.addEventListener('focus', handleFocus)
})

onBeforeUnmount(() => {
  const field = mathFieldEl.value
  if (!field) return
  field.removeEventListener('input', updateLatex)
  field.removeEventListener('focus', handleFocus)
})

function toggleVirtualKeyboard(): void {
  mathFieldEl.value?.executeCommand('toggleVirtualKeyboard')
}

function resetExample(): void {
  const field = mathFieldEl.value
  if (!field) return
  field.value = EXAMPLE_LATEX
  updateLatex()
  copied.value = false
}

async function copyLatex(): Promise<void> {
  if (!navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(currentLatex.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (error) {
    console.warn('Failed to copy LaTeX:', error)
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
  background: transparent;
  color: inherit;
}

.mathlive-playground__controls {
  display: flex;
  flex-wrap: wrap;
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

.mathlive-playground__output pre {
  margin: 8px 0 0;
  padding: 12px;
  background: rgba(12, 14, 16, 0.85);
  border-radius: 6px;
  overflow-x: auto;
}

.mathlive-playground__copied {
  color: #5cff94;
  font-weight: 600;
}
</style>
