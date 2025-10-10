import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const geometrySnippets: KatexSnippetDefinition[] = [
  // --- Core theorems ---
  {
    id: 'pythagorean',
    label: 'Pythagorean theorem',
    title: 'Pythagorean theorem',
    latex: 'a^{2} + b^{2} = c^{2}',
    symbol: 'Pythagoras'
  },

  // --- Coordinate geometry ---
  {
    id: 'distance',
    label: 'Distance between two points',
    title: 'Distance between two points',
    latex: 'd = \\sqrt{(x_{2} - x_{1})^{2} + (y_{2} - y_{1})^{2}}',
    symbol: 'Distance'
  },
  {
    id: 'distance-to-line',
    label: 'Distance from point to line',
    title: 'Distance from point (x₁, y₁) to line Ax + By + C = 0',
    latex: 'd = \\dfrac{|A x_{1} + B y_{1} + C|}{\\sqrt{A^{2} + B^{2}}}',
    symbol: 'Dist→line'
  },
  {
    id: 'slope',
    label: 'Slope of a line',
    title: 'Slope of a line through (x₁, y₁) and (x₂, y₂)',
    latex: 'm = \\dfrac{y_{2} - y_{1}}{x_{2} - x_{1}}',
    symbol: 'Slope'
  },
  {
    id: 'point-slope',
    label: 'Point-slope form',
    title: 'Equation of a line in point-slope form',
    latex: 'y - y_{1} = m(x - x_{1})',
    symbol: 'Point-slope'
  },
  {
    id: 'midpoint',
    label: 'Midpoint formula',
    title: 'Midpoint of segment between (x₁, y₁) and (x₂, y₂)',
    latex: 'M = \\left( \\dfrac{x_{1} + x_{2}}{2}, \\dfrac{y_{1} + y_{2}}{2} \\right)',
    symbol: 'Midpoint'
  },

  // --- Conic sections ---
  {
    id: 'circle-equation',
    label: 'Equation of a circle',
    title: 'Circle centered at (h, k) with radius r',
    latex: '(x - h)^{2} + (y - k)^{2} = r^{2}',
    symbol: 'Circle'
  },
  {
    id: 'ellipse-equation',
    label: 'Equation of an ellipse',
    title: 'Ellipse centered at (h, k)',
    latex: '\\dfrac{(x - h)^{2}}{a^{2}} + \\dfrac{(y - k)^{2}}{b^{2}} = 1',
    symbol: 'Ellipse'
  },
  {
    id: 'parabola-equation',
    label: 'Equation of a parabola',
    title: 'Parabola with vertex at (h, k)',
    latex: '(y - k)^{2} = 4a(x - h)',
    symbol: 'Parabola'
  },
  {
    id: 'hyperbola-equation',
    label: 'Equation of a hyperbola',
    title: 'Hyperbola centered at (h, k)',
    latex: '\\dfrac{(x - h)^{2}}{a^{2}} - \\dfrac{(y - k)^{2}}{b^{2}} = 1',
    symbol: 'Hyperbola'
  }
]
