/* Type file for owner metadata records */
export interface ownerMetadataRecord {
  id: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phoneNumber: string
  organization: string
  // Add any other relevant fields
  showUserMetadataInA4Preview?: boolean // New optional field (is this needed here? We have it in settingsStore)
}
