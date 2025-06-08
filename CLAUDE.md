# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Filerobot Image Editor is a JavaScript library for in-browser image editing, built as a monorepo using Lerna. It provides both a React component and a vanilla JavaScript wrapper.

## Rules

- **_NEVER_** try to run `yarn dev`

## Common Development Commands

### Initial Setup

- `yarn` - Install all dependencies (uses Yarn workspaces)

### Build Commands

- `yarn build:packages` - Build all packages using Lerna
- `yarn build:js-bundle` - Build production JS bundle with Vite
- `yarn dev` - Start Vite dev server for local development
- `yarn dev:force-prebundle-deps` - Start Vite with forced prebundling

### Testing and Quality

- `yarn fix` - Run prettier-eslint on source files to fix formatting
- No test framework configured - consider implementing tests when requested

### Release and Publishing

**IMPORTANT**: Always publish both packages together (`@zergo0/react-filerobot-image-editor` and `@zergo0/filerobot-image-editor`) to keep them in sync. The vanilla JS package depends on the React package.

- `yarn release:beta` - Release beta version (builds packages, publishes to npm with beta tag, publishes JS bundle)
- `yarn release:prod` - Release production version (publishes packages, JS bundle, and GitHub Pages)
- `yarn publish:packages` - Build and publish packages to npm
- `yarn publish:js-bundle` - Build and deploy JS bundle to Filerobot

#### Publishing Process

1. Make sure both packages have the same version number in their `package.json` files
2. Use `yarn lerna version patch/minor/major --yes` to bump versions
3. Use `yarn lerna publish from-package --yes` to publish both packages
4. The vanilla JS package (`@zergo0/filerobot-image-editor`) has a peer dependency on the React package, so version alignment is critical

### Documentation and Demo

- `yarn build:gh-pages` - Build demo for GitHub Pages
- `yarn deploy:gh-pages` - Deploy demo to GitHub Pages

### Utilities

- `yarn analyze:bundle` - Analyze built bundle with source-map-explorer
- `yarn update` - Run Lerna update wizard for dependencies

## High-Level Architecture

### Monorepo Structure

This project uses Yarn workspaces with Lerna for managing the monorepo.

```
packages/
  ├── react-filerobot-image-editor/    # Core React component library
  │   ├── src/
  │   │   ├── components/
  │   │   ├── context/
  │   │   ├── hooks/
  │   │   ├── utils/
  │   │   └── index.js
  │   └── package.json
  └── filerobot-image-editor/          # Vanilla JS wrapper
      ├── src/
      │   └── index.js
      └── package.json
```

### Key Architectural Components

1. **Canvas System**: Uses Konva.js for canvas operations with layered design
2. **State Management**: React Context API with useReducer pattern
   - Global state in `AppContext` and `AppProvider`
   - Actions pattern for state updates
3. **Styling**: Styled-components for component styling
4. **Tools**: Pluggable tool architecture (crop, rotate, filter, text, etc.)

### Build System

- **Development**: Vite dev server
- **Production**:
  - Babel for transpilation with custom module resolver
  - Rollup (via Vite) for bundling
  - Outputs UMD format for browser compatibility

### Module Resolution

- Configured babel module resolver allows imports from 'src' root
- Path aliases defined in babel.config.json and jsconfig.json

## Development Notes

### Adding New Properties

When adding a new property, ensure it exists in all of these files:

1. `README.md` - Documentation
2. `packages/react-filerobot-image-editor/src/index.d.ts` - TypeScript definitions
3. `packages/react-filerobot-image-editor/src/context/defaultConfig.js` - Default configuration
4. `public/demo-config.js` - Demo configuration example
5. The feature's implementation file

### Important Configuration Files

- `babel.config.json` - Babel transpilation config with module resolver
- `vite.config.js` - Vite build configuration
- `lerna.json` - Monorepo configuration
- `jsconfig.json` - JavaScript/IDE configuration

### Code Style Guidelines

- ESLint with Airbnb configuration
- Run `yarn fix` before committing
- Commits follow format: `Chore(Release): publish new version %s🔥🚀`

### Dependencies

- React 18.2.0
- Konva 9.3.6 (canvas library)
- Styled-components 5.3.10
- @scaleflex/ui and @scaleflex/icons

## Tools Configuration

Each tool can be configured through the config object. Tools include:

- CROP: Image cropping with presets
- ROTATE: Image rotation
- FILTER: Image filters
- TEXT: Text annotations
- IMAGE: Image overlay
- WATERMARK: Watermark application

Refer to `public/demo-config.js` for comprehensive configuration examples.
