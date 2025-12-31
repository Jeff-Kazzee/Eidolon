name: "Eidolon Desktop App - AI Chat & Writer's Studio with Version Control"
description: |

## Purpose
Build a production-ready Electron desktop application that combines conversational AI chat with a Writer's Studio featuring git-style version control for prose. This PRP provides comprehensive context for one-pass implementation success.

## Core Principles
1. **Context is King**: All necessary documentation, examples, and caveats included
2. **Validation Loops**: Executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from established libraries
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global Rules**: Follow all rules in CLAUDE.md

---

## Goal
Create a desktop AI application called Eidolon that feels as familiar as T3.chat while adding specialized creative workflows. Features include:
- Multi-model chat via OpenRouter API with streaming responses
- Writer's Studio with rich text editing (Tiptap), AI review, and git-style version control
- Local-first data storage with SQLite
- Secure API key management with Electron safeStorage
- Beautiful dark-mode UI with Tweek the Sloth mascot

**One-liner:** A caffeinated desktop AI companion for builders who ship, featuring chat, writing studio with version control, and image generation.

## Why
- **Business Value:** Creative professionals need iterative AI workflows, not one-shot prompts
- **User Impact:** No existing tool treats AI-assisted writing as a first-class iterative process
- **Problems Solved:** Fragmented workflow between AI chat and writing tools, no version history for AI revisions
- **Integration:** BYOK model means users control their own API costs and data

## What
A desktop Electron application with three main areas:
1. **Chat Interface** - T3.chat-style multi-model chat with streaming, markdown, and code highlighting
2. **Writer's Studio** - Rich text editor with AI review, accept/reject changes, version history, and branching
3. **Settings** - API key management, appearance customization, behavior configuration

### Success Criteria
- [ ] Chat: Messages stream in real-time with markdown rendering and syntax highlighting
- [ ] Chat: Can switch between OpenRouter models mid-conversation
- [ ] Chat: Conversations persist locally between app sessions
- [ ] Writer: Documents save with version snapshots on every save
- [ ] Writer: AI review shows side-by-side diff with accept/reject controls
- [ ] Writer: Can branch documents and switch between branches
- [ ] Settings: API key stored securely with Electron safeStorage
- [ ] Settings: Theme and behavior preferences persist
- [ ] Performance: App launches in < 3 seconds, first token < 500ms
- [ ] Quality: All tests pass, no TypeScript errors, no linting errors

---

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

# Electron + Build Tooling
- url: https://electron-vite.org/guide/
  why: Project setup, directory structure, development workflow
  critical: "Use src/main, src/preload, src/renderer structure"

- url: https://www.electronjs.org/docs/latest/tutorial/context-isolation
  why: Security best practices for IPC
  critical: "Never expose full ipcRenderer, use contextBridge"

- url: https://www.electronjs.org/docs/latest/api/safe-storage
  why: Secure API key encryption
  critical: "safeStorage encrypts with OS keychain"

# OpenRouter API
- url: https://openrouter.ai/docs/api/reference/streaming
  why: Streaming SSE implementation
  critical: "Handle : comments, terminate on data: [DONE]"

- url: https://openrouter.ai/docs/quickstart
  why: Authentication and request structure
  critical: "Bearer token, HTTP-Referer header"

# Database
- url: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
  why: SQLite API reference
  critical: "Synchronous API, must run in main process"

- url: https://dev.to/arindam1997007/a-step-by-step-guide-to-integrating-better-sqlite3-with-electron-js-app-using-create-react-app-3k16
  why: Electron native module setup
  critical: "electron-rebuild required, install as dependency not devDependency"

# Editor
- url: https://tiptap.dev/docs/editor/getting-started/install/react
  why: Tiptap React integration
  critical: "useEditor hook, EditorContent component"

- url: https://www.npmjs.com/package/diff
  why: Text diff for version comparison
  critical: "diffLines returns { added, removed, value } objects"

# UI Framework
- url: https://ui.shadcn.com/docs/installation/vite
  why: Component installation for Vite projects
  critical: "bunx shadcn@latest init, then add components"

- url: https://tailwindcss.com/docs/configuration
  why: Custom theme configuration
  critical: "Extend theme with CSS variables"

# State Management
- url: https://zustand-demo.pmnd.rs/
  why: Zustand patterns for React
  critical: "create() function, persist middleware"

- url: https://tanstack.com/query/latest/docs/framework/react/overview
  why: Async data fetching
  critical: "useQuery for model list, useMutation for chat"

# Project Documentation (LOCAL FILES)
- docfile: docs/eidolon-prd.md
  why: Full product requirements and technical architecture

- docfile: docs/eidolon-design-system-UIUX-spec.md
  why: Complete design tokens, CSS variables, component specs

- docfile: docs/eidolon-brand-identity.md
  why: Color palette, typography, Tweek mascot guidelines
```

### Current Codebase Tree
```bash
# Starting fresh - no existing Eidolon code
# This project will be scaffolded from scratch
```

### Desired Codebase Tree
```bash
eidolon/
├── src/
│   ├── main/                          # Electron main process
│   │   ├── index.ts                   # App entry, window creation
│   │   ├── ipc/                       # IPC handlers
│   │   │   ├── index.ts              # Register all handlers
│   │   │   ├── chat.ts               # Chat/streaming handlers
│   │   │   ├── database.ts           # Database operation handlers
│   │   │   └── settings.ts           # Settings handlers
│   │   ├── database/
│   │   │   ├── index.ts              # Database connection
│   │   │   ├── schema.ts             # Table definitions
│   │   │   ├── migrations.ts         # Migration runner
│   │   │   └── queries/              # Prepared queries
│   │   │       ├── conversations.ts
│   │   │       ├── messages.ts
│   │   │       ├── documents.ts
│   │   │       └── versions.ts
│   │   └── services/
│   │       ├── openrouter.ts         # OpenRouter API client
│   │       └── secure-storage.ts     # safeStorage wrapper
│   │
│   ├── preload/                       # Preload scripts (IPC bridge)
│   │   ├── index.ts                  # contextBridge setup
│   │   └── types.ts                  # Shared types for IPC
│   │
│   └── renderer/                      # React application
│       ├── src/
│       │   ├── main.tsx              # React entry
│       │   ├── App.tsx               # Root component with routing
│       │   ├── index.css             # Tailwind + CSS variables
│       │   │
│       │   ├── components/
│       │   │   ├── ui/               # shadcn/ui components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── dropdown-menu.tsx
│       │   │   │   ├── toast.tsx
│       │   │   │   └── ...
│       │   │   ├── layout/
│       │   │   │   ├── AppShell.tsx       # Main layout container
│       │   │   │   ├── Sidebar.tsx        # Navigation sidebar
│       │   │   │   ├── Header.tsx         # Toolbar area
│       │   │   │   └── StatusBar.tsx      # Bottom status bar
│       │   │   ├── chat/
│       │   │   │   ├── ChatView.tsx       # Main chat container
│       │   │   │   ├── MessageList.tsx    # Message display area
│       │   │   │   ├── MessageItem.tsx    # Single message component
│       │   │   │   ├── MessageInput.tsx   # Input with send button
│       │   │   │   ├── ModelSelector.tsx  # Model dropdown
│       │   │   │   └── StreamingCursor.tsx # Typing indicator
│       │   │   ├── writer/
│       │   │   │   ├── WriterView.tsx     # Writer's Studio container
│       │   │   │   ├── Editor.tsx         # Tiptap editor wrapper
│       │   │   │   ├── EditorToolbar.tsx  # Formatting toolbar
│       │   │   │   ├── DocumentList.tsx   # Document sidebar
│       │   │   │   ├── VersionHistory.tsx # Version timeline
│       │   │   │   ├── BranchManager.tsx  # Branch UI
│       │   │   │   ├── DiffView.tsx       # Side-by-side diff
│       │   │   │   ├── ReviewModal.tsx    # AI review configuration
│       │   │   │   └── SuggestionPanel.tsx # Accept/reject UI
│       │   │   ├── settings/
│       │   │   │   ├── SettingsView.tsx   # Settings container
│       │   │   │   ├── ApiKeySection.tsx  # API key management
│       │   │   │   ├── AppearanceSection.tsx # Theme settings
│       │   │   │   └── BehaviorSection.tsx # Behavior options
│       │   │   └── shared/
│       │   │       ├── EmptyState.tsx     # Empty state with Tweek
│       │   │       ├── LoadingState.tsx   # Loading indicators
│       │   │       ├── ErrorBoundary.tsx  # Error handling
│       │   │       └── CommandPalette.tsx # Cmd+K menu
│       │   │
│       │   ├── stores/
│       │   │   ├── useAppStore.ts         # Global app state
│       │   │   ├── useChatStore.ts        # Chat state
│       │   │   ├── useDocumentStore.ts    # Document state
│       │   │   └── useSettingsStore.ts    # Settings state
│       │   │
│       │   ├── hooks/
│       │   │   ├── useChat.ts             # Chat logic hook
│       │   │   ├── useModels.ts           # Model list fetching
│       │   │   ├── useDocument.ts         # Document operations
│       │   │   ├── useVersionHistory.ts   # Version management
│       │   │   ├── useDiff.ts             # Text diff hook
│       │   │   └── useKeyboard.ts         # Keyboard shortcuts
│       │   │
│       │   ├── lib/
│       │   │   ├── utils.ts               # Utility functions (cn, etc.)
│       │   │   ├── markdown.ts            # Markdown rendering
│       │   │   └── ipc.ts                 # Typed IPC client
│       │   │
│       │   └── types/
│       │       ├── index.ts               # Shared types
│       │       ├── chat.ts                # Chat types
│       │       ├── document.ts            # Document types
│       │       └── settings.ts            # Settings types
│       │
│       └── index.html                     # HTML entry
│
├── resources/                             # Static assets
│   ├── icon.png                          # App icon (512x512)
│   ├── icon.ico                          # Windows icon
│   └── icon.icns                         # macOS icon
│
├── tests/
│   ├── main/                             # Main process tests
│   │   ├── database.test.ts
│   │   └── openrouter.test.ts
│   └── renderer/                         # React component tests
│       ├── chat.test.tsx
│       └── writer.test.tsx
│
├── electron.vite.config.ts               # Vite config for Electron
├── electron-builder.json5                # Build/packaging config
├── tailwind.config.js                    # Tailwind configuration
├── tsconfig.json                         # TypeScript config
├── tsconfig.node.json                    # Node TypeScript config
├── tsconfig.web.json                     # Web TypeScript config
├── package.json
├── .env.example                          # Environment template
└── README.md
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Electron security - NEVER expose full ipcRenderer
// BAD:
contextBridge.exposeInMainWorld('electron', { ipcRenderer });
// GOOD:
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (content: string) => ipcRenderer.invoke('chat:send', content),
});

// CRITICAL: better-sqlite3 requires native module rebuild
// In package.json, add postinstall script:
// "postinstall": "electron-rebuild -f -w better-sqlite3"
// Install as dependency (NOT devDependency)

// CRITICAL: better-sqlite3 is synchronous, run in main process only
// BAD: Using in renderer process
// GOOD: Use IPC to call main process

// CRITICAL: OpenRouter streaming SSE may send comments like ": OPENROUTER PROCESSING"
// These are NOT JSON - skip lines starting with ':'
// Terminate on: data: [DONE]

// CRITICAL: Tiptap AI Toolkit is PAID (Enterprise only)
// Use jsdiff for text comparison instead
// Build custom accept/reject UI

// CRITICAL: No spaces in project path (node-gyp issue with native modules)
// BAD: C:\Users\John Doe\Projects\eidolon
// GOOD: C:\Users\JohnDoe\Projects\eidolon

// CRITICAL: Zustand persist middleware requires async storage for Electron
// Use localStorage in renderer, it persists via Electron

// CRITICAL: AbortController for canceling streaming requests
// Pass signal to fetch, call controller.abort() on Escape key
```

---

## Implementation Blueprint

### Data Models (TypeScript Interfaces)

```typescript
// src/renderer/src/types/index.ts

// === CHAT TYPES ===
export interface Conversation {
  id: string;
  title: string;
  systemPrompt?: string;
  modelId?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelId?: string;
  tokenCount?: number;
  createdAt: number;
}

export interface StreamChunk {
  id: string;
  content: string;
  finishReason?: 'stop' | 'length' | 'error';
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// === DOCUMENT TYPES ===
export interface Document {
  id: string;
  title: string;
  currentBranchId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Branch {
  id: string;
  documentId: string;
  name: string;
  parentBranchId?: string;
  createdAt: number;
}

export interface Version {
  id: string;
  branchId: string;
  content: string;
  message?: string;
  wordCount: number;
  createdAt: number;
}

export interface DiffChange {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumber?: number;
}

// === MODEL TYPES ===
export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    prompt: number;    // per million tokens
    completion: number;
  };
  capabilities: string[];
}

// === SETTINGS TYPES ===
export interface Settings {
  apiKey?: string; // Stored encrypted, never returned in full
  hasApiKey: boolean;
  defaults: {
    modelId: string;
    theme: 'dark' | 'light' | 'system';
    accentColor: string;
    sendOnEnter: boolean;
    autoSaveInterval: number; // seconds
    showTokenCount: boolean;
    showCost: boolean;
  };
}

// === IPC TYPES ===
export interface ElectronAPI {
  // Chat
  chat: {
    send: (conversationId: string, content: string, modelId: string) => Promise<void>;
    onChunk: (callback: (chunk: StreamChunk) => void) => void;
    cancel: () => void;
    removeListeners: () => void;
  };
  // Database
  db: {
    conversations: {
      list: () => Promise<Conversation[]>;
      get: (id: string) => Promise<Conversation | null>;
      create: (title: string) => Promise<Conversation>;
      update: (id: string, data: Partial<Conversation>) => Promise<void>;
      delete: (id: string) => Promise<void>;
    };
    messages: {
      list: (conversationId: string) => Promise<Message[]>;
      create: (message: Omit<Message, 'id' | 'createdAt'>) => Promise<Message>;
      search: (query: string) => Promise<Message[]>;
    };
    documents: {
      list: () => Promise<Document[]>;
      get: (id: string) => Promise<Document | null>;
      create: (title: string) => Promise<Document>;
      update: (id: string, data: Partial<Document>) => Promise<void>;
      delete: (id: string) => Promise<void>;
    };
    versions: {
      list: (branchId: string) => Promise<Version[]>;
      create: (version: Omit<Version, 'id' | 'createdAt'>) => Promise<Version>;
      get: (id: string) => Promise<Version | null>;
    };
    branches: {
      list: (documentId: string) => Promise<Branch[]>;
      create: (branch: Omit<Branch, 'id' | 'createdAt'>) => Promise<Branch>;
      delete: (id: string) => Promise<void>;
    };
  };
  // Models
  models: {
    list: () => Promise<Model[]>;
    refresh: () => Promise<Model[]>;
  };
  // Settings
  settings: {
    get: () => Promise<Settings>;
    setApiKey: (key: string) => Promise<boolean>;
    removeApiKey: () => Promise<void>;
    updateDefaults: (defaults: Partial<Settings['defaults']>) => Promise<void>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

### Database Schema

```sql
-- src/main/database/schema.ts (as SQL template)

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  system_prompt TEXT,
  model_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_updated
  ON conversations(updated_at DESC);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_id TEXT,
  token_count INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages(conversation_id, created_at ASC);

-- Full-text search for messages
CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
  content,
  content=messages,
  content_rowid=rowid
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS messages_ai AFTER INSERT ON messages BEGIN
  INSERT INTO messages_fts(rowid, content) VALUES (NEW.rowid, NEW.content);
END;

CREATE TRIGGER IF NOT EXISTS messages_ad AFTER DELETE ON messages BEGIN
  INSERT INTO messages_fts(messages_fts, rowid, content) VALUES('delete', OLD.rowid, OLD.content);
END;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  current_branch_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_updated
  ON documents(updated_at DESC);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_branch_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_branch_id) REFERENCES branches(id)
);

CREATE INDEX IF NOT EXISTS idx_branches_document
  ON branches(document_id);

-- Versions table
CREATE TABLE IF NOT EXISTS versions (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message TEXT,
  word_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_versions_branch
  ON versions(branch_id, created_at DESC);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  default_model_id TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  accent_color TEXT DEFAULT '#8b5cf6',
  send_on_enter INTEGER DEFAULT 1,
  auto_save_interval INTEGER DEFAULT 30,
  show_token_count INTEGER DEFAULT 1,
  show_cost INTEGER DEFAULT 1
);

-- Insert default settings
INSERT OR IGNORE INTO settings (id) VALUES (1);
```

---

## Implementation Tasks

### Phase 1: Foundation (Tasks 1-10)

```yaml
Task 1.1: Scaffold electron-vite project
CREATE: Project directory with electron-vite template
  - RUN: npm create @quick-start/electron@latest eidolon -- --template react-ts
  - VERIFY: npm run dev launches Electron window
  - KEEP: Default project structure

Task 1.2: Configure Tailwind CSS with design tokens
MODIFY: tailwind.config.js
  - ADD: CSS variable references for all colors from design system
  - ADD: Custom fonts (Satoshi, General Sans, JetBrains Mono)
  - PATTERN: Use docs/eidolon-design-system-UIUX-spec.md Section 2-5

CREATE: src/renderer/src/index.css
  - ADD: All CSS variables from design system (--bg-base, --accent-primary, etc.)
  - ADD: @font-face declarations
  - ADD: Base styles for dark theme

Task 1.3: Install and configure shadcn/ui
RUN: bunx shadcn@latest init
  - CHOOSE: style=new-york, baseColor=zinc, cssVariables=yes

RUN: bunx shadcn@latest add button input textarea select dropdown-menu dialog sheet toast tooltip tabs scroll-area separator skeleton command

MODIFY: components.json and component files
  - UPDATE: CSS variable names to match Eidolon design system

Task 1.4: Set up type-safe IPC
INSTALL: @electron-toolkit/typed-ipc @electron-toolkit/preload

CREATE: src/preload/index.ts
  - PATTERN: Use contextBridge.exposeInMainWorld
  - ADD: Individual methods for each IPC channel
  - NEVER: Expose full ipcRenderer

CREATE: src/preload/types.ts
  - ADD: ElectronAPI interface (from Data Models above)

CREATE: src/main/ipc/index.ts
  - ADD: Handler registration for all IPC channels

Task 1.5: Install and rebuild better-sqlite3
RUN: npm install --save better-sqlite3
RUN: npm install --save-dev @electron/rebuild

MODIFY: package.json
  - ADD: "postinstall": "electron-rebuild -f -w better-sqlite3"
  - ADD: "rebuild": "electron-rebuild -f -w better-sqlite3"

RUN: npm run rebuild
  - VERIFY: No errors during rebuild

Task 1.6: Create database schema and migrations
CREATE: src/main/database/index.ts
  - PATTERN: Singleton database connection
  - USE: better-sqlite3 with WAL mode
  - STORE: Database in app.getPath('userData')

CREATE: src/main/database/schema.ts
  - IMPLEMENT: All tables from schema above
  - ADD: Migration versioning

CREATE: src/main/database/migrations.ts
  - PATTERN: Check version, apply new migrations
  - RUN: On app startup

Task 1.7: Implement core data models
CREATE: src/main/database/queries/conversations.ts
  - ADD: list(), get(), create(), update(), delete()
  - USE: Prepared statements

CREATE: src/main/database/queries/messages.ts
  - ADD: list(), create(), search()
  - USE: FTS5 for search

CREATE: src/main/database/queries/documents.ts
  - ADD: list(), get(), create(), update(), delete()

CREATE: src/main/database/queries/versions.ts
  - ADD: list(), create(), get()

CREATE: src/main/database/queries/branches.ts
  - ADD: list(), create(), delete()

Task 1.8: Create OpenRouter API client
CREATE: src/main/services/openrouter.ts
  - IMPLEMENT: streamChat() with SSE parsing
  - IMPLEMENT: listModels()
  - PATTERN: Handle SSE comments (lines starting with :)
  - PATTERN: Terminate on data: [DONE]
  - USE: AbortController for cancellation

PSEUDOCODE:
```typescript
export async function streamChat(
  apiKey: string,
  modelId: string,
  messages: Array<{role: string, content: string}>,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://eidolon.app',
      'X-Title': 'Eidolon',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      stream: true,
      streamOptions: { includeUsage: true }
    }),
    signal
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith(':')) continue; // Skip SSE comments
      if (!line.startsWith('data: ')) continue;

      const data = line.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk({
            id: parsed.id,
            content,
            finishReason: parsed.choices[0].finish_reason,
            usage: parsed.usage
          });
        }
      } catch (e) {
        // Skip malformed JSON
      }
    }
  }
}
```

Task 1.9: Set up Zustand stores
INSTALL: zustand

CREATE: src/renderer/src/stores/useAppStore.ts
  - ADD: currentView ('chat' | 'writer' | 'settings')
  - ADD: sidebarExpanded boolean
  - USE: persist middleware with localStorage

CREATE: src/renderer/src/stores/useChatStore.ts
  - ADD: conversations list
  - ADD: currentConversationId
  - ADD: messages map by conversationId
  - ADD: streamingContent for active stream

CREATE: src/renderer/src/stores/useDocumentStore.ts
  - ADD: documents list
  - ADD: currentDocumentId
  - ADD: currentBranchId
  - ADD: versions map

CREATE: src/renderer/src/stores/useSettingsStore.ts
  - ADD: settings object
  - ADD: hasApiKey boolean
  - USE: persist middleware

Task 1.10: Build app shell with sidebar layout
CREATE: src/renderer/src/components/layout/AppShell.tsx
  - PATTERN: Flexbox layout with sidebar + main content
  - USE: Design system layout constants (--sidebar-width: 260px)
  - ADD: Traffic light buttons area for macOS

CREATE: src/renderer/src/components/layout/Sidebar.tsx
  - SECTIONS: Logo, New Chat button, Search, Navigation tabs, Item list
  - PATTERN: Collapsible (260px → 56px)
  - USE: Keyboard shortcut Cmd+B to toggle

CREATE: src/renderer/src/components/layout/Header.tsx
  - ADD: Toolbar area for context-specific actions
  - PATTERN: 48px height

CREATE: src/renderer/src/components/layout/StatusBar.tsx
  - ADD: Bottom status bar (28px)
  - SHOW: Connection status, model info, token count
```

---

### Phase 2: Chat Core (Tasks 11-22)

```yaml
Task 2.1: Create message input component
CREATE: src/renderer/src/components/chat/MessageInput.tsx
  - FEATURES: Auto-resize textarea (up to 200px)
  - ADD: Attachment button (left, placeholder for future)
  - ADD: Model selector (right)
  - ADD: Send button (appears when content present)
  - KEYBOARD: Enter or Cmd+Enter to send (configurable)
  - ADD: Character count for long messages

Task 2.2: Implement markdown rendering
INSTALL: react-markdown remark-gfm rehype-raw rehype-sanitize

CREATE: src/renderer/src/lib/markdown.ts
  - CONFIGURE: remark-gfm for GFM support
  - ADD: Custom components for headings, code, links
  - PATTERN: Sanitize HTML but allow safe elements

CREATE: src/renderer/src/components/chat/MarkdownContent.tsx
  - USE: react-markdown with configured plugins
  - STYLE: Match design system typography

Task 2.3: Add syntax highlighting
INSTALL: shiki

CREATE: src/renderer/src/lib/highlighter.ts
  - PRELOAD: Common languages (js, ts, python, css, html, json, bash)
  - THEME: Create custom theme matching Eidolon palette
  - CACHE: Highlighter instance

MODIFY: MarkdownContent.tsx
  - ADD: Custom code block component with Shiki
  - ADD: Copy button for code blocks
  - ADD: Language label

Task 2.4: Build model selector dropdown
CREATE: src/renderer/src/components/chat/ModelSelector.tsx
  - PATTERN: Command component (shadcn/ui) with search
  - SECTIONS: Favorites (pinned), then grouped by provider
  - SHOW: Model name, pricing, context window on hover
  - ADD: Star button to favorite models
  - PERSIST: Favorites to settings

CREATE: src/renderer/src/hooks/useModels.ts
  - USE: TanStack Query for fetching model list
  - CACHE: 1 hour, refresh on app start
  - TRANSFORM: Group by provider

Task 2.5: Implement streaming response display
CREATE: src/renderer/src/components/chat/MessageItem.tsx
  - VARIANT: User message (right-aligned, elevated bg)
  - VARIANT: Assistant message (left-aligned, accent border)
  - SHOW: Model name and timestamp
  - ADD: Message actions (copy, regenerate, delete)

CREATE: src/renderer/src/components/chat/StreamingCursor.tsx
  - PATTERN: Blinking cursor during streaming
  - ANIMATE: Per design system (--duration-normal)

CREATE: src/renderer/src/hooks/useChat.ts
  - MANAGE: Streaming state
  - CONNECT: IPC for chunk events
  - ACCUMULATE: Content in store
  - CLEANUP: Remove listeners on unmount

Task 2.6: Create conversation sidebar
CREATE: src/renderer/src/components/chat/ConversationList.tsx
  - PATTERN: Virtualized list for performance (use @tanstack/react-virtual)
  - SHOW: Title, last message preview, timestamp
  - SORT: Most recent first
  - ADD: Hover actions (rename, delete)
  - HIGHLIGHT: Active conversation

Task 2.7: Implement conversation CRUD
CREATE: src/main/ipc/conversations.ts
  - REGISTER: handlers for list, get, create, update, delete
  - USE: Database queries

CREATE: src/main/ipc/messages.ts
  - REGISTER: handlers for list, create, search
  - USE: FTS5 for search

MODIFY: useChatStore.ts
  - ADD: Actions for CRUD operations
  - CALL: IPC methods

Task 2.8: Build settings panel UI
CREATE: src/renderer/src/components/settings/SettingsView.tsx
  - LAYOUT: Sections in scroll area
  - SECTIONS: API Keys, Appearance, Behavior, Keyboard Shortcuts

CREATE: src/renderer/src/components/settings/ApiKeySection.tsx
  - INPUT: Secure input for OpenRouter key (masked)
  - BUTTON: Save (validates key with test API call)
  - BUTTON: Remove key
  - STATUS: Show if key is valid

CREATE: src/renderer/src/components/settings/AppearanceSection.tsx
  - THEME: Dark/Light/System selector
  - ACCENT: Color picker with presets
  - FONT SIZE: Small/Medium/Large

CREATE: src/renderer/src/components/settings/BehaviorSection.tsx
  - SEND: Enter or Cmd+Enter toggle
  - AUTO-SAVE: Interval selector
  - TOKENS: Show/hide toggle
  - COST: Show/hide toggle

Task 2.9: Implement secure API key storage
CREATE: src/main/services/secure-storage.ts
  - USE: Electron safeStorage API
  - ENCRYPT: Key before storing to file
  - DECRYPT: Key when needed for API calls
  - NEVER: Return full key to renderer

MODIFY: src/main/ipc/settings.ts
  - ADD: setApiKey handler (encrypt and store)
  - ADD: removeApiKey handler
  - ADD: get handler (return hasApiKey boolean, not the key)
  - ADD: validateApiKey (test API call)

Task 2.10: Add model list fetching and caching
MODIFY: src/main/services/openrouter.ts
  - ADD: listModels() function
  - CACHE: In-memory with 1 hour TTL
  - REFRESH: On first request or manual refresh

CREATE: src/main/ipc/models.ts
  - REGISTER: list and refresh handlers

Task 2.11: Token counting and cost estimation
INSTALL: tiktoken (or use GPT-tokenizer for browser)

CREATE: src/renderer/src/lib/tokens.ts
  - FUNCTION: countTokens(text, model)
  - FUNCTION: estimateCost(inputTokens, outputTokens, model)

MODIFY: MessageItem.tsx
  - SHOW: Token count if enabled in settings
  - SHOW: Estimated cost if enabled

Task 2.12: Basic keyboard shortcuts
CREATE: src/renderer/src/hooks/useKeyboard.ts
  - Cmd+N: New conversation
  - Cmd+B: Toggle sidebar
  - Escape: Stop generation
  - Cmd+,: Open settings
  - /: Focus message input

REGISTER: Global keyboard handlers in AppShell
```

---

### Phase 3: Writer's Studio (Tasks 23-37)

```yaml
Task 3.1: Install and configure Tiptap
INSTALL: @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-character-count

CREATE: src/renderer/src/components/writer/Editor.tsx
  - USE: useEditor hook with StarterKit
  - ADD: Placeholder extension
  - ADD: CharacterCount extension
  - STYLE: Match design system editor styles
  - DEBOUNCE: Content changes for auto-save

Task 3.2: Create document management sidebar
CREATE: src/renderer/src/components/writer/DocumentList.tsx
  - PATTERN: Similar to ConversationList
  - SHOW: Title, last modified, word count
  - ADD: Hover actions (rename, delete)
  - ADD: New Document button

Task 3.3: Implement auto-save with debounce
CREATE: src/renderer/src/hooks/useAutoSave.ts
  - DEBOUNCE: 2 seconds after last change
  - SAVE: Create new version if content changed
  - SHOW: "Saving..." / "Saved" indicator
  - CONFIGURABLE: Interval from settings

Task 3.4: Build formatting toolbar
CREATE: src/renderer/src/components/writer/EditorToolbar.tsx
  - BUTTONS: Bold, Italic, Heading dropdown, Lists, Blockquote, Code
  - PATTERN: Toggle buttons show active state
  - KEYBOARD: Show shortcuts in tooltips
  - SEPARATOR: Before AI Review and History buttons

Task 3.5: Create version history data layer
MODIFY: src/main/database/queries/versions.ts
  - ADD: getLatestVersion(branchId)
  - ADD: getVersionsBefore(branchId, timestamp)
  - ADD: compareVersions(v1Id, v2Id)

CREATE: src/renderer/src/hooks/useVersionHistory.ts
  - FETCH: Versions for current branch
  - ACTIONS: Restore version, compare versions

Task 3.6: Build version history UI panel
CREATE: src/renderer/src/components/writer/VersionHistory.tsx
  - LAYOUT: Right panel (280px), collapsible
  - PATTERN: Timeline with dots and lines
  - SHOW: Timestamp, commit message, word count delta
  - CLICK: View version (read-only)
  - BUTTON: Restore (creates new version from old content)
  - BUTTON: Compare (opens diff view)

Task 3.7: Implement AI review prompt modal
CREATE: src/renderer/src/components/writer/ReviewModal.tsx
  - TRIGGER: Cmd+Shift+R or Review button
  - OPTIONS: Grammar, Clarity, Tone, Style, Custom
  - INPUT: Custom prompt field
  - BUTTON: Request Review
  - ACTION: Send document + prompt to AI, show diff when done

Task 3.8: Integrate jsdiff for text comparison
INSTALL: diff

CREATE: src/renderer/src/hooks/useDiff.ts
  - FUNCTION: computeDiff(oldText, newText): DiffChange[]
  - USE: diffLines from 'diff' package
  - TRANSFORM: To DiffChange[] format

Task 3.9: Build diff view component
CREATE: src/renderer/src/components/writer/DiffView.tsx
  - LAYOUT: Split view (left: current, right: suggested)
  - SYNC: Scroll positions (toggleable)
  - HIGHLIGHT: Additions (green), Deletions (red), Modifications (yellow)
  - NAVIGATION: Cmd+↓/↑ to jump between changes
  - COUNTER: "Change 3 of 12"

STYLES: Add to index.css
  - .diff-add: rgba(0, 212, 170, 0.15) with green border
  - .diff-delete: rgba(224, 64, 160, 0.15) with red border

Task 3.10: Implement accept/reject changes workflow
CREATE: src/renderer/src/components/writer/SuggestionPanel.tsx
  - BUTTONS: Accept, Reject, Accept All, Reject All
  - INLINE: Per-change accept/reject buttons
  - ACTION: Apply accepted changes to document
  - SAVE: Create new version after applying changes

Task 3.11: Add branch data model
MODIFY: Document type and queries
  - ADD: branches array to document
  - ADD: currentBranchId tracking
  - IMPLEMENT: Branch CRUD in database queries

Task 3.12: Create branch management UI
CREATE: src/renderer/src/components/writer/BranchManager.tsx
  - DROPDOWN: Current branch name with switch action
  - BUTTON: New Branch (opens name dialog)
  - TREE: Visual branch hierarchy
  - ACTIONS: Delete branch (except main)

Task 3.13: Implement branch switching
MODIFY: useDocumentStore.ts
  - ACTION: switchBranch(branchId)
  - LOAD: Latest version from new branch
  - UPDATE: currentBranchId

Task 3.14: Build merge UI with conflict resolution
CREATE: src/renderer/src/components/writer/MergeView.tsx
  - TRIGGER: From branch manager
  - SELECT: Source branch → Target branch
  - SHOW: Three-way diff if conflicts
  - RESOLVE: Manual editing for conflicts
  - COMPLETE: Create merged version on target branch

Task 3.15: Add zen mode toggle
CREATE: src/renderer/src/hooks/useZenMode.ts
  - TOGGLE: Cmd+Shift+Z
  - HIDE: All UI except editor
  - STYLE: Darker background, centered editor
  - EXIT: Escape key or click outside
```

---

### Phase 4: Polish (Tasks 38-47)

```yaml
Task 4.1: Implement all keyboard shortcuts
MODIFY: useKeyboard.ts
  - ADD: All shortcuts from design system spec
  - GLOBAL: Cmd+N, Cmd+Shift+N, Cmd+K, Cmd+,, Cmd+B, Escape
  - CHAT: Enter/Cmd+Enter, /, Cmd+Shift+C
  - EDITOR: Cmd+S, Cmd+Shift+R, Cmd+H, formatting shortcuts

Task 4.2: Build command palette
CREATE: src/renderer/src/components/shared/CommandPalette.tsx
  - TRIGGER: Cmd+K
  - PATTERN: Command component from shadcn/ui
  - ACTIONS: All major actions searchable
  - RECENT: Show recently used commands
  - KEYBOARD: Navigate with arrows, execute with Enter

Task 4.3: Create empty states with Tweek illustrations
CREATE: src/renderer/src/components/shared/EmptyState.tsx
  - VARIANTS: No conversations, No documents, No search results
  - IMAGE: Tweek illustration (placeholder SVG initially)
  - TEXT: Encouraging message + primary action button
  - PATTERN: Follow design system empty state specs

Task 4.4: Implement loading states and skeletons
CREATE: src/renderer/src/components/shared/LoadingState.tsx
  - PAGE: Full page loading with Tweek + progress bar
  - SKELETON: Use shadcn skeleton component
  - STREAMING: Cursor animation during AI response

Task 4.5: Add error handling and toast notifications
SETUP: Toast provider from shadcn/ui

CREATE: src/renderer/src/components/shared/ErrorBoundary.tsx
  - CATCH: React errors
  - SHOW: Error page with Tweek (concerned)
  - ACTIONS: Retry, Go Home

CREATE: src/renderer/src/hooks/useToast.ts
  - WRAPPER: Around shadcn toast
  - VARIANTS: Success, Error, Warning, Info
  - STYLE: Match design system toast specs

Task 4.6: Performance optimization
IMPLEMENT:
  - React.lazy for route-level code splitting
  - useMemo/useCallback for expensive computations
  - Virtual scrolling for conversation/document lists
  - Debounce for search input
  - Image lazy loading (future)

MEASURE:
  - App launch time (target < 3s)
  - First contentful paint
  - Memory usage

Task 4.7: Configure electron-builder for packaging
CREATE: electron-builder.json5
  - APP_ID: com.eidolon.app
  - PRODUCT_NAME: Eidolon
  - DIRECTORIES: output to dist
  - MAC: dmg and zip targets, universal binary
  - WINDOWS: nsis installer
  - LINUX: AppImage and deb

MODIFY: package.json
  - ADD: "build": "electron-vite build && electron-builder"
  - ADD: "build:mac", "build:win", "build:linux"

Task 4.8: Create installer assets and icons
CREATE: resources/icon.png (512x512)
  - DESIGN: Pirate ship with Tweek silhouette

GENERATE: Using png-to-icns and png-to-ico
  - icon.icns for macOS
  - icon.ico for Windows

Task 4.9: Test on Windows, macOS, Linux
RUN: Build on each platform
VERIFY:
  - App launches correctly
  - Native modules work (SQLite)
  - File paths work (userData)
  - Keyboard shortcuts work (Cmd vs Ctrl)
  - Window chrome matches platform

Task 4.10: Final QA and bug fixes
CHECKLIST:
  - [ ] All MVP features functional
  - [ ] No console errors
  - [ ] No TypeScript errors
  - [ ] All tests passing
  - [ ] Memory leaks checked
  - [ ] Accessibility basics (keyboard nav, focus states)
```

---

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run after every file change
npx tsc --noEmit                    # TypeScript check
npx eslint src --ext .ts,.tsx       # Linting
npx prettier --check src            # Formatting

# Expected: No errors
# If errors: Read message, fix code, re-run
```

### Level 2: Unit Tests
```bash
# Run for each component/hook
npm run test -- --watch

# Test file structure
# tests/renderer/components/chat/MessageInput.test.tsx
# tests/main/services/openrouter.test.ts
```

```typescript
// Example test patterns
describe('MessageInput', () => {
  it('submits message on Enter when sendOnEnter is true', () => {
    // Render with settings
    // Type message
    // Press Enter
    // Assert onSubmit called
  });

  it('does not submit empty messages', () => {
    // Render
    // Press Enter without typing
    // Assert onSubmit not called
  });

  it('expands textarea up to max height', () => {
    // Render
    // Type long message
    // Assert height increases
    // Assert max height not exceeded
  });
});

describe('OpenRouter streaming', () => {
  it('parses SSE chunks correctly', async () => {
    // Mock fetch with SSE response
    // Call streamChat
    // Assert onChunk called with parsed content
  });

  it('handles SSE comments gracefully', async () => {
    // Mock fetch with comment lines
    // Assert no errors, comments skipped
  });

  it('terminates on [DONE]', async () => {
    // Mock fetch with [DONE] message
    // Assert stream ends cleanly
  });
});
```

### Level 3: Integration Tests
```bash
# Start app in dev mode
npm run dev

# Manual test checklist:
# [ ] Create new conversation
# [ ] Send message, verify streaming
# [ ] Switch models mid-conversation
# [ ] Create new document
# [ ] Type content, verify auto-save
# [ ] Request AI review, verify diff view
# [ ] Accept/reject changes
# [ ] Create branch, switch branches
# [ ] Search conversations
# [ ] Change settings, verify persistence
```

### Level 4: Build & Package Tests
```bash
# Build for current platform
npm run build

# Verify build output
ls -la dist/

# Run packaged app
# macOS: open dist/mac-arm64/Eidolon.app
# Windows: dist/win-unpacked/Eidolon.exe
# Linux: dist/linux-unpacked/eidolon

# Verify:
# [ ] App launches
# [ ] Database created in userData
# [ ] Settings persist after restart
# [ ] No console errors in production
```

---

## Final Validation Checklist

### Functional Requirements
- [ ] Chat: Send message and receive streaming response
- [ ] Chat: Switch between OpenRouter models
- [ ] Chat: Conversations persist between sessions
- [ ] Chat: Search across all conversations
- [ ] Chat: Keyboard shortcuts work (Cmd+N, Escape, etc.)
- [ ] Writer: Create and edit documents
- [ ] Writer: Auto-save creates versions
- [ ] Writer: View and restore version history
- [ ] Writer: AI review shows diff view
- [ ] Writer: Accept/reject individual changes
- [ ] Writer: Create and switch branches
- [ ] Settings: API key stored securely
- [ ] Settings: Theme and preferences persist

### Quality Requirements
- [ ] TypeScript: No errors (`npx tsc --noEmit`)
- [ ] Linting: No errors (`npx eslint src`)
- [ ] Tests: All passing (`npm test`)
- [ ] Performance: Launch < 3s, first token < 500ms
- [ ] Memory: No obvious leaks after 30min use
- [ ] Accessibility: Keyboard navigation works

### Platform Requirements
- [ ] macOS: Builds and runs (Intel + Apple Silicon)
- [ ] Windows: Builds and runs (x64)
- [ ] Linux: Builds and runs (AppImage)

---

## Anti-Patterns to Avoid

- ❌ Don't expose full ipcRenderer via contextBridge
- ❌ Don't use sync file operations in renderer process
- ❌ Don't store API key in plain text (use safeStorage)
- ❌ Don't skip SSE comment handling (lines starting with :)
- ❌ Don't forget to run electron-rebuild after npm install
- ❌ Don't put spaces in project directory path
- ❌ Don't use Tiptap Pro/Enterprise features (they're paid)
- ❌ Don't create massive components - split into smaller pieces
- ❌ Don't ignore TypeScript errors - fix them immediately
- ❌ Don't add features beyond MVP scope

---

## Confidence Score: 8/10

### Strengths
- **Comprehensive Documentation**: All major libraries have excellent docs
- **Clear Requirements**: PRD specifies features in detail
- **Proven Patterns**: Electron + React is well-established
- **Design System**: Complete design tokens and component specs provided

### Risks
- **Tiptap AI**: Must build custom AI review (not using paid features)
- **Native Modules**: better-sqlite3 rebuild can be tricky
- **IPC Streaming**: Custom pattern needed for SSE through IPC
- **Cross-Platform**: Platform-specific quirks may arise

### Mitigation
- Use jsdiff for text comparison (well-tested, 7500+ dependents)
- Follow electron-rebuild docs carefully
- Test streaming IPC pattern early in Phase 1
- Build and test on all platforms in Phase 4

---

*End of PRP*
