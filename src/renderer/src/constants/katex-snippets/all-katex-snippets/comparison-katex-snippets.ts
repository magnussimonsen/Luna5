/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const comparisonSnippets: KatexSnippetDefinition[] = [
	{ id: 'equal', label: 'Equals', title: 'Equality symbol', latex: '=', symbol: '=' },
	{ id: 'not-equal', label: 'Not equal', title: 'Not equal symbol', latex: '\\ne', symbol: '≠' },
	{
		id: 'approximately-equal',
		label: 'Approximately equal',
		title: 'Approximately equal symbol',
		latex: '\\approx',
		symbol: '≈'
	},
	{
		id: 'less-or-equal',
		label: 'Less than or equal',
		title: 'Less than or equal symbol',
		latex: '\\le',
		symbol: '≤'
	},
	{
		id: 'greater-or-equal',
		label: 'Greater than or equal',
		title: 'Greater than or equal symbol',
		latex: '\\ge',
		symbol: '≥'
	},
	{
		id: 'proportional-to',
		label: 'Proportional to',
		title: 'Proportional symbol',
		latex: '\\propto',
		symbol: '∝'
	}
]
