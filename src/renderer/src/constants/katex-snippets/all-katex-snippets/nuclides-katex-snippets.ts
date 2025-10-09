/* eslint-disable prettier/prettier */
import { KatexSnippetDefinition } from '@renderer/types/katex-snippet-definition'

export const nuclidesSnippets: KatexSnippetDefinition[] = [
  // --- Hydrogen (Z = 1) ---
  { id: 'hydrogen-1', label: 'Hydrogen-1 (Protium, stable)', title: 'Hydrogen-1', latex: '^{1}_{1}H', symbol: 'H-1' },
  { id: 'hydrogen-2', label: 'Hydrogen-2 (Deuterium, stable / deuteron projectile)', title: 'Hydrogen-2', latex: '^{2}_{1}H', symbol: 'H-2' },
  { id: 'hydrogen-3', label: 'Hydrogen-3 (Tritium, t₁⁄₂ ≈ 12.3 y / triton projectile)', title: 'Hydrogen-3', latex: '^{3}_{1}H', symbol: 'H-3' },

  // --- Helium (Z = 2) ---
  { id: 'helium-3', label: 'Helium-3 (stable)', title: 'Helium-3', latex: '^{3}_{2}He', symbol: 'He-3' },
  { id: 'helium-4', label: 'Helium-4 (Alpha particle, stable)', title: 'Helium-4', latex: '^{4}_{2}He', symbol: 'He-4' },

  // --- Carbon (Z = 6) ---
  { id: 'carbon-12', label: 'Carbon-12 (stable)', title: 'Carbon-12', latex: '^{12}_{6}C', symbol: 'C-12' },
  { id: 'carbon-14', label: 'Carbon-14 (t₁⁄₂ ≈ 5730 y)', title: 'Carbon-14', latex: '^{14}_{6}C', symbol: 'C-14' },

  // --- Nitrogen (Z = 7) ---
  { id: 'nitrogen-14', label: 'Nitrogen-14 (stable)', title: 'Nitrogen-14', latex: '^{14}_{7}N', symbol: 'N-14' },

  // --- Oxygen (Z = 8) ---
  { id: 'oxygen-16', label: 'Oxygen-16 (stable)', title: 'Oxygen-16', latex: '^{16}_{8}O', symbol: 'O-16' },

  // --- Fluorine (Z = 9) ---
  { id: 'fluorine-18', label: 'Fluorine-18 (t₁⁄₂ ≈ 110 min, PET isotope)', title: 'Fluorine-18', latex: '^{18}_{9}F', symbol: 'F-18' },

  // --- Sodium (Z = 11) ---
  { id: 'sodium-22', label: 'Sodium-22 (t₁⁄₂ ≈ 2.6 y)', title: 'Sodium-22', latex: '^{22}_{11}Na', symbol: 'Na-22' },
  { id: 'sodium-23', label: 'Sodium-23 (stable)', title: 'Sodium-23', latex: '^{23}_{11}Na', symbol: 'Na-23' },

  // --- Phosphorus (Z = 15) ---
  { id: 'phosphorus-31', label: 'Phosphorus-31 (stable)', title: 'Phosphorus-31', latex: '^{31}_{15}P', symbol: 'P-31' },
  { id: 'phosphorus-32', label: 'Phosphorus-32 (t₁⁄₂ ≈ 14.3 d)', title: 'Phosphorus-32', latex: '^{32}_{15}P', symbol: 'P-32' },

  // --- Sulfur (Z = 16) ---
  { id: 'sulfur-32', label: 'Sulfur-32 (stable)', title: 'Sulfur-32', latex: '^{32}_{16}S', symbol: 'S-32' },

  // --- Chlorine (Z = 17) ---
  { id: 'chlorine-35', label: 'Chlorine-35 (stable)', title: 'Chlorine-35', latex: '^{35}_{17}Cl', symbol: 'Cl-35' },
  { id: 'chlorine-37', label: 'Chlorine-37 (stable)', title: 'Chlorine-37', latex: '^{37}_{17}Cl', symbol: 'Cl-37' },

  // --- Potassium (Z = 19) ---
  { id: 'potassium-40', label: 'Potassium-40 (t₁⁄₂ ≈ 1.25 × 10⁹ y)', title: 'Potassium-40', latex: '^{40}_{19}K', symbol: 'K-40' },

  // --- Calcium (Z = 20) ---
  { id: 'calcium-40', label: 'Calcium-40 (stable)', title: 'Calcium-40', latex: '^{40}_{20}Ca', symbol: 'Ca-40' },

  // --- Iron (Z = 26) ---
  { id: 'iron-56', label: 'Iron-56 (stable)', title: 'Iron-56', latex: '^{56}_{26}Fe', symbol: 'Fe-56' },

  // --- Cobalt (Z = 27) ---
  { id: 'cobalt-60', label: 'Cobalt-60 (t₁⁄₂ ≈ 5.27 y)', title: 'Cobalt-60', latex: '^{60}_{27}Co', symbol: 'Co-60' },

  // --- Copper (Z = 29) ---
  { id: 'copper-63', label: 'Copper-63 (stable)', title: 'Copper-63', latex: '^{63}_{29}Cu', symbol: 'Cu-63' },

  // --- Zinc (Z = 30) ---
  { id: 'zinc-65', label: 'Zinc-65 (t₁⁄₂ ≈ 244 d)', title: 'Zinc-65', latex: '^{65}_{30}Zn', symbol: 'Zn-65' },

  // --- Strontium (Z = 38) ---
  { id: 'strontium-90', label: 'Strontium-90 (t₁⁄₂ ≈ 28.8 y)', title: 'Strontium-90', latex: '^{90}_{38}Sr', symbol: 'Sr-90' },

  // --- Technetium (Z = 43) ---
  { id: 'technetium-99m', label: 'Technetium-99m (t₁⁄₂ ≈ 6 h, metastable, medical)', title: 'Technetium-99m', latex: '^{99m}_{43}Tc', symbol: 'Tc-99m' },

  // --- Iodine (Z = 53) ---
  { id: 'iodine-127', label: 'Iodine-127 (stable)', title: 'Iodine-127', latex: '^{127}_{53}I', symbol: 'I-127' },
  { id: 'iodine-131', label: 'Iodine-131 (t₁⁄₂ ≈ 8.0 d)', title: 'Iodine-131', latex: '^{131}_{53}I', symbol: 'I-131' },

  // --- Cesium (Z = 55) ---
  { id: 'cesium-133', label: 'Cesium-133 (stable)', title: 'Cesium-133', latex: '^{133}_{55}Cs', symbol: 'Cs-133' },
  { id: 'cesium-137', label: 'Cesium-137 (t₁⁄₂ ≈ 30.1 y)', title: 'Cesium-137', latex: '^{137}_{55}Cs', symbol: 'Cs-137' },

  // --- Radon (Z = 86) ---
  { id: 'radon-222', label: 'Radon-222 (t₁⁄₂ ≈ 3.8 d)', title: 'Radon-222', latex: '^{222}_{86}Rn', symbol: 'Rn-222' },

  // --- Uranium (Z = 92) ---
  { id: 'uranium-235', label: 'Uranium-235 (t₁⁄₂ ≈ 7.0 × 10⁸ y)', title: 'Uranium-235', latex: '^{235}_{92}U', symbol: 'U-235' },
  { id: 'uranium-238', label: 'Uranium-238 (t₁⁄₂ ≈ 4.47 × 10⁹ y)', title: 'Uranium-238', latex: '^{238}_{92}U', symbol: 'U-238' },

  // --- Plutonium (Z = 94) ---
  { id: 'plutonium-239', label: 'Plutonium-239 (t₁⁄₂ ≈ 24,100 y)', title: 'Plutonium-239', latex: '^{239}_{94}Pu', symbol: 'Pu-239' },

  // --- Fundamental particles for nuclear equations ---
  { id: 'proton', label: 'Proton (¹₁p)', title: 'Proton', latex: '^{1}_{1}p', symbol: 'p' },
  { id: 'neutron', label: 'Neutron (¹₀n)', title: 'Neutron', latex: '^{1}_{0}n', symbol: 'n' },
  { id: 'alpha', label: 'Alpha particle (⁴₂He)', title: 'Alpha particle', latex: '^{4}_{2}He', symbol: 'α' },
  { id: 'beta-minus', label: 'Beta⁻ (⁰₋₁e)', title: 'Beta minus particle', latex: '^{0}_{-1}e', symbol: 'β⁻' },
  { id: 'positron', label: 'Positron (⁰₊₁e, β⁺)', title: 'Positron', latex: '^{0}_{+1}e', symbol: 'β⁺' },
  { id: 'gamma', label: 'Gamma photon (⁰₀γ)', title: 'Gamma photon', latex: '^{0}_{0}\\gamma', symbol: 'γ' },
  { id: 'electron-neutrino', label: 'Electron neutrino (νₑ)', title: 'Electron neutrino', latex: '^{0}_{0}\\nu_{e}', symbol: 'νₑ' },
  { id: 'electron-antineutrino', label: 'Electron antineutrino (ν̄ₑ)', title: 'Electron antineutrino', latex: '^{0}_{0}\\bar{\\nu}_{e}', symbol: 'ν̄ₑ' }
]


    /*
    { id: 'hydrogen', label: 'Hydrogen', title: 'Hydrogen', latex: '^{1}_{1}H', symbol: '₁H' },
    { id: 'helium', label: 'Helium', title: 'Helium', latex: '^{4}_{2}He', symbol: '₂He' },
    { id: 'lithium', label: 'Lithium', title: 'Lithium', latex: '^{7}_{3}Li', symbol: '₃Li' },
    { id: 'beryllium', label: 'Beryllium', title: 'Beryllium', latex: '^{9}_{4}Be', symbol: '₄Be' },
    { id: 'boron', label: 'Boron', title: 'Boron', latex: '^{11}_{5}B', symbol: '₅B' },
    { id: 'carbon', label: 'Carbon', title: 'Carbon', latex: '^{12}_{6}C', symbol: '₆C' },
    { id: 'nitrogen', label: 'Nitrogen', title: 'Nitrogen', latex: '^{14}_{7}N', symbol: '₇N' },
    { id: 'oxygen', label: 'Oxygen', title: 'Oxygen', latex: '^{16}_{8}O', symbol: '₈O' },
    { id: 'fluorine', label: 'Fluorine', title: 'Fluorine', latex: '^{19}_{9}F', symbol: '₉F' },
    { id: 'neon', label: 'Neon', title: 'Neon', latex: '^{20}_{10}Ne', symbol: '₁₀Ne' },
    { id: 'sodium', label: 'Sodium', title: 'Sodium', latex: '^{23}_{11}Na', symbol: '₁₁Na' },
    { id: 'magnesium', label: 'Magnesium', title: 'Magnesium', latex: '^{24}_{12}Mg', symbol: '₁₂Mg' },
    { id: 'aluminum', label: 'Aluminum', title: 'Aluminum', latex: '^{27}_{13}Al', symbol: '₁₃Al' },
    { id: 'silicon', label: 'Silicon', title: 'Silicon', latex: '^{28}_{14}Si', symbol: '₁₄Si' },
    { id: 'phosphorus', label: 'Phosphorus', title: 'Phosphorus', latex: '^{31}_{15}P', symbol: '₁₅P' },
    { id: 'sulfur', label: 'Sulfur', title: 'Sulfur', latex: '^{32}_{16}S', symbol: '₁₆S' },
    { id: 'chlorine', label: 'Chlorine', title: 'Chlorine', latex: '^{35}_{17}Cl', symbol: '₁₇Cl' },
    { id: 'argon', label: 'Argon', title: 'Argon', latex: '^{40}_{18}Ar', symbol: '₁₈Ar' },
    { id: 'potassium', label: 'Potassium', title: 'Potassium', latex: '^{39}_{19}K', symbol: '₁₉K' },
    { id: 'calcium', label: 'Calcium', title: 'Calcium', latex: '^{40}_{20}Ca', symbol: '₂₀Ca' },
    { id: 'scandium', label: 'Scandium', title: 'Scandium', latex: '^{45}_{21}Sc', symbol: '₂₁Sc' },
    { id: 'titanium', label: 'Titanium', title: 'Titanium', latex: '^{48}_{22}Ti', symbol: '₂₂Ti' },
    { id: 'vanadium', label: 'Vanadium', title: 'Vanadium', latex: '^{51}_{23}V', symbol: '₂₃V' },
    { id: 'chromium', label: 'Chromium', title: 'Chromium', latex: '^{52}_{24}Cr', symbol: '₂₄Cr' },
    { id: 'manganese', label: 'Manganese', title: 'Manganese', latex: '^{55}_{25}Mn', symbol: '₂₅Mn' },
    { id: 'iron', label: 'Iron', title: 'Iron', latex: '^{56}_{26}Fe', symbol: '₂₆Fe' },
    { id: 'cobalt', label: 'Cobalt', title: 'Cobalt', latex: '^{59}_{27}Co', symbol: '₂₇Co' },
    { id: 'nickel', label: 'Nickel', title: 'Nickel', latex: '^{58}_{28}Ni', symbol: '₂₈Ni' },
    { id: 'copper', label: 'Copper', title: 'Copper', latex: '^{63}_{29}Cu', symbol: '₂₉Cu' },
    { id: 'zinc', label: 'Zinc', title: 'Zinc', latex: '^{64}_{30}Zn', symbol: '₃₀Zn' },
    { id: 'gallium', label: 'Gallium', title: 'Gallium', latex: '^{69}_{31}Ga', symbol: '₃₁Ga' },
    { id: 'germanium', label: 'Germanium', title: 'Germanium', latex: '^{74}_{32}Ge', symbol: '₃₂Ge' },
    { id: 'arsenic', label: 'Arsenic', title: 'Arsenic', latex: '^{75}_{33}As', symbol: '₃₃As' },
    { id: 'selenium', label: 'Selenium', title: 'Selenium', latex: '^{80}_{34}Se', symbol: '₃₄Se' },
    { id: 'bromine', label: 'Bromine', title: 'Bromine', latex: '^{79}_{35}Br', symbol: '₃₅Br' },
    { id: 'krypton', label: 'Krypton', title: 'Krypton', latex: '^{84}_{36}Kr', symbol: '₃₆Kr' },
    { id: 'rubidium', label: 'Rubidium', title: 'Rubidium', latex: '^{85}_{37}Rb', symbol: '₃₇Rb' },
    { id: 'strontium', label: 'Strontium', title: 'Strontium', latex: '^{88}_{38}Sr', symbol: '₃₈Sr' },
    { id: 'yttrium', label: 'Yttrium', title: 'Yttrium', latex: '^{89}_{39}Y', symbol: '₃₉Y' },
    { id: 'zirconium', label: 'Zirconium', title: 'Zirconium', latex: '^{90}_{40}Zr', symbol: '₄₀Zr' },
    { id: 'niobium', label: 'Niobium', title: 'Niobium', latex: '^{93}_{41}Nb', symbol: '₄₁Nb' },
    { id: 'molybdenum', label: 'Molybdenum', title: 'Molybdenum', latex: '^{98}_{42}Mo', symbol: '₄₂Mo' },
    { id: 'technetium', label: 'Technetium', title: 'Technetium', latex: '^{98}_{43}Tc', symbol: '₄₃Tc' },
    { id: 'ruthenium', label: 'Ruthenium', title: 'Ruthenium', latex: '^{102}_{44}Ru', symbol: '₄₄Ru' },
    { id: 'rhodium', label: 'Rhodium', title: 'Rhodium', latex: '^{103}_{45}Rh', symbol: '₄₅Rh' },
    { id: 'palladium', label: 'Palladium', title: 'Palladium', latex: '^{106}_{46}Pd', symbol: '₄₆Pd' },
    { id: 'silver', label: 'Silver', title: 'Silver', latex: '^{107}_{47}Ag', symbol: '₄₇Ag' },
    { id: 'cadmium', label: 'Cadmium', title: 'Cadmium', latex: '^{114}_{48}Cd', symbol: '₄₈Cd' },
    { id: 'indium', label: 'Indium', title: 'Indium', latex: '^{115}_{49}In', symbol: '₄₉In' },
    { id: 'tin', label: 'Tin', title: 'Tin', latex: '^{120}_{50}Sn', symbol: '₅₀Sn' },
    { id: 'antimony', label: 'Antimony', title: 'Antimony', latex: '^{121}_{51}Sb', symbol: '₅₁Sb' },
    { id: 'tellurium', label: 'Tellurium', title: 'Tellurium', latex: '^{130}_{52}Te', symbol: '₅₂Te' },
    { id: 'iodine', label: 'Iodine', title: 'Iodine', latex: '^{127}_{53}I', symbol: '₅₃I' },
    { id: 'xenon', label: 'Xenon', title: 'Xenon', latex: '^{132}_{54}Xe', symbol: '₅₄Xe' },
    { id: 'cesium', label: 'Cesium', title: 'Cesium', latex: '^{133}_{55}Cs', symbol: '₅₅Cs' },
    { id: 'barium', label: 'Barium', title: 'Barium', latex: '^{138}_{56}Ba', symbol: '₅₆Ba' },
    { id: 'lanthanum', label: 'Lanthanum', title: 'Lanthanum', latex: '^{139}_{57}La', symbol: '₅₇La' },
    { id: 'cerium', label: 'Cerium', title: 'Cerium', latex: '^{140}_{58}Ce', symbol: '₅₈Ce' },
    { id: 'praseodymium', label: 'Praseodymium', title: 'Praseodymium', latex: '^{141}_{59}Pr', symbol: '₅₉Pr' },
    { id: 'neodymium', label: 'Neodymium', title: 'Neodymium', latex: '^{142}_{60}Nd', symbol: '₆₀Nd' },
    { id: 'promethium', label: 'Promethium', title: 'Promethium', latex: '^{145}_{61}Pm', symbol: '₆₁Pm' },
    { id: 'samarium', label: 'Samarium', title: 'Samarium', latex: '^{152}_{62}Sm', symbol: '₆₂Sm' },
    { id: 'europium', label: 'Europium', title: 'Europium', latex: '^{153}_{63}Eu', symbol: '₆₃Eu' },
    { id: 'gadolinium', label: 'Gadolinium', title: 'Gadolinium', latex: '^{158}_{64}Gd', symbol: '₆₄Gd' },
    { id: 'terbium', label: 'Terbium', title: 'Terbium', latex: '^{159}_{65}Tb', symbol: '₆₅Tb' },
    { id: 'dysprosium', label: 'Dysprosium', title: 'Dysprosium', latex: '^{164}_{66}Dy', symbol: '₆₆Dy' },
    { id: 'holmium', label: 'Holmium', title: 'Holmium', latex: '^{165}_{67}Ho', symbol: '₆₇Ho' },
    { id: 'erbium', label: 'Erbium', title: 'Erbium', latex: '^{166}_{68}Er', symbol: '₆₈Er' },
    { id: 'thulium', label: 'Thulium', title: 'Thulium', latex: '^{169}_{69}Tm', symbol: '₆₉Tm' },
    { id: 'ytterbium', label: 'Ytterbium', title: 'Ytterbium', latex: '^{174}_{70}Yb', symbol: '₇₀Yb' },
    { id: 'lutetium', label: 'Lutetium', title: 'Lutetium', latex: '^{175}_{71}Lu', symbol: '₇₁Lu' },
    { id: 'hafnium', label: 'Hafnium', title: 'Hafnium', latex: '^{180}_{72}Hf', symbol: '₇₂Hf' },
    { id: 'tantalum', label: 'Tantalum', title: 'Tantalum', latex: '^{181}_{73}Ta', symbol: '₇₃Ta' },
    { id: 'tungsten', label: 'Tungsten', title: 'Tungsten', latex: '^{184}_{74}W', symbol: '₇₄W' },
    { id: 'rhenium', label: 'Rhenium', title: 'Rhenium', latex: '^{187}_{75}Re', symbol: '₇₅Re' },
    { id: 'osmium', label: 'Osmium', title: 'Osmium', latex: '^{192}_{76}Os', symbol: '₇₆Os' },
    { id: 'iridium', label: 'Iridium', title: 'Iridium', latex: '^{193}_{77}Ir', symbol: '₇₇Ir' },
    { id: 'platinum', label: 'Platinum', title: 'Platinum', latex: '^{195}_{78}Pt', symbol: '₇₈Pt' },
    { id: 'gold', label: 'Gold', title: 'Gold', latex: '^{197}_{79}Au', symbol: '₇₉Au' },
    { id: 'mercury', label: 'Mercury', title: 'Mercury', latex: '^{202}_{80}Hg', symbol: '₈₀Hg' },
    { id: 'thallium', label: 'Thallium', title: 'Thallium', latex: '^{205}_{81}Tl', symbol: '₈₁Tl' },
    { id: 'lead', label: 'Lead', title: 'Lead', latex: '^{208}_{82}Pb', symbol: '₈₂Pb' },
    { id: 'bismuth', label: 'Bismuth', title: 'Bismuth', latex: '^{209}_{83}Bi', symbol: '₈₃Bi' },
    { id: 'polonium', label: 'Polonium', title: 'Polonium', latex: '^{209}_{84}Po', symbol: '₈₄Po' },
    { id: 'astatine', label: 'Astatine', title: 'Astatine', latex: '^{210}_{85}At', symbol: '₈₅At' },
    { id: 'radon', label: 'Radon', title: 'Radon', latex: '^{222}_{86}Rn', symbol: '₈₆Rn' },
    { id: 'francium', label: 'Francium', title: 'Francium', latex: '^{223}_{87}Fr', symbol: '₈₇Fr' },
    { id: 'radium', label: 'Radium', title: 'Radium', latex: '^{226}_{88}Ra', symbol: '₈₈Ra' },
    { id: 'actinium', label: 'Actinium', title: 'Actinium', latex: '^{227}_{89}Ac', symbol: '₈₉Ac' },
    { id: 'thorium', label: 'Thorium', title: 'Thorium', latex: '^{232}_{90}Th', symbol: '₉₀Th' },
    { id: 'protactinium', label: 'Protactinium', title: 'Protactinium', latex: '^{231}_{91}Pa', symbol: '₉₁Pa' },
    { id: 'uranium', label: 'Uranium', title: 'Uranium', latex: '^{238}_{92}U', symbol: '₉₂U' },
    { id: 'neptunium', label: 'Neptunium', title: 'Neptunium', latex: '^{237}_{93}Np', symbol: '₉₃Np' },
    { id: 'plutonium', label: 'Plutonium', title: 'Plutonium', latex: '^{244}_{94}Pu', symbol: '₉₄Pu' },
    { id: 'americium', label: 'Americium', title: 'Americium', latex: '^{243}_{95}Am', symbol: '₉₅Am' },
    { id: 'curium', label: 'Curium', title: 'Curium', latex: '^{247}_{96}Cm', symbol: '₉₆Cm' },
    { id: 'berkelium', label: 'Berkelium', title: 'Berkelium', latex: '^{247}_{97}Bk', symbol: '₉₇Bk' },
    { id: 'californium', label: 'Californium', title: 'Californium', latex: '^{251}_{98}Cf', symbol: '₉₈Cf' },
    { id: 'einsteinium', label: 'Einsteinium', title: 'Einsteinium', latex: '^{252}_{99}Es', symbol: '₉₉Es' },
    { id: 'fermium', label: 'Fermium', title: 'Fermium', latex: '^{257}_{100}Fm', symbol: '₁₀₀Fm' },
    { id: 'mendelevium', label: 'Mendelevium', title: 'Mendelevium', latex: '^{258}_{101}Md', symbol: '₁₀₁Md' },
    { id: 'nobelium', label: 'Nobelium', title: 'Nobelium', latex: '^{259}_{102}No', symbol: '₁₀₂No' },
    { id: 'lawrencium', label: 'Lawrencium', title: 'Lawrencium', latex: '^{262}_{103}Lr', symbol: '₁₀₃Lr' },
    { id: 'rutherfordium', label: 'Rutherfordium', title: 'Rutherfordium', latex: '^{267}_{104}Rf', symbol: '₁₀₄Rf' },
    { id: 'dubnium', label: 'Dubnium', title: 'Dubnium', latex: '^{270}_{105}Db', symbol: '₁₀₅Db' },
    { id: 'seaborgium', label: 'Seaborgium', title: 'Seaborgium', latex: '^{271}_{106}Sg', symbol: '₁₀₆Sg' },
    { id: 'bohrium', label: 'Bohrium', title: 'Bohrium', latex: '^{270}_{107}Bh', symbol: '₁₀₇Bh' },
    { id: 'hassium', label: 'Hassium', title: 'Hassium', latex: '^{277}_{108}Hs', symbol: '₁₀₈Hs' },
    { id: 'meitnerium', label: 'Meitnerium', title: 'Meitnerium', latex: '^{276}_{109}Mt', symbol: '₁₀₉Mt' },
    { id: 'darmstadtium', label: 'Darmstadtium', title: 'Darmstadtium', latex: '^{281}_{110}Ds', symbol: '₁₁₀Ds' },
    { id: 'roentgenium', label: 'Roentgenium', title: 'Roentgenium', latex: '^{282}_{111}Rg', symbol: '₁₁₁Rg' },
    { id: 'copernicium', label: 'Copernicium', title: 'Copernicium', latex: '^{285}_{112}Cn', symbol: '₁₁₂Cn' },
    { id: 'nihonium', label: 'Nihonium', title: 'Nihonium', latex: '^{286}_{113}Nh', symbol: '₁₁₃Nh' },
    { id: 'flerovium', label: 'Flerovium', title: 'Flerovium', latex: '^{289}_{114}Fl', symbol: '₁₁₄Fl' },
    { id: 'moscovium', label: 'Moscovium', title: 'Moscovium', latex: '^{288}_{115}Mc', symbol: '₁₁₅Mc' },
    { id: 'livermorium', label: 'Livermorium', title: 'Livermorium', latex: '^{293}_{116}Lv', symbol: '₁₁₆Lv' },
    { id: 'tennessine', label: 'Tennessine', title: 'Tennessine', latex: '^{294}_{117}Ts', symbol: '₁₁₇Ts' },
    { id: 'oganesson', label: 'Oganesson', title: 'Oganesson', latex: '^{294}_{118}Og', symbol: '₁₁₈Og' }
]*/