# MathLive + Tiptap Integration for Electron App

This README provides a guide on how to integrate MathLive with Tiptap in your Electron app to create editable inline and block math nodes.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting Up MathLive and Tiptap](#setting-up-mathlive-and-tiptap)
- [Creating Math Nodes](#creating-math-nodes)
- [Creating the Toolbar Buttons](#creating-the-toolbar-buttons)
- [Styling Math Fields](#styling-math-fields)
- [Final Touches](#final-touches)
- [Conclusion](#conclusion)

## Introduction

In this guide, we'll walk you through the process of setting up MathLive to render math expressions interactively inside a Tiptap editor in your Electron app. We'll provide two buttons in the toolbar:

- One to insert inline math expressions.
- One to insert block math expressions.

MathLive will be embedded inside Tiptap's custom nodes, allowing users to interactively edit mathematical expressions.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js installed on your system.
- A basic Electron app set up.
- Basic knowledge of Vue.js, Tiptap, and MathLive.

You will need the following dependencies:

- tiptap
- @tiptap/extension-math
- mathlive

## Installation

First, install the necessary packages for Tiptap and MathLive:

```bash
npm install @tiptap/core @tiptap/extension-math mathlive
```

## Setting Up MathLive and Tiptap

Once you have the dependencies installed, we need to integrate MathLive with Tiptap.

In your `editor.js` file, you will need to define two custom Tiptap nodes for inline and block math expressions:

```js
import { Node } from '@tiptap/core';
import MathLive from 'mathlive';

const InlineMathNode = Node.create({
  name: 'inlineMath',
  group: 'inline',
  content: 'text*',
  parseHTML() {
    return [{ tag: 'span.math-inline' }];
  },
  renderHTML({ node }) {
    return ['span', { class: 'math-inline' }, node.textContent];
  },
  addNodeView() {
    return ({ node, updateAttributes }) => {
      const mathField = MathLive.makeMathField(document.createElement('span'));
      mathField.setValue(node.textContent);
      mathField.addEventListener('input', () => {
        updateAttributes({ content: mathField.getValue() });
      });
      return { dom: mathField, contentDOM: mathField };
    };
  },
});

const BlockMathNode = Node.create({
  name: 'blockMath',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'div.math-block' }];
  },
  renderHTML({ node }) {
    return ['div', { class: 'math-block' }, node.textContent];
  },
  addNodeView() {
    return ({ node, updateAttributes }) => {
      const mathField = MathLive.makeMathField(document.createElement('div'));
      mathField.setValue(node.textContent);
      mathField.addEventListener('input', () => {
        updateAttributes({ content: mathField.getValue() });
      });
      return { dom: mathField, contentDOM: mathField };
    };
  },
});
```

Here, `InlineMathNode` is for inline math (appears within text) and `BlockMathNode` is for block-level math (appears on its own line).

## Creating the Toolbar Buttons

Next, you need to create the toolbar with two buttons—one for inserting inline math and another for inserting block math.

```html
<div class="toolbar">
  <button @click="insertInlineMath">Insert Inline Math</button>
  <button @click="insertBlockMath">Insert Block Math</button>
</div>
```

Now, define methods to insert the corresponding math nodes when these buttons are clicked:

```js
methods: {
  insertInlineMath() {
    this.editor.commands.insertContent('<span class="math-inline">x + y = z</span>');
  },
  insertBlockMath() {
    this.editor.commands.insertContent('<div class="math-block">y = mx + b</div>');
  },
},
```

## Styling Math Fields

For visual distinction, you may want to style your math fields (both inline and block). Here's some sample CSS:

```css
.math-inline {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 2px 5px;
  border-radius: 4px;
}

.math-block {
  display: block;
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.toolbar {
  margin-bottom: 10px;
}
```

## Final Touches

Now you can initialize the Tiptap editor and embed it in your Vue component:

```vue
<template>
  <div>
    <div class="toolbar">
      <button @click="insertInlineMath">Inline Math</button>
      <button @click="insertBlockMath">Block Math</button>
    </div>
    <div id="editor-container">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { InlineMathNode, BlockMathNode } from './MathNodes';

export default {
  components: { EditorContent },
  setup() {
    const editor = useEditor({
      extensions: [InlineMathNode, BlockMathNode],
      content: \`
        <p>Here's some inline math: <span class="math-inline">x + y = z</span></p>
        <div class="math-block">y = mx + b</div>
      \`,
    });

    const insertInlineMath = () => {
      editor.commands.insertContent('<span class="math-inline">x + y = z</span>');
    };

    const insertBlockMath = () => {
      editor.commands.insertContent('<div class="math-block">y = mx + b</div>');
    };

    return { editor, insertInlineMath, insertBlockMath };
  },
};
</script>

<style scoped>
.math-inline {
  display: inline-block;
  background-color: #f0f0f0;
  padding: 2px 5px;
  border-radius: 4px;
}

.math-block {
  display: block;
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}
</style>
```

## Conclusion

Now, your Electron app should have:

- Two toolbar buttons to insert inline and block math fields.
- MathLive embedded in the editor to allow interactive math input.
- Tiptap managing the rich text editor, including math fields as custom nodes.

You can extend this setup further by adding more toolbar buttons, handling other math operations, or customizing the MathLive options to suit your needs.
