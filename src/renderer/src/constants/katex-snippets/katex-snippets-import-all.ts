/* eslint-disable prettier/prettier */
import { quickActionMathSnippets } from './katex-snippets-quick-action-math'
import { greekLowercaseSnippets } from './katex-snippets-greek'
import { greekCapitalSnippets } from './katex-snippets-greek-capital'
import { accentSnippets } from './katex-snippets-accents'
import { comparisonSnippets } from './katex-snippets-comparison'
import { parenthesesSnippets } from './katex-snippets-parentheses'
import { trigonometrySnippets } from './katex-snippets-trigonometry'
import { calculusSnippets } from './katex-snippets-calculus'
import { probabilitySnippets } from './katex-snippets-probability'
import { geometrySnippets } from './katex-snippets-geometry'
import { physicsFormulaSnippets } from './katex-snippets-physics-formulas'
import { chemistryFormulaSnippets } from './katex-snippets-chemistry-formulas'
import { fundamentalConstantSnippets } from './katex-snippets-fundamental-constants'
import { numberSetSnippets } from './katex-snippets-number-sets'
import { seriesSnippets } from './katex-snippets-series'
import { matrixBracketSnippets } from './katex-snippets-matrix-brackets'
import { matrixParenthesisSnippets } from './katex-snippets-matrix-parenthesis'
import { matrixDeterminantSnippets } from './katex-snippets-matrix-determinant'
import { piecewiseSnippets } from './katex-snippets-picewise'
import { operatorQuantorSnippets } from './katex-snippets-operators-and-quantors'
import { tableOfNuclidesSnippets } from './katex-snippets-nuclides'
import { alignedSnippets } from './mateix-snippets-aligned'

export type { KatexSnippetDefinition } from './katex-snippets-definition'

export {
	quickActionMathSnippets,
	greekLowercaseSnippets,
	greekCapitalSnippets,
	accentSnippets,
	comparisonSnippets,
	parenthesesSnippets,
	trigonometrySnippets,
	calculusSnippets,
	probabilitySnippets,
	geometrySnippets,
	physicsFormulaSnippets,
	chemistryFormulaSnippets,
	fundamentalConstantSnippets,
	numberSetSnippets,
	seriesSnippets,
	matrixBracketSnippets,
	matrixParenthesisSnippets,
	matrixDeterminantSnippets,
	piecewiseSnippets,
	operatorQuantorSnippets,
	tableOfNuclidesSnippets,
	alignedSnippets
}

export const greekLetterSnippets = [...greekLowercaseSnippets, ...greekCapitalSnippets]

export const scienceFormulaSnippets = [...physicsFormulaSnippets, ...chemistryFormulaSnippets]
