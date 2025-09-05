// NOTE: Development-only helper
// This script is intended for the development phase to copy a curated subset of
// Monaco themes from node_modules into our app folder. In production, theme JSON
// files should be manually curated and committed under the split folders:
//   - src/renderer/src/code/monaco/monaco-curated-light-themes
//   - src/renderer/src/code/monaco/monaco-curated-dark-themes
// This keeps the shipped bundle stable and avoids relying on node_modules layout.
// Run via: npm run themes:sync

// Copy ALL Monaco themes from node_modules into our app folder (development only).
// Themes are auto-split into light/dark destinations based on the JSON `base` field
// (vs/hc-light -> light, vs-dark/hc-black -> dark).
// Run via: npm run themes:sync

// Standard Node imports (ESM style). We use fs/promises for async file ops.
import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// Resolve an ESM-friendly __dirname (not available by default in ESM modules)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Source: the theme JSON files distributed by monaco-themes.
// Note: node_modules layout can change, which is why this script is dev-only.
const SRC_DIR = path.resolve(__dirname, '../node_modules/monaco-themes/themes')

// Destination: our app's curated themes folder that ships with production builds.
// Only files in this folder are bundled and used by the app at runtime.
const DEST_LIGHT_DIR = path.resolve(
  __dirname,
  '../src/renderer/src/code/monaco/monaco-curated-light-themes'
)
const DEST_DARK_DIR = path.resolve(
  __dirname,
  '../src/renderer/src/code/monaco/monaco-curated-dark-themes'
)

// In development we copy ALL themes. In production, commit a minimal curated set.

/**
 * Ensure a directory exists (mkdir -p behavior).
 */
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function copyAllSplitByBase() {
  await ensureDir(DEST_LIGHT_DIR)
  await ensureDir(DEST_DARK_DIR)

  const entries = await fs.readdir(SRC_DIR, { withFileTypes: true })
  const foundLight = new Set()
  const foundDark = new Set()

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.json')) continue
    const src = path.join(SRC_DIR, entry.name)
    try {
      const raw = await fs.readFile(src, 'utf8')
      const json = JSON.parse(raw)
      const base = (json?.base || '').toString().toLowerCase()
      const isLight = base === 'vs' || base === 'hc-light'
      const isDark = base === 'vs-dark' || base === 'hc-black'
      if (!isLight && !isDark) {
        console.warn('Skip (unknown base):', entry.name)
        continue
      }
      const destDir = isLight ? DEST_LIGHT_DIR : DEST_DARK_DIR
      const dest = path.join(destDir, entry.name)
      await fs.writeFile(dest, raw)
      if (destDir === DEST_LIGHT_DIR) {
        foundLight.add(entry.name)
        console.log('Copied', entry.name, '->', path.basename(DEST_LIGHT_DIR))
      } else {
        foundDark.add(entry.name)
        console.log('Copied', entry.name, '->', path.basename(DEST_DARK_DIR))
      }
    } catch (err) {
      console.warn('Skip', entry.name, '-', err?.message || err)
    }
  }

  // Cleanup pass: remove files not present anymore
  for (const [dir, found] of [
    [DEST_LIGHT_DIR, foundLight],
    [DEST_DARK_DIR, foundDark]
  ]) {
    const destEntries = await fs.readdir(dir)
    for (const f of destEntries) {
      if (f.toLowerCase().endsWith('.json') && !found.has(f)) {
        await fs.unlink(path.join(dir, f))
        console.log('Removed', f, 'from', path.basename(dir))
      }
    }
  }
}

// Entry point: run the copy and set a non-zero exit code on failures
copyAllSplitByBase().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
