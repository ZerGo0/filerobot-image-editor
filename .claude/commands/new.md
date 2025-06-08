# New Development Task

I need to implement a new feature or enhancement for Filerobot Image Editor

## User Input

$ARGUMENTS

## Task Planning

1. **Understand the Requirements**

   - Analyze what needs to be built
   - Identify affected packages:
     - `packages/react-filerobot-image-editor/` - React component library
     - `packages/filerobot-image-editor/` - Vanilla JS wrapper
   - Check existing tools/features for patterns to follow
   - Determine if this affects canvas operations (Konva.js)

2. **Search and Discovery**

   - Search for relevant existing code patterns
   - Review similar tool implementations (crop, rotate, filter, text, etc.)
   - Check CLAUDE.md for specific guidelines
   - Look for existing utilities in src/utils/
   - Review hooks in src/hooks/
   - Check Context patterns in src/context/

3. **Implementation Plan**

   - Break down the task into smaller steps
   - Identify files that need to be created or modified
   - Plan the implementation order
   - If adding new properties, update all required files:
     - README.md - Documentation
     - packages/react-filerobot-image-editor/src/index.d.ts - TypeScript definitions
     - packages/react-filerobot-image-editor/src/context/defaultConfig.js - Default configuration
     - public/demo-config.js - Demo configuration example

4. **Development Workflow**

   - Follow the architecture patterns in CLAUDE.md
   - Use React Context API with useReducer pattern
   - Implement with styled-components for styling
   - Follow module resolution setup (imports from 'src' root)
   - Run formatting after changes:
     - `yarn fix` - Run prettier-eslint
   - Test in development:
     - `yarn dev` - Start Vite dev server
   - Build packages:
     - `yarn build:packages` - Build all packages

5. **Verification**
   - Test the feature manually in the dev server
   - Ensure all formatting passes (`yarn fix`)
   - Check for any console errors or warnings
   - Verify feature works in both React and vanilla JS versions
   - Test with different configurations via demo-config.js

## Key Reminders

- Use React hooks and Context API patterns
- Follow Konva.js best practices for canvas operations
- Use styled-components for component styling
- Maintain pluggable tool architecture
- No test framework configured - manual testing only
- Follow ESLint with Airbnb configuration
