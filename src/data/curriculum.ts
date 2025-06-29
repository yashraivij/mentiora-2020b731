import { CurriculumSubject, Question } from "./types";

export const curriculum: CurriculumSubject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    color: "bg-blue-500",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            id: "alg-1",
            questionText: "Simplify the expression: 3x + 5x - 2 + 7.",
            marks: 3,
            modelAnswer: "Combine like terms: 3x + 5x = 8x; -2 + 7 = 5. So, the simplified expression is 8x + 5.",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Combine 3x and 5x correctly (2 marks)",
                "Combine constants -2 and 7 correctly (1 mark)"
              ]
            },
            specReference: "M1.1"
          },
          {
            id: "alg-2",
            questionText: "Solve the equation 2x - 5 = 9.",
            marks: 4,
            modelAnswer: "Add 5 to both sides: 2x = 14. Divide both sides by 2: x = 7.",
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Add 5 to both sides (2 marks)",
                "Divide both sides by 2 (1 mark)",
                "Correct final answer x=7 (1 mark)"
              ]
            },
            specReference: "M1.2"
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
        name: "1. Cell Biology",
        questions: [
          {
            id: "cell-1",
            questionText: "Describe the structure of a typical animal cell and explain the function of the nucleus.",
            marks: 5,
            modelAnswer: "Animal cells have a cell membrane, cytoplasm, mitochondria, ribosomes, and a nucleus. The nucleus contains genetic material (DNA) and controls cell activities by regulating gene expression.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Identify cell membrane, cytoplasm, mitochondria, ribosomes (2 marks)",
                "Describe nucleus contains DNA (1 mark)",
                "Explain nucleus controls cell activities (2 marks)"
              ]
            },
            specReference: "B1.1"
          }
        ]
      },
      {
        id: "organisation",
        name: "2. Organisation",
        questions: [
          {
            id: "org-1",
            questionText: "Explain the levels of organisation in multicellular organisms.",
            marks: 6,
            modelAnswer: "Levels: cells form tissues, tissues form organs, organs form organ systems, organ systems work together to form an organism. Each level has specific functions and complexity increases.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Define cells, tissues, organs, organ systems (4 marks)",
                "Explain function and increasing complexity (2 marks)"
              ]
            },
            specReference: "B2.1"
          }
        ]
      },
      {
        id: "infection-and-response",
        name: "3. Infection and Response",
        questions: [
          {
            id: "inf-1",
            questionText: "Describe how pathogens cause disease and explain the body's primary defence mechanisms.",
            marks: 6,
            modelAnswer: "Pathogens invade the body and multiply, damaging cells and releasing toxins. Primary defences include skin barrier, mucus membranes, cilia in respiratory tract, stomach acid, and tears containing enzymes.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Explain pathogen invasion and damage (2 marks)",
                "List primary defences (4 marks)"
              ]
            },
            specReference: "B3.1"
          }
        ]
      },
      {
        id: "bioenergetics",
        name: "4. Bioenergetics",
        questions: [
          {
            id: "bio-energy-1",
            questionText: "Explain the process of photosynthesis, including the word equation and the conditions required for this process to occur efficiently.",
            marks: 6,
            modelAnswer: "Photosynthesis is the process where plants convert carbon dioxide and water into glucose and oxygen using light energy. Word equation: Carbon dioxide + Water → Glucose + Oxygen (in the presence of light and chlorophyll). The process requires: 1) Light energy (preferably sunlight), 2) Chlorophyll pigment in chloroplasts, 3) Carbon dioxide from the atmosphere, 4) Water absorbed by roots, 5) Suitable temperature (around 20-30°C), 6) Adequate concentration of CO₂.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Definition of photosynthesis (1 mark)",
                "Correct word equation (2 marks)",
                "List of required conditions - light, chlorophyll, CO₂, water (2 marks)",
                "Temperature requirement mentioned (1 mark)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-2",
            questionText: "Describe how temperature affects the rate of photosynthesis and explain why this occurs in terms of enzyme activity.",
            marks: 4,
            modelAnswer: "As temperature increases from 0°C to around 25-30°C, the rate of photosynthesis increases because enzymes involved in photosynthesis have more kinetic energy, leading to more frequent successful collisions between enzyme and substrate molecules. However, above the optimum temperature (around 30-35°C), the rate decreases rapidly because enzymes begin to denature - their active sites change shape, preventing substrate binding.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Rate increases with temperature up to optimum (1 mark)",
                "Rate decreases above optimum temperature (1 mark)",
                "Explanation involving enzyme kinetic energy (1 mark)",
                "Explanation of enzyme denaturation (1 mark)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-3",
            questionText: "A student investigated the effect of light intensity on the rate of photosynthesis using pondweed. Describe how they could carry out this investigation and identify two variables that should be controlled.",
            marks: 5,
            modelAnswer: "Method: 1) Place pondweed in a test tube filled with water, 2) Position a lamp at different distances from the pondweed, 3) Count the number of oxygen bubbles produced in a fixed time period (e.g., 5 minutes), 4) Repeat at each distance and calculate mean rate, 5) Plot a graph of light intensity (1/distance²) against rate of bubble production. Control variables: 1) Temperature - use a heat shield or maintain constant room temperature, 2) Carbon dioxide concentration - add sodium hydrogencarbonate to water, 3) Type and size of pondweed used.",
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 2,
              breakdown: [
                "Method for varying light intensity using lamp distances (2 marks)",
                "Method for measuring rate (counting bubbles) (1 mark)",
                "Two appropriate control variables identified (2 marks)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-4",
            questionText: "Explain why plants carry out respiration as well as photosynthesis, and describe when each process occurs.",
            marks: 4,
            modelAnswer: "Plants need respiration to release energy from glucose for cellular processes like active transport, protein synthesis, and cell division. Photosynthesis only produces glucose but doesn't directly provide usable energy (ATP). Photosynthesis occurs only during daylight hours when light is available, while respiration occurs continuously, 24 hours a day, in all living cells of the plant.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Respiration releases energy/ATP for cellular processes (2 marks)",
                "Photosynthesis occurs only in light/daytime (1 mark)",
                "Respiration occurs continuously/24 hours (1 mark)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-5",
            questionText: "Compare aerobic and anaerobic respiration in terms of oxygen requirement, products formed, and energy released.",
            marks: 6,
            modelAnswer: "Aerobic respiration requires oxygen and produces carbon dioxide, water, and 38 ATP molecules per glucose molecule. Word equation: Glucose + Oxygen → Carbon dioxide + Water + Energy. Anaerobic respiration occurs without oxygen and produces different products: in animals it produces lactic acid and only 2 ATP molecules per glucose; in plants and yeast it produces ethanol, carbon dioxide and 2 ATP molecules. Aerobic respiration releases much more energy (19 times more) than anaerobic respiration.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Aerobic requires oxygen, anaerobic doesn't (1 mark)",
                "Aerobic products: CO₂, water, ATP (1 mark)",
                "Anaerobic products in animals: lactic acid (1 mark)",
                "Anaerobic products in plants/yeast: ethanol, CO₂ (1 mark)",
                "Energy comparison - aerobic releases more (2 marks)"
              ]
            },
            specReference: "B4.2"
          },
          {
            id: "bio-energy-6",
            questionText: "Explain what happens to lactic acid produced during anaerobic respiration in muscles and why this is necessary.",
            marks: 3,
            modelAnswer: "Lactic acid produced during anaerobic respiration in muscles is toxic and causes muscle fatigue and pain. After exercise, when oxygen becomes available again, the lactic acid is transported in the blood to the liver where it is either: 1) Oxidized completely to carbon dioxide and water, or 2) Converted back to glucose. This process requires oxygen, which explains the 'oxygen debt' - the continued rapid breathing after exercise.",
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                "Lactic acid is toxic/causes fatigue (1 mark)",
                "Transported to liver for breakdown (1 mark)",
                "Oxygen debt/continued breathing after exercise (1 mark)"
              ]
            },
            specReference: "B4.2"
          },
          {
            id: "bio-energy-7",
            questionText: "Describe the role of mitochondria in respiration and explain why muscle cells contain many mitochondria.",
            marks: 4,
            modelAnswer: "Mitochondria are the site of aerobic respiration in cells. They contain enzymes needed for the Krebs cycle and electron transport chain, which produce most of the ATP during respiration. Muscle cells contain many mitochondria because muscles require large amounts of energy for contraction. The more mitochondria present, the more ATP can be produced to meet the high energy demands of muscle activity.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Mitochondria are site of aerobic respiration (1 mark)",
                "Contain enzymes for ATP production (1 mark)",
                "Muscle cells need lots of energy for contraction (1 mark)",
                "More mitochondria = more ATP production (1 mark)"
              ]
            },
            specReference: "B4.2"
          },
          {
            id: "bio-energy-8",
            questionText: "Explain how the structure of a leaf is adapted for photosynthesis, mentioning at least three specific adaptations.",
            marks: 6,
            modelAnswer: "Leaf adaptations for photosynthesis include: 1) Broad, flat shape provides large surface area for light absorption, 2) Thin structure allows light to penetrate to inner cells and reduces diffusion distance for gases, 3) Chloroplasts concentrated in palisade mesophyll cells near the upper surface for maximum light absorption, 4) Stomata allow gas exchange (CO₂ in, O₂ out), 5) Air spaces in spongy mesophyll allow gas circulation, 6) Network of veins transports water to cells and removes glucose products.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Broad flat shape for light collection (1 mark)",
                "Thin for light penetration/gas diffusion (1 mark)",
                "Chloroplasts in palisade layer (1 mark)",
                "Stomata for gas exchange (1 mark)",
                "Air spaces for gas circulation (1 mark)",
                "Veins for transport (1 mark)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-9",
            questionText: "A farmer wants to increase the rate of photosynthesis in his greenhouse crops. Suggest and explain three ways he could do this.",
            marks: 6,
            modelAnswer: "Three ways to increase photosynthesis rate: 1) Increase light intensity using artificial lighting - provides more energy for light-dependent reactions, but avoid overheating, 2) Increase CO₂ concentration using CO₂ generators - provides more raw material for photosynthesis as CO₂ is often a limiting factor, 3) Optimize temperature (25-30°C) using heating/cooling systems - ensures enzymes work at optimum rate without denaturing. Each method addresses a different limiting factor of photosynthesis.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Increase light intensity with explanation (2 marks)",
                "Increase CO₂ concentration with explanation (2 marks)",
                "Control temperature with explanation (2 marks)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "bio-energy-10",
            questionText: "Explain the importance of glucose produced during photosynthesis and describe three ways plants use this glucose.",
            marks: 5,
            modelAnswer: "Glucose is vital for plants as it provides energy and raw materials for growth and metabolism. Three uses of glucose: 1) Respiration - broken down to release energy (ATP) for cellular processes like active transport and protein synthesis, 2) Storage - converted to starch in roots, stems and leaves for use when photosynthesis cannot occur (night/winter), 3) Structural material - converted to cellulose for cell walls, providing strength and support to plant structure. Some glucose is also converted to fats/oils for energy storage and amino acids for protein synthesis.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Glucose used for respiration/energy release (1 mark)",
                "Converted to starch for storage (1 mark)",
                "Converted to cellulose for structure (1 mark)",
                "Explanation of why each use is important (2 marks)"
              ]
            },
            specReference: "B4.1"
          }
        ]
      },
      {
        id: "homeostasis-and-response",
        name: "5. Homeostasis and Response",
        questions: [
          {
            id: "homeo-1",
            questionText: "Define homeostasis and explain why it is important for the proper functioning of the human body.",
            marks: 4,
            modelAnswer: "Homeostasis is the maintenance of a constant internal environment within the body, despite changes in external conditions. It is important because: 1) Enzymes require specific temperature and pH conditions to function optimally, 2) Cells need constant glucose concentration for respiration, 3) Water balance must be maintained for proper cell function, 4) Waste products must be removed to prevent toxicity. Without homeostasis, metabolic processes would be disrupted and cells could be damaged or die.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Definition of homeostasis (1 mark)",
                "Enzyme function requires constant conditions (1 mark)",
                "Cell function requires stable environment (1 mark)",
                "Prevention of cell damage/death (1 mark)"
              ]
            },
            specReference: "B5.1"
          },
          {
            id: "homeo-2",
            questionText: "Describe the structure and function of a typical reflex arc, using the example of the knee-jerk reflex.",
            marks: 6,
            modelAnswer: "A reflex arc consists of: 1) Receptor (muscle spindle in quadriceps) detects stimulus (muscle stretch), 2) Sensory neuron carries impulse to spinal cord, 3) Relay neuron in spinal cord processes information, 4) Motor neuron carries impulse from spinal cord to effector, 5) Effector (quadriceps muscle) produces response (contraction). The knee-jerk reflex protects the muscle from overstretching. The reflex arc bypasses the brain for rapid, automatic responses to potentially harmful stimuli.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Receptor detects stimulus (1 mark)",
                "Sensory neuron to spinal cord (1 mark)",
                "Relay neuron in spinal cord (1 mark)",
                "Motor neuron to effector (1 mark)",
                "Effector produces response (1 mark)",
                "Bypasses brain for speed (1 mark)"
              ]
            },
            specReference: "B5.2"
          },
          {
            id: "homeo-3",
            questionText: "Explain how body temperature is controlled in humans, including the role of the hypothalamus and the responses when body temperature is too high.",
            marks: 6,
            modelAnswer: "The hypothalamus acts as the thermoregulatory center, containing temperature receptors that monitor blood temperature. When body temperature rises above 37°C: 1) Vasodilation occurs - blood vessels near skin surface widen to increase heat loss by radiation, 2) Sweating increases - sweat glands produce more sweat, which evaporates and removes heat energy, 3) Behavioral responses - seeking shade, removing clothing, 4) Reduced metabolic rate and muscle activity. The hypothalamus coordinates these responses through the nervous and hormonal systems.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Hypothalamus monitors temperature (1 mark)",
                "Vasodilation increases heat loss (2 marks)",
                "Sweating and evaporation removes heat (2 marks)",
                "Behavioral responses mentioned (1 mark)"
              ]
            },
            specReference: "B5.3"
          },
          {
            id: "homeo-4",
            questionText: "Describe how blood glucose concentration is controlled, including the roles of insulin and glucagon.",
            marks: 8,
            modelAnswer: "Blood glucose is controlled by the pancreas through negative feedback. When blood glucose rises (after eating): 1) Beta cells in pancreas detect high glucose, 2) Insulin is secreted, 3) Insulin causes liver to convert glucose to glycogen for storage, 4) Cells increase glucose uptake, 5) Blood glucose falls. When blood glucose falls (during exercise/fasting): 1) Alpha cells detect low glucose, 2) Glucagon is secreted, 3) Glucagon causes liver to convert glycogen back to glucose, 4) Blood glucose rises. This maintains glucose between 4-6 mmol/L.",
            markingCriteria: {
              ao1: 4,
              ao2: 4,
              ao3: 0,
              breakdown: [
                "Pancreas detects glucose changes (1 mark)",
                "Insulin released when glucose high (1 mark)",
                "Insulin effects: glucose to glycogen, cell uptake (2 marks)",
                "Glucagon released when glucose low (1 mark)",
                "Glucagon converts glycogen to glucose (1 mark)",
                "Negative feedback mechanism (2 marks)"
              ]
            },
            specReference: "B5.4"
          },
          {
            id: "homeo-5",
            questionText: "Explain the difference between Type 1 and Type 2 diabetes, including their causes and treatments.",
            marks: 6,
            modelAnswer: "Type 1 diabetes: Caused by autoimmune destruction of beta cells in pancreas, so no insulin is produced. Usually develops in childhood. Treatment requires regular insulin injections, blood glucose monitoring, and controlled diet. Type 2 diabetes: Body cells become resistant to insulin or pancreas produces insufficient insulin. Usually develops in adulthood, often linked to obesity and diet. Treatment includes dietary control, exercise, weight loss, and sometimes medication or insulin in severe cases.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Type 1: no insulin production/autoimmune (2 marks)",
                "Type 1: treated with insulin injections (1 mark)",
                "Type 2: insulin resistance/insufficient insulin (2 marks)",
                "Type 2: treated with diet/exercise/medication (1 mark)"
              ]
            },
            specReference: "B5.4"
          },
          {
            id: "homeo-6",
            questionText: "Describe the structure of the human eye and explain how it focuses light onto the retina.",
            marks: 7,
            modelAnswer: "Eye structure: Cornea (transparent, refracts light), lens (transparent, changes shape for focusing), retina (contains light-sensitive cells), optic nerve (carries impulses to brain). Focusing process: 1) Light enters through cornea, which provides most refraction, 2) Light passes through pupil (controlled by iris), 3) Lens fine-tunes focusing by changing shape, 4) Ciliary muscles contract to make lens thicker for near objects, relax to make lens thinner for distant objects, 5) Focused light hits retina, stimulating rod and cone cells, 6) Impulses sent via optic nerve to brain.",
            markingCriteria: {
              ao1: 4,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Key structures: cornea, lens, retina, optic nerve (2 marks)",
                "Cornea refracts light (1 mark)",
                "Lens changes shape for focusing (1 mark)",
                "Ciliary muscles control lens shape (2 marks)",
                "Light stimulates retina cells (1 mark)"
              ]
            },
            specReference: "B5.5"
          },
          {
            id: "homeo-7",
            questionText: "Explain how the eye adapts to different light intensities and distances, including the role of the iris and ciliary muscles.",
            marks: 6,
            modelAnswer: "Light intensity adaptation: The iris controls pupil size. In bright light, circular muscles contract and radial muscles relax, making pupil smaller to reduce light entry. In dim light, radial muscles contract and circular muscles relax, making pupil larger to allow more light in. Distance adaptation (accommodation): For near objects, ciliary muscles contract, suspensory ligaments relax, lens becomes thicker and more curved. For distant objects, ciliary muscles relax, suspensory ligaments tighten, lens becomes thinner and less curved.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Bright light: pupil constricts (1 mark)",
                "Dim light: pupil dilates (1 mark)",
                "Near vision: lens thickens (1 mark)",
                "Distant vision: lens thins (1 mark)",
                "Role of ciliary muscles and suspensory ligaments (2 marks)"
              ]
            },
            specReference: "B5.5"
          },
          {
            id: "homeo-8",
            questionText: "Describe the function of the kidney in maintaining homeostasis, including the processes of filtration, reabsorption and excretion.",
            marks: 8,
            modelAnswer: "The kidney maintains homeostasis by controlling water balance, salt concentration, and waste removal. Filtration: Blood enters glomerulus under high pressure, small molecules (water, glucose, urea, salts) filter into Bowman's capsule, large molecules (proteins, blood cells) remain in blood. Reabsorption: In proximal tubule, useful substances (glucose, amino acids, some water and salts) are actively reabsorbed back into blood. In collecting duct, water reabsorption is controlled by ADH hormone. Excretion: Waste products (urea, excess water and salts) form urine, which passes to bladder via ureters.",
            markingCriteria: {
              ao1: 5,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Filtration in glomerulus/Bowman's capsule (2 marks)",
                "Small molecules filter, large molecules don't (1 mark)",
                "Reabsorption of useful substances (2 marks)",
                "ADH controls water reabsorption (1 mark)",
                "Urine formation and excretion (2 marks)"
              ]
            },
            specReference: "B5.6"
          },
          {
            id: "homeo-9",
            questionText: "Explain how ADH (antidiuretic hormone) controls water balance in the body and what happens when someone is dehydrated.",
            marks: 5,
            modelAnswer: "ADH is produced by the hypothalamus and released by the pituitary gland. When dehydrated: 1) Hypothalamus detects increased blood concentration (osmoreceptors), 2) More ADH is released into bloodstream, 3) ADH travels to kidneys and makes collecting ducts more permeable to water, 4) More water is reabsorbed from urine back into blood, 5) Less, more concentrated urine is produced, 6) Blood water content increases back to normal. This is an example of negative feedback control.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Hypothalamus detects blood concentration (1 mark)",
                "ADH released and travels to kidneys (1 mark)",
                "ADH increases water reabsorption (1 mark)",
                "Concentrated urine produced (1 mark)",
                "Negative feedback mechanism (1 mark)"
              ]
            },
            specReference: "B5.6"
          },
          {
            id: "homeo-10",
            questionText: "Compare nervous and hormonal coordination in the human body, giving examples of each and explaining when each system is most appropriate.",
            marks: 6,
            modelAnswer: "Nervous coordination: Uses electrical impulses along neurons, very fast (milliseconds), short-lasting effects, precise targeting. Examples: reflex actions, muscle movement, sensory responses. Most appropriate for rapid responses to immediate dangers. Hormonal coordination: Uses chemical messengers in blood, slower (seconds to hours), longer-lasting effects, affects multiple organs. Examples: insulin controlling blood glucose, ADH controlling water balance, adrenaline preparing for fight/flight. Most appropriate for regulating long-term processes and coordinating multiple body systems.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Nervous: fast, electrical impulses, short-term (2 marks)",
                "Hormonal: slower, chemical, long-term (2 marks)",
                "Appropriate examples of each (1 mark)",
                "When each system is most suitable (1 mark)"
              ]
            },
            specReference: "B5.1"
          }
        ]
      },
      {
        id: "inheritance-variation-evolution",
        name: "6. Inheritance, Variation and Evolution",
        questions: [
          {
            id: "inherit-1",
            questionText: "Explain the difference between sexual and asexual reproduction, giving one advantage and one disadvantage of each.",
            marks: 6,
            modelAnswer: "Sexual reproduction involves the fusion of male and female gametes, producing genetically different offspring. Advantage: genetic variation increases survival chances in changing environments. Disadvantage: requires finding a mate, uses more energy. Asexual reproduction involves only one parent, producing genetically identical offspring (clones). Advantage: rapid reproduction, no need to find a mate. Disadvantage: no genetic variation, all offspring vulnerable to same diseases or environmental changes.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Sexual: fusion of gametes, genetic variation (2 marks)",
                "Asexual: one parent, identical offspring (2 marks)",
                "One advantage and disadvantage of each (2 marks)"
              ]
            },
            specReference: "B6.1"
          },
          {
            id: "inherit-2",
            questionText: "Describe the process of meiosis and explain why it is important for sexual reproduction.",
            marks: 6,
            modelAnswer: "Meiosis is cell division that produces four genetically different gametes from one diploid cell. Process: 1) DNA replicates, 2) Homologous chromosomes pair up and may cross over (exchange genetic material), 3) First division separates homologous pairs, 4) Second division separates sister chromatids. Importance: 1) Reduces chromosome number from diploid to haploid, so fertilization restores diploid number, 2) Creates genetic variation through independent assortment and crossing over, 3) Ensures each gamete is genetically unique.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Two divisions producing four gametes (1 mark)",
                "Chromosome pairing and crossing over (1 mark)",
                "Reduces diploid to haploid (1 mark)",
                "Creates genetic variation (2 marks)",
                "Independent assortment mentioned (1 mark)"
              ]
            },
            specReference: "B6.1"
          },
          {
            id: "inherit-3",
            questionText: "Using a genetic cross diagram, show the inheritance of tongue rolling (dominant) in humans. Cross two heterozygous parents and state the expected ratio of offspring.",
            marks: 5,
            modelAnswer: "Let T = tongue rolling (dominant), t = cannot roll tongue (recessive). Parents: Tt × Tt. Gametes: T, t from each parent. Punnett square shows: TT (can roll), Tt (can roll), Tt (can roll), tt (cannot roll). Genotype ratio: 1 TT : 2 Tt : 1 tt. Phenotype ratio: 3 can roll tongue : 1 cannot roll tongue. Therefore 75% of offspring can roll their tongue, 25% cannot.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                "Correct symbols and parent genotypes (1 mark)",
                "Correct Punnett square or genetic cross (2 marks)",
                "Correct phenotype ratio 3:1 (1 mark)",
                "Correct percentage calculation (1 mark)"
              ]
            },
            specReference: "B6.2"
          },
          {
            id: "inherit-4",
            questionText: "Explain what is meant by the terms genotype, phenotype, homozygous, heterozygous, and give an example of each.",
            marks: 5,
            modelAnswer: "Genotype: the genetic makeup/alleles present in an organism, e.g., TT, Tt, or tt for tongue rolling. Phenotype: the observable characteristics resulting from genotype and environment, e.g., can roll tongue or cannot roll tongue. Homozygous: having two identical alleles for a trait, e.g., TT (homozygous dominant) or tt (homozygous recessive). Heterozygous: having two different alleles for a trait, e.g., Tt. The phenotype depends on which alleles are dominant or recessive.",
            markingCriteria: {
              ao1: 5,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "Genotype definition with example (1 mark)",
                "Phenotype definition with example (1 mark)",
                "Homozygous definition with example (1 mark)",
                "Heterozygous definition with example (1 mark)",
                "Link between genotype and phenotype (1 mark)"
              ]
            },
            specReference: "B6.2"
          },
          {
            id: "inherit-5",
            questionText: "Describe how genetic engineering is used to produce human insulin in bacteria, and explain why this is beneficial.",
            marks: 6,
            modelAnswer: "Process: 1) Human insulin gene is isolated using restriction enzymes, 2) Bacterial plasmid is cut open using same restriction enzymes, 3) Human insulin gene is inserted into plasmid using ligase enzymes, 4) Recombinant plasmid is inserted into bacterial cells, 5) Bacteria reproduce rapidly, making copies of insulin gene, 6) Bacteria produce human insulin which is harvested and purified. Benefits: Large quantities produced quickly, identical to human insulin so no allergic reactions, cheaper than extracting from animal pancreases, more ethical than using animals.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Gene isolation and insertion into plasmid (2 marks)",
                "Transformation of bacteria (1 mark)",
                "Bacterial reproduction and insulin production (1 mark)",
                "Benefits: quantity, no allergies, cost, ethics (2 marks)"
              ]
            },
            specReference: "B6.3"
          },
          {
            id: "inherit-6",
            questionText: "Explain Darwin's theory of evolution by natural selection, using an example such as antibiotic resistance in bacteria.",
            marks: 6,
            modelAnswer: "Darwin's theory states that organisms with favorable traits are more likely to survive and reproduce. Example with antibiotic resistance: 1) Variation: bacteria in a population have different genetic traits, some may have random mutations giving antibiotic resistance, 2) Selection pressure: when antibiotics are used, most bacteria die, 3) Survival: resistant bacteria survive and reproduce, 4) Inheritance: resistance genes are passed to offspring, 5) Evolution: over time, the proportion of resistant bacteria increases in the population. This explains why antibiotic-resistant bacteria are becoming more common.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Variation in population mentioned (1 mark)",
                "Selection pressure (antibiotics) kills non-resistant (1 mark)",
                "Resistant bacteria survive and reproduce (1 mark)",
                "Inheritance of resistance genes (1 mark)",
                "Population changes over time (2 marks)"
              ]
            },
            specReference: "B6.4"
          },
          {
            id: "inherit-7",
            questionText: "Describe the evidence for evolution, including fossils, antibiotic resistance, and classification.",
            marks: 6,
            modelAnswer: "Fossil evidence: Shows progression of species over time, simple organisms in older rocks, complex organisms in newer rocks, transitional forms show gradual changes. Antibiotic resistance: Demonstrates natural selection in action, bacteria populations change rapidly when exposed to selection pressure. Classification evidence: Similar species have similar DNA sequences and protein structures, suggesting common ancestry. Embryological evidence: Similar embryo development in related species. Molecular evidence: DNA and protein similarities reflect evolutionary relationships - more similar sequences indicate more recent common ancestors.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Fossil evidence shows progression over time (2 marks)",
                "Antibiotic resistance shows natural selection (1 mark)",
                "Classification based on similarities (1 mark)",
                "DNA/molecular evidence mentioned (2 marks)"
              ]
            },
            specReference: "B6.4"
          },
          {
            id: "inherit-8",
            questionText: "Explain how selective breeding has been used to improve crop plants and livestock, giving specific examples.",
            marks: 5,
            modelAnswer: "Selective breeding involves choosing organisms with desired traits as parents for the next generation. Crop examples: Wheat bred for higher yield, disease resistance, and shorter stems to prevent lodging. Corn bred for larger kernels and pest resistance. Livestock examples: Cattle bred for higher milk production or better meat quality. Sheep bred for wool quality or meat production. Process: 1) Identify desired trait, 2) Select individuals showing the trait, 3) Breed these individuals together, 4) Select best offspring and repeat over many generations.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Definition of selective breeding (1 mark)",
                "Crop example with specific traits (1 mark)",
                "Livestock example with specific traits (1 mark)",
                "Process described correctly (2 marks)"
              ]
            },
            specReference: "B6.3"
          },
          {
            id: "inherit-9",
            questionText: "Describe what causes genetic variation in populations and explain how this variation is important for survival.",
            marks: 5,
            modelAnswer: "Causes of genetic variation: 1) Sexual reproduction - independent assortment and crossing over during meiosis create new gene combinations, 2) Random fertilization - any sperm can fertilize any egg, 3) Mutations - random changes in DNA create new alleles. Importance for survival: Genetic variation means some individuals may have traits that help them survive environmental changes, diseases, or other challenges. Without variation, all individuals would be equally vulnerable. Natural selection acts on this variation, allowing populations to evolve and adapt to changing conditions.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Sexual reproduction creates variation (1 mark)",
                "Mutations create new alleles (1 mark)",
                "Random fertilization mentioned (1 mark)",
                "Variation allows adaptation to environmental changes (2 marks)"
              ]
            },
            specReference: "B6.1"
          },
          {
            id: "inherit-10",
            questionText: "Explain the difference between continuous and discontinuous variation, giving examples of each and describing their causes.",
            marks: 6,
            modelAnswer: "Continuous variation shows a range of phenotypes with no clear categories, e.g., height or weight in humans. These traits are controlled by multiple genes (polygenic) and strongly influenced by environment. Discontinuous variation shows distinct categories with no intermediates, e.g., ABO blood groups or tongue rolling ability. These traits are usually controlled by single genes with little environmental influence. Continuous variation can be plotted as a normal distribution curve, while discontinuous variation shows distinct bars on a bar chart.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Continuous: range of phenotypes, example given (2 marks)",
                "Discontinuous: distinct categories, example given (2 marks)",
                "Continuous: multiple genes, environmental influence (1 mark)",
                "Discontinuous: single gene, little environmental effect (1 mark)"
              ]
            },
            specReference: "B6.1"
          }
        ]
      },
      {
        id: "ecology",
        name: "7. Ecology",
        questions: [
          {
            id: "ecology-1",
            questionText: "Define the terms ecosystem, population, community, and habitat, giving an example of each.",
            marks: 4,
            modelAnswer: "Ecosystem: a community of organisms interacting with each other and their physical environment, e.g., a pond ecosystem. Population: all the organisms of the same species living in the same area, e.g., all the oak trees in a forest. Community: all the different populations of organisms living in the same area, e.g., all plants, animals, and microorganisms in a meadow. Habitat: the place where an organism lives and obtains everything it needs to survive, e.g., a rotting log for woodlice.",
            markingCriteria: {
              ao1: 4,
              ao2: 0,
              ao3: 0,
              breakdown: [
                "Ecosystem definition with example (1 mark)",
                "Population definition with example (1 mark)",
                "Community definition with example (1 mark)",
                "Habitat definition with example (1 mark)"
              ]
            },
            specReference: "B7.1"
          },
          {
            id: "ecology-2",
            questionText: "Explain how energy flows through a food chain and why energy transfer between trophic levels is inefficient.",
            marks: 6,
            modelAnswer: "Energy flows in one direction through food chains: Producer → Primary consumer → Secondary consumer → Tertiary consumer. Energy enters as light, captured by producers through photosynthesis. Energy transfer is inefficient because: 1) Only ~10% passes to next level, 2) Energy lost as heat through respiration, 3) Energy lost in movement and other life processes, 4) Not all parts of organisms are eaten, 5) Not all food is digested and absorbed. This explains why food chains rarely exceed 4-5 trophic levels and why there are fewer organisms at higher levels.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Energy flow direction through trophic levels (1 mark)",
                "Only ~10% transferred between levels (1 mark)",
                "Energy lost as heat through respiration (1 mark)",
                "Energy lost in movement/life processes (1 mark)",
                "Not all food eaten/digested (2 marks)"
              ]
            },
            specReference: "B7.2"
          },
          {
            id: "ecology-3",
            questionText: "Describe how carbon is recycled in nature, including the roles of photosynthesis, respiration, combustion, and decomposition.",
            marks: 8,
            modelAnswer: "Carbon cycle: 1) Carbon dioxide in atmosphere, 2) Photosynthesis: plants absorb CO₂ and convert to glucose and other organic compounds, 3) Feeding: carbon compounds pass through food chains, 4) Respiration: all organisms break down organic compounds, releasing CO₂ back to atmosphere, 5) Death and decomposition: decomposer bacteria and fungi break down dead organisms, releasing CO₂, 6) Combustion: burning fossil fuels and wood releases stored carbon as CO₂, 7) Ocean uptake: oceans absorb CO₂ from atmosphere. This maintains atmospheric CO₂ levels, though human activities are increasing them.",
            markingCriteria: {
              ao1: 6,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Photosynthesis removes CO₂ from atmosphere (1 mark)",
                "Carbon passes through food chains (1 mark)",
                "Respiration releases CO₂ (1 mark)",
                "Decomposition releases CO₂ (2 marks)",
                "Combustion releases CO₂ (1 mark)",
                "Ocean uptake mentioned (1 mark)",
                "Cycle maintains atmospheric levels (1 mark)"
              ]
            },
            specReference: "B7.3"
          },
          {
            id: "ecology-4",
            questionText: "Explain how human activities have increased atmospheric carbon dioxide levels and describe the potential consequences.",
            marks: 6,
            modelAnswer: "Human activities increasing CO₂: 1) Burning fossil fuels (coal, oil, gas) for electricity, transport, and industry, 2) Deforestation reduces CO₂ absorption by photosynthesis, 3) Agriculture and livestock farming release CO₂ and methane, 4) Cement production releases CO₂. Consequences: 1) Enhanced greenhouse effect causing global warming, 2) Climate change - melting ice caps, rising sea levels, 3) Changes in rainfall patterns affecting agriculture, 4) Ocean acidification harming marine life, 5) Extreme weather events becoming more frequent.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Fossil fuel combustion (1 mark)",
                "Deforestation reduces CO₂ absorption (1 mark)",
                "Enhanced greenhouse effect/global warming (2 marks)",
                "Climate change consequences (sea level, weather) (2 marks)"
              ]
            },
            specReference: "B7.4"
          },
          {
            id: "ecology-5",
            questionText: "Describe how you would investigate the population size of dandelions in a field using the quadrat method.",
            marks: 6,
            modelAnswer: "Method: 1) Use random sampling - generate random coordinates or throw quadrat randomly to avoid bias, 2) Place 1m² quadrat at selected location, 3) Count all dandelions inside the quadrat (use point quadrat if needed for accuracy), 4) Repeat at least 10 times in different locations, 5) Calculate mean number per quadrat, 6) Estimate total population = mean per quadrat × total number of quadrats that would fit in the field. Record results in a table and calculate percentage cover if appropriate. Ensure quadrats are representative of the whole field.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 2,
              breakdown: [
                "Random sampling to avoid bias (1 mark)",
                "Method of counting in quadrats (1 mark)",
                "Repeat sampling multiple times (1 mark)",
                "Calculate mean and scale up (2 marks)",
                "Ensure representative sampling (1 mark)"
              ]
            },
            specReference: "B7.1"
          },
          {
            id: "ecology-6",
            questionText: "Explain the difference between biotic and abiotic factors, giving three examples of each and describing how they can affect organism distribution.",
            marks: 6,
            modelAnswer: "Biotic factors are living components of environment: 1) Predation - affects prey numbers and behavior, 2) Competition - for food, space, or mates limits population size, 3) Disease - pathogens can reduce population numbers. Abiotic factors are non-living components: 1) Temperature - affects enzyme activity and metabolic rate, 2) Light intensity - affects photosynthesis rate in plants, 3) pH - affects enzyme function and nutrient availability. These factors determine where organisms can survive and reproduce, creating different communities in different environments.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Three biotic factors with examples (2 marks)",
                "Three abiotic factors with examples (2 marks)",
                "How factors affect organism distribution (2 marks)"
              ]
            },
            specReference: "B7.1"
          },
          {
            id: "ecology-7",
            questionText: "Describe the problems caused by human population growth and explain how these affect biodiversity.",
            marks: 6,
            modelAnswer: "Problems from population growth: 1) Increased land use for housing, agriculture, and industry leads to habitat destruction, 2) More waste production causes pollution of air, water, and soil, 3) Greater resource consumption depletes natural resources, 4) Increased energy use from fossil fuels causes climate change. Effects on biodiversity: 1) Habitat loss reduces species numbers and variety, 2) Pollution kills organisms and disrupts food chains, 3) Climate change alters habitats faster than species can adapt, 4) Overexploitation leads to species extinction, 5) Reduced biodiversity makes ecosystems less stable.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Habitat destruction from land use (1 mark)",
                "Pollution from waste production (1 mark)",
                "Climate change from energy use (1 mark)",
                "Habitat loss reduces species variety (1 mark)",
                "Pollution disrupts ecosystems (1 mark)",
                "Reduced ecosystem stability (1 mark)"
              ]
            },
            specReference: "B7.4"
          },
          {
            id: "ecology-8",
            questionText: "Explain what is meant by sustainable development and describe three ways humans can reduce their impact on the environment.",
            marks: 6,
            modelAnswer: "Sustainable development meets current human needs without compromising the ability of future generations to meet their needs. Ways to reduce environmental impact: 1) Renewable energy - use solar, wind, and hydroelectric power instead of fossil fuels to reduce CO₂ emissions, 2) Conservation programs - protect habitats and endangered species through nature reserves and breeding programs, 3) Reduce, reuse, recycle - minimize waste production and resource consumption, 4) Sustainable agriculture - use crop rotation, biological pest control, and reduce fertilizer use to maintain soil quality.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Definition of sustainable development (1 mark)",
                "Renewable energy to reduce emissions (1 mark)",
                "Conservation to protect species/habitats (2 marks)",
                "Reduce/reuse/recycle to minimize waste (2 marks)"
              ]
            },
            specReference: "B7.4"
          },
          {
            id: "ecology-9",
            questionText: "Describe the process of eutrophication and explain how it can be prevented.",
            marks: 6,
            modelAnswer: "Eutrophication process: 1) Excess fertilizers from agriculture run into waterways, 2) High nitrate and phosphate levels cause rapid algae growth (algal bloom), 3) Algae block sunlight, preventing underwater plants from photosynthesizing, 4) Plants die and are decomposed by bacteria, 5) Bacteria use oxygen for respiration, creating oxygen-depleted water, 6) Fish and other aquatic animals die from lack of oxygen. Prevention: 1) Use precise amounts of fertilizer, 2) Plant buffer strips near waterways to absorb runoff, 3) Use biological pest control instead of chemicals, 4) Treat sewage properly before discharge.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Fertilizer runoff causes algal bloom (2 marks)",
                "Algae block light, plants die (1 mark)",
                "Decomposition uses oxygen, fish die (2 marks)",
                "Prevention methods mentioned (1 mark)"
              ]
            },
            specReference: "B7.4"
          },
          {
            id: "ecology-10",
            questionText: "Explain the importance of biodiversity and describe how human activities threaten it.",
            marks: 6,
            modelAnswer: "Importance of biodiversity: 1) Ecosystem stability - more species make ecosystems more resilient to change, 2) Food security - variety of crops and wild species provide food sources, 3) Medicine - many drugs come from natural compounds in plants and animals, 4) Economic value - ecotourism, timber, and other resources, 5) Intrinsic value - species have right to exist. Threats: 1) Habitat destruction for agriculture and urban development, 2) Pollution killing species and disrupting reproduction, 3) Climate change altering habitats faster than species can adapt, 4) Overexploitation through hunting, fishing, and harvesting, 5) Invasive species disrupting native ecosystems.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Ecosystem stability from variety (1 mark)",
                "Food security and medicine sources (1 mark)",
                "Economic and intrinsic value (1 mark)",
                "Habitat destruction threat (1 mark)",
                "Pollution and climate change threats (1 mark)",
                "Overexploitation and invasive species (1 mark)"
              ]
            },
            specReference: "B7.4"
          }
        ]
      },
      {
        id: "key-ideas",
        name: "8. Key Ideas",
        questions: [
          {
            id: "key-1",
            questionText: "Explain the importance of enzymes in biological processes and describe how enzyme activity can be affected by temperature and pH.",
            marks: 8,
            modelAnswer: "Enzymes are biological catalysts that speed up metabolic reactions by lowering activation energy. They are essential for: digestion (breaking down food), respiration (releasing energy), photosynthesis (making glucose), and protein synthesis. Temperature effects: As temperature increases from 0°C to optimum (around 37°C in humans), enzyme activity increases due to more kinetic energy and frequent collisions. Above optimum temperature, enzymes denature - active site changes shape, enzyme-substrate complex cannot form. pH effects: Each enzyme has an optimum pH. At extreme pH values, the enzyme's shape changes, affecting the active site and reducing activity. This is why stomach enzymes work in acidic conditions while intestinal enzymes need alkaline conditions.",
            markingCriteria: {
              ao1: 4,
              ao2: 4,
              ao3: 0,
              breakdown: [
                "Definition and importance of enzymes (2 marks)",
                "Examples of enzyme functions (1 mark)",
                "Temperature effects on enzyme activity (2 marks)",
                "Enzyme denaturation at high temperature (1 mark)",
                "pH effects on enzyme activity (2 marks)"
              ]
            },
            specReference: "B1.3"
          },
          {
            id: "key-2",
            questionText: "Describe the structure and function of DNA, explaining how genetic information is stored and passed on to offspring.",
            marks: 8,
            modelAnswer: "DNA structure: Double helix made of two complementary strands held together by hydrogen bonds between base pairs (A-T, G-C). Each strand has a sugar-phosphate backbone with nitrogenous bases. Genetic information storage: The sequence of bases forms a genetic code, with each gene containing instructions for making specific proteins. Three bases (codon) code for one amino acid. Function in inheritance: 1) DNA replication before cell division ensures each cell gets identical genetic information, 2) During meiosis, genetic material is passed to gametes, 3) Fertilization combines genetic material from both parents, 4) Offspring inherit characteristics through DNA from parents.",
            markingCriteria: {
              ao1: 5,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Double helix structure with base pairing (2 marks)",
                "Sugar-phosphate backbone (1 mark)",
                "Base sequence stores genetic information (2 marks)",
                "DNA replication and cell division (1 mark)",
                "Inheritance through gametes and fertilization (2 marks)"
              ]
            },
            specReference: "B6.1"
          },
          {
            id: "key-3",
            questionText: "Explain the concept of surface area to volume ratio and its importance in biological systems, using examples from different organisms.",
            marks: 6,
            modelAnswer: "Surface area to volume ratio: As objects get larger, volume increases faster than surface area, so the ratio decreases. Importance: Organisms need to exchange materials (oxygen, nutrients, waste) across their surface. Small organisms like bacteria have high SA:V ratio, so simple diffusion across cell membrane is sufficient. Large organisms have low SA:V ratio and need specialized systems: 1) Humans have lungs (alveoli) to increase surface area for gas exchange, 2) Small intestine has villi and microvilli for nutrient absorption, 3) Plant leaves are thin with large surface area for gas exchange, 4) Plant roots have root hairs to increase surface area for water/mineral absorption.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Definition of SA:V ratio (1 mark)",
                "Relationship between size and ratio (1 mark)",
                "Small organisms use simple diffusion (1 mark)",
                "Large organisms need specialized systems (1 mark)",
                "Two examples of adaptations in large organisms (2 marks)"
              ]
            },
            specReference: "B1.1"
          },
          {
            id: "key-4",
            questionText: "Compare and contrast plant and animal cells, describing at least four similarities and four differences.",
            marks: 8,
            modelAnswer: "Similarities: 1) Both have cell membrane controlling entry/exit of substances, 2) Both contain nucleus controlling cell activities and containing DNA, 3) Both have mitochondria for aerobic respiration, 4) Both have ribosomes for protein synthesis, 5) Both contain cytoplasm where chemical reactions occur. Differences: 1) Plants have cell wall for support, animals don't, 2) Plants have chloroplasts for photosynthesis, animals don't, 3) Plants have permanent vacuole for support and storage, animals have small temporary vacuoles, 4) Plant cells are usually regular shaped, animal cells are irregular, 5) Plants store starch, animals store glycogen.",
            markingCriteria: {
              ao1: 6,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Four similarities correctly identified (4 marks)",
                "Four differences correctly identified (4 marks)"
              ]
            },
            specReference: "B1.1"
          },
          {
            id: "key-5",
            questionText: "Explain how the circulatory system in humans is adapted to transport materials efficiently around the body.",
            marks: 6,
            modelAnswer: "Adaptations for efficient transport: 1) Double circulation - blood passes through heart twice per circuit, maintaining high pressure, 2) Four-chambered heart prevents mixing of oxygenated and deoxygenated blood, 3) Muscular heart pumps blood under pressure for rapid circulation, 4) Extensive network of blood vessels reaches all body tissues, 5) Different vessel types: arteries (thick walls, high pressure), veins (valves prevent backflow), capillaries (thin walls for easy diffusion), 6) Red blood cells contain hemoglobin for efficient oxygen transport, 7) Plasma carries dissolved nutrients, hormones, and waste products.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Double circulation maintains pressure (1 mark)",
                "Four chambers prevent blood mixing (1 mark)",
                "Different blood vessel adaptations (2 marks)",
                "Red blood cells and hemoglobin (1 mark)",
                "Plasma transport function (1 mark)"
              ]
            },
            specReference: "B3.1"
          },
          {
            id: "key-6",
            questionText: "Describe the process of photosynthesis and cellular respiration, explaining how they are linked in the carbon cycle.",
            marks: 8,
            modelAnswer: "Photosynthesis: Plants use light energy to convert CO₂ and water into glucose and oxygen. Occurs in chloroplasts. Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Cellular respiration: All organisms break down glucose using oxygen to release energy (ATP), producing CO₂ and water. Occurs in mitochondria. Equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Link in carbon cycle: 1) Photosynthesis removes CO₂ from atmosphere, stores carbon in organic compounds, 2) Respiration releases CO₂ back to atmosphere, 3) The processes are complementary - products of one are reactants of the other, 4) This maintains balance of atmospheric CO₂ and O₂ levels.",
            markingCriteria: {
              ao1: 4,
              ao2: 4,
              ao3: 0,
              breakdown: [
                "Photosynthesis equation and location (2 marks)",
                "Respiration equation and location (2 marks)",
                "Photosynthesis removes CO₂ from atmosphere (1 mark)",
                "Respiration returns CO₂ to atmosphere (1 mark)",
                "Processes are complementary/maintain balance (2 marks)"
              ]
            },
            specReference: "B4.1"
          },
          {
            id: "key-7",
            questionText: "Explain the importance of mitosis in growth and repair, and describe the main stages of the cell cycle.",
            marks: 6,
            modelAnswer: "Importance of mitosis: 1) Growth - increases cell number for organism to increase in size, 2) Repair - replaces damaged or dead cells, 3) Asexual reproduction in some organisms, 4) Maintains chromosome number in daughter cells. Cell cycle stages: 1) Interphase - cell grows, organelles replicate, DNA replicates forming sister chromatids, 2) Prophase - chromosomes condense and become visible, nuclear membrane breaks down, 3) Metaphase - chromosomes line up at cell equator, 4) Anaphase - sister chromatids separate and move to opposite poles, 5) Telophase - nuclear membranes reform, chromosomes decondense, 6) Cytokinesis - cytoplasm divides, forming two identical daughter cells.",
            markingCriteria: {
              ao1: 4,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Importance: growth, repair, maintains chromosome number (2 marks)",
                "Interphase: growth and DNA replication (1 mark)",
                "Mitosis stages described correctly (2 marks)",
                "Cytokinesis produces identical daughter cells (1 mark)"
              ]
            },
            specReference: "B1.4"
          },
          {
            id: "key-8",
            questionText: "Describe how materials are transported across cell membranes by diffusion, osmosis, and active transport.",
            marks: 8,
            modelAnswer: "Diffusion: Movement of particles from high to low concentration down concentration gradient. Passive process (no energy needed). Examples: oxygen into cells, CO₂ out of cells. Osmosis: Movement of water molecules across partially permeable membrane from high water potential to low water potential. Passive process. Important for plant support and water balance. Active transport: Movement of substances against concentration gradient (low to high concentration) using energy from ATP and carrier proteins. Examples: glucose absorption in intestine, mineral uptake by plant roots. All three processes are essential for: maintaining cell contents, nutrient uptake, waste removal, and maintaining water balance.",
            markingCriteria: {
              ao1: 6,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Diffusion: high to low concentration, passive (2 marks)",
                "Osmosis: water movement, passive (2 marks)",
                "Active transport: against gradient, uses ATP (2 marks)",
                "Examples of each process (1 mark)",
                "Importance for cell function (1 mark)"
              ]
            },
            specReference: "B1.2"
          },
          {
            id: "key-9",
            questionText: "Explain how natural selection leads to evolution, using antibiotic resistance in bacteria as an example.",
            marks: 6,
            modelAnswer: "Natural selection process: 1) Variation - individuals in population have different characteristics due to genetic differences, 2) Selection pressure - environmental factor that affects survival (e.g., antibiotics), 3) Survival advantage - individuals with beneficial traits are more likely to survive, 4) Reproduction - survivors pass beneficial genes to offspring, 5) Evolution - frequency of beneficial traits increases in population over time. Antibiotic resistance example: Some bacteria have random mutations giving resistance to antibiotics. When antibiotics are used, non-resistant bacteria die, but resistant ones survive and reproduce. Over time, resistant bacteria become more common in population, making antibiotics less effective.",
            markingCriteria: {
              ao1: 3,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "Variation in population mentioned (1 mark)",
                "Selection pressure affects survival (1 mark)",
                "Beneficial traits passed to offspring (1 mark)",
                "Frequency of traits changes over time (1 mark)",
                "Antibiotic resistance example explained correctly (2 marks)"
              ]
            },
            specReference: "B6.4"
          },
          {
            id: "key-10",
            questionText: "Describe the structure and function of the nervous system, explaining how it coordinates responses to stimuli.",
            marks: 8,
            modelAnswer: "Structure: Central nervous system (brain and spinal cord) processes information. Peripheral nervous system (sensory and motor neurons) connects CNS to rest of body. Function: 1) Sensory neurons detect stimuli using receptors (light, sound, touch, chemicals), 2) Sensory neurons carry impulses to CNS, 3) CNS processes information and decides response, 4) Motor neurons carry impulses from CNS to effectors (muscles or glands), 5) Effectors produce response. Coordination: Nervous system uses electrical impulses for rapid communication, allowing quick responses to changes in environment. Reflex arcs provide automatic responses to dangerous stimuli, bypassing conscious thought for speed.",
            markingCriteria: {
              ao1: 5,
              ao2: 3,
              ao3: 0,
              breakdown: [
                "CNS and PNS structure (2 marks)",
                "Sensory neurons detect stimuli (1 mark)",
                "CNS processes information (1 mark)",
                "Motor neurons to effectors (1 mark)",
                "Electrical impulses for rapid communication (2 marks)",
                "Reflex arcs for automatic responses (1 mark)"
              ]
            },
            specReference: "B5.1"
          }
        ]
      }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "bg-purple-500",
    topics: [
      {
        id: "atomic-structure",
        name: "Atomic Structure",
        questions: [
          {
            id: "chem-1",
            questionText: "Describe the structure of an atom, including the location and charge of protons, neutrons, and electrons.",
            marks: 5,
            modelAnswer: "An atom consists of a nucleus containing protons (positive charge) and neutrons (neutral charge). Electrons (negative charge) orbit the nucleus in shells. Protons and neutrons have similar mass, electrons have negligible mass.",
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Nucleus contains protons and neutrons (2 marks)",
                "Protons positive, neutrons neutral (1 mark)",
                "Electrons orbit nucleus, negative charge (2 marks)"
              ]
            },
            specReference: "C1.1"
          }
        ]
      }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    color: "bg-red-500",
    topics: [
      {
        id: "forces",
        name: "Forces",
        questions: [
          {
            id: "phys-1",
            questionText: "Define force and describe the effects a force can have on an object.",
            marks: 4,
            modelAnswer: "A force is a push or pull that can change the motion of an object. Effects include changing speed, direction, shape, or causing rotation.",
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                "Definition of force (1 mark)",
                "Force can change speed or direction (1 mark)",
                "Force can change shape (1 mark)",
                "Force can cause rotation (1 mark)"
              ]
            },
            specReference: "P1.1"
          }
        ]
      }
    ]
  }
];
