#!/usr/bin/env node
/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { promises as fs } from 'fs'
import path from 'path'

const root = process.cwd()
const pyodideDir = path.join(root, 'public', 'pyodide')
const outPath = path.join(root, 'src', 'dev-notes', 'pyodide-file-list-luna5.md')

/** @param {import('fs').Stats} stat */
function isDirStat(stat) {
  return stat && typeof stat.isDirectory === 'function' && stat.isDirectory()
}

/** @param {string} name */
function isNoise(name) {
  const lower = name.toLowerCase()
  return lower === 'desktop.ini' || lower === 'thumbs.db' || name === '.DS_Store'
}

async function main() {
  try {
    const entries = await fs.readdir(pyodideDir)
    const items = []

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

    items.sort((a, b) => a.localeCompare(b))

    const md = `# Pyodide files used in Luna5\n\nFolder: \`public/pyodide/\`\n\nGenerated: ${new Date().toISOString()}\n\n${items
      .map((n) => `- ${n}`)
      .join('\n')}\n\nNotes:\n- This list is auto-generated. Run \`npm run gen:pyodide:list\` to refresh.\n`

    await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, md, 'utf8')
    console.log(`Wrote ${outPath}`)
  } catch (err) {
    console.error('Failed to generate list:', err?.message || err)
    process.exit(1)
  }
}

main()
