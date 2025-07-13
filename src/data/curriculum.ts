
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
            question: 'Calculate 3.7 × 2.4 without using a calculator.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '3.7 × 2.4 = 8.88',
            markingCriteria: {
              breakdown: ['Correct multiplication method (1 mark)', 'Correct answer 8.88 (1 mark)']
            },
            specReference: 'M1.1',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q2',
            question: 'Express 0.45 as a fraction in its simplest form.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '0.45 = 45/100 = 9/20',
            markingCriteria: {
              breakdown: ['Converting to fraction 45/100 (1 mark)', 'Simplifying to 9/20 (1 mark)']
            },
            specReference: 'M1.2',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q3',
            question: 'Find the HCF of 24 and 36.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. HCF = 12',
            markingCriteria: {
              breakdown: ['Finding factors correctly (1 mark)', 'Identifying HCF as 12 (1 mark)']
            },
            specReference: 'M1.3',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q4',
            question: 'Calculate 2³ + 3² - 4¹',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '2³ + 3² - 4¹ = 8 + 9 - 4 = 13',
            markingCriteria: {
              breakdown: ['Correct evaluation of powers (1 mark)', 'Correct final calculation = 13 (1 mark)']
            },
            specReference: 'M1.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q5',
            question: 'Round 45.678 to 2 decimal places.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '45.68',
            markingCriteria: {
              breakdown: ['Correct rounding to 45.68 (1 mark)']
            },
            specReference: 'M1.5',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q6',
            question: 'Express 3/8 as a decimal.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '0.375',
            markingCriteria: {
              breakdown: ['Correct conversion to 0.375 (1 mark)']
            },
            specReference: 'M1.6',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm1-q7',
            question: 'Calculate 15% of 240.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '15% of 240 = 0.15 × 240 = 36',
            markingCriteria: {
              breakdown: ['Correct method shown (1 mark)', 'Correct answer 36 (1 mark)']
            },
            specReference: 'M1.7',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q8',
            question: 'Find the LCM of 12 and 18.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Multiples of 12: 12, 24, 36, 48... Multiples of 18: 18, 36, 54... LCM = 36',
            markingCriteria: {
              breakdown: ['Finding multiples correctly (1 mark)', 'Identifying LCM as 36 (1 mark)']
            },
            specReference: 'M1.8',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q9',
            question: 'Calculate (-3) × (-7)',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '(-3) × (-7) = 21',
            markingCriteria: {
              breakdown: ['Correct answer 21 (1 mark)']
            },
            specReference: 'M1.9',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm1-q10',
            question: 'Express 125 as a product of prime factors.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '125 = 5³ = 5 × 5 × 5',
            markingCriteria: {
              breakdown: ['Systematic division by prime numbers (1 mark)', 'Complete factorization (1 mark)', 'Correct expression as 5³ (1 mark)']
            },
            specReference: 'M1.10',
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
            question: 'Simplify 3x + 2x - x',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '3x + 2x - x = 4x',
            markingCriteria: {
              breakdown: ['Correct simplification to 4x (1 mark)']
            },
            specReference: 'M2.1',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q2',
            question: 'Solve 2x + 5 = 13',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '2x + 5 = 13, 2x = 8, x = 4',
            markingCriteria: {
              breakdown: ['Correct rearrangement (1 mark)', 'Correct solution x = 4 (1 mark)']
            },
            specReference: 'M2.2',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q3',
            question: 'Expand (x + 3)(x + 2)',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '(x + 3)(x + 2) = x² + 2x + 3x + 6 = x² + 5x + 6',
            markingCriteria: {
              breakdown: ['Correct expansion method (1 mark)', 'Correct final answer x² + 5x + 6 (1 mark)']
            },
            specReference: 'M2.3',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q4',
            question: 'Factorize x² + 7x + 12',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'x² + 7x + 12 = (x + 3)(x + 4)',
            markingCriteria: {
              breakdown: ['Finding correct factors (1 mark)', 'Correct factorization (x + 3)(x + 4) (1 mark)']
            },
            specReference: 'M2.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q5',
            question: 'Solve 3x - 7 = 2x + 5',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '3x - 7 = 2x + 5, 3x - 2x = 5 + 7, x = 12',
            markingCriteria: {
              breakdown: ['Correct rearrangement (1 mark)', 'Correct solution x = 12 (1 mark)']
            },
            specReference: 'M2.5',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q6',
            question: 'Simplify 2a × 3b',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '2a × 3b = 6ab',
            markingCriteria: {
              breakdown: ['Correct simplification to 6ab (1 mark)']
            },
            specReference: 'M2.6',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q7',
            question: 'Find the value of y when x = 3 in the equation y = 2x + 1',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'y = 2(3) + 1 = 6 + 1 = 7',
            markingCriteria: {
              breakdown: ['Correct substitution and calculation y = 7 (1 mark)']
            },
            specReference: 'M2.7',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q8',
            question: 'Expand 3(2x - 5)',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '3(2x - 5) = 6x - 15',
            markingCriteria: {
              breakdown: ['Correct expansion to 6x - 15 (1 mark)']
            },
            specReference: 'M2.8',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q9',
            question: 'Solve x² - 9 = 0',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'x² - 9 = 0, x² = 9, x = ±3',
            markingCriteria: {
              breakdown: ['Correct rearrangement (1 mark)', 'Both solutions x = 3 and x = -3 (1 mark)']
            },
            specReference: 'M2.9',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm2-q10',
            question: 'Make x the subject of y = 3x - 2',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'y = 3x - 2, y + 2 = 3x, x = (y + 2)/3',
            markingCriteria: {
              breakdown: ['Correct rearrangement steps (1 mark)', 'Correct final answer x = (y + 2)/3 (1 mark)']
            },
            specReference: 'M2.10',
            calculatorGuidance: 'non-calc-friendly'
          }
        ]
      },
      {
        id: 'm3-ratio',
        name: 'Ratio, proportion and rates of change',
        questions: [
          {
            id: 'm3-q1',
            question: 'Express the ratio 15:20 in its simplest form.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: '15:20 = 3:4',
            markingCriteria: {
              breakdown: ['Correct simplification to 3:4 (1 mark)']
            },
            specReference: 'M3.1',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q2',
            question: 'If 3 pens cost £4.50, how much do 5 pens cost?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '3 pens cost £4.50, so 1 pen costs £1.50. Therefore 5 pens cost £7.50',
            markingCriteria: {
              breakdown: ['Finding cost of 1 pen (1 mark)', 'Correct final answer £7.50 (1 mark)']
            },
            specReference: 'M3.2',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q3',
            question: 'Share £240 in the ratio 2:3:5',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Total parts = 2 + 3 + 5 = 10. Each part = £240 ÷ 10 = £24. Shares are £48, £72, £120',
            markingCriteria: {
              breakdown: ['Finding total parts (1 mark)', 'Finding value of each part (1 mark)', 'All three shares correct (1 mark)']
            },
            specReference: 'M3.3',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q4',
            question: 'A recipe for 4 people uses 200g flour. How much flour is needed for 6 people?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '4 people need 200g, so 1 person needs 50g. 6 people need 6 × 50g = 300g',
            markingCriteria: {
              breakdown: ['Correct proportion method (1 mark)', 'Correct answer 300g (1 mark)']
            },
            specReference: 'M3.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q5',
            question: 'Calculate the percentage increase from 80 to 96.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Increase = 96 - 80 = 16. Percentage increase = (16/80) × 100% = 20%',
            markingCriteria: {
              breakdown: ['Finding the increase (1 mark)', 'Correct percentage calculation 20% (1 mark)']
            },
            specReference: 'M3.5',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q6',
            question: 'Convert 2.5 m/s to km/h.',
            marks: 2,
            difficulty: 'hard',
            modelAnswer: '2.5 m/s = 2.5 × 3.6 km/h = 9 km/h',
            markingCriteria: {
              breakdown: ['Correct conversion factor (1 mark)', 'Correct answer 9 km/h (1 mark)']
            },
            specReference: 'M3.6',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm3-q7',
            question: 'Find the rate of change of y with respect to x if y = 3x + 2.',
            marks: 1,
            difficulty: 'medium',
            modelAnswer: 'Rate of change = gradient = 3',
            markingCriteria: {
              breakdown: ['Correct answer 3 (1 mark)']
            },
            specReference: 'M3.7',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q8',
            question: 'A car travels 150 miles in 3 hours. What is its average speed?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Average speed = distance ÷ time = 150 ÷ 3 = 50 mph',
            markingCriteria: {
              breakdown: ['Correct formula used (1 mark)', 'Correct answer 50 mph (1 mark)']
            },
            specReference: 'M3.8',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q9',
            question: 'Express 35% as a decimal and as a fraction.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: '35% = 0.35 = 35/100 = 7/20',
            markingCriteria: {
              breakdown: ['Correct decimal 0.35 (1 mark)', 'Correct simplified fraction 7/20 (1 mark)']
            },
            specReference: 'M3.9',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm3-q10',
            question: 'If y is directly proportional to x and y = 12 when x = 4, find y when x = 7.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'y ∝ x, so y = kx. When x = 4, y = 12, so k = 3. When x = 7, y = 3 × 7 = 21',
            markingCriteria: {
              breakdown: ['Setting up proportion correctly (1 mark)', 'Finding constant k = 3 (1 mark)', 'Correct answer y = 21 (1 mark)']
            },
            specReference: 'M3.10',
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
            question: 'Calculate the area of a rectangle with length 8 cm and width 5 cm.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Area = length × width = 8 × 5 = 40 cm²',
            markingCriteria: {
              breakdown: ['Correct calculation 40 cm² (1 mark)']
            },
            specReference: 'M4.1',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q2',
            question: 'Find the perimeter of a triangle with sides 3 cm, 4 cm, and 5 cm.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Perimeter = 3 + 4 + 5 = 12 cm',
            markingCriteria: {
              breakdown: ['Correct calculation 12 cm (1 mark)']
            },
            specReference: 'M4.2',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q3',
            question: 'Calculate the area of a circle with radius 6 cm. Use π = 3.14.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04 cm²',
            markingCriteria: {
              breakdown: ['Correct formula πr² (1 mark)', 'Correct calculation 113.04 cm² (1 mark)']
            },
            specReference: 'M4.3',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q4',
            question: 'Find the volume of a cube with side length 4 cm.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Volume = side³ = 4³ = 64 cm³',
            markingCriteria: {
              breakdown: ['Correct calculation 64 cm³ (1 mark)']
            },
            specReference: 'M4.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q5',
            question: 'Calculate the circumference of a circle with diameter 10 cm. Use π = 3.14.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Circumference = πd = 3.14 × 10 = 31.4 cm',
            markingCriteria: {
              breakdown: ['Correct formula πd (1 mark)', 'Correct calculation 31.4 cm (1 mark)']
            },
            specReference: 'M4.5',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q6',
            question: 'Find the area of a triangle with base 6 cm and height 8 cm.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Area = ½ × base × height = ½ × 6 × 8 = 24 cm²',
            markingCriteria: {
              breakdown: ['Correct formula ½bh (1 mark)', 'Correct calculation 24 cm² (1 mark)']
            },
            specReference: 'M4.6',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q7',
            question: 'Calculate the surface area of a cube with side length 3 cm.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Surface area = 6 × side² = 6 × 3² = 6 × 9 = 54 cm²',
            markingCriteria: {
              breakdown: ['Correct formula 6s² (1 mark)', 'Correct calculation 54 cm² (1 mark)']
            },
            specReference: 'M4.7',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q8',
            question: 'Find the length of the hypotenuse in a right triangle with sides 3 cm and 4 cm.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Using Pythagoras: c² = 3² + 4² = 9 + 16 = 25, so c = 5 cm',
            markingCriteria: {
              breakdown: ['Correct use of Pythagoras theorem (1 mark)', 'Correct answer 5 cm (1 mark)']
            },
            specReference: 'M4.8',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm4-q9',
            question: 'Calculate the volume of a cylinder with radius 2 cm and height 5 cm. Use π = 3.14.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Volume = πr²h = 3.14 × 2² × 5 = 3.14 × 4 × 5 = 62.8 cm³',
            markingCriteria: {
              breakdown: ['Correct formula πr²h (1 mark)', 'Correct substitution (1 mark)', 'Correct calculation 62.8 cm³ (1 mark)']
            },
            specReference: 'M4.9',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm4-q10',
            question: 'Find the area of a parallelogram with base 7 cm and perpendicular height 4 cm.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Area = base × height = 7 × 4 = 28 cm²',
            markingCriteria: {
              breakdown: ['Correct formula base × height (1 mark)', 'Correct calculation 28 cm² (1 mark)']
            },
            specReference: 'M4.10',
            calculatorGuidance: 'non-calc-friendly'
          }
        ]
      },
      {
        id: 'm5-probability',
        name: 'Probability',
        questions: [
          {
            id: 'm5-q1',
            question: 'What is the probability of rolling a 6 on a fair six-sided die?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Probability = 1/6',
            markingCriteria: {
              breakdown: ['Correct answer 1/6 (1 mark)']
            },
            specReference: 'M5.1',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q2',
            question: 'A bag contains 5 red balls and 3 blue balls. What is the probability of picking a red ball?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Total balls = 5 + 3 = 8. Probability = 5/8',
            markingCriteria: {
              breakdown: ['Finding total number of balls (1 mark)', 'Correct probability 5/8 (1 mark)']
            },
            specReference: 'M5.2',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q3',
            question: 'Two coins are flipped. What is the probability of getting two heads?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Possible outcomes: HH, HT, TH, TT. Probability of HH = 1/4',
            markingCriteria: {
              breakdown: ['Listing all outcomes correctly (1 mark)', 'Correct probability 1/4 (1 mark)']
            },
            specReference: 'M5.3',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q4',
            question: 'What is the probability of NOT rolling a 3 on a fair six-sided die?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Probability of rolling a 3 = 1/6. Probability of NOT rolling a 3 = 1 - 1/6 = 5/6',
            markingCriteria: {
              breakdown: ['Understanding complementary probability (1 mark)', 'Correct answer 5/6 (1 mark)']
            },
            specReference: 'M5.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q5',
            question: 'A spinner has 4 equal sections colored red, blue, green, and yellow. What is the probability of landing on red or blue?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'P(red) = 1/4, P(blue) = 1/4. P(red or blue) = 1/4 + 1/4 = 2/4 = 1/2',
            markingCriteria: {
              breakdown: ['Finding individual probabilities (1 mark)', 'Correct addition to get 1/2 (1 mark)']
            },
            specReference: 'M5.5',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q6',
            question: 'From a standard deck of 52 cards, what is the probability of drawing a king?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'There are 4 kings in 52 cards. Probability = 4/52 = 1/13',
            markingCriteria: {
              breakdown: ['Correct answer 1/13 (1 mark)']
            },
            specReference: 'M5.6',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q7',
            question: 'Two dice are rolled. What is the probability that the sum is 7?',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Ways to get sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 ways. Total outcomes = 36. Probability = 6/36 = 1/6',
            markingCriteria: {
              breakdown: ['Identifying all ways to get sum 7 (1 mark)', 'Finding total outcomes 36 (1 mark)', 'Correct probability 1/6 (1 mark)']
            },
            specReference: 'M5.7',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q8',
            question: 'A fair coin is flipped 3 times. What is the probability of getting exactly 2 heads?',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'All outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT. Exactly 2 heads: HHT, HTH, THH. Probability = 3/8',
            markingCriteria: {
              breakdown: ['Listing all 8 outcomes (1 mark)', 'Identifying outcomes with exactly 2 heads (1 mark)', 'Correct probability 3/8 (1 mark)']
            },
            specReference: 'M5.8',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q9',
            question: 'In a class of 30 students, 18 like math and 12 like science. If these are the only two subjects, what is the probability a randomly selected student likes math?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Probability = 18/30 = 3/5',
            markingCriteria: {
              breakdown: ['Correct answer 3/5 (1 mark)']
            },
            specReference: 'M5.9',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm5-q10',
            question: 'A box contains 4 red, 6 blue, and 2 green marbles. Two marbles are drawn without replacement. What is the probability both are red?',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Total marbles = 12. P(first red) = 4/12. P(second red | first red) = 3/11. P(both red) = (4/12) × (3/11) = 12/132 = 1/11',
            markingCriteria: {
              breakdown: ['Finding probability of first red marble (1 mark)', 'Finding conditional probability of second red (1 mark)', 'Correct final answer 1/11 (1 mark)']
            },
            specReference: 'M5.10',
            calculatorGuidance: 'non-calc-friendly'
          }
        ]
      },
      {
        id: 'm6-statistics',
        name: 'Statistics',
        questions: [
          {
            id: 'm6-q1',
            question: 'Find the mean of the following numbers: 3, 7, 2, 8, 5',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Mean = (3 + 7 + 2 + 8 + 5) ÷ 5 = 25 ÷ 5 = 5',
            markingCriteria: {
              breakdown: ['Correct sum of numbers (1 mark)', 'Correct mean calculation = 5 (1 mark)']
            },
            specReference: 'M6.1',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q2',
            question: 'Find the median of: 12, 8, 15, 3, 9, 7, 11',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Arranged in order: 3, 7, 8, 9, 11, 12, 15. Median = 9 (middle value)',
            markingCriteria: {
              breakdown: ['Arranging in order (1 mark)', 'Correct median = 9 (1 mark)']
            },
            specReference: 'M6.2',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q3',
            question: 'Find the mode of: 2, 3, 2, 5, 7, 2, 8, 3',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Mode = 2 (appears 3 times, most frequent)',
            markingCriteria: {
              breakdown: ['Correct mode = 2 (1 mark)']
            },
            specReference: 'M6.3',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q4',
            question: 'Find the range of: 15, 8, 23, 4, 19, 12',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Range = highest - lowest = 23 - 4 = 19',
            markingCriteria: {
              breakdown: ['Correct range = 19 (1 mark)']
            },
            specReference: 'M6.4',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q5',
            question: 'A survey of 20 students found their favorite colors: Red(5), Blue(8), Green(4), Yellow(3). What is the most popular color and what percentage of students chose it?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Most popular color is Blue with 8 students. Percentage = (8/20) × 100% = 40%',
            markingCriteria: {
              breakdown: ['Identifying Blue as most popular (1 mark)', 'Correct calculation of percentage (1 mark)', 'Final answer 40% (1 mark)']
            },
            specReference: 'M6.5',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q6',
            question: 'Calculate the mean from this frequency table: Score: 1(3), 2(5), 3(2), 4(1)',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Total = (1×3) + (2×5) + (3×2) + (4×1) = 3 + 10 + 6 + 4 = 23. Mean = 23 ÷ 11 = 2.09',
            markingCriteria: {
              breakdown: ['Correct calculation of total (1 mark)', 'Finding total frequency (1 mark)', 'Correct mean (1 mark)']
            },
            specReference: 'M6.6',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q7',
            question: 'Given data for a pie chart: A(60°), B(120°), C(90°), D(90°). Which category represents the largest proportion and what percentage of the total does it represent?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Category B represents the largest proportion with 120°. Percentage = (120°/360°) × 100% = 33.3%',
            markingCriteria: {
              breakdown: ['Identifying B as largest category (1 mark)', 'Correct percentage calculation 33.3% (1 mark)']
            },
            specReference: 'M6.7',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q8',
            question: 'Find the median from grouped data: 0-9(4), 10-19(7), 20-29(5), 30-39(2)',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Total frequency = 18. Median position = 9th and 10th values. Both in 10-19 group. Median ≈ 14.5',
            markingCriteria: {
              breakdown: ['Finding median position (1 mark)', 'Identifying correct group (1 mark)', 'Reasonable estimate (1 mark)']
            },
            specReference: 'M6.8',
            calculatorGuidance: 'calc-recommended'
          },
          {
            id: 'm6-q9',
            question: 'Calculate the interquartile range for: 2, 5, 7, 9, 12, 15, 18, 20, 25',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Q1 = 6 (median of lower half), Q3 = 19 (median of upper half). IQR = Q3 - Q1 = 19 - 6 = 13',
            markingCriteria: {
              breakdown: ['Finding Q1 correctly (1 mark)', 'Finding Q3 correctly (1 mark)', 'Correct IQR = 13 (1 mark)']
            },
            specReference: 'M6.9',
            calculatorGuidance: 'non-calc-friendly'
          },
          {
            id: 'm6-q10',
            question: 'Interpret this scatter diagram: Does it show positive, negative, or no correlation between hours studied and test scores?',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Positive correlation - as hours studied increases, test scores tend to increase',
            markingCriteria: {
              breakdown: ['Identifying positive correlation (1 mark)', 'Correct interpretation (1 mark)']
            },
            specReference: 'M6.10',
            calculatorGuidance: 'non-calc-friendly'
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
            question: 'Name the three main parts of a plant cell that are not found in animal cells.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Cell wall, chloroplasts, and permanent vacuole',
            markingCriteria: {
              breakdown: ['Cell wall (1 mark)', 'Chloroplasts (1 mark)', 'Permanent vacuole (1 mark)']
            },
            specReference: 'B1.1'
          },
          {
            id: 'b1-q2',
            question: 'Explain the function of mitochondria in cells.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Mitochondria are the site of cellular respiration, where glucose is broken down to release energy (ATP) for cellular processes.',
            markingCriteria: {
              breakdown: ['Site of cellular respiration (1 mark)', 'Releases energy/ATP (1 mark)']
            },
            specReference: 'B1.2'
          },
          {
            id: 'b1-q3',
            question: 'Describe the process of diffusion.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Diffusion is the net movement of particles from an area of high concentration to an area of low concentration down a concentration gradient. It is a passive process that does not require energy.',
            markingCriteria: {
              breakdown: ['Movement from high to low concentration (1 mark)', 'Down concentration gradient (1 mark)', 'Passive process/no energy required (1 mark)']
            },
            specReference: 'B1.3'
          },
          {
            id: 'b1-q4',
            question: 'What is the function of the nucleus in a cell?',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The nucleus controls all cellular activities and contains the genetic material (DNA) which carries instructions for protein synthesis.',
            markingCriteria: {
              breakdown: ['Controls cellular activities (1 mark)', 'Contains genetic material/DNA (1 mark)']
            },
            specReference: 'B1.4'
          },
          {
            id: 'b1-q5',
            question: 'Explain how the structure of the small intestine is adapted for absorption.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'The small intestine has villi and microvilli which increase surface area for absorption. It has a good blood supply to maintain concentration gradients. The walls are thin (one cell thick) for efficient diffusion. It is long to provide more time for absorption.',
            markingCriteria: {
              breakdown: ['Villi/microvilli increase surface area (1 mark)', 'Good blood supply maintains gradients (1 mark)', 'Thin walls for efficient diffusion (1 mark)', 'Long length provides more time (1 mark)']
            },
            specReference: 'B1.5'
          },
          {
            id: 'b1-q6',
            question: 'What is osmosis?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential through a partially permeable membrane.',
            markingCriteria: {
              breakdown: ['Movement of water molecules (1 mark)', 'From high to low water potential (1 mark)', 'Through partially permeable membrane (1 mark)']
            },
            specReference: 'B1.6'
          },
          {
            id: 'b1-q7',
            question: 'Name two factors that affect the rate of diffusion.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Temperature and concentration gradient',
            markingCriteria: {
              breakdown: ['Temperature (1 mark)', 'Concentration gradient (1 mark)']
            },
            specReference: 'B1.7'
          },
          {
            id: 'b1-q8',
            question: 'Describe the function of ribosomes.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Ribosomes are the site of protein synthesis, where amino acids are joined together to form proteins.',
            markingCriteria: {
              breakdown: ['Site of protein synthesis (1 mark)', 'Joining amino acids to form proteins (1 mark)']
            },
            specReference: 'B1.8'
          },
          {
            id: 'b1-q9',
            question: 'Explain what happens to plant cells when placed in pure water.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Water enters the cell by osmosis, the cell becomes turgid (swollen), and the cell wall prevents the cell from bursting.',
            markingCriteria: {
              breakdown: ['Water enters by osmosis (1 mark)', 'Cell becomes turgid (1 mark)', 'Cell wall prevents bursting (1 mark)']
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
            question: 'Define the term "tissue".',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'A tissue is a group of similar cells that work together to perform a specific function.',
            markingCriteria: {
              breakdown: ['Group of similar cells (1 mark)', 'Work together for specific function (1 mark)']
            },
            specReference: 'B2.1'
          },
          {
            id: 'b2-q2',
            question: 'Name the four main types of tissue in animals.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Epithelial tissue, connective tissue, muscle tissue, and nervous tissue',
            markingCriteria: {
              breakdown: ['Epithelial tissue (1 mark)', 'Connective tissue (1 mark)', 'Muscle tissue (1 mark)', 'Nervous tissue (1 mark)']
            },
            specReference: 'B2.2'
          },
          {
            id: 'b2-q3',
            question: 'Explain the function of the heart in the circulatory system.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'The heart pumps blood around the body, delivering oxygen and nutrients to cells and removing waste products.',
            markingCriteria: {
              breakdown: ['Pumps blood around body (1 mark)', 'Delivers oxygen/nutrients and removes waste (1 mark)']
            },
            specReference: 'B2.3'
          },
          {
            id: 'b2-q4',
            question: 'Describe the structure and function of xylem tissue in plants.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Xylem is composed of dead cells with thick walls strengthened by lignin. It transports water and mineral salts from roots to leaves and provides structural support to the plant.',
            markingCriteria: {
              breakdown: ['Dead cells with thick walls (1 mark)', 'Strengthened by lignin (1 mark)', 'Transports water and minerals (1 mark)', 'Provides structural support (1 mark)']
            },
            specReference: 'B2.4'
          },
          {
            id: 'b2-q5',
            question: 'What is the difference between arteries and veins?',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Arteries carry blood away from the heart at high pressure and have thick muscular walls. Veins carry blood back to the heart at low pressure and have thin walls with valves.',
            markingCriteria: {
              breakdown: ['Arteries carry blood away from heart (1 mark)', 'Arteries have thick muscular walls (1 mark)', 'Veins carry blood to heart (1 mark)', 'Veins have thin walls with valves (1 mark)']
            },
            specReference: 'B2.5'
          },
          {
            id: 'b2-q6',
            question: 'Explain the function of phloem tissue.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Phloem transports sugars (mainly sucrose) produced by photosynthesis from leaves to other parts of the plant where they are needed for growth or storage.',
            markingCriteria: {
              breakdown: ['Transports sugars/sucrose (1 mark)', 'From leaves to other parts (1 mark)', 'For growth or storage (1 mark)']
            },
            specReference: 'B2.6'
          },
          {
            id: 'b2-q7',
            question: 'Name the main organs of the digestive system.',
            marks: 5,
            difficulty: 'easy',
            modelAnswer: 'Mouth, esophagus, stomach, small intestine, large intestine, liver, pancreas',
            markingCriteria: {
              breakdown: ['Any 5 correct organs (1 mark each)']
            },
            specReference: 'B2.7'
          },
          {
            id: 'b2-q8',
            question: 'Describe the function of the liver in digestion.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'The liver produces bile, which is stored in the gall bladder. Bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase enzyme action.',
            markingCriteria: {
              breakdown: ['Produces bile (1 mark)', 'Bile emulsifies fats (1 mark)', 'Increases surface area for enzyme action (1 mark)']
            },
            specReference: 'B2.8'
          },
          {
            id: 'b2-q9',
            question: 'What is the function of red blood cells?',
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
          }
        ]
      },
      {
        id: 'b4-bioenergetics',
        name: 'Bioenergetics',
        questions: [
          {
            id: 'b4-q1',
            question: 'Write the word equation for photosynthesis.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Carbon dioxide + Water → Glucose + Oxygen (in the presence of light and chlorophyll)',
            markingCriteria: {
              breakdown: ['Correct reactants and products (1 mark)', 'Correct conditions mentioned (1 mark)']
            },
            specReference: 'B4.1'
          },
          {
            id: 'b4-q2',
            question: 'Name the factors that can limit the rate of photosynthesis.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Light intensity, carbon dioxide concentration, and temperature',
            markingCriteria: {
              breakdown: ['Light intensity (1 mark)', 'Carbon dioxide concentration (1 mark)', 'Temperature (1 mark)']
            },
            specReference: 'B4.2'
          },
          {
            id: 'b4-q3',
            question: 'Explain why photosynthesis is important for life on Earth.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Photosynthesis produces oxygen for respiration, removes carbon dioxide from the atmosphere, and produces glucose which is the basis of food chains.',
            markingCriteria: {
              breakdown: ['Produces oxygen (1 mark)', 'Removes carbon dioxide (1 mark)', 'Produces glucose/basis of food chains (1 mark)']
            },
            specReference: 'B4.3'
          },
          {
            id: 'b4-q4',
            question: 'Write the word equation for aerobic respiration.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP)',
            markingCriteria: {
              breakdown: ['Correct reactants and products (1 mark)', 'Energy/ATP mentioned (1 mark)']
            },
            specReference: 'B4.4'
          },
          {
            id: 'b4-q5',
            question: 'Explain the difference between aerobic and anaerobic respiration.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Aerobic respiration uses oxygen and produces carbon dioxide, water, and lots of ATP. Anaerobic respiration occurs without oxygen, produces less ATP, and forms lactic acid in animals or ethanol in plants/yeast.',
            markingCriteria: {
              breakdown: ['Aerobic uses oxygen (1 mark)', 'Aerobic produces more ATP (1 mark)', 'Anaerobic without oxygen (1 mark)', 'Anaerobic produces lactic acid/ethanol (1 mark)']
            },
            specReference: 'B4.5'
          },
          {
            id: 'b4-q6',
            question: 'Where does photosynthesis occur in plant cells?',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Chloroplasts',
            markingCriteria: {
              breakdown: ['Chloroplasts (1 mark)']
            },
            specReference: 'B4.6'
          },
          {
            id: 'b4-q7',
            question: 'Explain what happens during anaerobic respiration in muscle cells.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Glucose is broken down without oxygen to produce lactic acid and a small amount of energy. This occurs during vigorous exercise when oxygen supply is insufficient.',
            markingCriteria: {
              breakdown: ['Glucose broken down without oxygen (1 mark)', 'Produces lactic acid (1 mark)', 'Occurs during vigorous exercise (1 mark)']
            },
            specReference: 'B4.7'
          },
          {
            id: 'b4-q8',
            question: 'What is meant by oxygen debt?',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Oxygen debt is the amount of extra oxygen needed after exercise to break down the lactic acid that has built up during anaerobic respiration.',
            markingCriteria: {
              breakdown: ['Extra oxygen needed after exercise (1 mark)', 'To break down lactic acid (1 mark)', 'Built up during anaerobic respiration (1 mark)']
            },
            specReference: 'B4.8'
          },
          {
            id: 'b4-q9',
            question: 'How do plants use the glucose produced in photosynthesis?',
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
  }
];
