/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/constants/katex-snippets/katex-snippets-definition'

export const numberSetSnippets: KatexSnippetDefinition[] = [
	{ id: 'real', label: 'Real numbers', title: 'Set of real numbers', latex: '\\mathbb{R}', symbol: 'ℝ' },
	{
		id: 'complex',
		label: 'Complex numbers',
		title: 'Set of complex numbers',
		latex: '\\mathbb{C}',
		symbol: 'ℂ'
	},
	{
		id: 'rational',
		label: 'Rational numbers',
		title: 'Set of rational numbers',
		latex: '\\mathbb{Q}',
		symbol: 'ℚ'
	},
	{
		id: 'integers',
		label: 'Integers',
		title: 'Set of integers',
		latex: '\\mathbb{Z}',
		symbol: 'ℤ'
	},
	{
		id: 'natural',
		label: 'Natural numbers',
		title: 'Set of natural numbers',
		latex: '\\mathbb{N}',
		symbol: 'ℕ'
	},
	{
		id: 'primes',
		label: 'Prime numbers',
		title: 'Set of prime numbers',
		latex: '\\mathbb{P}',
		symbol: 'ℙ'
	}
]
