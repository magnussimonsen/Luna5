
/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const geometrySnippets: KatexSnippetDefinition[] = [
	{
		id: 'pythagorean',
		label: 'Pythagorean theorem',
		title: 'Pythagorean theorem',
		latex: 'a^{2} + b^{2} = c^{2}',
		symbol: 'a²+b²=c²'
	},
	{
		id: 'distance',
		label: 'Distance formula',
		title: 'Distance between two points',
		latex: 'd = \\sqrt{(x_{2} - x_{1})^{2} + (y_{2} - y_{1})^{2}}',
		symbol: 'distance'
	},
	{
		id: 'circle-area',
		label: 'Area of a circle',
		title: 'Area of a circle',
		latex: 'A = \\pi r^{2}',
		symbol: 'πr²'
	},
	{
		id: 'triangle-area',
		label: 'Area of a triangle',
		title: 'Area of a triangle',
		latex: 'A = \\frac{1}{2} b h',
		symbol: '½bh'
	},
	{
		id: 'slope',
		label: 'Slope of a line',
		title: 'Slope formula',
		latex: 'm = \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}',
		symbol: 'slope'
	}
]
