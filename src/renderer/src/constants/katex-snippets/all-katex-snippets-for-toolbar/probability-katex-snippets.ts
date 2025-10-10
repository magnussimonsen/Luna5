/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const probabilitySnippets: KatexSnippetDefinition[] = [
  // ===============================
  // 1) Event algebra & basic probability
  // ===============================
  { id: 'probability', label: 'Probability of event', title: 'Probability of event', latex: 'P(A)', symbol: 'P(A)' },
  { id: 'complement', label: 'Complement rule', title: 'Complement rule', latex: 'P(A^{c}) = 1 - P(A)', symbol: 'P(Aᶜ)' },
  { id: 'intersection', label: 'Intersection of events', title: 'Intersection of events', latex: 'P(A \\cap B)', symbol: 'P(A∩B)' },
  { id: 'union', label: 'Union (inclusion–exclusion)', title: 'Union of two events', latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', symbol: 'P(A∪B)' },
 // { id: 'conditional', label: 'Conditional probability', title: 'Conditional probability', latex: 'P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}', symbol: 'P(A|B)' },
 // { id: 'multiplication-rule', label: 'Multiplication rule', title: 'Multiplication rule', latex: 'P(A \\cap B) = P(A \\mid B)\\,P(B)', symbol: 'P(A∩B)' },
 // { id: 'independence', label: 'Independence', title: 'Independence of A and B', latex: 'A \\perp B \\iff P(A \\cap B) = P(A)P(B)', symbol: 'indep.' },

  // ===============================
  // 2) Counting & binomial theorem
  // ===============================
  { id: 'factorial', label: 'Factorial', title: 'Factorial', latex: 'n!', symbol: 'n!' },
  { id: 'nCr', label: 'Combinations nCr', title: 'Combination', latex: '\\dbinom{n}{r}', symbol: 'nCr' },
  { id: 'nPr', label: 'Permutations nPr', title: 'Permutation', latex: 'nPr', symbol: 'nPr' },
 // { id: 'bayes', label: "Bayes' theorem", title: "Bayes' theorem", latex: 'P(A \\mid B) = \\dfrac{P(B \\mid A)\\,P(A)}{P(B)}', symbol: 'Bayes' },
 //{ id: 'binomial-theorem', label: 'Binomial theorem', title: 'Binomial theorem', latex: '(a+b)^{n} = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^{k}', symbol: '(a+b)ⁿ' },
/*
  // ===============================
  // 3) Random variables: E, Var (discrete & continuous)
  // ===============================
  { id: 'expected-value-discrete', label: 'E[X] (discrete)', title: 'Expected value (discrete)', latex: '\\mathbb{E}[X] = \\sum_{i} x_{i}\\,p_{i}', symbol: 'E[X]=∑xᵢpᵢ' },
  { id: 'expected-value-continuous', label: 'E[X] (continuous)', title: 'Expected value (continuous)', latex: '\\mathbb{E}[X] = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx', symbol: 'E[X]=∫xf' },
  { id: 'variance-def', label: 'Var = E[X²] − (E[X])²', title: 'Variance (definition)', latex: '\\operatorname{Var}(X) = \\mathbb{E}[X^{2}] - (\\mathbb{E}[X])^{2}', symbol: 'Var def' },
  { id: 'linearity-expectation', label: 'Linearity of E', title: 'Linearity of expectation', latex: '\\mathbb{E}[aX + b] = a\\,\\mathbb{E}[X] + b', symbol: 'E[aX+b]' },
  { id: 'variance-affine', label: 'Var(aX+b) = a²Var(X)', title: 'Variance of affine transform', latex: '\\operatorname{Var}(aX+b) = a^{2}\\operatorname{Var}(X)', symbol: 'Var(aX+b)' },

  // ===============================
  // 4) Common distributions (PMFs/PDFs & key parameters)
  // ===============================
  // Bernoulli
  { id: 'bernoulli-pmf', label: 'Bernoulli pmf', title: 'Bernoulli distribution', latex: 'P(X=x) = p^{x}(1-p)^{1-x},\\quad x\\in\\{0,1\\}', symbol: 'Bernu(p)' },
  { id: 'bernoulli-mean-var', label: 'Bernoulli mean/var', title: 'Bernoulli mean & variance', latex: '\\mathbb{E}[X]=p,\\quad \\operatorname{Var}(X)=p(1-p)', symbol: 'E,Var' },

  // Binomial
  { id: 'binomial-pmf', label: 'Binomial pmf', title: 'Binomial distribution', latex: 'P(X = k) = \\binom{n}{k} p^{k} (1-p)^{n-k}', symbol: 'Bin(n,p)' },
  { id: 'binomial-mean-var', label: 'Binomial mean/var', title: 'Binomial mean & variance', latex: '\\mathbb{E}[X]=np,\\quad \\operatorname{Var}(X)=np(1-p)', symbol: 'E,Var' },

  // Geometric (support {1,2,...})
  { id: 'geometric-pmf', label: 'Geometric pmf', title: 'Geometric distribution', latex: 'P(X = k) = (1-p)^{k-1} p,\\quad k=1,2,\\dots', symbol: 'Geom(p)' },
  { id: 'geometric-mean-var', label: 'Geometric mean/var', title: 'Geometric mean & variance', latex: '\\mathbb{E}[X]=\\tfrac{1}{p},\\quad \\operatorname{Var}(X)=\\tfrac{1-p}{p^{2}}', symbol: 'E,Var' },

  // Hypergeometric
  { id: 'hypergeo-pmf', label: 'Hypergeometric pmf', title: 'Hypergeometric distribution', latex: 'P(X = k) = \\dfrac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}', symbol: 'HypG' },
  { id: 'hypergeo-mean-var', label: 'Hypergeometric mean/var', title: 'Hypergeometric mean & variance', latex: '\\mathbb{E}[X]=n\\tfrac{K}{N},\\ \\operatorname{Var}(X)=n\\tfrac{K}{N}\\Big(1-\\tfrac{K}{N}\\Big)\\tfrac{N-n}{N-1}', symbol: 'E,Var' },

  // Poisson
  { id: 'poisson-pmf', label: 'Poisson pmf', title: 'Poisson distribution', latex: 'P(X = k) = \\dfrac{\\lambda^{k} e^{-\\lambda}}{k!}', symbol: 'Pois(λ)' },
  { id: 'poisson-mean-var', label: 'Poisson mean/var', title: 'Poisson mean & variance', latex: '\\mathbb{E}[X]=\\lambda,\\quad \\operatorname{Var}(X)=\\lambda', symbol: 'E,Var' },

  // Uniform continuous on [a,b]
  { id: 'uniform-pdf', label: 'Uniform[a,b] pdf', title: 'Uniform distribution (continuous)', latex: 'f(x)=\\dfrac{1}{b-a},\\quad a\\le x\\le b', symbol: 'Unif[a,b]' },
  { id: 'uniform-mean-var', label: 'Uniform mean/var', title: 'Uniform mean & variance', latex: '\\mathbb{E}[X]=\\tfrac{a+b}{2},\\quad \\operatorname{Var}(X)=\\tfrac{(b-a)^{2}}{12}', symbol: 'E,Var' },

  // Exponential (x ≥ 0)
  { id: 'exponential-pdf', label: 'Exponential pdf', title: 'Exponential distribution', latex: 'f(x) = \\lambda e^{-\\lambda x},\\quad x\\ge 0', symbol: 'Exp(λ)' },
  { id: 'exponential-cdf', label: 'Exponential CDF', title: 'Exponential CDF', latex: 'F(x) = 1 - e^{-\\lambda x},\\quad x\\ge 0', symbol: 'F(x)' },
  { id: 'exponential-mean-var', label: 'Exponential mean/var', title: 'Exponential mean & variance', latex: '\\mathbb{E}[X]=\\tfrac{1}{\\lambda},\\quad \\operatorname{Var}(X)=\\tfrac{1}{\\lambda^{2}}', symbol: 'E,Var' },
  //{ id: 'memoryless-exp', label: 'Memoryless property', title: 'Exponential memoryless', latex: 'P(X>s+t\\mid X>s)=P(X>t)', symbol: '' },

  // Normal
  { id: 'normal-pdf', label: 'Normal pdf', title: 'Normal (μ,σ²) pdf', latex: 'f(x) = \\dfrac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\!\\left(-\\dfrac{(x-\\mu)^{2}}{2\\sigma^{2}}\\right)', symbol: 'N(μ,σ²)' },
  { id: 'z-score', label: 'Z-score', title: 'Standardization (Z-score)', latex: 'Z = \\dfrac{X - \\mu}{\\sigma}', symbol: 'Z=(X−μ)/σ' },

  // ===============================
  // 5) Selected CDFs / special functions
  // ===============================
  { id: 'binomial-cdf', label: 'Binomial CDF', title: 'Binomial CDF', latex: 'P(X \\le k) = \\sum_{i=0}^{k} \\binom{n}{i} p^{i} (1-p)^{n-i}', symbol: 'CDF Bin' },
  { id: 'poisson-cdf', label: 'Poisson CDF', title: 'Poisson CDF', latex: 'P(X \\le k) = e^{-\\lambda} \\sum_{i=0}^{k} \\dfrac{\\lambda^{i}}{i!}', symbol: 'CDF Pois' },
  { id: 'std-normal-cdf', label: 'Φ(z) (std normal CDF)', title: 'Standard normal CDF', latex: '\\Phi(z) = \\dfrac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{z} e^{-t^{2}/2} \\, dt', symbol: 'Φ(z)' },
  { id: 'normal-cdf', label: 'Normal CDF via erf', title: 'Normal (μ,σ²) CDF via erf', latex: 'F(x) = \\tfrac{1}{2}\\Big[1+\\operatorname{erf}\\Big(\\dfrac{x-\\mu}{\\sigma\\sqrt{2}}\\Big)\\Big]', symbol: 'F(x)' },
  { id: 'error-function', label: 'Error function', title: 'Error function', latex: '\\operatorname{erf}(x) = \\dfrac{2}{\\sqrt{\\pi}} \\int_{0}^{x} e^{-t^{2}} \\, dt', symbol: 'erf' }*/
]
