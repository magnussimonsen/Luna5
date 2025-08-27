/**
 * Example of how to use the compression utilities when saving and loading files
 *
 * This file provides a reference implementation for compressing/decompressing
 * workspace data when saving/loading files.
 */

import {
  serializeAndCompress,
  decompressAndDeserialize
} from '../utils/compression-utils'
import type { Workspace } from '../model/schema'

/**
 * Save a workspace to a file with compression
 * @param workspace The workspace object to save
 * @param filePath The file path to save to
 * @returns A Promise that resolves when the save is complete
 */
export async function saveWorkspaceWithCompression(
  workspace: Workspace,
  filePath: string
): Promise<void> {
  try {
    // Serialize and compress the workspace data
    const compressedData = await serializeAndCompress(workspace)

    // Save the compressed data to a file
    const result = await window.api.saveFile({
      filePath,
      content: compressedData
    })

    if (!result.success) {
      throw new Error(result.error || 'Unknown error saving file')
    }

    console.log(`Workspace saved successfully to ${filePath}`)
  } catch (error) {
    console.error('Error saving workspace:', error)
    throw error
  }
}

/**
 * Load a workspace from a file with decompression
 * @param filePath The file path to load from
 * @returns A Promise that resolves to the loaded workspace
 */
export async function loadWorkspaceWithDecompression(filePath: string): Promise<Workspace> {
  try {
    // Show the file dialog if no path is provided
    if (!filePath) {
      const dialogResult = await window.api.showOpenDialog()
      if (dialogResult.canceled || !dialogResult.filePaths.length) {
        throw new Error('File selection canceled')
      }
      filePath = dialogResult.filePaths[0]
    }

    // Read the file content
    // Note: This API needs to be implemented in preload/index.ts
    const readResult = await window.api.readFile({ filePath })
    if (!readResult.success || !readResult.content) {
      throw new Error(readResult.error || 'Unknown error reading file')
    }

    // Decompress and deserialize the file content
    const workspace = await decompressAndDeserialize<Workspace>(readResult.content)

    console.log(`Workspace loaded successfully from ${filePath}`)
    return workspace
  } catch (error) {
    console.error('Error loading workspace:', error)
    throw error
  }
}
