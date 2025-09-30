# Math Composer (KaTeX) Overlay – Game Plan

> Implementation-oriented plan for replacing separate inline/block math buttons with a unified math composer overlay. Copy/paste friendly; adjust scope flags as needed.

## Objective
Replace two separate “Insert inline/block math” toolbar buttons with a single “Insert Math” button that opens a bottom overlay (composer) for authoring LaTeX with live preview, mode toggle (inline vs block), and safe insertion into the TipTap editor. Ensure deterministic insertion point by temporarily locking the originating cell.

---
## Phase 0: Baseline & Cleanup
1. Remove existing inline/block math buttons from `TextCellToolbar.vue`; add one unified “Insert Math” button.
2. Confirm `@tiptap/extension-mathematics` is loaded only once; remove stray prompt-based handlers.
3. (Optional) Add feature flag: `enableMathComposer`.
**Deliverable:** Simplified toolbar; no regression for link/table features.

---
## Phase 1: State & Store (`mathComposerStore` / Pinia)
**State**
- `isOpen: boolean`
- `mode: 'inline' | 'block'`
- `latex: string`
- `targetCellId: string | null`
- `selectionSnapshot: { from: number; to: number } | null`
- `targetWasEditable: boolean | null`
- `error: string | null`
- `openedAt: number`

**Actions**
- `open({ cellId, selection, initialLatex?, mode? })`
- `close({ restore?: boolean })`
- `setMode(mode)`
- `setLatex(value)`
- `setError(error | null)`
- `markInserted()`

**Getters**
- `isBlockMode`
- `canInsert` (non-empty latex & no hard error)

**Deliverable:** Store verified via console or basic tests.

---
## Phase 2: Temporary Cell Lock Mechanism
**Purpose:** Freeze insertion context during composition.

**Approach:**
- Transient map: `overlayLocks: Record<cellId, true>`.
- In `TextCell.vue`: `isCellLocked = originalLocks || overlayLock(cellId)`.
- On `open`: set overlay lock if editor editable; record `targetWasEditable`.
- On `close({ restore: true })`: remove overlay lock only if previously editable.

**Edge Handling:**
- Already locked cell: open read-only; disable Insert (tooltip: “Cell locked”).
- Cell destroyed: auto `close({ restore: false })`.

**Deliverable:** Opening dims & blocks edits; closing restores prior state.

---
## Phase 3: Overlay Shell (UI Skeleton)
Component: `MathComposerOverlay.vue`

**Mount:** Global (root portal).

**Structure:**
- Scrim (click → cancel)
- Sliding panel (≈60% width, ≈40% height; responsive)
- Header: Title + mode toggle group
- Body: Two-column (stack on small screens)
  - Left: `<textarea>` (monospace)
  - Right: Preview placeholder
- Footer: Insert (primary), Cancel (secondary)

**Accessibility:**
- `role="dialog"` + `aria-modal="true"`
- Focus trap; ESC = cancel
- Focus returned to invoking toolbar button

**Animation:** `translateY(100%) → 0` (respect `prefers-reduced-motion`).

**Deliverable:** Opens/closes cleanly (no preview yet).

---
## Phase 4: Mode Toggle & UX Behaviors
**Toggle:** Segmented control (Inline | Block).

**Default Mode Heuristic:**
- Inline if caret inside text node.
- Block if selection at start of empty paragraph or end of doc.

**Switch Behavior:**
- If `latex` empty & switching to block: (optional) prefill template (defer to Phase 7).
- Preserve entered latex when switching.

**Deliverable:** Mode visually & logically in sync.

---
## Phase 5: Live Preview Engine
**Rendering:** Debounce (≈120–150 ms) → `katex.render(latex, el, { throwOnError: false, displayMode: mode==='block' })`.

**Error Surface:**
- Show warning if KaTeX recoverable error.
- Optionally still allow Insert.

**Performance:** Spinner if render exceeds one frame (optional).

**Deliverable:** Accurate inline vs block rendering.

---
## Phase 6: Insertion Logic
**Inline Path:**
1. Restore selection snapshot (if valid).
2. `editor.chain().focus().insertInlineMath({ latex: trimmed }).run()`.
3. (Optional) Select node vs move caret after.

**Block Path:**
1. Collapse selection.
2. If not at block boundary, optionally insert paragraph break.
3. `editor.chain().focus().insertBlockMath({ latex: trimmed }).run()`.
4. Select node.

**Post-Insert:**
- Close composer & restore lock.
- Optionally persist `lastInserted`.

**Deliverable:** Deterministic insertion point.

---
## Phase 7: Optional Polish
- Templates palette (chips / dropdown)
  - Inline: `\frac{a}{b}`, `\sqrt{x}`, `e^{i\pi}+1=0`
  - Block: `\begin{align*}…\end{align*}`, matrix, cases
- History recall (↑ / ↓ in empty input)
- Strip leading `$` / `$$` delimiters on paste
- Macro helper panel
- "Insert & Keep Open" checkbox

**Deliverable:** Enhanced authoring ergonomics.

---
## Phase 8: Edit Existing Math Node
**Trigger:** `Mathematics.configure({ onClick … })` dispatches `{ pos, latex, mode }`.

**Behavior:**
- If closed: open prefilled; label = "Update".
- Use `updateInlineMath` / `updateBlockMath`.
- Clicking same node while open toggles close.

**Deliverable:** Seamless edit path.

---
## Phase 9: Robustness & QA Checklist
- Locked vs unlocked cell
- Block insertion: start / middle / end of doc
- Inline replacing selection
- ESC closes & restores
- Changing active cell auto-closes
- Dark mode contrast
- Large LaTeX (≥5 align lines) performance
- KaTeX error handling
- No duplicate mathematics extension warning

**Deliverable:** Green checklist.

---
## Phase 10: Documentation & Dev Notes
Update README / dev notes with:
- Usage steps
- Keyboard shortcuts
- Limitations (e.g., no collaborative concurrency override yet)
- Extensibility roadmap

---
## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Selection snapshot invalidated | Wrong insertion point | Lock source cell (chosen) |
| Large KaTeX input lag | Typing feels sluggish | Debounce; consider idle rendering |
| Need to copy from locked cell | Minor friction | Add temporary unlock later |
| Multi-editor confusion | Wrong cell insertion | Show target cell id / auto-close on switch |

---
## Minimal Success Criteria (MVP)
- Single Insert Math button opens overlay
- Toggle inline/block
- Type LaTeX & see preview
- Insert places math correctly
- Cancel/ESC restores state
- No runtime errors / editability loss

---
## Stretch Goals
- Macro management UI
- Live inline error highlighting
- Syntax highlighting (Monaco mini input)
- Multi-node batch creation (split on blank line)

---
## Task Matrix (Condensed)
1. Toolbar change
2. Store
3. Lock mechanism
4. Overlay shell
5. Mode toggle UI
6. Preview (KaTeX) + debounce
7. Insert logic (inline/block)
8. Templates / history polish
9. Edit existing node integration
10. QA & docs

---
## Future Enhancements (Parking Lot)
- Recent formulas quick access panel
- Collaborative conflict strategies
- Macro library import/export
- Accessibility: screen-reader friendly rendered math (ARIA annotations)

---
## Notes
Keep initial passes minimal: ship MVP (Phases 0–6) before polish to reduce iteration churn.