/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const matrixBracketSnippets: KatexSnippetDefinition[] = [
	{
		id: 'matrix-2x1-bracket',
		label: 'Matrix 2×1',
		title: 'Column vector (2×1)',
		latex: `\\begin{bmatrix}
	a_{1} \\\\
	a_{2}
\\end{bmatrix}`,
		symbol: '[2×1]'
	},
	{
		id: 'matrix-1x2-bracket',
		label: 'Matrix 1×2',
		title: 'Row vector (1×2)',
		latex: `\\begin{bmatrix} a_{1} & a_{2} \\end{bmatrix}`,
		symbol: '[1×2]'
	},
	{
		id: 'matrix-2x2-bracket',
		label: 'Matrix 2×2',
		title: 'Matrix 2×2',
		latex: `\\begin{bmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{bmatrix}`,
		symbol: '[2×2]'
	},
	{
		id: 'matrix-3x3-bracket',
		label: 'Matrix 3×3',
		title: 'Matrix 3×3',
		latex: `\\begin{bmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{bmatrix}`,
		symbol: '[3×3]'
	}
]
