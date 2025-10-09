/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const chemistryFormulaSnippets: KatexSnippetDefinition[] = [
  // --- Common and essential molecules ---
  { id: 'water', label: 'Water', title: 'Water', latex: 'H_{2}O', symbol: 'H₂O' },
  { id: 'oxygen', label: 'Oxygen', title: 'Oxygen (gas)', latex: 'O_{2}', symbol: 'O₂' },
  { id: 'carbon-dioxide', label: 'Carbon Dioxide', title: 'Carbon Dioxide', latex: 'CO_{2}', symbol: 'CO₂' },
  { id: 'nitrogen', label: 'Nitrogen', title: 'Nitrogen (gas)', latex: 'N_{2}', symbol: 'N₂' },
  { id: 'ozone', label: 'Ozone', title: 'Ozone', latex: 'O_{3}', symbol: 'O₃' },
  { id: 'ammonia', label: 'Ammonia', title: 'Ammonia', latex: 'NH_{3}', symbol: 'NH₃' },
  { id: 'methane', label: 'Methane', title: 'Methane', latex: 'CH_{4}', symbol: 'CH₄' },
  { id: 'glucose', label: 'Glucose', title: 'Glucose (sugar)', latex: 'C_{6}H_{12}O_{6}', symbol: 'C₆H₁₂O₆' },
  { id: 'ethanol', label: 'Ethanol', title: 'Ethanol (alcohol)', latex: 'C_{2}H_{5}OH', symbol: 'C₂H₅OH' },
  { id: 'sodium-chloride', label: 'Sodium Chloride', title: 'Sodium Chloride (table salt)', latex: 'NaCl', symbol: 'NaCl' },
  { id: 'hydrogen-peroxide', label: 'Hydrogen Peroxide', title: 'Hydrogen Peroxide', latex: 'H_{2}O_{2}', symbol: 'H₂O₂' },
  { id: 'acetic-acid', label: 'Acetic Acid', title: 'Acetic Acid (vinegar)', latex: 'CH_{3}COOH', symbol: 'CH₃COOH' },
  { id: 'hydrochloric-acid', label: 'Hydrochloric Acid', title: 'Hydrochloric Acid', latex: 'HCl', symbol: 'HCl' },
  { id: 'sulfuric-acid', label: 'Sulfuric Acid', title: 'Sulfuric Acid', latex: 'H_{2}SO_{4}', symbol: 'H₂SO₄' },
  { id: 'nitric-acid', label: 'Nitric Acid', title: 'Nitric Acid', latex: 'HNO_{3}', symbol: 'HNO₃' },
  { id: 'sodium-hydroxide', label: 'Sodium Hydroxide', title: 'Sodium Hydroxide (lye)', latex: 'NaOH', symbol: 'NaOH' },
  { id: 'calcium-carbonate', label: 'Calcium Carbonate', title: 'Calcium Carbonate (chalk, limestone)', latex: 'CaCO_{3}', symbol: 'CaCO₃' },
  { id: 'carbon-monoxide', label: 'Carbon Monoxide', title: 'Carbon Monoxide', latex: 'CO', symbol: 'CO' },

  // --- Common salts and ions ---
  { id: 'sodium-carbonate', label: 'Sodium Carbonate', title: 'Sodium Carbonate (washing soda)', latex: 'Na_{2}CO_{3}', symbol: 'Na₂CO₃' },
  { id: 'sodium-bicarbonate', label: 'Sodium Bicarbonate', title: 'Sodium Bicarbonate (baking soda)', latex: 'NaHCO_{3}', symbol: 'NaHCO₃' },
  { id: 'calcium-hydroxide', label: 'Calcium Hydroxide', title: 'Calcium Hydroxide (slaked lime)', latex: 'Ca(OH)_{2}', symbol: 'Ca(OH)₂' },
  { id: 'ammonium-chloride', label: 'Ammonium Chloride', title: 'Ammonium Chloride', latex: 'NH_{4}Cl', symbol: 'NH₄Cl' },
  { id: 'magnesium-sulfate', label: 'Magnesium Sulfate', title: 'Magnesium Sulfate (Epsom salt)', latex: 'MgSO_{4}', symbol: 'MgSO₄' },
  { id: 'calcium-sulfate', label: 'Calcium Sulfate', title: 'Calcium Sulfate (gypsum)', latex: 'CaSO_{4}', symbol: 'CaSO₄' },

  // --- Organic basics ---
  { id: 'methanol', label: 'Methanol', title: 'Methanol (wood alcohol)', latex: 'CH_{3}OH', symbol: 'CH₃OH' },
  { id: 'ethane', label: 'Ethane', title: 'Ethane', latex: 'C_{2}H_{6}', symbol: 'C₂H₆' },
  { id: 'ethene', label: 'Ethene', title: 'Ethene (ethylene)', latex: 'C_{2}H_{4}', symbol: 'C₂H₄' },
  { id: 'ethyne', label: 'Ethyne', title: 'Ethyne (acetylene)', latex: 'C_{2}H_{2}', symbol: 'C₂H₂' },
  { id: 'formaldehyde', label: 'Formaldehyde', title: 'Formaldehyde', latex: 'CH_{2}O', symbol: 'CH₂O' },
  { id: 'benzene', label: 'Benzene', title: 'Benzene', latex: 'C_{6}H_{6}', symbol: 'C₆H₆' },

  // --- Gases and other important compounds ---
  { id: 'hydrogen', label: 'Hydrogen', title: 'Hydrogen (gas)', latex: 'H_{2}', symbol: 'H₂' },
  { id: 'chlorine', label: 'Chlorine', title: 'Chlorine (gas)', latex: 'Cl_{2}', symbol: 'Cl₂' },
  { id: 'sulfur-dioxide', label: 'Sulfur Dioxide', title: 'Sulfur Dioxide', latex: 'SO_{2}', symbol: 'SO₂' },
  { id: 'nitrogen-dioxide', label: 'Nitrogen Dioxide', title: 'Nitrogen Dioxide', latex: 'NO_{2}', symbol: 'NO₂' },
  { id: 'ammonium-nitrate', label: 'Ammonium Nitrate', title: 'Ammonium Nitrate (fertilizer, explosive)', latex: 'NH_{4}NO_{3}', symbol: 'NH₄NO₃' },
  { id: 'phosphoric-acid', label: 'Phosphoric Acid', title: 'Phosphoric Acid (in soft drinks)', latex: 'H_{3}PO_{4}', symbol: 'H₃PO₄' },
  { id: 'calcium-phosphate', label: 'Calcium Phosphate', title: 'Calcium Phosphate (bones, teeth)', latex: 'Ca_{3}(PO_{4})_{2}', symbol: 'Ca₃(PO₄)₂' },
  { id: 'silicon-dioxide', label: 'Silicon Dioxide', title: 'Silicon Dioxide (sand, quartz)', latex: 'SiO_{2}', symbol: 'SiO₂' },
  { id: 'carbon-disulfide', label: 'Carbon Disulfide', title: 'Carbon Disulfide', latex: 'CS_{2}', symbol: 'CS₂' }
];
