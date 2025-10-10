/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const geometrySymbolsSnippets: KatexSnippetDefinition[] = [
  // --- Core theorems ---
  {
    id: 'angle-symbol',
    label: 'Angle symbol',
    title: 'Angle symbol (∠)',
    latex: '\\angle',
    symbol: '∠'
  },
  {
    id: 'degree-symbol',
    label: 'Degree symbol',
    title: 'Degree symbol (°)',
    latex: '\\degree',
    symbol: '°'
  },
  {
    id: 'triangle-symbol',
    label: 'Triangle symbol',
    title: 'Triangle symbol (△)',
    latex: '\\triangle',
    symbol: '△'
  },
  {
    id: 'similarity-symbol',
    label: 'Similarity symbol',
    title: 'Similarity symbol (∼)',
    latex: '\\sim',
    symbol: '∼'
  },
  {
    id: 'congruence-symbol',
    label: 'Congruence symbol',
    title: 'Congruence symbol (≅)',
    latex: '\\cong',
    symbol: '≅'
  },
  {
    id: 'right-angle-symbol',
    label: 'Right angle symbol',
    title: 'Right angle symbol (∟)',
    latex: '∟', // Direct Unicode symbol
    symbol: '∟'
  },
  {
    id: 'perpendicular-symbol',
    label: 'Perpendicular symbol',
    title: 'Perpendicular symbol (⊥)',
    latex: '\\perp',
    symbol: '⊥'
  },
  {
    id: 'parallel-symbol',
    label: 'Parallel symbol',
    title: 'Parallel symbol (∥)',
    latex: '\\parallel',
    symbol: '∥'
  },
  {
    id: 'spherical-angle-symbol',
    label: 'Spherical angle symbol',
    title: 'Spherical angle symbol (∢)',
    latex: '\\sphericalangle',
    symbol: '∢'
  },
  {
    id: 'measured-angle-symbol',
    label: 'Measured angle symbol',
    title: 'Measured angle symbol (∡)',
    latex: '\\measuredangle',
    symbol: '∡'
  }
]
