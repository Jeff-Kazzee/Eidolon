# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Eidolon is a desktop AI assistant application built with Electron that combines conversational AI chat with specialized creative studios for writing and image generation. The mascot is Tweek the Sloth - a caffeinated sloth wearing a "Ship it" shirt who lives on a pirate ship.

**Status:** Sprint 0 complete - Infrastructure and research documentation done.

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

## Git Workflow

See [docs/GITHUB_WORKFLOW.md](docs/GITHUB_WORKFLOW.md) for complete documentation.

### Branch Structure
- `main` - Production branch, always deployable
- `dev` - Development integration branch
- `sprint-X/epic-name` - Feature branches for each epic

### Workflow Summary
1. **Create feature branch** from `dev`: `git checkout -b sprint-X/epic-name`
2. **Implement stories** with conventional commits
3. **Run local checks**: `bun run lint && bun run typecheck && bun run test`
4. **Push feature branch**: `git push -u origin sprint-X/epic-name`
5. **Run Codex review**: `codex review . --model gpt-codex-5.2`
6. **Fix any issues** from code review
7. **Open PR** from feature branch → `dev`
8. **CI runs**: lint, typecheck, test, build on all platforms
9. **GitHub Copilot code review** on the PR
10. **Merge to dev** after CI passes and review approved
11. **Open PR** from `dev` → `main`
12. **Merge to main** to sync production

### Commit Convention
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: desktop, web, shared, ci, docs
```

## Development Approach

The PRD specifies an "agentic development" methodology:
1. Run 3-5 agents in parallel with shared dev server
2. Use screenshots for ~50% of context
3. Write tests immediately after features
4. 20% time on agent-driven refactoring
5. Prefer CLI tools (gh, bun) over MCP servers

## Commands

```bash
# Development
bun install              # Install dependencies
bun run dev              # Start all apps in dev mode
bun run build            # Build all packages
bun run typecheck        # Run TypeScript checks
bun run lint             # Run linting
bun run test             # Run tests

# Code Review
codex review . --model gpt-codex-5.2 --output detailed

# Git Workflow
git checkout dev && git pull
git checkout -b sprint-X/epic-name
# ... make changes ...
git push -u origin sprint-X/epic-name
gh pr create --base dev --title "Epic X.X: Description"
```
