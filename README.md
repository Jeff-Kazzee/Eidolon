# Eidolon

A desktop AI assistant application with Chat, Writer's Studio, and Image Generation capabilities.

## Overview

Eidolon is a cross-platform desktop application that provides:
- **AI Chat**: Multi-model conversations via OpenRouter (BYOK)
- **Writer's Studio**: Rich text editor with AI-powered review and git-style version control
- **Image Studio**: Text-to-image generation (coming soon)

## Tech Stack

- **Desktop**: Electron + Vite + React + TypeScript
- **Web**: Next.js 15 (marketing site)
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS + shadcn/ui
- **Package Manager**: Bun

## Project Structure

```
eidolon/
├── apps/
│   ├── desktop/     # Electron desktop application
│   └── web/         # Next.js marketing website
├── packages/
│   └── shared/      # Shared utilities, types, design tokens
├── docs/
│   ├── research/    # Technical research documentation
│   ├── sops/        # Standard operating procedures
│   └── troubleshooting/  # Common issues and solutions
└── specs/           # Product and design specifications
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- Node.js 20+ (for Electron builder)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jeff-Kazzee/Eidolon.git
cd Eidolon

# Install dependencies
bun install

# Build shared packages
bun run build
```

### Development

```bash
# Run all apps in development mode
bun run dev

# Run type checking
bun run typecheck

# Run linting
bun run lint

# Run tests
bun run test
```

## API Key Setup

Eidolon uses a Bring Your Own Key (BYOK) model. You'll need an API key from [OpenRouter](https://openrouter.ai/) to use the AI features.

1. Create an account at openrouter.ai
2. Generate an API key
3. Enter the key in Eidolon's settings

## Architecture

### Desktop App

The desktop application uses Electron with a secure IPC layer:
- Main process handles database, API calls, and system integration
- Renderer process provides the React UI
- Preload scripts expose safe APIs via contextBridge

### Shared Package

The `@eidolon/shared` package contains:
- Design tokens (colors, spacing, typography)
- TypeScript types for conversations, documents, settings
- Utility functions shared between apps

## Contributing

See [docs/sops/code-review.md](docs/sops/code-review.md) for contribution guidelines.

## License

All rights reserved.
