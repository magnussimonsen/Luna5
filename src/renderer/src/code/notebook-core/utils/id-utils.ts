// Simple ID helpers using built-in Web Crypto (Electron/Chromium environment)
export function uuid(): string {
  return crypto.randomUUID()
}

export function newId(prefix?: string): string {
  const id = crypto.randomUUID()
  return prefix ? `${prefix}_${id}` : id
}
