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
