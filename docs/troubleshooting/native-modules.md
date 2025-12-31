# Native Module Troubleshooting

Issues related to native Node.js modules in Electron (especially better-sqlite3).

## Table of Contents

- [Module Not Found After Build](#module-not-found-after-build)
- [Architecture Mismatch](#architecture-mismatch)
- [Rebuild Failures](#rebuild-failures)
- [better-sqlite3 Specific Issues](#better-sqlite3-specific-issues)

---

## Module Not Found After Build

### Symptom
```
Error: Cannot find module 'better-sqlite3'
```
or
```
Error: The module was compiled against a different Node.js version
```

### Cause
Native modules need to be rebuilt for Electron's Node.js version.

### Solution
1. Install electron-rebuild:
   ```bash
   bun add -d electron-rebuild
   ```
2. Add rebuild script to package.json:
   ```json
   "scripts": {
     "rebuild": "electron-rebuild -f -w better-sqlite3"
   }
   ```
3. Run rebuild after install:
   ```bash
   bun run rebuild
   ```

### Prevention
Add postinstall script:
```json
"scripts": {
  "postinstall": "electron-rebuild"
}
```

---

## Architecture Mismatch

### Symptom
```
Error: dlopen failed: "better-sqlite3.node" has wrong architecture
```

### Cause
Module compiled for wrong architecture (x64 vs arm64).

### Solution
1. Clean node_modules:
   ```bash
   rm -rf node_modules
   ```
2. Delete any cached native builds:
   ```bash
   rm -rf ~/.electron-gyp
   ```
3. Reinstall with correct architecture:
   ```bash
   npm_config_arch=arm64 bun install  # For Apple Silicon
   npm_config_arch=x64 bun install    # For Intel
   ```

### Prevention
Use CI matrix to build for all architectures.

---

## Rebuild Failures

### Symptom
```
gyp ERR! build error
```

### Cause
Missing build tools or incorrect Python version.

### Solution

**Windows:**
1. Install Visual Studio Build Tools:
   ```bash
   npm install -g windows-build-tools
   ```

**macOS:**
1. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

**Linux:**
1. Install build essentials:
   ```bash
   sudo apt-get install build-essential python3
   ```

### Prevention
Document required build tools in README.

---

## better-sqlite3 Specific Issues

### Issue: Database Locked

**Symptom:**
```
Error: SQLITE_BUSY: database is locked
```

**Cause:**
Multiple processes trying to write simultaneously.

**Solution:**
1. Use WAL mode:
   ```typescript
   db.pragma('journal_mode = WAL');
   ```
2. Ensure single database connection in main process
3. Use proper connection pooling

---

### Issue: Database Corruption

**Symptom:**
App crashes with database errors after force quit.

**Cause:**
Interrupted write operations.

**Solution:**
1. Enable WAL mode for crash safety
2. Implement proper shutdown handling:
   ```typescript
   app.on('before-quit', () => {
     db.close();
   });
   ```
3. Add database integrity check on startup:
   ```typescript
   const result = db.pragma('integrity_check');
   if (result[0].integrity_check !== 'ok') {
     // Handle corruption
   }
   ```

### Prevention
Always use WAL mode and handle app shutdown gracefully.

---

## Electron Builder Configuration

For proper native module packaging:

```yaml
# electron-builder.yml
build:
  # Rebuild native modules for each platform
  npmRebuild: true

  # Include native module binaries
  files:
    - "dist/**/*"
    - "node_modules/**/*"
    - "!node_modules/**/build/**/*"
    - "node_modules/better-sqlite3/build/Release/*.node"
```

---

## Adding New Issues

Found a new native module issue? Add it here following the template above.
