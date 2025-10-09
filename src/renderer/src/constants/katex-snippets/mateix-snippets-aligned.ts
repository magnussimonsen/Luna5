import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'
/* eslint-disable prettier/prettier */

export const alignedSnippets: KatexSnippetDefinition[] = [
    {
        id: 'aligned-equations',
        label: 'Aligned equations',
        title: 'Inserts an aligned equations environment',
        latex: `\\begin{aligned}
            a & = b  \\\\
            c & = d
        \\end{aligned}`,
        symbol: 'aligned'
    }
]
