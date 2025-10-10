/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const physicsFormulaSnippets: KatexSnippetDefinition[] = [
  { id: 'ohms-law', label: "Ohm's law", title: "Ohm's law", latex: 'V = I R', symbol: 'V=IR' },
  { id: 'newton-second-law', label: "Newton's second law", title: "Newton's second law", latex: 'F = m a', symbol: 'F=ma' },
  { id: 'einstein', label: 'Mass-energy equivalence', title: 'Mass-energy equivalence', latex: 'E = m c^{2}', symbol: 'E=mc²' },
  { id: 'planck-relation', label: 'Planck relation', title: 'Planck relation', latex: 'E = h \\nu', symbol: 'E=hν' },
  {
    id: 'coulomb-law',
    label: "Coulomb's law",
    title: "Coulomb's law",
    latex: 'F = k \\frac{q_{1} q_{2}}{r^{2}}',
    symbol: 'F=kq₁q₂/r²'
  },
  { id: 'kinetic-energy', label: 'Kinetic energy', title: 'Kinetic energy', latex: 'E_{k} = \\frac{1}{2} m v^{2}', symbol: 'Eₖ=½mv²' },
  { id: 'potential-energy', label: 'Potential energy', title: 'Gravitational potential energy', latex: 'E_{p} = m g h', symbol: 'Eₚ=mgh' },
  { id: 'conservation-of-energy', label: 'Conservation of energy', title: 'Conservation of energy', latex: 'E_{total} = E_{k} + E_{p}', symbol: 'Eₜₒₜₐₗ=Eₖ+Eₚ' },
  { id: 'work-energy-theorem', label: 'Work-Energy Theorem', title: 'Work-Energy Theorem', latex: 'W = \\Delta E_{k}', symbol: 'W=ΔEₖ' },
  { id: 'momentum', label: 'Momentum', title: 'Momentum', latex: 'p = m v', symbol: 'p=mv' },
  { id: 'impulse', label: 'Impulse', title: 'Impulse', latex: 'J = \\Delta p', symbol: 'J=Δp' },
  { id: 'momentum-conservation', label: 'Conservation of Momentum', title: 'Conservation of Momentum', latex: 'm_{1} v_{1} + m_{2} u_{1} = m_{1} v_{2} + m_{2} u_{2}', symbol: 'm₁v₁+m₂u₁=m₁v₁′+m₂u₂′' },
  { id: 'wave-speed', label: 'Wave speed', title: 'Wave speed', latex: 'v = f \\lambda', symbol: 'v=fλ' },
  { id: 'snells-law', label: "Snell's law", title: "Snell's law", latex: 'n_{1} \\sin(\\theta_{1}) = n_{2} \\sin(\\theta_{2})', symbol: 'n₁sin(θ₁)=n₂sin(θ₂)' },
  { id: 'lens-maker', label: 'Lens maker formula', title: 'Lens maker formula', latex: '\\frac{1}{f} = (n - 1) \\left( \\frac{1}{R_{1}} - \\frac{1}{R_{2}} \\right)', symbol: '1/f=(n-1)(1/R₁-1/R₂)' },
  { id: 'ideal-gas-law', label: 'Ideal gas law', title: 'Ideal gas law', latex: 'PV = nRT', symbol: 'PV=nRT' },
  { id: 'bernoulli', label: 'Bernoulli\'s equation', title: 'Bernoulli\'s equation', latex: 'P + \\frac{1}{2} \\rho v^{2} + \\rho g h = constant', symbol: 'P+½ρv²+ρgh=constant' },
  { id: 'first-law-thermodynamics', label: 'First law of thermodynamics', title: 'First law of thermodynamics', latex: '\\Delta U = Q - W', symbol: 'ΔU=Q-W' },
  { id: 'second-law-thermodynamics', label: 'Second law of thermodynamics', title: 'Second law of thermodynamics', latex: '\\Delta S \\geq 0', symbol: 'ΔS≥0' },
  { id: 'stefan-boltzmann', label: 'Stefan-Boltzmann law', title: 'Stefan-Boltzmann law', latex: 'P = \\sigma A T^{4}', symbol: 'P=σAT⁴' },
  { id: 'wien-displacement', label: "Wien's displacement law", title: "Wien's displacement law", latex: '\\lambda_{max} T = b', symbol: 'λₘₐₓT=b' },
  { id: 'hookes-law', label: "Hooke's law", title: "Hooke's law", latex: 'F = -k x', symbol: 'F=-kx' },
  { id: 'simple-harmonic-motion', label: 'Simple harmonic motion', title: 'Simple harmonic motion', latex: 'x(t) = A \\cos(\\omega t + \\phi)', symbol: 'x(t)=Acos(ωt+φ)' },
  { id: 'wave-equation', label: 'Wave equation', title: 'One-dimensional wave equation', latex: '\\frac{\\partial^{2} y}{\\partial x^{2}} = \\frac{1}{v^{2}} \\frac{\\partial^{2} y}{\\partial t^{2}}', symbol: '∂²y/∂x²=1/v² ∂²y/∂t²' },
  { id: 'faradays-law', label: "Faraday's law of induction", title: "Faraday's law of induction", latex: '\\mathcal{E} = -\\frac{d\\Phi_{B}}{dt}', symbol: 'ℰ=-dΦ_B/dt' },
  { id: 'maxwells-equations', label: "Maxwell's equations (integral form)", title: "Maxwell's equations (integral form)", latex: '\\begin{aligned} &\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\epsilon_{0}} \\\\ &\\oint \\mathbf{B} \\cdot d\\mathbf{A} = 0 \\\\ &\\oint \\mathbf{E} \\cdot d\\mathbf{s} = -\\frac{d\\Phi_{B}}{dt} \\\\ &\\oint \\mathbf{B} \\cdot d\\mathbf{s} = \\mu_{0} I_{\\text{enc}} + \\mu_{0} \\epsilon_{0} \\frac{d\\Phi_{E}}{dt} \\end{aligned}', symbol: 'Maxwell' },
  { id: 'de-broglie-wavelength', label: 'De Broglie wavelength', title: 'De Broglie wavelength', latex: '\\lambda = \\frac{h}{p}', symbol: 'λ=h/p' },
  { id: 'heisenberg-uncertainty', label: 'Heisenberg uncertainty principle', title: 'Heisenberg uncertainty principle', latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', symbol: 'ΔxΔp≥ħ/2' },
  { id: 'schrodinger-equation', label: "Schrödinger's equation", title: "Schrödinger's equation", latex: 'i \\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = -\\frac{\\hbar^{2}}{2m} \\nabla^{2} \\Psi(\\mathbf{r}, t) + V(\\mathbf{r}) \\Psi(\\mathbf{r}, t)', symbol: 'iħ∂/∂t Ψ(r,t)=-ħ²/2m ∇²Ψ(r,t)+V(r)Ψ(r,t)' },
  { id: 'relativity-energy-momentum', label: 'Energy-momentum relation', title: 'Energy-momentum relation in special relativity', latex: 'E^{2} = (pc)^{2} + (m c^{2})^{2}', symbol: 'E²=(pc)²+(mc²)²' },
  { id: 'lorentz-transformation', label: 'Lorentz transformation', title: 'Lorentz transformation equations', latex: '\\begin{aligned} &t\' = \\gamma \\left( t - \\frac{v x}{c^{2}} \\right) \\\\ &x\' = \\gamma (x - v t) \\\\ &y\' = y \\\\ &z\' = z \\end{aligned}', symbol: 'Lorentz' },
  { id: 'relativistic-length-contraction', label: 'Length contraction', title: 'Length contraction in special relativity', latex: 'L = L_{0} \\sqrt{1 - \\frac{v^{2}}{c^{2}}}', symbol: 'L=L₀√(1-v²/c²)' },
  { id: 'time-dilation', label: 'Time dilation', title: 'Time dilation in special relativity', latex: '\\Delta t = \\frac{\\Delta t_{0}}{\\sqrt{1 - \\frac{v^{2}}{c^{2}}}}', symbol: 'Δt=Δt₀/√(1-v²/c²)' }
]
