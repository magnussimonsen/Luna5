/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const probabilityDistributionsSnippets: KatexSnippetDefinition[] = [
    { id: 'binomial-distribution', label: 'Binomial Distribution formula', title: 'Binomial Distribution formula', latex: 'P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}', symbol: 'Bin dist' },
    { id: 'hypergeometric-distribution', label: 'Hypergeometric Distribution formula', title: 'Hypergeometric Distribution formula', latex: 'P(X = k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}', symbol: 'HypGeo dist' },
	{ id: 'exponential-distribution', label: 'Exponential Distribution formula', title: 'Exponential Distribution formula', latex: 'f(x) = \\lambda e^{-\\lambda x}', symbol: 'Exp dist' },
	{ id: 'geometric-distribution', label: 'Geometric Distribution formula', title: 'Geometric Distribution formula', latex: 'P(X = k) = (1-p)^{k-1} p', symbol: 'Geom dist' },
    { id: 'standard-normal-distribution', label: 'Standard Normal Distribution formula', title: 'Standard Normal Distribution formula', latex: 'Z = \\frac{X - \\mu}{\\sigma}', symbol: 'Std dist' },
    { id: 'normal-distribution', label: 'Normal Distribution formula', title: 'Normal Distribution formula', latex: 'f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^{2}}{2\\sigma^{2}}}', symbol: 'Norm dist' },
	{ id: 'poisson-distribution', label: 'Poisson Distribution formula', title: 'Poisson Distribution formula', latex: 'P(X = k) = \\frac{\\lambda^{k} e^{-\\lambda}}{k!}', symbol: 'Pois dist' },
	{ id: 'cumulative-binomial-distribution', label: 'Cumulative Binomial Distribution formula', title: 'Cumulative Binomial Distribution formula', latex: 'P(X \\leq k) = \\sum_{i=0}^{k} \\binom{n}{i} p^{i} (1-p)^{n-i}', symbol: 'CDF Bin' },
	{ id: 'cumulative-hypergeometric-distribution', label: 'Cumulative Hypergeometric Distribution formula', title: 'Cumulative Hypergeometric Distribution formula', latex: 'P(X \\leq k) = \\sum_{i=0}^{k} \\frac{\\binom{K}{i} \\binom{N-K}{n-i}}{\\binom{N}{n}}', symbol: 'CDF HypGeo' },
	{ id: 'cumulative-exponential-distribution', label: 'Cumulative Exponential Distribution formula', title: 'Cumulative Exponential Distribution formula', latex: 'F(x) = 1 - e^{-\\lambda x}', symbol: 'CDF Exp' },
	{ id: 'cumulative-geometric-distribution', label: 'Cumulative Geometric Distribution formula', title: 'Cumulative Geometric Distribution formula', latex: 'P(X \\leq k) = 1 - (1-p)^{k}', symbol: 'CDF Geom' },
	{ id: 'cumulative-standard-normal-distribution', label: 'Cumulative Standard Normal Distribution formula', title: 'Cumulative Standard Normal Distribution formula', latex: '\\Phi(z) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{z} e^{-\\frac{t^{2}}{2}} \\, dt', symbol: 'CDF Std' },
	{ id: 'cumulative-normal-distribution', label: 'Cumulative Normal Distribution formula', title: 'Cumulative Normal Distribution formula', latex: 'F(x) = \\dfrac{1}{2} \\left[ 1 + \\operatorname{erf} \\left( \\dfrac{x - \\mu}{\\sigma \\sqrt{2}} \\right) \\right]', symbol: 'CDF Norm' },
	{ id: 'cumulative-poisson-distribution', label: 'Cumulative Poisson Distribution formula', title: 'Cumulative Poisson Distribution formula', latex: 'P(X \\leq k) = e^{-\\lambda} \\sum_{i=0}^{k} \\dfrac{\\lambda^{i}}{i!}', symbol: 'CDF Pois' },
    { id: 'error-function', label: 'Error function', title: 'Error function', latex: '\\operatorname{erf}(x) = \\dfrac{2}{\\sqrt{\\pi}} \\int_{0}^{x} e^{-t^{2}} \\, dt', symbol: 'erf' }
]