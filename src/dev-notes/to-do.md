# To-do

## Cell Container
- Allow deselecting a cell by clicking the cell margin (outside the cell content).

## Notebook Management
- In the Bin panel, mirror the notebook list structure but render only deleted cells.
- Ensure deleted notebooks appear at the bottom of the notebook list.
- Persist and restore the last selected cell for each notebook when switching between notebooks (currently implemented but not working).
- For the side panel’s Notebooks and Bin toggle buttons, disable the hover background color when the button is selected; show a hover background only when it’s not selected.
- In the Bin, provide separate restore actions: (1) restore the entire notebook; (2) restore only the selected cell within a deleted notebook. Decide on the UI for these controls. One option is to use two rows of controls in the Notebooks side panel:
		- When the Bin is selected, the second row shows: “Restore cell,” “Restore notebook,” “Delete cell,” and “Delete notebook.”
		- When Notebooks is selected, the second row shows: “New,” “Move selected cell to the Bin,” and “Move notebook to the Bin.”
- Implement restore actions for deleted cells and deleted notebooks. For simplicity and consistency, restored cells should be appended to the end of the cell order in the selected notebook, and restored notebooks should be appended to the end of the notebook order.
- Implement a “Hide cell” button in the menu bar.
- Implement a “Lock cell” button in the menu bar.