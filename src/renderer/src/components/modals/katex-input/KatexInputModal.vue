<!--
A simple modal dialog component for inputting LaTeX expressions using KaTeX.

What triggers the modal to open?
- The button celltoolbar "insert inline math" and "insert block math" in the textcelltoolbar.vue src/renderer/src/components/toolbars/TextCellToolbar.vue
- Emits katex string for parent components to listen to.

Props:
- isOpen: Boolean to control modal visibility. (use src/renderer/src/stores/UI/modalStore.ts)
- initialKatex: Initial KaTeX string to populate the input field.

Events:
- close: Emitted when the modal is closed without saving. (use src/renderer/src/stores/UI/modalStore.ts)
- insert: Emitted with the KaTeX string when the user confirms the input.

Modal div layout:
- Ideally should be resizable and draggable. (is easy, do it, if not, leave it for now and use a fixed size)
- Ideally pops up from the bottom center of the screen above the statusbar.
- Buttons on top using row-flex-wrap-base.css file src/renderer/src/css/main-imports-this-css/row-flex-wrap-base.css
- Row 1:
- Button 1: Insert math (emits katex string and closes modal)
- Button 2: Cancel (closes modal without emitting)
- Row 2:
- Placeholder row for future buttons (e.g. help, templates, etc.)
-->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import RenderKatex from '@renderer/components/katex/RenderKatex.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'

type KatexMode = 'inline' | 'block'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'insert', payload: { latex: string; mode: KatexMode }): void
}>()

const modalStore = useModalStore()

const isOpen = computed(() => modalStore.isKatexInputModalOpen)
const mode = computed<KatexMode>(() => modalStore.katexInsertionMode)
const interactionKind = computed(() => modalStore.katexInteractionKind)
const isEditing = computed(() => interactionKind.value === 'edit')
const latexInput = ref('')
const errorMessage = ref('')

const appRoot = (): HTMLElement | null => document.getElementById('app')
let previousOverflow = ''

const resetLatexInput = (): void => {
  latexInput.value = modalStore.katexInitialLatex ?? ''
  errorMessage.value = ''
}

watch(
  isOpen,
  (open) => {
    if (open) {
      resetLatexInput()
      lockBackground()
    } else {
      unlockBackground()
    }
  },
  { immediate: true }
)

function lockBackground(): void {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  const root = appRoot()
  if (root) {
    root.setAttribute('aria-hidden', 'true')
    try {
      root.setAttribute('inert', '')
    } catch {
      /* inert may be unsupported */
    }
    root.style.pointerEvents = 'none'
  }
}

function unlockBackground(): void {
  document.body.style.overflow = previousOverflow
  const root = appRoot()
  if (root) {
    root.removeAttribute('aria-hidden')
    root.removeAttribute('inert')
    root.style.pointerEvents = ''
  }
}

onMounted(() => {
  if (isOpen.value) {
    lockBackground()
  }
})

onUnmounted(() => {
  unlockBackground()
  window.removeEventListener('keydown', handleKeydown)
})

const handleClose = (): void => {
  modalStore.closeKatexInputModal()
  emit('close')
}

const focusTextArea = (el: HTMLTextAreaElement | null): void => {
  if (!el) return
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  })
}

const handleInsert = (): void => {
  const trimmed = latexInput.value.trim()
  if (!trimmed) {
    errorMessage.value = 'Enter a LaTeX expression to insert.'
    return
  }
  emit('insert', { latex: trimmed, mode: mode.value })
  modalStore.closeKatexInputModal()
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (!isOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    handleClose()
  } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    handleInsert()
  }
}

watch(
  isOpen,
  (open) => {
    if (open) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Insert KaTeX expression"
      >
        <section class="modal-card" role="document">
          <header class="modal-card__header">
            <h2 class="modal-card__title">
              {{
                isEditing
                  ? mode === 'inline'
                    ? 'Edit inline math'
                    : 'Edit block math'
                  : mode === 'inline'
                    ? 'Insert inline math'
                    : 'Insert block math'
              }}
            </h2>
          </header>

          <main class="modal-card__body">
            <div class="input-section">
              <label class="sr-only" for="katex-input-textarea">LaTeX input</label>
              <textarea
                id="katex-input-textarea"
                ref="focusTextArea"
                v-model="latexInput"
                rows="8"
                class="katex-textarea"
                placeholder="\frac{a}{b}"
                aria-label="LaTeX input"
              />

              <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </div>

            <div class="preview-section">
              <RenderKatex :latex="latexInput" :mode="mode" />
            </div>
          </main>

          <footer class="modal-card__footer">
            <div class="button-row">
              <button class="primary" type="button" @click="handleInsert">
                {{ isEditing ? 'Update' : 'Insert' }}
              </button>
              <button class="secondary" type="button" @click="handleClose">Cancel</button>
            </div>
            <div class="button-row button-row--secondary">
              <slot name="secondary-actions"></slot>
            </div>
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: var(--modal-overlay-z-index, 5000);
}

.modal-card {
  background: var(--menu-background, #ffffff);
  color: var(--text-color, #1f1f1f);
  border-radius: var(--border-radius, 12px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  width: min(560px, 95vw);
  margin-bottom: calc(var(--bottom-chrome-height, 0px) + 1rem);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  max-width: 95vw;
}

.modal-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-card__body {
  padding: 1rem 1.5rem 0 1.5rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.preview-section,
.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
  padding: 0.75rem 0 0.25rem;
}

.preview-section {
  max-height: 16rem;
  height: fit-content;
  overflow-y: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.katex-textarea {
  min-height: 2rem;
  max-height: 10em;
  height: fit-content;
  overflow-y: auto;
  font-family: 'Fira Code', 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, #ccc);
  background: var(--modal-input-background, #f8f8f8);
  color: inherit;
  overflow: auto;
  resize: none;
  padding: 0.5rem 0.75rem;
}

.katex-textarea:focus {
  outline: none;
  border-color: var(--accent-color, #5b8def);
  box-shadow: 0 0 0 2px rgba(91, 141, 239, 0.2);
}

.error-message {
  color: #e45858;
  font-size: 0.9rem;
}

.shortcut-hint {
  font-size: 0.85rem;
  color: var(--muted-text-color, #666);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.modal-card__footer {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.button-row {
  display: flex;
  gap: 0.5rem;
}

.button-row--secondary {
  justify-content: space-between;
  color: var(--muted-text-color, #666);
  font-size: 0.85rem;
}

button.primary {
  background: var(--accent-color, #5b8def);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  cursor: pointer;
}

button.secondary {
  background: transparent;
  color: inherit;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 8px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
}

button.primary:hover {
  background: var(--accent-color-strong, #4a7ae0);
}

button.secondary:hover {
  background: var(--button-hover-color, rgba(0, 0, 0, 0.05));
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
