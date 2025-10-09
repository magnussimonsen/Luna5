/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const areasAndVolumesSnippets: KatexSnippetDefinition[] = [
    {
        id: 'circle-area',
        label: 'Area of a circle',
        title: 'Area of a circle',
        latex: 'A = \\pi r^{2}',
        symbol: 'πr²'
    },
    {
        id: 'triangle-area',
        label: 'Area of a triangle',
        title: 'Area of a triangle',
        latex: 'A = \\frac{1}{2} b h',
        symbol: '½bh'
    },
    {
        id: 'trapezoid-area',
        label: 'Area of a trapezoid',   
        title: 'Area of a trapezoid',
        latex: 'A = \\frac{1}{2} (b_{1} + b_{2}) h',
        symbol: '½(b₁ + b₂)h'
    },
    {
        id: 'sphere-volume',
        label: 'Volume of a sphere',
        title: 'Volume of a sphere',
        latex: 'V = \\frac{4}{3} \\pi r^{3}',
        symbol: '⅗πr³'
    },
    {
        id: 'cylinder-volume',
        label: 'Volume of a cylinder',
        title: 'Volume of a cylinder',
        latex: 'V = \\pi r^{2} h',
        symbol: 'πr²h'
    }, 
    {
        id: 'cone-volume',
        label: 'Volume of a cone',
        title: 'Volume of a cone',
        latex: 'V = \\frac{1}{3} \\pi r^{2} h',
        symbol: '⅓πr²h'
    },
    {
        id: 'rectangular-prism-volume',
        label: 'Volume of a rectangular prism',
        title: 'Volume of a rectangular prism',
        latex: 'V = l w h',
        symbol: 'lwh'
    },
]
