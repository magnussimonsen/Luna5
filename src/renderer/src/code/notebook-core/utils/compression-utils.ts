// Simple JSON-based (de)serialization with optional compression hook.
// This module currently works with string data to match window.api types.

/** Serialize a JS value to a string. Placeholder for real compression (e.g., base64, gzip). */
export async function serializeAndCompress<T>(data: T): Promise<string> {
  const json = JSON.stringify(data)
  // If you later add real compression, return a compressed string here
  return json
}

/** Convert a (possibly compressed) string back to an object via JSON.parse. */
export async function decompressAndDeserialize<T = unknown>(data: string): Promise<T> {
  // If you later add real decompression, decode here first
  return JSON.parse(data) as T
}
