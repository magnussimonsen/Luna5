// This file tests the window.api type definitions
import '../types/window-types.d.ts'

// Test compression API
async function testCompressionAPI(): Promise<void> {
  try {
    const compressedData = await window.api.compressData({ data: 'test data' })
    console.log('Compressed data:', compressedData)

    const decompressedData = await window.api.decompressData({ data: compressedData })
    console.log('Decompressed data:', decompressedData)
  } catch (error) {
    console.error('Error testing compression API:', error)
  }
}

// Test file API
async function testFileAPI(): Promise<void> {
  try {
    const saveDialog = await window.api.showSaveDialog()
    console.log('Save dialog result:', saveDialog)
  } catch (error) {
    console.error('Error testing file API:', error)
  }
}

export { testCompressionAPI, testFileAPI }
