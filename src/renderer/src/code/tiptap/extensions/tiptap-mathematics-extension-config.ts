/*
See: https://tiptap.dev/docs/editor/extensions/nodes/mathematics
Configuring the extension and updating math nodes
The extension comes with a few options to configure the behavior of the math nodes.

The node template extension can be found at: node_modules/@tiptap/extension-mathematics/src/mathematics.ts

*/

import Mathematics from '@tiptap/extension-mathematics'
import type { Editor } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'

// Configuration options for the Mathematics extension
export const mathematicsConfig = {
  // Options for the inline math node
  inlineOptions: {
    onClick: (node: Node, pos: number) => {
      // Note: Editor access needs to be handled differently in the actual implementation
      // This is a simplified version - you'll need to pass the editor instance when using this
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        // Editor will be available in the actual context where this is used
        console.log('Would update inline math at position', pos, 'with latex:', katex)
      }
    }
  },

  // Options for the block math node
  blockOptions: {
    onClick: (node: Node, pos: number) => {
      // Note: Editor access needs to be handled differently in the actual implementation
      const katex = prompt('Enter new calculation:', node.attrs.latex)
      if (katex) {
        // Editor will be available in the actual context where this is used
        console.log('Would update block math at position', pos, 'with latex:', katex)
      }
    }
  },

  // Options for the KaTeX renderer. See here: https://katex.org/docs/options.html
  katexOptions: {
    throwOnError: false, // don't throw an error if the LaTeX code is invalid
    macros: {
      '\\R': '\\mathbb{R}', // add a macro for the real numbers
      '\\N': '\\mathbb{N}', // add a macro for the natural numbers
      '\\Z': '\\mathbb{Z}', // add a macro for the integers
      '\\Q': '\\mathbb{Q}', // add a macro for the rationals
      '\\C': '\\mathbb{C}' // add a macro for the complex numbers
    }
  }
}

// Export a function that creates the configured extension
export const createMathematicsExtension = (): typeof Mathematics => {
  return Mathematics.configure(mathematicsConfig)
}

// Helper function to create onClick handlers with editor access
export const createMathClickHandlers = (
  editor: Editor
): {
  inlineOnClick: (node: Node, pos: number) => void
  blockOnClick: (node: Node, pos: number) => void
} => ({
  inlineOnClick: (node: Node, pos: number) => {
    const katex = prompt('Enter new calculation:', node.attrs.latex)
    if (katex) {
      editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
    }
  },
  blockOnClick: (node: Node, pos: number) => {
    const katex = prompt('Enter new calculation:', node.attrs.latex)
    if (katex) {
      editor.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
    }
  }
})
