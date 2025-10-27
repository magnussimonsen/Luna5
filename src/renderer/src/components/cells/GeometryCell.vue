<template>
  <div class="geometry-cell-wrapper" :data-locked="isCellLocked ? 'true' : null">
    <div class="geometry-cell-layout">
      <!-- Left side: Text editor -->
      <div class="geometry-text-editor">
        <textarea
          v-model="textContent"
          class="geometry-textarea"
          placeholder="Enter geometry commands here..."
          :disabled="isCellLocked"
          data-primary-editor="true"
          @input="handleTextInput"
        />
      </div>

      <!-- Right side: Canvas/Render area -->
      <div class="geometry-canvas-area">
        <div class="geometry-canvas-placeholder">
          <div class="geometry-placeholder-content">
            <h3>Geometry Canvas</h3>
            <p>Canvas Size: {{ canvasWidth }} x {{ canvasHeight }}</p>
            <p>Objects: {{ objectCount }}</p>
            <div class="geometry-placeholder-info">
              Geometry will be rendered here based on the commands on the left
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { GeometryCell } from '@renderer/types/notebook-cell-types'
import { useGeometryCellStore } from '@renderer/stores/geometrycell/geometryCellStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

// Props
const { cell } = defineProps<{ cell: GeometryCell }>()

// Stores
const geometryStore = useGeometryCellStore()
const workspaceStore = useWorkspaceStore()

// Reactive text content
const textContent = ref<string>(cell.cellInputContent || '')

// Computed properties
const isCellLocked = computed<boolean>(() => {
  return !!cell.hidden || !!cell.softLocked || !!cell.hardLocked || !!cell.softDeleted
})

const canvasWidth = computed(() => geometryStore.getCanvasState?.width || 800)
const canvasHeight = computed(() => geometryStore.getCanvasState?.height || 600)
const objectCount = computed(() => Object.keys(geometryStore.getAllObjects).length)

// Watch for external changes to cell content
watch(
  () => cell.cellInputContent,
  (newContent) => {
    if (newContent !== textContent.value) {
      textContent.value = newContent || ''
    }
  }
)

// Handle text input changes
function handleTextInput(): void {
  if (isCellLocked.value) return

  // Update the workspace store with the new content
  workspaceStore.setCellInputContent(cell.id, textContent.value)

  // Optionally, also update the geometry store for any parsing/processing
  geometryStore.setCellText(cell.id, textContent.value)
}
</script>

<style scoped>
.geometry-cell-wrapper {
  position: relative;
  background: var(--cell-background, #fff);
  border-radius: 0px;
  min-height: 300px;
}

.geometry-cell-wrapper[data-locked] {
  opacity: 0.7;
  pointer-events: none;
}

.geometry-cell-layout {
  display: flex;
  height: 100%;
  min-height: 300px;
}

/* Left side: Text editor */
.geometry-text-editor {
  flex: 1;
  padding: 0.5em;
  border-right: 0px solid var(--border-color, #ccc);
  display: flex;
  flex-direction: column;
}

.geometry-textarea {
  flex: 1;
  width: 100%;
  padding: 0em;
  border: none;
  outline: none;
  resize: none;
  font-family: var(--code-font, 'Courier New', monospace);
  font-size: var(--code-font-size, 14px);
  line-height: 1.4;
  background: var(--cell-background, #fff);
  color: var(--text-color, #333);
  min-height: 280px;
}

.geometry-textarea:focus {
  outline: 0px solid var(--active-border-color, #2563eb);
  outline-offset: -2px;
}

.geometry-textarea:disabled {
  background: var(--disabled-background, #f5f5f5);
  color: var(--disabled-text, #999);
  cursor: not-allowed;
}

.geometry-textarea::placeholder {
  color: var(--placeholder-color, #999);
  font-style: italic;
}

/* Right side: Canvas area */
.geometry-canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.geometry-canvas-placeholder {
  flex: 1;
  border: 2px dashed var(--border-color, #ccc);
  border-radius: 4px;
  margin: 0.5rem;
  padding: 2rem;
  text-align: center;
  background: var(--canvas-background, #f9f9f9);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.geometry-placeholder-content h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color, #333);
  font-size: 1.2rem;
}

.geometry-placeholder-content p {
  margin: 0.5rem 0;
  color: var(--text-color-secondary, #666);
  font-size: 0.9rem;
}

.geometry-placeholder-info {
  margin-top: 1rem;
  font-style: italic;
  color: var(--text-color-muted, #888);
  font-size: 0.85rem;
  max-width: 250px;
  line-height: 1.4;
}

/* Responsive design for smaller screens */
@media (max-width: 768px) {
  .geometry-cell-layout {
    flex-direction: column;
  }

  .geometry-text-editor {
    border-right: none;
    border-bottom: 1px solid var(--border-color, #ccc);
  }

  .geometry-textarea {
    min-height: 150px;
  }

  .geometry-canvas-placeholder {
    min-height: 200px;
  }
}
</style>
