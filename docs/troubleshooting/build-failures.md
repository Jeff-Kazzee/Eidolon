# Build Failure Troubleshooting

Issues related to building the Eidolon applications.

## Table of Contents

- [TypeScript Errors](#typescript-errors)
- [Vite Build Failures](#vite-build-failures)
- [Electron Builder Failures](#electron-builder-failures)
- [CI Build Failures](#ci-build-failures)

---

## TypeScript Errors

### Symptom
```
error TS2304: Cannot find name 'X'
error TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'
```

### Solution
1. Run type check to see all errors:
   ```bash
   bun run typecheck
   ```
2. Common fixes:
   - Missing type import: `import type { X } from 'module'`
   - Missing @types package: `bun add -d @types/package-name`
   - Incorrect generic usage

### Prevention
- Run typecheck in pre-commit hook
- Enable strict mode in tsconfig.json

---

## Vite Build Failures

### Symptom
```
[vite]: Rollup failed to resolve import
```

### Cause
- Missing dependency
- Incorrect import path
- ESM/CJS mismatch

### Solution
1. Check import path is correct
2. Verify dependency is installed
3. For Node.js modules in Electron:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         external: ['electron', 'better-sqlite3'],
       },
     },
   });
   ```

### Prevention
- Keep dependencies up to date
- Use consistent import style

---

## Electron Builder Failures

### Symptom
```
Error: Cannot find electron dependency
```

### Cause
- electron-builder can't find Electron
- Wrong Electron version

### Solution
1. Verify Electron is in dependencies (not devDependencies for build):
   ```json
   "dependencies": {
     "electron": "^33.0.0"
   }
   ```
2. Check electron-builder.yml configuration
3. Clear cache and rebuild:
   ```bash
   rm -rf node_modules/.cache
   rm -rf dist
   bun run build
   ```

### Prevention
- Pin Electron version
- Test builds on all platforms in CI

---

## CI Build Failures

### Symptom
Build passes locally but fails in CI.

### Cause
- Environment differences
- Missing dependencies
- Cache issues

### Solution
1. Check CI logs for specific error
2. Common fixes:
   - Add missing system dependencies
   - Clear CI cache
   - Match Node.js/Bun versions

### Prevention
- Use same versions locally as CI
- Add comprehensive CI checks

---

## Common Commands

```bash
# Clean all build artifacts
bun run clean

# Fresh install
rm -rf node_modules bun.lock
bun install

# Rebuild native modules
bun run rebuild

# Build with verbose output
DEBUG=* bun run build
```
