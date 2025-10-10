/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const trigonometrySnippets: KatexSnippetDefinition[] = [
  // ===============================
  // 1) Basic trig functions
  // ===============================
  { id: 'sine',    label: 'Sine',    title: 'Sine function',    latex: '\\sin\\left( x \\right)', symbol: 'sin', selection: { startOffset: 10, endOffset: 11 } },
  { id: 'cosine',  label: 'Cosine',  title: 'Cosine function',  latex: '\\cos\\left( x \\right)', symbol: 'cos', selection: { startOffset: 10, endOffset: 11 } },
  { id: 'tangent', label: 'Tangent', title: 'Tangent function', latex: '\\tan\\left( x \\right)', symbol: 'tan', selection: { startOffset: 10, endOffset: 11 } },

  // ===============================
  // 2) Inverse trig functions
  // ===============================
  { id: 'arcsine',   label: 'arcsin (inverse sine)',   title: 'Arcsine function',   latex: '\\sin^{-1}\\left( x \\right)', symbol: 'sin⁻¹', selection: { startOffset: 15, endOffset: 16 } },
  { id: 'arccosine', label: 'arccos (inverse cosine)', title: 'Arccosine function', latex: '\\cos^{-1}\\left( x \\right)', symbol: 'cos⁻¹', selection: { startOffset: 15, endOffset: 16 } },
  { id: 'arctangent',label: 'arctan (inverse tangent)',title: 'Arctangent function',latex: '\\tan^{-1}\\left( x \\right)', symbol: 'tan⁻¹', selection: { startOffset: 15, endOffset: 16 } },

  /* Optional: principal ranges (useful in solving)
  { id: 'arcsin-range', label: 'Range arcsin', title: 'Principal range of arcsin', latex: '\\arcsin x\\in\\left[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right]', symbol: 'rng sin⁻¹' },
  { id: 'arccos-range', label: 'Range arccos', title: 'Principal range of arccos', latex: '\\arccos x\\in\\left[0,\\pi\\right]', symbol: 'rng cos⁻¹' },
  { id: 'arctan-range', label: 'Range arctan', title: 'Principal range of arctan', latex: '\\arctan x\\in\\left(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right)', symbol: 'rng tan⁻¹' },

  // ===============================
  // 3) Fundamental identities
  // ===============================
  { id: 'quotient-tan', label: 'tan = sin/cos', title: 'Quotient identity for tangent', latex: '\\tan x = \\frac{\\sin x}{\\cos x}', symbol: 'tan=sin/cos' },
  { id: 'pythag-1', label: 'sin² + cos² = 1', title: 'Pythagorean identity', latex: '\\sin^{2}x+\\cos^{2}x=1', symbol: 'sin²+cos²=1' },

  // Even/Odd
  { id: 'even-odd-sin', label: 'sin(-x) = -sin x', title: 'Odd function property of sine', latex: '\\sin(-x)=-\\sin x', symbol: 'odd sin' },
  { id: 'even-odd-cos', label: 'cos(-x) = cos x',  title: 'Even function property of cosine', latex: '\\cos(-x)=\\cos x', symbol: 'even cos' },
  { id: 'even-odd-tan', label: 'tan(-x) = -tan x', title: 'Odd function property of tangent', latex: '\\tan(-x)=-\\tan x', symbol: 'odd tan' },

  // Cofunctions
  { id: 'cofunc-sin', label: 'sin(π/2 − x) = cos x', title: 'Cofunction identity (sin/cos)', latex: '\\sin\\left(\\tfrac{\\pi}{2}-x\\right)=\\cos x', symbol: 'sin↔cos' },
  { id: 'cofunc-cos', label: 'cos(π/2 − x) = sin x', title: 'Cofunction identity (cos/sin)', latex: '\\cos\\left(\\tfrac{\\pi}{2}-x\\right)=\\sin x', symbol: 'cos↔sin' },

  // Periodicity
  { id: 'period-sin', label: 'sin(x+2π)=sin x', title: 'Periodicity of sine', latex: '\\sin(x+2\\pi)=\\sin x', symbol: 'per sin' },
  { id: 'period-cos', label: 'cos(x+2π)=cos x', title: 'Periodicity of cosine', latex: '\\cos(x+2\\pi)=\\cos x', symbol: 'per cos' },
  { id: 'period-tan', label: 'tan(x+π)=tan x',  title: 'Periodicity of tangent', latex: '\\tan(x+\\pi)=\\tan x', symbol: 'per tan' },

  // Radians ↔ degrees
  { id: 'deg-rad', label: 'π rad = 180°', title: 'Radians–degrees conversion', latex: '\\pi\\ \\text{rad}=180^{\\circ}', symbol: 'π↔180°' },

  // ===============================
  // 4) Angle sum & difference formulas
  // ===============================
  { id: 'sin-sum', label: 'sin(a±b)', title: 'Sine sum/difference formula', latex: '\\sin(a\\pm b)=\\sin a\\cos b\\pm\\cos a\\sin b', symbol: 'sin(a±b)' },
  { id: 'cos-sum', label: 'cos(a±b)', title: 'Cosine sum/difference formula', latex: '\\cos(a\\pm b)=\\cos a\\cos b\\mp\\sin a\\sin b', symbol: 'cos(a±b)' },
  { id: 'tan-sum', label: 'tan(a±b)', title: 'Tangent sum/difference formula', latex: '\\tan(a\\pm b)=\\frac{\\tan a\\pm\\tan b}{1\\mp\\tan a\\tan b}', symbol: 'tan(a±b)' },

  // ===============================
  // 5) Double-angle & half-angle
  // ===============================
  { id: 'sin-2x', label: 'sin(2x)=2sinx cosx', title: 'Double-angle for sine', latex: '\\sin(2x)=2\\sin x\\cos x', symbol: 'sin 2x' },
  { id: 'cos-2x', label: 'cos(2x)=cos²−sin²', title: 'Double-angle for cosine', latex: '\\cos(2x)=\\cos^{2}x-\\sin^{2}x', symbol: 'cos 2x' },
  { id: 'tan-2x', label: 'tan(2x)=2tan/(1−tan²)', title: 'Double-angle for tangent', latex: '\\tan(2x)=\\frac{2\\tan x}{1-\\tan^{2}x}', symbol: 'tan 2x' },
  { id: 'sin-half', label: 'sin²(x/2)=½(1−cosx)', title: 'Half-angle for sine', latex: '\\sin^{2}\\!\\left(\\tfrac{x}{2}\\right)=\\tfrac{1-\\cos x}{2}', symbol: 'sin²(x/2)' },
  { id: 'cos-half', label: 'cos²(x/2)=½(1+cosx)', title: 'Half-angle for cosine', latex: '\\cos^{2}\\!\\left(\\tfrac{x}{2}\\right)=\\tfrac{1+\\cos x}{2}', symbol: 'cos²(x/2)' },

  // ===============================
  // 6) Product-to-sum & sum-to-product
  // ===============================
  { id: 'prod-sin-cos', label: 'sinA cosB', title: 'Product-to-sum identity', latex: '\\sin A\\cos B=\\tfrac{1}{2}[\\sin(A+B)+\\sin(A-B)]', symbol: 'sin·cos→∑' },
  { id: 'sum-to-prod-sin', label: 'sinA ± sinB', title: 'Sum-to-product for sine', latex: '\\sin A\\pm\\sin B=2\\sin\\tfrac{A\\pm B}{2}\\cos\\tfrac{A\\mp B}{2}', symbol: '∑→prod sin' },
  { id: 'sum-to-prod-cos', label: 'cosA + cosB', title: 'Sum-to-product for cosine', latex: '\\cos A+\\cos B=2\\cos\\tfrac{A+B}{2}\\cos\\tfrac{A-B}{2}', symbol: '∑→prod cos' },

  // ===============================
  // 7) Triangle formulas
  // ===============================
  { id: 'law-of-sines', label: 'Law of sines', title: 'Law of sines', latex: '\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}', symbol: 'a/sinA=…' },
  { id: 'law-of-cosines', label: 'Law of cosines', title: 'Law of cosines', latex: 'a^{2}=b^{2}+c^{2}-2bc\\cos A', symbol: 'a²=…' },
  { id: 'triangle-area', label: 'Area = ½ab sin C', title: 'Triangle area (SAS form)', latex: '\\text{Area}=\\tfrac{1}{2}ab\\sin C', symbol: '½ab sinC' }*/
]
