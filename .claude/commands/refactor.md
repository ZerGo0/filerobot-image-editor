# Refactor Analysis

I need to refactor the following files to improve maintainability in Filerobot Image Editor:

# User Input

$ARGUMENTS

## Task Description

Please analyze the provided files and apply these refactoring improvements:

1. **Code Organization**

   - Extract repeated code into reusable utilities or custom hooks
   - Split large React components into smaller, focused units
   - Group related functionality together
   - Remove dead code and unused imports
   - Organize Konva.js canvas operations into logical modules

2. **Type Safety & Consistency**

   - Add missing TypeScript types and interfaces
   - Replace `any` types with proper type definitions
   - Ensure consistent naming conventions across packages
   - Update TypeScript definitions in index.d.ts as needed
   - Use proper React patterns (hooks, Context API)

3. **Performance & Best Practices**

   - Optimize React re-renders with proper memoization
   - Improve Context usage to prevent unnecessary updates
   - Follow Konva.js performance best practices
   - Follow the project's established patterns (as defined in CLAUDE.md)
   - Improve error handling and edge cases
   - Optimize styled-components usage

4. **Code Quality**

   - Improve variable and function names for clarity
   - Add JSDoc comments for complex functions
   - Simplify complex conditionals
   - Remove code duplication
   - Ensure proper module imports (from 'src' root)

5. **Project-Specific Rules**
   - Ensure all changes follow CLAUDE.md guidelines
   - Run `yarn fix` after changes (prettier-eslint)
   - Test changes with `yarn dev`
   - Verify builds with `yarn build:packages`
   - Maintain consistency with existing codebase patterns
   - Update all required files if adding properties (README.md, index.d.ts, defaultConfig.js, demo-config.js)

After refactoring, provide a brief summary of the improvements made and any remaining issues that might need attention.
