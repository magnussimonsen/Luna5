/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const arrowsSnippets: KatexSnippetDefinition[] = [
    { id: 'equivalent', label: 'Equivalent', title: 'Equivalent symbol', latex: '\\Leftrightarrow', symbol: '<=>' },
    { id: 'implies-right', label: 'Implies', title: 'Implies symbol', latex: '\\Rightarrow', symbol: '⇒' },
    { id: 'implies-left', label: 'Is implied by', title: 'Is implied by symbol', latex: '\\Leftarrow', symbol: '⇐' },
    { id: 'right-arrow', label: 'Right arrow', title: 'Right arrow symbol', latex: '\\rightarrow', symbol: '→' },
    { id: 'left-arrow', label: 'Left arrow', title: 'Left arrow symbol', latex: '\\leftarrow', symbol: '←' },
    { id: 'up-arrow', label: 'Up arrow', title: 'Up arrow symbol', latex: '\\uparrow', symbol: '↑' },
    { id: 'down-arrow', label: 'Down arrow', title: 'Down arrow symbol', latex: '\\downarrow', symbol: '↓' }
]
