# CSS Container Overview (critical flex/overflow only)

> Scope: vertical layout, flex sizing, scroll boundaries. Colors/borders omitted. Source: **App.vue** (+ notebook containers).

---

## 1) App Shell (App.vue)

* **`#app-layout`**
  `display:flex; flex-direction:column; height:100vh; width:100vw;`

  * Children (top→bottom): `menubarRef`, `toolbarRef`, **Workspace** (one of: `workspace-web-layout-container` | `workspace-a4-preview-layout-container`), `Sidepanel` (sibling), `statusbarRef`.

* **`menubarRef`** (wraps `<Menubar />`)
  *non-growing header* (height measured)

* **`toolbarRef`** (wraps `<Toolbar />`)
  *non-growing header* (height measured)

* **Chrome height variables**
  `--top-chrome-height = menubar + toolbar` (via ResizeObserver)
  `--bottom-chrome-height = statusbar` (via ResizeObserver)

* **`statusbar-container`**
  `flex:0 0 auto; width:100%;`  *(fixed bottom strip)*

* **Workspace (web mode)**
  **`.workspace-web-layout-container`**: `display:flex; position:relative; flex:1 1 auto; width:100%; overflow-y:auto; z-index:var(--workspace-web-layout-container-z-index,1000);`
  **Role:** parent that holds the cell list and sidepanel; establishes containing block for sidepanel overlays.
  **Implication:** this becomes a **scroll container**. If the cell list (`.cell-containers-list`) also has `overflow-y:auto`, choose **one** to be the vertical scroller to avoid nested scroll contexts.

* **Sidepanel**
  *Sibling of workspace*. Should not affect vertical flex sizing; typically `position:absolute/fixed` or own column with `flex:0 0 <width>`.

---

## 2) Workspace → Notebook (scroll column)

* **`.cell-containers-list`** *(vertical scroller for cells)*
  `position:relative; display:flex; flex-direction:column; flex:1 1 auto; min-height:0; max-height:100%; overflow-y:auto; gap:0; padding-right:0.5em; margin:1em; width:100%;`

* **`.cell-container`** *(one row per cell)*
  `position:relative; display:flex; width:100%;`

* **`.cell-margin`** *(gutter/index area)*
  `flex:0 0 1em; display:flex; flex-direction:column; align-items:center;`

* **`.cell-body`** *(cell main column)*
  `position:relative; display:flex; flex-direction:column; min-height:0; min-width:0; width:100%;`

* **`.cell-content`** *(content container)*
  `position:relative; display:block; overflow:hidden;`

* **`.python-cell-wrapper`** *(python cell content wrapper)*
  `display:absolute; flex-direction:column; min-height:0; width:100%;`

* **`.python-editor`** *(Monaco mount)*
  `display:block; min-height:0; height:50%;`

---

## 3) Critical Invariants (for caret visibility)

1. Exactly **one vertical scroller** in the column: either Monaco (Model A) **or** `.cell-containers-list` (Model B).
2. Every flex ancestor of the scroller and of `.python-editor` has `min-height:0`.
3. Do **not** set `overflow:auto/scroll` on `.python-cell-wrapper` or `.cell-container`.
4. If using **Model B**, keep caret-follow JS tied to `.cell-containers-list` and call `editor.getScrolledVisiblePosition(...)` to nudge `scrollTop`.

---

## 4) Known/To‑Verify

* **Class name mismatch:** `.web--workspace-layout` vs `.workspace-web-layout-container`. Align names or duplicate critical rules under the used class.
* Ensure `workspace-web-layout-container` (or its parent column) has `flex:1 1 auto; min-height:0;` so the list can scroll.
* Sidepanel positioning: confirm it does not create an extra vertical scroll context.

---

## 5) Minimal Monaco Options (both models)

```ts
editor.updateOptions({
  smoothScrolling: true,
  cursorSurroundingLines: 3,
  cursorSurroundingLinesStyle: 'all',
});
```

* **Model A only:** no caret-follow JS needed.
* **Model B:** add caret-follow bound to `.cell-containers-list`.
