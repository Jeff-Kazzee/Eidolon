# Tiptap Editor Integration Research

## Overview

This document covers integrating Tiptap as the rich text editor for Eidolon's Writer's Studio feature.

## Why Tiptap?

| Feature | Tiptap | Draft.js | Slate | Quill |
|---------|--------|----------|-------|-------|
| React Support | Excellent | Native | Excellent | Good |
| TypeScript | First-class | Community | First-class | Community |
| Extension System | Best | Limited | Good | Limited |
| Performance | Excellent | Good | Good | Good |
| Collaboration | Built-in | No | Plugin | No |
| Maintenance | Active | Minimal | Active | Active |

**Recommendation**: Tiptap for its excellent extension system, TypeScript support, and React integration.

## Installation

```bash
bun add @tiptap/react @tiptap/pm @tiptap/starter-kit
bun add @tiptap/extension-placeholder @tiptap/extension-character-count
bun add @tiptap/extension-typography @tiptap/extension-highlight
```

## Basic Setup

```typescript
// src/components/editor/TiptapEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export function TiptapEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  editable = true
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure StarterKit options
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // We'll add custom code block
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  return <EditorContent editor={editor} className="tiptap-editor" />
}
```

## Core Extensions

### StarterKit Contents

StarterKit includes these extensions by default:
- `Document`, `Paragraph`, `Text` - Base content
- `Bold`, `Italic`, `Strike`, `Code` - Inline formatting
- `Heading` - H1-H6 headings
- `BulletList`, `OrderedList`, `ListItem` - Lists
- `Blockquote` - Quotes
- `CodeBlock` - Code blocks
- `HorizontalRule` - Dividers
- `HardBreak` - Line breaks
- `History` - Undo/redo

### Additional Extensions for Eidolon

```typescript
// src/components/editor/extensions/index.ts
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),
  Placeholder.configure({
    placeholder: 'Start writing...',
  }),
  CharacterCount,
  Typography,  // Smart quotes, em dashes, etc.
  Highlight.configure({
    multicolor: true,  // For AI suggestions
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'editor-link',
    },
  }),
  Underline,
]
```

## Formatting Toolbar

```typescript
// src/components/editor/EditorToolbar.tsx
import { Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        aria-label="Bold"
      >
        <BoldIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        aria-label="Italic"
      >
        <ItalicIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        aria-label="Underline"
      >
        <UnderlineIcon />
      </button>

      <div className="toolbar-divider" />

      <HeadingDropdown editor={editor} />

      <div className="toolbar-divider" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        aria-label="Bullet List"
      >
        <ListIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        aria-label="Numbered List"
      >
        <ListOrderedIcon />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        aria-label="Quote"
      >
        <QuoteIcon />
      </button>
    </div>
  )
}

function HeadingDropdown({ editor }: { editor: Editor }) {
  const currentLevel = [1, 2, 3].find(level =>
    editor.isActive('heading', { level })
  )

  return (
    <select
      value={currentLevel || 0}
      onChange={(e) => {
        const level = parseInt(e.target.value)
        if (level === 0) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()
        }
      }}
    >
      <option value="0">Paragraph</option>
      <option value="1">Heading 1</option>
      <option value="2">Heading 2</option>
      <option value="3">Heading 3</option>
    </select>
  )
}
```

## Keyboard Shortcuts

Tiptap includes default shortcuts, but we can customize:

```typescript
// src/components/editor/extensions/keyboard-shortcuts.ts
import { Extension } from '@tiptap/core'

export const EidolonShortcuts = Extension.create({
  name: 'eidolonShortcuts',

  addKeyboardShortcuts() {
    return {
      // Override Cmd+B for bold (already default)
      'Mod-b': () => this.editor.chain().focus().toggleBold().run(),

      // Override Cmd+I for italic (already default)
      'Mod-i': () => this.editor.chain().focus().toggleItalic().run(),

      // Add Cmd+U for underline
      'Mod-u': () => this.editor.chain().focus().toggleUnderline().run(),

      // Add Cmd+Shift+H for highlight
      'Mod-Shift-h': () => this.editor.chain().focus().toggleHighlight().run(),

      // Add Cmd+K for link
      'Mod-k': () => {
        // Open link dialog
        return true
      },

      // Save shortcut (handled externally)
      'Mod-s': () => {
        // Prevent default, emit save event
        this.editor.commands.focus()
        return true
      },
    }
  },
})
```

## AI Suggestion/Track Changes Mode

For showing AI-suggested changes with accept/reject functionality:

```typescript
// src/components/editor/extensions/suggestion-mark.ts
import { Mark, mergeAttributes } from '@tiptap/core'

export interface SuggestionOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    suggestion: {
      setSuggestion: (attributes?: { type: 'addition' | 'deletion' }) => ReturnType
      unsetSuggestion: () => ReturnType
    }
  }
}

export const Suggestion = Mark.create<SuggestionOptions>({
  name: 'suggestion',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      type: {
        default: 'addition',
        parseHTML: element => element.getAttribute('data-suggestion-type'),
        renderHTML: attributes => ({
          'data-suggestion-type': attributes.type,
        }),
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-suggestion-id'),
        renderHTML: attributes => ({
          'data-suggestion-id': attributes.id,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-suggestion]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { 'data-suggestion': '' }
    ), 0]
  },

  addCommands() {
    return {
      setSuggestion: attributes => ({ commands }) => {
        return commands.setMark(this.name, {
          ...attributes,
          id: crypto.randomUUID(),
        })
      },
      unsetSuggestion: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})
```

### Applying Suggestions from AI

```typescript
// src/services/suggestion-service.ts
import { Editor } from '@tiptap/core'
import { diff_match_patch } from 'diff-match-patch'

interface Suggestion {
  id: string
  type: 'addition' | 'deletion' | 'modification'
  originalText: string
  suggestedText: string
  position: { from: number; to: number }
}

export function applySuggestionsToEditor(
  editor: Editor,
  originalContent: string,
  suggestedContent: string
): Suggestion[] {
  const dmp = new diff_match_patch()
  const diffs = dmp.diff_main(originalContent, suggestedContent)
  dmp.diff_cleanupSemantic(diffs)

  const suggestions: Suggestion[] = []
  let position = 0

  for (const [op, text] of diffs) {
    if (op === 0) {
      // Equal - no change
      position += text.length
    } else if (op === -1) {
      // Deletion
      suggestions.push({
        id: crypto.randomUUID(),
        type: 'deletion',
        originalText: text,
        suggestedText: '',
        position: { from: position, to: position + text.length }
      })
      // Don't advance position - text is being removed
    } else if (op === 1) {
      // Addition
      suggestions.push({
        id: crypto.randomUUID(),
        type: 'addition',
        originalText: '',
        suggestedText: text,
        position: { from: position, to: position }
      })
      position += text.length
    }
  }

  return suggestions
}
```

## Styling

```css
/* src/components/editor/editor-styles.css */

.tiptap-editor {
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-primary);
  padding: var(--space-4);
  min-height: 400px;
}

.tiptap-editor:focus {
  outline: none;
}

/* Placeholder */
.tiptap-editor p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--color-text-muted);
  pointer-events: none;
  float: left;
  height: 0;
}

/* Headings */
.tiptap-editor h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 1.5em 0 0.5em;
  color: var(--color-text-primary);
}

.tiptap-editor h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1.25em 0 0.5em;
}

.tiptap-editor h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

/* Paragraphs */
.tiptap-editor p {
  margin: 0 0 1em;
}

/* Lists */
.tiptap-editor ul,
.tiptap-editor ol {
  padding-left: 1.5em;
  margin: 0 0 1em;
}

.tiptap-editor li {
  margin: 0.25em 0;
}

/* Blockquote */
.tiptap-editor blockquote {
  border-left: 3px solid var(--color-accent);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* Code */
.tiptap-editor code {
  font-family: var(--font-mono);
  background: var(--color-bg-elevated);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  font-size: 0.9em;
}

/* Links */
.tiptap-editor a,
.tiptap-editor .editor-link {
  color: var(--color-accent);
  text-decoration: underline;
  cursor: pointer;
}

/* Suggestions */
.tiptap-editor [data-suggestion][data-suggestion-type="addition"] {
  background-color: rgba(0, 212, 170, 0.2);  /* Teal */
  text-decoration: none;
}

.tiptap-editor [data-suggestion][data-suggestion-type="deletion"] {
  background-color: rgba(239, 68, 68, 0.2);  /* Red */
  text-decoration: line-through;
}

/* Highlight */
.tiptap-editor mark {
  background-color: var(--color-accent-secondary);
  padding: 0.1em 0;
}
```

## Word/Character Count

```typescript
// src/components/editor/EditorStats.tsx
import { Editor } from '@tiptap/react'

interface EditorStatsProps {
  editor: Editor | null
}

export function EditorStats({ editor }: EditorStatsProps) {
  if (!editor) return null

  const wordCount = editor.storage.characterCount.words()
  const charCount = editor.storage.characterCount.characters()

  return (
    <div className="editor-stats">
      <span>{wordCount.toLocaleString()} words</span>
      <span className="divider">|</span>
      <span>{charCount.toLocaleString()} characters</span>
    </div>
  )
}
```

## Content Serialization

```typescript
// For database storage
const htmlContent = editor.getHTML()
const jsonContent = editor.getJSON()
const textContent = editor.getText()

// For markdown export
import { generateHTML, generateJSON } from '@tiptap/html'
import TurndownService from 'turndown'

const turndown = new TurndownService()
const markdown = turndown.turndown(htmlContent)
```

## Performance Considerations

1. **Lazy Load Extensions**: Only load needed extensions
2. **Debounce Updates**: Debounce onChange for autosave
3. **Virtual Rendering**: For very long documents, consider pagination
4. **Memory Management**: Destroy editor on unmount

```typescript
import { useEditor } from '@tiptap/react'
import { useEffect } from 'react'

function MyEditor() {
  const editor = useEditor({
    // ...config
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])
}
```

## References

- [Tiptap Documentation](https://tiptap.dev/docs)
- [Tiptap Examples](https://tiptap.dev/examples)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/) (underlying library)
