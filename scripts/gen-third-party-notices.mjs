#!/usr/bin/env node
/*
  Third-Party Notices generator for Luna5

  What this script does
  - Reads package.json (declared deps) and inspects node_modules/<name>/package.json
    to resolve the installed version and license for each dependency (dev + prod).
  - Emits a human-readable THIRD_PARTY_NOTICES.md at the repo root.
  - Appends a curated section for Pyodide and bundled Python wheels which are vendored
    under public/pyodide/ (we don’t rely on npm for those assets).

  How to run
  - Manually:    node scripts/gen-third-party-notices.mjs
  - Via npm:     npm run gen:thirdparty
  - In builds:   This runs automatically via the "prebuild" script in package.json.

  Windows note
  - If PowerShell blocks npm scripts due to execution policy, invoke the node command directly.

  Scope and caveats
  - License detection is best-effort based on the "license" (or "licenses") field in each
    dependency’s package.json. Some packages may omit or structure this differently; those
    appear as "(unknown)" and should be reviewed manually if needed.
  - The Pyodide/wheels list is a summary. If you update files in public/pyodide/, also
    regenerate the pyodide file list (scripts/gen-pyodide-file-list.mjs) and review wheel
    metadata for exact licenses/versions.

  Future enhancements (nice-to-have)
  - Read LICENSE* files from node_modules/<pkg>/ to provide SPDX id and/or short excerpts.
  - Enumerate wheels under public/pyodide and extract license data from METADATA or
    *.dist-info directories for precise attribution.
*/
import { promises as fs } from 'fs'
import path from 'path'

const root = process.cwd()
const pkgPath = path.join(root, 'package.json')
const lockPaths = [path.join(root, 'package-lock.json'), path.join(root, 'pnpm-lock.yaml')]
const outPath = path.join(root, 'THIRD_PARTY_NOTICES.md')

function tryParseJSON(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

async function readJSONIfExists(p) {
  try {
    return tryParseJSON(await fs.readFile(p, 'utf8'))
  } catch {
    return null
  }
}

function fmtLicense(lic) {
  if (!lic) return 'License: (unknown)'
  if (typeof lic === 'string') return `License: ${lic}`
  if (lic.type) return `License: ${lic.type}`
  return 'License: (unknown)'
}

async function main() {
  // Read project package.json and (optionally) a lock file if present.
  // Currently the lock file isn’t used, but kept here for potential future resolution logic.
  const pkg = await readJSONIfExists(pkgPath)
  const lock = (await readJSONIfExists(lockPaths[0])) || null

  // Merge prod + dev dependencies into a single map of name -> version range.
  const deps = Object.assign({}, pkg?.dependencies || {}, pkg?.devDependencies || {})
  const lines = []

  lines.push('# Third-Party Notices')
  lines.push('')
  lines.push('This document lists third-party software included in this application.')
  lines.push('')
  lines.push('## Node Dependencies')
  lines.push('')

  for (const [name, versionRange] of Object.entries(deps)) {
    let resolved = versionRange
    // Resolve the installed version and license by reading node_modules/<name>/package.json.
    // If node_modules isn’t installed or the package lacks a license field,
    // we fall back to the declared versionRange and mark the license as unknown.
    let license = null
    try {
      const depPkgPath = path.join(root, 'node_modules', name, 'package.json')
      const depPkg = await readJSONIfExists(depPkgPath)
      resolved = depPkg?.version || versionRange
      license = depPkg?.license || depPkg?.licenses || null
    } catch {}
    lines.push(`- ${name}@${resolved} — ${fmtLicense(license)}`)
  }

  lines.push('')
  lines.push('## Pyodide and Bundled Python Wheels')
  lines.push('')
  lines.push('- Pyodide — MPL-2.0, https://github.com/pyodide/pyodide/blob/main/LICENSE')
  lines.push('')
  lines.push('Bundled wheels (see `public/pyodide/` for exact versions):')
  lines.push('- NumPy — BSD-3-Clause')
  lines.push('- SciPy — BSD-3-Clause')
  lines.push('- pandas — BSD-3-Clause')
  lines.push('- Matplotlib — PSF-based/BSD-compatible')
  lines.push('- SymPy — BSD-3-Clause')
  lines.push('- python-dateutil — BSD-3-Clause')
  lines.push('- pytz/tzdata — MIT')
  lines.push('- cycler — BSD-3-Clause')
  lines.push('- kiwisolver — BSD-3-Clause')
  lines.push('- fonttools — MIT')
  lines.push('- pillow/pillow-heif — PIL License/Apache-2.0')
  lines.push('- mpmath — BSD-3-Clause')
  lines.push('- pyparsing — MIT')
  lines.push('- packaging — BSD-2-Clause')
  lines.push('- six — MIT')
  lines.push('- gmpy2 — LGPL-2.1-or-later')
  lines.push('')
  lines.push('Note: Review individual wheel metadata for exact license texts and versions.')

  await fs.writeFile(outPath, lines.join('\n') + '\n', 'utf8')
  console.log(`Wrote ${outPath}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
