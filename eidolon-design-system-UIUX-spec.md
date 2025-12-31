# Eidolon - Design System & UI/UX Specification

**Version:** 0.2.0  
**Last Updated:** December 31, 2024  
**Author:** Jeff Kazzee  
**PRD Reference:** eidolon-prd-v2.md  
**Brand Reference:** eidolon-brand-identity.md  
**Status:** Draft

---

## 1. Design Philosophy

### Aesthetic Direction

**Primary Aesthetic:** Caffeinated Phantom — A fusion of spectral/ghostly digital aesthetics with the warmth and personality of Tweek the sloth. Dark-mode dominant with a vibrant multi-accent palette (purple, magenta, teal, orange) that feels energetic but not chaotic. The pirate ship motif adds a sense of adventure and "shipping."

### Design Principles

1. **Ship it energy** — The UI encourages action and output, not endless configuration. Every screen should have a clear primary action.

2. **Deliberate warmth** — Despite the dark theme, Tweek's presence and the color palette add personality and comfort. This isn't cold utility software.

3. **Depth through color** — Multiple accent colors create visual hierarchy without heavy shadows or complex layering.

4. **Content-first with character** — The interface stays out of the way of user content while maintaining a distinctive identity.

5. **Keyboard-first, mouse-friendly** — Power users can do everything with keyboard shortcuts; casual users have clear visual affordances.

### Inspiration References

| Reference | What We're Taking |
|-----------|-------------------|
| T3.chat | Sidebar layout, chat message structure, model selector placement |
| Arc Browser | Surface layering, command palette patterns, spatial organization |
| Linear | Typography hierarchy, keyboard-first interactions, status indicators |
| Raycast | Command palette, minimal but characterful design |
| Slack | Personality through illustration, delightful empty states |
| Notion | Clean editor experience, sidebar organization |

### Anti-patterns to Avoid

- Generic AI purple gradients (we have *specific* purple with intent)
- Mascots that appear everywhere constantly (Tweek is for meaningful moments)
- Rainbow chaos (our palette is multi-color but deliberate)
- Flat gray interfaces without personality
- Inter, Roboto, or system fonts as primary typography
- Centered layouts for everything (asymmetry is more interesting)
- Overuse of blur/glassmorphism
- Taking ourselves too seriously

---

## 2. Color System

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | #0a0a0c | Root background, app chrome |
| `--bg-surface` | #121216 | Cards, panels, sidebar |
| `--bg-elevated` | #1a1a20 | Modals, dropdowns, tooltips |
| `--bg-hover` | #22222a | Interactive hover states |
| `--bg-active` | #2a2a34 | Active/selected states |
| `--bg-input` | #16161a | Input field backgrounds |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | #8b5cf6 | Primary actions, brand color (Phantom Purple) |
| `--accent-primary-hover` | #7c3aed | Primary hover state |
| `--accent-primary-glow` | rgba(139, 92, 246, 0.15) | Glow effects |
| `--accent-secondary` | #e040a0 | Secondary actions, energy (Electric Magenta) |
| `--accent-tertiary` | #00d4aa | Success, positive (Spectral Teal) |
| `--accent-warm` | #f4a024 | Warnings, Tweek's caffeine (Sunrise Orange) |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | #f0f0f2 | Headings, important text |
| `--text-secondary` | #a0a0a8 | Body text, descriptions |
| `--text-tertiary` | #606068 | Muted text, placeholders, timestamps |
| `--text-inverse` | #0a0a0c | Text on light/colored backgrounds |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--status-success` | #00d4aa | Success states, confirmations |
| `--status-warning` | #f4a024 | Warnings, caution |
| `--status-error` | #e040a0 | Errors, destructive actions |
| `--status-info` | #8b5cf6 | Informational messages |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--border-subtle` | rgba(255, 255, 255, 0.06) | Subtle dividers |
| `--border-default` | rgba(255, 255, 255, 0.1) | Input borders, cards |
| `--border-active` | rgba(139, 92, 246, 0.5) | Focus states |

### CSS Variables (Complete)

```css
:root {
  /* Backgrounds */
  --bg-base: #0a0a0c;
  --bg-surface: #121216;
  --bg-elevated: #1a1a20;
  --bg-hover: #22222a;
  --bg-active: #2a2a34;
  --bg-input: #16161a;

  /* Accents */
  --accent-primary: #8b5cf6;
  --accent-primary-hover: #7c3aed;
  --accent-primary-glow: rgba(139, 92, 246, 0.15);
  --accent-secondary: #e040a0;
  --accent-secondary-hover: #c03080;
  --accent-tertiary: #00d4aa;
  --accent-warm: #f4a024;

  /* Text */
  --text-primary: #f0f0f2;
  --text-secondary: #a0a0a8;
  --text-tertiary: #606068;
  --text-inverse: #0a0a0c;

  /* Semantic */
  --status-success: #00d4aa;
  --status-warning: #f4a024;
  --status-error: #e040a0;
  --status-info: #8b5cf6;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-active: rgba(139, 92, 246, 0.5);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-primary-glow);

  /* Tweek-specific */
  --tweek-fur: #8b6b4a;
  --tweek-coffee: #92400e;
  --forest-green: #2d8a5f;
}
```

---

## 3. Typography

### Font Stack

| Role | Font | Fallback | Weights |
|------|------|----------|---------|
| **Display** | Satoshi | system-ui, sans-serif | 500, 600, 700, 900 |
| **Body** | General Sans | system-ui, sans-serif | 400, 500, 600 |
| **Mono** | JetBrains Mono | Consolas, monospace | 400, 500 |

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display` | 32px (2rem) | 700 | 1.1 | -0.02em | Hero headings (rare) |
| `--text-h1` | 24px (1.5rem) | 600 | 1.2 | -0.01em | Page titles |
| `--text-h2` | 20px (1.25rem) | 600 | 1.3 | -0.01em | Section headings |
| `--text-h3` | 16px (1rem) | 600 | 1.4 | 0 | Subsection headings |
| `--text-body` | 15px (0.9375rem) | 400 | 1.6 | 0 | Body text, messages |
| `--text-small` | 13px (0.8125rem) | 400 | 1.5 | 0.01em | Labels, captions |
| `--text-tiny` | 12px (0.75rem) | 500 | 1.4 | 0.02em | Timestamps, metadata |

### Code Typography

```css
--text-code-inline: 0.9em; /* Relative to parent */
--text-code-block: 13px;
--code-line-height: 1.7;
--code-font: 'JetBrains Mono', Consolas, monospace;
```

---

## 4. Spacing System

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | Reset |
| `--space-1` | 4px | Icon gaps, tight grouping |
| `--space-2` | 8px | Related elements, inline spacing |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Standard padding, card padding |
| `--space-5` | 20px | Medium gaps |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Major section spacing |
| `--space-10` | 40px | Panel gaps |
| `--space-12` | 48px | Page section breaks |
| `--space-16` | 64px | Large layout spacing |

### Layout Constants

```css
--sidebar-width: 260px;
--sidebar-collapsed: 56px;
--chat-max-width: 768px;
--editor-max-width: 900px;
--panel-padding: 16px;
--message-gap: 16px;
--toolbar-height: 48px;
--statusbar-height: 28px;
```

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements, tags, badges |
| `--radius-md` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Large containers, modals |
| `--radius-full` | 9999px | Pills, avatars, circular elements |

---

## 6. Shadows & Effects

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6);
```

### Glows

```css
/* Primary accent glow */
--glow-primary: 0 0 20px var(--accent-primary-glow);

/* Focus ring */
--focus-ring: 0 0 0 2px var(--bg-base), 0 0 0 4px var(--accent-primary);

/* Active element glow */
--glow-active: 0 0 30px rgba(139, 92, 246, 0.2);
```

### Surface Effects

```css
/* Subtle inner highlight */
--surface-highlight: inset 0 1px 0 rgba(255, 255, 255, 0.03);

/* Surface with border */
--surface-bordered: var(--surface-highlight), 0 0 0 1px var(--border-subtle);
```

---

## 7. Animation & Motion

### Timing

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-instant` | 50ms | Immediate feedback |
| `--duration-fast` | 100ms | Micro-interactions, hovers |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Panel slides, complex transitions |
| `--duration-slower` | 500ms | Page transitions, emphasis |

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Motion Patterns

**Entrances:**
- Fade in + translate up 8px
- Duration: 200ms
- Easing: ease-out

**Exits:**
- Fade out + translate down 4px
- Duration: 150ms
- Easing: ease-in

**Hover states:**
- Instant response (no delay)
- Duration: 100ms
- Scale subtle: 1.0 → 1.02 for cards

**Loading:**
- Pulse opacity: 0.5 → 1.0
- Duration: 1.5s
- Infinite loop

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Component Library

### Using shadcn/ui

The component library is built on shadcn/ui with custom theming. Components are copied into the project and customized.

**Installation:**
```bash
bunx --bun shadcn@latest init
# Style: new-york
# Base color: zinc
# CSS variables: yes
```

**Core Components to Add:**
```bash
bunx --bun shadcn@latest add button input textarea select \
  dropdown-menu dialog sheet toast tooltip tabs \
  scroll-area separator skeleton command
```

### Button

**Variants:**

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| `primary` | `--accent-primary` | `--text-inverse` | Main CTAs |
| `secondary` | transparent | `--text-primary` | Secondary actions |
| `ghost` | transparent | `--text-secondary` | Tertiary, toolbar |
| `destructive` | `--status-error` | white | Delete, danger |
| `outline` | transparent + border | `--text-primary` | Alternative to secondary |

**Sizes:**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 28px | 12px | 13px |
| `md` | 36px | 16px | 14px |
| `lg` | 44px | 20px | 15px |
| `icon` | 36px | 0 | - |

**States:**
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
  transition: all 100ms ease-out;
}

.btn-primary:hover {
  background: var(--accent-primary-hover);
  box-shadow: var(--glow-primary);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Input

**Base Styles:**
```css
.input {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 15px;
  transition: all 100ms ease-out;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:hover {
  border-color: var(--border-default);
  background: var(--bg-hover);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: var(--focus-ring);
}

.input--error {
  border-color: var(--status-error);
}
```

### Card

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--surface-highlight);
}

.card--interactive {
  cursor: pointer;
  transition: all 150ms ease-out;
}

.card--interactive:hover {
  background: var(--bg-hover);
  border-color: var(--border-default);
}

.card--active {
  border-color: var(--accent-primary);
  border-left-width: 2px;
}
```

### Toast

```css
.toast {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.toast--success {
  border-left: 3px solid var(--status-success);
}

.toast--error {
  border-left: 3px solid var(--status-error);
}

.toast--warning {
  border-left: 3px solid var(--status-warning);
}
```

---

## 9. Layout Specifications

### Application Shell

```
┌─────────────────────────────────────────────────────────────────┐
│ [─][□][×]  Eidolon                                    Traffic   │
├────────────┬────────────────────────────────────────────────────┤
│            │                                                    │
│  SIDEBAR   │                   MAIN CONTENT                     │
│   260px    │                                                    │
│            │   ┌────────────────────────────────────────────┐   │
│  ┌──────┐  │   │              TOOLBAR (48px)                │   │
│  │ Logo │  │   └────────────────────────────────────────────┘   │
│  └──────┘  │                                                    │
│            │   ┌────────────────────────────────────────────┐   │
│  ┌──────┐  │   │                                            │   │
│  │ New  │  │   │              CONTENT AREA                  │   │
│  │ Chat │  │   │              (scrollable)                  │   │
│  └──────┘  │   │                                            │   │
│            │   │                                            │   │
│  ┌──────┐  │   │                                            │   │
│  │Search│  │   │                                            │   │
│  └──────┘  │   │                                            │   │
│            │   │                                            │   │
│  ┌──────┐  │   │                                            │   │
│  │ Chat │  │   └────────────────────────────────────────────┘   │
│  │ List │  │                                                    │
│  │      │  │   ┌────────────────────────────────────────────┐   │
│  │      │  │   │              INPUT AREA                    │   │
│  └──────┘  │   └────────────────────────────────────────────┘   │
│            │                                                    │
│  ┌──────┐  ├────────────────────────────────────────────────────┤
│  │ Nav  │  │              STATUS BAR (28px)                     │
│  └──────┘  │                                                    │
└────────────┴────────────────────────────────────────────────────┘
```

### Sidebar

**Width:** 260px (expanded), 56px (collapsed)

**Sections:**
1. **Logo/Brand** - Fixed top, 48px height
2. **New Chat Button** - Primary CTA, always visible
3. **Search** - Collapsible search input
4. **Navigation Tabs** - Chat | Writer | Image
5. **Item List** - Scrollable list based on active tab
6. **User/Settings** - Fixed bottom, settings access

### Chat View

**Message Layout:**
- Max width: 768px, centered
- User messages: Right-aligned, accent background
- AI messages: Left-aligned, subtle left border
- Message gap: 16px

### Writer's Studio

**Split View (during review):**
```
┌──────────────────────┬──────────────────────┐
│      CURRENT         │      SUGGESTED       │
│      (editable)      │      (read-only)     │
│                      │                      │
│                      │                      │
├──────────────────────┴──────────────────────┤
│    [← Prev]  Change 3 of 8  [Next →]        │
│             [Reject]  [Accept]              │
└─────────────────────────────────────────────┘
```

**Version History Panel:**
- Width: 280px
- Position: Right side, collapsible
- Shows branch tree and version list

---

## 10. Chat Components

### Chat Message

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Avatar]  Model Name                           12:34 PM     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Message content with **markdown** rendering...             │
│                                                             │
│  ```javascript                                              │
│  // Code block with syntax highlighting                     │
│  console.log("hello");                                      │
│  ```                                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [Copy] [Regenerate]                               [···]     │
└─────────────────────────────────────────────────────────────┘
```

**AI Message Styling:**
```css
.message--ai {
  background: linear-gradient(
    90deg,
    rgba(139, 92, 246, 0.05) 0%,
    transparent 30%
  );
  border-left: 2px solid var(--accent-primary);
  padding: var(--space-4);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}
```

**User Message Styling:**
```css
.message--user {
  background: var(--bg-elevated);
  margin-left: var(--space-8);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

### Message Input

```
┌─────────────────────────────────────────────────────────────┐
│ [+] Type a message...                          [Model ▾] ↑  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Auto-expanding textarea (up to 200px)
- Attachment button (left)
- Model selector (right)
- Send button (right, appears when content)
- Cmd+Enter or Enter to send (configurable)
- Character count for long messages

### Model Selector

**Closed State:**
```
┌────────────────────────────────────┐
│ Claude Sonnet 4.5              ▾   │
└────────────────────────────────────┘
```

**Open State (Dropdown):**
```
┌────────────────────────────────────────────┐
│ [Search models...]                         │
├────────────────────────────────────────────┤
│ ★ FAVORITES                                │
│   ✓ Claude Sonnet 4.5                      │
│     GPT-5.2                                │
├────────────────────────────────────────────┤
│ ANTHROPIC                                  │
│     Claude Opus 4.5        $15/M tokens    │
│   ✓ Claude Sonnet 4.5      $3/M tokens     │
│     Claude Haiku 4.5       $0.25/M tokens  │
├────────────────────────────────────────────┤
│ OPENAI                                     │
│     GPT-5.2 Pro            $10/M tokens    │
│     GPT-5.2                $5/M tokens     │
└────────────────────────────────────────────┘
```

---

## 11. Editor Components

### Tiptap Editor Toolbar

```
┌───────────────────────────────────────────────────────────────┐
│ [B] [I] [H1▾] [•] [1.] ["] [</>]  │  [Review] [History] [⋮]  │
└───────────────────────────────────────────────────────────────┘
```

**Toolbar Buttons:**
- Bold (Cmd+B)
- Italic (Cmd+I)
- Heading dropdown (H1, H2, H3)
- Bullet list
- Numbered list
- Block quote
- Code block
- Separator
- AI Review button
- History toggle
- More menu

### Diff View

**Change Highlighting:**
```css
/* Addition */
.diff-add {
  background: rgba(0, 212, 170, 0.15);
  border-left: 2px solid var(--status-success);
}

/* Deletion */
.diff-delete {
  background: rgba(224, 64, 160, 0.15);
  border-left: 2px solid var(--status-error);
  text-decoration: line-through;
  opacity: 0.7;
}

/* Modification */
.diff-modify {
  background: rgba(244, 160, 36, 0.15);
  border-left: 2px solid var(--status-warning);
}
```

### Version History Item

```css
.version-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.version-item:hover {
  background: var(--bg-hover);
}

.version-item--current {
  background: var(--bg-active);
  border-left: 2px solid var(--accent-primary);
}

.version-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
  margin-top: 6px;
}

.version-line {
  position: absolute;
  left: 11px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: var(--border-subtle);
}
```

---

## 12. Empty States

### No Conversations

```
┌─────────────────────────────────────┐
│                                     │
│      [Tweek with coffee ☕]         │
│                                     │
│   Start your first conversation     │
│                                     │
│   Ask anything, or try:             │
│   • "Help me write an email"        │
│   • "Explain this code"             │
│   • "Brainstorm ideas for..."       │
│                                     │
│        [New Chat]                   │
│                                     │
└─────────────────────────────────────┘
```

### No Documents

```
┌─────────────────────────────────────┐
│                                     │
│    [Tweek thinking 🤔]              │
│                                     │
│   Ready to write something?         │
│                                     │
│   Writer's Studio lets you:         │
│   • Draft with AI assistance        │
│   • Track version history           │
│   • Branch into alternatives        │
│                                     │
│      [New Document]                 │
│                                     │
└─────────────────────────────────────┘
```

### Search No Results

```
┌─────────────────────────────────────┐
│                                     │
│    [Tweek looking around 👀]        │
│                                     │
│   No results for "query"            │
│                                     │
│   Try different keywords or         │
│   check your spelling.              │
│                                     │
└─────────────────────────────────────┘
```

---

## 13. Loading States

### Message Loading (Streaming)

```css
.streaming-cursor {
  display: inline-block;
  width: 8px;
  height: 18px;
  background: var(--accent-primary);
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  border-radius: 1px;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-surface) 0%,
    var(--bg-hover) 50%,
    var(--bg-surface) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Full Page Loading

```
┌─────────────────────────────────────┐
│                                     │
│        [Eidolon Logo]               │
│                                     │
│    [Tweek sipping coffee ☕]        │
│                                     │
│       ════════════════              │
│         Loading...                  │
│                                     │
└─────────────────────────────────────┘
```

---

## 14. Error States

### API Error Toast

```css
.toast--error {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-left: 3px solid var(--status-error);
}
```

**Content:**
```
⚠️ Connection Error

Unable to reach OpenRouter. Check your
internet connection and try again.

[Retry]  [Dismiss]
```

### Inline Error (Form Field)

```css
.input-error {
  border-color: var(--status-error);
}

.error-message {
  color: var(--status-error);
  font-size: var(--text-small);
  margin-top: var(--space-1);
}
```

### Full Error Page

```
┌─────────────────────────────────────┐
│                                     │
│    [Tweek concerned 😟 with         │
│     spilled coffee]                 │
│                                     │
│   Something went wrong              │
│                                     │
│   We couldn't load this page.       │
│   This might be a temporary issue.  │
│                                     │
│   [Try Again]  [Go Home]            │
│                                     │
└─────────────────────────────────────┘
```

---

## 15. Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | New conversation |
| `Cmd+Shift+N` | New document |
| `Cmd+K` | Command palette |
| `Cmd+,` | Open settings |
| `Cmd+B` | Toggle sidebar |
| `Cmd+/` | Show shortcuts |
| `Escape` | Stop generation / Close modal |

### Chat Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` or `Cmd+Enter` | Send message (configurable) |
| `/` | Focus message input |
| `Cmd+Shift+C` | Copy last response |
| `Cmd+[` | Previous conversation |
| `Cmd+]` | Next conversation |

### Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+S` | Save document |
| `Cmd+Shift+R` | Request AI review |
| `Cmd+H` | Toggle version history |
| `Cmd+B` | Bold |
| `Cmd+I` | Italic |
| `Cmd+Shift+1/2/3` | Heading 1/2/3 |

---

## 16. Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `--text-primary` | `--bg-base` | 18.3:1 | ✓ AAA |
| `--text-secondary` | `--bg-base` | 8.1:1 | ✓ AAA |
| `--text-tertiary` | `--bg-base` | 4.6:1 | ✓ AA |
| `--accent-primary` | `--bg-base` | 5.2:1 | ✓ AA |

**Focus Indicators:**
- All interactive elements have visible focus states
- Focus ring: 2px offset, accent color
- Tab order follows visual layout

**Screen Reader Support:**
- Semantic HTML throughout
- ARIA labels for icon buttons
- Live regions for streaming content
- Proper heading hierarchy

**Keyboard Navigation:**
- All features accessible via keyboard
- No keyboard traps
- Skip links for main content
- Escape closes modals

**Motion:**
- All animations respect `prefers-reduced-motion`
- No auto-playing animations that can't be paused

---

## 17. Responsive Behavior

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Compact | < 900px | Sidebar auto-collapses |
| Normal | 900-1200px | Default layout |
| Wide | > 1200px | Can show permanent side panels |

### Minimum Window Size

- **Width:** 800px
- **Height:** 600px

### Collapsed Sidebar

At < 900px or manually collapsed:
- Width: 56px
- Shows only icons
- Tooltips on hover
- Full sidebar on click/expand

---

## 18. Tweek Usage Guidelines

### When Tweek Appears

| Context | Variant | Notes |
|---------|---------|-------|
| Empty states | Standard/Thinking | Encouraging presence |
| Loading (long) | Sipping coffee | "Still working..." |
| Success | Celebrating | Ship it! |
| Error | Sympathetic | Comfort, not blame |
| Onboarding | Welcoming | First-time user |
| About page | Full illustration | Brand showcase |

### Tweek Don'ts

- Don't use in every UI state
- Don't animate frantically
- Don't show without beverage
- Don't place over important content
- Don't use in tooltips/small UI

---

## 19. Asset Checklist

### Required Assets

- [ ] Tweek character sheet (all variants)
- [ ] App icon (all sizes: 16, 32, 64, 128, 256, 512)
- [ ] Logo SVG (horizontal, stacked, icon-only)
- [ ] Favicon set
- [ ] Splash screen
- [ ] Empty state illustrations
- [ ] Loading animations (Lottie or CSS)
- [ ] Custom icons (coffee, ship, etc.)

### Icon Set

Using Lucide icons throughout. Custom icons needed for:
- Tweek avatar (simplified)
- Ship/pirate theme elements
- Coffee cup
- "Ship it" badge

---

## Appendix: Figma/Design Token Export

```json
{
  "colors": {
    "bg": {
      "base": "#0a0a0c",
      "surface": "#121216",
      "elevated": "#1a1a20",
      "hover": "#22222a",
      "active": "#2a2a34"
    },
    "accent": {
      "primary": "#8b5cf6",
      "secondary": "#e040a0",
      "tertiary": "#00d4aa",
      "warm": "#f4a024"
    },
    "text": {
      "primary": "#f0f0f2",
      "secondary": "#a0a0a8",
      "tertiary": "#606068"
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  },
  "radii": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  },
  "fonts": {
    "display": "Satoshi",
    "body": "General Sans",
    "mono": "JetBrains Mono"
  }
}
```

---

*End of Design System*