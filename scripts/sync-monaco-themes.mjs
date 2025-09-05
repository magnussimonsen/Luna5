// Development-only helper for syncing Monaco themes into our curated folders.
// What it does (dev):
// - Copies ALL JSON themes from node_modules/monaco-themes/themes
// - Splits them into light/dark destinations based on the theme JSON `base` field
// - Cleans up removed files in the destination folders
// What to do for production:
// - Commit only a small, curated subset under the split folders to keep bundles lean & stable
// Split folders (bundled at runtime):
//   - src/renderer/src/code/monaco/monaco-curated-light-themes
//   - src/renderer/src/code/monaco/monaco-curated-dark-themes
// Run via: npm run themes:sync

// Copy ALL Monaco themes from node_modules into our app folder (development only).
// Themes are auto-split into light/dark destinations based on the JSON `base` field
// (vs/hc-light -> light, vs-dark/hc-black -> dark). Files with unknown base are skipped.

// Standard Node imports (ESM style). We use fs/promises for async file ops.
import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// Resolve an ESM-friendly __dirname (not available by default in ESM modules)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Source: the theme JSON files distributed by monaco-themes.
// Note: node_modules layout can change, which is why this script is dev-only.
const SOURCE_THEMES_DIR = path.resolve(__dirname, '../node_modules/monaco-themes/themes')

// Destination: our app's curated themes folder that ships with production builds.
// Only files in this folder are bundled and used by the app at runtime.
const DESTINATION_LIGHT_THEMES_DIR = path.resolve(
  __dirname,
  '../src/renderer/src/code/monaco/monaco-curated-light-themes'
)
const DESTINATION_DARK_THEMES_DIR = path.resolve(
  __dirname,
  '../src/renderer/src/code/monaco/monaco-curated-dark-themes'
)

// In development we copy ALL themes. In production, commit a minimal curated set.

// Accepted base values from the theme JSON; anything else is skipped.
const VALID_LIGHT_BASES = new Set(['vs', 'hc-light'])
const VALID_DARK_BASES = new Set(['vs-dark', 'hc-black'])
// Known non-theme JSONs in monaco-themes we should skip explicitly.
const SKIP_FILE_NAMES = new Set(['themelist.json'])

/**
 * Ensure a directory exists (mkdir -p behavior).
 */
/** Ensure a directory exists (mkdir -p behavior). */
async function ensureDirectoryExists(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true })
}

/** Quick check for .json files (case-insensitive). */
function isJsonFile(fileName) {
  return typeof fileName === 'string' && fileName.toLowerCase().endsWith('.json')
}

/** Classify a theme base into 'light' | 'dark' | null. */
function classifyBase(baseValue) {
  if (VALID_LIGHT_BASES.has(baseValue)) return 'light'
  if (VALID_DARK_BASES.has(baseValue)) return 'dark'
  return null
}

async function copyAllSplitByBase() {
  await ensureDirectoryExists(DESTINATION_LIGHT_THEMES_DIR)
  await ensureDirectoryExists(DESTINATION_DARK_THEMES_DIR)

  const sourceDirectoryEntries = await fs.readdir(SOURCE_THEMES_DIR, { withFileTypes: true })
  // Track which files we copied to each destination; used for cleanup pass.
  const foundLightFiles = new Set()
  const foundDarkFiles = new Set()

  for (const dirent of sourceDirectoryEntries) {
    if (!dirent.isFile() || !isJsonFile(dirent.name)) continue
    if (SKIP_FILE_NAMES.has(dirent.name)) continue
    const sourcePath = path.join(SOURCE_THEMES_DIR, dirent.name)
    try {
      const themeJsonRaw = await fs.readFile(sourcePath, 'utf8')
      const themeJson = JSON.parse(themeJsonRaw)
      const baseValue = (themeJson?.base || '').toString().toLowerCase()
      const classification = classifyBase(baseValue)
      if (!classification) {
        console.warn('Skip (unknown base):', dirent.name)
        continue
      }
      const destinationDirectory =
        classification === 'light' ? DESTINATION_LIGHT_THEMES_DIR : DESTINATION_DARK_THEMES_DIR
      const destinationFilePath = path.join(destinationDirectory, dirent.name)
      await fs.writeFile(destinationFilePath, themeJsonRaw)
      if (destinationDirectory === DESTINATION_LIGHT_THEMES_DIR) {
        foundLightFiles.add(dirent.name)
        console.log('Copied', dirent.name, '->', path.basename(DESTINATION_LIGHT_THEMES_DIR))
      } else {
        foundDarkFiles.add(dirent.name)
        console.log('Copied', dirent.name, '->', path.basename(DESTINATION_DARK_THEMES_DIR))
      }
    } catch (err) {
      console.warn('Skip', dirent.name, '-', err?.message || err)
    }
  }

  // Cleanup pass: remove files not present anymore
  for (const [destinationDirectory, foundSet] of [
    [DESTINATION_LIGHT_THEMES_DIR, foundLightFiles],
    [DESTINATION_DARK_THEMES_DIR, foundDarkFiles]
  ]) {
    const destinationDirectoryEntries = await fs.readdir(destinationDirectory)
    for (const fileName of destinationDirectoryEntries) {
      if (fileName.toLowerCase().endsWith('.json') && !foundSet.has(fileName)) {
        await fs.unlink(path.join(destinationDirectory, fileName))
        console.log('Removed', fileName, 'from', path.basename(destinationDirectory))
      }
    }
  }
}

// Entry point: run the copy and set a non-zero exit code on failures
copyAllSplitByBase().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
