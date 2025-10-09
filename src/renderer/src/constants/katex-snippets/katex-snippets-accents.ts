/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const accentSnippets: KatexSnippetDefinition[] = [
  {
    id: 'vector',
    label: 'Vector',
    title: 'Places a vector arrow over the character',
    latex: '\\vec{v}',
    symbol: '𝑣⃗',
    selection: { startOffset: 6, endOffset: 7 }
  },
  {
    id: 'tilde',
    label: 'Tilde',
    title: 'Adds a tilde accent',
    latex: '\\tilde{x}',
    symbol: 'x̃',
    selection: { startOffset: 7, endOffset: 8 }
  },
  {
    id: 'hat',
    label: 'Hat',
    title: 'Adds a hat accent',
    latex: '\\hat{x}',
    symbol: 'x̂',
    selection: { startOffset: 5, endOffset: 6 }
  },
  {
    id: 'bar',
    label: 'Bar',
    title: 'Adds an overbar accent',
    latex: '\\bar{x}',
    symbol: 'x̄',
    selection: { startOffset: 5, endOffset: 6 }
  },
  {
    id: 'overline',
    label: 'Overline',
    title: 'Places an overline across the expression',
    latex: '\\overline{x}',
    symbol: 'x̅',
    selection: { startOffset: 10, endOffset: 11 }
  },
  {
    id: 'underline',
    label: 'Underline',
    title: 'Places an underline under the expression',
    latex: '\\underline{x}',
    symbol: 'x̲',
    selection: { startOffset: 12, endOffset: 13 }
  }
]
