/**
 * Utility functions for compression and decompression operations.
 * These utilities are intended to be used on the renderer side
 * to interact with the main process IPC handlers.
 */

/**
 * Compresses a string using zlib (via IPC to main process)
 * @param data The string data to compress
 * @returns A Promise resolving to a base64-encoded compressed string
 */
export async function compressData(data: string): Promise<string> {
  try {
    // Call the main process through the exposed IPC interface
    // Note: This assumes window.api.compressData is exposed via preload
    return await window.api.compressData({ data })
  } catch (error) {
    console.error('Error compressing data:', error)
    throw error
  }
}

/**
 * Decompresses a base64-encoded compressed string (via IPC to main process)
 * @param data The base64-encoded compressed data
 * @returns A Promise resolving to the original uncompressed string
 */
export async function decompressData(data: string): Promise<string> {
  try {
    // Call the main process through the exposed IPC interface
    // Note: This assumes window.api.decompressData is exposed via preload
    return await window.api.decompressData({ data })
  } catch (error) {
    console.error('Error decompressing data:', error)
    throw error
  }
}

/**
 * Serializes an object to JSON and then compresses it
 * @param data The object to serialize and compress
 * @returns A Promise resolving to a base64-encoded compressed string
 */
export async function serializeAndCompress<T>(data: T): Promise<string> {
  try {
    const jsonString = JSON.stringify(data)
    return await compressData(jsonString)
  } catch (error) {
    console.error('Error serializing and compressing data:', error)
    throw error
  }
}

/**
 * Decompresses a string and then deserializes it from JSON
 * @param compressedData The base64-encoded compressed JSON string
 * @returns A Promise resolving to the deserialized object
 */
export async function decompressAndDeserialize<T>(compressedData: string): Promise<T> {
  try {
    const jsonString = await decompressData(compressedData)
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('Error decompressing and deserializing data:', error)
    throw error
  }
}
