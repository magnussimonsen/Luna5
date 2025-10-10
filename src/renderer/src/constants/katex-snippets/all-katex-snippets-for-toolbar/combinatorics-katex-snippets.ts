/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const combinatoricsFormulaSnippets: KatexSnippetDefinition[] = [
  { id: 'nCr', label: 'nCr', title: 'Combination formula', latex: '\\binom{n}{r}', symbol: 'nCr' },
  { id: 'nPr', label: 'nPr', title: 'Permutation formula', latex: '\\frac{n!}{(n-r)!}', symbol: 'nPr' },
  { id: 'binomial-theorem', label: 'Binomial Theorem', title: 'Bin', latex: '(a+b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}', symbol: 'Binomial' }
]
  
