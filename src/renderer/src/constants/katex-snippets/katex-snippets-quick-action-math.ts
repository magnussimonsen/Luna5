import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const quickActionMathSnippets: KatexSnippetDefinition[] = [
  {
    id: 'space',
    label: 'Space',
    title: 'Inserts a space character',
    latex: '\\,',
    symbol: '␣',
    selection: {
      startOffset: 2,
      endOffset: 3
    }
  },
  {
    id: 'fraction',
    label: 'Fraction',
    title: 'Inserts a fraction',
    latex: '\\dfrac{a}{b}',
    symbol: 'a⁄b',
    selection: {
      startOffset: 6,
      endOffset: 7
    }
  },
  {
    id: 'sqrt',
    label: 'Square root',
    title: 'Inserts a square root',
    latex: '\\sqrt{x}',
    symbol: '√',
    selection: {
      startOffset: 4,
      endOffset: 5
    }
  },
  {
    id: 'nth-root',
    label: 'Nth root',
    title: 'Inserts an nth root',
    latex: '\\sqrt[3]{x}',
    symbol: '∛',
    selection: {
      startOffset: 6,
      endOffset: 7
    }
  },
  {
    id: 'subscript',
    label: 'Subscript',
    title: 'Inserts a subscript',
    latex: 'a_{x}',
    symbol: 'aₓ',
    selection: {
      startOffset: 3,
      endOffset: 4
    }
  },
  {
    id: 'superscript',
    label: 'Superscript',
    title: 'Inserts a superscript',
    latex: 'a^{x}',
    symbol: 'aˣ',
    selection: {
      startOffset: 3,
      endOffset: 4
    }
  },
  {
    id: 'exponent',
    label: 'Exponent',
    title: 'Inserts an exponent',
    latex: 'e^{x}',
    symbol: 'eˣ',
    selection: { startOffset: 3, endOffset: 4 }
  },
  {
    id: 'logarithm',
    label: 'Logarithm',
    title: 'Inserts a logarithm',
    latex: '\\log(x)',
    symbol: 'log',
    selection: { startOffset: 5, endOffset: 6 }
  },
  {
    id: 'natural-logarithm',
    label: 'Natural Logarithm',
    title: 'Inserts a natural logarithm',
    latex: '\\ln(x)',
    symbol: 'ln',
    selection: { startOffset: 4, endOffset: 5 }
  },
  {
    id: 'summation',
    label: 'Summation',
    title: 'Inserts a summation',
    latex: '\\sum_{n=1}^{\\infty} a_{n}',
    symbol: 'Σ',
    selection: {
      startOffset: 6,
      endOffset: 7
    }
  },
  {
    id: 'product',
    label: 'Product',
    title: 'Inserts a product',
    latex: '\\prod_{k=1}^{N} a_{k}',
    symbol: '∏',
    selection: {
      startOffset: 6,
      endOffset: 15
    }
  },
  {
    id: 'integral',
    label: 'Integral',
    title: 'Inserts an integral',
    latex: '\\int_{a}^{b} f(x) \\, dx',
    symbol: '∫',
    selection: { startOffset: 6, endOffset: 7 }
  }
]
