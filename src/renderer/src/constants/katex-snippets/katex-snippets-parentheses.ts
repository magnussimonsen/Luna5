/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const parenthesesSnippets: KatexSnippetDefinition[] = [
	{
		id: 'round',
		label: 'Parentheses ( )',
		title: 'Wrap expression in round parentheses',
		latex: '\\left(  \\right)',
		symbol: '()',
		selection: { startOffset: 7, endOffset: 8 }
	},
	{
		id: 'square',
		label: 'Brackets [ ]',
		title: 'Wrap expression in square brackets',
		latex: '\\left[  \\right]',
		symbol: '[]',
		selection: { startOffset: 7, endOffset: 8 }
	},
	{
		id: 'curly',
		label: 'Braces { }',
		title: 'Wrap expression in curly braces',
		latex: '\\left\\{  \\right\\}',
		symbol: '{}',
		selection: { startOffset: 8, endOffset: 9 }
	},
	{
		id: 'angle',
		label: 'Angles ⟨ ⟩',
		title: 'Wrap expression in angle brackets',
		latex: '\\left\\langle  \\right\\rangle',
		symbol: '⟨⟩',
		selection: { startOffset: 13, endOffset: 14 }
	},
    {   id: 'open-closed-interval',
        label: 'Open/Closed Interval < ]',
        title: 'Wrap expression in open/closed interval',
        latex: '\\left<  \\right]',
        symbol: '< ]',
        selection: { startOffset: 7, endOffset: 8 }
    },
    {   id: 'closed-open-interval',
        label: 'Closed/Open Interval [ >',
        title: 'Wrap expression in closed/open interval',
        latex: '\\left[  \\right>',
        symbol: '[ >',
        selection: { startOffset: 7, endOffset: 8 },
    },  
    {   id: 'double-vertical-bars',
        label: 'Double Vertical Bars ‖ ‖',
        title: 'Wrap expression in double vertical bars',
        latex: '\\left\\|  \\right\\|',
        symbol: '‖ ‖',
        selection: { startOffset: 9, endOffset: 10 }
    }
]