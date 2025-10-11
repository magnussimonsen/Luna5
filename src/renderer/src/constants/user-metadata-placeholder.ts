import type { ownerMetadataRecord } from '@renderer/types/owner-metadata-type'

export const userMetadataPlaceholder: ownerMetadataRecord = {
  id: 'placeholder-id',
  firstName: 'Unknown',
  middleName: '',
  lastName: '',
  email: 'unknown@example.com',
  phoneNumber: 'unknown phone number',
  organization: 'unknown organization',
  // Add any other relevant fields
  showUserMetadataInA4Preview: true
}
