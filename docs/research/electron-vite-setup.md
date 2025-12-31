# Electron + Vite Integration Research

## Overview

This document covers the recommended approach for integrating Electron with Vite for the Eidolon desktop application.

## Recommended Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Bundler | Vite 5+ | Fast HMR, native ESM, excellent DX |
| Electron Integration | electron-vite | Purpose-built, handles main/preload/renderer |
| React | React 18+ | Concurrent features, Suspense for streaming |
| TypeScript | 5.x | Best type inference, satisfies keyword |

## electron-vite Setup

### Why electron-vite?

1. **Unified Configuration**: Single config file handles main, preload, and renderer
2. **Hot Module Replacement**: Works in renderer, restarts main on changes
3. **Native Module Support**: Built-in handling for better-sqlite3, etc.
4. **Electron Builder Integration**: Seamless packaging

### Installation

```bash
bun add -D electron electron-vite vite
bun add -D @vitejs/plugin-react
```

### Configuration Structure

```typescript
// electron.vite.config.ts
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload.ts')
        }
      }
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    },
    plugins: [react()]
  }
})
```

## IPC Type Safety

### Option 1: electron-trpc (Recommended for Complex Apps)

```typescript
// electron/trpc/router.ts
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create({ isServer: true })

export const appRouter = t.router({
  settings: t.router({
    get: t.procedure.query(() => getSettings()),
    set: t.procedure
      .input(z.object({ key: z.string(), value: z.unknown() }))
      .mutation(({ input }) => setSettings(input.key, input.value))
  }),
  conversation: t.router({
    list: t.procedure.query(() => db.conversations.findAll()),
    create: t.procedure
      .input(z.object({ title: z.string() }))
      .mutation(({ input }) => db.conversations.create(input))
  })
})

export type AppRouter = typeof appRouter
```

**Pros:**
- Full type inference across IPC boundary
- Input validation with Zod
- Familiar API if using tRPC elsewhere

**Cons:**
- Additional dependency
- Overhead for simple operations

### Option 2: Custom Typed IPC (Recommended for Eidolon)

```typescript
// packages/shared/src/ipc-types.ts
export interface IPCChannels {
  // Settings
  'settings:get': { input: string; output: unknown }
  'settings:set': { input: { key: string; value: unknown }; output: void }

  // Database
  'db:conversations:list': { input: void; output: Conversation[] }
  'db:conversations:create': { input: CreateConversation; output: Conversation }

  // API
  'api:chat': { input: ChatRequest; output: AsyncIterable<ChatChunk> }
}

// Type-safe invoke wrapper
export type IPCInvoke = <K extends keyof IPCChannels>(
  channel: K,
  ...args: IPCChannels[K]['input'] extends void ? [] : [IPCChannels[K]['input']]
) => Promise<IPCChannels[K]['output']>
```

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

const invoke: IPCInvoke = (channel, ...args) => {
  return ipcRenderer.invoke(channel, ...args)
}

contextBridge.exposeInMainWorld('api', { invoke })
```

```typescript
// src/lib/ipc.ts (renderer)
declare global {
  interface Window {
    api: { invoke: IPCInvoke }
  }
}

export const ipc = window.api
```

**Pros:**
- Lightweight, no dependencies
- Full control over implementation
- Easy to understand

**Cons:**
- Manual type maintenance
- No built-in validation

### Recommendation

Use **Custom Typed IPC** for Eidolon because:
1. Simpler mental model
2. No additional dependencies
3. Sufficient for our use case
4. Validation can be added where needed with Zod

## Security Best Practices

### 1. Disable nodeIntegration

```typescript
// electron/main.ts
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,        // REQUIRED
    contextIsolation: true,        // REQUIRED
    sandbox: true,                 // Recommended
    preload: join(__dirname, 'preload.js')
  }
})
```

### 2. Content Security Policy

```typescript
// electron/main.ts
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",  // Required for Tailwind
        "img-src 'self' data: https:",
        "connect-src 'self' https://openrouter.ai https://api.openai.com",
        "font-src 'self'"
      ].join('; ')
    }
  })
})
```

### 3. Validate IPC Inputs

```typescript
// electron/ipc/handlers.ts
import { z } from 'zod'

const CreateConversationSchema = z.object({
  title: z.string().min(1).max(255),
  modelId: z.string().optional()
})

ipcMain.handle('db:conversations:create', async (_, input) => {
  const validated = CreateConversationSchema.parse(input)
  return db.conversations.create(validated)
})
```

### 4. Limit Exposed APIs

Only expose what's necessary via contextBridge:

```typescript
// electron/preload.ts
contextBridge.exposeInMainWorld('api', {
  invoke,
  // DON'T expose: fs, child_process, require, etc.
})
```

### 5. Disable Remote Module

```typescript
// electron/main.ts
app.on('web-contents-created', (_, contents) => {
  contents.on('will-attach-webview', (event) => {
    event.preventDefault()  // Block webviews
  })
})
```

## Project Structure

```
apps/desktop/
├── electron/
│   ├── main.ts              # Main process entry
│   ├── preload.ts           # Preload script
│   ├── ipc/
│   │   ├── index.ts         # IPC handler registration
│   │   ├── settings.ts      # Settings handlers
│   │   ├── database.ts      # Database handlers
│   │   └── chat.ts          # Chat/API handlers
│   ├── services/
│   │   ├── database.ts      # SQLite service
│   │   ├── secure-storage.ts # Encrypted key storage
│   │   └── openrouter.ts    # API client
│   └── db/
│       ├── migrations/      # SQL migrations
│       ├── migrator.ts      # Migration runner
│       └── repositories/    # Data access layer
├── src/
│   ├── main.tsx            # React entry
│   ├── App.tsx             # Root component
│   ├── lib/
│   │   └── ipc.ts          # IPC client wrapper
│   ├── components/
│   ├── routes/
│   └── stores/
├── electron.vite.config.ts
├── electron-builder.yml
├── package.json
└── tsconfig.json
```

## Development Workflow

```bash
# Start development
bun run dev

# Build for production
bun run build

# Package application
bun run package
```

## Native Module Handling

electron-vite handles native modules automatically via `externalizeDepsPlugin()`. For better-sqlite3:

```typescript
// electron.vite.config.ts
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({
      exclude: ['@eidolon/shared']  // Bundle shared package
    })]
  }
})
```

## References

- [electron-vite Documentation](https://electron-vite.org/)
- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron IPC Tutorial](https://www.electronjs.org/docs/latest/tutorial/ipc)
