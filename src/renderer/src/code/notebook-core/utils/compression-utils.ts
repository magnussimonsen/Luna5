/**
 * Utility functions for compression and decompression operations.
 *
 * PURPOSE:
 * This file provides utility functions that allow the renderer process to use
 * compression and decompression functionality, which requires Node.js features
 * not directly available in the renderer process for security reasons.
 *
 * ARCHITECTURE:
 * - This file bridges the renderer and main processes by providing a clean API
 *   for the renderer to call compression functions that run in the main process
 * - It abstracts away IPC complexity behind simple function calls
 * - It adds higher-level functionality that combines compression with JSON
 *   serialization/deserialization for convenient data storage
 *
 * RELATED FILES:
 * - Main Process: The actual compression is handled by ipc-main-handle-functions/compress-data.ts
 *   and ipc-main-handle-functions/decompress-data.ts which register IPC handlers using Node.js zlib
 * - Usage Example: See notebook-core/persistence/compressed-file-handler.ts for an example of
 *   how these utilities are used to save/load workspaces with compression
 */

// The window-types.d.ts file is a global declaration file and is automatically included
// by TypeScript without needing an explicit import

/**
 * Compresses a string using zlib (via IPC to main process)
 *
 * This function calls the main process through IPC to perform zlib compression,
 * which isn't directly available in the renderer process for security reasons.
 * The result is returned as a base64-encoded string suitable for storage or transmission.
 *
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
 *
 * This function calls the main process through IPC to perform zlib decompression,
 * converting a previously compressed base64-encoded string back to its original form.
 * This is necessary because zlib functionality isn't directly available in the
 * renderer process for security reasons.
 *
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
 *
 * This higher-level utility combines two operations:
 * 1. Converts a JavaScript object to a JSON string
 * 2. Compresses that string using zlib (through IPC)
 *
 * This is particularly useful for saving complex data structures
 * to files with reduced size requirements.
 *
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
 *
 * This higher-level utility combines two operations:
 * 1. Decompresses a base64-encoded string using zlib (through IPC)
 * 2. Parses the resulting string as JSON into a JavaScript object
 *
 * This is particularly useful for loading complex data structures
 * that were previously saved using serializeAndCompress().
 *
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
