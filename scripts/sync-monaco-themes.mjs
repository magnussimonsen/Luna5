// NOTE: Development-only helper
// This script is intended for the development phase to copy a curated subset of
// Monaco themes from node_modules into our app folder. In production, theme JSON
// files should be manually curated and committed under:
//   src/renderer/src/code/monaco/monaco-curated-themes
// This keeps the shipped bundle stable and avoids relying on node_modules layout.
// Run via: npm run themes:sync

// Copy a curated set of Monaco themes from node_modules into our app folder.
// Edit the allowList to control which themes are synced.
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
const DEST_DIR = path.resolve(
  __dirname,
  '../src/renderer/src/code/monaco/monaco-curated-themes'
)

// Choose a small, intentional set of themes to keep bundle size and UI choices focused.
// You can add/remove entries as needed. Filenames must match those in SRC_DIR exactly.
const allowList = [
  // GitHub
  'github-dark.json',
  'github-light.json',

  // Solarized
  'solarized-dark.json',
  'solarized-light.json',

  // Classics
  'monokai.json',
  'dracula.json',
  'one-dark.json',
  'nord.json',

  // Popular modern
  'night-owl.json',
  'tokyo-night.json',

  // Tomorrow family
  'tomorrow.json',
  'tomorrow-night.json'
]

/**
 * Ensure a directory exists (mkdir -p behavior).
 */
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

/**
 * Copy only the selected themes from SRC_DIR to DEST_DIR.
 * Also performs a cleanup pass to remove any themes in DEST_DIR
 * that are no longer present in the allowList (keeps the folder in sync).
 */
async function copySelected() {
  // 1) Make sure the destination folder exists
  await ensureDir(DEST_DIR)
  const found = new Set()

  // 2) Copy each allowed theme JSON from source to destination
  for (const name of allowList) {
    const src = path.join(SRC_DIR, name)
    const dest = path.join(DEST_DIR, name)
    try {
      const data = await fs.readFile(src)
      await fs.writeFile(dest, data)
      found.add(name)
      console.log('Copied', name)
    } catch (err) {
      // If a theme isn't found in node_modules (or any read error), skip it gracefully
      console.warn('Skip', name, '-', err?.message || err)
    }
  }

  // 3) Optional cleanup: remove files in DEST_DIR that are not in allowList
  // This prevents stale themes from lingering after you change the curated list.
  const destEntries = await fs.readdir(DEST_DIR)
  for (const entry of destEntries) {
    if (entry.endsWith('.json') && !found.has(entry)) {
      await fs.unlink(path.join(DEST_DIR, entry))
      console.log('Removed', entry)
    }
  }
}

// Entry point: run the copy and set a non-zero exit code on failures
copySelected().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
