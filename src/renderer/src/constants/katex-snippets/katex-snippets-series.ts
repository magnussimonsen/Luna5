/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const seriesSnippets: KatexSnippetDefinition[] = [
	{
		id: 'arithmetic-series',
		label: 'Arithmetic series',
		title: 'Arithmetic series',
		latex: '\\sum_{k=1}^{n} (a_{1} + (k-1)d)',
		symbol: 'Σₐ'
	},
	{
		id: 'arithmetic-sum',
		label: 'Arithmetic sum',
		title: 'Sum of arithmetic series',
		latex: 'S_{n} = \\frac{n}{2}(2a_{1} + (n-1)d)',
		symbol: 'Sₐ'
	},
	{
		id: 'geometric-series',
		label: 'Geometric series',
		title: 'Finite geometric series',
		latex: '\\sum_{k=0}^{n-1} a r^{k}',
		symbol: 'Σgₙ'
	},
	{
		id: 'geometric-sum',
		label: 'Geometric sum',
		title: 'Sum of finite geometric series',
		latex: 'S_{n} = a \\frac{1 - r^{n}}{1 - r}',
		symbol: 'Sgₙ'
	},
	{
		id: 'geometric-infinite',
		label: 'Infinite geometric series',
		title: 'Infinite geometric series',
		latex: '\\sum_{k=0}^{\\infty} a r^{k}',
		symbol: 'Σg∞'
	},
	{
		id: 'geometric-infinite-sum',
		label: 'Infinite geometric sum',
		title: 'Sum of infinite geometric series',
		latex: 'S = \\frac{a}{1 - r}, \\quad |r| < 1',
		symbol: 'Sg∞'
	}
]
