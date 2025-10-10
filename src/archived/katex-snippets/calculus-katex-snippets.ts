/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const calculusSnippets: KatexSnippetDefinition[] = [
  // ===============================
  // 1) Basic differentiation definitions
  // ===============================
  { id: 'derivative', label: 'Derivative', title: 'First derivative', latex: '\\frac{d}{dx} f(x)', symbol: 'd/dx f(x)' },
  {
    id: 'derivative-limit',
    label: 'Derivative (limit definition)',
    title: 'Derivative defined as a limit',
    latex: '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
    symbol: 'lim Δy/Δx'
  },

  // ===============================
  // 2) Basic integration definitions
  // ===============================
  {
    id: 'integral',
    label: 'Indefinite integral',
    title: 'Indefinite integral symbol',
    latex: '\\int f(x) \\, dx',
    symbol: '∫f(x)dx'
  },
  {
    id: 'definite-integral',
    label: 'Definite integral',
    title: 'Definite integral with bounds',
    latex: '\\int_{a}^{b} f(x) \\, dx',
    symbol: '∫ₐᵇf(x)dx'
  },

  // ===============================
  // 3) Fundamental rules of differentiation
  // ===============================
  {
    id: 'power-rule',
    label: 'Power rule',
    title: 'Derivative of a power function',
    latex: '\\frac{d}{dx} [x^{n}] = n x^{n-1}',
    symbol: 'd/dx a^n'
  },
  {
    id: 'sum-rule',
    label: 'Sum rule',
    title: 'Derivative of a sum',
    latex: '\\frac{d}{dx}[f(x) + g(x)] = f^{\\prime}(x) + g^{\\prime}(x)',
    symbol: 'Sum rule'
  },
  {
    id: 'chain-rule',
    label: 'Chain rule',
    title: 'Derivative of a composite function',
    latex: '\\frac{d}{dx} f(g(x)) = f^{\\prime}(g(x)) g^{\\prime}(x)',
    symbol: 'Chain rule'
  },
  {
    id: 'product-rule',
    label: 'Product rule',
    title: 'Derivative of a product',
    latex: '\\frac{d}{dx}[u(x)v(x)] = u^{\\prime}(x)v(x) + u(x)v^{\\prime}(x)',
    symbol: 'Product rule'
  },
  {
    id: 'quotient-rule',
    label: 'Quotient rule',
    title: 'Derivative of a quotient',
    latex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u^{\\prime}v - uv^{\\prime}}{v^{2}}',
    symbol: 'Quotient rule'
  },

  // ===============================
  // 4) Integration techniques
  // ===============================
  {
    id: 'integration-by-parts',
    label: 'Integration by parts',
    title: 'Integration by parts formula',
    latex: '\\int u \\, dv = uv - \\int v \\, du',
    symbol: 'IBP'
  },

  // ===============================
  // 5) Common derivatives (elementary)
  // ===============================
  { id: 'd-exp', label: 'd/dx eˣ = eˣ', title: 'Derivative of eˣ', latex: '\\frac{d}{dx}(e^{x}) = e^{x}', symbol: 'd(eˣ)' },
  { id: 'd-a^x', label: 'd/dx aˣ = aˣ ln a', title: 'Derivative of aˣ', latex: '\\frac{d}{dx}(a^{x}) = a^{x}\\ln a', symbol: 'd(aˣ)' },
  { id: 'd-ln', label: 'd/dx ln x = 1/x', title: 'Derivative of ln(x)', latex: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}', symbol: 'd(ln x)' },
  { id: 'd-log', label: 'd/dx logₐx = 1/(x ln a)', title: 'Derivative of log base a', latex: '\\frac{d}{dx}(\\log_{a} x) = \\frac{1}{x \\ln a}', symbol: 'd(logₐx)' },

  // ===============================
  // 6) Trigonometric derivatives (sin, cos, tan only)
  // ===============================
  { id: 'd-sin', label: 'd/dx sin x = cos x', title: 'Derivative of sin(x)', latex: '\\frac{d}{dx}(\\sin x) = \\cos x', symbol: 'd(sin)' },
  { id: 'd-cos', label: 'd/dx cos x = -sin x', title: 'Derivative of cos(x)', latex: '\\frac{d}{dx}(\\cos x) = -\\sin x', symbol: 'd(cos)' },
  { id: 'd-tan', label: 'd/dx tan x = 1/cos²x', title: 'Derivative of tan(x)', latex: '\\frac{d}{dx}(\\tan x) = \\frac{1}{\\cos^{2}x}', symbol: 'd(tan)' },

  // --- Common composite trig derivatives ---
  { id: 'd-sin(ax+b)', label: 'd/dx sin(ax+b) = a cos(ax+b)', title: 'Derivative of sin(ax+b)', latex: '\\frac{d}{dx}(\\sin(ax+b)) = a\\cos(ax+b)', symbol: 'd(sin(ax+b))' },
  { id: 'd-cos(ax+b)', label: 'd/dx cos(ax+b) = -a sin(ax+b)', title: 'Derivative of cos(ax+b)', latex: '\\frac{d}{dx}(\\cos(ax+b)) = -a\\sin(ax+b)', symbol: 'd(cos(ax+b))' },
  { id: 'd-tan(ax+b)', label: 'd/dx tan(ax+b) = a/cos²(ax+b)', title: 'Derivative of tan(ax+b)', latex: '\\frac{d}{dx}(\\tan(ax+b)) = \\frac{a}{\\cos^{2}(ax+b)}', symbol: 'd(tan(ax+b))' },

  // ===============================
  // 7) Inverse trig derivatives
  // ===============================
  { id: 'd-arcsin', label: 'd/dx arcsin x = 1/√(1−x²)', title: 'Derivative of arcsin(x)', latex: '\\frac{d}{dx}(\\arcsin x) = \\frac{1}{\\sqrt{1 - x^{2}}}', symbol: 'd(arcsin)' },
  { id: 'd-arccos', label: 'd/dx arccos x = −1/√(1−x²)', title: 'Derivative of arccos(x)', latex: '\\frac{d}{dx}(\\arccos x) = -\\frac{1}{\\sqrt{1 - x^{2}}}', symbol: 'd(arccos)' },
  { id: 'd-arctan', label: 'd/dx arctan x = 1/(1+x²)', title: 'Derivative of arctan(x)', latex: '\\frac{d}{dx}(\\arctan x) = \\frac{1}{1 + x^{2}}', symbol: 'd(arctan)' },

  // ===============================
  // 8) Common integrals (sin, cos, tan only)
  // ===============================
  { id: 'int-power', label: '∫xⁿdx = xⁿ⁺¹/(n+1)', title: 'Power rule for integrals', latex: '\\int x^{n} dx = \\frac{x^{n+1}}{n+1} + C \\ (n \\neq -1)', symbol: '∫x^ⁿ dx' },
  { id: 'int-1/x', label: '∫1/x dx = ln|x| + C', title: 'Integral of 1/x', latex: '\\int \\frac{1}{x} dx = \\ln |x| + C', symbol: '∫1/x dx' },
  { id: 'int-eˣ', label: '∫eˣ dx = eˣ + C', title: 'Integral of eˣ', latex: '\\int e^{x} dx = e^{x} + C', symbol: '∫eˣ=eˣ+C' },
  { id: 'int-aˣ', label: '∫aˣ dx = aˣ/ln a + C', title: 'Integral of aˣ', latex: '\\int a^{x} dx = \\frac{a^{x}}{\\ln a} + C', symbol: '∫aˣ dx' },
  { id: 'int-sin', label: '∫sin x dx = −cos x + C', title: 'Integral of sin(x)', latex: '\\int \\sin x \\, dx = -\\cos x + C', symbol: '∫sin dx' },
  { id: 'int-cos', label: '∫cos x dx = sin x + C', title: 'Integral of cos(x)', latex: '\\int \\cos x \\, dx = \\sin x + C', symbol: '∫cos dx' },
  { id: 'int-tan', label: '∫tan x dx = −ln|cos x| + C', title: 'Integral of tan(x)', latex: '\\int \\tan x \\, dx = -\\ln |\\cos x| + C', symbol: '∫tan dx' },

  // --- Common composite trig integrals ---
  { id: 'int-sin(ax+b)', label: '∫sin(ax+b) dx = −cos(ax+b)/a + C', title: 'Integral of sin(ax+b)', latex: '\\int \\sin(ax+b) \\, dx = -\\frac{\\cos(ax+b)}{a} + C', symbol: '∫sin(ax+b)dx' },
  { id: 'int-cos(ax+b)', label: '∫cos(ax+b) dx = sin(ax+b)/a + C', title: 'Integral of cos(ax+b)', latex: '\\int \\cos(ax+b) \\, dx = \\frac{\\sin(ax+b)}{a} + C', symbol: '∫cos(ax+b)dx' },
  { id: 'int-tan(ax+b)', label: '∫tan(ax+b) dx = −(1/a) ln|cos(ax+b)| + C', title: 'Integral of tan(ax+b)', latex: '\\int \\tan(ax+b) \\, dx = -\\frac{1}{a}\\ln|\\cos(ax+b)| + C', symbol: '∫tan(ax+b)dx' }
]
