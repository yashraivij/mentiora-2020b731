import { Subject } from "@/types";

export const curriculum: Subject[] = [
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
            id: "maths-number-1",
            question: "What is 2 + 2?",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["Correct answer: 4"],
            },
          },
          {
            id: "maths-number-2",
            question: "What is 5 x 5?",
            marks: 1,
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: ["Correct answer: 25"],
            },
          },
        ],
      },
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            id: "maths-algebra-1",
            question: "Solve for x: 2x + 3 = 7",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: ["Subtract 3 from both sides: 2x = 4", "Divide by 2: x = 2"],
            },
          },
          {
            id: "maths-algebra-2",
            question: "Expand: (x + 2)(x - 2)",
            marks: 2,
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: ["Correct expansion: x^2 - 4"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "bg-orange-500",
    topics: [
      {
        id: "atoms",
        name: "Atoms",
        questions: [
          {
            id: "chem-atoms-1",
            question: "What are the three subatomic particles?",
            marks: 3,
            markingCriteria: {
              ao1: 3,
              ao2: 0,
              ao3: 0,
              breakdown: ["Protons", "Neutrons", "Electrons"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    color: "bg-green-500",
    topics: [
      {
        id: "cells",
        name: "Cells",
        questions: [
          {
            id: "bio-cells-1",
            question: "What are the main parts of an animal cell?",
            marks: 4,
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Nucleus",
                "Cytoplasm",
                "Cell Membrane",
                "Mitochondria",
              ],
            },
          },
        ],
      },
      {
        id: "genetics",
        name: "Genetics",
        questions: [
          {
            id: "bio-genetics-1",
            question: "What is a gene?",
            marks: 2,
            markingCriteria: {
              ao1: 2,
              ao2: 0,
              ao3: 0,
              breakdown: ["A unit of heredity", "Codes for a specific trait"],
            },
          },
        ],
      },
      {
        id: "ecology",
        name: "Ecology",
        questions: [
          {
            id: "bio-ecology-1",
            question: "What is an ecosystem?",
            marks: 2,
            markingCriteria: {
              ao1: 2,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "A community of living organisms",
                "Interacting with their physical environment",
              ],
            },
          },
        ],
      },
      {
        id: "bioenergetics",
        name: "Bioenergetics",
        questions: [
          {
            id: "bio-bioenergetics-1",
            question: "Explain the process of photosynthesis and write the word equation for this reaction.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Process involves light energy converting carbon dioxide and water into glucose and oxygen (2 marks)",
                "Word equation: Carbon dioxide + Water → Glucose + Oxygen (2 marks)",
                "Mention of chlorophyll and light energy requirement (1 mark)",
                "Reference to oxygen as waste product (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-2",
            question: "Describe how the rate of photosynthesis is affected by limiting factors.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Light intensity as limiting factor (2 marks)",
                "Carbon dioxide concentration as limiting factor (2 marks)",
                "Temperature as limiting factor (2 marks)",
                "Explanation of how each factor affects the rate (2 marks)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-3",
            question: "Compare aerobic and anaerobic respiration in terms of energy yield and products.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Aerobic respiration produces more ATP/energy (2 marks)",
                "Aerobic produces CO2 and water, anaerobic produces lactic acid/ethanol (2 marks)",
                "Aerobic requires oxygen, anaerobic does not (2 marks)",
                "Correct comparison structure (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-4",
            question: "Explain how glucose is broken down during respiration to release energy.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Glucose is broken down in stages (1 mark)",
                "Energy released is used to make ATP (2 marks)",
                "Process occurs in mitochondria (1 mark)",
                "Mention of carbon dioxide and water as waste products (2 marks)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-5",
            question: "Describe the adaptations of leaves for efficient photosynthesis.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Large surface area for light absorption (2 marks)",
                "Thin structure for efficient gas exchange (2 marks)",
                "Chlorophyll in chloroplasts for light capture (2 marks)",
                "Stomata for gas exchange (2 marks)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-6",
            question: "Explain why plants need both photosynthesis and respiration.",
            marks: 5,
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Photosynthesis makes glucose (1 mark)",
                "Respiration releases energy from glucose (2 marks)",
                "Both processes needed for plant survival (1 mark)",
                "Respiration occurs when photosynthesis cannot (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-7",
            question: "Describe how the products of photosynthesis are used by plants.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Glucose used for respiration/energy (2 marks)",
                "Glucose converted to starch for storage (2 marks)",
                "Glucose used to make cellulose for cell walls (1 mark)",
                "Oxygen released as waste product (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-8",
            question: "Explain the effect of temperature on the rate of photosynthesis.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Rate increases with temperature up to optimum (2 marks)",
                "Enzymes control photosynthesis reactions (2 marks)",
                "High temperatures denature enzymes (2 marks)",
                "Graph or data interpretation if provided (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-9",
            question: "Compare the energy changes in photosynthesis and respiration.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Photosynthesis stores energy (endothermic) (2 marks)",
                "Respiration releases energy (exothermic) (2 marks)",
                "Energy source identification (light vs glucose) (1 mark)",
                "Opposite processes concept (1 mark)"
              ]
            }
          },
          {
            id: "bio-bioenergetics-10",
            question: "Describe how farmers can increase crop yield using knowledge of limiting factors.",
            marks: 8,
            markingCriteria: {
              ao1: 3,
              ao2: 4,
              ao3: 1,
              breakdown: [
                "Provide artificial lighting in greenhouses (2 marks)",
                "Increase CO2 concentration (2 marks)",
                "Control temperature in greenhouses (2 marks)",
                "Application to increasing photosynthesis rate (2 marks)"
              ]
            }
          }
        ]
      },
      {
        id: "homeostasis-response",
        name: "Homeostasis and Response",
        questions: [
          {
            id: "bio-homeostasis-1",
            question: "Explain what is meant by homeostasis and why it is important for organisms.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Definition: maintaining constant internal environment (2 marks)",
                "Importance for enzyme function (2 marks)",
                "Examples of factors controlled (temperature, pH, glucose) (1 mark)",
                "Reference to optimal conditions (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-2",
            question: "Describe how blood glucose levels are controlled in the human body.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Pancreas monitors blood glucose (2 marks)",
                "Insulin released when glucose too high (2 marks)",
                "Glucagon released when glucose too low (2 marks)",
                "Effects on liver and muscle cells (2 marks)"
              ]
            }
          },
          {
            id: "bio-homeostasis-3",
            question: "Explain how the nervous system coordinates responses to stimuli.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Stimulus detected by receptors (2 marks)",
                "Impulse travels along sensory neurone to CNS (2 marks)",
                "CNS processes information and sends response (2 marks)",
                "Motor neurone carries impulse to effector (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-4",
            question: "Describe the structure and function of a reflex arc.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Receptor detects stimulus (2 marks)",
                "Sensory neurone carries impulse to spinal cord (2 marks)",
                "Relay neurone in spinal cord (2 marks)",
                "Motor neurone to effector muscle (2 marks)"
              ]
            }
          },
          {
            id: "bio-homeostasis-5",
            question: "Explain how body temperature is regulated in humans.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Hypothalamus monitors body temperature (2 marks)",
                "Responses when too hot (sweating, vasodilation) (2 marks)",
                "Responses when too cold (shivering, vasoconstriction) (2 marks)",
                "Negative feedback concept (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-6",
            question: "Compare the nervous system and hormonal system in coordinating responses.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Nervous system is fast, hormonal is slow (2 marks)",
                "Nervous uses electrical impulses, hormonal uses chemicals (2 marks)",
                "Nervous is short-lasting, hormonal is long-lasting (1 mark)",
                "Both coordinate body functions (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-7",
            question: "Describe how the eye responds to changes in light intensity.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Iris controls amount of light entering eye (2 marks)",
                "Pupil dilates in dim light (2 marks)",
                "Pupil constricts in bright light (2 marks)",
                "Reflex action to protect retina (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-8",
            question: "Explain the role of hormones in controlling the menstrual cycle.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "FSH stimulates egg development (2 marks)",
                "LH triggers ovulation (2 marks)",
                "Oestrogen and progesterone control uterus lining (2 marks)",
                "Feedback mechanisms between hormones (2 marks)"
              ]
            }
          },
          {
            id: "bio-homeostasis-9",
            question: "Describe how plants respond to light and gravity.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Phototropism - growth towards light (2 marks)",
                "Gravitropism - response to gravity (2 marks)",
                "Role of auxin hormone (1 mark)",
                "Survival advantage of responses (1 mark)"
              ]
            }
          },
          {
            id: "bio-homeostasis-10",
            question: "Explain how negative feedback helps maintain homeostasis.",
            marks: 5,
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Change detected by receptors (1 mark)",
                "Response counteracts the change (2 marks)",
                "Returns system to normal levels (1 mark)",
                "Example of negative feedback (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "inheritance-variation-evolution",
        name: "Inheritance, Variation and Evolution",
        questions: [
          {
            id: "bio-inheritance-1",
            question: "Explain the difference between sexual and asexual reproduction.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Sexual reproduction involves two parents (2 marks)",
                "Asexual reproduction involves one parent (2 marks)",
                "Sexual produces genetically different offspring (1 mark)",
                "Asexual produces genetically identical offspring (1 mark)"
              ]
            }
          },
          {
            id: "bio-inheritance-2",
            question: "Describe the structure of DNA and explain how genetic information is stored.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Double helix structure (2 marks)",
                "Made of nucleotides with bases A, T, G, C (2 marks)",
                "Base pairing rules (A-T, G-C) (2 marks)",
                "Sequence of bases codes for proteins (2 marks)"
              ]
            }
          },
          {
            id: "bio-inheritance-3",
            question: "Explain how characteristics are inherited from parents to offspring.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Genes carry information for characteristics (2 marks)",
                "Alleles are different versions of genes (2 marks)",
                "Offspring inherit alleles from both parents (2 marks)",
                "Dominant and recessive allele concept (1 mark)"
              ]
            }
          },
          {
            id: "bio-inheritance-4",
            question: "Use a genetic cross to show the inheritance of a single characteristic.",
            marks: 8,
            markingCriteria: {
              ao1: 3,
              ao2: 4,
              ao3: 1,
              breakdown: [
                "Correct parent genotypes shown (2 marks)",
                "All possible gametes identified (2 marks)",
                "Punnett square completed correctly (2 marks)",
                "Phenotype ratios calculated (2 marks)"
              ]
            }
          },
          {
            id: "bio-inheritance-5",
            question: "Explain what causes variation in organisms and why it is important.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Genetic variation from sexual reproduction (2 marks)",
                "Environmental variation from surroundings (2 marks)",
                "Importance for survival and evolution (1 mark)",
                "Examples of each type of variation (1 mark)"
              ]
            }
          },
          {
            id: "bio-inheritance-6",
            question: "Describe the process of natural selection and evolution.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Variation exists in populations (2 marks)",
                "Competition for resources (2 marks)",
                "Better adapted individuals survive and reproduce (2 marks)",
                "Advantageous characteristics passed on (2 marks)"
              ]
            }
          },
          {
            id: "bio-inheritance-7",
            question: "Explain how mutations can lead to evolutionary change.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Mutations are changes in DNA (2 marks)",
                "Most mutations are harmful or neutral (2 marks)",
                "Rarely mutations provide advantages (1 mark)",
                "Beneficial mutations spread through population (1 mark)"
              ]
            }
          },
          {
            id: "bio-inheritance-8",
            question: "Describe how selective breeding is used to develop new varieties.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Choose parents with desired characteristics (2 marks)",
                "Breed these individuals together (2 marks)",
                "Select best offspring and repeat process (2 marks)",
                "Examples of selective breeding applications (1 mark)"
              ]
            }
          },
          {
            id: "bio-inheritance-9",
            question: "Explain the evidence for evolution including fossils and DNA analysis.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Fossil record shows changes over time (2 marks)",
                "DNA similarities between related species (2 marks)",
                "Geographical distribution of species (2 marks)",
                "How evidence supports common ancestry (2 marks)"
              ]
            }
          },
          {
            id: "bio-inheritance-10",
            question: "Compare genetic engineering with selective breeding.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Genetic engineering transfers genes between species (2 marks)",
                "Selective breeding uses existing variation (2 marks)",
                "Genetic engineering is faster and more precise (1 mark)",
                "Both produce organisms with desired characteristics (1 mark)"
              ]
            }
          }
        ]
      },
      {
        id: "ecology",
        name: "Ecology",
        questions: [
          {
            id: "bio-ecology-1",
            question: "Explain the terms ecosystem, population, and community with examples.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Ecosystem: living and non-living components in an area (2 marks)",
                "Population: all individuals of one species in an area (2 marks)",
                "Community: all populations in an area (1 mark)",
                "Appropriate examples given (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-2",
            question: "Describe how energy flows through an ecosystem using a food chain.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Energy enters from sunlight (2 marks)",
                "Producers capture energy by photosynthesis (2 marks)",
                "Energy transferred through feeding relationships (2 marks)",
                "Energy lost at each trophic level (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-3",
            question: "Explain why food chains rarely have more than five trophic levels.",
            marks: 5,
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Energy lost at each transfer (2 marks)",
                "Only 10% energy passes to next level (2 marks)",
                "Insufficient energy to support more levels (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-4",
            question: "Describe the carbon cycle and explain its importance.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "CO2 removed by photosynthesis (2 marks)",
                "CO2 released by respiration and combustion (2 marks)",
                "Role of decomposers in releasing CO2 (2 marks)",
                "Importance for maintaining atmospheric CO2 levels (2 marks)"
              ]
            }
          },
          {
            id: "bio-ecology-5",
            question: "Explain how human activities affect biodiversity.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Habitat destruction reduces species numbers (2 marks)",
                "Pollution affects organism survival (2 marks)",
                "Climate change alters habitats (2 marks)",
                "Examples of specific human impacts (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-6",
            question: "Describe methods used to sample organisms in their environment.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Quadrats for sampling plants and slow-moving animals (2 marks)",
                "Transects for showing distribution (2 marks)",
                "Capture-recapture for mobile animals (1 mark)",
                "Importance of random sampling (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-7",
            question: "Explain how decomposers are important in nutrient cycling.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Decomposers break down dead organisms (2 marks)",
                "Release nutrients back to environment (2 marks)",
                "Nutrients available for producer uptake (1 mark)",
                "Examples of decomposers (bacteria, fungi) (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-8",
            question: "Describe the effects of introducing non-native species to ecosystems.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Non-native species may lack natural predators (2 marks)",
                "Can outcompete native species for resources (2 marks)",
                "May disrupt food chains and webs (2 marks)",
                "Examples of invasive species impacts (1 mark)"
              ]
            }
          },
          {
            id: "bio-ecology-9",
            question: "Explain how conservation methods help protect endangered species.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Protected areas preserve habitats (2 marks)",
                "Captive breeding programs increase numbers (2 marks)",
                "Legal protection prevents hunting (2 marks)",
                "Education raises awareness (2 marks)"
              ]
            }
          },
          {
            id: "bio-ecology-10",
            question: "Describe the water cycle and its importance for ecosystems.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Evaporation from water bodies (2 marks)",
                "Transpiration from plants (1 mark)",
                "Condensation forms clouds (1 mark)",
                "Precipitation returns water to Earth (2 marks)"
              ]
            }
          }
        ]
      },
      {
        id: "key-ideas",
        name: "Key Ideas",
        questions: [
          {
            id: "bio-key-ideas-1",
            question: "Explain how the structure of a cell membrane allows it to control what enters and leaves the cell.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Phospholipid bilayer structure (2 marks)",
                "Proteins embedded in membrane (2 marks)",
                "Selective permeability concept (1 mark)",
                "Different transport methods (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-2",
            question: "Describe how enzymes are affected by temperature and pH.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Temperature affects enzyme activity rate (2 marks)",
                "Optimum temperature concept (2 marks)",
                "pH affects enzyme shape and function (2 marks)",
                "Denaturation at extreme conditions (2 marks)"
              ]
            }
          },
          {
            id: "bio-key-ideas-3",
            question: "Explain how the circulatory system is adapted for efficient transport.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Heart pumps blood around body (2 marks)",
                "Arteries carry blood away from heart (2 marks)",
                "Veins return blood to heart (2 marks)",
                "Capillaries allow exchange of materials (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-4",
            question: "Describe how gas exchange occurs in the lungs and explain the adaptations.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Oxygen diffuses from alveoli to blood (2 marks)",
                "Carbon dioxide diffuses from blood to alveoli (2 marks)",
                "Large surface area of alveoli (2 marks)",
                "Thin walls and good blood supply (2 marks)"
              ]
            }
          },
          {
            id: "bio-key-ideas-5",
            question: "Explain how organisms are classified and why classification is useful.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Classification based on similarities (2 marks)",
                "Hierarchical system (kingdom to species) (2 marks)",
                "Helps identify organisms (1 mark)",
                "Shows evolutionary relationships (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-6",
            question: "Describe the importance of biodiversity and threats to it.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Biodiversity provides stability to ecosystems (2 marks)",
                "Source of medicines and materials (2 marks)",
                "Threats include habitat loss and climate change (2 marks)",
                "Need for conservation efforts (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-7",
            question: "Explain how cell division produces new cells for growth and repair.",
            marks: 6,
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Mitosis produces identical diploid cells (2 marks)",
                "Chromosome duplication and separation (2 marks)",
                "Importance for growth and repair (1 mark)",
                "Cell cycle concept (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-8",
            question: "Describe how plants obtain the materials they need for photosynthesis.",
            marks: 5,
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "CO2 enters through stomata (2 marks)",
                "Water absorbed by roots (2 marks)",
                "Light energy from sun (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-9",
            question: "Explain how the nervous system enables organisms to respond to changes.",
            marks: 7,
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Receptors detect stimuli (2 marks)",
                "Nervous system processes information (2 marks)",
                "Effectors carry out responses (2 marks)",
                "Speed of nervous responses (1 mark)"
              ]
            }
          },
          {
            id: "bio-key-ideas-10",
            question: "Describe how organisms depend on each other and their environment.",
            marks: 8,
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 1,
              breakdown: [
                "Food chains show feeding relationships (2 marks)",
                "Organisms depend on others for food (2 marks)",
                "Environmental factors affect survival (2 marks)",
                "Interdependence in ecosystems (2 marks)"
              ]
            }
          }
        ]
      }
    ]
  }
];
