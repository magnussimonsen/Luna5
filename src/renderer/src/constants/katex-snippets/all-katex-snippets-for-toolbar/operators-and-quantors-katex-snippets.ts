/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const operatorQuantorSnippets: KatexSnippetDefinition[] = [
	{ id: 'plus-minus', label: 'Plus-minus', title: 'Plus-minus operator', latex: '\\pm', symbol: '±' },
	{ id: 'times', label: 'Times', title: 'Multiplication operator', latex: '\\times', symbol: '×' },
	{ id: 'cdot', label: 'Centered dot', title: 'Centered dot operator', latex: '\\cdot', symbol: '·' },
	{ id: 'forall', label: 'For all', title: 'Universal quantifier', latex: '\\forall', symbol: '∀' },
	{ id: 'exists', label: 'Exists', title: 'Existential quantifier', latex: '\\exists', symbol: '∃' },
	{ id: 'nexists', label: 'Not exists', title: 'Negated existential quantifier', latex: '\\nexists', symbol: '∄' }
]
