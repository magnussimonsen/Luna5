/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const setSnippets: KatexSnippetDefinition[] = [
    { id: 'element-of', label: 'Element of', title: 'Element of symbol', latex: '\\in', symbol: '∈' },
    { id: 'not-element-of', label: 'Not element of', title: 'Not element of symbol', latex: '\\notin', symbol: '∉' },
    { id: 'union', label: 'Union', title: 'Union symbol', latex: '\\cup', symbol: '∪' },
    { id: 'intersection', label: 'Intersection', title: 'Intersection symbol', latex: '\\cap', symbol: '∩' },
    { id: 'subset-of', label: 'Subset of', title: 'Subset of symbol', latex: '\\subset', symbol: '⊂' },
    { id: 'superset-of', label: 'Superset of', title: 'Superset of symbol', latex: '\\supset', symbol: '⊃' },
]
