# Electron Common Issues

Common issues encountered when working with Electron in the Eidolon desktop app.

## Table of Contents

- [Window Not Showing](#window-not-showing)
- [White Screen on Launch](#white-screen-on-launch)
- [IPC Communication Failures](#ipc-communication-failures)
- [Context Isolation Errors](#context-isolation-errors)
- [DevTools Issues](#devtools-issues)

---

## Window Not Showing

### Symptom
App starts but no window appears, or window appears briefly then disappears.

### Cause
Usually due to errors in main process before window creation, or window being created off-screen.

### Solution
1. Check main process logs for errors
2. Verify BrowserWindow options:
   ```typescript
   const win = new BrowserWindow({
     show: false, // Show after ready-to-show
     // ...
   });
   win.once('ready-to-show', () => win.show());
   ```
3. Check if window position is valid for current display

### Prevention
Always use `ready-to-show` event and validate window bounds.

---

## White Screen on Launch

### Symptom
Window shows but content is blank white screen.

### Cause
- Renderer process failed to load
- Vite dev server not running
- Wrong URL being loaded

### Solution
1. Check renderer console for errors (View > Toggle Developer Tools)
2. Verify Vite dev server is running: `bun run dev`
3. Check `loadURL` or `loadFile` path is correct:
   ```typescript
   // Development
   win.loadURL('http://localhost:5173');
   // Production
   win.loadFile(path.join(__dirname, '../dist/index.html'));
   ```

### Prevention
Add error handling for load failures:
```typescript
win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  console.error('Failed to load:', errorDescription);
});
```

---

## IPC Communication Failures

### Symptom
`ipcRenderer.invoke` hangs or returns undefined.

### Cause
- Handler not registered in main process
- Channel name mismatch
- preload script not properly configured

### Solution
1. Verify handler is registered:
   ```typescript
   // main.ts
   ipcMain.handle('channel-name', async (event, ...args) => {
     // ...
   });
   ```
2. Check channel names match exactly
3. Verify preload exposes the API:
   ```typescript
   // preload.ts
   contextBridge.exposeInMainWorld('api', {
     invoke: (channel: string, ...args: unknown[]) =>
       ipcRenderer.invoke(channel, ...args),
   });
   ```

### Prevention
Use typed IPC channels to catch mismatches at compile time.

---

## Context Isolation Errors

### Symptom
`require is not defined` or `Cannot access 'X' before initialization`

### Cause
Context isolation is enabled (correct!) but code is trying to access Node.js APIs directly.

### Solution
Never disable context isolation. Instead:
1. Use preload script with contextBridge
2. Expose only needed APIs
3. Keep Node.js code in main process

```typescript
// WRONG - Don't do this
webPreferences: {
  contextIsolation: false, // Security risk!
  nodeIntegration: true,   // Security risk!
}

// CORRECT
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  preload: path.join(__dirname, 'preload.js'),
}
```

### Prevention
Always follow Electron security best practices.

---

## DevTools Issues

### Symptom
DevTools won't open or shows errors.

### Cause
- DevTools extension conflicts
- React DevTools not installed
- CSP blocking

### Solution
1. Open DevTools manually: `win.webContents.openDevTools()`
2. Install React DevTools:
   ```typescript
   import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

   app.whenReady().then(() => {
     installExtension(REACT_DEVELOPER_TOOLS);
   });
   ```

### Prevention
Add DevTools toggle in dev menu.

---

## Hot Reload Not Working

### Symptom
Changes to renderer code don't appear without full restart.

### Cause
- Vite HMR connection blocked
- electron-vite not configured correctly
- Browser caching

### Solution
1. Check Vite dev server console for HMR errors
2. Verify electron-vite config has renderer section:
   ```typescript
   renderer: {
     plugins: [react()],
     server: {
       port: 5173
     }
   }
   ```
3. Hard refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`

### Prevention
Use electron-vite's built-in HMR support.

---

## Main Process Changes Not Applied

### Symptom
Changes to main.ts or preload.ts don't take effect.

### Cause
Main process requires full restart, unlike renderer HMR.

### Solution
1. Stop and restart: `bun run dev`
2. electron-vite should auto-restart main process on changes

### Prevention
Use nodemon or electron-vite's built-in watcher.

---

## Production Build Fails

### Symptom
`bun run build` completes but app won't start.

### Cause
- Path resolution differences between dev and prod
- Missing assets in build output
- Native modules not rebuilt

### Solution
1. Check file paths use `__dirname` correctly:
   ```typescript
   // Development vs Production paths
   const isDev = !app.isPackaged;
   const preloadPath = isDev
     ? join(__dirname, '../preload/index.js')
     : join(__dirname, 'preload.js');
   ```
2. Verify assets are copied to dist
3. Rebuild native modules: `electron-rebuild`

### Prevention
Test production builds regularly with `bun run preview`.

---

## Adding New Issues

Found a new issue? Add it using this template:

```markdown
## Issue Title

### Symptom
What you observed.

### Cause
Why it happened.

### Solution
How to fix it.

### Prevention
How to avoid it.
```
