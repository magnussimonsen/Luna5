/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const alignedSnippets: KatexSnippetDefinition[] = [
  {
    id: 'aligned',
    label: 'Aligned environment',
    title: 'Aligned equations environment',
    latex: `\\begin{aligned}
      a & = b + c \\
      d & = e + f
    \\end{aligned}`,
    symbol: 'aligned'
  }
]
