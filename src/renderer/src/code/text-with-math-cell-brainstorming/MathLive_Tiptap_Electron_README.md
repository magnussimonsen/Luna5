# Math Editing in Vue + Tiptap with MathLive (Vue + Electron)

This README explains how to integrate **MathLive** into a **Vue 3 + Tiptap** editor inside an **Electron app** to provide a **Word-like math editing experience** for high-school students.  

Students should be able to insert **inline math** or **block math**, type naturally (`3/4` → fraction, `^2` → superscript), and use a **virtual math keyboard** — without ever seeing LaTeX code.  

---v

## Context and Motivation

### Audience
- This is for **STEM education (high-school students)**.  
- Students **do not know LaTeX** and should never see it.  
- Math input must feel like **Microsoft Word’s math editor** (`Alt+=` to start math, type `3/4` → fraction, navigate with arrow keys).

### Why MathLive?
- Provides a **live math field** that interprets typing and formats it instantly.  
- Offers a **virtual math keyboard** for touch devices or beginners.  
- Internally uses LaTeX, but hides it from users.  

### Why Tiptap?
- A **ProseMirror-based editor** with a document tree structure.  
- Lets us define **custom nodes** for inline and block math.  
- Works well with **VueNodeViewRenderer**, so we can embed MathLive `<math-field>` inside nodes.  

---

## Features

- **Inline math**: insertable via toolbar button.  
- **Block math**: insertable via toolbar button.  
- **Aligned equations**: via a matrix template that students can fill in.  (already implementet support for matrix in mathlive. We will use it. Easyer than latex - begin{align})
- **Smart typing**: `3/4` → fraction, `x^2` → superscript.  
- **Navigation**: arrow keys in/out of math structures.  
- **Virtual keyboard**: appears on focus.(MAth live viritual kayboard)  
- **No LaTeX exposure**: all stored in node attributes.  

---

## File Setup

These are the key files you need to create/edit:

```
src/renderer/src/css/main-imports-this-css/
├─ mathlive/mathlive-custom.css    # overrides for MathLive <math-field>
├─ tiptap/tiptap-custom.css        # overrides for Tiptap editor
└─ cells/textcell.css              # styling for the TextCell editor component

src/renderer/src/components/math/
└─ mathNodeView.vue                # Vue NodeView component for MathLive fields

src/renderer/src/extensions/
└─ MathNodes.ts                    # Tiptap node definitions (inline + block)

src/renderer/src/editor/
├─ TextCell.vue                    # main editor cell with toolbar + Tiptap setup
└─ TextCellToolbar.vue             # toolbar with buttons for inserting math

src/renderer/src/types/
└─ mathlive.d.ts                   # type declarations for MathLive
```

---

## Toolbar Buttons

In `TextCellToolbar.vue`, add **two buttons** that call Tiptap commands:

- **Insert Inline Math** → `editor.commands.insertInlineMath()`  
- **Insert Block Math** → `editor.commands.insertBlockMath()`  

(Optionally add **Aligned Math** → `editor.commands.insertAlignedTemplate()`.)  

These buttons are critical: they give students a Word-like way to enter math without needing LaTeX.  

---

## Installation

```bash
npm install @tiptap/core @tiptap/vue-3 @tiptap/starter-kit mathlive
```

Import MathLive styles globally in `main.ts` or `main.js`:

```ts
import 'mathlive/dist/mathlive-static.css';
```

---

## Summary

- **MathLive** = Word-like math entry (live rendering, smart typing, virtual keyboard).  
- **Tiptap** = flexible editor that supports custom math nodes.  
- **Vue NodeView** = bridges the two.  
- **Toolbar buttons** = give students intuitive entry points (inline and block).  

This setup creates a **Word-like text cell for STEM students** in your Vue + Electron app.  
Students get a **familiar editing experience**, while your app stores clean LaTeX under the hood for rendering, export, or CAS integration.  

---
