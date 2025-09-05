/*
  Pyodide worker: initializes Pyodide, loads packages, applies matplotlib preamble, executes code, and returns outputs.
*/

import type { WorkerRequest, WorkerResponse } from './messageTypes'
// Import the Python preamble source as a raw string at build time
// Vite will inline the file contents when using ?raw
// @ts-ignore - resolved by vite raw plugin
import matplotlibPreamble from './helpers/matplotlib_preamble.py?raw'

// Avoid depending on DOM lib types; treat self as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: any = self as unknown as { postMessage: (msg: WorkerResponse) => void }

type Pyodide = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runPython: (code: string) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runPythonAsync: (code: string) => Promise<any>
  loadPackage: (name: string | string[]) => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globals: any
}

let pyodideReady: Promise<Pyodide> | null = null
let preambleLoaded = false
let selectedIndexURL: string | null = null

// Known packages we can auto-load from local pyodide assets
const KNOWN_PYODIDE_PACKAGES = new Set([
  'numpy',
  'matplotlib',
  'sympy',
  'scipy',
  'pandas',
  'pillow'
])

// Local package filenames curated under public/pyodide. Used as an offline fallback
// when pyodide-lock.json is missing or incomplete and loadPackage(name) fails.
const LOCAL_PACKAGE_FILES: Record<string, string> = {
  numpy: 'numpy-2.2.5-cp313-cp313-pyodide_2025_0_wasm32.whl',
  scipy: 'scipy-1.14.1-cp313-cp313-pyodide_2025_0_wasm32.whl',
  pandas: 'pandas-2.3.1-cp313-cp313-pyodide_2025_0_wasm32.whl',
  matplotlib: 'matplotlib-3.8.4-cp313-cp313-pyodide_2025_0_wasm32.whl',
  sympy: 'sympy-1.13.3-py3-none-any.whl',
  pillow: 'pillow-11.3.0-cp313-cp313-pyodide_2025_0_wasm32.whl',
  pillow_heif: 'pillow_heif-1.0.0-cp313-cp313-pyodide_2025_0_wasm32.whl',
  kiwisolver: 'kiwisolver-1.4.8-cp313-cp313-pyodide_2025_0_wasm32.whl',
  contourpy: 'contourpy-1.3.1-cp313-cp313-pyodide_2025_0_wasm32.whl',
  fonttools: 'fonttools-4.56.0-py3-none-any.whl',
  cycler: 'cycler-0.12.1-py3-none-any.whl',
  packaging: 'packaging-24.2-py3-none-any.whl',
  python_dateutil: 'python_dateutil-2.9.0.post0-py2.py3-none-any.whl',
  pytz: 'pytz-2025.2-py2.py3-none-any.whl',
  tzdata: 'tzdata-2025.2-py2.py3-none-any.whl',
  six: 'six-1.17.0-py2.py3-none-any.whl',
  mpmath: 'mpmath-1.3.0-py3-none-any.whl',
  pyparsing: 'pyparsing-3.2.1-py3-none-any.whl',
  ipython: 'ipython-9.0.2-py3-none-any.whl',
  gmpy2: 'gmpy2-2.1.5-cp313-cp313-pyodide_2025_0_wasm32.whl',
  openblas: 'openblas-0.3.26.zip',
  libopenblas: 'libopenblas-0.3.26.zip'
}

// Minimal dependency graph for offline install fallback
const PACKAGE_DEPS: Record<string, string[]> = {
  // Prefer libopenblas (official Pyodide package), fall back to openblas if that's what's vendored
  numpy: ['libopenblas', 'openblas'],
  scipy: ['numpy', 'libopenblas', 'openblas'],
  pandas: ['numpy', 'python_dateutil', 'pytz', 'tzdata'],
  matplotlib: [
    'numpy',
    'contourpy',
    'cycler',
    'kiwisolver',
    'fonttools',
    'packaging',
    'pyparsing',
    'pillow'
  ],
  sympy: ['mpmath', 'gmpy2'],
  pillow: []
}

function detectRequiredPackagesFromCode(code: string): string[] {
  const found = new Set<string>()
  const add = (name: string): void => {
    if (!name) return
    // Map submodules to root package
    const root = name.split('.')[0]
    let pkg = root
    // Special-case mapping: PIL -> pillow
    if (root.toLowerCase() === 'pil') pkg = 'pillow'
    // Only include known packages to avoid load failures
    if (KNOWN_PYODIDE_PACKAGES.has(pkg)) found.add(pkg)
  }
  try {
    const importRe = /\bimport\s+([^\n#]+)/g
    let m: RegExpExecArray | null
    while ((m = importRe.exec(code))) {
      const clause = m[1]
      clause
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((segment) => {
          // segment like: numpy as np OR matplotlib.pyplot as plt OR sympy
          const name = segment.split(/\s+as\s+/)[0].trim()
          add(name)
        })
    }
  } catch {
    /* ignore */
  }
  try {
    const fromRe = /\bfrom\s+([\w.]+)\s+import\s+/g
    let m2: RegExpExecArray | null
    while ((m2 = fromRe.exec(code))) {
      const mod = (m2[1] || '').trim()
      add(mod)
    }
  } catch {
    /* ignore */
  }
  // Normalize matplotlib.pyplot -> matplotlib already covered by split('.'), but ensure
  if (found.has('matplotlib')) found.add('matplotlib')
  return Array.from(found)
}

async function initPyodide(assetsBaseUrl?: string): Promise<Pyodide> {
  if (pyodideReady) return pyodideReady
  pyodideReady = (async () => {
    // Resolve asset base: prefer provided base; else vite base. Then try candidates.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viteBase: string = ((import.meta as any)?.env?.BASE_URL as string) || '/'
    const base = (assetsBaseUrl || viteBase).replace(/\/?$/, '/')
    // Prefer full dist if present; fallback to curated
    const candidates = [`${base}pyodide-0.28.2/pyodide`, `${base}pyodide`]
    //const candidates = [`${base}pyodide`]

    let lastErr: unknown
    for (const indexURL of candidates) {
      const pyodideJsUrl = `${indexURL}/pyodide.js`
      try {
        if (!('loadPyodide' in ctx)) {
          try {
            // @ts-expect-error importScripts may not exist in module workers
            importScripts(pyodideJsUrl)
          } catch {
            const res = await fetch(pyodideJsUrl)
            if (!res.ok)
              throw new Error(`Failed to fetch ${pyodideJsUrl}: ${res.status} ${res.statusText}`)
            const scriptText = await res.text()
            if (scriptText.trim().startsWith('<')) {
              throw new Error(
                `Received HTML instead of pyodide.js at ${pyodideJsUrl}. Check dev server/public path.`
              )
            }
            const run = new Function(scriptText)
            run()
          }
        }
        const pyodide: Pyodide = await ctx.loadPyodide({ indexURL })
        selectedIndexURL = indexURL
        return pyodide
      } catch (e) {
        lastErr = e
        // Try next candidate
      }
    }
    throw lastErr instanceof Error
      ? new Error(
          `Failed to initialize Pyodide from candidates: ${candidates.join(', ')}\n${lastErr.message}`
        )
      : new Error(`Failed to initialize Pyodide from candidates: ${candidates.join(', ')}`)
  })()
  return pyodideReady
}

async function ensurePackages(pyodide: Pyodide, packages?: string[]): Promise<void> {
  if (!packages || packages.length === 0) return
  await pyodide.loadPackage(packages)
}

function buildMatplotlibSetupCall(isDark: boolean): string {
  // Reset images and apply theme + show hook using preamble-defined functions
  return `
___luna_images___ = []
try:
    _luna_install_show_hook()
    _luna_apply_theme(${isDark ? 'True' : 'False'})
except Exception:
    pass
`
}

function wrapUserCode(code: string): string {
  // Capture stdout/stderr via context manager; collect function names and images
  const indented = code
    .split('\n')
    .map((l) => `    ${l}`)
    .join('\n')
  return `
import sys, io, inspect
stdout_buf, stderr_buf = io.StringIO(), io.StringIO()
__old_stdout, __old_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = stdout_buf, stderr_buf
try:
    # --- BEGIN USER CODE ---
${indented}
    # --- END USER CODE ---
finally:
    sys.stdout, sys.stderr = __old_stdout, __old_stderr
__luna_stdout = stdout_buf.getvalue()
__luna_stderr = stderr_buf.getvalue()
__luna_functions = [name for name, obj in globals().items() if inspect.isfunction(obj)]
`
}

async function execute(req: Extract<WorkerRequest, { type: 'execute' }>): Promise<void> {
  try {
    const pyodide = await initPyodide(req.assetsBaseUrl)

    // Ensure core packages commonly used; include matplotlib so our preamble can hook plt.show
    // Avoid 'micropip' here to prevent SRI/integrity failures if the wheel isn't present locally
    const basePackages = ['matplotlib']
    const inferred = detectRequiredPackagesFromCode(req.code)
    const set = new Set<string>([...(req.packages || []), ...basePackages, ...inferred])
    const packages = Array.from(set)
    // Compute base path for curated/full offline wheels from the chosen indexURL
    const pyodideBase = (selectedIndexURL || '').replace(/\/?$/, '/')
    const usingFullDist = /pyodide-0.28.2\/pyodide\/?$/.test(pyodideBase)
    try {
      await ensurePackages(pyodide, packages)
    } catch (pkgErr) {
      const msg = (pkgErr as Error)?.message || String(pkgErr)
      const unknown = /No known package with name/.test(msg)
      if (!unknown) throw pkgErr
      // If we're running against the full Pyodide dist, don't attempt curated fallback
      if (usingFullDist) throw pkgErr

      // Fallback: install curated wheels/archives via explicit URLs
      const requireSet = new Set<string>(packages)
      // Expand dependencies for selected top-level packages
      const expandDeps = (name: string): void => {
        const deps = PACKAGE_DEPS[name]
        if (!deps) return
        for (const d of deps) {
          if (!requireSet.has(d)) {
            requireSet.add(d)
            expandDeps(d)
          }
        }
      }
      for (const p of packages) expandDeps(p)

      // Map to URLs; filter out ones we don't have filenames for
      let urls: string[] = []
      for (const p of requireSet) {
        const file = LOCAL_PACKAGE_FILES[p]
        if (file) urls.push(pyodideBase + file)
      }
      // Ensure BLAS zips go first when present (libopenblas preferred), then others
      urls = urls.sort((a, b) => {
        const aLib = /libopenblas-/.test(a)
        const bLib = /libopenblas-/.test(b)
        if (aLib && !bLib) return -1
        if (!aLib && bLib) return 1
        const aOpen = /openblas-/.test(a)
        const bOpen = /openblas-/.test(b)
        if (aOpen && !bOpen) return -1
        if (!aOpen && bOpen) return 1
        return 0
      })
      if (urls.length > 0) {
        await pyodide.loadPackage(urls)
      } else {
        throw pkgErr
      }
    }
    // Ensure OpenBLAS is present when using numpy/scipy in curated mode (full dist resolves it itself)
    if (!usingFullDist && (set.has('numpy') || set.has('scipy'))) {
      const blasCandidates = [LOCAL_PACKAGE_FILES.libopenblas, LOCAL_PACKAGE_FILES.openblas]
        .filter(Boolean)
        .map((f) => pyodideBase + f)
      for (const url of blasCandidates) {
        try {
          await pyodide.loadPackage(url)
          break
        } catch {
          // try next candidate
        }
      }
    }

    // Load the matplotlib preamble once per worker lifecycle
    if (!preambleLoaded) {
      await pyodide.runPythonAsync(String(matplotlibPreamble))
      preambleLoaded = true
    }
    // Reset images and (re)apply theme + show hook for this execution
    await pyodide.runPythonAsync(buildMatplotlibSetupCall(!!req.isDarkMode))

    // Run user code wrapped to capture outputs
    await pyodide.runPythonAsync(wrapUserCode(req.code))

    // Extract collected data via evaluating Python expressions for JS-converted results
    const stdout = String(await pyodide.runPythonAsync('__luna_stdout'))
    const stderr = String(await pyodide.runPythonAsync('__luna_stderr'))
    // Use JSON to ensure plain JS arrays (avoids posting non-cloneable PyProxy objects)
    const functionsJson = String(
      await pyodide.runPythonAsync('import json; json.dumps(__luna_functions)')
    )
    const imagesJson = String(
      await pyodide.runPythonAsync('import json; json.dumps(___luna_images___)')
    )
    const functions = JSON.parse(functionsJson) as string[]
    const images = JSON.parse(imagesJson) as string[]

    // Optionally collect specific python variables as repr strings (JSON to ensure conversion)
    let variables: Record<string, string> | undefined
    if (req.pythonVariables && Object.keys(req.pythonVariables).length > 0) {
      const names = Object.keys(req.pythonVariables)
      const namesPy = JSON.stringify(names)
      const pythonFetch =
        `import json\n` +
        `__luna_vars_json = json.dumps({n: repr(globals().get(n)) for n in ${namesPy}})\n`
      await pyodide.runPythonAsync(pythonFetch)
      const varsJson = String(await pyodide.runPythonAsync('__luna_vars_json'))
      variables = JSON.parse(varsJson) as Record<string, string>
    }

    ctx.postMessage({
      type: 'result',
      cellId: req.cellId,
      stdout,
      stderr,
      stdoutText: stdout,
      stdoutImages: images,
      pythonFunctions: functions,
      pythonVariables: variables
    })
  } catch (err) {
    let message = err instanceof Error ? err.message : String(err)
    // Heuristic: missing dynlibs (e.g., BLAS) or unknown package names indicate vendor/runtime issues
    const libLoadFailure =
      /Could not load dynamic lib|bad export type|No known package with name/.test(message)
    if (libLoadFailure) {
      message +=
        '\n\nHint: Ensure your vendored Pyodide folder includes a correct pyodide-lock.json from the matching release, and BLAS archives (libopenblas-0.3.26.zip or openblas-0.3.26.zip). With a proper lock file, dependencies like OpenBLAS are auto-loaded when installing numpy/scipy.'
    }
    // If we failed before or during init, treat it as internal; otherwise, user error.
    const category: 'user' | 'internal' = preambleLoaded && !libLoadFailure ? 'user' : 'internal'
    ctx.postMessage({ type: 'error', cellId: req.cellId, message, category })
  }
}

self.onmessage = (ev: unknown) => {
  const data = (ev as { data?: unknown }).data
  const msg = data as WorkerRequest | undefined
  if (!msg) return
  if (msg.type === 'execute') {
    void execute(msg)
  }
}
