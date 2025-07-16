
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
            question: 'Explain the UK\'s global economic and political links.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Economic links include trade with EU, USA, and Commonwealth countries, foreign investment in UK businesses, UK investment abroad. Political links include NATO membership, UN Security Council, G7, and post-Brexit relationships. Cultural links through language, media, and migration maintain global connections.',
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
            question: 'Describe the UK\'s changing demand for food and explain the growth of agribusiness.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'UK food demand has changed to include more exotic foods, organic produce, and seasonal availability year-round. Agribusiness has grown through large-scale farming, use of technology, and integration from farm to supermarket. This increases efficiency but may affect small farmers and local food systems.',
            markingCriteria: {
              breakdown: ['Changing food demand patterns (2 marks)', 'Growth of agribusiness (2 marks)', 'Technology and scale changes (2 marks)']
            },
            specReference: '3.2.3 - UK demand and provision of food'
          },
          {
            id: 'g10-q3',
            question: 'Explain the concept of food miles and evaluate their environmental impact.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Food miles measure the distance food travels from production to consumption. Long food miles increase carbon emissions from transport. However, local production may be less efficient, and some regions have comparative advantages for certain crops. Seasonal eating and local sourcing can reduce environmental impact.',
            markingCriteria: {
              breakdown: ['Definition of food miles (1 mark)', 'Environmental impact - carbon emissions (1 mark)', 'Evaluation - efficiency considerations (1 mark)', 'Solutions mentioned (1 mark)']
            },
            specReference: '3.2.3 - UK demand and provision of food'
          },
          {
            id: 'g10-q4',
            question: 'Describe the UK\'s water resources and explain patterns of demand and supply.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'UK water supply mainly from rainfall, rivers, and reservoirs, with most water in north and west. Demand is highest in southeast where population is concentrated. Water transfers like from Wales to England help balance supply and demand. Climate change may increase demand and reduce supply in some areas.',
            markingCriteria: {
              breakdown: ['Sources of UK water supply (2 marks)', 'Geographic patterns of demand/supply (2 marks)', 'Water transfers or climate change impacts (2 marks)']
            },
            specReference: '3.2.3 - UK water resources'
          },
          {
            id: 'g10-q5',
            question: 'Explain the issues of water quality and the management of water supply in the UK.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Water quality issues include agricultural pollution from fertilizers, urban runoff, and industrial contamination. Management involves water treatment plants, reservoir construction, water transfers between regions, and demand management through pricing and education.',
            markingCriteria: {
              breakdown: ['Water quality issues (2 marks)', 'Management strategies (2 marks)']
            },
            specReference: '3.2.3 - UK water resources'
          },
          {
            id: 'g10-q6',
            question: 'Describe the UK\'s energy mix and explain the environmental issues associated with energy production.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'UK energy mix includes natural gas, renewable sources (wind, solar), nuclear power, and declining coal use. Environmental issues include carbon emissions from fossil fuels contributing to climate change, nuclear waste disposal problems, visual impact of wind farms, and habitat disruption from hydroelectric schemes.',
            markingCriteria: {
              breakdown: ['Description of energy mix (3 marks)', 'Environmental issues from different sources (3 marks)']
            },
            specReference: '3.2.3 - UK energy mix and environmental issues'
          },
          {
            id: 'g10-q7',
            question: 'For food, water, OR energy, explain the global patterns of insecurity and their causes.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'FOOD: Food insecurity mainly affects sub-Saharan Africa and parts of Asia due to poverty, conflict, climate change, and poor infrastructure. OR WATER: Water insecurity affects arid regions, densely populated areas, and places with pollution or poor infrastructure. OR ENERGY: Energy poverty affects rural areas in LICs lacking electricity grid connections and unable to afford modern energy sources.',
            markingCriteria: {
              breakdown: ['Clear choice of resource (1 mark)', 'Global patterns described (2 marks)', 'Causes explained (3 marks)']
            },
            specReference: '3.2.3 - Resource focus areas'
          },
          {
            id: 'g10-q8',
            question: 'For your chosen resource, explain the strategies used to increase supply and manage demand.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'FOOD: Supply strategies include agricultural intensification, new crop varieties, irrigation expansion, and land conversion. Demand management through reducing waste, changing diets, and population policies. OR WATER: Supply through desalination, water recycling, reservoir construction. Demand management through pricing, efficiency measures, and education. OR ENERGY: Supply through renewable energy development, fossil fuel extraction, nuclear power. Demand management through efficiency improvements, smart grids, and behavioral change.',
            markingCriteria: {
              breakdown: ['Resource specified (1 mark)', 'Supply strategies (3 marks)', 'Demand management strategies (3 marks)', 'Evaluation or examples (1 mark)']
            },
            specReference: '3.2.3 - Resource focus areas'
          },
          {
            id: 'g10-q9',
            question: 'For your chosen resource, evaluate the sustainability of different management approaches.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'FOOD: Intensive agriculture increases yields but may degrade soils and use excess chemicals. Organic farming is more sustainable but lower yields. GM crops may increase production sustainably. OR WATER: Desalination provides reliable supply but uses lots of energy. Water recycling is sustainable but requires investment. Conservation is most sustainable approach. OR ENERGY: Renewable energy is sustainable but intermittent. Nuclear provides reliable low-carbon energy but waste issues. Fossil fuels are unsustainable due to climate change.',
            markingCriteria: {
              breakdown: ['Resource specified (1 mark)', 'Different approaches discussed (4 marks)', 'Evaluation of sustainability (2 marks)', 'Clear conclusion or comparison (1 mark)']
            },
            specReference: '3.2.3 - Resource focus areas'
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
