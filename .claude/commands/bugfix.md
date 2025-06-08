# Bug Fix Investigation

I need to investigate and fix a bug in the Filerobot Image Editor

## User Input

$ARGUMENTS

## Systematic Bug Investigation

1. **Reproduce the Issue**

   - Understand the exact steps to reproduce
   - Identify the expected vs actual behavior
   - Note any error messages or console output
   - Check browser developer tools for errors

2. **Locate the Problem**

   - Search for error messages in the codebase
   - Identify which package/component is affected:
     - `packages/react-filerobot-image-editor/` - React component
     - `packages/filerobot-image-editor/` - Vanilla JS wrapper
   - Check recent commits that might have introduced the issue
   - Review Konva.js canvas operations if visual issues

3. **Root Cause Analysis**

   - Trace through the code execution path
   - Check for:
     - React Context/state management issues
     - Konva.js canvas rendering problems
     - Tool configuration errors
     - Styled-components styling conflicts
     - Module resolution issues (check babel.config.json)
     - TypeScript type mismatches

4. **Implement the Fix**

   - Make minimal changes to fix the issue
   - Follow existing code patterns
   - Update relevant files if adding properties:
     - TypeScript definitions (index.d.ts)
     - Default config (defaultConfig.js)
     - Documentation (README.md)
     - Demo config (public/demo-config.js)

5. **Verification Steps**
   - Test the fix with the original reproduction steps
   - Check for side effects in related features
   - Run code formatting and linting:
     - `yarn fix` - Run prettier-eslint
   - Test in development server:
     - `yarn dev` - Start Vite dev server
   - Verify no new errors in browser console
   - Build packages to ensure no build errors:
     - `yarn build:packages`

## Common Bug Categories

- Canvas rendering issues (Konva.js operations)
- Tool functionality problems (crop, rotate, filter, text, etc.)
- State management/React Context issues
- Styling conflicts (styled-components)
- Build/bundling problems (Vite, Babel, Rollup)
- Module resolution errors
- Browser compatibility issues
