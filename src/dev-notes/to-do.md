# To‑do

## Cell Container
- Allow deselecting a cell by clicking the cell margin (outside the cell content).

## Notebook & Bin UX

- Do not auto-switch focus from the Notebooks panel to the Bin when moving items to Bin.
	- After moving a notebook to Bin: stay in Notebooks view and select the next/previous notebook.
	- After moving a cell to Bin: stay in Notebooks view and maintain a sensible cell selection (next/none).

## Menu bar tidy‑up
- Move “Cell → Bin” and “Notebook → Bin” actions from the Notebooks side panel into the Edit menu to reduce accidental clicks.
	- For now, comment out the side‑panel buttons (keep code paths intact) in case we choose to re‑enable them later.

## Operations behavior
- Restoring a cell should keep it in place (was previously append); confirm final rule and update tests/notes.
- Restored notebooks should be appended to the end of the notebook order.

## Extras
- Add a “Hide cell” command in the menu bar.
- Add a “Lock cell” command in the menu bar.