# Refactor Analysis based on git diff HEAD

Analyze the current git diff and identify refactoring opportunities to improve code maintainability, readability, and adherence to Filerobot Image Editor project standards.

## Instructions

1. First, run `git diff HEAD` to see the current changes
2. Analyze the diff for:

   - Code duplication that could be extracted into shared utilities
   - Complex logic that could be simplified or broken down
   - Inconsistent patterns compared to the rest of the codebase
   - Missing TypeScript types or improper type definitions
   - Opportunities to use existing components or hooks
   - Adherence to project conventions (see CLAUDE.md)
   - Proper use of React patterns and Context API
   - Konva.js best practices for canvas operations

3. For each refactoring opportunity found:

   - Explain what could be improved
   - Show the current problematic code
   - Propose the refactored solution
   - Explain why this improves maintainability

4. Prioritize refactorings by:

   - Impact on code quality
   - Risk of introducing bugs
   - Effort required

5. If specific arguments are provided: $ARGUMENTS
   Focus the analysis on those specific aspects.

## Output Format

Provide a structured analysis with:

- Summary of changes in the diff
- List of refactoring opportunities (ordered by priority)
- Detailed recommendations for each opportunity
- Code examples showing before/after

Remember to:

- Check for proper React hooks usage
- Verify TypeScript definitions match implementation
- Look for opportunities to use existing utilities from packages/react-filerobot-image-editor/src/utils/
- Ensure styled-components follow project patterns
- Consider module resolution and import paths
- Check if new properties need to be added to all required files (README.md, index.d.ts, defaultConfig.js, demo-config.js)
