/**
 * Removes trailing slashes or backslashes from a directory path.
 */
function removeTrailingSlashes(directoryPath: string): string {
  return directoryPath.replace(/[\\/]+$/u, '')
}

/**
 * Detects the path separator used in a directory path.
 * Returns backslash for Windows paths, forward slash for Unix-like paths.
 */
function detectPathSeparator(directoryPath: string): string {
  return directoryPath.includes('\\') ? '\\' : '/'
}

/**
 * Combines a directory path and filename with the appropriate path separator.
 *
 * @param directory - The directory path (can be null/undefined)
 * @param fileName - The filename to append
 * @returns The combined path, or just the filename/directory if one is missing
 */
export function combineDirectoryAndFileName(
  directory: string | null | undefined,
  fileName: string
): string {
  if (!directory) {
    return fileName
  }

  if (!fileName) {
    return directory
  }

  const cleanDirectory = removeTrailingSlashes(directory)
  const separator = detectPathSeparator(cleanDirectory)

  return `${cleanDirectory}${separator}${fileName}`
}

/**
 * Retrieves the desktop path from the main process via IPC.
 *
 * @returns The desktop path string, or null if unavailable
 */
export async function getDesktopPath(): Promise<string | null> {
  try {
    const isApiAvailable = window.api && typeof window.api.getDesktopPath === 'function'

    if (!isApiAvailable) {
      return null
    }

    const desktopPath = await window.api.getDesktopPath()
    const isValidPath = typeof desktopPath === 'string' && desktopPath.trim().length > 0

    if (isValidPath) {
      return desktopPath
    }
  } catch (error) {
    console.warn('Failed to obtain desktop path from main process.', error)
  }

  return null
}
