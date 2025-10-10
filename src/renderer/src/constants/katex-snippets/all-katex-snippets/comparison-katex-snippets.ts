/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const comparisonSnippets: KatexSnippetDefinition[] = [
	{
		id: 'approximately-equal',
		label: 'Approximately equal',
		title: 'Approximately equal symbol',
		latex: '\\approx',
		symbol: '≈'
	},
	{ id: 'not-equal', label: 'Not equal', title: 'Not equal symbol', latex: String.raw`\neq`, symbol: '≠' },
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
	
	{ id: 'much-less-than', label: 'Much less than', title: 'Much less than symbol', latex: '\\ll', symbol: '≪' },
	{ id: 'much-greater-than', label: 'Much greater than', title: 'Much greater than symbol', latex: '\\gg', symbol: '≫' },
	{
		id: 'proportional-to',
		label: 'Proportional to',
		title: 'Proportional symbol',
		latex: '\\propto',
		symbol: '∝'
	}
]
