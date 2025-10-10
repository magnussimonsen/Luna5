import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const matrixParenthesisSnippets: KatexSnippetDefinition[] = [
  {
    id: 'matrix-1x2-paren',
    label: 'Matrix 1×2',
    title: 'Row vector (1×2)',
    latex: `\\begin{pmatrix} a_{1} & a_{2} \\end{pmatrix}`,
    symbol: '(1×2)'
  },
  {
    id: 'matrix-1x3-paren',
    label: 'Matrix 1×3',
    title: 'Row vector (1×3)',
    latex: `\\begin{pmatrix} a_{1} & a_{2} & a_{3} \\end{pmatrix}`,
    symbol: '(1×3)'
  },
  {
    id: 'matrix-2x1-paren',
    label: 'Matrix 2×1',
    title: 'Column vector (2×1)',
    latex: `\\begin{pmatrix}
	a_{1} \\\\
	a_{2}
\\end{pmatrix}`,
    symbol: '(2×1)'
  },
  {
    id: 'matrix-2x2-paren',
    label: 'Matrix 2×2',
    title: 'Matrix 2×2',
    latex: `\\begin{pmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{pmatrix}`,
    symbol: '(2×2)'
  },
  {
    id: 'matrix-2x3-paren',
    label: 'Matrix 2×3',
    title: 'Matrix 2×3',
    latex: `\\begin{pmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23}
\\end{pmatrix}`,
    symbol: '(2×3)'
  },
  {
    id: 'matrix-3x1-paren',
    label: 'Matrix 3×1',
    title: 'Column vector (3×1)',
    latex: `\\begin{pmatrix}
	a_{1} \\\\
	a_{2} \\\\
	a_{3}
\\end{pmatrix}`,
    symbol: '(3×1)'
  },
  {
    id: 'matrix-3x2-paren',
    label: 'Matrix 3×2',
    title: 'Matrix 3×2',
    latex: `\\begin{pmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22} \\\\
	a_{31} & a_{32}
\\end{pmatrix}`,
    symbol: '(3×2)'
  },
  {
    id: 'matrix-3x3-paren',
    label: 'Matrix 3×3',
    title: 'Matrix 3×3',
    latex: `\\begin{pmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{pmatrix}`,
    symbol: '(3×3)'
  }
]
