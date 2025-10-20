/* Filepath: src/renderer/src/code/notebook-core/utils/emailValidation.ts */

/**
 * Validates an email address format using a standard regex pattern.
 * Pattern requires: local part, @, domain, and TLD (e.g., user@example.com)
 *
 * @param email - The email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const trimmedEmail = email.trim()

  if (trimmedEmail === '') {
    return false
  }

  // Basic email pattern: local@domain.tld
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(trimmedEmail)
}

/**
 * Validates an email and returns a user-friendly error message if invalid.
 *
 * @param email - The email address to validate
 * @param isRequired - Whether the email field is required
 * @returns An error message if invalid, empty string if valid
 */
export function validateEmailWithMessage(email: string, isRequired = false): string {
  const trimmedEmail = email.trim()

  // Handle empty email based on requirement
  if (trimmedEmail === '') {
    return isRequired ? 'Email is required.' : ''
  }

  // Validate email format
  const isValid = isValidEmail(trimmedEmail)
  if (!isValid) {
    return 'Enter a valid email address.'
  }

  return ''
}
