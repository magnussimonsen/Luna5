/**
 * normalizeStringToSafeKebab
 *
 * Converts any string to a safe, kebab-case form (lowercase, hyphens, alphanumeric only).
 * Useful for theme IDs, keys, or any identifier that needs normalization.
 *
 * Example:
 *   "GitHub Dark" => "github-dark"
 *   "My@Theme!" => "my-theme"
 */
export function normalizeStringToSafeKebab(myString: string, fallback: string): string {
  try {
    return myString
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  } catch {
    return fallback
  }
}
