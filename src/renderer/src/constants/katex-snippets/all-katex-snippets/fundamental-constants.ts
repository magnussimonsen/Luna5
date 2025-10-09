/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const fundamentalConstantSnippets: KatexSnippetDefinition[] = [
	{ id: 'pi', label: 'Pi', title: 'Pi constant', latex: '\\pi', symbol: 'π' },
	{ id: 'euler-number', label: 'Euler number', title: 'Euler number', latex: '\\mathrm{e}', symbol: 'e' },
	{
		id: 'speed-of-light',
		label: 'Speed of light',
		title: 'Speed of light in vacuum',
		latex: 'c = 2.9979 \\times 10^{8} \\; \\mathrm{m\\,s^{-1}}',
		symbol: 'c'
	},
	{
		id: 'gravitational-constant',
		label: 'Gravitational constant',
		title: 'Newtonian gravitational constant',
		latex: 'G = 6.6743 \\times 10^{-11} \\; \\mathrm{m^{3}\\,kg^{-1}\\,s^{-2}}',
		symbol: 'G'
	},
	{
		id: 'planck-constant',
		label: "Planck's constant",
		title: "Planck's constant",
		latex: 'h = 6.6261 \\times 10^{-34} \\; \\mathrm{J\\,s}',
		symbol: 'h'
	},
	{
		id: 'reduced-planck',
		label: 'Reduced Planck constant',
		title: 'Reduced Planck constant',
		latex: '\\hbar = \\frac{h}{2\\pi}',
		symbol: 'ħ'
	},
	{
		id: 'boltzmann-constant',
		label: "Boltzmann's constant",
		title: "Boltzmann's constant",
		latex: 'k_{\\mathrm{B}} = 1.3806 \\times 10^{-23} \\; \\mathrm{J\\,K^{-1}}',
		symbol: 'k_B'
	},
	{
		id: 'avogadro-number',
		label: "Avogadro's number",
		title: "Avogadro's number",
		latex: 'N_{\\mathrm{A}} = 6.0221 \\times 10^{23} \\; \\mathrm{mol^{-1}}',
		symbol: 'N_A'
	},
	{
		id: 'gas-constant',
		label: 'Universal gas constant',
		title: 'Universal gas constant',
		latex: 'R = 8.3145 \\; \\mathrm{J\\,mol^{-1}\\,K^{-1}}',
		symbol: 'R'
	},
	{
		id: 'elementary-charge',
		label: 'Elementary charge',
		title: 'Elementary charge',
		latex: 'e = 1.6022 \\times 10^{-19} \\; \\mathrm{C}',
		symbol: 'e⁻'
	},
    { id: 'vacuum-permittivity', label: 'Vacuum permittivity', title: 'Vacuum permittivity', latex: '\\varepsilon_{0} = 8.8542 \\times 10^{-12} \\; \\mathrm{F\\,m^{-1}}', symbol: 'ε₀' },
    { id: 'vacuum-permeability', label: 'Vacuum permeability', title: 'Vacuum permeability', latex: '\\mu_{0} = 4\\pi \\times 10^{-7} \\; \\mathrm{N\\,A^{-2}}', symbol: 'μ₀' },
    { id: 'electron-mass', label: 'Electron mass', title: 'Electron mass', latex: 'm_{e} = 9.1094 \\times 10^{-31} \\; \\mathrm{kg}', symbol: 'mₑ' },
    { id: 'proton-mass', label: 'Proton mass', title: 'Proton mass', latex: 'm_{p} = 1.6726 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'mₚ' },
    { id: 'neutron-mass', label: 'Neutron mass', title: 'Neutron mass', latex: 'm_{n} = 1.6749 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'mₙ' },
    { id: 'rydberg-constant', label: 'Rydberg constant', title: 'Rydberg constant', latex: 'R_{\\infty} = 1.0974 \\times 10^{7} \\; \\mathrm{m^{-1}}', symbol: 'R_∞' },
    { id: 'fine-structure-constant', label: 'Fine-structure constant', title: 'Fine-structure constant', latex: '\\alpha = \\frac{e^{2}}{4\\pi \\varepsilon_{0} \\hbar c} \\approx \\frac{1}{137}', symbol: 'α' },
    { id: 'stefan-boltzmann-constant', label: 'Stefan-Boltzmann constant', title: 'Stefan-Boltzmann constant', latex: '\\sigma = 5.6704 \\times 10^{-8} \\; \\mathrm{W\\,m^{-2}\\,K^{-4}}', symbol: 'σ' },
    { id: 'wien-displacement-constant', label: 'Wien displacement constant', title: 'Wien displacement constant', latex: 'b = 2.8978 \\times 10^{-3} \\; \\mathrm{m\\,K}', symbol: 'b' },
    { id: 'bohr-radius', label: 'Bohr radius', title: 'Bohr radius', latex: 'a_{0} = 5.2918 \\times 10^{-11} \\; \\mathrm{m}', symbol: 'a₀'},
    { id: 'classical-electron-radius', label: 'Classical electron radius', title: 'Classical electron radius', latex: 'r_{e} = 2.8179 \\times 10^{-15} \\; \\mathrm{m}', symbol: 'rₑ' },
    { id: 'atomic-mass-unit', label: 'Atomic mass unit', title: 'Atomic mass unit', latex: 'u = 1.6605 \\times 10^{-27} \\; \\mathrm{kg}', symbol: 'u' },
    { id: 'faraday-constant', label: 'Faraday constant', title: 'Faraday constant', latex: 'F = 9.6485 \\times 10^{4} \\; \\mathrm{C\\,mol^{-1}}', symbol: 'F' }
]
