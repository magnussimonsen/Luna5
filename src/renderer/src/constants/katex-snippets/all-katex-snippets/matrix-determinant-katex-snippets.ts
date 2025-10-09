/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const matrixDeterminantSnippets: KatexSnippetDefinition[] = [
	{
		id: 'matrix-2x2-det',
		label: 'Matrix 2×2 determinant',
		title: 'Determinant of a 2×2 matrix',
		latex: `\\begin{vmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{vmatrix}`,
		symbol: '|2×2|'
	},
	{
		id: 'matrix-3x3-det',
		label: 'Matrix 3×3 determinant',
		title: 'Determinant of a 3×3 matrix',
		latex: `\\begin{vmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{vmatrix}`,
		symbol: '|3×3|'
	}
]
