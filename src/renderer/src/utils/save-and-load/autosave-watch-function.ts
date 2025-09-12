export async function autosaveWatchFunction(
  interval: number,
  count: number,
  isSaving: { value: boolean },
  saveOrSaveAs: () => Promise<{ success: boolean; error?: string }>
): Promise<void> {
  if (!interval || interval <= 0) return
  if (count < interval) return
  if (isSaving.value) return
  isSaving.value = true
  try {
    const res = await saveOrSaveAs()
    if (!res.success) {
      // Leave counter as-is; user may continue editing, and Save As may be canceled
      // Optionally log in dev
      // console.warn('Autosave failed or canceled:', res.error);
    }
  } finally {
    isSaving.value = false
  }
}
