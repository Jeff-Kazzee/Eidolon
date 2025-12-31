# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eidolon is a desktop AI assistant application built with Electron that combines conversational AI chat with specialized creative studios for writing and image generation. The mascot is Tweek the Sloth - a caffeinated sloth wearing a "Ship it" shirt who lives on a pirate ship.

**Status:** Planning/specification phase - no code exists yet.

## Technical Stack (Planned)

- **Runtime:** Electron 33+
- **Build Tool:** Vite 6+
- **Frontend:** React 18 + TypeScript 5.7+
- **Styling:** Tailwind CSS 4 + shadcn/ui (new-york style, zinc base)
- **State Management:** Zustand 5
- **Server State:** TanStack Query 5
- **Database:** SQLite via better-sqlite3
- **Rich Text Editor:** Tiptap (ProseMirror-based)
- **AI Integration:** OpenRouter API (BYOK model)

### Marketing Website Stack
- **Framework:** Next.js 15 (App Router)
- **Hosting:** Vercel
- **Analytics:** Plausible (privacy-first)
- **Content:** MDX files in repo

## Architecture Overview

### Desktop App Structure (Planned)
- **Main Process:** Electron IPC, SQLite database, secure API key storage via safeStorage
- **Renderer Process:** React UI with three main views:
  - Chat Interface (T3.chat-inspired)
  - Writer's Studio (Tiptap editor with git-style version control)
  - Image Studio (text-to-image generation)

### Data Models
Core entities: Conversation, Message, Document, Branch, Version, GeneratedImage, Settings. Documents have branches, branches have versions (git-inspired model for writing).

### Database
SQLite with FTS5 for full-text search. Schema includes conversations, messages, documents, branches, versions, and generated_images tables.

## Design System

### Colors (Dark theme dominant)
- **Background:** `#0a0a0c` (Void Black base)
- **Primary Accent:** `#8b5cf6` (Phantom Purple)
- **Secondary Accent:** `#e040a0` (Electric Magenta)
- **Success/Tertiary:** `#00d4aa` (Spectral Teal)
- **Warning:** `#f4a024` (Sunrise Orange)

### Typography
- **Display:** Satoshi (500-900 weights)
- **Body:** General Sans (400-600 weights)
- **Mono:** JetBrains Mono (400-500 weights)

### Component Library
Use shadcn/ui with custom theming:
```bash
bunx --bun shadcn@latest init  # Style: new-york, Base: zinc, CSS vars: yes
bunx --bun shadcn@latest add button input textarea select dropdown-menu dialog sheet toast tooltip tabs scroll-area separator skeleton command
```

## Brand Guidelines

### Voice & Tone
- Concise, encouraging, technically competent but accessible
- Action-oriented ("Ship it" mentality)
- Avoid: "revolutionary", "game-changing", "synergy", marketing jargon
- Use: ship, build, create, draft, version, branch, review

### Tweek Usage
Tweek appears in: empty states, loading (long), success, errors, onboarding, about page. Always with a beverage. Don't overuse - meaningful moments only.

## Key Documentation Files

| File | Purpose |
|------|---------|
| `eidolon-prd.md` | Product requirements, user stories, technical architecture |
| `eidolon-design-system-UIUX-spec.md` | Complete design tokens, components, layout specs |
| `eidolon-brand-identity.md` | Brand colors, typography, Tweek guidelines |
| `eidolon-marketing-website-spec.md` | Marketing site SEO/AEO strategy, content plan |

## Development Approach

The PRD specifies an "agentic development" methodology:
1. Run 3-5 agents in parallel with shared dev server
2. Use screenshots for ~50% of context
3. Write tests immediately after features
4. 20% time on agent-driven refactoring
5. Prefer CLI tools (gh, bun) over MCP servers
