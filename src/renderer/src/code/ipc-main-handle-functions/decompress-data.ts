import { ipcMain } from 'electron'
import zlib from 'node:zlib'
import crypto from 'node:crypto'

/**
 * Registers an IPC handler for decrypting + gunzipping notebook data.
 *
 * Since the application has not shipped yet we enforce the new encrypted
 * format strictly. Files must start with the header (e.g. LUNA1). If the
 * header is missing we throw an error instead of attempting any legacy
 * fallback (keeps logic simple and reduces ambiguity).
 */

const HARDCODED_PASSPHRASE = 'LUNA_DEV_PLACEHOLDER_KEY_v1'
const FILE_HEADER = Buffer.from('LUNA1') // 5 bytes

function deriveAesKey(passphrase: string): Buffer {
  return crypto.createHash('sha256').update(passphrase, 'utf8').digest()
}

function isEncryptedPayload(buf: Buffer): boolean {
  return buf.length > FILE_HEADER.length && buf.subarray(0, FILE_HEADER.length).equals(FILE_HEADER)
}

function decryptToGzipBuffer(packed: Buffer): Buffer {
  // Layout: [HEADER][IV(12)][TAG(16)][CIPHERTEXT]
  const offsetHeader = FILE_HEADER.length
  const iv = packed.subarray(offsetHeader, offsetHeader + 12)
  const tag = packed.subarray(offsetHeader + 12, offsetHeader + 12 + 16)
  const ciphertext = packed.subarray(offsetHeader + 12 + 16)
  const key = deriveAesKey(HARDCODED_PASSPHRASE)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return decrypted // still gzip-compressed
}
export function registerDecompressDataHandler(): void {
  ipcMain.handle('decompress-data', async (_event, { data }: { data: string | Buffer }) => {
    return new Promise<string>((resolve, reject) => {
      try {
        // Always expect base64 string from current save pipeline
        const base64 = typeof data === 'string' ? data : data.toString('utf8')
        const packed = Buffer.from(base64, 'base64')

        if (!isEncryptedPayload(packed)) {
          return reject(new Error('Invalid file format: missing LUNA1 header'))
        }

        const gzipBuffer = decryptToGzipBuffer(packed)
        zlib.gunzip(gzipBuffer, (gunzipErr, decompressed) => {
          if (gunzipErr) return reject(gunzipErr)
          resolve(decompressed.toString('utf8'))
        })
      } catch (err) {
        reject(err)
      }
    })
  })
}
