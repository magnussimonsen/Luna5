## Coding Practices for the Luna project

**Readability above all** - code is read more often than it is written.

### Function Style Guidelines
- **Use regular functions for complex logic** - easier to debug and understand
- **Use arrow functions only for:**
  - Simple one-line operations (e.g., `items.map(item => item.id)`)
  - Callback functions where context preservation is needed
- **Avoid nested arrow functions** - use named functions or extract logic instead
- **Prefer explicit returns** over implicit returns for multi-line functions

### Code Clarity
- **Break complex one-liners into multiple lines** for better readability
- **Use descriptive variable names** instead of abbreviations
- **Add comments for business logic**, not obvious code
- **Keep functions small and focused** - one responsibility per function
- **Use early returns** to reduce nesting levels

### Modular Architecture

**Follow the UNIX Philosophy** - write programs that do one thing and do it well, and work together.

- **Separate logic into dedicated files and folders** for better organization
- **Create small, focused utility functions** that can be composed together
- **Use function composition** - output of one function becomes input to another
- **Import and combine functions** in main files rather than writing everything inline
- **Benefits:**
  - **Readability**: Each file has a clear, single purpose
  - **Scalability**: Easy to extend and modify individual components
  - **Testability**: Small functions are easier to unit test
  - **Reusability**: Utility functions can be used across the application

### Type Organization

**Centralize type definitions** - keep all TypeScript types in dedicated files.

- **Avoid defining types inline** in component or utility files
- **Create dedicated type files** in the `src/renderer/src/types/` folder
- **Group related types** in the same file (e.g., `user-types.ts`, `theme-types.ts`)
- **Use descriptive file names** that clearly indicate the domain
- **Import types explicitly** using `import type` for better tree-shaking

**❌ Avoid - Inline type definitions:**
```typescript
// UserProfile.vue - types mixed with component logic
interface User {
  id: string
  name: string
  email: string
}

interface UserPermissions {
  canEdit: boolean
  canDelete: boolean
}

export default defineComponent({
  // component logic
})
```

**✅ Prefer - Centralized type definitions:**
```typescript
// types/user-types.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface UserPermissions {
  canEdit: boolean
  canDelete: boolean
}

export type UserWithPermissions = User & UserPermissions

// UserProfile.vue - clean imports
import type { User, UserPermissions } from '@renderer/types/user-types'

export default defineComponent({
  // component logic focused on functionality
})
```

### Architecture Example

**❌ Avoid - Everything in one file:**
```javascript
// UserProfile.vue - bloated component
export default {
  setup() {
    const processUserData = (rawUser) => {
      const validated = validateUserData(rawUser)
      const formatted = formatUserDisplay(validated)
      const permissions = calculatePermissions(formatted)
      return addDisplayPreferences(permissions)
    }
    
    const validateUserData = (user) => { /* validation logic */ }
    const formatUserDisplay = (user) => { /* formatting logic */ }
    // ... more functions mixed with component logic
  }
}
```

**✅ Prefer - Modular approach:**
```javascript
// utils/user-validation.ts
export const validateUserData = (user) => { /* validation logic */ }

// utils/user-formatting.ts  
export const formatUserDisplay = (user) => { /* formatting logic */ }

// utils/user-permissions.ts
export const calculatePermissions = (user) => { /* permission logic */ }

// utils/user-preferences.ts
export const addDisplayPreferences = (user) => { /* preference logic */ }

// composables/user-processing.ts
import { validateUserData } from '@renderer/utils/user-validation'
import { formatUserDisplay } from '@renderer/utils/user-formatting'
import { calculatePermissions } from '@renderer/utils/user-permissions'
import { addDisplayPreferences } from '@renderer/utils/user-preferences'

export const useUserProcessing = () => {
  const processUserData = (rawUser) => {
    return rawUser
      |> validateUserData
      |> formatUserDisplay  
      |> calculatePermissions
      |> addDisplayPreferences
  }
  
  return { processUserData }
}

// UserProfile.vue - clean component
import { useUserProcessing } from '@renderer/composables/user-processing'

export default {
  setup() {
    const { processUserData } = useUserProcessing()
    // Focus only on component-specific logic
  }
}
```

### Examples

**❌ Avoid:**
```javascript
const result = users.filter(u => u.active).map(u => ({...u, name: u.firstName + ' ' + u.lastName})).sort((a, b) => a.name.localeCompare(b.name))
```

**✅ Prefer:**
```javascript
const activeUsers = users.filter(user => user.active)
const usersWithFullName = activeUsers.map(user => ({
  ...user,
  name: `${user.firstName} ${user.lastName}`
}))
const sortedUsers = usersWithFullName.sort((a, b) => a.name.localeCompare(b.name))
```

## Naming Conventions

To keep the codebase consistent and readable, follow these naming conventions:

### Vue Components
- **PascalCase** for component file names and component names.
  - Example: `UserProfile.vue`, `ThemeSwitcher.vue`

### CSS Files
- **kebab-case** for CSS file names.
  - Example: `base.css`, `theme-dark.css`

### Classes (CSS)
- **kebab-case** for CSS class names.
  - Example: `.main-header`, `.theme-dark`

### Folders
- **kebab-case** for folder names.
  - Example: `components`, `assets`, `stores`, `utils`

### Variables
- **camelCase** for variable names.
  - Example: `userName`, `themeColors`

### Functions and Methods
- **camelCase** for function and method names.
  - Example: `getUserProfile()`, `setDarkTheme()`

### Pinia Stores
- Store files: **camelCase** with `Store` suffix.
  - Example: `themeStore.ts`, `userStore.ts`
- Store names (in `defineStore`): **single word, lowercase**.
  - Example: `defineStore('theme', {...})`

### Constants
- **UPPER_SNAKE_CASE** for constants.
  - Example: `DEFAULT_THEME`, `API_URL`

### TypeScript

#### File names
- **kebab-case** for file names

#### Classes
- **PascalCase** for class names.
  - Example: `ThemeManager`, `UserService`

#### Types & Interfaces
- **PascalCase** for type and interface names.
  - Example: `UserProfile`, `ThemeColors`
- Prefix interfaces with `I` only if it clarifies intent (optional).
  - Example: `IUserProfile` (optional)

#### Enums
- **PascalCase** for enum names, **UPPER_SNAKE_CASE** for enum members.
  - Example:
    ```typescript
    enum ThemeMode {
      LIGHT,
      DARK
    }
    ```

#### Generics
- **Single uppercase letter** (commonly `T`, `U`, `V`).
  - Example: `function identity<T>(value: T): T`

### Other Rules
- Avoid abbreviations unless they are well-known (e.g., `API`, `URL`).
- Be descriptive and consistent.
- Use English for all names.

---

**Example Structure:**
```
src/
  components/
    UserProfile.vue
    ThemeSwitcher.vue
  assets/
    css/
      base.css
      theme-dark.css
  stores/
    themeStore.ts
  utils/
    colorUtils.ts
  types/
    themeTypes.ts
```