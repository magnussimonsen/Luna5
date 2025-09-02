<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="save-as-modal">
        <h2>Save File As</h2>

        <div class="form-group">
          <label for="fileName">File Name:</label>
          <div class="file-name-container">
            <input
              id="fileName"
              v-model="fileName"
              type="text"
              placeholder="Enter file name"
              @input="handleFileNameInput"
            />
            <span class="file-extension">.luna5</span>
          </div>
        </div>

        <div class="form-group">
          <label for="directory">Save Location:</label>
          <div class="directory-selector">
            <input
              id="directory"
              v-model="savePath"
              type="text"
              readonly
              placeholder="Select directory"
            />
            <button class="browse-button" @click="handleBrowseDirectory">Browse...</button>
          </div>
        </div>

        <div class="preview-path">
          <span>File will be saved as:</span>
          <span class="full-path">{{ fullPath }}</span>
        </div>

        <div class="modal-actions">
          <button class="cancel-button" @click="handleCancel">Cancel</button>
          <button class="save-button" :disabled="!isValid" @click="handleSave">Save</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { serializeAndCompress } from '@renderer/utils/core/compression-utils'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()

// State
const isOpen = computed(() => modalStore.isSaveAsModalOpen)
const fileName = ref('')
const savePath = ref('')
const errorMessage = ref('')

// Local UI lock (self-contained): prevents background interaction while modal is open
const appRoot = (): HTMLElement | null => document.getElementById('app')
const previousOverflow = ref<string>('')
const lockUI = (): void => {
  // Lock body scroll
  previousOverflow.value = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  // Dim and disable pointer events on the app behind the modal
  const root = appRoot()
  if (root) {
    root.setAttribute('aria-hidden', 'true')
    // inert is supported in Chromium; safe in Electron
    try {
      root.setAttribute('inert', '')
    } catch {
      // No-op: inert attribute not supported in this environment
    }
    ;(root as HTMLElement).style.pointerEvents = 'none'
  }
}

const unlockUI = (): void => {
  document.body.style.overflow = previousOverflow.value
  const root = appRoot()
  if (root) {
    root.removeAttribute('aria-hidden')
    root.removeAttribute('inert')
    ;(root as HTMLElement).style.pointerEvents = ''
  }
}

// Get desktop path as default save location
const initializeDefaultPath = async (): Promise<void> => {
  try {
    // Use the show-save-dialog to get the desktop path
    const result = await window.api.showSaveDialog()
    if (!result.canceled && result.filePath) {
      // Extract the directory path and filename
      const path = result.filePath
      const lastSeparatorIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))

      if (lastSeparatorIndex !== -1) {
        savePath.value = path.substring(0, lastSeparatorIndex)

        // Extract filename without extension
        const fileNameWithExt = path.substring(lastSeparatorIndex + 1)
        const extIndex = fileNameWithExt.lastIndexOf('.')

        if (extIndex !== -1) {
          fileName.value = fileNameWithExt.substring(0, extIndex)
        } else {
          fileName.value = fileNameWithExt
        }
      }
    }
  } catch (error) {
    console.error('Failed to get default path:', error)
    // Set a fallback
    fileName.value = 'untitled'
  }
}

// Watch for modal open to initialize default values
watch(
  isOpen,
  (newValue): void => {
    if (newValue) {
      lockUI()
      initializeDefaultPath()
    } else {
      unlockUI()
    }
  },
  { immediate: true }
)

onUnmounted((): void => {
  // Safety: ensure lock is released if component unmounts while open
  unlockUI()
})

// Remove invalid characters from filename
const handleFileNameInput = (): void => {
  // Remove characters that are invalid for filenames
  fileName.value = fileName.value.replace(/[\\/:*?"<>|]/g, '')
}

// Browse for directory
const handleBrowseDirectory = async (): Promise<void> => {
  try {
    const result = await window.api.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      savePath.value = result.filePaths[0]
    }
  } catch (error) {
    console.error('Failed to open directory dialog:', error)
    errorMessage.value = 'Failed to open directory dialog'
  }
}

// Computed properties
const fullPath = computed(() => {
  if (!savePath.value || !fileName.value) return ''
  // Use a simple path concatenation with separator handling
  const separator = savePath.value.endsWith('/') || savePath.value.endsWith('\\') ? '' : '/'
  return `${savePath.value}${separator}${fileName.value}.luna5`
})

const isValid = computed(() => {
  return fileName.value.trim() !== '' && savePath.value.trim() !== ''
})

// Handle actions
const handleCancel = (): void => {
  modalStore.closeSaveAsModal()
}

const handleSave = async (): Promise<void> => {
  if (!isValid.value) return

  try {
    // Get current workspace data
    const workspaceData = workspaceStore.getWorkspace()

    // Compress the workspace data
    const compressedData = await serializeAndCompress(workspaceData)

    // Save the file
    const result = await window.api.saveFile({
      filePath: fullPath.value,
      content: compressedData
    })

    if (result.success) {
      console.log('File saved successfully:', result.filePath)
      // Mark workspace as saved with the current file path
      workspaceStore.markAsSaved(result.filePath)
      // Close the modal
      modalStore.closeSaveAsModal()
    } else {
      errorMessage.value = result.error || 'Failed to save file'
    }
  } catch (error) {
    console.error('Error saving file:', error)
    errorMessage.value = 'An error occurred while saving the file'
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.save-as-modal {
  background-color: var(--background-color, #ffffff);
  border-radius: 8px;
  padding: 24px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--text-color, #333333);
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color, #333333);
}

input[type='text'] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #cccccc);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--input-background, #ffffff);
  color: var(--text-color, #333333);
}

.file-name-container {
  display: flex;
  align-items: center;
}

.file-name-container input {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.file-extension {
  padding: 8px 12px;
  background-color: var(--border-color, #cccccc);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  color: var(--text-color, #333333);
}

.directory-selector {
  display: flex;
  align-items: center;
}

.directory-selector input {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: var(--input-background-disabled, #f5f5f5);
}

.browse-button {
  padding: 8px 12px;
  background-color: var(--button-secondary-background, #dddddd);
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  color: var(--button-text-color, #333333);
}

.browse-button:hover {
  background-color: var(--button-secondary-hover, #cccccc);
}

.preview-path {
  margin-top: 16px;
  margin-bottom: 24px;
  font-size: 13px;
  color: var(--text-color-secondary, #666666);
}

.full-path {
  display: block;
  margin-top: 4px;
  font-weight: 500;
  word-break: break-all;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: var(--button-secondary-background, #dddddd);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--button-text-color, #333333);
}

.cancel-button:hover {
  background-color: var(--button-secondary-hover, #cccccc);
}

.save-button {
  padding: 8px 16px;
  background-color: var(--button-primary-background, #4a86e8);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--button-primary-text-color, #ffffff);
}

.save-button:hover {
  background-color: var(--button-primary-hover, #3a76d8);
}

.save-button:disabled {
  background-color: var(--button-disabled-background, #cccccc);
  color: var(--button-disabled-text-color, #666666);
  cursor: not-allowed;
}
</style>
