import { Subject, Question } from "@/types";

export { Question };

export const curriculum: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    icon: "➗",
    color: "bg-blue-500",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        description: "Expressions, equations, and inequalities",
        questions: [
          {
            id: "math1_1",
            question: "What is the solution to the equation 2x + 3 = 7?",
            options: ["x = 1", "x = 2", "x = 3", "x = 4"],
            correct: 1,
            explanation: "Subtract 3 from both sides: 2x = 4, then divide by 2: x = 2."
          },
          {
            id: "math1_2",
            question: "Simplify: 3(x + 4) - 2x",
            options: ["x + 12", "x + 4", "5x + 4", "x - 12"],
            correct: 0,
            explanation: "Distribute 3: 3x + 12 - 2x = x + 12."
          }
        ]
      },
      {
        id: "geometry",
        name: "Geometry",
        description: "Shapes, angles, and properties",
        questions: [
          {
            id: "math2_1",
            question: "What is the sum of interior angles in a triangle?",
            options: ["180°", "90°", "360°", "270°"],
            correct: 0,
            explanation: "The sum of interior angles in any triangle is always 180 degrees."
          }
        ]
      }
    ]
  },
  {
    id: "biology",
    name: "Biology",
    icon: "🧬",
    color: "bg-emerald-500",
    topics: [
      {
        id: "cell-biology",
        name: "Cell Biology",
        description: "Structure and function of cells",
        questions: [
          {
            id: "bio1_1",
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
            correct: 1,
            explanation: "Mitochondria produce energy through respiration."
          },
          {
            id: "bio1_2",
            question: "Which organelle controls what enters and leaves the cell?",
            options: ["Cell wall", "Cell membrane", "Nucleus", "Vacuole"],
            correct: 1,
            explanation: "The cell membrane is selectively permeable and controls the movement of substances in and out of the cell."
          },
          {
            id: "bio1_3",
            question: "What is the function of ribosomes?",
            options: ["DNA storage", "Protein synthesis", "Energy production", "Waste removal"],
            correct: 1,
            explanation: "Ribosomes are the sites of protein synthesis where amino acids are assembled into proteins."
          },
          {
            id: "bio1_4",
            question: "Which organelle is only found in plant cells?",
            options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"],
            correct: 2,
            explanation: "Chloroplasts contain chlorophyll and are responsible for photosynthesis, found only in plant cells."
          },
          {
            id: "bio1_5",
            question: "What is the function of the nucleus?",
            options: ["Photosynthesis", "Controls cell activities", "Protein synthesis", "Energy production"],
            correct: 1,
            explanation: "The nucleus contains DNA and controls all cellular activities and reproduction."
          },
          {
            id: "bio1_6",
            question: "What is the difference between plant and animal cells?",
            options: [
              "Plant cells have cell walls and chloroplasts",
              "Animal cells are larger",
              "Plant cells don't have nuclei",
              "Animal cells have more organelles"
            ],
            correct: 0,
            explanation: "Plant cells have rigid cell walls and chloroplasts for photosynthesis, which animal cells lack."
          },
          {
            id: "bio1_7",
            question: "What is the function of the vacuole in plant cells?",
            options: ["Protein synthesis", "Support and storage", "Photosynthesis", "DNA storage"],
            correct: 1,
            explanation: "The large vacuole in plant cells provides structural support and stores water and dissolved substances."
          },
          {
            id: "bio1_8",
            question: "Which type of microscope can show living cells?",
            options: ["Electron microscope", "Light microscope", "X-ray microscope", "Laser microscope"],
            correct: 1,
            explanation: "Light microscopes can observe living cells, while electron microscopes require dead, prepared specimens."
          },
          {
            id: "bio1_9",
            question: "What is cytoplasm?",
            options: [
              "The cell's outer boundary",
              "Jelly-like substance inside the cell",
              "The cell's control center",
              "Energy-producing organelle"
            ],
            correct: 1,
            explanation: "Cytoplasm is the jelly-like substance that fills the cell and contains dissolved nutrients and organelles."
          },
          {
            id: "bio1_10",
            question: "What magnification do you need to see most cells clearly?",
            options: ["×10", "×100", "×400", "×1000"],
            correct: 2,
            explanation: "Most cells are clearly visible at ×400 magnification, which provides sufficient detail without too much distortion."
          }
        ]
      },
      {
        id: "organisation",
        name: "Organisation",
        description: "Levels of organisation in living organisms",
        questions: [
          {
            id: "bio2_1",
            question: "What is the basic unit of life?",
            options: ["Organ", "Tissue", "Cell", "Organism"],
            correct: 2,
            explanation: "Cells are the basic units of life."
          },
          {
            id: "bio2_2",
            question: "What is a tissue?",
            options: [
              "A single cell",
              "A group of similar cells working together",
              "A complete organism",
              "An organ system"
            ],
            correct: 1,
            explanation: "A tissue is a group of similar cells that work together to perform a specific function."
          },
          {
            id: "bio2_3",
            question: "What is an organ?",
            options: [
              "A single cell",
              "A group of tissues working together",
              "A group of organisms",
              "A type of cell"
            ],
            correct: 1,
            explanation: "An organ is made up of different tissues working together to perform a specific function."
          },
          {
            id: "bio2_4",
            question: "What is an organ system?",
            options: [
              "A single organ",
              "A group of organs working together",
              "A type of tissue",
              "A single cell"
            ],
            correct: 1,
            explanation: "An organ system consists of different organs working together to perform complex functions."
          },
          {
            id: "bio2_5",
            question: "Which is the correct order of biological organization?",
            options: [
              "Cell → Tissue → Organ → Organ System → Organism",
              "Tissue → Cell → Organ → Organism → Organ System",
              "Organ → Tissue → Cell → Organ System → Organism",
              "Cell → Organ → Tissue → Organ System → Organism"
            ],
            correct: 0,
            explanation: "The correct hierarchy is: Cell → Tissue → Organ → Organ System → Organism."
          },
          {
            id: "bio2_6",
            question: "What type of tissue covers body surfaces?",
            options: ["Muscle tissue", "Nerve tissue", "Epithelial tissue", "Connective tissue"],
            correct: 2,
            explanation: "Epithelial tissue forms protective layers covering body surfaces and lining internal organs."
          },
          {
            id: "bio2_7",
            question: "What is the function of muscle tissue?",
            options: ["Protection", "Movement", "Communication", "Support"],
            correct: 1,
            explanation: "Muscle tissue contracts to produce movement in the body."
          },
          {
            id: "bio2_8",
            question: "Which organ system includes the heart?",
            options: ["Respiratory system", "Digestive system", "Circulatory system", "Nervous system"],
            correct: 2,
            explanation: "The heart is the main organ of the circulatory (cardiovascular) system."
          },
          {
            id: "bio2_9",
            question: "What connects muscle to bone?",
            options: ["Ligaments", "Tendons", "Cartilage", "Joints"],
            correct: 1,
            explanation: "Tendons are strong connective tissues that attach muscles to bones."
          },
          {
            id: "bio2_10",
            question: "Which system removes waste from the body?",
            options: ["Digestive system", "Excretory system", "Respiratory system", "All of the above"],
            correct: 3,
            explanation: "Multiple systems remove waste: digestive (solid waste), excretory (liquid waste), and respiratory (gaseous waste)."
          }
        ]
      },
      {
        id: "infection-response",
        name: "Infection and Response",
        description: "Pathogens and the immune system",
        questions: [
          {
            id: "bio3_1",
            question: "What type of pathogen causes malaria?",
            options: ["Bacteria", "Virus", "Protoctist", "Fungus"],
            correct: 2,
            explanation: "Malaria is caused by a protoctist called Plasmodium."
          },
          {
            id: "bio3_2",
            question: "What is a pathogen?",
            options: [
              "A disease-causing microorganism",
              "A type of medicine",
              "A healthy cell",
              "An immune system cell"
            ],
            correct: 0,
            explanation: "A pathogen is any microorganism that causes disease in its host."
          },
          {
            id: "bio3_3",
            question: "Which type of pathogen causes AIDS?",
            options: ["Bacteria", "Virus", "Fungus", "Protoctist"],
            correct: 1,
            explanation: "AIDS is caused by HIV (Human Immunodeficiency Virus)."
          },
          {
            id: "bio3_4",
            question: "What is the body's first line of defense against pathogens?",
            options: ["White blood cells", "Antibodies", "Skin and mucus", "Vaccines"],
            correct: 2,
            explanation: "The skin acts as a physical barrier, while mucus traps pathogens before they enter the body."
          },
          {
            id: "bio3_5",
            question: "What do white blood cells do?",
            options: [
              "Carry oxygen",
              "Fight infections",
              "Help blood clot",
              "Digest food"
            ],
            correct: 1,
            explanation: "White blood cells are part of the immune system and fight infections by destroying pathogens."
          },
          {
            id: "bio3_6",
            question: "What are antibodies?",
            options: [
              "Types of pathogens",
              "Proteins that fight specific pathogens",
              "Types of blood cells",
              "Medicines"
            ],
            correct: 1,
            explanation: "Antibodies are proteins produced by white blood cells that bind to and neutralize specific pathogens."
          },
          {
            id: "bio3_7",
            question: "How do vaccines work?",
            options: [
              "They kill all pathogens",
              "They strengthen the immune system with dead/weakened pathogens",
              "They replace white blood cells",
              "They create antibiotics"
            ],
            correct: 1,
            explanation: "Vaccines contain dead or weakened pathogens that trigger the immune system to produce antibodies and memory cells."
          },
          {
            id: "bio3_8",
            question: "What is the difference between bacteria and viruses?",
            options: [
              "Bacteria are smaller than viruses",
              "Viruses are living cells, bacteria are not",
              "Bacteria are living cells, viruses need host cells to reproduce",
              "There is no difference"
            ],
            correct: 2,
            explanation: "Bacteria are independent living cells, while viruses are not cells and can only reproduce inside host cells."
          },
          {
            id: "bio3_9",
            question: "What type of drug kills bacteria?",
            options: ["Antivirals", "Antibiotics", "Painkillers", "Vaccines"],
            correct: 1,
            explanation: "Antibiotics kill bacteria or stop their growth, but they don't work against viruses."
          },
          {
            id: "bio3_10",
            question: "How is HIV transmitted?",
            options: [
              "Through air",
              "Through blood and body fluids",
              "Through casual contact",
              "Through food and water"
            ],
            correct: 1,
            explanation: "HIV is transmitted through blood, unprotected sexual contact, and from mother to child during pregnancy or breastfeeding."
          }
        ]
      },
      {
        id: "bioenergetics",
        name: "Bioenergetics",
        description: "Photosynthesis, respiration, and energy transfers in living organisms",
        questions: [
          {
            id: "bio4_1",
            question: "What is the word equation for photosynthesis?",
            options: [
              "Carbon dioxide + water → glucose + oxygen",
              "Glucose + oxygen → carbon dioxide + water",
              "Oxygen + glucose → carbon dioxide + water",
              "Water + oxygen → glucose + carbon dioxide"
            ],
            correct: 0,
            explanation: "Photosynthesis converts carbon dioxide and water into glucose and oxygen using light energy."
          },
          {
            id: "bio4_2",
            question: "Which organelle is the site of photosynthesis?",
            options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
            correct: 1,
            explanation: "Chloroplasts contain chlorophyll and are where photosynthesis occurs in plant cells."
          },
          {
            id: "bio4_3",
            question: "What is the chemical equation for aerobic respiration?",
            options: [
              "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
              "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
              "C₆H₁₂O₆ → 6CO₂ + 6H₂O",
              "6O₂ → 6CO₂ + 6H₂O"
            ],
            correct: 0,
            explanation: "Aerobic respiration breaks down glucose using oxygen to produce carbon dioxide, water, and ATP."
          },
          {
            id: "bio4_4",
            question: "Which factor does NOT affect the rate of photosynthesis?",
            options: ["Light intensity", "Carbon dioxide concentration", "Temperature", "Oxygen concentration"],
            correct: 3,
            explanation: "Light intensity, CO₂ concentration, and temperature are limiting factors for photosynthesis, but oxygen concentration is not."
          },
          {
            id: "bio4_5",
            question: "What is anaerobic respiration in animals also called?",
            options: ["Fermentation", "Lactic acid fermentation", "Alcoholic fermentation", "Glycolysis"],
            correct: 1,
            explanation: "In animals, anaerobic respiration produces lactic acid, hence it's called lactic acid fermentation."
          },
          {
            id: "bio4_6",
            question: "Where does the light-dependent reaction of photosynthesis occur?",
            options: ["Stroma", "Thylakoid membranes", "Cytoplasm", "Mitochondria"],
            correct: 1,
            explanation: "The light-dependent reactions occur in the thylakoid membranes where chlorophyll captures light energy."
          },
          {
            id: "bio4_7",
            question: "What is the main product of anaerobic respiration in yeast?",
            options: ["Lactic acid", "Ethanol", "Carbon monoxide", "Methane"],
            correct: 1,
            explanation: "Yeast produces ethanol and carbon dioxide during anaerobic respiration (alcoholic fermentation)."
          },
          {
            id: "bio4_8",
            question: "Which process releases the most ATP per glucose molecule?",
            options: ["Aerobic respiration", "Anaerobic respiration", "Photosynthesis", "Fermentation"],
            correct: 0,
            explanation: "Aerobic respiration produces about 38 ATP molecules per glucose, much more than anaerobic processes."
          },
          {
            id: "bio4_9",
            question: "What happens to the rate of photosynthesis as light intensity increases?",
            options: [
              "It increases indefinitely",
              "It increases then plateaus",
              "It decreases",
              "It remains constant"
            ],
            correct: 1,
            explanation: "As light intensity increases, photosynthesis rate increases until another factor becomes limiting, then it plateaus."
          },
          {
            id: "bio4_10",
            question: "Which molecule stores energy in cells?",
            options: ["ADP", "ATP", "DNA", "RNA"],
            correct: 1,
            explanation: "ATP (Adenosine Triphosphate) is the universal energy currency in cells."
          }
        ]
      },
      {
        id: "homeostasis-response",
        name: "Homeostasis and Response",
        description: "Human nervous system, hormones, and maintaining internal conditions",
        questions: [
          {
            id: "bio5_1",
            question: "What is homeostasis?",
            options: [
              "The breakdown of glucose",
              "The maintenance of constant internal conditions",
              "The production of hormones",
              "The growth of organisms"
            ],
            correct: 1,
            explanation: "Homeostasis is the regulation of internal conditions to maintain optimal conditions for enzyme action and cellular processes."
          },
          {
            id: "bio5_2",
            question: "Which part of the brain controls body temperature?",
            options: ["Cerebrum", "Cerebellum", "Hypothalamus", "Medulla"],
            correct: 2,
            explanation: "The hypothalamus acts as the body's thermostat, monitoring and controlling body temperature."
          },
          {
            id: "bio5_3",
            question: "What hormone is produced by the pancreas to lower blood glucose?",
            options: ["Glucagon", "Insulin", "Adrenaline", "Thyroxine"],
            correct: 1,
            explanation: "Insulin is released when blood glucose is high and causes cells to take up glucose from the blood."
          },
          {
            id: "bio5_4",
            question: "Which hormone prepares the body for 'fight or flight'?",
            options: ["Insulin", "Glucagon", "Adrenaline", "ADH"],
            correct: 2,
            explanation: "Adrenaline increases heart rate, breathing rate, and blood glucose to prepare for action."
          },
          {
            id: "bio5_5",
            question: "What is a synapse?",
            options: [
              "A type of neuron",
              "The gap between two neurons",
              "A hormone",
              "Part of the brain"
            ],
            correct: 1,
            explanation: "A synapse is the gap between neurons where chemical signals (neurotransmitters) pass from one neuron to another."
          },
          {
            id: "bio5_6",
            question: "Which gland produces ADH (antidiuretic hormone)?",
            options: ["Pancreas", "Thyroid", "Pituitary", "Adrenal"],
            correct: 2,
            explanation: "The pituitary gland produces ADH, which regulates water balance in the body."
          },
          {
            id: "bio5_7",
            question: "What happens when blood glucose levels are too low?",
            options: [
              "Insulin is released",
              "Glucagon is released",
              "ADH is released",
              "Adrenaline is released"
            ],
            correct: 1,
            explanation: "When blood glucose is low, glucagon is released to stimulate the conversion of glycogen to glucose."
          },
          {
            id: "bio5_8",
            question: "Which type of neuron carries impulses from the CNS to effectors?",
            options: ["Sensory neuron", "Motor neuron", "Relay neuron", "Connector neuron"],
            correct: 1,
            explanation: "Motor neurons carry nerve impulses from the central nervous system to effector organs like muscles."
          },
          {
            id: "bio5_9",
            question: "What is the function of the iris in the eye?",
            options: [
              "To focus light",
              "To detect light",
              "To control the amount of light entering",
              "To produce tears"
            ],
            correct: 2,
            explanation: "The iris controls the size of the pupil, regulating how much light enters the eye."
          },
          {
            id: "bio5_10",
            question: "Which part of the kidney filters blood?",
            options: ["Ureter", "Bladder", "Nephron", "Urethra"],
            correct: 2,
            explanation: "Nephrons are the functional units of the kidney that filter blood and produce urine."
          }
        ]
      },
      {
        id: "inheritance-variation-evolution",
        name: "Inheritance, Variation and Evolution",
        description: "Genetics, DNA, natural selection, and evolutionary processes",
        questions: [
          {
            id: "bio6_1",
            question: "What does DNA stand for?",
            options: [
              "Deoxyribonucleic acid",
              "Deoxyribose nucleic acid",
              "Diribonucleic acid",
              "Deoxyribonuclear acid"
            ],
            correct: 0,
            explanation: "DNA (Deoxyribonucleic acid) is the molecule that carries genetic information in all living organisms."
          },
          {
            id: "bio6_2",
            question: "How many chromosomes do humans have in each body cell?",
            options: ["23", "24", "46", "48"],
            correct: 2,
            explanation: "Humans have 46 chromosomes (23 pairs) in each body cell, with 23 from each parent."
          },
          {
            id: "bio6_3",
            question: "What is an allele?",
            options: [
              "A type of chromosome",
              "A version of a gene",
              "A type of protein",
              "A section of DNA"
            ],
            correct: 1,
            explanation: "An allele is a different version of the same gene that may produce different characteristics."
          },
          {
            id: "bio6_4",
            question: "What does 'homozygous' mean?",
            options: [
              "Having two different alleles",
              "Having two identical alleles",
              "Having one allele",
              "Having three alleles"
            ],
            correct: 1,
            explanation: "Homozygous means having two identical alleles for a particular gene (e.g., AA or aa)."
          },
          {
            id: "bio6_5",
            question: "Who proposed the theory of evolution by natural selection?",
            options: ["Mendel", "Watson", "Darwin", "Crick"],
            correct: 2,
            explanation: "Charles Darwin proposed the theory of evolution by natural selection in 'On the Origin of Species'."
          },
          {
            id: "bio6_6",
            question: "What is a mutation?",
            options: [
              "A change in DNA sequence",
              "A type of reproduction",
              "A form of inheritance",
              "A chromosomal disorder"
            ],
            correct: 0,
            explanation: "A mutation is a change in the DNA sequence that can lead to new characteristics or genetic disorders."
          },
          {
            id: "bio6_7",
            question: "What is the term for organisms of the same species that can interbreed?",
            options: ["Population", "Community", "Ecosystem", "Habitat"],
            correct: 0,
            explanation: "A population consists of all the organisms of the same species living in the same area at the same time."
          },
          {
            id: "bio6_8",
            question: "Which process produces genetically identical offspring?",
            options: ["Sexual reproduction", "Asexual reproduction", "Fertilization", "Meiosis"],
            correct: 1,
            explanation: "Asexual reproduction produces genetically identical offspring (clones) from a single parent."
          },
          {
            id: "bio6_9",
            question: "What increases genetic variation in a population?",
            options: ["Asexual reproduction", "Sexual reproduction", "Cloning", "Mitosis"],
            correct: 1,
            explanation: "Sexual reproduction increases genetic variation through independent assortment and crossing over during meiosis."
          },
          {
            id: "bio6_10",
            question: "What is selective breeding?",
            options: [
              "Natural selection in the wild",
              "Humans choosing which organisms reproduce",
              "Random mating",
              "Genetic engineering"
            ],
            correct: 1,
            explanation: "Selective breeding involves humans choosing organisms with desired traits to reproduce and pass on those traits."
          }
        ]
      },
      {
        id: "ecology",
        name: "Ecology",
        description: "Ecosystems, food chains, environmental interactions, and human impact",
        questions: [
          {
            id: "bio7_1",
            question: "What is an ecosystem?",
            options: [
              "All the animals in an area",
              "All the plants in an area",
              "All living and non-living factors in an area",
              "Only the non-living factors in an area"
            ],
            correct: 2,
            explanation: "An ecosystem includes all the living organisms and non-living factors in an area and how they interact."
          },
          {
            id: "bio7_2",
            question: "What are producers in a food chain?",
            options: [
              "Animals that eat plants",
              "Animals that eat other animals",
              "Organisms that make their own food",
              "Decomposers"
            ],
            correct: 2,
            explanation: "Producers (usually plants) make their own food through photosynthesis and form the base of food chains."
          },
          {
            id: "bio7_3",
            question: "What is biodiversity?",
            options: [
              "The number of animals only",
              "The variety of living organisms",
              "The number of plants only",
              "The size of an ecosystem"
            ],
            correct: 1,
            explanation: "Biodiversity refers to the variety of living organisms in an ecosystem, including different species, genetic diversity, and ecosystem diversity."
          },
          {
            id: "bio7_4",
            question: "Which gas contributes most to the greenhouse effect?",
            options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
            correct: 2,
            explanation: "Carbon dioxide is the main greenhouse gas contributing to global warming and climate change."
          },
          {
            id: "bio7_5",
            question: "What is eutrophication?",
            options: [
              "Water pollution by plastics",
              "Excessive nutrients causing algae growth",
              "Air pollution",
              "Soil erosion"
            ],
            correct: 1,
            explanation: "Eutrophication occurs when excess nutrients (often from fertilizers) cause rapid algae growth, depleting oxygen in water."
          },
          {
            id: "bio7_6",
            question: "What do decomposers do in an ecosystem?",
            options: [
              "Eat living plants",
              "Hunt other animals",
              "Break down dead material",
              "Produce oxygen"
            ],
            correct: 2,
            explanation: "Decomposers break down dead organisms and waste, recycling nutrients back into the ecosystem."
          },
          {
            id: "bio7_7",
            question: "What is a habitat?",
            options: [
              "All organisms in an area",
              "The place where an organism lives",
              "The food an organism eats",
              "The way organisms interact"
            ],
            correct: 1,
            explanation: "A habitat is the natural environment where an organism lives and meets all its needs for survival."
          },
          {
            id: "bio7_8",
            question: "What happens to energy as it moves up trophic levels?",
            options: [
              "It increases",
              "It stays the same",
              "It decreases",
              "It doubles"
            ],
            correct: 2,
            explanation: "Energy decreases as it moves up trophic levels because energy is lost as heat at each level (only about 10% is transferred)."
          },
          {
            id: "bio7_9",
            question: "What is deforestation?",
            options: [
              "Planting new trees",
              "Cutting down forests",
              "Forest fires",
              "Natural tree death"
            ],
            correct: 1,
            explanation: "Deforestation is the permanent removal of forests, usually for agriculture, logging, or urban development."
          },
          {
            id: "bio7_10",
            question: "Which method can be used to estimate population size?",
            options: ["Counting all individuals", "Quadrats", "Guessing", "Measuring area"],
            correct: 1,
            explanation: "Quadrats are used to sample small areas and estimate population density and total population size."
          }
        ]
      },
      {
        id: "key-ideas",
        name: "Key Ideas",
        description: "Fundamental biological concepts and scientific methods",
        questions: [
          {
            id: "bio8_1",
            question: "What are the characteristics of living organisms?",
            options: [
              "Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition",
              "Only growth and reproduction",
              "Only movement and feeding",
              "Only breathing and moving"
            ],
            correct: 0,
            explanation: "Living organisms show all seven life processes: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition (MRS GREN)."
          },
          {
            id: "bio8_2",
            question: "What is the basic unit of life?",
            options: ["Organ", "Tissue", "Cell", "Organism"],
            correct: 2,
            explanation: "The cell is the basic unit of life - all living things are made of one or more cells."
          },
          {
            id: "bio8_3",
            question: "What is the difference between prokaryotic and eukaryotic cells?",
            options: [
              "Size only",
              "Prokaryotes have no nucleus, eukaryotes have a nucleus",
              "Color only",
              "Shape only"
            ],
            correct: 1,
            explanation: "Prokaryotic cells (bacteria) have no membrane-bound nucleus, while eukaryotic cells have a membrane-bound nucleus."
          },
          {
            id: "bio8_4",
            question: "What is an enzyme?",
            options: [
              "A type of cell",
              "A biological catalyst",
              "A type of food",
              "A waste product"
            ],
            correct: 1,
            explanation: "Enzymes are biological catalysts that speed up chemical reactions without being used up in the process."
          },
          {
            id: "bio8_5",
            question: "What affects enzyme activity?",
            options: [
              "Temperature and pH only",
              "Temperature, pH, and substrate concentration",
              "Only temperature",
              "Only pH"
            ],
            correct: 1,
            explanation: "Enzyme activity is affected by temperature, pH, substrate concentration, and enzyme concentration."
          },
          {
            id: "bio8_6",
            question: "What is diffusion?",
            options: [
              "Movement of particles from low to high concentration",
              "Movement of particles from high to low concentration",
              "Movement requiring energy",
              "Movement only in liquids"
            ],
            correct: 1,
            explanation: "Diffusion is the passive movement of particles from an area of high concentration to low concentration."
          },
          {
            id: "bio8_7",
            question: "What is osmosis?",
            options: [
              "Movement of any particles",
              "Movement of water through a partially permeable membrane",
              "Movement requiring energy",
              "Movement of gases only"
            ],
            correct: 1,
            explanation: "Osmosis is the movement of water molecules through a partially permeable membrane from high to low water concentration."
          },
          {
            id: "bio8_8",
            question: "What is active transport?",
            options: [
              "Movement without energy",
              "Movement with energy against concentration gradient",
              "Only movement of water",
              "Movement with concentration gradient"
            ],
            correct: 1,
            explanation: "Active transport uses energy to move substances against their concentration gradient (from low to high concentration)."
          },
          {
            id: "bio8_9",
            question: "What is the scientific method?",
            options: [
              "Guessing answers",
              "Observation, hypothesis, experiment, conclusion",
              "Only doing experiments",
              "Only making observations"
            ],
            correct: 1,
            explanation: "The scientific method involves making observations, forming hypotheses, conducting controlled experiments, and drawing conclusions."
          },
          {
            id: "bio8_10",
            question: "What makes a good scientific experiment?",
            options: [
              "Testing multiple variables at once",
              "One variable changed, others controlled",
              "No controls needed",
              "Guessing results"
            ],
            correct: 1,
            explanation: "A good experiment changes only one variable (independent variable) while keeping all others constant (controlled variables)."
          }
        ]
      }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "⚗️",
    color: "bg-red-500",
    topics: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        description: "Atoms, elements, and compounds",
        questions: [
          {
            id: "chem1_1",
            question: "What is the charge of a proton?",
            options: ["Positive", "Negative", "Neutral", "Variable"],
            correct: 0,
            explanation: "Protons have a positive charge."
          }
        ]
      }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    icon: "🔭",
    color: "bg-purple-500",
    topics: [
      {
        id: "forces",
        name: "Forces",
        description: "Types of forces and their effects",
        questions: [
          {
            id: "phys1_1",
            question: "What is the unit of force?",
            options: ["Newton", "Joule", "Watt", "Pascal"],
            correct: 0,
            explanation: "Force is measured in Newtons (N)."
          }
        ]
      }
    ]
  }
];
