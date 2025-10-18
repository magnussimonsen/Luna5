interface MenubarStoreLike {
  isA4Preview: boolean
  toggleA4Preview(): void
}

interface ThemeStoreLike {
  isDarkMode: boolean
  toggleIsDarkMode(): void
}

interface GeneralSettingsStoreLike {
  showUserMetadataInA4PreviewGetter: boolean
  setShowUserMetadataInA4Preview(value: boolean): void
}

interface ExportSubmissionDependencies {
  menubarStore: MenubarStoreLike
  themeStore: ThemeStoreLike
  generalSettingsStore: GeneralSettingsStoreLike
  nextTick: NextTickFn
}

type NextTickFn = (callback?: () => void) => Promise<void>

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const createTimestampedFilename = (): string => {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0]
  return `Luna-Submission-${timestamp}.pdf`
}

export async function exportSubmissionPDF({
  menubarStore,
  themeStore,
  generalSettingsStore,
  nextTick
}: ExportSubmissionDependencies): Promise<void> {
  let wasA4Preview = false
  let wasDarkMode = false
  let wasShowingMetadata = false

  let forcedShowMetadata = false
  let toggledA4Preview = false
  let toggledDarkMode = false
  let restoreMonacoStyles: (() => void) | null = null

  try {
    wasA4Preview = menubarStore.isA4Preview
    wasDarkMode = themeStore.isDarkMode
    wasShowingMetadata = generalSettingsStore.showUserMetadataInA4PreviewGetter

    if (!wasShowingMetadata) {
      generalSettingsStore.setShowUserMetadataInA4Preview(true)
      forcedShowMetadata = true
      await nextTick()
    }

    if (!wasA4Preview) {
      menubarStore.toggleA4Preview()
      toggledA4Preview = true
      await nextTick()
      await sleep(100)
    }

    if (wasDarkMode) {
      themeStore.toggleIsDarkMode()
      toggledDarkMode = true
      await nextTick()
      await sleep(100)
    }

    const scrollContainer = document.querySelector('.scroll-container') as HTMLElement | null
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }

    await sleep(200)

    if (!window.api || typeof window.api.savePDF !== 'function') {
      throw new Error('PDF save API not available')
    }

    const fileName = createTimestampedFilename()

    restoreMonacoStyles = temporarilyForceMonacoStylesForPrint()
    const result = await window.api.savePDF({ fileName })

    if (result.success) {
      console.log('PDF saved successfully to:', result.filePath)
      if (window.electron && typeof window.electron.confirmYesNo === 'function') {
        await window.electron.confirmYesNo(`PDF saved successfully to: ${result.filePath}`)
      }
    } else if (!result.canceled) {
      console.error('Failed to save PDF:', result.error)
      if (window.electron && typeof window.electron.confirmYesNo === 'function') {
        await window.electron.confirmYesNo(`PDF export failed: ${result.error}`)
      }
    }
  } catch (error) {
    console.error('Error exporting PDF:', error)
    if (window.electron && typeof window.electron.confirmYesNo === 'function') {
      await window.electron.confirmYesNo(
        `PDF export failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  } finally {
    if (restoreMonacoStyles) {
      restoreMonacoStyles()
    }

    if (forcedShowMetadata) {
      generalSettingsStore.setShowUserMetadataInA4Preview(false)
      await nextTick()
    }

    if (toggledA4Preview) {
      menubarStore.toggleA4Preview()
      await nextTick()
    }

    if (toggledDarkMode) {
      themeStore.toggleIsDarkMode()
      await nextTick()
    }
  }
}

/**
 * Monaco injects its theme styles with media="screen"; PDF export ignores them.
 * Temporarily force those blocks to media="all" and return a restore callback.
 */
function temporarilyForceMonacoStylesForPrint(): () => void {
  const markers = ['.monaco-editor', '.mtk', 'monaco-token', 'monaco-colors']
  const modified: Array<{ node: HTMLStyleElement; mediaAttr: string | null }> = []

  document.querySelectorAll('style').forEach((node) => {
    if (!(node instanceof HTMLStyleElement)) return

    const mediaAttr = node.getAttribute('media')
    if (!mediaAttr || !/screen/i.test(mediaAttr)) return

    const content = node.textContent || ''
    const looksLikeMonaco =
      node.classList.contains('monaco-colors') || markers.some((marker) => content.includes(marker))
    if (!looksLikeMonaco) return

    modified.push({ node, mediaAttr })
    node.media = 'all'
  })

  return () => {
    modified.forEach(({ node, mediaAttr }) => {
      if (mediaAttr) {
        node.media = mediaAttr
      } else {
        node.removeAttribute('media')
      }
    })
  }
}
