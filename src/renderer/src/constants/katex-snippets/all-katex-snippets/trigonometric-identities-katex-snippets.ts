/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const trigonometricIdentitiesSnippets: KatexSnippetDefinition[] = [
  {
    id: 'pythagorean-identity',
    label: 'Pythagorean identity',
    title: 'Pythagorean identity',
    latex: '\\sin^{2}{x} + \\cos^{2}{x} = 1',
    symbol: 'Trig identity'
  },
  { id:  'odd-even-identities-sin', label: 'Odd-even identity for sine', title: 'Odd-even identity for sine', latex: '\\sin{(-x)} = -\\sin{x}', symbol: 'Odd-even sin' },
  { id: 'odd-even-identities-cos', label: 'Odd-even identity for cosine', title: 'Odd-even identity for cosine', latex: '\\cos{(-x)} = \\cos{x}', symbol: 'Odd-even cos' },
  { id: 'odd-even-identities-tan', label: 'Odd-even identity for tangent', title: 'Odd-even identity for tangent', latex: '\\tan{(-x)} = -\\tan{x}', symbol: 'Odd-even tan' },
  { id: 'cosine-rule', label: 'Cosine rule', title: 'Cosine rule', latex: 'c^{2} = a^{2} + b^{2} - 2ab \\cos{C}', symbol: 'Cosine rule' },
  { id: 'sine-rule', label: 'Sine rule', title: 'Sine rule', latex: '\\dfrac{a}{\\sin{A}} = \\dfrac{b}{\\sin{B}} = \\dfrac{c}{\\sin{C}}', symbol: 'Sine rule' },
  { id: 'tangent-identity', label: 'Tangent identity', title: 'Tangent identity', latex: '\\tan{x} = \\dfrac{\\sin{x}}{\\cos{x}}', symbol: 'Tangent' },
  {
    id: 'angle-sum-identity-sin',
    label: 'Angle sum identity for sine',
    title: 'Angle sum identity for sine',
    latex: '\\sin{(x + y)} = \\sin{x} \\cos{y} + \\cos{x} \\sin{y}',
    symbol: 'Angle sum sin'
  },
  {
    id: 'angle-sum-identity-cos',
    label: 'Angle sum identity for cosine',
    title: 'Angle sum identity for cosine',
    latex: '\\cos{(x + y)} = \\cos{x} \\cos{y} - \\sin{x} \\sin{y}',
    symbol: 'Angle sum cos'
  },
  { id: 'angle-sum-identity-tan', label: 'Angle sum identity for tangent', title: 'Angle sum identity for tangent', latex: '\\tan{(x + y)} = \\dfrac{\\tan{x} + \\tan{y}}{1 - \\tan{x} \\tan{y}}', symbol: 'Angle sum tan' },
  {
    id: 'double-angle-identity-sin',
    label: 'Double angle identity for sine',
    title: 'Double angle identity for sine',
    latex: '\\sin{(2x)} = 2\\sin{x}\\cos{x}',
    symbol: 'Double angle sin'
  },
  {
    id: 'double-angle-identity-cos',
    label: 'Double angle identity for cosine',
    title: 'Double angle identity for cosine',
    latex: '\\cos{(2x)} = \\cos^{2}{x} - \\sin^{2}{x}',
    symbol: 'Double angle cos'
  },
  {
    id: 'triple-angle-identity-sin',
    label: 'Triple angle identity for sine',
    title: 'Triple angle identity for sine',
    latex: '\\sin{(3x)} = 3\\sin{x} - 4\\sin^{3}{x}',
    symbol: 'Triple angle sin'
  },
  {
    id: 'triple-angle-identity-cos',
    label: 'Triple angle identity for cosine',
    title: 'Triple angle identity for cosine',
    latex: '\\cos{(3x)} = 4\\cos^{3}{x} - 3\\cos{x}',
    symbol: 'Triple angle cos'
  }, 
  { id: 'law-of-tangents', label: 'Law of tangents', title: 'Law of tangents', latex: '\\dfrac{a - b}{a + b} = \\dfrac{\\tan{\\left( \\dfrac{A - B}{2} \\right)}}{\\tan{\\left( \\dfrac{A + B}{2} \\right)}}', symbol: 'Law of tangents' },
  { id: 'product-to-sum-sin', label: 'Product to sum for sine', title: 'Product to sum for sine', latex: '\\sin{x} \\sin{y} = \\dfrac{1}{2} [\\cos{(x - y)} - \\cos{(x + y)}]', symbol: 'Prod to sum sin' },
  { id: 'product-to-sum-cos', label: 'Product to sum for cosine', title: 'Product to sum for cosine', latex: '\\cos{x} \\cos{y} = \\dfrac{1}{2} [\\cos{(x - y)} + \\cos{(x + y)}]', symbol: 'Prod to sum cos' },
  { id: 'product-to-sum-sin-cos', label: 'Product to sum for sine and cosine', title: 'Product to sum for sine and cosine', latex: '\\sin{x} \\cos{y} = \\dfrac{1}{2} [\\sin{(x + y)} + \\sin{(x - y)}]', symbol: 'Prod to sum sin/cos' },
]
