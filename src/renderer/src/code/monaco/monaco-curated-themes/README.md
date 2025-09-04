Monaco Curated Themes

Place JSON theme files here. These are standard Monaco theme JSON definitions.

Recommendations
- Copy a small set you want to ship (not all) from node_modules/monaco-themes/themes
- Keep filenames descriptive (e.g., "github-dark.json", "solarized-light.json")
- The theme id used in the app is derived from the filename (kebab-cased, without .json)

Sync script
- Use `npm run themes:sync` to copy/update selected themes from node_modules into this folder
- Edit scripts/sync-monaco-themes.mjs to adjust which themes are included
