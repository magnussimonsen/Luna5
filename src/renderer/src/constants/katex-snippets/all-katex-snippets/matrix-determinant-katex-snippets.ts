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
  },
  {
    id: 'matrix-4x4-det',
    label: 'Matrix 4×4 determinant',
    title: 'Determinant of a 4×4 matrix',
    latex: `\\begin{vmatrix}
	a_{11} & a_{12} & a_{13} & a_{14} \\\\
	a_{21} & a_{22} & a_{23} & a_{24} \\\\
	a_{31} & a_{32} & a_{33} & a_{34} \\\\
	a_{41} & a_{42} & a_{43} & a_{44}
\\end{vmatrix}`,
    symbol: '|4×4|'
  },
  {
    id: 'cross-product-formula',
    label: 'Cross product formula',
    title: 'Cross product u⃗ × v⃗ with determinant expansion',
    latex: `\\begin{aligned}
\\vec{u} \\times \\vec{v} &= \\begin{vmatrix}
\\vec{i} & \\vec{j} & \\vec{k} \\\\
u_1 & u_2 & u_3 \\\\
v_1 & v_2 & v_3
\\end{vmatrix} \\\\
&= \\vec{i} \\begin{vmatrix} u_2 & u_3 \\\\ v_2 & v_3 \\end{vmatrix} 
- \\vec{j} \\begin{vmatrix} u_1 & u_3 \\\\ v_1 & v_3 \\end{vmatrix} 
+ \\vec{k} \\begin{vmatrix} u_1 & u_2 \\\\ v_1 & v_2 \\end{vmatrix}
\\end{aligned}`,
    symbol: 'u×v'
  }
]
