# Operations

This folder contains domain operation functions for the normalized workspace model (creating, updating, moving, deleting, restoring cells and notebooks). Each file should export a single, focused function that mutates a provided Workspace instance in a predictable way.

Guidelines:
- Pure or side‑effect light (only modify the passed workspace object).
- Return useful results (e.g., created IDs) when appropriate.
- No direct UI logic or Pinia store calls here.
- Keep naming explicit: `create-cell.ts`, `move-cell.ts`, etc.

Future: integrate undo/redo by wrapping these operations in history recording.
