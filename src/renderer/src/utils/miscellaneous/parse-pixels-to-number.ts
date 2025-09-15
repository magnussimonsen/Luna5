/**
 * parsePixelsToNumber
 *
 * Small utility to extract a numeric pixel value from a CSS length string.
 * Examples:
 *  - "14px" => 14
 *  - "16.5px" => 16.5
 *  - undefined => fallback
 *
 * Why this exists:
 *  - Monaco editor options expect numeric font size values. Many places in the
 *    app store sizes as CSS-style strings (e.g. "14px") or may provide undefined.
 *  - This helper normalizes those values into plain numbers with a safe fallback.
 *
 * Usage:
 *  import { parsePixelsToNumber } from '@renderer/utils/miscellaneous/parse-pixels-to-number'
 *  const fontSize = parsePixelsToNumber(fontSizeCss, 14)
 *
 * Implementation notes:
 *  - Uses a simple regex to extract the leading number (supports integers
 *    and decimals). This is intentionally lightweight and permissive.
 *  - Returns the provided `fallback` if input is falsy or parsing fails.
 */
export function parsePixelsToNumber(px: string | undefined, fallback = 14): number {
  try {
    if (!px) return fallback
    const m = /([0-9]+(?:\.[0-9]+)?)/.exec(px)
    return m ? Number(m[1]) : fallback
  } catch {
    return fallback
  }
}
