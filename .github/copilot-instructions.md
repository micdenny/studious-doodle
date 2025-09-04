# Sportsbook Backoffice Dashboard

Sportsbook Backoffice is a React TypeScript web application for managing sports betting operations. It provides real-time monitoring of live matches, betting management, and risk assessment for sportsbook operators.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup and Dependencies
- Install dependencies: `npm install --force` -- REQUIRED due to TypeScript version conflicts. Standard `npm install` will fail.
- Alternative: `npm install --legacy-peer-deps` may work but can cause build issues requiring --force anyway
- **NEVER use standard `npm install`** - it will fail with TypeScript version conflicts between react-scripts 5.0.1 (expects TypeScript <5.2.0) and project using TypeScript 5.9.2

### Build Process
- Build for production: `npm run build` -- takes 47 seconds. NEVER CANCEL. Set timeout to 90+ minutes.
- **IMPORTANT**: Must use `npm install --force` first, otherwise build fails with module resolution errors
- Expect TypeScript warnings about unsupported version - this is normal and build will complete successfully
- Build output goes to `build/` folder
- Build creates optimized bundles (~216KB main.js, ~1.77KB chunk.js, ~782B CSS)

### Development Server
- Start development server: `npm start` -- takes 25 seconds to compile. NEVER CANCEL. Set timeout to 60+ minutes.
- Runs on `http://localhost:3000`
- Expect webpack deprecation warnings - these are normal
- Expect TypeScript version warnings - application works despite warnings
- Hot reload is enabled - changes trigger automatic recompilation

### Testing
- Run tests: `npm test -- --watchAll=false --verbose` -- takes 2 seconds normally
- **KNOWN ISSUE**: React Router v7 has Jest compatibility problems causing module resolution failures
- Tests may fail with "Cannot find module 'react-router-dom'" error in test environment
- Workaround: Create simple test components that don't import App.tsx directly
- Application runs fine in development/production despite test issues

### Linting
- Run ESLint: `npx eslint src/ --ext .ts,.tsx` -- takes 2 seconds
- Expect TypeScript version warnings from @typescript-eslint - code lints successfully despite warnings
- No additional lint scripts available - only ESLint via npx

## Validation

### Manual Testing Scenarios
ALWAYS run through these complete scenarios after making changes:

1. **Navigation Flow**:
   - Start dev server with `npm start`
   - Navigate to `http://localhost:3000`
   - Verify Dashboard loads with 4 stat cards (Total Matches, Total Bets, Total Stake, Profit)
   - Click "Live Matches" - verify page shows live matches with betting odds and controls
   - Click "Prematch Matches" - verify upcoming matches display
   - Click "Bets Management" - verify bet tracking interface
   - Click "Risk Management" - verify risk assessment tools
   - Return to Dashboard - verify navigation works correctly

2. **Theme Toggle**:
   - Click "Light Mode" button in sidebar
   - Verify application switches to light theme
   - Click "Dark Mode" button
   - Verify application switches back to dark theme
   - Verify theme preference persists on page refresh

3. **Live Match Management**:
   - Navigate to Live Matches page
   - Verify live matches display with real-time scores
   - Verify betting odds are shown (Home Win, Draw, Away Win)
   - Verify "Pause betting" and "Stop match" buttons are present
   - Verify risk indicators (LOW/MEDIUM/HIGH) are displayed
   - Check match search functionality works

4. **Data Display Validation**:
   - Verify Dashboard shows current statistics and trends
   - Check Recent Live Matches section displays match data
   - Verify Risk Level indicator shows current status
   - Confirm Quick Stats section shows profit margins and bet data

### Build Validation
- Run `npm run build` and ensure successful completion without errors (warnings are acceptable)
- Verify `build/` directory is created with static assets
- Test that static files can be served with `npx serve -s build`

### Code Quality Validation
- Always run `npx eslint src/ --ext .ts,.tsx` before committing changes
- Fix any new ESLint errors (TypeScript version warnings can be ignored)
- Ensure TypeScript compilation succeeds in development server

## Technical Architecture

### Key Technologies
- **React 19.1.1** with TypeScript 5.9.2
- **Material-UI (MUI) 7.3.2** for UI components
- **React Router 7.8.2** for navigation (causes Jest issues)
- **Framer Motion 11.0** for page transitions
- **Create React App 5.0.1** for build tooling
- **ESLint 8.57.1** for code linting

### Project Structure
- `src/App.tsx` - Main application with routing and theme context
- `src/pages/` - Page components (Dashboard, LiveMatches, PrematchMatches, BetsManagement, RiskManagement)
- `src/components/` - Shared components (Layout)
- `src/utils/` - Utility functions including mock data generation
- `src/types/` - TypeScript type definitions
- `src/theme.ts` - Material-UI theme configuration

### Known Issues and Workarounds
1. **Dependency Conflicts**: Must use `npm install --force` due to TypeScript version conflicts with react-scripts
2. **TypeScript Version Warning**: React-scripts expects older TypeScript - app works despite warnings
3. **Jest/React Router Compatibility**: Tests fail to import React Router components - use component isolation for testing
4. **Webpack Deprecation Warnings**: Development server shows deprecation warnings - these don't affect functionality

## Common Tasks

### File Locations
- Main application entry: `src/index.tsx`
- Routing configuration: `src/App.tsx` lines 31-37
- Theme switching logic: `src/App.tsx` lines 45-61
- Mock data generation: `src/utils/mockData.ts`
- Type definitions: `src/types/`

### Development Workflow
- Make code changes in `src/`
- Development server auto-reloads on file changes
- Check browser console for any React warnings
- Test navigation between all pages
- Verify theme toggle functionality
- Run ESLint before committing: `npx eslint src/ --ext .ts,.tsx`

### Debugging
- Use React DevTools browser extension for component debugging
- Check browser console for JavaScript errors
- Development server provides helpful error messages
- Source maps are available for debugging compiled code

## Commands Reference

```bash
# Setup
npm install --force                  # Required - standard install fails

# Development  
npm start                            # Start dev server (25s compile time)

# Building
npm run build                        # Production build (47s build time)

# Testing
npm test -- --watchAll=false        # Run tests (may fail due to Router issues)

# Linting
npx eslint src/ --ext .ts,.tsx       # Run ESLint (2s)

# Serving built files
npx serve -s build                   # Serve production build locally
```

### Timing Expectations
- Dependencies install: 60-120 seconds
- Development server startup: 25 seconds
- Production build: 47 seconds  
- ESLint execution: 2 seconds
- Test execution: 2 seconds (when working)

**CRITICAL**: NEVER CANCEL build or development server startup commands. Always wait for completion and set timeouts of 90+ minutes for builds, 60+ minutes for dev server.