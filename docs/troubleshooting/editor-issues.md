# Editor Troubleshooting

Issues related to the Tiptap rich text editor in Writer's Studio.

## Table of Contents

- [Editor Not Rendering](#editor-not-rendering)
- [Formatting Not Applying](#formatting-not-applying)
- [Performance Issues](#performance-issues)
- [Copy/Paste Problems](#copypaste-problems)
- [Extension Conflicts](#extension-conflicts)

---

## Editor Not Rendering

### Symptom
Editor area is blank or shows error.

### Cause
- Missing Tiptap dependencies
- React hydration mismatch
- Extension initialization failure

### Solution
1. Verify all dependencies installed:
   ```bash
   bun add @tiptap/react @tiptap/starter-kit @tiptap/extension-*
   ```
2. Check for hydration errors in console
3. Ensure editor is initialized after component mount:
   ```typescript
   const editor = useEditor({
     extensions: [StarterKit],
     content: '<p>Hello World!</p>',
   });

   if (!editor) return <div>Loading...</div>;
   ```

### Prevention
Use proper loading states and error boundaries.

---

## Formatting Not Applying

### Symptom
Bold, italic, or other formatting doesn't work.

### Cause
- Extension not loaded
- Command not available for selection
- CSS not properly targeting editor content

### Solution
1. Verify extension is included:
   ```typescript
   const editor = useEditor({
     extensions: [
       StarterKit,  // Includes Bold, Italic, etc.
       // Or individual extensions
       Bold,
       Italic,
     ],
   });
   ```
2. Check if selection exists before applying:
   ```typescript
   if (editor.can().chain().focus().toggleBold().run()) {
     editor.chain().focus().toggleBold().run();
   }
   ```
3. Verify CSS:
   ```css
   .ProseMirror strong { font-weight: bold; }
   .ProseMirror em { font-style: italic; }
   ```

### Prevention
Test all formatting options after adding new extensions.

---

## Performance Issues

### Symptom
- Editor is slow with large documents
- Typing has noticeable lag
- Scrolling is choppy

### Cause
- Too many re-renders
- Heavy extensions
- Large document size

### Solution
1. Memoize editor configuration:
   ```typescript
   const extensions = useMemo(() => [StarterKit], []);
   ```
2. Use transaction batching for bulk changes
3. Implement virtualization for very long documents
4. Profile with React DevTools

### Prevention
- Test with large documents early
- Monitor performance metrics

---

## Copy/Paste Problems

### Symptom
- Pasted content loses formatting
- Special characters not pasting correctly
- Images not pasting

### Cause
- Clipboard format not recognized
- Extension for content type not loaded

### Solution
1. Handle multiple clipboard formats:
   ```typescript
   import { ClipboardTextSerializer } from '@tiptap/extension-clipboard-text-serializer';
   ```
2. Add specific paste handlers:
   ```typescript
   const editor = useEditor({
     extensions: [
       // ...
     ],
     editorProps: {
       handlePaste: (view, event, slice) => {
         // Custom paste handling
         return false; // Let default handling continue
       },
     },
   });
   ```

### Prevention
Test paste from common sources (Word, Google Docs, web pages).

---

## Extension Conflicts

### Symptom
- Unexpected behavior
- Some features stop working
- Console errors about conflicting extensions

### Cause
Multiple extensions trying to handle same functionality.

### Solution
1. Check for duplicate functionality:
   - StarterKit includes many extensions
   - Don't add Bold if using StarterKit
2. Order extensions correctly (some depend on others)
3. Check extension compatibility in Tiptap docs

### Prevention
Document which extensions are included and why.

---

## Selection Lost After Action

### Symptom
Cursor/selection disappears after clicking toolbar button.

### Cause
Focus moved to toolbar button, editor lost focus.

### Solution
1. Always chain with `.focus()`:
   ```typescript
   // Wrong
   editor.commands.toggleBold()

   // Correct
   editor.chain().focus().toggleBold().run()
   ```
2. Prevent button focus:
   ```typescript
   <button
     onMouseDown={(e) => e.preventDefault()}
     onClick={() => editor.chain().focus().toggleBold().run()}
   >
     Bold
   </button>
   ```

### Prevention
Always use `.chain().focus()` pattern.

---

## Content Not Saving

### Symptom
Changes lost after closing or reloading.

### Cause
- Save not triggered
- Autosave debounce too long
- IPC failure

### Solution
1. Implement proper autosave:
   ```typescript
   const editor = useEditor({
     onUpdate: ({ editor }) => {
       debouncedSave(editor.getHTML())
     }
   })
   ```
2. Save on blur:
   ```typescript
   editor.on('blur', () => saveContent())
   ```
3. Check IPC connection

### Prevention
- Show save indicator
- Warn on unsaved changes before close

---

## Tiptap Debug Tips

```typescript
// Log all transactions
editor.on('transaction', ({ transaction }) => {
  console.log('Transaction:', transaction);
});

// Check current state
console.log('Document:', editor.getJSON());
console.log('Selection:', editor.state.selection);

// Check available commands
console.log('Can bold:', editor.can().toggleBold());
```
