/**
 * Utilities for parsing base64-encoded image data URLs embedded in stdout.
 * Useful for capturing matplotlib figures printed as data URLs by the Python worker.
 */

import type { PythonDisplayItem } from '../../types/notebook-cell-types'

// Matches full data URLs like: data:image/png;base64,AAAA...
// Supports various image mimes (png, svg+xml, jpeg, webp, etc.)
const IMAGE_DATAURL_REGEX = /(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+)/g

/**
 * Extract all image data URLs from stdout.
 *
 * @param stdout - Raw stdout string from Python execution
 * @returns Array of data URLs in the order they appear
 */
export function extractImagesFromStdout(stdout: string | undefined | null): string[] {
  if (!stdout) return []
  const matches = stdout.match(IMAGE_DATAURL_REGEX) || []
  return matches
}

/**
 * Remove all image data URLs from stdout and trim whitespace.
 * Collapses multiple blank lines down to a single newline for neatness.
 *
 * @param stdout - Raw stdout string from Python execution
 * @returns Cleaned stdout text with images removed
 */
export function stripImagesFromStdout(stdout: string | undefined | null): string {
  if (!stdout) return ''
  const withoutImages = stdout.replaceAll(IMAGE_DATAURL_REGEX, '').trim()
  // Collapse 3+ blank lines to at most 2, then tidy up extra spaces around newlines
  return withoutImages.replace(/[\t ]+$/gm, '').replace(/\n{3,}/g, '\n\n')
}

/**
 * Convenience helper to parse stdout into text + images in one pass.
 */
export function parseStdoutForImages(stdout: string | undefined | null): {
  images: string[]
  text: string
} {
  const images = extractImagesFromStdout(stdout)
  const text = stripImagesFromStdout(stdout)
  return { images, text }
}

/**
 * Convert image data URLs to PythonDisplayItem entries.
 * Infers the MIME type from the data URL prefix.
 */
export function imagesToDisplayItems(images: string[]): PythonDisplayItem[] {
  return images
    .map((url) => {
      const match = url.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/)
      if (!match) return undefined
      const [, mime] = match
      return { mime, data: url }
    })
    .filter((x): x is PythonDisplayItem => Boolean(x))
}

/**
 * Parse stdout and produce both cleaned text and displayItems (future-friendly).
 */
export function parseStdoutToDisplayBundle(stdout: string | undefined | null): {
  text: string
  displayItems: PythonDisplayItem[]
} {
  const { images, text } = parseStdoutForImages(stdout)
  const displayItems = imagesToDisplayItems(images)
  return { text, displayItems }
}
