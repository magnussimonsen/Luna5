<!-- CSS container overview (concise) -->

1. `app-layout`
  1.1 `menubarRef` — header, non-growing
  1.2 `toolbarRef` — header, non-growing
  1.3 Workspace
    - `workspace-web-layout-container` — flexible middle: `flex: 1`, `min-height: 0`, `position: relative`
    - `workspace-a4-preview-layout-container` (Not used yet)
  1.4 `Sidepanel` — sibling; constrain width; avoid changing vertical flex sizing
  1.5 Global modals (e.g., `AboutLunaModal`) — use `position: fixed`/`absolute` (out of flow)
  1.6 `statusbar-container` — `flex: 0 0 auto`, `width: 100%` (fixed strip at bottom)

## Classes overview (critical properties only)

- `#app-layout`: `display: flex; flex-direction: column; height: 100vh` (provides height context)
- `.web--workspace-layout`: `display: flex; flex: 1 1 auto; position: relative; min-height: 0`
- `.statusbar-container`: `flex: 0 0 auto; width: 100%`
- `workspace-a4-preview-layout-container` (inline): `display: flex; justify-content: center; align-items: center` (add `flex:1` if it must fill)
- Scrollable content (e.g., `CellList`): `overflow: auto` on the inner scroll container; parent must be the constrained flex child

## Tiny checklist to avoid scrolling bugs

- Root: `#app-layout` = column flex + `height: 100vh`
- Workspace: ensure `flex: 1` and `min-height: 0`
- Scrolling: `overflow: auto` on inner content, not on the root flex parent
- Headers/statusbar: keep `flex: 0` (non-growing)
