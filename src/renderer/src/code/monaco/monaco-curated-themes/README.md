Monaco curated themes (development vs production)

Overview
- This folder is the root for our curated Monaco theme sets.
- In development, use the script scripts/sync-monaco-themes.mjs to copy ALL themes from node_modules, auto-splitting them into the two runtime folders below based on their `base`:
	- monaco-curated-light-themes (base: vs, hc-light)
	- monaco-curated-dark-themes (base: vs-dark, hc-black)
- In production, commit only a small, well-chosen subset to keep the bundle size lean and stable.

Runtime folders
- monaco-curated-light-themes: JSON files for light themes.
- monaco-curated-dark-themes: JSON files for dark themes.

Naming and IDs
- Theme file names can contain spaces and punctuation; the runtime code converts filenames to a safe theme id using:
	- lowercasing
	- replacing non-alphanumerics with `-`
	- collapsing repeats and trimming edges
- Example: "GitHub Dark (Default).json" -> "github-dark-default"

How the app loads themes
- src/renderer/src/code/monaco/monaco-theme.ts eagerly imports all JSON files in both folders and defines them in Monaco on first use.
- Built-in Monaco themes (vs, vs-dark, hc-black) are always available and included in the theme selectors.

Development workflow
1) npm run themes:sync (copies all themes from monaco-themes to the split folders).
2) Choose and commit a minimal set when preparing a production build.
3) If you add a new JSON manually, place it in the correct light/dark folder; it will be discovered automatically.

Best practices
- Keep only popular, high-quality themes for production.
- Avoid editing upstream theme JSONs; prefer PRs to the original repository or keep local changes minimal and documented.
- If a theme JSON lacks a known base, the sync script will skip it; you can still add it manually but ensure its base matches the folder you put it in.

