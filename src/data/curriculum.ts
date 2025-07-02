export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  modelAnswer?: string;
}

export const curriculum: Subject[] = [
  {
    id: "chemistry",
    name: "Chemistry",
    color: "bg-emerald-500",
    topics: [
      {
        id: "atomic-structure",
        name: "Atomic structure and the periodic table",
        questions: [
          {
            id: "chem-atom-1",
            text: "What is the atomic number of an element?",
            options: ["Number of protons", "Number of neutrons", "Number of electrons", "Mass number"],
            correctAnswer: "Number of protons",
            explanation: "The atomic number is defined as the number of protons in the nucleus of an atom.",
            marks: 1
          },
          {
            id: "chem-atom-2",
            text: "Describe the structure of an atom.",
            correctAnswer: "An atom consists of a central nucleus containing protons and neutrons, surrounded by electrons in energy levels or shells.",
            explanation: "Atoms have a nucleus at the center with protons (positive charge) and neutrons (no charge), while electrons (negative charge) orbit in shells around the nucleus.",
            marks: 3,
            modelAnswer: "An atom has a central nucleus containing positively charged protons and neutral neutrons. Negatively charged electrons orbit the nucleus in energy levels or electron shells. The number of protons equals the number of electrons in a neutral atom."
          },
          {
            id: "chem-atom-3",
            text: "What are isotopes?",
            correctAnswer: "Atoms of the same element with different numbers of neutrons",
            explanation: "Isotopes are atoms of the same element (same number of protons) but with different numbers of neutrons, giving them different mass numbers.",
            marks: 2
          },
          {
            id: "chem-atom-4",
            text: "How are electrons arranged in atoms?",
            correctAnswer: "Electrons are arranged in energy levels or shells around the nucleus",
            explanation: "Electrons occupy specific energy levels or shells around the nucleus, with the inner shells being filled before outer shells.",
            marks: 2
          },
          {
            id: "chem-atom-5",
            text: "What is the maximum number of electrons in the first shell?",
            options: ["2", "8", "18", "32"],
            correctAnswer: "2",
            explanation: "The first electron shell (closest to the nucleus) can hold a maximum of 2 electrons.",
            marks: 1
          },
          {
            id: "chem-atom-6",
            text: "Explain how the periodic table is arranged.",
            correctAnswer: "Elements are arranged in order of increasing atomic number, in periods (rows) and groups (columns)",
            explanation: "The periodic table arranges elements by atomic number, with periods showing electron shells and groups showing similar properties.",
            marks: 3,
            modelAnswer: "The periodic table is arranged with elements in order of increasing atomic number. Horizontal rows are called periods and represent the number of electron shells. Vertical columns are called groups and contain elements with similar chemical properties due to having the same number of electrons in their outer shell."
          },
          {
            id: "chem-atom-7",
            text: "What are the properties of Group 1 elements?",
            correctAnswer: "Alkali metals, highly reactive, soft, low melting points, react with water",
            explanation: "Group 1 elements are alkali metals that are very reactive, especially with water, and have one electron in their outer shell.",
            marks: 4
          },
          {
            id: "chem-atom-8",
            text: "What are noble gases and why are they unreactive?",
            correctAnswer: "Group 8 elements with full outer electron shells, making them stable and unreactive",
            explanation: "Noble gases have complete outer electron shells, giving them stable electronic configurations and making them chemically unreactive.",
            marks: 3
          },
          {
            id: "chem-atom-9",
            text: "Calculate the number of neutrons in Carbon-14.",
            correctAnswer: "8 neutrons",
            explanation: "Carbon has atomic number 6 (6 protons). Carbon-14 has mass number 14, so neutrons = 14 - 6 = 8.",
            marks: 2
          },
          {
            id: "chem-atom-10",
            text: "What happens to atomic radius as you go down a group?",
            options: ["Increases", "Decreases", "Stays the same", "Varies randomly"],
            correctAnswer: "Increases",
            explanation: "Atomic radius increases down a group because electrons are added to new, higher energy levels that are further from the nucleus.",
            marks: 1
          }
        ]
      },
      {
        id: "bonding-structure",
        name: "Bonding, structure, and the properties of matter",
        questions: [
          {
            id: "chem-bond-1",
            text: "What is ionic bonding?",
            correctAnswer: "Electrostatic attraction between oppositely charged ions",
            explanation: "Ionic bonding occurs when electrons are transferred from metal atoms to non-metal atoms, creating oppositely charged ions that attract each other.",
            marks: 2
          },
          {
            id: "chem-bond-2",
            text: "What is covalent bonding?",
            correctAnswer: "Sharing of electrons between atoms",
            explanation: "Covalent bonding involves the sharing of electron pairs between atoms, typically non-metals.",
            marks: 2
          },
          {
            id: "chem-bond-3",
            text: "Describe the structure of sodium chloride.",
            correctAnswer: "Giant ionic lattice structure with alternating Na+ and Cl- ions",
            explanation: "Sodium chloride has a regular 3D arrangement of sodium and chloride ions held together by ionic bonds.",
            marks: 3
          },
          {
            id: "chem-bond-4",
            text: "Why do ionic compounds have high melting points?",
            correctAnswer: "Strong electrostatic forces between ions require lots of energy to overcome",
            explanation: "The strong ionic bonds in the giant lattice structure require significant energy to break.",
            marks: 2
          },
          {
            id: "chem-bond-5",
            text: "What is metallic bonding?",
            correctAnswer: "Attraction between metal cations and delocalized electrons",
            explanation: "Metallic bonding involves a 'sea' of delocalized electrons that can move freely around metal cations.",
            marks: 2
          },
          {
            id: "chem-bond-6",
            text: "Explain why metals conduct electricity.",
            correctAnswer: "Delocalized electrons can move freely through the metal structure",
            explanation: "The mobile electrons in metallic bonding can carry electric current through the metal.",
            marks: 2
          },
          {
            id: "chem-bond-7",
            text: "What are the properties of simple molecular compounds?",
            correctAnswer: "Low melting/boiling points, don't conduct electricity, may dissolve in organic solvents",
            explanation: "Simple molecular compounds have weak intermolecular forces and strong intramolecular covalent bonds.",
            marks: 3
          },
          {
            id: "chem-bond-8",
            text: "What is diamond's structure and properties?",
            correctAnswer: "Giant covalent structure where each carbon is bonded to 4 others, making it very hard",
            explanation: "Diamond's tetrahedral structure with strong covalent bonds makes it extremely hard and high melting.",
            marks: 4
          },
          {
            id: "chem-bond-9",
            text: "Why is graphite soft but diamond hard?",
            correctAnswer: "Graphite has layers that can slide over each other, diamond has 3D network of strong bonds",
            explanation: "Graphite's layered structure allows layers to slide, while diamond's 3D network prevents this.",
            marks: 3
          },
          {
            id: "chem-bond-10",
            text: "What are polymers?",
            correctAnswer: "Large molecules made from many repeating units called monomers",
            explanation: "Polymers are formed when many small monomer molecules join together through polymerization reactions.",
            marks: 2
          }
        ]
      },
      {
        id: "quantitative-chemistry",
        name: "Quantitative chemistry",
        questions: [
          {
            id: "chem-quant-1",
            text: "What is the relative atomic mass?",
            correctAnswer: "Average mass of atoms of an element compared to 1/12 of carbon-12",
            explanation: "Relative atomic mass is the weighted average mass of atoms of an element relative to 1/12 of a carbon-12 atom.",
            marks: 2
          },
          {
            id: "chem-quant-2",
            text: "Calculate the relative formula mass of water (H₂O).",
            correctAnswer: "18",
            explanation: "H₂O = (2 × 1) + (1 × 16) = 18",
            marks: 2
          },
          {
            id: "chem-quant-3",
            text: "What is a mole?",
            correctAnswer: "The amount of substance containing 6.02 × 10²³ particles",
            explanation: "A mole is the amount of substance that contains Avogadro's number of particles (atoms, molecules, or ions).",
            marks: 2
          },
          {
            id: "chem-quant-4",
            text: "Calculate the number of moles in 44g of CO₂.",
            correctAnswer: "1 mole",
            explanation: "Moles = mass ÷ Mr. Mr of CO₂ = 12 + (2 × 16) = 44. So 44 ÷ 44 = 1 mole.",
            marks: 3
          },
          {
            id: "chem-quant-5",
            text: "What is the concentration equation?",
            correctAnswer: "Concentration = amount of solute ÷ volume of solution",
            explanation: "Concentration can be expressed as mol/dm³ or g/dm³ depending on units used.",
            marks: 2
          },
          {
            id: "chem-quant-6",
            text: "Calculate the concentration of 0.5 moles of NaCl in 2 dm³ of solution.",
            correctAnswer: "0.25 mol/dm³",
            explanation: "Concentration = 0.5 mol ÷ 2 dm³ = 0.25 mol/dm³",
            marks: 2
          },
          {
            id: "chem-quant-7",
            text: "What is percentage yield?",
            correctAnswer: "(Actual yield ÷ theoretical yield) × 100",
            explanation: "Percentage yield compares the actual amount of product obtained to the maximum theoretical amount possible.",
            marks: 2
          },
          {
            id: "chem-quant-8",
            text: "Why is percentage yield often less than 100%?",
            correctAnswer: "Due to incomplete reactions, side reactions, or product loss during separation",
            explanation: "Real reactions often don't go to completion and some product may be lost during purification.",
            marks: 3
          },
          {
            id: "chem-quant-9",
            text: "What is atom economy?",
            correctAnswer: "(Mr of desired product ÷ Mr of all products) × 100",
            explanation: "Atom economy measures the efficiency of a reaction in terms of how much of the reactants become useful products.",
            marks: 3
          },
          {
            id: "chem-quant-10",
            text: "Calculate the volume of 2 moles of gas at RTP.",
            correctAnswer: "48 dm³",
            explanation: "At room temperature and pressure, 1 mole of gas occupies 24 dm³, so 2 moles = 48 dm³.",
            marks: 2
          }
        ]
      },
      {
        id: "chemical-changes",
        name: "Chemical changes",
        questions: [
          {
            id: "chem-changes-1",
            text: "What is oxidation?",
            correctAnswer: "Loss of electrons or gain of oxygen",
            explanation: "Oxidation involves the loss of electrons, often accompanied by gaining oxygen or losing hydrogen.",
            marks: 2
          },
          {
            id: "chem-changes-2",
            text: "What is reduction?",
            correctAnswer: "Gain of electrons or loss of oxygen",
            explanation: "Reduction involves the gain of electrons, often accompanied by losing oxygen or gaining hydrogen.",
            marks: 2
          },
          {
            id: "chem-changes-3",
            text: "What happens when metals react with acids?",
            correctAnswer: "Metal + acid → salt + hydrogen",
            explanation: "Metals react with acids to produce a salt and hydrogen gas, with the metal being oxidized.",
            marks: 2
          },
          {
            id: "chem-changes-4",
            text: "Write the equation for the reaction of zinc with hydrochloric acid.",
            correctAnswer: "Zn + 2HCl → ZnCl₂ + H₂",
            explanation: "Zinc displaces hydrogen from hydrochloric acid to form zinc chloride and hydrogen gas.",
            marks: 3
          },
          {
            id: "chem-changes-5",
            text: "What is the reactivity series?",
            correctAnswer: "A list of metals arranged in order of their reactivity",
            explanation: "The reactivity series shows metals from most reactive (potassium) to least reactive (gold).",
            marks: 2
          },
          {
            id: "chem-changes-6",
            text: "How can you extract metals from their ores?",
            correctAnswer: "By reduction using carbon, electrolysis, or displacement reactions",
            explanation: "The method depends on the metal's reactivity - less reactive metals can be reduced with carbon.",
            marks: 3
          },
          {
            id: "chem-changes-7",
            text: "What is electrolysis?",
            correctAnswer: "The breakdown of ionic compounds using electricity",
            explanation: "Electrolysis uses electric current to decompose ionic compounds into their elements.",
            marks: 2
          },
          {
            id: "chem-changes-8",
            text: "What happens at the cathode during electrolysis?",
            correctAnswer: "Reduction - positive ions gain electrons",
            explanation: "At the cathode (negative electrode), positive ions are attracted and gain electrons (reduction).",
            marks: 2
          },
          {
            id: "chem-changes-9",
            text: "What is produced when copper sulfate solution is electrolyzed?",
            correctAnswer: "Copper at cathode, oxygen at anode",
            explanation: "Copper ions are reduced to copper metal at the cathode, while water is oxidized to oxygen at the anode.",
            marks: 3
          },
          {
            id: "chem-changes-10",
            text: "Why is aluminum extracted by electrolysis rather than reduction with carbon?",
            correctAnswer: "Aluminum is more reactive than carbon, so carbon cannot reduce aluminum oxide",
            explanation: "Aluminum is high in the reactivity series, so electrolysis is needed to provide enough energy for extraction.",
            marks: 3
          }
        ]
      },
      {
        id: "energy-changes",
        name: "Energy changes",
        questions: [
          {
            id: "chem-energy-1",
            text: "What is an exothermic reaction?",
            correctAnswer: "A reaction that releases energy to the surroundings",
            explanation: "Exothermic reactions give out energy, usually as heat, making the surroundings warmer.",
            marks: 2
          },
          {
            id: "chem-energy-2",
            text: "What is an endothermic reaction?",
            correctAnswer: "A reaction that absorbs energy from the surroundings",
            explanation: "Endothermic reactions take in energy from the surroundings, making them cooler.",
            marks: 2
          },
          {
            id: "chem-energy-3",
            text: "Give an example of an exothermic reaction.",
            correctAnswer: "Combustion, neutralization, or respiration",
            explanation: "Common exothermic reactions include burning fuels, acid-base neutralization, and cellular respiration.",
            marks: 1
          },
          {
            id: "chem-energy-4",
            text: "Give an example of an endothermic reaction.",
            correctAnswer: "Thermal decomposition or photosynthesis",
            explanation: "Endothermic reactions include thermal decomposition of carbonates and photosynthesis in plants.",
            marks: 1
          },
          {
            id: "chem-energy-5",
            text: "What is activation energy?",
            correctAnswer: "The minimum energy needed for a reaction to occur",
            explanation: "Activation energy is the energy barrier that must be overcome for reactants to form products.",
            marks: 2
          },
          {
            id: "chem-energy-6",
            text: "How do catalysts affect reactions?",
            correctAnswer: "They lower the activation energy and speed up reactions without being used up",
            explanation: "Catalysts provide an alternative pathway with lower activation energy, increasing reaction rate.",
            marks: 3
          },
          {
            id: "chem-energy-7",
            text: "What is bond breaking and bond forming in terms of energy?",
            correctAnswer: "Bond breaking is endothermic, bond forming is exothermic",
            explanation: "Energy is required to break bonds (endothermic) and energy is released when bonds form (exothermic).",
            marks: 2
          },
          {
            id: "chem-energy-8",
            text: "How can you calculate the energy change of a reaction?",
            correctAnswer: "Energy change = Energy required to break bonds - Energy released in forming bonds",
            explanation: "The overall energy change depends on the difference between energy input and energy output.",
            marks: 3
          },
          {
            id: "chem-energy-9",
            text: "What are cells and batteries?",
            correctAnswer: "Devices that produce electricity from chemical reactions",
            explanation: "Cells and batteries convert chemical energy into electrical energy through redox reactions.",
            marks: 2
          },
          {
            id: "chem-energy-10",
            text: "What is a fuel cell?",
            correctAnswer: "A device that produces electricity continuously from a fuel and oxygen",
            explanation: "Fuel cells generate electricity from the reaction between a fuel (like hydrogen) and oxygen.",
            marks: 2
          }
        ]
      },
      {
        id: "rate-extent-change",
        name: "The rate and extent of chemical change",
        questions: [
          {
            id: "chem-rate-1",
            text: "What is the rate of reaction?",
            correctAnswer: "How fast reactants are used up or products are formed",
            explanation: "Rate of reaction measures the change in concentration of reactants or products per unit time.",
            marks: 2
          },
          {
            id: "chem-rate-2",
            text: "Name four factors that affect the rate of reaction.",
            correctAnswer: "Temperature, concentration, surface area, and catalysts",
            explanation: "These factors affect the frequency and energy of collisions between particles.",
            marks: 2
          },
          {
            id: "chem-rate-3",
            text: "How does temperature affect reaction rate?",
            correctAnswer: "Higher temperature increases rate because particles move faster and collide more frequently with more energy",
            explanation: "Increased temperature gives particles more kinetic energy, leading to more successful collisions.",
            marks: 3
          },
          {
            id: "chem-rate-4",
            text: "How does concentration affect reaction rate?",
            correctAnswer: "Higher concentration increases rate because there are more particles in the same volume",
            explanation: "More particles per unit volume means more frequent collisions and faster reaction rate.",
            marks: 2
          },
          {
            id: "chem-rate-5",
            text: "How does surface area affect reaction rate?",
            correctAnswer: "Larger surface area increases rate because more particles are exposed to react",
            explanation: "Smaller particles or powders have larger surface area, allowing more collisions to occur.",
            marks: 2
          },
          {
            id: "chem-rate-6",
            text: "What is a reversible reaction?",
            correctAnswer: "A reaction where products can react to form the original reactants",
            explanation: "In reversible reactions, the forward and backward reactions can both occur.",
            marks: 2
          },
          {
            id: "chem-rate-7",
            text: "What is dynamic equilibrium?",
            correctAnswer: "When the rate of forward reaction equals the rate of backward reaction",
            explanation: "At equilibrium, concentrations remain constant because forward and reverse rates are equal.",
            marks: 2
          },
          {
            id: "chem-rate-8",
            text: "What is Le Chatelier's principle?",
            correctAnswer: "If conditions of an equilibrium are changed, the position shifts to oppose the change",
            explanation: "The equilibrium position moves to counteract any changes in temperature, pressure, or concentration.",
            marks: 3
          },
          {
            id: "chem-rate-9",
            text: "How does pressure affect equilibrium involving gases?",
            correctAnswer: "Increased pressure shifts equilibrium towards the side with fewer gas molecules",
            explanation: "The system responds to pressure changes by favoring the side that produces less gas.",
            marks: 3
          },
          {
            id: "chem-rate-10",
            text: "How does temperature affect equilibrium?",
            correctAnswer: "Higher temperature favors the endothermic direction, lower temperature favors exothermic direction",
            explanation: "The equilibrium shifts to oppose temperature changes according to Le Chatelier's principle.",
            marks: 3
          }
        ]
      },
      {
        id: "organic-chemistry",
        name: "Organic chemistry",
        questions: [
          {
            id: "chem-organic-1",
            text: "What are hydrocarbons?",
            correctAnswer: "Compounds containing only hydrogen and carbon atoms",
            explanation: "Hydrocarbons are organic compounds made up of only carbon and hydrogen atoms.",
            marks: 1
          },
          {
            id: "chem-organic-2",
            text: "What is the general formula for alkanes?",
            correctAnswer: "CₙH₂ₙ₊₂",
            explanation: "Alkanes are saturated hydrocarbons with single bonds only, following the formula CₙH₂ₙ₊₂.",
            marks: 1
          },
          {
            id: "chem-organic-3",
            text: "What is the general formula for alkenes?",
            correctAnswer: "CₙH₂ₙ",
            explanation: "Alkenes are unsaturated hydrocarbons with one double bond, following the formula CₙH₂ₙ.",
            marks: 1
          },
          {
            id: "chem-organic-4",
            text: "Name the first four alkanes.",
            correctAnswer: "Methane, ethane, propane, butane",
            explanation: "The first four alkanes in the homologous series are CH₄, C₂H₆, C₃H₈, and C₄H₁₀.",
            marks: 2
          },
          {
            id: "chem-organic-5",
            text: "What is the test for alkenes?",
            correctAnswer: "Bromine water turns from orange to colorless",
            explanation: "Alkenes decolorize bromine water due to the addition reaction across the double bond.",
            marks: 2
          },
          {
            id: "chem-organic-6",
            text: "What is complete combustion of hydrocarbons?",
            correctAnswer: "Hydrocarbon + oxygen → carbon dioxide + water",
            explanation: "Complete combustion occurs with sufficient oxygen, producing CO₂ and H₂O.",
            marks: 2
          },
          {
            id: "chem-organic-7",
            text: "What is incomplete combustion?",
            correctAnswer: "Combustion with insufficient oxygen producing carbon monoxide or carbon",
            explanation: "Incomplete combustion occurs with limited oxygen, producing dangerous carbon monoxide.",
            marks: 2
          },
          {
            id: "chem-organic-8",
            text: "What is cracking?",
            correctAnswer: "Breaking down large hydrocarbon molecules into smaller, more useful ones",
            explanation: "Cracking converts long-chain alkanes into shorter alkanes and alkenes using heat and catalysts.",
            marks: 2
          },
          {
            id: "chem-organic-9",
            text: "Write the equation for the complete combustion of methane.",
            correctAnswer: "CH₄ + 2O₂ → CO₂ + 2H₂O",
            explanation: "Methane burns completely in oxygen to produce carbon dioxide and water.",
            marks: 2
          },
          {
            id: "chem-organic-10",
            text: "What are the uses of different fractions from crude oil?",
            correctAnswer: "Petrol for cars, kerosene for planes, diesel for trucks, bitumen for roads",
            explanation: "Different fractions have different properties making them suitable for specific uses.",
            marks: 3
          }
        ]
      },
      {
        id: "chemical-analysis",
        name: "Chemical analysis",
        questions: [
          {
            id: "chem-analysis-1",
            text: "What is a pure substance in chemistry?",
            correctAnswer: "A substance that contains only one compound or element",
            explanation: "Pure substances have fixed melting and boiling points and contain no other substances.",
            marks: 2
          },
          {
            id: "chem-analysis-2",
            text: "How can you test the purity of a substance?",
            correctAnswer: "Measure its melting point and compare to known values",
            explanation: "Pure substances have sharp, specific melting points that can be compared to data books.",
            marks: 2
          },
          {
            id: "chem-analysis-3",
            text: "What is chromatography used for?",
            correctAnswer: "To separate and identify mixtures of substances",
            explanation: "Chromatography separates mixtures based on different solubilities in a solvent.",
            marks: 2
          },
          {
            id: "chem-analysis-4",
            text: "How do you calculate Rf values in chromatography?",
            correctAnswer: "Rf = distance moved by substance ÷ distance moved by solvent",
            explanation: "Rf values are ratios that help identify substances by comparing to known values.",
            marks: 2
          },
          {
            id: "chem-analysis-5",
            text: "What is the test for hydrogen gas?",
            correctAnswer: "Burning splint gives a 'pop' sound",
            explanation: "Hydrogen gas burns rapidly with oxygen producing a distinctive popping sound.",
            marks: 1
          },
          {
            id: "chem-analysis-6",
            text: "What is the test for oxygen gas?",
            correctAnswer: "Glowing splint relights",
            explanation: "Oxygen gas relights a glowing wooden splint because it supports combustion.",
            marks: 1
          },
          {
            id: "chem-analysis-7",
            text: "What is the test for carbon dioxide?",
            correctAnswer: "Limewater turns milky/cloudy",
            explanation: "Carbon dioxide reacts with calcium hydroxide (limewater) to form insoluble calcium carbonate.",
            marks: 1
          },
          {
            id: "chem-analysis-8",
            text: "What is the test for chlorine gas?",
            correctAnswer: "Damp litmus paper is bleached white",
            explanation: "Chlorine gas bleaches damp indicator paper by removing the color permanently.",
            marks: 1
          },
          {
            id: "chem-analysis-9",
            text: "How do you test for sulfate ions?",
            correctAnswer: "Add barium chloride solution - white precipitate forms",
            explanation: "Sulfate ions react with barium ions to form insoluble barium sulfate (white precipitate).",
            marks: 2
          },
          {
            id: "chem-analysis-10",
            text: "How do you test for halide ions?",
            correctAnswer: "Add silver nitrate solution - colored precipitates form",
            explanation: "Halide ions form colored precipitates with silver nitrate: white (Cl⁻), cream (Br⁻), yellow (I⁻).",
            marks: 3
          }
        ]
      },
      {
        id: "chemistry-atmosphere",
        name: "Chemistry of the atmosphere",
        questions: [
          {
            id: "chem-atmo-1",
            text: "What is the composition of today's atmosphere?",
            correctAnswer: "78% nitrogen, 21% oxygen, 1% other gases including carbon dioxide",
            explanation: "The current atmosphere is mostly nitrogen and oxygen with small amounts of other gases.",
            marks: 2
          },
          {
            id: "chem-atmo-2",
            text: "How did oxygen levels increase in the early atmosphere?",
            correctAnswer: "Through photosynthesis by early plants and algae",
            explanation: "Photosynthetic organisms produced oxygen as a waste product, gradually increasing atmospheric oxygen.",
            marks: 2
          },
          {
            id: "chem-atmo-3",
            text: "What human activities increase carbon dioxide levels?",
            correctAnswer: "Burning fossil fuels, deforestation, industrial processes",
            explanation: "These activities release stored carbon into the atmosphere as carbon dioxide.",
            marks: 2
          },
          {
            id: "chem-atmo-4",
            text: "What is the greenhouse effect?",
            correctAnswer: "Greenhouse gases trap heat in the atmosphere, warming the Earth",
            explanation: "Greenhouse gases absorb and re-emit infrared radiation, keeping the Earth warm.",
            marks: 2
          },
          {
            id: "chem-atmo-5",
            text: "Name three greenhouse gases.",
            correctAnswer: "Carbon dioxide, methane, water vapor",
            explanation: "These gases trap heat in the atmosphere contributing to global warming.",
            marks: 2
          },
          {
            id: "chem-atmo-6",
            text: "What are the effects of climate change?",
            correctAnswer: "Rising sea levels, extreme weather, melting ice caps, changing ecosystems",
            explanation: "Global warming causes various environmental changes affecting life on Earth.",
            marks: 3
          },
          {
            id: "chem-atmo-7",
            text: "What causes acid rain?",
            correctAnswer: "Sulfur dioxide and nitrogen oxides dissolving in rainwater",
            explanation: "These pollutant gases react with water in clouds to form acidic solutions.",
            marks: 2
          },
          {
            id: "chem-atmo-8",
            text: "What are the effects of acid rain?",
            correctAnswer: "Damages buildings, kills trees, acidifies lakes and rivers",
            explanation: "Acid rain corrodes limestone buildings and harms aquatic ecosystems.",
            marks: 3
          },
          {
            id: "chem-atmo-9",
            text: "How can we reduce air pollution?",
            correctAnswer: "Use renewable energy, catalytic converters, reduce fossil fuel use",
            explanation: "Various technologies and lifestyle changes can reduce harmful emissions.",
            marks: 3
          },
          {
            id: "chem-atmo-10",
            text: "What is carbon footprint?",
            correctAnswer: "The total amount of carbon dioxide released by human activities",
            explanation: "Carbon footprint measures the environmental impact of activities in terms of CO₂ emissions.",
            marks: 2
          }
        ]
      },
      {
        id: "using-resources",
        name: "Using resources",
        questions: [
          {
            id: "chem-resources-1",
            text: "What is sustainable development?",
            correctAnswer: "Meeting current needs without compromising future generations' ability to meet their needs",
            explanation: "Sustainable development balances economic, social, and environmental considerations.",
            marks: 2
          },
          {
            id: "chem-resources-2",
            text: "Why is recycling important?",
            correctAnswer: "Conserves resources, reduces waste, saves energy, protects environment",
            explanation: "Recycling reduces the need for raw materials and minimizes environmental impact.",
            marks: 2
          },
          {
            id: "chem-resources-3",
            text: "How is drinking water treated?",
            correctAnswer: "Filtration, sedimentation, chlorination to remove impurities and kill bacteria",
            explanation: "Water treatment involves physical and chemical processes to make water safe to drink.",
            marks: 3
          },
          {
            id: "chem-resources-4",
            text: "What is desalination?",
            correctAnswer: "Removing salt from seawater to produce fresh water",
            explanation: "Desalination processes like distillation and reverse osmosis produce fresh water from seawater.",
            marks: 2
          },
          {
            id: "chem-resources-5",
            text: "What are the problems with using finite resources?",
            correctAnswer: "They will run out, environmental damage from extraction, waste production",
            explanation: "Finite resources are limited and their use creates environmental and sustainability issues.",
            marks: 3
          },
          {
            id: "chem-resources-6",
            text: "What is a life cycle assessment?",
            correctAnswer: "Evaluating the environmental impact of a product throughout its entire life",
            explanation: "LCA considers raw material extraction, manufacture, use, and disposal impacts.",
            marks: 2
          },
          {
            id: "chem-resources-7",
            text: "How can metals be extracted from low-grade ores?",
            correctAnswer: "Phytomining using plants or bioleaching using bacteria",
            explanation: "These methods can extract metals from ores with low metal content economically.",
            marks: 3
          },
          {
            id: "chem-resources-8",
            text: "What are the advantages of recycling metals?",
            correctAnswer: "Less mining needed, saves energy, reduces waste, conserves resources",
            explanation: "Recycling metals is much more energy efficient than extracting from ores.",
            marks: 3
          },
          {
            id: "chem-resources-9",
            text: "What is the Haber process used for?",
            correctAnswer: "Manufacturing ammonia for fertilizers",
            explanation: "The Haber process combines nitrogen and hydrogen to make ammonia industrially.",
            marks: 2
          },
          {
            id: "chem-resources-10",
            text: "What are the conditions for the Haber process?",
            correctAnswer: "450°C, 200 atmospheres pressure, iron catalyst",
            explanation: "These compromise conditions balance reaction rate and yield for economic production.",
            marks: 3
          }
        ]
      },
      {
        id: "key-ideas",
        name: "Key ideas",
        questions: [
          {
            id: "chem-key-1",
            text: "What is the particle model of matter?",
            correctAnswer: "All matter is made of tiny particles that are constantly moving",
            explanation: "The particle model explains the behavior of solids, liquids, and gases.",
            marks: 2
          },
          {
            id: "chem-key-2",
            text: "How do particles behave in solids, liquids, and gases?",
            correctAnswer: "Solids: vibrate in fixed positions; Liquids: move around each other; Gases: move rapidly in all directions",
            explanation: "Particle movement and arrangement explain the properties of different states of matter.",
            marks: 3
          },
          {
            id: "chem-key-3",
            text: "What is the law of conservation of mass?",
            correctAnswer: "Mass is neither created nor destroyed in chemical reactions",
            explanation: "The total mass of reactants equals the total mass of products in a chemical reaction.",
            marks: 2
          },
          {
            id: "chem-key-4",
            text: "Why do chemical equations need to be balanced?",
            correctAnswer: "To obey the law of conservation of mass - same number of each type of atom on both sides",
            explanation: "Balanced equations show that atoms are rearranged but not created or destroyed.",
            marks: 2
          },
          {
            id: "chem-key-5",
            text: "What is the difference between elements, compounds, and mixtures?",
            correctAnswer: "Elements: one type of atom; Compounds: two or more elements chemically bonded; Mixtures: substances not chemically bonded",
            explanation: "These represent different levels of chemical combination and can be distinguished by their properties.",
            marks: 3
          },
          {
            id: "chem-key-6",
            text: "What is the difference between chemical and physical changes?",
            correctAnswer: "Chemical: new substances formed, often irreversible; Physical: no new substances, usually reversible",
            explanation: "Chemical changes involve breaking and forming bonds, while physical changes only affect appearance or state.",
            marks: 3
          },
          {
            id: "chem-key-7",
            text: "What evidence shows a chemical reaction has occurred?",
            correctAnswer: "Color change, gas produced, precipitate forms, temperature change, new smell",
            explanation: "These observable changes indicate that new substances have been formed.",
            marks: 2
          },
          {
            id: "chem-key-8",
            text: "What is the difference between accurate and precise results?",
            correctAnswer: "Accurate: close to true value; Precise: results are close to each other/reproducible",
            explanation: "Good scientific measurements should be both accurate (correct) and precise (consistent).",
            marks: 2
          },
          {
            id: "chem-key-9",
            text: "How can you increase the reliability of results?",
            correctAnswer: "Repeat experiments, calculate mean, identify and exclude anomalies",
            explanation: "Multiple measurements help identify errors and increase confidence in results.",
            marks: 2
          },
          {
            id: "chem-key-10",
            text: "What is the importance of peer review in science?",
            correctAnswer: "Other scientists check methods and conclusions before publication to ensure validity",
            explanation: "Peer review maintains scientific standards and helps prevent errors in published research.",
            marks: 2
          }
        ]
      }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    color: "bg-green-500",
    topics: [
      {
        id: "cell-biology",
        name: "Cell biology",
        questions: [
          {
            id: "bio-cell-1",
            text: "What are the differences between plant and animal cells?",
            correctAnswer: "Plant cells have cell wall, chloroplasts, and permanent vacuole; animal cells do not",
            explanation: "Plant cells have additional structures for photosynthesis and structural support.",
            marks: 3
          },
          {
            id: "bio-cell-2",
            text: "What is the function of the nucleus?",
            correctAnswer: "Controls cell activities and contains genetic material (DNA)",
            explanation: "The nucleus is the control center of the cell containing chromosomes.",
            marks: 2
          },
          {
            id: "bio-cell-3",
            text: "What is the function of mitochondria?",
            correctAnswer: "Site of aerobic respiration, releases energy for the cell",
            explanation: "Mitochondria are the powerhouses of the cell where glucose is broken down.",
            marks: 2
          },
          {
            id: "bio-cell-4",
            text: "What is the function of chloroplasts?",
            correctAnswer: "Site of photosynthesis, contains chlorophyll to absorb light",
            explanation: "Chloroplasts are found in plant cells and some protists for photosynthesis.",
            marks: 2
          },
          {
            id: "bio-cell-5",
            text: "What is cell differentiation?",
            correctAnswer: "The process by which cells become specialized for particular functions",
            explanation: "Cells develop specific structures and functions to perform particular roles.",
            marks: 2
          },
          {
            id: "bio-cell-6",
            text: "How are sperm cells adapted for their function?",
            correctAnswer: "Long tail for swimming, lots of mitochondria for energy, acrosome contains enzymes",
            explanation: "Sperm cells are specialized for fertilization with adaptations for motility and penetration.",
            marks: 3
          },
          {
            id: "bio-cell-7",
            text: "How are nerve cells adapted for their function?",
            correctAnswer: "Long axon to carry impulses, branched dendrites to connect to other cells, myelin sheath for insulation",
            explanation: "Nerve cells are specialized for rapid transmission of electrical impulses.",
            marks: 3
          },
          {
            id: "bio-cell-8",
            text: "What is the equation for magnification?",
            correctAnswer: "Magnification = Image size ÷ Actual size",
            explanation: "This formula allows calculation of how much larger an image appears compared to the real object.",
            marks: 2
          },
          {
            id: "bio-cell-9",
            text: "What is mitosis?",
            correctAnswer: "Cell division that produces two identical diploid cells for growth and repair",
            explanation: "Mitosis maintains chromosome number and produces genetically identical cells.",
            marks: 2
          },
          {
            id: "bio-cell-10",
            text: "What happens during the cell cycle?",
            correctAnswer: "Cell grows, DNA replicates, cell divides by mitosis to form two identical cells",
            explanation: "The cell cycle ensures controlled growth and replacement of damaged cells.",
            marks: 3
          }
        ]
      },
      {
        id: "organisation",
        name: "Organisation",
        questions: [
          {
            id: "bio-org-1",
            text: "What is the hierarchy of organization in multicellular organisms?",
            correctAnswer: "Cell → Tissue → Organ → Organ system → Organism",
            explanation: "Biological organization increases in complexity from cells to whole organisms.",
            marks: 2
          },
          {
            id: "bio-org-2",
            text: "What is the function of the digestive system?",
            correctAnswer: "To break down food into small molecules that can be absorbed into the blood",
            explanation: "The digestive system processes food to extract nutrients for the body.",
            marks: 2
          },
          {
            id: "bio-org-3",
            text: "What enzymes are involved in digestion?",
            correctAnswer: "Amylase breaks down starch, pepsin breaks down proteins, lipase breaks down fats",
            explanation: "Different enzymes are specific for breaking down different types of nutrients.",
            marks: 3
          },
          {
            id: "bio-org-4",
            text: "How does the small intestine adapt for absorption?",
            correctAnswer: "Long length, folded walls, villi and microvilli increase surface area",
            explanation: "These adaptations maximize the surface area for efficient nutrient absorption.",
            marks: 3
          },
          {
            id: "bio-org-5",
            text: "What is the function of the heart?",
            correctAnswer: "To pump blood around the body through the circulatory system",
            explanation: "The heart is a muscular pump that maintains blood circulation.",
            marks: 1
          },
          {
            id: "bio-org-6",
            text: "Describe the structure of the heart.",
            correctAnswer: "Four chambers: two atria (top) and two ventricles (bottom), separated by valves",
            explanation: "The heart's structure ensures one-way blood flow and separation of oxygenated and deoxygenated blood.",
            marks: 3
          },
          {
            id: "bio-org-7",
            text: "What is the difference between arteries, veins, and capillaries?",
            correctAnswer: "Arteries: thick walls, carry blood away from heart; Veins: valves, carry blood to heart; Capillaries: thin walls for exchange",
            explanation: "Each type of blood vessel is adapted for its specific function in circulation.",
            marks: 4
          },
          {
            id: "bio-org-8",
            text: "What does blood contain?",
            correctAnswer: "Red blood cells, white blood cells, platelets, and plasma",
            explanation: "Blood components have different functions including transport, immunity, and clotting.",
            marks: 2
          },
          {
            id: "bio-org-9",
            text: "How are leaves adapted for photosynthesis?",
            correctAnswer: "Large surface area, thin for gas exchange, chloroplasts in palisade cells, stomata for gas exchange",
            explanation: "Leaf structure maximizes light capture and gas exchange for efficient photosynthesis.",
            marks: 4
          },
          {
            id: "bio-org-10",
            text: "What is transpiration?",
            correctAnswer: "Loss of water vapor from leaves through stomata",
            explanation: "Transpiration helps transport water and minerals through the plant and cools the leaves.",
            marks: 2
          }
        ]
      },
      {
        id: "infection-response",
        name: "Infection and response",
        questions: [
          {
            id: "bio-infection-1",
            text: "What are pathogens?",
            correctAnswer: "Microorganisms that cause disease",
            explanation: "Pathogens include bacteria, viruses, fungi, and protists that can harm the host organism.",
            marks: 1
          },
          {
            id: "bio-infection-2",
            text: "How do pathogens spread?",
            correctAnswer: "Air, water, direct contact, vectors (like insects)",
            explanation: "Understanding transmission helps in preventing the spread of infectious diseases.",
            marks: 2
          },
          {
            id: "bio-infection-3",
            text: "What are the body's non-specific defenses?",
            correctAnswer: "Skin, mucus membranes, stomach acid, white blood cells",
            explanation: "These defenses work against all pathogens without being specific to particular diseases.",
            marks: 2
          },
          {
            id: "bio-infection-4",
            text: "What is the immune system?",
            correctAnswer: "The body's defense system against pathogens using white blood cells",
            explanation: "The immune system recognizes and destroys foreign substances and pathogens.",
            marks: 2
          },
          {
            id: "bio-infection-5",
            text: "How do white blood cells fight infection?",
            correctAnswer: "Phagocytosis (engulfing pathogens), producing antibodies, producing antitoxins",
            explanation: "White blood cells have different methods to neutralize and destroy pathogens.",
            marks: 3
          },
          {
            id: "bio-infection-6",
            text: "What is vaccination?",
            correctAnswer: "Introducing dead or inactive pathogens to stimulate immunity without causing disease",
            explanation: "Vaccines train the immune system to recognize and fight specific pathogens.",
            marks: 2
          },
          {
            id: "bio-infection-7",
            text: "How do antibiotics work?",
            correctAnswer: "They kill or inhibit the growth of bacteria",
            explanation: "Antibiotics are specific to bacteria and don't work against viral infections.",
            marks: 2
          },
          {
            id: "bio-infection-8",
            text: "What is antibiotic resistance?",
            correctAnswer: "When bacteria evolve to survive antibiotic treatment",
            explanation: "Overuse and misuse of antibiotics leads to resistant bacterial strains.",
            marks: 2
          },
          {
            id: "bio-infection-9",
            text: "How can we prevent antibiotic resistance?",
            correctAnswer: "Complete antibiotic courses, don't use for viral infections, develop new antibiotics",
            explanation: "Responsible antibiotic use helps maintain their effectiveness.",
            marks: 3
          },
          {
            id: "bio-infection-10",
            text: "What is herd immunity?",
            correctAnswer: "When enough people are immune to prevent disease spread in a population",
            explanation: "High vaccination rates protect even those who cannot be vaccinated.",
            marks: 2
          }
        ]
      },
      {
        id: "bioenergetics",
        name: "Bioenergetics",
        questions: [
          {
            id: "bio-energy-1",
            text: "What is the equation for photosynthesis?",
            correctAnswer: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (in the presence of light and chlorophyll)",
            explanation: "Photosynthesis converts carbon dioxide and water into glucose and oxygen using light energy.",
            marks: 3
          },
          {
            id: "bio-energy-2",
            text: "What factors affect the rate of photosynthesis?",
            correctAnswer: "Light intensity, carbon dioxide concentration, temperature",
            explanation: "These are limiting factors that can restrict the rate of photosynthesis.",
            marks: 2
          },
          {
            id: "bio-energy-3",
            text: "What is a limiting factor?",
            correctAnswer: "A factor that restricts the rate of a process when it is in short supply",
            explanation: "The factor in shortest supply limits the overall rate of the process.",
            marks: 2
          },
          {
            id: "bio-energy-4",
            text: "What is the equation for aerobic respiration?",
            correctAnswer: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP",
            explanation: "Aerobic respiration releases energy from glucose using oxygen to produce ATP.",
            marks: 3
          },
          {
            id: "bio-energy-5",
            text: "What is anaerobic respiration?",
            correctAnswer: "Respiration without oxygen, producing less ATP than aerobic respiration",
            explanation: "Anaerobic respiration occurs when oxygen is not available but produces less energy.",
            marks: 2
          },
          {
            id: "bio-energy-6",
            text: "What are the products of anaerobic respiration in animals?",
            correctAnswer: "Lactic acid (and ATP)",
            explanation: "In animals, anaerobic respiration produces lactic acid which can cause muscle fatigue.",
            marks: 2
          },
          {
            id: "bio-energy-7",
            text: "What are the products of anaerobic respiration in yeast?",
            correctAnswer: "Ethanol and carbon dioxide (and ATP)",
            explanation: "Yeast fermentation produces alcohol and CO₂, useful in brewing and baking.",
            marks: 2
          },
          {
            id: "bio-energy-8",
            text: "Why is ATP important?",
            correctAnswer: "It provides energy for cellular processes like muscle contraction and active transport",
            explanation: "ATP is the universal energy currency of cells, powering all energy-requiring processes.",
            marks: 2
          },
          {
            id: "bio-energy-9",
            text: "How do you test for the presence of glucose?",
            correctAnswer: "Benedict's test - blue to brick red when heated with glucose",
            explanation: "Benedict's reagent is a standard test for reducing sugars like glucose.",
            marks: 2
          },
          {
            id: "bio-energy-10",
            text: "How do you test for starch?",
            correctAnswer: "Iodine test - yellow/brown iodine turns blue/black with starch",
            explanation: "Iodine is a specific indicator for the presence of starch.",
            marks: 2
          }
        ]
      },
      {
        id: "homeostasis-response",
        name: "Homeostasis and response",
        questions: [
          {
            id: "bio-homeo-1",
            text: "What is homeostasis?",
            correctAnswer: "Maintaining constant internal conditions despite external changes",
            explanation: "Homeostasis keeps vital conditions like temperature and blood sugar stable.",
            marks: 2
          },
          {
            id: "bio-homeo-2",
            text: "What is negative feedback?",
            correctAnswer: "A control mechanism that counteracts changes to maintain stable conditions",
            explanation: "Negative feedback loops detect changes and trigger responses to restore balance.",
            marks: 2
          },
          {
            id: "bio-homeo-3",
            text: "How is body temperature controlled?",
            correctAnswer: "Hypothalamus detects changes; responses include sweating, shivering, vasodilation/vasoconstriction",
            explanation: "Temperature regulation involves both behavioral and physiological responses.",
            marks: 4
          },
          {
            id: "bio-homeo-4",
            text: "How is blood glucose controlled?",
            correctAnswer: "Pancreas produces insulin (lowers glucose) and glucagon (raises glucose)",
            explanation: "Hormonal control maintains blood glucose within narrow limits.",
            marks: 3
          },
          {
            id: "bio-homeo-5",
            text: "What is Type 1 diabetes?",
            correctAnswer: "Pancreas doesn't produce enough insulin, treated with insulin injections",
            explanation: "Type 1 diabetes is usually diagnosed in childhood and requires lifelong insulin treatment.",
            marks: 2
          },
          {
            id: "bio-homeo-6",
            text: "What is Type 2 diabetes?",
            correctAnswer: "Body becomes resistant to insulin, managed by diet and exercise",
            explanation: "Type 2 diabetes is often linked to lifestyle and can sometimes be reversed.",
            marks: 2
          },
          {
            id: "bio-homeo-7",
            text: "What is the nervous system?",
            correctAnswer: "A communication system using electrical impulses for rapid responses",
            explanation: "The nervous system coordinates rapid responses to internal and external stimuli.",
            marks: 2
          },
          {
            id: "bio-homeo-8",
            text: "What is a reflex action?",
            correctAnswer: "Automatic, rapid response to a stimulus that doesn't involve conscious thought",
            explanation: "Reflexes protect the body by providing immediate responses to potential harm.",
            marks: 2
          },
          {
            id: "bio-homeo-9",
            text: "What is the pathway of a reflex arc?",
            correctAnswer: "Stimulus → Receptor → Sensory neuron → Relay neuron → Motor neuron → Effector → Response",
            explanation: "The reflex arc allows rapid responses without involving the brain's conscious control.",
            marks: 3
          },
          {
            id: "bio-homeo-10",
            text: "What are hormones?",
            correctAnswer: "Chemical messengers produced by glands and transported in blood",
            explanation: "Hormones coordinate slower, longer-lasting responses compared to nerve impulses.",
            marks: 2
          }
        ]
      },
      {
        id: "inheritance-variation-evolution",
        name: "Inheritance, variation and evolution",
        questions: [
          {
            id: "bio-inherit-1",
            text: "What is DNA?",
            correctAnswer: "Deoxyribonucleic acid - the chemical that contains genetic information",
            explanation: "DNA stores the instructions for making proteins and determining characteristics.",
            marks: 2
          },
          {
            id: "bio-inherit-2",
            text: "Where is DNA found?",
            correctAnswer: "In the nucleus of cells, organized into chromosomes",
            explanation: "DNA is packaged into chromosomes which contain many genes.",
            marks: 2
          },
          {
            id: "bio-inherit-3",
            text: "What is a gene?",
            correctAnswer: "A section of DNA that codes for a particular characteristic",
            explanation: "Genes are the basic units of inheritance that determine traits.",
            marks: 2
          },
          {
            id: "bio-inherit-4",
            text: "What are alleles?",
            correctAnswer: "Different versions of the same gene",
            explanation: "Alleles are alternative forms of a gene that can produce different traits.",
            marks: 2
          },
          {
            id: "bio-inherit-5",
            text: "What is the difference between dominant and recessive alleles?",
            correctAnswer: "Dominant alleles are expressed when present; recessive alleles only expressed when homozygous",
            explanation: "Dominant alleles mask the expression of recessive alleles in heterozygotes.",
            marks: 3
          },
          {
            id: "bio-inherit-6",
            text: "What causes variation?",
            correctAnswer: "Genetic factors (inherited from parents) and environmental factors",
            explanation: "Variation results from both genetic differences and environmental influences.",
            marks: 2
          },
          {
            id: "bio-inherit-7",
            text: "What is natural selection?",
            correctAnswer: "Individuals with advantageous characteristics are more likely to survive and reproduce",
            explanation: "Natural selection is the mechanism by which evolution occurs over time.",
            marks: 2
          },
          {
            id: "bio-inherit-8",
            text: "What evidence supports evolution?",
            correctAnswer: "Fossils, DNA similarities, anatomical similarities, observed changes",
            explanation: "Multiple lines of evidence support the theory of evolution by natural selection.",
            marks: 3
          },
          {
            id: "bio-inherit-9",
            text: "What is selective breeding?",
            correctAnswer: "Choosing organisms with desired characteristics to breed together",
            explanation: "Selective breeding allows humans to develop organisms with particular traits.",
            marks: 2
          },
          {
            id: "bio-inherit-10",
            text: "What is genetic engineering?",
            correctAnswer: "Modifying the genome of an organism by introducing genes from another organism",
            explanation: "Genetic engineering allows direct modification of DNA to produce desired characteristics.",
            marks: 2
          }
        ]
      },
      {
        id: "ecology",
        name: "Ecology",
        questions: [
          {
            id: "bio-ecology-1",
            text: "What is an ecosystem?",
            correctAnswer: "All the organisms living in an area and their interactions with each other and the environment",
            explanation: "Ecosystems include both living (biotic) and non-living (abiotic) components.",
            marks: 2
          },
          {
            id: "bio-ecology-2",
            text: "What is a food chain?",
            correctAnswer: "A sequence showing how energy flows from one organism to another",
            explanation: "Food chains show the transfer of energy through feeding relationships.",
            marks: 2
          },
          {
            id: "bio-ecology-3",
            text: "What are producers, primary consumers, and secondary consumers?",
            correctAnswer: "Producers make food by photosynthesis; primary consumers eat producers; secondary consumers eat primary consumers",
            explanation: "These represent different trophic levels in food chains and webs.",
            marks: 3
          },
          {
            id: "bio-ecology-4",
            text: "What happens to energy in food chains?",
            correctAnswer: "Energy is lost at each level through respiration, movement, and heat, so chains are usually short",
            explanation: "Energy transfer is inefficient, limiting the length of food chains.",
            marks: 3
          },
          {
            id: "bio-ecology-5",
            text: "What is the carbon cycle?",
            correctAnswer: "The circulation of carbon through the atmosphere, plants, animals, and decomposers",
            explanation: "The carbon cycle shows how carbon moves between different reservoirs in nature.",
            marks: 2
          },
          {
            id: "bio-ecology-6",
            text: "How is carbon dioxide removed from the atmosphere?",
            correctAnswer: "By photosynthesis in plants and algae",
            explanation: "Photosynthetic organisms convert atmospheric CO₂ into organic compounds.",
            marks: 2
          },
          {
            id: "bio-ecology-7",
            text: "How is carbon dioxide returned to the atmosphere?",
            correctAnswer: "By respiration in all living organisms and combustion of fossil fuels",
            explanation: "These processes release stored carbon back to the atmosphere as CO₂.",
            marks: 2
          },
          {
            id: "bio-ecology-8",
            text: "What factors affect population size?",
            correctAnswer: "Food availability, predation, disease, competition, habitat size",
            explanation: "These factors determine the carrying capacity of an environment for a species.",
            marks: 3
          },
          {
            id: "bio-ecology-9",
            text: "What is biodiversity?",
            correctAnswer: "The variety of different species in an ecosystem",
            explanation: "Biodiversity measures the richness and variety of life in an area.",
            marks: 2
          },
          {
            id: "bio-ecology-10",
            text: "How do humans affect ecosystems?",
            correctAnswer: "Deforestation, pollution, overfishing, habitat destruction, climate change",
            explanation: "Human activities can reduce biodiversity and disrupt ecological balance.",
            marks: 3
          }
        ]
      },
      {
        id: "key-ideas-bio",
        name: "Key ideas",
        questions: [
          {
            id: "bio-key-1",
            text: "What are the characteristics of living organisms?",
            correctAnswer: "Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition (MRS GREN)",
            explanation: "These seven characteristics define what it means to be alive.",
            marks: 3
          },
          {
            id: "bio-key-2",
            text: "What is the difference between unicellular and multicellular organisms?",
            correctAnswer: "Unicellular: made of one cell; Multicellular: made of many cells working together",
            explanation: "Complexity increases from single-celled to multi-celled organisms.",
            marks: 2
          },
          {
            id: "bio-key-3",
            text: "What is the difference between prokaryotic and eukaryotic cells?",
            correctAnswer: "Prokaryotic: no nucleus (bacteria); Eukaryotic: has nucleus (plants, animals, fungi)",
            explanation: "The presence or absence of a membrane-bound nucleus is the key difference.",
            marks: 2
          },
          {
            id: "bio-key-4",
            text: "What is enzyme specificity?",
            correctAnswer: "Each enzyme only works on one specific substrate due to the active site shape",
            explanation: "The lock and key model explains how enzymes are specific to their substrates.",
            marks: 2
          },
          {
            id: "bio-key-5",
            text: "How does pH affect enzyme activity?",
            correctAnswer: "Enzymes have an optimum pH; too high or low pH denatures the enzyme",
            explanation: "Extreme pH values change the enzyme's shape, affecting its function.",
            marks: 2
          },
          {
            id: "bio-key-6",
            text: "How does temperature affect enzyme activity?",
            correctAnswer: "Higher temperature increases activity up to optimum, then enzyme denatures",
            explanation: "Temperature affects molecular movement and enzyme structure.",
            marks: 2
          },
          {
            id: "bio-key-7",
            text: "What is diffusion?",
            correctAnswer: "Movement of particles from high to low concentration down a concentration gradient",
            explanation: "Diffusion is a passive process that doesn't require energy input.",
            marks: 2
          },
          {
            id: "bio-key-8",
            text: "What is osmosis?",
            correctAnswer: "Movement of water through a partially permeable membrane from high to low water concentration",
            explanation: "Osmosis is the diffusion of water across cell membranes.",
            marks: 2
          },
          {
            id: "bio-key-9",
            text: "What is active transport?",
            correctAnswer: "Movement of substances against concentration gradient using energy",
            explanation: "Active transport allows cells to accumulate substances even when working against gradients.",
            marks: 2
          },
          {
            id: "bio-key-10",
            text: "Why is surface area to volume ratio important?",
            correctAnswer: "Small organisms have high SA:V ratio for efficient exchange; large organisms need special systems",
            explanation: "This ratio determines how efficiently materials can be exchanged with the environment.",
            marks: 3
          }
        ]
      }
    ]
  },
  {
    id: "maths",
    name: "Maths",
    color: "bg-blue-500",
    topics: [
      {
        id: "number",
        name: "Number",
        questions: [
          {
            id: "math-num-1",
            text: "Calculate 2.4 × 1.5",
            correctAnswer: "3.6",
            explanation: "Multiply as whole numbers (24 × 15 = 360) then place decimal point to give 2 decimal places total.",
            marks: 2
          },
          {
            id: "math-num-2",
            text: "Express 3/5 as a percentage",
            correctAnswer: "60%",
            explanation: "3/5 = 0.6 = 60/100 = 60%",
            marks: 1
          },
          {
            id: "math-num-3",
            text: "Find the HCF of 24 and 36",
            correctAnswer: "12",
            explanation: "Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. Highest common factor is 12.",
            marks: 2
          },
          {
            id: "math-num-4",
            text: "Find the LCM of 4 and 6",
            correctAnswer: "12",
            explanation: "Multiples of 4: 4,8,12,16... Multiples of 6: 6,12,18... Lowest common multiple is 12.",
            marks: 2
          },
          {
            id: "math-num-5",
            text: "Calculate 2³ × 2²",
            correctAnswer: "32 or 2⁵",
            explanation: "2³ × 2² = 2³⁺² = 2⁵ = 32 (when multiplying powers of same base, add the indices)",
            marks: 2
          },
          {
            id: "math-num-6",
            text: "Simplify √50",
            correctAnswer: "5√2",
            explanation: "√50 = √(25 × 2) = √25 × √2 = 5√2",
            marks: 2
          },
          {
            id: "math-num-7",
            text: "Round 4.736 to 2 decimal places",
            correctAnswer: "4.74",
            explanation: "Look at the third decimal place (6). Since 6 ≥ 5, round up the second decimal place from 3 to 4.",
            marks: 1
          },
          {
            id: "math-num-8",
            text: "Calculate 15% of 80",
            correctAnswer: "12",
            explanation: "15% of 80 = 15/100 × 80 = 0.15 × 80 = 12",
            marks: 2
          },
          {
            id: "math-num-9",
            text: "A shirt costs £25. In a sale, it is reduced by 20%. What is the sale price?",
            correctAnswer: "£20",
            explanation: "20% of £25 = 0.2 × 25 = £5. Sale price = £25 - £5 = £20",
            marks: 2
          },
          {
            id: "math-num-10",
            text: "Express 0.125 as a fraction in its simplest form",
            correctAnswer: "1/8",
            explanation: "0.125 = 125/1000. Divide both by 125: 125÷125 = 1, 1000÷125 = 8. So 0.125 = 1/8",
            marks: 2
          }
        ]
      },
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            id: "math-alg-1",
            text: "Solve 3x + 7 = 22",
            correctAnswer: "x = 5",
            explanation: "3x + 7 = 22. Subtract 7: 3x = 15. Divide by 3: x = 5",
            marks: 2
          },
          {
            id: "math-alg-2",
            text: "Expand 3(x + 4)",
            correctAnswer: "3x + 12",
            explanation: "Multiply each term inside the bracket by 3: 3 × x + 3 × 4 = 3x + 12",
            marks: 1
          },
          {
            id: "math-alg-3",
            text: "Factorise x² + 5x + 6",
            correctAnswer: "(x + 2)(x + 3)",
            explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3. So x² + 5x + 6 = (x + 2)(x + 3)",
            marks: 2
          },
          {
            id: "math-alg-4",
            text: "Solve the simultaneous equations: x + y = 7, x - y = 1",
            correctAnswer: "x = 4, y = 3",
            explanation: "Add equations: 2x = 8, so x = 4. Substitute: 4 + y = 7, so y = 3",
            marks: 3
          },
          {
            id: "math-alg-5",
            text: "Solve x² - 9 = 0",
            correctAnswer: "x = 3 or x = -3",
            explanation: "x² = 9. Taking square root of both sides: x = ±3",
            marks: 2
          },
          {
            id: "math-alg-6",
            text: "Find the gradient of the line passing through (1,3) and (5,11)",
            correctAnswer: "2",
            explanation: "Gradient = (y₂-y₁)/(x₂-x₁) = (11-3)/(5-1) = 8/4 = 2",
            marks: 2
          },
          {
            id: "math-alg-7",
            text: "What is the equation of the line with gradient 2 passing through (0,5)?",
            correctAnswer: "y = 2x + 5",
            explanation: "Using y = mx + c where m = 2 and c = 5 (y-intercept), so y = 2x + 5",
            marks: 2
          },
          {
            id: "math-alg-8",
            text: "Solve 2x² + 7x + 3 = 0",
            correctAnswer: "x = -1/2 or x = -3",
            explanation: "Factorises to (2x + 1)(x + 3) = 0. So 2x + 1 = 0 giving x = -1/2, or x + 3 = 0 giving x = -3",
            marks: 3
          },
          {
            id: "math-alg-9",
            text: "Simplify 2x + 3x - 5x",
            correctAnswer: "0 or 0x",
            explanation: "Collect like terms: 2x + 3x - 5x = (2 + 3 - 5)x = 0x = 0",
            marks: 1
          },
          {
            id: "math-alg-10",
            text: "If y = x² + 2x - 3, find y when x = 2",
            correctAnswer: "5",
            explanation: "Substitute x = 2: y = 2² + 2(2) - 3 = 4 + 4 - 3 = 5",
            marks: 2
          }
        ]
      },
      {
        id: "ratio-proportion-rates",
        name: "Ratio, proportion and rates of change",
        questions: [
          {
            id: "math-ratio-1",
            text: "Simplify the ratio 12:18",
            correctAnswer: "2:3",
            explanation: "Divide both parts by their HCF (6): 12÷6 = 2, 18÷6 = 3. So 12:18 = 2:3",
            marks: 1
          },
          {
            id: "math-ratio-2",
            text: "Share £60 in the ratio 2:3",
            correctAnswer: "£24 and £36",
            explanation: "Total parts = 2+3 = 5. Each part = £60÷5 = £12. First share = 2×£12 = £24, Second share = 3×£12 = £36",
            marks: 2
          },
          {
            id: "math-ratio-3",
            text: "If 5 apples cost £2, how much do 8 apples cost?",
            correctAnswer: "£3.20",
            explanation: "Cost per apple = £2÷5 = £0.40. Cost of 8 apples = 8×£0.40 = £3.20",
            marks: 2
          },
          {
            id: "math-ratio-4",
            text: "A recipe for 4 people uses 200g flour. How much flour for 6 people?",
            correctAnswer: "300g",
            explanation: "Flour per person = 200g÷4 = 50g. For 6 people = 6×50g = 300g",
            marks: 2
          },
          {
            id: "math-ratio-5",
            text: "Convert 72 km/h to m/s",
            correctAnswer: "20 m/s",
            explanation: "72 km/h = 72×1000m ÷ 3600s = 72000÷3600 = 20 m/s",
            marks: 2
          },
          {
            id: "math-ratio-6",
            text: "If y is directly proportional to x and y = 12 when x = 4, find y when x = 7",
            correctAnswer: "21",
            explanation: "y ∝ x means y = kx. When y = 12, x = 4: 12 = 4k, so k = 3. When x = 7: y = 3×7 = 21",
            marks: 3
          },
          {
            id: "math-ratio-7",
            text: "If y is inversely proportional to x and y = 8 when x = 3, find y when x = 6",
            correctAnswer: "4",
            explanation: "y ∝ 1/x means y = k/x. When y = 8, x = 3: 8 = k/3, so k = 24. When x = 6: y = 24/6 = 4",
            marks: 3
          },
          {
            id: "math-ratio-8",
            text: "A car travels 150 miles in 3 hours. What is its average speed?",
            correctAnswer: "50 mph",
            explanation: "Average speed = total distance ÷ total time = 150 miles ÷ 3 hours = 50 mph",
            marks: 2
          },
          {
            id: "math-ratio-9",
            text: "Express 3:4 as a percentage of the whole",
            correctAnswer: "3 parts = 42.9%, 4 parts = 57.1%",
            explanation: "Total parts = 3+4 = 7. First part = 3/7 × 100% = 42.9%, Second part = 4/7 × 100% = 57.1%",
            marks: 3
          },
          {
            id: "math-ratio-10",
            text: "A map has scale 1:50000. What actual distance does 4cm represent?",
            correctAnswer: "2 km",
            explanation: "4cm on map = 4×50000 cm actual = 200000 cm = 2000 m = 2 km",
            marks: 2
          }
        ]
      },
      {
        id: "geometry-measures",
        name: "Geometry and measures",
        questions: [
          {
            id: "math-geom-1",
            text: "Find the area of a rectangle with length 8cm and width 5cm",
            correctAnswer: "40 cm²",
            explanation: "Area of rectangle = length × width = 8cm × 5cm = 40 cm²",
            marks: 1
          },
          {
            id: "math-geom-2",
            text: "Find the circumference of a circle with radius 7cm (use π = 22/7)",
            correctAnswer: "44 cm",
            explanation: "Circumference = 2πr = 2 × (22/7) × 7 = 2 × 22 = 44 cm",
            marks: 2
          },
          {
            id: "math-geom-3",
            text: "Find the area of a triangle with base 10cm and height 6cm",
            correctAnswer: "30 cm²",
            explanation: "Area of triangle = ½ × base × height = ½ × 10 × 6 = 30 cm²",
            marks: 2
          },
          {
            id: "math-geom-4",
            text: "What is the sum of interior angles in a pentagon?",
            correctAnswer: "540°",
            explanation: "Sum of interior angles = (n-2) × 180° where n = 5. So (5-2) × 180° = 3 × 180° = 540°",
            marks: 2
          },
          {
            id: "math-geom-5",
            text: "Find the volume of a cuboid with dimensions 4cm × 3cm × 5cm",
            correctAnswer: "60 cm³",
            explanation: "Volume of cuboid = length × width × height = 4 × 3 × 5 = 60 cm³",
            marks: 2
          },
          {
            id: "math-geom-6",
            text: "Two angles in a triangle are 45° and 65°. Find the third angle.",
            correctAnswer: "70°",
            explanation: "Sum of angles in triangle = 180°. Third angle = 180° - 45° - 65° = 70°",
            marks: 2
          },
          {
            id: "math-geom-7",
            text: "Find the length of the hypotenuse in a right triangle with sides 3cm and 4cm",
            correctAnswer: "5 cm",
            explanation: "Using Pythagoras: c² = a² + b² = 3² + 4² = 9 + 16 = 25. So c = √25 = 5 cm",
            marks: 2
          },
          {
            id: "math-geom-8",
            text: "What type of triangle has all sides equal?",
            correctAnswer: "Equilateral triangle",
            explanation: "An equilateral triangle has all three sides equal and all angles equal to 60°",
            marks: 1
          },
          {
            id: "math-geom-9",
            text: "Find the area of a circle with radius 10cm (use π = 3.14)",
            correctAnswer: "314 cm²",
            explanation: "Area of circle = πr² = 3.14 × 10² = 3.14 × 100 = 314 cm²",
            marks: 2
          },
          {
            id: "math-geom-10",
            text: "How many lines of symmetry does a regular hexagon have?",
            correctAnswer: "6",
            explanation: "A regular hexagon has 6 lines of symmetry - 3 through opposite vertices and 3 through midpoints of opposite sides",
            marks: 2
          }
        ]
      },
      {
        id: "probability",
        name: "Probability",
        questions: [
          {
            id: "math-prob-1",
            text: "What is the probability of getting heads when flipping a fair coin?",
            correctAnswer: "1/2 or 0.5",
            explanation: "There are 2 equally likely outcomes (heads, tails), so P(heads) = 1/2",
            marks: 1
          },
          {
            id: "math-prob-2",
            text: "A bag contains 3 red balls and 7 blue balls. What is the probability of drawing a red ball?",
            correctAnswer: "3/10 or 0.3",
            explanation: "Total balls = 3+7 = 10. P(red) = number of red balls / total balls = 3/10",
            marks: 2
          },
          {
            id: "math-prob-3",
            text: "What is the probability of rolling a 6 on a fair dice?",
            correctAnswer: "1/6",
            explanation: "A dice has 6 equally likely outcomes (1,2,3,4,5,6), so P(6) = 1/6",
            marks: 1
          },
          {
            id: "math-prob-4",
            text: "Two coins are flipped. What is the probability of getting two heads?",
            correctAnswer: "1/4 or 0.25",
            explanation: "Possible outcomes: HH, HT, TH, TT. Only 1 out of 4 outcomes gives two heads, so P(HH) = 1/4",
            marks: 2
          },
          {
            id: "math-prob-5",
            text: "A card is drawn from a standard deck. What is the probability it's a heart?",
            correctAnswer: "1/4 or 0.25",
            explanation: "A standard deck has 52 cards with 13 hearts. P(heart) = 13/52 = 1/4",
            marks: 2
          },
          {
            id: "math-prob-6",
            text: "The probability of rain is 0.3. What is the probability it doesn't rain?",
            correctAnswer: "0.7",
            explanation: "P(not rain) = 1 - P(rain) = 1 - 0.3 = 0.7",
            marks: 1
          },
          {
            id: "math-prob-7",
            text: "A dice is rolled twice. What is the probability of getting two 6s?",
            correctAnswer: "1/36",
            explanation: "P(6 on first roll) = 1/6, P(6 on second roll) = 1/6. P(both 6s) = 1/6 × 1/6 = 1/36",
            marks: 2
          },
          {
            id: "math-prob-8",
            text: "In 100 throws of a coin, how many heads would you expect?",
            correctAnswer: "50",
            explanation: "Expected value = probability × number of trials = 1/2 × 100 = 50",
            marks: 2
          },
          {
            id: "math-prob-9",
            text: "A spinner has sections colored red, blue, and green in ratio 2:3:5. What's the probability of landing on blue?",
            correctAnswer: "3/10 or 0.3",
            explanation: "Total parts = 2+3+5 = 10. Blue has 3 parts, so P(blue) = 3/10",
            marks: 2
          },
          {
            id: "math-prob-10",
            text: "From a bag of 20 balls (12 red, 8 blue), two balls are drawn without replacement. What's the probability both are red?",
            correctAnswer: "33/95",
            explanation: "P(1st red) = 12/20, P(2nd red|1st red) = 11/19. P(both red) = 12/20 × 11/19 = 132/380 = 33/95",
            marks: 3
          }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        questions: [
          {
            id: "math-stats-1",
            text: "Find the mean of: 4, 7, 9, 12, 8",
            correctAnswer: "8",
            explanation: "Mean = sum ÷ number of values = (4+7+9+12+8) ÷ 5 = 40 ÷ 5 = 8",
            marks: 2
          },
          {
            id: "math-stats-2",
            text: "Find the median of: 3, 7, 1, 9, 5, 2, 8",
            correctAnswer: "5",
            explanation: "First arrange in order: 1, 2, 3, 5, 7, 8, 9. The median is the middle value = 5",
            marks: 2
          },
          {
            id: "math-stats-3",
            text: "Find the mode of: 2, 5, 3, 5, 7, 5, 9",
            correctAnswer: "5",
            explanation: "The mode is the most frequently occurring value. 5 appears 3 times, more than any other value",
            marks: 1
          },
          {
            id: "math-stats-4",
            text: "Find the range of: 12, 8, 15, 6, 11, 9",
            correctAnswer: "9",
            explanation: "Range = highest value - lowest value = 15 - 6 = 9",
            marks: 1
          },
          {
            id: "math-stats-5",
            text: "The mean of 5 numbers is 8. Four of the numbers are 6, 7, 9, 10. Find the fifth number.",
            correctAnswer: "8",
            explanation: "Sum of 5 numbers = 5 × 8 = 40. Sum of four numbers = 6+7+9+10 = 32. Fifth number = 40-32 = 8",
            marks: 2
          },
          {
            id: "math-stats-6",
            text: "Draw a frequency table for the data: A, B, A, C, B, A, C, A, B",
            correctAnswer: "A: 4, B: 3, C: 2",
            explanation: "Count each letter: A appears 4 times, B appears 3 times, C appears 2 times",
            marks: 2
          },
          {
            id: "math-stats-7",
            text: "What type of correlation does this describe: As temperature increases, ice cream sales increase",
            correctAnswer: "Positive correlation",
            explanation: "When both variables increase together, there is positive correlation",
            marks: 1
          },
          {
            id: "math-stats-8",
            text: "Find the median of: 4, 6, 8, 10",
            correctAnswer: "7",
            explanation: "With an even number of values, median = average of middle two values = (6+8)÷2 = 7",
            marks: 2
          },
          {
            id: "math-stats-9",
            text: "A pie chart shows test scores. If the 'Grade A' sector has angle 72°, what fraction of students got Grade A?",
            correctAnswer: "1/5 or 0.2",
            explanation: "Fraction = sector angle ÷ 360° = 72° ÷ 360° = 1/5",
            marks: 2
          },
          {
            id: "math-stats-10",
            text: "From a sample of 50 people, 30 prefer tea and 20 prefer coffee. Estimate how many prefer tea in a population of 1000.",
            correctAnswer: "600",
            explanation: "Proportion preferring tea = 30/50 = 3/5. In population of 1000: 1000 × 3/5 = 600",
            marks: 2
          }
        ]
      }
    ]
  }
];
