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
    id: 'aqa-combined-science-trilogy',
    name: 'Combined Science (Trilogy)',
    topics: [
      // BIOLOGY TOPICS - PAPER 1 (B1-B4)
      {
        id: 'cell-biology',
        name: 'Cell biology — (Biology)',
        questions: [
          {
            id: 'cb-q1',
            question: 'Compare the structure of a plant cell and an animal cell, identifying three similarities and three differences.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Similarities: Both have cell membrane, cytoplasm, nucleus. Differences: Plant cells have cell wall, chloroplasts, and large permanent vacuole; animal cells do not have these structures.',
            markingCriteria: {
              breakdown: [
                'Three correct similarities (3 marks)',
                'Three correct differences (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q2',
            question: 'Explain the difference between prokaryotic and eukaryotic cells, giving one example of each.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Prokaryotic cells have no nucleus (genetic material free in cytoplasm) - example: bacteria. Eukaryotic cells have a nucleus containing genetic material - example: plant/animal cells.',
            markingCriteria: {
              breakdown: [
                'Definition of prokaryotic with example (2 marks)',
                'Definition of eukaryotic with example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q3',
            question: 'Calculate the total magnification when using a ×10 eyepiece lens and a ×40 objective lens.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Total magnification = eyepiece magnification × objective magnification = 10 × 40 = ×400',
            markingCriteria: {
              breakdown: [
                'Correct method (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q4',
            question: 'Describe the process of mitosis and explain why it is important for organisms.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Mitosis produces two genetically identical diploid cells from one diploid cell. Chromosomes duplicate, line up at cell center, separate to opposite poles, then cell divides. Important for growth, repair, and asexual reproduction.',
            markingCriteria: {
              breakdown: [
                'Description of mitosis process (3 marks)',
                'Importance explained (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q5',
            question: 'Explain how the surface area to volume ratio affects the efficiency of exchange in cells.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Smaller cells have larger surface area to volume ratio. This allows more efficient exchange of substances across cell membrane. Large cells need specialized exchange surfaces to maintain efficiency.',
            markingCriteria: {
              breakdown: [
                'Surface area to volume ratio concept (2 marks)',
                'Effect on exchange efficiency (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q6',
            question: 'Describe how substances move by diffusion, osmosis, and active transport.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Diffusion: movement from high to low concentration, no energy needed. Osmosis: diffusion of water through partially permeable membrane. Active transport: movement against concentration gradient using energy.',
            markingCriteria: {
              breakdown: [
                'Diffusion definition (2 marks)',
                'Osmosis definition (2 marks)',
                'Active transport definition (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q7',
            question: 'Explain why plant cells need chloroplasts but animal cells do not.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Plant cells need chloroplasts because they contain chlorophyll for photosynthesis, allowing plants to make their own food using light energy. Animal cells get energy from consuming other organisms, so do not need to photosynthesize.',
            markingCriteria: {
              breakdown: [
                'Reference to photosynthesis (2 marks)',
                'Explanation of different energy sources (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q8',
            question: 'Calculate the actual size of a cell that appears 2.5 mm long under ×100 magnification.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Actual size = observed size ÷ magnification = 2.5 mm ÷ 100 = 0.025 mm = 25 μm',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct calculation (1 mark)',
                'Appropriate units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q9',
            question: 'Describe the key features of bacterial cells and explain why they are classified as prokaryotes.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Bacterial cells have cell wall, cell membrane, cytoplasm, and genetic material (DNA) but no nucleus. The DNA is free in the cytoplasm. They may have plasmids (small DNA rings) and flagella for movement. Classified as prokaryotes because genetic material is not enclosed in a nucleus.',
            markingCriteria: {
              breakdown: [
                'Key structural features (3 marks)',
                'Explanation of prokaryotic classification (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          },
          {
            id: 'cb-q10',
            question: 'Explain what stem cells are and why they are important in medicine.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Stem cells are undifferentiated cells that can divide and develop into different specialized cell types. Important in medicine for treating conditions like diabetes, paralysis, and replacing damaged tissues. Can potentially cure diseases by replacing faulty cells.',
            markingCriteria: {
              breakdown: [
                'Definition of stem cells (2 marks)',
                'Medical applications (2 marks)',
                'Potential benefits (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B1'
          }
        ]
      },
      {
        id: 'organisation',
        name: 'Organisation — (Biology)',
        questions: [
          {
            id: 'org-q1',
            question: 'Describe the levels of organisation in multicellular organisms from cells to organisms.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Cells → Tissues → Organs → Organ Systems → Organisms. Each level is made up of the previous level working together.',
            markingCriteria: {
              breakdown: [
                'Correct sequence (2 marks)',
                'Explanation of relationship (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q2',
            question: 'Explain how the structure of the small intestine is adapted for absorption.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Large surface area due to villi and microvilli. Thin walls (one cell thick) for short diffusion distance. Good blood supply to maintain concentration gradient. Moist surface for absorption.',
            markingCriteria: {
              breakdown: [
                'Surface area adaptations (2 marks)',
                'Thin walls (2 marks)',
                'Blood supply and concentration gradient (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q3',
            question: 'Describe the function of enzymes and explain how temperature affects enzyme activity.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Enzymes are biological catalysts that speed up reactions by lowering activation energy. As temperature increases, enzyme activity increases due to more kinetic energy. Above optimum temperature, enzymes denature and activity decreases.',
            markingCriteria: {
              breakdown: [
                'Function of enzymes (2 marks)',
                'Effect of increasing temperature (2 marks)',
                'Denaturation at high temperature (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q4',
            question: 'Explain how the heart pumps blood around the body.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Heart muscle contracts (systole) forcing blood out of ventricles into arteries. Heart muscle relaxes (diastole) allowing ventricles to fill with blood from atria. Valves prevent backflow.',
            markingCriteria: {
              breakdown: [
                'Systole description (2 marks)',
                'Diastole description (1 mark)',
                'Role of valves (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q5',
            question: 'Compare the structure and function of arteries, veins, and capillaries.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Arteries: thick muscular walls, carry blood away from heart at high pressure. Veins: thinner walls, valves, carry blood to heart at low pressure. Capillaries: one cell thick, allow exchange of substances.',
            markingCriteria: {
              breakdown: [
                'Artery structure and function (2 marks)',
                'Vein structure and function (2 marks)',
                'Capillary structure and function (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q6',
            question: 'Describe the role of the different components of blood.',
            marks: 8,
            difficulty: 'medium',
            modelAnswer: 'Red blood cells: transport oxygen using haemoglobin. White blood cells: fight infection and disease. Platelets: help blood clotting. Plasma: transports dissolved substances like glucose, amino acids, hormones, and waste products.',
            markingCriteria: {
              breakdown: [
                'Red blood cells (2 marks)',
                'White blood cells (2 marks)',
                'Platelets (2 marks)',
                'Plasma (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q7',
            question: 'Explain how lifestyle factors can affect cardiovascular disease risk.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Poor diet (high fat/salt) increases cholesterol and blood pressure. Smoking damages arteries and reduces oxygen transport. Lack of exercise weakens heart muscle. Stress can increase blood pressure.',
            markingCriteria: {
              breakdown: [
                'Diet effects (2 marks)',
                'Smoking effects (2 marks)',
                'Exercise and stress effects (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q8',
            question: 'Describe how xylem and phloem are adapted for their functions in plants.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Xylem: dead cells form hollow tubes for water transport, lignin provides strength. Phloem: living cells with sieve plates allow sugar transport, companion cells provide energy.',
            markingCriteria: {
              breakdown: [
                'Xylem structure and function (3 marks)',
                'Phloem structure and function (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q9',
            question: 'Explain the process of transpiration and its importance for plants.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Water evaporates from leaf surfaces through stomata. Creates transpiration stream that draws water up from roots. Important for cooling plant and transporting minerals.',
            markingCriteria: {
              breakdown: [
                'Process description (2 marks)',
                'Importance explained (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          },
          {
            id: 'org-q10',
            question: 'Describe the factors that affect the rate of transpiration.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Temperature: higher temperature increases evaporation rate. Wind: removes water vapour, increasing rate. Humidity: high humidity decreases rate. Light: opens stomata, increases rate.',
            markingCriteria: {
              breakdown: [
                'Temperature effect (1 mark)',
                'Wind effect (1 mark)',
                'Humidity effect (1 mark)',
                'Light effect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B2'
          }
        ]
      },
      {
        id: 'infection-and-response',
        name: 'Infection and response — (Biology)',
        questions: [
          {
            id: 'ir-q1',
            question: 'Describe the differences between communicable and non-communicable diseases.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Communicable diseases: caused by pathogens, can be spread between individuals (e.g., flu, malaria). Non-communicable diseases: not caused by pathogens, cannot be spread (e.g., cancer, diabetes).',
            markingCriteria: {
              breakdown: [
                'Communicable disease definition and example (2 marks)',
                'Non-communicable disease definition and example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q2',
            question: 'Explain how bacteria and viruses cause disease differently.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Bacteria: reproduce rapidly, produce toxins that damage tissues. Viruses: invade cells, use cell machinery to reproduce, cause cell damage when they burst out.',
            markingCriteria: {
              breakdown: [
                'Bacterial disease mechanism (2 marks)',
                'Viral disease mechanism (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q3',
            question: 'Describe the body\'s non-specific defence systems against pathogens.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Skin: barrier to pathogens. Nose: hairs and mucus trap particles. Trachea/bronchi: mucus traps pathogens, cilia move mucus upward. Stomach: acid kills pathogens.',
            markingCriteria: {
              breakdown: [
                'Skin barrier (1 mark)',
                'Nose defences (2 marks)',
                'Respiratory system defences (2 marks)',
                'Stomach acid (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q4',
            question: 'Explain how the immune system responds to pathogens.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'White blood cells detect foreign antigens on pathogens. B cells produce specific antibodies that bind to antigens. T cells destroy infected cells. Memory cells remain for rapid response to same pathogen.',
            markingCriteria: {
              breakdown: [
                'Antigen recognition (2 marks)',
                'Antibody production (2 marks)',
                'Memory cell function (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q5',
            question: 'Describe how vaccination provides immunity against disease.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Vaccine contains dead/weakened pathogens or their antigens. Immune system produces antibodies and memory cells. If real pathogen enters, memory cells rapidly produce antibodies for quick response.',
            markingCriteria: {
              breakdown: [
                'Vaccine contents (1 mark)',
                'Primary immune response (2 marks)',
                'Secondary immune response (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q6',
            question: 'Explain the difference between antibiotics and painkillers in treating disease.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Antibiotics: kill bacteria that cause disease, cure the infection. Painkillers: relieve symptoms but do not kill pathogens, do not cure disease.',
            markingCriteria: {
              breakdown: [
                'Antibiotic function (2 marks)',
                'Painkiller function (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q7',
            question: 'Describe the process of drug development from discovery to clinical use.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Discovery in laboratory. Preclinical testing on cells/tissues. Animal testing for safety. Clinical trials on healthy volunteers, then patients. Peer review and licensing before clinical use.',
            markingCriteria: {
              breakdown: [
                'Preclinical stages (2 marks)',
                'Clinical trial stages (2 marks)',
                'Final approval process (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q8',
            question: 'Explain how antibiotic resistance develops in bacterial populations.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Random mutations make some bacteria resistant to antibiotics. When antibiotics used, non-resistant bacteria die. Resistant bacteria survive and reproduce. Resistance allele frequency increases in population.',
            markingCriteria: {
              breakdown: [
                'Mutation creates resistance (1 mark)',
                'Selection pressure from antibiotics (1 mark)',
                'Survival of resistant bacteria (1 mark)',
                'Increase in resistance frequency (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q9',
            question: 'Describe the life cycle of a malaria parasite and how it is transmitted.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Mosquito bites infected person, takes up parasites with blood. Parasites reproduce in mosquito. Mosquito bites healthy person, injects parasites. Parasites reproduce in liver and red blood cells.',
            markingCriteria: {
              breakdown: [
                'Uptake by mosquito (2 marks)',
                'Reproduction in mosquito (1 mark)',
                'Transmission to new host (2 marks)',
                'Reproduction in human (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          },
          {
            id: 'ir-q10',
            question: 'Explain methods to prevent the spread of communicable diseases.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Hygiene: hand washing, sterilization. Isolation of infected individuals. Vaccination programs. Vector control (e.g., mosquito nets). Safe food/water preparation.',
            markingCriteria: {
              breakdown: [
                'Hygiene measures (2 marks)',
                'Isolation and vaccination (2 marks)',
                'Environmental controls (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B3'
          }
        ]
      },
      {
        id: 'bioenergetics',
        name: 'Bioenergetics — (Biology)',
        questions: [
          {
            id: 'bioen-q1',
            question: 'Write the word equation for photosynthesis.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Carbon dioxide + Water → Glucose + Oxygen (in the presence of light and chlorophyll)',
            markingCriteria: {
              breakdown: [
                'Correct reactants and products (1 mark)',
                'Light and chlorophyll mentioned (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q2',
            question: 'Describe the factors that limit the rate of photosynthesis.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Light intensity: more light increases rate until another factor limits. Carbon dioxide concentration: higher CO₂ increases rate. Temperature: higher temperature increases rate until enzymes denature.',
            markingCriteria: {
              breakdown: [
                'Light intensity effect (2 marks)',
                'CO₂ concentration effect (2 marks)',
                'Temperature effect (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q3',
            question: 'Explain how the structure of a leaf is adapted for photosynthesis.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Large surface area to absorb light. Thin to allow light penetration. Chloroplasts contain chlorophyll. Stomata allow gas exchange. Vascular bundles transport water and products.',
            markingCriteria: {
              breakdown: [
                'Surface area and thickness (2 marks)',
                'Chloroplasts and chlorophyll (2 marks)',
                'Gas exchange and transport (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q4',
            question: 'Write the word equation for aerobic respiration.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP)',
            markingCriteria: {
              breakdown: [
                'Correct reactants and products (1 mark)',
                'Energy/ATP mentioned (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q5',
            question: 'Compare aerobic and anaerobic respiration.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Aerobic: uses oxygen, complete glucose breakdown, produces CO₂ and water, releases lots of energy. Anaerobic: no oxygen, incomplete breakdown, produces lactic acid (animals) or ethanol (plants), releases little energy.',
            markingCriteria: {
              breakdown: [
                'Oxygen use comparison (2 marks)',
                'Products comparison (2 marks)',
                'Energy release comparison (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q6',
            question: 'Explain what happens during exercise to meet increased energy demands.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Heart rate increases to supply more oxygen. Breathing rate increases to obtain more oxygen and remove CO₂. If oxygen runs out, anaerobic respiration occurs producing lactic acid.',
            markingCriteria: {
              breakdown: [
                'Increased heart rate (1 mark)',
                'Increased breathing rate (1 mark)',
                'Purpose of increases (1 mark)',
                'Anaerobic respiration (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q7',
            question: 'Describe how farmers can use knowledge of limiting factors to increase crop yields.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Greenhouses provide warmth and protection. Artificial lighting extends photosynthesis time. CO₂ generators increase carbon dioxide levels. Careful monitoring ensures optimum conditions.',
            markingCriteria: {
              breakdown: [
                'Temperature control (2 marks)',
                'Light enhancement (2 marks)',
                'CO₂ supplementation (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q8',
            question: 'Explain the concept of metabolism and give examples.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Metabolism is the sum of all chemical reactions in a cell or organism. Examples: respiration releases energy, photosynthesis produces glucose, protein synthesis builds new proteins.',
            markingCriteria: {
              breakdown: [
                'Definition of metabolism (2 marks)',
                'Appropriate examples (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q9',
            question: 'Describe how to investigate the effect of light intensity on the rate of photosynthesis using pondweed.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Place pondweed in test tube of water. Count bubbles produced in set time. Move lamp to different distances to change light intensity. Keep temperature and CO₂ constant. Repeat for reliability.',
            markingCriteria: {
              breakdown: [
                'Method description (2 marks)',
                'Variable control (2 marks)',
                'Measurement and reliability (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          },
          {
            id: 'bioen-q10',
            question: 'Explain why plants need glucose produced by photosynthesis.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Respiration: glucose used to release energy. Growth: glucose converted to cellulose for cell walls. Storage: glucose converted to starch. Reproduction: glucose used to make nectar and fruits.',
            markingCriteria: {
              breakdown: [
                'Energy release (1 mark)',
                'Structural uses (1 mark)',
                'Storage (1 mark)',
                'Reproduction (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B4'
          }
        ]
      },
      // BIOLOGY TOPICS - PAPER 2 (B5-B8)
      {
        id: 'homeostasis-and-response',
        name: 'Homeostasis and response — (Biology)',
        questions: [
          {
            id: 'hr-q1',
            question: 'Define homeostasis and explain why it is important for organisms.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Homeostasis is the regulation of internal conditions to maintain optimum conditions for enzyme action and cell functions. Important because enzymes need specific pH and temperature to work efficiently.',
            markingCriteria: {
              breakdown: [
                'Definition of homeostasis (2 marks)',
                'Importance explained (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q2',
            question: 'Describe the structure and function of the nervous system.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Central nervous system: brain and spinal cord process information. Peripheral nervous system: nerves carry signals. Sensory neurons carry impulses from receptors to CNS. Motor neurons carry impulses from CNS to effectors.',
            markingCriteria: {
              breakdown: [
                'CNS structure and function (2 marks)',
                'PNS structure and function (2 marks)',
                'Neuron types and functions (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q3',
            question: 'Explain how a reflex action works, using the example of touching a hot object.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Heat receptors in skin detect stimulus. Sensory neuron carries impulse to spinal cord. Relay neuron in spinal cord connects to motor neuron. Motor neuron carries impulse to muscle. Muscle contracts to move hand away.',
            markingCriteria: {
              breakdown: [
                'Receptor detection (1 mark)',
                'Sensory neuron pathway (1 mark)',
                'Spinal cord processing (2 marks)',
                'Motor response (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q4',
            question: 'Compare the nervous and endocrine systems.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Nervous: electrical impulses, fast response, short duration, precise target. Endocrine: chemical hormones, slower response, longer duration, widespread effects through blood.',
            markingCriteria: {
              breakdown: [
                'Method of communication (2 marks)',
                'Speed and duration (2 marks)',
                'Target specificity (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q5',
            question: 'Explain how blood glucose levels are controlled.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Pancreas monitors blood glucose. High glucose: insulin released, glucose converted to glycogen in liver. Low glucose: glucagon released, glycogen converted to glucose in liver.',
            markingCriteria: {
              breakdown: [
                'Monitoring by pancreas (1 mark)',
                'High glucose response (2 marks)',
                'Low glucose response (2 marks)',
                'Role of liver (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q6',
            question: 'Describe the role of hormones in the menstrual cycle.',
            marks: 8,
            difficulty: 'hard',
            modelAnswer: 'FSH stimulates egg maturation and oestrogen production. Oestrogen causes uterus lining to thicken and inhibits FSH. LH triggers ovulation. Progesterone maintains uterus lining. If no fertilization, progesterone falls and menstruation occurs.',
            markingCriteria: {
              breakdown: [
                'FSH function (2 marks)',
                'Oestrogen function (2 marks)',
                'LH function (2 marks)',
                'Progesterone function (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q7',
            question: 'Explain methods of contraception and how they work.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Barrier methods: condom/diaphragm prevent sperm reaching egg. Hormonal: pill contains oestrogen/progesterone to prevent ovulation. IUD: prevents implantation. Sterilization: cuts/blocks gamete transport.',
            markingCriteria: {
              breakdown: [
                'Barrier methods (2 marks)',
                'Hormonal methods (2 marks)',
                'Other methods (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q8',
            question: 'Describe treatments for infertility.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Fertility drugs: stimulate egg release. IVF: eggs fertilized outside body then implanted. Donor eggs/sperm: if gametes not viable.',
            markingCriteria: {
              breakdown: [
                'Fertility drugs (2 marks)',
                'IVF process (1 mark)',
                'Donor gametes (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q9',
            question: 'Explain what negative feedback is and give an example.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Negative feedback is when a change triggers a response that counteracts the original change, maintaining steady state. Example: blood glucose control - high glucose triggers insulin release to reduce glucose.',
            markingCriteria: {
              breakdown: [
                'Definition of negative feedback (2 marks)',
                'Appropriate example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          },
          {
            id: 'hr-q10',
            question: 'Describe how the eye responds to changes in light intensity.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Bright light: pupil constricts (gets smaller) as circular muscles contract and radial muscles relax. Dim light: pupil dilates (gets larger) as radial muscles contract and circular muscles relax.',
            markingCriteria: {
              breakdown: [
                'Bright light response (2 marks)',
                'Dim light response (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B5'
          }
        ]
      },
      {
        id: 'inheritance-variation-evolution',
        name: 'Inheritance, variation and evolution — (Biology)',
        questions: [
          {
            id: 'ive-q1',
            question: 'Explain the difference between mitosis and meiosis.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Mitosis: produces 2 diploid genetically identical cells for growth/repair. Meiosis: produces 4 haploid genetically different gametes for reproduction.',
            markingCriteria: {
              breakdown: [
                'Mitosis products and purpose (3 marks)',
                'Meiosis products and purpose (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q2',
            question: 'Define gene, allele, chromosome, and DNA.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Gene: section of DNA coding for a characteristic. Allele: different version of a gene. Chromosome: structure containing many genes. DNA: chemical that carries genetic information.',
            markingCriteria: {
              breakdown: [
                'Gene definition (1 mark)',
                'Allele definition (1 mark)',
                'Chromosome definition (1 mark)',
                'DNA definition (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q3',
            question: 'Use a Punnett square to show the inheritance of eye color where brown (B) is dominant and blue (b) is recessive. Cross Bb × Bb.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Punnett square showing: BB (brown), Bb (brown), Bb (brown), bb (blue). Ratio: 3 brown : 1 blue or 75% brown : 25% blue.',
            markingCriteria: {
              breakdown: [
                'Correct Punnett square (2 marks)',
                'Correct phenotype ratio (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q4',
            question: 'Explain how sex is determined in humans.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Males have XY chromosomes, females have XX chromosomes. Males can only pass Y or X, females can only pass X. 50:50 chance of male or female offspring.',
            markingCriteria: {
              breakdown: [
                'Male and female chromosomes (1 mark)',
                'Gamete chromosomes (1 mark)',
                'Probability (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q5',
            question: 'Describe the causes of genetic variation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Meiosis: independent assortment and crossing over create new allele combinations. Fertilization: random which gametes fuse. Mutations: changes in DNA sequence.',
            markingCriteria: {
              breakdown: [
                'Meiosis effects (2 marks)',
                'Random fertilization (1 mark)',
                'Mutations (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q6',
            question: 'Explain Darwin\'s theory of evolution by natural selection.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Variation exists in populations. Environmental pressure creates competition. Individuals with advantageous characteristics survive and reproduce more. Favorable alleles passed to offspring. Over time, favorable characteristics become more common.',
            markingCriteria: {
              breakdown: [
                'Variation (1 mark)',
                'Competition/selection pressure (1 mark)',
                'Survival advantage (2 marks)',
                'Inheritance and frequency change (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q7',
            question: 'Describe selective breeding and give an example.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Humans choose organisms with desirable characteristics to breed together. Offspring with best characteristics selected for further breeding. Example: breeding cows for high milk yield.',
            markingCriteria: {
              breakdown: [
                'Process description (2 marks)',
                'Appropriate example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q8',
            question: 'Explain what genetic engineering is and give an example.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Genetic engineering involves modifying an organism\'s genome by introducing genes from another species. Example: bacteria modified to produce human insulin for diabetes treatment.',
            markingCriteria: {
              breakdown: [
                'Definition of genetic engineering (2 marks)',
                'Appropriate example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q9',
            question: 'Describe evidence for evolution.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Fossils: show gradual changes over time. Antibiotic resistance: bacteria evolve resistance rapidly. DNA analysis: shows relationships between species.',
            markingCriteria: {
              breakdown: [
                'Fossil evidence (2 marks)',
                'Antibiotic resistance (2 marks)',
                'DNA evidence (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          },
          {
            id: 'ive-q10',
            question: 'Explain how new species can form.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Populations become isolated (geographical barriers). Different selection pressures in each environment. Populations evolve differently. Eventually become so different they cannot interbreed to produce fertile offspring.',
            markingCriteria: {
              breakdown: [
                'Isolation (1 mark)',
                'Different selection pressures (1 mark)',
                'Divergent evolution (1 mark)',
                'Reproductive isolation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B6'
          }
        ]
      },
      {
        id: 'ecology',
        name: 'Ecology — (Biology)',
        questions: [
          {
            id: 'eco-q1',
            question: 'Define ecosystem, population, community, and habitat.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Ecosystem: all organisms and physical factors in an area. Population: all organisms of one species in an area. Community: all populations in an area. Habitat: place where organism lives.',
            markingCriteria: {
              breakdown: [
                'Ecosystem definition (1 mark)',
                'Population definition (1 mark)',
                'Community definition (1 mark)',
                'Habitat definition (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q2',
            question: 'Describe how organisms are adapted to their environment, giving examples.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Structural: polar bear thick fur for insulation. Behavioral: migration to find food/avoid cold. Functional: camel conserves water by producing concentrated urine.',
            markingCriteria: {
              breakdown: [
                'Structural adaptation with example (2 marks)',
                'Behavioral adaptation with example (2 marks)',
                'Functional adaptation with example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q3',
            question: 'Explain what abiotic and biotic factors are and give examples of each.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Abiotic: non-living factors e.g. temperature, light intensity, pH, oxygen concentration. Biotic: living factors e.g. predation, competition, disease, food availability.',
            markingCriteria: {
              breakdown: [
                'Abiotic definition and examples (2 marks)',
                'Biotic definition and examples (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q4',
            question: 'Describe how to use quadrats to estimate population size.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Place quadrats randomly in area. Count organisms in each quadrat. Calculate mean number per quadrat. Multiply by total number of quadrats that could fit in area.',
            markingCriteria: {
              breakdown: [
                'Random placement (1 mark)',
                'Counting method (1 mark)',
                'Calculate mean (1 mark)',
                'Scale up calculation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q5',
            question: 'Explain the relationship between predators and prey in an ecosystem.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Predator population increases when prey abundant. More predation reduces prey population. Reduced prey leads to predator population decrease. Cycle repeats with time lag.',
            markingCriteria: {
              breakdown: [
                'Predator increase with prey abundance (1 mark)',
                'Prey reduction due to predation (1 mark)',
                'Predator decrease with prey scarcity (1 mark)',
                'Cyclical nature (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q6',
            question: 'Describe the carbon cycle.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Photosynthesis removes CO₂ from atmosphere. Respiration by plants/animals returns CO₂. Decomposition of dead material releases CO₂. Combustion of fossil fuels adds CO₂.',
            markingCriteria: {
              breakdown: [
                'Photosynthesis (2 marks)',
                'Respiration (1 mark)',
                'Decomposition (2 marks)',
                'Combustion (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q7',
            question: 'Explain how human activities affect biodiversity.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Deforestation destroys habitats. Pollution kills organisms and disrupts food chains. Climate change alters habitats. Overhunting reduces populations. Introduces species compete with natives.',
            markingCriteria: {
              breakdown: [
                'Habitat destruction (2 marks)',
                'Pollution effects (1 mark)',
                'Climate change (1 mark)',
                'Overhunting and invasive species (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q8',
            question: 'Describe methods to maintain biodiversity.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Protected areas/nature reserves preserve habitats. Breeding programs prevent extinction. Seed banks store genetic diversity. Sustainable management balances human needs with conservation.',
            markingCriteria: {
              breakdown: [
                'Protected areas (1 mark)',
                'Breeding programs (1 mark)',
                'Seed banks (1 mark)',
                'Sustainable management (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q9',
            question: 'Explain how energy is transferred through a food chain.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Producers convert light energy to chemical energy. Primary consumers eat producers. Secondary consumers eat primary consumers. Only about 10% energy transferred to next level.',
            markingCriteria: {
              breakdown: [
                'Producer energy conversion (1 mark)',
                'Consumer feeding relationships (2 marks)',
                'Energy transfer efficiency (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          },
          {
            id: 'eco-q10',
            question: 'Describe the water cycle.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Evaporation from oceans/lakes forms water vapor. Transpiration from plants adds water vapor. Condensation forms clouds. Precipitation returns water to earth.',
            markingCriteria: {
              breakdown: [
                'Evaporation (1 mark)',
                'Transpiration (1 mark)',
                'Condensation (1 mark)',
                'Precipitation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Biology B7'
          }
        ]
      },
      // CHEMISTRY TOPICS - PAPER 1 (C1-C5)
      {
        id: 'atomic-structure-periodic-table',
        name: 'Atomic structure and the periodic table — (Chemistry)',
        questions: [
          {
            id: 'aspt-q1',
            question: 'Describe the structure of an atom, including the relative masses and charges of protons, neutrons, and electrons.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Atom has nucleus containing protons (+1 charge, mass 1) and neutrons (0 charge, mass 1). Electrons (-1 charge, negligible mass) orbit in shells around nucleus. Most of atom is empty space.',
            markingCriteria: {
              breakdown: [
                'Description of nucleus (2 marks)',
                'Properties of subatomic particles (3 marks)',
                'Electron arrangement (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q2',
            question: 'Calculate the number of protons, neutrons, and electrons in an atom of chlorine-35 (³⁵Cl).',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Protons: 17 (atomic number). Electrons: 17 (same as protons in neutral atom). Neutrons: 35 - 17 = 18 (mass number - atomic number).',
            markingCriteria: {
              breakdown: [
                'Protons correct (1 mark)',
                'Electrons correct (1 mark)',
                'Neutrons correct (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q3',
            question: 'Explain what isotopes are and give an example.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. Example: Carbon-12 and Carbon-14 both have 6 protons but 6 and 8 neutrons respectively.',
            markingCriteria: {
              breakdown: [
                'Definition of isotopes (2 marks)',
                'Suitable example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q4',
            question: 'Describe how the model of the atom has changed over time.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Dalton: atoms as solid indivisible spheres. Thomson: plum pudding model with electrons in positive sphere. Rutherford: nuclear model with dense positive nucleus and electrons in space around it.',
            markingCriteria: {
              breakdown: [
                'Dalton model (2 marks)',
                'Thomson model (2 marks)',
                'Rutherford model (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q5',
            question: 'Explain the arrangement of elements in the modern periodic table.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Elements arranged by atomic number (proton number). Elements in same group have same number of outer electrons. Elements in same period have same number of electron shells.',
            markingCriteria: {
              breakdown: [
                'Arrangement by atomic number (2 marks)',
                'Group and period patterns (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q6',
            question: 'Describe the properties of Group 1 metals.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Soft metals that can be cut with knife. Low density (lithium floats). React vigorously with water producing hydrogen. Reactivity increases down group. Form ionic compounds.',
            markingCriteria: {
              breakdown: [
                'Physical properties (2 marks)',
                'Reaction with water (2 marks)',
                'Trends down group (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q7',
            question: 'Explain the properties of Group 7 elements (halogens).',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Non-metals that exist as diatomic molecules. Reactivity decreases down group. Displacement reactions occur. Form ionic compounds with metals. Colors: F₂ pale yellow, Cl₂ green, Br₂ orange, I₂ purple.',
            markingCriteria: {
              breakdown: [
                'Basic properties (2 marks)',
                'Reactivity trend (2 marks)',
                'Colors and reactions (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q8',
            question: 'Describe the properties of Group 0 elements (noble gases).',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Unreactive/inert gases. Full outer electron shell makes them stable. Monatomic (exist as single atoms). Boiling points increase down group.',
            markingCriteria: {
              breakdown: [
                'Unreactive nature (2 marks)',
                'Electron arrangement (1 mark)',
                'Physical properties (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q9',
            question: 'Explain the difference between metals and non-metals in terms of their position in the periodic table.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Metals on left side of periodic table. Non-metals on right side. Metalloids along diagonal line. Metals lose electrons, non-metals gain electrons in reactions.',
            markingCriteria: {
              breakdown: [
                'Position in periodic table (2 marks)',
                'Electron behavior in reactions (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          },
          {
            id: 'aspt-q10',
            question: 'Calculate the relative atomic mass of chlorine given that 75% is Cl-35 and 25% is Cl-37.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Relative atomic mass = (75 × 35 + 25 × 37) ÷ 100 = (2625 + 925) ÷ 100 = 3550 ÷ 100 = 35.5',
            markingCriteria: {
              breakdown: [
                'Correct method (1 mark)',
                'Correct calculation (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C1'
          }
        ]
      },
      {
        id: 'bonding-structure-properties',
        name: 'Bonding, structure, and the properties of matter — (Chemistry)',
        questions: [
          {
            id: 'bsp-q1',
            question: 'Describe how ionic bonding occurs between sodium and chlorine.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Sodium loses electron to become Na⁺ ion. Chlorine gains electron to become Cl⁻ ion. Opposite charges attract forming ionic bond. Electrostatic attraction holds ions together.',
            markingCriteria: {
              breakdown: [
                'Electron transfer (2 marks)',
                'Ion formation (1 mark)',
                'Electrostatic attraction (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q2',
            question: 'Explain how covalent bonding occurs in water molecules.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Oxygen and hydrogen atoms share electrons. Each hydrogen shares 1 electron with oxygen. Oxygen shares 2 electrons (one with each hydrogen). Shared pairs form covalent bonds.',
            markingCriteria: {
              breakdown: [
                'Electron sharing concept (2 marks)',
                'Specific sharing in water (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q3',
            question: 'Compare the properties of ionic and covalent compounds.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Ionic: high melting points, conduct when molten/dissolved, often soluble in water. Covalent: lower melting points, do not conduct electricity, often insoluble in water.',
            markingCriteria: {
              breakdown: [
                'Melting points comparison (2 marks)',
                'Electrical conductivity (2 marks)',
                'Solubility (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q4',
            question: 'Describe the structure of diamond and explain its properties.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Each carbon atom covalently bonded to 4 others in tetrahedral arrangement. Giant covalent structure. Very hard due to strong bonds throughout. High melting point. Does not conduct electricity.',
            markingCriteria: {
              breakdown: [
                'Structure description (2 marks)',
                'Hardness explanation (2 marks)',
                'Other properties (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q5',
            question: 'Explain why graphite conducts electricity but diamond does not.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Graphite has delocalized electrons that can move between layers. Diamond has all electrons localized in covalent bonds. Mobile electrons in graphite allow electrical conduction.',
            markingCriteria: {
              breakdown: [
                'Graphite electron structure (2 marks)',
                'Diamond electron structure (1 mark)',
                'Conduction explanation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q6',
            question: 'Describe the properties of metals and explain them in terms of structure.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Good electrical conductors due to delocalized electrons. Malleable and ductile because layers can slide. High melting points due to strong metallic bonding. Shiny appearance.',
            markingCriteria: {
              breakdown: [
                'Electrical conductivity (2 marks)',
                'Mechanical properties (2 marks)',
                'Melting points and appearance (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q7',
            question: 'Explain what an alloy is and why alloys are often stronger than pure metals.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Alloy is mixture of metal with other elements. Different sized atoms disrupt regular arrangement. Layers cannot slide past each other easily. Makes alloy harder and stronger.',
            markingCriteria: {
              breakdown: [
                'Definition of alloy (1 mark)',
                'Structural disruption (2 marks)',
                'Effect on properties (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q8',
            question: 'Describe the three states of matter and explain the changes between them.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Solid: particles close together, vibrate. Liquid: particles close, can move. Gas: particles far apart, move rapidly. Melting/freezing between solid/liquid. Boiling/condensing between liquid/gas.',
            markingCriteria: {
              breakdown: [
                'Three states described (3 marks)',
                'State changes (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q9',
            question: 'Explain why ionic compounds conduct electricity when molten but not when solid.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'In solid, ions fixed in lattice and cannot move. When molten, ions free to move. Moving charged particles (ions) carry electrical current.',
            markingCriteria: {
              breakdown: [
                'Solid state explanation (2 marks)',
                'Molten state explanation (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          },
          {
            id: 'bsp-q10',
            question: 'Describe the structure and properties of polymers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Long chains of repeating units (monomers). Held together by covalent bonds within chains. Weak forces between chains. Generally do not conduct electricity.',
            markingCriteria: {
              breakdown: [
                'Chain structure (2 marks)',
                'Bonding description (1 mark)',
                'Properties (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C2'
          }
        ]
      },
      {
        id: 'quantitative-chemistry',
        name: 'Quantitative chemistry — (Chemistry)',
        questions: [
          {
            id: 'qc-q1',
            question: 'Calculate the relative formula mass of calcium carbonate (CaCO₃). [Ca=40, C=12, O=16]',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Mr = 40 + 12 + (3 × 16) = 40 + 12 + 48 = 100',
            markingCriteria: {
              breakdown: [
                'Correct method (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q2',
            question: 'Calculate the percentage by mass of oxygen in water (H₂O). [H=1, O=16]',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mr of H₂O = (2 × 1) + 16 = 18. Percentage of O = (16 ÷ 18) × 100 = 88.9%',
            markingCriteria: {
              breakdown: [
                'Correct Mr calculation (1 mark)',
                'Correct percentage formula (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q3',
            question: 'Explain the law of conservation of mass in chemical reactions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Total mass of reactants equals total mass of products. Atoms are not created or destroyed in chemical reactions, only rearranged. Same number of each type of atom on both sides.',
            markingCriteria: {
              breakdown: [
                'Statement of law (2 marks)',
                'Explanation in terms of atoms (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q4',
            question: 'Balance the equation: Mg + HCl → MgCl₂ + H₂',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Mg + 2HCl → MgCl₂ + H₂',
            markingCriteria: {
              breakdown: [
                'Correct coefficients (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q5',
            question: 'Calculate the volume of hydrogen gas produced at RTP when 0.1 moles react. [1 mole of gas = 24 dm³ at RTP]',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Volume = moles × 24 dm³ = 0.1 × 24 = 2.4 dm³',
            markingCriteria: {
              breakdown: [
                'Correct method (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q6',
            question: 'Explain what uncertainty means in measurements and how to reduce it.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Uncertainty is the range within which the true value lies. Can be reduced by using more precise equipment, taking repeat measurements, using larger quantities.',
            markingCriteria: {
              breakdown: [
                'Definition of uncertainty (2 marks)',
                'Methods to reduce uncertainty (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q7',
            question: 'Calculate the number of moles in 88g of carbon dioxide (CO₂). [C=12, O=16]',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Mr of CO₂ = 12 + (2 × 16) = 44. Moles = mass ÷ Mr = 88 ÷ 44 = 2 moles',
            markingCriteria: {
              breakdown: [
                'Correct Mr calculation (1 mark)',
                'Correct formula (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q8',
            question: 'Calculate the concentration of a solution containing 20g of sodium hydroxide in 500 cm³ of water.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Concentration = mass ÷ volume = 20g ÷ 0.5 dm³ = 40 g/dm³',
            markingCriteria: {
              breakdown: [
                'Volume conversion (1 mark)',
                'Correct formula (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q9',
            question: 'Explain why the mass might appear to change in a reaction involving gases.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Gas can escape from open container, making mass appear to decrease. Gas can be produced in closed container, making mass appear constant. Mass is actually conserved but gas movement affects measurements.',
            markingCriteria: {
              breakdown: [
                'Gas escape explanation (2 marks)',
                'Reference to conservation (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          },
          {
            id: 'qc-q10',
            question: 'Calculate the atom economy for producing ammonia: N₂ + 3H₂ → 2NH₃ [N=14, H=1]',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Mr of NH₃ = 14 + (3 × 1) = 17. Total product mass = 2 × 17 = 34. Total reactant mass = 28 + 6 = 34. Atom economy = (34 ÷ 34) × 100 = 100%',
            markingCriteria: {
              breakdown: [
                'Correct Mr calculations (2 marks)',
                'Correct atom economy formula (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C3'
          }
        ]
      },
      {
        id: 'chemical-changes',
        name: 'Chemical changes — (Chemistry)',
        questions: [
          {
            id: 'cc-q1',
            question: 'Explain what oxidation and reduction mean in terms of electron transfer.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Oxidation is loss of electrons. Reduction is gain of electrons. Remember: OIL RIG (Oxidation Is Loss, Reduction Is Gain).',
            markingCriteria: {
              breakdown: [
                'Oxidation definition (2 marks)',
                'Reduction definition (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q2',
            question: 'Arrange these metals in order of reactivity: zinc, copper, magnesium, iron.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Most reactive to least reactive: magnesium, zinc, iron, copper',
            markingCriteria: {
              breakdown: [
                'Correct order (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q3',
            question: 'Explain how metals are extracted from their ores using carbon.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Metal ore is heated with carbon. Carbon reduces metal oxide by removing oxygen. Metal is produced along with carbon dioxide. Only works for metals less reactive than carbon.',
            markingCriteria: {
              breakdown: [
                'Process description (2 marks)',
                'Reduction explanation (2 marks)',
                'Limitation mentioned (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q4',
            question: 'Write the word equation for the reaction between magnesium and hydrochloric acid.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Magnesium + Hydrochloric acid → Magnesium chloride + Hydrogen',
            markingCriteria: {
              breakdown: [
                'Correct reactants and products (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q5',
            question: 'Describe the general method for making soluble salts from acids and metals.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Add excess metal to acid until no more reacts (fizzing stops). Filter to remove unreacted metal. Gently heat filtrate to evaporate water and crystallize salt.',
            markingCriteria: {
              breakdown: [
                'Reaction setup (2 marks)',
                'Separation method (2 marks)',
                'Crystallization (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q6',
            question: 'Explain the difference between strong and weak acids.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Strong acids completely ionize in water (e.g., HCl). Weak acids only partially ionize in water (e.g., ethanoic acid). Strong acids have lower pH for same concentration.',
            markingCriteria: {
              breakdown: [
                'Strong acid definition and example (2 marks)',
                'Weak acid definition and example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q7',
            question: 'Describe what happens during a neutralization reaction.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Acid reacts with base to produce salt and water. H⁺ ions from acid react with OH⁻ ions from base. pH moves toward 7 (neutral). Heat is released.',
            markingCriteria: {
              breakdown: [
                'General reaction (1 mark)',
                'Ion reaction (2 marks)',
                'pH and heat change (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q8',
            question: 'Explain how to use the pH scale.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'pH scale runs from 0-14. pH less than 7 is acidic. pH 7 is neutral. pH greater than 7 is alkaline. Lower pH means more acidic.',
            markingCriteria: {
              breakdown: [
                'Scale range (1 mark)',
                'Acidic range (1 mark)',
                'Neutral point (1 mark)',
                'Alkaline range (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q9',
            question: 'Describe how to extract metals more reactive than carbon.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Use electrolysis because carbon cannot reduce these metals. Electric current passed through molten ore. Metal forms at cathode (negative electrode). Expensive process due to energy costs.',
            markingCriteria: {
              breakdown: [
                'Electrolysis method (2 marks)',
                'Process description (1 mark)',
                'Cost consideration (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          },
          {
            id: 'cc-q10',
            question: 'Explain why aluminum is more useful than iron despite being more reactive.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Aluminum forms protective oxide layer that prevents further corrosion. Iron rusts completely through. Aluminum is lighter than iron. Both factors make aluminum better for many applications.',
            markingCriteria: {
              breakdown: [
                'Oxide layer protection (2 marks)',
                'Iron rusting (1 mark)',
                'Weight advantage (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C4'
          }
        ]
      },
      {
        id: 'energy-changes',
        name: 'Energy changes — (Chemistry)',
        questions: [
          {
            id: 'ec-q1',
            question: 'Explain the difference between exothermic and endothermic reactions.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Exothermic: heat energy released to surroundings, temperature increases. Endothermic: heat energy absorbed from surroundings, temperature decreases.',
            markingCriteria: {
              breakdown: [
                'Exothermic definition (2 marks)',
                'Endothermic definition (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q2',
            question: 'Give three examples of exothermic reactions.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Combustion, neutralization, respiration, oxidation reactions, hand warmers.',
            markingCriteria: {
              breakdown: [
                'Three correct examples (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q3',
            question: 'Give two examples of endothermic reactions.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Photosynthesis, thermal decomposition, dissolving ammonium nitrate, electrolysis.',
            markingCriteria: {
              breakdown: [
                'Two correct examples (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q4',
            question: 'Draw and label an energy profile diagram for an exothermic reaction.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Diagram showing reactants at higher energy than products. Activation energy peak labeled. Energy released arrow pointing down from reactants to products level.',
            markingCriteria: {
              breakdown: [
                'Correct energy levels (2 marks)',
                'Activation energy shown (1 mark)',
                'Energy change arrow (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q5',
            question: 'Explain what activation energy is.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Minimum energy needed for a reaction to occur. Energy required to break bonds in reactants. Must be provided before reaction can start.',
            markingCriteria: {
              breakdown: [
                'Definition (2 marks)',
                'Purpose (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q6',
            question: 'Describe practical applications of exothermic reactions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Hand warmers provide heat for warming. Self-heating cans for food/drinks. Combustion in engines for transport. Heating homes with gas/oil.',
            markingCriteria: {
              breakdown: [
                'Four practical applications (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q7',
            question: 'Describe practical applications of endothermic reactions.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Instant cold packs for injuries. Thermal decomposition in industry. Photosynthesis in plants.',
            markingCriteria: {
              breakdown: [
                'Three practical applications (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q8',
            question: 'Explain what happens to chemical bonds during exothermic reactions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Energy needed to break bonds in reactants. Energy released when new bonds form in products. More energy released than absorbed, so overall energy is released.',
            markingCriteria: {
              breakdown: [
                'Bond breaking (1 mark)',
                'Bond forming (1 mark)',
                'Energy balance (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q9',
            question: 'Calculate the energy change for a reaction where 500 kJ is needed to break bonds and 700 kJ is released when bonds form.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Energy change = Energy released - Energy absorbed = 700 - 500 = 200 kJ released (exothermic)',
            markingCriteria: {
              breakdown: [
                'Correct calculation (2 marks)',
                'Correct sign/type (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          },
          {
            id: 'ec-q10',
            question: 'Explain how a catalyst affects the energy profile of a reaction.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Catalyst provides alternative reaction pathway. Lowers activation energy required. Does not change overall energy change of reaction. Makes reaction faster but not more/less exothermic.',
            markingCriteria: {
              breakdown: [
                'Alternative pathway (1 mark)',
                'Lower activation energy (2 marks)',
                'No change to overall energy (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C5'
          }
        ]
      },
      // CHEMISTRY TOPICS - PAPER 2 (C6-C10)
      {
        id: 'rate-extent-chemical-change',
        name: 'The rate and extent of chemical change — (Chemistry)',
        questions: [
          {
            id: 'recc-q1',
            question: 'Describe four factors that affect the rate of chemical reactions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Temperature: higher temperature increases rate. Concentration: higher concentration increases rate. Surface area: larger surface area increases rate. Catalyst: speeds up reaction.',
            markingCriteria: {
              breakdown: [
                'Four factors correctly identified (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q2',
            question: 'Explain collision theory.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Particles must collide to react. Collisions must have enough energy (activation energy). More frequent collisions increase reaction rate. More energetic collisions increase reaction rate.',
            markingCriteria: {
              breakdown: [
                'Need for collisions (1 mark)',
                'Energy requirement (1 mark)',
                'Frequency effect (1 mark)',
                'Energy effect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q3',
            question: 'Explain how temperature affects reaction rate using collision theory.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Higher temperature gives particles more kinetic energy. Particles move faster and collide more frequently. More collisions have energy above activation energy. Therefore reaction rate increases.',
            markingCriteria: {
              breakdown: [
                'Increased kinetic energy (1 mark)',
                'More frequent collisions (1 mark)',
                'More successful collisions (1 mark)',
                'Increased rate (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q4',
            question: 'Describe how to measure the rate of reaction that produces a gas.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Collect gas in measuring cylinder over water. Record volume of gas at regular time intervals. Plot graph of volume against time. Calculate rate from gradient.',
            markingCriteria: {
              breakdown: [
                'Gas collection method (2 marks)',
                'Time measurements (1 mark)',
                'Rate calculation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q5',
            question: 'Explain what a catalyst is and how it works.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Substance that speeds up reaction without being used up. Provides alternative reaction pathway with lower activation energy. Allows more collisions to be successful. Catalyst is regenerated at end.',
            markingCriteria: {
              breakdown: [
                'Definition (1 mark)',
                'Lower activation energy (2 marks)',
                'Not used up (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q6',
            question: 'Describe what happens in reversible reactions.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Products can react to form reactants again. Forward and backward reactions occur simultaneously. Eventually reach equilibrium where rates are equal. Shown with ⇌ symbol.',
            markingCriteria: {
              breakdown: [
                'Both directions (1 mark)',
                'Simultaneous reactions (1 mark)',
                'Equilibrium concept (1 mark)',
                'Symbol (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q7',
            question: 'Explain Le Chatelier\'s principle.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'If conditions of equilibrium are changed, position shifts to oppose the change. Increasing concentration shifts away from that side. Increasing temperature shifts toward endothermic direction.',
            markingCriteria: {
              breakdown: [
                'Basic principle (2 marks)',
                'Concentration effect (1 mark)',
                'Temperature effect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q8',
            question: 'Describe the effect of pressure on gaseous equilibria.',
            marks: 3,
            difficulty: 'hard',
            modelAnswer: 'Increasing pressure shifts equilibrium toward side with fewer gas molecules. Decreasing pressure shifts toward side with more gas molecules. Only affects reactions with different numbers of gas molecules.',
            markingCriteria: {
              breakdown: [
                'High pressure effect (1 mark)',
                'Low pressure effect (1 mark)',
                'Condition for effect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q9',
            question: 'Explain why increasing surface area increases reaction rate.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'More surface exposed means more particles available to react. Increases frequency of collisions. More collisions per second increases reaction rate.',
            markingCriteria: {
              breakdown: [
                'More exposed surface (1 mark)',
                'More frequent collisions (1 mark)',
                'Increased rate (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          },
          {
            id: 'recc-q10',
            question: 'Describe how to investigate the effect of concentration on reaction rate.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Use same volume of acid but different concentrations. React with same mass of solid. Measure time taken or volume of gas produced. Keep temperature and surface area constant. Plot graph of rate against concentration.',
            markingCriteria: {
              breakdown: [
                'Variable control (2 marks)',
                'Measurement method (2 marks)',
                'Constants (1 mark)',
                'Data presentation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C6'
          }
        ]
      },
      {
        id: 'organic-chemistry',
        name: 'Organic chemistry — (Chemistry)',
        questions: [
          {
            id: 'oc-q1',
            question: 'Describe the composition and formation of crude oil.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Crude oil contains mixture of hydrocarbons. Formed from remains of ancient sea creatures over millions of years. Heat and pressure convert organic matter to oil.',
            markingCriteria: {
              breakdown: [
                'Composition (2 marks)',
                'Formation process (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q2',
            question: 'Describe the process of fractional distillation of crude oil.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Crude oil heated and vaporized. Vapors rise up fractionating column. Column is hottest at bottom, coolest at top. Different fractions condense at different temperatures. Smaller molecules travel further up before condensing.',
            markingCriteria: {
              breakdown: [
                'Heating and vaporization (1 mark)',
                'Temperature gradient (2 marks)',
                'Condensation at different levels (2 marks)',
                'Size separation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q3',
            question: 'Name three fractions obtained from crude oil and give a use for each.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Petrol: fuel for cars. Kerosene: fuel for aircraft. Diesel: fuel for trucks and trains. Bitumen: surfacing roads.',
            markingCriteria: {
              breakdown: [
                'Three fractions named (3 marks)',
                'Three uses given (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q4',
            question: 'Explain the relationship between carbon chain length and properties of hydrocarbons.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Longer chains have higher boiling points. Longer chains are more viscous (thicker). Longer chains are less flammable. Longer chains produce more soot when burned.',
            markingCriteria: {
              breakdown: [
                'Boiling point trend (2 marks)',
                'Viscosity trend (2 marks)',
                'Flammability trend (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q5',
            question: 'Describe the process and purpose of cracking.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Breaking down long hydrocarbon molecules into shorter ones. Uses high temperature and catalyst. Produces more useful shorter molecules like petrol. Also produces alkenes for making plastics.',
            markingCriteria: {
              breakdown: [
                'Process description (2 marks)',
                'Conditions (1 mark)',
                'Products (2 marks)',
                'Purpose (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q6',
            question: 'Explain the difference between alkanes and alkenes.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Alkanes are saturated hydrocarbons with single bonds only. Alkenes are unsaturated hydrocarbons with at least one double bond. Alkenes are more reactive than alkanes.',
            markingCriteria: {
              breakdown: [
                'Alkane definition (2 marks)',
                'Alkene definition (1 mark)',
                'Reactivity difference (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q7',
            question: 'Describe the test for alkenes.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Add bromine water to the substance. If alkene present, bromine water changes from orange to colorless. Alkanes do not change bromine water color.',
            markingCriteria: {
              breakdown: [
                'Bromine water test (1 mark)',
                'Positive result (1 mark)',
                'Negative result (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q8',
            question: 'Write the molecular formula and draw the structural formula for ethene.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Molecular formula: C₂H₄. Structural formula: H₂C=CH₂ showing double bond between carbon atoms.',
            markingCriteria: {
              breakdown: [
                'Correct molecular formula (1 mark)',
                'Correct structural formula (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q9',
            question: 'Explain why alkenes are useful for making polymers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Alkenes have double bonds that can break open. This allows molecules to join together in long chains. Forms polymers with useful properties. Process called polymerization.',
            markingCriteria: {
              breakdown: [
                'Double bond breaking (1 mark)',
                'Chain formation (2 marks)',
                'Polymerization term (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          },
          {
            id: 'oc-q10',
            question: 'Describe the environmental impacts of burning fossil fuels.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Produces carbon dioxide causing global warming. Sulfur dioxide causes acid rain. Particulates cause respiratory problems. Nitrogen oxides contribute to smog. Depletes finite resources.',
            markingCriteria: {
              breakdown: [
                'CO₂ and global warming (2 marks)',
                'SO₂ and acid rain (1 mark)',
                'Particulates and health (1 mark)',
                'Other impacts (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C7'
          }
        ]
      },
      {
        id: 'chemical-analysis',
        name: 'Chemical analysis — (Chemistry)',
        questions: [
          {
            id: 'ca-q1',
            question: 'Describe how to use chromatography to separate mixtures.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Place spot of mixture on chromatography paper. Dip bottom of paper in solvent. Solvent moves up paper carrying different substances at different rates. Substances separate based on solubility.',
            markingCriteria: {
              breakdown: [
                'Method description (2 marks)',
                'Separation principle (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q2',
            question: 'Calculate the Rf value for a substance that travels 6 cm when the solvent travels 8 cm.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Rf = distance moved by substance ÷ distance moved by solvent = 6 ÷ 8 = 0.75',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct calculation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q3',
            question: 'Explain what a pure substance is in chemistry.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Contains only one compound or element. Has a sharp melting point. Does not separate during chromatography.',
            markingCriteria: {
              breakdown: [
                'Single substance (1 mark)',
                'Sharp melting point (1 mark)',
                'Chromatography behavior (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q4',
            question: 'Describe what a formulation is and give examples.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Mixture designed for specific purpose with each component present in measured quantity. Examples: paint (pigment, binder, solvent), medicine (active ingredient, excipients), alloys.',
            markingCriteria: {
              breakdown: [
                'Definition (2 marks)',
                'Examples (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q5',
            question: 'Describe the test for hydrogen gas.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Place burning splint near gas. Hydrogen burns with squeaky pop sound.',
            markingCriteria: {
              breakdown: [
                'Burning splint test (1 mark)',
                'Squeaky pop result (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q6',
            question: 'Describe the test for oxygen gas.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Place glowing splint in gas. Oxygen relights the glowing splint.',
            markingCriteria: {
              breakdown: [
                'Glowing splint test (1 mark)',
                'Relighting result (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q7',
            question: 'Describe the test for carbon dioxide gas.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Bubble gas through limewater. Carbon dioxide turns limewater cloudy/milky.',
            markingCriteria: {
              breakdown: [
                'Limewater test (1 mark)',
                'Cloudy result (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q8',
            question: 'Describe the test for chlorine gas.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Place damp litmus paper in gas. Chlorine bleaches the litmus paper white.',
            markingCriteria: {
              breakdown: [
                'Damp litmus test (1 mark)',
                'Bleaching result (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q9',
            question: 'Explain why chromatography can identify substances.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Each substance has characteristic Rf value in given solvent. Rf value is like fingerprint for substance. Can compare unknown substance with known standards. Same Rf suggests same substance.',
            markingCriteria: {
              breakdown: [
                'Characteristic Rf values (2 marks)',
                'Comparison with standards (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          },
          {
            id: 'ca-q10',
            question: 'Describe how to test if water is pure.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Pure water boils at exactly 100°C at standard pressure. Pure water freezes at exactly 0°C. Impurities change these temperatures. Can also test with chromatography - pure water gives no spots.',
            markingCriteria: {
              breakdown: [
                'Boiling point test (2 marks)',
                'Freezing point test (1 mark)',
                'Alternative method (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C8'
          }
        ]
      },
      {
        id: 'chemistry-atmosphere',
        name: 'Chemistry of the atmosphere — (Chemistry)',
        questions: [
          {
            id: 'coa-q1',
            question: 'Describe the composition of the Earth\'s atmosphere today.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Nitrogen: 78%. Oxygen: 21%. Other gases (including CO₂): 1%.',
            markingCriteria: {
              breakdown: [
                'Three percentages correct (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q2',
            question: 'Describe how oxygen levels in the atmosphere increased.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Early atmosphere had little oxygen. Algae and plants evolved and began photosynthesis. Photosynthesis produced oxygen as waste product. Oxygen levels gradually increased over millions of years.',
            markingCriteria: {
              breakdown: [
                'Early low oxygen (1 mark)',
                'Evolution of photosynthesis (1 mark)',
                'Oxygen production (1 mark)',
                'Gradual increase (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q3',
            question: 'Explain how carbon dioxide levels decreased in early atmosphere.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'CO₂ dissolved in oceans. CO₂ used in photosynthesis by plants. CO₂ locked up in fossil fuels and sedimentary rocks. CO₂ formed carbonates in rocks.',
            markingCriteria: {
              breakdown: [
                'Dissolution in oceans (1 mark)',
                'Photosynthesis (1 mark)',
                'Fossil fuel formation (1 mark)',
                'Carbonate formation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q4',
            question: 'Describe the greenhouse effect.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Solar radiation reaches Earth and warms surface. Earth radiates heat as infrared. Greenhouse gases absorb infrared radiation. Heat is trapped in atmosphere. Keeps Earth warm enough for life.',
            markingCriteria: {
              breakdown: [
                'Solar heating (1 mark)',
                'Earth radiation (1 mark)',
                'Gas absorption (2 marks)',
                'Heat trapping (1 mark)',
                'Warming effect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q5',
            question: 'Name three greenhouse gases and their sources.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Carbon dioxide: burning fossil fuels, deforestation. Methane: agriculture (cattle), landfill sites. Water vapor: evaporation from oceans.',
            markingCriteria: {
              breakdown: [
                'CO₂ and source (2 marks)',
                'Methane and source (2 marks)',
                'Water vapor and source (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q6',
            question: 'Explain the enhanced greenhouse effect and climate change.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Human activities increase greenhouse gas concentrations. More heat trapped in atmosphere. Global average temperatures rising. Causes climate change including extreme weather, ice melting, sea level rise.',
            markingCriteria: {
              breakdown: [
                'Human activities (1 mark)',
                'Increased trapping (1 mark)',
                'Temperature rise (1 mark)',
                'Climate effects (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q7',
            question: 'Describe what carbon footprint means.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Total amount of carbon dioxide produced by person or activity. Includes direct and indirect emissions. Measured over specific time period.',
            markingCriteria: {
              breakdown: [
                'Definition (2 marks)',
                'Time aspect (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q8',
            question: 'Suggest ways to reduce carbon footprint.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Use renewable energy sources. Improve energy efficiency. Use public transport or walk/cycle. Reduce consumption and waste. Plant trees. Eat less meat.',
            markingCriteria: {
              breakdown: [
                'Six valid suggestions (6 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q9',
            question: 'Describe the problems caused by air pollution.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Particulates cause respiratory problems and smog. Sulfur dioxide causes acid rain damaging buildings and ecosystems. Nitrogen oxides contribute to smog and acid rain. Carbon monoxide is toxic.',
            markingCriteria: {
              breakdown: [
                'Particulate effects (2 marks)',
                'SO₂ effects (2 marks)',
                'NOₓ effects (1 mark)',
                'CO toxicity (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          },
          {
            id: 'coa-q10',
            question: 'Explain how acid rain forms and its effects.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Sulfur dioxide and nitrogen oxides released from burning fossil fuels. These dissolve in rainwater forming acids. Acid rain damages limestone buildings and statues. Kills trees and acidifies lakes.',
            markingCriteria: {
              breakdown: [
                'Pollutant sources (2 marks)',
                'Acid formation (1 mark)',
                'Building damage (1 mark)',
                'Environmental damage (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C9'
          }
        ]
      },
      {
        id: 'using-resources',
        name: 'Using resources — (Chemistry)',
        questions: [
          {
            id: 'ur-q1',
            question: 'Explain the difference between renewable and finite resources.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Renewable resources: can be replaced as fast as they are used (e.g., wind, solar). Finite resources: limited amounts available, will run out (e.g., fossil fuels, metals).',
            markingCriteria: {
              breakdown: [
                'Renewable definition and example (2 marks)',
                'Finite definition and example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q2',
            question: 'Describe what potable water is and how it differs from pure water.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Potable water is safe to drink. Contains dissolved substances but low levels of harmful bacteria and chemicals. Pure water contains only H₂O molecules. Potable water is not chemically pure.',
            markingCriteria: {
              breakdown: [
                'Potable water definition (2 marks)',
                'Pure water definition (1 mark)',
                'Difference (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q3',
            question: 'Describe the steps in water treatment to produce potable water.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Sedimentation: large particles settle out. Filtration: remaining particles removed through sand and gravel. Chlorination: chlorine added to kill bacteria and viruses.',
            markingCriteria: {
              breakdown: [
                'Sedimentation (2 marks)',
                'Filtration (2 marks)',
                'Chlorination (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q4',
            question: 'Describe methods of desalination to obtain fresh water.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Distillation: boil seawater and condense steam to get pure water. Reverse osmosis: force water through membrane that blocks salt. Both require lots of energy.',
            markingCriteria: {
              breakdown: [
                'Distillation method (2 marks)',
                'Reverse osmosis (1 mark)',
                'Energy requirement (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q5',
            question: 'Describe the steps in sewage treatment.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Screening: removes large objects. Sedimentation: sludge settles, effluent floats. Biological treatment: bacteria break down organic matter. Chlorination: kills remaining harmful bacteria.',
            markingCriteria: {
              breakdown: [
                'Screening (1 mark)',
                'Sedimentation (2 marks)',
                'Biological treatment (2 marks)',
                'Final disinfection (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q6',
            question: 'Explain the principles of reduce, reuse, and recycle.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Reduce: use fewer resources and create less waste. Reuse: use items again for same or different purpose. Recycle: process waste materials to make new products.',
            markingCriteria: {
              breakdown: [
                'Reduce explanation (2 marks)',
                'Reuse explanation (2 marks)',
                'Recycle explanation (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q7',
            question: 'Describe life cycle assessment (LCA).',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Assessment of environmental impact of product throughout its life. Includes raw material extraction, manufacture, use, and disposal. Helps compare different products or processes.',
            markingCriteria: {
              breakdown: [
                'Definition (1 mark)',
                'Life stages included (2 marks)',
                'Purpose (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q8',
            question: 'Explain alternative methods for extracting metals from low-grade ores.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Phytomining: plants absorb metals from soil, plants burned and ash contains metal compounds. Bioleaching: bacteria convert insoluble metal compounds to soluble ones. Both useful when ores nearly exhausted.',
            markingCriteria: {
              breakdown: [
                'Phytomining process (3 marks)',
                'Bioleaching process (2 marks)',
                'Applications (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q9',
            question: 'Discuss the advantages and disadvantages of recycling metals.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Advantages: conserves finite resources, less energy than extraction, reduces waste. Disadvantages: collection and sorting costs, limited number of recycling cycles for some metals.',
            markingCriteria: {
              breakdown: [
                'Advantages listed (3 marks)',
                'Disadvantages listed (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          },
          {
            id: 'ur-q10',
            question: 'Explain why it is important to develop sustainable methods of production.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Finite resources will run out if overused. Need to meet current needs without compromising future generations. Reduces environmental damage. Maintains resources for future use.',
            markingCriteria: {
              breakdown: [
                'Resource depletion concern (1 mark)',
                'Intergenerational equity (2 marks)',
                'Environmental protection (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Chemistry C10'
          }
        ]
      },
      // PHYSICS TOPICS - PAPER 1 (P1-P4)
      {
        id: 'energy-physics',
        name: 'Energy — (Physics)',
        questions: [
          {
            id: 'energy-q1',
            question: 'List four energy stores and give an example of each.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Kinetic: moving car. Gravitational potential: ball at height. Elastic: stretched spring. Chemical: food/fuel.',
            markingCriteria: {
              breakdown: [
                'Four energy stores with examples (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q2',
            question: 'Calculate the kinetic energy of a 1000 kg car moving at 20 m/s.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'KE = ½mv² = ½ × 1000 × 20² = ½ × 1000 × 400 = 200,000 J',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q3',
            question: 'Calculate the gravitational potential energy of a 2 kg object at height 10 m. [g = 10 m/s²]',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'GPE = mgh = 2 × 10 × 10 = 200 J',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q4',
            question: 'State the principle of conservation of energy.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Energy cannot be created or destroyed, only transferred from one store to another.',
            markingCriteria: {
              breakdown: [
                'Complete statement (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q5',
            question: 'Calculate the power of a motor that transfers 3000 J of energy in 10 seconds.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Power = Energy ÷ Time = 3000 ÷ 10 = 300 W',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q6',
            question: 'Calculate the efficiency of a machine that transfers 800 J of useful energy from 1000 J of input energy.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Efficiency = (useful energy out ÷ total energy in) × 100% = (800 ÷ 1000) × 100% = 80%',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct calculation (1 mark)',
                'Correct answer with % (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q7',
            question: 'List three renewable energy sources and three non-renewable energy sources.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Renewable: solar, wind, hydroelectric, geothermal, wave, biomass. Non-renewable: coal, oil, natural gas, nuclear.',
            markingCriteria: {
              breakdown: [
                'Three renewable sources (3 marks)',
                'Three non-renewable sources (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q8',
            question: 'Describe the advantages and disadvantages of wind power.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Advantages: renewable, no fuel costs, no pollution. Disadvantages: dependent on weather, visual pollution, noise, takes up space.',
            markingCriteria: {
              breakdown: [
                'Advantages (3 marks)',
                'Disadvantages (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q9',
            question: 'Explain what happens to wasted energy.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Wasted energy is usually transferred to thermal energy store of surroundings. Energy spreads out and becomes less useful. Cannot be easily converted back to useful forms.',
            markingCriteria: {
              breakdown: [
                'Thermal transfer (1 mark)',
                'Energy spreading (1 mark)',
                'Reduced usefulness (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          },
          {
            id: 'energy-q10',
            question: 'Calculate the specific heat capacity of a material if 2000 J of energy raises the temperature of 0.5 kg by 8°C.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'c = E ÷ (m × ΔT) = 2000 ÷ (0.5 × 8) = 2000 ÷ 4 = 500 J/kg°C',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (2 marks)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P1'
          }
        ]
      },
      {
        id: 'electricity-physics',
        name: 'Electricity — (Physics)',
        questions: [
          {
            id: 'elec-q1',
            question: 'State the equation linking charge, current, and time.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'Q = I × t (Charge = Current × Time)',
            markingCriteria: {
              breakdown: [
                'Correct equation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q2',
            question: 'Calculate the charge that flows when a current of 5 A flows for 120 seconds.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Q = I × t = 5 × 120 = 600 C',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q3',
            question: 'State Ohm\'s law.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Current is directly proportional to voltage, provided temperature remains constant. V = I × R',
            markingCriteria: {
              breakdown: [
                'Proportional relationship (1 mark)',
                'Equation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q4',
            question: 'Calculate the resistance of a component when 12 V produces a current of 3 A.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'R = V ÷ I = 12 ÷ 3 = 4 Ω',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q5',
            question: 'Describe the difference between series and parallel circuits.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Series: current same everywhere, voltage shared, total resistance increases. Parallel: voltage same across each branch, current shared, total resistance decreases.',
            markingCriteria: {
              breakdown: [
                'Series current (1 mark)',
                'Series voltage (1 mark)',
                'Series resistance (1 mark)',
                'Parallel voltage (1 mark)',
                'Parallel current (1 mark)',
                'Parallel resistance (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q6',
            question: 'Draw the circuit symbols for: battery, switch, lamp, resistor, voltmeter, ammeter.',
            marks: 6,
            difficulty: 'easy',
            modelAnswer: 'Correct symbols drawn for each component.',
            markingCriteria: {
              breakdown: [
                'Six correct symbols (6 marks - 1 each)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q7',
            question: 'Explain why the resistance of a filament lamp increases as it gets hotter.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'As temperature increases, atoms vibrate more. More collisions between electrons and atoms. Makes it harder for current to flow, so resistance increases.',
            markingCriteria: {
              breakdown: [
                'Increased atomic vibration (1 mark)',
                'More collisions (1 mark)',
                'Harder current flow (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q8',
            question: 'Calculate the power dissipated by a 6 V, 2 A lamp.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'P = V × I = 6 × 2 = 12 W',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q9',
            question: 'Explain the purpose of the earth wire in a three-pin plug.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Provides safety path to ground if appliance becomes live. Prevents electric shock. Large current flows through earth wire, blowing fuse.',
            markingCriteria: {
              breakdown: [
                'Safety path (1 mark)',
                'Prevents shock (1 mark)',
                'Blows fuse (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          },
          {
            id: 'elec-q10',
            question: 'Explain why the National Grid uses high voltages for transmission.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'High voltage reduces current for same power. Lower current reduces energy loss in cables. Energy loss = I²R, so halving current quarters energy loss. More efficient transmission.',
            markingCriteria: {
              breakdown: [
                'High voltage reduces current (1 mark)',
                'Lower current reduces losses (1 mark)',
                'I²R relationship (1 mark)',
                'Efficiency benefit (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P2'
          }
        ]
      },
      {
        id: 'particle-model-matter',
        name: 'Particle model of matter — (Physics)',
        questions: [
          {
            id: 'pmm-q1',
            question: 'Define density and give its equation.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Density is mass per unit volume. Density = mass ÷ volume',
            markingCriteria: {
              breakdown: [
                'Definition (1 mark)',
                'Equation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q2',
            question: 'Calculate the density of a material with mass 200 g and volume 50 cm³.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Density = mass ÷ volume = 200 ÷ 50 = 4 g/cm³',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q3',
            question: 'Describe the arrangement and motion of particles in solids, liquids, and gases.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Solids: particles close together in regular pattern, vibrate about fixed positions. Liquids: particles close together, can move around each other. Gases: particles far apart, move rapidly in all directions.',
            markingCriteria: {
              breakdown: [
                'Solid arrangement and motion (2 marks)',
                'Liquid arrangement and motion (2 marks)',
                'Gas arrangement and motion (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q4',
            question: 'Explain what happens when a solid melts in terms of energy.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Heat energy is absorbed. Energy used to break bonds between particles. Particles gain kinetic energy and can move more freely. Temperature stays constant during melting.',
            markingCriteria: {
              breakdown: [
                'Energy absorbed (1 mark)',
                'Breaking bonds (1 mark)',
                'Increased motion (1 mark)',
                'Constant temperature (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q5',
            question: 'Define internal energy.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Total kinetic and potential energy of all particles in a system.',
            markingCriteria: {
              breakdown: [
                'Kinetic and potential energy (1 mark)',
                'All particles in system (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q6',
            question: 'Calculate the energy needed to heat 2 kg of water by 30°C. [c = 4200 J/kg°C]',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'E = mcΔT = 2 × 4200 × 30 = 252,000 J',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q7',
            question: 'Explain what specific latent heat means.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Energy needed to change the state of 1 kg of substance. No temperature change occurs. Energy used to break or form bonds between particles.',
            markingCriteria: {
              breakdown: [
                'Energy per kg (1 mark)',
                'No temperature change (1 mark)',
                'Bond breaking/forming (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q8',
            question: 'Describe how to measure the density of an irregular object.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Measure mass using balance. Measure volume by displacement - submerge in measuring cylinder of water, volume equals water level rise. Calculate density = mass ÷ volume.',
            markingCriteria: {
              breakdown: [
                'Mass measurement (1 mark)',
                'Volume by displacement (2 marks)',
                'Density calculation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q9',
            question: 'Explain how increasing temperature affects gas pressure in a fixed volume.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Higher temperature gives particles more kinetic energy. Particles move faster and hit walls more frequently. Each collision has more force. Therefore pressure increases.',
            markingCriteria: {
              breakdown: [
                'More kinetic energy (1 mark)',
                'Faster movement (1 mark)',
                'More frequent/forceful collisions (1 mark)',
                'Increased pressure (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          },
          {
            id: 'pmm-q10',
            question: 'Describe the relationship between pressure and volume for a gas at constant temperature.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Pressure is inversely proportional to volume. As volume decreases, pressure increases. pV = constant (Boyle\'s law).',
            markingCriteria: {
              breakdown: [
                'Inverse relationship (1 mark)',
                'Volume decrease, pressure increase (1 mark)',
                'Mathematical relationship (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P3'
          }
        ]
      },
      {
        id: 'atomic-structure-physics',
        name: 'Atomic structure — (Physics)',
        questions: [
          {
            id: 'asp-q1',
            question: 'Name the three types of nuclear radiation.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Alpha, beta, gamma',
            markingCriteria: {
              breakdown: [
                'Three types named (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q2',
            question: 'Describe the properties of alpha radiation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Consists of helium nuclei (2 protons, 2 neutrons). Highly ionizing. Short range in air (few cm). Stopped by paper or skin.',
            markingCriteria: {
              breakdown: [
                'Composition (2 marks)',
                'Ionizing power (1 mark)',
                'Range and penetration (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q3',
            question: 'Describe the properties of beta radiation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Consists of high-speed electrons. Moderately ionizing. Medium range in air (few m). Stopped by aluminum foil.',
            markingCriteria: {
              breakdown: [
                'Composition (1 mark)',
                'Ionizing power (1 mark)',
                'Range (1 mark)',
                'Penetration (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q4',
            question: 'Describe the properties of gamma radiation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Electromagnetic radiation. Weakly ionizing. Long range in air (km). Stopped by thick lead or concrete.',
            markingCriteria: {
              breakdown: [
                'Electromagnetic nature (1 mark)',
                'Ionizing power (1 mark)',
                'Range (1 mark)',
                'Penetration (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q5',
            question: 'Write the nuclear equation for alpha decay of radium-226.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: '²²⁶Ra → ²²²Rn + ⁴He (or α)',
            markingCriteria: {
              breakdown: [
                'Correct mass numbers (1 mark)',
                'Correct atomic numbers (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q6',
            question: 'Explain what half-life means.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Time taken for half the nuclei in a sample to decay. Time for activity to halve. Time for count rate to halve.',
            markingCriteria: {
              breakdown: [
                'Half the nuclei decay (2 marks)',
                'Activity/count rate halves (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q7',
            question: 'A sample has activity 800 Bq. After 20 minutes the activity is 200 Bq. Calculate the half-life.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: '800 → 400 → 200 (two half-lives). Half-life = 20 ÷ 2 = 10 minutes',
            markingCriteria: {
              breakdown: [
                'Recognizing two half-lives (1 mark)',
                'Correct division (1 mark)',
                'Correct answer (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q8',
            question: 'Explain the difference between contamination and irradiation.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Contamination: radioactive material gets on/in object, object becomes radioactive. Irradiation: object exposed to radiation but doesn\'t become radioactive.',
            markingCriteria: {
              breakdown: [
                'Contamination definition (2 marks)',
                'Irradiation definition (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q9',
            question: 'Describe three safety precautions when handling radioactive materials.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Use tongs or forceps to handle. Wear protective clothing. Keep materials in lead-lined containers. Limit exposure time. Maintain distance.',
            markingCriteria: {
              breakdown: [
                'Three appropriate precautions (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          },
          {
            id: 'asp-q10',
            question: 'Describe uses of each type of radiation.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Alpha: smoke detectors. Beta: thickness monitoring in industry. Gamma: medical imaging, sterilizing equipment, cancer treatment.',
            markingCriteria: {
              breakdown: [
                'Alpha use (2 marks)',
                'Beta use (2 marks)',
                'Gamma uses (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P4'
          }
        ]
      },
      // PHYSICS TOPICS - PAPER 2 (P5-P7)
      {
        id: 'forces-physics',
        name: 'Forces — (Physics)',
        questions: [
          {
            id: 'forces-q1',
            question: 'State Newton\'s first law of motion.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a resultant force.',
            markingCriteria: {
              breakdown: [
                'Complete statement of first law (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q2',
            question: 'Calculate the weight of a 60 kg person on Earth. [g = 10 m/s²]',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Weight = mass × gravity = 60 × 10 = 600 N',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q3',
            question: 'Explain the difference between scalar and vector quantities, giving examples.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Scalar: has magnitude only (e.g., speed, distance, mass). Vector: has magnitude and direction (e.g., velocity, displacement, force).',
            markingCriteria: {
              breakdown: [
                'Scalar definition and example (2 marks)',
                'Vector definition and example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q4',
            question: 'Calculate the resultant force when forces of 10 N east and 6 N west act on an object.',
            marks: 2,
            difficulty: 'easy',
            modelAnswer: 'Resultant force = 10 - 6 = 4 N east',
            markingCriteria: {
              breakdown: [
                'Correct calculation (1 mark)',
                'Correct direction (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q5',
            question: 'State Newton\'s second law and give its equation.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Force is proportional to acceleration. F = ma',
            markingCriteria: {
              breakdown: [
                'Law statement (1 mark)',
                'Equation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q6',
            question: 'Calculate the acceleration of a 500 kg car when a force of 2000 N is applied.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'a = F ÷ m = 2000 ÷ 500 = 4 m/s²',
            markingCriteria: {
              breakdown: [
                'Correct rearrangement (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q7',
            question: 'Describe the factors affecting stopping distance.',
            marks: 6,
            difficulty: 'medium',
            modelAnswer: 'Thinking distance: speed, reaction time, alcohol/drugs, tiredness. Braking distance: speed, road conditions, tire condition, brake condition, vehicle mass.',
            markingCriteria: {
              breakdown: [
                'Thinking distance factors (3 marks)',
                'Braking distance factors (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q8',
            question: 'Calculate the momentum of a 1200 kg car traveling at 25 m/s.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Momentum = mass × velocity = 1200 × 25 = 30,000 kg⋅m/s',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q9',
            question: 'State the principle of conservation of momentum.',
            marks: 2,
            difficulty: 'medium',
            modelAnswer: 'Total momentum before collision equals total momentum after collision, in absence of external forces.',
            markingCriteria: {
              breakdown: [
                'Before equals after (1 mark)',
                'No external forces condition (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          },
          {
            id: 'forces-q10',
            question: 'Explain how seat belts and airbags improve safety in cars.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Increase time taken to stop passenger. Reduces rate of change of momentum. Therefore reduces force on passenger (F = Δp/Δt). Less injury.',
            markingCriteria: {
              breakdown: [
                'Increase stopping time (1 mark)',
                'Reduce rate of momentum change (1 mark)',
                'Reduce force (1 mark)',
                'Less injury (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P5'
          }
        ]
      },
      {
        id: 'waves-physics',
        name: 'Waves — (Physics)',
        questions: [
          {
            id: 'waves-q1',
            question: 'State the equation linking wave speed, frequency, and wavelength.',
            marks: 1,
            difficulty: 'easy',
            modelAnswer: 'v = f × λ (wave speed = frequency × wavelength)',
            markingCriteria: {
              breakdown: [
                'Correct equation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q2',
            question: 'Calculate the wave speed of a wave with frequency 50 Hz and wavelength 4 m.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'v = f × λ = 50 × 4 = 200 m/s',
            markingCriteria: {
              breakdown: [
                'Correct formula (1 mark)',
                'Correct substitution (1 mark)',
                'Correct answer with units (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q3',
            question: 'Explain the difference between transverse and longitudinal waves.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Transverse: vibrations perpendicular to direction of energy transfer (e.g., light). Longitudinal: vibrations parallel to direction of energy transfer (e.g., sound).',
            markingCriteria: {
              breakdown: [
                'Transverse definition and example (2 marks)',
                'Longitudinal definition and example (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q4',
            question: 'Define amplitude, frequency, and wavelength.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Amplitude: maximum displacement from rest position. Frequency: number of waves per second. Wavelength: distance between two identical points on adjacent waves.',
            markingCriteria: {
              breakdown: [
                'Amplitude definition (1 mark)',
                'Frequency definition (1 mark)',
                'Wavelength definition (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q5',
            question: 'List the electromagnetic spectrum in order of increasing frequency.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays',
            markingCriteria: {
              breakdown: [
                'Correct order (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q6',
            question: 'Describe uses and hazards of X-rays.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Uses: medical imaging, airport security. Hazards: ionizing radiation, can cause cancer, can damage cells.',
            markingCriteria: {
              breakdown: [
                'Uses (2 marks)',
                'Hazards (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q7',
            question: 'Explain what happens when light travels from air into glass.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Light slows down in glass. Wavelength decreases. Frequency stays constant. Light bends toward normal (refraction).',
            markingCriteria: {
              breakdown: [
                'Speed change (1 mark)',
                'Wavelength change (1 mark)',
                'Frequency constant (1 mark)',
                'Refraction (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q8',
            question: 'Describe how to measure the speed of sound using an echo method.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Stand known distance from wall. Make loud sound and time echo. Distance = 2 × distance to wall. Speed = distance ÷ time.',
            markingCriteria: {
              breakdown: [
                'Setup description (1 mark)',
                'Timing method (1 mark)',
                'Distance calculation (1 mark)',
                'Speed calculation (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q9',
            question: 'Explain why we can hear around corners but not see around corners.',
            marks: 4,
            difficulty: 'hard',
            modelAnswer: 'Sound waves have long wavelengths compared to obstacles. Light waves have very short wavelengths. Diffraction is greatest when wavelength is similar to obstacle size.',
            markingCriteria: {
              breakdown: [
                'Sound wavelength (1 mark)',
                'Light wavelength (1 mark)',
                'Diffraction condition (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          },
          {
            id: 'waves-q10',
            question: 'Describe how infrared radiation is used and its dangers.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Uses: thermal imaging, remote controls, cooking. Dangers: skin burns, heating of body tissues.',
            markingCriteria: {
              breakdown: [
                'Uses (2 marks)',
                'Dangers (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P6'
          }
        ]
      },
      {
        id: 'magnetism-electromagnetism',
        name: 'Magnetism and electromagnetism — (Physics)',
        questions: [
          {
            id: 'me-q1',
            question: 'Describe the magnetic field around a bar magnet.',
            marks: 3,
            difficulty: 'easy',
            modelAnswer: 'Field lines start at north pole and end at south pole. Field lines closer together show stronger field. Field lines never cross.',
            markingCriteria: {
              breakdown: [
                'Direction (1 mark)',
                'Strength indication (1 mark)',
                'Lines don\'t cross (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q2',
            question: 'Explain the difference between permanent and induced magnets.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Permanent magnets: always magnetic, produce own magnetic field. Induced magnets: only magnetic when in magnetic field, lose magnetism when field removed.',
            markingCriteria: {
              breakdown: [
                'Permanent magnet properties (2 marks)',
                'Induced magnet properties (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q3',
            question: 'Describe the magnetic field around a current-carrying wire.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Circular field lines around wire. Field stronger closer to wire. Direction given by right-hand rule.',
            markingCriteria: {
              breakdown: [
                'Circular field lines (1 mark)',
                'Strength variation (1 mark)',
                'Direction rule (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q4',
            question: 'Explain how to make an electromagnet stronger.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Increase current. Increase number of turns of wire. Use iron core. Wrap coils closer together.',
            markingCriteria: {
              breakdown: [
                'Four valid methods (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q5',
            question: 'Describe the motor effect.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Current-carrying conductor in magnetic field experiences force. Force perpendicular to both current and field. Direction given by Fleming\'s left-hand rule.',
            markingCriteria: {
              breakdown: [
                'Force on conductor (1 mark)',
                'Current and field needed (1 mark)',
                'Perpendicular force (1 mark)',
                'Fleming\'s rule (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q6',
            question: 'List three factors that affect the size of the force on a current-carrying conductor.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'Size of current. Strength of magnetic field. Length of conductor in field.',
            markingCriteria: {
              breakdown: [
                'Three factors (3 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q7',
            question: 'Explain how a simple electric motor works.',
            marks: 6,
            difficulty: 'hard',
            modelAnswer: 'Current flows through coil in magnetic field. Motor effect produces force on each side of coil. Forces in opposite directions cause rotation. Commutator reverses current every half turn to maintain rotation.',
            markingCriteria: {
              breakdown: [
                'Current in field (1 mark)',
                'Force production (1 mark)',
                'Opposite forces (1 mark)',
                'Rotation (1 mark)',
                'Commutator function (2 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q8',
            question: 'State Fleming\'s left-hand rule.',
            marks: 3,
            difficulty: 'medium',
            modelAnswer: 'First finger: magnetic field direction. Second finger: current direction. Thumb: force direction.',
            markingCriteria: {
              breakdown: [
                'First finger - field (1 mark)',
                'Second finger - current (1 mark)',
                'Thumb - force (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q9',
            question: 'Describe uses of electromagnets.',
            marks: 4,
            difficulty: 'easy',
            modelAnswer: 'Electric motors. Loudspeakers. MRI scanners. Scrapyard cranes for lifting metal.',
            markingCriteria: {
              breakdown: [
                'Four uses (4 marks)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          },
          {
            id: 'me-q10',
            question: 'Explain why electromagnets are useful compared to permanent magnets.',
            marks: 4,
            difficulty: 'medium',
            modelAnswer: 'Can be turned on and off. Strength can be varied by changing current. Direction can be reversed. Can be made very strong.',
            markingCriteria: {
              breakdown: [
                'On/off control (1 mark)',
                'Variable strength (1 mark)',
                'Reversible (1 mark)',
                'High strength possible (1 mark)'
              ]
            },
            specReference: 'AQA Combined Science Physics P7'
          }
        ]
      }
    ]
  }
];