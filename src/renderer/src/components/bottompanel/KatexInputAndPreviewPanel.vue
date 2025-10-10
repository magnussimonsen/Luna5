<template>
  <div class="bottom-panel__content">
    <div class="katex-input-panel" role="group" aria-label="KaTeX editor">
      <section class="katex-input-panel__input" aria-labelledby="katex-bottom-panel-label">
        <textarea
          id="katex-bottom-panel-textarea"
          ref="latexTextareaRef"
          v-model="latexInput"
          class="katex-input-panel__textarea"
          :style="{
            fontSize: textCellFontSize,
            fontFamily: 'var(--text-font, var(--content-font, inherit))'
          }"
          rows="1"
          placeholder="\dfrac{1}{2}"
          spellcheck="false"
          aria-describedby="katex-bottom-panel-help"
        ></textarea>
      </section>
      <section
        class="katex-input-panel__preview"
        :style="{
          fontSize: textCellFontSize
        }"
        aria-live="polite"
      >
        <RenderKatex :latex="latexInput" :mode="katexMode" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import RenderKatex from '@renderer/components/katex/RenderKatex.vue'
import { useBottomPanelStore } from '@renderer/stores/UI/bottompanelStore'
import { useFontSizeStore } from '@renderer/stores/fonts/fontSizeStore'

const bottomPanelStore = useBottomPanelStore()
const fontSizeStore = useFontSizeStore()

const textCellFontSize = computed(() => fontSizeStore.fontSizes.textEditorCellFontSize)

const latexTextareaRef = ref<HTMLTextAreaElement | null>(null)

const normalizeLatexForTextarea = (value: string): string => value.replaceAll('/\\\\n/g', '\n')
const normalizeLatexForStore = (value: string): string => value.replaceAll('/\r\n/g', '\n')

const latexInput = computed({
  get: () => normalizeLatexForTextarea(bottomPanelStore.katexPanelLatex),
  set: (value: string) => {
    bottomPanelStore.updateKatexPanelLatex(normalizeLatexForStore(value))
  }
})

const katexMode = computed(() => bottomPanelStore.katexPanelMode)// 'inline' | 'display'

const focusTextarea = (): void => {
  void nextTick(() => {
    const textarea = latexTextareaRef.value
    if (!textarea) return
    textarea.focus()
    const inputLength = textarea.value.length
    textarea.setSelectionRange(inputLength, inputLength)
  })
}

watch(
  () => bottomPanelStore.activePanel,
  (panel) => {
    if (panel === 'insertKatexMath' && bottomPanelStore.isOpen) {
      focusTextarea()
    }
  },
  { immediate: true }
)

watch(latexInput, () => {
  if (bottomPanelStore.katexPanelError) {
    bottomPanelStore.clearKatexPanelError()
  }
})

watch(
  () => bottomPanelStore.katexPanelPendingInsertion,
  (pending) => {
    if (!pending) return
    const textarea = latexTextareaRef.value
    const currentValue = latexInput.value
    const selectionStart = textarea?.selectionStart ?? currentValue.length
    const selectionEnd = textarea?.selectionEnd ?? currentValue.length

    const safeStart = Math.max(0, Math.min(selectionStart, currentValue.length))
    const safeEnd = Math.max(safeStart, Math.min(selectionEnd, currentValue.length))

    const before = currentValue.slice(0, safeStart)
    const after = currentValue.slice(safeEnd)
    const snippetLatex = pending.latex
    const newValue = `${before}${snippetLatex}${after}`

    latexInput.value = newValue

    const selectionStartOffset = pending.selectionStartOffset ?? snippetLatex.length
    const selectionEndOffset = pending.selectionEndOffset ?? selectionStartOffset

    const nextSelectionStart =
      safeStart + Math.max(0, Math.min(selectionStartOffset, snippetLatex.length))
    const nextSelectionEnd =
      safeStart + Math.max(0, Math.min(selectionEndOffset, snippetLatex.length))

    void nextTick(() => {
      const targetTextarea = latexTextareaRef.value
      if (!targetTextarea) return
      targetTextarea.focus()
      targetTextarea.setSelectionRange(nextSelectionStart, nextSelectionEnd)
    })

    bottomPanelStore.clearKatexPanelPendingInsertion()
  },
  { flush: 'post' }
)
</script>

<style scoped>
.bottom-panel__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.katex-input-panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  gap: min(10px, 1em);
}

.katex-input-panel__input,
.katex-input-panel__preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  min-height: 0;
}

.katex-input-panel__textarea {
  width: auto;
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.5em;
  border-radius: 10px;
  border: 1px solid var(--border-color, #d0d7de);
  background: var(--cell-background, #fff);
  color: var(--text-color, #1f1f1f);
  font: inherit;
  resize: none;
  overflow: auto;
}

.katex-input-panel__textarea:focus {
  outline: 2px solid var(--focus-ring-color, #2684ff);
  outline-offset: 0px;
}

.katex-input-panel__preview {
  background: var(--cell-background, rgba(255, 255, 255, 0.8));
  border: 1px solid var(--border-color, #d0d7de);
  border-radius: var(--border-radius, min(10px, 1em));
  padding: 0em;
  overflow: auto;
}
@media (max-width: 768px) {
  .katex-input-panel {
    gap: 0.75rem;
  }
}
</style>
