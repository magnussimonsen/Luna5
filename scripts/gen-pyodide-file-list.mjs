#!/usr/bin/env node
/**
 * Generate a markdown snapshot of all files currently in public/pyodide.
 *
 * Why: We vendor a fixed Pyodide bundle offline. Keeping a human-readable
 * list in src/dev-notes/ helps reviewers and future maintainers verify what
 * ships with the app.
 *
 * Usage (from repo root):
 *   - node scripts/gen-pyodide-file-list.mjs
 *   - npm run gen:pyodide:list   (wrapper script)
 *
 * Output:
 *   - src/dev-notes/pyodide-file-list-luna5.md
 */
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { promises as fs } from 'fs'
import path from 'path'

const root = process.cwd()
// Input directory containing the vendored Pyodide files
const pyodideDir = path.join(root, 'public', 'pyodide')
// Output path where we write the markdown list
const outPath = path.join(root, 'src', 'dev-notes', 'pyodide-file-list-luna5.md')

/**
 * Small helper: check if a Stat object represents a directory.
 * @param {import('fs').Stats} stat
 */
function isDirStat(stat) {
  return stat && typeof stat.isDirectory === 'function' && stat.isDirectory()
}

/**
 * Filter out OS noise files that sometimes appear in folders.
 * @param {string} name
 */
function isNoise(name) {
  const lower = name.toLowerCase()
  return lower === 'desktop.ini' || lower === 'thumbs.db' || name === '.DS_Store'
}

async function main() {
  try {
  // Read raw directory entries
  const entries = await fs.readdir(pyodideDir)
    const items = []

  // Classify each entry (file vs directory), skipping noise
  for (const name of entries) {
      if (isNoise(name)) continue
      const full = path.join(pyodideDir, name)
      const stat = await fs.stat(full)
      if (isDirStat(stat)) {
        items.push(`${name}/`)
      } else {
        items.push(name)
      }
    }

  // Sort alphabetically for stable diffs and readability
  items.sort((a, b) => a.localeCompare(b))

  // Compose markdown with a timestamp and the bullet list
  const md = `# Pyodide files used in Luna5\n\nFolder: \`public/pyodide/\`\n\nGenerated: ${new Date().toISOString()}\n\n${items
      .map((n) => `- ${n}`)
      .join('\n')}\n\nNotes:\n- This list is auto-generated. Run \`npm run gen:pyodide:list\` to refresh.\n`

  // Ensure folder exists and write file
  await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, md, 'utf8')
    console.log(`Wrote ${outPath}`)
  } catch (err) {
  // Print a friendly error without stack spam
  console.error('Failed to generate list:', err?.message || err)
    process.exit(1)
  }
}

main()
