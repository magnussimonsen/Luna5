<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import katex, { type KatexOptions } from 'katex'

const props = withDefaults(
  defineProps<{
    latex?: string
    mode?: 'inline' | 'block'
    katexOptions?: KatexOptions
  }>(),
  {
    latex: '',
    mode: 'inline',
    katexOptions: () => ({ throwOnError: false })
  }
)

const containerRef = ref<HTMLDivElement | null>(null)
const lastError = ref<string | null>(null)
const isDisplayMode = computed(() => props.mode === 'block')

const renderKatex = (): void => {
  const el = containerRef.value
  if (!el) return

  try {
    katex.render(props.latex.trim(), el, {
      ...props.katexOptions,
      displayMode: isDisplayMode.value
    })
    lastError.value = null
    el.classList.remove('katex-render-error')
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Rendering failed.'
    el.textContent = props.latex
    el.classList.add('katex-render-error')
  }
}

onMounted(renderKatex)

watch(() => [props.latex, props.mode, props.katexOptions], renderKatex, {
  deep: true
})

onBeforeUnmount(() => {
  const el = containerRef.value
  if (el) {
    el.textContent = ''
  }
})

defineExpose({ rerender: renderKatex })
</script>

<template>
  <div class="katex-preview" :class="{ 'katex-preview--empty': !latex.trim() }">
    <div ref="containerRef" class="katex-preview__render" aria-live="polite"></div>
    <p v-if="lastError" class="katex-preview__error" role="alert">
      {{ lastError }}
    </p>
    <p v-else-if="!latex.trim()" class="katex-preview__placeholder">
      Start typing to see a real-time preview.
    </p>
  </div>
</template>

<style scoped>
.katex-preview {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: auto;
}

.katex-preview--empty {
  align-items: center;
}

.katex-preview__render {
  font-size: 1em;
  text-align: center;
  color: var(--text-color, #1f1f1f);
}

.katex-preview__render[data-mode='inline'] {
  text-align: left;
}

.katex-preview__placeholder {
  margin: 0;
  font-size: 1em;
  color: var(--muted-text-color, #666);
}

.katex-preview__error {
  margin: 0;
  color: #e45858;
  font-weight: 500;
  font-size: 0.9rem;
}

.katex-render-error {
  color: #e45858;
  font-family: 'Fira Code', monospace;
  white-space: pre-wrap;
}
</style>
