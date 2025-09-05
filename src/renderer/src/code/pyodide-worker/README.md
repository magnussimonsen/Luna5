Pyodide Worker (Luna5)

Overview
- Runs Python code via Pyodide in a dedicated Web Worker.
- Captures stdout, stderr, and base64-encoded matplotlib plots.
- Supports light/dark plot theming.
- Strict, typed message contract between main thread and worker.

Structure
- worker.ts: The web worker entry. Initializes Pyodide, loads packages, executes code, and posts results.
- messageTypes.ts: Types for messages to/from the worker.
- helpers/matplotlib_preamble.py: Python helper to set backend, reset state, and apply theme + show() override.
- helpers/extract.ts: Extract helpers for parsing stdout images and safe string conversion.

Notes
- public/pyodide contains the shipped Pyodide distribution and wheels (already present in this repo).
- Error handling differentiates user code errors from internal errors; no bug-report side channel.
- This is a scaffold; wire-up and integration with cells and stores comes next.
