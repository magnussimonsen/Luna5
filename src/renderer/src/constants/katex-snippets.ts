/* eslint-disable prettier/prettier */

export interface KatexSnippetDefinition {
	id: string
	label: string
	latex: string
	iconClass?: string
	symbol?: string
	selection?: {
		startOffset: number
		endOffset: number
	}
}


export const greekLetterSnippets: KatexSnippetDefinition[] = [
	{ id: 'alpha', label: 'Alpha', latex: '\\alpha', symbol: 'α' },
	{ id: 'beta', label: 'Beta', latex: '\\beta', symbol: 'β' },
	{ id: 'gamma', label: 'Gamma', latex: '\\gamma', symbol: 'γ' },
	{ id: 'gamma-capital', label: 'Gamma (capital)', latex: '\\Gamma', symbol: 'Γ' },
	{ id: 'delta', label: 'Delta', latex: '\\delta', symbol: 'δ' },
	{ id: 'delta-capital', label: 'Delta (capital)', latex: '\\Delta', symbol: 'Δ' },
	{ id: 'epsilon', label: 'Epsilon', latex: '\\epsilon', symbol: 'ε' },
	{ id: 'theta', label: 'Theta', latex: '\\theta', symbol: 'θ' },
	{ id: 'theta-capital', label: 'Theta (capital)', latex: '\\Theta', symbol: 'Θ' },
	{ id: 'lambda', label: 'Lambda', latex: '\\lambda', symbol: 'λ' },
	{ id: 'lambda-capital', label: 'Lambda (capital)', latex: '\\Lambda', symbol: 'Λ' },
	{ id: 'mu', label: 'Mu', latex: '\\mu', symbol: 'μ' },
	{ id: 'pi', label: 'Pi', latex: '\\pi', symbol: 'π' },
	{ id: 'pi-capital', label: 'Pi (capital)', latex: '\\Pi', symbol: 'Π' },
	{ id: 'sigma', label: 'Sigma', latex: '\\sigma', symbol: 'σ' },
	{ id: 'sigma-capital', label: 'Sigma (capital)', latex: '\\Sigma', symbol: 'Σ' },
	{ id: 'phi', label: 'Phi', latex: '\\phi', symbol: 'φ' },
	{ id: 'phi-capital', label: 'Phi (capital)', latex: '\\Phi', symbol: 'Φ' },
	{ id: 'psi', label: 'Psi', latex: '\\psi', symbol: 'ψ' },
	{ id: 'omega', label: 'Omega', latex: '\\omega', symbol: 'ω' },
	{ id: 'omega-capital', label: 'Omega (capital)', latex: '\\Omega', symbol: 'Ω' }
]

export const comparisonSnippets: KatexSnippetDefinition[] = [
	{ id: 'equal', label: 'Equals', latex: '=', symbol: '=' },
	{ id: 'not-equal', label: 'Not equal', latex: '\\ne', symbol: '≠' },
	{ id: 'approximately-equal', label: 'Approximately equal', latex: '\\approx', symbol: '≈' },
	{ id: 'less-or-equal', label: 'Less than or equal', latex: '\\le', symbol: '≤' },
	{ id: 'greater-or-equal', label: 'Greater than or equal', latex: '\\ge', symbol: '≥' },
	{ id: 'proportional-to', label: 'Proportional to', latex: '\\propto', symbol: '∝' }
]

export const accentSnippets: KatexSnippetDefinition[] = [
	{
		id: 'vector',
		label: 'Vector',
		latex: '\\vec{v}',
		symbol: '𝑣⃗',
		selection: { startOffset: 6, endOffset: 7 }
	},
	{
		id: 'tilde',
		label: 'Tilde',
		latex: '\\tilde{x}',
		symbol: 'x̃',
		selection: { startOffset: 7, endOffset: 8 }
	},
	{
		id: 'hat',
		label: 'Hat',
		latex: '\\hat{x}',
		symbol: 'x̂',
		selection: { startOffset: 5, endOffset: 6 }
	},
	{
		id: 'bar',
		label: 'Bar',
		latex: '\\bar{x}',
		symbol: 'x̄',
		selection: { startOffset: 5, endOffset: 6 }
	},
	{
		id: 'overline',
		label: 'Overline',
		latex: '\\overline{x}',
		symbol: 'x̅',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'underline',
		label: 'Underline',
		latex: '\\underline{x}',
		symbol: 'x̲',
		selection: { startOffset: 12, endOffset: 13 }
	}
]

export const parenthesesSnippets: KatexSnippetDefinition[] = [
	{
		id: 'round',
		label: 'Parentheses ( )',
		latex: '\\left(  \\right)',
		symbol: '()',
		selection: { startOffset: 7, endOffset: 8 }
	},
	{
		id: 'square',
		label: 'Brackets [ ]',
		latex: '\\left[  \\right]',
		symbol: '[]',
		selection: { startOffset: 7, endOffset: 8 }
	},
	{
		id: 'curly',
		label: 'Braces { }',
		latex: '\\left\\{  \\right\\}',
		symbol: '{}',
		selection: { startOffset: 8, endOffset: 9 }
	},
	{
		id: 'angle',
		label: 'Angles ⟨ ⟩',
		latex: '\\left\\langle  \\right\\rangle',
		symbol: '⟨⟩',
		selection: { startOffset: 13, endOffset: 14 }
	}
]

export const trigonometrySnippets: KatexSnippetDefinition[] = [
	{
		id: 'sine',
		label: 'Sine',
		latex: '\\sin\\left( x \\right)',
		symbol: 'sin',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cosine',
		label: 'Cosine',
		latex: '\\cos\\left( x \\right)',
		symbol: 'cos',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'tangent',
		label: 'Tangent',
		latex: '\\tan\\left( x \\right)',
		symbol: 'tan',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cotangent',
		label: 'Cotangent',
		latex: '\\cot\\left( x \\right)',
		symbol: 'cot',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'secant',
		label: 'Secant',
		latex: '\\sec\\left( x \\right)',
		symbol: 'sec',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'cosecant',
		label: 'Cosecant',
		latex: '\\csc\\left( x \\right)',
		symbol: 'csc',
		selection: { startOffset: 10, endOffset: 11 }
	},
	{
		id: 'arcsine',
		label: 'Inverse sine',
		latex: '\\sin^{-1}\\left( x \\right)',
		symbol: 'sin⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	},
	{
		id: 'arccosine',
		label: 'Inverse cosine',
		latex: '\\cos^{-1}\\left( x \\right)',
		symbol: 'cos⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	},
	{
		id: 'arctangent',
		label: 'Inverse tangent',
		latex: '\\tan^{-1}\\left( x \\right)',
		symbol: 'tan⁻¹',
		selection: { startOffset: 15, endOffset: 16 }
	}
]

export const calculusSnippets: KatexSnippetDefinition[] = [
	{ id: 'derivative', label: 'Derivative', latex: '\\frac{d}{dx} f(x)', symbol: 'd/dx' },
	{
		id: 'derivative-limit',
		label: 'Derivative (limit)',
		latex: '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
		symbol: 'lim'
	},
	{ id: 'integral', label: 'Indefinite integral', latex: '\\int f(x) \\, dx', symbol: '∫f(x)' },
	{
		id: 'definite-integral',
		label: 'Definite integral',
		latex: '\\int_{a}^{b} f(x) \\, dx',
		symbol: '∫ₐᵇ'
	},
		{
			id: 'product-rule',
			label: 'Product rule',
			latex: '\\frac{d}{dx}[u(x)v(x)] = u^{\\prime}(x)v(x) + u(x)v^{\\prime}(x)',
			symbol: 'product'
		},
		{
			id: 'quotient-rule',
			label: 'Quotient rule',
			latex: '\\frac{d}{dx} \\left( \\frac{u(x)}{v(x)} \\right) = \\frac{u^{\\prime}(x)v(x) - u(x)v^{\\prime}(x)}{[v(x)]^{2}}',
			symbol: 'quotient'
		},
	{
		id: 'integration-by-parts',
		label: 'Integration by parts',
		latex: '\\int u \\, dv = uv - \\int v \\, du',
		symbol: 'IBP'
	}
]

export const probabilitySnippets: KatexSnippetDefinition[] = [
	{ id: 'probability', label: 'Probability of event', latex: 'P(A)', symbol: 'P(A)' },
	{
		id: 'union',
		label: 'Union of events',
		latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
		symbol: 'P(A ∪ B)'
	},
	{
		id: 'intersection',
		label: 'Intersection of events',
		latex: 'P(A \\cap B)',
		symbol: 'P(A ∩ B)'
	},
	{
		id: 'conditional',
		label: 'Conditional probability',
		latex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
		symbol: 'P(A|B)'
	},
	{
		id: 'bayes',
		label: "Bayes' theorem",
		latex: 'P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}',
		symbol: 'Bayes'
	},
	{
		id: 'expected-value',
		label: 'Expected value',
		latex: '\\mathbb{E}[X] = \\sum_{i} x_{i} p_{i}',
		symbol: 'E[X]'
	},
	{
		id: 'variance',
		label: 'Variance',
		latex: '\\operatorname{Var}(X) = \\mathbb{E}[X^{2}] - (\\mathbb{E}[X])^{2}',
		symbol: 'Var(X)'
	}
]

export const geometrySnippets: KatexSnippetDefinition[] = [
	{ id: 'pythagorean', label: 'Pythagorean theorem', latex: 'a^{2} + b^{2} = c^{2}', symbol: 'a²+b²=c²' },
	{
		id: 'distance',
		label: 'Distance formula',
		latex: 'd = \\sqrt{(x_{2} - x_{1})^{2} + (y_{2} - y_{1})^{2}}',
		symbol: 'distance'
	},
	{ id: 'circle-area', label: 'Area of a circle', latex: 'A = \\pi r^{2}', symbol: 'πr²' },
	{ id: 'triangle-area', label: 'Area of a triangle', latex: 'A = \\frac{1}{2} b h', symbol: '½bh' },
	{
		id: 'slope',
		label: 'Slope of a line',
		latex: 'm = \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}',
		symbol: 'slope'
	}
]

export const scienceFormulaSnippets: KatexSnippetDefinition[] = [
	{ id: 'ohms-law', label: "Ohm's law", latex: 'V = I R', symbol: 'V=IR' },
	{ id: 'newton-second-law', label: "Newton's second law", latex: 'F = m a', symbol: 'F=ma' },
	{ id: 'einstein', label: 'Mass-energy equivalence', latex: 'E = m c^{2}', symbol: 'E=mc²' },
	{ id: 'planck-relation', label: 'Planck relation', latex: 'E = h \\nu', symbol: 'E=hν' },
	{
		id: 'coulomb-law',
		label: "Coulomb's law",
		latex: 'F = k \\frac{q_{1} q_{2}}{r^{2}}',
		symbol: 'F=kq₁q₂/r²'
	},
	{
		id: 'schrodinger',
		label: 'Time-dependent Schrödinger equation',
		latex: 'i \\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi',
		symbol: 'iħ∂Ψ/∂t'
	}
]

export const fundamentalConstantSnippets: KatexSnippetDefinition[] = [
	{ id: 'pi', label: 'Pi', latex: '\\pi', symbol: 'π' },
	{ id: 'euler-number', label: 'Euler number', latex: '\\mathrm{e}', symbol: 'e' },
	{
		id: 'speed-of-light',
		label: 'Speed of light',
		latex: 'c = 2.9979 \\times 10^{8} \\; \\mathrm{m\\,s^{-1}}',
		symbol: 'c'
	},
	{
		id: 'gravitational-constant',
		label: 'Gravitational constant',
		latex: 'G = 6.6743 \\times 10^{-11} \\; \\mathrm{m^{3}\\,kg^{-1}\\,s^{-2}}',
		symbol: 'G'
	},
	{ id: 'planck-constant', label: "Planck's constant", latex: 'h = 6.6261 \\times 10^{-34} \\; \\mathrm{J\\,s}', symbol: 'h' },
	{ id: 'reduced-planck', label: 'Reduced Planck constant', latex: '\\hbar = \\frac{h}{2\\pi}', symbol: 'ħ' },
	{
		id: 'boltzmann-constant',
		label: "Boltzmann's constant",
		latex: 'k_{\\mathrm{B}} = 1.3806 \\times 10^{-23} \\; \\mathrm{J\\,K^{-1}}',
		symbol: 'k_B'
	},
	{
		id: 'avogadro-number',
		label: "Avogadro's number",
		latex: 'N_{\\mathrm{A}} = 6.0221 \\times 10^{23} \\; \\mathrm{mol^{-1}}',
		symbol: 'N_A'
	},
	{
		id: 'gas-constant',
		label: 'Universal gas constant',
		latex: 'R = 8.3145 \\; \\mathrm{J\\,mol^{-1}\\,K^{-1}}',
		symbol: 'R'
	},
	{
		id: 'elementary-charge',
		label: 'Elementary charge',
		latex: 'e = 1.6022 \\times 10^{-19} \\; \\mathrm{C}',
		symbol: 'e⁻'
	}
]

export const numberSetSnippets: KatexSnippetDefinition[] = [
	{ id: 'real', label: 'Real numbers', latex: '\\mathbb{R}', symbol: 'ℝ' },
	{ id: 'complex', label: 'Complex numbers', latex: '\\mathbb{C}', symbol: 'ℂ' },
	{ id: 'rational', label: 'Rational numbers', latex: '\\mathbb{Q}', symbol: 'ℚ' },
	{ id: 'integers', label: 'Integers', latex: '\\mathbb{Z}', symbol: 'ℤ' },
	{ id: 'natural', label: 'Natural numbers', latex: '\\mathbb{N}', symbol: 'ℕ' },
	{ id: 'primes', label: 'Prime numbers', latex: '\\mathbb{P}', symbol: 'ℙ' }
]

export const seriesSnippets: KatexSnippetDefinition[] = [
	{
		id: 'arithmetic-series',
		label: 'Arithmetic series',
		latex: '\\sum_{k=1}^{n} (a_{1} + (k-1)d)',
		symbol: 'Σₐ'
	},
	{
		id: 'arithmetic-sum',
		label: 'Arithmetic sum',
		latex: 'S_{n} = \\frac{n}{2}(2a_{1} + (n-1)d)',
		symbol: 'Sₐ'
	},
	{
		id: 'geometric-series',
		label: 'Geometric series',
		latex: '\\sum_{k=0}^{n-1} a r^{k}',
		symbol: 'Σgₙ'
	},
	{
		id: 'geometric-sum',
		label: 'Geometric sum',
		latex: 'S_{n} = a \\frac{1 - r^{n}}{1 - r}',
		symbol: 'Sgₙ'
	},
	{
		id: 'geometric-infinite',
		label: 'Infinite geometric series',
		latex: '\\sum_{k=0}^{\\infty} a r^{k}',
		symbol: 'Σg∞'
	},
	{
		id: 'geometric-infinite-sum',
		label: 'Infinite geometric sum',
		latex: 'S = \\frac{a}{1 - r}, \\quad |r| < 1',
		symbol: 'Sg∞'
	}
]

export const matrixBracketSnippets: KatexSnippetDefinition[] = [
	{
		id: 'matrix-2x1-bracket',
		label: 'Matrix 2×1',
		latex: `\\begin{bmatrix}
	a_{1} \\\\
	a_{2}
\\end{bmatrix}`,
		symbol: '[2×1]'
	},
	{
		id: 'matrix-1x2-bracket',
		label: 'Matrix 1×2',
		latex: `\\begin{bmatrix} a_{1} & a_{2} \\end{bmatrix}`,
		symbol: '[1×2]'
	},
	{
		id: 'matrix-2x2-bracket',
		label: 'Matrix 2×2',
		latex: `\\begin{bmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{bmatrix}`,
		symbol: '[2×2]'
	},
	{
		id: 'matrix-3x3-bracket',
		label: 'Matrix 3×3',
		latex: `\\begin{bmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{bmatrix}`,
		symbol: '[3×3]'
	}
]

export const matrixParenthesisSnippets: KatexSnippetDefinition[] = [
	{
		id: 'matrix-2x1-paren',
		label: 'Matrix 2×1',
		latex: `\\begin{pmatrix}
	a_{1} \\\\
	a_{2}
\\end{pmatrix}`,
		symbol: '(2×1)'
	},
	{
		id: 'matrix-1x2-paren',
		label: 'Matrix 1×2',
		latex: `\\begin{pmatrix} a_{1} & a_{2} \\end{pmatrix}`,
		symbol: '(1×2)'
	},
	{
		id: 'matrix-2x2-paren',
		label: 'Matrix 2×2',
		latex: `\\begin{pmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{pmatrix}`,
		symbol: '(2×2)'
	},
	{
		id: 'matrix-3x3-paren',
		label: 'Matrix 3×3',
		latex: `\\begin{pmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{pmatrix}`,
		symbol: '(3×3)'
	}
]

export const matrixDeterminantSnippets: KatexSnippetDefinition[] = [
	{
		id: 'matrix-2x2-det',
		label: 'Matrix 2×2 determinant',
		latex: `\\begin{vmatrix}
	a_{11} & a_{12} \\\\
	a_{21} & a_{22}
\\end{vmatrix}`,
		symbol: '|2×2|'
	},
	{
		id: 'matrix-3x3-det',
		label: 'Matrix 3×3 determinant',
		latex: `\\begin{vmatrix}
	a_{11} & a_{12} & a_{13} \\\\
	a_{21} & a_{22} & a_{23} \\\\
	a_{31} & a_{32} & a_{33}
\\end{vmatrix}`,
		symbol: '|3×3|'
	}
]

