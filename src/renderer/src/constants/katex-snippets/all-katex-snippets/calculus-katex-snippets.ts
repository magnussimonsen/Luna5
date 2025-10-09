/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const calculusSnippets: KatexSnippetDefinition[] = [
	{ id: 'derivative', label: 'Derivative', title: 'First derivative', latex: '\\frac{d}{dx} f(x)', symbol: 'd/dx' },
	{
		id: 'derivative-limit',
		label: 'Derivative (limit)',
		title: 'Derivative by limit definition',
		latex: '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
		symbol: 'lim'
	},
	{
		id: 'integral',
		label: 'Indefinite integral',
		title: 'Indefinite integral symbol',
		latex: '\\int f(x) \\, dx',
		symbol: '∫f(x)'
	},
	{
		id: 'definite-integral',
		label: 'Definite integral',
		title: 'Definite integral with bounds',
		latex: '\\int_{a}^{b} f(x) \\, dx',
		symbol: '∫ₐᵇ'
	},
	{
		id: 'product-rule',
		label: 'Product rule',
		title: 'Product rule for derivatives',
		latex: '\\frac{d}{dx}[u(x)v(x)] = u^{\\prime}(x)v(x) + u(x)v^{\\prime}(x)',
		symbol: 'product'
	},
	{
		id: 'quotient-rule',
		label: 'Quotient rule',
		title: 'Quotient rule for derivatives',
		latex: '\\frac{d}{dx} \\left( \\frac{u(x)}{v(x)} \\right) = \\frac{u^{\\prime}(x)v(x) - u(x)v^{\\prime}(x)}{[v(x)]^{2}}',
		symbol: 'quotient'
	},
	{
		id: 'integration-by-parts',
		label: 'Integration by parts',
		title: 'Integration by parts formula',
		latex: '\\int u \\, dv = uv - \\int v \\, du',
		symbol: 'IBP'
	}
]
