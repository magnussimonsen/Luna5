import { ipcMain } from 'electron'
import zlib from 'node:zlib'
import crypto from 'node:crypto'

/**
 * Registers an IPC handler for compressing (gzip) + encrypting notebook data.
 *
 * Rationale:
 * - We gzip first to reduce size and group structured content.
 * - We then encrypt the gzip buffer so the resulting file no longer starts
 *   with a recognized gzip/zip signature; this prevents the OS from showing
 *   a generic compressed-file icon and mildly obscures contents.
 * - Output is base64 so it can be saved as plain text or binary without
 *   encoding issues.
 *
 * NOTE: This is NOT strong security. The key is hardcoded and should be
 * replaced with a user-specific secret / key management flow later.
 */

// Hardcoded passphrase (placeholder). Replace with secure key management later.
const HARDCODED_PASSPHRASE = 'LUNA_DEV_PLACEHOLDER_KEY_v1'
// Header to identify encrypted payload and allow future versioning.
const FILE_HEADER = Buffer.from('LUNA1') // 5 bytes

function deriveAesKey(passphrase: string): Buffer {
  // Deterministic 32-byte key via SHA-256 of the passphrase
  return crypto.createHash('sha256').update(passphrase, 'utf8').digest()
}

function encryptGzipBuffer(gzipBuffer: Buffer): string {
  const key = deriveAesKey(HARDCODED_PASSPHRASE)
  const iv = crypto.randomBytes(12) // AES-GCM recommended 12-byte nonce
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(gzipBuffer), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Layout: [HEADER][IV(12)][TAG(16)][CIPHERTEXT]
  const packed = Buffer.concat([FILE_HEADER, iv, authTag, ciphertext])
  return packed.toString('base64')
}
export function registerCompressDataHandler(): void {
  ipcMain.handle('compress-data', async (_event, { data }: { data: string }) => {
    return new Promise<string>((resolve, reject) => {
      zlib.gzip(data, (gzipErr, gzipResult) => {
        if (gzipErr) return reject(gzipErr)
        try {
          const encryptedBase64 = encryptGzipBuffer(gzipResult)
          resolve(encryptedBase64)
        } catch (encErr) {
          reject(encErr)
        }
      })
    })
  })
}
