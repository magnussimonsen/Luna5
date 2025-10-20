import type { Workspace } from '@renderer/code/notebook-core/model/schema'
import type { ownerMetadataRecord } from '@renderer/types/owner-metadata-type'

/**
 * Removes diacritical marks (accents) from a string.
 * Example: "café" becomes "cafe"
 */
function removeDiacritics(text: string): string {
  const normalized = text.normalize('NFKD')
  return normalized.replace(/[\u0300-\u036f]/g, '')
}

/**
 * Sanitizes a text segment for use in filenames.
 * - Removes accents and special characters
 * - Replaces spaces and underscores with hyphens
 * - Removes leading/trailing hyphens
 */
function sanitizeFileNameSegment(text: string): string {
  const withoutAccents = removeDiacritics(text.trim())

  if (withoutAccents === '') {
    return ''
  }

  return withoutAccents
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove all non-alphanumeric except hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

/**
 * Formats a date as Year-Month-Day with explicit labels.
 * Example: "Y2025-M10-D20"
 */
function formatDateStamp(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `Y${year}-M${month}-D${day}`
}

/**
 * Formats a time as Hours-Minutes-Seconds.
 * Example: "14-30-45"
 */
function formatTimeStamp(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}-${minutes}-${seconds}`
}

/**
 * Retrieves the primary owner metadata from a workspace.
 * Returns the first owner found in the metadata object.
 */
function getPrimaryOwnerMetadata(
  workspace: Workspace | null | undefined
): ownerMetadataRecord | null {
  if (!workspace?.ownerMetadata) {
    return null
  }

  const ownerKeys = Object.keys(workspace.ownerMetadata)
  const firstOwnerKey = ownerKeys[0]

  if (!firstOwnerKey) {
    return null
  }

  return workspace.ownerMetadata[firstOwnerKey] ?? null
}

export interface SubmissionNameDetails {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  now?: Date
}

/**
 * Creates a PDF filename for submission from name details and timestamp.
 * Format: firstname-middlename-lastname-Y2025-M10-D20-14-30-45.pdf
 *
 * @param details - Object containing name parts and optional timestamp
 * @returns Sanitized PDF filename with timestamp
 */
export function createSubmissionPdfFileNameFromDetails(details: SubmissionNameDetails): string {
  const timestamp = details.now ?? new Date()
  const dateStamp = formatDateStamp(timestamp)
  const timeStamp = formatTimeStamp(timestamp)

  // Collect and sanitize all name parts
  const nameParts = [details.firstName, details.middleName, details.lastName]
  const sanitizedNameParts = nameParts
    .map((namePart) => (namePart ? sanitizeFileNameSegment(namePart) : ''))
    .filter((namePart) => namePart !== '')

  // Build base filename from name parts or use default
  const hasNameParts = sanitizedNameParts.length > 0
  const baseFileName = hasNameParts ? sanitizedNameParts.join('-') : ''

  return `${baseFileName}${baseFileName ? `-` : ''}${dateStamp}-${timeStamp}.pdf`
}

/**
 * Creates a PDF filename for submission from workspace owner metadata.
 * Extracts the primary owner's name and generates a timestamped filename.
 *
 * @param workspace - The workspace containing owner metadata
 * @returns Sanitized PDF filename with timestamp
 */
export function createSubmissionPdfFileName(workspace: Workspace | null | undefined): string {
  const ownerMetadata = getPrimaryOwnerMetadata(workspace)

  return createSubmissionPdfFileNameFromDetails({
    firstName: ownerMetadata?.firstName,
    middleName: ownerMetadata?.middleName,
    lastName: ownerMetadata?.lastName
  })
}
