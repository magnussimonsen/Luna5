import type { PreloadFont } from '@renderer/types/preload-font-types'

/**
 * Inject <link rel="preload"> tags for critical font files.
 * Keep this list minimal to avoid blocking network requests.
 */
export function preloadCriticalFonts(fonts: PreloadFont[]): void {
  fonts.forEach((font) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = font.href
    link.as = font.as
    link.type = font.type
    if (font.crossorigin) link.crossOrigin = font.crossorigin
    document.head.appendChild(link)
  })
}

/**
 * Set CSS custom properties for font families, e.g. --font-family-ui, --font-family-code.
 * Components reference these via var(--font-family-XXX).
 */
export function setFontFamilies(fontsConfig: Record<string, string>): void {
  Object.entries(fontsConfig).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--font-family-${key}`, value)
  })
}
