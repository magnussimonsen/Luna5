import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'
/* eslint-disable prettier/prettier */

export const piecewiseSnippets: KatexSnippetDefinition[] = [
    {
        id: 'piecewise-function',
        label: 'Piecewise function',
        title: 'Inserts a piecewise function template',
        latex: `f(x) = \\begin{cases}
            a & \\text{if } x < 0 \\\\
            b & \\text{if } x \\geq 0
        \\end{cases}`,
        symbol: 'f(x) = { a, if x < 0; b, if x ≥ 0 }'
    }
]
