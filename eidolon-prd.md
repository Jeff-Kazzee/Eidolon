# Eidolon - Product Requirements Document

**Version:** 0.2.0  
**Last Updated:** December 31, 2024  
**Author:** Jeff Kazzee  
**Status:** Draft

---

## 1. Executive Summary

Eidolon is a desktop AI assistant application built with Electron that combines conversational AI chat with specialized creative studios for writing and image generation. It provides a familiar chat-centric experience (inspired by T3.chat) while offering unique tools for iterative creative work—particularly a Writer's Studio with git-style version control for prose.

**One-liner:** A caffeinated desktop AI companion for builders who ship, featuring chat, writing studio with version control, and image generation.

**Mascot:** Tweek the Sloth - perpetually caffeinated, wears a "Ship it" shirt, lives on a pirate ship.

---

## 2. Problem Statement

### The Problem

Creative professionals and indie developers using AI assistants face a fragmented workflow: they chat with AI for brainstorming, switch to separate tools for writing drafts, and lack any systematic way to iterate on AI-assisted content. When an AI suggests revisions to a document, there's no easy way to compare versions, branch into different directions, or maintain history.

### Current Solutions & Their Limitations

| Solution | Limitation |
|----------|------------|
| ChatGPT / Claude Web | No local file management, no version history, conversation-centric not document-centric |
| T3.chat | Great multi-model chat, but no creative studio features |
| Notion AI | Locked into Notion ecosystem, no model choice, cloud-only |
| Cursor / Cline | Code-focused, not optimized for prose |
| Git + Markdown | Technical barrier, no AI integration, not writer-friendly |

### Why Now?

- OpenRouter provides unified access to all major AI models via single API
- Electron enables rich desktop experiences with full system access
- "Vibe coding" practitioners need tools that bridge AI chat and creative output
- No existing solution treats AI-assisted writing as a first-class iterative process
- Growing demand for local-first, privacy-respecting AI tools

---

## 3. Goals & Success Metrics

### Primary Goal

Create a desktop AI application that feels as familiar as T3.chat while adding specialized creative workflows that don't exist elsewhere.

### Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| MVP Feature Completion | 100% Tier 1 features working | 10 weeks |
| Personal Daily Usage | Used daily by creator | 2 weeks post-MVP |
| Writer's Studio Adoption | 50%+ sessions use studio features | 4 weeks post-MVP |
| GitHub Stars | 100+ | 8 weeks post-launch |
| Active Users (BYOK) | 500+ | 12 weeks post-launch |

### Non-Goals (Explicitly Out of Scope)

- Mobile app (desktop-first, always)
- Team collaboration / real-time multiplayer
- Cloud sync of conversations (local-first for MVP)
- Plugin/extension system
- Voice input/output
- Local model inference (cloud API only for v1)
- Monetization / paid features (free BYOK model)

---

## 4. User Personas

### Primary Persona: The Vibe Coder

- **Who:** Self-taught developer who uses AI assistants extensively for coding and creative work. Comfortable with modern dev tools but not traditional writing software.
- **Goals:** Build portfolio projects, create content, iterate on ideas quickly without context-switching between apps.
- **Pain Points:** Loses track of AI conversation history, can't easily compare draft versions, frustrated by generic chat interfaces that all look the same.
- **Tech Comfort:** High (uses CLI, multiple AI tools, understands APIs, comfortable with BYOK)
- **Quote:** "I want my AI assistant to understand that writing is iterative, not a one-shot prompt."

### Secondary Persona: The Indie Creator

- **Who:** Blogger, newsletter writer, or content creator who uses AI for drafting and editing but isn't deeply technical.
- **Goals:** Produce polished written content faster, maintain consistent voice across revisions, try different approaches without losing work.
- **Pain Points:** Current AI tools treat every response as final, no way to "save progress" on a document being refined.
- **Tech Comfort:** Medium (uses apps, comfortable getting API keys, uncomfortable with code)
- **Quote:** "I need to try three different angles on this intro—show me all of them."

### Tertiary Persona: The Power User

- **Who:** Developer or researcher who wants maximum control over AI interactions, uses multiple models strategically.
- **Goals:** Compare model outputs, optimize prompts, build workflows that leverage AI capabilities.
- **Pain Points:** Web interfaces are limiting, wants keyboard-first experience, needs local data ownership.
- **Tech Comfort:** Very High (wants customization, system prompts, keyboard shortcuts)
- **Quote:** "I switch between Claude and GPT depending on the task—I need that flexibility."

---

## 5. User Stories & Requirements

### Epic 1: Core Chat Experience

#### Story 1.1: Basic Conversation
**As a** user  
**I want to** have a conversation with an AI model  
**So that** I can get answers, brainstorm, and interact naturally.

**Acceptance Criteria:**
- [ ] Can type message in input field and submit with Enter or Cmd+Enter (configurable)
- [ ] Response streams in real-time with visible typing indicator
- [ ] Response renders markdown correctly (headings, bold, italic, code blocks, lists, tables)
- [ ] Code blocks have syntax highlighting and copy button
- [ ] Can see which model generated each response
- [ ] Can stop generation mid-stream with Escape key
- [ ] Conversation persists locally between app sessions

**Technical Notes:**
- Use streaming API from OpenRouter
- Markdown rendering with remark/rehype or marked
- Syntax highlighting with Shiki or Prism
- Store messages in SQLite with conversation_id foreign key

#### Story 1.2: Model Selection
**As a** user  
**I want to** switch between different AI models  
**So that** I can use the right model for each task.

**Acceptance Criteria:**
- [ ] Dropdown/selector shows available models grouped by provider
- [ ] Can search/filter models by name
- [ ] Can change model mid-conversation
- [ ] Model selection persists as default preference
- [ ] Shows model info on hover: context window, pricing, capabilities
- [ ] Displays estimated cost per message (input + output tokens)
- [ ] Favorite models pinned to top of list

**Technical Notes:**
- Fetch model list from OpenRouter /models endpoint
- Cache locally, refresh on app start
- Track token usage for cost estimation

#### Story 1.3: API Key Management
**As a** user  
**I want to** configure my OpenRouter API key securely  
**So that** I can access AI models.

**Acceptance Criteria:**
- [ ] Settings page with secure input for OpenRouter key
- [ ] Key stored encrypted using Electron safeStorage
- [ ] Validation that key works before saving (test API call)
- [ ] Clear error messages for auth failures
- [ ] Key never displayed in plain text after entry
- [ ] Option to remove/reset key

**Technical Notes:**
- Use Electron's safeStorage API for encryption
- Validate with lightweight API call to OpenRouter
- Consider keytar for cross-platform keychain access

#### Story 1.4: Conversation Management
**As a** user  
**I want to** organize and search my conversations  
**So that** I can find past discussions.

**Acceptance Criteria:**
- [ ] Sidebar shows conversation history with titles
- [ ] Auto-generate title from first message (or AI-generated summary)
- [ ] Can manually rename conversations
- [ ] Can delete conversations with confirmation
- [ ] Can search across all conversations (full-text)
- [ ] Conversations sorted by last updated (most recent first)
- [ ] Can create new conversation with Cmd+N
- [ ] Visual indicator for active conversation

**Technical Notes:**
- SQLite FTS5 for full-text search
- Title generation: first 50 chars of first message, or call AI for summary

#### Story 1.5: Message Actions
**As a** user  
**I want to** perform actions on individual messages  
**So that** I can copy, edit, or regenerate responses.

**Acceptance Criteria:**
- [ ] Copy message content to clipboard
- [ ] Copy code blocks individually
- [ ] Edit user messages (creates new branch in conversation)
- [ ] Regenerate AI response with same prompt
- [ ] Delete message pair (user + AI response)
- [ ] Actions visible on hover, keyboard accessible

---

### Epic 2: Writer's Studio

#### Story 2.1: Document Management
**As a** writer  
**I want to** create and manage documents in the Writer's Studio  
**So that** I can work on long-form content with AI assistance.

**Acceptance Criteria:**
- [ ] "New Document" action creates blank document
- [ ] Document has editable title and content areas
- [ ] Can import text from clipboard or .txt/.md file
- [ ] Auto-save every 30 seconds (configurable)
- [ ] Manual save with Cmd+S
- [ ] Documents listed in studio sidebar with last modified date
- [ ] Can delete documents with confirmation
- [ ] Visual indicator for unsaved changes

**Technical Notes:**
- Store documents in SQLite with version history
- Use debounced auto-save to avoid excessive writes

#### Story 2.2: Rich Text Editor
**As a** writer  
**I want to** write and format text comfortably  
**So that** I can focus on content creation.

**Acceptance Criteria:**
- [ ] Clean, distraction-free writing interface
- [ ] Basic formatting: bold, italic, headings (H1-H3)
- [ ] Lists (bulleted and numbered)
- [ ] Block quotes
- [ ] Code blocks (inline and fenced)
- [ ] Keyboard shortcuts for all formatting (Cmd+B, Cmd+I, etc.)
- [ ] Word count and character count display
- [ ] Zen mode (hide all UI except editor)

**Technical Notes:**
- Use Tiptap with ProseMirror foundation
- Configure for prose-focused editing, not code
- Minimal toolbar, rely on keyboard shortcuts

#### Story 2.3: AI Review & Suggestions
**As a** writer  
**I want to** ask the AI to review and suggest edits to my document  
**So that** I can improve my writing.

**Acceptance Criteria:**
- [ ] "Review" button opens review configuration modal
- [ ] Can select review focus: Grammar, Clarity, Tone, Style, or Custom
- [ ] Custom prompt field for specific instructions
- [ ] AI suggestions appear in side-by-side comparison view
- [ ] Changes highlighted: additions (green), deletions (red), modifications (yellow)
- [ ] Can accept/reject individual changes
- [ ] Can accept all or reject all
- [ ] Review creates new version in history
- [ ] Can request re-review with different parameters

**Technical Notes:**
- Use Tiptap's suggestion/track-changes mode
- Diff algorithm: jsdiff or diff-match-patch
- Send entire document to AI with review prompt

#### Story 2.4: Version History
**As a** writer  
**I want to** see the history of changes to my document  
**So that** I can track how it evolved and restore previous versions.

**Acceptance Criteria:**
- [ ] Every save creates a version snapshot
- [ ] Version history panel shows all versions with timestamps
- [ ] Version entries show commit message (auto or manual)
- [ ] Can view any previous version (read-only)
- [ ] Can restore any previous version (creates new version)
- [ ] Can compare any two versions side-by-side with diff
- [ ] Can hard-delete old versions to save space
- [ ] Version count displayed in document header

**Technical Notes:**
- Store full content snapshots in SQLite (simple, reliable)
- Consider delta compression for large documents
- Limit to last 100 versions by default

#### Story 2.5: Document Branching
**As a** writer  
**I want to** branch my document into different directions  
**So that** I can explore multiple approaches without losing work.

**Acceptance Criteria:**
- [ ] "Branch" action creates new variant from current version
- [ ] Branch requires descriptive name
- [ ] Branch tree visualization shows all variants
- [ ] Can switch between branches
- [ ] Active branch indicated in header
- [ ] Can merge branches (select source → target)
- [ ] Merge shows conflicts for manual resolution
- [ ] Can delete abandoned branches
- [ ] Main branch cannot be deleted

**Technical Notes:**
- Git-inspired data model: documents have branches, branches have versions
- Merge conflicts: show both versions, user picks or edits

#### Story 2.6: Side-by-Side Comparison
**As a** writer  
**I want to** see my current version next to a suggested revision or previous version  
**So that** I can evaluate changes.

**Acceptance Criteria:**
- [ ] Split view with left/right panes
- [ ] Synchronized scrolling (can be toggled off)
- [ ] Diff highlighting shows additions, deletions, modifications
- [ ] Navigate between changes with keyboard (Cmd+↓/↑)
- [ ] Change count displayed ("Change 3 of 12")
- [ ] Inline accept/reject buttons for each change
- [ ] Can exit comparison to return to normal editing

---

### Epic 3: Image Studio

#### Story 3.1: Image Generation
**As a** user  
**I want to** generate images from text prompts  
**So that** I can create visuals for my projects.

**Acceptance Criteria:**
- [ ] Text input for image prompt with character count
- [ ] Model selector for available image models (DALL-E, Stable Diffusion, etc.)
- [ ] Settings panel: size, style, quality options (model-dependent)
- [ ] Generate button with loading state
- [ ] Progress indicator during generation
- [ ] Generated image displays immediately on completion
- [ ] Error handling with clear messages
- [ ] Can cancel in-progress generation

**Technical Notes:**
- Use OpenRouter for image models where available
- May need direct API integration for some providers
- Store generated images locally in app data folder

#### Story 3.2: Image Gallery
**As a** user  
**I want to** see all images I've generated  
**So that** I can browse and reuse them.

**Acceptance Criteria:**
- [ ] Grid view of all generated images (thumbnail size)
- [ ] Click to view full size in lightbox
- [ ] Shows prompt used for each image on hover
- [ ] Shows model, settings, and generation date
- [ ] Can download original image
- [ ] Can copy image to clipboard
- [ ] Can delete images
- [ ] Can favorite images (pinned to top)
- [ ] Filter by model or date range

**Technical Notes:**
- Store metadata in SQLite, images on filesystem
- Generate thumbnails for grid performance

#### Story 3.3: Prompt from Chat
**As a** user  
**I want to** send a prompt from chat directly to image generation  
**So that** I can quickly visualize ideas from conversation.

**Acceptance Criteria:**
- [ ] Context menu action on AI responses: "Generate Image from This"
- [ ] Extracts relevant text as image prompt
- [ ] Opens Image Studio with prompt pre-filled
- [ ] Generated image can be inserted back into chat
- [ ] Link maintained between chat message and generated image

---

### Epic 4: Settings & Customization

#### Story 4.1: Visual Customization
**As a** user  
**I want to** customize the app's appearance  
**So that** it matches my preferences.

**Acceptance Criteria:**
- [ ] Theme: Dark (default), Light, System
- [ ] Accent color selection (presets + custom)
- [ ] Font size adjustment (Small, Medium, Large)
- [ ] Font family selection for editor and code
- [ ] Sidebar position: Left (default) or Right
- [ ] Sidebar default state: Expanded or Collapsed
- [ ] Compact mode (reduced spacing)

#### Story 4.2: Behavior Settings
**As a** user  
**I want to** configure how the app behaves  
**So that** it works the way I prefer.

**Acceptance Criteria:**
- [ ] Default model selection
- [ ] Send message: Enter or Cmd+Enter
- [ ] Auto-save interval for documents (15s, 30s, 60s, off)
- [ ] Confirm before delete (conversations, documents)
- [ ] Show token count in messages
- [ ] Show estimated cost per message
- [ ] System prompt customization (global default)
- [ ] Per-conversation system prompt override

#### Story 4.3: Keyboard Shortcuts
**As a** power user  
**I want to** use keyboard shortcuts for common actions  
**So that** I can work efficiently.

**Acceptance Criteria:**
- [ ] Full keyboard shortcut reference in settings
- [ ] Customizable shortcuts for main actions
- [ ] Command palette (Cmd+K) for quick actions
- [ ] Shortcuts work globally within app
- [ ] Visual hints for shortcuts in menus

---

## 6. Feature Specifications

### Tier 1: Essential (MVP Must-Haves)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F1.1 | Chat Interface | Message input, streaming responses, markdown rendering | P0 |
| F1.2 | Model Selection | Choose from OpenRouter models with info display | P0 |
| F1.3 | Conversation Persistence | Save conversations to local SQLite | P0 |
| F1.4 | API Key Management | Secure storage and validation of OpenRouter key | P0 |
| F1.5 | Conversation Sidebar | List, search, create, delete conversations | P0 |
| F1.6 | Writer's Studio Editor | Basic rich text editing with Tiptap | P0 |
| F1.7 | AI Review | Send document for AI suggestions with diff view | P0 |
| F1.8 | Version History | Track and restore document versions | P0 |
| F1.9 | Settings Panel | API keys, appearance, behavior configuration | P0 |

### Tier 2: Valuable (Post-MVP)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F2.1 | Document Branching | Create and merge document variants | P1 |
| F2.2 | Image Generation | Text-to-image via OpenRouter/providers | P1 |
| F2.3 | Image Gallery | Browse, manage, download generated images | P1 |
| F2.4 | Chat-to-Image | Generate images from chat context | P1 |
| F2.5 | Conversation Search | Full-text search across all conversations | P1 |
| F2.6 | File Attachments | Attach images/documents to chat | P1 |
| F2.7 | Keyboard Shortcuts | Customizable shortcuts, command palette | P1 |
| F2.8 | Export | Export conversations/documents as markdown | P1 |

### Tier 3: Nice-to-Have (Future)

- System prompt presets library
- Conversation folders/tags
- Export to PDF
- Multiple API providers (direct Anthropic, OpenAI keys)
- Document templates
- Image editing tools
- Usage analytics dashboard
- Conversation sharing (generate link)

### Tier 4: Out of Scope (Not Building)

| Feature | Reason |
|---------|--------|
| Mobile app | Desktop-first focus |
| Cloud sync | Local-first architecture |
| Team collaboration | Single-user scope |
| Plugin system | Complexity, security concerns |
| Voice I/O | Adds significant complexity |
| Local models | Cloud API focus for v1 |
| Monetization | Free BYOK model |

---

## 7. Technical Architecture

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Electron 33+ | Mature, full Node.js access, proven for desktop apps |
| **Build Tool** | Vite | Fast HMR, excellent DX, works great with Electron |
| **Frontend** | React 18 + TypeScript | Familiar, large ecosystem, type safety |
| **Styling** | Tailwind CSS | Utility-first, fast iteration, design tokens via CSS vars |
| **Components** | shadcn/ui | Copy-paste components, full customization, accessible |
| **State** | Zustand | Simple, minimal boilerplate, works with React |
| **Server State** | TanStack Query | Caching, streaming, optimistic updates |
| **Database** | SQLite (better-sqlite3) | Embedded, fast, reliable, no server needed |
| **Editor** | Tiptap | ProseMirror-based, suggestion mode, extensible |
| **IPC** | Electron IPC | Type-safe with electron-trpc or custom |

### Data Models

```typescript
// Core entities
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  systemPrompt?: string;
  modelId?: string;
}

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelId?: string;
  tokenCount?: number;
  createdAt: Date;
}

interface Document {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  currentBranchId: string;
}

interface Branch {
  id: string;
  documentId: string;
  name: string;
  parentBranchId?: string;
  createdAt: Date;
}

interface Version {
  id: string;
  branchId: string;
  content: string;
  message?: string;
  createdAt: Date;
}

interface GeneratedImage {
  id: string;
  prompt: string;
  modelId: string;
  settings: Record<string, unknown>;
  filePath: string;
  thumbnailPath: string;
  createdAt: Date;
  favorite: boolean;
}

interface Settings {
  apiKeys: {
    openrouter?: string; // encrypted
  };
  defaults: {
    modelId: string;
    theme: 'dark' | 'light' | 'system';
    accentColor: string;
    sendOnEnter: boolean;
    autoSaveInterval: number;
  };
  // ... more settings
}
```

### Database Schema

```sql
-- Conversations
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  system_prompt TEXT,
  model_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_id TEXT,
  token_count INTEGER,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- Full-text search
CREATE VIRTUAL TABLE messages_fts USING fts5(
  content,
  content=messages,
  content_rowid=rowid
);

-- Documents
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  current_branch_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Branches
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_branch_id TEXT REFERENCES branches(id),
  created_at INTEGER NOT NULL
);

-- Versions
CREATE TABLE versions (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_versions_branch ON versions(branch_id);

-- Generated Images
CREATE TABLE generated_images (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  model_id TEXT NOT NULL,
  settings TEXT NOT NULL, -- JSON
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  favorite INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

### Security Considerations

| Concern | Mitigation |
|---------|------------|
| API Key Storage | Electron safeStorage (OS keychain) |
| IPC Security | Validate all IPC messages, no remote content |
| Content Security | CSP headers, no eval, no remote scripts |
| Data at Rest | SQLite on local filesystem, encrypted keys |
| Network | HTTPS only, certificate validation |

### Performance Requirements

| Metric | Target |
|--------|--------|
| App Launch | < 3 seconds to interactive |
| First Token | < 500ms after send (network permitting) |
| UI Responsiveness | 60fps during streaming |
| Database Queries | < 100ms for typical operations |
| Memory Usage | < 500MB typical, < 1GB maximum |
| Bundle Size | < 150MB (Electron overhead accepted) |

---

## 8. Dependencies & Integrations

### External Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| OpenRouter API | AI model access | Low - stable, well-documented |
| Electron | Desktop runtime | Low - very mature |
| better-sqlite3 | Database | Low - stable, performant |
| Tiptap | Rich text editor | Low - active development |

### npm Packages (Key)

```json
{
  "dependencies": {
    "electron": "^33.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^5.0.0",
    "better-sqlite3": "^11.0.0",
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^5.7.0",
    "electron-builder": "^25.0.0"
  }
}
```

---

## 9. Development Approach

### Agentic Development Guidelines

Following the "Just Talk To It" methodology:

1. **Parallel Agents:** Run 3-5 agents in same folder with shared dev server
2. **Screenshots:** Use screenshots for 50% of context engineering
3. **Short Prompts:** Better models need less verbose prompts
4. **Interrupt Freely:** Check status, redirect as needed
5. **Same-Context Testing:** Write tests immediately after features
6. **Refactoring Days:** 20% time on agent-driven cleanup
7. **CLI over MCP:** Use gh, bun, etc. instead of context-heavy MCPs

### Development Phases

**Phase 1: Foundation (Weeks 1-2)**
- [ ] Electron + Vite + React project setup
- [ ] Basic IPC architecture
- [ ] SQLite database setup with migrations
- [ ] OpenRouter API integration
- [ ] Basic chat interface (no persistence)

**Phase 2: Chat Core (Weeks 3-4)**
- [ ] Streaming responses with markdown
- [ ] Model selection UI
- [ ] Conversation persistence
- [ ] Sidebar navigation
- [ ] Settings panel with API key management

**Phase 3: Writer's Studio Core (Weeks 5-7)**
- [ ] Tiptap editor integration
- [ ] Document management (CRUD)
- [ ] AI review with diff view
- [ ] Version history
- [ ] Side-by-side comparison

**Phase 4: Polish & MVP (Weeks 8-10)**
- [ ] Visual polish and animations
- [ ] Keyboard shortcuts
- [ ] Bug fixes and edge cases
- [ ] Performance optimization
- [ ] Installer/packaging with electron-builder
- [ ] Basic documentation

**Phase 5: Tier 2 Features (Post-MVP)**
- [ ] Document branching
- [ ] Image Studio
- [ ] Full-text search
- [ ] File attachments
- [ ] Export functionality

---

## 10. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenRouter API changes | Low | Medium | Abstract API layer, version pinning |
| Electron bundle size | Certain | Low | Accept tradeoff, optimize later |
| Scope creep | High | High | Strict tier enforcement, weekly scope review |
| Tiptap complexity | Medium | Medium | Start simple, add features incrementally |
| Performance issues | Medium | Medium | Profile early, optimize hot paths |
| SQLite limitations | Low | Low | Simple schema, indexes, consider upgrade path |

---

## 11. Open Questions

- [ ] Should we support conversation forking (like document branching)?
- [ ] How to handle very long conversations that exceed context window?
- [ ] Image Studio: OpenRouter-only or direct provider integrations?
- [ ] Should auto-generated titles use AI or simple text extraction?
- [ ] What's the update/auto-update strategy for desktop app?

---

## 12. Appendix

### A. Keyboard Shortcuts (Planned)

| Action | Shortcut |
|--------|----------|
| New Chat | Cmd+N |
| New Document | Cmd+Shift+N |
| Send Message | Enter or Cmd+Enter |
| Search | Cmd+K |
| Settings | Cmd+, |
| Toggle Sidebar | Cmd+B |
| Stop Generation | Escape |
| Save Document | Cmd+S |
| AI Review | Cmd+Shift+R |

### B. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Dec 31, 2024 | Initial draft |
| 0.2.0 | Dec 31, 2024 | Updated to Electron, added technical architecture, expanded requirements |

---

*End of PRD*