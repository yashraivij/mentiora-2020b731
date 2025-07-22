
export interface Question {
  id: string;
  question: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  modelAnswer: string;
  markingCriteria: {
    breakdown: string[];
  };
  specReference: string;
  calculatorGuidance?: 'calc-recommended' | 'non-calc-friendly';
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: 'chemistry-edexcel',
    name: 'Chemistry (Edexcel)',
    topics: [
      {
        id: 'key-concepts-chemistry',
        name: 'Key Concepts in Chemistry',
        questions: [
          {
            id: 'kcc-q1',
            question: 'Describe the structure of an atom according to the Dalton model. How does this differ from our modern understanding? (Foundation)',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Dalton\'s model described atoms as solid, indivisible spheres that could not be broken down further. All atoms of the same element were identical. Modern understanding shows atoms contain subatomic particles: protons and neutrons in the nucleus, with electrons orbiting around it. Atoms are mostly empty space, unlike Dalton\'s solid sphere model.',
            markingCriteria: {
              breakdown: [
                'Description of Dalton model (2 marks)',
                'Description of modern atomic structure (2 marks)',
                'Clear comparison between models (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q2',
            question: 'An atom has 17 protons, 18 neutrons and 17 electrons. What is its atomic number and mass number? Name this element. (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Atomic number = 17 (number of protons). Mass number = 35 (protons + neutrons = 17 + 18). This element is chlorine (Cl).',
            markingCriteria: {
              breakdown: [
                'Correct atomic number (1 mark)',
                'Correct mass number (1 mark)',
                'Correct element name (1 mark)',
                'Clear working shown (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q3',
            question: 'Draw dot-and-cross diagrams for sodium chloride (NaCl) formation, showing the transfer of electrons. (Higher)',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Sodium atom (2.8.1) loses its outer electron to become Na⁺ ion (2.8). Chlorine atom (2.8.7) gains this electron to become Cl⁻ ion (2.8.8). The oppositely charged ions attract electrostatically to form ionic bond. Diagram should show electron shells and electron transfer clearly.',
            markingCriteria: {
              breakdown: [
                'Correct electron configuration for Na (2 marks)',
                'Correct electron configuration for Cl (2 marks)',
                'Clear showing of electron transfer (2 marks)',
                'Correct ion charges (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q4',
            question: 'Calculate the relative formula mass (RFM) of calcium carbonate, CaCO₃. (Ca=40, C=12, O=16) (Foundation)',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'RFM of CaCO₃ = (1 × 40) + (1 × 12) + (3 × 16) = 40 + 12 + 48 = 100',
            markingCriteria: {
              breakdown: [
                'Correct identification of atoms in formula (1 mark)',
                'Correct calculation setup (1 mark)',
                'Correct final answer (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q5',
            question: 'Explain why diamond has a high melting point while methane has a low melting point, referring to their structures. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Diamond has a giant covalent structure where each carbon atom is bonded to four others by strong covalent bonds throughout the structure. Breaking the structure requires breaking many strong covalent bonds, so high energy is needed. Methane has a simple molecular structure with weak intermolecular forces between molecules. Only weak forces need to be overcome, requiring little energy.',
            markingCriteria: {
              breakdown: [
                'Description of diamond structure (2 marks)',
                'Description of methane structure (2 marks)',
                'Link between structure and properties (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q6',
            question: 'A compound contains 32.4% sodium, 22.6% sulfur and 45.1% oxygen by mass. Calculate its empirical formula. (Na=23, S=32, O=16) (Higher)',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Na: 32.4/23 = 1.41, S: 22.6/32 = 0.71, O: 45.1/16 = 2.82. Divide by smallest (0.71): Na = 2, S = 1, O = 4. Empirical formula is Na₂SO₄.',
            markingCriteria: {
              breakdown: [
                'Convert percentages to moles (2 marks)',
                'Divide by smallest number of moles (2 marks)',
                'Correct empirical formula (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q7',
            question: 'Describe the electron arrangement in atoms of the first 20 elements and explain the pattern. (Foundation)',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Electrons occupy shells around the nucleus. First shell holds maximum 2 electrons, second and third shells hold maximum 8 electrons each. Elements fill shells in order: H (1), He (2), Li (2.1), up to Ca (2.8.8.2). The pattern follows the rule that lower energy shells fill first.',
            markingCriteria: {
              breakdown: [
                'Correct shell capacities (2 marks)',
                'Examples of electron arrangements (3 marks)',
                'Explanation of filling pattern (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q8',
            question: 'Compare metallic bonding with ionic bonding, giving one example of each. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Metallic bonding involves delocalized electrons in a "sea" around metal cations, allowing electron movement (e.g., copper). Ionic bonding involves transfer of electrons from metal to non-metal, creating oppositely charged ions held by electrostatic attraction (e.g., sodium chloride). Metallic bonding allows conductivity; ionic compounds conduct only when molten/dissolved.',
            markingCriteria: {
              breakdown: [
                'Description of metallic bonding with example (3 marks)',
                'Description of ionic bonding with example (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q9',
            question: 'Calculate the number of moles in 44g of carbon dioxide, CO₂. (C=12, O=16) (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'RFM of CO₂ = 12 + (2 × 16) = 44. Number of moles = mass/RFM = 44/44 = 1 mole.',
            markingCriteria: {
              breakdown: [
                'Correct RFM calculation (2 marks)',
                'Correct moles formula (1 mark)',
                'Correct final answer (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q10',
            question: 'Explain why graphite conducts electricity but diamond does not, despite both being forms of carbon. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Both are giant covalent structures, but graphite has delocalized electrons between layers that can move freely, allowing electrical conduction. Diamond has all electrons localized in covalent bonds with no free electrons to carry charge. The layer structure in graphite allows electron mobility, while diamond\'s 3D network locks all electrons in bonds.',
            markingCriteria: {
              breakdown: [
                'Explanation of graphite structure and conduction (3 marks)',
                'Explanation of diamond structure and non-conduction (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q11',
            question: 'Calculate the percentage composition of oxygen in calcium hydroxide, Ca(OH)₂. (Ca=40, O=16, H=1) (Foundation)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'RFM of Ca(OH)₂ = 40 + 2(16+1) = 40 + 34 = 74. Mass of oxygen = 2 × 16 = 32. Percentage of oxygen = (32/74) × 100 = 43.2%',
            markingCriteria: {
              breakdown: [
                'Correct RFM calculation (2 marks)',
                'Correct mass of oxygen (1 mark)',
                'Correct percentage calculation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q12',
            question: 'Describe how the periodic table is arranged and explain the patterns in Group 1 metals. (Foundation)',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Periodic table arranged by atomic number in periods (rows) and groups (columns). Group 1 metals (Li, Na, K) have one electron in outer shell. As you go down the group: atoms get larger, reactivity increases, melting points decrease. This is because outer electron is further from nucleus so more easily lost.',
            markingCriteria: {
              breakdown: [
                'Description of periodic table arrangement (2 marks)',
                'Group 1 electron configuration (2 marks)',
                'Trends down the group (2 marks)',
                'Explanation of trends (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q13',
            question: 'Draw the structure of water (H₂O) showing covalent bonding. Explain why water molecules are polar. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Water has bent/angular shape with oxygen in center bonded to two hydrogens. Oxygen is more electronegative than hydrogen, so electrons in covalent bonds are pulled toward oxygen. This creates partial negative charge on oxygen and partial positive charges on hydrogens, making the molecule polar.',
            markingCriteria: {
              breakdown: [
                'Correct structure drawing (2 marks)',
                'Explanation of electronegativity difference (2 marks)',
                'Explanation of polar nature (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q14',
            question: 'A sample contains 2.0 moles of carbon dioxide. Calculate the mass of this sample. (C=12, O=16) (Foundation)',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'RFM of CO₂ = 12 + (2 × 16) = 44. Mass = moles × RFM = 2.0 × 44 = 88g',
            markingCriteria: {
              breakdown: [
                'Correct RFM calculation (1 mark)',
                'Correct formula use (1 mark)',
                'Correct final answer (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q15',
            question: 'Explain the difference between isotopes and give an example showing atomic structure. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Isotopes are atoms of the same element with same number of protons but different numbers of neutrons. Example: Carbon-12 has 6 protons, 6 neutrons, 6 electrons. Carbon-14 has 6 protons, 8 neutrons, 6 electrons. Same atomic number (6) but different mass numbers (12 and 14).',
            markingCriteria: {
              breakdown: [
                'Definition of isotopes (2 marks)',
                'Suitable example given (2 marks)',
                'Correct atomic structure details (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'kcc-q16',
            question: 'Compare the properties of ionic and covalent compounds. Give one example of each. (Foundation)',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Ionic compounds: high melting/boiling points, conduct when molten/dissolved, often soluble in water, brittle. Example: sodium chloride. Covalent compounds: low melting/boiling points, do not conduct electricity, often insoluble in water, soft. Example: methane. Differences due to different bonding types.',
            markingCriteria: {
              breakdown: [
                'Ionic compound properties with example (4 marks)',
                'Covalent compound properties with example (4 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      },
      {
        id: 'states-matter-mixtures',
        name: 'States of Matter and Mixtures',
        questions: [
          {
            id: 'smm-q1',
            question: 'Describe the particle arrangement and movement in solids, liquids and gases. (Foundation)',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Solids: particles closely packed in regular arrangement, vibrate about fixed positions. Liquids: particles close together but irregular arrangement, can move past each other. Gases: particles far apart with no regular arrangement, move rapidly in all directions.',
            markingCriteria: {
              breakdown: [
                'Solid particle description (2 marks)',
                'Liquid particle description (2 marks)',
                'Gas particle description (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q2',
            question: 'Explain why pure substances have sharp melting points while mixtures have melting point ranges. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Pure substances contain only one type of particle, so all particles have the same intermolecular forces and melt at the same temperature. Mixtures contain different substances with different melting points, so they melt over a range of temperatures as each component melts separately.',
            markingCriteria: {
              breakdown: [
                'Explanation for pure substances (2 marks)',
                'Explanation for mixtures (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q3',
            question: 'Describe how paper chromatography can be used to separate and identify the components in black ink. (Foundation)',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Place drop of ink on chromatography paper near bottom. Stand paper in shallow solvent. Solvent moves up paper carrying ink components at different rates. Different components travel different distances creating separate spots. Compare Rf values with known substances for identification.',
            markingCriteria: {
              breakdown: [
                'Method description (3 marks)',
                'Separation principle (2 marks)',
                'Identification process (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q4',
            question: 'Calculate the Rf value for a substance that travels 6cm when the solvent front travels 10cm. (Foundation)',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Rf = distance moved by substance / distance moved by solvent = 6/10 = 0.6',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct calculation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q5',
            question: 'Explain how fractional distillation separates crude oil into fractions. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Crude oil heated and vaporized. Vapor rises up fractionating column which is cooler at top. Different hydrocarbons have different boiling points. Those with lower boiling points reach higher up column before condensing. Fractions collected at different heights.',
            markingCriteria: {
              breakdown: [
                'Description of heating process (2 marks)',
                'Explanation of temperature gradient (2 marks)',
                'Collection of different fractions (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q6',
            question: 'Describe the process of crystallization to obtain pure salt from salt solution. (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Heat salt solution gently to evaporate water. Stop heating when crystals start to form. Allow solution to cool slowly. Filter to collect crystals. Wash crystals with distilled water and dry.',
            markingCriteria: {
              breakdown: [
                'Evaporation process (2 marks)',
                'Crystal formation and collection (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q7',
            question: 'Explain why sublimation occurs and give an example. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sublimation is when a solid changes directly to gas without melting. Occurs when intermolecular forces are weak enough that particles can escape directly from solid state when given enough energy. Example: dry ice (solid carbon dioxide) sublimes at room temperature.',
            markingCriteria: {
              breakdown: [
                'Definition of sublimation (2 marks)',
                'Suitable example with explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q8',
            question: 'Describe how to separate sand, salt and water from a mixture. (Foundation)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'First filter to separate sand (insoluble) from salt water solution. Sand remains on filter paper. Then crystallize salt solution by evaporation to separate salt from water. Heat gently until crystals form, then cool and filter to collect pure salt.',
            markingCriteria: {
              breakdown: [
                'Filtration to separate sand (2 marks)',
                'Crystallization to separate salt (2 marks)',
                'Correct order of processes (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q9',
            question: 'Explain why water purification is important in chemical analysis. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Pure water is needed as a solvent to avoid contamination of results. Impurities in water could react with test substances giving false results. Pure water has known properties (pH 7, specific boiling point) needed for accurate measurements. Impure water could interfere with chemical tests.',
            markingCriteria: {
              breakdown: [
                'Prevention of contamination (2 marks)',
                'Need for known properties (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q10',
            question: 'Compare simple distillation with fractional distillation, stating when each is used. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Simple distillation separates liquid from dissolved solid or liquids with very different boiling points. Uses single distillation. Fractional distillation separates liquids with similar boiling points using fractionating column for multiple distillations. Simple used for water from salt; fractional used for separating crude oil fractions.',
            markingCriteria: {
              breakdown: [
                'Simple distillation description and use (3 marks)',
                'Fractional distillation description and use (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      },
      {
        id: 'states-matter-mixtures',
        name: 'States of Matter and Mixtures',
        questions: [
          {
            id: 'smm-q1',
            question: 'Describe the particle arrangement and movement in solids, liquids and gases. (Foundation)',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Solids: particles closely packed in regular arrangement, vibrate about fixed positions. Liquids: particles close together but irregular arrangement, can move past each other. Gases: particles far apart with no regular arrangement, move rapidly in all directions.',
            markingCriteria: {
              breakdown: [
                'Solid particle description (2 marks)',
                'Liquid particle description (2 marks)',
                'Gas particle description (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q2',
            question: 'Explain why pure substances have sharp melting points while mixtures have melting point ranges. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Pure substances contain only one type of particle, so all particles have the same intermolecular forces and melt at the same temperature. Mixtures contain different substances with different melting points, so they melt over a range of temperatures as each component melts separately.',
            markingCriteria: {
              breakdown: [
                'Explanation for pure substances (2 marks)',
                'Explanation for mixtures (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'smm-q3',
            question: 'Describe how paper chromatography can be used to separate and identify the components in black ink. (Foundation)',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Place drop of ink on chromatography paper near bottom. Stand paper in shallow solvent. Solvent moves up paper carrying ink components at different rates. Different components travel different distances creating separate spots. Compare Rf values with known substances for identification.',
            markingCriteria: {
              breakdown: [
                'Method description (3 marks)',
                'Separation principle (2 marks)',
                'Identification process (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      },
      {
        id: 'chemical-changes',
        name: 'Chemical Changes',
        questions: [
          {
            id: 'cc-q1',
            question: 'Explain the difference between a strong acid and a concentrated acid. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Strong acid completely ionizes in water (releases all H⁺ ions), e.g., HCl. Concentrated acid has a high amount of acid dissolved in small amount of water. An acid can be strong but dilute, or weak but concentrated.',
            markingCriteria: {
              breakdown: [
                'Definition of strong acid (2 marks)',
                'Definition of concentrated acid (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q2',
            question: 'Complete the word equation: Copper oxide + Sulfuric acid → ? + ? (Foundation)',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Copper oxide + Sulfuric acid → Copper sulfate + Water',
            markingCriteria: {
              breakdown: [
                'Correct salt name (1 mark)',
                'Water identified (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q3',
            question: 'During electrolysis of copper sulfate solution using copper electrodes, explain what happens at each electrode. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'At cathode (negative): Cu²⁺ + 2e⁻ → Cu (copper deposited). At anode (positive): Cu → Cu²⁺ + 2e⁻ (copper dissolves). Overall effect: copper transfers from anode to cathode, purifying the copper.',
            markingCriteria: {
              breakdown: [
                'Cathode reaction (2 marks)',
                'Anode reaction (2 marks)',
                'Overall process explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q4',
            question: 'Write the balanced equation for the neutralization of hydrochloric acid with sodium hydroxide. (Foundation)',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'HCl + NaOH → NaCl + H₂O',
            markingCriteria: {
              breakdown: [
                'Correct reactants (1 mark)',
                'Correct products (1 mark)',
                'Balanced equation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q5',
            question: 'Describe the test for hydrogen gas and explain the result. (Foundation)',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Hold lit splint near gas sample. Hydrogen burns with a \'pop\' sound. This happens because hydrogen burns rapidly in oxygen from air.',
            markingCriteria: {
              breakdown: [
                'Correct test method (1 mark)',
                'Correct result described (1 mark)',
                'Explanation of reaction (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q6',
            question: 'Explain how pH changes when an acid is gradually added to an alkali. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Initially pH is high (alkali). As acid is added, pH gradually decreases. At neutralization point, pH = 7. Further acid addition causes pH to drop below 7 (acidic). The change is gradual then rapid around pH 7.',
            markingCriteria: {
              breakdown: [
                'Initial high pH (1 mark)',
                'Gradual decrease (1 mark)',
                'Neutralization at pH 7 (1 mark)',
                'Further decrease below 7 (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q7',
            question: 'Define oxidation and reduction in terms of electron transfer. Give an example. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Oxidation is loss of electrons. Reduction is gain of electrons. Example: Mg + CuSO₄ → MgSO₄ + Cu. Magnesium loses electrons (oxidized), copper ions gain electrons (reduced). Remember: OIL RIG (Oxidation Is Loss, Reduction Is Gain).',
            markingCriteria: {
              breakdown: [
                'Definition of oxidation (2 marks)',
                'Definition of reduction (2 marks)',
                'Suitable example with explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q8',
            question: 'Describe how to prepare copper sulfate crystals from copper oxide and sulfuric acid. (Foundation)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Add excess copper oxide to warm sulfuric acid. Stir until no more dissolves. Filter to remove excess copper oxide. Heat filtrate gently to concentrate. Cool slowly to form crystals. Filter and dry crystals.',
            markingCriteria: {
              breakdown: [
                'Neutralization reaction (2 marks)',
                'Filtration of excess (2 marks)',
                'Crystallization process (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q9',
            question: 'Explain why during electrolysis, cations move to the cathode and anions move to the anode. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Cations are positively charged ions. Cathode is negative electrode. Opposite charges attract, so cations move to cathode. Anions are negatively charged ions. Anode is positive electrode. Opposite charges attract, so anions move to anode.',
            markingCriteria: {
              breakdown: [
                'Cation movement explanation (2 marks)',
                'Anion movement explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'cc-q10',
            question: 'Describe the test for carbon dioxide gas and explain why this result occurs. (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Bubble gas through limewater (calcium hydroxide solution). Limewater turns milky/cloudy. This happens because CO₂ reacts with calcium hydroxide to form insoluble calcium carbonate: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O',
            markingCriteria: {
              breakdown: [
                'Correct test method (1 mark)',
                'Correct result (1 mark)',
                'Chemical explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      },
      {
        id: 'extracting-metals-equilibria',
        name: 'Extracting Metals and Equilibria',
        questions: [
          {
            id: 'eme-q1',
            question: 'Place these metals in order of reactivity: copper, zinc, iron, magnesium. Explain your reasoning. (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Order (most to least reactive): Magnesium, zinc, iron, copper. This is based on their reactions with water, acids, and displacement reactions. More reactive metals displace less reactive ones from their compounds.',
            markingCriteria: {
              breakdown: [
                'Correct order (2 marks)',
                'Explanation of reactivity series (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q2',
            question: 'Explain why aluminum is extracted by electrolysis rather than heating with carbon. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Aluminum is more reactive than carbon, so carbon cannot reduce aluminum oxide. Aluminum oxide has very strong ionic bonds requiring high energy to break. Electrolysis provides enough energy to decompose aluminum oxide into aluminum and oxygen.',
            markingCriteria: {
              breakdown: [
                'Reactivity comparison (2 marks)',
                'Energy requirements explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q3',
            question: 'In the Haber process, explain how increasing pressure affects the equilibrium position and why. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'N₂ + 3H₂ ⇌ 2NH₃. Left side has 4 gas molecules, right side has 2. Increasing pressure favors the side with fewer gas molecules (Le Chatelier\'s principle). Equilibrium shifts right, producing more ammonia. This maximizes efficiency of ammonia production.',
            markingCriteria: {
              breakdown: [
                'Identification of molecule numbers (2 marks)',
                'Application of Le Chatelier\'s principle (2 marks)',
                'Effect on ammonia production (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q4',
            question: 'Write a word equation for the extraction of iron from iron oxide using carbon. (Foundation)',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Iron oxide + Carbon → Iron + Carbon dioxide',
            markingCriteria: {
              breakdown: [
                'Correct reactants (1 mark)',
                'Correct products (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q5',
            question: 'Explain why recycling metals is important for the environment and economy. (Foundation)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Environmental: Reduces mining damage, saves energy (recycling uses less energy than extraction), reduces waste in landfills. Economic: Cheaper than extracting from ores, creates jobs in recycling industry, conserves finite metal ores for future generations.',
            markingCriteria: {
              breakdown: [
                'Environmental benefits (3 marks)',
                'Economic benefits (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q6',
            question: 'Describe what happens in a displacement reaction between zinc and copper sulfate solution. (Foundation)',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Zinc is more reactive than copper. Zinc displaces copper from copper sulfate. Blue solution turns colorless. Brown copper metal forms. Word equation: Zinc + Copper sulfate → Zinc sulfate + Copper',
            markingCriteria: {
              breakdown: [
                'Reactivity explanation (1 mark)',
                'Observations (2 marks)',
                'Word equation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q7',
            question: 'Explain how increasing temperature affects the Haber process equilibrium and industrial conditions. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Forward reaction is exothermic (releases heat). Increasing temperature favors endothermic direction (backward reaction). This reduces ammonia yield. However, higher temperature increases reaction rate. Industry uses compromise temperature (450°C) to balance yield and rate.',
            markingCriteria: {
              breakdown: [
                'Identification of exothermic reaction (2 marks)',
                'Effect on equilibrium position (2 marks)',
                'Industrial compromise explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q8',
            question: 'Compare biological methods of metal extraction with traditional methods. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Biological methods: Use bacteria or plants, environmentally friendly, low energy, slow process. Traditional methods: High temperature furnaces, faster, high energy consumption, pollution. Phytoextraction uses plants; bioleaching uses bacteria. Biological methods better for low-grade ores.',
            markingCriteria: {
              breakdown: [
                'Biological methods description (3 marks)',
                'Traditional methods comparison (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q9',
            question: 'Describe what dynamic equilibrium means in a reversible reaction. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Dynamic equilibrium means forward and backward reactions occur at equal rates. Concentrations of reactants and products remain constant. Reactions continue but no overall change is observed. System appears static but is actually dynamic.',
            markingCriteria: {
              breakdown: [
                'Equal reaction rates (2 marks)',
                'Constant concentrations (1 mark)',
                'Continuing reactions (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'eme-q10',
            question: 'Explain the importance of iron as a catalyst in the Haber process. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Iron provides alternative reaction pathway with lower activation energy. Speeds up both forward and backward reactions equally. Does not affect equilibrium position, only rate of reaching equilibrium. Allows industrial process to be economically viable.',
            markingCriteria: {
              breakdown: [
                'Lower activation energy (2 marks)',
                'Effect on reaction rate (1 mark)',
                'No effect on equilibrium position (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      },
      {
        id: 'separate-chemistry-higher',
        name: 'Separate Chemistry 1 (Higher Tier Only)',
        questions: [
          {
            id: 'sch-q1',
            question: 'Explain why transition metals make good catalysts, giving one example. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Transition metals can form multiple oxidation states, allowing them to provide alternative reaction pathways with lower activation energy. They can form temporary bonds with reactants. Example: Iron in Haber process catalyzes formation of ammonia.',
            markingCriteria: {
              breakdown: [
                'Explanation of catalytic properties (2 marks)',
                'Suitable example with context (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q2',
            question: 'Calculate the atom economy for producing ammonia in the Haber process: N₂ + 3H₂ → 2NH₃ (N=14, H=1) (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'RFM of reactants: N₂ = 28, 3H₂ = 6, total = 34. RFM of desired product: 2NH₃ = 2(14+3) = 34. Atom economy = (34/34) × 100 = 100%',
            markingCriteria: {
              breakdown: [
                'Correct RFM calculations (2 marks)',
                'Correct atom economy formula application (1 mark)',
                'Correct final answer (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q3',
            question: 'A fuel cell uses hydrogen and oxygen. Write the half equations and overall equation for this reaction. (Higher)',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'At anode: H₂ → 2H⁺ + 2e⁻. At cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O. Overall: 2H₂ + O₂ → 2H₂O. Electrons flow from anode to cathode through external circuit.',
            markingCriteria: {
              breakdown: [
                'Correct anode half equation (2 marks)',
                'Correct cathode half equation (2 marks)',
                'Correct overall equation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q4',
            question: 'Calculate the percentage yield if 50g of product is obtained when 80g was theoretically possible. (Higher)',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Percentage yield = (actual yield / theoretical yield) × 100 = (50/80) × 100 = 62.5%',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct final answer (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q5',
            question: 'Describe the properties of transition metals that make them useful in industry. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'High melting and boiling points make them suitable for high-temperature processes. Form colored compounds useful in paints and ceramics. Good catalysts due to variable oxidation states. High density makes them suitable for construction. Malleable and ductile for shaping.',
            markingCriteria: {
              breakdown: [
                'Physical properties (3 marks)',
                'Chemical properties (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q6',
            question: 'Explain how electroplating works and why it is used. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Object to be plated is cathode, coating metal is anode. Electric current passes through electrolyte solution of coating metal ions. Metal ions move to cathode and deposit as thin layer. Used to prevent corrosion, improve appearance, or add specific properties.',
            markingCriteria: {
              breakdown: [
                'Process description (3 marks)',
                'Uses and benefits (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q7',
            question: 'Calculate the volume of hydrogen gas produced at r.t.p. when 2 moles of HCl react with excess magnesium. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Mg + 2HCl → MgCl₂ + H₂. 2 moles HCl produce 1 mole H₂. At r.t.p., 1 mole of gas = 24 dm³. Volume = 1 × 24 = 24 dm³',
            markingCriteria: {
              breakdown: [
                'Balanced equation (1 mark)',
                'Mole ratio calculation (2 marks)',
                'Volume calculation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q8',
            question: 'Compare the advantages and disadvantages of hydrogen fuel cells. (Higher)',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Advantages: Only product is water (clean), high efficiency, renewable if hydrogen from electrolysis, quiet operation. Disadvantages: Hydrogen storage problems, expensive to produce, infrastructure not developed, potential safety issues with hydrogen gas.',
            markingCriteria: {
              breakdown: [
                'Advantages listed and explained (3 marks)',
                'Disadvantages listed and explained (3 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q9',
            question: 'Explain why sacrificial protection works to prevent rusting of iron. (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'More reactive metal (like zinc) is attached to iron. The more reactive metal is oxidized instead of iron. Zinc loses electrons more easily than iron. Iron is protected because it does not lose electrons while zinc is present.',
            markingCriteria: {
              breakdown: [
                'More reactive metal concept (2 marks)',
                'Electron transfer explanation (2 marks)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          },
          {
            id: 'sch-q10',
            question: 'Calculate the concentration in mol/dm³ of a solution containing 20g of NaOH in 500cm³ of solution. (Na=23, O=16, H=1) (Higher)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'RFM of NaOH = 23 + 16 + 1 = 40. Moles = 20/40 = 0.5. Volume = 500/1000 = 0.5 dm³. Concentration = 0.5/0.5 = 1.0 mol/dm³',
            markingCriteria: {
              breakdown: [
                'Correct moles calculation (2 marks)',
                'Volume conversion (1 mark)',
                'Concentration calculation (1 mark)'
              ]
            },
            specReference: 'Edexcel Chemistry Paper 1'
          }
        ]
      }
    ]
  },
  {
    id: 'english-language',
    name: 'English Language',
    topics: [
      {
        id: 'textual-variations-representations',
        name: 'Textual Variations and Representations',
        questions: [
          {
            id: 'tvr-q1',
            question: 'What is meant by the term "graphology" in language analysis?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Graphology refers to the visual aspects of language, including typography, layout, font choices, spacing, colour, and other design elements that contribute to meaning in written texts.',
            markingCriteria: {
              breakdown: [
                'Clear definition of graphology (1 mark)',
                'Reference to visual elements or design features (1 mark)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q2',
            question: 'Identify two features that distinguish formal written language from informal spoken language.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Formal written language typically uses complete sentences and standard grammar, while informal spoken language often includes incomplete sentences and non-standard constructions. Formal written language employs precise vocabulary and technical terms, whereas informal spoken language uses colloquialisms and contractions.',
            markingCriteria: {
              breakdown: [
                'First feature correctly identified and explained (2 marks)',
                'Second feature correctly identified and explained (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q3',
            question: 'Explain how context affects language choices in different social situations.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Context significantly influences language choices through factors like audience, purpose, and setting. In formal contexts like job interviews, speakers use standard English, avoid slang, and employ respectful titles. In informal contexts with friends, speakers use casual vocabulary, contractions, and may include regional dialect features. The relationship between participants also affects register - equal relationships allow informal language while hierarchical relationships often require more formal approaches.',
            markingCriteria: {
              breakdown: [
                'Explanation of context factors (2 marks)',
                'Example of formal context language choices (2 marks)',
                'Example of informal context language choices (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q4',
            question: 'Analyse how personal pronouns create different effects in texts.\n\nText A: "One must consider the implications carefully."\nText B: "You need to think about what this means for you."',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Text A uses the formal pronoun "one" which creates distance and objectivity, suggesting academic or official discourse. This impersonal approach implies universal applicability but may seem detached. Text B uses direct address with "you" which creates intimacy and personal connection, making the reader feel directly involved. The repetition of "you" emphasizes personal responsibility and creates a conversational, engaging tone that draws the reader in.',
            markingCriteria: {
              breakdown: [
                'Analysis of "one" and its effects (2 marks)',
                'Analysis of "you" and its effects (2 marks)',
                'Comparison of different effects created (2 marks)',
                'Reference to tone and audience relationship (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q5',
            question: 'How do different text types use language to achieve their purposes? Compare a news report and an advertisement.',
            marks: 10,
            difficulty: 'medium',
            modelAnswer: 'News reports use objective language with third-person narration and factual statements to inform readers. They employ formal register, passive voice for objectivity, and temporal markers to establish credibility. Headlines use brief, attention-grabbing language. Advertisements use persuasive language with emotive adjectives, imperatives, and direct address to influence consumer behaviour. They employ rhetorical questions, superlatives, and branded language to create desire and encourage action. Both adapt their language to achieve their distinct purposes.',
            markingCriteria: {
              breakdown: [
                'Analysis of news report language features (3 marks)',
                'Analysis of advertisement language features (3 marks)',
                'Explanation of how features achieve purposes (2 marks)',
                'Comparison between the text types (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q6',
            question: 'Analyse how the following sentence creates meaning through word choice:\n\n"The magnificent Victorian mansion dominated the quaint village street."',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The adjective "magnificent" creates positive connotations of grandeur and beauty, elevating the status of the building. "Victorian" provides historical context and suggests traditional architectural values. "Mansion" implies wealth and high social status compared to a simple "house." The verb "dominated" suggests power and control, indicating the building\'s imposing presence. "Quaint" creates contrast by presenting the village as charming but small-scale, emphasizing the mansion\'s prominence through juxtaposition.',
            markingCriteria: {
              breakdown: [
                'Analysis of adjectives and their connotations (2 marks)',
                'Analysis of verb choice and effect (2 marks)',
                'Discussion of contrast and juxtaposition (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q7',
            question: 'Explain how dialect and accent differ, and discuss why both are important in representing identity.',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Dialect refers to vocabulary, grammar, and language structure variations in different regions or social groups, while accent refers to pronunciation patterns. Dialect includes different words for the same concept and varied sentence structures. Both represent cultural identity and social belonging, connecting speakers to their communities and backgrounds. They can indicate education level, social class, and regional origin, though this can lead to linguistic prejudice. Understanding both helps recognize the rich diversity of English and challenges prescriptivist attitudes about "correct" language.',
            markingCriteria: {
              breakdown: [
                'Clear distinction between dialect and accent (2 marks)',
                'Examples of dialect features (2 marks)',
                'Discussion of identity representation (2 marks)',
                'Reference to social attitudes or prejudice (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q8',
            question: 'How does technology influence modern language use? Discuss three specific changes.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Technology has introduced abbreviations and acronyms like "LOL" and "ASAP" to speed communication, creating new lexical items that cross into spoken language. Emoji and symbols now supplement or replace words, adding emotional context and creating visual meaning systems. Character limits on platforms like Twitter have led to compression techniques, removing articles and using unconventional spelling. These changes reflect efficiency needs and new social communication contexts, though they sometimes create generational divides in language understanding.',
            markingCriteria: {
              breakdown: [
                'First technological influence explained (3 marks)',
                'Second technological influence explained (3 marks)',
                'Third technological influence explained (3 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q9',
            question: 'Analyse how power relationships are shown through language choices in this workplace exchange:\n\nManager: "I need you to complete this by Friday."\nEmployee: "Would it be possible to have until Monday? I\'ve got several other priorities."',
            marks: 10,
            difficulty: 'hard',
            modelAnswer: 'The manager uses direct language with the declarative "I need" and imperative structure, asserting authority through confident, unqualified statements. The specific deadline shows control over timing and expectations. The employee uses tentative language with "Would it be possible" - a polite interrogative that acknowledges the manager\'s power to grant or refuse. The explanation "I\'ve got several other priorities" justifies the request professionally while showing respect for hierarchy. The contrast demonstrates how power dynamics shape linguistic choices in professional contexts.',
            markingCriteria: {
              breakdown: [
                'Analysis of manager\'s authoritative language (3 marks)',
                'Analysis of employee\'s deferential language (3 marks)',
                'Discussion of power dynamics shown (2 marks)',
                'Reference to professional context (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q11',
            question: 'Compare how these two texts use punctuation to create different effects:\n\nText A: "The results were clear. Undeniable. Final."\nText B: "The results were clear, undeniable, and final."',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Text A uses short sentences and full stops to create dramatic pauses and emphasis, building tension through fragmented delivery. Each word gains weight through isolation. Text B uses commas in a list structure, creating smooth flow and matter-of-fact presentation. The coordinating conjunction "and" provides closure and completeness, making the statement feel more measured and less dramatic than Text A\'s staccato effect.',
            markingCriteria: {
              breakdown: [
                'Analysis of punctuation in Text A (3 marks)',
                'Analysis of punctuation in Text B (3 marks)',
                'Comparison of different effects (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'tvr-q12',
            question: 'Analyse how the following text creates meaning through its structure and organization:\n\n"First, consider the evidence. Then, examine the implications. Finally, reach your conclusion. This systematic approach ensures thorough analysis."',
            marks: 10,
            difficulty: 'hard',
            modelAnswer: 'The text uses temporal sequencing with "First," "Then," and "Finally" to create logical progression and guide reader thinking. The parallel structure of imperative verbs ("consider," "examine," "reach") establishes authority and clear instruction. The final sentence provides meta-commentary, explicitly stating the purpose and benefits of the structure. This creates a sense of expertise and reliability, positioning the writer as knowledgeable and the method as trustworthy.',
            markingCriteria: {
              breakdown: [
                'Analysis of temporal sequencing and connectives (3 marks)',
                'Discussion of parallel structure and imperatives (3 marks)',
                'Analysis of meta-commentary function (2 marks)',
                'Overall effect on reader and writer authority (2 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          }
        ]
      },
      {
        id: 'childrens-language-development',
        name: 'Children\'s Language Development',
        questions: [
          {
            id: 'cld-q1',
            question: 'Analyse this transcript of a 2-year-old child talking about their toys. What does it reveal about their phonological development?\n\nTranscript:\nChild: "Me got tuck! Big tuck go vroom! Teddy in ca... ca sit here."\nCaregiver: "You\'ve got a truck! A big truck goes vroom! Teddy is in the car... the car sits here."\nChild: "Tuck go up! Up, up! Teddy faw down."\nCaregiver: "The truck goes up! Up, up! Teddy fell down."',
            marks: 30,
            difficulty: 'medium',
            modelAnswer: 'The transcript shows typical phonological processes including cluster reduction where "truck" becomes "tuck" and final consonant deletion where "car" becomes "ca." The child demonstrates difficulty with consonant clusters and shows systematic sound substitutions. The child successfully produces initial consonants but struggles with final sounds, indicating normal developmental patterns where certain sounds are mastered before others.',
            markingCriteria: {
              breakdown: [
                'Identification of phonological features (6-8 marks)',
                'Reference to developmental theories (6-8 marks)',
                'Analysis of patterns (6-8 marks)',
                'Application to transcript (6-8 marks)',
                'Technical accuracy (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q2',
            question: 'Using the transcript provided, analyse how this 18-month-old child is developing their understanding of grammar.\n\nTranscript:\nChild: "Daddy go"\nCaregiver: "Yes, daddy is going to work"\nChild: "My teddy"\nCaregiver: "That\'s your teddy bear"\nChild: "Want milk"\nCaregiver: "You want some milk?"\nChild: "More book"\nCaregiver: "You want more books to read?"',
            marks: 30,
            difficulty: 'medium',
            modelAnswer: 'The child shows telegraphic speech with two-word combinations following basic word order patterns. They demonstrate understanding of semantic relations like agent-action ("daddy go"), possession ("my teddy"), and desire ("want milk"). The child uses appropriate word order and shows emerging grammar without function words, reflecting normal developmental stages described in acquisition theories.',
            markingCriteria: {
              breakdown: [
                'Analysis of grammatical features (6-8 marks)',
                'Reference to language acquisition theories (6-8 marks)',
                'Discussion of semantic development (6-8 marks)',
                'Use of transcript evidence (6-8 marks)',
                'Quality of expression (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q3',
            question: 'Analyse how caregivers\' speech patterns in this transcript support the child\'s language development.\n\nTranscript:\nChild: "Ball gone"\nCaregiver: "Oh no! The ball has gone! Where has the ball gone?"\nChild: "Under"\nCaregiver: "Yes, it\'s under the table. The red ball is under the big table."\nChild: "Get ball"\nCaregiver: "You want to get the ball? Let\'s get the ball together!"',
            marks: 30,
            difficulty: 'medium',
            modelAnswer: 'The caregiver uses child-directed speech with expansions ("Ball gone" → "The ball has gone"), questions to encourage response, and positive reinforcement. They provide semantic and syntactic expansions, adding descriptive words ("red ball", "big table") and demonstrating correct grammar while maintaining the child\'s meaning. This supports language development through scaffolding and modelling.',
            markingCriteria: {
              breakdown: [
                'Analysis of caregiver speech features (6-8 marks)',
                'Reference to support theories (6-8 marks)',
                'Discussion of interaction patterns (6-8 marks)',
                'Evidence from transcript (6-8 marks)',
                'Critical evaluation (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q4',
            question: 'Analyse how this 5-year-old child uses different sentence structures in their storytelling.\n\nExtract from child\'s story:\n"My cat is black and white. She likes to play with her ball. Yesterday she ran up the tree and got stuck. Dad had to get a ladder to help her down. She was very frightened but then she was okay. Now she stays away from tall trees."',
            marks: 30,
            difficulty: 'medium',
            modelAnswer: 'The child demonstrates sophisticated sentence structures including complex sentences with subordinate clauses ("She was very frightened but then she was okay"). They use temporal markers ("Yesterday", "Now") showing understanding of narrative sequencing. The child employs past tense consistently and uses varied sentence lengths, indicating advanced syntactic development for their age.',
            markingCriteria: {
              breakdown: [
                'Analysis of spelling strategies (6-8 marks)',
                'Reference to developmental stages (6-8 marks)',
                'Discussion of phonological awareness (6-8 marks)',
                'Use of writing sample evidence (6-8 marks)',
                'Theoretical understanding (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q5',
            question: 'Analyse how this 3-year-old uses language for different functions in the playground transcript.\n\nTranscript:\nChild: "Stop that! My turn now!"\nOther child: "No, I was here first"\nChild: "We can share. You have it, then me have it."\nChild: "Look! Big slide is scary. I go down little slide."\nChild: "Mummy, watch me! I\'m going fast!"',
            marks: 30,
            difficulty: 'medium',
            modelAnswer: 'The child demonstrates multiple language functions: regulatory ("Stop that! My turn now!"), interactional ("We can share"), representational ("Big slide is scary"), and personal ("I go down little slide"). They use language to control situations, negotiate social relationships, describe their environment, and express personal feelings, showing sophisticated pragmatic awareness.',
            markingCriteria: {
              breakdown: [
                'Identification of language functions (6-8 marks)',
                'Reference to Halliday\'s functions (6-8 marks)',
                'Analysis of pragmatic development (6-8 marks)',
                'Evidence from transcript (6-8 marks)',
                'Contextual understanding (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q6',
            question: 'Discuss the role of interaction in children\'s early vocabulary development, referring to relevant theories.',
            marks: 30,
            difficulty: 'hard',
            modelAnswer: 'Social interaction is crucial for vocabulary acquisition through joint attention, labelling activities, and contextual learning. Vygotsky emphasises social construction of knowledge while Bruner\'s LASS theory shows how caregivers facilitate language learning through structured interactions and scaffolding.',
            markingCriteria: {
              breakdown: [
                'Discussion of interaction importance (6-8 marks)',
                'Reference to relevant theories (6-8 marks)',
                'Analysis of learning mechanisms (6-8 marks)',
                'Examples and evidence (6-8 marks)',
                'Critical evaluation (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q7',
            question: 'Analyse how nature versus nurture influences are evident in this transcript of siblings learning language.\n\nTranscript:\nChild A (3 years): "I goed to shops with mummy"\nChild B (5 years): "You mean you went to the shops"\nChild A: "No, I goed! I goed yesterday!"\nParent: "Yes, you went yesterday. You both went to different shops."\nChild B: "I went to the big shop and bought sweets"\nChild A: "I want to go to big shop too"',
            marks: 30,
            difficulty: 'hard',
            modelAnswer: 'The transcript shows universal patterns supporting nativist theories: both children apply regular past tense rules ("goed"), suggesting innate grammar acquisition. However, environmental factors are evident in the older child\'s correction and parental modelling. The interaction demonstrates both innate capacity (systematic error patterns) and learned behaviours (correction, imitation) contributing to acquisition.',
            markingCriteria: {
              breakdown: [
                'Analysis of innate factors (6-8 marks)',
                'Analysis of environmental factors (6-8 marks)',
                'Reference to key theories (6-8 marks)',
                'Use of transcript evidence (6-8 marks)',
                'Balanced evaluation (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q8',
            question: 'Analyse how a 4-year-old child typically develops their narrative skills. What features would you expect to see in their storytelling?',
            marks: 30,
            difficulty: 'hard',
            modelAnswer: 'The child demonstrates emerging story structure with beginning, middle, and end, though may show non-linear sequencing. They use past tense markers and temporal connectives. The narrative shows developing theory of mind as they consider character motivations and audience needs.',
            markingCriteria: {
              breakdown: [
                'Analysis of narrative structure (6-8 marks)',
                'Discussion of linguistic features (6-8 marks)',
                'Reference to cognitive development (6-8 marks)',
                'Evidence from transcript (6-8 marks)',
                'Sophisticated analysis (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q9',
            question: 'Analyse how bilingual language development is evident in this transcript of a child switching between languages.\n\nTranscript:\nChild (to English-speaking friend): "Let\'s play with the cars!"\nChild (to Spanish-speaking grandmother): "Abuela, mira los coches!" (Grandmother, look at the cars!)\nChild (to friend): "My abuela says the red car is muy bonito... very pretty"\nGrandmother: "¿Cuál te gusta más?" (Which one do you like more?)\nChild: "Me gusta el azul porque es fast... rápido!"',
            marks: 30,
            difficulty: 'hard',
            modelAnswer: 'The transcript demonstrates sophisticated code-switching as the child appropriately chooses languages for different interlocutors. They show metalinguistic awareness by translating for monolingual speakers and using both languages strategically. The mixing ("muy bonito... very pretty") indicates balanced bilingual development rather than confusion, supporting additive bilingualism theories.',
            markingCriteria: {
              breakdown: [
                'Analysis of code-switching patterns (6-8 marks)',
                'Discussion of bilingual development (6-8 marks)',
                'Reference to bilingual theories (6-8 marks)',
                'Use of transcript evidence (6-8 marks)',
                'Cultural sensitivity (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          },
          {
            id: 'cld-q10',
            question: 'Evaluate the claim that children\'s language development follows predictable stages, using transcript evidence.\n\nTranscript (24-month-old):\n"Daddy car go work. Mummy stay home. Me want juice now. No bed! Me no tired. Big dog scary but teddy nice. Where daddy go?"',
            marks: 30,
            difficulty: 'hard',
            modelAnswer: 'The transcript shows typical two-word plus stage features: telegraphic speech, missing function words, and basic word order. However, it also shows individual variation in complexity and some three-word combinations earlier than expected. This supports stage theories while highlighting individual differences in timing and progression, suggesting broad developmental patterns with personal variation.',
            markingCriteria: {
              breakdown: [
                'Evaluation of stage theories (6-8 marks)',
                'Discussion of individual variation (6-8 marks)',
                'Reference to research evidence (6-8 marks)',
                'Analysis of transcript data (6-8 marks)',
                'Justified conclusion (3-4 marks)'
              ]
            },
            specReference: 'AQA English Language 8700 Paper 1'
          }
        ]
      }
    ]
  },
  {
    id: 'religious-studies',
    name: 'Religious Studies',
    topics: [
      {
        id: 'buddhism',
        name: 'Buddhism',
        questions: [
          {
            id: 'buddhism-q1',
            question: 'Give one example of the Four Noble Truths.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'The First Noble Truth is Dukkha (suffering exists) or The Second Noble Truth is Samudaya (craving is the cause of suffering) or The Third Noble Truth is Nirodha (suffering can end) or The Fourth Noble Truth is Magga (the Eightfold Path leads to the end of suffering).',
            markingCriteria: {
              breakdown: ['Correct identification of any one of the Four Noble Truths (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q2',
            question: 'Give two Buddhist beliefs about karma.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Karma is the law of cause and effect from actions. Good actions lead to good consequences and bad actions lead to bad consequences.',
            markingCriteria: {
              breakdown: ['One correct belief about karma (1 mark)', 'Second correct belief about karma (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q3',
            question: 'Outline three features of Buddhist meditation.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Mindfulness meditation focuses on being aware of the present moment. Loving-kindness meditation develops compassion for all beings. Concentration meditation develops mental focus and calm.',
            markingCriteria: {
              breakdown: ['One feature correctly outlined (1 mark)', 'Second feature correctly outlined (1 mark)', 'Third feature correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q4',
            question: 'Explain two ways Buddhists might practice the Eightfold Path.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Right Speech involves speaking truthfully and avoiding harmful words. Buddhists practice this by not lying, gossiping or using harsh language. Right Livelihood means earning money in ethical ways. Buddhists avoid jobs that harm others like selling weapons or alcohol.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q5',
            question: 'Explain two Buddhist teachings about the nature of existence.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'The Three Marks of Existence teach that all life involves suffering (dukkha), everything is impermanent (anicca), and there is no fixed self (anatta). These teachings help Buddhists understand reality and work towards enlightenment. The concept of dependent origination shows that everything arises due to causes and conditions.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q6',
            question: 'How might Buddhist festivals influence the life of a Buddhist?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Vesak celebrates the birth, enlightenment and death of Buddha, reminding Buddhists of his teachings. During Vesak, Buddhists might visit temples, make offerings and practice extra meditation, strengthening their faith and commitment to the Buddhist path.',
            markingCriteria: {
              breakdown: ['Identification of festival and its significance (2 marks)', 'Explanation of influence on Buddhist life (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q7',
            question: 'What are the different views about whether Buddhists should be vegetarian?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Some Buddhists believe vegetarianism follows the First Precept not to harm living beings. However, others argue Buddha allowed meat eating if the animal was not killed specifically for you. Theravada Buddhists may be less strict while many Mahayana Buddhists practice vegetarianism.',
            markingCriteria: {
              breakdown: ['One viewpoint explained (2 marks)', 'Contrasting viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q8',
            question: 'Explain two ways Buddhist teachings might influence someone\'s attitude to wealth.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'The teaching on attachment suggests that craving for wealth causes suffering. This might lead Buddhists to live simply and not pursue excessive material possessions. The Middle Way teaches avoiding extremes of luxury and poverty. This could encourage Buddhists to have enough for their needs but share excess wealth through dana (generosity).',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to teachings (2-3 marks)', 'Second influence clearly explained with reference to teachings (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q9',
            question: 'How do Buddhist scriptures guide the lives of Buddhists today?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The Tripitaka contains the Buddha\'s teachings which provide guidance on ethics, meditation and wisdom. The Vinaya rules guide monastic communities in their daily conduct. The Suttas contain teachings that help lay Buddhists understand how to live according to Buddhist principles in modern society.',
            markingCriteria: {
              breakdown: ['Reference to Buddhist scriptures (1-2 marks)', 'Explanation of guidance provided (2-3 marks)', 'Application to modern Buddhist life (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'buddhism-q10',
            question: 'How far do you agree that meditation is the most important Buddhist practice? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Meditation is central to Buddhism as it leads to enlightenment and understanding of Buddhist truths. However, following the Five Precepts and practicing generosity are also essential for ethical living. Some might argue the Eightfold Path as a whole is most important as it includes meditation alongside other practices.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Buddhist teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'christianity',
        name: 'Christianity',
        questions: [
          {
            id: 'christianity-q1',
            question: 'Give one example of Christian worship.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Prayer or Mass/Eucharist or Singing hymns or Bible reading.',
            markingCriteria: {
              breakdown: ['Correct example of Christian worship (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q2',
            question: 'Give two Christian beliefs about Jesus.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Jesus is the Son of God. Jesus died to save humanity from sin.',
            markingCriteria: {
              breakdown: ['One correct belief about Jesus (1 mark)', 'Second correct belief about Jesus (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q3',
            question: 'Outline three Christian beliefs about the Trinity.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'God the Father is the creator of the universe. God the Son is Jesus Christ who became human. God the Holy Spirit is God\'s presence in the world today.',
            markingCriteria: {
              breakdown: ['One belief about Trinity correctly outlined (1 mark)', 'Second belief correctly outlined (1 mark)', 'Third belief correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q4',
            question: 'Explain two ways Christians might celebrate Easter.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Christians attend special church services on Easter Sunday to celebrate Jesus\' resurrection. Many churches hold sunrise services to remember that Jesus rose early in the morning. Christians also share Easter meals with family to celebrate new life in Christ.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q5',
            question: 'Explain two Christian teachings about salvation.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Christians believe salvation comes through faith in Jesus Christ who died for human sins. This is God\'s grace freely given, not earned through good works. Christians also believe salvation leads to eternal life with God after death, giving hope and purpose to believers.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q6',
            question: 'How might the Bible influence a Christian\'s daily life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Christians read the Bible daily for guidance and spiritual growth. The Ten Commandments provide moral rules for living. Jesus\' teachings in the Gospels give examples of how to love God and neighbor in practical ways.',
            markingCriteria: {
              breakdown: ['Reference to biblical influence (1-2 marks)', 'Specific examples of daily impact (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q7',
            question: 'What are different Christian views about the role of women in the church?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Some Christians believe women should have equal roles including ordination as priests based on Galatians 3:28 teaching equality. However, other Christians believe biblical passages like 1 Timothy 2:12 restrict women from teaching men, so they cannot be ordained as priests.',
            markingCriteria: {
              breakdown: ['One viewpoint explained with reference (2 marks)', 'Contrasting viewpoint explained with reference (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q8',
            question: 'Explain two ways Christian beliefs about stewardship might influence attitudes to the environment.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'The belief that God created the world and gave humans responsibility to care for it leads Christians to protect the environment through recycling and conservation. The belief that Earth belongs to God, not humans, might influence Christians to live sustainably and avoid exploitation of natural resources.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to stewardship (2-3 marks)', 'Second influence clearly explained with reference to stewardship (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q9',
            question: 'How do different Christian denominations approach worship differently?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Catholic worship is highly liturgical with set prayers and rituals centered on the Mass. Protestant worship varies but often emphasizes Bible preaching and personal prayer. Orthodox worship uses icons and ancient traditions while Pentecostal worship includes speaking in tongues and spiritual gifts.',
            markingCriteria: {
              breakdown: ['Reference to different denominations (1-2 marks)', 'Explanation of worship differences (3-4 marks)', 'Specific examples given (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'christianity-q10',
            question: 'How far do you agree that the crucifixion is the most important Christian belief? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'The crucifixion is central as it provides salvation from sin and demonstrates God\'s love. However, the resurrection is equally important as it proves Jesus\' divine nature and offers hope of eternal life. Some might argue the incarnation is most important as without it, neither crucifixion nor resurrection would be possible.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Christian teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'catholic-christianity',
        name: 'Catholic Christianity',
        questions: [
          {
            id: 'catholic-q1',
            question: 'Give one example of a Catholic sacrament.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Baptism or Confirmation or Eucharist or Marriage or Holy Orders or Anointing of the Sick or Reconciliation.',
            markingCriteria: {
              breakdown: ['Correct example of Catholic sacrament (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q2',
            question: 'Give two Catholic beliefs about the Pope.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The Pope is the successor of St Peter. The Pope has authority over the Catholic Church worldwide.',
            markingCriteria: {
              breakdown: ['One correct belief about the Pope (1 mark)', 'Second correct belief about the Pope (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q3',
            question: 'Outline three features of Catholic Mass.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The Liturgy of the Word includes Bible readings. The Liturgy of the Eucharist consecrates bread and wine. The priest acts in persona Christi (in the person of Christ).',
            markingCriteria: {
              breakdown: ['One feature correctly outlined (1 mark)', 'Second feature correctly outlined (1 mark)', 'Third feature correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q4',
            question: 'Explain two ways Catholics might prepare for receiving the Eucharist.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Catholics fast for at least one hour before receiving communion to show respect for the sacred meal. They also examine their conscience and go to confession if they have committed serious sins, ensuring they are in a state of grace.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q5',
            question: 'Explain two Catholic teachings about papal authority.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Papal infallibility teaches that when the Pope speaks ex cathedra on matters of faith and morals, he cannot err because he is guided by the Holy Spirit. Papal supremacy means the Pope has ultimate authority over the universal Church as the successor of St Peter.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q6',
            question: 'How might Catholic social teaching influence a person\'s life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The preferential option for the poor might lead Catholics to volunteer at homeless shelters or donate to charity. The principle of human dignity could influence Catholics to campaign for workers\' rights and fair wages.',
            markingCriteria: {
              breakdown: ['Reference to social teaching (1-2 marks)', 'Explanation of practical influence (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q7',
            question: 'What are different Catholic views about artificial contraception?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Official Catholic teaching prohibits artificial contraception as stated in Humanae Vitae, believing it separates the unitive and procreative aspects of marriage. However, some Catholics disagree and believe responsible family planning using contraception can be morally acceptable.',
            markingCriteria: {
              breakdown: ['Official teaching explained (2 marks)', 'Alternative viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q8',
            question: 'Explain two ways Catholic beliefs about Mary might influence devotional practices.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'The belief in Mary as Mother of God leads Catholics to pray the Rosary, meditating on mysteries of salvation while seeking her intercession. The belief in Mary\'s Immaculate Conception encourages Catholics to celebrate her feast days and visit Marian shrines for pilgrimage.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to Marian beliefs (2-3 marks)', 'Second influence clearly explained with reference to Marian beliefs (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q9',
            question: 'How do Catholic beliefs about purgatory affect funeral practices?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Catholics believe purgatory is a state of purification before heaven, so they pray for the dead and have Masses said for departed souls. All Souls\' Day is dedicated to remembering the faithful departed. Indulgences may be gained for souls in purgatory.',
            markingCriteria: {
              breakdown: ['Reference to purgatory belief (1-2 marks)', 'Explanation of funeral practices (3-4 marks)', 'Specific examples given (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'catholic-q10',
            question: 'How far do you agree that the Eucharist is the most important Catholic sacrament? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'The Eucharist is central to Catholic worship as the real presence of Christ and source of grace. However, Baptism is also essential as it initiates people into the Church and removes original sin. Some might argue all seven sacraments are equally important as channels of God\'s grace.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Catholic teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'hinduism',
        name: 'Hinduism',
        questions: [
          {
            id: 'hinduism-q1',
            question: 'Give one example of a Hindu festival.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Diwali or Holi or Dussehra or Navaratri.',
            markingCriteria: {
              breakdown: ['Correct example of Hindu festival (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q2',
            question: 'Give two Hindu beliefs about dharma.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Dharma is religious duty or righteous living. Following dharma leads to good karma.',
            markingCriteria: {
              breakdown: ['One correct belief about dharma (1 mark)', 'Second correct belief about dharma (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q3',
            question: 'Outline three Hindu beliefs about the caste system.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The four main varnas are Brahmins (priests), Kshatriyas (warriors), Vaishyas (merchants), and Shudras (laborers). Caste is determined by birth and karma from previous lives. Each caste has specific duties and responsibilities.',
            markingCriteria: {
              breakdown: ['One belief correctly outlined (1 mark)', 'Second belief correctly outlined (1 mark)', 'Third belief correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q4',
            question: 'Explain two ways Hindus might worship in the home.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Many Hindus have a home shrine with images of deities where they perform daily puja with offerings of flowers, food and incense. Hindu families might also chant mantras together, especially during festivals or special occasions.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q5',
            question: 'Explain two Hindu teachings about ahimsa (non-violence).',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Ahimsa teaches that all life is sacred and should not be harmed, leading many Hindus to follow vegetarian diets. The principle extends beyond physical violence to include thoughts and words, encouraging Hindus to practice compassion and avoid causing mental or emotional harm to others.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q6',
            question: 'How might Hindu scriptures influence daily life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Bhagavad Gita teaches about duty and devotion, guiding Hindus in making moral choices. The Vedas contain prayers and rituals that structure Hindu worship and ceremonies throughout life.',
            markingCriteria: {
              breakdown: ['Reference to Hindu scriptures (1-2 marks)', 'Explanation of influence on daily life (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q7',
            question: 'What are different Hindu views about the role of women?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Traditional Hindu texts honor women as mothers and wives but may restrict their roles outside the home. However, modern Hindu movements emphasize gender equality and women\'s rights to education and careers, seeing this as consistent with Hindu values.',
            markingCriteria: {
              breakdown: ['Traditional viewpoint explained (2 marks)', 'Modern/alternative viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q8',
            question: 'Explain two ways Hindu beliefs about karma might influence ethical behavior.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'The belief that actions have consequences in this life and future lives encourages Hindus to act ethically to improve their karma. The understanding that suffering may result from past karma can lead to acceptance of difficulties while motivating compassionate action to help others.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to karma (2-3 marks)', 'Second influence clearly explained with reference to karma (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q9',
            question: 'How do different Hindu traditions approach the concept of God?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Vaishnavism focuses on Vishnu as the supreme deity with avatars like Krishna and Rama. Shaivism centers on Shiva as creator, preserver and destroyer. Shaktism emphasizes the divine feminine power through goddess worship.',
            markingCriteria: {
              breakdown: ['Reference to different traditions (1-2 marks)', 'Explanation of approaches to God (3-4 marks)', 'Specific examples given (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'hinduism-q10',
            question: 'How far do you agree that moksha is the ultimate goal for all Hindus? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Moksha represents liberation from samsara and is considered the highest spiritual achievement in Hindu tradition. However, many Hindus focus on dharma (righteous living) and karma in this life rather than liberation. Some emphasize devotion to God over liberation itself.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Hindu teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'islam',
        name: 'Islam',
        questions: [
          {
            id: 'islam-q1',
            question: 'Give one example of the Five Pillars of Islam.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Shahada (declaration of faith) or Salah (prayer) or Zakah (charity) or Sawm (fasting during Ramadan) or Hajj (pilgrimage to Mecca).',
            markingCriteria: {
              breakdown: ['Correct example of one of the Five Pillars (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q2',
            question: 'Give two Muslim beliefs about the Quran.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The Quran is the direct word of Allah. The Quran was revealed to the Prophet Muhammad.',
            markingCriteria: {
              breakdown: ['One correct belief about the Quran (1 mark)', 'Second correct belief about the Quran (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q3',
            question: 'Outline three features of Muslim prayer (Salah).',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Muslims pray five times a day at set times. They face Mecca (qibla) during prayer. Ritual washing (wudu) is performed before prayer.',
            markingCriteria: {
              breakdown: ['One feature correctly outlined (1 mark)', 'Second feature correctly outlined (1 mark)', 'Third feature correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q4',
            question: 'Explain two ways Muslims might observe Ramadan.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Muslims fast from dawn to sunset, abstaining from food, drink and other physical needs to develop self-discipline and empathy. They read extra portions of the Quran and attend special evening prayers (Tarawih) at the mosque.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q5',
            question: 'Explain two Islamic teachings about the oneness of Allah (Tawhid).',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Tawhid teaches that Allah is unique and indivisible, rejecting any form of polytheism or association of partners with Allah. This belief emphasizes Allah\'s absolute sovereignty and unity, making shirk (associating partners with Allah) the greatest sin in Islam.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q6',
            question: 'How might Islamic teachings about zakah influence a Muslim\'s life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Zakah requires Muslims to give 2.5% of their wealth to help the poor, encouraging social responsibility and reducing inequality. It purifies wealth and reminds Muslims that their possessions are a trust from Allah.',
            markingCriteria: {
              breakdown: ['Reference to zakah teachings (1-2 marks)', 'Explanation of practical influence (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q7',
            question: 'What are different Muslim views about the role of women in Islam?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Traditional interpretations emphasize women\'s roles as mothers and wives with modest dress requirements. Progressive Muslims argue for gender equality in education, work and leadership, believing Islam grants equal spiritual status to men and women.',
            markingCriteria: {
              breakdown: ['Traditional viewpoint explained (2 marks)', 'Progressive viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q8',
            question: 'Explain two ways Islamic beliefs about jihad might influence Muslim behavior.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'The greater jihad (internal struggle against sin) encourages Muslims to develop self-discipline and moral character through prayer and good deeds. The lesser jihad (struggle for justice) might motivate Muslims to work for social justice and defend the oppressed.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to jihad (2-3 marks)', 'Second influence clearly explained with reference to jihad (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q9',
            question: 'How do Sunni and Shia Muslims differ in their beliefs and practices?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Sunni Muslims follow the succession of the four Rightly-Guided Caliphs while Shia Muslims believe Ali should have been the first leader. Shia Muslims have Imams as spiritual leaders and practice temporary marriage, while Sunnis do not.',
            markingCriteria: {
              breakdown: ['Reference to different branches (1-2 marks)', 'Explanation of belief differences (2-3 marks)', 'Explanation of practice differences (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'islam-q10',
            question: 'How far do you agree that the Hajj pilgrimage is the most important duty for Muslims? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Hajj is a once-in-a-lifetime obligation that unites the global Muslim community and represents spiritual purification. However, daily prayers (Salah) might be more important as they are performed five times daily. Some argue the Shahada is most important as it represents the foundation of Islamic faith.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Islamic teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'judaism',
        name: 'Judaism',
        questions: [
          {
            id: 'judaism-q1',
            question: 'Give one example of a Jewish festival.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Passover or Rosh Hashanah or Yom Kippur or Sukkot.',
            markingCriteria: {
              breakdown: ['Correct example of Jewish festival (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q2',
            question: 'Give two Jewish beliefs about the Torah.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The Torah contains God\'s law for the Jewish people. The Torah was given to Moses at Mount Sinai.',
            markingCriteria: {
              breakdown: ['One correct belief about the Torah (1 mark)', 'Second correct belief about the Torah (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q3',
            question: 'Outline three features of Shabbat observance.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Shabbat begins at sunset on Friday with lighting candles. Jews attend synagogue services. Work is forbidden during Shabbat.',
            markingCriteria: {
              breakdown: ['One feature correctly outlined (1 mark)', 'Second feature correctly outlined (1 mark)', 'Third feature correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q4',
            question: 'Explain two ways Jews might celebrate Passover.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Jews hold a Seder meal retelling the Exodus story with symbolic foods like matzah and bitter herbs. They remove all leavened products from their homes for eight days to remember the unleavened bread eaten during the Exodus.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q5',
            question: 'Explain two Jewish teachings about the covenant with God.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'The covenant with Abraham established Jews as God\'s chosen people with the promise of the Promised Land. The covenant includes following God\'s commandments in return for God\'s protection and blessing.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q6',
            question: 'How might Jewish dietary laws (kashrut) influence daily life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Observant Jews separate meat and dairy products, requiring separate sets of dishes and utensils. They only eat kosher meat from permitted animals slaughtered according to Jewish law.',
            markingCriteria: {
              breakdown: ['Reference to kashrut laws (1-2 marks)', 'Explanation of practical influence (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q7',
            question: 'What are different Jewish views about the role of women in worship?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Orthodox Judaism maintains traditional gender roles with men and women sitting separately in synagogue and women not counting toward a minyan. Reform and Conservative Judaism allow women equal participation including ordination as rabbis.',
            markingCriteria: {
              breakdown: ['Orthodox viewpoint explained (2 marks)', 'Progressive viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q8',
            question: 'Explain two ways Jewish beliefs about tikkun olam might influence social action.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Tikkun olam (repairing the world) encourages Jews to work for social justice and help those in need through charity and volunteering. The concept motivates environmental activism as Jews believe they have responsibility to care for God\'s creation.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to tikkun olam (2-3 marks)', 'Second influence clearly explained with reference to tikkun olam (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q9',
            question: 'How do different Jewish movements approach religious observance?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Orthodox Judaism maintains strict adherence to halakha (Jewish law) and traditional practices. Conservative Judaism allows some adaptation while preserving core traditions. Reform Judaism emphasizes ethical teachings over ritual observance.',
            markingCriteria: {
              breakdown: ['Reference to different movements (1-2 marks)', 'Explanation of observance differences (3-4 marks)', 'Specific examples given (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'judaism-q10',
            question: 'How far do you agree that the synagogue is the most important place for Jewish worship? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'The synagogue provides community worship, Torah study and social gathering that strengthens Jewish identity. However, the home is equally important for Shabbat observance, kosher meals and family religious education. Some argue the Temple in Jerusalem was most important before its destruction.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Jewish teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      },
      {
        id: 'sikhism',
        name: 'Sikhism',
        questions: [
          {
            id: 'sikhism-q1',
            question: 'Give one example of Sikh worship.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Prayer (simran) or Gurdwara worship or Reading from Guru Granth Sahib or Singing hymns (kirtan).',
            markingCriteria: {
              breakdown: ['Correct example of Sikh worship (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q2',
            question: 'Give two Sikh beliefs about the Guru Granth Sahib.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The Guru Granth Sahib is the living Guru. The Guru Granth Sahib contains the teachings of the Sikh Gurus.',
            markingCriteria: {
              breakdown: ['One correct belief about Guru Granth Sahib (1 mark)', 'Second correct belief about Guru Granth Sahib (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q3',
            question: 'Outline three of the Five Ks worn by Sikhs.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Kesh (uncut hair), Kara (steel bracelet), Kirpan (ceremonial sword), Kachera (special underwear), Kangha (wooden comb).',
            markingCriteria: {
              breakdown: ['First K correctly outlined (1 mark)', 'Second K correctly outlined (1 mark)', 'Third K correctly outlined (1 mark)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q4',
            question: 'Explain two ways Sikhs might serve in the gurdwara.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sikhs prepare and serve free meals (langar) to all visitors regardless of background, demonstrating equality and seva (service). They take turns reading from the Guru Granth Sahib and leading prayers during worship services.',
            markingCriteria: {
              breakdown: ['One way identified and explained (2 marks)', 'Second way identified and explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q5',
            question: 'Explain two Sikh teachings about the nature of God.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Sikhs believe in one God (Ik Onkar) who is eternal, without form and present everywhere. God is both transcendent (beyond the world) and immanent (present in creation), accessible through devotion and meditation.',
            markingCriteria: {
              breakdown: ['One teaching clearly explained with development (2-3 marks)', 'Second teaching clearly explained with development (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q6',
            question: 'How might Sikh beliefs about equality influence daily life?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sikhs reject caste distinctions and treat all people equally regardless of social background. The practice of langar (free community meals) demonstrates this equality in action.',
            markingCriteria: {
              breakdown: ['Reference to equality beliefs (1-2 marks)', 'Explanation of practical influence (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q7',
            question: 'What are different Sikh views about wearing the Five Ks?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Khalsa Sikhs believe wearing all Five Ks is essential for showing commitment to Sikh identity and values. However, some Sikhs choose to follow Sikh teachings without wearing all the symbols, focusing more on inner spirituality.',
            markingCriteria: {
              breakdown: ['Traditional/Khalsa viewpoint explained (2 marks)', 'Alternative viewpoint explained (2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q8',
            question: 'Explain two ways Sikh beliefs about seva might influence charitable work.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Seva (selfless service) encourages Sikhs to volunteer in their communities without expecting reward, seeing service as worship of God. The principle motivates Sikhs to help during disasters and crises, providing food, shelter and medical aid to those in need.',
            markingCriteria: {
              breakdown: ['One influence clearly explained with reference to seva (2-3 marks)', 'Second influence clearly explained with reference to seva (2-3 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q9',
            question: 'How do the teachings of different Sikh Gurus guide modern Sikh life?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Guru Nanak taught about one God and equality, forming the foundation of Sikh beliefs. Guru Gobind Singh created the Khalsa and Five Ks, establishing Sikh identity. Their teachings guide daily prayer, service and standing up for justice.',
            markingCriteria: {
              breakdown: ['Reference to different Gurus (1-2 marks)', 'Explanation of teachings (2-3 marks)', 'Application to modern life (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          },
          {
            id: 'sikhism-q10',
            question: 'How far do you agree that the Five Ks are the most important way for Sikhs to show their faith? Give reasons for your answer, showing you have thought about different points of view.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'The Five Ks provide visible identity and commitment to Sikh values, connecting modern Sikhs to Guru Gobind Singh\'s teachings. However, seva (service) and meditation might be more important as they develop spiritual character. Some argue following the Guru\'s teachings is more important than external symbols.',
            markingCriteria: {
              breakdown: ['Arguments supporting the statement (3-4 marks)', 'Arguments against the statement (3-4 marks)', 'Reference to Sikh teachings (2-3 marks)', 'Justified conclusion (1-2 marks)']
            },
            specReference: 'AQA GCSE Religious Studies 8062'
          }
        ]
      }
    ]
  },
  {
    id: 'history',
    name: 'History',
    topics: [
      {
        id: 'america-1840-1895',
        name: 'AA: America, 1840–1895 – Expansion and consolidation',
        questions: [
          {
            id: 'america-1840-q1',
            question: 'What were the main reasons for westward expansion in America between 1840-1895?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Economic opportunities like gold rushes and farming land, population pressure in the East, and the concept of Manifest Destiny drove westward expansion.',
            markingCriteria: {
              breakdown: ['Economic opportunities mentioned (1 mark)', 'Population pressure (1 mark)', 'Manifest Destiny concept (1 mark)', 'Specific examples given (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q2',
            question: 'How did the transcontinental railroad affect American expansion?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The railroad connected East and West coasts, enabling faster travel and trade. It facilitated settlement of the Great Plains and contributed to the decline of Native American tribes.',
            markingCriteria: {
              breakdown: ['Connected coasts (1 mark)', 'Faster travel/trade (1 mark)', 'Settlement facilitation (2 marks)', 'Impact on Native Americans (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q3',
            question: 'What impact did the California Gold Rush have on American society?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Gold Rush attracted hundreds of thousands of people to California, led to rapid population growth, created mining towns, and increased diversity as people came from around the world.',
            markingCriteria: {
              breakdown: ['Mass migration mentioned (1 mark)', 'Population growth (1 mark)', 'Mining towns created (1 mark)', 'Increased diversity (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q4',
            question: 'How did the Homestead Act of 1862 encourage settlement?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The Act offered 160 acres of free land to settlers who would farm it for five years. This encouraged thousands of families to move west and establish farms.',
            markingCriteria: {
              breakdown: ['160 acres of free land (1 mark)', 'Five year farming requirement (1 mark)', 'Encouraged western migration (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q5',
            question: 'What were the main problems faced by Native Americans during westward expansion?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Native Americans lost their traditional lands, faced military conflicts with settlers and the US Army, experienced cultural destruction, and were forced onto reservations.',
            markingCriteria: {
              breakdown: ['Loss of traditional lands (2 marks)', 'Military conflicts (1 mark)', 'Cultural destruction (1 mark)', 'Forced onto reservations (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q6',
            question: 'How did cattle ranching develop in the American West?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Cattle ranching grew due to demand for beef in eastern cities, the development of cattle drives like the Chisholm Trail, and the arrival of railroads to transport cattle.',
            markingCriteria: {
              breakdown: ['Eastern demand for beef (1 mark)', 'Cattle drives/trails (1 mark)', 'Railroad transportation (1 mark)', 'Economic development (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q7',
            question: 'What was the significance of the Battle of Little Bighorn?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The battle was a major victory for Native Americans led by Sitting Bull and Crazy Horse, resulting in Custer\'s defeat and death, but led to increased military action against tribes.',
            markingCriteria: {
              breakdown: ['Native American victory (1 mark)', 'Custer\'s defeat mentioned (1 mark)', 'Increased military action resulted (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q8',
            question: 'How did the discovery of silver and gold affect western mining towns?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Mining discoveries led to boom towns that grew rapidly, attracted diverse populations, but often became ghost towns when resources were exhausted.',
            markingCriteria: {
              breakdown: ['Boom towns created (1 mark)', 'Rapid growth (1 mark)', 'Diverse populations (1 mark)', 'Ghost towns when exhausted (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q9',
            question: 'What role did women play in westward expansion?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Women worked as homesteaders, teachers, and in businesses. They faced hardships on the frontier, had more independence than in the East, and some gained property rights and voting rights in western territories.',
            markingCriteria: {
              breakdown: ['Various occupations (2 marks)', 'Frontier hardships (1 mark)', 'Greater independence (1 mark)', 'Property/voting rights (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1840-q10',
            question: 'How did the closing of the frontier in 1890 mark the end of westward expansion?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The census declared no clear frontier line remained, most western land was settled or claimed, and America had expanded from coast to coast, marking the end of the expansion era.',
            markingCriteria: {
              breakdown: ['Census declaration (1 mark)', 'Most land settled (1 mark)', 'Coast to coast expansion (1 mark)', 'End of expansion era (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'germany-1890-1945',
        name: 'AB: Germany, 1890–1945 – Democracy and dictatorship',
        questions: [
          {
            id: 'germany-q1',
            question: 'What problems faced the Weimar Republic in its early years?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'The Weimar Republic faced hyperinflation, political instability, the Treaty of Versailles burden, and opposition from both left and right-wing groups.',
            markingCriteria: {
              breakdown: ['Hyperinflation mentioned (1 mark)', 'Political instability (1 mark)', 'Treaty of Versailles (1 mark)', 'Opposition groups (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q2',
            question: 'How did Hitler consolidate power after becoming Chancellor in 1933?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Hitler used the Reichstag Fire to gain emergency powers, passed the Enabling Act, eliminated trade unions, and removed political opposition through violence and intimidation.',
            markingCriteria: {
              breakdown: ['Reichstag Fire (1 mark)', 'Enabling Act (2 marks)', 'Eliminated unions (1 mark)', 'Removed opposition (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q3',
            question: 'What were the main features of Kaiser Wilhelm II\'s rule before 1914?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Wilhelm II practiced personal rule, dismissed Bismarck, pursued Weltpolitik (world policy), built up the German navy, and increased tensions with other European powers.',
            markingCriteria: {
              breakdown: ['Personal rule mentioned (1 mark)', 'Dismissed Bismarck (1 mark)', 'Weltpolitik policy (1 mark)', 'Naval buildup (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q4',
            question: 'How did World War I affect German society?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The war caused food shortages, economic hardship, loss of morale, increased casualties, and ultimately led to revolution and the Kaiser\'s abdication in 1918.',
            markingCriteria: {
              breakdown: ['Food shortages (1 mark)', 'Economic hardship (1 mark)', 'Loss of morale (1 mark)', 'High casualties (1 mark)', 'Revolution and abdication (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q5',
            question: 'What was the impact of the Treaty of Versailles on Germany?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Germany lost territory, had military restrictions imposed, accepted war guilt, and faced massive reparations payments that damaged the economy.',
            markingCriteria: {
              breakdown: ['Territory losses (1 mark)', 'Military restrictions (1 mark)', 'War guilt clause (1 mark)', 'Reparations impact (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q6',
            question: 'How did the Golden Age (1924-1929) improve conditions in Germany?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'American loans stabilized the economy, industrial production increased, unemployment fell, and there was cultural renaissance in art, literature, and cinema.',
            markingCriteria: {
              breakdown: ['American loans (1 mark)', 'Industrial growth (1 mark)', 'Reduced unemployment (1 mark)', 'Cultural improvements (2 marks)', 'Economic stability (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q7',
            question: 'What was the impact of the Great Depression on Germany?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Mass unemployment reached 6 million, American loans were withdrawn, businesses collapsed, and extremist parties like the Nazis gained support.',
            markingCriteria: {
              breakdown: ['Mass unemployment (1 mark)', 'American loans withdrawn (1 mark)', 'Business failures (1 mark)', 'Extremist party growth (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q8',
            question: 'How did Nazi propaganda help Hitler gain power?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Propaganda blamed Germany\'s problems on enemies, promised simple solutions, used rallies and speeches, exploited economic fears, and targeted specific groups with tailored messages.',
            markingCriteria: {
              breakdown: ['Blamed enemies for problems (1 mark)', 'Simple solutions offered (1 mark)', 'Rallies and speeches (1 mark)', 'Exploited economic fears (1 mark)', 'Targeted messaging (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q9',
            question: 'What were the main features of Nazi control in Germany after 1933?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Nazis established a one-party state, used the Gestapo for surveillance, controlled education and media, and eliminated opposition through violence.',
            markingCriteria: {
              breakdown: ['One-party state (1 mark)', 'Gestapo surveillance (1 mark)', 'Controlled education/media (1 mark)', 'Eliminated opposition (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'germany-q10',
            question: 'How did Nazi policies affect different groups in German society?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Women were encouraged to focus on family roles, Jews faced persecution and discrimination, workers had controlled unions but some benefits, while youth were indoctrinated through Hitler Youth.',
            markingCriteria: {
              breakdown: ['Women\'s roles (1 mark)', 'Jewish persecution (2 marks)', 'Worker policies (1 mark)', 'Youth indoctrination (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'russia-1894-1945',
        name: 'AC: Russia, 1894–1945 – Tsardom and communism',
        questions: [
          {
            id: 'russia-q1',
            question: 'What were the main causes of the 1905 Revolution in Russia?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Military defeat in the Russo-Japanese War, Bloody Sunday massacre, economic hardship, and demands for political reform led to the 1905 Revolution.',
            markingCriteria: {
              breakdown: ['Russo-Japanese War (1 mark)', 'Bloody Sunday (1 mark)', 'Economic hardship (1 mark)', 'Political demands (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q2',
            question: 'How did Lenin consolidate Bolshevik power after the October Revolution?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Lenin signed the Treaty of Brest-Litovsk to end Russian involvement in WWI, used the Cheka to eliminate opposition, and implemented War Communism.',
            markingCriteria: {
              breakdown: ['Treaty of Brest-Litovsk (2 marks)', 'Cheka usage (2 marks)', 'War Communism (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q3',
            question: 'What were the main problems facing Tsar Nicholas II in 1894?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Russia was economically backward, had limited industrialization, faced social unrest, and lacked political reform compared to other European powers.',
            markingCriteria: {
              breakdown: ['Economic backwardness (1 mark)', 'Limited industry (1 mark)', 'Social unrest (1 mark)', 'Lack of political reform (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q4',
            question: 'How did Stolypin\'s reforms attempt to modernize Russia?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Stolypin introduced land reforms allowing peasants to own individual plots, encouraged agricultural modernization, and tried to create a class of prosperous farmers to support the Tsar.',
            markingCriteria: {
              breakdown: ['Land ownership reforms (2 marks)', 'Agricultural modernization (1 mark)', 'Creating prosperous farmer class (2 marks)', 'Support for Tsar (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q5',
            question: 'What impact did World War I have on Russian society?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The war caused massive casualties, economic collapse, food shortages, and loss of confidence in Tsar Nicholas II\'s leadership.',
            markingCriteria: {
              breakdown: ['Massive casualties (1 mark)', 'Economic collapse (1 mark)', 'Food shortages (1 mark)', 'Loss of confidence in Tsar (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q6',
            question: 'Why did the Provisional Government fail in 1917?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The Provisional Government continued the unpopular war, failed to address land reform, couldn\'t solve economic problems, and faced competition from the Petrograd Soviet.',
            markingCriteria: {
              breakdown: ['Continued unpopular war (2 marks)', 'Failed land reform (1 mark)', 'Economic problems unsolved (1 mark)', 'Dual power with Soviet (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q7',
            question: 'What were the main features of War Communism?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'War Communism included nationalization of industry, requisitioning of grain from peasants, abolition of private trade, and state control of the economy.',
            markingCriteria: {
              breakdown: ['Nationalized industry (1 mark)', 'Grain requisitioning (1 mark)', 'Abolished private trade (1 mark)', 'State economic control (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q8',
            question: 'How did the New Economic Policy (NEP) differ from War Communism?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The NEP allowed some private trade, replaced grain requisitioning with a tax, permitted small businesses, while keeping state control of major industries and banks.',
            markingCriteria: {
              breakdown: ['Allowed private trade (1 mark)', 'Tax instead of requisitioning (2 marks)', 'Small businesses permitted (1 mark)', 'State kept major industry (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q9',
            question: 'How did Stalin gain power after Lenin\'s death?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Stalin used his position as General Secretary to build support, outmaneuvered rivals like Trotsky, and gradually eliminated opposition within the Communist Party.',
            markingCriteria: {
              breakdown: ['Used General Secretary position (1 mark)', 'Built party support (1 mark)', 'Outmaneuvered Trotsky (1 mark)', 'Eliminated opposition (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'russia-q10',
            question: 'What were the main features of Stalin\'s Five Year Plans?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The plans focused on rapid industrialization, emphasized heavy industry, set production targets, used forced labor, and aimed to transform Russia from agricultural to industrial economy.',
            markingCriteria: {
              breakdown: ['Rapid industrialization (1 mark)', 'Heavy industry focus (1 mark)', 'Production targets (1 mark)', 'Forced labor (1 mark)', 'Agricultural to industrial transformation (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'america-1920-1973',
        name: 'AD: America, 1920–1973 – Opportunity and inequality',
        questions: [
          {
            id: 'america-1920-q1',
            question: 'What were the main features of the economic boom in 1920s America?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Mass production, consumer goods availability, stock market speculation, and hire purchase schemes characterized the 1920s economic boom.',
            markingCriteria: {
              breakdown: ['Mass production (1 mark)', 'Consumer goods (1 mark)', 'Stock market (1 mark)', 'Hire purchase (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q2',
            question: 'How did the New Deal help Americans during the Great Depression?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The New Deal created jobs through public works programs, provided financial relief, reformed banking, and established social security systems.',
            markingCriteria: {
              breakdown: ['Job creation programs (2 marks)', 'Financial relief (1 mark)', 'Banking reform (1 mark)', 'Social security (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q3',
            question: 'What was the impact of Prohibition in 1920s America?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Prohibition led to the rise of organized crime, illegal speakeasies, widespread law-breaking, and ultimately proved unenforceable.',
            markingCriteria: {
              breakdown: ['Rise of organized crime (1 mark)', 'Illegal speakeasies (1 mark)', 'Widespread law-breaking (1 mark)', 'Proved unenforceable (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q4',
            question: 'How did the Red Scare affect American society?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The Red Scare led to arrests and deportations of suspected communists, restrictions on immigration, fear of foreign influences, and violations of civil liberties.',
            markingCriteria: {
              breakdown: ['Arrests and deportations (2 marks)', 'Immigration restrictions (1 mark)', 'Fear of foreign influences (1 mark)', 'Civil liberties violations (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q5',
            question: 'What caused the Wall Street Crash of 1929?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Over-speculation in stocks, buying on margin, overproduction in industry, and lack of regulation in financial markets caused the crash.',
            markingCriteria: {
              breakdown: ['Over-speculation (1 mark)', 'Buying on margin (1 mark)', 'Overproduction (1 mark)', 'Lack of regulation (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q6',
            question: 'How did World War II affect the American economy?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The war ended the Great Depression, created full employment, increased industrial production, boosted government spending, and established America as a global economic power.',
            markingCriteria: {
              breakdown: ['Ended Great Depression (1 mark)', 'Full employment (1 mark)', 'Increased production (1 mark)', 'Government spending (1 mark)', 'Global economic power (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q7',
            question: 'What were the main features of the Civil Rights Movement in the 1950s-60s?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The movement used peaceful protests, legal challenges, boycotts, and civil disobedience to challenge segregation and achieve voting rights.',
            markingCriteria: {
              breakdown: ['Peaceful protests (1 mark)', 'Legal challenges (1 mark)', 'Boycotts (1 mark)', 'Civil disobedience (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q8',
            question: 'How did the role of women change during World War II?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Women entered industrial work in large numbers, gained economic independence, challenged traditional gender roles, but faced pressure to return to domestic roles after the war.',
            markingCriteria: {
              breakdown: ['Entered industrial work (2 marks)', 'Economic independence (1 mark)', 'Challenged gender roles (1 mark)', 'Post-war pressure (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q9',
            question: 'What was the significance of the Montgomery Bus Boycott?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The boycott successfully ended bus segregation in Montgomery, established Martin Luther King Jr. as a leader, and demonstrated the power of non-violent protest.',
            markingCriteria: {
              breakdown: ['Ended bus segregation (1 mark)', 'Established MLK leadership (1 mark)', 'Demonstrated non-violent protest (1 mark)', 'Success significance (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'america-1920-q10',
            question: 'How did the Vietnam War divide American society?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The war created generational conflict, anti-war protests, draft resistance, loss of trust in government, and divisions between hawks and doves.',
            markingCriteria: {
              breakdown: ['Generational conflict (1 mark)', 'Anti-war protests (1 mark)', 'Draft resistance (1 mark)', 'Lost trust in government (1 mark)', 'Hawks vs doves division (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'conflict-tension-ww1',
        name: 'BA: Conflict and tension: The First World War, 1894–1918',
        questions: [
          {
            id: 'ww1-q1',
            question: 'What were the main causes of tension between European powers before 1914?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Imperial rivalry, alliance system, arms race, and nationalism in the Balkans created tensions between European powers before WWI.',
            markingCriteria: {
              breakdown: ['Imperial rivalry (1 mark)', 'Alliance system (1 mark)', 'Arms race (1 mark)', 'Balkan nationalism (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q2',
            question: 'How did trench warfare develop on the Western Front?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'After the failure of the Schlieffen Plan, both sides dug trenches for protection. This created a stalemate with no man\'s land between opposing forces.',
            markingCriteria: {
              breakdown: ['Schlieffen Plan failure (2 marks)', 'Defensive trenches (2 marks)', 'Stalemate creation (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q3',
            question: 'What role did the alliance system play in causing World War I?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Triple Alliance (Germany, Austria-Hungary, Italy) and Triple Entente (Britain, France, Russia) meant that a local conflict could escalate into a world war.',
            markingCriteria: {
              breakdown: ['Triple Alliance identified (1 mark)', 'Triple Entente identified (1 mark)', 'Local conflict escalation (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q4',
            question: 'How did the assassination of Archduke Franz Ferdinand lead to war?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The assassination by a Serbian nationalist led Austria-Hungary to declare war on Serbia. Russia supported Serbia, Germany supported Austria, and the alliance system drew in other powers.',
            markingCriteria: {
              breakdown: ['Serbian nationalist assassination (1 mark)', 'Austria declared war on Serbia (1 mark)', 'Russian support for Serbia (1 mark)', 'German support for Austria (1 mark)', 'Alliance system activation (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q5',
            question: 'What was the significance of the Battle of the Somme?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The battle demonstrated the failure of tactics against modern weapons, resulted in massive casualties with little territorial gain, and showed the futility of frontal attacks.',
            markingCriteria: {
              breakdown: ['Tactical failures shown (1 mark)', 'Massive casualties (1 mark)', 'Little territorial gain (1 mark)', 'Futility of frontal attacks (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q6',
            question: 'How did new technology change warfare during WWI?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Machine guns made frontal attacks deadly, poison gas was used for the first time, tanks were developed to break trench lines, and aircraft evolved from reconnaissance to combat roles.',
            markingCriteria: {
              breakdown: ['Machine gun impact (1 mark)', 'Poison gas introduction (1 mark)', 'Tank development (2 marks)', 'Aircraft evolution (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q7',
            question: 'What impact did the war have on the home front in Britain?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Rationing was introduced, women entered the workforce in large numbers, propaganda was used to maintain morale, and civilian areas faced air raids.',
            markingCriteria: {
              breakdown: ['Rationing introduced (1 mark)', 'Women in workforce (1 mark)', 'Propaganda usage (1 mark)', 'Air raids on civilians (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q8',
            question: 'Why did America enter the war in 1917?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'German submarine warfare threatened American ships, the Zimmermann Telegram revealed German plans against America, economic ties to Britain, and Wilson\'s desire to make the world "safe for democracy."',
            markingCriteria: {
              breakdown: ['German submarine warfare (2 marks)', 'Zimmermann Telegram (1 mark)', 'Economic ties to Britain (1 mark)', 'Democratic ideals (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q9',
            question: 'What were the main terms of the Armistice in November 1918?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Germany had to withdraw from occupied territories, surrender weapons and equipment, hand over its fleet, and accept Allied occupation of German territory.',
            markingCriteria: {
              breakdown: ['Withdraw from occupied territories (1 mark)', 'Surrender weapons (1 mark)', 'Hand over fleet (1 mark)', 'Allied occupation (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'ww1-q10',
            question: 'How did the war contribute to the collapse of empires?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The war weakened the Ottoman, Austrian, German, and Russian empires through military defeats, economic strain, internal revolutions, and the principle of national self-determination.',
            markingCriteria: {
              breakdown: ['Empire weakening (1 mark)', 'Military defeats (1 mark)', 'Economic strain (1 mark)', 'Internal revolutions (1 mark)', 'National self-determination (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'conflict-tension-interwar',
        name: 'BB: Conflict and tension: The inter-war years, 1918–1939',
        questions: [
          {
            id: 'interwar-q1',
            question: 'What were the main terms of the Treaty of Versailles?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Germany lost territory, had military restrictions imposed, accepted war guilt, and had to pay reparations to the Allied powers.',
            markingCriteria: {
              breakdown: ['Territory losses (1 mark)', 'Military restrictions (1 mark)', 'War guilt clause (1 mark)', 'Reparations (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q2',
            question: 'Why did the League of Nations fail to prevent aggression in the 1930s?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The League lacked enforcement power, major powers like USA and USSR were not members, and economic sanctions proved ineffective against aggressors.',
            markingCriteria: {
              breakdown: ['Lack of enforcement (2 marks)', 'Missing major powers (2 marks)', 'Ineffective sanctions (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q3',
            question: 'How did the Great Depression affect international relations?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Depression led to economic nationalism, reduced international cooperation, weakened democratic governments, and helped extremist parties gain power.',
            markingCriteria: {
              breakdown: ['Economic nationalism (1 mark)', 'Reduced cooperation (1 mark)', 'Weakened democracies (1 mark)', 'Extremist parties rise (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q4',
            question: 'What was the policy of appeasement and why was it followed?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Appeasement meant giving in to aggressive demands to avoid war. It was followed due to fear of another world war, belief that Versailles was too harsh, and hope that Hitler could be satisfied.',
            markingCriteria: {
              breakdown: ['Definition of appeasement (1 mark)', 'Fear of war (1 mark)', 'Versailles too harsh (2 marks)', 'Hope to satisfy Hitler (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q5',
            question: 'How did the Japanese invasion of Manchuria test the League of Nations?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Japan invaded Manchuria in 1931, the League condemned the action but took no effective military action, Japan left the League, showing the organization\'s weakness.',
            markingCriteria: {
              breakdown: ['1931 invasion (1 mark)', 'League condemnation (1 mark)', 'No military action (1 mark)', 'Japan left League (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q6',
            question: 'What was the significance of the Munich Agreement of 1938?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The Munich Agreement gave Hitler the Sudetenland without consulting Czechoslovakia, represented the height of appeasement, and encouraged Hitler to make further demands.',
            markingCriteria: {
              breakdown: ['Gave Hitler Sudetenland (1 mark)', 'Without Czech consultation (1 mark)', 'Height of appeasement (2 marks)', 'Encouraged further demands (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q7',
            question: 'How did the Spanish Civil War affect international relations?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Spanish Civil War served as a testing ground for new weapons, revealed the weakness of non-intervention policies, and strengthened the Rome-Berlin Axis.',
            markingCriteria: {
              breakdown: ['Testing ground for weapons (1 mark)', 'Non-intervention weakness (1 mark)', 'Strengthened Rome-Berlin Axis (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q8',
            question: 'Why did the Nazi-Soviet Pact surprise the world in 1939?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The pact was surprising because Nazi Germany and Communist Soviet Union were ideological enemies, Hitler had previously attacked communism, and it seemed to contradict their fundamental beliefs.',
            markingCriteria: {
              breakdown: ['Ideological enemies (2 marks)', 'Hitler attacked communism (1 mark)', 'Contradicted beliefs (1 mark)', 'World surprise (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q9',
            question: 'What were the main causes of the Abyssinian Crisis?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Italy invaded Abyssinia for empire building, to distract from domestic problems, for economic resources, and to restore national pride after previous defeats.',
            markingCriteria: {
              breakdown: ['Empire building (1 mark)', 'Domestic distraction (1 mark)', 'Economic resources (1 mark)', 'National pride (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'interwar-q10',
            question: 'How did the failure of collective security lead to World War II?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The failure to stop aggression in Manchuria, Abyssinia, and the Rhineland encouraged further aggression, weakened the League of Nations, and showed that peaceful methods could not maintain peace.',
            markingCriteria: {
              breakdown: ['Failed to stop early aggression (2 marks)', 'Encouraged further aggression (1 mark)', 'Weakened League (1 mark)', 'Peaceful methods failed (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'conflict-tension-east-west',
        name: 'BC: Conflict and tension between East and West, 1945–1972',
        questions: [
          {
            id: 'east-west-q1',
            question: 'What were the main disagreements between the USA and USSR at the end of WWII?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Disagreements over Eastern Europe\'s future, Germany\'s division, nuclear weapons, and different ideological systems created tension between the superpowers.',
            markingCriteria: {
              breakdown: ['Eastern Europe disputes (1 mark)', 'Germany division (1 mark)', 'Nuclear weapons (1 mark)', 'Ideological differences (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q2',
            question: 'How did the Berlin Crisis of 1961 increase Cold War tensions?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The construction of the Berlin Wall divided the city, created a propaganda victory for the West, and demonstrated the failure of communist East Germany.',
            markingCriteria: {
              breakdown: ['Berlin Wall construction (2 marks)', 'Propaganda impact (2 marks)', 'Communist failure shown (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q3',
            question: 'What was the significance of the Truman Doctrine?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Truman Doctrine committed America to containing communism worldwide, marked the start of the Cold War, and established the principle of supporting free peoples against communist threats.',
            markingCriteria: {
              breakdown: ['Containment commitment (1 mark)', 'Start of Cold War (1 mark)', 'Supporting free peoples (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q4',
            question: 'How did the Marshall Plan help rebuild Europe?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The Marshall Plan provided economic aid to rebuild Western Europe, created markets for American goods, strengthened anti-communist governments, and helped prevent Soviet expansion.',
            markingCriteria: {
              breakdown: ['Economic aid provided (2 marks)', 'Created American markets (1 mark)', 'Strengthened anti-communist governments (2 marks)', 'Prevented Soviet expansion (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q5',
            question: 'What caused the Berlin Blockade of 1948-49?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Stalin blocked access to West Berlin in response to currency reform in western zones, to force the Allies out of Berlin, and to protest against the creation of West Germany.',
            markingCriteria: {
              breakdown: ['Currency reform response (1 mark)', 'Force Allies out (1 mark)', 'Protest West Germany creation (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q6',
            question: 'How did the formation of NATO change the Cold War?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'NATO created a military alliance against Soviet expansion, formalized Western unity, led to the creation of the Warsaw Pact, and divided Europe into two armed camps.',
            markingCriteria: {
              breakdown: ['Military alliance against USSR (2 marks)', 'Formalized Western unity (1 mark)', 'Led to Warsaw Pact (1 mark)', 'Divided Europe (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q7',
            question: 'What was the impact of the Hungarian Uprising of 1956?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The uprising showed Soviet willingness to use force to maintain control, demonstrated the limits of Western support for liberation, and revealed the weakness of the United Nations.',
            markingCriteria: {
              breakdown: ['Soviet use of force (1 mark)', 'Limits of Western support (1 mark)', 'UN weakness shown (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q8',
            question: 'How did the Cuban Missile Crisis bring the world close to nuclear war?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Soviet missiles in Cuba threatened the US, Kennedy imposed a naval blockade, both superpowers prepared for nuclear war, and only secret negotiations prevented conflict.',
            markingCriteria: {
              breakdown: ['Soviet missiles in Cuba (1 mark)', 'Naval blockade (1 mark)', 'Nuclear war preparation (2 marks)', 'Secret negotiations (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q9',
            question: 'What was détente and why did it develop in the 1960s-70s?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Détente was the relaxation of Cold War tensions, developed due to the nuclear arms race costs, mutual recognition of spheres of influence, and the need for cooperation.',
            markingCriteria: {
              breakdown: ['Relaxation of tensions (1 mark)', 'Arms race costs (1 mark)', 'Mutual recognition (1 mark)', 'Need for cooperation (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'east-west-q10',
            question: 'How did the Prague Spring of 1968 affect East-West relations?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The Prague Spring attempted liberal reforms in Czechoslovakia, was crushed by Soviet invasion, damaged Soviet relations with Western communist parties, and strengthened NATO resolve.',
            markingCriteria: {
              breakdown: ['Liberal reforms attempted (1 mark)', 'Soviet invasion (1 mark)', 'Damaged Western communist relations (2 marks)', 'Strengthened NATO (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'conflict-tension-asia',
        name: 'BD: Conflict and tension in Asia, 1950–1975',
        questions: [
          {
            id: 'asia-q1',
            question: 'What were the main causes of the Korean War?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Division of Korea after WWII, competing ideologies, North Korean invasion of the South, and Cold War tensions led to the Korean War.',
            markingCriteria: {
              breakdown: ['Korea division (1 mark)', 'Ideological competition (1 mark)', 'North invasion (1 mark)', 'Cold War context (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q2',
            question: 'How did the Vietnam War affect American society?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The war created massive protests, divided American society, led to the draft system criticism, and changed public trust in government.',
            markingCriteria: {
              breakdown: ['Protest movements (2 marks)', 'Social division (2 marks)', 'Government trust issues (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q3',
            question: 'Why did America become involved in Vietnam?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'America feared communist expansion in Southeast Asia, followed the domino theory, wanted to support South Vietnam, and maintain credibility.',
            markingCriteria: {
              breakdown: ['Fear of communist expansion (1 mark)', 'Domino theory (1 mark)', 'Support South Vietnam (1 mark)', 'Maintain credibility (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q4',
            question: 'What was the significance of the Tet Offensive?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The Tet Offensive showed Viet Cong strength, turned American public opinion against the war, demonstrated that victory was not imminent, and led to Johnson\'s decision not to seek re-election.',
            markingCriteria: {
              breakdown: ['Showed Viet Cong strength (2 marks)', 'Turned public opinion (2 marks)', 'Johnson decision impact (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q5',
            question: 'How did guerrilla warfare tactics affect the Vietnam conflict?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Guerrilla tactics allowed smaller forces to fight effectively, made it difficult to identify enemies, negated American technological advantages, and frustrated conventional military strategies.',
            markingCriteria: {
              breakdown: ['Effective small force fighting (1 mark)', 'Difficult enemy identification (1 mark)', 'Negated tech advantages (1 mark)', 'Frustrated strategies (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q6',
            question: 'What role did China play in the Korean War?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'China entered the war when UN forces approached its border, sent hundreds of thousands of troops, pushed UN forces back, and prevented total North Korean defeat.',
            markingCriteria: {
              breakdown: ['Entered when border threatened (2 marks)', 'Sent massive troops (2 marks)', 'Prevented NK defeat (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q7',
            question: 'Why was General MacArthur dismissed during the Korean War?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'MacArthur wanted to attack China directly, disagreed with Truman\'s limited war policy, made unauthorized statements, and threatened to escalate the conflict.',
            markingCriteria: {
              breakdown: ['Wanted to attack China (1 mark)', 'Disagreed with limited war (1 mark)', 'Unauthorized statements (1 mark)', 'Threatened escalation (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q8',
            question: 'What was the outcome of the Korean War?',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'The war ended in stalemate with an armistice, Korea remained divided at the 38th parallel, millions of casualties occurred, and no peace treaty was signed.',
            markingCriteria: {
              breakdown: ['Stalemate and armistice (2 marks)', 'Remained divided (2 marks)', 'Heavy casualties (1 mark)', 'No peace treaty (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q9',
            question: 'How did the My Lai Massacre affect American public opinion?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The massacre shocked the American public, increased anti-war sentiment, raised questions about military conduct, and damaged America\'s moral authority.',
            markingCriteria: {
              breakdown: ['Shocked American public (1 mark)', 'Increased anti-war sentiment (1 mark)', 'Questions about conduct (1 mark)', 'Damaged moral authority (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'asia-q10',
            question: 'What was Nixon\'s policy of Vietnamization?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Vietnamization involved training South Vietnamese forces to take over fighting, gradually withdrawing American troops, maintaining support through bombing, and seeking peace negotiations.',
            markingCriteria: {
              breakdown: ['Training South Vietnamese (2 marks)', 'Gradual withdrawal (2 marks)', 'Bombing support (1 mark)', 'Peace negotiations (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      },
      {
        id: 'conflict-tension-gulf',
        name: 'BE: Conflict and tension in the Gulf and Afghanistan, 1990–2009',
        questions: [
          {
            id: 'gulf-q1',
            question: 'What were the main causes of the Gulf War in 1991?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Iraq\'s invasion of Kuwait, threats to oil supplies, violation of international law, and UN Security Council resolutions led to the Gulf War.',
            markingCriteria: {
              breakdown: ['Kuwait invasion (1 mark)', 'Oil supply threats (1 mark)', 'International law violation (1 mark)', 'UN resolutions (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q2',
            question: 'How did the September 11 attacks change US foreign policy?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The attacks led to the War on Terror, invasions of Afghanistan and Iraq, increased homeland security, and the Bush Doctrine of preemptive strikes.',
            markingCriteria: {
              breakdown: ['War on Terror (1 mark)', 'Afghanistan/Iraq invasions (2 marks)', 'Homeland security (1 mark)', 'Bush Doctrine (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q3',
            question: 'Why did the US invade Afghanistan in 2001?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'The Taliban regime harbored Al-Qaeda terrorists, refused to hand over Osama bin Laden, supported international terrorism, and threatened global security.',
            markingCriteria: {
              breakdown: ['Harbored Al-Qaeda (1 mark)', 'Refused bin Laden handover (1 mark)', 'Supported terrorism (1 mark)', 'Global security threat (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q4',
            question: 'What were the consequences of the 2003 Iraq invasion?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The invasion removed Saddam Hussein, led to sectarian violence, destabilized the region, created refugee crisis, and damaged international relations.',
            markingCriteria: {
              breakdown: ['Removed Saddam (1 mark)', 'Sectarian violence (2 marks)', 'Regional instability (2 marks)', 'International damage (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q5',
            question: 'How did oil influence Western policy in the Gulf region?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Oil resources made the Gulf strategically important, drove Western intervention, influenced alliance choices, and shaped economic relationships.',
            markingCriteria: {
              breakdown: ['Strategic importance (1 mark)', 'Drove intervention (1 mark)', 'Influenced alliances (1 mark)', 'Shaped economics (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q6',
            question: 'What role did the UN play in the Gulf conflicts?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The UN authorized force against Iraq in 1991, imposed sanctions, conducted weapons inspections, but was divided over the 2003 invasion.',
            markingCriteria: {
              breakdown: ['Authorized 1991 force (2 marks)', 'Imposed sanctions (1 mark)', 'Weapons inspections (1 mark)', 'Divided over 2003 (2 marks)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q7',
            question: 'How did media coverage affect public opinion during these conflicts?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Live TV coverage brought warfare into homes, shaped public perception, influenced government policy, and created the "CNN effect" on decision-making.',
            markingCriteria: {
              breakdown: ['Live TV coverage (1 mark)', 'Shaped perception (1 mark)', 'Influenced policy (1 mark)', 'CNN effect (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q8',
            question: 'What challenges did coalition forces face in Iraq and Afghanistan?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Forces faced insurgency attacks, improvised explosive devices, cultural barriers, nation-building difficulties, and unclear exit strategies.',
            markingCriteria: {
              breakdown: ['Insurgency attacks (1 mark)', 'IEDs (1 mark)', 'Cultural barriers (1 mark)', 'Nation-building issues (2 marks)', 'Unclear exit strategies (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q9',
            question: 'How did the conflicts affect international alliances?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The conflicts strained NATO relationships, created new coalitions, tested UN authority, and changed diplomatic relationships globally.',
            markingCriteria: {
              breakdown: ['Strained NATO (1 mark)', 'New coalitions (1 mark)', 'Tested UN authority (1 mark)', 'Changed diplomacy (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          },
          {
            id: 'gulf-q10',
            question: 'What was the long-term impact of the War on Terror?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The War on Terror increased security measures, changed civil liberties, influenced foreign policy globally, and created ongoing regional instability.',
            markingCriteria: {
              breakdown: ['Increased security measures (1 mark)', 'Changed civil liberties (2 marks)', 'Global foreign policy influence (2 marks)', 'Regional instability (1 mark)']
            },
            specReference: 'AQA GCSE History 8145'
          }
        ]
      }
    ]
  },
  {
    id: 'english-literature',
    name: 'English Literature',
    topics: [
      {
        id: 'jekyll-and-hyde',
        name: 'Jekyll and Hyde – Robert Louis Stevenson',
        questions: [
          {
            id: 'jekyll-q1',
            question: 'What is Mr Hyde\'s first appearance like in the novella?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Hyde tramples over a young girl in the street, showing his callous nature. He is described as giving a strong feeling of deformity despite being physically normal.',
            markingCriteria: {
              breakdown: ['Reference to trampling incident (1 mark)', 'Description of deformity/appearance (1 mark)', 'Evidence from text (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q2',
            question: 'How does Jekyll describe his feelings when he transforms into Hyde?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Jekyll feels younger, lighter, and more vigorous. He experiences a sense of freedom and describes feeling "wicked" but also pleasantly liberated from moral constraints.',
            markingCriteria: {
              breakdown: ['Reference to feeling younger/lighter (1 mark)', 'Sense of freedom mentioned (1 mark)', 'Reference to wickedness (1 mark)', 'Use of quotations (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q3',
            question: 'Why does Utterson become suspicious about Jekyll\'s will?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The will leaves everything to Hyde, who Utterson has never met. The unusual clause about Jekyll\'s "disappearance" rather than death makes Utterson worried.',
            markingCriteria: {
              breakdown: ['Will leaves everything to Hyde (1 mark)', 'Reference to disappearance clause (1 mark)', 'Utterson\'s concern mentioned (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q4',
            question: 'What does the setting of London contribute to the novella\'s atmosphere?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'London is presented as foggy and dark, creating a Gothic atmosphere. The contrast between respectable areas and Soho reflects the duality theme. The fog symbolizes moral confusion and hidden secrets.',
            markingCriteria: {
              breakdown: ['Description of fog/darkness (2 marks)', 'Contrast between areas mentioned (2 marks)', 'Link to themes/symbolism (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q5',
            question: 'How does Stevenson present the character of Dr Lanyon?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Lanyon is presented as a rational, scientific man who represents conventional Victorian values. His horror at Jekyll\'s transformation shows the conflict between science and morality.',
            markingCriteria: {
              breakdown: ['Reference to rational/scientific nature (1 mark)', 'Represents conventional values (1 mark)', 'Horror at transformation (1 mark)', 'Science vs morality conflict (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q6',
            question: 'What is the significance of the laboratory door in the novella?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The door symbolizes the barrier between Jekyll\'s respectable public life and his secret, immoral activities as Hyde. It represents hidden secrets and dual identity.',
            markingCriteria: {
              breakdown: ['Symbolizes barrier/secrecy (1 mark)', 'Link to dual identity (1 mark)', 'Reference to public vs private (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q7',
            question: 'How does the theme of reputation feature in Jekyll and Hyde?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Victorian gentlemen prioritize reputation above all else. Jekyll creates Hyde to protect his reputation while indulging in immoral acts. The fear of scandal drives much of the plot and character motivation.',
            markingCriteria: {
              breakdown: ['Victorian importance of reputation (2 marks)', 'Jekyll\'s motivation to protect reputation (2 marks)', 'Impact on plot development (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q8',
            question: 'What does Hyde represent in Victorian society?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hyde represents the primitive, animalistic side of human nature that Victorian society tried to suppress. He embodies the fears about evolution and the beast within civilized man.',
            markingCriteria: {
              breakdown: ['Primitive/animalistic nature (1 mark)', 'What Victorian society suppressed (1 mark)', 'Link to evolution fears (1 mark)', 'Beast within civilized man (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q9',
            question: 'How does Stevenson use the narrative structure to create mystery?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The story is told through multiple perspectives, withholding Jekyll\'s confession until the end. Different narrators provide limited viewpoints, building suspense and mystery about Hyde\'s true identity.',
            markingCriteria: {
              breakdown: ['Multiple perspectives mentioned (2 marks)', 'Jekyll\'s confession at the end (2 marks)', 'Limited viewpoints create suspense (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jekyll-q10',
            question: 'What is the significance of Jekyll\'s final confession?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The confession reveals the truth about the dual identity and Jekyll\'s loss of control over his transformations. It shows his moral deterioration and the triumph of evil over good.',
            markingCriteria: {
              breakdown: ['Reveals truth about dual identity (1 mark)', 'Loss of control over transformations (1 mark)', 'Moral deterioration (1 mark)', 'Triumph of evil (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'christmas-carol',
        name: 'A Christmas Carol – Charles Dickens',
        questions: [
          {
            id: 'carol-q1',
            question: 'How is Scrooge presented at the beginning of the novella?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Scrooge is described as a "squeezing, wrenching, grasping" old sinner. He is cold, miserly, and shows no kindness to anyone, including his nephew and Bob Cratchit.',
            markingCriteria: {
              breakdown: ['Reference to descriptive language (1 mark)', 'Mention of coldness/miserly nature (1 mark)', 'Examples of unkindness (1 mark)', 'Use of quotations (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q2',
            question: 'What does the Ghost of Christmas Past show Scrooge?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The ghost shows Scrooge his lonely childhood, his time at Fezziwig\'s, and his broken engagement to Belle. These scenes reveal how Scrooge became bitter and alone.',
            markingCriteria: {
              breakdown: ['Reference to childhood scenes (1 mark)', 'Mention of Fezziwig or Belle (1 mark)', 'Link to character development (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q3',
            question: 'How does Dickens present the Cratchit family?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The Cratchits are presented as poor but happy and loving. Despite their poverty, they show gratitude and kindness. Tiny Tim represents innocence and the effects of social neglect on the vulnerable.',
            markingCriteria: {
              breakdown: ['Reference to poverty (1 mark)', 'Mention of happiness/love (1 mark)', 'Gratitude and kindness (1 mark)', 'Tiny Tim\'s significance (2 marks)', 'Social message (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q4',
            question: 'What is the significance of the chains worn by Marley\'s ghost?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The chains represent the burden of Marley\'s selfish and greedy life. Each link was forged through his lack of charity and social responsibility during his lifetime.',
            markingCriteria: {
              breakdown: ['Chains represent burden of selfish life (1 mark)', 'Link to greed/selfishness (1 mark)', 'Lack of charity mentioned (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q5',
            question: 'How does the Ghost of Christmas Present teach Scrooge about poverty?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The ghost shows Scrooge the struggles of the poor, including the Cratchits. He reveals how the poor make the best of their situations and shows Scrooge\'s responsibility to help others.',
            markingCriteria: {
              breakdown: ['Shows struggles of the poor (1 mark)', 'Reference to Cratchit family (1 mark)', 'Poor making the best of situations (1 mark)', 'Scrooge\'s responsibility mentioned (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q6',
            question: 'What does Ignorance and Want represent in the novella?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ignorance and Want are allegorical figures representing the social problems of Victorian society. They show the consequences of neglecting education and poverty, warning of social doom.',
            markingCriteria: {
              breakdown: ['Allegorical figures (1 mark)', 'Represent social problems (1 mark)', 'Link to education and poverty (1 mark)', 'Warning of consequences (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q7',
            question: 'How does Scrooge change by the end of the novella?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Scrooge becomes generous, kind, and socially responsible. He raises Bob\'s salary, helps Tiny Tim, and embraces his family. His transformation is complete and genuine.',
            markingCriteria: {
              breakdown: ['Becomes generous/kind (2 marks)', 'Specific examples of change (2 marks)', 'Genuine transformation noted (1 mark)', 'Social responsibility (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q8',
            question: 'What is the role of Fred, Scrooge\'s nephew, in the story?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Fred represents the Christmas spirit of joy, generosity, and family love. He persistently invites Scrooge to Christmas dinner, showing forgiveness and kindness despite rejection.',
            markingCriteria: {
              breakdown: ['Represents Christmas spirit (1 mark)', 'Shows persistence and kindness (1 mark)', 'Example of forgiveness (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q9',
            question: 'How does Dickens use the setting of Victorian London?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'London is presented as divided between rich and poor areas. The cold, dark streets reflect Scrooge\'s character, while Christmas warmth in homes shows love and community that Scrooge lacks.',
            markingCriteria: {
              breakdown: ['Division between rich and poor (2 marks)', 'Cold/dark reflecting character (2 marks)', 'Contrast with Christmas warmth (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'carol-q10',
            question: 'What is Dickens\' message about social responsibility in A Christmas Carol?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Dickens argues that the wealthy have a duty to help the poor. Scrooge\'s transformation shows how individual change can impact society. Everyone should be their "brother\'s keeper."',
            markingCriteria: {
              breakdown: ['Wealthy duty to help poor (1 mark)', 'Individual change impacts society (1 mark)', 'Reference to "brother\'s keeper" (1 mark)', 'Dickens\' social message (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'great-expectations',
        name: 'Great Expectations – Charles Dickens',
        questions: [
          {
            id: 'expectations-q1',
            question: 'How does Pip feel about his background at the beginning of the novel?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Pip is initially content with his humble background and loves Joe. He is grateful for Joe\'s kindness and doesn\'t feel ashamed of being a blacksmith\'s apprentice.',
            markingCriteria: {
              breakdown: ['Content with humble background (1 mark)', 'Love for Joe mentioned (1 mark)', 'Not ashamed initially (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q2',
            question: 'What effect does meeting Estella have on Pip?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Estella makes Pip feel ashamed of his appearance and background. She calls him "common" and criticizes his hands and boots, making him desire to become a gentleman.',
            markingCriteria: {
              breakdown: ['Makes Pip feel ashamed (1 mark)', 'Reference to "common" comment (1 mark)', 'Criticizes appearance (1 mark)', 'Desire to become gentleman (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q3',
            question: 'How does Dickens present Miss Havisham\'s appearance?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Miss Havisham wears a yellowed wedding dress and one shoe. Her appearance is described as withered and corpse-like, with clocks stopped at twenty minutes to nine, symbolizing her frozen life.',
            markingCriteria: {
              breakdown: ['Wedding dress described (1 mark)', 'Yellowed/decayed appearance (1 mark)', 'One shoe detail (1 mark)', 'Corpse-like description (1 mark)', 'Stopped clocks (1 mark)', 'Symbolism mentioned (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q4',
            question: 'What role does Magwitch play in Pip\'s story?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Magwitch is the convict Pip helps as a child who later becomes his secret benefactor. He funds Pip\'s education and lifestyle, revealing that Pip\'s expectations come from a criminal, not Miss Havisham.',
            markingCriteria: {
              breakdown: ['Convict Pip helped (1 mark)', 'Secret benefactor (1 mark)', 'Funds Pip\'s lifestyle (1 mark)', 'Revelation about expectations (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q5',
            question: 'How does Pip\'s attitude toward Joe change throughout the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Initially loving, Pip becomes ashamed of Joe when he gains social aspirations. He treats Joe coldly and feels embarrassed by his visit to London. Eventually, Pip realizes Joe\'s true worth and feels deep remorse.',
            markingCriteria: {
              breakdown: ['Initially loving relationship (1 mark)', 'Becomes ashamed (1 mark)', 'Cold treatment (1 mark)', 'Embarrassment in London (1 mark)', 'Realizes Joe\'s worth (1 mark)', 'Shows remorse (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q6',
            question: 'What does Satis House represent in the novel?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Satis House represents decay and the corruption of wealth. The house is frozen in time like Miss Havisham, symbolizing how the past can destroy the present and future.',
            markingCriteria: {
              breakdown: ['Represents decay/corruption (1 mark)', 'Frozen in time (1 mark)', 'Past destroying present/future (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q7',
            question: 'How does Dickens explore the theme of social class in the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Dickens shows that true worth comes from character, not wealth or birth. Pip learns that Joe and Biddy are better people than the wealthy characters he initially admires. Social mobility can corrupt moral values.',
            markingCriteria: {
              breakdown: ['True worth from character (2 marks)', 'Joe and Biddy better than wealthy (2 marks)', 'Social mobility corrupts (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q8',
            question: 'What is the significance of the forge in Great Expectations?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The forge represents honest labor, simplicity, and moral values. It contrasts with the corruption of wealth and shows where Pip was truly happy before his "great expectations."',
            markingCriteria: {
              breakdown: ['Represents honest labor (1 mark)', 'Simplicity and moral values (1 mark)', 'Contrasts with corruption (1 mark)', 'Where Pip was happy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q9',
            question: 'How does Pip\'s character develop by the end of the novel?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Pip becomes humble, grateful, and morally mature. He learns to value true friendship and love over social status. He works hard and pays his debts, showing genuine character growth.',
            markingCriteria: {
              breakdown: ['Becomes humble and grateful (1 mark)', 'Values friendship over status (1 mark)', 'Works hard (1 mark)', 'Character growth shown (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'expectations-q10',
            question: 'What message does Dickens convey about wealth and happiness?',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Dickens suggests that wealth does not bring happiness and can corrupt moral character. True contentment comes from love, honest work, and genuine relationships rather than social status.',
            markingCriteria: {
              breakdown: ['Wealth doesn\'t bring happiness (1 mark)', 'Can corrupt character (1 mark)', 'True contentment from love/work/relationships (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'jane-eyre',
        name: 'Jane Eyre – Charlotte Brontë',
        questions: [
          {
            id: 'jane-q1',
            question: 'How is Jane treated at Gateshead Hall?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Jane is treated cruelly by her aunt Mrs Reed and her cousins. She is excluded from family activities, called wicked, and locked in the red room as punishment.',
            markingCriteria: {
              breakdown: ['Treated cruelly by family (1 mark)', 'Excluded from activities (1 mark)', 'Red room punishment (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q2',
            question: 'What does Jane learn at Lowood School?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Jane receives an education and learns to be independent. She develops her character through hardship and forms a friendship with Helen Burns who teaches her about forgiveness and patience.',
            markingCriteria: {
              breakdown: ['Receives education (1 mark)', 'Learns independence (1 mark)', 'Friendship with Helen Burns (1 mark)', 'Learns forgiveness/patience (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q3',
            question: 'How does Jane show her independence when she first meets Rochester?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Jane speaks to Rochester as an equal, not showing the deference expected from a governess. She is honest and direct in her responses, refusing to be intimidated by his higher social status.',
            markingCriteria: {
              breakdown: ['Speaks as an equal (1 mark)', 'No deference expected (1 mark)', 'Honest and direct (1 mark)', 'Not intimidated by status (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q4',
            question: 'What is the significance of the fire at Thornfield?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The fire reveals Bertha\'s presence and danger. Jane saves Rochester, showing her courage and love. The incident foreshadows the later revelation about Rochester\'s wife and creates Gothic atmosphere.',
            markingCriteria: {
              breakdown: ['Reveals Bertha\'s presence (1 mark)', 'Jane shows courage (1 mark)', 'Demonstrates love (1 mark)', 'Foreshadows revelation (1 mark)', 'Gothic atmosphere (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q5',
            question: 'Why does Jane refuse to become Rochester\'s mistress?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Jane refuses because of her moral principles and self-respect. She believes she would lose her independence and dignity. She insists on equality in their relationship.',
            markingCriteria: {
              breakdown: ['Moral principles mentioned (1 mark)', 'Self-respect (1 mark)', 'Would lose independence (1 mark)', 'Insists on equality (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q6',
            question: 'How does Brontë present Bertha Mason in the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Bertha is presented as violent, animalistic, and mad. She represents everything Jane is not - uncontrolled passion and loss of reason. She symbolizes the "madwoman in the attic" and Victorian fears about female sexuality.',
            markingCriteria: {
              breakdown: ['Violent and animalistic (1 mark)', 'Represents uncontrolled passion (1 mark)', 'Contrast to Jane (1 mark)', 'Loss of reason (1 mark)', 'Victorian fears (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q7',
            question: 'What does St John Rivers represent in Jane\'s journey?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'St John represents religious duty without love. He offers Jane security and purpose but would suppress her passionate nature. He shows Jane what she would become without love and warmth.',
            markingCriteria: {
              breakdown: ['Religious duty without love (1 mark)', 'Offers security but suppresses passion (1 mark)', 'Shows life without love (1 mark)', 'Contrast to Rochester (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q8',
            question: 'How does the red room scene affect Jane?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The red room terrifies Jane and makes her see visions. It represents her feeling of being trapped and powerless. The experience strengthens her determination to never be imprisoned again.',
            markingCriteria: {
              breakdown: ['Terrifies Jane/causes visions (1 mark)', 'Represents being trapped (1 mark)', 'Strengthens determination (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q9',
            question: 'How does Jane change by the end of the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Jane gains financial independence through her inheritance, giving her equality with Rochester. She returns to him by choice, not necessity. She has grown from a powerless child to an independent woman who can marry as an equal.',
            markingCriteria: {
              breakdown: ['Gains financial independence (2 marks)', 'Equality with Rochester (1 mark)', 'Returns by choice (1 mark)', 'Growth from powerless to independent (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'jane-q10',
            question: 'What does the novel suggest about women\'s roles in Victorian society?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The novel challenges Victorian expectations by presenting Jane as independent and equal. It suggests women should have moral and intellectual equality with men, not just be dependent wives or governesses.',
            markingCriteria: {
              breakdown: ['Challenges Victorian expectations (1 mark)', 'Jane as independent and equal (1 mark)', 'Moral and intellectual equality (1 mark)', 'More than dependent wives (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'frankenstein',
        name: 'Frankenstein (1831) – Mary Shelley',
        questions: [
          {
            id: 'frank-q1',
            question: 'What motivates Victor Frankenstein to create life?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Victor is motivated by scientific ambition and the desire to overcome death. He wants to discover the secret of life and become famous for his scientific achievement.',
            markingCriteria: {
              breakdown: ['Scientific ambition (1 mark)', 'Desire to overcome death (1 mark)', 'Discover secret of life (1 mark)', 'Fame/achievement (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q2',
            question: 'How does the creature learn about human society?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The creature learns by observing the De Lacey family through their cottage window. He also learns to read through books like Paradise Lost, which shape his understanding of good and evil.',
            markingCriteria: {
              breakdown: ['Observes De Lacey family (1 mark)', 'Learns through window watching (1 mark)', 'Reads books like Paradise Lost (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q3',
            question: 'Why does the creature kill William?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The creature kills William out of revenge against Victor. When William reveals he is a Frankenstein, the creature realizes he can hurt Victor by destroying what he loves.',
            markingCriteria: {
              breakdown: ['Revenge against Victor (1 mark)', 'William reveals surname (1 mark)', 'Creature realizes connection (1 mark)', 'Wants to hurt what Victor loves (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q4',
            question: 'How does Victor react when he first sees his completed creation?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Victor is horrified and disgusted by his creation\'s appearance. He immediately abandons the creature and flees, showing his lack of responsibility as a creator.',
            markingCriteria: {
              breakdown: ['Horrified and disgusted (1 mark)', 'Abandons the creature (1 mark)', 'Flees/shows irresponsibility (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q5',
            question: 'What does the creature demand from Victor?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The creature demands that Victor create a female companion for him. He argues he has the right to happiness and companionship, and threatens to make Victor\'s life miserable if refused.',
            markingCriteria: {
              breakdown: ['Demands female companion (1 mark)', 'Right to happiness (1 mark)', 'Need for companionship (1 mark)', 'Threatens Victor (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q6',
            question: 'How does Shelley explore the theme of isolation in the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Both Victor and the creature experience isolation. Victor isolates himself through his obsessive work, while the creature is rejected by society due to his appearance. Their isolation leads to destructive behavior and tragedy.',
            markingCriteria: {
              breakdown: ['Victor\'s self-isolation (2 marks)', 'Creature\'s social rejection (2 marks)', 'Leads to destructive behavior (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q7',
            question: 'What role does nature play in the novel?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Nature provides comfort and healing for Victor when he is troubled. The sublime landscapes reflect Romantic ideals and contrast with the unnatural act of creating life artificially.',
            markingCriteria: {
              breakdown: ['Provides comfort/healing (1 mark)', 'Reflects Romantic ideals (1 mark)', 'Sublime landscapes (1 mark)', 'Contrasts with artificial creation (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q8',
            question: 'How does the creature compare himself to Adam and Satan?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The creature sees himself as Adam because he is the first of his kind, but also like Satan because he is rejected and becomes evil. Unlike Adam, he has no Eve and no loving creator, making him more like the fallen angel.',
            markingCriteria: {
              breakdown: ['Comparison to Adam - first of kind (2 marks)', 'Comparison to Satan - rejected/evil (2 marks)', 'Differences noted - no Eve/loving creator (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q9',
            question: 'What happens to Victor at the end of the novel?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Victor dies pursuing the creature in the Arctic. He tells his story to Walton as a warning about the dangers of unchecked ambition and scientific pursuit.',
            markingCriteria: {
              breakdown: ['Dies in Arctic pursuit (1 mark)', 'Tells story to Walton (1 mark)', 'Warning about ambition (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'frank-q10',
            question: 'What does the novel suggest about scientific responsibility?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The novel warns that scientific progress without moral consideration is dangerous. Victor fails to consider the consequences of his actions or take responsibility for his creation, leading to tragedy.',
            markingCriteria: {
              breakdown: ['Scientific progress without morality dangerous (1 mark)', 'Victor fails to consider consequences (1 mark)', 'Doesn\'t take responsibility (1 mark)', 'Leads to tragedy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'pride-and-prejudice',
        name: 'Pride and Prejudice – Jane Austen',
        questions: [
          {
            id: 'pride-q1',
            question: 'What is Elizabeth\'s first impression of Mr Darcy?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Elizabeth thinks Darcy is proud, arrogant, and disagreeable. She overhears him saying she is "tolerable" but "not handsome enough to tempt" him at the ball.',
            markingCriteria: {
              breakdown: ['Thinks he is proud/arrogant (1 mark)', 'Finds him disagreeable (1 mark)', 'Reference to "tolerable" comment (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q2',
            question: 'How does Austen present different types of marriage in the novel?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Austen shows marriage for love (Elizabeth and Darcy), convenience (Charlotte and Collins), passion (Lydia and Wickham), and financial security (marriages sought by Mrs Bennet). Each type has different consequences.',
            markingCriteria: {
              breakdown: ['Marriage for love - Elizabeth/Darcy (1 mark)', 'Convenience - Charlotte/Collins (1 mark)', 'Passion - Lydia/Wickham (1 mark)', 'Financial security (1 mark)', 'Different consequences (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q3',
            question: 'Why does Charlotte Lucas marry Mr Collins?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Charlotte marries Collins for security and social position. At 27, she feels she has few other options for marriage and values practical considerations over love.',
            markingCriteria: {
              breakdown: ['For security and position (1 mark)', 'Age consideration - 27 (1 mark)', 'Few other options (1 mark)', 'Values practical over love (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q4',
            question: 'How does Wickham deceive Elizabeth?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Wickham lies about his relationship with Darcy, claiming Darcy ruined his life and denied him a living. He presents himself as charming and wronged, appealing to Elizabeth\'s prejudice against Darcy.',
            markingCriteria: {
              breakdown: ['Lies about relationship with Darcy (1 mark)', 'Claims Darcy ruined his life (1 mark)', 'Presents himself as charming/wronged (1 mark)', 'Appeals to Elizabeth\'s prejudice (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q5',
            question: 'What does Darcy reveal in his letter to Elizabeth?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Darcy explains his actions regarding Wickham\'s true character and his reasons for separating Bingley from Jane. He reveals Wickham attempted to elope with his sister Georgiana for her fortune.',
            markingCriteria: {
              breakdown: ['Explains Wickham\'s true character (2 marks)', 'Reasons for separating Bingley/Jane (2 marks)', 'Wickham\'s attempt with Georgiana (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q6',
            question: 'How does Elizabeth change throughout the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Elizabeth learns to overcome her prejudice and quick judgments. She realizes her mistakes about Darcy and Wickham, develops greater self-awareness, and learns to value substance over surface charm.',
            markingCriteria: {
              breakdown: ['Overcomes prejudice (2 marks)', 'Realizes mistakes about characters (2 marks)', 'Develops self-awareness/values substance (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q7',
            question: 'What role does Lady Catherine de Bourgh play in the novel?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Lady Catherine represents aristocratic arrogance and interference. Her attempt to prevent Elizabeth from marrying Darcy actually encourages their union by revealing Elizabeth\'s feelings to Darcy.',
            markingCriteria: {
              breakdown: ['Represents aristocratic arrogance (1 mark)', 'Interferes in relationships (1 mark)', 'Attempts to prevent marriage (1 mark)', 'Actually encourages union (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q8',
            question: 'How does Austen use irony in the novel\'s opening?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The famous opening "It is a truth universally acknowledged..." is ironic because it\'s actually women seeking husbands, not men seeking wives, that drives the plot.',
            markingCriteria: {
              breakdown: ['Famous opening quoted (1 mark)', 'Actually women seeking husbands (1 mark)', 'Not men seeking wives (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q9',
            question: 'What does Pemberley represent in the novel?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Pemberley represents Darcy\'s true character - well-ordered, beautiful, and tasteful. Elizabeth\'s admiration of the estate reflects her growing appreciation of Darcy\'s real nature.',
            markingCriteria: {
              breakdown: ['Represents Darcy\'s true character (1 mark)', 'Well-ordered/beautiful/tasteful (1 mark)', 'Elizabeth\'s admiration (1 mark)', 'Growing appreciation of Darcy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'pride-q10',
            question: 'How does Austen criticize social class in the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Austen shows that worth comes from character, not birth or wealth. She satirizes social pretensions through characters like Mr Collins and Lady Catherine, while showing genuine merit in characters regardless of rank.',
            markingCriteria: {
              breakdown: ['Worth from character not birth/wealth (2 marks)', 'Satirizes social pretensions (2 marks)', 'Shows merit regardless of rank (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'sign-of-four',
        name: 'The Sign of Four – Sir Arthur Conan Doyle',
        questions: [
          {
            id: 'sign-q1',
            question: 'What method does Holmes use to solve cases?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Holmes uses observation and logical deduction. He notices small details that others miss and draws logical conclusions from them, applying scientific methods to detection.',
            markingCriteria: {
              breakdown: ['Uses observation (1 mark)', 'Logical deduction (1 mark)', 'Notices small details (1 mark)', 'Scientific methods (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q2',
            question: 'How does Holmes deduce information about Watson\'s brother from his watch?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Holmes deduces that Watson\'s brother was careless, often drunk, and eventually died from alcoholism. He bases this on scratches around the keyhole, pawnbroker marks, and the watch\'s condition.',
            markingCriteria: {
              breakdown: ['Brother was careless (1 mark)', 'Often drunk (1 mark)', 'Died from alcoholism (1 mark)', 'Scratches around keyhole (1 mark)', 'Pawnbroker marks (1 mark)', 'Watch condition (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q3',
            question: 'Who asks Holmes to solve the mystery of the treasure?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Mary Morstan asks Holmes to solve the mystery. She has been receiving pearls annually and receives a letter asking her to meet about the Agra treasure.',
            markingCriteria: {
              breakdown: ['Mary Morstan asks Holmes (1 mark)', 'Receiving pearls annually (1 mark)', 'Letter about Agra treasure (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q4',
            question: 'What is the significance of the wooden leg and Tonga?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The wooden leg belongs to Jonathan Small, one of the criminals. Tonga is his Andaman Islander companion who helps him commit murders using poisoned darts.',
            markingCriteria: {
              breakdown: ['Wooden leg belongs to Jonathan Small (1 mark)', 'Small is a criminal (1 mark)', 'Tonga is Andaman Islander (1 mark)', 'Uses poisoned darts (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q5',
            question: 'How does the story of the Agra treasure begin?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The treasure originates during the Indian Mutiny when four men - Small, Mahomet Singh, Abdullah Khan, and Dost Akbar - steal treasure from a merchant. They bury it and swear an oath of loyalty.',
            markingCriteria: {
              breakdown: ['Originates during Indian Mutiny (1 mark)', 'Four men involved (2 marks)', 'Steal from merchant (1 mark)', 'Bury the treasure (1 mark)', 'Swear oath of loyalty (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q6',
            question: 'What role does Watson play in the investigation?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Watson acts as Holmes\' assistant and narrator. He provides medical expertise, follows leads, and offers emotional support. He also develops romantic feelings for Mary Morstan.',
            markingCriteria: {
              breakdown: ['Acts as assistant/narrator (1 mark)', 'Provides medical expertise (1 mark)', 'Follows leads/offers support (1 mark)', 'Romantic feelings for Mary (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q7',
            question: 'How does Doyle present Victorian attitudes to empire in the novel?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The novel reflects Victorian imperial attitudes through the Indian setting, colonial characters, and assumptions about racial superiority. The treasure represents the wealth extracted from colonies.',
            markingCriteria: {
              breakdown: ['Reflects imperial attitudes (2 marks)', 'Indian setting/colonial characters (2 marks)', 'Assumptions about racial superiority (1 mark)', 'Treasure represents colonial wealth (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q8',
            question: 'What happens to the Agra treasure at the end?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Jonathan Small throws the treasure into the Thames during the boat chase. The treasure is lost forever, ensuring that no one can benefit from it.',
            markingCriteria: {
              breakdown: ['Small throws treasure in Thames (1 mark)', 'During boat chase (1 mark)', 'Lost forever (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q9',
            question: 'How does Doyle create suspense during the boat chase?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Doyle uses fast-paced action, the danger of Tonga\'s poisoned darts, the race against time, and detailed descriptions of the Thames chase to build tension and excitement.',
            markingCriteria: {
              breakdown: ['Fast-paced action (1 mark)', 'Danger of poisoned darts (1 mark)', 'Race against time (1 mark)', 'Detailed Thames descriptions (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'sign-q10',
            question: 'What does the novel suggest about justice and revenge?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The novel explores the cycle of injustice and revenge. Small seeks revenge for his treatment, but his actions lead to more violence. True justice comes through legal processes, not personal vengeance.',
            markingCriteria: {
              breakdown: ['Explores cycle of injustice/revenge (1 mark)', 'Small seeks revenge (1 mark)', 'Actions lead to more violence (1 mark)', 'True justice through legal processes (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'macbeth',
        name: 'Macbeth',
        questions: [
          {
            id: 'macbeth-q1',
            question: 'What do the witches prophesy to Macbeth?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The witches prophesy that Macbeth will become Thane of Cawdor and then King of Scotland. They also tell Banquo his sons will be kings.',
            markingCriteria: {
              breakdown: ['Thane of Cawdor (1 mark)', 'King of Scotland (1 mark)', 'Banquo\'s sons will be kings (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q2',
            question: 'How does Lady Macbeth persuade Macbeth to kill Duncan?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Lady Macbeth questions Macbeth\'s manhood, calls him a coward, and uses emotional manipulation. She also provides practical plans for the murder and promises to take charge.',
            markingCriteria: {
              breakdown: ['Questions his manhood (2 marks)', 'Calls him coward (1 mark)', 'Emotional manipulation (1 mark)', 'Provides practical plans (1 mark)', 'Promises to take charge (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q3',
            question: 'What does Macbeth see before he murders Duncan?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Macbeth sees a bloody dagger floating in the air, pointing toward Duncan\'s chamber. This hallucination reflects his guilt and the evil nature of his intended act.',
            markingCriteria: {
              breakdown: ['Sees bloody dagger (1 mark)', 'Floating in air (1 mark)', 'Points to Duncan\'s chamber (1 mark)', 'Reflects guilt/evil (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q4',
            question: 'How does Macbeth change after becoming king?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Macbeth becomes paranoid, ruthless, and tyrannical. He orders more murders to secure his power, loses his humanity, and becomes increasingly isolated from others.',
            markingCriteria: {
              breakdown: ['Becomes paranoid (1 mark)', 'Ruthless and tyrannical (2 marks)', 'Orders more murders (1 mark)', 'Loses humanity (1 mark)', 'Becomes isolated (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q5',
            question: 'What role do the apparitions play in the story?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The apparitions give Macbeth false confidence through misleading prophecies. They tell him no man born of woman can harm him and he won\'t be defeated until Birnam Wood moves.',
            markingCriteria: {
              breakdown: ['Give false confidence (1 mark)', 'Misleading prophecies (1 mark)', 'No man born of woman (1 mark)', 'Birnam Wood moves (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q6',
            question: 'How does Lady Macbeth\'s character change throughout the play?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Lady Macbeth starts as strong and manipulative but gradually becomes guilt-ridden and mentally unstable. She sleepwalks, tries to wash imaginary bloodstains, and eventually dies.',
            markingCriteria: {
              breakdown: ['Starts strong and manipulative (2 marks)', 'Becomes guilt-ridden (1 mark)', 'Mentally unstable (1 mark)', 'Sleepwalks/bloodstains (1 mark)', 'Eventually dies (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q7',
            question: 'What is the significance of sleep in the play?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sleep represents peace, innocence, and natural order. Macbeth "murders sleep" when he kills Duncan, and his insomnia reflects his guilt and loss of peace.',
            markingCriteria: {
              breakdown: ['Represents peace/innocence (1 mark)', 'Natural order (1 mark)', '"Murders sleep" phrase (1 mark)', 'Insomnia reflects guilt (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q8',
            question: 'How does Shakespeare present the theme of guilt in Macbeth?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Guilt is shown through hallucinations, sleeplessness, and psychological breakdown. Both Macbeth and Lady Macbeth are tormented by their crimes, leading to madness and death.',
            markingCriteria: {
              breakdown: ['Shown through hallucinations (2 marks)', 'Sleeplessness (1 mark)', 'Psychological breakdown (1 mark)', 'Tormented by crimes (1 mark)', 'Leads to madness/death (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q9',
            question: 'What does Banquo represent in the play?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Banquo represents loyalty, honor, and the path Macbeth could have taken. His ghost symbolizes Macbeth\'s guilt and the consequences of betraying friendship.',
            markingCriteria: {
              breakdown: ['Represents loyalty/honor (1 mark)', 'Path Macbeth could have taken (1 mark)', 'Ghost symbolizes guilt (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'macbeth-q10',
            question: 'How does the play end and what does this suggest about evil?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Macbeth is killed by Macduff and Malcolm becomes king, restoring rightful order. This suggests that evil ultimately destroys itself and natural order will be restored.',
            markingCriteria: {
              breakdown: ['Macbeth killed by Macduff (1 mark)', 'Malcolm becomes king (1 mark)', 'Restores rightful order (1 mark)', 'Evil destroys itself (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'romeo-and-juliet',
        name: 'Romeo and Juliet',
        questions: [
          {
            id: 'romeo-q1',
            question: 'How do Romeo and Juliet first meet?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Romeo and Juliet meet at the Capulet party. They share a sonnet in their dialogue, kiss twice, and fall instantly in love without knowing each other\'s identities.',
            markingCriteria: {
              breakdown: ['Meet at Capulet party (1 mark)', 'Share sonnet dialogue (1 mark)', 'Kiss twice (1 mark)', 'Don\'t know identities (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q2',
            question: 'What causes the fight between Mercutio and Tybalt?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Tybalt wants to fight Romeo for attending the Capulet party. When Romeo refuses to fight, Mercutio draws his sword to defend Romeo\'s honor. Romeo tries to stop them but accidentally causes Mercutio\'s death.',
            markingCriteria: {
              breakdown: ['Tybalt wants to fight Romeo (2 marks)', 'Romeo refuses to fight (1 mark)', 'Mercutio defends Romeo\'s honor (2 marks)', 'Romeo accidentally causes death (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q3',
            question: 'Why does Juliet agree to marry Romeo so quickly?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Juliet believes in love at first sight and feels Romeo is different from other men. She values his sincerity and sees marriage as the only honorable way to be together.',
            markingCriteria: {
              breakdown: ['Love at first sight (1 mark)', 'Romeo is different/sincere (1 mark)', 'Marriage as honorable way (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q4',
            question: 'How does the Nurse help Romeo and Juliet?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The Nurse arranges their secret marriage by carrying messages between them. She helps Juliet meet Romeo and later brings news of Tybalt\'s death and Romeo\'s banishment.',
            markingCriteria: {
              breakdown: ['Arranges secret marriage (1 mark)', 'Carries messages (1 mark)', 'Helps them meet (1 mark)', 'Brings news of banishment (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q5',
            question: 'What is Friar Lawrence\'s plan to help Juliet avoid marrying Paris?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Friar Lawrence gives Juliet a potion that makes her appear dead. She will be placed in the family tomb, then wake up and escape with Romeo to Mantua when he returns.',
            markingCriteria: {
              breakdown: ['Gives Juliet potion (2 marks)', 'Makes her appear dead (1 mark)', 'Placed in tomb (1 mark)', 'Wake up and escape (1 mark)', 'Go to Mantua with Romeo (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q6',
            question: 'Why doesn\'t Romeo receive Friar Lawrence\'s message?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Friar John is quarantined due to plague fears and cannot deliver the letter. Romeo never learns about the plan, so he believes Juliet is really dead.',
            markingCriteria: {
              breakdown: ['Friar John quarantined (1 mark)', 'Plague fears (1 mark)', 'Romeo believes Juliet dead (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q7',
            question: 'How does Shakespeare present the theme of fate in the play?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The lovers are described as "star-crossed," suggesting destiny controls them. Coincidences and missed timing drive the tragedy, implying fate determines their doom.',
            markingCriteria: {
              breakdown: ['"Star-crossed" lovers (2 marks)', 'Destiny controls them (1 mark)', 'Coincidences and timing (2 marks)', 'Fate determines doom (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q8',
            question: 'What role does the family feud play in the tragedy?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The feud forces Romeo and Juliet to marry secretly, creates the conflict that leads to deaths, and prevents them from seeking family help when problems arise.',
            markingCriteria: {
              breakdown: ['Forces secret marriage (1 mark)', 'Creates deadly conflict (1 mark)', 'Prevents seeking help (1 mark)', 'Direct cause of tragedy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q9',
            question: 'How do both lovers die?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Romeo drinks poison believing Juliet is dead. When Juliet wakes and finds Romeo dead, she stabs herself with his dagger rather than live without him.',
            markingCriteria: {
              breakdown: ['Romeo drinks poison (1 mark)', 'Believes Juliet dead (1 mark)', 'Juliet wakes finds Romeo dead (1 mark)', 'Stabs herself with dagger (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'romeo-q10',
            question: 'What does the play suggest about young love?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Young love is presented as intense, passionate, and genuine but also impulsive and dangerous. The play shows both its beauty and its potential for destruction.',
            markingCriteria: {
              breakdown: ['Intense and passionate (1 mark)', 'Genuine but impulsive (1 mark)', 'Dangerous consequences (1 mark)', 'Both beauty and destruction (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'the-tempest',
        name: 'The Tempest',
        questions: [
          {
            id: 'tempest-q1',
            question: 'Why has Prospero been living on the island?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Prospero was the Duke of Milan but his brother Antonio usurped his position with help from Alonso. Prospero and Miranda were set adrift at sea and washed up on the island.',
            markingCriteria: {
              breakdown: ['Was Duke of Milan (1 mark)', 'Antonio usurped position (1 mark)', 'Alonso helped (1 mark)', 'Set adrift/washed up (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q2',
            question: 'How does Prospero control Ariel?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Prospero freed Ariel from a tree where the witch Sycorax had trapped him. In return, Ariel serves Prospero and will be freed when his service is complete.',
            markingCriteria: {
              breakdown: ['Freed Ariel from tree (1 mark)', 'Sycorax had trapped him (1 mark)', 'Serves until freedom granted (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q3',
            question: 'What is Caliban\'s relationship with Prospero?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Caliban is Prospero\'s reluctant slave. Prospero initially treated him kindly and taught him language, but Caliban attempted to rape Miranda, leading to his enslavement and resentment.',
            markingCriteria: {
              breakdown: ['Reluctant slave (1 mark)', 'Initially treated kindly (1 mark)', 'Taught him language (1 mark)', 'Attempted to rape Miranda (2 marks)', 'Led to enslavement/resentment (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q4',
            question: 'How does Ferdinand prove his love for Miranda?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ferdinand willingly performs hard labor carrying logs to prove his devotion to Miranda. He accepts Prospero\'s test patiently and declares his love genuine despite the hardship.',
            markingCriteria: {
              breakdown: ['Performs hard labor (1 mark)', 'Carrying logs (1 mark)', 'Accepts test patiently (1 mark)', 'Declares genuine love (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q5',
            question: 'What does Prospero do with his magic books at the end?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Prospero drowns his magic books in the sea and breaks his staff. He renounces magic to return to the human world and reclaim his dukedom.',
            markingCriteria: {
              breakdown: ['Drowns magic books (1 mark)', 'Breaks his staff (1 mark)', 'Renounces magic to return (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q6',
            question: 'How does Shakespeare explore the theme of forgiveness in the play?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Prospero forgives his enemies despite having the power to destroy them. He chooses mercy over revenge, showing that forgiveness is nobler than vengeance and leads to reconciliation.',
            markingCriteria: {
              breakdown: ['Prospero forgives enemies (2 marks)', 'Has power to destroy (1 mark)', 'Chooses mercy over revenge (1 mark)', 'Forgiveness nobler than vengeance (1 mark)', 'Leads to reconciliation (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q7',
            question: 'What role does magic play in the resolution of the play?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Magic allows Prospero to orchestrate events, bring his enemies to the island, and test their characters. Once justice is achieved and forgiveness granted, magic is no longer needed.',
            markingCriteria: {
              breakdown: ['Orchestrates events (1 mark)', 'Brings enemies to island (1 mark)', 'Tests their characters (1 mark)', 'No longer needed after forgiveness (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q8',
            question: 'How does Miranda react to seeing other humans?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Miranda is amazed and delighted, calling them a "brave new world" with such people in it. Having only known her father and Caliban, she finds other humans wonderful.',
            markingCriteria: {
              breakdown: ['Amazed and delighted (1 mark)', '"Brave new world" quote (1 mark)', 'Finds other humans wonderful (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q9',
            question: 'What does the tempest at the beginning symbolize?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The tempest symbolizes chaos, disruption of natural order, and divine retribution. It brings Prospero\'s enemies to face justice and represents the upheaval needed for resolution.',
            markingCriteria: {
              breakdown: ['Symbolizes chaos/disruption (1 mark)', 'Divine retribution (1 mark)', 'Brings enemies to justice (1 mark)', 'Upheaval needed for resolution (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'tempest-q10',
            question: 'How does the play end for all the characters?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Prospero forgives his enemies and regains his dukedom. Ferdinand and Miranda are engaged. Ariel is freed. Antonio and Sebastian are forgiven but unrepentant. All prepare to return to Italy.',
            markingCriteria: {
              breakdown: ['Prospero forgives/regains dukedom (1 mark)', 'Ferdinand and Miranda engaged (1 mark)', 'Ariel freed (1 mark)', 'Antonio/Sebastian forgiven but unrepentant (2 marks)', 'Return to Italy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'merchant-of-venice',
        name: 'The Merchant of Venice',
        questions: [
          {
            id: 'merchant-q1',
            question: 'How does Shylock\'s speech "Hath not a Jew eyes?" reveal his humanity?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The speech shows Shylock\'s pain and humanity by listing physical similarities between Jews and Christians. It reveals his desire for revenge stems from years of mistreatment and discrimination.',
            markingCriteria: {
              breakdown: ['Reference to physical similarities (1 mark)', 'Shows pain/humanity (1 mark)', 'Link to revenge motivation (1 mark)', 'Reference to discrimination (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q2',
            question: 'What does Portia\'s disguise as a lawyer reveal about her character?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Portia\'s disguise shows her intelligence, resourcefulness, and determination to save Antonio. It demonstrates her ability to navigate male-dominated legal world through wit and knowledge.',
            markingCriteria: {
              breakdown: ['Shows intelligence/resourcefulness (1 mark)', 'Determination to save Antonio (1 mark)', 'Navigating male-dominated world (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q3',
            question: 'How does the casket test reflect the theme of appearance versus reality?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The gold and silver caskets appear valuable but contain worthless items. The lead casket appears worthless but contains Portia\'s portrait. This reflects how things are not always what they seem.',
            markingCriteria: {
              breakdown: ['Gold/silver appear valuable but aren\'t (2 marks)', 'Lead appears worthless but valuable (2 marks)', 'Link to appearance vs reality theme (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q4',
            question: 'What role does money play in Antonio and Bassanio\'s friendship?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Antonio lends money to Bassanio without interest, showing true friendship. However, this creates the debt that leads to the bond with Shylock and Antonio\'s near-death.',
            markingCriteria: {
              breakdown: ['Antonio lends without interest (1 mark)', 'Shows true friendship (1 mark)', 'Creates debt problem (1 mark)', 'Leads to dangerous bond (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q5',
            question: 'How does Jessica\'s elopement affect Shylock?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Jessica\'s elopement devastates Shylock both emotionally and financially. He loses his daughter and his money, which increases his bitterness and desire for revenge against Antonio.',
            markingCriteria: {
              breakdown: ['Emotional devastation (1 mark)', 'Financial loss (1 mark)', 'Increases bitterness/revenge (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q6',
            question: 'What does the ring plot reveal about love and trust?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The ring plot tests the loyalty between spouses versus friends. It shows how Portia tests Bassanio\'s priorities and ultimately strengthens their relationship through forgiveness.',
            markingCriteria: {
              breakdown: ['Tests loyalty spouses vs friends (1 mark)', 'Portia tests Bassanio\'s priorities (1 mark)', 'Strengthens relationship (1 mark)', 'Through forgiveness (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q7',
            question: 'How does Venice as a setting influence the play\'s themes?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Venice represents a multicultural trading center where different religions and cultures meet. The city\'s laws and commerce drive the plot, while religious tensions reflect contemporary prejudices.',
            markingCriteria: {
              breakdown: ['Multicultural trading center (2 marks)', 'Laws and commerce drive plot (2 marks)', 'Religious tensions and prejudices (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q8',
            question: 'What is the significance of mercy in the trial scene?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Portia\'s "quality of mercy" speech emphasizes Christian forgiveness over Old Testament justice. However, the Christians show little mercy to Shylock, revealing their hypocrisy.',
            markingCriteria: {
              breakdown: ['Portia\'s mercy speech (1 mark)', 'Christian forgiveness vs justice (1 mark)', 'Christians lack mercy to Shylock (1 mark)', 'Reveals hypocrisy (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q9',
            question: 'How does Launcelot Gobbo provide comic relief in the play?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Launcelot provides comic relief through his wordplay, confused identity with his father, and his decision to leave Shylock\'s service. His humor lightens the play\'s serious themes.',
            markingCriteria: {
              breakdown: ['Wordplay and humor (1 mark)', 'Confused identity with father (1 mark)', 'Lightens serious themes (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'merchant-q10',
            question: 'What does the play suggest about justice versus revenge?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Shylock seeks revenge through the law, believing it\'s justice for his mistreatment. The trial shows how justice can be manipulated, and ultimately neither true justice nor mercy is achieved.',
            markingCriteria: {
              breakdown: ['Shylock seeks revenge through law (2 marks)', 'Believes it\'s justice for mistreatment (1 mark)', 'Justice can be manipulated (2 marks)', 'Neither justice nor mercy achieved (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'much-ado-about-nothing',
        name: 'Much Ado About Nothing',
        questions: [
          {
            id: 'much-ado-q1',
            question: 'How do Beatrice and Benedick\'s "merry war" of words reveal their characters?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Their witty exchanges show both characters are intelligent, proud, and defensive about love. Their verbal sparring masks deeper feelings and reveals their well-matched personalities.',
            markingCriteria: {
              breakdown: ['Shows intelligence and wit (1 mark)', 'Pride and defensiveness (1 mark)', 'Masks deeper feelings (1 mark)', 'Well-matched personalities (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q2',
            question: 'What role does gossip and eavesdropping play in the plot?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Eavesdropping drives both main plots: the trick to make Beatrice and Benedick fall in love, and Don John\'s deception about Hero. It shows how easily people can be manipulated by what they hear.',
            markingCriteria: {
              breakdown: ['Drives Beatrice/Benedick plot (2 marks)', 'Don John\'s deception plot (2 marks)', 'Shows manipulation through hearing (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q3',
            question: 'How does Hero\'s supposed death affect the other characters?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Hero\'s supposed death devastates her father Leonato and shocks Claudio into guilt. Beatrice demands Benedick prove his love by challenging Claudio, testing their new relationship.',
            markingCriteria: {
              breakdown: ['Devastates Leonato (1 mark)', 'Claudio feels guilt (1 mark)', 'Tests Beatrice and Benedick (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q4',
            question: 'What does Don John represent as a character type?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Don John is the "bastard villain" who resents his illegitimate status and social position. He represents jealousy, malcontent, and the threat to social harmony in comedy.',
            markingCriteria: {
              breakdown: ['Bastard villain type (1 mark)', 'Resents illegitimate status (1 mark)', 'Represents jealousy/malcontent (1 mark)', 'Threat to social harmony (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q5',
            question: 'How does the theme of appearance versus reality feature in the play?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Characters constantly misinterpret what they see and hear. Hero appears unchaste but is innocent. Beatrice and Benedick appear to hate each other but fall in love. Nothing is as it first appears.',
            markingCriteria: {
              breakdown: ['Characters misinterpret evidence (2 marks)', 'Hero appears unchaste but innocent (2 marks)', 'Beatrice/Benedick appear to hate but love (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q6',
            question: 'What is the significance of honor in the play?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Honor, particularly female chastity, is crucial to Elizabethan society. Hero\'s accused loss of honor threatens her family\'s reputation and shows the vulnerability of women\'s reputations.',
            markingCriteria: {
              breakdown: ['Female chastity and honor (1 mark)', 'Threatens family reputation (1 mark)', 'Vulnerability of women\'s reputations (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q7',
            question: 'How does Dogberry provide comic relief?',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Dogberry uses malapropisms (wrong words) for humor and represents the bumbling but well-meaning authority figure. Ironically, his incompetence leads to uncovering the truth about Don John\'s plot.',
            markingCriteria: {
              breakdown: ['Uses malapropisms (1 mark)', 'Bumbling authority figure (1 mark)', 'Incompetence leads to truth (1 mark)', 'Comic irony (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q8',
            question: 'What does the masked ball scene reveal about identity and deception?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The masks allow characters to hide their true identities and speak more freely. It shows how easily people can be deceived and how masks can both conceal and reveal truth.',
            markingCriteria: {
              breakdown: ['Masks hide true identities (1 mark)', 'Allows freer speech (1 mark)', 'Shows ease of deception (1 mark)', 'Masks conceal and reveal (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q9',
            question: 'How does the play end with restoration of harmony?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Hero is revealed to be alive and innocent, Claudio is forgiven, and Beatrice and Benedick admit their love. The comic ending restores social order and celebrates love and marriage.',
            markingCriteria: {
              breakdown: ['Hero revealed alive and innocent (1 mark)', 'Couples united in love (1 mark)', 'Social order restored (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'much-ado-q10',
            question: 'What does the play suggest about the power of language?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Words can both create and destroy relationships. Beatrice and Benedick fight with words but also fall in love through overheard words. False words about Hero nearly destroy her, while true words restore her.',
            markingCriteria: {
              breakdown: ['Words create and destroy relationships (2 marks)', 'Beatrice/Benedick fight and love through words (2 marks)', 'False vs true words about Hero (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      },
      {
        id: 'julius-caesar',
        name: 'Julius Caesar',
        questions: [
          {
            id: 'caesar-q1',
            question: 'How does Brutus justify joining the conspiracy against Caesar?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Brutus believes Caesar will become a tyrant if crowned king. He claims to love Caesar but loves Rome more, arguing that Caesar\'s death is necessary for the greater good of the republic.',
            markingCriteria: {
              breakdown: ['Caesar will become tyrant (1 mark)', 'Loves Caesar but loves Rome more (1 mark)', 'Greater good of republic (1 mark)', 'Necessary for Rome\'s future (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q2',
            question: 'What does Caesar\'s reaction to the soothsayer\'s warning reveal about his character?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Caesar dismisses the soothsayer as a "dreamer," showing his arrogance and refusal to heed warnings. This reveals his hubris and belief that he is above fate and superstition.',
            markingCriteria: {
              breakdown: ['Dismisses as "dreamer" (1 mark)', 'Shows arrogance (1 mark)', 'Believes above fate/superstition (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q3',
            question: 'How does Cassius manipulate Brutus into joining the conspiracy?',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Cassius appeals to Brutus\'s honor and love of Rome. He uses flattery, forged letters supposedly from citizens, and reminds Brutus of his ancestor who founded the republic. He plays on Brutus\'s fears about Caesar\'s ambition.',
            markingCriteria: {
              breakdown: ['Appeals to honor and love of Rome (2 marks)', 'Uses flattery and forged letters (2 marks)', 'References ancestor/plays on fears (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q4',
            question: 'What is the significance of the storm in Act 1?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The storm reflects the political upheaval in Rome and foreshadows the chaos that will follow Caesar\'s assassination. It creates an ominous atmosphere and suggests divine displeasure.',
            markingCriteria: {
              breakdown: ['Reflects political upheaval (1 mark)', 'Foreshadows chaos after assassination (1 mark)', 'Creates ominous atmosphere (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q5',
            question: 'How does Antony use rhetoric in his funeral speech?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Antony repeatedly calls Brutus "honorable" with increasing irony. He shows Caesar\'s wounds and will to the crowd, uses emotional appeal, and gradually turns the crowd against the conspirators through skilled manipulation.',
            markingCriteria: {
              breakdown: ['Repeated "honorable" with irony (2 marks)', 'Shows wounds and will (2 marks)', 'Emotional appeal and manipulation (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q6',
            question: 'What does Portia\'s relationship with Brutus reveal about both characters?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Portia shows intelligence and devotion by demanding to know Brutus\'s secrets. Brutus\'s reluctance to tell her shows his protective nature but also his isolation in bearing the conspiracy\'s burden.',
            markingCriteria: {
              breakdown: ['Portia shows intelligence/devotion (1 mark)', 'Demands to know secrets (1 mark)', 'Brutus protective but isolated (1 mark)', 'Bears conspiracy burden alone (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q7',
            question: 'How does the theme of fate versus free will appear in the play?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Characters debate whether Caesar\'s death is fated or chosen. The soothsayer and omens suggest fate, but the conspirators believe they choose their actions. Caesar\'s ghost suggests his death was destined.',
            markingCriteria: {
              breakdown: ['Debate over fate vs choice (2 marks)', 'Omens suggest fate (2 marks)', 'Caesar\'s ghost implies destiny (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q8',
            question: 'What role does Calpurnia play in the assassination scene?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Calpurnia has prophetic dreams and begs Caesar not to go to the Senate. She represents the voice of caution and feminine intuition, but Caesar ignores her warnings due to his pride.',
            markingCriteria: {
              breakdown: ['Has prophetic dreams (1 mark)', 'Represents caution/intuition (1 mark)', 'Caesar ignores due to pride (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q9',
            question: 'How does the mob\'s behavior change throughout the play?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The crowd initially supports Caesar, then accepts Brutus\'s explanation for the assassination, but Antony\'s speech turns them violently against the conspirators. They become destructive and irrational.',
            markingCriteria: {
              breakdown: ['Initially supports Caesar (1 mark)', 'Accepts Brutus\'s explanation (1 mark)', 'Antony turns them against conspirators (1 mark)', 'Becomes destructive/irrational (1 mark)']
            },
            specReference: 'AQA English Literature 8702'
          },
          {
            id: 'caesar-q10',
            question: 'What does the play suggest about political ambition and power?',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Political ambition corrupts both Caesar and his enemies. The desire for power leads to betrayal, civil war, and destruction. The play shows how noble intentions can lead to terrible consequences.',
            markingCriteria: {
              breakdown: ['Ambition corrupts Caesar and enemies (2 marks)', 'Leads to betrayal and civil war (2 marks)', 'Noble intentions, terrible consequences (2 marks)']
            },
            specReference: 'AQA English Literature 8702'
          }
        ]
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    topics: [
      {
        id: 'p1-energy',
        name: 'Energy',
        questions: [
          {
            id: 'p1-q1',
            question: 'State the principle of conservation of energy.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Energy cannot be created or destroyed, only transferred from one store to another.',
            markingCriteria: {
              breakdown: ['Energy cannot be created or destroyed (1 mark)', 'Only transferred from one store to another (1 mark)']
            },
            specReference: '4.1.1.1 - Energy stores and systems'
          },
          {
            id: 'p1-q2',
            question: 'List four different energy stores.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Any four from: kinetic, gravitational potential, elastic potential, thermal, chemical, magnetic, electrostatic, nuclear.',
            markingCriteria: {
              breakdown: ['First energy store (1 mark)', 'Second energy store (1 mark)', 'Third energy store (1 mark)', 'Fourth energy store (1 mark)']
            },
            specReference: '4.1.1.1 - Energy stores and systems'
          },
          {
            id: 'p1-q3',
            question: 'Calculate the kinetic energy of a 1200 kg car travelling at 25 m/s.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'KE = ½mv² = ½ × 1200 × 25² = ½ × 1200 × 625 = 375,000 J or 375 kJ',
            markingCriteria: {
              breakdown: ['Correct formula KE = ½mv² (1 mark)', 'Correct substitution of values (1 mark)', 'Correct final answer with units (1 mark)']
            },
            specReference: '4.1.1.2 - Kinetic energy',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p1-q4',
            question: 'Explain what is meant by efficiency and state the equation for calculating efficiency.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Efficiency is the ratio of useful energy output to total energy input. Efficiency = useful energy output / total energy input',
            markingCriteria: {
              breakdown: ['Definition of efficiency as ratio (1 mark)', 'Reference to useful energy output (1 mark)', 'Correct equation (1 mark)']
            },
            specReference: '4.1.1.7 - Efficiency'
          },
          {
            id: 'p1-q5',
            question: 'A motor transfers 240 J of electrical energy but only 180 J is transferred as useful kinetic energy. Calculate the efficiency of the motor.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Efficiency = useful energy output / total energy input = 180 / 240 = 0.75 or 75%',
            markingCriteria: {
              breakdown: ['Correct formula used (1 mark)', 'Correct substitution (1 mark)', 'Correct final answer (1 mark)']
            },
            specReference: '4.1.1.7 - Efficiency',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p1-q6',
            question: 'Describe three methods of reducing unwanted energy transfers in mechanical systems.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Lubrication reduces friction between moving parts. Thermal insulation reduces heat loss. Using low resistance wires reduces electrical heating.',
            markingCriteria: {
              breakdown: ['Lubrication to reduce friction (1 mark)', 'Thermal insulation (1 mark)', 'Low resistance components (1 mark)']
            },
            specReference: '4.1.1.6 - Reducing unwanted energy transfers'
          },
          {
            id: 'p1-q7',
            question: 'Calculate the gravitational potential energy of a 60 kg person standing on a 15 m high platform. (g = 9.8 m/s²)',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'GPE = mgh = 60 × 9.8 × 15 = 8820 J',
            markingCriteria: {
              breakdown: ['Correct formula GPE = mgh (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.1.1.2 - Gravitational potential energy',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p1-q8',
            question: 'Explain the difference between renewable and non-renewable energy resources, giving two examples of each.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Renewable resources can be replenished naturally (wind, solar). Non-renewable resources are finite and will run out (coal, oil).',
            markingCriteria: {
              breakdown: ['Definition of renewable (1 mark)', 'Two renewable examples (1 mark)', 'Definition of non-renewable (1 mark)', 'Two non-renewable examples (1 mark)']
            },
            specReference: '4.1.1.8 - National and global energy resources'
          },
          {
            id: 'p1-q9',
            question: 'Define specific heat capacity and state its units.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Specific heat capacity is the energy required to raise the temperature of 1 kg of a substance by 1°C. Units: J/kg°C',
            markingCriteria: {
              breakdown: ['Correct definition (1 mark)', 'Correct units J/kg°C (1 mark)']
            },
            specReference: '4.1.1.4 - Specific heat capacity'
          },
          {
            id: 'p1-q10',
            question: 'A 2 kg block of aluminum has a specific heat capacity of 900 J/kg°C. Calculate the energy needed to heat it from 20°C to 80°C.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Energy = mcΔT = 2 × 900 × (80-20) = 2 × 900 × 60 = 108,000 J or 108 kJ',
            markingCriteria: {
              breakdown: ['Correct formula E = mcΔT (1 mark)', 'Correct calculation of temperature change (1 mark)', 'Correct final answer with units (1 mark)']
            },
            specReference: '4.1.1.4 - Specific heat capacity',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'p2-electricity',
        name: 'Electricity',
        questions: [
          {
            id: 'p2-q1',
            question: 'State Ohm\'s law and give the equation that represents it.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The current through a conductor is directly proportional to the potential difference across it, provided temperature remains constant. V = IR',
            markingCriteria: {
              breakdown: ['Statement of Ohm\'s law (1 mark)', 'Correct equation V = IR (1 mark)']
            },
            specReference: '4.2.1.1 - Current, potential difference and resistance'
          },
          {
            id: 'p2-q2',
            question: 'Calculate the current flowing through a 12 Ω resistor when a potential difference of 6 V is applied across it.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'I = V/R = 6/12 = 0.5 A',
            markingCriteria: {
              breakdown: ['Correct rearrangement of Ohm\'s law (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.2.1.1 - Current, potential difference and resistance',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'p2-q3',
            question: 'Describe the difference between series and parallel circuits in terms of current and potential difference.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'In series circuits: current is the same at all points, potential difference is shared between components. In parallel circuits: current is shared between branches, potential difference is the same across each branch.',
            markingCriteria: {
              breakdown: ['Series - current same throughout (1 mark)', 'Series - voltage shared (1 mark)', 'Parallel - current shared (1 mark)', 'Parallel - voltage same across branches (1 mark)']
            },
            specReference: '4.2.1.2 - Series and parallel circuits'
          },
          {
            id: 'p2-q4',
            question: 'Calculate the total resistance of three resistors of 4 Ω, 6 Ω and 12 Ω connected in series.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'In series: R_total = R₁ + R₂ + R₃ = 4 + 6 + 12 = 22 Ω',
            markingCriteria: {
              breakdown: ['Correct formula for series resistance (1 mark)', 'Correct calculation and answer (1 mark)']
            },
            specReference: '4.2.1.2 - Series and parallel circuits',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'p2-q5',
            question: 'Explain why the potential difference across each component in a parallel circuit is the same.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Each component in parallel is connected directly to the power supply. All components have the same two connection points. Therefore they all experience the same potential difference as the power supply.',
            markingCriteria: {
              breakdown: ['Components connected directly to supply (1 mark)', 'Same connection points (1 mark)', 'Same potential difference as supply (1 mark)']
            },
            specReference: '4.2.1.2 - Series and parallel circuits'
          },
          {
            id: 'p2-q6',
            question: 'State the equation for electrical power and calculate the power dissipated by a 5 A current flowing through a 8 Ω resistor.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'P = I²R. Power = 5² × 8 = 25 × 8 = 200 W',
            markingCriteria: {
              breakdown: ['Correct power equation (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.2.1.5 - Power, energy transfer and appliances',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p2-q7',
            question: 'Explain the difference between alternating current (AC) and direct current (DC).',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'DC flows in one direction only and has constant value. AC changes direction regularly and varies in magnitude.',
            markingCriteria: {
              breakdown: ['DC flows in one direction (1 mark)', 'DC has constant value (1 mark)', 'AC changes direction and magnitude (1 mark)']
            },
            specReference: '4.2.1.3 - Domestic uses and safety'
          },
          {
            id: 'p2-q8',
            question: 'Describe the function of the National Grid and explain why transformers are essential.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'National Grid distributes electricity from power stations to consumers. Transformers step up voltage for transmission to reduce energy losses. They step down voltage for safe domestic use.',
            markingCriteria: {
              breakdown: ['National Grid distributes electricity (1 mark)', 'Step-up transformers reduce losses (1 mark)', 'High voltage for transmission (1 mark)', 'Step-down for domestic safety (1 mark)']
            },
            specReference: '4.2.1.6 - The National Grid'
          },
          {
            id: 'p2-q9',
            question: 'Explain how static electricity is produced and give one example of its use.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Static electricity is produced when electrons are transferred between materials by friction. This creates a build-up of charge. Example: paint spraying, photocopying, or dust removal.',
            markingCriteria: {
              breakdown: ['Electron transfer by friction (1 mark)', 'Build-up of charge (1 mark)', 'Valid example (1 mark)']
            },
            specReference: '4.2.1.7 - Static electricity'
          },
          {
            id: 'p2-q10',
            question: 'Calculate the energy transferred when a 2400 W kettle operates for 5 minutes.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Energy = Power × time = 2400 × 300 = 720,000 J or 720 kJ',
            markingCriteria: {
              breakdown: ['Correct formula E = Pt (1 mark)', 'Correct time conversion to seconds (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.2.1.5 - Power, energy transfer and appliances',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'p3-particle-model',
        name: 'Particle model of matter',
        questions: [
          {
            id: 'p3-q1',
            question: 'Describe the arrangement and motion of particles in solids, liquids and gases.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Solids: particles close together in regular arrangement, vibrate about fixed positions. Liquids: particles close together but irregular arrangement, move around each other. Gases: particles far apart with random arrangement, move rapidly in all directions.',
            markingCriteria: {
              breakdown: ['Solid arrangement and motion (2 marks)', 'Liquid arrangement and motion (2 marks)', 'Gas arrangement and motion (2 marks)']
            },
            specReference: '4.3.1.1 - Particle model and states of matter'
          },
          {
            id: 'p3-q2',
            question: 'State the equation for density and calculate the density of a material with mass 150 g and volume 50 cm³.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Density = mass/volume. Density = 150/50 = 3.0 g/cm³',
            markingCriteria: {
              breakdown: ['Correct equation (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.3.1.2 - Density',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'p3-q3',
            question: 'Explain what happens to the mass and volume when a substance changes state.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mass remains constant during state changes due to conservation of mass. Volume typically increases when melting or evaporating as particles move further apart.',
            markingCriteria: {
              breakdown: ['Mass remains constant (1 mark)', 'Reference to conservation of mass (1 mark)', 'Volume changes due to particle spacing (1 mark)']
            },
            specReference: '4.3.1.3 - Changes of state'
          },
          {
            id: 'p3-q4',
            question: 'Define internal energy and explain what happens to internal energy during melting.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Internal energy is the total kinetic and potential energy of particles in a system. During melting, internal energy increases as energy is used to break bonds between particles, but temperature remains constant.',
            markingCriteria: {
              breakdown: ['Definition of internal energy (1 mark)', 'Reference to kinetic and potential energy (1 mark)', 'Internal energy increases during melting (1 mark)', 'Temperature constant during melting (1 mark)']
            },
            specReference: '4.3.1.4 - Internal energy'
          },
          {
            id: 'p3-q5',
            question: 'State what is meant by specific latent heat and give its units.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Specific latent heat is the energy required to change the state of 1 kg of a substance without changing its temperature. Units: J/kg',
            markingCriteria: {
              breakdown: ['Correct definition (1 mark)', 'Correct units J/kg (1 mark)']
            },
            specReference: '4.3.1.5 - Specific latent heat'
          },
          {
            id: 'p3-q6',
            question: 'Calculate the energy required to melt 2 kg of ice. (Specific latent heat of fusion = 334,000 J/kg)',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Energy = mass × specific latent heat = 2 × 334,000 = 668,000 J',
            markingCriteria: {
              breakdown: ['Correct formula (1 mark)', 'Correct calculation and units (1 mark)']
            },
            specReference: '4.3.1.5 - Specific latent heat',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p3-q7',
            question: 'Explain how the motion of gas particles creates pressure.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Gas particles move rapidly and randomly. They collide with container walls. These collisions exert forces on the walls creating pressure.',
            markingCriteria: {
              breakdown: ['Particles move rapidly/randomly (1 mark)', 'Collide with container walls (1 mark)', 'Collisions create pressure (1 mark)']
            },
            specReference: '4.3.1.6 - Particle motion in gases'
          },
          {
            id: 'p3-q8',
            question: 'State the relationship between pressure and volume for a fixed mass of gas at constant temperature.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Pressure is inversely proportional to volume. As volume increases, pressure decreases (Boyle\'s Law).',
            markingCriteria: {
              breakdown: ['Inversely proportional relationship (1 mark)', 'Reference to Boyle\'s Law or P₁V₁ = P₂V₂ (1 mark)']
            },
            specReference: '4.3.1.7 - Pressure and volume relationship'
          },
          {
            id: 'p3-q9',
            question: 'Explain why heating a gas at constant volume increases its pressure.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Heating increases the kinetic energy of gas particles. Particles move faster and collide with walls more frequently and with greater force. This increases pressure.',
            markingCriteria: {
              breakdown: ['Heating increases kinetic energy (1 mark)', 'Particles move faster (1 mark)', 'More frequent/forceful collisions increase pressure (1 mark)']
            },
            specReference: '4.3.1.6 - Particle motion in gases'
          },
          {
            id: 'p3-q10',
            question: 'A gas has pressure 2000 Pa and volume 0.5 m³. Calculate the new pressure when the volume is compressed to 0.2 m³ at constant temperature.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'P₁V₁ = P₂V₂, so P₂ = P₁V₁/V₂ = 2000 × 0.5/0.2 = 5000 Pa',
            markingCriteria: {
              breakdown: ['Correct use of Boyle\'s Law (1 mark)', 'Correct rearrangement and substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.3.1.7 - Pressure and volume relationship',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'p4-atomic-structure',
        name: 'Atomic structure',
        questions: [
          {
            id: 'p4-q1',
            question: 'Describe the structure of an atom including the relative masses and charges of protons, neutrons and electrons.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Atoms have a small dense nucleus containing protons (mass 1, charge +1) and neutrons (mass 1, charge 0). Electrons (mass 1/1840, charge -1) orbit the nucleus in shells.',
            markingCriteria: {
              breakdown: ['Nucleus contains protons and neutrons (1 mark)', 'Proton: mass 1, charge +1 (1 mark)', 'Neutron: mass 1, charge 0 (1 mark)', 'Electron: very small mass, charge -1 (1 mark)', 'Electrons in shells around nucleus (1 mark)', 'Small dense nucleus (1 mark)']
            },
            specReference: '4.4.1.1 - Structure of atom'
          },
          {
            id: 'p4-q2',
            question: 'Define isotopes and explain why they have the same chemical properties.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same chemical properties because they have the same number of electrons.',
            markingCriteria: {
              breakdown: ['Same element, same protons, different neutrons (1 mark)', 'Definition of isotopes (1 mark)', 'Same chemical properties due to same electrons (1 mark)']
            },
            specReference: '4.4.1.1 - Isotopes'
          },
          {
            id: 'p4-q3',
            question: 'Describe how the model of the atom has changed from Dalton\'s model to the modern nuclear model.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Dalton: atoms as solid spheres. Thomson: plum pudding model with electrons in positive sphere. Rutherford: nuclear model with dense nucleus and electrons around it. Bohr: electrons in fixed energy levels. Modern: electron clouds and quantum mechanics.',
            markingCriteria: {
              breakdown: ['Dalton - solid spheres (1 mark)', 'Thomson - plum pudding (1 mark)', 'Rutherford - nuclear model (1 mark)', 'Bohr - energy levels (1 mark)', 'Modern developments (1 mark)', 'Chronological development shown (1 mark)']
            },
            specReference: '4.4.1.2 - Development of atomic model'
          },
          {
            id: 'p4-q4',
            question: 'Name the three main types of ionizing radiation and state their relative penetrating powers.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Alpha radiation - least penetrating, stopped by paper. Beta radiation - medium penetrating, stopped by aluminum. Gamma radiation - most penetrating, reduced by lead.',
            markingCriteria: {
              breakdown: ['Alpha - least penetrating/paper (1 mark)', 'Beta - medium penetrating/aluminum (1 mark)', 'Gamma - most penetrating/lead (1 mark)']
            },
            specReference: '4.4.1.3 - Types of radiation'
          },
          {
            id: 'p4-q5',
            question: 'Complete the nuclear equation for alpha decay: ²³⁸U → ? + ⁴He',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '²³⁸U → ²³⁴Th + ⁴He',
            markingCriteria: {
              breakdown: ['Correct mass number 234 (1 mark)', 'Correct atomic number/element Th (1 mark)']
            },
            specReference: '4.4.1.5 - Nuclear equations'
          },
          {
            id: 'p4-q6',
            question: 'Define half-life and calculate how long it takes for a sample with half-life 8 days to decay to 1/8 of its original activity.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Half-life is the time taken for half the radioactive nuclei to decay. 1 → 1/2 → 1/4 → 1/8 takes 3 half-lives. Time = 3 × 8 = 24 days.',
            markingCriteria: {
              breakdown: ['Definition of half-life (1 mark)', 'Recognition of 3 half-lives needed (1 mark)', 'Correct calculation method (1 mark)', 'Correct answer 24 days (1 mark)']
            },
            specReference: '4.4.1.6 - Half-life',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'p4-q7',
            question: 'Give two uses and two dangers of radioactivity.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Uses: medical treatment/diagnosis, carbon dating, nuclear power, sterilization. Dangers: cancer, radiation sickness, genetic damage, contamination.',
            markingCriteria: {
              breakdown: ['First use (1 mark)', 'Second use (1 mark)', 'First danger (1 mark)', 'Second danger (1 mark)']
            },
            specReference: '4.4.1.7 - Uses and dangers of radiation'
          },
          {
            id: 'p4-q8',
            question: 'Explain what is meant by background radiation and give three sources.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Background radiation is ionizing radiation present in the environment at all times. Sources include cosmic rays, radon gas, rocks and soil, nuclear weapons testing, nuclear accidents.',
            markingCriteria: {
              breakdown: ['Definition of background radiation (1 mark)', 'First source (1 mark)', 'Second source (1 mark)', 'Third source (1 mark)']
            },
            specReference: '4.4.1.8 - Background radiation'
          },
          {
            id: 'p4-q9',
            question: 'Describe the process of nuclear fission and explain how it is used in nuclear power stations.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Nuclear fission involves splitting large nuclei (uranium-235) by neutron bombardment. This releases energy, more neutrons, and smaller nuclei. Chain reaction occurs as neutrons split more nuclei. In power stations, controlled chain reaction heats water to produce steam that drives turbines.',
            markingCriteria: {
              breakdown: ['Splitting large nuclei (1 mark)', 'Neutron bombardment (1 mark)', 'Chain reaction described (1 mark)', 'Energy release (1 mark)', 'Use in power stations (1 mark)']
            },
            specReference: '4.4.1.9 - Nuclear fission'
          },
          {
            id: 'p4-q10',
            question: 'Explain the difference between nuclear fission and nuclear fusion.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Fission splits large nuclei into smaller ones, requires neutron bombardment, used in current power stations. Fusion joins small nuclei to form larger ones, requires very high temperatures, occurs in stars.',
            markingCriteria: {
              breakdown: ['Fission splits large nuclei (1 mark)', 'Fusion joins small nuclei (1 mark)', 'Different conditions required (1 mark)', 'Different applications (1 mark)']
            },
            specReference: '4.4.1.9 - Nuclear fission and fusion'
          }
        ]
      },
      {
        id: 'p5-forces',
        name: 'Forces',
        questions: [
          {
            id: 'p5-q1',
            question: 'Explain the difference between scalar and vector quantities, giving two examples of each.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Scalar quantities have magnitude only (mass, energy, speed, distance). Vector quantities have both magnitude and direction (force, velocity, displacement, acceleration).',
            markingCriteria: {
              breakdown: ['Scalar - magnitude only (1 mark)', 'Vector - magnitude and direction (1 mark)', 'Two scalar examples (1 mark)', 'Two vector examples (1 mark)']
            },
            specReference: '4.5.1.1 - Scalar and vector quantities'
          },
          {
            id: 'p5-q2',
            question: 'State Newton\'s first law of motion.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An object will remain at rest or continue moving at constant velocity unless acted upon by a resultant force.',
            markingCriteria: {
              breakdown: ['Object at rest or constant velocity (1 mark)', 'Unless acted upon by resultant force (1 mark)']
            },
            specReference: '4.5.1.13 - Newton\'s laws'
          },
          {
            id: 'p5-q3',
            question: 'Calculate the weight of a 75 kg person on Earth where g = 9.8 m/s².',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Weight = mg = 75 × 9.8 = 735 N',
            markingCriteria: {
              breakdown: ['Correct formula W = mg (1 mark)', 'Correct calculation and units (1 mark)']
            },
            specReference: '4.5.1.3 - Weight, mass and gravity',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p5-q4',
            question: 'State Hooke\'s Law and give the equation that represents it.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The extension of a spring is directly proportional to the applied force, provided the elastic limit is not exceeded. F = kx',
            markingCriteria: {
              breakdown: ['Statement of proportionality (1 mark)', 'Correct equation F = kx (1 mark)']
            },
            specReference: '4.5.1.6 - Force and elasticity'
          },
          {
            id: 'p5-q5',
            question: 'A spring extends by 5 cm when a force of 10 N is applied. Calculate the spring constant.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'k = F/x = 10/0.05 = 200 N/m',
            markingCriteria: {
              breakdown: ['Correct rearrangement k = F/x (1 mark)', 'Conversion to meters (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.5.1.6 - Force and elasticity',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p5-q6',
            question: 'Define the moment of a force and state the equation for calculating moments.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Moment is the turning effect of a force about a pivot. Moment = force × perpendicular distance from pivot',
            markingCriteria: {
              breakdown: ['Definition as turning effect (1 mark)', 'Correct equation (1 mark)']
            },
            specReference: '4.5.1.7 - Moments'
          },
          {
            id: 'p5-q7',
            question: 'Explain how pressure in liquids varies with depth.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Pressure increases with depth because there is more liquid above pressing down. The weight of liquid above creates the pressure. Pressure = height × density × gravity.',
            markingCriteria: {
              breakdown: ['Pressure increases with depth (1 mark)', 'Due to weight of liquid above (1 mark)', 'Reference to formula or proportionality (1 mark)']
            },
            specReference: '4.5.1.8 - Pressure in fluids'
          },
          {
            id: 'p5-q8',
            question: 'State the equation for calculating speed and use it to find the speed of a car that travels 240 km in 3 hours.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Speed = distance/time = 240/3 = 80 km/h',
            markingCriteria: {
              breakdown: ['Correct equation (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.5.1.10 - Distance and displacement',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'p5-q9',
            question: 'Define momentum and state the equation for calculating it.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Momentum is the product of an object\'s mass and velocity. Momentum = mass × velocity',
            markingCriteria: {
              breakdown: ['Definition involving mass and velocity (1 mark)', 'Correct equation p = mv (1 mark)']
            },
            specReference: '4.5.1.15 - Momentum'
          },
          {
            id: 'p5-q10',
            question: 'Calculate the momentum of a 1200 kg car travelling at 15 m/s.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Momentum = mv = 1200 × 15 = 18,000 kg⋅m/s',
            markingCriteria: {
              breakdown: ['Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.5.1.15 - Momentum',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'p6-waves',
        name: 'Waves',
        questions: [
          {
            id: 'p6-q1',
            question: 'Describe the difference between transverse and longitudinal waves, giving one example of each.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Transverse waves have oscillations perpendicular to the direction of energy transfer (light waves, water waves). Longitudinal waves have oscillations parallel to the direction of energy transfer (sound waves).',
            markingCriteria: {
              breakdown: ['Transverse - perpendicular oscillations (1 mark)', 'Longitudinal - parallel oscillations (1 mark)', 'Example of transverse wave (1 mark)', 'Example of longitudinal wave (1 mark)']
            },
            specReference: '4.6.1.1 - Types of waves'
          },
          {
            id: 'p6-q2',
            question: 'Define amplitude, frequency and wavelength for a wave.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Amplitude is the maximum displacement from the rest position. Frequency is the number of waves passing a point per second. Wavelength is the distance between two consecutive identical points on a wave.',
            markingCriteria: {
              breakdown: ['Amplitude definition (1 mark)', 'Frequency definition (1 mark)', 'Wavelength definition (1 mark)']
            },
            specReference: '4.6.1.2 - Properties of waves'
          },
          {
            id: 'p6-q3',
            question: 'State the wave equation and use it to calculate the speed of a wave with frequency 50 Hz and wavelength 6.8 m.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Wave speed = frequency × wavelength. v = 50 × 6.8 = 340 m/s',
            markingCriteria: {
              breakdown: ['Correct equation v = fλ (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.6.1.3 - Wave speed',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p6-q4',
            question: 'Explain what happens when waves are reflected at a boundary.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'When waves hit a boundary, they bounce back. The angle of incidence equals the angle of reflection. The frequency and wavelength remain the same.',
            markingCriteria: {
              breakdown: ['Waves bounce back (1 mark)', 'Angle of incidence = angle of reflection (1 mark)', 'Frequency and wavelength unchanged (1 mark)']
            },
            specReference: '4.6.1.4 - Reflection and refraction'
          },
          {
            id: 'p6-q5',
            question: 'Describe what happens when waves are refracted and explain why this occurs.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Refraction is the bending of waves when they enter a different medium. It occurs because waves travel at different speeds in different media. Frequency remains constant but wavelength changes.',
            markingCriteria: {
              breakdown: ['Bending when entering different medium (1 mark)', 'Due to different wave speeds (1 mark)', 'Frequency constant (1 mark)', 'Wavelength changes (1 mark)']
            },
            specReference: '4.6.1.4 - Reflection and refraction'
          },
          {
            id: 'p6-q6',
            question: 'Explain how sound waves are produced and how they travel through air.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sound waves are produced by vibrating objects. These create alternating compressions and rarefactions in the air. Sound travels as longitudinal pressure waves through the air particles.',
            markingCriteria: {
              breakdown: ['Produced by vibrating objects (1 mark)', 'Compressions and rarefactions (1 mark)', 'Longitudinal waves (1 mark)', 'Travel through air particles (1 mark)']
            },
            specReference: '4.6.1.5 - Sound waves'
          },
          {
            id: 'p6-q7',
            question: 'State two uses of ultrasound and explain why ultrasound is suitable for these applications.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Medical imaging and sonar. Ultrasound can penetrate soft tissues but reflects from boundaries between different materials. It is non-ionizing so safe for medical use.',
            markingCriteria: {
              breakdown: ['Two correct uses (1 mark)', 'Penetrates tissues (1 mark)', 'Reflects from boundaries (1 mark)', 'Non-ionizing/safe (1 mark)']
            },
            specReference: '4.6.1.7 - Ultrasound uses'
          },
          {
            id: 'p6-q8',
            question: 'List the electromagnetic waves in order of increasing frequency.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays.',
            markingCriteria: {
              breakdown: ['Correct order given (4 marks for all correct, 3 marks for 1-2 errors, 2 marks for 3-4 errors, 1 mark for 5+ errors)']
            },
            specReference: '4.6.1.9 - Electromagnetic spectrum'
          },
          {
            id: 'p6-q9',
            question: 'Give one use and one danger of X-rays.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Use: medical imaging, security scanning. Danger: ionizing radiation can cause cancer or cell damage.',
            markingCriteria: {
              breakdown: ['Correct use (1 mark)', 'Correct danger (1 mark)']
            },
            specReference: '4.6.1.10 - Uses and dangers of EM waves'
          },
          {
            id: 'p6-q10',
            question: 'Explain how a converging lens forms an image and state what happens to parallel rays of light.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'A converging lens refracts light rays toward the principal axis. Parallel rays of light converge at the focal point. The lens can form real or virtual images depending on object position.',
            markingCriteria: {
              breakdown: ['Refracts light toward principal axis (1 mark)', 'Parallel rays converge at focal point (1 mark)', 'Can form real or virtual images (1 mark)']
            },
            specReference: '4.6.1.11 - Lenses'
          }
        ]
      },
      {
        id: 'p7-magnetism',
        name: 'Magnetism and electromagnetism',
        questions: [
          {
            id: 'p7-q1',
            question: 'Describe the difference between permanent and induced magnets.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Permanent magnets produce their own magnetic field and keep their magnetism. Induced magnets become magnetic only when placed in a magnetic field and lose their magnetism when removed.',
            markingCriteria: {
              breakdown: ['Permanent magnets produce own field (1 mark)', 'Keep their magnetism (1 mark)', 'Induced magnets only magnetic in field (1 mark)']
            },
            specReference: '4.7.1.1 - Permanent and induced magnets'
          },
          {
            id: 'p7-q2',
            question: 'Describe the magnetic field around a bar magnet and explain how to show this field pattern.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Field lines emerge from north pole and enter south pole. Field is strongest at the poles. Can be shown using iron filings or a plotting compass to trace field lines.',
            markingCriteria: {
              breakdown: ['Field lines from north to south (1 mark)', 'Strongest at poles (1 mark)', 'Iron filings method (1 mark)', 'Plotting compass method (1 mark)']
            },
            specReference: '4.7.1.2 - Magnetic fields'
          },
          {
            id: 'p7-q3',
            question: 'Explain what is meant by the motor effect and state the factors that affect the force.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Motor effect is the force experienced by a current-carrying conductor in a magnetic field. Force depends on magnetic field strength, current size, and length of conductor in the field.',
            markingCriteria: {
              breakdown: ['Force on current-carrying conductor (1 mark)', 'In magnetic field (1 mark)', 'Depends on field strength (1 mark)', 'Depends on current and length (1 mark)']
            },
            specReference: '4.7.1.3 - Motor effect'
          },
          {
            id: 'p7-q4',
            question: 'State Fleming\'s left-hand rule and explain what each finger represents.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Thumb represents force (motion), first finger represents magnetic field, middle finger represents current direction. Used to find direction of force on current-carrying conductor.',
            markingCriteria: {
              breakdown: ['Thumb = force/motion (1 mark)', 'First finger = magnetic field (1 mark)', 'Middle finger = current (1 mark)']
            },
            specReference: '4.7.1.3 - Fleming\'s left-hand rule'
          },
          {
            id: 'p7-q5',
            question: 'Explain how a simple electric motor works.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Current flows through a coil in a magnetic field. Motor effect creates forces on opposite sides of coil in opposite directions. This creates a turning moment. Commutator reverses current every half turn to keep motor rotating.',
            markingCriteria: {
              breakdown: ['Current in coil in magnetic field (1 mark)', 'Forces in opposite directions (1 mark)', 'Creates turning moment (1 mark)', 'Commutator reverses current (1 mark)', 'Keeps motor rotating (1 mark)']
            },
            specReference: '4.7.1.4 - Electric motors'
          },
          {
            id: 'p7-q6',
            question: 'Define electromagnetic induction and state two ways to induce an EMF.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Electromagnetic induction is the generation of EMF when there is relative motion between a conductor and magnetic field. Induced by moving conductor in field or changing magnetic field through stationary conductor.',
            markingCriteria: {
              breakdown: ['Definition of electromagnetic induction (1 mark)', 'Moving conductor in field (1 mark)', 'Changing field through conductor (1 mark)']
            },
            specReference: '4.7.1.5 - Electromagnetic induction'
          },
          {
            id: 'p7-q7',
            question: 'Explain how a simple AC generator works.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Coil rotates in magnetic field. As coil cuts through field lines, EMF is induced. Direction of induced EMF changes as coil rotates, producing alternating current.',
            markingCriteria: {
              breakdown: ['Coil rotates in magnetic field (1 mark)', 'Cuts through field lines (1 mark)', 'EMF induced (1 mark)', 'Direction changes producing AC (1 mark)']
            },
            specReference: '4.7.1.6 - AC generators'
          },
          {
            id: 'p7-q8',
            question: 'Describe how a transformer works and state the transformer equation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Alternating current in primary coil creates changing magnetic field. This induces EMF in secondary coil. Vp/Vs = Np/Ns (voltage ratio equals turns ratio).',
            markingCriteria: {
              breakdown: ['AC in primary creates changing field (1 mark)', 'Induces EMF in secondary (1 mark)', 'Correct transformer equation (1 mark)', 'Voltage ratio = turns ratio (1 mark)']
            },
            specReference: '4.7.1.7 - Transformers'
          },
          {
            id: 'p7-q9',
            question: 'A transformer has 100 turns on the primary coil and 500 turns on the secondary coil. If the input voltage is 12 V, calculate the output voltage.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Vs = Vp × Ns/Np = 12 × 500/100 = 12 × 5 = 60 V',
            markingCriteria: {
              breakdown: ['Correct rearrangement of transformer equation (1 mark)', 'Correct substitution (1 mark)', 'Correct answer with units (1 mark)']
            },
            specReference: '4.7.1.7 - Transformers',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'p7-q10',
            question: 'Explain why transformers are used in the National Grid system.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Step-up transformers increase voltage for transmission to reduce current and power losses. Step-down transformers reduce voltage for safe domestic use. High voltage transmission is more efficient.',
            markingCriteria: {
              breakdown: ['Step-up increases voltage (1 mark)', 'Reduces current and power losses (1 mark)', 'Step-down for domestic safety (1 mark)', 'High voltage more efficient (1 mark)']
            },
            specReference: '4.7.1.8 - Transformers in National Grid'
          }
        ]
      },
      {
        id: 'p8-space-physics',
        name: 'Space physics',
        questions: [
          {
            id: 'p8-q1',
            question: 'Describe the structure of the solar system.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'The solar system consists of the Sun at the center, eight planets in orbit, with moons orbiting some planets. Also includes asteroids, comets, and dwarf planets.',
            markingCriteria: {
              breakdown: ['Sun at center (1 mark)', 'Eight planets in orbit (1 mark)', 'Moons orbit planets (1 mark)', 'Other objects like asteroids/comets (1 mark)']
            },
            specReference: '4.8.1.1 - Solar system'
          },
          {
            id: 'p8-q2',
            question: 'Explain what keeps planets in orbit around the Sun.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Gravitational force between Sun and planet provides centripetal force. This force acts toward the center keeping planet in circular orbit. Balance between gravitational force and orbital motion.',
            markingCriteria: {
              breakdown: ['Gravitational force (1 mark)', 'Provides centripetal force (1 mark)', 'Keeps planet in orbit (1 mark)']
            },
            specReference: '4.8.1.2 - Orbits'
          },
          {
            id: 'p8-q3',
            question: 'Describe the life cycle of a star similar in mass to our Sun.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Nebula contracts under gravity forming protostar. Nuclear fusion begins making it a main sequence star. When hydrogen runs out, star expands to become red giant. Outer layers drift away leaving white dwarf which eventually cools.',
            markingCriteria: {
              breakdown: ['Nebula contracts (1 mark)', 'Protostar forms (1 mark)', 'Main sequence star (1 mark)', 'Red giant phase (1 mark)', 'White dwarf formed (1 mark)', 'Eventually cools (1 mark)']
            },
            specReference: '4.8.1.3 - Life cycle of stars'
          },
          {
            id: 'p8-q4',
            question: 'Explain what red-shift is and what it tells us about distant galaxies.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Red-shift is the increase in wavelength of light from distant galaxies. It occurs because galaxies are moving away from us. The more distant the galaxy, the greater the red-shift, showing universe is expanding.',
            markingCriteria: {
              breakdown: ['Increase in wavelength (1 mark)', 'Due to galaxies moving away (1 mark)', 'Greater distance = greater red-shift (1 mark)', 'Shows universe expanding (1 mark)']
            },
            specReference: '4.8.1.4 - Red-shift'
          },
          {
            id: 'p8-q5',
            question: 'State the main evidence for the Big Bang theory.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Red-shift of distant galaxies shows universe is expanding. Cosmic microwave background radiation detected throughout universe. Observed abundance of light elements matches Big Bang predictions.',
            markingCriteria: {
              breakdown: ['Red-shift/expanding universe (1 mark)', 'Cosmic microwave background (1 mark)', 'Light element abundance (1 mark)']
            },
            specReference: '4.8.1.5 - Big Bang theory'
          },
          {
            id: 'p8-q6',
            question: 'Explain why more massive stars have shorter lifetimes than less massive stars.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'More massive stars have higher core temperatures and pressures. Nuclear fusion occurs much faster. They burn through their fuel supply more quickly.',
            markingCriteria: {
              breakdown: ['Higher temperatures and pressures (1 mark)', 'Faster nuclear fusion (1 mark)', 'Burn fuel more quickly (1 mark)']
            },
            specReference: '4.8.1.3 - Life cycle of stars'
          },
          {
            id: 'p8-q7',
            question: 'Describe what happens when a very massive star reaches the end of its life.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Very massive stars explode as supernovas. The core may collapse to form a neutron star or black hole. The explosion spreads heavy elements throughout space.',
            markingCriteria: {
              breakdown: ['Explodes as supernova (1 mark)', 'Core collapses (1 mark)', 'Forms neutron star or black hole (1 mark)', 'Spreads heavy elements (1 mark)']
            },
            specReference: '4.8.1.3 - Life cycle of stars'
          },
          {
            id: 'p8-q8',
            question: 'Explain how nuclear fusion in stars produces the energy that makes them shine.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hydrogen nuclei fuse together under extreme temperature and pressure in the star\'s core. This forms helium nuclei and releases enormous amounts of energy. Energy travels to surface and is radiated as light.',
            markingCriteria: {
              breakdown: ['Hydrogen nuclei fuse (1 mark)', 'Extreme conditions in core (1 mark)', 'Forms helium and releases energy (1 mark)', 'Energy radiated as light (1 mark)']
            },
            specReference: '4.8.1.3 - Nuclear fusion in stars'
          },
          {
            id: 'p8-q9',
            question: 'Describe the evidence that suggests the universe is expanding.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Red-shift observed in light from distant galaxies. The further away a galaxy is, the greater its red-shift. This suggests all galaxies are moving away from us.',
            markingCriteria: {
              breakdown: ['Red-shift in distant galaxies (1 mark)', 'Further = greater red-shift (1 mark)', 'Galaxies moving away (1 mark)']
            },
            specReference: '4.8.1.4 - Expanding universe'
          },
          {
            id: 'p8-q10',
            question: 'Explain why scientists believe that all matter in the universe was once concentrated in a very small space.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'If the universe is expanding now, working backwards suggests it was smaller in the past. Cosmic microwave background radiation is evidence of the hot, dense early universe. Mathematical models support this.',
            markingCriteria: {
              breakdown: ['Expansion suggests smaller past (1 mark)', 'CMB evidence of hot dense start (1 mark)', 'Mathematical models support this (1 mark)']
            },
            specReference: '4.8.1.5 - Big Bang theory'
          }
        ]
      }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    topics: [
      {
        id: 'g1-natural-hazards',
        name: 'Natural Hazards',
        questions: [
          {
            id: 'g1-q1',
            question: 'Define what is meant by the term "natural hazard".',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A natural hazard is a natural process or event that poses a threat to human life and property.',
            markingCriteria: {
              breakdown: ['Reference to natural process/event (1 mark)', 'Reference to threat to people/property (1 mark)']
            },
            specReference: '3.1.1.1 - Natural hazards'
          },
          {
            id: 'g1-q2',
            question: 'Identify two types of natural hazard.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Any two from: geological hazards (earthquakes, volcanoes), meteorological hazards (tropical storms, droughts), hydrological hazards (floods).',
            markingCriteria: {
              breakdown: ['First correct type identified (1 mark)', 'Second correct type identified (1 mark)']
            },
            specReference: '3.1.1.1 - Types of natural hazard'
          },
          {
            id: 'g1-q3',
            question: 'Explain how population density affects hazard risk.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Higher population density increases hazard risk because more people are exposed to the hazard. Dense populations mean more buildings and infrastructure that can be damaged. Dense areas may have inadequate emergency services. However, dense areas may have better early warning systems and disaster preparedness.',
            markingCriteria: {
              breakdown: ['Recognition that higher density = higher risk (1 mark)', 'More people exposed to hazard (1 mark)', 'More infrastructure at risk (1 mark)', 'Reference to emergency services or preparedness (1 mark)']
            },
            specReference: '3.1.1.1 - Factors affecting hazard risk'
          },
          {
            id: 'g1-q4',
            question: 'State three factors that affect hazard risk.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Any three from: population density, level of development, preparedness/education, early warning systems, infrastructure quality, distance from hazard source.',
            markingCriteria: {
              breakdown: ['First factor correctly stated (1 mark)', 'Second factor correctly stated (1 mark)', 'Third factor correctly stated (1 mark)']
            },
            specReference: '3.1.1.1 - Factors affecting hazard risk'
          },
          {
            id: 'g1-q5',
            question: 'Explain how level of development affects a country\'s ability to cope with natural hazards.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'More developed countries have better infrastructure that can withstand hazards (earthquake-resistant buildings). They have more resources for emergency services, rescue equipment, and medical facilities. Better education and early warning systems reduce casualties. They can afford better monitoring and prediction technology. Recovery is faster due to insurance systems and economic resources. Less developed countries have weaker buildings, fewer resources for emergency response, limited healthcare, and slower recovery times.',
            markingCriteria: {
              breakdown: ['Better infrastructure in developed countries (1 mark)', 'More resources for emergency response (1 mark)', 'Better education/warning systems (1 mark)', 'Faster recovery due to economic resources (1 mark)', 'Contrast with developing countries (1 mark)', 'Specific example or elaboration (1 mark)']
            },
            specReference: '3.1.1.1 - Factors affecting hazard risk'
          },
          {
            id: 'g1-q6',
            question: 'Suggest why some natural hazards pose a greater risk than others.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Frequency - more frequent hazards pose greater risk. Magnitude - stronger hazards cause more damage. Predictability - unpredictable hazards are more dangerous. Location - hazards in populated areas pose greater risk.',
            markingCriteria: {
              breakdown: ['Reference to frequency of hazard (1 mark)', 'Reference to magnitude/strength (1 mark)', 'Reference to predictability (1 mark)', 'Reference to location/population exposure (1 mark)']
            },
            specReference: '3.1.1.1 - Natural hazards risk factors'
          },
          {
            id: 'g1-q7',
            question: 'Outline the difference between a natural hazard and a natural disaster.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A natural hazard is the potential threat, while a natural disaster occurs when a hazard actually impacts people and causes damage.',
            markingCriteria: {
              breakdown: ['Natural hazard is potential threat (1 mark)', 'Natural disaster is when hazard impacts people/causes damage (1 mark)']
            },
            specReference: '3.1.1.1 - Natural hazards'
          },
          {
            id: 'g1-q8',
            question: 'Explain why hazard risk is increasing in some parts of the world.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Population growth means more people exposed to hazards. Urbanization concentrates people in hazard-prone areas. Climate change may increase frequency/intensity of some hazards. Development in marginal areas increases exposure.',
            markingCriteria: {
              breakdown: ['Population growth increasing exposure (1 mark)', 'Urbanization concentrating risk (1 mark)', 'Climate change effects (1 mark)', 'Development in marginal areas (1 mark)']
            },
            specReference: '3.1.1.1 - Factors affecting hazard risk'
          },
          {
            id: 'g1-q9',
            question: 'Define the term "hazard risk".',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'The probability or chance of a hazard occurring and causing harm.',
            markingCriteria: {
              breakdown: ['Reference to probability/chance and harm (1 mark)']
            },
            specReference: '3.1.1.1 - Natural hazards'
          },
          {
            id: 'g1-q10',
            question: 'Assess the relative importance of different factors that affect hazard risk.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Population density is crucial as it determines exposure levels - more people means higher potential casualties. Level of development is equally important as it affects building quality, emergency response, and recovery capacity. Early warning systems can significantly reduce risk by allowing evacuation. However, the type and magnitude of hazard also matters - some hazards are inherently more dangerous regardless of other factors. The relative importance depends on the specific location and hazard type.',
            markingCriteria: {
              breakdown: ['Discussion of population density (2 marks)', 'Discussion of development level (2 marks)', 'Discussion of preparedness/warning systems (2 marks)', 'Evaluation of relative importance (1 mark)', 'Clear conclusion (1 mark)']
            },
            specReference: '3.1.1.1 - Factors affecting hazard risk'
          }
        ]
      },
      {
        id: 'g2-tectonic-hazards',
        name: 'Tectonic Hazards',
        questions: [
          {
            id: 'g2-q1',
            question: 'Outline the plate tectonics theory.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The Earth\'s crust is divided into large pieces called tectonic plates. These plates move slowly on the semi-molten mantle below. Plate movement causes earthquakes and volcanoes at plate boundaries.',
            markingCriteria: {
              breakdown: ['Earth\'s crust divided into plates (1 mark)', 'Plates move on mantle (1 mark)', 'Movement causes earthquakes/volcanoes (1 mark)']
            },
            specReference: '3.1.1.2 - Plate tectonics theory'
          },
          {
            id: 'g2-q2',
            question: 'Describe the global distribution of earthquakes.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Earthquakes occur mainly along plate boundaries. Major concentrations around the Pacific Ring of Fire including Japan, California, and Chile. Also along the mid-Atlantic ridge and through the Mediterranean and Turkey.',
            markingCriteria: {
              breakdown: ['Occur along plate boundaries (1 mark)', 'Pacific Ring of Fire mentioned with examples (1 mark)', 'Other locations e.g. Atlantic ridge, Mediterranean (1 mark)']
            },
            specReference: '3.1.1.2 - Global distribution of earthquakes'
          },
          {
            id: 'g2-q3',
            question: 'Explain what happens at a constructive plate margin.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Two plates move apart from each other. Magma rises from the mantle to fill the gap. New oceanic crust is formed as magma cools. Gentle volcanic activity occurs and shallow earthquakes.',
            markingCriteria: {
              breakdown: ['Plates move apart (1 mark)', 'Magma rises from mantle (1 mark)', 'New crust formed (1 mark)', 'Volcanic activity and earthquakes mentioned (1 mark)']
            },
            specReference: '3.1.1.2 - Physical processes at constructive margins'
          },
          {
            id: 'g2-q4',
            question: 'Describe what happens at a destructive plate margin.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Two plates move towards each other. Denser oceanic plate subducts beneath continental plate. Friction causes earthquakes. Subducted plate melts creating magma which rises to form volcanoes.',
            markingCriteria: {
              breakdown: ['Plates move towards each other (1 mark)', 'Oceanic plate subducts (1 mark)', 'Friction causes earthquakes (1 mark)', 'Melting creates magma and volcanoes (1 mark)']
            },
            specReference: '3.1.1.2 - Physical processes at destructive margins'
          },
          {
            id: 'g2-q5',
            question: 'Compare the primary and secondary effects of earthquakes using a named example.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Using Haiti 2010 earthquake: Primary effects occur immediately - 230,000 deaths, buildings collapsed including Presidential Palace, roads and airports damaged. Secondary effects occur later - disease outbreaks due to lack of clean water, economic problems from destroyed infrastructure, homelessness lasting years.',
            markingCriteria: {
              breakdown: ['Named example used (1 mark)', 'Primary effects - immediate deaths/damage (2 marks)', 'Secondary effects - longer term impacts (2 marks)', 'Clear comparison between primary and secondary (1 mark)']
            },
            specReference: '3.1.1.2 - Effects of tectonic hazards'
          },
          {
            id: 'g2-q6',
            question: 'Explain why people continue to live in areas at risk from volcanic eruptions.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Fertile soils around volcanoes excellent for farming. Geothermal energy provides cheap electricity. Tourism brings income. Many eruptions are infrequent so risk seems low. Cost of moving may be too high. Family and cultural ties to the area.',
            markingCriteria: {
              breakdown: ['Fertile soils for agriculture (1 mark)', 'Geothermal energy benefits (1 mark)', 'Tourism income (1 mark)', 'Infrequent eruptions/low perceived risk (1 mark)', 'Economic or social ties (1 mark)', 'Development of explanation (1 mark)']
            },
            specReference: '3.1.1.2 - Reasons for living in hazard areas'
          },
          {
            id: 'g2-q7',
            question: 'Describe the difference between immediate and long-term responses to tectonic hazards.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Immediate responses occur within hours/days - search and rescue, emergency medical aid, temporary shelter, emergency food and water. Long-term responses take months/years - rebuilding infrastructure, economic recovery programs, improved building codes.',
            markingCriteria: {
              breakdown: ['Immediate responses - hours/days timeframe (1 mark)', 'Examples of immediate responses (1 mark)', 'Long-term responses - months/years timeframe (1 mark)', 'Examples of long-term responses (1 mark)']
            },
            specReference: '3.1.1.2 - Responses to tectonic hazards'
          },
          {
            id: 'g2-q8',
            question: 'Explain how monitoring can reduce the risks from volcanic eruptions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Seismometers detect earthquakes that occur before eruptions. Gas monitoring detects changes in gas emissions. Ground deformation shows magma movement. Temperature monitoring detects heat changes. Early warning allows evacuation.',
            markingCriteria: {
              breakdown: ['Seismic monitoring (1 mark)', 'Gas monitoring (1 mark)', 'Ground deformation or temperature monitoring (1 mark)', 'Early warning enables evacuation (1 mark)']
            },
            specReference: '3.1.1.2 - Monitoring and prediction'
          },
          {
            id: 'g2-q9',
            question: 'Outline what happens at a conservative plate margin.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Two plates slide past each other in opposite directions. Plates get stuck due to friction then suddenly move. This sudden movement causes earthquakes. No volcanic activity occurs.',
            markingCriteria: {
              breakdown: ['Plates slide past each other (1 mark)', 'Friction causes plates to stick then move (1 mark)', 'Earthquakes but no volcanoes (1 mark)']
            },
            specReference: '3.1.1.2 - Physical processes at conservative margins'
          },
          {
            id: 'g2-q10',
            question: 'Evaluate the effectiveness of different methods used to reduce the risks from earthquakes.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Building design is highly effective - earthquake-resistant buildings can prevent collapse and save lives, as seen in Japan vs Haiti. Early warning systems are somewhat effective but earthquakes are hard to predict accurately. Education and drills are very effective and low cost - Japan\'s regular drills save many lives. Land use planning is effective by avoiding building on fault lines. However, in developing countries, cost is a major barrier to implementing these methods effectively.',
            markingCriteria: {
              breakdown: ['Discussion of building design effectiveness (2 marks)', 'Discussion of early warning systems (2 marks)', 'Discussion of education/preparedness (2 marks)', 'Evaluation of relative effectiveness or limitations (1 mark)', 'Reference to examples or case studies (1 mark)']
            },
            specReference: '3.1.1.2 - Management of tectonic hazards'
          }
        ]
      },
      {
        id: 'g3-weather-hazards',
        name: 'Weather Hazards',
        questions: [
          {
            id: 'g3-q1',
            question: 'Describe the general atmospheric circulation model.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hot air rises at the equator creating low pressure. Air moves towards poles at high altitude then sinks at 30°N/S creating high pressure. Surface winds blow from high to low pressure. This creates three cells: Hadley (0-30°), Ferrel (30-60°), and Polar (60-90°).',
            markingCriteria: {
              breakdown: ['Hot air rises at equator (1 mark)', 'Air sinks at 30° creating high pressure (1 mark)', 'Surface winds from high to low pressure (1 mark)', 'Three circulation cells identified (1 mark)']
            },
            specReference: '3.1.1.3 - General atmospheric circulation'
          },
          {
            id: 'g3-q2',
            question: 'Explain the global distribution of tropical storms.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Tropical storms occur between 5° and 30° latitude north and south of the equator. They form over warm oceans (above 26.5°C). Common areas include Atlantic (hurricanes), Pacific (typhoons), and Indian Ocean (cyclones). They do not form at the equator due to lack of Coriolis effect.',
            markingCriteria: {
              breakdown: ['Between 5° and 30° latitude (1 mark)', 'Over warm oceans above 26.5°C (1 mark)', 'Named regions/ocean basins (1 mark)', 'Not at equator due to Coriolis effect (1 mark)']
            },
            specReference: '3.1.1.3 - Global distribution of tropical storms'
          },
          {
            id: 'g3-q3',
            question: 'Describe the sequence of formation and development of tropical storms.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Warm ocean water (above 26.5°C) evaporates rapidly. Rising air creates an area of low pressure. More air is drawn in and spins due to Coriolis effect. As air rises it cools and condenses releasing latent heat. This provides more energy causing air to rise faster. Eye wall forms with calm eye in center.',
            markingCriteria: {
              breakdown: ['Warm ocean water evaporates (1 mark)', 'Low pressure area forms (1 mark)', 'Air drawn in and spins (Coriolis) (1 mark)', 'Condensation releases latent heat (1 mark)', 'Positive feedback provides more energy (1 mark)', 'Eye and eye wall formation (1 mark)']
            },
            specReference: '3.1.1.3 - Formation and development of tropical storms'
          },
          {
            id: 'g3-q4',
            question: 'Describe the structure and features of a tropical storm.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Eye in the center is calm with clear skies and very low pressure. Eye wall surrounds the eye with strongest winds and heaviest rainfall. Spiral bands of cloud extend outward with decreasing wind speed. Whole system can be 500km in diameter.',
            markingCriteria: {
              breakdown: ['Eye - calm center with low pressure (1 mark)', 'Eye wall - strongest winds and rain (1 mark)', 'Spiral bands extending outward (1 mark)', 'Large diameter/scale mentioned (1 mark)']
            },
            specReference: '3.1.1.3 - Structure of tropical storms'
          },
          {
            id: 'g3-q5',
            question: 'Using a named example, explain the primary and secondary effects of a tropical storm.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Hurricane Katrina 2005: Primary effects - 1,836 deaths, storm surge flooded 80% of New Orleans, winds up to 280 km/h destroyed buildings. Secondary effects - disease spread due to contaminated water, economic losses of $125 billion, 1 million people displaced, long-term unemployment.',
            markingCriteria: {
              breakdown: ['Named example used (1 mark)', 'Primary effects - immediate impacts like deaths/flooding (2 marks)', 'Secondary effects - longer term impacts like disease/displacement (2 marks)', 'Specific details/statistics (1 mark)']
            },
            specReference: '3.1.1.3 - Effects of tropical storms'
          },
          {
            id: 'g3-q6',
            question: 'Explain how climate change might affect tropical storms.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Warmer oceans provide more energy for storm formation. Storms may become more intense with higher wind speeds. Sea level rise increases storm surge damage. Storm tracks may change affecting different areas.',
            markingCriteria: {
              breakdown: ['Warmer oceans provide more energy (1 mark)', 'More intense storms/higher wind speeds (1 mark)', 'Sea level rise increases surge damage (1 mark)', 'Changing storm tracks (1 mark)']
            },
            specReference: '3.1.1.3 - Climate change and tropical storms'
          },
          {
            id: 'g3-q7',
            question: 'Describe the types of weather hazards experienced in the UK.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Flooding from heavy rainfall or coastal storms. Droughts during extended dry periods. Strong winds and storms. Snow and ice causing transport disruption. Heatwaves during summer months.',
            markingCriteria: {
              breakdown: ['Flooding (1 mark)', 'Droughts (1 mark)', 'Strong winds/storms (1 mark)', 'Snow/ice or heatwaves (1 mark)']
            },
            specReference: '3.1.1.3 - UK weather hazards'
          },
          {
            id: 'g3-q8',
            question: 'Using a recent UK extreme weather event, explain its social, economic and environmental impacts.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Storm Desmond 2015 in Cumbria: Social impacts - 43,000 homes without power, communities isolated by flooding, stress and trauma. Economic impacts - £1.3 billion insurance claims, businesses closed, tourism affected. Environmental impacts - rivers polluted, farmland flooded, soil erosion.',
            markingCriteria: {
              breakdown: ['Named recent UK event (1 mark)', 'Social impacts e.g. displacement, communities affected (2 marks)', 'Economic impacts e.g. costs, business disruption (2 marks)', 'Environmental impacts e.g. pollution, erosion (1 mark)']
            },
            specReference: '3.1.1.3 - Extreme weather in UK'
          },
          {
            id: 'g3-q9',
            question: 'Explain how monitoring and prediction can reduce the effects of tropical storms.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Satellite imagery tracks storm development and movement. Computer models predict storm path and intensity. Early warning systems allow people to evacuate. Weather stations monitor local conditions to update forecasts.',
            markingCriteria: {
              breakdown: ['Satellite monitoring (1 mark)', 'Computer modeling for prediction (1 mark)', 'Early warning enables evacuation (1 mark)', 'Weather stations for local monitoring (1 mark)']
            },
            specReference: '3.1.1.3 - Monitoring and prediction'
          },
          {
            id: 'g3-q10',
            question: 'Assess the evidence that weather is becoming more extreme in the UK.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Evidence for: Recent severe flooding events like 2007, 2013-14, 2015-16 winters were record-breaking. Temperature records broken more frequently - 2019 had hottest July day. Increased insurance claims for weather damage. However, limited evidence: Weather records only go back 150 years. Natural variation makes trends hard to identify. Some extreme events have always occurred in UK climate. Overall, there is growing evidence but longer-term data needed for certainty.',
            markingCriteria: {
              breakdown: ['Evidence supporting increased extremes (2 marks)', 'Specific examples of recent events (2 marks)', 'Limitations of evidence/counterarguments (2 marks)', 'Balanced assessment/conclusion (2 marks)']
            },
            specReference: '3.1.1.3 - Evidence of extreme weather in UK'
          }
        ]
      },
      {
        id: 'g4-climate-change',
        name: 'Climate Change',
        questions: [
          {
            id: 'g4-q1',
            question: 'Outline the evidence for climate change from the Quaternary period to present.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ice core data shows CO2 levels and temperature changes. Tree rings indicate past climate conditions. Historical records document temperature and weather patterns. Glacial evidence shows ice age cycles.',
            markingCriteria: {
              breakdown: ['Ice core data (1 mark)', 'Tree rings (1 mark)', 'Historical records (1 mark)', 'Glacial evidence (1 mark)']
            },
            specReference: '3.1.1.4 - Evidence for climate change'
          },
          {
            id: 'g4-q2',
            question: 'Explain the natural causes of climate change.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Orbital changes (Milankovitch cycles) affect distance from sun and solar radiation received. Volcanic activity releases ash and gases that can block sunlight and cool climate. Solar output varies in cycles affecting energy reaching Earth. These natural factors operated over long timescales before human influence.',
            markingCriteria: {
              breakdown: ['Orbital changes/Milankovitch cycles (2 marks)', 'Volcanic activity blocking sunlight (2 marks)', 'Solar output variations (1 mark)', 'Long timescales/before human influence (1 mark)']
            },
            specReference: '3.1.1.4 - Natural causes of climate change'
          },
          {
            id: 'g4-q3',
            question: 'Describe the human causes of climate change.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Burning fossil fuels releases CO2 and other greenhouse gases. Deforestation reduces trees that absorb CO2. Agriculture produces methane from livestock and rice farming. Industry releases various greenhouse gases.',
            markingCriteria: {
              breakdown: ['Fossil fuel burning releases CO2 (1 mark)', 'Deforestation reduces CO2 absorption (1 mark)', 'Agriculture produces methane (1 mark)', 'Industrial emissions (1 mark)']
            },
            specReference: '3.1.1.4 - Human causes of climate change'
          },
          {
            id: 'g4-q4',
            question: 'Outline the effects of climate change on people.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sea level rise threatens coastal communities. Changing rainfall patterns affect water supply and agriculture. Extreme weather events increase. Health impacts from heat and disease. Migration as areas become uninhabitable.',
            markingCriteria: {
              breakdown: ['Sea level rise affecting coasts (1 mark)', 'Water/agriculture impacts (1 mark)', 'Extreme weather increases (1 mark)', 'Health or migration impacts (1 mark)']
            },
            specReference: '3.1.1.4 - Effects on people'
          },
          {
            id: 'g4-q5',
            question: 'Describe the effects of climate change on the environment.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ice caps and glaciers melting causing sea level rise. Arctic ice retreat affecting polar bears and other wildlife. Coral bleaching due to warmer seas. Changes in species distribution as habitats shift.',
            markingCriteria: {
              breakdown: ['Ice caps/glaciers melting (1 mark)', 'Arctic ice retreat affecting wildlife (1 mark)', 'Coral bleaching (1 mark)', 'Species distribution changes (1 mark)']
            },
            specReference: '3.1.1.4 - Effects on environment'
          },
          {
            id: 'g4-q6',
            question: 'Explain mitigation strategies for managing climate change.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Alternative energy production like wind and solar reduces fossil fuel use. Carbon capture technology stores CO2 underground. Tree planting absorbs CO2 from atmosphere. International agreements like Paris Climate Accord coordinate global action to reduce emissions.',
            markingCriteria: {
              breakdown: ['Alternative energy reduces fossil fuel use (2 marks)', 'Carbon capture stores CO2 (1 mark)', 'Tree planting absorbs CO2 (1 mark)', 'International agreements coordinate action (2 marks)']
            },
            specReference: '3.1.1.4 - Mitigation strategies'
          },
          {
            id: 'g4-q7',
            question: 'Describe adaptation strategies for managing climate change.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Changes in agricultural systems like drought-resistant crops. Managing water supply through reservoirs and desalination. Reducing risk from sea level rise with flood barriers. Building design adapted to cope with temperature changes.',
            markingCriteria: {
              breakdown: ['Agricultural changes/drought-resistant crops (1 mark)', 'Water supply management (1 mark)', 'Flood barriers for sea level rise (1 mark)', 'Building design adaptations (1 mark)']
            },
            specReference: '3.1.1.4 - Adaptation strategies'
          },
          {
            id: 'g4-q8',
            question: 'Explain the difference between mitigation and adaptation strategies for climate change.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Mitigation aims to reduce the causes of climate change by cutting greenhouse gas emissions. Adaptation involves responding to climate change that is already happening by adjusting human systems to cope with the effects.',
            markingCriteria: {
              breakdown: ['Mitigation reduces causes/emissions (2 marks)', 'Adaptation responds to existing changes (2 marks)']
            },
            specReference: '3.1.1.4 - Managing climate change'
          },
          {
            id: 'g4-q9',
            question: 'Assess the importance of international agreements in managing climate change.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'International agreements like the Paris Accord are essential because climate change is a global problem requiring coordinated action. They set emission targets and provide framework for cooperation. However, agreements are often not legally binding and countries may not meet targets. Success depends on political will and economic priorities.',
            markingCriteria: {
              breakdown: ['Recognition that climate change needs global cooperation (1 mark)', 'Agreements set targets/provide framework (2 marks)', 'Limitations - not binding/targets missed (2 marks)', 'Success depends on political/economic factors (1 mark)']
            },
            specReference: '3.1.1.4 - International agreements'
          },
          {
            id: 'g4-q10',
            question: 'Evaluate the relative effectiveness of mitigation versus adaptation strategies for managing climate change.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Mitigation is essential for long-term solution as it addresses root causes by reducing emissions. Renewable energy and international agreements can have global impact. However, mitigation takes time to show results and requires major economic changes. Adaptation is necessary now as some climate change is already locked in. Flood defenses and crop changes can provide immediate protection. However, adaptation only responds to problems rather than solving them. Both strategies are needed - mitigation for long-term solution, adaptation for immediate protection.',
            markingCriteria: {
              breakdown: ['Discussion of mitigation effectiveness/importance (2 marks)', 'Limitations of mitigation approach (1 mark)', 'Discussion of adaptation benefits (2 marks)', 'Limitations of adaptation approach (1 mark)', 'Evaluation of relative importance/need for both (2 marks)']
            },
            specReference: '3.1.1.4 - Managing climate change'
          }
        ]
      },
      {
        id: 'g5-ecosystems',
        name: 'Ecosystems',
        questions: [
          {
            id: 'g5-q1',
            question: 'Define the terms "biotic" and "abiotic" components of an ecosystem.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Biotic components are the living parts of an ecosystem (plants, animals, microorganisms).\n\nAbiotic components are the non-living parts of an ecosystem (climate, soil, water, sunlight).',
            markingCriteria: {
              breakdown: ['Biotic = living components (1 mark)', 'Abiotic = non-living components (1 mark)']
            },
            specReference: '3.1.2.1 - Ecosystems'
          },
          {
            id: 'g5-q2',
            question: 'Explain the roles of producers, primary consumers, and decomposers in a food chain.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Producers (plants) make their own food through photosynthesis and form the base of food chains.\n\nPrimary consumers (herbivores) eat producers and convert plant energy into animal energy.\n\nDecomposers (bacteria, fungi) break down dead organisms and waste, returning nutrients to the soil for producers to use again.',
            markingCriteria: {
              breakdown: ['Producers make food through photosynthesis (2 marks)', 'Primary consumers eat producers (2 marks)', 'Decomposers break down dead matter and recycle nutrients (2 marks)']
            },
            specReference: '3.1.2.1 - Food chains and webs'
          },
          {
            id: 'g5-q3',
            question: 'Describe the process of nutrient cycling in ecosystems.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Nutrients cycle between biotic and abiotic components.\n\nPlants absorb nutrients from soil through roots.\n\nAnimals obtain nutrients by eating plants or other animals.\n\nWhen organisms die, decomposers break them down, returning nutrients to the soil.',
            markingCriteria: {
              breakdown: ['Nutrients cycle between living and non-living (1 mark)', 'Plants absorb from soil (1 mark)', 'Animals get nutrients from food (1 mark)', 'Decomposers return nutrients to soil (1 mark)']
            },
            specReference: '3.1.2.1 - Nutrient cycling'
          },
          {
            id: 'g5-q4',
            question: 'Explain how a change in one component of an ecosystem can affect other components.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ecosystems are interdependent - all components are connected.\n\nRemoving a predator leads to increase in prey numbers, which increases pressure on food sources.\n\nClimate change affects plant growth, which impacts all animals in food chains.\n\nSoil degradation reduces plant growth, affecting entire food webs.',
            markingCriteria: {
              breakdown: ['Recognition of interdependence (1 mark)', 'Example of predator-prey relationship (1 mark)', 'Example of climate impact (1 mark)', 'Example of soil/habitat impact (1 mark)']
            },
            specReference: '3.1.2.1 - Ecosystem balance'
          },
          {
            id: 'g5-q5',
            question: 'Describe the global distribution of large-scale ecosystems (biomes).',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Tropical rainforests near the equator in hot, wet climates.\n\nDeserts in subtropical high-pressure zones (30°N and S).\n\nTemperate forests in mid-latitudes with moderate climates.\n\nTundra in Arctic regions with very cold climates.',
            markingCriteria: {
              breakdown: ['Tropical rainforests near equator (1 mark)', 'Deserts at 30°N/S (1 mark)', 'Temperate forests in mid-latitudes (1 mark)', 'Tundra in Arctic regions (1 mark)']
            },
            specReference: '3.1.2.1 - Global distribution of ecosystems'
          },
          {
            id: 'g5-q6',
            question: 'Using a named UK ecosystem, explain the roles of producers, consumers, and decomposers.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'In a UK woodland ecosystem:\n\nProducers include oak trees, hazel shrubs, and ferns that photosynthesize.\n\nPrimary consumers include deer, rabbits, and caterpillars that eat plants.\n\nSecondary consumers include foxes and birds that eat herbivores.\n\nDecomposers include bacteria and fungi that break down leaf litter and dead animals.',
            markingCriteria: {
              breakdown: ['Named UK ecosystem (1 mark)', 'Examples of producers (2 marks)', 'Examples of consumers at different levels (2 marks)', 'Examples of decomposers (1 mark)']
            },
            specReference: '3.1.2.1 - UK ecosystem example'
          },
          {
            id: 'g5-q7',
            question: 'Explain what is meant by interdependence in ecosystems.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Interdependence means all components of an ecosystem depend on each other.\n\nChanges to one component affect other components.\n\nFor example, plants depend on soil nutrients, animals depend on plants for food, and decomposers depend on dead organisms.',
            markingCriteria: {
              breakdown: ['All components depend on each other (1 mark)', 'Changes affect other components (1 mark)', 'Example of interdependence (1 mark)']
            },
            specReference: '3.1.2.1 - Interdependence'
          },
          {
            id: 'g5-q8',
            question: 'Describe the characteristics that determine the distribution of different ecosystems.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Climate (temperature and precipitation) is the main factor.\n\nSoil type and depth affect plant growth.\n\nRelief and altitude influence temperature and drainage.\n\nHuman activities can modify or destroy natural ecosystems.',
            markingCriteria: {
              breakdown: ['Climate factors (temperature/precipitation) (1 mark)', 'Soil characteristics (1 mark)', 'Relief/altitude effects (1 mark)', 'Human impact (1 mark)']
            },
            specReference: '3.1.2.1 - Ecosystem distribution factors'
          },
          {
            id: 'g5-q9',
            question: 'Explain how energy flows through an ecosystem.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Energy enters ecosystems through photosynthesis by producers.\n\nEnergy flows through food chains from producers to consumers.\n\nEnergy is lost at each trophic level through respiration and heat.\n\nDecomposers release remaining energy when breaking down dead matter.',
            markingCriteria: {
              breakdown: ['Energy enters through photosynthesis (1 mark)', 'Flows through food chains (1 mark)', 'Energy lost at each level (1 mark)', 'Decomposers release remaining energy (1 mark)']
            },
            specReference: '3.1.2.1 - Energy flow'
          },
          {
            id: 'g5-q10',
            question: 'Assess the importance of maintaining ecosystem balance.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Ecosystem balance maintains biodiversity and prevents species extinction.\n\nIt ensures sustainable resource supply for humans (food, medicines, materials).\n\nBalanced ecosystems provide services like water purification and climate regulation.\n\nHowever, some human activities may require ecosystem modification for development.\n\nThe challenge is balancing conservation with human needs.',
            markingCriteria: {
              breakdown: ['Maintains biodiversity (1 mark)', 'Provides resources for humans (1 mark)', 'Ecosystem services (1 mark)', 'Recognition of development needs (1 mark)', 'Evaluation of balance needed (2 marks)']
            },
            specReference: '3.1.2.1 - Ecosystem balance importance'
          }
        ]
      },
      {
        id: 'g6-tropical-rainforests',
        name: 'Tropical Rainforests',
        questions: [
          {
            id: 'g6-q1',
            question: 'Describe the physical characteristics of tropical rainforests.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'High temperatures (25-30°C) with little seasonal variation.\n\nHigh rainfall (over 2000mm annually) with no dry season.\n\nFour distinct layers: emergent, canopy, understory, and forest floor.\n\nPoor soils due to rapid nutrient cycling and heavy leaching.',
            markingCriteria: {
              breakdown: ['High temperatures with little variation (1 mark)', 'High rainfall/no dry season (1 mark)', 'Four vegetation layers (1 mark)', 'Poor soils/rapid nutrient cycling (1 mark)']
            },
            specReference: '3.1.2.2 - Tropical rainforest characteristics'
          },
          {
            id: 'g6-q2',
            question: 'Explain how plants have adapted to life in tropical rainforests.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Tall trees with emergent layer to reach sunlight above canopy.\n\nButtress roots provide stability in shallow soils.\n\nDrip tips on leaves allow rapid water runoff to prevent fungal growth.\n\nLianas climb other plants to reach light without investing energy in thick trunks.\n\nEpiphytes grow on other plants to access light in canopy.',
            markingCriteria: {
              breakdown: ['Tall trees/emergent layer (1 mark)', 'Buttress roots for stability (1 mark)', 'Drip tips for water runoff (1 mark)', 'Lianas for climbing (1 mark)', 'Epiphytes for canopy access (1 mark)', 'Clear explanation (1 mark)']
            },
            specReference: '3.1.2.2 - Plant adaptations'
          },
          {
            id: 'g6-q3',
            question: 'Describe how animals have adapted to tropical rainforest conditions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Many animals are arboreal (tree-dwelling) to access food in canopy.\n\nBright colors for communication in dense vegetation.\n\nStrong limbs and grasping hands/tails for climbing.\n\nNocturnal behavior to avoid daytime heat and competition.',
            markingCriteria: {
              breakdown: ['Arboreal lifestyle (1 mark)', 'Bright colors for communication (1 mark)', 'Physical adaptations for climbing (1 mark)', 'Nocturnal behavior (1 mark)']
            },
            specReference: '3.1.2.2 - Animal adaptations'
          },
          {
            id: 'g6-q4',
            question: 'Explain the interdependence between climate, water, soils, plants, animals, and people in tropical rainforests.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Hot, wet climate supports rapid plant growth and high biodiversity.\n\nTrees create their own microclimate through transpiration, maintaining humidity.\n\nRapid decay in warm, moist conditions creates nutrient-poor soils.\n\nPlants and animals have complex relationships (pollination, seed dispersal).\n\nIndigenous people depend on forest for food, shelter, and medicines.',
            markingCriteria: {
              breakdown: ['Climate supports plant growth (1 mark)', 'Trees create microclimate (1 mark)', 'Warm conditions affect soil (1 mark)', 'Plant-animal relationships (1 mark)', 'Human dependence on forest (1 mark)', 'Recognition of interdependence (1 mark)']
            },
            specReference: '3.1.2.2 - Interdependence'
          },
          {
            id: 'g6-q5',
            question: 'Describe the main causes of deforestation in tropical rainforests.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Commercial agriculture (palm oil, soya, cattle ranching) for global markets.\n\nSubsistence farming by local populations clearing land for crops.\n\nLogging for valuable hardwood timber exports.\n\nMining for minerals and metals.\n\nRoad building for transport and development access.\n\nPopulation growth increasing pressure on land.',
            markingCriteria: {
              breakdown: ['Commercial agriculture (1 mark)', 'Subsistence farming (1 mark)', 'Logging for timber (1 mark)', 'Mining activities (1 mark)', 'Infrastructure development (1 mark)', 'Population pressure (1 mark)']
            },
            specReference: '3.1.2.2 - Causes of deforestation'
          },
          {
            id: 'g6-q6',
            question: 'Using a case study, explain the causes and impacts of deforestation.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Amazon Rainforest, Brazil:\n\nCauses: Cattle ranching (80% of cleared land), soya farming for export, illegal logging, mining, road construction.\n\nEnvironmental impacts: Climate change through CO2 release, soil erosion, loss of biodiversity, disruption of water cycle.\n\nEconomic impacts: Short-term economic gains but long-term loss of resources, tourism decline.\n\nSocial impacts: Indigenous peoples lose traditional lands and lifestyles.',
            markingCriteria: {
              breakdown: ['Named case study (1 mark)', 'Causes - agriculture/ranching (2 marks)', 'Environmental impacts (2 marks)', 'Economic impacts (2 marks)', 'Social impacts (1 mark)']
            },
            specReference: '3.1.2.2 - Deforestation case study'
          },
          {
            id: 'g6-q7',
            question: 'Describe sustainable management strategies for tropical rainforests.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Selective logging instead of clear-cutting to maintain forest structure.\n\nReplanting programs to restore cleared areas.\n\nConservation areas and national parks to protect biodiversity.\n\nEcotourism providing income without destroying forest.\n\nEducation programs for local communities about conservation.\n\nInternational agreements and debt reduction schemes.',
            markingCriteria: {
              breakdown: ['Selective logging (1 mark)', 'Replanting programs (1 mark)', 'Conservation areas (1 mark)', 'Ecotourism (1 mark)', 'Education programs (1 mark)', 'International agreements (1 mark)']
            },
            specReference: '3.1.2.2 - Sustainable management'
          },
          {
            id: 'g6-q8',
            question: 'Explain the global importance of tropical rainforest biodiversity.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Contains over 50% of world\'s species despite covering only 6% of land surface.\n\nSource of medicines - many pharmaceuticals derived from rainforest plants.\n\nGenetic diversity important for crop development and disease resistance.\n\nEcosystem services like climate regulation and oxygen production.',
            markingCriteria: {
              breakdown: ['High species diversity statistics (1 mark)', 'Source of medicines (1 mark)', 'Genetic diversity importance (1 mark)', 'Ecosystem services (1 mark)']
            },
            specReference: '3.1.2.2 - Biodiversity issues'
          },
          {
            id: 'g6-q9',
            question: 'Assess the effectiveness of different strategies to reduce tropical rainforest deforestation.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Legal protection through national parks is effective where enforced but requires government commitment.\n\nEcotourism provides sustainable income but limited to accessible areas.\n\nInternational agreements like REDD+ show promise but depend on global cooperation.\n\nDebt-for-nature swaps effective but only for heavily indebted countries.\n\nEducation and community involvement essential for long-term success.\n\nEffectiveness ultimately depends on balancing conservation with economic development needs.',
            markingCriteria: {
              breakdown: ['Legal protection effectiveness (2 marks)', 'Ecotourism benefits and limitations (2 marks)', 'International approaches (2 marks)', 'Community involvement importance (1 mark)', 'Overall evaluation (1 mark)']
            },
            specReference: '3.1.2.2 - Management strategy evaluation'
          },
          {
            id: 'g6-q10',
            question: 'Explain how deforestation contributes to climate change.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Trees store carbon in their biomass - when cut down, this carbon is released as CO2.\n\nBurning cleared forest releases additional CO2 into atmosphere.\n\nReduced photosynthesis means less CO2 absorbed from atmosphere.\n\nSoil carbon also released when forest floor is disturbed.',
            markingCriteria: {
              breakdown: ['Carbon release from cut trees (1 mark)', 'CO2 from burning (1 mark)', 'Reduced CO2 absorption (1 mark)', 'Soil carbon release (1 mark)']
            },
            specReference: '3.1.2.2 - Climate change impacts'
          }
        ]
      },
      {
        id: 'g7-hot-deserts-cold-environments',
        name: 'Hot Deserts/Cold Environments',
        questions: [
          {
            id: 'g7-q1',
            question: 'Choose either hot deserts OR cold environments. Describe the physical characteristics of your chosen environment.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Very low rainfall (under 250mm annually), high daytime temperatures (above 40°C), large diurnal temperature range, sparse vegetation, sandy or rocky surfaces.\n\nOR\n\nCOLD ENVIRONMENTS: Very low temperatures (below -10°C annually), short growing season, permafrost in tundra, limited precipitation often as snow, specialized vegetation adapted to cold.',
            markingCriteria: {
              breakdown: ['Clear choice of environment (1 mark)', 'Temperature characteristics (1 mark)', 'Precipitation characteristics (1 mark)', 'Other physical features (1 mark)']
            },
            specReference: '3.1.2.3 - Physical characteristics'
          },
          {
            id: 'g7-q2',
            question: 'For either hot deserts OR cold environments, explain how organisms have adapted to survive.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Cacti store water in thick stems and have waxy coatings to reduce water loss. Animals like camels store fat in humps and can survive without water. Many animals are nocturnal to avoid heat.\n\nOR\n\nCOLD ENVIRONMENTS: Arctic foxes have thick fur and small ears to conserve heat. Polar bears have layers of fat for insulation. Plants grow low to ground to avoid wind.',
            markingCriteria: {
              breakdown: ['Plant adaptations with examples (2 marks)', 'Animal adaptations with examples (2 marks)', 'Behavioral adaptations (1 mark)', 'Clear explanation of how adaptations help survival (1 mark)']
            },
            specReference: '3.1.2.3 - Organism adaptations'
          },
          {
            id: 'g7-q3',
            question: 'Using a case study of either a hot desert OR cold environment, describe the development opportunities.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERT (e.g., Sahara): Solar energy potential, mineral extraction (oil, gas), agriculture with irrigation, tourism to unique landscapes.\n\nOR\n\nCOLD ENVIRONMENT (e.g., Alaska): Oil and gas extraction, mining (gold, copper), fishing, tourism, renewable energy (wind).',
            markingCriteria: {
              breakdown: ['Named case study (1 mark)', 'Energy/mineral opportunities (1 mark)', 'Agriculture/fishing opportunities (1 mark)', 'Tourism/other opportunities (1 mark)']
            },
            specReference: '3.1.2.3 - Development opportunities'
          },
          {
            id: 'g7-q4',
            question: 'For either hot deserts OR cold environments, explain the development challenges.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Extreme temperatures make working conditions difficult, water supply challenges, remote locations increase costs, infrastructure difficult to build and maintain.\n\nOR\n\nCOLD ENVIRONMENTS: Extreme cold and permafrost, inaccessibility and remoteness, short construction seasons, high costs of transport and labor.',
            markingCriteria: {
              breakdown: ['Temperature challenges (1 mark)', 'Access/location challenges (1 mark)', 'Infrastructure challenges (1 mark)', 'Cost implications (1 mark)']
            },
            specReference: '3.1.2.3 - Development challenges'
          },
          {
            id: 'g7-q5',
            question: 'For either hot deserts OR cold environments, explain the main environmental threats or challenges facing your chosen environment.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Desertification causes include climate change reducing rainfall, overgrazing by livestock removing vegetation, over-cultivation exhausting soils, deforestation for fuelwood, population growth increasing pressure on marginal lands, poor irrigation leading to salinization.\n\nOR\n\nCOLD ENVIRONMENTS: Threats include oil spills devastating fragile ecosystems, mining disrupting permafrost and releasing greenhouse gases, increased human activity disturbing wildlife migration, climate change accelerated by fossil fuel extraction.',
            markingCriteria: {
              breakdown: ['Clear choice of environment (1 mark)', 'Climate/temperature impacts (1 mark)', 'Human activity impacts (1 mark)', 'Land use impacts (1 mark)', 'Population/development pressure (1 mark)', 'Long-term environmental consequences (1 mark)']
            },
            specReference: '3.1.2.3 - Environmental threats'
          },
          {
            id: 'g7-q6',
            question: 'For either hot deserts OR cold environments, describe strategies that can be used to manage environmental challenges.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Tree planting and afforestation to stabilize soils, improved irrigation techniques to prevent salinization, soil management including terracing and crop rotation, appropriate technology like drought-resistant crops.\n\nOR\n\nCOLD ENVIRONMENTS: Appropriate technology that minimizes environmental impact, government regulations to control development, international agreements for conservation, environmental impact assessments before projects.',
            markingCriteria: {
              breakdown: ['Conservation/restoration strategies (1 mark)', 'Technology-based solutions (1 mark)', 'Management/regulatory approaches (1 mark)', 'Long-term sustainability measures (1 mark)']
            },
            specReference: '3.1.2.3 - Management strategies'
          },
          {
            id: 'g7-q7',
            question: 'For either hot deserts OR cold environments, explain the threats from economic development.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'HOT DESERTS: Mining and resource extraction disrupting ecosystems, increased water demand for agriculture and industry, tourism pressure on fragile landscapes, infrastructure development fragmenting habitats.\n\nOR\n\nCOLD ENVIRONMENTS: Oil spills devastating fragile ecosystems that take decades to recover, mining disrupting permafrost and releasing greenhouse gases, increased human activity disturbing wildlife migration patterns, climate change accelerated by fossil fuel extraction.',
            markingCriteria: {
              breakdown: ['Resource extraction impacts (1 mark)', 'Habitat/ecosystem disruption (1 mark)', 'Wildlife/biodiversity threats (1 mark)', 'Long-term environmental consequences (1 mark)']
            },
            specReference: '3.1.2.3 - Economic development threats'
          },
          {
            id: 'g7-q8',
            question: 'Assess the value of wilderness areas in extreme environments.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Wilderness areas preserve unique ecosystems and biodiversity that cannot survive elsewhere.\n\nThey provide important scientific research opportunities for climate change studies.\n\nCultural value for indigenous peoples who depend on traditional ways of life.\n\nTourism value generating income while preserving environment.\n\nHowever, protection may limit economic development opportunities for local communities.',
            markingCriteria: {
              breakdown: ['Biodiversity conservation (1 mark)', 'Scientific research value (1 mark)', 'Cultural significance (1 mark)', 'Economic value (tourism) (1 mark)', 'Recognition of development limitations (1 mark)', 'Overall assessment (1 mark)']
            },
            specReference: '3.1.2.3 - Value of wilderness'
          },
          {
            id: 'g7-q9',
            question: 'Describe strategies for sustainable development in extreme environments.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Use of appropriate technology that minimizes environmental impact.\n\nGovernment regulations to control development and protect sensitive areas.\n\nInternational agreements for conservation of global wilderness areas.\n\nInvolvement of conservation groups in monitoring and protection.\n\nCommunity involvement ensuring local people benefit from development.\n\nEnvironmental impact assessments before major projects.',
            markingCriteria: {
              breakdown: ['Appropriate technology (1 mark)', 'Government regulation (1 mark)', 'International cooperation (1 mark)', 'Conservation group involvement (1 mark)', 'Community participation (1 mark)', 'Environmental assessment (1 mark)']
            },
            specReference: '3.1.2.3 - Sustainable development strategies'
          },
          {
            id: 'g7-q10',
            question: 'Compare the challenges of living and working in hot deserts versus cold environments.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Both environments have extreme temperatures that create health and safety challenges.\n\nWater supply is critical in hot deserts, while heating and shelter are priorities in cold environments.\n\nBoth are remote and inaccessible, increasing costs and difficulty of transport.\n\nDeserts face challenges from sand and heat affecting equipment, while cold environments face permafrost and ice problems.\n\nBoth require specialized technology and clothing for human survival.\n\nCold environments have seasonal variations affecting work, while deserts have more consistent conditions.',
            markingCriteria: {
              breakdown: ['Temperature challenges in both (2 marks)', 'Different resource priorities (water vs heat) (2 marks)', 'Access and transport similarities (1 mark)', 'Different environmental hazards (2 marks)', 'Overall comparison (1 mark)']
            },
            specReference: '3.1.2.3 - Comparative challenges'
          }
        ]
      },
      {
        id: 'g8-uk-physical-landscapes',
        name: 'UK Physical Landscapes Overview',
        questions: [
          {
            id: 'g8-q1',
            question: 'Describe the main upland areas of the UK.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Scottish Highlands in northern Scotland with high mountains and rugged terrain.\n\nLake District in northwest England with rounded hills and lakes.\n\nPennines running north-south through northern England.\n\nWelsh Mountains in Wales including Snowdonia.',
            markingCriteria: {
              breakdown: ['Scottish Highlands identified (1 mark)', 'Lake District mentioned (1 mark)', 'Pennines identified (1 mark)', 'Welsh mountains/Snowdonia (1 mark)']
            },
            specReference: '3.1.3.1 - UK physical landscape overview'
          },
          {
            id: 'g8-q2',
            question: 'Identify the main lowland areas of the UK.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'East Anglia in eastern England with flat, fertile plains.\n\nSouth East England including the Thames Valley.\n\nMidlands plains in central England.',
            markingCriteria: {
              breakdown: ['East Anglia identified (1 mark)', 'South East England/Thames Valley (1 mark)', 'Midlands mentioned (1 mark)']
            },
            specReference: '3.1.3.1 - UK physical landscape overview'
          },
          {
            id: 'g8-q3',
            question: 'Name the main river systems of the UK.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'River Thames flowing through London to the North Sea.\n\nRiver Severn, the longest UK river, flowing through Wales and England.\n\nRiver Trent in the Midlands.\n\nRiver Clyde in Scotland.',
            markingCriteria: {
              breakdown: ['River Thames identified (1 mark)', 'River Severn as longest UK river (1 mark)', 'River Trent mentioned (1 mark)', 'River Clyde or other Scottish river (1 mark)']
            },
            specReference: '3.1.3.1 - UK river systems'
          },
          {
            id: 'g8-q4',
            question: 'Explain how geology influences UK landscapes.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hard rocks like granite form upland areas that resist erosion.\n\nSoft rocks like clay create lowland areas that erode more easily.\n\nSedimentary rocks create distinctive layered landscapes.\n\nGeological structure affects drainage patterns and river development.',
            markingCriteria: {
              breakdown: ['Hard rocks form uplands (1 mark)', 'Soft rocks form lowlands (1 mark)', 'Sedimentary rock characteristics (1 mark)', 'Impact on drainage/rivers (1 mark)']
            },
            specReference: '3.1.3.1 - Geological influences'
          },
          {
            id: 'g8-q5',
            question: 'Describe how past ice ages have shaped UK landscapes.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Glacial erosion carved out deep valleys and lake basins in upland areas.\n\nGlacial deposition created fertile plains in lowland areas.\n\nU-shaped valleys formed by glacial erosion contrast with V-shaped river valleys.\n\nGlacial features like moraines and drumlins still visible today.',
            markingCriteria: {
              breakdown: ['Glacial erosion creating valleys/lakes (1 mark)', 'Glacial deposition in lowlands (1 mark)', 'U-shaped vs V-shaped valleys (1 mark)', 'Glacial features remaining (1 mark)']
            },
            specReference: '3.1.3.1 - Ice age impacts'
          },
          {
            id: 'g8-q6',
            question: 'Explain the distribution of different rock types across the UK.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Older, harder rocks in north and west (Scotland, Wales, Cornwall).\n\nYounger, softer rocks in south and east (chalk, clay, limestone).\n\nIgneous rocks like granite in Scottish Highlands.\n\nSedimentary rocks like limestone in Pennines and chalk in South Downs.',
            markingCriteria: {
              breakdown: ['Older rocks in north/west (1 mark)', 'Younger rocks in south/east (1 mark)', 'Igneous rock examples and locations (1 mark)', 'Sedimentary rock examples and locations (1 mark)']
            },
            specReference: '3.1.3.1 - Rock type distribution'
          },
          {
            id: 'g8-q7',
            question: 'Describe the major escarpments found in the UK.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The Cotswold Hills formed by limestone creating steep scarps.\n\nThe South Downs chalk escarpment in southern England.\n\nThe North York Moors escarpment in northern England.',
            markingCriteria: {
              breakdown: ['Cotswolds limestone escarpment (1 mark)', 'South Downs chalk escarpment (1 mark)', 'North York Moors or other escarpment (1 mark)']
            },
            specReference: '3.1.3.1 - UK escarpments'
          },
          {
            id: 'g8-q8',
            question: 'Explain how human activities have modified UK landscapes.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Agriculture has created field patterns and removed natural vegetation.\n\nUrbanization has completely transformed natural landscapes.\n\nQuarrying and mining have created artificial landforms.\n\nForestry has replaced natural woodland with planted forests.',
            markingCriteria: {
              breakdown: ['Agricultural modification (1 mark)', 'Urban development impact (1 mark)', 'Extractive industry effects (1 mark)', 'Forestry changes (1 mark)']
            },
            specReference: '3.1.3.1 - Human landscape modification'
          },
          {
            id: 'g8-q9',
            question: 'Compare the characteristics of highland and lowland areas in the UK.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Highland areas have steep slopes and rocky terrain, while lowlands are flat with gentle gradients.\n\nHighlands are made of harder, older rocks; lowlands of softer, younger rocks.\n\nHighlands have sparse population and extensive farming; lowlands are densely populated with intensive agriculture.\n\nHighlands are wetter and colder; lowlands are drier and warmer.',
            markingCriteria: {
              breakdown: ['Relief differences (slopes/terrain) (2 marks)', 'Geological differences (1 mark)', 'Population and land use differences (2 marks)', 'Climate differences (1 mark)']
            },
            specReference: '3.1.3.1 - Highland vs lowland comparison'
          },
          {
            id: 'g8-q10',
            question: 'Assess the relative importance of geological and climatic factors in shaping UK landscapes.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Geology provides the foundation - hard rocks create uplands, soft rocks create lowlands.\n\nClimate drives erosion processes - rainfall and temperature affect weathering rates.\n\nPast climates (ice ages) carved major landscape features that geology couldn\'t prevent.\n\nCurrent climate continues to shape landscapes through river erosion and coastal processes.\n\nGeology determines resistance to erosion, but climate provides the energy for landscape change.\n\nBoth factors work together - neither alone can explain UK landscape diversity.',
            markingCriteria: {
              breakdown: ['Geological control on major landforms (2 marks)', 'Climate driving erosion processes (2 marks)', 'Past climate impacts (ice ages) (2 marks)', 'Interaction between factors (1 mark)', 'Overall evaluation (1 mark)']
            },
            specReference: '3.1.3.1 - Geological vs climatic factors'
          }
        ]
      },
      {
        id: 'g9-coastal-landscapes',
        name: 'Coastal Landscapes in the UK',
        questions: [
          {
            id: 'g9-q1',
            question: 'Distinguish between constructive and destructive waves.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Constructive waves have low height, long wavelength, and low frequency (6-8 per minute).\n\nThey have strong swash and weak backwash, depositing sediment.\n\nDestructive waves are high, steep, and frequent (10-14 per minute).\n\nThey have weak swash but strong backwash, eroding the coast.',
            markingCriteria: {
              breakdown: ['Constructive wave characteristics (height, frequency) (1 mark)', 'Constructive wave action (strong swash, deposition) (1 mark)', 'Destructive wave characteristics (1 mark)', 'Destructive wave action (erosion) (1 mark)']
            },
            specReference: '3.1.3.2 - Wave types and characteristics'
          },
          {
            id: 'g9-q2',
            question: 'Explain the process of hydraulic action in coastal erosion.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Waves crash against rock faces, forcing air into cracks and joints.\n\nCompressed air creates intense pressure within the rock.\n\nWhen waves retreat, pressure is suddenly released, causing rock to shatter.',
            markingCriteria: {
              breakdown: ['Waves force air into cracks (1 mark)', 'Air compression creates pressure (1 mark)', 'Pressure release causes rock to break (1 mark)']
            },
            specReference: '3.1.3.2 - Coastal erosion processes'
          },
          {
            id: 'g9-q3',
            question: 'Describe the formation of headlands and bays.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Coastlines with alternating hard and soft rocks are eroded at different rates.\n\nSoft rocks erode faster, forming bays with beaches.\n\nHard rocks resist erosion, forming headlands that jut out into the sea.\n\nWave refraction concentrates erosion on headlands and reduces it in bays.',
            markingCriteria: {
              breakdown: ['Alternating hard and soft rocks (1 mark)', 'Soft rocks erode faster forming bays (1 mark)', 'Hard rocks resist erosion forming headlands (1 mark)', 'Wave refraction effects (1 mark)']
            },
            specReference: '3.1.3.2 - Erosional landforms'
          },
          {
            id: 'g9-q4',
            question: 'Explain the sequence of formation of caves, arches, and stacks.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Wave attack concentrates on headlands due to wave refraction.\n\nHydraulic action and abrasion exploit weaknesses like joints and faults.\n\nContinued erosion enlarges weaknesses to form caves.\n\nWaves attack cave from both sides until they meet, forming an arch.\n\nWeathering and erosion weaken the arch roof until it collapses, leaving a stack.\n\nFurther erosion may reduce the stack to a stump.',
            markingCriteria: {
              breakdown: ['Wave attack on headlands (1 mark)', 'Exploitation of weaknesses (1 mark)', 'Cave formation (1 mark)', 'Arch formation (1 mark)', 'Stack formation (1 mark)', 'Complete sequence understanding (1 mark)']
            },
            specReference: '3.1.3.2 - Coastal erosion sequence'
          },
          {
            id: 'g9-q5',
            question: 'Describe how spits are formed.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Longshore drift transports sediment along the coast.\n\nWhere the coastline changes direction, sediment continues in original direction.\n\nDeposition occurs in deeper water, building up a ridge of sediment.\n\nWind and waves may curve the spit end, forming a recurved tip.',
            markingCriteria: {
              breakdown: ['Longshore drift transport (1 mark)', 'Continued transport past coastline change (1 mark)', 'Deposition in deeper water (1 mark)', 'Recurved tip formation (1 mark)']
            },
            specReference: '3.1.3.2 - Depositional landforms'
          },
          {
            id: 'g9-q6',
            question: 'Using a named UK coastal area, describe the erosional and depositional landforms present.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Dorset Coast (Jurassic Coast):\n\nErosional features: Old Harry Rocks (chalk stacks), Durdle Door (limestone arch), Lulworth Cove (bay in soft rocks).\n\nDepositional features: Chesil Beach (tombolo), Studland Bay beach, sand dunes.\n\nVaried geology creates diverse landforms along this coastline.',
            markingCriteria: {
              breakdown: ['Named UK coastal area (1 mark)', 'Erosional landforms with examples (2 marks)', 'Depositional landforms with examples (2 marks)', 'Link to geological variety (1 mark)']
            },
            specReference: '3.1.3.2 - UK coastal case study'
          },
          {
            id: 'g9-q7',
            question: 'Explain how geology influences coastal landform development.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Rock type affects resistance to erosion - hard rocks form cliffs, soft rocks form bays.\n\nRock structure (joints, faults, bedding) creates weaknesses for erosion to exploit.\n\nDip of rock layers affects cliff profiles and stability.\n\nAlternating rock types create complex coastlines with headlands and bays.',
            markingCriteria: {
              breakdown: ['Rock resistance differences (1 mark)', 'Rock structure weaknesses (1 mark)', 'Rock dip effects (1 mark)', 'Alternating geology effects (1 mark)']
            },
            specReference: '3.1.3.2 - Geological influence on coasts'
          },
          {
            id: 'g9-q8',
            question: 'Compare hard and soft engineering coastal management strategies.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Hard engineering: Sea walls, groynes, rock armor - expensive but provide strong protection, may cause problems elsewhere.\n\nSoft engineering: Beach nourishment, dune restoration, managed retreat - cheaper, more sustainable, work with natural processes.\n\nHard engineering fights against nature; soft engineering works with it.',
            markingCriteria: {
              breakdown: ['Hard engineering examples (2 marks)', 'Soft engineering examples (2 marks)', 'Comparison of approaches (1 mark)', 'Evaluation of effectiveness (1 mark)']
            },
            specReference: '3.1.3.2 - Coastal management strategies'
          },
          {
            id: 'g9-q9',
            question: 'Using a named example, evaluate the success of a coastal management scheme.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Thames Estuary Coastal Management:\n\nStrategy: Combination of Thames Barrier (hard engineering) and managed retreat in some areas.\n\nSuccess: Thames Barrier has successfully prevented flooding of London multiple times since 1982.\n\nSoft engineering upstream has restored natural flood plains.\n\nHowever, rising sea levels may make current defenses inadequate.\n\nHigh costs and need for regular upgrades.\n\nOverall successful but requires ongoing investment and adaptation.',
            markingCriteria: {
              breakdown: ['Named coastal management example (1 mark)', 'Description of management strategies used (2 marks)', 'Evidence of success (2 marks)', 'Limitations or problems (2 marks)', 'Overall evaluation (1 mark)']
            },
            specReference: '3.1.3.2 - Coastal management case study'
          },
          {
            id: 'g9-q10',
            question: 'Assess the advantages and disadvantages of managed retreat as a coastal management strategy.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Advantages: Cost-effective long-term solution, creates natural coastal habitats, absorbs wave energy, adapts to sea level rise.\n\nDisadvantages: Loss of existing land use and property, compensation costs, public opposition, may not be suitable for high-value areas.\n\nEffectiveness depends on local circumstances and community acceptance.',
            markingCriteria: {
              breakdown: ['Economic advantages (1 mark)', 'Environmental advantages (1 mark)', 'Economic disadvantages (1 mark)', 'Social disadvantages (1 mark)', 'Context-dependent evaluation (2 marks)']
            },
            specReference: '3.1.3.2 - Managed retreat evaluation'
          }
        ]
      },
      {
        id: 'g10-river-landscapes',
        name: 'River Landscapes in the UK',
        questions: [
          {
            id: 'g10-q1',
            question: 'Describe the typical long profile of a river from source to mouth.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Steep gradient in upper course with rapid elevation change.\n\nGradual decrease in gradient through middle course.\n\nVery gentle gradient in lower course approaching base level.\n\nOverall concave profile due to erosion of weakest points.',
            markingCriteria: {
              breakdown: ['Steep upper course gradient (1 mark)', 'Decreasing gradient downstream (1 mark)', 'Gentle lower course gradient (1 mark)', 'Concave overall shape (1 mark)']
            },
            specReference: '3.1.3.3 - River profiles'
          },
          {
            id: 'g10-q2',
            question: 'Explain the four processes of river erosion.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hydraulic action: Force of moving water removes loose material.\n\nAbrasion: Rocks carried by river scrape against bed and banks.\n\nAttrition: Rocks carried by river collide and break into smaller pieces.\n\nSolution: Chemical weathering dissolves soluble rocks like limestone.',
            markingCriteria: {
              breakdown: ['Hydraulic action described (1 mark)', 'Abrasion described (1 mark)', 'Attrition described (1 mark)', 'Solution described (1 mark)']
            },
            specReference: '3.1.3.3 - Fluvial erosion processes'
          },
          {
            id: 'g10-q3',
            question: 'Describe the formation of waterfalls and gorges.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'River flows over alternating hard and soft rocks.\n\nSoft rock erodes faster, creating a step in the river bed.\n\nWater falls over the hard rock, creating a waterfall.\n\nHydraulic action at the base creates a plunge pool.\n\nUndercutting causes hard rock to collapse.\n\nWaterfall retreats upstream, leaving a steep-sided gorge.',
            markingCriteria: {
              breakdown: ['Alternating hard/soft rocks (1 mark)', 'Differential erosion creates step (1 mark)', 'Plunge pool formation (1 mark)', 'Undercutting process (1 mark)', 'Retreat and collapse (1 mark)', 'Gorge formation (1 mark)']
            },
            specReference: '3.1.3.3 - Waterfall formation'
          },
          {
            id: 'g10-q4',
            question: 'Explain how meanders and oxbow lakes are formed.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'River flows faster on outside of bends due to deeper water.\n\nFaster flow erodes outside bank, creating river cliff.\n\nSlower flow on inside deposits sediment, forming slip-off slope.\n\nLateral erosion gradually increases meander size.\n\nEventually, river cuts through narrow neck during flood.\n\nOld meander loop is abandoned, forming oxbow lake.',
            markingCriteria: {
              breakdown: ['Faster flow on outside of bend (1 mark)', 'Erosion creates river cliff (1 mark)', 'Deposition on inside creates slip-off slope (1 mark)', 'Meander migration (1 mark)', 'Neck cutting during flood (1 mark)', 'Oxbow lake formation (1 mark)']
            },
            specReference: '3.1.3.3 - Meander formation'
          },
          {
            id: 'g10-q5',
            question: 'Describe how floodplains and levees are formed.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'During floods, river overflows its banks onto surrounding land.\n\nRiver velocity decreases rapidly outside the channel.\n\nCoarse sediment deposits first, building up natural levees beside channel.\n\nFiner sediment settles across wider area, creating flat floodplain.',
            markingCriteria: {
              breakdown: ['River overflows during floods (1 mark)', 'Velocity decreases outside channel (1 mark)', 'Coarse sediment forms levees (1 mark)', 'Fine sediment creates floodplain (1 mark)']
            },
            specReference: '3.1.3.3 - Floodplain formation'
          },
          {
            id: 'g10-q6',
            question: 'Using a named UK river valley, describe the landforms present.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'River Tees, North England:\n\nUpper course: High Force waterfall, V-shaped valley, interlocking spurs.\n\nMiddle course: Meanders developing, wider valley floor.\n\nLower course: Extensive floodplain, Tees Barrage, estuary with mudflats.\n\nShows typical river landform sequence from source to mouth.',
            markingCriteria: {
              breakdown: ['Named UK river valley (1 mark)', 'Upper course landforms (2 marks)', 'Middle course landforms (1 mark)', 'Lower course landforms (2 marks)']
            },
            specReference: '3.1.3.3 - UK river valley case study'
          },
          {
            id: 'g10-q7',
            question: 'Explain the factors that increase flood risk.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Relief: Steep slopes increase surface runoff speed.\n\nGeology: Impermeable rocks prevent infiltration, increasing runoff.\n\nPrecipitation: Heavy or prolonged rainfall exceeds soil capacity.\n\nLand use: Urbanization creates impermeable surfaces; deforestation reduces interception.',
            markingCriteria: {
              breakdown: ['Relief factors (steep slopes) (1 mark)', 'Geological factors (permeability) (1 mark)', 'Precipitation intensity/duration (2 marks)', 'Land use changes (urbanization/deforestation) (2 marks)']
            },
            specReference: '3.1.3.3 - Flood risk factors'
          },
          {
            id: 'g10-q8',
            question: 'Interpret a hydrograph to explain the relationship between precipitation and river discharge.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Lag time shows delay between peak rainfall and peak discharge.\n\nSteep rising limb indicates rapid runoff (urban areas, steep slopes).\n\nGentle falling limb shows slow return to base flow.\n\nPeak discharge may exceed normal flow many times during storms.',
            markingCriteria: {
              breakdown: ['Lag time identified and explained (1 mark)', 'Rising limb characteristics (1 mark)', 'Falling limb characteristics (1 mark)', 'Peak discharge relationship (1 mark)']
            },
            specReference: '3.1.3.3 - Hydrograph interpretation'
          },
          {
            id: 'g10-q9',
            question: 'Compare hard and soft engineering flood management strategies.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Hard engineering: Dams, embankments, flood barriers - expensive but effective protection, may transfer problem downstream.\n\nSoft engineering: Afforestation, wetland restoration, flood warnings - cheaper, sustainable, work with natural processes.\n\nHard engineering provides immediate protection; soft engineering offers long-term solutions.',
            markingCriteria: {
              breakdown: ['Hard engineering examples and characteristics (2 marks)', 'Soft engineering examples and characteristics (2 marks)', 'Comparison of approaches (1 mark)', 'Evaluation of effectiveness (1 mark)']
            },
            specReference: '3.1.3.3 - Flood management strategies'
          },
          {
            id: 'g10-q10',
            question: 'Using a named example, evaluate the effectiveness of a UK flood management scheme.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Banbury Flood Alleviation Scheme, River Cherwell:\n\nCombination of hard engineering (flood walls, culverts) and soft engineering (upstream storage, natural floodplain).\n\nSuccessfully protected town center from 2007 and 2014 floods.\n\nCost £18 million but prevented much greater damage costs.\n\nSome areas still at risk, requiring ongoing monitoring.\n\nCommunity generally supportive due to reduced anxiety.\n\nOverall successful multi-method approach.',
            markingCriteria: {
              breakdown: ['Named UK flood management scheme (1 mark)', 'Description of management methods used (2 marks)', 'Evidence of success (2 marks)', 'Limitations or ongoing issues (2 marks)', 'Overall evaluation (1 mark)']
            },
            specReference: '3.1.3.3 - Flood management case study'
          }
        ]
      },
      {
        id: 'g11-glacial-landscapes',
        name: 'Glacial Landscapes in the UK',
        questions: [
          {
            id: 'g11-q1',
            question: 'Describe the extent of ice cover in the UK during the last ice age.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Ice covered most of Scotland, northern England down to the Midlands.\n\nWales was largely covered by ice sheets and valley glaciers.\n\nSouthern England remained ice-free but was affected by periglacial conditions.',
            markingCriteria: {
              breakdown: ['Scotland and northern England covered (1 mark)', 'Wales ice coverage (1 mark)', 'Southern England ice-free (1 mark)']
            },
            specReference: '3.1.3.4 - Ice age extent'
          },
          {
            id: 'g11-q2',
            question: 'Explain the process of glacial erosion through plucking.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Glacier freezes to rock surface, particularly in joints and cracks.\n\nAs glacier moves forward, it pulls away loose rock fragments.\n\nProcess is most effective where rock is already weakened by freeze-thaw weathering.',
            markingCriteria: {
              breakdown: ['Glacier freezes to rock (1 mark)', 'Movement pulls rock away (1 mark)', 'Most effective on weakened rock (1 mark)']
            },
            specReference: '3.1.3.4 - Glacial erosion processes'
          },
          {
            id: 'g11-q3',
            question: 'Describe the formation of a corrie (cirque).',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Snow accumulates in mountain hollows, particularly north-facing slopes.\n\nSnow compacts to form névé, then glacial ice.\n\nGlacier rotates, eroding hollow deeper through abrasion and plucking.\n\nFreeze-thaw weathering steepens back wall.\n\nWhen glacier melts, deep, armchair-shaped hollow remains, often with a tarn (lake).',
            markingCriteria: {
              breakdown: ['Snow accumulation in hollow (1 mark)', 'Ice formation and rotation (1 mark)', 'Erosion deepening hollow (1 mark)', 'Freeze-thaw on back wall (1 mark)', 'Final corrie shape with possible tarn (1 mark)']
            },
            specReference: '3.1.3.4 - Corrie formation'
          },
          {
            id: 'g11-q4',
            question: 'Explain how arêtes and pyramidal peaks are formed.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Multiple corries erode into mountain sides from different directions.\n\nWhen two corries erode back-to-back, a sharp knife-edge ridge (arête) forms between them.\n\nWhen three or more corries erode a mountain, a pyramidal peak forms at the center.\n\nContinued erosion sharpens these features over time.',
            markingCriteria: {
              breakdown: ['Multiple corries eroding mountain (1 mark)', 'Arête formation between two corries (1 mark)', 'Pyramidal peak from three+ corries (1 mark)', 'Continued sharpening (1 mark)']
            },
            specReference: '3.1.3.4 - Arête and pyramidal peak formation'
          },
          {
            id: 'g11-q5',
            question: 'Describe the characteristics of a glacial trough (U-shaped valley).',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Wide, flat floor contrasting with steep valley sides.\n\nU-shaped cross-profile very different from V-shaped river valleys.\n\nHanging valleys where tributaries enter high above main valley floor.\n\nOften contains ribbon lakes and waterfalls.',
            markingCriteria: {
              breakdown: ['Wide flat floor and steep sides (1 mark)', 'U-shaped profile (1 mark)', 'Hanging valleys present (1 mark)', 'Ribbon lakes/waterfalls (1 mark)']
            },
            specReference: '3.1.3.4 - Glacial trough characteristics'
          },
          {
            id: 'g11-q6',
            question: 'Explain how moraines are formed and describe the different types.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Moraines form from rock debris transported and deposited by glaciers.\n\nLateral moraines: Debris from valley sides carried along glacier edges.\n\nMedial moraines: Form where two lateral moraines join when glaciers merge.\n\nTerminal moraines: Debris deposited at glacier snout marks maximum advance.\n\nGround moraine: Material dragged beneath glacier creates till plains.',
            markingCriteria: {
              breakdown: ['Definition of moraine formation (1 mark)', 'Lateral moraine formation (1 mark)', 'Medial moraine formation (1 mark)', 'Terminal moraine formation (1 mark)', 'Ground moraine formation (1 mark)', 'Clear understanding of process (1 mark)']
            },
            specReference: '3.1.3.4 - Moraine formation and types'
          },
          {
            id: 'g11-q7',
            question: 'Using a named UK upland glaciated area, describe the landforms present.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Lake District, Cumbria:\n\nErosional features: Helvellyn and Scafell Pike (pyramidal peaks), Striding Edge (arête), Red Tarn and Grisedale Tarn (corrie tarns).\n\nDepositional features: Drumlins near Keswick, terminal moraines in valleys.\n\nU-shaped valleys like Great Langdale and Borrowdale.\n\nRibbon lakes including Windermere and Coniston Water.',
            markingCriteria: {
              breakdown: ['Named UK glaciated upland (1 mark)', 'Erosional landforms with examples (2 marks)', 'Depositional landforms with examples (1 mark)', 'Valley characteristics (1 mark)', 'Lake features (1 mark)']
            },
            specReference: '3.1.3.4 - UK glaciated upland case study'
          },
          {
            id: 'g11-q8',
            question: 'Describe the main economic activities in UK glaciated uplands.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Tourism: Hiking, climbing, scenic tourism bringing visitor income.\n\nFarming: Sheep farming on rough grazing land, some dairy farming in valleys.\n\nQuarrying: Slate and other stone extraction.\n\nForestry: Commercial timber production on slopes.',
            markingCriteria: {
              breakdown: ['Tourism activities and income (1 mark)', 'Agricultural activities (1 mark)', 'Quarrying/mining (1 mark)', 'Forestry activities (1 mark)']
            },
            specReference: '3.1.3.4 - Economic activities'
          },
          {
            id: 'g11-q9',
            question: 'Explain the conflicts between different land uses in glaciated uplands.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Tourism vs. farming: Visitors damage stone walls, leave gates open, disturb livestock.\n\nTourism vs. environment: Footpath erosion, litter, disturbance to wildlife.\n\nQuarrying vs. tourism: Noise, dust, and visual pollution affect scenic value.\n\nForestry vs. farming: Coniferous plantations reduce grazing land.\n\nConservation vs. development: Protecting landscapes limits economic opportunities.',
            markingCriteria: {
              breakdown: ['Tourism-farming conflicts (1 mark)', 'Tourism-environment conflicts (1 mark)', 'Quarrying-tourism conflicts (1 mark)', 'Forestry-farming conflicts (1 mark)', 'Conservation-development tensions (1 mark)', 'Understanding of multiple conflicts (1 mark)']
            },
            specReference: '3.1.3.4 - Land use conflicts'
          },
          {
            id: 'g11-q10',
            question: 'Using a named example, evaluate strategies used to manage tourism in glaciated uplands.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Lake District National Park tourism management:\n\nSuccessful strategies: Footpath maintenance prevents erosion, park-and-ride reduces traffic congestion, zoning separates quiet and busy areas.\n\nEducation programs raise visitor awareness of conservation needs.\n\nLimited success: Honeypot sites still overcrowded in peak season, parking problems persist.\n\nOngoing challenges: Balancing economic benefits with environmental protection.\n\nOverall: Management strategies partially successful but require continuous adaptation.',
            markingCriteria: {
              breakdown: ['Named tourism area in glaciated uplands (1 mark)', 'Successful management strategies with examples (3 marks)', 'Limitations or ongoing problems (2 marks)', 'Overall evaluation of effectiveness (2 marks)']
            },
            specReference: '3.1.3.4 - Tourism management case study'
          }
        ]
      },
      {
        id: 'g8-urban-issues-challenges',
        name: 'Urban Issues and Challenges',
        questions: [
          {
            id: 'g8-q1',
            question: 'Define the term "urbanisation" and outline the global pattern of urbanisation.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Urbanisation is the increase in the proportion of people living in urban areas compared to rural areas. Globally, urbanisation is happening fastest in LICs and NEEs, particularly in Asia and Africa. HICs have already experienced most of their urbanisation.',
            markingCriteria: {
              breakdown: ['Definition of urbanisation (2 marks)', 'Global pattern - fastest in LICs/NEEs (1 mark)', 'Regional examples or HIC comparison (1 mark)']
            },
            specReference: '3.2.1 - Global pattern and trends of urbanisation'
          },
          {
            id: 'g8-q2',
            question: 'Explain the push and pull factors that lead to rural-urban migration.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Push factors include lack of job opportunities in rural areas, poor healthcare and education services, natural disasters, and agricultural problems. Pull factors include better employment prospects in cities, higher wages, better healthcare and education, entertainment and social opportunities.',
            markingCriteria: {
              breakdown: ['Push factors - rural problems (3 marks)', 'Pull factors - urban opportunities (3 marks)']
            },
            specReference: '3.2.1 - Push-pull migration and natural increase'
          },
          {
            id: 'g8-q3',
            question: 'Describe the characteristics and global distribution of megacities.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Megacities are urban areas with populations over 10 million people. Most are located in LICs and NEEs, particularly in Asia (Tokyo, Delhi, Shanghai). Many are coastal locations due to trade advantages. Growth is rapid due to rural-urban migration and natural increase.',
            markingCriteria: {
              breakdown: ['Definition - over 10 million (1 mark)', 'Distribution - mainly LICs/NEEs (1 mark)', 'Regional concentration in Asia (1 mark)', 'Coastal locations or growth reasons (1 mark)']
            },
            specReference: '3.2.1 - Growth of megacities'
          },
          {
            id: 'g8-q4',
            question: 'Using a case study of a major city in a LIC or NEE, explain the opportunities created by urban growth.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Mumbai, India: Economic opportunities include jobs in Bollywood film industry, financial services in business district, manufacturing in industrial areas. Social opportunities include better healthcare facilities, improved education access, cultural and entertainment venues.',
            markingCriteria: {
              breakdown: ['Named city in LIC/NEE (1 mark)', 'Economic opportunities with examples (3 marks)', 'Social opportunities with examples (2 marks)']
            },
            specReference: '3.2.1 - Urban opportunities and challenges in LICs/NEEs'
          },
          {
            id: 'g8-q5',
            question: 'Using the same or a different case study, explain the challenges created by urban growth in LICs or NEEs.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Mumbai, India: Challenges include squatter settlements like Dharavi lacking basic services, traffic congestion and air pollution, unemployment and underemployment, water supply shortages, waste management problems, crime and social tensions, pressure on healthcare and education services.',
            markingCriteria: {
              breakdown: ['Named city (1 mark)', 'Housing challenges/squatter settlements (2 marks)', 'Environmental challenges (2 marks)', 'Economic/social challenges (2 marks)', 'Clear explanation and development (1 mark)']
            },
            specReference: '3.2.1 - Urban opportunities and challenges in LICs/NEEs'
          },
          {
            id: 'g8-q6',
            question: 'Using a case study of a major UK city, explain how urban change has created opportunities.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'London: Opportunities include regeneration projects like Olympic Park creating jobs, cultural quarter development, improved transport links, new housing developments, university expansion, financial services growth in Canary Wharf.',
            markingCriteria: {
              breakdown: ['Named UK city (1 mark)', 'Regeneration opportunities (2 marks)', 'Economic opportunities (2 marks)', 'Social/cultural opportunities (1 mark)']
            },
            specReference: '3.2.1 - Urban change in UK cities'
          },
          {
            id: 'g8-q7',
            question: 'Using the same or a different UK city case study, explain the challenges created by urban change.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'London: Challenges include gentrification displacing local communities, increased house prices and cost of living, social inequality between rich and poor areas, traffic congestion, cultural identity loss in changing neighborhoods.',
            markingCriteria: {
              breakdown: ['Named UK city (1 mark)', 'Social challenges like gentrification (2 marks)', 'Economic challenges (2 marks)', 'Environmental or cultural challenges (1 mark)']
            },
            specReference: '3.2.1 - Urban change in UK cities'
          },
          {
            id: 'g8-q8',
            question: 'Explain strategies for sustainable urban living in terms of water and energy conservation.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Water conservation: rainwater harvesting, grey water recycling, water-efficient appliances, permeable surfaces to reduce runoff. Energy conservation: renewable energy sources, energy-efficient buildings, smart grids, combined heat and power systems.',
            markingCriteria: {
              breakdown: ['Water conservation strategies (3 marks)', 'Energy conservation strategies (3 marks)']
            },
            specReference: '3.2.1 - Sustainable urban living'
          },
          {
            id: 'g8-q9',
            question: 'Describe strategies for creating sustainable urban living through waste management and green space.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Waste management: recycling programs, composting organic waste, waste-to-energy plants, reducing packaging. Green space: urban parks, green roofs and walls, tree planting, allotments and community gardens.',
            markingCriteria: {
              breakdown: ['Waste management strategies (2 marks)', 'Green space strategies (2 marks)']
            },
            specReference: '3.2.1 - Sustainable urban living'
          },
          {
            id: 'g8-q10',
            question: 'Evaluate different urban transport strategies for reducing traffic congestion.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Public transport improvements like bus rapid transit and underground systems are effective at moving large numbers efficiently but require major investment. Congestion charging like London\'s scheme reduces traffic but may impact low-income groups. Cycling infrastructure encourages sustainable transport but needs cultural change. Park and ride schemes reduce city center traffic but require suburban space. Integrated transport policies combining multiple strategies tend to be most effective.',
            markingCriteria: {
              breakdown: ['Public transport strategies (2 marks)', 'Road pricing/congestion charging (2 marks)', 'Sustainable transport promotion (2 marks)', 'Evaluation of effectiveness/limitations (2 marks)']
            },
            specReference: '3.2.1 - Urban transport strategies'
          }
        ]
      },
      {
        id: 'g9-changing-economic-world',
        name: 'The Changing Economic World',
        questions: [
          {
            id: 'g9-q1',
            question: 'Compare different measures of development including GNI per capita and HDI.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'GNI per capita measures average income but doesn\'t show distribution of wealth or quality of life. HDI combines income, life expectancy, and education to give broader picture of development. Literacy rates show education levels but not quality. Life expectancy reflects healthcare and living standards but can be affected by disease outbreaks.',
            markingCriteria: {
              breakdown: ['GNI per capita strengths/limitations (2 marks)', 'HDI strengths/limitations (2 marks)', 'Other measures compared (2 marks)']
            },
            specReference: '3.2.2 - Development measures'
          },
          {
            id: 'g9-q2',
            question: 'Describe the Demographic Transition Model and explain how it relates to development.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Stage 1: High birth and death rates, stable population. Stage 2: Death rate falls, birth rate remains high, population grows rapidly. Stage 3: Birth rate falls, population growth slows. Stage 4: Low birth and death rates, stable population. As countries develop, they move through stages due to improved healthcare, education, and economic opportunities.',
            markingCriteria: {
              breakdown: ['Description of DTM stages (4 marks)', 'Link to development process (2 marks)']
            },
            specReference: '3.2.2 - Demographic Transition Model and uneven development'
          },
          {
            id: 'g9-q3',
            question: 'Explain strategies used to reduce the development gap between countries.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Aid provides emergency relief and development funding but can create dependency. Tourism brings foreign currency and jobs but may exploit local communities. Fair trade ensures better prices for producers but only affects small percentage of trade. Investment and industrial development create jobs but may have environmental costs.',
            markingCriteria: {
              breakdown: ['Aid strategies (2 marks)', 'Tourism strategies (2 marks)', 'Trade/investment strategies (2 marks)']
            },
            specReference: '3.2.2 - Strategies to reduce development gap'
          },
          {
            id: 'g9-q4',
            question: 'Using a case study of rapid development in one LIC or NEE, explain the role of industry in development.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'China: Manufacturing industries attracted foreign investment, created millions of jobs, and generated export income. Special Economic Zones like Shenzhen encouraged rapid industrial growth. However, industrial development caused pollution and poor working conditions in factories.',
            markingCriteria: {
              breakdown: ['Named LIC/NEE case study (1 mark)', 'Role of industry in creating jobs/income (3 marks)', 'Impact on development (2 marks)']
            },
            specReference: '3.2.2 - Case study rapid development'
          },
          {
            id: 'g9-q5',
            question: 'Explain how aid and international investment have contributed to development in your case study country.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'China: Foreign direct investment from multinational companies brought modern technology and management expertise. World Bank aid funded infrastructure projects like roads and dams. However, aid sometimes came with conditions, and investment led to environmental problems and exploitation of workers.',
            markingCriteria: {
              breakdown: ['Role of international investment (3 marks)', 'Role of aid (2 marks)', 'Evaluation of impacts positive/negative (1 mark)']
            },
            specReference: '3.2.2 - Case study rapid development'
          },
          {
            id: 'g9-q6',
            question: 'Describe the changes in the UK\'s economy since 1945, including the move to a post-industrial economy.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Manufacturing industries declined due to globalization and competition. Service industries grew including finance, retail, and tourism. Science and technology parks developed around universities. Government policy encouraged financial services and creative industries. Deindustrialization led to unemployment in traditional industrial areas.',
            markingCriteria: {
              breakdown: ['Decline of manufacturing (2 marks)', 'Growth of service industries (2 marks)', 'Development of science/technology sectors (2 marks)']
            },
            specReference: '3.2.2 - Economic change in the UK'
          },
          {
            id: 'g9-q7',
            question: 'Explain the development of science parks and their impact on the UK economy.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Science parks located near universities provide research facilities and business support for high-tech companies. Cambridge Science Park has attracted biotechnology and software companies. They create high-skilled jobs and encourage innovation, but may increase regional inequalities.',
            markingCriteria: {
              breakdown: ['Description of science parks (1 mark)', 'Location near universities (1 mark)', 'Economic benefits (1 mark)', 'Example or evaluation (1 mark)']
            },
            specReference: '3.2.2 - Science parks, transport'
          },
          {
            id: 'g9-q8',
            question: 'Describe regional inequalities in the UK and explain the North-South divide.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'The North-South divide shows higher incomes, employment, and life expectancy in the South, particularly London and South East. Northern regions have higher unemployment, poverty, and health problems. This results from deindustrialization affecting northern manufacturing areas while service industries concentrated in the South.',
            markingCriteria: {
              breakdown: ['Description of North-South differences (3 marks)', 'Causes - deindustrialization/service concentration (3 marks)']
            },
            specReference: '3.2.2 - Regional inequalities and North-South divide'
          },
          {
            id: 'g9-q9',
            question: 'Explain the UK\'s links with the global economy.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Trade links: Imports of raw materials and consumer goods, exports of services and manufactured goods. Financial links: London as global financial center, foreign investment in UK companies. Political links: Membership of international organizations, trade agreements and partnerships.',
            markingCriteria: {
              breakdown: ['Trade relationships (1 mark)', 'Financial sector role (1 mark)', 'Investment flows (1 mark)', 'Political/institutional links (1 mark)']
            },
            specReference: '3.2.2 - UK global economic and political links'
          },
          {
            id: 'g9-q10',
            question: 'Evaluate the impacts of economic change on different regions of the UK.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Economic changes have benefited London and South East through growth of financial services and high-tech industries, leading to higher incomes and employment. However, traditional manufacturing areas in North and Midlands suffered job losses and economic decline. Government attempts to rebalance economy have had limited success. London\'s success may be pulling investment away from other regions, widening inequalities.',
            markingCriteria: {
              breakdown: ['Economic links - trade and investment (3 marks)', 'Political links - international organizations (2 marks)', 'Cultural or other links (1 mark)']
            },
            specReference: '3.2.2 - UK global economic and political links'
          }
        ]
      },
      {
        id: 'g10-resource-management',
        name: 'Resource Management',
        questions: [
          {
            id: 'g10-q1',
            question: 'Explain the significance of resource management and describe global inequalities in food, water, and energy.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Resource management is vital for economic development, human welfare, and environmental sustainability. Global inequalities exist with HICs consuming far more resources per capita than LICs. Food security problems mainly affect sub-Saharan Africa and parts of Asia. Water stress affects arid regions and areas with growing populations. Energy poverty affects over 1 billion people without electricity.',
            markingCriteria: {
              breakdown: ['Significance of resource management (2 marks)', 'Global inequalities in food (1 mark)', 'Global inequalities in water (1 mark)', 'Global inequalities in energy (1 mark)', 'Regional examples (1 mark)']
            },
            specReference: '3.2.3 - Significance and global inequalities'
          },
          {
            id: 'g10-q2',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe the UK\'s changing demand for this resource and explain how its provision has developed.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: UK food demand has changed to include more exotic foods, organic produce, and seasonal availability year-round. Agribusiness has grown through large-scale farming, use of technology, and integration from farm to supermarket. OR WATER: UK water demand has increased due to population growth and lifestyle changes. Provision involves reservoirs, treatment plants, and distribution networks, with increasing focus on efficiency and leak reduction. OR ENERGY: UK energy demand has shifted toward electricity and cleaner sources. Provision has evolved from coal dominance to gas, nuclear, and renewables, with smart grids and storage solutions.',
            markingCriteria: {
              breakdown: ['Changing demand patterns for chosen resource (3 marks)', 'Development of provision/industry for chosen resource (3 marks)']
            },
            specReference: '3.2.3 - UK demand and provision of resources'
          },
          {
            id: 'g10-q3',
            question: 'Choose ONE resource you have studied (food, water, or energy). Explain a key concept related to this resource and evaluate its environmental impact.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Food miles measure distance food travels from production to consumption. Long food miles increase carbon emissions from transport, contributing to climate change. However, local production may be less efficient than importing from suitable climates. OR WATER: Water footprint measures total water used in production. Large water footprints can stress local water supplies and ecosystems. However, virtual water trade can efficiently allocate water resources globally. OR ENERGY: Carbon footprint measures greenhouse gas emissions from energy use. High carbon footprints contribute to climate change. However, lifecycle analysis shows some low-carbon sources have other environmental impacts.',
            markingCriteria: {
              breakdown: ['Definition of key concept for chosen resource (1 mark)', 'Environmental impact explanation (1 mark)', 'Limitations or complexities (1 mark)', 'Evaluation of overall impact (1 mark)']
            },
            specReference: '3.2.3 - Resource environmental concepts'
          },
          {
            id: 'g10-q4',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe the UK\'s sources of this resource and explain patterns of demand and supply.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: UK food sources include domestic production (agriculture, livestock) and imports from EU and global markets. Supply varies seasonally and regionally. Demand is highest in urban areas and for processed foods. OR WATER: UK water sources include surface water (reservoirs, rivers) and groundwater (aquifers). Supply is highest in north and west. Demand is highest in south and east, creating supply-demand imbalance. OR ENERGY: UK energy sources include domestic production (North Sea oil/gas, renewables) and imports. Supply from renewables varies with weather. Demand is highest in winter and in industrial/urban areas.',
            markingCriteria: {
              breakdown: ['Sources of chosen resource (2 marks)', 'Regional patterns of supply (2 marks)', 'Regional patterns of demand (2 marks)']
            },
            specReference: '3.2.3 - UK resource patterns'
          },
          {
            id: 'g10-q5',
            question: 'Choose ONE resource you have studied (food, water, or energy). Explain key issues affecting this resource in the UK and how they are managed.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Issues include food security, health concerns, and environmental impact of agriculture. Management involves food standards agencies, sustainable farming practices, and import diversification. OR WATER: Issues include pollution, regional imbalances, and increasing demand. Management involves water treatment, pollution controls, regulation by environmental agencies, and demand management. OR ENERGY: Issues include climate change, energy security, and intermittency of renewables. Management involves diversification, storage solutions, efficiency measures, and international cooperation.',
            markingCriteria: {
              breakdown: ['Key issues affecting chosen resource (2 marks)', 'Management strategies and approaches (2 marks)']
            },
            specReference: '3.2.3 - UK resource management'
          },
          {
            id: 'g10-q6',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe how the UK\'s approach to this resource has changed over time.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Shift from local, seasonal production to global, year-round availability. Growth of supermarkets and processed foods. Increasing focus on organic, sustainable, and health-conscious choices. OR WATER: Evolution from local sources to regional supply systems. Development of treatment technology and quality standards. Increasing focus on conservation and efficiency due to demand pressures. OR ENERGY: Transition from coal dominance to natural gas, nuclear, and renewables. Decline of domestic fossil fuel production. Growing emphasis on decarbonization and sustainability to meet climate targets.',
            markingCriteria: {
              breakdown: ['Historical changes in approach (2 marks)', 'Recent developments and trends (2 marks)', 'Future direction or sustainability focus (2 marks)']
            },
            specReference: '3.2.3 - UK resource evolution'
          },
          {
            id: 'g10-q7',
            question: 'Choose ONE resource you have studied (food, water, or energy). Evaluate the environmental and sustainability issues associated with this resource in the UK.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'FOOD: Intensive agriculture causes soil degradation and biodiversity loss but increases productivity. Food transport creates carbon emissions but enables food security. Packaging reduces waste but creates pollution. Balance needed between productivity and sustainability. OR WATER: Over-extraction threatens ecosystems but meets human needs. Treatment creates clean water but uses energy and chemicals. Infrastructure development affects landscapes but ensures supply security. OR ENERGY: Fossil fuels provide reliable energy but cause climate change. Nuclear offers low-carbon power but creates waste concerns. Renewables are clean but require land use and have intermittency issues.',
            markingCriteria: {
              breakdown: ['Environmental impacts of chosen resource (2 marks)', 'Sustainability challenges (2 marks)', 'Evaluation and balanced assessment (2 marks)']
            },
            specReference: '3.2.3 - Resource sustainability'
          },
          {
            id: 'g10-q8',
            question: 'Choose ONE resource you have studied (food, water, or energy). Explain strategies for achieving global security of this resource.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Increasing production through improved seeds, irrigation, and technology. Reducing waste through better storage and distribution systems. Improving access through fair trade and poverty reduction. Sustainable farming practices to protect long-term productivity. OR WATER: Supply-side strategies include desalination, water recycling, reservoir construction. Demand-side strategies include conservation, efficient irrigation, reducing industrial consumption. Technology solutions and international cooperation for shared resources. OR ENERGY: Renewable energy development, energy efficiency measures, diversifying energy sources, international cooperation for technology sharing. Nuclear power and storage solutions for security and sustainability.',
            markingCriteria: {
              breakdown: ['Supply-side strategies for chosen resource (2 marks)', 'Demand-side or efficiency strategies (2 marks)', 'Technology and international cooperation (2 marks)']
            },
            specReference: '3.2.3 - Resource focus areas'
          },
          {
            id: 'g10-q9',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe strategies for managing scarcity and improving security of this resource globally.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Increasing production through improved seeds, irrigation, and technology. Reducing waste through better storage and distribution systems. Improving access through fair trade and poverty reduction. Sustainable farming practices. OR WATER: Supply-side strategies include desalination, water recycling, reservoir construction, groundwater extraction. Demand-side strategies include water conservation, efficient irrigation, reducing industrial consumption. Technology solutions and international cooperation. OR ENERGY: Renewable energy development, energy efficiency measures, diversifying energy sources to improve security. International cooperation for technology sharing and resource access.',
            markingCriteria: {
              breakdown: ['Supply-side management strategies for chosen resource (2 marks)', 'Demand-side management strategies (2 marks)', 'Technology and international cooperation approaches (2 marks)']
            },
            specReference: '3.2.3 - Resource focus areas'
          },
          {
            id: 'g10-q10',
            question: 'Choose ONE resource you have studied (food, water, or energy). Evaluate different strategies for achieving global security and sustainability of this resource.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'FOOD: Sustainable farming provides long-term security but requires investment and training. Reducing waste improves efficiency but needs infrastructure changes. Fair trade improves access but may increase costs. International cooperation shares knowledge but creates dependencies. Technology increases production but may have environmental impacts. OR WATER: Desalination provides reliable supply but requires high energy input. Conservation reduces demand but needs behavioral change. International cooperation for shared resources but creates political dependencies. Technology solutions improve efficiency but require investment. OR ENERGY: Renewable energy provides sustainability but requires storage solutions and investment. Energy efficiency reduces demand but needs behavioral and technology changes. Diversification improves security but increases complexity. International cooperation shares resources but creates dependencies.',
            markingCriteria: {
              breakdown: ['Strategy advantages for chosen resource (2 marks)', 'Strategy limitations and challenges (2 marks)', 'Security considerations and evaluation (2 marks)', 'Balanced conclusion on optimal approaches (2 marks)']
            },
            specReference: '3.2.3 - Resource focus areas'
          }
        ]
      }
    ]
  },
  {
    id: 'geography-paper-2',
    name: 'Geography Paper 2',
    topics: [
      {
        id: 'urban-issues-challenges',
        name: 'Urban Issues and Challenges',
        questions: [
          {
            id: 'urban-q1',
            question: 'Describe the global pattern of urbanisation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Urbanisation is highest in HICs (over 80% urban) and rising rapidly in LICs and NEEs. Most urbanisation growth is in Asia and Africa. Megacities are increasing, particularly in developing countries. Rural-urban migration is the main driver in LICs/NEEs.',
            markingCriteria: {
              breakdown: ['HICs have high urbanisation rates (1 mark)', 'Rapid growth in LICs/NEEs (1 mark)', 'Asia and Africa leading growth (1 mark)', 'Reference to megacities or migration (1 mark)']
            },
            specReference: '3.2.1.1 - Global urbanisation patterns'
          },
          {
            id: 'urban-q2',
            question: 'Explain the push and pull factors that cause rural-urban migration.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Push factors: unemployment, crop failure, natural disasters, lack of services, mechanisation of farming. Pull factors: job opportunities, better education and healthcare, higher wages, improved living standards, family connections.',
            markingCriteria: {
              breakdown: ['Push factors - economic reasons (2 marks)', 'Push factors - social/environmental (1 mark)', 'Pull factors - economic opportunities (2 marks)', 'Pull factors - social improvements (1 mark)']
            },
            specReference: '3.2.1.1 - Push-pull migration factors'
          },
          {
            id: 'urban-q3',
            question: 'Define the term "megacity" and explain the factors causing their growth.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'A megacity has over 10 million people. Growth caused by rural-urban migration, natural increase (high birth rates), economic opportunities, and agglomeration effects. Most growth is in LICs and NEEs where urbanisation is rapid.',
            markingCriteria: {
              breakdown: ['Definition: over 10 million people (1 mark)', 'Rural-urban migration (1 mark)', 'Natural increase factors (1 mark)', 'Economic opportunities/agglomeration (1 mark)']
            },
            specReference: '3.2.1.1 - Megacity growth'
          },
          {
            id: 'urban-q4',
            question: 'Using a case study of a city in an LIC or NEE, explain the opportunities that urban growth creates.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Mumbai, India: Economic opportunities include jobs in manufacturing, services, and informal sector. Social opportunities include better access to education, healthcare, and clean water. Cultural opportunities through diversity and entertainment. Infrastructure development improves transport and communications.',
            markingCriteria: {
              breakdown: ['Named LIC/NEE city (1 mark)', 'Economic opportunities with examples (2 marks)', 'Social opportunities with examples (2 marks)', 'Infrastructure or cultural opportunities (1 mark)']
            },
            specReference: '3.2.1.1 - Urban opportunities in LICs/NEEs'
          },
          {
            id: 'urban-q5',
            question: 'Using a case study of a city in an LIC or NEE, explain the challenges that urban growth creates.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Lagos, Nigeria: Housing challenges include slums like Makoko with poor quality housing and overcrowding. Infrastructure challenges include inadequate water supply, poor sanitation, and unreliable electricity. Transport problems with traffic congestion and limited public transport. Environmental issues include pollution and waste management problems. Social challenges include crime, unemployment, and inequality.',
            markingCriteria: {
              breakdown: ['Named LIC/NEE city (1 mark)', 'Housing challenges with examples (2 marks)', 'Infrastructure challenges (2 marks)', 'Environmental challenges (1 mark)', 'Social/economic challenges (2 marks)']
            },
            specReference: '3.2.1.1 - Urban challenges in LICs/NEEs'
          },
          {
            id: 'urban-q6',
            question: 'Using a case study of a UK city, explain how urban change has created opportunities and challenges.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'London: Opportunities include regeneration projects like Olympic Park creating jobs and housing, cultural diversity, and financial services growth. Challenges include housing affordability, gentrification displacing communities, air pollution, and pressure on infrastructure. Income inequality has increased despite economic growth.',
            markingCriteria: {
              breakdown: ['Named UK city (1 mark)', 'Regeneration opportunities with examples (2 marks)', 'Economic opportunities (1 mark)', 'Housing challenges (2 marks)', 'Environmental or social challenges (2 marks)']
            },
            specReference: '3.2.1.1 - UK urban change'
          },
          {
            id: 'urban-q7',
            question: 'Explain how cities can achieve sustainable urban living in terms of water and energy conservation.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Water conservation: rainwater harvesting, greywater recycling, efficient appliances, leak detection systems. Energy conservation: renewable energy sources, energy-efficient buildings, LED lighting, smart grids, public transport to reduce car use.',
            markingCriteria: {
              breakdown: ['Water conservation strategies (3 marks)', 'Energy conservation strategies (3 marks)']
            },
            specReference: '3.2.1.1 - Sustainable urban living'
          }
        ]
      },
      {
        id: 'changing-economic-world',
        name: 'The Changing Economic World',
        questions: [
          {
            id: 'econ-q1',
            question: 'Compare different measures of development and explain why GDP alone is not sufficient.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'GDP measures total economic output but ignores income distribution and quality of life. HDI combines GDP with health (life expectancy) and education (literacy) for broader measure. Other indicators include infant mortality, access to clean water, and gender equality. No single measure captures all aspects of development.',
            markingCriteria: {
              breakdown: ['GDP definition and limitations (2 marks)', 'HDI components and advantages (2 marks)', 'Other development indicators (1 mark)', 'Conclusion about multiple measures needed (1 mark)']
            },
            specReference: '3.2.2.1 - Development measures'
          },
          {
            id: 'econ-q2',
            question: 'Explain the Demographic Transition Model and how it links to uneven development.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'DTM shows population change through 5 stages. Stage 1: high birth and death rates. Stage 2: death rates fall, population grows rapidly. Stage 3: birth rates fall. Stage 4: low birth and death rates. Stage 5: birth rates below death rates. HICs are in stages 4-5, LICs in stages 2-3, creating different development challenges.',
            markingCriteria: {
              breakdown: ['DTM stages described (3 marks)', 'Link to development levels (2 marks)', 'Explanation of uneven development (1 mark)']
            },
            specReference: '3.2.2.1 - Demographic Transition Model'
          },
          {
            id: 'econ-q3',
            question: 'Evaluate different strategies to reduce the development gap.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Aid can provide immediate relief but may create dependency. Trade and investment create jobs but profits may leave the country. Fair trade guarantees better prices for farmers but only helps small numbers. Tourism brings income but can damage environment and culture. Debt relief frees up resources but may not reach the poor. Successful development requires combination of strategies and good governance.',
            markingCriteria: {
              breakdown: ['Aid strategies and evaluation (2 marks)', 'Trade and investment analysis (2 marks)', 'Tourism or fair trade evaluation (2 marks)', 'Overall assessment and conclusion (2 marks)']
            },
            specReference: '3.2.2.1 - Reducing development gap'
          },
          {
            id: 'econ-q4',
            question: 'Using a case study of rapid development in one LIC or NEE, explain the role of industry, aid, and improvements in quality of life.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'China: Industrial development through manufacturing exports created millions of jobs and foreign investment. Special Economic Zones attracted international companies. Aid was less important than trade and investment. Quality of life improved through higher incomes, better education, and healthcare. However, environmental pollution and inequality increased.',
            markingCriteria: {
              breakdown: ['Named LIC/NEE case study (1 mark)', 'Industrial development role (3 marks)', 'Aid contribution (1 mark)', 'Quality of life improvements (2 marks)', 'Recognition of problems/challenges (1 mark)']
            },
            specReference: '3.2.2.1 - LIC/NEE development case study'
          },
          {
            id: 'econ-q5',
            question: 'Explain how the UK economy has changed from manufacturing to a post-industrial economy.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Deindustrialisation saw decline of manufacturing industries like steel, shipbuilding, and textiles due to global competition and mechanisation. Service sector growth includes finance, retail, education, and healthcare. Quaternary sector development includes research, ICT, and knowledge-based industries. Government policy promoted service sector growth.',
            markingCriteria: {
              breakdown: ['Deindustrialisation process and causes (2 marks)', 'Service sector growth examples (2 marks)', 'Quaternary sector development (1 mark)', 'Government role or impact (1 mark)']
            },
            specReference: '3.2.2.2 - UK economic change'
          },
          {
            id: 'econ-q6',
            question: 'Explain the North-South divide in the UK and strategies to reduce regional inequalities.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'North-South divide shows higher unemployment, lower wages, and fewer opportunities in northern regions. London and Southeast dominate economically. Government strategies include regional development agencies, enterprise zones, transport investment like Northern Powerhouse, and moving government departments to northern cities.',
            markingCriteria: {
              breakdown: ['Description of North-South divide (2 marks)', 'Evidence of inequalities (1 mark)', 'Government strategies to reduce inequalities (3 marks)']
            },
            specReference: '3.2.2.2 - Regional inequalities'
          }
        ]
      },
      {
        id: 'resource-management',
        name: 'Resource Management',
        questions: [
          {
            id: 'resource-q1',
            question: 'Explain the significance of resource management and describe global inequalities in food, water, and energy.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Resource management is vital for economic development, human welfare, and environmental sustainability. Global inequalities exist with HICs consuming far more resources per capita than LICs. Food insecurity affects sub-Saharan Africa and parts of Asia. Water stress affects arid regions and areas with growing populations. Energy poverty affects over 1 billion people without electricity.',
            markingCriteria: {
              breakdown: ['Significance of resource management (2 marks)', 'Global food inequalities (1 mark)', 'Global water inequalities (1 mark)', 'Global energy inequalities (1 mark)', 'Regional examples (1 mark)']
            },
            specReference: '3.2.3 - Resource management significance'
          },
          {
            id: 'resource-q2',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe the UK\'s changing demand for this resource and explain how its provision has developed.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: UK food demand has changed to include more exotic foods, organic produce, and seasonal availability year-round. Agribusiness has grown through large-scale farming, use of technology, and integration from farm to supermarket. OR WATER: UK water demand has increased due to population growth and lifestyle changes. Provision involves reservoirs, treatment plants, and distribution networks, with increasing focus on efficiency and leak reduction. OR ENERGY: UK energy demand has shifted toward electricity and cleaner sources. Provision has evolved from coal dominance to gas, nuclear, and renewables, with smart grids and storage solutions.',
            markingCriteria: {
              breakdown: ['Changing demand patterns for chosen resource (3 marks)', 'Development of provision/industry for chosen resource (3 marks)']
            },
            specReference: '3.2.3 - UK demand and provision of resources'
          },
          {
            id: 'resource-q2-combined',
            question: 'Choose ONE resource you have studied (food, water, or energy). Describe the UK\'s sources of this resource and explain patterns of demand and supply.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: UK food sources include domestic production (agriculture, livestock) and imports from EU and global markets. Supply varies seasonally and regionally. Demand is highest in urban areas and for processed foods. OR WATER: UK water sources include surface water (reservoirs, rivers) and groundwater (aquifers). Supply is highest in north and west. Demand is highest in south and east, creating supply-demand imbalance. OR ENERGY: UK energy sources include domestic production (North Sea oil/gas, renewables) and imports. Supply from renewables varies with weather. Demand is highest in winter and in industrial/urban areas.',
            markingCriteria: {
              breakdown: ['Sources of chosen resource (2 marks)', 'Regional patterns of supply (2 marks)', 'Regional patterns of demand (2 marks)']
            },
            specReference: '3.2.3 - UK resource patterns'
          },
          {
            id: 'resource-q3',
            question: 'Choose ONE resource you have studied (food, water, or energy). Explain a key concept related to this resource and evaluate its environmental impact.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Food miles measure distance food travels from production to consumption. Long food miles increase carbon emissions from transport, contributing to climate change. However, local production may be less efficient than importing from suitable climates. OR WATER: Water footprint measures total water used in production. Large water footprints can stress local water supplies and ecosystems. However, virtual water trade can efficiently allocate water resources globally. OR ENERGY: Carbon footprint measures greenhouse gas emissions from energy use. High carbon footprints contribute to climate change. However, lifecycle analysis shows some low-carbon sources have other environmental impacts.',
            markingCriteria: {
              breakdown: ['Definition of key concept for chosen resource (1 mark)', 'Environmental impact explanation (1 mark)', 'Limitations or complexities (1 mark)', 'Evaluation of overall impact (1 mark)']
            },
            specReference: '3.2.3 - Resource environmental concepts'
          },
          {
            id: 'resource-q3-combined',
            question: 'Choose ONE resource you have studied (food, water, or energy). Explain key issues affecting this resource in the UK and how they are managed.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Issues include food security, health concerns, and environmental impact of agriculture. Management involves food standards agencies, sustainable farming practices, and import diversification. OR WATER: Issues include pollution, regional imbalances, and increasing demand. Management involves water treatment, pollution controls, regulation by environmental agencies, and demand management. OR ENERGY: Issues include climate change, energy security, and intermittency of renewables. Management involves diversification, storage solutions, efficiency measures, and international cooperation.',
            markingCriteria: {
              breakdown: ['Key issues affecting chosen resource (2 marks)', 'Management strategies and approaches (2 marks)']
            },
            specReference: '3.2.3 - UK resource management'
          },
          {
            id: 'resource-q4',
            question: 'Choose ONE resource you have studied (food, water, or energy). Evaluate strategies for achieving global security of this resource.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Increasing production through improved seeds, irrigation, and technology. Reducing waste through better storage and distribution systems. Improving access through fair trade and poverty reduction. Sustainable farming practices to protect long-term productivity. OR WATER: Supply-side strategies include desalination, water recycling, reservoir construction. Demand-side strategies include conservation, efficient irrigation, reducing industrial consumption. Technology solutions and international cooperation for shared resources. OR ENERGY: Renewable energy development, energy efficiency measures, diversifying energy sources, international cooperation for technology sharing. Nuclear power and storage solutions for security and sustainability.',
            markingCriteria: {
              breakdown: ['Supply-side strategies for chosen resource (2 marks)', 'Demand-side or efficiency strategies (2 marks)', 'Technology and international cooperation (2 marks)']
            },
            specReference: '3.2.3 - Resource focus areas'
          },
        ]
      }
    ]
  },
  {
    id: 'maths',
    name: 'Mathematics',
    topics: [
      {
        id: 'm1-number',
        name: 'Number',
        questions: [
          {
            id: 'm1-q1',
            question: 'Work out (3.2 × 10⁷) ÷ (4 × 10⁻³). Give your answer in standard form.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '(3.2 × 10⁷) ÷ (4 × 10⁻³) = (3.2 ÷ 4) × (10⁷ ÷ 10⁻³) = 0.8 × 10¹⁰ = 8 × 10⁹',
            markingCriteria: {
              breakdown: ['Divide numbers: 3.2 ÷ 4 = 0.8 (1 mark)', 'Subtract indices: 7 - (-3) = 10 (1 mark)', 'Convert to standard form: 8 × 10⁹ (1 mark)']
            },
            specReference: '1.1.2h - Standard form calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q2',
            question: 'Simplify √(50) - √(18) + √(32), giving your answer in the form a√(2) where a is an integer.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: '√(50) = 5√(2), √(18) = 3√(2), √(32) = 4√(2). Therefore 5√(2) - 3√(2) + 4√(2) = 6√(2)',
            markingCriteria: {
              breakdown: ['Simplify √(50) = 5√(2) (1 mark)', 'Simplify √(18) = 3√(2) and √(32) = 4√(2) (1 mark)', 'Combine like surds correctly (1 mark)', 'Final answer 6√(2) (1 mark)']
            },
            specReference: '1.1.2e - Surds',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q3',
            question: 'Express 0.4̅6̅ (0.464646...) as a fraction in its simplest form.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Let x = 0.464646... Then 100x = 46.464646... Subtracting: 99x = 46, so x = 46/99',
            markingCriteria: {
              breakdown: ['Set up equation with x = 0.464646... (1 mark)', 'Multiply by 100 (1 mark)', 'Subtract to get 99x = 46 (1 mark)', 'Final fraction 46/99 (1 mark)']
            },
            specReference: '1.1.1g - Converting recurring decimals',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q4',
            question: 'The mass of a proton is 1.67 × 10⁻²⁷ kg. Calculate the mass of 3.6 × 10²³ protons. Give your answer in standard form.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mass = (1.67 × 10⁻²⁷) × (3.6 × 10²³) = (1.67 × 3.6) × (10⁻²⁷ × 10²³) = 6.012 × 10⁻⁴ kg',
            markingCriteria: {
              breakdown: ['Multiply numbers: 1.67 × 3.6 = 6.012 (1 mark)', 'Add indices: -27 + 23 = -4 (1 mark)', 'Final answer in standard form (1 mark)']
            },
            specReference: '1.1.2h - Standard form calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q5',
            question: 'Calculate 2⁴ × 2⁻⁷ × 2³, giving your answer as a fraction.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '2⁴ × 2⁻⁷ × 2³ = 2⁴⁻⁷⁺³ = 2⁰ = 1',
            markingCriteria: {
              breakdown: ['Add indices: 4 + (-7) + 3 = 0 (1 mark)', 'Recognize 2⁰ = 1 (1 mark)', 'Final answer 1 (1 mark)']
            },
            specReference: '1.1.2c - Index laws',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q6',
            question: 'The length of a rectangle is measured as 8.7 cm to the nearest 0.1 cm. The width is measured as 5.2 cm to the nearest 0.1 cm. Calculate the maximum possible area of the rectangle.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Maximum length = 8.75 cm, Maximum width = 5.25 cm. Maximum area = 8.75 × 5.25 = 45.9375 cm²',
            markingCriteria: {
              breakdown: ['Maximum length = 8.75 cm (1 mark)', 'Maximum width = 5.25 cm (1 mark)', 'Multiply for maximum area (1 mark)', 'Correct calculation: 45.9375 cm² (1 mark)']
            },
            specReference: '1.1.1f - Upper and lower bounds',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q7',
            question: 'Work out the HCF and LCM of 84 and 126. Show your working using prime factorization.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: '84 = 2² × 3 × 7, 126 = 2 × 3² × 7. HCF = 2 × 3 × 7 = 42. LCM = 2² × 3² × 7 = 252',
            markingCriteria: {
              breakdown: ['Prime factorization of 84 (1 mark)', 'Prime factorization of 126 (1 mark)', 'HCF = 42 using common factors (1 mark)', 'LCM = 252 using all factors (1 mark)', 'Clear working shown (1 mark)']
            },
            specReference: '1.1.1d - HCF and LCM',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q8',
            question: 'Calculate (3⁻² × 3⁴) ÷ (3⁻¹ × 3³). Give your answer as a fraction.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '(3⁻² × 3⁴) ÷ (3⁻¹ × 3³) = 3⁻²⁺⁴ ÷ 3⁻¹⁺³ = 3² ÷ 3² = 3⁰ = 1',
            markingCriteria: {
              breakdown: ['Simplify numerator: 3² (1 mark)', 'Simplify denominator: 3² (1 mark)', 'Final answer: 1 (1 mark)']
            },
            specReference: '1.1.2c - Index laws',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q9',
            question: 'The population of a city increases by 2.5% each year. If the population is 450,000 after 3 years of growth, calculate the original population.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'After 3 years, population = original × (1.025)³. So 450,000 = original × 1.0769. Original population = 450,000 ÷ 1.0769 = 417,832',
            markingCriteria: {
              breakdown: ['Set up equation with growth factor 1.025 (1 mark)', 'Recognize (1.025)³ = 1.0769 (1 mark)', 'Rearrange: original = 450,000 ÷ 1.0769 (1 mark)', 'Correct answer: 417,832 (1 mark)']
            },
            specReference: '1.2.2b - Compound percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q10',
            question: 'Three numbers are in the ratio 2:5:8. The sum of the smallest and largest numbers is 60. Find all three numbers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Let the numbers be 2x, 5x, and 8x. Then 2x + 8x = 60, so 10x = 60, x = 6. The numbers are 12, 30, and 48.',
            markingCriteria: {
              breakdown: ['Express numbers as 2x, 5x, 8x (1 mark)', 'Set up equation: 2x + 8x = 60 (1 mark)', 'Solve: x = 6 (1 mark)', 'Find all numbers: 12, 30, 48 (1 mark)']
            },
            specReference: '1.2.1a - Ratio problems',
            calculatorGuidance: 'non-calc-friendly'
          }
        ]
      },
      {
        id: 'm2-algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'm2-q1',
            question: 'Solve the quadratic equation x² - 5x - 14 = 0 by factorization.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'x² - 5x - 14 = (x - 7)(x + 2) = 0. Therefore x = 7 or x = -2',
            markingCriteria: {
              breakdown: ['Factor to (x - 7)(x + 2) (1 mark)', 'Set each factor to zero (1 mark)', 'Both solutions x = 7 and x = -2 (1 mark)']
            },
            specReference: '2.1.2c - Solving quadratic equations',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q2',
            question: 'Expand and simplify (2x + 3)² - (x - 1)(x + 4)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: '(2x + 3)² = 4x² + 12x + 9. (x - 1)(x + 4) = x² + 3x - 4. Therefore 4x² + 12x + 9 - x² - 3x + 4 = 3x² + 9x + 13',
            markingCriteria: {
              breakdown: ['Expand (2x + 3)² correctly (1 mark)', 'Expand (x - 1)(x + 4) correctly (1 mark)', 'Subtract expressions correctly (1 mark)', 'Simplify to 3x² + 9x + 13 (1 mark)']
            },
            specReference: '2.1.1b - Expanding and simplifying',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q3',
            question: 'Solve the simultaneous equations: 3x + 2y = 16 and x - y = 1',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'From equation 2: x = y + 1. Substitute into equation 1: 3(y + 1) + 2y = 16. 5y + 3 = 16, so y = 2.6. Then x = 3.6',
            markingCriteria: {
              breakdown: ['Rearrange one equation for x or y (1 mark)', 'Substitute correctly (1 mark)', 'Solve for one variable (1 mark)', 'Find both solutions x = 3.6, y = 2.6 (1 mark)']
            },
            specReference: '2.1.2b - Simultaneous equations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm2-q4',
            question: 'Make h the subject of the formula: A = ½(a + b)h',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'A = ½(a + b)h. Multiply both sides by 2: 2A = (a + b)h. Divide by (a + b): h = 2A/(a + b)',
            markingCriteria: {
              breakdown: ['Multiply both sides by 2 (1 mark)', 'Divide by (a + b) (1 mark)', 'Final answer h = 2A/(a + b) (1 mark)']
            },
            specReference: '2.1.1e - Changing the subject',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q5',
            question: 'The nth term of a sequence is 3n² - 2n + 1. Find the first three terms and the 10th term.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'n = 1: 3(1)² - 2(1) + 1 = 2. n = 2: 3(4) - 4 + 1 = 9. n = 3: 3(9) - 6 + 1 = 22. n = 10: 3(100) - 20 + 1 = 281',
            markingCriteria: {
              breakdown: ['First term = 2 (1 mark)', 'Second and third terms = 9, 22 (1 mark)', 'Substitute n = 10 correctly (1 mark)', '10th term = 281 (1 mark)']
            },
            specReference: '2.1.1f - Sequences',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm2-q6',
            question: 'Solve the quadratic equation 2x² + 7x - 4 = 0 using the quadratic formula.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'x = (-7 ± √(49 + 32))/4 = (-7 ± √81)/4 = (-7 ± 9)/4. So x = 1/2 or x = -4',
            markingCriteria: {
              breakdown: ['Substitute into formula: x = (-7 ± √(7² - 4×2×(-4)))/4 (1 mark)', 'Calculate discriminant: 49 + 32 = 81 (1 mark)', 'Find √81 = 9 (1 mark)', 'Both solutions: x = 1/2 and x = -4 (1 mark)']
            },
            specReference: '2.1.2c - Quadratic formula',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm2-q7',
            question: 'Solve the simultaneous equations: 2x + 3y = 11 and 5x - 2y = 4 using elimination.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Multiply first by 2 and second by 3: 4x + 6y = 22 and 15x - 6y = 12. Add: 19x = 34, so x = 34/19. Substitute: y = 9/19',
            markingCriteria: {
              breakdown: ['Eliminate y by multiplying equations appropriately (1 mark)', 'Add equations to get 19x = 34 (1 mark)', 'Solve for x = 34/19 (1 mark)', 'Find y = 9/19 by substitution (1 mark)']
            },
            specReference: '2.1.2b - Elimination method',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm2-q8',
            question: 'Factorize completely: 3x³ - 12x² + 12x',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '3x³ - 12x² + 12x = 3x(x² - 4x + 4) = 3x(x - 2)²',
            markingCriteria: {
              breakdown: ['Take out common factor 3x (1 mark)', 'Factorize x² - 4x + 4 (1 mark)', 'Final answer 3x(x - 2)² (1 mark)']
            },
            specReference: '2.1.1c - Factorizing',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q9',
            question: 'Solve the inequality 3(2x - 1) < 2x + 11 and represent your answer on a number line.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '6x - 3 < 2x + 11, so 4x < 14, therefore x < 3.5. Number line shows open circle at 3.5 with arrow pointing left.',
            markingCriteria: {
              breakdown: ['Expand: 6x - 3 < 2x + 11 (1 mark)', 'Solve: x < 3.5 (1 mark)', 'Correct representation on number line (1 mark)']
            },
            specReference: '2.1.2d - Linear inequalities',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q10',
            question: 'Given that f(x) = x² - 4x + 1, find f(3) and solve f(x) = 0.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'f(3) = 9 - 12 + 1 = -2. For f(x) = 0: x² - 4x + 1 = 0. Using quadratic formula: x = (4 ± √12)/2 = 2 ± √3',
            markingCriteria: {
              breakdown: ['Calculate f(3) = -2 (1 mark)', 'Set up equation x² - 4x + 1 = 0 (1 mark)', 'Use quadratic formula (1 mark)', 'Calculate discriminant: 16 - 4 = 12 (1 mark)', 'Final answer: x = 2 ± √3 (1 mark)']
            },
            specReference: '2.1.2c - Functions and quadratic equations',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'm3-ratio',
        name: 'Ratio, proportion and rates of change',
        questions: [
          {
            id: 'm3-q1',
            question: 'The population of a town increases by 3% each year. If the population was 45,000 in 2020, calculate the population in 2023.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Population in 2023 = 45,000 × (1.03)³ = 45,000 × 1.092727 = 49,173',
            markingCriteria: {
              breakdown: ['Use compound interest formula with 1.03 (1 mark)', 'Calculate (1.03)³ = 1.092727 (1 mark)', 'Final answer 49,173 (1 mark)']
            },
            specReference: '1.2.2b - Compound percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q2',
            question: 'y is inversely proportional to x². When x = 4, y = 3. Find the value of y when x = 6.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'y = k/x² where k is constant. When x = 4, y = 3: 3 = k/16, so k = 48. When x = 6: y = 48/36 = 4/3',
            markingCriteria: {
              breakdown: ['Write y = k/x² (1 mark)', 'Find k using given values: k = 48 (1 mark)', 'Substitute x = 6 into equation (1 mark)', 'Final answer y = 4/3 (1 mark)']
            },
            specReference: '1.2.1c - Inverse proportion',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q3',
            question: 'Convert 72 km/h to m/s.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '72 km/h = 72 × 1000 ÷ 3600 = 72000 ÷ 3600 = 20 m/s',
            markingCriteria: {
              breakdown: ['Convert km to m and h to s (1 mark)', 'Correct calculation: 20 m/s (1 mark)']
            },
            specReference: '1.2.3a - Unit conversions',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q4',
            question: 'A map has a scale of 1:25000. The actual distance between two towns is 7.5 km. Calculate the distance on the map in centimeters.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Actual distance = 7.5 km = 750,000 cm. Map distance = 750,000 ÷ 25,000 = 30 cm',
            markingCriteria: {
              breakdown: ['Convert 7.5 km to cm: 750,000 cm (1 mark)', 'Apply scale factor (1 mark)', 'Final answer: 30 cm (1 mark)']
            },
            specReference: '1.2.3b - Scale and maps',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q5',
            question: 'A car depreciates by 18% each year. After how many years will its value be less than half its original value?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Value after n years = V₀ × (0.82)ⁿ. For half value: (0.82)ⁿ < 0.5. Using logarithms: n > log(0.5)/log(0.82) = 3.52. Therefore after 4 years.',
            markingCriteria: {
              breakdown: ['Set up inequality (0.82)ⁿ < 0.5 (1 mark)', 'Use logarithms correctly (1 mark)', 'Calculate n > 3.52 (1 mark)', 'Conclude 4 years (1 mark)']
            },
            specReference: '1.2.2b - Exponential functions',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q6',
            question: 'A machine produces 240 items per hour. If the machine runs for 7.5 hours, how many items are produced? If 15 items are defective, what percentage are good quality?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Total items = 240 × 7.5 = 1800 items. Good items = 1800 - 15 = 1785. Percentage good = (1785/1800) × 100% = 99.17%',
            markingCriteria: {
              breakdown: ['Calculate total items: 1800 (1 mark)', 'Calculate good items: 1785 (1 mark)', 'Set up percentage calculation (1 mark)', 'Final answer: 99.17% (1 mark)']
            },
            specReference: '1.2.3a - Rate calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q7',
            question: 'The cost of fuel increases from £1.20 per litre to £1.38 per litre. Calculate the percentage increase.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Increase = £1.38 - £1.20 = £0.18. Percentage increase = (0.18/1.20) × 100% = 15%',
            markingCriteria: {
              breakdown: ['Calculate increase: £0.18 (1 mark)', 'Set up percentage formula (1 mark)', 'Final answer: 15% (1 mark)']
            },
            specReference: '1.2.2a - Percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q8',
            question: 'Three quantities A, B, and C are in the ratio 3:4:5. If A + C = 96, find the values of A, B, and C.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Let A = 3x, B = 4x, C = 5x. Then 3x + 5x = 96, so 8x = 96, x = 12. Therefore A = 36, B = 48, C = 60.',
            markingCriteria: {
              breakdown: ['Express in terms of x: A = 3x, B = 4x, C = 5x (1 mark)', 'Set up equation: 3x + 5x = 96 (1 mark)', 'Solve: x = 12 (1 mark)', 'Find all values: A = 36, B = 48, C = 60 (1 mark)']
            },
            specReference: '1.2.1a - Ratio problems',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q9',
            question: 'y varies directly as the square of x. When x = 4, y = 48. Find the value of y when x = 6.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'y = kx² where k is constant. When x = 4, y = 48: 48 = k × 16, so k = 3. When x = 6: y = 3 × 36 = 108',
            markingCriteria: {
              breakdown: ['Write y = kx² (1 mark)', 'Find k = 3 using given values (1 mark)', 'Calculate y = 108 when x = 6 (1 mark)']
            },
            specReference: '1.2.1b - Direct proportion',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q10',
            question: 'A recipe for 8 people uses 450g of flour. How much flour is needed for 12 people? If flour costs £1.20 per kg, what is the cost of flour for 12 people?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'For 12 people: (450 × 12) ÷ 8 = 675g = 0.675kg. Cost = 0.675 × £1.20 = £0.81',
            markingCriteria: {
              breakdown: ['Calculate flour for 12 people: 675g (1 mark)', 'Convert to kg: 0.675kg (1 mark)', 'Calculate cost (1 mark)', 'Final answer: £0.81 (1 mark)']
            },
            specReference: '1.2.1a - Proportion and unit costs',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'm4-geometry',
        name: 'Geometry and measures',
        questions: [
          {
            id: 'm4-q1',
            question: 'In a right-angled triangle, one angle is 35°. A side adjacent to this angle is 8 cm and the side opposite to this angle is h cm. Calculate the value of h.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'tan(35°) = opposite/adjacent = h/8. Therefore h = 8 × tan(35°) = 8 × 0.7002 = 5.60 cm (3 sf)',
            markingCriteria: {
              breakdown: ['Identify correct trigonometric ratio: tan(35°) (1 mark)', 'Set up equation: h = 8 × tan(35°) (1 mark)', 'Calculate: h = 5.60 cm (1 mark)']
            },
            specReference: '3.2.1a - Trigonometry in right-angled triangles',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q2',
            question: 'A triangle has vertices at A(2, 3), B(6, 1), and C(4, 7). Calculate the length of side AB using Pythagoras\' theorem.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'AB = √[(6-2)² + (1-3)²] = √[4² + (-2)²] = √[16 + 4] = √20 = 2√5 ≈ 4.47 units',
            markingCriteria: {
              breakdown: ['Find differences: (6-2) = 4, (1-3) = -2 (1 mark)', 'Apply distance formula: √[16 + 4] (1 mark)', 'Simplify: 2√5 or 4.47 units (1 mark)']
            },
            specReference: '3.1.1c - Pythagoras theorem',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q3',
            question: 'A sector of a circle has radius 12 cm and central angle 150°. Calculate the area of the sector.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Area of sector = (θ/360°) × πr² = (150°/360°) × π × 12² = (5/12) × 144π = 60π = 188.5 cm² (3 sf)',
            markingCriteria: {
              breakdown: ['Use sector area formula (1 mark)', 'Substitute values correctly: (150/360) × π × 144 (1 mark)', 'Calculate: 60π = 188.5 cm² (1 mark)']
            },
            specReference: '3.1.3b - Area of sectors',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q4',
            question: 'A cone has base radius 9 cm and slant height 15 cm. Calculate the total surface area of the cone.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Base area = π × 9² = 81π. Curved surface area = π × 9 × 15 = 135π. Total surface area = 81π + 135π = 216π = 678.6 cm² (4 sf)',
            markingCriteria: {
              breakdown: ['Calculate base area: 81π (1 mark)', 'Calculate curved surface area: 135π (1 mark)', 'Add areas: 216π (1 mark)', 'Final answer: 678.6 cm² (1 mark)']
            },
            specReference: '3.1.4c - Surface area of cones',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q5',
            question: 'Triangle ABC is transformed by a translation with vector (3, -2) to give triangle A\'B\'C\'. Point A has coordinates (1, 4). What are the coordinates of A\'?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A\' = A + translation vector = (1, 4) + (3, -2) = (4, 2)',
            markingCriteria: {
              breakdown: ['Add translation vector components (1 mark)', 'Correct coordinates A\'(4, 2) (1 mark)']
            },
            specReference: '3.2.2a - Translations',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q6',
            question: 'Calculate the volume of a cylinder with radius 4 cm and height 10 cm. Use π = 3.14.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Volume = πr²h = 3.14 × 4² × 10 = 3.14 × 16 × 10 = 502.4 cm³',
            markingCriteria: {
              breakdown: ['Use formula V = πr²h (1 mark)', 'Substitute values correctly (1 mark)', 'Calculate: 502.4 cm³ (1 mark)']
            },
            specReference: '3.1.4a - Volume of cylinders',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q7',
            question: 'In a right-angled triangle, the hypotenuse is 13 cm and one side is 5 cm. Calculate the length of the third side.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Using Pythagoras: a² + b² = c². So 5² + b² = 13², 25 + b² = 169, b² = 144, b = 12 cm',
            markingCriteria: {
              breakdown: ['Apply Pythagoras theorem correctly (1 mark)', 'Set up: 25 + b² = 169 (1 mark)', 'Solve: b = 12 cm (1 mark)']
            },
            specReference: '3.1.1c - Pythagoras theorem',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q8',
            question: 'A regular hexagon has side length 6 cm. Calculate the perimeter and the area of one triangular section when divided from the center.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Perimeter = 6 × 6 = 36 cm. Each triangle has base 6 cm and height = 6 × sin(60°) = 6 × (√3/2) = 3√3 cm. Area of one triangle = ½ × 6 × 3√3 = 9√3 cm²',
            markingCriteria: {
              breakdown: ['Calculate perimeter: 36 cm (1 mark)', 'Find height of triangle: 3√3 cm (1 mark)', 'Use triangle area formula (1 mark)', 'Calculate area: 9√3 cm² (1 mark)']
            },
            specReference: '3.1.2a - Regular polygons',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q9',
            question: 'Triangle PQR is rotated 90° clockwise about the origin. If P is at (2, 5), what are the coordinates of P\' after the rotation?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'For 90° clockwise rotation about origin: (x, y) → (y, -x). So P(2, 5) → P\'(5, -2)',
            markingCriteria: {
              breakdown: ['Apply rotation rule: (x, y) → (y, -x) (1 mark)', 'Correct coordinates P\'(5, -2) (1 mark)']
            },
            specReference: '3.2.2c - Rotations',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q10',
            question: 'A trapezium has parallel sides of lengths 8 cm and 12 cm, with a perpendicular height of 6 cm. Calculate its area. If this trapezium is the cross-section of a prism with length 15 cm, find the volume.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Area of trapezium = ½(a + b)h = ½(8 + 12) × 6 = ½ × 20 × 6 = 60 cm². Volume = area × length = 60 × 15 = 900 cm³',
            markingCriteria: {
              breakdown: ['Use trapezium area formula (1 mark)', 'Calculate area: 60 cm² (1 mark)', 'Apply volume formula (1 mark)', 'Calculate volume: 900 cm³ (1 mark)']
            },
            specReference: '3.1.1b - Area of trapezium and prism volume',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'm5-probability',
        name: 'Probability',
        questions: [
          {
            id: 'm5-q1',
            question: 'A bag contains 5 red, 3 blue, and 2 green balls. Two balls are drawn without replacement. Calculate the probability that both balls are red.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'P(first red) = 5/10 = 1/2. P(second red | first red) = 4/9. P(both red) = (1/2) × (4/9) = 4/18 = 2/9',
            markingCriteria: {
              breakdown: ['P(first red) = 5/10 (1 mark)', 'P(second red | first red) = 4/9 (1 mark)', 'P(both red) = 2/9 (1 mark)']
            },
            specReference: '4.1.2b - Conditional probability',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q2',
            question: 'The probability that it rains on any day is 0.3. Calculate the probability that it rains on exactly 2 days out of 4 consecutive days.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'This is binomial: P(X = 2) = C(4,2) × (0.3)² × (0.7)² = 6 × 0.09 × 0.49 = 0.2646',
            markingCriteria: {
              breakdown: ['Recognize binomial distribution (1 mark)', 'Calculate C(4,2) = 6 (1 mark)', 'Calculate (0.3)² × (0.7)² = 0.0441 (1 mark)', 'Final answer: 0.2646 (1 mark)']
            },
            specReference: '4.1.3a - Binomial probability',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm5-q3',
            question: 'A spinner has 4 equal sections numbered 1, 2, 3, 4. The spinner is spun three times. Calculate the probability of getting at least one 4.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'P(at least one 4) = 1 - P(no 4s) = 1 - (3/4)³ = 1 - 27/64 = 37/64',
            markingCriteria: {
              breakdown: ['Use complement: 1 - P(no 4s) (1 mark)', 'P(no 4 on one spin) = 3/4 (1 mark)', 'P(no 4s in three spins) = (3/4)³ = 27/64 (1 mark)', 'Final answer: 37/64 (1 mark)']
            },
            specReference: '4.1.1c - Independent events',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q4',
            question: 'A biased coin has P(Heads) = 0.6. The coin is tossed until a head appears. Calculate the probability that the first head appears on the 3rd toss.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'For first head on 3rd toss: P(TTH) = P(T) × P(T) × P(H) = 0.4 × 0.4 × 0.6 = 0.096',
            markingCriteria: {
              breakdown: ['Identify sequence: TTH (1 mark)', 'P(T) = 0.4 for each tail (1 mark)', 'Calculate: 0.4 × 0.4 × 0.6 = 0.096 (1 mark)']
            },
            specReference: '4.1.1c - Independent events',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm5-q5',
            question: 'A factory produces bolts. 95% are good quality and 5% are defective. A quality control inspector tests bolts until finding 2 defective ones. What is the probability that exactly 20 bolts need to be tested?',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'This follows negative binomial distribution. P(20th bolt is 2nd defective) = C(19,1) × (0.05)² × (0.95)¹⁸ = 19 × 0.0025 × 0.3972 = 0.0188',
            markingCriteria: {
              breakdown: ['Recognize negative binomial pattern (1 mark)', 'Identify: need C(19,1) ways for 1st defective in first 19 (1 mark)', 'Calculate C(19,1) = 19 (1 mark)', 'Calculate (0.05)² × (0.95)¹⁸ (1 mark)', 'Final answer: 0.0188 (1 mark)']
            },
            specReference: '4.1.3b - Negative binomial',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm5-q6',
            question: 'A fair six-sided die is rolled twice. Calculate the probability that the sum of the two rolls is 8.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Possible ways to get sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 ways. Total outcomes = 36. Probability = 5/36',
            markingCriteria: {
              breakdown: ['Identify all ways to get sum 8: 5 ways (1 mark)', 'Total possible outcomes: 36 (1 mark)', 'Probability = 5/36 (1 mark)']
            },
            specReference: '4.1.1a - Probability of combined events',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q7',
            question: 'Box A contains 3 red and 2 blue balls. Box B contains 1 red and 4 blue balls. A box is chosen at random and then a ball is drawn. Calculate the probability of drawing a red ball.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'P(red) = P(Box A) × P(red|Box A) + P(Box B) × P(red|Box B) = (1/2) × (3/5) + (1/2) × (1/5) = 3/10 + 1/10 = 4/10 = 2/5',
            markingCriteria: {
              breakdown: ['P(red|Box A) = 3/5 and P(red|Box B) = 1/5 (1 mark)', 'Use law of total probability (1 mark)', 'Calculate each branch correctly (1 mark)', 'Final answer: 2/5 (1 mark)']
            },
            specReference: '4.1.2c - Law of total probability',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q8',
            question: 'In a game, the probability of winning is 0.4. If the game is played 6 times, calculate the probability of winning exactly 3 games.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Using binomial: P(X = 3) = C(6,3) × (0.4)³ × (0.6)³ = 20 × 0.064 × 0.216 = 0.2765',
            markingCriteria: {
              breakdown: ['Recognize binomial distribution (1 mark)', 'Calculate C(6,3) = 20 (1 mark)', 'Calculate (0.4)³ × (0.6)³ (1 mark)', 'Final answer: 0.2765 (1 mark)']
            },
            specReference: '4.1.3a - Binomial probability',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm5-q9',
            question: 'A bag contains counters numbered 1 to 10. Three counters are drawn without replacement. What is the probability that all three numbers are even?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Even numbers: 2, 4, 6, 8, 10 (5 even, 5 odd). P(all even) = (5/10) × (4/9) × (3/8) = 60/720 = 1/12',
            markingCriteria: {
              breakdown: ['Identify 5 even numbers out of 10 (1 mark)', 'P(first even) = 5/10 (1 mark)', 'P(second even|first even) = 4/9, P(third even|first two even) = 3/8 (1 mark)', 'Final answer: 1/12 (1 mark)']
            },
            specReference: '4.1.2b - Conditional probability without replacement',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q10',
            question: 'Events A and B are independent. P(A) = 0.6 and P(B) = 0.4. Calculate P(A ∩ B), P(A ∪ B), and P(A\' ∩ B\').',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'P(A ∩ B) = P(A) × P(B) = 0.6 × 0.4 = 0.24. P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.6 + 0.4 - 0.24 = 0.76. P(A\') = 0.4, P(B\') = 0.6, so P(A\' ∩ B\') = 0.4 × 0.6 = 0.24',
            markingCriteria: {
              breakdown: ['Calculate P(A ∩ B) = 0.24 using independence (1 mark)', 'Use addition rule for P(A ∪ B) = 0.76 (1 mark)', 'Find P(A\') = 0.4 and P(B\') = 0.6 (1 mark)', 'Calculate P(A\' ∩ B\') = 0.24 (1 mark)', 'Show all working clearly (1 mark)']
            },
            specReference: '4.1.1c - Independent events and set operations',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'm6-statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'm6-q1',
            question: 'The times (in minutes) for 50 students to complete a test are summarized: 10-15 (8 students), 15-20 (12 students), 20-25 (18 students), 25-30 (8 students), 30-35 (4 students). Calculate an estimate for the mean time.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Midpoints: 12.5, 17.5, 22.5, 27.5, 32.5. Sum = 12.5×8 + 17.5×12 + 22.5×18 + 27.5×8 + 32.5×4 = 1050. Mean = 1050 ÷ 50 = 21 minutes',
            markingCriteria: {
              breakdown: ['Find midpoints of each class (1 mark)', 'Multiply midpoints by frequencies (1 mark)', 'Sum all products: 1050 (1 mark)', 'Divide by total frequency: 21 minutes (1 mark)']
            },
            specReference: '4.2.1b - Mean from grouped data',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q2',
            question: 'A survey of 100 people found the following about pets: 60 have a dog, 45 have a cat, 25 have both a dog and a cat. Draw a Venn diagram and find the probability that a randomly selected person has exactly one type of pet.',
            marks: 5,
            difficulty: 'medium',
            modelAnswer: 'Only dog: 60 - 25 = 35. Only cat: 45 - 25 = 20. Both: 25. Neither: 100 - 35 - 20 - 25 = 20. P(exactly one) = (35 + 20)/100 = 55/100 = 0.55',
            markingCriteria: {
              breakdown: ['Calculate only dog: 35 (1 mark)', 'Calculate only cat: 20 (1 mark)', 'Calculate neither: 20 (1 mark)', 'Draw correct Venn diagram (1 mark)', 'P(exactly one) = 0.55 (1 mark)']
            },
            specReference: '4.2.2a - Venn diagrams',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q3',
            question: 'The table shows the number of goals scored by a football team in 20 matches: Goals: 0(3), 1(7), 2(6), 3(3), 4(1). Calculate the standard deviation.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Mean = (0×3 + 1×7 + 2×6 + 3×3 + 4×1) ÷ 20 = 32 ÷ 20 = 1.6. Variance = Σfx² ÷ n - mean² = 66/20 - 1.6² = 3.3 - 2.56 = 0.74. Standard deviation = √0.74 = 0.86',
            markingCriteria: {
              breakdown: ['Calculate mean = 1.6 (1 mark)', 'Calculate Σfx² = 66 (1 mark)', 'Calculate variance = 0.74 (1 mark)', 'Calculate standard deviation = √0.74 (1 mark)', 'Final answer: 0.86 (1 mark)']
            },
            specReference: '4.2.1c - Standard deviation',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q4',
            question: 'The cumulative frequency graph shows the distribution of heights (in cm) of 80 students. The quartiles are: Q₁ = 158 cm, Q₂ = 165 cm, Q₃ = 172 cm. Calculate the interquartile range and explain what this tells us about the data.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'IQR = Q₃ - Q₁ = 172 - 158 = 14 cm. This tells us that the middle 50% of students have heights spanning a range of 14 cm, indicating moderate spread in the central portion of the data.',
            markingCriteria: {
              breakdown: ['Calculate IQR = 14 cm (1 mark)', 'Explain IQR represents middle 50% (1 mark)', 'Reference to spread/variability (1 mark)', 'Appropriate interpretation for this context (1 mark)']
            },
            specReference: '4.2.1d - Quartiles and interquartile range',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q5',
            question: 'A scatter graph shows the relationship between hours of study per week (x) and test scores (y). The correlation coefficient is r = 0.85. The regression line is y = 3.2x + 42. Predict the test score for a student who studies 15 hours per week and comment on the reliability.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Predicted score = 3.2 × 15 + 42 = 48 + 42 = 90. The correlation coefficient r = 0.85 shows strong positive correlation, so this prediction is quite reliable, though individual variation may still occur.',
            markingCriteria: {
              breakdown: ['Substitute into regression equation (1 mark)', 'Calculate predicted score = 90 (1 mark)', 'Reference to strong correlation (r = 0.85) (1 mark)', 'Comment on reliability with appropriate qualification (1 mark)']
            },
            specReference: '4.2.2c - Correlation and regression',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q6',
            question: 'The heights of 20 students (in cm) are: 158, 162, 165, 167, 159, 168, 170, 163, 166, 164, 169, 161, 160, 171, 167, 165, 168, 162, 166, 164. Find the median and interquartile range.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ordered data: 158, 159, 160, 161, 162, 162, 163, 164, 164, 165, 165, 166, 166, 167, 167, 168, 168, 169, 170, 171. Median = (165 + 165)/2 = 165 cm. Q1 = 162.5 cm, Q3 = 167.5 cm. IQR = 167.5 - 162.5 = 5 cm',
            markingCriteria: {
              breakdown: ['Order data correctly (1 mark)', 'Find median = 165 cm (1 mark)', 'Find Q1 and Q3 correctly (1 mark)', 'Calculate IQR = 5 cm (1 mark)']
            },
            specReference: '4.2.1d - Median and quartiles',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q7',
            question: 'A histogram shows the distribution of weights (kg) of 100 people. The class 60-65 has frequency density 4.2 and the class 65-70 has frequency density 6.8. Calculate the frequencies for these two classes.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Class width = 5 kg for both classes. Frequency = frequency density × class width. For 60-65: frequency = 4.2 × 5 = 21. For 65-70: frequency = 6.8 × 5 = 34',
            markingCriteria: {
              breakdown: ['Identify class width = 5 (1 mark)', 'Use formula: frequency = frequency density × class width (1 mark)', 'Calculate both frequencies: 21 and 34 (1 mark)']
            },
            specReference: '4.2.1a - Histograms',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q8',
            question: 'A cumulative frequency graph shows that the median speed of cars is 52 mph and the upper quartile is 58 mph. If 80 cars were observed, estimate how many cars were traveling faster than 55 mph.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'At 55 mph (between median and upper quartile), estimate about 70% of cars are below this speed. So about 30% are above 55 mph. Number of cars = 30% of 80 = 24 cars',
            markingCriteria: {
              breakdown: ['Estimate position of 55 mph on cumulative frequency curve (1 mark)', 'Estimate 70% of cars below 55 mph (1 mark)', 'Calculate 30% of 80 = 24 cars (1 mark)']
            },
            specReference: '4.2.1c - Cumulative frequency',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q9',
            question: 'Two dice are rolled 120 times. The expected frequency for getting a sum of 7 is 20. The observed frequency is 27. Calculate the chi-squared statistic for this outcome.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'χ² = Σ[(Observed - Expected)²/Expected] = (27 - 20)²/20 = 49/20 = 2.45',
            markingCriteria: {
              breakdown: ['Use chi-squared formula (1 mark)', 'Calculate (27 - 20)² = 49 (1 mark)', 'Final answer: χ² = 2.45 (1 mark)']
            },
            specReference: '4.2.3a - Chi-squared test',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q10',
            question: 'A box plot shows the following information for test scores: Minimum = 32, Q1 = 48, Median = 62, Q3 = 74, Maximum = 88. Identify any outliers using the 1.5 × IQR rule and describe the skewness of the distribution.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'IQR = 74 - 48 = 26. Lower fence = 48 - 1.5×26 = 9, Upper fence = 74 + 1.5×26 = 113. No outliers (all values between 9 and 113). Distribution is negatively skewed as median (62) is closer to Q3 (74) than to Q1 (48).',
            markingCriteria: {
              breakdown: ['Calculate IQR = 26 (1 mark)', 'Calculate fences: 9 and 113 (1 mark)', 'Identify no outliers (1 mark)', 'Describe negative skew correctly (1 mark)']
            },
            specReference: '4.2.1e - Box plots and distribution shape',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      }
    ]
  },
  {
    id: 'maths-edexcel',
    name: 'Mathematics (Edexcel)',
    topics: [
      {
        id: 'me1-number',
        name: 'Number',
        questions: [
          {
            id: 'me1-q1',
            question: 'Work out (4.8 × 10⁶) ÷ (1.2 × 10⁻²). Give your answer in standard form.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '(4.8 × 10⁶) ÷ (1.2 × 10⁻²) = (4.8 ÷ 1.2) × (10⁶ ÷ 10⁻²) = 4 × 10⁸',
            markingCriteria: {
              breakdown: ['Divide numbers: 4.8 ÷ 1.2 = 4 (1 mark)', 'Subtract indices: 6 - (-2) = 8 (1 mark)', 'Final answer in standard form: 4 × 10⁸ (1 mark)']
            },
            specReference: 'Edexcel 1H - Standard form calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me1-q2',
            question: 'Simplify √(75) + √(12) - √(27), giving your answer in the form a√(3) where a is an integer.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: '√(75) = 5√(3), √(12) = 2√(3), √(27) = 3√(3). Therefore 5√(3) + 2√(3) - 3√(3) = 4√(3)',
            markingCriteria: {
              breakdown: ['Simplify √(75) = 5√(3) (1 mark)', 'Simplify √(12) = 2√(3) and √(27) = 3√(3) (1 mark)', 'Combine like surds correctly (1 mark)', 'Final answer 4√(3) (1 mark)']
            },
            specReference: 'Edexcel 2H - Surds',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me1-q3',
            question: 'Express 0.3̅7̅ (0.373737...) as a fraction in its simplest form.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Let x = 0.373737... Then 100x = 37.373737... Subtracting: 99x = 37, so x = 37/99',
            markingCriteria: {
              breakdown: ['Set up equation with x = 0.373737... (1 mark)', 'Multiply by 100 (1 mark)', 'Subtract to get 99x = 37 (1 mark)', 'Final fraction 37/99 (1 mark)']
            },
            specReference: 'Edexcel 1H - Converting recurring decimals',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me1-q4',
            question: 'The speed of light is 3 × 10⁸ m/s. Calculate how far light travels in 2.5 × 10⁻³ seconds. Give your answer in standard form.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Distance = speed × time = (3 × 10⁸) × (2.5 × 10⁻³) = (3 × 2.5) × (10⁸ × 10⁻³) = 7.5 × 10⁵ m',
            markingCriteria: {
              breakdown: ['Multiply numbers: 3 × 2.5 = 7.5 (1 mark)', 'Add indices: 8 + (-3) = 5 (1 mark)', 'Final answer in standard form (1 mark)']
            },
            specReference: 'Edexcel 1H - Standard form calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me1-q5',
            question: 'Calculate 3⁵ × 3⁻² ÷ 3², giving your answer as a fraction.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '3⁵ × 3⁻² ÷ 3² = 3⁵⁻²⁻² = 3¹ = 3',
            markingCriteria: {
              breakdown: ['Apply index laws: 5 + (-2) - 2 = 1 (1 mark)', 'Recognize 3¹ = 3 (1 mark)', 'Final answer 3 (1 mark)']
            },
            specReference: 'Edexcel 2H - Index laws',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me1-q6',
            question: 'The height of a door is measured as 2.1 m to the nearest 0.1 m. The width is measured as 0.9 m to the nearest 0.1 m. Calculate the minimum possible area of the door.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Minimum height = 2.05 m, Minimum width = 0.85 m. Minimum area = 2.05 × 0.85 = 1.7425 m²',
            markingCriteria: {
              breakdown: ['Minimum height = 2.05 m (1 mark)', 'Minimum width = 0.85 m (1 mark)', 'Multiply for minimum area (1 mark)', 'Correct calculation: 1.7425 m² (1 mark)']
            },
            specReference: 'Edexcel 1H - Upper and lower bounds',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me1-q7',
            question: 'Work out the HCF and LCM of 72 and 108. Show your working using prime factorization.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: '72 = 2³ × 3², 108 = 2² × 3³. HCF = 2² × 3² = 36. LCM = 2³ × 3³ = 216',
            markingCriteria: {
              breakdown: ['Prime factorization of 72 (1 mark)', 'Prime factorization of 108 (1 mark)', 'HCF = 36 using common factors (1 mark)', 'LCM = 216 using all factors (1 mark)', 'Clear working shown (1 mark)']
            },
            specReference: 'Edexcel 1F - HCF and LCM',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me1-q8',
            question: 'Calculate (4⁻¹ × 4³) ÷ (4⁻² × 4⁴). Give your answer as a fraction.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '(4⁻¹ × 4³) ÷ (4⁻² × 4⁴) = 4⁻¹⁺³ ÷ 4⁻²⁺⁴ = 4² ÷ 4² = 4⁰ = 1',
            markingCriteria: {
              breakdown: ['Simplify numerator: 4² (1 mark)', 'Simplify denominator: 4² (1 mark)', 'Final answer: 1 (1 mark)']
            },
            specReference: 'Edexcel 2H - Index laws',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me1-q9',
            question: 'The value of a car decreases by 15% each year. If the car is worth £8500 after 2 years of depreciation, calculate its original value.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'After 2 years, value = original × (0.85)². So £8500 = original × 0.7225. Original value = £8500 ÷ 0.7225 = £11,765',
            markingCriteria: {
              breakdown: ['Set up equation with decay factor 0.85 (1 mark)', 'Recognize (0.85)² = 0.7225 (1 mark)', 'Rearrange: original = 8500 ÷ 0.7225 (1 mark)', 'Correct answer: £11,765 (1 mark)']
            },
            specReference: 'Edexcel 1H - Compound percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me1-q10',
            question: 'Four numbers are in the ratio 3:4:5:6. The sum of the smallest and largest numbers is 54. Find all four numbers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Let the numbers be 3x, 4x, 5x, and 6x. Then 3x + 6x = 54, so 9x = 54, x = 6. The numbers are 18, 24, 30, and 36.',
            markingCriteria: {
              breakdown: ['Express numbers as 3x, 4x, 5x, 6x (1 mark)', 'Set up equation: 3x + 6x = 54 (1 mark)', 'Solve: x = 6 (1 mark)', 'Find all numbers: 18, 24, 30, 36 (1 mark)']
            },
            specReference: 'Edexcel 1H - Ratio problems',
            calculatorGuidance: 'non-calc-friendly'
          }
        ]
      },
      {
        id: 'me2-algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'me2-q1',
            question: 'Solve the quadratic equation x² - 6x - 16 = 0 by factorization.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'x² - 6x - 16 = (x - 8)(x + 2) = 0. Therefore x = 8 or x = -2',
            markingCriteria: {
              breakdown: ['Factor to (x - 8)(x + 2) (1 mark)', 'Set each factor to zero (1 mark)', 'Both solutions x = 8 and x = -2 (1 mark)']
            },
            specReference: 'Edexcel 2H - Solving quadratic equations',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me2-q2',
            question: 'Expand and simplify (3x - 2)² + (x + 1)(x - 3)',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: '(3x - 2)² = 9x² - 12x + 4. (x + 1)(x - 3) = x² - 2x - 3. Therefore 9x² - 12x + 4 + x² - 2x - 3 = 10x² - 14x + 1',
            markingCriteria: {
              breakdown: ['Expand (3x - 2)² correctly (1 mark)', 'Expand (x + 1)(x - 3) correctly (1 mark)', 'Add expressions correctly (1 mark)', 'Simplify to 10x² - 14x + 1 (1 mark)']
            },
            specReference: 'Edexcel 2H - Expanding and simplifying',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me2-q3',
            question: 'Solve the simultaneous equations: 4x + 3y = 22 and 2x - y = 4',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'From equation 2: y = 2x - 4. Substitute into equation 1: 4x + 3(2x - 4) = 22. 10x - 12 = 22, so x = 3.4. Then y = 2.8',
            markingCriteria: {
              breakdown: ['Rearrange one equation for x or y (1 mark)', 'Substitute correctly (1 mark)', 'Solve for one variable (1 mark)', 'Find both solutions x = 3.4, y = 2.8 (1 mark)']
            },
            specReference: 'Edexcel 2H - Simultaneous equations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me2-q4',
            question: 'Make r the subject of the formula: V = ⅓πr²h',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'V = ⅓πr²h. Multiply both sides by 3: 3V = πr²h. Divide by πh: 3V/πh = r². Take square root: r = √(3V/πh)',
            markingCriteria: {
              breakdown: ['Multiply both sides by 3 (1 mark)', 'Divide by πh (1 mark)', 'Take square root: r = √(3V/πh) (1 mark)']
            },
            specReference: 'Edexcel 2H - Changing the subject',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me2-q5',
            question: 'The nth term of a sequence is 2n² + 3n - 1. Find the first four terms and the 8th term.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'n = 1: 2(1) + 3(1) - 1 = 4. n = 2: 2(4) + 6 - 1 = 13. n = 3: 2(9) + 9 - 1 = 26. n = 4: 2(16) + 12 - 1 = 43. n = 8: 2(64) + 24 - 1 = 151',
            markingCriteria: {
              breakdown: ['First four terms = 4, 13, 26, 43 (2 marks)', 'Substitute n = 8 correctly (1 mark)', '8th term = 151 (1 mark)']
            },
            specReference: 'Edexcel 2H - Sequences',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me2-q6',
            question: 'Solve the quadratic equation 3x² + 5x - 2 = 0 using the quadratic formula.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'x = (-5 ± √(25 + 24))/6 = (-5 ± √49)/6 = (-5 ± 7)/6. So x = ⅓ or x = -2',
            markingCriteria: {
              breakdown: ['Substitute into formula: x = (-5 ± √(5² - 4×3×(-2)))/6 (1 mark)', 'Calculate discriminant: 25 + 24 = 49 (1 mark)', 'Find √49 = 7 (1 mark)', 'Both solutions: x = ⅓ and x = -2 (1 mark)']
            },
            specReference: 'Edexcel 2H - Quadratic formula',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me2-q7',
            question: 'Solve the simultaneous equations: 3x + 4y = 18 and 5x - 2y = 8 using elimination.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Multiply first by 1 and second by 2: 3x + 4y = 18 and 10x - 4y = 16. Add: 13x = 34, so x = 34/13. Substitute: y = 24/13',
            markingCriteria: {
              breakdown: ['Eliminate y by multiplying equations appropriately (1 mark)', 'Add equations to get 13x = 34 (1 mark)', 'Solve for x = 34/13 (1 mark)', 'Find y = 24/13 by substitution (1 mark)']
            },
            specReference: 'Edexcel 2H - Elimination method',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me2-q8',
            question: 'Factorize completely: 2x³ - 8x² + 8x',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '2x³ - 8x² + 8x = 2x(x² - 4x + 4) = 2x(x - 2)²',
            markingCriteria: {
              breakdown: ['Take out common factor 2x (1 mark)', 'Factorize x² - 4x + 4 (1 mark)', 'Final answer 2x(x - 2)² (1 mark)']
            },
            specReference: 'Edexcel 2H - Factorizing',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me2-q9',
            question: 'Solve the inequality 4(x + 2) ≥ 3x + 10 and write your answer using inequality notation.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '4x + 8 ≥ 3x + 10, so x ≥ 2. Answer: x ≥ 2',
            markingCriteria: {
              breakdown: ['Expand: 4x + 8 ≥ 3x + 10 (1 mark)', 'Solve: x ≥ 2 (1 mark)', 'Correct inequality notation (1 mark)']
            },
            specReference: 'Edexcel 2H - Linear inequalities',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me2-q10',
            question: 'Given that g(x) = x² - 3x + 2, find g(4) and solve g(x) = 0.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'g(4) = 16 - 12 + 2 = 6. For g(x) = 0: x² - 3x + 2 = 0. Factorizing: (x - 1)(x - 2) = 0. So x = 1 or x = 2',
            markingCriteria: {
              breakdown: ['Calculate g(4) = 6 (1 mark)', 'Set up equation x² - 3x + 2 = 0 (1 mark)', 'Factorize to (x - 1)(x - 2) (1 mark)', 'Find x = 1 (1 mark)', 'Find x = 2 (1 mark)']
            },
            specReference: 'Edexcel 2H - Functions and quadratic equations',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'me3-ratio',
        name: 'Ratio, proportion and rates of change',
        questions: [
          {
            id: 'me3-q1',
            question: 'The population of a city increases by 4% each year. If the population was 250,000 in 2021, calculate the population in 2024.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Population in 2024 = 250,000 × (1.04)³ = 250,000 × 1.124864 = 281,216',
            markingCriteria: {
              breakdown: ['Use compound interest formula with 1.04 (1 mark)', 'Calculate (1.04)³ = 1.124864 (1 mark)', 'Final answer 281,216 (1 mark)']
            },
            specReference: 'Edexcel 1H - Compound percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q2',
            question: 'y is inversely proportional to x³. When x = 2, y = 4. Find the value of y when x = 4.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'y = k/x³ where k is constant. When x = 2, y = 4: 4 = k/8, so k = 32. When x = 4: y = 32/64 = 1/2',
            markingCriteria: {
              breakdown: ['Write y = k/x³ (1 mark)', 'Find k using given values: k = 32 (1 mark)', 'Substitute x = 4 into equation (1 mark)', 'Final answer y = 1/2 (1 mark)']
            },
            specReference: 'Edexcel 2H - Inverse proportion',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q3',
            question: 'Convert 54 km/h to m/s.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '54 km/h = 54 × 1000 ÷ 3600 = 54000 ÷ 3600 = 15 m/s',
            markingCriteria: {
              breakdown: ['Convert km to m and h to s (1 mark)', 'Correct calculation: 15 m/s (1 mark)']
            },
            specReference: 'Edexcel 1F - Unit conversions',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q4',
            question: 'A map has a scale of 1:50000. The actual distance between two landmarks is 12 km. Calculate the distance on the map in centimeters.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Actual distance = 12 km = 1,200,000 cm. Map distance = 1,200,000 ÷ 50,000 = 24 cm',
            markingCriteria: {
              breakdown: ['Convert 12 km to cm: 1,200,000 cm (1 mark)', 'Apply scale factor (1 mark)', 'Final answer: 24 cm (1 mark)']
            },
            specReference: 'Edexcel 1H - Scale and maps',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q5',
            question: 'A laptop computer depreciates by 20% each year. After how many years will its value be less than 40% of its original value?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Value after n years = V₀ × (0.8)ⁿ. For 40% value: (0.8)ⁿ < 0.4. Using logarithms: n > log(0.4)/log(0.8) = 4.11. Therefore after 5 years.',
            markingCriteria: {
              breakdown: ['Set up inequality (0.8)ⁿ < 0.4 (1 mark)', 'Use logarithms correctly (1 mark)', 'Calculate n > 4.11 (1 mark)', 'Conclude 5 years (1 mark)']
            },
            specReference: 'Edexcel 2H - Exponential functions',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q6',
            question: 'A printer produces 180 pages per hour. If the printer runs for 6.5 hours, how many pages are produced? If 25 pages are damaged, what percentage are in good condition?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Total pages = 180 × 6.5 = 1170 pages. Good pages = 1170 - 25 = 1145. Percentage good = (1145/1170) × 100% = 97.86%',
            markingCriteria: {
              breakdown: ['Calculate total pages: 1170 (1 mark)', 'Calculate good pages: 1145 (1 mark)', 'Set up percentage calculation (1 mark)', 'Final answer: 97.86% (1 mark)']
            },
            specReference: 'Edexcel 1H - Rate calculations',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q7',
            question: 'The price of petrol increases from £1.35 per litre to £1.49 per litre. Calculate the percentage increase.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Increase = £1.49 - £1.35 = £0.14. Percentage increase = (0.14/1.35) × 100% = 10.37%',
            markingCriteria: {
              breakdown: ['Calculate increase: £0.14 (1 mark)', 'Set up percentage formula (1 mark)', 'Final answer: 10.37% (1 mark)']
            },
            specReference: 'Edexcel 1H - Percentage change',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q8',
            question: 'Four quantities P, Q, R, and S are in the ratio 2:3:5:8. If P + R = 84, find the values of P, Q, R, and S.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Let P = 2x, Q = 3x, R = 5x, S = 8x. Then 2x + 5x = 84, so 7x = 84, x = 12. Therefore P = 24, Q = 36, R = 60, S = 96.',
            markingCriteria: {
              breakdown: ['Express in terms of x: P = 2x, Q = 3x, R = 5x, S = 8x (1 mark)', 'Set up equation: 2x + 5x = 84 (1 mark)', 'Solve: x = 12 (1 mark)', 'Find all values: P = 24, Q = 36, R = 60, S = 96 (1 mark)']
            },
            specReference: 'Edexcel 1H - Ratio problems',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me3-q9',
            question: 'y varies directly as the cube of x. When x = 2, y = 24. Find the value of y when x = 3.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'y = kx³ where k is constant. When x = 2, y = 24: 24 = k × 8, so k = 3. When x = 3: y = 3 × 27 = 81',
            markingCriteria: {
              breakdown: ['Write y = kx³ (1 mark)', 'Find k = 3 using given values (1 mark)', 'Calculate y = 81 when x = 3 (1 mark)']
            },
            specReference: 'Edexcel 1H - Direct proportion',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me3-q10',
            question: 'A recipe for 6 people uses 350g of rice. How much rice is needed for 15 people? If rice costs £2.80 per kg, what is the cost of rice for 15 people?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'For 15 people: (350 × 15) ÷ 6 = 875g = 0.875kg. Cost = 0.875 × £2.80 = £2.45',
            markingCriteria: {
              breakdown: ['Calculate rice for 15 people: 875g (1 mark)', 'Convert to kg: 0.875kg (1 mark)', 'Calculate cost (1 mark)', 'Final answer: £2.45 (1 mark)']
            },
            specReference: 'Edexcel 1H - Proportion and unit costs',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'me4-geometry',
        name: 'Geometry and measures',
        questions: [
          {
            id: 'me4-q1',
            question: 'In a right-angled triangle, one angle is 42°. A side adjacent to this angle is 12 cm and the side opposite to this angle is k cm. Calculate the value of k.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'tan(42°) = opposite/adjacent = k/12. Therefore k = 12 × tan(42°) = 12 × 0.9004 = 10.80 cm (3 sf)',
            markingCriteria: {
              breakdown: ['Identify correct trigonometric ratio: tan(42°) (1 mark)', 'Set up equation: k = 12 × tan(42°) (1 mark)', 'Calculate: k = 10.80 cm (1 mark)']
            },
            specReference: 'Edexcel 2H - Trigonometry in right-angled triangles',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q2',
            question: 'A triangle has vertices at P(1, 2), Q(5, 6), and R(3, 8). Calculate the length of side PQ using the distance formula.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'PQ = √[(5-1)² + (6-2)²] = √[4² + 4²] = √[16 + 16] = √32 = 4√2 ≈ 5.66 units',
            markingCriteria: {
              breakdown: ['Find differences: (5-1) = 4, (6-2) = 4 (1 mark)', 'Apply distance formula: √[16 + 16] (1 mark)', 'Simplify: 4√2 or 5.66 units (1 mark)']
            },
            specReference: 'Edexcel 2H - Distance formula',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q3',
            question: 'A sector of a circle has radius 8 cm and central angle 120°. Calculate the arc length of the sector.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Arc length = (θ/360°) × 2πr = (120°/360°) × 2π × 8 = (1/3) × 16π = 16π/3 = 16.76 cm (3 sf)',
            markingCriteria: {
              breakdown: ['Use arc length formula (1 mark)', 'Substitute values correctly: (120/360) × 2π × 8 (1 mark)', 'Calculate: 16π/3 = 16.76 cm (1 mark)']
            },
            specReference: 'Edexcel 2H - Arc length',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q4',
            question: 'A sphere has radius 6 cm. Calculate the volume and surface area of the sphere.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Volume = (4/3)πr³ = (4/3)π × 6³ = (4/3)π × 216 = 288π = 904.8 cm³. Surface area = 4πr² = 4π × 36 = 144π = 452.4 cm²',
            markingCriteria: {
              breakdown: ['Calculate volume: 288π cm³ (1 mark)', 'Calculate surface area: 144π cm² (1 mark)', 'Volume = 904.8 cm³ (1 mark)', 'Surface area = 452.4 cm² (1 mark)']
            },
            specReference: 'Edexcel 2H - Volume and surface area of spheres',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q5',
            question: 'Triangle DEF is transformed by a translation with vector (-2, 4) to give triangle D\'E\'F\'. Point D has coordinates (3, -1). What are the coordinates of D\'?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'D\' = D + translation vector = (3, -1) + (-2, 4) = (1, 3)',
            markingCriteria: {
              breakdown: ['Add translation vector components (1 mark)', 'Correct coordinates D\'(1, 3) (1 mark)']
            },
            specReference: 'Edexcel 1H - Translations',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me4-q6',
            question: 'Calculate the volume of a cone with base radius 5 cm and height 12 cm. Use π = 3.14.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Volume = (1/3)πr²h = (1/3) × 3.14 × 5² × 12 = (1/3) × 3.14 × 25 × 12 = 314 cm³',
            markingCriteria: {
              breakdown: ['Use formula V = (1/3)πr²h (1 mark)', 'Substitute values correctly (1 mark)', 'Calculate: 314 cm³ (1 mark)']
            },
            specReference: 'Edexcel 2H - Volume of cones',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q7',
            question: 'In a right-angled triangle, the hypotenuse is 17 cm and one side is 8 cm. Calculate the length of the third side.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Using Pythagoras: a² + b² = c². So 8² + b² = 17², 64 + b² = 289, b² = 225, b = 15 cm',
            markingCriteria: {
              breakdown: ['Apply Pythagoras theorem correctly (1 mark)', 'Set up: 64 + b² = 289 (1 mark)', 'Solve: b = 15 cm (1 mark)']
            },
            specReference: 'Edexcel 1H - Pythagoras theorem',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q8',
            question: 'A regular octagon has side length 4 cm. Calculate the perimeter and explain how to find the area using the apothem method.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Perimeter = 8 × 4 = 32 cm. For area: divide octagon into 8 triangles from center. Each triangle has base 4 cm and height equal to apothem. Area = (1/2) × perimeter × apothem = (1/2) × 32 × apothem = 16 × apothem.',
            markingCriteria: {
              breakdown: ['Calculate perimeter: 32 cm (1 mark)', 'Explain division into triangles (1 mark)', 'Use apothem formula (1 mark)', 'Area = 16 × apothem (1 mark)']
            },
            specReference: 'Edexcel 2H - Regular polygons',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me4-q9',
            question: 'Triangle ABC is reflected in the line y = x. If A is at (4, 1), what are the coordinates of A\' after the reflection?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'For reflection in y = x: (x, y) → (y, x). So A(4, 1) → A\'(1, 4)',
            markingCriteria: {
              breakdown: ['Apply reflection rule: (x, y) → (y, x) (1 mark)', 'Correct coordinates A\'(1, 4) (1 mark)']
            },
            specReference: 'Edexcel 1H - Reflections',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me4-q10',
            question: 'A parallelogram has sides of lengths 9 cm and 12 cm, with an included angle of 65°. Calculate its area. If this parallelogram is the base of a prism with height 8 cm, find the volume.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Area of parallelogram = ab sin(θ) = 9 × 12 × sin(65°) = 108 × 0.9063 = 97.88 cm². Volume = area × height = 97.88 × 8 = 783.04 cm³',
            markingCriteria: {
              breakdown: ['Use parallelogram area formula (1 mark)', 'Calculate area: 97.88 cm² (1 mark)', 'Apply volume formula (1 mark)', 'Calculate volume: 783.04 cm³ (1 mark)']
            },
            specReference: 'Edexcel 2H - Area of parallelogram and prism volume',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'me5-probability',
        name: 'Probability',
        questions: [
          {
            id: 'me5-q1',
            question: 'A box contains 6 red, 4 blue, and 3 yellow balls. Two balls are drawn without replacement. Calculate the probability that both balls are blue.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'P(first blue) = 4/13. P(second blue | first blue) = 3/12 = 1/4. P(both blue) = (4/13) × (1/4) = 4/52 = 1/13',
            markingCriteria: {
              breakdown: ['P(first blue) = 4/13 (1 mark)', 'P(second blue | first blue) = 3/12 (1 mark)', 'P(both blue) = 1/13 (1 mark)']
            },
            specReference: 'Edexcel 1H - Conditional probability',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me5-q2',
            question: 'The probability that a student passes a test is 0.7. Calculate the probability that exactly 3 out of 5 students pass the test.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'This is binomial: P(X = 3) = C(5,3) × (0.7)³ × (0.3)² = 10 × 0.343 × 0.09 = 0.3087',
            markingCriteria: {
              breakdown: ['Recognize binomial distribution (1 mark)', 'Calculate C(5,3) = 10 (1 mark)', 'Calculate (0.7)³ × (0.3)² = 0.03087 (1 mark)', 'Final answer: 0.3087 (1 mark)']
            },
            specReference: 'Edexcel 2H - Binomial probability',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me5-q3',
            question: 'A fair eight-sided die (numbered 1-8) is rolled twice. Calculate the probability of getting at least one 6.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'P(at least one 6) = 1 - P(no 6s) = 1 - (7/8)² = 1 - 49/64 = 15/64',
            markingCriteria: {
              breakdown: ['Use complement: 1 - P(no 6s) (1 mark)', 'P(no 6 on one roll) = 7/8 (1 mark)', 'P(no 6s in two rolls) = (7/8)² = 49/64 (1 mark)', 'Final answer: 15/64 (1 mark)']
            },
            specReference: 'Edexcel 1H - Independent events',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me5-q4',
            question: 'A biased coin has P(Heads) = 0.65. The coin is tossed until a tail appears. Calculate the probability that the first tail appears on the 4th toss.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'For first tail on 4th toss: P(HHHT) = P(H) × P(H) × P(H) × P(T) = 0.65 × 0.65 × 0.65 × 0.35 = 0.0962',
            markingCriteria: {
              breakdown: ['Identify sequence: HHHT (1 mark)', 'P(H) = 0.65, P(T) = 0.35 (1 mark)', 'Calculate: (0.65)³ × 0.35 = 0.0962 (1 mark)']
            },
            specReference: 'Edexcel 1H - Independent events',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me5-q5',
            question: 'A quality control process finds that 2% of items produced are defective. In a batch of 200 items, what is the probability that exactly 3 items are defective?',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'This follows binomial distribution with n = 200, p = 0.02. P(X = 3) = C(200,3) × (0.02)³ × (0.98)¹⁹⁷ = 1,313,400 × 0.000008 × 0.0183 = 0.1927',
            markingCriteria: {
              breakdown: ['Recognize binomial with n = 200, p = 0.02 (1 mark)', 'Calculate C(200,3) = 1,313,400 (1 mark)', 'Calculate (0.02)³ = 0.000008 (1 mark)', 'Calculate (0.98)¹⁹⁷ ≈ 0.0183 (1 mark)', 'Final answer: 0.1927 (1 mark)']
            },
            specReference: 'Edexcel 2H - Binomial probability',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me5-q6',
            question: 'Two fair six-sided dice are rolled. Calculate the probability that the product of the two numbers is 12.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Possible ways to get product 12: (2,6), (3,4), (4,3), (6,2) = 4 ways. Total outcomes = 36. Probability = 4/36 = 1/9',
            markingCriteria: {
              breakdown: ['Identify all ways to get product 12: 4 ways (1 mark)', 'Total possible outcomes: 36 (1 mark)', 'Probability = 1/9 (1 mark)']
            },
            specReference: 'Edexcel 1H - Probability of combined events',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me5-q7',
            question: 'Bag X contains 4 red and 3 green balls. Bag Y contains 2 red and 5 green balls. A bag is chosen at random and then a ball is drawn. Calculate the probability of drawing a green ball.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'P(green) = P(Bag X) × P(green|Bag X) + P(Bag Y) × P(green|Bag Y) = (1/2) × (3/7) + (1/2) × (5/7) = 3/14 + 5/14 = 8/14 = 4/7',
            markingCriteria: {
              breakdown: ['P(green|Bag X) = 3/7 and P(green|Bag Y) = 5/7 (1 mark)', 'Use law of total probability (1 mark)', 'Calculate each branch correctly (1 mark)', 'Final answer: 4/7 (1 mark)']
            },
            specReference: 'Edexcel 2H - Law of total probability',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me5-q8',
            question: 'In a game, the probability of scoring is 0.3. If the game is played 8 times, calculate the probability of scoring exactly 2 times.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Using binomial: P(X = 2) = C(8,2) × (0.3)² × (0.7)⁶ = 28 × 0.09 × 0.1176 = 0.2965',
            markingCriteria: {
              breakdown: ['Recognize binomial distribution (1 mark)', 'Calculate C(8,2) = 28 (1 mark)', 'Calculate (0.3)² × (0.7)⁶ (1 mark)', 'Final answer: 0.2965 (1 mark)']
            },
            specReference: 'Edexcel 2H - Binomial probability',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me5-q9',
            question: 'A deck contains cards numbered 1 to 12. Four cards are drawn without replacement. What is the probability that all four numbers are odd?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Odd numbers: 1, 3, 5, 7, 9, 11 (6 odd, 6 even). P(all odd) = (6/12) × (5/11) × (4/10) × (3/9) = 360/11880 = 1/33',
            markingCriteria: {
              breakdown: ['Identify 6 odd numbers out of 12 (1 mark)', 'P(first odd) = 6/12 = 1/2 (1 mark)', 'Calculate remaining probabilities: 5/11, 4/10, 3/9 (1 mark)', 'Final answer: 1/33 (1 mark)']
            },
            specReference: 'Edexcel 1H - Conditional probability without replacement',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me5-q10',
            question: 'Events C and D are independent. P(C) = 0.5 and P(D) = 0.3. Calculate P(C ∩ D), P(C ∪ D), and P(C\' ∩ D\').',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'P(C ∩ D) = P(C) × P(D) = 0.5 × 0.3 = 0.15. P(C ∪ D) = P(C) + P(D) - P(C ∩ D) = 0.5 + 0.3 - 0.15 = 0.65. P(C\') = 0.5, P(D\') = 0.7, so P(C\' ∩ D\') = 0.5 × 0.7 = 0.35',
            markingCriteria: {
              breakdown: ['Calculate P(C ∩ D) = 0.15 using independence (1 mark)', 'Use addition rule for P(C ∪ D) = 0.65 (1 mark)', 'Find P(C\') = 0.5 and P(D\') = 0.7 (1 mark)', 'Calculate P(C\' ∩ D\') = 0.35 (1 mark)', 'Show all working clearly (1 mark)']
            },
            specReference: 'Edexcel 2H - Independent events and set operations',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      },
      {
        id: 'me6-statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'me6-q1',
            question: 'The masses (in kg) of 10 students are: 58, 62, 55, 67, 61, 59, 64, 60, 63, 56. Calculate the mean, median, and range.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Mean = (58+62+55+67+61+59+64+60+63+56)/10 = 605/10 = 60.5 kg. Ordered: 55, 56, 58, 59, 60, 61, 62, 63, 64, 67. Median = (60+61)/2 = 60.5 kg. Range = 67-55 = 12 kg.',
            markingCriteria: {
              breakdown: ['Calculate mean: 60.5 kg (1 mark)', 'Order data and find median: 60.5 kg (1 mark)', 'Calculate range: 12 kg (1 mark)', 'All answers correct with units (1 mark)']
            },
            specReference: 'Edexcel 1H - Measures of central tendency',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q2',
            question: 'A frequency table shows: Score: 1(3), 2(5), 3(8), 4(4), 5(2). Calculate the mean and modal score.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Total frequency = 3+5+8+4+2 = 22. Sum = 1×3 + 2×5 + 3×8 + 4×4 + 5×2 = 3+10+24+16+10 = 63. Mean = 63/22 = 2.86. Mode = 3 (highest frequency = 8)',
            markingCriteria: {
              breakdown: ['Calculate total and sum correctly (1 mark)', 'Mean = 63/22 = 2.86 (1 mark)', 'Mode = 3 (1 mark)']
            },
            specReference: 'Edexcel 1H - Frequency tables and averages',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q3',
            question: 'For the data: Height (cm): 150-160(12), 160-170(18), 170-180(25), 180-190(15), 190-200(8). Calculate the cumulative frequencies and estimate the median and interquartile range.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Total frequency = 78. Cumulative frequencies: 150(0), 160(12), 170(30), 180(55), 190(70), 200(78). Median at 39th value ≈ 173 cm. Q1 at 19.5th value ≈ 167 cm. Q3 at 58.5th value ≈ 181 cm. IQR = 181-167 = 14 cm.',
            markingCriteria: {
              breakdown: ['Calculate cumulative frequencies correctly (1 mark)', 'Calculate position of median (1 mark)', 'Estimate median ≈ 173 cm (1 mark)', 'Estimate Q1 and Q3 (1 mark)', 'Calculate IQR = 14 cm (1 mark)']
            },
            specReference: 'Edexcel 2H - Cumulative frequency',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q4',
            question: 'The heights of 15 plants are: 12, 15, 18, 14, 16, 19, 13, 17, 20, 14, 16, 18, 15, 17, 16 cm. Calculate the standard deviation.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Mean = 240/15 = 16 cm. Variance = Σ(x-mean)²/n = [(12-16)²+(15-16)²+...+(16-16)²]/15 = 58/15 = 3.867. Standard deviation = √3.867 = 1.97 cm',
            markingCriteria: {
              breakdown: ['Calculate mean = 16 cm (1 mark)', 'Calculate deviations and squares (1 mark)', 'Calculate variance = 3.867 (1 mark)', 'Standard deviation = 1.97 cm (1 mark)']
            },
            specReference: 'Edexcel 2H - Standard deviation',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q5',
            question: 'A scatter graph shows a strong positive correlation between study time (hours) and test score (%). The line of best fit is y = 8x + 25. Interpret the gradient and y-intercept in context.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Gradient = 8: For each additional hour of study, the test score increases by 8 percentage points on average. Y-intercept = 25: A student who studies for 0 hours would be expected to score 25% on the test.',
            markingCriteria: {
              breakdown: ['Interpret gradient correctly in context (2 marks)', 'Interpret y-intercept correctly in context (2 marks)']
            },
            specReference: 'Edexcel 2H - Correlation and regression',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'me6-q6',
            question: 'A histogram shows class intervals and frequencies. Class 20-30 has frequency density 2.4 and class width 10. Class 30-40 has frequency 18. Calculate the frequency for 20-30 and frequency density for 30-40.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Frequency = frequency density × class width. For 20-30: frequency = 2.4 × 10 = 24. For 30-40: frequency density = frequency ÷ class width = 18 ÷ 10 = 1.8',
            markingCriteria: {
              breakdown: ['Use formula: frequency = frequency density × class width (1 mark)', 'Calculate frequency for 20-30: 24 (1 mark)', 'Calculate frequency density for 30-40: 1.8 (1 mark)']
            },
            specReference: 'Edexcel 2H - Histograms',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q7',
            question: 'Two groups of students take the same test. Group A: mean = 72, standard deviation = 8, n = 25. Group B: mean = 68, standard deviation = 12, n = 30. Compare the performance of the two groups.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Group A has higher mean (72 vs 68), showing better average performance. Group A has lower standard deviation (8 vs 12), showing more consistent performance. Group A students are more tightly clustered around their mean, while Group B shows more variation in scores.',
            markingCriteria: {
              breakdown: ['Compare means correctly (1 mark)', 'Compare standard deviations correctly (1 mark)', 'Interpret consistency/variation (1 mark)', 'Draw overall conclusion about performance (1 mark)']
            },
            specReference: 'Edexcel 2H - Comparing distributions',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q8',
            question: 'In a survey of 200 people about their favorite color, the results were: Red(45), Blue(62), Green(38), Yellow(28), Other(27). Calculate the angle for each sector in a pie chart.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Total = 200. Angles: Red = (45/200) × 360° = 81°, Blue = (62/200) × 360° = 111.6°, Green = (38/200) × 360° = 68.4°, Yellow = (28/200) × 360° = 50.4°, Other = (27/200) × 360° = 48.6°',
            markingCriteria: {
              breakdown: ['Calculate angles using (frequency/total) × 360° (1 mark)', 'Red angle = 81° (1 mark)', 'Blue angle = 111.6° (1 mark)', 'All other angles correct (1 mark)']
            },
            specReference: 'Edexcel 1H - Pie charts',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q9',
            question: 'A sample of 50 light bulbs has a mean lifetime of 1200 hours. Calculate a 95% confidence interval for the population mean, given that the population standard deviation is 150 hours.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Standard error = σ/√n = 150/√50 = 21.21. For 95% confidence, z = 1.96. Margin of error = 1.96 × 21.21 = 41.57. Confidence interval = 1200 ± 41.57 = (1158.43, 1241.57) hours',
            markingCriteria: {
              breakdown: ['Calculate standard error: 21.21 (1 mark)', 'Use correct z-value: 1.96 (1 mark)', 'Calculate margin of error: 41.57 (1 mark)', 'Give confidence interval: (1158.43, 1241.57) (1 mark)']
            },
            specReference: 'Edexcel 2H - Confidence intervals',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'me6-q10',
            question: 'A chi-squared test is performed to test if a dice is fair. The observed frequencies for faces 1-6 are: 8, 12, 15, 9, 11, 5. The expected frequency for each face is 10. Calculate the chi-squared test statistic.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'χ² = Σ[(Observed - Expected)²/Expected] = [(8-10)²/10] + [(12-10)²/10] + [(15-10)²/10] + [(9-10)²/10] + [(11-10)²/10] + [(5-10)²/10] = 0.4 + 0.4 + 2.5 + 0.1 + 0.1 + 2.5 = 6.0',
            markingCriteria: {
              breakdown: ['Use chi-squared formula correctly (1 mark)', 'Calculate each term: 0.4, 0.4, 2.5, 0.1, 0.1, 2.5 (2 marks)', 'Sum to get χ² = 6.0 (1 mark)']
            },
            specReference: 'Edexcel 2H - Chi-squared test',
            calculatorGuidance: 'calc-recommended'
          }
        ]
      }
    ]
  },
  {
    id: 'business-edexcel-igcse',
    name: 'Business (Edexcel IGCSE)',
    topics: [
      {
        id: 'business-activity-influences',
        name: 'Business activity and influences on business',
        questions: [
          {
            id: 'bai-q1',
            question: 'Explain why a business might change its objectives from survival to profit maximization.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'A business may change from survival to profit maximization once it has established itself in the market and overcome initial challenges. During the survival phase, the business focuses on covering costs and staying operational. Once stable, it can shift focus to generating higher profits to reward owners, fund expansion, or invest in new products.',
            markingCriteria: {
              breakdown: ['Explanation of survival objective (1 mark)', 'Explanation of profit maximization (1 mark)', 'Reason for change - market establishment (1 mark)', 'Benefits of profit maximization (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.1 - Business objectives'
          },
          {
            id: 'bai-q2',
            question: 'Compare the advantages and disadvantages of being a sole trader versus a limited company.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Sole traders have complete control and keep all profits, but face unlimited liability and limited access to finance. Limited companies have limited liability protection and better access to capital through share sales, but face corporation tax, more regulations, and potential loss of control when selling shares to investors.',
            markingCriteria: {
              breakdown: ['Sole trader advantages (1 mark)', 'Sole trader disadvantages (1 mark)', 'Limited company advantages (2 marks)', 'Limited company disadvantages (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 1.2 - Types of organisations'
          },
          {
            id: 'bai-q3',
            question: 'Explain how the internet has changed business location decisions.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'The internet allows businesses to operate remotely and reach global customers without being physically close to them. Online retailers can locate in cheaper areas rather than expensive high streets. Businesses can also access suppliers worldwide and communicate with stakeholders regardless of location, making proximity to customers and suppliers less important.',
            markingCriteria: {
              breakdown: ['Remote operation capability (1 mark)', 'Global customer reach (1 mark)', 'Access to cheaper locations (1 mark)', 'Reduced importance of proximity (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.4 - Location decisions'
          },
          {
            id: 'bai-q4',
            question: 'Analyze the impact of exchange rate changes on a UK business that imports raw materials from Europe.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'If the pound weakens against the euro, import costs increase as more pounds are needed to buy the same amount of euros. This raises production costs and may force the business to increase prices, potentially reducing competitiveness. However, if the business also exports, a weak pound makes UK goods cheaper abroad, potentially increasing export sales. The business might hedge against currency fluctuations or find domestic suppliers to reduce exposure.',
            markingCriteria: {
              breakdown: ['Effect of weak pound on import costs (2 marks)', 'Impact on production costs and pricing (2 marks)', 'Effect on competitiveness (2 marks)', 'Potential benefits for exports or mitigation strategies (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 1.5 - Global business'
          },
          {
            id: 'bai-q5',
            question: 'Explain how government infrastructure spending can help businesses.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Infrastructure spending improves transport networks, making it easier and cheaper for businesses to move goods and for workers to reach workplaces. Better digital infrastructure like broadband enables businesses to operate more efficiently online. Improved utilities and facilities reduce business operating costs and can attract investment to the area.',
            markingCriteria: {
              breakdown: ['Transport network improvements (1 mark)', 'Digital infrastructure benefits (1 mark)', 'Reduced operating costs (1 mark)', 'Investment attraction (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.6 - Government and business'
          },
          {
            id: 'bai-q6',
            question: 'Assess how technological change can be both an opportunity and a threat for businesses.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Technology creates opportunities by enabling new products, improving efficiency through automation, and opening new markets through e-commerce. It can reduce costs and improve customer service. However, it also threatens businesses that fail to adapt, as competitors may gain advantages. Technology requires significant investment, may make existing products obsolete, and can lead to job losses, creating workforce challenges.',
            markingCriteria: {
              breakdown: ['Opportunities: new products/markets (2 marks)', 'Opportunities: efficiency/cost reduction (2 marks)', 'Threats: competitive disadvantage (2 marks)', 'Threats: investment costs/obsolescence (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 1.7 - External factors'
          },
          {
            id: 'bai-q7',
            question: 'Explain why cash flow problems are a common reason for business failure.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Cash flow problems occur when businesses cannot meet immediate payment obligations despite potentially being profitable on paper. This happens when customers pay slowly while suppliers demand immediate payment, or when businesses invest too heavily in stock. Without sufficient cash, businesses cannot pay wages, rent, or suppliers, leading to operational difficulties and potential bankruptcy even if the business is fundamentally viable.',
            markingCriteria: {
              breakdown: ['Definition of cash flow problems (1 mark)', 'Timing mismatch explanation (2 marks)', 'Impact on business operations (2 marks)', 'Link to business failure (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.8 - Success and failure'
          },
          {
            id: 'bai-q8',
            question: 'Compare the benefits and drawbacks of a franchise business model.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Franchises benefit from established brand recognition, proven business models, and ongoing support from the franchisor, reducing risks of failure. However, franchisees pay ongoing royalties, have limited control over business decisions, and must follow strict operational guidelines. They also face potential conflicts with the franchisor and may be restricted in innovation or expansion.',
            markingCriteria: {
              breakdown: ['Benefits: brand recognition and support (2 marks)', 'Benefits: reduced risk (1 mark)', 'Drawbacks: royalties and restrictions (2 marks)', 'Drawbacks: limited control (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.2 - Types of organisations'
          },
          {
            id: 'bai-q9',
            question: 'Explain how globalisation has affected multinational companies.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Globalisation has enabled multinationals to access new markets worldwide, increasing revenue potential and spreading risks across different economies. They can source materials and labor from cheaper locations, reducing costs. However, they face increased competition from global rivals, must navigate different regulations and cultures, and are exposed to political and economic instability in various countries.',
            markingCriteria: {
              breakdown: ['Access to new markets (1 mark)', 'Cost reduction opportunities (1 mark)', 'Risk spreading (1 mark)', 'Increased competition (1 mark)', 'Regulatory and cultural challenges (1 mark)', 'Political/economic risks (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 1.5 - Global business'
          },
          {
            id: 'bai-q10',
            question: 'Analyze how changes in interest rates affect business decision-making.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Rising interest rates increase borrowing costs, making investment in expansion or new equipment more expensive, potentially delaying growth plans. Businesses with existing loans face higher repayments, reducing cash flow. However, rising rates may indicate economic confidence and increased demand. Falling rates make borrowing cheaper, encouraging investment and expansion, but may signal economic weakness and reduced consumer spending.',
            markingCriteria: {
              breakdown: ['Impact of rising rates on borrowing costs (2 marks)', 'Effect on existing debt and cash flow (2 marks)', 'Impact of falling rates on investment (2 marks)', 'Economic context and implications (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 1.6 - Government and business'
          }
        ]
      },
      {
        id: 'people-in-business',
        name: 'People in Business',
        questions: [
          {
            id: 'pib-q1',
            question: 'Explain why effective communication is important in business.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Effective communication ensures clear understanding of tasks and objectives, reducing errors and improving productivity. It enables coordination between departments and builds good relationships with customers and suppliers. Poor communication can lead to mistakes, delays, and conflict within the organization.',
            markingCriteria: {
              breakdown: ['Clear understanding of tasks (1 mark)', 'Coordination between departments (1 mark)', 'Customer/supplier relationships (1 mark)', 'Consequences of poor communication (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 2.1 - Communication'
          },
          {
            id: 'pib-q2',
            question: 'Compare the advantages of internal and external recruitment.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Internal recruitment is cheaper, faster, and provides career progression for existing employees who already know the company culture. However, it limits the pool of candidates and may create gaps in other positions. External recruitment brings fresh ideas and new skills but is more expensive and time-consuming, requiring longer induction periods.',
            markingCriteria: {
              breakdown: ['Internal advantages: cost and speed (1 mark)', 'Internal advantages: career progression (1 mark)', 'Internal disadvantages: limited pool (1 mark)', 'External advantages: fresh ideas (1 mark)', 'External disadvantages: cost and time (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 2.2 - Recruitment'
          },
          {
            id: 'pib-q3',
            question: 'Explain the benefits of training for both employees and the business.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'For employees, training develops new skills, increases job satisfaction, and improves career prospects. For the business, trained employees are more productive, make fewer mistakes, and provide better customer service. Training also reduces staff turnover and helps the business adapt to new technologies and market changes.',
            markingCriteria: {
              breakdown: ['Employee benefits: skills and satisfaction (2 marks)', 'Employee benefits: career prospects (1 mark)', 'Business benefits: productivity and quality (2 marks)', 'Business benefits: retention and adaptation (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 2.3 - Training'
          },
          {
            id: 'pib-q4',
            question: 'Assess how Maslow\'s hierarchy of needs can be used to motivate employees.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Maslow\'s hierarchy suggests employees are motivated by different needs at different times. Basic needs (physiological and safety) are met through fair wages and job security. Social needs require team-building and good working relationships. Esteem needs are satisfied through recognition and status. Self-actualization involves challenging work and personal growth opportunities. However, the theory assumes all people have the same needs progression, which may not apply universally.',
            markingCriteria: {
              breakdown: ['Basic needs explanation and application (2 marks)', 'Social needs explanation and application (2 marks)', 'Higher needs explanation and application (2 marks)', 'Limitations of the theory (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 2.4 - Motivation and rewards'
          },
          {
            id: 'pib-q5',
            question: 'Compare flat and tall organizational structures.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Flat structures have few management layers, enabling faster communication and decision-making, with wider spans of control giving employees more responsibility. However, managers may become overloaded and career progression is limited. Tall structures provide clear career paths and close supervision but communication is slower and more bureaucratic, potentially demotivating employees.',
            markingCriteria: {
              breakdown: ['Flat structure advantages: speed and responsibility (2 marks)', 'Flat structure disadvantages: overload and progression (2 marks)', 'Tall structure advantages and disadvantages (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 2.5 - Organisation structure'
          },
          {
            id: 'pib-q6',
            question: 'Explain how technology has changed workplace communication.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Technology enables instant communication through email, video calls, and messaging apps, allowing remote working and faster decision-making. It facilitates document sharing and collaboration across different locations. However, it can reduce face-to-face interaction and may create information overload.',
            markingCriteria: {
              breakdown: ['Instant communication capabilities (1 mark)', 'Remote working enablement (1 mark)', 'Document sharing and collaboration (1 mark)', 'Potential drawbacks (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 2.1 - Communication'
          },
          {
            id: 'pib-q7',
            question: 'Analyze the importance of equal opportunities in recruitment.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Equal opportunities ensure businesses recruit the best candidates regardless of gender, race, or age, improving the quality of the workforce. It helps create diverse teams that bring different perspectives and ideas. Legal compliance prevents discrimination lawsuits and reputational damage. However, positive discrimination may be seen as unfair and could create workplace tensions.',
            markingCriteria: {
              breakdown: ['Best candidate selection (1 mark)', 'Diversity benefits (2 marks)', 'Legal compliance (1 mark)', 'Potential challenges (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 2.2 - Recruitment'
          },
          {
            id: 'pib-q8',
            question: 'Explain the difference between on-the-job and off-the-job training.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'On-the-job training takes place in the workplace using actual equipment and processes, making it practical and cost-effective. Off-the-job training occurs away from work, often at training centers or colleges, providing broader knowledge but potentially lacking workplace context.',
            markingCriteria: {
              breakdown: ['On-the-job definition and location (1 mark)', 'On-the-job advantages (1 mark)', 'Off-the-job definition and location (1 mark)', 'Off-the-job characteristics (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 2.3 - Training'
          },
          {
            id: 'pib-q9',
            question: 'Assess the effectiveness of financial rewards in motivating employees.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Financial rewards like bonuses and pay rises can effectively motivate employees by meeting basic needs and providing recognition for good performance. Performance-related pay links effort to reward, encouraging productivity. However, financial motivation may be short-term, and non-financial factors like job satisfaction and recognition can be equally important. Over-reliance on financial rewards may create unhealthy competition and reduce teamwork.',
            markingCriteria: {
              breakdown: ['Benefits of financial rewards (2 marks)', 'Performance-related pay advantages (2 marks)', 'Limitations of financial motivation (2 marks)', 'Non-financial factors importance (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 2.4 - Motivation and rewards'
          },
          {
            id: 'pib-q10',
            question: 'Explain how span of control affects management effectiveness.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'A narrow span of control allows close supervision and detailed guidance, ensuring high quality work and quick problem-solving. However, it can be costly and may demotivate experienced employees. A wide span of control reduces costs and empowers employees but may lead to overloaded managers and inconsistent standards. The optimal span depends on employee experience and task complexity.',
            markingCriteria: {
              breakdown: ['Narrow span advantages (2 marks)', 'Narrow span disadvantages (1 mark)', 'Wide span advantages and disadvantages (2 marks)', 'Factors affecting optimal span (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 2.5 - Organisation structure'
          }
        ]
      },
      {
        id: 'business-finance',
        name: 'Business Finance',
        questions: [
          {
            id: 'bf-q1',
            question: 'Explain why cash flow is more important than profit for business survival.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Cash flow represents actual money available to pay immediate expenses like wages, rent, and suppliers. A business can be profitable on paper but still fail if it cannot pay bills when due. Profit includes sales made on credit that may not be collected for months, while cash flow shows real liquidity. Businesses need cash to operate day-to-day, even if they are ultimately profitable.',
            markingCriteria: {
              breakdown: ['Definition of cash flow vs profit (2 marks)', 'Importance for immediate expenses (2 marks)', 'Credit sales timing issue (1 mark)', 'Link to business survival (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.2 - Cash flow'
          },
          {
            id: 'bf-q2',
            question: 'Compare bank loans and overdrafts as sources of finance.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Bank loans provide large amounts of money for specific purposes over fixed periods with regular repayments and lower interest rates. They require detailed applications and often security. Overdrafts offer flexible short-term finance up to an agreed limit, with interest only on amounts used, but have higher interest rates and can be withdrawn by the bank at short notice.',
            markingCriteria: {
              breakdown: ['Loan characteristics: amount and repayment (2 marks)', 'Loan advantages: lower rates (1 mark)', 'Overdraft characteristics: flexibility (2 marks)', 'Overdraft disadvantages: higher rates/withdrawal (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.1 - Sources of finance'
          },
          {
            id: 'bf-q3',
            question: 'Calculate the break-even point in units. Fixed costs = £15,000, Variable cost per unit = £8, Selling price per unit = £12.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Contribution per unit = Selling price - Variable cost = £12 - £8 = £4. Break-even point = Fixed costs ÷ Contribution per unit = £15,000 ÷ £4 = 3,750 units.',
            markingCriteria: {
              breakdown: ['Calculate contribution per unit = £4 (1 mark)', 'Use break-even formula correctly (1 mark)', 'Correct answer: 3,750 units (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.3 - Costs and break-even'
          },
          {
            id: 'bf-q4',
            question: 'Explain the advantages and disadvantages of using retained profit to finance expansion.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Retained profit requires no interest payments or loss of ownership, making it the cheapest source of finance. It provides flexibility and independence in decision-making. However, using retained profit may reduce dividend payments to shareholders, potentially causing dissatisfaction. It also represents an opportunity cost as the money could have been invested elsewhere for higher returns.',
            markingCriteria: {
              breakdown: ['Advantages: no interest/ownership loss (2 marks)', 'Advantages: flexibility (1 mark)', 'Disadvantages: shareholder expectations (2 marks)', 'Disadvantages: opportunity cost (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.1 - Sources of finance'
          },
          {
            id: 'bf-q5',
            question: 'Calculate the gross profit margin. Sales revenue = £240,000, Cost of goods sold = £144,000.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Gross profit = Sales revenue - Cost of goods sold = £240,000 - £144,000 = £96,000. Gross profit margin = (Gross profit ÷ Sales revenue) × 100 = (£96,000 ÷ £240,000) × 100 = 40%.',
            markingCriteria: {
              breakdown: ['Calculate gross profit = £96,000 (1 mark)', 'Use correct formula for margin (1 mark)', 'Correct answer: 40% (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.5 - Accounts analysis'
          },
          {
            id: 'bf-q6',
            question: 'Analyze how a business could improve its cash flow position.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'A business could improve cash flow by reducing credit periods offered to customers, offering early payment discounts, and chasing overdue debts more aggressively. Negotiating longer payment terms with suppliers delays cash outflows. Reducing stock levels releases tied-up cash, and leasing rather than buying assets preserves cash. However, these strategies may affect customer relationships and operational efficiency.',
            markingCriteria: {
              breakdown: ['Improve cash inflows: reduce credit terms/discounts (2 marks)', 'Delay cash outflows: supplier terms (2 marks)', 'Release tied-up cash: stock/leasing (2 marks)', 'Potential drawbacks and limitations (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 3.2 - Cash flow'
          },
          {
            id: 'bf-q7',
            question: 'Explain why break-even analysis is useful for business planning.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Break-even analysis shows the minimum sales needed to cover all costs, helping businesses set realistic sales targets and pricing strategies. It enables margin of safety calculations, showing how much sales can fall before losses occur. The analysis helps evaluate the impact of cost or price changes and supports decision-making about product viability and expansion plans.',
            markingCriteria: {
              breakdown: ['Minimum sales identification (1 mark)', 'Pricing and target setting (1 mark)', 'Margin of safety calculation (2 marks)', 'Impact evaluation and decision support (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 3.3 - Costs and break-even'
          },
          {
            id: 'bf-q8',
            question: 'Compare current and non-current assets, giving examples of each.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Current assets are short-term assets that can be converted to cash within one year, such as stock, debtors, and cash. Non-current assets are long-term assets held for more than one year to generate revenue, such as buildings, machinery, and vehicles.',
            markingCriteria: {
              breakdown: ['Current assets definition and timeframe (1 mark)', 'Examples of current assets (1 mark)', 'Non-current assets definition and purpose (1 mark)', 'Examples of non-current assets (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.4 - Financial documents'
          },
          {
            id: 'bf-q9',
            question: 'Assess the advantages and disadvantages of crowdfunding as a source of finance.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Crowdfunding provides access to large amounts of money without losing ownership or paying interest, while also serving as market research to validate product demand. It creates publicity and builds a customer base before launch. However, campaigns require significant time and marketing effort, with no guarantee of success. Failed campaigns may damage reputation, and successful ones may reveal business ideas to competitors.',
            markingCriteria: {
              breakdown: ['Advantages: access to finance without ownership loss (2 marks)', 'Advantages: market validation and publicity (2 marks)', 'Disadvantages: time and effort required (2 marks)', 'Disadvantages: failure risks and competition (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 3.1 - Sources of finance'
          },
          {
            id: 'bf-q10',
            question: 'Explain how return on capital employed (ROCE) helps evaluate business performance.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'ROCE measures how efficiently a business uses its capital to generate profits, calculated as (profit before interest and tax ÷ capital employed) × 100. A higher ROCE indicates better performance and efficient use of resources. It enables comparison with previous years, other businesses, and alternative investments. However, ROCE may be distorted by asset age and valuation methods.',
            markingCriteria: {
              breakdown: ['ROCE definition and formula (2 marks)', 'Interpretation of results (1 mark)', 'Comparison capabilities (2 marks)', 'Limitations of ROCE (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 3.5 - Accounts analysis'
          }
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing',
        questions: [
          {
            id: 'm-q1',
            question: 'Explain why market research is important before launching a new product.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Market research identifies customer needs and preferences, ensuring the product meets market demand and reducing the risk of failure. It reveals market size and growth potential, helping businesses assess viability. Research also identifies competitors and their strategies, enabling better positioning. Understanding customer behavior helps set appropriate prices and promotional strategies.',
            markingCriteria: {
              breakdown: ['Identify customer needs (1 mark)', 'Reduce risk of failure (1 mark)', 'Market size and potential (2 marks)', 'Competitor analysis (1 mark)', 'Pricing and promotion insights (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 4.1 - Market research'
          },
          {
            id: 'm-q2',
            question: 'Compare primary and secondary market research methods.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Primary research involves collecting new data directly from consumers through surveys, focus groups, or observations. It provides specific, up-to-date information but is expensive and time-consuming. Secondary research uses existing data from government statistics, industry reports, or competitor websites. It is cheaper and faster but may be outdated or not specifically relevant to the business\'s needs.',
            markingCriteria: {
              breakdown: ['Primary research definition and methods (2 marks)', 'Primary research advantages and disadvantages (2 marks)', 'Secondary research definition and advantages/disadvantages (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.1 - Market research'
          },
          {
            id: 'm-q3',
            question: 'Explain the difference between mass marketing and niche marketing.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Mass marketing targets the whole market with a single product and marketing strategy, aiming for large sales volumes and low costs per unit. Niche marketing focuses on a specific segment with specialized products, typically achieving higher profit margins but lower sales volumes.',
            markingCriteria: {
              breakdown: ['Mass marketing definition and characteristics (2 marks)', 'Niche marketing definition and characteristics (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.2 - The market'
          },
          {
            id: 'm-q4',
            question: 'Analyze how a business might use market segmentation to improve its marketing effectiveness.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Market segmentation divides customers into groups with similar characteristics, enabling targeted marketing strategies. Age segmentation allows different messages for teenagers versus adults. Geographic segmentation enables local advertising and product adaptation. Income segmentation helps set appropriate price points. This targeting improves marketing effectiveness by delivering relevant messages, reducing waste, and increasing customer response rates.',
            markingCriteria: {
              breakdown: ['Definition and purpose of segmentation (2 marks)', 'Examples of segmentation types (2 marks)', 'Benefits of targeted marketing (2 marks)', 'Impact on effectiveness and response rates (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.2 - The market'
          },
          {
            id: 'm-q5',
            question: 'Explain the stages of the product life cycle and their implications for marketing strategy.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Introduction stage requires heavy promotion to build awareness, often with high prices to recover development costs. Growth stage sees expanding distribution and competitive pricing as sales accelerate. Maturity stage needs differentiation and cost control as competition intensifies. Decline stage may require price cuts or product withdrawal. Each stage demands different marketing mix strategies to maximize profitability.',
            markingCriteria: {
              breakdown: ['Introduction stage characteristics and strategy (2 marks)', 'Growth stage characteristics and strategy (2 marks)', 'Maturity stage characteristics and strategy (2 marks)', 'Decline stage characteristics and strategy (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          },
          {
            id: 'm-q6',
            question: 'Compare penetration pricing and price skimming strategies.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Penetration pricing sets low initial prices to gain market share quickly and discourage competitors. It builds customer loyalty but may create low-profit perception. Price skimming starts with high prices for early adopters, then gradually reduces them. It maximizes revenue from willing customers but may attract competitors and limit market growth.',
            markingCriteria: {
              breakdown: ['Penetration pricing definition and aims (2 marks)', 'Penetration pricing advantages and disadvantages (2 marks)', 'Price skimming definition and process (1 mark)', 'Price skimming advantages and disadvantages (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          },
          {
            id: 'm-q7',
            question: 'Assess the advantages and disadvantages of selling through e-commerce versus traditional retail.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'E-commerce offers lower overhead costs, 24/7 availability, and global reach without geographical constraints. Customers can easily compare prices and products. However, it lacks personal service, customers cannot physically examine products, and delivery costs and times may deter purchases. Traditional retail provides immediate gratification, personal service, and sensory experience but has higher costs and limited operating hours.',
            markingCriteria: {
              breakdown: ['E-commerce advantages: costs and accessibility (2 marks)', 'E-commerce disadvantages: service and delivery (2 marks)', 'Traditional retail advantages: immediacy and experience (2 marks)', 'Traditional retail disadvantages: costs and constraints (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          },
          {
            id: 'm-q8',
            question: 'Explain how branding can add value to a product.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Branding creates emotional connections and customer loyalty, allowing higher prices than unbranded alternatives. Strong brands provide quality assurance and reduce perceived risk for customers. They enable easier product launches and extensions, as customers trust the brand name. Branding also creates differentiation in competitive markets.',
            markingCriteria: {
              breakdown: ['Emotional connection and loyalty (2 marks)', 'Quality assurance and risk reduction (2 marks)', 'Product extension benefits (1 mark)', 'Differentiation advantages (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          },
          {
            id: 'm-q9',
            question: 'Analyze how digital marketing has changed promotional strategies.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Digital marketing enables precise targeting based on demographics and behavior, improving efficiency and reducing waste. Social media creates two-way communication and viral potential. Real-time analytics allow immediate campaign adjustments. Costs are often lower than traditional media. However, digital overload may reduce message impact, and technical skills are required. Privacy concerns and ad-blocking also create challenges.',
            markingCriteria: {
              breakdown: ['Targeting precision and efficiency (2 marks)', 'Social media and communication benefits (2 marks)', 'Analytics and cost advantages (2 marks)', 'Challenges and limitations (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          },
          {
            id: 'm-q10',
            question: 'Explain how businesses can use special offers effectively in their promotional mix.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Special offers can boost short-term sales, clear excess stock, and attract new customers to try products. Price discounts encourage bulk purchases, while loyalty schemes retain customers. However, frequent discounting may damage brand image and reduce profit margins. Customers may delay purchases waiting for offers, and competitors may respond with their own promotions.',
            markingCriteria: {
              breakdown: ['Benefits: sales boost and customer attraction (2 marks)', 'Benefits: stock clearance and loyalty (2 marks)', 'Drawbacks: brand image and margins (1 mark)', 'Drawbacks: customer behavior and competition (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 4.3 - Marketing mix'
          }
        ]
      },
      {
        id: 'business-operations',
        name: 'Business Operations',
        questions: [
          {
            id: 'bo-q1',
            question: 'Explain how economies of scale can benefit a growing business.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'As businesses grow, they can spread fixed costs over more units, reducing average costs. Bulk purchasing power enables better deals with suppliers, lowering material costs. Specialization of labor improves efficiency and productivity. Large businesses can also access cheaper finance and invest in more efficient technology and equipment.',
            markingCriteria: {
              breakdown: ['Fixed cost spreading (1 mark)', 'Bulk purchasing advantages (2 marks)', 'Labor specialization benefits (1 mark)', 'Finance and technology access (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.1 - Economies of scale'
          },
          {
            id: 'bo-q2',
            question: 'Compare job production, batch production, and flow production methods.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Job production creates unique, customized products one at a time, offering flexibility but with high costs and skilled labor requirements. Batch production makes groups of identical products, balancing customization with efficiency but creating stock-holding costs. Flow production continuously manufactures standardized products, achieving low unit costs and high output but lacking flexibility and requiring high initial investment.',
            markingCriteria: {
              breakdown: ['Job production characteristics and benefits/costs (3 marks)', 'Batch production characteristics and benefits/costs (3 marks)', 'Flow production characteristics and benefits/costs (3 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.2 - Production'
          },
          {
            id: 'bo-q3',
            question: 'Explain the concept of lean production and its benefits.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Lean production eliminates waste in all forms, including overproduction, waiting times, unnecessary transport, and defects. Just-in-time delivery reduces storage costs and stock obsolescence. Continuous improvement (Kaizen) involves all employees in efficiency improvements. Benefits include reduced costs, improved quality, faster response to customer demands, and higher productivity.',
            markingCriteria: {
              breakdown: ['Waste elimination definition (1 mark)', 'Just-in-time benefits (2 marks)', 'Kaizen concept (1 mark)', 'Overall benefits (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.2 - Production'
          },
          {
            id: 'bo-q4',
            question: 'Analyze the impact of automation on business operations.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Automation increases speed and consistency of production, reducing human error and improving quality. It enables 24/7 operation and reduces long-term labor costs. However, initial investment is high, and technical failures can halt production. Job losses may create industrial relations problems and reduce flexibility for customized production. Maintenance costs and technical expertise requirements also increase.',
            markingCriteria: {
              breakdown: ['Benefits: speed, consistency, and operation (2 marks)', 'Benefits: quality and cost reduction (2 marks)', 'Drawbacks: investment and technical risks (2 marks)', 'Drawbacks: employment and flexibility issues (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.2 - Production'
          },
          {
            id: 'bo-q5',
            question: 'Explain the difference between labor-intensive and capital-intensive production.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Labor-intensive production relies heavily on human workers, with relatively low machinery use, making it flexible but potentially inconsistent. Capital-intensive production uses significant machinery and equipment with fewer workers, achieving consistency and speed but requiring high investment.',
            markingCriteria: {
              breakdown: ['Labor-intensive definition and characteristics (2 marks)', 'Capital-intensive definition and characteristics (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.3 - Factors of production'
          },
          {
            id: 'bo-q6',
            question: 'Assess how a business can improve productivity.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'Productivity can be improved through employee training to develop skills and efficiency, better machinery and technology to speed operations, and improved workplace organization to eliminate bottlenecks. Motivation techniques like performance-related pay can increase effort. However, investment costs may be high, and pushing productivity too hard may reduce quality or employee morale, potentially causing long-term problems.',
            markingCriteria: {
              breakdown: ['Training and skill development (2 marks)', 'Technology and machinery improvements (2 marks)', 'Organization and motivation methods (2 marks)', 'Potential costs and risks (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.2 - Production'
          },
          {
            id: 'bo-q7',
            question: 'Explain how quality control differs from total quality management (TQM).',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Quality control involves checking products at specific stages to identify and remove defects, focusing on detection after problems occur. TQM involves all employees in preventing defects throughout the production process, emphasizing prevention rather than detection. TQM creates a quality culture where everyone is responsible for quality, while quality control relies on specific inspection staff.',
            markingCriteria: {
              breakdown: ['Quality control definition and focus (2 marks)', 'TQM definition and approach (2 marks)', 'Key differences in responsibility and timing (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.4 - Quality'
          },
          {
            id: 'bo-q8',
            question: 'Analyze the advantages and disadvantages of just-in-time (JIT) production.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'JIT reduces storage costs and minimizes stock obsolescence, freeing up cash flow and warehouse space. It encourages supplier partnerships and quick response to demand changes. However, JIT increases vulnerability to supply disruptions and requires reliable suppliers. Any delays can halt production, and bulk purchase discounts are lost. The system also requires excellent communication and coordination.',
            markingCriteria: {
              breakdown: ['Advantages: cost reduction and cash flow (2 marks)', 'Advantages: flexibility and partnerships (2 marks)', 'Disadvantages: supply vulnerability (2 marks)', 'Disadvantages: coordination and discount loss (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.2 - Production'
          },
          {
            id: 'bo-q9',
            question: 'Explain what causes diseconomies of scale and their impact on businesses.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Diseconomies occur when businesses become too large, causing communication problems across multiple layers of management. Coordination becomes difficult, leading to inefficiency and slower decision-making. Employee motivation may decline in large, impersonal organizations. These factors increase average costs per unit despite the larger scale of operation.',
            markingCriteria: {
              breakdown: ['Communication problems (2 marks)', 'Coordination difficulties (2 marks)', 'Motivation issues and cost impact (2 marks)']
            },
            specReference: 'Edexcel IGCSE Business 5.1 - Economies of scale'
          },
          {
            id: 'bo-q10',
            question: 'Assess the role of enterprise as a factor of production.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Enterprise involves combining land, labor, and capital to create goods and services, with entrepreneurs taking risks to organize production. Entrepreneurs identify opportunities, make key decisions, and bear financial risks. They drive innovation and economic growth by creating new businesses and jobs. However, entrepreneurial failure can result in significant personal and financial losses.',
            markingCriteria: {
              breakdown: ['Definition and role of enterprise (2 marks)', 'Risk-taking and decision-making (2 marks)', 'Innovation and economic benefits (1 mark)', 'Potential for failure (1 mark)']
            },
            specReference: 'Edexcel IGCSE Business 5.3 - Factors of production'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    topics: [
      {
        id: 'b1-cell-biology',
        name: 'Cell biology',
        questions: [
          {
            id: 'b1-q1',
            question: 'A student investigated the effect of temperature on enzyme activity. Describe what a graph showing enzyme activity (y-axis) against temperature (x-axis) would look like and explain the shape.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The graph would show activity increasing gradually from low temperatures, reaching a peak at the optimum temperature (around 37°C for human enzymes), then dropping sharply to zero at higher temperatures. The initial increase is due to increased kinetic energy and more enzyme-substrate collisions. The sharp decrease after the optimum is due to enzyme denaturation where the active site changes shape permanently.',
            markingCriteria: {
              breakdown: ['Gradual increase at low temperatures (1 mark)', 'Peak at optimum temperature (1 mark)', 'Sharp decrease at high temperatures (1 mark)', 'Explanation of increased collisions (1 mark)', 'Explanation of denaturation (1 mark)', 'Reference to active site changes shape permanently (1 mark)']
            },
            specReference: 'B1.1'
          },
          {
            id: 'b1-q2',
            question: 'Describe the trend you would expect to see in a graph showing the rate of photosynthesis against light intensity, and explain why this trend occurs.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The graph would show the rate of photosynthesis increasing linearly at first, then levelling off to become constant at high light intensities. At low light intensities, light is the limiting factor so increasing light increases the rate. At high intensities, other factors like CO2 concentration or temperature become limiting, so further increases in light have no effect.',
            markingCriteria: {
              breakdown: ['Linear increase initially (1 mark)', 'Levels off at high intensities (1 mark)', 'Light is limiting factor at low intensities (1 mark)', 'Other factors become limiting at high intensities (1 mark)']
            },
            specReference: 'B1.2'
          },
          {
            id: 'b1-q3',
            question: 'What is the function of the ribosomes in a cell?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Protein synthesis',
            markingCriteria: {
              breakdown: ['Protein synthesis (1 mark)']
            },
            specReference: 'B1.3'
          },
          {
            id: 'b1-q4',
            question: 'Name two adaptations of a sperm cell.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Long tail for swimming and many mitochondria for energy',
            markingCriteria: {
              breakdown: ['Long tail for swimming (1 mark)', 'Many mitochondria for energy (1 mark)']
            },
            specReference: 'B1.4'
          },
          {
            id: 'b1-q5',
            question: 'Describe the stages of the cell cycle and explain why cell division is important for organisms.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Cell cycle stages: G1 (growth), S (DNA synthesis), G2 (growth and preparation), M (mitosis and cytokinesis). Importance: growth of organism, repair of damaged tissues, replacement of worn-out cells, asexual reproduction in some organisms.',
            markingCriteria: {
              breakdown: ['G1 phase - growth (1 mark)', 'S phase - DNA synthesis (1 mark)', 'G2 phase - preparation for division (1 mark)', 'M phase - mitosis and cytokinesis (1 mark)', 'Importance: growth/repair/replacement (1 mark)', 'Asexual reproduction (1 mark)']
            },
            specReference: 'B1.5'
          },
          {
            id: 'b1-q6',
            question: 'What is the function of the nucleus in a cell?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The nucleus controls all cellular activities and contains the genetic material (DNA) which carries instructions for protein synthesis.',
            markingCriteria: {
              breakdown: ['Controls cellular activities (1 mark)', 'Contains genetic material/DNA (1 mark)']
            },
            specReference: 'B1.6'
          },
          {
            id: 'b1-q7',
            question: 'Explain how the structure of the small intestine is adapted for absorption.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The small intestine has villi and microvilli which increase surface area for absorption. It has a good blood supply to maintain concentration gradients. The walls are thin (one cell thick) for efficient diffusion. It is long to provide more time for absorption.',
            markingCriteria: {
              breakdown: ['Villi/microvilli increase surface area (1 mark)', 'Good blood supply maintains gradients (1 mark)', 'Thin walls for efficient diffusion (1 mark)', 'Long length provides more time (1 mark)']
            },
            specReference: 'B1.7'
          },
          {
            id: 'b1-q8',
            question: 'What is osmosis?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane.',
            markingCriteria: {
              breakdown: ['Movement of water molecules (1 mark)', 'From high to low water potential (1 mark)', 'Through partially permeable membrane (1 mark)']
            },
            specReference: 'B1.8'
          },
          {
            id: 'b1-q9',
            question: 'Name two factors that affect the rate of diffusion.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Temperature and concentration gradient',
            markingCriteria: {
              breakdown: ['Temperature (1 mark)', 'Concentration gradient (1 mark)']
            },
            specReference: 'B1.9'
          },
          {
            id: 'b1-q10',
            question: 'What is active transport and how does it differ from diffusion?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Active transport is the movement of substances against a concentration gradient using energy from ATP. Unlike diffusion, it requires energy and can move substances from low to high concentration.',
            markingCriteria: {
              breakdown: ['Movement against concentration gradient (1 mark)', 'Requires energy/ATP (1 mark)', 'Differs from diffusion - needs energy (1 mark)', 'Can move from low to high concentration (1 mark)']
            },
            specReference: 'B1.10'
          }
        ]
      },
      {
        id: 'b2-organisation',
        name: 'Organisation',
        questions: [
          {
            id: 'b2-q1',
            question: 'A student measured heart rate during different levels of exercise. Describe what a graph showing heart rate (y-axis) against exercise intensity (x-axis) would show and explain why.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The graph would show heart rate increasing steadily as exercise intensity increases, starting from resting heart rate and rising to maximum heart rate during intense exercise. Heart rate increases because muscles need more oxygen and glucose during exercise. The heart pumps faster to deliver more blood containing oxygen and nutrients to working muscles, and to remove waste products like carbon dioxide more quickly.',
            markingCriteria: {
              breakdown: ['Heart rate increases with exercise intensity (1 mark)', 'Starts from resting rate (1 mark)', 'Reaches maximum during intense exercise (1 mark)', 'Muscles need more oxygen and glucose (1 mark)', 'Heart pumps faster to deliver blood (1 mark)', 'Removes waste products more quickly (1 mark)']
            },
            specReference: 'B2.1'
          },
          {
            id: 'b2-q2',
            question: 'Explain what a graph showing the breakdown of starch by amylase over time would look like and why.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The graph would show starch concentration decreasing over time while glucose concentration increases. Initially the rate of breakdown is rapid, then slows down as substrate becomes limited. The graph would level off when all starch is converted or when the enzyme becomes saturated.',
            markingCriteria: {
              breakdown: ['Starch decreases over time (1 mark)', 'Glucose increases over time (1 mark)', 'Initial rapid rate then slowing (1 mark)', 'Levels off due to substrate limitation or saturation (1 mark)']
            },
            specReference: 'B2.2'
          },
          {
            id: 'b2-q3',
            question: 'Name the enzyme that breaks down proteins.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Protease',
            markingCriteria: {
              breakdown: ['Protease (1 mark)']
            },
            specReference: 'B2.3'
          },
          {
            id: 'b2-q4',
            question: 'What is the role of bile in digestion?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase enzyme action.',
            markingCriteria: {
              breakdown: ['Emulsifies fats (1 mark)', 'Increases surface area for enzyme action (1 mark)']
            },
            specReference: 'B2.4'
          },
          {
            id: 'b2-q5',
            question: 'Describe how enzymes work, including the effect of temperature and pH.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Enzymes are biological catalysts with active sites complementary to substrate shape. They lower activation energy for reactions. Temperature increases enzyme activity until optimum, then denaturing occurs. pH affects enzyme shape - too high or low denatures the active site. Each enzyme has specific optimum temperature and pH.',
            markingCriteria: {
              breakdown: ['Enzymes are biological catalysts (1 mark)', 'Active site complementary to substrate (1 mark)', 'Lower activation energy (1 mark)', 'Temperature increases activity to optimum then denatures (1 mark)', 'pH affects shape/active site (1 mark)', 'Each enzyme has specific optimum (1 mark)']
            },
            specReference: 'B2.5'
          },
          {
            id: 'b2-q6',
            question: 'Describe the structure and function of xylem tissue in plants.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Xylem is composed of dead cells with thick walls strengthened by lignin. It transports water and mineral salts from roots to leaves and provides structural support to the plant.',
            markingCriteria: {
              breakdown: ['Dead cells with thick walls (1 mark)', 'Strengthened by lignin (1 mark)', 'Transports water and minerals (1 mark)', 'Provides structural support (1 mark)']
            },
            specReference: 'B2.6'
          },
          {
            id: 'b2-q7',
            question: 'What is the difference between arteries and veins?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Arteries carry blood away from the heart at high pressure and have thick muscular walls. Veins carry blood back to the heart at low pressure and have thin walls with valves.',
            markingCriteria: {
              breakdown: ['Arteries carry blood away from heart (1 mark)', 'Arteries have thick muscular walls (1 mark)', 'Veins carry blood to heart (1 mark)', 'Veins have thin walls with valves (1 mark)']
            },
            specReference: 'B2.7'
          },
          {
            id: 'b2-q8',
            question: 'Explain the function of phloem tissue.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Phloem transports sugars (mainly sucrose) produced by photosynthesis from leaves to other parts of the plant where they are needed for growth or storage.',
            markingCriteria: {
              breakdown: ['Transports sugars/sucrose (1 mark)', 'From leaves to other parts (1 mark)', 'For growth or storage (1 mark)']
            },
            specReference: 'B2.8'
          },
          {
            id: 'b2-q9',
            question: 'Describe the function of red blood cells.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Red blood cells transport oxygen from the lungs to body tissues. They contain hemoglobin which binds to oxygen and have no nucleus to maximize space for hemoglobin.',
            markingCriteria: {
              breakdown: ['Transport oxygen (1 mark)', 'Contain hemoglobin (1 mark)', 'No nucleus to maximize hemoglobin space (1 mark)']
            },
            specReference: 'B2.9'
          },
          {
            id: 'b2-q10',
            question: 'Explain how the lungs are adapted for gas exchange.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The lungs have millions of alveoli which provide a large surface area. The alveoli walls are one cell thick for efficient diffusion. They have a rich blood supply to maintain concentration gradients. The moist lining dissolves gases.',
            markingCriteria: {
              breakdown: ['Large surface area from alveoli (1 mark)', 'Walls one cell thick (1 mark)', 'Rich blood supply maintains gradients (1 mark)', 'Moist lining dissolves gases (1 mark)']
            },
            specReference: 'B2.10'
          }
        ]
      },
      {
        id: 'b3-infection-response',
        name: 'Infection and response',
        questions: [
          {
            id: 'b3-q1',
            question: 'What is a pathogen?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A pathogen is a microorganism that causes disease in plants or animals.',
            markingCriteria: {
              breakdown: ['Microorganism (1 mark)', 'Causes disease (1 mark)']
            },
            specReference: 'B3.1'
          },
          {
            id: 'b3-q2',
            question: 'Name four types of pathogens.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Bacteria, viruses, fungi, and protists',
            markingCriteria: {
              breakdown: ['Bacteria (1 mark)', 'Viruses (1 mark)', 'Fungi (1 mark)', 'Protists (1 mark)']
            },
            specReference: 'B3.2'
          },
          {
            id: 'b3-q3',
            question: 'Explain how white blood cells defend the body against pathogens.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'White blood cells can engulf and digest pathogens (phagocytosis), produce antibodies that are specific to antigens on pathogens, and produce antitoxins to neutralize toxins produced by bacteria.',
            markingCriteria: {
              breakdown: ['Phagocytosis - engulf and digest (1 mark)', 'Produce specific antibodies (1 mark)', 'Antibodies bind to antigens (1 mark)', 'Produce antitoxins (1 mark)']
            },
            specReference: 'B3.3'
          },
          {
            id: 'b3-q4',
            question: 'What is vaccination and how does it work?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Vaccination involves introducing dead or inactive pathogens into the body. This stimulates white blood cells to produce antibodies and memory cells. If the same pathogen enters later, memory cells quickly produce antibodies for rapid response.',
            markingCriteria: {
              breakdown: ['Introduction of dead/inactive pathogens (1 mark)', 'Stimulates antibody production (1 mark)', 'Memory cells formed (1 mark)', 'Rapid response on re-infection (1 mark)']
            },
            specReference: 'B3.4'
          },
          {
            id: 'b3-q5',
            question: 'Name three ways pathogens can be transmitted.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Direct contact, airborne droplets, and contaminated food/water',
            markingCriteria: {
              breakdown: ['Direct contact (1 mark)', 'Airborne droplets (1 mark)', 'Contaminated food/water (1 mark)']
            },
            specReference: 'B3.5'
          },
          {
            id: 'b3-q6',
            question: 'Explain what antibiotics are and why they cannot treat viral infections.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Antibiotics are drugs that kill bacteria or stop their growth. They cannot treat viral infections because viruses reproduce inside host cells and antibiotics cannot penetrate these cells effectively.',
            markingCriteria: {
              breakdown: ['Antibiotics kill/stop bacteria growth (1 mark)', 'Cannot treat viruses (1 mark)', 'Viruses reproduce inside host cells (1 mark)']
            },
            specReference: 'B3.6'
          },
          {
            id: 'b3-q7',
            question: 'Describe the body\'s first line of defense against pathogens.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'The skin acts as a physical barrier. Stomach acid kills pathogens in food. Tears and saliva contain enzymes that kill bacteria. Mucus in airways traps pathogens.',
            markingCriteria: {
              breakdown: ['Skin as physical barrier (1 mark)', 'Stomach acid kills pathogens (1 mark)', 'Tears/saliva contain enzymes (1 mark)', 'Mucus traps pathogens (1 mark)']
            },
            specReference: 'B3.7'
          },
          {
            id: 'b3-q8',
            question: 'What is meant by antibiotic resistance?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Antibiotic resistance occurs when bacteria evolve to survive exposure to antibiotics. This happens through natural selection when antibiotics are overused or misused.',
            markingCriteria: {
              breakdown: ['Bacteria survive antibiotic exposure (1 mark)', 'Evolution/natural selection (1 mark)', 'Due to overuse/misuse of antibiotics (1 mark)']
            },
            specReference: 'B3.8'
          },
          {
            id: 'b3-q9',
            question: 'Explain the difference between communicable and non-communicable diseases.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Communicable diseases are caused by pathogens and can be transmitted from person to person. Non-communicable diseases are not caused by pathogens and cannot be transmitted between people.',
            markingCriteria: {
              breakdown: ['Communicable caused by pathogens (1 mark)', 'Communicable can be transmitted (1 mark)', 'Non-communicable cannot be transmitted (1 mark)']
            },
            specReference: 'B3.9'
          },
          {
            id: 'b3-q10',
            question: 'Describe how drug testing is carried out before new medicines are approved.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'First, drugs are tested in laboratory on cells and tissues. Then tested on animals to check safety and effectiveness. Finally, clinical trials on human volunteers test safety, dosage, and effectiveness before approval.',
            markingCriteria: {
              breakdown: ['Laboratory testing on cells/tissues (1 mark)', 'Animal testing for safety/effectiveness (1 mark)', 'Human clinical trials (1 mark)', 'Test safety, dosage, and effectiveness (1 mark)']
            },
            specReference: 'B3.10'
          },
          {
            id: 'b3-q11',
            question: 'Describe what a graph showing antibody concentration in the blood over time during primary and secondary immune responses would look like.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'During primary response, antibody concentration rises slowly after initial infection, peaks at a low level, then decreases. During secondary response (upon re-exposure), antibody concentration rises much more rapidly, reaches a much higher peak, and remains elevated for longer. The secondary response shows the effect of memory cells producing antibodies faster and in greater quantities.',
            markingCriteria: {
              breakdown: ['Primary response - slow initial rise (1 mark)', 'Primary response - low peak then decrease (1 mark)', 'Secondary response - rapid rise (1 mark)', 'Secondary response - higher peak (1 mark)', 'Secondary response - remains elevated longer (1 mark)', 'Memory cells explanation (1 mark)']
            },
            specReference: 'B3.11'
          }
        ]
      },
      {
        id: 'b4-bioenergetics',
        name: 'Bioenergetics',
        questions: [
          {
            id: 'b4-q1',
            question: 'A student investigated the effect of light intensity on the rate of photosynthesis by counting oxygen bubbles. Describe what the results would show on a graph and explain the pattern.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'The graph would show the rate of photosynthesis (oxygen production) increasing linearly with light intensity initially, then levelling off at higher intensities. At low light intensities, light is the limiting factor so increasing light increases the rate proportionally. At high intensities, other factors like CO2 concentration or temperature become limiting, so further increases in light intensity have no effect on the rate.',
            markingCriteria: {
              breakdown: ['Linear increase initially (1 mark)', 'Levels off at high intensities (1 mark)', 'Light is limiting factor at low intensities (1 mark)', 'Proportional increase when light limiting (1 mark)', 'Other factors become limiting at high intensities (1 mark)', 'No effect when other factors limiting (1 mark)']
            },
            specReference: 'B4.1'
          },
          {
            id: 'b4-q2',
            question: 'Describe how you would expect oxygen production during photosynthesis to change over a 24-hour period and explain why.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Oxygen production would be zero during darkness (night), start increasing at dawn, peak during midday when light intensity is highest, then decrease through the afternoon and stop at dusk. This pattern occurs because photosynthesis requires light energy, so oxygen production directly follows the availability of light throughout the day.',
            markingCriteria: {
              breakdown: ['Zero production during darkness (1 mark)', 'Increases from dawn, peaks at midday (1 mark)', 'Decreases through afternoon, stops at dusk (1 mark)', 'Pattern follows light availability (1 mark)']
            },
            specReference: 'B4.2'
          },
          {
            id: 'b4-q3',
            question: 'Write the word equation for photosynthesis.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Carbon dioxide + Water → Glucose + Oxygen (in the presence of light and chlorophyll)',
            markingCriteria: {
              breakdown: ['Correct reactants and products (1 mark)', 'Correct conditions mentioned (1 mark)']
            },
            specReference: 'B4.3'
          },
          {
            id: 'b4-q4',
            question: 'Name the factors that can limit the rate of photosynthesis.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Light intensity, carbon dioxide concentration, and temperature',
            markingCriteria: {
              breakdown: ['Light intensity (1 mark)', 'Carbon dioxide concentration (1 mark)', 'Temperature (1 mark)']
            },
            specReference: 'B4.4'
          },
          {
            id: 'b4-q5',
            question: 'Explain why photosynthesis is important for life on Earth.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Photosynthesis produces oxygen for respiration, removes carbon dioxide from the atmosphere, and produces glucose which is the basis of food chains.',
            markingCriteria: {
              breakdown: ['Produces oxygen (1 mark)', 'Removes carbon dioxide (1 mark)', 'Produces glucose/basis of food chains (1 mark)']
            },
            specReference: 'B4.5'
          },
          {
            id: 'b4-q6',
            question: 'Write the word equation for aerobic respiration.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP)',
            markingCriteria: {
              breakdown: ['Correct reactants and products (1 mark)', 'Energy/ATP mentioned (1 mark)']
            },
            specReference: 'B4.6'
          },
          {
            id: 'b4-q7',
            question: 'Explain the difference between aerobic and anaerobic respiration.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Aerobic respiration uses oxygen and produces carbon dioxide, water, and lots of ATP. Anaerobic respiration occurs without oxygen, produces less ATP, and forms lactic acid in animals or ethanol in plants/yeast.',
            markingCriteria: {
              breakdown: ['Aerobic uses oxygen (1 mark)', 'Aerobic produces more ATP (1 mark)', 'Anaerobic without oxygen (1 mark)', 'Anaerobic produces lactic acid/ethanol (1 mark)']
            },
            specReference: 'B4.7'
          },
          {
            id: 'b4-q8',
            question: 'Where does photosynthesis occur in plant cells?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Chloroplasts',
            markingCriteria: {
              breakdown: ['Chloroplasts (1 mark)']
            },
            specReference: 'B4.8'
          },
          {
            id: 'b4-q9',
            question: 'How do plants use the glucose produced during photosynthesis?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Plants use glucose for respiration to release energy, convert it to starch for storage, use it to make cellulose for cell walls, and combine it with nitrates to make amino acids for proteins.',
            markingCriteria: {
              breakdown: ['Respiration for energy (1 mark)', 'Convert to starch for storage (1 mark)', 'Make cellulose for cell walls (1 mark)', 'Make amino acids for proteins (1 mark)']
            },
            specReference: 'B4.9'
          },
          {
            id: 'b4-q10',
            question: 'Explain how the leaf is adapted for photosynthesis.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Leaves are broad and flat for maximum light absorption. They contain chloroplasts with chlorophyll to absorb light. Stomata allow gas exchange. Veins transport water and remove glucose. Thin structure allows light to reach all cells.',
            markingCriteria: {
              breakdown: ['Broad and flat for light absorption (1 mark)', 'Chloroplasts contain chlorophyll (1 mark)', 'Stomata for gas exchange (1 mark)', 'Veins for transport (1 mark)', 'Thin for light penetration (1 mark)']
            },
            specReference: 'B4.10'
          }
        ]
      },
      {
        id: 'b5-homeostasis',
        name: 'Homeostasis and response',
        questions: [
          {
            id: 'b5-q1',
            question: 'What is homeostasis?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Homeostasis is the maintenance of a constant internal environment despite changes in external conditions.',
            markingCriteria: {
              breakdown: ['Maintenance of constant internal environment (1 mark)', 'Despite external changes (1 mark)']
            },
            specReference: 'B5.1'
          },
          {
            id: 'b5-q2',
            question: 'Name three conditions in the body that need to be controlled.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Body temperature, blood glucose concentration, and water content',
            markingCriteria: {
              breakdown: ['Body temperature (1 mark)', 'Blood glucose concentration (1 mark)', 'Water content (1 mark)']
            },
            specReference: 'B5.2'
          },
          {
            id: 'b5-q3',
            question: 'Describe the structure of the nervous system.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The nervous system consists of the central nervous system (brain and spinal cord) and the peripheral nervous system (all other nerves).',
            markingCriteria: {
              breakdown: ['Central nervous system (1 mark)', 'Brain and spinal cord (1 mark)', 'Peripheral nervous system/other nerves (1 mark)']
            },
            specReference: 'B5.3'
          },
          {
            id: 'b5-q4',
            question: 'Explain what happens in a reflex action.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'A stimulus is detected by a receptor. An impulse travels along a sensory neuron to the spinal cord. A relay neuron connects to a motor neuron. The motor neuron carries the impulse to an effector (muscle) which responds.',
            markingCriteria: {
              breakdown: ['Stimulus detected by receptor (1 mark)', 'Sensory neuron to spinal cord (1 mark)', 'Relay neuron connects to motor neuron (1 mark)', 'Motor neuron to effector/response (1 mark)']
            },
            specReference: 'B5.4'
          },
          {
            id: 'b5-q5',
            question: 'What is the function of insulin in the body?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Insulin is a hormone produced by the pancreas that causes liver and muscle cells to take up glucose from the blood, lowering blood glucose concentration.',
            markingCriteria: {
              breakdown: ['Hormone produced by pancreas (1 mark)', 'Causes cells to take up glucose (1 mark)', 'Lowers blood glucose concentration (1 mark)']
            },
            specReference: 'B5.5'
          },
          {
            id: 'b5-q6',
            question: 'Describe how body temperature is controlled when it gets too hot.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sweating increases to cool the body through evaporation. Blood vessels near the skin surface dilate (vasodilation) to increase heat loss. Metabolic rate decreases. Hair follicles relax so hairs lie flat.',
            markingCriteria: {
              breakdown: ['Increased sweating/evaporation (1 mark)', 'Vasodilation increases heat loss (1 mark)', 'Decreased metabolic rate (1 mark)', 'Hairs lie flat (1 mark)']
            },
            specReference: 'B5.6'
          },
          {
            id: 'b5-q7',
            question: 'What is Type 1 diabetes?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Type 1 diabetes is a condition where the pancreas does not produce enough insulin, resulting in high blood glucose levels that cannot be controlled naturally.',
            markingCriteria: {
              breakdown: ['Pancreas does not produce enough insulin (1 mark)', 'High blood glucose levels (1 mark)', 'Cannot be controlled naturally (1 mark)']
            },
            specReference: 'B5.7'
          },
          {
            id: 'b5-q8',
            question: 'Name the parts of the eye and their functions.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Cornea - refracts light. Iris - controls amount of light entering. Lens - focuses light on retina. Retina - contains light-sensitive cells. Optic nerve - carries impulses to brain. Pupil - allows light to enter.',
            markingCriteria: {
              breakdown: ['Cornea refracts light (1 mark)', 'Iris controls light entry (1 mark)', 'Lens focuses light (1 mark)', 'Retina has light-sensitive cells (1 mark)', 'Optic nerve carries impulses (1 mark)', 'Pupil allows light entry (1 mark)']
            },
            specReference: 'B5.8'
          },
          {
            id: 'b5-q9',
            question: 'Explain how the kidneys control water content in the body.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The kidneys filter blood and reabsorb useful substances. ADH hormone controls water reabsorption. When dehydrated, more ADH is released, causing more water reabsorption and concentrated urine. When hydrated, less ADH is released, producing dilute urine.',
            markingCriteria: {
              breakdown: ['Kidneys filter blood (1 mark)', 'ADH controls water reabsorption (1 mark)', 'Dehydration increases ADH/concentrated urine (1 mark)', 'Hydration decreases ADH/dilute urine (1 mark)']
            },
            specReference: 'B5.9'
          },
          {
            id: 'b5-q10',
            question: 'Describe the differences between hormonal and nervous responses.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Nervous responses are fast, short-lived, and travel as electrical impulses along neurons. Hormonal responses are slower, longer-lasting, and travel as chemicals in the bloodstream.',
            markingCriteria: {
              breakdown: ['Nervous responses are fast (1 mark)', 'Nervous responses are short-lived (1 mark)', 'Hormonal responses are slower (1 mark)', 'Hormonal responses are longer-lasting (1 mark)']
            },
            specReference: 'B5.10'
          }
        ]
      },
      {
        id: 'b6-inheritance',
        name: 'Inheritance, variation and evolution',
        questions: [
          {
            id: 'b6-q1',
            question: 'What is DNA?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'DNA is the genetic material that contains coded information for making proteins and determining inherited characteristics.',
            markingCriteria: {
              breakdown: ['Genetic material (1 mark)', 'Contains coded information for proteins/characteristics (1 mark)']
            },
            specReference: 'B6.1'
          },
          {
            id: 'b6-q2',
            question: 'Define the terms "gene" and "allele".',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'A gene is a section of DNA that codes for a specific protein. An allele is a different version of the same gene.',
            markingCriteria: {
              breakdown: ['Gene is DNA section coding for protein (1 mark)', 'Allele is different version of gene (1 mark)']
            },
            specReference: 'B6.2'
          },
          {
            id: 'b6-q3',
            question: 'Explain the difference between dominant and recessive alleles.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Dominant alleles are expressed when present (only one copy needed). Recessive alleles are only expressed when two copies are present.',
            markingCriteria: {
              breakdown: ['Dominant expressed with one copy (1 mark)', 'Recessive needs two copies (1 mark)']
            },
            specReference: 'B6.3'
          },
          {
            id: 'b6-q4',
            question: 'What is meant by genotype and phenotype?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Genotype is the genetic makeup (alleles present). Phenotype is the observable characteristics expressed.',
            markingCriteria: {
              breakdown: ['Genotype is genetic makeup/alleles (1 mark)', 'Phenotype is observable characteristics (1 mark)']
            },
            specReference: 'B6.4'
          },
          {
            id: 'b6-q5',
            question: 'Explain what causes variation in organisms.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Variation is caused by genetic factors (inherited from parents through DNA) and environmental factors (such as diet, exercise, climate). Most characteristics are influenced by both genetic and environmental factors.',
            markingCriteria: {
              breakdown: ['Genetic factors from parents (1 mark)', 'Environmental factors (1 mark)', 'Examples of environmental factors (1 mark)', 'Most characteristics influenced by both (1 mark)']
            },
            specReference: 'B6.5'
          },
          {
            id: 'b6-q6',
            question: 'Describe the process of natural selection.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Individuals in a population show variation. There is competition for resources. Those with advantageous characteristics are more likely to survive and reproduce. They pass on their advantageous alleles to offspring.',
            markingCriteria: {
              breakdown: ['Variation in population (1 mark)', 'Competition for resources (1 mark)', 'Advantageous characteristics aid survival (1 mark)', 'Advantageous alleles passed to offspring (1 mark)']
            },
            specReference: 'B6.6'
          },
          {
            id: 'b6-q7',
            question: 'What is evolution?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Evolution is the gradual change in the characteristics of a species over many generations.',
            markingCriteria: {
              breakdown: ['Gradual change in characteristics (1 mark)', 'Over many generations (1 mark)']
            },
            specReference: 'B6.7'
          },
          {
            id: 'b6-q8',
            question: 'Explain how mutations can lead to evolution.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Mutations create new alleles. If a mutation gives an advantage, natural selection will favor it. Over time, the advantageous allele becomes more common in the population.',
            markingCriteria: {
              breakdown: ['Mutations create new alleles (1 mark)', 'Advantageous mutations favored by selection (1 mark)', 'Advantageous alleles become more common (1 mark)']
            },
            specReference: 'B6.8'
          },
          {
            id: 'b6-q9',
            question: 'What is selective breeding?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Selective breeding is when humans choose organisms with desired characteristics to breed together to produce offspring with those characteristics.',
            markingCriteria: {
              breakdown: ['Humans choose organisms (1 mark)', 'Based on desired characteristics (1 mark)', 'To produce offspring with those characteristics (1 mark)']
            },
            specReference: 'B6.9'
          },
          {
            id: 'b6-q10',
            question: 'Describe how genetic engineering works.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Genetic engineering involves cutting out a gene from one organism using enzymes. The gene is inserted into the DNA of another organism. The modified organism can then produce the desired protein.',
            markingCriteria: {
              breakdown: ['Gene cut out using enzymes (1 mark)', 'Gene inserted into another organism (1 mark)', 'Modified organism produces desired protein (1 mark)', 'Clear understanding of process (1 mark)']
            },
            specReference: 'B6.10'
          }
        ]
      },
      {
        id: 'b7-ecology',
        name: 'Ecology',
        questions: [
          {
            id: 'b7-q1',
            question: 'Define the term "ecosystem".',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An ecosystem is the interaction of living organisms with each other and their physical environment.',
            markingCriteria: {
              breakdown: ['Interaction of living organisms (1 mark)', 'With each other and physical environment (1 mark)']
            },
            specReference: 'B7.1'
          },
          {
            id: 'b7-q2',
            question: 'Explain what is meant by a food chain.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A food chain shows the transfer of energy from one organism to another through feeding relationships.',
            markingCriteria: {
              breakdown: ['Transfer of energy (1 mark)', 'Through feeding relationships (1 mark)']
            },
            specReference: 'B7.2'
          },
          {
            id: 'b7-q3',
            question: 'Name the different trophic levels in a food chain.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Producer, primary consumer, secondary consumer, tertiary consumer',
            markingCriteria: {
              breakdown: ['Producer (1 mark)', 'Primary consumer (1 mark)', 'Secondary consumer (1 mark)', 'Tertiary consumer (1 mark)']
            },
            specReference: 'B7.3'
          },
          {
            id: 'b7-q4',
            question: 'Explain why energy transfer between trophic levels is inefficient.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Energy is lost as heat through respiration, some parts of organisms are not eaten, some food is not digested and is egested, and energy is used for movement and other life processes.',
            markingCriteria: {
              breakdown: ['Energy lost as heat through respiration (1 mark)', 'Some parts not eaten (1 mark)', 'Some food not digested (1 mark)', 'Energy used for movement/life processes (1 mark)']
            },
            specReference: 'B7.4'
          },
          {
            id: 'b7-q5',
            question: 'What is the role of decomposers in an ecosystem?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Decomposers break down dead organisms and waste products, returning nutrients to the soil, and recycling materials in the ecosystem.',
            markingCriteria: {
              breakdown: ['Break down dead organisms and waste (1 mark)', 'Return nutrients to soil (1 mark)', 'Recycle materials in ecosystem (1 mark)']
            },
            specReference: 'B7.5'
          },
          {
            id: 'b7-q6',
            question: 'Describe the carbon cycle.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Plants absorb CO2 from atmosphere during photosynthesis. Animals eat plants and release CO2 through respiration. Decomposers break down dead organisms releasing CO2. Burning fossil fuels releases CO2. Ocean dissolution and release of CO2.',
            markingCriteria: {
              breakdown: ['Plants absorb CO2 in photosynthesis (1 mark)', 'Animals release CO2 through respiration (1 mark)', 'Decomposers release CO2 (1 mark)', 'Burning fossil fuels releases CO2 (1 mark)', 'Ocean processes (1 mark)']
            },
            specReference: 'B7.6'
          },
          {
            id: 'b7-q7',
            question: 'Explain how human activities affect biodiversity.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Deforestation destroys habitats. Pollution kills organisms. Overfishing reduces fish populations. Climate change alters ecosystems and species distribution.',
            markingCriteria: {
              breakdown: ['Deforestation destroys habitats (1 mark)', 'Pollution kills organisms (1 mark)', 'Overfishing reduces populations (1 mark)', 'Climate change alters ecosystems (1 mark)']
            },
            specReference: 'B7.7'
          },
          {
            id: 'b7-q8',
            question: 'What is meant by biological control?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Biological control is using living organisms to control pest populations instead of using chemical pesticides.',
            markingCriteria: {
              breakdown: ['Using living organisms (1 mark)', 'To control pest populations (1 mark)', 'Instead of chemical pesticides (1 mark)']
            },
            specReference: 'B7.8'
          },
          {
            id: 'b7-q9',
            question: 'Describe methods used to estimate population size.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Quadrats are used to sample small areas and estimate population density. Mark-recapture method involves marking individuals, releasing them, then recapturing to estimate total population. Random sampling ensures representative results.',
            markingCriteria: {
              breakdown: ['Quadrats sample small areas (1 mark)', 'Mark-recapture method (1 mark)', 'Marking and recapturing individuals (1 mark)', 'Random sampling for representative results (1 mark)']
            },
            specReference: 'B7.9'
          },
          {
            id: 'b7-q10',
            question: 'Explain the greenhouse effect and its consequences.',
            marks: 5,
            difficulty: 'hard',
            modelAnswer: 'Greenhouse gases in the atmosphere trap heat from the sun. This causes global warming and climate change. Consequences include melting ice caps, rising sea levels, changing weather patterns, and species extinction.',
            markingCriteria: {
              breakdown: ['Greenhouse gases trap heat (1 mark)', 'Causes global warming (1 mark)', 'Melting ice caps/rising sea levels (1 mark)', 'Changing weather patterns (1 mark)', 'Species extinction (1 mark)']
            },
            specReference: 'B7.10'
          }
        ]
      },
      {
        id: 'b8-key-ideas',
        name: 'Key ideas',
        questions: [
          {
            id: 'b8-q1',
            question: 'Explain the concept of surface area to volume ratio and its importance in biology.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Surface area to volume ratio compares the surface area of an object to its volume. As size increases, volume increases faster than surface area, so the ratio decreases. This is important for processes like gas exchange and heat loss which depend on surface area.',
            markingCriteria: {
              breakdown: ['Definition of SA:V ratio (1 mark)', 'Volume increases faster than surface area (1 mark)', 'Ratio decreases as size increases (1 mark)', 'Important for gas exchange/heat loss (1 mark)']
            },
            specReference: 'B8.1'
          },
          {
            id: 'b8-q2',
            question: 'Describe the relationship between structure and function in biological systems.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The structure of biological components is closely related to their function. Structures are adapted to perform specific roles efficiently. Form follows function in biological systems.',
            markingCriteria: {
              breakdown: ['Structure related to function (1 mark)', 'Adaptations for specific roles (1 mark)', 'Form follows function (1 mark)']
            },
            specReference: 'B8.2'
          },
          {
            id: 'b8-q3',
            question: 'Explain the importance of enzymes in biological processes.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Enzymes are biological catalysts that speed up chemical reactions. They lower activation energy required for reactions. They are specific to particular substrates and can be reused. Essential for metabolism and life processes.',
            markingCriteria: {
              breakdown: ['Biological catalysts (1 mark)', 'Lower activation energy (1 mark)', 'Specific and reusable (1 mark)', 'Essential for metabolism (1 mark)']
            },
            specReference: 'B8.3'
          },
          {
            id: 'b8-q4',
            question: 'Describe the role of ATP in cells.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'ATP is the universal energy currency of cells. It stores and transfers energy for cellular processes. When ATP breaks down to ADP, energy is released for use in the cell.',
            markingCriteria: {
              breakdown: ['Universal energy currency (1 mark)', 'Stores and transfers energy (1 mark)', 'Breaks down to release energy (1 mark)']
            },
            specReference: 'B8.4'
          },
          {
            id: 'b8-q5',
            question: 'Explain the concept of negative feedback in biological systems.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Negative feedback is a control mechanism where a change triggers a response that counteracts the original change. This helps maintain homeostasis. Examples include temperature regulation and blood glucose control.',
            markingCriteria: {
              breakdown: ['Response counteracts original change (1 mark)', 'Control mechanism (1 mark)', 'Maintains homeostasis (1 mark)', 'Examples given (1 mark)']
            },
            specReference: 'B8.5'
          },
          {
            id: 'b8-q6',
            question: 'Describe the importance of classification in biology.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Classification organizes living things into groups based on similarities. It helps scientists understand relationships between organisms. It makes study of biodiversity more manageable.',
            markingCriteria: {
              breakdown: ['Organizes living things into groups (1 mark)', 'Shows relationships between organisms (1 mark)', 'Makes biodiversity study manageable (1 mark)']
            },
            specReference: 'B8.6'
          },
          {
            id: 'b8-q7',
            question: 'Explain the concept of adaptation in biology.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Adaptation is the development of characteristics that help organisms survive in their environment. Adaptations can be structural, behavioral, or physiological. They arise through natural selection.',
            markingCriteria: {
              breakdown: ['Characteristics helping survival (1 mark)', 'Can be structural/behavioral/physiological (1 mark)', 'Arise through natural selection (1 mark)']
            },
            specReference: 'B8.7'
          },
          {
            id: 'b8-q8',
            question: 'Describe the importance of interdependence in ecosystems.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Organisms in ecosystems depend on each other for survival. Changes to one species affect others in the food web. This creates stability through complex relationships. Loss of species can disrupt entire ecosystems.',
            markingCriteria: {
              breakdown: ['Organisms depend on each other (1 mark)', 'Changes affect other species (1 mark)', 'Creates stability through relationships (1 mark)', 'Species loss disrupts ecosystems (1 mark)']
            },
            specReference: 'B8.8'
          },
          {
            id: 'b8-q9',
            question: 'Explain the concept of limiting factors in biology.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'A limiting factor is something that prevents further growth or development. It is the factor in shortest supply. Examples include light for photosynthesis or food for population growth.',
            markingCriteria: {
              breakdown: ['Prevents further growth/development (1 mark)', 'Factor in shortest supply (1 mark)', 'Examples given (1 mark)']
            },
            specReference: 'B8.9'
          },
          {
            id: 'b8-q10',
            question: 'Describe the importance of scientific methodology in biology.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Scientific methodology ensures reliable and valid results. It involves hypothesis formation, controlled experiments, and peer review. This allows scientific knowledge to be tested and built upon by others.',
            markingCriteria: {
              breakdown: ['Ensures reliable and valid results (1 mark)', 'Involves hypothesis and controlled experiments (1 mark)', 'Includes peer review (1 mark)', 'Allows knowledge to be tested and built upon (1 mark)']
            },
            specReference: 'B8.10'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    topics: [
      {
        id: 'c1-atomic-structure',
        name: 'Atomic structure and the periodic table',
        questions: [
          {
            id: 'c1-q1',
            question: 'Describe the structure of an atom.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'An atom consists of a central nucleus containing protons and neutrons, surrounded by electrons in energy levels or shells.',
            markingCriteria: {
              breakdown: ['Central nucleus (1 mark)', 'Contains protons and neutrons (1 mark)', 'Electrons in shells/energy levels (1 mark)']
            },
            specReference: 'C1.1'
          },
          {
            id: 'c1-q2',
            question: 'What are the relative masses and charges of protons, neutrons, and electrons?',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Proton: mass = 1, charge = +1. Neutron: mass = 1, charge = 0. Electron: mass = 1/1840 (or negligible), charge = -1.',
            markingCriteria: {
              breakdown: ['Proton mass = 1 (1 mark)', 'Proton charge = +1 (1 mark)', 'Neutron mass = 1 (1 mark)', 'Neutron charge = 0 (1 mark)', 'Electron mass = negligible (1 mark)', 'Electron charge = -1 (1 mark)']
            },
            specReference: 'C1.2'
          },
          {
            id: 'c1-q3',
            question: 'Explain what isotopes are and give an example.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. Example: Carbon-12 and Carbon-14.',
            markingCriteria: {
              breakdown: ['Same element, same protons (1 mark)', 'Different numbers of neutrons (1 mark)', 'Correct example given (1 mark)']
            },
            specReference: 'C1.3'
          },
          {
            id: 'c1-q4',
            question: 'How are elements arranged in the modern periodic table?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Elements are arranged in order of increasing atomic number (number of protons) in periods and groups.',
            markingCriteria: {
              breakdown: ['Order of increasing atomic number (1 mark)', 'In periods and groups (1 mark)']
            },
            specReference: 'C1.4'
          },
          {
            id: 'c1-q5',
            question: 'Describe the properties of Group 1 elements (alkali metals).',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Group 1 elements are soft metals with low melting points. They react vigorously with water to form alkaline solutions. Reactivity increases down the group. They have one electron in their outer shell.',
            markingCriteria: {
              breakdown: ['Soft metals with low melting points (1 mark)', 'React vigorously with water (1 mark)', 'Reactivity increases down group (1 mark)', 'One outer electron (1 mark)']
            },
            specReference: 'C1.5'
          },
          {
            id: 'c1-q6',
            question: 'What is the electronic configuration of chlorine (atomic number 17)?',
            marks: 1,
            difficulty: 'medium',
            modelAnswer: '2, 8, 7',
            markingCriteria: {
              breakdown: ['Correct electronic configuration 2, 8, 7 (1 mark)']
            },
            specReference: 'C1.6'
          },
          {
            id: 'c1-q7',
            question: 'Explain why noble gases are unreactive.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Noble gases have full outer shells of electrons, making them stable and unreactive.',
            markingCriteria: {
              breakdown: ['Full outer shells (1 mark)', 'Makes them stable/unreactive (1 mark)']
            },
            specReference: 'C1.7'
          },
          {
            id: 'c1-q8',
            question: 'Describe the properties of Group 7 elements (halogens).',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Halogens are non-metals that exist as diatomic molecules. They have seven electrons in their outer shell. Reactivity decreases down the group. They form ionic compounds with metals.',
            markingCriteria: {
              breakdown: ['Non-metals, diatomic molecules (1 mark)', 'Seven outer electrons (1 mark)', 'Reactivity decreases down group (1 mark)', 'Form ionic compounds with metals (1 mark)']
            },
            specReference: 'C1.8'
          },
          {
            id: 'c1-q9',
            question: 'Calculate the number of neutrons in an atom of potassium-39.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Potassium has atomic number 19 (19 protons). Mass number is 39. Neutrons = 39 - 19 = 20.',
            markingCriteria: {
              breakdown: ['Identifying atomic number as 19 (1 mark)', 'Correct calculation: 39 - 19 = 20 neutrons (1 mark)']
            },
            specReference: 'C1.9'
          },
          {
            id: 'c1-q10',
            question: 'Explain the trend in atomic radius across Period 2 of the periodic table.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Atomic radius decreases across Period 2. This is because the number of protons increases, creating a stronger nuclear charge that pulls electrons closer to the nucleus.',
            markingCriteria: {
              breakdown: ['Atomic radius decreases (1 mark)', 'Number of protons increases (1 mark)', 'Stronger nuclear charge pulls electrons closer (1 mark)']
            },
            specReference: 'C1.10'
          }
        ]
      },
      {
        id: 'c2-bonding-structure',
        name: 'Bonding, structure, and the properties of matter',
        questions: [
          {
            id: 'c2-q1',
            question: 'Describe how ionic bonding occurs.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Ionic bonding occurs when electrons are transferred from metal atoms to non-metal atoms. This creates positively charged metal ions and negatively charged non-metal ions, which are held together by electrostatic attraction.',
            markingCriteria: {
              breakdown: ['Electrons transferred from metal to non-metal (1 mark)', 'Forms positive and negative ions (1 mark)', 'Held together by electrostatic attraction (1 mark)']
            },
            specReference: 'C2.1'
          },
          {
            id: 'c2-q2',
            question: 'Explain what covalent bonding is.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Covalent bonding occurs when atoms share pairs of electrons to achieve full outer shells.',
            markingCriteria: {
              breakdown: ['Atoms share electrons (1 mark)', 'To achieve full outer shells (1 mark)']
            },
            specReference: 'C2.2'
          },
          {
            id: 'c2-q3',
            question: 'Describe the structure and properties of ionic compounds.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ionic compounds have a giant ionic lattice structure. They have high melting and boiling points. They conduct electricity when molten or dissolved in water. They are usually soluble in water.',
            markingCriteria: {
              breakdown: ['Giant ionic lattice structure (1 mark)', 'High melting/boiling points (1 mark)', 'Conduct when molten/dissolved (1 mark)', 'Usually soluble in water (1 mark)']
            },
            specReference: 'C2.3'
          },
          {
            id: 'c2-q4',
            question: 'Explain why diamond is hard but graphite is soft.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Diamond has a giant covalent structure where each carbon atom is bonded to four others, making it very hard. Graphite has layers of carbon atoms with weak forces between layers, allowing them to slide over each other.',
            markingCriteria: {
              breakdown: ['Diamond: each carbon bonded to four others (1 mark)', 'Diamond: giant covalent structure makes it hard (1 mark)', 'Graphite: layers of carbon atoms (1 mark)', 'Graphite: weak forces between layers allow sliding (1 mark)']
            },
            specReference: 'C2.4'
          },
          {
            id: 'c2-q5',
            question: 'Describe the properties of simple molecular compounds.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Simple molecular compounds have low melting and boiling points, do not conduct electricity, and are often soluble in organic solvents.',
            markingCriteria: {
              breakdown: ['Low melting/boiling points (1 mark)', 'Do not conduct electricity (1 mark)', 'Soluble in organic solvents (1 mark)']
            },
            specReference: 'C2.5'
          },
          {
            id: 'c2-q6',
            question: 'What is metallic bonding?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Metallic bonding is the attraction between metal atoms and a sea of delocalized electrons.',
            markingCriteria: {
              breakdown: ['Attraction between metal atoms (1 mark)', 'And sea of delocalized electrons (1 mark)']
            },
            specReference: 'C2.6'
          },
          {
            id: 'c2-q7',
            question: 'Explain why metals can conduct electricity.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Metals can conduct electricity because they have delocalized electrons that are free to move through the metal structure.',
            markingCriteria: {
              breakdown: ['Have delocalized electrons (1 mark)', 'Electrons free to move (1 mark)']
            },
            specReference: 'C2.7'
          },
          {
            id: 'c2-q8',
            question: 'Describe the bonding in water (H₂O) including the number of electrons involved.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Water has covalent bonding. Oxygen has 6 outer electrons and shares 2 electrons (one with each hydrogen atom) to form two covalent bonds.',
            markingCriteria: {
              breakdown: ['Identifies covalent bonding (1 mark)', 'Correct description of electron sharing (1 mark)']
            },
            specReference: 'C2.8'
          },
          {
            id: 'c2-q9',
            question: 'Explain what an alloy is and why alloys are often stronger than pure metals.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'An alloy is a mixture of metals or a metal with non-metals. Alloys are stronger because different sized atoms disrupt the regular arrangement, making it harder for layers to slide over each other.',
            markingCriteria: {
              breakdown: ['Alloy is mixture of metals (1 mark)', 'Different sized atoms disrupt arrangement (1 mark)', 'Harder for layers to slide (1 mark)']
            },
            specReference: 'C2.9'
          },
          {
            id: 'c2-q10',
            question: 'Compare the structure and properties of graphite and diamond.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Both are carbon allotropes with giant covalent structures. Diamond: each carbon bonded to 4 others, very hard, does not conduct electricity. Graphite: each carbon bonded to 3 others in layers, soft, conducts electricity due to delocalized electrons.',
            markingCriteria: {
              breakdown: ['Both carbon allotropes (1 mark)', 'Diamond: 4 bonds per carbon (1 mark)', 'Diamond: hard, non-conductor (1 mark)', 'Graphite: 3 bonds per carbon in layers (1 mark)', 'Graphite: soft (1 mark)', 'Graphite: conducts due to delocalized electrons (1 mark)']
            },
            specReference: 'C2.10'
          }
        ]
      },
      {
        id: 'c3-quantitative-chemistry',
        name: 'Quantitative chemistry',
        questions: [
          {
            id: 'c3-q1',
            question: 'Calculate the relative formula mass of water (H₂O). (H = 1, O = 16)',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'H₂O = (2 × 1) + (1 × 16) = 2 + 16 = 18',
            markingCriteria: {
              breakdown: ['Correct method shown (1 mark)', 'Correct answer 18 (1 mark)']
            },
            specReference: 'C3.1'
          },
          {
            id: 'c3-q2',
            question: 'What is Avogadro\'s number and what does it represent?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Avogadro\'s number is 6.02 × 10²³. It represents the number of particles in one mole of a substance.',
            markingCriteria: {
              breakdown: ['Correct value 6.02 × 10²³ (1 mark)', 'Number of particles in one mole (1 mark)']
            },
            specReference: 'C3.2'
          },
          {
            id: 'c3-q3',
            question: 'Calculate the number of moles in 88g of carbon dioxide (CO₂). (C = 12, O = 16)',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mr of CO₂ = 12 + (2 × 16) = 44. Moles = mass/Mr = 88/44 = 2 moles',
            markingCriteria: {
              breakdown: ['Correct Mr calculation = 44 (1 mark)', 'Correct formula: moles = mass/Mr (1 mark)', 'Correct answer 2 moles (1 mark)']
            },
            specReference: 'C3.3'
          },
          {
            id: 'c3-q4',
            question: 'What is the percentage by mass of carbon in methane (CH₄)? (C = 12, H = 1)',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mr of CH₄ = 12 + (4 × 1) = 16. Percentage of C = (12/16) × 100 = 75%',
            markingCriteria: {
              breakdown: ['Correct Mr calculation = 16 (1 mark)', 'Correct percentage formula (1 mark)', 'Correct answer 75% (1 mark)']
            },
            specReference: 'C3.4'
          },
          {
            id: 'c3-q5',
            question: 'Balance the equation: H₂ + O₂ → H₂O',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '2H₂ + O₂ → 2H₂O',
            markingCriteria: {
              breakdown: ['Correct balanced equation (1 mark)']
            },
            specReference: 'C3.5'
          },
          {
            id: 'c3-q6',
            question: 'Calculate the mass of oxygen needed to react with 4g of hydrogen. H₂ + ½O₂ → H₂O (H = 1, O = 16)',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Moles of H₂ = 4/2 = 2 moles. From equation: 1 mole H₂ needs 0.5 mole O₂. So 2 moles H₂ need 1 mole O₂. Mass of O₂ = 1 × 32 = 32g',
            markingCriteria: {
              breakdown: ['Moles of H₂ = 2 (1 mark)', 'Mole ratio from equation (1 mark)', 'Moles of O₂ needed = 1 (1 mark)', 'Mass of O₂ = 32g (1 mark)']
            },
            specReference: 'C3.6'
          },
          {
            id: 'c3-q7',
            question: 'What is the empirical formula of a compound containing 40% carbon, 6.7% hydrogen, and 53.3% oxygen? (C = 12, H = 1, O = 16)',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'C: 40/12 = 3.33, H: 6.7/1 = 6.7, O: 53.3/16 = 3.33. Divide by smallest (3.33): C = 1, H = 2, O = 1. Empirical formula = CH₂O',
            markingCriteria: {
              breakdown: ['Convert percentages to moles (1 mark)', 'Divide by smallest number (1 mark)', 'Get simple ratio (1 mark)', 'Correct empirical formula CH₂O (1 mark)']
            },
            specReference: 'C3.7'
          },
          {
            id: 'c3-q8',
            question: 'Calculate the concentration of a solution containing 20g of sodium chloride in 500cm³ of water.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Concentration = mass/volume = 20g/500cm³ = 0.04 g/cm³ or 40 g/dm³',
            markingCriteria: {
              breakdown: ['Correct formula used (1 mark)', 'Correct answer 40 g/dm³ (1 mark)']
            },
            specReference: 'C3.8'
          },
          {
            id: 'c3-q9',
            question: 'What volume of 0.1 mol/dm³ hydrochloric acid contains 0.05 moles of HCl?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Volume = moles/concentration = 0.05/0.1 = 0.5 dm³ or 500 cm³',
            markingCriteria: {
              breakdown: ['Correct formula used (1 mark)', 'Correct answer 0.5 dm³ or 500 cm³ (1 mark)']
            },
            specReference: 'C3.9'
          },
          {
            id: 'c3-q10',
            question: 'A compound has the empirical formula CH₂O and a relative molecular mass of 180. What is its molecular formula? (C = 12, H = 1, O = 16)',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Empirical formula mass = 12 + 2 + 16 = 30. Number of empirical units = 180/30 = 6. Molecular formula = C₆H₁₂O₆',
            markingCriteria: {
              breakdown: ['Empirical formula mass = 30 (1 mark)', 'Number of units = 6 (1 mark)', 'Molecular formula C₆H₁₂O₆ (1 mark)']
            },
            specReference: 'C3.10'
          }
        ]
      },
      {
        id: 'c4-chemical-changes',
        name: 'Chemical changes',
        questions: [
          {
            id: 'c4-q1',
            question: 'Define oxidation and reduction in terms of oxygen.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Oxidation is the gain of oxygen. Reduction is the loss of oxygen.',
            markingCriteria: {
              breakdown: ['Oxidation is gain of oxygen (1 mark)', 'Reduction is loss of oxygen (1 mark)']
            },
            specReference: 'C4.1'
          },
          {
            id: 'c4-q2',
            question: 'What is an acid and what ion do acids produce in water?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An acid is a substance that produces hydrogen ions (H⁺) when dissolved in water.',
            markingCriteria: {
              breakdown: ['Substance that produces ions in water (1 mark)', 'Hydrogen ions H⁺ (1 mark)']
            },
            specReference: 'C4.2'
          },
          {
            id: 'c4-q3',
            question: 'Write the general equation for the reaction between an acid and a metal.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Acid + Metal → Salt + Hydrogen',
            markingCriteria: {
              breakdown: ['Correct reactants (1 mark)', 'Correct products (1 mark)']
            },
            specReference: 'C4.3'
          },
          {
            id: 'c4-q4',
            question: 'Explain what happens during neutralization.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Neutralization occurs when an acid reacts with a base to form a salt and water. The hydrogen ions from the acid react with hydroxide ions from the base.',
            markingCriteria: {
              breakdown: ['Acid reacts with base (1 mark)', 'Forms salt and water (1 mark)', 'H⁺ reacts with OH⁻ (1 mark)']
            },
            specReference: 'C4.4'
          },
          {
            id: 'c4-q5',
            question: 'What is the pH scale and what do pH values of 7, less than 7, and greater than 7 indicate?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'The pH scale measures how acidic or alkaline a solution is. pH 7 is neutral, pH less than 7 is acidic, pH greater than 7 is alkaline.',
            markingCriteria: {
              breakdown: ['Measures acidity/alkalinity (1 mark)', 'pH 7 is neutral (1 mark)', 'Less than 7 acidic, greater than 7 alkaline (1 mark)']
            },
            specReference: 'C4.5'
          },
          {
            id: 'c4-q6',
            question: 'Describe the process of electrolysis.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Electrolysis is the decomposition of an ionic compound using electricity. Ions move to oppositely charged electrodes where they are discharged.',
            markingCriteria: {
              breakdown: ['Decomposition using electricity (1 mark)', 'Of ionic compounds (1 mark)', 'Ions move to opposite electrodes (1 mark)']
            },
            specReference: 'C4.6'
          },
          {
            id: 'c4-q7',
            question: 'What happens at the cathode and anode during electrolysis?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'At the cathode (negative electrode), positive ions are reduced. At the anode (positive electrode), negative ions are oxidized.',
            markingCriteria: {
              breakdown: ['Cathode: positive ions reduced (1 mark)', 'Anode: negative ions oxidized (1 mark)']
            },
            specReference: 'C4.7'
          },
          {
            id: 'c4-q8',
            question: 'Explain the reactivity series of metals.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The reactivity series lists metals in order of their reactivity, with the most reactive at the top. More reactive metals displace less reactive metals from their compounds.',
            markingCriteria: {
              breakdown: ['Lists metals in order of reactivity (1 mark)', 'Most reactive at top (1 mark)', 'More reactive displace less reactive (1 mark)']
            },
            specReference: 'C4.8'
          },
          {
            id: 'c4-q9',
            question: 'How can metals be extracted from their ores?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Metals can be extracted by reduction with carbon (for less reactive metals), electrolysis (for more reactive metals), or displacement reactions. The method depends on the metal\'s reactivity.',
            markingCriteria: {
              breakdown: ['Reduction with carbon (1 mark)', 'Electrolysis (1 mark)', 'Displacement reactions (1 mark)', 'Method depends on reactivity (1 mark)']
            },
            specReference: 'C4.9'
          },
          {
            id: 'c4-q10',
            question: 'Write a balanced equation for the reaction between sulfuric acid and sodium hydroxide.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
            markingCriteria: {
              breakdown: ['Correct formula and reactants (1 mark)', 'Correctly balanced equation (1 mark)']
            },
            specReference: 'C4.10'
          }
        ]
      },
      {
        id: 'c5-energy-changes',
        name: 'Energy changes',
        questions: [
          {
            id: 'c5-q1',
            question: 'What is an exothermic reaction?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An exothermic reaction is one that releases energy to the surroundings, usually as heat.',
            markingCriteria: {
              breakdown: ['Releases energy (1 mark)', 'To the surroundings (1 mark)']
            },
            specReference: 'C5.1'
          },
          {
            id: 'c5-q2',
            question: 'Give three examples of exothermic reactions.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Combustion, neutralization, and many oxidation reactions',
            markingCriteria: {
              breakdown: ['Combustion (1 mark)', 'Neutralization (1 mark)', 'Oxidation reactions (1 mark)']
            },
            specReference: 'C5.2'
          },
          {
            id: 'c5-q3',
            question: 'What is an endothermic reaction?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An endothermic reaction is one that takes in energy from the surroundings.',
            markingCriteria: {
              breakdown: ['Takes in energy (1 mark)', 'From the surroundings (1 mark)']
            },
            specReference: 'C5.3'
          },
          {
            id: 'c5-q4',
            question: 'Give two examples of endothermic reactions.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Thermal decomposition and photosynthesis',
            markingCriteria: {
              breakdown: ['Thermal decomposition (1 mark)', 'Photosynthesis (1 mark)']
            },
            specReference: 'C5.4'
          },
          {
            id: 'c5-q5',
            question: 'Explain what activation energy is.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Activation energy is the minimum amount of energy required for a chemical reaction to occur.',
            markingCriteria: {
              breakdown: ['Minimum energy required (1 mark)', 'For reaction to occur (1 mark)']
            },
            specReference: 'C5.5'
          },
          {
            id: 'c5-q6',
            question: 'Describe the energy changes in an exothermic reaction, including activation energy.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'In an exothermic reaction, reactants have higher energy than products. Energy must be supplied to overcome the activation energy barrier, then more energy is released when products form, resulting in an overall energy decrease.',
            markingCriteria: {
              breakdown: ['Reactants have higher energy than products (1 mark)', 'Activation energy barrier must be overcome (1 mark)', 'Overall energy is released/decreased (1 mark)']
            },
            specReference: 'C5.6'
          },
          {
            id: 'c5-q7',
            question: 'What is a fuel cell?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'A fuel cell is a device that produces electricity by reacting a fuel with oxygen.',
            markingCriteria: {
              breakdown: ['Device that produces electricity (1 mark)', 'By reacting fuel with oxygen (1 mark)']
            },
            specReference: 'C5.7'
          },
          {
            id: 'c5-q8',
            question: 'What are the advantages of hydrogen fuel cells?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'They produce only water as a waste product, are more efficient than combustion engines, and produce no harmful emissions.',
            markingCriteria: {
              breakdown: ['Only water as waste product (1 mark)', 'More efficient than combustion (1 mark)', 'No harmful emissions (1 mark)']
            },
            specReference: 'C5.8'
          },
          {
            id: 'c5-q9',
            question: 'Explain why bond breaking is endothermic and bond making is exothermic.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Bond breaking requires energy to overcome the attractive forces between atoms, so it is endothermic. Bond making releases energy as new attractive forces are formed, so it is exothermic.',
            markingCriteria: {
              breakdown: ['Bond breaking requires energy (1 mark)', 'To overcome attractive forces (1 mark)', 'Bond making releases energy (1 mark)', 'As new attractive forces form (1 mark)']
            },
            specReference: 'C5.9'
          },
          {
            id: 'c5-q10',
            question: 'Calculate the energy change for a reaction where 500 kJ is required to break bonds and 700 kJ is released when new bonds form.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Energy change = Energy released - Energy required = 700 - 500 = 200 kJ released (exothermic)',
            markingCriteria: {
              breakdown: ['Correct calculation method (1 mark)', 'Correct answer -200 kJ or 200 kJ released (1 mark)']
            },
            specReference: 'C5.10'
          }
        ]
      },
      {
        id: 'c6-rate-extent',
        name: 'The rate and extent of chemical change',
        questions: [
          {
            id: 'c6-q1',
            question: 'List four factors that affect the rate of chemical reactions.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Temperature, concentration, surface area, and catalysts',
            markingCriteria: {
              breakdown: ['Temperature (1 mark)', 'Concentration (1 mark)', 'Surface area (1 mark)', 'Catalysts (1 mark)']
            },
            specReference: 'C6.1'
          },
          {
            id: 'c6-q2',
            question: 'Explain how increasing temperature affects reaction rate.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Increasing temperature increases the kinetic energy of particles, making them move faster and collide more frequently with greater energy, increasing the reaction rate.',
            markingCriteria: {
              breakdown: ['Increases kinetic energy (1 mark)', 'Particles move faster and collide more (1 mark)', 'Collisions have greater energy (1 mark)']
            },
            specReference: 'C6.2'
          },
          {
            id: 'c6-q3',
            question: 'What is a catalyst?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A catalyst is a substance that increases the rate of a chemical reaction without being used up in the reaction.',
            markingCriteria: {
              breakdown: ['Increases reaction rate (1 mark)', 'Not used up in reaction (1 mark)']
            },
            specReference: 'C6.3'
          },
          {
            id: 'c6-q4',
            question: 'Explain how a catalyst works.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'A catalyst provides an alternative reaction pathway with lower activation energy.',
            markingCriteria: {
              breakdown: ['Provides alternative pathway (1 mark)', 'With lower activation energy (1 mark)']
            },
            specReference: 'C6.4'
          },
          {
            id: 'c6-q5',
            question: 'What is meant by a reversible reaction?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'A reversible reaction is one where the products can react to form the original reactants.',
            markingCriteria: {
              breakdown: ['Products can react (1 mark)', 'To form original reactants (1 mark)']
            },
            specReference: 'C6.5'
          },
          {
            id: 'c6-q6',
            question: 'What is dynamic equilibrium?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Dynamic equilibrium occurs in a reversible reaction when the rate of the forward reaction equals the rate of the reverse reaction, and concentrations remain constant.',
            markingCriteria: {
              breakdown: ['Forward rate equals reverse rate (1 mark)', 'In a reversible reaction (1 mark)', 'Concentrations remain constant (1 mark)']
            },
            specReference: 'C6.6'
          },
          {
            id: 'c6-q7',
            question: 'State Le Chatelier\'s principle.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'If a system at equilibrium is subjected to a change, the equilibrium will shift to oppose that change.',
            markingCriteria: {
              breakdown: ['System at equilibrium subjected to change (1 mark)', 'Equilibrium shifts to oppose the change (1 mark)']
            },
            specReference: 'C6.7'
          },
          {
            id: 'c6-q8',
            question: 'How does increasing pressure affect an equilibrium involving gases?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Increasing pressure shifts the equilibrium towards the side with fewer gas molecules.',
            markingCriteria: {
              breakdown: ['Equilibrium shifts (1 mark)', 'Towards side with fewer gas molecules (1 mark)']
            },
            specReference: 'C6.8'
          },
          {
            id: 'c6-q9',
            question: 'Explain why powdered calcium carbonate reacts faster with acid than large lumps.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Powdered calcium carbonate has a larger surface area than lumps, providing more contact points for acid particles to collide with, increasing the reaction rate.',
            markingCriteria: {
              breakdown: ['Powder has larger surface area (1 mark)', 'More contact points for collisions (1 mark)', 'Increases reaction rate (1 mark)']
            },
            specReference: 'C6.9'
          },
          {
            id: 'c6-q10',
            question: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃ + heat, predict the effect of: (a) increasing temperature, (b) increasing pressure.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: '(a) Increasing temperature shifts equilibrium left (towards reactants) as the reverse reaction is favored to absorb heat. (b) Increasing pressure shifts equilibrium right (towards products) as there are fewer gas molecules on the right.',
            markingCriteria: {
              breakdown: ['Temperature increase shifts left (1 mark)', 'Reason: reverse reaction absorbs heat (1 mark)', 'Pressure increase shifts right (1 mark)', 'Reason: fewer molecules on right (1 mark)']
            },
            specReference: 'C6.10'
          }
        ]
      },
      {
        id: 'c7-organic-chemistry',
        name: 'Organic chemistry',
        questions: [
          {
            id: 'c7-q1',
            question: 'What is organic chemistry?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Organic chemistry is the study of carbon compounds.',
            markingCriteria: {
              breakdown: ['Study of carbon compounds (1 mark)']
            },
            specReference: 'C7.1'
          },
          {
            id: 'c7-q2',
            question: 'What is a hydrocarbon?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'A hydrocarbon is a compound containing only carbon and hydrogen atoms.',
            markingCriteria: {
              breakdown: ['Compound containing only carbon and hydrogen (1 mark)']
            },
            specReference: 'C7.2'
          },
          {
            id: 'c7-q3',
            question: 'What is the general formula for alkanes?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'CₙH₂ₙ₊₂',
            markingCriteria: {
              breakdown: ['CₙH₂ₙ₊₂ (1 mark)']
            },
            specReference: 'C7.3'
          },
          {
            id: 'c7-q4',
            question: 'Write the molecular formula of propane and describe its structure.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Molecular formula: C₃H₈. Structure: 3 carbon atoms bonded in a chain, with each carbon bonded to hydrogen atoms (first and last carbons have 3 hydrogens, middle carbon has 2 hydrogens).',
            markingCriteria: {
              breakdown: ['Correct molecular formula C₃H₈ (1 mark)', 'Correct structural description (1 mark)']
            },
            specReference: 'C7.4'
          },
          {
            id: 'c7-q5',
            question: 'What is the difference between alkanes and alkenes?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Alkanes are saturated hydrocarbons with single bonds only. Alkenes are unsaturated hydrocarbons containing at least one double bond.',
            markingCriteria: {
              breakdown: ['Alkanes saturated/single bonds (1 mark)', 'Alkenes unsaturated/double bonds (1 mark)']
            },
            specReference: 'C7.5'
          },
          {
            id: 'c7-q6',
            question: 'Write the word equation for the complete combustion of methane.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Methane + Oxygen → Carbon dioxide + Water',
            markingCriteria: {
              breakdown: ['Correct reactants (1 mark)', 'Correct products (1 mark)']
            },
            specReference: 'C7.6'
          },
          {
            id: 'c7-q7',
            question: 'What is fractional distillation and why is it used?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Fractional distillation is a separation technique that separates mixtures based on different boiling points. It is used to separate crude oil into useful fractions.',
            markingCriteria: {
              breakdown: ['Separation technique (1 mark)', 'Based on different boiling points (1 mark)', 'Used to separate crude oil (1 mark)']
            },
            specReference: 'C7.7'
          },
          {
            id: 'c7-q8',
            question: 'What is cracking and why is it important?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Cracking is the breaking down of long-chain hydrocarbons into shorter, more useful molecules. It is important because it produces more petrol and alkenes for making plastics.',
            markingCriteria: {
              breakdown: ['Breaking down long-chain hydrocarbons (1 mark)', 'Into shorter molecules (1 mark)', 'Produces petrol and alkenes (1 mark)']
            },
            specReference: 'C7.8'
          },
          {
            id: 'c7-q9',
            question: 'Describe the test for alkenes.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Add bromine water to the alkene. If an alkene is present, the bromine water changes from orange to colourless.',
            markingCriteria: {
              breakdown: ['Add bromine water (1 mark)', 'Orange to colourless if alkene present (1 mark)']
            },
            specReference: 'C7.9'
          },
          {
            id: 'c7-q10',
            question: 'Explain how ethanol can be produced by fermentation and give the conditions required.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Ethanol is produced by fermenting glucose using yeast. The conditions required are: temperature of about 30-40°C, absence of oxygen (anaerobic), and pH around 4-5.',
            markingCriteria: {
              breakdown: ['Fermentation of glucose using yeast (1 mark)', 'Temperature 30-40°C (1 mark)', 'Absence of oxygen/anaerobic (1 mark)', 'pH around 4-5 (1 mark)']
            },
            specReference: 'C7.10'
          }
        ]
      },
      {
        id: 'c8-chemical-analysis',
        name: 'Chemical analysis',
        questions: [
          {
            id: 'c8-q1',
            question: 'What is a pure substance in chemistry?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A pure substance contains only one type of element or compound with no other substances mixed in.',
            markingCriteria: {
              breakdown: ['Contains only one type of element/compound (1 mark)', 'No other substances mixed in (1 mark)']
            },
            specReference: 'C8.1'
          },
          {
            id: 'c8-q2',
            question: 'How can you test the purity of a substance?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Test the melting point or boiling point. A pure substance has a sharp, specific melting/boiling point.',
            markingCriteria: {
              breakdown: ['Test melting/boiling point (1 mark)', 'Pure substance has sharp, specific point (1 mark)']
            },
            specReference: 'C8.2'
          },
          {
            id: 'c8-q3',
            question: 'Describe the flame test for sodium ions.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Dip a clean platinum wire into the sample and hold it in a Bunsen flame. Sodium ions produce a yellow flame.',
            markingCriteria: {
              breakdown: ['Use platinum wire in Bunsen flame (1 mark)', 'Sodium produces yellow flame (1 mark)']
            },
            specReference: 'C8.3'
          },
          {
            id: 'c8-q4',
            question: 'What colors do the following metal ions produce in flame tests: (a) lithium, (b) potassium, (c) calcium?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '(a) Lithium produces red, (b) Potassium produces lilac, (c) Calcium produces orange-red',
            markingCriteria: {
              breakdown: ['Lithium - red (1 mark)', 'Potassium - lilac (1 mark)', 'Calcium - orange-red (1 mark)']
            },
            specReference: 'C8.4'
          },
          {
            id: 'c8-q5',
            question: 'Describe the test for chloride ions.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Add nitric acid followed by silver nitrate solution. A white precipitate forms if chloride ions are present.',
            markingCriteria: {
              breakdown: ['Add nitric acid (1 mark)', 'Add silver nitrate solution (1 mark)', 'White precipitate indicates chloride (1 mark)']
            },
            specReference: 'C8.5'
          },
          {
            id: 'c8-q6',
            question: 'What is chromatography used for?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Chromatography is used to separate and identify different substances in a mixture.',
            markingCriteria: {
              breakdown: ['Separate substances in mixture (1 mark)', 'Identify different substances (1 mark)']
            },
            specReference: 'C8.6'
          },
          {
            id: 'c8-q7',
            question: 'What is the Rf value and how is it calculated?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Rf value is the ratio of distance traveled by substance to distance traveled by solvent. Rf = distance moved by substance / distance moved by solvent front',
            markingCriteria: {
              breakdown: ['Ratio of distances (1 mark)', 'Distance by substance / distance by solvent (1 mark)', 'Correct formula (1 mark)']
            },
            specReference: 'C8.7'
          },
          {
            id: 'c8-q8',
            question: 'Describe the test for sulfate ions.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Add hydrochloric acid followed by barium chloride solution. A white precipitate forms if sulfate ions are present.',
            markingCriteria: {
              breakdown: ['Add hydrochloric acid (1 mark)', 'Add barium chloride solution (1 mark)', 'White precipitate indicates sulfate (1 mark)']
            },
            specReference: 'C8.8'
          },
          {
            id: 'c8-q9',
            question: 'How would you test for the presence of water?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Use anhydrous copper sulfate which changes from white to blue in the presence of water.',
            markingCriteria: {
              breakdown: ['Use anhydrous copper sulfate (1 mark)', 'Changes white to blue with water (1 mark)']
            },
            specReference: 'C8.9'
          },
          {
            id: 'c8-q10',
            question: 'Explain how gas chromatography-mass spectrometry (GC-MS) works and what it is used for.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'GC-MS separates compounds in a mixture using gas chromatography based on boiling points, then identifies them using mass spectrometry by measuring molecular masses. It is used for identifying unknown compounds and detecting trace amounts of substances.',
            markingCriteria: {
              breakdown: ['GC separates by boiling points (1 mark)', 'MS identifies by molecular mass (1 mark)', 'Used for identifying unknown compounds (1 mark)', 'Detecting trace amounts (1 mark)']
            },
            specReference: 'C8.10'
          }
        ]
      },
      {
        id: 'c9-atmosphere',
        name: 'Chemistry of the atmosphere',
        questions: [
          {
            id: 'c9-q1',
            question: 'What is the approximate composition of clean, dry air?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Nitrogen 78%, Oxygen 21%, Other gases (mainly argon) 1%',
            markingCriteria: {
              breakdown: ['Nitrogen 78% (1 mark)', 'Oxygen 21% (1 mark)', 'Other gases 1% (1 mark)']
            },
            specReference: 'C9.1'
          },
          {
            id: 'c9-q2',
            question: 'How has the atmosphere changed over the past 4.6 billion years?',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Early atmosphere had mainly carbon dioxide and water vapor. Oxygen levels increased due to photosynthesis by plants. Carbon dioxide levels decreased as it dissolved in oceans and was used by plants. Nitrogen levels increased relatively as other gases decreased.',
            markingCriteria: {
              breakdown: ['Early atmosphere mainly CO₂ and water vapor (1 mark)', 'Oxygen increased due to photosynthesis (1 mark)', 'CO₂ decreased - dissolved in oceans/used by plants (1 mark)', 'Nitrogen levels increased relatively (1 mark)']
            },
            specReference: 'C9.2'
          },
          {
            id: 'c9-q3',
            question: 'What are greenhouse gases and name three examples?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Greenhouse gases trap heat in the atmosphere causing global warming. Examples: carbon dioxide, methane, water vapor',
            markingCriteria: {
              breakdown: ['Trap heat in atmosphere (1 mark)', 'Carbon dioxide (1 mark)', 'Methane (1 mark)', 'Water vapor (1 mark)']
            },
            specReference: 'C9.3'
          },
          {
            id: 'c9-q4',
            question: 'Explain the greenhouse effect.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Solar radiation reaches Earth\'s surface and warms it. Earth emits infrared radiation. Greenhouse gases absorb this infrared radiation and re-emit it, warming the atmosphere.',
            markingCriteria: {
              breakdown: ['Solar radiation warms Earth\'s surface (1 mark)', 'Earth emits infrared radiation (1 mark)', 'Greenhouse gases absorb infrared (1 mark)', 'Re-emit radiation, warming atmosphere (1 mark)']
            },
            specReference: 'C9.4'
          },
          {
            id: 'c9-q5',
            question: 'List three human activities that increase carbon dioxide levels.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Burning fossil fuels, deforestation, and industrial processes',
            markingCriteria: {
              breakdown: ['Burning fossil fuels (1 mark)', 'Deforestation (1 mark)', 'Industrial processes (1 mark)']
            },
            specReference: 'C9.5'
          },
          {
            id: 'c9-q6',
            question: 'What is climate change and what are its potential effects?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Climate change is the long-term change in Earth\'s climate due to increased greenhouse gases. Effects include rising sea levels, extreme weather, melting ice caps, and changes in rainfall patterns.',
            markingCriteria: {
              breakdown: ['Long-term change in climate (1 mark)', 'Rising sea levels (1 mark)', 'Extreme weather (1 mark)', 'Melting ice caps/changed rainfall (1 mark)']
            },
            specReference: 'C9.6'
          },
          {
            id: 'c9-q7',
            question: 'What is carbon monoxide and why is it dangerous?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Carbon monoxide is a toxic gas produced by incomplete combustion of carbon-containing fuels. It is dangerous because it binds to hemoglobin preventing oxygen transport.',
            markingCriteria: {
              breakdown: ['Toxic gas from incomplete combustion (1 mark)', 'Of carbon-containing fuels (1 mark)', 'Binds to hemoglobin, prevents oxygen transport (1 mark)']
            },
            specReference: 'C9.7'
          },
          {
            id: 'c9-q8',
            question: 'Describe the problems caused by sulfur dioxide emissions.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Sulfur dioxide causes acid rain, which damages buildings, kills plants and aquatic life, and causes respiratory problems in humans.',
            markingCriteria: {
              breakdown: ['Causes acid rain (1 mark)', 'Damages buildings and kills plants/aquatic life (1 mark)', 'Causes respiratory problems (1 mark)']
            },
            specReference: 'C9.8'
          },
          {
            id: 'c9-q9',
            question: 'What are particulates and how do they affect health and the environment?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Particulates are tiny solid particles released from combustion. They cause respiratory problems, heart disease, and contribute to global dimming.',
            markingCriteria: {
              breakdown: ['Tiny solid particles from combustion (1 mark)', 'Cause respiratory problems and heart disease (1 mark)', 'Contribute to global dimming (1 mark)']
            },
            specReference: 'C9.9'
          },
          {
            id: 'c9-q10',
            question: 'Explain how catalytic converters work to reduce pollution from cars.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Catalytic converters contain precious metal catalysts that convert harmful gases into less harmful ones. They convert carbon monoxide to carbon dioxide, nitrogen oxides to nitrogen, and unburned hydrocarbons to carbon dioxide and water.',
            markingCriteria: {
              breakdown: ['Contain precious metal catalysts (1 mark)', 'Convert CO to CO₂ (1 mark)', 'Convert nitrogen oxides to nitrogen (1 mark)', 'Convert hydrocarbons to CO₂ and water (1 mark)']
            },
            specReference: 'C9.10'
          }
        ]
      },
      {
        id: 'c10-using-resources',
        name: 'Using resources',
        questions: [
          {
            id: 'c10-q1',
            question: 'What is sustainable development?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Sustainable development meets the needs of the present without compromising the ability of future generations to meet their own needs.',
            markingCriteria: {
              breakdown: ['Meets present needs (1 mark)', 'Without compromising future generations (1 mark)']
            },
            specReference: 'C10.1'
          },
          {
            id: 'c10-q2',
            question: 'What is potable water?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Potable water is water that is safe to drink with low levels of dissolved salts and microbes.',
            markingCriteria: {
              breakdown: ['Safe to drink (1 mark)', 'Low levels of dissolved salts and microbes (1 mark)']
            },
            specReference: 'C10.2'
          },
          {
            id: 'c10-q3',
            question: 'Describe the main steps in treating water for drinking.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Filtration to remove large particles, sedimentation to settle particles, chlorination to kill microbes, and sometimes fluoridation to prevent tooth decay.',
            markingCriteria: {
              breakdown: ['Filtration removes large particles (1 mark)', 'Sedimentation settles particles (1 mark)', 'Chlorination kills microbes (1 mark)', 'Fluoridation prevents tooth decay (1 mark)']
            },
            specReference: 'C10.3'
          },
          {
            id: 'c10-q4',
            question: 'What is desalination and when might it be used?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Desalination is the removal of salt from seawater to produce fresh water. It might be used in areas with limited fresh water supplies but requires a lot of energy.',
            markingCriteria: {
              breakdown: ['Removal of salt from seawater (1 mark)', 'To produce fresh water (1 mark)', 'Used where fresh water is limited/requires lots of energy (1 mark)']
            },
            specReference: 'C10.4'
          },
          {
            id: 'c10-q5',
            question: 'What is sewage treatment and why is it important?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Sewage treatment removes harmful substances from wastewater before it is returned to the environment. It is important to prevent pollution and protect public health.',
            markingCriteria: {
              breakdown: ['Removes harmful substances from wastewater (1 mark)', 'Before returning to environment (1 mark)', 'Prevents pollution and protects health (1 mark)']
            },
            specReference: 'C10.5'
          },
          {
            id: 'c10-q6',
            question: 'Explain what is meant by a finite resource and give examples.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'A finite resource is one that cannot be replaced once used up. Examples include fossil fuels, metals, and minerals.',
            markingCriteria: {
              breakdown: ['Cannot be replaced once used up (1 mark)', 'Fossil fuels (1 mark)', 'Metals and minerals (1 mark)']
            },
            specReference: 'C10.6'
          },
          {
            id: 'c10-q7',
            question: 'What is recycling and why is it important?',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Recycling is reprocessing materials to make new products. It is important because it conserves resources, reduces waste, and saves energy.',
            markingCriteria: {
              breakdown: ['Reprocessing materials to make new products (1 mark)', 'Conserves resources (1 mark)', 'Reduces waste and saves energy (1 mark)']
            },
            specReference: 'C10.7'
          },
          {
            id: 'c10-q8',
            question: 'Describe the advantages and disadvantages of extracting metals from their ores.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Advantages: provides useful metals for society, creates jobs. Disadvantages: uses lots of energy, causes environmental damage, destroys habitats, produces pollution.',
            markingCriteria: {
              breakdown: ['Advantages: provides useful metals/creates jobs (1 mark)', 'Disadvantages: uses lots of energy (1 mark)', 'Environmental damage/destroys habitats (1 mark)', 'Produces pollution (1 mark)']
            },
            specReference: 'C10.8'
          },
          {
            id: 'c10-q9',
            question: 'What is a life cycle assessment (LCA)?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'A life cycle assessment evaluates the environmental impact of a product throughout its entire life from raw material extraction to disposal.',
            markingCriteria: {
              breakdown: ['Evaluates environmental impact (1 mark)', 'Of a product throughout its life (1 mark)', 'From raw materials to disposal (1 mark)']
            },
            specReference: 'C10.9'
          },
          {
            id: 'c10-q10',
            question: 'Compare the environmental impacts of using plastic bags versus paper bags.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Plastic bags: made from crude oil (finite resource), not biodegradable, cause pollution if not disposed of properly. Paper bags: made from trees (renewable), biodegradable, but require more energy to produce and transport.',
            markingCriteria: {
              breakdown: ['Plastic: from finite resources/not biodegradable (1 mark)', 'Plastic: cause pollution if not disposed properly (1 mark)', 'Paper: from renewable resources/biodegradable (1 mark)', 'Paper: require more energy to produce/transport (1 mark)']
            },
            specReference: 'C10.10'
          }
        ]
      },
      {
        id: 'c11-key-ideas',
        name: 'Key ideas',
        questions: [
          {
            id: 'c11-q1',
            question: 'Explain the relationship between atomic structure and the periodic table.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Elements are arranged by atomic number (number of protons). Elements in the same group have the same number of outer electrons, giving similar properties. Elements in the same period have the same number of electron shells.',
            markingCriteria: {
              breakdown: ['Arranged by atomic number (1 mark)', 'Same group = same outer electrons (1 mark)', 'Gives similar properties (1 mark)', 'Same period = same number of shells (1 mark)']
            },
            specReference: 'C11.1'
          },
          {
            id: 'c11-q2',
            question: 'Describe the relationship between bonding and properties of materials.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Ionic compounds have high melting points due to strong electrostatic forces. Covalent compounds may have low melting points (simple molecules) or high melting points (giant structures). Metallic bonding gives metals their characteristic properties.',
            markingCriteria: {
              breakdown: ['Ionic: high melting points due to strong forces (1 mark)', 'Simple covalent: low melting points (1 mark)', 'Giant covalent: high melting points (1 mark)', 'Metallic bonding gives characteristic properties (1 mark)']
            },
            specReference: 'C11.2'
          },
          {
            id: 'c11-q3',
            question: 'Explain the importance of conservation of mass in chemical reactions.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mass is conserved in chemical reactions because atoms are rearranged but not created or destroyed. This allows us to balance equations and calculate quantities in reactions.',
            markingCriteria: {
              breakdown: ['Mass is conserved in reactions (1 mark)', 'Atoms rearranged not created/destroyed (1 mark)', 'Allows balancing equations and calculations (1 mark)']
            },
            specReference: 'C11.3'
          },
          {
            id: 'c11-q4',
            question: 'Describe the concept of dynamic equilibrium in reversible reactions.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'In dynamic equilibrium, the forward and reverse reactions occur at equal rates. The concentrations of reactants and products remain constant, but the reactions continue to occur.',
            markingCriteria: {
              breakdown: ['Forward and reverse rates equal (1 mark)', 'Concentrations remain constant (1 mark)', 'Reactions continue to occur (1 mark)']
            },
            specReference: 'C11.4'
          },
          {
            id: 'c11-q5',
            question: 'Explain how the collision theory relates to reaction rates.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'For a reaction to occur, particles must collide with sufficient energy (activation energy) and correct orientation. Increasing temperature, concentration, or surface area increases collision frequency and/or energy.',
            markingCriteria: {
              breakdown: ['Particles must collide with sufficient energy (1 mark)', 'And correct orientation (1 mark)', 'Increasing temperature/concentration increases collisions (1 mark)', 'Surface area increases collision frequency (1 mark)']
            },
            specReference: 'C11.5'
          },
          {
            id: 'c11-q6',
            question: 'Describe the importance of catalysts in industry.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Catalysts increase reaction rates without being consumed, allowing reactions to occur at lower temperatures and pressures, saving energy and costs.',
            markingCriteria: {
              breakdown: ['Increase reaction rates (1 mark)', 'Not consumed in reaction (1 mark)', 'Allow lower temperatures/pressures, saving energy (1 mark)']
            },
            specReference: 'C11.6'
          },
          {
            id: 'c11-q7',
            question: 'Explain the relationship between molecular structure and properties in organic compounds.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Chain length affects boiling point - longer chains have higher boiling points. Branching decreases boiling point. Functional groups determine chemical properties and reactions. Saturation affects reactivity.',
            markingCriteria: {
              breakdown: ['Chain length affects boiling point (1 mark)', 'Branching decreases boiling point (1 mark)', 'Functional groups determine properties (1 mark)', 'Saturation affects reactivity (1 mark)']
            },
            specReference: 'C11.7'
          },
          {
            id: 'c11-q8',
            question: 'Describe the importance of analytical techniques in chemistry.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Analytical techniques allow identification of unknown substances, determination of purity, and quantitative analysis of mixtures, which is essential for quality control and research.',
            markingCriteria: {
              breakdown: ['Identify unknown substances (1 mark)', 'Determine purity (1 mark)', 'Essential for quality control and research (1 mark)']
            },
            specReference: 'C11.8'
          },
          {
            id: 'c11-q9',
            question: 'Explain the concept of sustainability in chemistry.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sustainability involves using resources efficiently, minimizing waste, reducing environmental impact, and considering the needs of future generations in chemical processes and industry.',
            markingCriteria: {
              breakdown: ['Using resources efficiently (1 mark)', 'Minimizing waste (1 mark)', 'Reducing environmental impact (1 mark)', 'Considering future generations (1 mark)']
            },
            specReference: 'C11.9'
          },
          {
            id: 'c11-q10',
            question: 'Describe the role of chemistry in addressing global challenges.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Chemistry helps develop clean energy sources, create more efficient materials, develop medicines, improve food production, and find solutions to environmental problems like pollution and climate change.',
            markingCriteria: {
              breakdown: ['Develop clean energy sources (1 mark)', 'Create efficient materials/medicines (1 mark)', 'Improve food production (1 mark)', 'Solve environmental problems (1 mark)']
            },
            specReference: 'C11.10'
          }
        ]
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    topics: [
      {
        id: 'business-real-world',
        name: 'Business in the real world',
        questions: [
          {
            id: 'brw-q1',
            question: 'Which of the following is NOT a characteristic of an entrepreneur?\na) Risk-taking\nb) Innovation\nc) Risk-averse\nd) Organised',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'c) Risk-averse',
            markingCriteria: {
              breakdown: ['Correct identification of risk-averse as NOT being a characteristic of entrepreneurs (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q2',
            question: 'State two reasons why someone might want to start their own business.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'To be their own boss and have flexibility in working hours.',
            markingCriteria: {
              breakdown: ['First valid reason (1 mark)', 'Second valid reason (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q3',
            question: 'Define what is meant by "opportunity cost" in business.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Opportunity cost is the value of the next best alternative that is given up when making a choice.',
            markingCriteria: {
              breakdown: ['Reference to next best alternative (1 mark)', 'Reference to giving up/sacrificing something (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q4',
            question: 'Identify two advantages of operating as a private limited company (Ltd) compared to a sole trader.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Limited liability protection means shareholders are only liable up to their investment amount. Easier access to finance through selling shares to investors.',
            markingCriteria: {
              breakdown: ['First advantage correctly identified and explained (2 marks)', 'Second advantage correctly identified and explained (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q5',
            question: 'Which business sector would Amazon\'s online retail operations belong to?\na) Primary\nb) Secondary\nc) Tertiary\nd) Quaternary',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'c) Tertiary',
            markingCriteria: {
              breakdown: ['Correct identification of tertiary sector for service provision (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q6',
            question: 'Explain why a business might choose to expand through franchising rather than opening new company-owned stores.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Franchising allows rapid expansion with reduced capital investment since franchisees provide the funding for new outlets. This reduces financial risk for the franchisor while still generating revenue through franchise fees and royalties. Franchisees are often more motivated to succeed as they own their business, leading to better customer service and local market knowledge.',
            markingCriteria: {
              breakdown: ['Reduced capital investment/financial risk (2 marks)', 'Revenue generation through fees/royalties (2 marks)', 'Motivated franchisees/local knowledge (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q7',
            question: 'State what is meant by "fixed costs" and give one example.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Fixed costs are costs that do not change with the level of output. For example, rent.',
            markingCriteria: {
              breakdown: ['Definition of fixed costs as not changing with output (2 marks)', 'Valid example such as rent, insurance, salaries (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q8',
            question: 'Analyse the potential benefits and drawbacks for a small online clothing retailer of expanding internationally.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Benefits include access to larger markets, increasing potential customer base and revenue. Spreading risk across multiple markets reduces dependence on the domestic economy. Economies of scale from larger production volumes can reduce per-unit costs. However, drawbacks include increased complexity in logistics and supply chains, requiring investment in international shipping and returns processes. Cultural differences may require product adaptation and different marketing approaches, increasing costs. Exchange rate fluctuations create financial uncertainty and currency risk that could affect profitability.',
            markingCriteria: {
              breakdown: ['Benefits: larger markets/revenue (3 marks)', 'Benefits: risk spreading/economies of scale (3 marks)', 'Drawbacks: complexity/logistics costs (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q9',
            question: 'Identify three stakeholders of a business and explain one objective each stakeholder might have.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Shareholders want maximum return on their investment through dividends and share price growth. Employees want job security and good working conditions with fair pay. Customers want quality products at reasonable prices with good customer service.',
            markingCriteria: {
              breakdown: ['Three stakeholders correctly identified (3 marks)', 'Three objectives correctly explained (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'brw-q10',
            question: 'Evaluate the importance of business planning for a new technology start-up compared to an established retail chain.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'For a technology start-up, business planning is crucial as it operates in a highly uncertain environment with limited track record. Detailed planning helps identify potential risks, secure investor funding, and establish clear objectives in a rapidly changing market. Start-ups need comprehensive financial forecasting to manage cash flow during development phases when revenue may be minimal. However, they must remain flexible as technology markets evolve quickly. For established retail chains, business planning is important but less critical for survival as they have proven business models, established customer bases, and predictable revenue streams. Their planning focuses more on optimization and growth rather than basic viability. Both benefit from planning, but start-ups face greater consequences from poor planning due to limited resources and higher failure rates.',
            markingCriteria: {
              breakdown: ['Analysis of start-up planning needs (4 marks)', 'Analysis of established business planning needs (4 marks)', 'Comparative evaluation and justified conclusion (4 marks)']
            },
            specReference: 'AQA Business 8132'
          }
        ]
      },
      {
        id: 'influences-on-business',
        name: 'Influences on business',
        questions: [
          {
            id: 'iob-q1',
            question: 'Which of the following is an example of how technology has influenced business?\na) Increased corporation tax\nb) E-commerce growth\nc) Minimum wage increases\nd) Environmental regulations',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'b) E-commerce growth',
            markingCriteria: {
              breakdown: ['Correct identification of e-commerce as a technological influence (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q2',
            question: 'State two ways that rising interest rates might affect a business.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Higher borrowing costs for business loans and reduced consumer spending due to higher mortgage payments.',
            markingCriteria: {
              breakdown: ['First valid effect identified (1 mark)', 'Second valid effect identified (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q3',
            question: 'Define what is meant by "globalisation" in business.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Globalisation is the increasing interconnectedness of economies worldwide, allowing businesses to operate across international borders more easily.',
            markingCriteria: {
              breakdown: ['Reference to interconnectedness/integration (1 mark)', 'Reference to international/worldwide operations (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q4',
            question: 'Explain how environmental legislation might affect a manufacturing business\'s operations.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Environmental legislation may require businesses to invest in cleaner production methods and waste management systems, increasing operational costs. Companies must ensure compliance with emissions standards and pollution controls, potentially requiring expensive equipment upgrades.',
            markingCriteria: {
              breakdown: ['Investment in cleaner methods/waste management (2 marks)', 'Compliance costs/equipment upgrades (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q5',
            question: 'Which legislation protects employees from discrimination in the workplace?\na) Health and Safety at Work Act\nb) Equality Act\nc) Trade Descriptions Act\nd) Minimum Wage Act',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'b) Equality Act',
            markingCriteria: {
              breakdown: ['Correct identification of Equality Act (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q6',
            question: 'Explain how exchange rate changes might benefit a UK business that exports products to Europe.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'If the pound weakens against the euro, UK products become cheaper for European customers, potentially increasing demand and sales volume. This price competitiveness can help UK businesses gain market share against European competitors. Higher sales volumes can lead to economies of scale, reducing per-unit production costs and improving profit margins.',
            markingCriteria: {
              breakdown: ['Weaker pound makes exports cheaper (2 marks)', 'Increased demand/market share (2 marks)', 'Economies of scale/improved margins (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q7',
            question: 'State one benefit and one drawback of globalisation for UK businesses.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Benefit: Access to larger international markets increases potential revenue. Drawback: Increased competition from foreign businesses.',
            markingCriteria: {
              breakdown: ['Valid benefit identified and explained (2 marks)', 'Valid drawback identified and explained (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q8',
            question: 'Analyse how economic uncertainty might affect business decision-making in a retail company.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Economic uncertainty makes businesses more cautious about major investments, as future returns become unpredictable. Retail companies may delay expansion plans or new store openings to conserve cash. They might focus on short-term planning rather than long-term strategies, making it difficult to secure optimal supplier contracts or lease agreements. Consumer spending patterns become less predictable, making inventory management challenging and potentially leading to either stockouts or excess stock. Businesses may increase cash reserves rather than investing in growth, limiting innovation and competitiveness.',
            markingCriteria: {
              breakdown: ['Impact on investment decisions (3 marks)', 'Effects on planning and operations (3 marks)', 'Consumer behavior and inventory implications (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q9',
            question: 'Explain how digital communication technology has changed the way businesses interact with customers.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Social media platforms allow businesses to engage directly with customers in real-time, building relationships and responding to queries quickly. Email marketing enables targeted, personalized communication at low cost. Online chat systems and mobile apps provide instant customer support, improving satisfaction and loyalty.',
            markingCriteria: {
              breakdown: ['Social media engagement/real-time interaction (2 marks)', 'Email marketing/personalization (2 marks)', 'Instant support/mobile technology (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'iob-q10',
            question: 'Evaluate whether ethical considerations or profit maximization should be the primary focus for businesses operating in developing countries.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Ethical considerations should be prioritized as they ensure sustainable long-term operations and protect vulnerable populations. Businesses operating ethically build stronger relationships with local communities, governments, and international stakeholders, reducing reputational risks. Fair wages and working conditions improve employee motivation and productivity. However, profit maximization enables business growth, job creation, and economic development in developing countries. Sustainable profits allow continued investment and expansion of operations. The optimal approach balances both - ethical operations that generate sustainable profits while contributing positively to local development. Short-term profit maximization at the expense of ethics often leads to long-term business failure through boycotts, regulatory action, and damaged reputation.',
            markingCriteria: {
              breakdown: ['Arguments for ethical considerations (4 marks)', 'Arguments for profit maximization (4 marks)', 'Balanced evaluation and justified conclusion (4 marks)']
            },
            specReference: 'AQA Business 8132'
          }
        ]
      },
      {
        id: 'business-operations',
        name: 'Business operations',
        questions: [
          {
            id: 'bo-q1',
            question: 'Which production method would be most suitable for manufacturing cars?\na) Job production\nb) Batch production\nc) Flow production\nd) Lean production',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'c) Flow production',
            markingCriteria: {
              breakdown: ['Correct identification of flow production for mass manufacturing (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q2',
            question: 'State two advantages of Just In Time (JIT) production.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Reduced storage costs and lower risk of stock becoming obsolete.',
            markingCriteria: {
              breakdown: ['First valid advantage (1 mark)', 'Second valid advantage (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q3',
            question: 'Define what is meant by "Total Quality Management" (TQM).',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'TQM is a management approach that involves all employees in continuously improving quality throughout all business processes.',
            markingCriteria: {
              breakdown: ['Reference to all employees being involved (1 mark)', 'Reference to continuous improvement of quality (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q4',
            question: 'Explain two ways that poor quality products can affect a business.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Increased costs from returns, refunds, and warranty claims reduce profitability. Damaged reputation leads to loss of customer trust and reduced future sales.',
            markingCriteria: {
              breakdown: ['First impact explained with detail (2 marks)', 'Second impact explained with detail (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q5',
            question: 'Which of the following is NOT a factor in supplier selection?\na) Price\nb) Reliability\nc) Market share\nd) Quality',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'c) Market share',
            markingCriteria: {
              breakdown: ['Correct identification that market share is not a supplier selection factor (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q6',
            question: 'Explain how effective customer service can benefit an online retail business.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Effective customer service builds customer loyalty, encouraging repeat purchases and reducing customer acquisition costs. Positive customer experiences lead to word-of-mouth recommendations and positive online reviews, attracting new customers at low cost. Quick resolution of problems prevents negative reviews and maintains brand reputation in competitive online markets.',
            markingCriteria: {
              breakdown: ['Customer loyalty and repeat business (2 marks)', 'Word-of-mouth and positive reviews (2 marks)', 'Problem resolution and reputation protection (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q7',
            question: 'Compare job production with flow production, giving one advantage of each.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Job production allows customization to meet specific customer requirements. Flow production achieves economies of scale through high-volume, standardized manufacturing.',
            markingCriteria: {
              breakdown: ['Job production advantage correctly explained (2 marks)', 'Flow production advantage correctly explained (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q8',
            question: 'Analyse the benefits and drawbacks of implementing lean production methods in a food manufacturing business.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Benefits include reduced waste of ingredients and packaging materials, lowering costs and improving environmental impact. Lean methods minimize storage requirements for perishable goods, reducing spoilage and associated costs. Streamlined processes improve efficiency and can reduce production time. However, drawbacks include vulnerability to supply chain disruptions, particularly problematic for businesses dependent on fresh ingredients. Reduced inventory buffers mean any supplier delays can halt production. Implementation requires significant staff training and cultural change, involving substantial upfront costs and potential resistance from employees.',
            markingCriteria: {
              breakdown: ['Benefits: waste reduction and efficiency (3 marks)', 'Benefits: reduced storage and spoilage (3 marks)', 'Drawbacks: supply chain vulnerability and implementation costs (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q9',
            question: 'Explain the importance of logistics in supply chain management for an e-commerce business.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Efficient logistics ensure fast delivery times, meeting customer expectations for quick service and improving satisfaction. Effective logistics reduce shipping costs through optimized routes and carrier selection, improving profit margins. Reliable logistics prevent stockouts and delivery delays that could damage customer relationships and brand reputation.',
            markingCriteria: {
              breakdown: ['Fast delivery and customer satisfaction (2 marks)', 'Cost optimization and profit margins (2 marks)', 'Reliability and reputation protection (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'bo-q10',
            question: 'Evaluate whether a small craft brewery should prioritize quality control or cost minimization in its operations.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Quality control should be prioritized for a craft brewery as it operates in a market where product differentiation and brand reputation are crucial. High-quality products justify premium pricing and build customer loyalty in a competitive market dominated by large commercial breweries. Poor quality could quickly destroy the business reputation and customer base. Craft beer consumers are typically quality-conscious and willing to pay higher prices for superior products. However, cost minimization enables competitive pricing and higher profit margins, allowing investment in marketing and expansion. Excessive costs could price the brewery out of the market. The optimal approach prioritizes quality while maintaining cost efficiency - investing in quality ingredients and brewing processes while optimizing operational efficiency. Quality should not be compromised for short-term cost savings as this risks long-term business viability.',
            markingCriteria: {
              breakdown: ['Arguments for quality control priority (4 marks)', 'Arguments for cost minimization (4 marks)', 'Balanced evaluation with justified conclusion (4 marks)']
            },
            specReference: 'AQA Business 8132'
          }
        ]
      },
      {
        id: 'human-resources',
        name: 'Human resources',
        questions: [
          {
            id: 'hr-q1',
            question: 'Which of the following is a financial method of motivation?\na) Job rotation\nb) Commission\nc) Training opportunities\nd) Delegation of responsibility',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'b) Commission',
            markingCriteria: {
              breakdown: ['Correct identification of commission as financial motivation (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q2',
            question: 'State two advantages of internal recruitment compared to external recruitment.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Lower recruitment costs and existing employee knowledge of company culture.',
            markingCriteria: {
              breakdown: ['First valid advantage (1 mark)', 'Second valid advantage (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q3',
            question: 'Define what is meant by "span of control" in organizational structure.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Span of control is the number of employees directly supervised by one manager.',
            markingCriteria: {
              breakdown: ['Reference to number of employees (1 mark)', 'Reference to direct supervision by one manager (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q4',
            question: 'Explain two benefits of providing induction training for new employees.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Reduces employee anxiety and helps them settle into their role quickly, improving early productivity. Ensures new employees understand company policies and procedures, reducing mistakes and potential legal issues.',
            markingCriteria: {
              breakdown: ['First benefit explained with development (2 marks)', 'Second benefit explained with development (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q5',
            question: 'Which organizational structure has fewer management layers?\na) Tall structure\nb) Flat structure\nc) Matrix structure\nd) Functional structure',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'b) Flat structure',
            markingCriteria: {
              breakdown: ['Correct identification of flat structure (1 mark)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q6',
            question: 'Explain how effective motivation can improve business performance.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Motivated employees are more productive, completing tasks efficiently and to higher standards, improving output quality. Higher motivation reduces employee turnover, saving recruitment and training costs while maintaining experienced staff. Motivated employees provide better customer service, enhancing customer satisfaction and potentially increasing sales and repeat business.',
            markingCriteria: {
              breakdown: ['Increased productivity and quality (2 marks)', 'Reduced turnover and cost savings (2 marks)', 'Improved customer service and sales (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q7',
            question: 'Compare part-time and zero-hour contracts, stating one advantage of each for employers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Part-time contracts provide predictable staffing levels for regular business needs. Zero-hour contracts offer maximum flexibility to match staffing to demand fluctuations.',
            markingCriteria: {
              breakdown: ['Part-time advantage correctly explained (2 marks)', 'Zero-hour advantage correctly explained (2 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q8',
            question: 'Analyse the advantages and disadvantages of having a flat organizational structure for a technology start-up.',
            marks: 9,
            difficulty: 'hard',
            modelAnswer: 'Advantages include faster decision-making as fewer management layers reduce bureaucracy, enabling quick responses to market changes crucial for start-ups. Improved communication flows more easily between levels, fostering innovation and collaboration. Lower management costs as fewer supervisory roles are needed, important for cash-constrained start-ups. However, disadvantages include managers having wider spans of control, potentially reducing supervision quality and support for employees. Limited promotional opportunities may demotivate ambitious staff seeking career progression. Heavy workload on senior managers who must handle more direct reports alongside strategic responsibilities.',
            markingCriteria: {
              breakdown: ['Advantages: faster decisions and communication (3 marks)', 'Advantages: lower costs and efficiency (3 marks)', 'Disadvantages: supervision issues and workload (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q9',
            question: 'Explain the difference between on-the-job and off-the-job training, giving one example of each.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'On-the-job training occurs in the workplace while employees perform their normal duties, such as job shadowing experienced colleagues. Off-the-job training takes place away from the normal work environment, such as attending external courses or workshops. On-the-job training is directly relevant to specific job requirements, while off-the-job training can provide broader skills and qualifications.',
            markingCriteria: {
              breakdown: ['On-the-job definition and example (3 marks)', 'Off-the-job definition and example (3 marks)']
            },
            specReference: 'AQA Business 8132'
          },
          {
            id: 'hr-q10',
            question: 'Evaluate whether financial or non-financial motivation methods are more effective for retaining skilled employees in a competitive technology sector.',
            marks: 12,
            difficulty: 'hard',
            modelAnswer: 'Financial motivation is crucial in technology sectors where skills command high market rates and competitors actively recruit talented employees. Competitive salaries, bonuses, and stock options help retain valuable staff and signal company appreciation of their contribution. Financial rewards provide tangible recognition and enable employees to improve their lifestyle. However, non-financial motivation can be equally important for long-term retention. Opportunities for career development, interesting projects, and work-life balance often matter more to skilled professionals than salary alone. Autonomy, recognition, and challenging work create job satisfaction that purely financial incentives cannot provide. The most effective approach combines both - competitive financial packages to meet market expectations alongside non-financial benefits that create emotional attachment to the company. Technology professionals often prioritize learning opportunities and innovative work environments over marginal salary differences.',
            markingCriteria: {
              breakdown: ['Arguments for financial motivation effectiveness (4 marks)', 'Arguments for non-financial motivation effectiveness (4 marks)', 'Balanced evaluation with justified conclusion (4 marks)']
            },
            specReference: 'AQA Business 8132'
          }
        ]
      }
    ]
  },
  
  // ===== EDEXCEL SUBJECTS =====
  {
    id: 'edexcel-english-language',
    name: 'English Language (Edexcel)',
    topics: [
      {
        id: 'component1-fiction-imaginative',
        name: 'Component 1: Fiction and Imaginative Writing',
        questions: [
          {
            id: 'edexcel-eng-q1',
            question: 'Read the extract below from "Great Expectations" by Charles Dickens (1861):\n\n"My sister, Mrs Joe Gargery, was more than twenty years older than I, and had established a great reputation with herself and the neighbours because she had brought me up \'by hand\'. Having at that time to find out for myself what the expression meant, and knowing her to have a hard and heavy hand, and to be much in the habit of laying it upon her husband as well as upon me, I supposed that Joe Gargery and I were both brought up by hand."\n\nFind a word or phrase from lines 1-2 that shows Mrs Joe was proud of raising the narrator.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '"established a great reputation with herself"',
            markingCriteria: {
              breakdown: [
                'Accept: "established a great reputation with herself" or "great reputation" (1 mark)'
              ]
            },
            specReference: 'Edexcel GCSE English Language 1EN0/01'
          },
          {
            id: 'edexcel-eng-q2',
            question: 'Read this extract from "Jane Eyre" by Charlotte Brontë (1847):\n\n"There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner (Mrs. Reed, when there was no company, dined at one o\'clock) the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further out-door exercise was now out of the question."\n\nGive two things that show the weather was unpleasant.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The cold winter wind and penetrating rain show the weather was unpleasant.',
            markingCriteria: {
              breakdown: [
                'One weather feature identified (1 mark)',
                'Second weather feature identified (1 mark)',
                'Accept: cold winter wind, penetrating rain, sombre clouds'
              ]
            },
            specReference: 'Edexcel GCSE English Language 1EN0/01'
          },
          {
            id: 'edexcel-eng-q3',
            question: 'Read this extract from "The Strange Case of Dr Jekyll and Mr Hyde" by Robert Louis Stevenson (1886):\n\n"Mr. Utterson the lawyer was a man of a rugged countenance that was never lighted by a smile; cold, scanty and embarrassed in discourse; backward in sentiment; lean, long, dusty, dreary. And yet somehow lovable. At friendly meetings, and when the wine was to his taste, something eminently human beaconed from his eye; something indeed which never found its way into his talk, but which spoke not only in these silent symbols, but more often and loudly in the acts of his life."\n\nHow does the writer use language and structure to show Mr Utterson\'s character?',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Stevenson uses a series of adjectives "cold, scanty and embarrassed" to create a cumulative effect, building up an image of Utterson as socially awkward. The alliteration in "lean, long, dusty, dreary" emphasizes his unappealing physical appearance through harsh sounds. However, the contrasting phrase "And yet somehow lovable" acts as a turning point, using the conjunction "yet" to introduce contradiction. The metaphor "something eminently human beaconed from his eye" suggests warmth beneath the surface, with "beaconed" implying guidance and hope. The structure moves from negative external description to positive internal qualities, reflecting the duality theme of the novel.',
            markingCriteria: {
              breakdown: [
                'Analysis of adjectives and their effect (2 marks)',
                'Discussion of alliteration or sound devices (2 marks)',
                'Analysis of contrast/contradiction (2 marks)',
                'Comment on metaphor and its effect (2 marks)'
              ]
            },
            specReference: 'Edexcel GCSE English Language 1EN0/01'
          },
          {
            id: 'edexcel-eng-q4',
            question: 'Read this extract from "Wuthering Heights" by Emily Brontë (1847):\n\n"Wuthering Heights is the name of Mr. Heathcliff\'s dwelling. \'Wuthering\' being a significant provincial adjective, descriptive of the atmospheric tumult to which its station is exposed in stormy weather. Pure, bracing, ventilation they get up there at all times, indeed: one may guess the power of the north wind blowing over the edge, by the excessive slant of a few stunted firs at the end of the house; and by a range of gaunt thorns all stretching their limbs one way, as if craving alms of the sun."\n\nEvaluate how successfully the writer creates a sense of wildness and isolation.',
            marks: 15,
            difficulty: 'hard',
            modelAnswer: 'Brontë successfully creates wildness through her choice of vocabulary and imagery. The word "tumult" suggests chaos and violence, while "wuthering" itself implies harsh weather conditions. The personification of thorns "craving alms of the sun" effectively suggests desperation and need, creating sympathy while emphasizing the harsh environment. The "excessive slant" of trees provides concrete evidence of the wind\'s power, making the description believable. The isolation is conveyed through the remote "station" and the focus on natural forces rather than human presence. However, some readers might argue the descriptive language becomes overly elaborate, potentially distancing readers from the immediate sense of place. Overall, the combination of specific detail and figurative language successfully establishes the Gothic atmosphere central to the novel.',
            markingCriteria: {
              breakdown: [
                'Evaluation of language choices (4 marks)',
                'Analysis of imagery and literary devices (4 marks)',
                'Assessment of overall effectiveness (4 marks)',
                'Personal response with justification (2 marks)',
                'Quality of expression (1 mark)'
              ]
            },
            specReference: 'Edexcel GCSE English Language 1EN0/01'
          },
          {
            id: 'edexcel-eng-q5',
            question: 'Section B Writing Task:\n\nWrite about a time when you encountered something unexpected or mysterious.\n\nYou should aim to write approximately 300-400 words.',
            marks: 25,
            difficulty: 'medium',
            modelAnswer: 'This is a creative writing task. Students should demonstrate:\n- Engaging narrative voice and perspective\n- Vivid descriptive language and imagery\n- Effective structure with clear beginning, development and conclusion\n- Varied sentence structures and vocabulary\n- Accurate spelling, punctuation and grammar\n- Successful creation of atmosphere and mood\n- Original and imaginative content linked to the theme',
            markingCriteria: {
              breakdown: [
                'Content and organisation (15 marks): Ideas, structure, narrative voice',
                'Technical accuracy (10 marks): Spelling, punctuation, grammar, vocabulary'
              ]
            },
            specReference: 'Edexcel GCSE English Language 1EN0/01'
          }
        ]
      }
    ]
  }
];
