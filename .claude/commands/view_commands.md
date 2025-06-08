# Available Project Commands for Filerobot Image Editor

## Task Management Commands

### `/project:new [description]`
**Purpose:** Create a new development task with proper planning and implementation  
**File:** new.md  
**Description:** Guides implementation of new features for Filerobot Image Editor with a 5-phase workflow:
1. Understanding requirements (React component vs vanilla JS wrapper)
2. Search and discovery (existing tools, utilities, hooks)
3. Implementation planning (including required file updates)
4. Development workflow (yarn dev, yarn fix, yarn build:packages)
5. Verification (manual testing, formatting checks)

### `/project:bugfix [bug description]`
**Purpose:** Investigate and fix a bug systematically in the image editor  
**File:** bugfix.md  
**Description:** Provides systematic bug investigation through:
1. Reproduce the issue (browser dev tools, console errors)
2. Locate the problem (which package, Konva.js issues)
3. Root cause analysis (React Context, canvas rendering, styling)
4. Implement the fix (update TypeScript defs, config files)
5. Verification steps (yarn fix, yarn dev, yarn build:packages)

### `/project:refactor [file paths]`
**Purpose:** Refactor provided files to improve code maintainability and quality  
**File:** refactor.md  
**Description:** Analyzes files for refactoring opportunities across 5 categories:
1. Code organization (utilities, hooks, Konva.js modules)
2. Type safety & consistency (TypeScript, React patterns)
3. Performance & best practices (memoization, Context optimization)
4. Code quality (JSDoc, module imports from 'src')
5. Project-specific rules (yarn fix, update all config files)

### `/project:gitrefactor [optional focus areas]`
**Purpose:** Analyze git diff to HEAD and identify refactoring opportunities  
**File:** gitrefactor.md  
**Description:** Examines current git diff to identify refactoring opportunities specific to Filerobot:
- React hooks and Context API usage
- Konva.js canvas operation patterns
- TypeScript definition consistency
- Styled-components patterns
- Module resolution and imports

### `/project:update_view_commands`
**Purpose:** Analyze all commands and update this view_commands.md file  
**File:** update_view_commands.md  
**Description:** Scans all command files in .claude/commands/ and updates this reference documentation to accurately reflect available commands for Filerobot Image Editor development.

## Usage Examples

```bash
# Create a new image editing tool
/project:new Add magic wand selection tool to the editor

# Fix a canvas rendering bug
/project:bugfix Canvas doesn't update when applying blur filter - Konva layer not refreshing

# Refactor React components
/project:refactor packages/react-filerobot-image-editor/src/components/tools/Text.js packages/react-filerobot-image-editor/src/hooks/useCanvas.js

# Analyze current git changes for refactoring opportunities
/project:gitrefactor

# Focus git refactoring on specific aspects
/project:gitrefactor Focus on React Context optimization and Konva.js performance

# Update this command reference
/project:update_view_commands
```

## Command Structure

All commands follow the pattern: `/project:command_name [arguments]`

The `$ARGUMENTS` variable in command templates will be replaced with everything after the command name.

## Key Features

- **Monorepo Aware:** Commands understand the Lerna/Yarn workspace structure
- **Tool Integration:** Built-in support for yarn dev, yarn fix, yarn build:packages
- **React & Vanilla JS:** Supports both package variants of the image editor
- **Canvas Operations:** Konva.js best practices and performance considerations
- **Configuration Sync:** Ensures updates to all required config files (README.md, index.d.ts, defaultConfig.js, demo-config.js)
