# Coding Practices for the Luna Project

> 📌
>**Readability above all.** Code is read more often than it is written.  
>Consistency and clarity make the project easier to maintain and extend.



## Function Style Guidelines

- **Use regular functions for complex logic**  
  Easier to debug, test, and understand.

- **Use arrow functions only for:**
  - Simple one-liners (e.g., `items.map(item => item.id)`)
  - Callbacks where context preservation is needed

- **Avoid arrow functions** for anything beyond a single one-line expression.  
  Use regular functions instead.

- **Avoid deeply nested arrow functions** – prefer named functions or extract logic into helpers.

- **Prefer explicit returns** in multi-line functions for clarity.

---

## Code Clarity

- Break long one-liners into multiple lines.
- Use descriptive variable names instead of abbreviations.
- Add comments for *business logic*, not for the obvious.
- Keep functions small and focused (one responsibility each).
- Use early returns to reduce nesting and improve readability.

---

## Modular Architecture

**Follow the UNIX philosophy** – write small, focused pieces that do one thing well, and compose them together.

- Organize logic into dedicated files and folders.
- Build utility functions that are small and composable.
- Compose functionality by combining imported utilities instead of writing everything inline.

**Benefits:**
- **Readability:** each file has a clear, single purpose  
- **Scalability:** easier to extend or modify parts of the system  
- **Testability:** small units are easier to test  
- **Reusability:** shared utilities can be used across the application

**Example:**  
Avoid placing all logic in a single file. Extract validation, formatting, permissions, and preferences into dedicated utilities, then compose them in composables and keep components focused on UI.

---

## Type Organization

**Centralize all TypeScript type definitions.**

- Do not define types inline in components or utilities.
- Place all types under `src/renderer/src/types/`.
- Group related types in files such as `user-types.ts` or `theme-types.ts`.
- Use descriptive file names that clearly indicate domain.
- Import types explicitly using `import type` for better tree-shaking.

---

## Naming Conventions

To ensure consistency and readability, follow these rules:

### General
- Always use **English** for naming.
- Use **descriptive, full words**, not abbreviations.  
  - ✅ `element`  
  - ❌ `e`  
- Avoid abbreviations unless they are universal (e.g., API, URL).

### Specific Luna Conventions for main building blocks
- **menubar** (not `menuBar` or `menu-bar`)
- **toolbar** (not `toolBar` or `tool-bar`)
- **statusbar** (not `statusBar` or `status-bar`)
- **workspace** (not `workSpace` or `work-space`)
- **sidepanel** (not `sidePanel` or `side-panel`)
- **button** (not `btn`)
- **error** (not `err`)
- and so on. The goal is consistent naming across all files and avoid abbreviations.

### Folders
- Use **kebab-case** for folder names.  
  - ✅ `this-is-my-folder`  
  - ❌ `this_is_my_folder` (snake_case)  
  - ❌ `thisIsMyFolder` (camelCase or PascalCase)  
  - ❌ `thisismyfolder` (unreadable)

---

## File, Variable, and Component Naming

### Vue Components
- **PascalCase** for component file names and component names.  
  Example: `UserProfile.vue`, `ThemeSwitcher.vue`

### CSS
- **Files:** kebab-case → `base.css`, `theme-dark.css`  
- **Classes:** kebab-case → `.main-header`, `.theme-dark`

### Variables
- **camelCase** → `userName`, `themeColors`

### Functions and Methods
- **camelCase** → `getUserProfile()`, `setDarkTheme()`

### Pinia Stores
- Store files: **camelCase** + `Store` suffix → `themeStore.ts`, `userStore.ts`  
- Store names (in `defineStore`): lowercase single word → `defineStore('theme', {...})`

### Constants
- **UPPER_SNAKE_CASE** → `DEFAULT_THEME`, `API_URL`

---

## TypeScript Conventions

### File Names
- **kebab-case**

### Classes
- **PascalCase** → `ThemeManager`, `UserService`

### Types & Interfaces
- **PascalCase** → `UserProfile`, `ThemeColors`  
- Prefix interfaces with `I` only if it adds clarity (optional): `IUserProfile`

### Enums
- Enum names: **PascalCase**  
- Enum members: **UPPER_SNAKE_CASE**  

```ts
enum ThemeMode {
  LIGHT,
  DARK
}
```

## Generics

- Use a **single uppercase letter** (`T`, `U`, `V`)

**Example:**
```ts
function identity<T>(value: T): T {
  return value;
}
```
