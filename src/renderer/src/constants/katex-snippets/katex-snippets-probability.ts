/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const probabilitySnippets: KatexSnippetDefinition[] = [
	{ id: 'probability', label: 'Probability of event', title: 'Probability of event', latex: 'P(A)', symbol: 'P(A)' },
	{
		id: 'union',
		label: 'Union of events',
		title: 'Probability of union of two events',
		latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
		symbol: 'P(A ∪ B)'
	},
	{
		id: 'intersection',
		label: 'Intersection of events',
		title: 'Probability of intersection of two events',
		latex: 'P(A \\cap B)',
		symbol: 'P(A ∩ B)'
	},
	{
		id: 'conditional',
		label: 'Conditional probability',
		title: 'Conditional probability',
		latex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
		symbol: 'P(A|B)'
	},
	{
		id: 'bayes',
		label: "Bayes' theorem",
		title: 'Bayes theorem',
		latex: 'P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}',
		symbol: 'Bayes'
	},
	{
		id: 'expected-value',
		label: 'Expected value',
		title: 'Expected value definition',
		latex: '\\mathbb{E}[X] = \\sum_{i} x_{i} p_{i}',
		symbol: 'E[X]'
	},
	{
		id: 'variance',
		label: 'Variance',
		title: 'Variance definition',
		latex: '\\operatorname{Var}(X) = \\mathbb{E}[X^{2}] - (\\mathbb{E}[X])^{2}',
		symbol: 'Var(X)'
	}
]
