/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const alignedSnippets: KatexSnippetDefinition[] = [
  {
    id: 'aligned',
    label: 'Aligned environment',
    title: 'Aligned equations environment',
    latex: `\\begin{aligned}
       x&=4-y  \\\\
       y&=x+2  \\\\
\\end{aligned}`,
    symbol: 'aligned'
  }
]
