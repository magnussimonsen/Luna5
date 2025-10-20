<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-info-modal-title"
      @click.self="handleCancel"
    >
      <div class="student-info-modal">
        <header class="modal-header">
          <h2 id="student-info-modal-title">Student Information</h2>
          <CloseModalButton aria-label="Close dialog" :on-click="handleCancel" />
        </header>
        <p class="modal-helper">
          Provide your details so we can include them in the submission header and filename.
        </p>
        <p class="modal-helper">Your pdf file will be at {{ desktopPath }} as {{ pdfFileName }}.</p>
        <form class="modal-form" @submit.prevent="handleSubmit">
          <div v-if="errors.length" class="error-box" role="alert">
            <ul>
              <li v-for="message in errors" :key="message">{{ message }}</li>
            </ul>
          </div>
          <div class="field">
            <label for="student-first-name">First name<span aria-hidden="true">*</span></label>
            <input
              id="student-first-name"
              ref="firstNameInput"
              v-model="form.firstName"
              autocomplete="given-name"
              :placeholder="placeholderFirstName"
              type="text"
            />
          </div>
          <div class="field">
            <label for="student-middle-name">Middle name</label>
            <input
              id="student-middle-name"
              v-model="form.middleName"
              autocomplete="additional-name"
              :placeholder="placeholderMiddleName"
              type="text"
            />
          </div>
          <div class="field">
            <label for="student-last-name">Last name<span aria-hidden="true">*</span></label>
            <input
              id="student-last-name"
              v-model="form.lastName"
              autocomplete="family-name"
              :placeholder="placeholderLastName"
              type="text"
            />
          </div>
          <div class="field">
            <label for="student-email">Email<span aria-hidden="true">*</span></label>
            <input
              id="student-email"
              v-model="form.email"
              autocomplete="email"
              :placeholder="placeholderEmail"
              type="text"
            />
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-button" @click="handleCancel">Cancel</button>
            <button type="submit" class="continue-button">Continue</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import CloseModalButton from './modalUI/CloseModalButton.vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
//import { useThemeStore } from '@renderer/stores/themes/colorThemeStore'
import { useWorkspaceStore } from '@renderer/stores/workspaces/workspaceStore'
import { useGeneralSettingsStore } from '@renderer/stores/settings/generalSettingsStore'
import type { ownerMetadataRecord } from '@renderer/types/owner-metadata-type'
import {
  createSubmissionPdfFileNameFromDetails,
  type SubmissionNameDetails
} from '@renderer/code/notebook-core/utils/create-file-names'
import { getDesktopPath as requestDesktopPath } from '@renderer/code/notebook-core/utils/get-path-to-desktop'
import { validateEmailWithMessage } from '@renderer/code/notebook-core/utils/emailValidation'

const OWNER_ID_PRIMARY = 'primary'
const OWNER_ID_LEGACY = 'primary-owner'

const modalStore = useModalStore()
const workspaceStore = useWorkspaceStore()
const generalSettingsStore = useGeneralSettingsStore()

const emit = defineEmits<{
  (e: 'submitted', metadata: ownerMetadataRecord): void
  (e: 'cancelled'): void
}>()

const isOpen = computed(() => modalStore.isStudentInfoModalOpen)

const form = reactive({
  firstName: '',
  middleName: '',
  lastName: '',
  email: ''
})

const errors = ref<string[]>([])
const firstNameInput = ref<HTMLInputElement | null>(null)
const previousBodyOverflow = ref<string>('')
const existingOwnerMetadata = ref<ownerMetadataRecord | null>(null)
const desktopPath = ref<string>('Desktop')
const submissionTimestamp = ref<Date>(new Date())

const placeholderFirstName = computed(() => existingOwnerMetadata.value?.firstName ?? '')
const placeholderMiddleName = computed(() => existingOwnerMetadata.value?.middleName ?? '')
const placeholderLastName = computed(() => existingOwnerMetadata.value?.lastName ?? '')
const placeholderEmail = computed(() => existingOwnerMetadata.value?.email ?? '')

/**
 * Prevents user interaction with the main app while modal is open.
 * Locks scrolling and disables pointer events on the app root.
 */
function lockUI(): void {
  previousBodyOverflow.value = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  const appRoot = document.getElementById('app')
  if (appRoot) {
    appRoot.setAttribute('aria-hidden', 'true')
    appRoot.setAttribute('inert', '')
    appRoot.style.pointerEvents = 'none'
  }
}

/**
 * Restores user interaction with the main app after modal closes.
 * Unlocks scrolling and re-enables pointer events on the app root.
 */
function unlockUI(): void {
  document.body.style.overflow = previousBodyOverflow.value

  const appRoot = document.getElementById('app')
  if (appRoot) {
    appRoot.removeAttribute('aria-hidden')
    appRoot.removeAttribute('inert')
    appRoot.style.pointerEvents = ''
  }
}

/**
 * Cleans up event listeners and UI state when modal closes.
 */
function cleanupOnClose(): void {
  window.removeEventListener('keydown', handleKeydown)
  unlockUI()
  errors.value = []
}

/**
 * Loads existing owner metadata from workspace and prefills the form.
 * Tries primary ID first, then legacy ID, then falls back to any primary owner.
 */
function seedFormFromStore(): void {
  const existingMetadata =
    workspaceStore.getOwnerMetadata(OWNER_ID_PRIMARY) ??
    workspaceStore.getOwnerMetadata(OWNER_ID_LEGACY) ??
    workspaceStore.getPrimaryOwnerMetadata()

  existingOwnerMetadata.value = existingMetadata ?? null

  // Prefill form fields so user doesn't have to retype existing information
  form.firstName = existingMetadata?.firstName ?? ''
  form.middleName = existingMetadata?.middleName ?? ''
  form.lastName = existingMetadata?.lastName ?? ''
  form.email = existingMetadata?.email ?? ''
}

/**
 * Fetches the desktop path from the main process for display in the preview.
 * Silently fails if path cannot be retrieved.
 */
async function loadDesktopPath(): Promise<void> {
  try {
    const path = await requestDesktopPath()

    if (path) {
      desktopPath.value = path
    }
  } catch (error) {
    console.warn('Unable to fetch desktop path for PDF preview.', error)
  }
}

/**
 * Handles keyboard events for the modal.
 * Closes modal when Escape key is pressed.
 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancel()
  }
}

/**
 * Resolves the first name from user input or existing placeholder.
 */
function resolveFirstName(): string {
  const userInput = form.firstName.trim()

  if (userInput) {
    return userInput
  }

  return placeholderFirstName.value.trim()
}

/**
 * Resolves the last name from user input or existing placeholder.
 */
function resolveLastName(): string {
  const userInput = form.lastName.trim()

  if (userInput) {
    return userInput
  }

  return placeholderLastName.value.trim()
}

/**
 * Resolves the email from user input or existing placeholder.
 */
function resolveEmail(): string {
  const userInput = form.email.trim()

  if (userInput) {
    return userInput
  }

  return placeholderEmail.value.trim()
}

watch(
  isOpen,
  async (modalIsOpen) => {
    if (modalIsOpen) {
      seedFormFromStore()
      submissionTimestamp.value = new Date()
      loadDesktopPath().catch(() => {
        // Error already logged in loadDesktopPath
      })
      lockUI()
      window.addEventListener('keydown', handleKeydown)
      await nextTick()
      firstNameInput.value?.focus()
      firstNameInput.value?.select()
    } else {
      cleanupOnClose()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  cleanupOnClose()
})

/**
 * Validates all form fields and returns whether the form is valid.
 * Populates the errors array with validation messages.
 */
function validateForm(): boolean {
  const validationErrors: string[] = []

  const firstName = resolveFirstName()
  if (!firstName) {
    validationErrors.push('First name is required.')
  }

  const lastName = resolveLastName()
  if (!lastName) {
    validationErrors.push('Last name is required.')
  }

  const email = resolveEmail()
  const emailError = validateEmailWithMessage(email, true)
  if (emailError) {
    validationErrors.push(emailError)
  }

  errors.value = validationErrors
  return validationErrors.length === 0
}

/**
 * Builds submission details for filename generation.
 * Uses form input if available, otherwise falls back to existing metadata.
 */
function buildSubmissionDetails(): SubmissionNameDetails {
  const existingMetadata = existingOwnerMetadata.value

  return {
    firstName: form.firstName.trim() || existingMetadata?.firstName,
    middleName: form.middleName.trim() || existingMetadata?.middleName,
    lastName: form.lastName.trim() || existingMetadata?.lastName,
    now: submissionTimestamp.value
  }
}

/**
 * Computed property that generates the PDF filename preview based on current form state.
 */
const pdfFileName = computed(() => {
  return createSubmissionPdfFileNameFromDetails(buildSubmissionDetails())
})

/**
 * Handles form submission.
 * Validates data, saves to workspace, and emits submitted event.
 */
function handleSubmit(): void {
  const isFormValid = validateForm()

  if (!isFormValid) {
    return
  }

  // Retrieve existing metadata to preserve fields not captured in this form
  const existingMetadata =
    workspaceStore.getOwnerMetadata(OWNER_ID_PRIMARY) ??
    workspaceStore.getOwnerMetadata(OWNER_ID_LEGACY) ??
    workspaceStore.getPrimaryOwnerMetadata()

  // Normalize owner ID (convert legacy to current standard)
  const ownerId =
    existingMetadata?.id === OWNER_ID_LEGACY
      ? OWNER_ID_PRIMARY
      : (existingMetadata?.id ?? OWNER_ID_PRIMARY)

  // Resolve name and email values from form or placeholders
  const firstName = resolveFirstName()
  const lastName = resolveLastName()
  const email = resolveEmail()

  // Handle middle name: use form input if provided, otherwise use existing
  const middleNameInput = form.middleName.trim()
  const middleName = middleNameInput || existingMetadata?.middleName || ''

  const metadata: ownerMetadataRecord = {
    id: ownerId,
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber: existingMetadata?.phoneNumber ?? '',
    organization: existingMetadata?.organization ?? '',
    showUserMetadataInA4Preview: true
  }

  workspaceStore.setOwnerMetadata(ownerId, metadata)
  generalSettingsStore.setShowUserMetadataInA4Preview(true)
  modalStore.closeStudentInfoModal()
  emit('submitted', metadata)
}

/**
 * Handles modal cancellation.
 * Closes modal and emits cancelled event without saving data.
 */
function handleCancel(): void {
  modalStore.closeStudentInfoModal()
  emit('cancelled')
}
</script>

<style scoped>
.modal-overlay {
  background-color: var(--modal-background-color);
  color: var(--text-color);
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
}

.student-info-modal {
  width: min(420px, 100%);
  background: var(--modal-background-color, #ffffff);
  color: var(--text-color);
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color, #222222);
}

.modal-helper {
  color: var(--text-color, #4a4a4a);
  margin: 0;
  font-size: 0.95rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-weight: 600;
  color: var(--text-color, #222222);
}

.field input {
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--input-border-color, #cccccc);
  background-color: var(--input-field-background-color, #ffffff);
  color: var(--text-color, #222222);
}

.field input:focus {
  outline: 2px solid var(--focus-ring-color, #4c8dff);
  outline-offset: 1px;
}

.error-box {
  background: rgba(219, 68, 55, 0.08);
  border: 1px solid rgba(219, 68, 55, 0.5);
  border-radius: 6px;
  padding: 0.75rem;
  color: #a31212;
}

.error-box ul {
  margin: 0;
  padding-left: 1.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cancel-button,
.continue-button {
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.cancel-button {
  background: var(--button-reset-color, darksalmon);
  color: var(--text-color, #333333);
}

.cancel-button:hover {
  background: var(--button-reset-hover-color, salmon);
}

.continue-button {
  background: var(--button-on-color, #4c8dff);
  border: 1px solid var(--button-border-on-color, #4c8dff);
  color: var(--ui-text-color, #ffffff);
}

.continue-button:hover {
  background: var(--button-on-color-hover, #3a7be0);
}

.field label span {
  color: var(--accent-color, #e55353);
}
</style>
