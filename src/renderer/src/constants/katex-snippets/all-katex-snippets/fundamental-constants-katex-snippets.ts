/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const fundamentalConstantSnippets: KatexSnippetDefinition[] = [
  // ================================
  // Math constants
  // ================================
  { id: 'pi', label: 'Pi', title: 'Pi constant', latex: '\\pi', symbol: 'π' },
  { id: 'euler-number', label: 'Euler number', title: 'Euler number', latex: '\\mathrm{e}', symbol: 'e' },

  // ================================
  // Exact SI definitions (post-2019)
  // ================================
  { id: 'speed-of-light', label: 'Speed of light', title: 'Speed of light in vacuum (exact)', latex: 'c = 2.99792458 \\times 10^{8} \\; \\mathrm{m\\,s^{-1}}', symbol: 'c' },
  { id: 'planck-constant', label: "Planck's constant", title: "Planck's constant (exact)", latex: 'h = 6.62607015 \\times 10^{-34} \\; \\mathrm{J\\,s}', symbol: 'h' },
  { id: 'elementary-charge', label: 'Elementary charge', title: 'Elementary charge (exact)', latex: 'e = 1.602176634 \\times 10^{-19} \\; \\mathrm{C}', symbol: 'e⁻' },
  { id: 'avogadro-number', label: "Avogadro's number", title: "Avogadro's number (exact)", latex: 'N_{\\mathrm{A}} = 6.02214076 \\times 10^{23} \\; \\mathrm{mol^{-1}}', symbol: 'N_A' },
  { id: 'boltzmann-constant', label: "Boltzmann's constant", title: "Boltzmann's constant (exact)", latex: 'k_{\\mathrm{B}} = 1.380649 \\times 10^{-23} \\; \\mathrm{J\\,K^{-1}}', symbol: 'k_B' },

  // ================================
  // Electromagnetism & related
  // ================================
  { id: 'vacuum-permittivity', label: 'Vacuum permittivity', title: 'Vacuum permittivity (derived)', latex: '\\varepsilon_{0} \\approx 8.8541878 \\times 10^{-12} \\; \\mathrm{F\\,m^{-1}}', symbol: 'ε₀' },
  { id: 'vacuum-permeability', label: 'Vacuum permeability', title: 'Vacuum permeability (derived)', latex: '\\mu_{0} \\approx 1.25663706 \\times 10^{-6} \\; \\mathrm{N\\,A^{-2}}', symbol: 'μ₀' },
  { id: 'gas-constant', label: 'Universal gas constant', title: 'Universal gas constant', latex: 'R = 8.3145 \\; \\mathrm{J\\,mol^{-1}\\,K^{-1}}', symbol: 'R' },
  { id: 'faraday-constant', label: 'Faraday constant', title: 'Faraday constant', latex: 'F \\approx 9.6485 \\times 10^{4} \\; \\mathrm{C\\,mol^{-1}}', symbol: 'F' },
  { id: 'rydberg-constant', label: 'Rydberg constant', title: 'Rydberg constant', latex: 'R_{\\infty} \\approx 1.09737 \\times 10^{7} \\; \\mathrm{m^{-1}}', symbol: 'R_∞' },
  { id: 'fine-structure-constant', label: 'Fine-structure constant', title: 'Fine-structure constant', latex: '\\alpha \\approx \\tfrac{1}{137}', symbol: 'α' },

  // Radiation/thermal
  { id: 'stefan-boltzmann-constant', label: 'Stefan–Boltzmann constant', title: 'Stefan–Boltzmann constant', latex: '\\sigma \\approx 5.6704 \\times 10^{-8} \\; \\mathrm{W\\,m^{-2}\\,K^{-4}}', symbol: 'σ' },
  { id: 'wien-displacement-constant', label: 'Wien displacement constant', title: 'Wien’s constant', latex: 'b \\approx 2.8978 \\times 10^{-3} \\; \\mathrm{m\\,K}', symbol: 'b' },

  // ================================
  // Atomic/quantum
  // ================================
  { id: 'reduced-planck', label: 'Reduced Planck constant', title: 'Reduced Planck constant', latex: '\\hbar = \\tfrac{h}{2\\pi}', symbol: 'ħ' },
  { id: 'bohr-radius', label: 'Bohr radius', title: 'Bohr radius', latex: 'a_{0} \\approx 5.2918 \\times 10^{-11} \\; \\mathrm{m}', symbol: 'a₀' },
  { id: 'classical-electron-radius', label: 'Classical electron radius', title: 'Classical electron radius', latex: 'r_{e} \\approx 2.8179 \\times 10^{-15} \\; \\mathrm{m}', symbol: 'rₑ' },
  { id: 'atomic-mass-unit', label: 'Atomic mass unit', title: 'Atomic mass unit (dalton)', latex: 'u \\approx 1.66054 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'u' },
  { id: 'electron-volt', label: 'Electron volt', title: 'Electron volt (exact conversion)', latex: '1\\,\\mathrm{eV} = 1.602176634 \\times 10^{-19} \\; \\mathrm{J}', symbol: 'eV' },

  // ================================
  // Particle masses (rest mass, kg)
  // ================================
  { id: 'electron-mass', label: 'Electron mass', title: 'Electron rest mass', latex: 'm_{e} \\approx 9.1094 \\times 10^{-31} \\; \\mathrm{kg}', symbol: 'mₑ' },
  { id: 'proton-mass', label: 'Proton mass', title: 'Proton rest mass', latex: 'm_{p} \\approx 1.6726 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'mₚ' },
  { id: 'neutron-mass', label: 'Neutron mass', title: 'Neutron rest mass', latex: 'm_{n} \\approx 1.6749 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'mₙ' },
  { id: 'muon-mass', label: 'Muon mass', title: 'Muon (μ⁻) rest mass', latex: 'm_{\\mu} \\approx 1.8835 \\times 10^{-28} \\; \\mathrm{kg}', symbol: 'm_μ' },
  { id: 'tau-mass', label: 'Tau mass', title: 'Tau (τ⁻) rest mass', latex: 'm_{\\tau} \\approx 3.1675 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'm_τ' },
  { id: 'alpha-mass', label: 'Alpha particle mass', title: 'He-4 nucleus (α) mass', latex: 'm_{\\alpha} \\approx 6.6447 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'm_α' },
  { id: 'deuteron-mass', label: 'Deuteron mass', title: '²H nucleus (deuteron) mass', latex: 'm_{d} \\approx 3.3436 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'm_d' },
  { id: 'triton-mass', label: 'Triton mass', title: '³H nucleus (triton) mass', latex: 'm_{t} \\approx 5.0074 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'm_t' },

  // ================================
  // Gravitation / Earth & astro basics
  // ================================
  { id: 'gravitational-constant', label: 'Gravitational constant', title: 'Newtonian gravitational constant', latex: 'G \\approx 6.6743 \\times 10^{-11} \\; \\mathrm{m^{3}\\,kg^{-1}\\,s^{-2}}', symbol: 'G' },
  { id: 'standard-gravity', label: 'Standard gravity', title: 'Standard gravity at Earth (exact by convention)', latex: 'g_{\\mathrm{n}} = 9.80665 \\; \\mathrm{m\\,s^{-2}}', symbol: 'g' },
  { id: 'earth-radius', label: 'Earth mean radius', title: 'Earth mean radius', latex: 'R_{\\oplus} \\approx 6.371 \\times 10^{6} \\; \\mathrm{m}', symbol: 'R⊕' },
  { id: 'astronomical-unit', label: 'Astronomical unit', title: '1 au (exact)', latex: '1\\,\\mathrm{au} = 149\\,597\\,870\\,700 \\; \\mathrm{m}', symbol: 'au' },

  // ================================
  // Celestial body masses (kg)
  // ================================
  { id: 'sun-mass', label: 'Sun mass', title: 'Solar mass', latex: 'M_{\\odot} \\approx 1.9885 \\times 10^{30} \\; \\mathrm{kg}', symbol: 'M☉' },
  { id: 'mercury-mass', label: 'Mercury mass', title: 'Mercury mass', latex: 'M_{\\mathrm{Mercury}} \\approx 3.3011 \\times 10^{23} \\; \\mathrm{kg}', symbol: 'M_Me' },
  { id: 'venus-mass', label: 'Venus mass', title: 'Venus mass', latex: 'M_{\\mathrm{Venus}} \\approx 4.8673 \\times 10^{24} \\; \\mathrm{kg}', symbol: 'M_Ve' },
  { id: 'earth-mass', label: 'Earth mass', title: 'Earth mass', latex: 'M_{\\oplus} \\approx 5.9722 \\times 10^{24} \\; \\mathrm{kg}', symbol: 'M⊕' },
  { id: 'moon-mass', label: 'Moon mass', title: 'Moon mass', latex: 'M_{\\mathrm{Moon}} \\approx 7.3458 \\times 10^{22} \\; \\mathrm{kg}', symbol: 'M_Moon' },
  { id: 'mars-mass', label: 'Mars mass', title: 'Mars mass', latex: 'M_{\\mathrm{Mars}} \\approx 6.4169 \\times 10^{23} \\; \\mathrm{kg}', symbol: 'M_Ma' },
  { id: 'jupiter-mass', label: 'Jupiter mass', title: 'Jupiter mass', latex: 'M_{\\mathrm{Jupiter}} \\approx 1.8985 \\times 10^{27} \\; \\mathrm{kg}', symbol: 'M_J' },
  { id: 'saturn-mass', label: 'Saturn mass', title: 'Saturn mass', latex: 'M_{\\mathrm{Saturn}} \\approx 5.6846 \\times 10^{26} \\; \\mathrm{kg}', symbol: 'M_S' },
  { id: 'uranus-mass', label: 'Uranus mass', title: 'Uranus mass', latex: 'M_{\\mathrm{Uranus}} \\approx 8.6810 \\times 10^{25} \\; \\mathrm{kg}', symbol: 'M_U' },
  { id: 'neptune-mass', label: 'Neptune mass', title: 'Neptune mass', latex: 'M_{\\mathrm{Neptune}} \\approx 1.0243 \\times 10^{26} \\; \\mathrm{kg}', symbol: 'M_N' },
  { id: 'pluto-mass', label: 'Pluto mass', title: 'Pluto (dwarf planet) mass', latex: 'M_{\\mathrm{Pluto}} \\approx 1.309 \\times 10^{22} \\; \\mathrm{kg}', symbol: 'M_Pl' }
]
