/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const trigonometrySnippets: KatexSnippetDefinition[] = [
	{
		id: 'sine',
		label: 'Sine',
		title: 'Sine function',
		latex: '\\sin\\left( x \\right)',
		symbol: 'sin',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cosine',
		label: 'Cosine',
		title: 'Cosine function',
		latex: '\\cos\\left( x \\right)',
		symbol: 'cos',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'tangent',
		label: 'Tangent',
		title: 'Tangent function',
		latex: '\\tan\\left( x \\right)',
		symbol: 'tan',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cotangent',
		label: 'Cotangent',
		title: 'Cotangent function',
		latex: '\\cot\\left( x \\right)',
		symbol: 'cot',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'secant',
		label: 'Secant',
		title: 'Secant function',
		latex: '\\sec\\left( x \\right)',
		symbol: 'sec',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cosecant',
		label: 'Cosecant',
		title: 'Cosecant function',
		latex: '\\csc\\left( x \\right)',
		symbol: 'csc',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'arcsine',
		label: 'Inverse sine',
		title: 'Arcsine function',
		latex: '\\sin^{-1}\\left( x \\right)',
		symbol: 'sin⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	},
	{
		id: 'arccosine',
		label: 'Inverse cosine',
		title: 'Arccosine function',
		latex: '\\cos^{-1}\\left( x \\right)',
		symbol: 'cos⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	},
	{
		id: 'arctangent',
		label: 'Inverse tangent',
		title: 'Arctangent function',
		latex: '\\tan^{-1}\\left( x \\right)',
		symbol: 'tan⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	}
]
