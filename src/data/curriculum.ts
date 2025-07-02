export interface Question {
  id: string;
  question: string;
  marks: number;
  modelAnswer: string;
  markingCriteria: {
    ao1: number;
    ao2: number;
    ao3: number;
    breakdown: string[];
  };
  specReference: string;
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: 'biology',
    name: 'Biology',
    color: 'bg-green-500',
    topics: [
      {
        id: 'b1-cell-biology',
        name: 'B1 Cell Biology',
        questions: [
          {
            id: 'b1-q1',
            question: 'Describe how the structure of a root hair cell helps it absorb water efficiently. (3 marks)',
            marks: 3,
            modelAnswer: 'The root hair cell has a large surface area due to its elongated projection, which increases the rate of water absorption. The cell wall is thin, providing a short diffusion pathway for water molecules. The cell contains many mitochondria to provide energy for active transport of mineral ions.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States large surface area',
                'AO2 (1): Explains link between structure and function',
                'AO3 (1): Links mitochondria to energy for active transport'
              ]
            },
            specReference: 'AQA Biology B1.1'
          },
          {
            id: 'b1-q2',
            question: 'Explain the process of osmosis and give an example of where it occurs in plants. (4 marks)',
            marks: 4,
            modelAnswer: 'Osmosis is the movement of water molecules from a region of high water potential to a region of low water potential through a partially permeable membrane. Water moves down its concentration gradient without requiring energy (passive process). In plants, osmosis occurs when water moves from the soil into root hair cells, as the soil has higher water potential than the cell contents.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Definition of osmosis',
                'AO1 (1): States it is a passive process',
                'AO2 (1): Application to plants',
                'AO2 (1): Explains direction of water movement'
              ]
            },
            specReference: 'AQA Biology B1.2'
          },
          {
            id: 'b1-q3',
            question: 'Compare the structure and function of prokaryotic and eukaryotic cells. (6 marks)',
            marks: 6,
            modelAnswer: 'Prokaryotic cells have no nucleus, with genetic material freely floating in the cytoplasm, while eukaryotic cells have a membrane-bound nucleus containing DNA. Prokaryotic cells lack membrane-bound organelles, whereas eukaryotic cells contain organelles like mitochondria, endoplasmic reticulum, and Golgi apparatus. Both cell types have ribosomes, but prokaryotic ribosomes are smaller (70S) compared to eukaryotic ribosomes (80S). Prokaryotic cells are typically smaller and simpler in structure, while eukaryotic cells are larger and more complex.',
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States prokaryotes have no nucleus',
                'AO1 (1): States eukaryotes have membrane-bound organelles',
                'AO1 (1): Mentions ribosomes in both',
                'AO2 (1): Compares ribosome sizes',
                'AO2 (1): Compares cell complexity',
                'AO3 (1): Links structure to function'
              ]
            },
            specReference: 'AQA Biology B1.3'
          },
          {
            id: 'b1-q4',
            question: 'Describe the process of active transport and explain why energy is required. (4 marks)',
            marks: 4,
            modelAnswer: 'Active transport is the movement of substances from a region of low concentration to a region of high concentration against the concentration gradient. This process requires energy in the form of ATP because substances are being moved against their natural tendency to diffuse. Carrier proteins in the cell membrane change shape when ATP is used, allowing specific substances to be transported across the membrane.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States movement against concentration gradient',
                'AO1 (1): States ATP is required',
                'AO2 (1): Explains why energy is needed',
                'AO2 (1): Describes role of carrier proteins'
              ]
            },
            specReference: 'AQA Biology B1.4'
          },
          {
            id: 'b1-q5',
            question: 'Explain how the structure of a leaf cell is adapted for photosynthesis. (5 marks)',
            marks: 5,
            modelAnswer: 'Leaf cells contain numerous chloroplasts containing chlorophyll to absorb light energy. The chloroplasts are mainly located in the palisade layer near the upper surface to receive maximum light. The cell has a large vacuole to maintain cell shape and structure. Stomata in the lower epidermis allow gas exchange for carbon dioxide entry and oxygen exit. The thin cell wall allows easy diffusion of gases.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States presence of chloroplasts with chlorophyll',
                'AO1 (1): Mentions stomata for gas exchange',
                'AO2 (1): Explains positioning of chloroplasts',
                'AO2 (1): Links thin cell wall to gas diffusion',
                'AO3 (1): Links structure to photosynthesis function'
              ]
            },
            specReference: 'AQA Biology B1.5'
          },
          {
            id: 'b1-q6',
            question: 'Describe the differences between animal and plant cells. (4 marks)',
            marks: 4,
            modelAnswer: 'Plant cells have a rigid cell wall made of cellulose, while animal cells only have a flexible cell membrane. Plant cells contain chloroplasts for photosynthesis, which animal cells lack. Plant cells have a large permanent vacuole, whereas animal cells may have small temporary vacuoles. Both cell types have a nucleus, cytoplasm, and mitochondria.',
            markingCriteria: {
              ao1: 3,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): States plant cells have cell wall',
                'AO1 (1): States plant cells have chloroplasts',
                'AO1 (1): States plant cells have large vacuole',
                'AO2 (1): Compares structures between cell types'
              ]
            },
            specReference: 'AQA Biology B1.6'
          },
          {
            id: 'b1-q7',
            question: 'Explain how substances move in and out of cells by diffusion. (3 marks)',
            marks: 3,
            modelAnswer: 'Diffusion is the movement of particles from an area of high concentration to an area of low concentration. This movement occurs down the concentration gradient and does not require energy (passive process). Examples include oxygen diffusing into cells and carbon dioxide diffusing out of cells.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States movement from high to low concentration',
                'AO2 (1): States it is a passive process',
                'AO3 (1): Gives relevant example'
              ]
            },
            specReference: 'AQA Biology B1.7'
          },
          {
            id: 'b1-q8',
            question: 'Describe the structure and function of mitochondria. (3 marks)',
            marks: 3,
            modelAnswer: 'Mitochondria are oval-shaped organelles with a double membrane. The inner membrane is folded to form cristae, which increase the surface area for respiration. Mitochondria are the site of aerobic respiration where glucose is broken down to release energy in the form of ATP.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Describes double membrane structure',
                'AO2 (1): Explains cristae increase surface area',
                'AO3 (1): Links to aerobic respiration function'
              ]
            },
            specReference: 'AQA Biology B1.8'
          },
          {
            id: 'b1-q9',
            question: 'Explain why cells need to be small in size. (4 marks)',
            marks: 4,
            modelAnswer: 'Small cells have a large surface area to volume ratio, which allows efficient exchange of materials across the cell membrane. As cell size increases, the volume increases faster than surface area, making it difficult for substances to reach the center of the cell quickly. Small cells can obtain nutrients and remove waste products more efficiently. Large cells would struggle to maintain adequate concentration gradients.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States surface area to volume ratio concept',
                'AO2 (1): Explains relationship between size and efficiency',
                'AO2 (1): Explains difficulty in large cells',
                'AO3 (1): Links to survival needs'
              ]
            },
            specReference: 'AQA Biology B1.9'
          },
          {
            id: 'b1-q10',
            question: 'Describe how you would use a microscope to observe plant cells. (5 marks)',
            marks: 5,
            modelAnswer: 'Place a thin section of plant tissue (such as onion epidermis) on a clean slide. Add a drop of water and place a coverslip carefully to avoid air bubbles. Start with the lowest power objective lens and use the coarse focus to get a rough image. Switch to higher magnification and use fine focus for clear detail. Ensure adequate lighting and adjust if necessary.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States use of thin tissue section',
                'AO1 (1): Mentions use of coverslip',
                'AO2 (1): Describes focusing procedure',
                'AO2 (1): Mentions starting with low power',
                'AO3 (1): Explains importance of avoiding air bubbles'
              ]
            },
            specReference: 'AQA Biology B1.10'
          }
        ]
      },
      {
        id: 'b2-organisation',
        name: 'B2 Organisation',
        questions: [
          {
            id: 'b2-q1',
            question: 'Describe the function of enzymes and explain why they are important in biological processes. (5 marks)',
            marks: 5,
            modelAnswer: 'Enzymes are biological catalysts that speed up chemical reactions by lowering the activation energy required. They have specific active sites that are complementary to their substrate molecules. Enzymes are important because they allow metabolic reactions to occur at body temperature and at a rate fast enough to sustain life. Without enzymes, reactions would be too slow to maintain cellular processes.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States enzymes are catalysts',
                'AO1 (1): Mentions active site and substrate',
                'AO2 (1): Explains lowering activation energy',
                'AO2 (1): Links to body temperature',
                'AO3 (1): Evaluates importance for life processes'
              ]
            },
            specReference: 'AQA Biology B2.1'
          },
          {
            id: 'b2-q2',
            question: 'Explain the lock and key model of enzyme action. (4 marks)',
            marks: 4,
            modelAnswer: 'The enzyme has a specific active site with a complementary shape to the substrate molecule. The substrate fits into the active site like a key fits into a lock. When the substrate binds to the active site, an enzyme-substrate complex is formed. The enzyme then catalyzes the reaction and releases the product, remaining unchanged for reuse.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States complementary shapes',
                'AO1 (1): Mentions enzyme-substrate complex',
                'AO2 (1): Explains lock and key analogy',
                'AO2 (1): States enzyme remains unchanged'
              ]
            },
            specReference: 'AQA Biology B2.2'
          },
          {
            id: 'b2-q3',
            question: 'Describe how temperature affects enzyme activity. (4 marks)',
            marks: 4,
            modelAnswer: 'As temperature increases, enzyme activity initially increases because molecules have more kinetic energy and collide more frequently. At the optimum temperature, enzyme activity is at its maximum. Beyond the optimum temperature, the enzyme begins to denature as hydrogen bonds break, causing the active site to change shape. At very high temperatures, the enzyme is completely denatured and activity stops.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States activity increases then decreases',
                'AO2 (1): Explains increased kinetic energy',
                'AO2 (1): Explains denaturation process',
                'AO3 (1): Links shape change to loss of function'
              ]
            },
            specReference: 'AQA Biology B2.3'
          },
          {
            id: 'b2-q4',
            question: 'Explain how pH affects enzyme activity. (3 marks)',
            marks: 3,
            modelAnswer: 'Each enzyme has an optimum pH at which it works best. Changes in pH can alter the shape of the active site by affecting the bonds that maintain the enzyme structure. If the pH is too high or too low, the enzyme may denature and lose its catalytic activity.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States enzymes have optimum pH',
                'AO2 (1): Explains pH affects enzyme shape',
                'AO3 (1): Links shape change to loss of activity'
              ]
            },
            specReference: 'AQA Biology B2.4'
          },
          {
            id: 'b2-q5',
            question: 'Describe the structure and function of the digestive system. (6 marks)',
            marks: 6,
            modelAnswer: 'The digestive system consists of the alimentary canal and associated organs. The mouth mechanically breaks down food and begins starch digestion with amylase. The stomach produces acid and pepsin to digest proteins. The small intestine completes digestion with enzymes from the pancreas and absorbs nutrients. The large intestine absorbs water and forms feces. The liver produces bile to emulsify fats.',
            markingCriteria: {
              ao1: 3,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): Lists main organs',
                'AO1 (1): States stomach digests proteins',
                'AO1 (1): States small intestine absorbs nutrients',
                'AO2 (1): Explains mechanical and chemical digestion',
                'AO2 (1): Explains role of bile',
                'AO3 (1): Links structure to function'
              ]
            },
            specReference: 'AQA Biology B2.5'
          },
          {
            id: 'b2-q6',
            question: 'Explain how the small intestine is adapted for absorption. (5 marks)',
            marks: 5,
            modelAnswer: 'The small intestine has villi and microvilli which greatly increase the surface area for absorption. The wall is thin (one cell thick) providing a short diffusion pathway. Each villus contains a rich blood supply to maintain concentration gradients. The villi also contain lacteal vessels for fat absorption. The epithelial cells have many mitochondria to provide energy for active transport.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States presence of villi/microvilli',
                'AO1 (1): States thin wall',
                'AO2 (1): Explains increased surface area',
                'AO2 (1): Explains blood supply role',
                'AO3 (1): Links adaptations to function'
              ]
            },
            specReference: 'AQA Biology B2.6'
          },
          {
            id: 'b2-q7',
            question: 'Describe the process of digestion of carbohydrates. (4 marks)',
            marks: 4,
            modelAnswer: 'Carbohydrate digestion begins in the mouth where amylase breaks down starch into maltose. In the small intestine, pancreatic amylase continues to break down starch. Maltase, sucrase, and lactase enzymes on the intestinal wall break down disaccharides into monosaccharides. The resulting glucose, fructose, and galactose are absorbed into the bloodstream.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States amylase breaks down starch',
                'AO1 (1): Names specific enzymes',
                'AO2 (1): Explains sequential breakdown process',
                'AO2 (1): States final products are absorbed'
              ]
            },
            specReference: 'AQA Biology B2.7'
          },
          {
            id: 'b2-q8',
            question: 'Explain how food is moved through the digestive system. (3 marks)',
            marks: 3,
            modelAnswer: 'Food moves through the digestive system by peristalsis, which involves rhythmic contractions of the smooth muscle in the gut wall. These wave-like contractions push the food along the alimentary canal. The process is involuntary and controlled by the nervous system.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Names peristalsis',
                'AO2 (1): Describes muscle contractions',
                'AO3 (1): States it is involuntary'
              ]
            },
            specReference: 'AQA Biology B2.8'
          },
          {
            id: 'b2-q9',
            question: 'Describe the role of bile in digestion. (3 marks)',
            marks: 3,
            modelAnswer: 'Bile is produced by the liver and stored in the gall bladder. It emulsifies fats, breaking large fat droplets into smaller ones to increase surface area. This allows lipase enzymes to work more efficiently in digesting fats into fatty acids and glycerol.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States bile produced by liver',
                'AO2 (1): Explains emulsification process',
                'AO3 (1): Links to improved enzyme action'
              ]
            },
            specReference: 'AQA Biology B2.9'
          },
          {
            id: 'b2-q10',
            question: 'Explain why the stomach produces hydrochloric acid. (4 marks)',
            marks: 4,
            modelAnswer: 'Hydrochloric acid creates an acidic environment with a pH of about 2. This acid kills harmful bacteria in food, preventing food poisoning. The acidic conditions provide the optimum pH for pepsin enzyme to digest proteins effectively. The acid also helps to denature proteins, making them easier to digest.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States stomach produces HCl',
                'AO2 (1): Explains kills bacteria',
                'AO2 (1): States optimum pH for pepsin',
                'AO3 (1): Links to protein digestion'
              ]
            },
            specReference: 'AQA Biology B2.10'
          }
        ]
      },
      {
        id: 'b3-infection-response',
        name: 'B3 Infection and Response',
        questions: [
          {
            id: 'b3-q1',
            question: 'Explain how white blood cells help defend the body against pathogens. (4 marks)',
            marks: 4,
            modelAnswer: 'Phagocytes engulf and digest pathogens through phagocytosis, destroying them with enzymes. Lymphocytes produce specific antibodies that bind to antigens on pathogens, marking them for destruction. Some lymphocytes become memory cells, providing long-term immunity by remembering specific pathogens for faster response in future infections.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States phagocytes engulf pathogens',
                'AO1 (1): States lymphocytes produce antibodies',
                'AO2 (1): Explains phagocytosis process',
                'AO2 (1): Explains memory cell function'
              ]
            },
            specReference: 'AQA Biology B3.1'
          },
          {
            id: 'b3-q2',
            question: 'Describe how the body prevents pathogens from entering. (4 marks)',
            marks: 4,
            modelAnswer: 'The skin acts as a physical barrier preventing pathogen entry. The respiratory system produces mucus to trap pathogens, and cilia move the mucus upward. The digestive system produces hydrochloric acid in the stomach which kills many pathogens. Tears and saliva contain enzymes like lysozyme that break down bacterial cell walls.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States skin as barrier',
                'AO1 (1): States stomach acid kills pathogens',
                'AO2 (1): Explains mucus and cilia action',
                'AO2 (1): Explains enzyme action in tears/saliva'
              ]
            },
            specReference: 'AQA Biology B3.2'
          },
          {
            id: 'b3-q3',
            question: 'Explain the difference between active and passive immunity. (5 marks)',
            marks: 5,
            modelAnswer: 'Active immunity occurs when the immune system produces its own antibodies in response to a pathogen or vaccine. This provides long-lasting protection because memory cells are formed. Passive immunity involves receiving ready-made antibodies from another source, such as from mother to baby through breast milk. Passive immunity provides immediate but temporary protection as no memory cells are produced.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States active immunity involves own antibody production',
                'AO1 (1): States passive immunity involves receiving antibodies',
                'AO2 (1): Explains memory cell formation in active immunity',
                'AO2 (1): Explains temporary nature of passive immunity',
                'AO3 (1): Compares duration of protection'
              ]
            },
            specReference: 'AQA Biology B3.3'
          },
          {
            id: 'b3-q4',
            question: 'Describe how vaccination works. (4 marks)',
            marks: 4,
            modelAnswer: 'Vaccination involves introducing dead or weakened pathogens (or their antigens) into the body. This stimulates white blood cells to produce specific antibodies without causing the disease. Memory cells are formed during this primary response. If the real pathogen enters the body later, memory cells quickly produce antibodies, providing rapid protection.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States vaccine contains dead/weakened pathogens',
                'AO1 (1): States antibodies are produced',
                'AO2 (1): Explains memory cell formation',
                'AO2 (1): Explains rapid secondary response'
              ]
            },
            specReference: 'AQA Biology B3.4'
          },
          {
            id: 'b3-q5',
            question: 'Explain how antibiotics work and why they are ineffective against viruses. (4 marks)',
            marks: 4,
            modelAnswer: 'Antibiotics work by interfering with bacterial cell processes, such as cell wall formation or protein synthesis. They target structures or processes that are specific to bacteria. Antibiotics are ineffective against viruses because viruses do not have their own cellular processes - they use the host cell\'s machinery to reproduce. Viruses lack cell walls and other bacterial structures that antibiotics target.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States antibiotics target bacterial processes',
                'AO2 (1): Explains specific bacterial targets',
                'AO2 (1): Explains viruses use host machinery',
                'AO3 (1): Links differences to antibiotic effectiveness'
              ]
            },
            specReference: 'AQA Biology B3.5'
          },
          {
            id: 'b3-q6',
            question: 'Describe what happens during an inflammatory response. (3 marks)',
            marks: 3,
            modelAnswer: 'Blood vessels near the infected area dilate, increasing blood flow and causing redness and heat. Blood vessel walls become more permeable, allowing plasma and white blood cells to move into tissues, causing swelling. White blood cells move to the infected area to fight pathogens and begin healing.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States blood vessels dilate',
                'AO2 (1): Explains increased permeability and swelling',
                'AO2 (1): Explains white blood cell movement'
              ]
            },
            specReference: 'AQA Biology B3.6'
          },
          {
            id: 'b3-q7',
            question: 'Explain how pathogens cause disease. (4 marks)',
            marks: 4,
            modelAnswer: 'Pathogens cause disease by reproducing rapidly inside the body, competing with normal cells for nutrients. Some bacteria produce toxins that damage cells and tissues directly. Viruses take over cellular machinery to reproduce, often killing the host cell in the process. The immune response to pathogens can also cause symptoms like fever and inflammation.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States pathogens reproduce rapidly',
                'AO1 (1): States some produce toxins',
                'AO2 (1): Explains competition for resources',
                'AO2 (1): Explains viral cellular damage'
              ]
            },
            specReference: 'AQA Biology B3.7'
          },
          {
            id: 'b3-q8',
            question: 'Describe the role of memory cells in immunity. (3 marks)',
            marks: 3,
            modelAnswer: 'Memory cells are formed during the primary immune response when B-lymphocytes encounter a specific antigen. They remain in the blood for many years, providing immunological memory. Upon re-exposure to the same pathogen, memory cells rapidly divide and produce antibodies, resulting in a faster and stronger secondary immune response.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States memory cells formed during primary response',
                'AO2 (1): Explains long-term persistence',
                'AO3 (1): Links to faster secondary response'
              ]
            },
            specReference: 'AQA Biology B3.8'
          },
          {
            id: 'b3-q9',
            question: 'Explain why some people are more susceptible to infections than others. (4 marks)',
            marks: 4,
            modelAnswer: 'Age affects immune system strength - very young and elderly people have weaker immune responses. Malnutrition can reduce the production of white blood cells and antibodies. Stress and lack of sleep can suppress immune function. Some people have genetic conditions that affect their immune system, making them more vulnerable to infections.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States age affects immunity',
                'AO1 (1): States malnutrition affects immunity',
                'AO2 (1): Explains reduced white blood cell production',
                'AO2 (1): Explains lifestyle factors'
              ]
            },
            specReference: 'AQA Biology B3.9'
          },
          {
            id: 'b3-q10',
            question: 'Describe how herd immunity protects populations. (4 marks)',
            marks: 4,
            modelAnswer: 'Herd immunity occurs when a large percentage of a population is immune to a disease through vaccination or previous infection. This reduces the number of susceptible individuals, making it difficult for pathogens to spread. Even unvaccinated individuals are protected because the disease cannot spread easily through the population. The threshold for herd immunity varies depending on how contagious the disease is.',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States large percentage immune',
                'AO2 (1): Explains reduced disease spread',
                'AO2 (1): Explains protection of unvaccinated',
                'AO3 (1): Links to population protection'
              ]
            },
            specReference: 'AQA Biology B3.10'
          }
        ]
      },
     {
  id: 'b4-bioenergetics',
  name: 'B4 Bioenergetics',
  questions: [
    {
      id: 'b4-q1',
      question: 'Describe the role of ATP in cellular processes. (3 marks)',
      marks: 3,
      modelAnswer: 'ATP (Adenosine Triphosphate) is a molecule that provides energy for various cellular processes. It is produced during cellular respiration and is broken down to release energy, which is then used to drive other reactions. ATP is often referred to as the \'energy currency\' of the cell.',
      markingCriteria: {
        ao1: 2,
        ao2: 1,
        ao3: 0,
        breakdown: [
          'AO1 (1): Definition of ATP',
          'AO1 (1): Role of ATP in cellular processes',
          'AO2 (1): Explanation of ATP as energy currency'
        ]
      },
      specReference: 'AQA Biology B4.1'
    },
    {
      id: 'b4-q2',
      question: 'Explain the overall process of photosynthesis, including the reactants and products. (4 marks)',
      marks: 4,
      modelAnswer: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. It converts light energy into chemical energy. The reactants are carbon dioxide and water, and the products are glucose (food) and oxygen. The overall equation is $6CO_2 + 6H_2O \\xrightarrow{light \\ energy} C_6H_{12}O_6 + 6O_2$.',
      markingCriteria: {
        ao1: 2,
        ao2: 2,
        ao3: 0,
        breakdown: [
          'AO1 (1): Defines photosynthesis as converting light to chemical energy.',
          'AO1 (1): Lists correct reactants and products.',
          'AO2 (1): Mentions chlorophyll.',
          'AO2 (1): Provides or implies the overall balanced equation.'
        ]
      },
      specReference: 'AQA Biology B4.2'
    },
    {
      id: 'b4-q3',
      question: 'Describe the inverse relationship between light intensity and the rate of photosynthesis. (3 marks)',
      marks: 3,
      modelAnswer: 'As light intensity increases, the rate of photosynthesis generally increases up to a certain point (saturation point) because more light energy is available to drive the reaction. However, beyond this point, other factors like carbon dioxide concentration or temperature become limiting, and further increases in light intensity will not increase the rate of photosynthesis. Conversely, if light intensity decreases, the rate of photosynthesis will also decrease.',
      markingCriteria: {
        ao1: 1,
        ao2: 1,
        ao3: 1,
        breakdown: [
          'AO1 (1): States direct relationship up to a point.',
          'AO2 (1): Explains why rate increases (more energy for reactions).',
          'AO3 (1): Mentions limiting factors or saturation point.'
        ]
      },
      specReference: 'AQA Biology B4.3'
    },
    {
      id: 'b4-q4',
      question: 'Explain why carbon dioxide concentration is a limiting factor for photosynthesis. (4 marks)',
      marks: 4,
      modelAnswer: 'Carbon dioxide is a reactant in photosynthesis, providing the carbon atoms needed to produce glucose. If carbon dioxide concentration is too low, even with optimal light and temperature, the rate of photosynthesis will be limited because there aren\'t enough raw materials. Increasing the carbon dioxide concentration will directly increase the rate of photosynthesis until another factor becomes limiting.',
      markingCriteria: {
        ao1: 2,
        ao2: 2,
        ao3: 0,
        breakdown: [
          'AO1 (1): States CO2 is a reactant.',
          'AO1 (1): States it provides carbon for glucose.',
          'AO2 (1): Explains low CO2 restricts glucose production.',
          'AO2 (1): Mentions it becomes limiting when other factors are optimal.'
        ]
      },
      specReference: 'AQA Biology B4.4'
    },
    {
      id: 'b4-q5',
      question: 'Describe the process of aerobic respiration, including its word equation. (5 marks)',
      marks: 5,
      modelAnswer: 'Aerobic respiration is the process of releasing energy from glucose in the presence of oxygen. It occurs primarily in the mitochondria of cells. Glucose is completely broken down to release a large amount of energy, producing carbon dioxide and water as waste products. The word equation is Glucose + Oxygen $\\rightarrow$ Carbon dioxide + Water (+ Energy).',
      markingCriteria: {
        ao1: 2,
        ao2: 2,
        ao3: 1,
        breakdown: [
          'AO1 (1): States energy release from glucose and oxygen.',
          'AO1 (1): States products are CO2 and water.',
          'AO2 (1): Mentions mitochondria as the site.',
          'AO2 (1): Explains complete breakdown and large energy release.',
          'AO3 (1): Provides the correct word equation.'
        ]
      },
      specReference: 'AQA Biology B4.5'
    },
    {
      id: 'b4-q6',
      question: 'Compare aerobic and anaerobic respiration in terms of oxygen requirement and energy yield. (4 marks)',
      marks: 4,
      modelAnswer: 'Aerobic respiration requires oxygen, whereas anaerobic respiration occurs in the absence of oxygen. Aerobic respiration produces a much larger amount of ATP (energy) per molecule of glucose because glucose is completely broken down. Anaerobic respiration, in contrast, produces far less ATP because glucose is incompletely broken down (e.g., to lactic acid in animals or ethanol and carbon dioxide in yeast).',
      markingCriteria: {
        ao1: 2,
        ao2: 2,
        ao3: 0,
        breakdown: [
          'AO1 (1): Compares oxygen requirement.',
          'AO1 (1): Compares energy yield (more vs. less ATP).',
          'AO2 (1): Explains complete vs. incomplete breakdown.',
          'AO2 (1): Mentions specific products of anaerobic respiration.'
        ]
      },
      specReference: 'AQA Biology B4.6'
    },
    {
      id: 'b4-q7',
      question: 'Describe the practical investigation to show that yeast respires anaerobically. (6 marks)',
      marks: 6,
      modelAnswer: 'Set up a boiling tube containing glucose solution and yeast. Place a layer of oil on top to prevent oxygen from entering and ensure anaerobic conditions. Connect a delivery tube from the boiling tube to another test tube containing limewater. Incubate the setup at a suitable warm temperature (e.g., 25-30°C). As yeast respires anaerobically, it produces carbon dioxide, which will bubble through the limewater, turning it cloudy, indicating CO2 production.',
      markingCriteria: {
        ao1: 3,
        ao2: 2,
        ao3: 1,
        breakdown: [
          'AO1 (1): Mentions glucose and yeast setup.',
          'AO1 (1): Mentions oil layer for anaerobic conditions.',
          'AO1 (1): Mentions limewater for CO2 detection.',
          'AO2 (1): Explains incubation at warm temperature.',
          'AO2 (1): Explains limewater turning cloudy indicates CO2.',
          'AO3 (1): Links observations to anaerobic respiration.'
        ]
      },
      specReference: 'AQA Biology B4.7'
    },
    {
      id: 'b4-q8',
      question: 'Explain what happens to lactic acid produced during anaerobic respiration in humans. (3 marks)',
      marks: 3,
      modelAnswer: 'During strenuous exercise, when oxygen supply is insufficient, muscles respire anaerobically, producing lactic acid. Lactic acid builds up in muscles, causing fatigue and an oxygen debt. After exercise, lactic acid is transported by the blood to the liver, where it is converted back into glucose or broken down with oxygen to carbon dioxide and water.',
      markingCriteria: {
        ao1: 1,
        ao2: 1,
        ao3: 1,
        breakdown: [
          'AO1 (1): States lactic acid produced in muscles during anaerobic respiration.',
          'AO2 (1): Explains transport to liver and conversion back to glucose/breakdown.',
          'AO3 (1): Links to oxygen debt or fatigue.'
        ]
      },
      specReference: 'AQA Biology B4.8'
    },
    {
      id: 'b4-q9',
      question: 'Describe how light intensity can be measured and controlled in an experiment investigating photosynthesis. (4 marks)',
      marks: 4,
      modelAnswer: 'Light intensity can be measured using a light meter. To control it, a light source can be placed at varying distances from the plant, ensuring that only light intensity changes. The inverse square law ($I \\propto 1/d^2$) can be used to calculate relative light intensity. A heat shield (e.g., a beaker of water) should be placed between the light source and the plant to prevent temperature changes from affecting the results.',
      markingCriteria: {
        ao1: 2,
        ao2: 2,
        ao3: 0,
        breakdown: [
          'AO1 (1): Mentions light meter.',
          'AO1 (1): Mentions varying distance from light source.',
          'AO2 (1): Explains use of inverse square law or heat shield.',
          'AO2 (1): Explains control for extraneous variables.'
        ]
      },
      specReference: 'AQA Biology B4.9'
    },
    {
      id: 'b4-q10',
      question: 'Explain the concept of an "oxygen debt" after intense exercise. (4 marks)',
      marks: 4,
      modelAnswer: 'An oxygen debt is the amount of extra oxygen needed after exercise to remove the accumulated lactic acid and replenish oxygen stores in the body. During intense exercise, muscles switch to anaerobic respiration, producing lactic acid. This lactic acid needs to be oxidized (broken down using oxygen) or converted back to glucose in the liver. The increased breathing rate and heart rate after exercise are mechanisms to repay this oxygen debt.',
      markingCriteria: {
        ao1: 1,
        ao2: 2,
        ao3: 1,
        breakdown: [
          'AO1 (1): Defines oxygen debt as extra oxygen needed post-exercise.',
          'AO2 (1): Explains need to break down lactic acid.',
          'AO2 (1): Mentions replenishing oxygen stores.',
          'AO3 (1): Links to increased breathing/heart rate after exercise.'
        ]
      },
      specReference: 'AQA Biology B4.10'
    }
  ]
}
  {
    id: 'maths',
    name: 'Mathematics',
    color: 'bg-blue-500',
    topics: [
      {
        id: 'm1-number',
        name: 'Number',
        questions: [
          {
            id: 'm1-q1',
            question: 'Calculate 3/4 × 2/5 and express your answer as a fraction in its simplest form. (2 marks)',
            marks: 2,
            modelAnswer: '3/4 × 2/5 = (3×2)/(4×5) = 6/20 = 3/10',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct multiplication of fractions',
                'AO2 (1): Simplifies to lowest terms'
              ]
            },
            specReference: 'AQA Maths N1.1'
          },
          {
            id: 'm1-q2',
            question: 'A shop increases all prices by 15%. If a jacket originally cost £80, what is the new price? (3 marks)',
            marks: 3,
            modelAnswer: 'Increase = 15% of £80 = 0.15 × 80 = £12. New price = £80 + £12 = £92',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts percentage to decimal',
                'AO2 (1): Calculates percentage increase',
                'AO2 (1): Adds to original price'
              ]
            },
            specReference: 'AQA Maths N1.2'
          },
          {
            id: 'm1-q3',
            question: 'Work out 2.4 ÷ 0.6. (2 marks)',
            marks: 2,
            modelAnswer: '2.4 ÷ 0.6 = 24 ÷ 6 = 4',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts to equivalent division',
                'AO2 (1): Correct answer of 4'
              ]
            },
            specReference: 'AQA Maths N1.3'
          },
          {
            id: 'm1-q4',
            question: 'Round 47.638 to 2 decimal places. (1 mark)',
            marks: 1,
            modelAnswer: '47.64',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct rounding to 47.64'
              ]
            },
            specReference: 'AQA Maths N1.4'
          },
          {
            id: 'm1-q5',
            question: 'Express 0.35 as a percentage. (1 mark)',
            marks: 1,
            modelAnswer: '35%',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct conversion to 35%'
              ]
            },
            specReference: 'AQA Maths N1.5'
          },
          {
            id: 'm1-q6',
            question: 'Calculate 5/8 + 1/4. Give your answer as a fraction in its simplest form. (3 marks)',
            marks: 3,
            modelAnswer: '1/4 = 2/8, so 5/8 + 2/8 = 7/8',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts to common denominator',
                'AO2 (1): Adds fractions correctly',
                'AO2 (1): Answer in simplest form'
              ]
            },
            specReference: 'AQA Maths N1.6'
          },
          {
            id: 'm1-q7',
            question: 'A number is decreased by 20% to give 240. What was the original number? (3 marks)',
            marks: 3,
            modelAnswer: 'If decreased by 20%, then 80% remains. 80% = 240, so 1% = 240 ÷ 80 = 3. Original number = 100% = 3 × 100 = 300',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Recognizes 80% remains',
                'AO2 (1): Sets up correct calculation',
                'AO2 (1): Correct answer of 300'
              ]
            },
            specReference: 'AQA Maths N1.7'
          },
          {
            id: 'm1-q8',
            question: 'Write 3/5 as a decimal. (1 mark)',
            marks: 1,
            modelAnswer: '0.6',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct conversion to 0.6'
              ]
            },
            specReference: 'AQA Maths N1.8'
          },
          {
            id: 'm1-q9',
            question: 'Calculate 15% of £240. (2 marks)',
            marks: 2,
            modelAnswer: '15% = 15/100 = 0.15. 0.15 × £240 = £36',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts percentage to decimal',
                'AO2 (1): Correct calculation giving £36'
              ]
            },
            specReference: 'AQA Maths N1.9'
          },
          {
            id: 'm1-q10',
            question: 'Put these numbers in order from smallest to largest: 0.3, 1/4, 30%, 0.25. (2 marks)',
            marks: 2,
            modelAnswer: 'Converting all to decimals: 0.3, 0.25, 0.3, 0.25. Order: 1/4, 0.25, 0.3, 30%',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts to common form',
                'AO2 (1): Correct order: 1/4, 0.25, 0.3, 30%'
              ]
            },
            specReference: 'AQA Maths N1.10'
          }
        ]
      },
      {
        id: 'm2-algebra',
        name: 'Algebra',
        questions: [
          {
            id: 'm2-q1',
            question: 'Solve the equation 3x + 7 = 22. (2 marks)',
            marks: 2,
            modelAnswer: '3x + 7 = 22, 3x = 22 - 7, 3x = 15, x = 5',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct rearrangement',
                'AO2 (1): Correct solution x = 5'
              ]
            },
            specReference: 'AQA Maths A1.1'
          },
          {
            id: 'm2-q2',
            question: 'Expand 3(x + 4). (1 mark)',
            marks: 1,
            modelAnswer: '3x + 12',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct expansion to 3x + 12'
              ]
            },
            specReference: 'AQA Maths A1.2'
          },
          {
            id: 'm2-q3',
            question: 'Simplify 5x + 3x - 2x. (1 mark)',
            marks: 1,
            modelAnswer: '6x',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct simplification to 6x'
              ]
            },
            specReference: 'AQA Maths A1.3'
          },
          {
            id: 'm2-q4',
            question: 'Factorise x² + 5x + 6. (2 marks)',
            marks: 2,
            modelAnswer: '(x + 2)(x + 3)',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies factors of 6 that add to 5',
                'AO2 (1): Correct factorisation (x + 2)(x + 3)'
              ]
            },
            specReference: 'AQA Maths A1.4'
          },
          {
            id: 'm2-q5',
            question: 'Solve 2x - 5 = x + 3. (3 marks)',
            marks: 3,
            modelAnswer: '2x - 5 = x + 3, 2x - x = 3 + 5, x = 8',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Collects x terms on one side',
                'AO2 (1): Collects numbers on other side',
                'AO2 (1): Correct solution x = 8'
              ]
            },
            specReference: 'AQA Maths A1.5'
          },
          {
            id: 'm2-q6',
            question: 'Expand and simplify (x + 3)(x + 2). (2 marks)',
            marks: 2,
            modelAnswer: 'x² + 2x + 3x + 6 = x² + 5x + 6',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct expansion',
                'AO2 (1): Correct simplification to x² + 5x + 6'
              ]
            },
            specReference: 'AQA Maths A1.6'
          },
          {
            id: 'm2-q7',
            question: 'Make x the subject of y = 3x + 2. (2 marks)',
            marks: 2,
            modelAnswer: 'y = 3x + 2, y - 2 = 3x, x = (y - 2)/3',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct rearrangement steps',
                'AO2 (1): Correct final form x = (y - 2)/3'
              ]
            },
            specReference: 'AQA Maths A1.7'
          },
          {
            id: 'm2-q8',
            question: 'Solve x/3 + 2 = 7. (2 marks)',
            marks: 2,
            modelAnswer: 'x/3 + 2 = 7, x/3 = 5, x = 15',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Subtracts 2 from both sides',
                'AO2 (1): Multiplies by 3 to get x = 15'
              ]
            },
            specReference: 'AQA Maths A1.8'
          },
          {
            id: 'm2-q9',
            question: 'Simplify 4x² × 3x. (1 mark)',
            marks: 1,
            modelAnswer: '12x³',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct simplification to 12x³'
              ]
            },
            specReference: 'AQA Maths A1.9'
          },
          {
            id: 'm2-q10',
            question: 'Expand 2x(3x - 4). (2 marks)',
            marks: 2,
            modelAnswer: '6x² - 8x',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Multiplies each term',
                'AO2 (1): Correct expansion 6x² - 8x'
              ]
            },
            specReference: 'AQA Maths A1.10'
          }
        ]
      },
      {
        id: 'm3-ratio-proportion',
        name: 'Ratio, Proportion and Rates of Change',
        questions: [
          {
            id: 'm3-q1',
            question: 'Share £240 in the ratio 3:2:7. (3 marks)',
            marks: 3,
            modelAnswer: 'Total parts = 3 + 2 + 7 = 12 parts. Each part = £240 ÷ 12 = £20. Shares are: 3 × £20 = £60, 2 × £20 = £40, 7 × £20 = £140',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds total number of parts',
                'AO2 (1): Calculates value of one part',
                'AO2 (1): Calculates all three shares correctly'
              ]
            },
            specReference: 'AQA Maths R1.1'
          },
          {
            id: 'm3-q2',
            question: 'The ratio of boys to girls in a class is 3:5. If there are 15 girls, how many boys are there? (2 marks)',
            marks: 2,
            modelAnswer: 'If 5 parts = 15 girls, then 1 part = 3 girls. Boys = 3 parts = 3 × 3 = 9',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds value of one part',
                'AO2 (1): Calculates number of boys = 9'
              ]
            },
            specReference: 'AQA Maths R1.2'
          },
          {
            id: 'm3-q3',
            question: 'A recipe for 4 people uses 200g flour. How much flour is needed for 6 people? (2 marks)',
            marks: 2,
            modelAnswer: 'For 1 person: 200g ÷ 4 = 50g. For 6 people: 50g × 6 = 300g',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Calculates for 1 person',
                'AO2 (1): Scales up for 6 people'
              ]
            },
            specReference: 'AQA Maths R1.3'
          },
          {
            id: 'm3-q4',
            question: 'Express the ratio 15:20 in its simplest form. (1 mark)',
            marks: 1,
            modelAnswer: '3:4',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Divides by HCF of 5 to get 3:4'
              ]
            },
            specReference: 'AQA Maths R1.4'
          },
          {
            id: 'm3-q5',
            question: 'A car travels 150 miles in 3 hours. What is its average speed? (2 marks)',
            marks: 2,
            modelAnswer: 'Speed = Distance ÷ Time = 150 ÷ 3 = 50 mph',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 50 mph'
              ]
            },
            specReference: 'AQA Maths R1.5'
          },
          {
            id: 'm3-q6',
            question: 'Convert 2.5 hours to hours and minutes. (2 marks)',
            marks: 2,
            modelAnswer: '0.5 hours = 0.5 × 60 = 30 minutes. So 2.5 hours = 2 hours 30 minutes',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts decimal to minutes',
                'AO2 (1): Correct answer 2 hours 30 minutes'
              ]
            },
            specReference: 'AQA Maths R1.6'
          },
          {
            id: 'm3-q7',
            question: 'If 5 pencils cost £3, how much do 8 pencils cost? (2 marks)',
            marks: 2,
            modelAnswer: 'Cost per pencil = £3 ÷ 5 = £0.60. Cost of 8 pencils = £0.60 × 8 = £4.80',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds unit cost',
                'AO2 (1): Calculates cost for 8 pencils'
              ]
            },
            specReference: 'AQA Maths R1.7'
          },
          {
            id: 'm3-q8',
            question: 'Express 45 minutes as a fraction of 2 hours in its simplest form. (3 marks)',
            marks: 3,
            modelAnswer: '2 hours = 120 minutes. Fraction = 45/120. Simplifying: 45/120 = 3/8',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Converts to same units',
                'AO2 (1): Forms fraction 45/120',
                'AO3 (1): Simplifies to 3/8'
              ]
            },
            specReference: 'AQA Maths R1.8'
          },
          {
            id: 'm3-q9',
            question: 'A map has a scale of 1:25000. On the map, a road is 8 cm long. What is the actual length of the road in km? (3 marks)',
            marks: 3,
            modelAnswer: 'Actual length = 8 × 25000 = 200000 cm = 2000 m = 2 km',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Uses scale correctly',
                'AO2 (1): Calculates in cm',
                'AO3 (1): Converts to km'
              ]
            },
            specReference: 'AQA Maths R1.9'
          },
          {
            id: 'm3-q10',
            question: 'The exchange rate is £1 = €1.20. How much is €90 in pounds? (2 marks)',
            marks: 2,
            modelAnswer: 'If £1 = €1.20, then €90 = £90 ÷ 1.20 = £75',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Sets up correct calculation',
                'AO2 (1): Correct answer £75'
              ]
            },
            specReference: 'AQA Maths R1.10'
          }
        ]
      },
      {
        id: 'm4-geometry-measures',
        name: 'Geometry and Measures',
        questions: [
          {
            id: 'm4-q1',
            question: 'Calculate the area of a circle with radius 6 cm. Use π = 3.14. (2 marks)',
            marks: 2,
            modelAnswer: 'Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula πr²',
                'AO2 (1): Correct substitution and calculation'
              ]
            },
            specReference: 'AQA Maths G1.1'
          },
          {
            id: 'm4-q2',
            question: 'Find the perimeter of a rectangle with length 8 cm and width 5 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Perimeter = 2(length + width) = 2(8 + 5) = 2 × 13 = 26 cm',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 26 cm'
              ]
            },
            specReference: 'AQA Maths G1.2'
          },
          {
            id: 'm4-q3',
            question: 'Calculate the area of a triangle with base 10 cm and height 6 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Area = ½ × base × height = ½ × 10 × 6 = 30 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 30 cm²'
              ]
            },
            specReference: 'AQA Maths G1.3'
          },
          {
            id: 'm4-q4',
            question: 'Find the volume of a cuboid with dimensions 4 cm × 3 cm × 5 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Volume = length × width × height = 4 × 3 × 5 = 60 cm³',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 60 cm³'
              ]
            },
            specReference: 'AQA Maths G1.4'
          },
          {
            id: 'm4-q5',
            question: 'Convert 2.5 metres to centimetres. (1 mark)',
            marks: 1,
            modelAnswer: '250 cm',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Correct conversion = 250 cm'
              ]
            },
            specReference: 'AQA Maths G1.5'
          },
          {
            id: 'm4-q6',
            question: 'Find the circumference of a circle with diameter 14 cm. Use π = 22/7. (2 marks)',
            marks: 2,
            modelAnswer: 'Circumference = πd = 22/7 × 14 = 22 × 2 = 44 cm',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula πd',
                'AO2 (1): Correct calculation = 44 cm'
              ]
            },
            specReference: 'AQA Maths G1.6'
          },
          {
            id: 'm4-q7',
            question: 'Calculate the area of a parallelogram with base 12 cm and height 8 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Area = base × height = 12 × 8 = 96 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 96 cm²'
              ]
            },
            specReference: 'AQA Maths G1.7'
          },
          {
            id: 'm4-q8',
            question: 'Find the surface area of a cube with edge length 4 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Surface area = 6 × edge² = 6 × 4² = 6 × 16 = 96 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Recognizes 6 faces',
                'AO2 (1): Correct calculation = 96 cm²'
              ]
            },
            specReference: 'AQA Maths G1.8'
          },
          {
            id: 'm4-q9',
            question: 'Convert 3 hours 45 minutes to decimal hours. (2 marks)',
            marks: 2,
            modelAnswer: '45 minutes = 45/60 = 0.75 hours. So 3 hours 45 minutes = 3.75 hours',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts minutes to decimal',
                'AO2 (1): Correct answer = 3.75 hours'
              ]
            },
            specReference: 'AQA Maths G1.9'
          },
          {
            id: 'm4-q10',
            question: 'Find the area of a trapezium with parallel sides 8 cm and 12 cm, and height 5 cm. (2 marks)',
            marks: 2,
            modelAnswer: 'Area = ½(a + b)h = ½(8 + 12) × 5 = ½ × 20 × 5 = 50 cm²',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 50 cm²'
              ]
            },
            specReference: 'AQA Maths G1.10'
          }
        ]
      },
      {
        id: 'm5-probability',
        name: 'Probability',
        questions: [
          {
            id: 'm5-q1',
            question: 'A bag contains 5 red balls and 3 blue balls. What is the probability of picking a red ball? (2 marks)',
            marks: 2,
            modelAnswer: 'Total balls = 5 + 3 = 8. Probability = Number of red balls / Total balls = 5/8',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies total number of outcomes',
                'AO2 (1): Calculates probability as 5/8'
              ]
            },
            specReference: 'AQA Maths P1.1'
          },
          {
            id: 'm5-q2',
            question: 'A fair dice is rolled. What is the probability of getting an even number? (2 marks)',
            marks: 2,
            modelAnswer: 'Even numbers: 2, 4, 6 (3 outcomes). Total outcomes = 6. Probability = 3/6 = 1/2',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies even numbers',
                'AO2 (1): Calculates probability as 1/2'
              ]
            },
            specReference: 'AQA Maths P1.2'
          },
          {
            id: 'm5-q3',
            question: 'A spinner has 4 equal sections: red, blue, green, yellow. What is the probability it does NOT land on red? (2 marks)',
            marks: 2,
            modelAnswer: 'P(red) = 1/4. P(not red) = 1 - 1/4 = 3/4',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds P(red) = 1/4',
                'AO2 (1): Uses complement rule to get 3/4'
              ]
            },
            specReference: 'AQA Maths P1.3'
          },
          {
            id: 'm5-q4',
            question: 'Two coins are flipped. What is the probability of getting two heads? (2 marks)',
            marks: 2,
            modelAnswer: 'Outcomes: HH, HT, TH, TT. P(two heads) = 1/4',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Lists all outcomes',
                'AO2 (1): Identifies probability = 1/4'
              ]
            },
            specReference: 'AQA Maths P1.4'
          },
          {
            id: 'm5-q5',
            question: 'A bag contains 10 balls: 4 red, 3 blue, 3 green. Find the probability of picking a blue or green ball. (2 marks)',
            marks: 2,
            modelAnswer: 'Blue or green balls = 3 + 3 = 6. Probability = 6/10 = 3/5',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Adds blue and green balls',
                'AO2 (1): Calculates probability = 3/5'
              ]
            },
            specReference: 'AQA Maths P1.5'
          },
          {
            id: 'm5-q6',
            question: 'A letter is chosen at random from the word MATHEMATICS. What is the probability it is the letter M? (2 marks)',
            marks: 2,
            modelAnswer: 'MATHEMATICS has 11 letters with 2 Ms. Probability = 2/11',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Counts total letters and Ms',
                'AO2 (1): Calculates probability = 2/11'
              ]
            },
            specReference: 'AQA Maths P1.6'
          },
          {
            id: 'm5-q7',
            question: 'The probability of rain tomorrow is 0.3. What is the probability it will NOT rain? (1 mark)',
            marks: 1,
            modelAnswer: '0.7',
            markingCriteria: {
              ao1: 1,
              ao2: 0,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses complement: 1 - 0.3 = 0.7'
              ]
            },
            specReference: 'AQA Maths P1.7'
          },
          {
            id: 'm5-q8',
            question: 'A card is drawn from a standard pack of 52 cards. What is the probability it is a King? (2 marks)',
            marks: 2,
            modelAnswer: 'There are 4 Kings in 52 cards. Probability = 4/52 = 1/13',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies 4 Kings',
                'AO2 (1): Simplifies to 1/13'
              ]
            },
            specReference: 'AQA Maths P1.8'
          },
          {
            id: 'm5-q9',
            question: 'A bag contains coloured counters in the ratio red:blue:green = 2:3:5. If a counter is picked at random, what is the probability it is blue? (2 marks)',
            marks: 2,
            modelAnswer: 'Total ratio parts = 2 + 3 + 5 = 10. P(blue) = 3/10',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Finds total ratio parts',
                'AO2 (1): Calculates probability = 3/10'
              ]
            },
            specReference: 'AQA Maths P1.9'
          },
          {
            id: 'm5-q10',
            question: 'Two dice are rolled. What is the probability the sum is 7? (3 marks)',
            marks: 3,
            modelAnswer: 'Ways to get 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 ways. Total outcomes = 36. Probability = 6/36 = 1/6',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Lists ways to get sum of 7',
                'AO2 (1): Identifies total outcomes = 36',
                'AO3 (1): Calculates probability = 1/6'
              ]
            },
            specReference: 'AQA Maths P1.10'
          }
        ]
      },
      {
        name: "Statistics",
        questions: [
          {
            id: "stats_1",
            question: "A bag contains 5 red balls, 3 blue balls, and 2 green balls. A ball is selected at random. What is the probability that the ball is not red?",
            options: ["1/2", "3/10", "1/5", "2/5"],
            correct: 0,
            explanation: "There are 10 balls total. 5 are red, so 5 are not red. P(not red) = 5/10 = 1/2"
          },
          {
            id: "stats_2", 
            question: "The heights of students in a class are: 160, 165, 170, 155, 175, 168, 162. What is the median height?",
            options: ["162 cm", "165 cm", "168 cm", "170 cm"],
            correct: 1,
            explanation: "First arrange in order: 155, 160, 162, 165, 168, 170, 175. The median is the middle value = 165 cm"
          },
          {
            id: "stats_3",
            question: "A fair six-sided die is rolled twice. What is the probability of getting a sum of 7?",
            options: ["1/6", "1/12", "5/36", "7/36"],
            correct: 0,
            explanation: "Ways to get sum 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 ways. Total outcomes = 36. P = 6/36 = 1/6"
          },
          {
            id: "stats_4",
            question: "The mean of 5 numbers is 12. If one number is removed, the mean of the remaining 4 numbers is 10. What was the removed number?",
            options: ["15", "18", "20", "22"],
            correct: 2,
            explanation: "Sum of 5 numbers = 5 × 12 = 60. Sum of 4 numbers = 4 × 10 = 40. Removed number = 60 - 40 = 20"
          },
          {
            id: "stats_5",
            question: "In a frequency table, the modal class has a frequency of 15 and represents ages 20-25. What can we say about this data?",
            options: ["Most people are exactly 22.5 years old", "15 people are aged between 20 and 25", "The mode is 15", "More people are in the 20-25 age group than any other group"],
            correct: 3,
            explanation: "The modal class is the group with the highest frequency, so more people are in the 20-25 age group than any other group"
          },
          {
            id: "stats_6",
            question: "Two events A and B are mutually exclusive. If P(A) = 0.3 and P(B) = 0.4, what is P(A or B)?",
            options: ["0.12", "0.58", "0.7", "1.0"],
            correct: 2,
            explanation: "For mutually exclusive events: P(A or B) = P(A) + P(B) = 0.3 + 0.4 = 0.7"
          },
          {
            id: "stats_7",
            question: "A survey shows that 60% of students like pizza and 40% like burgers. If 25% like both, what percentage like neither?",
            options: ["15%", "25%", "35%", "75%"],
            correct: 1,
            explanation: "Using Venn diagrams: Like pizza only = 35%, Like burgers only = 15%, Like both = 25%. Like neither = 100% - 35% - 15% - 25% = 25%"
          },
          {
            id: "stats_8",
            question: "The range of a data set is 24 and the smallest value is 8. What is the largest value?",
            options: ["16", "24", "32", "192"],
            correct: 2,
            explanation: "Range = Largest value - Smallest value. So 24 = Largest value - 8. Therefore Largest value = 32"
          },
          {
            id: "stats_9",
            question: "A spinner has 4 equal sections colored red, blue, green, and yellow. What is the probability of getting red on the first spin AND blue on the second spin?",
            options: ["1/2", "1/4", "1/8", "1/16"],
            correct: 3,
            explanation: "P(red on first) = 1/4, P(blue on second) = 1/4. For independent events: P(red AND blue) = 1/4 × 1/4 = 1/16"
          },
          {
            id: "stats_10",
            question: "A box plot shows Q1 = 10, Q2 = 15, Q3 = 20. What is the interquartile range (IQR)?",
            options: ["5", "10", "15", "20"],
            correct: 1,
            explanation: "IQR = Q3 - Q1 = 20 - 10 = 10"
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'bg-purple-500',
    topics: [
      {
        id: 'c1-atomic-structure',
        name: 'C1 Atomic Structure',
        questions: [
          {
            id: 'c1-q1',
            question: 'Describe the structure of an atom and explain where the mass is concentrated. (4 marks)',
            marks: 4,
            modelAnswer: 'An atom consists of a small, dense nucleus containing protons and neutrons, surrounded by electrons in energy levels or shells. The nucleus is positively charged due to protons, while electrons are negatively charged. Almost all the mass of the atom is concentrated in the nucleus because protons and neutrons are much more massive than electrons.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States nucleus contains protons and neutrons',
                'AO1 (1): States electrons are in shells around nucleus',
                'AO2 (1): Explains charges of particles',
                'AO2 (1): Explains why mass is concentrated in nucleus'
              ]
            },
            specReference: 'AQA Chemistry C1.1'
          },
          {
            id: 'c1-q2',
            question: 'An atom has 11 protons, 12 neutrons and 11 electrons. What is its mass number and atomic number? (2 marks)',
            marks: 2,
            modelAnswer: 'Atomic number = number of protons = 11. Mass number = protons + neutrons = 11 + 12 = 23',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): States atomic number = 11',
                'AO2 (1): Calculates mass number = 23'
              ]
            },
            specReference: 'AQA Chemistry C1.2'
          },
          {
            id: 'c1-q3',
            question: 'Explain what isotopes are and give an example. (3 marks)',
            marks: 3,
            modelAnswer: 'Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. They have the same atomic number but different mass numbers. Example: Carbon-12 and Carbon-14 are isotopes of carbon.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States same protons, different neutrons',
                'AO2 (1): Explains same atomic number, different mass numbers',
                'AO3 (1): Gives correct example'
              ]
            },
            specReference: 'AQA Chemistry C1.3'
          },
          {
            id: 'c1-q4',
            question: 'Describe how electrons are arranged in atoms. (3 marks)',
            marks: 3,
            modelAnswer: 'Electrons are arranged in energy levels or shells around the nucleus. The first shell can hold up to 2 electrons, the second shell can hold up to 8 electrons, and the third shell can hold up to 8 electrons. Electrons fill the innermost shell first before moving to the next shell.',
            markingCriteria: {
              ao1: 2,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): States electrons in shells/energy levels',
                'AO1 (1): States shell capacities (2, 8, 8)',
                'AO2 (1): Explains filling order'
              ]
            },
            specReference: 'AQA Chemistry C1.4'
          },
          {
            id: 'c1-q5',
            question: 'Explain why atoms are neutral overall. (2 marks)',
            marks: 2,
            modelAnswer: 'Atoms are neutral because they have equal numbers of protons and electrons. Protons have a positive charge and electrons have a negative charge, so they cancel each other out.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): States equal numbers of protons and electrons',
                'AO2 (1): Explains charges cancel out'
              ]
            },
            specReference: 'AQA Chemistry C1.5'
          },
          {
            id: 'c1-q6',
            question: 'What is the electronic configuration of sodium (atomic number 11)? (2 marks)',
            marks: 2,
            modelAnswer: '2,8,1',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies 11 electrons to arrange',
                'AO2 (1): Correct arrangement 2,8,1'
              ]
            },
            specReference: 'AQA Chemistry C1.6'
          },
          {
            id: 'c1-q7',
            question: 'Explain why the relative atomic mass of chlorine is 35.5. (3 marks)',
            marks: 3,
            modelAnswer: 'Chlorine exists as two isotopes: Cl-35 and Cl-37. The relative atomic mass is the average mass of all isotopes taking into account their relative abundance. Cl-35 is more abundant than Cl-37, giving an average of 35.5.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States chlorine has isotopes',
                'AO2 (1): Explains relative atomic mass is an average',
                'AO3 (1): Links abundance to the 35.5 value'
              ]
            },
            specReference: 'AQA Chemistry C1.7'
          },
          {
            id: 'c1-q8',
            question: 'Describe the development of atomic theory by Rutherford. (4 marks)',
            marks: 4,
            modelAnswer: 'Rutherford conducted the gold foil experiment where alpha particles were fired at thin gold foil. Most particles passed straight through, some were deflected at large angles, and a few bounced back. This showed that atoms have a small, dense, positively charged nucleus at the center, with mostly empty space around it.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Describes the gold foil experiment',
                'AO1 (1): States observations of alpha particles',
                'AO2 (1): Explains conclusion about nucleus',
                'AO2 (1): Explains atoms are mostly empty space'
              ]
            },
            specReference: 'AQA Chemistry C1.8'
          },
          {
            id: 'c1-q9',
            question: 'Explain why atoms of different elements have different properties. (3 marks)',
            marks: 3,
            modelAnswer: 'Different elements have different numbers of protons, giving them different atomic numbers. This means they have different numbers of electrons, which determines their chemical properties. The arrangement of electrons in shells affects how atoms bond and react.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States different numbers of protons',
                'AO2 (1): Links to different electron numbers',
                'AO3 (1): Links electron arrangement to properties'
              ]
            },
            specReference: 'AQA Chemistry C1.9'
          },
          {
            id: 'c1-q10',
            question: 'Calculate the number of neutrons in an atom of potassium-39. (Atomic number of potassium = 19) (2 marks)',
            marks: 2,
            modelAnswer: 'Mass number = 39, Atomic number = 19. Number of neutrons = Mass number - Atomic number = 39 - 19 = 20',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 20 neutrons'
              ]
            },
            specReference: 'AQA Chemistry C1.10'
          }
        ]
      },
      {
        id: 'c2-bonding-structure',
        name: 'C2 Bonding and Structure',
        questions: [
          {
            id: 'c2-q1',
            question: 'Explain why sodium chloride has a high melting point. (3 marks)',
            marks: 3,
            modelAnswer: 'Sodium chloride has ionic bonding between Na⁺ and Cl⁻ ions. These electrostatic forces of attraction between oppositely charged ions are very strong. A lot of energy is needed to overcome these strong ionic bonds, resulting in a high melting point.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States ionic bonding present',
                'AO2 (1): Explains strong electrostatic forces',
                'AO3 (1): Links bond strength to high melting point'
              ]
            },
            specReference: 'AQA Chemistry C2.1'
          },
          {
            id: 'c2-q2',
            question: 'Describe how ionic bonds are formed. (4 marks)',
            marks: 4,
            modelAnswer: 'Metal atoms lose electrons to form positive ions (cations). Non-metal atoms gain electrons to form negative ions (anions). The transfer of electrons allows both atoms to achieve full outer shells. Electrostatic attraction between oppositely charged ions forms the ionic bond.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States metals lose electrons',
                'AO1 (1): States non-metals gain electrons',
                'AO2 (1): Explains full outer shell achievement',
                'AO2 (1): Explains electrostatic attraction'
              ]
            },
            specReference: 'AQA Chemistry C2.2'
          },
          {
            id: 'c2-q3',
            question: 'Explain how covalent bonds are formed. (3 marks)',
            marks: 3,
            modelAnswer: 'Covalent bonds are formed when atoms share pairs of electrons. This usually occurs between non-metal atoms. The shared electrons allow both atoms to achieve full outer electron shells, making them more stable.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States electrons are shared',
                'AO2 (1): States occurs between non-metals',
                'AO3 (1): Explains stability through full shells'
              ]
            },
            specReference: 'AQA Chemistry C2.3'
          },
          {
            id: 'c2-q4',
            question: 'Compare the properties of ionic and covalent compounds. (6 marks)',
            marks: 6,
            modelAnswer: 'Ionic compounds have high melting and boiling points due to strong electrostatic forces, while covalent compounds generally have lower melting and boiling points due to weaker intermolecular forces. Ionic compounds conduct electricity when molten or dissolved because ions are free to move, but covalent compounds do not conduct electricity as they have no free charges. Ionic compounds are often soluble in water, while many covalent compounds are not.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 2,
              breakdown: [
                'AO1 (1): States melting point differences',
                'AO1 (1): States electrical conductivity differences',
                'AO2 (1): Explains ionic conductivity',
                'AO2 (1): Explains covalent non-conductivity',
                'AO3 (1): Links to bond strength',
                'AO3 (1): Explains solubility differences'
              ]
            },
            specReference: 'AQA Chemistry C2.4'
          },
          {
            id: 'c2-q5',
            question: 'Describe the structure of diamond and explain its properties. (5 marks)',
            marks: 5,
            modelAnswer: 'Diamond has a giant covalent structure where each carbon atom is bonded to four other carbon atoms in a tetrahedral arrangement. All bonds are strong covalent bonds. This makes diamond very hard and gives it a high melting point. Diamond does not conduct electricity because all electrons are involved in bonding and cannot move freely.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): States giant covalent structure',
                'AO1 (1): States 4 bonds per carbon atom',
                'AO2 (1): Explains hardness',
                'AO2 (1): Explains electrical properties',
                'AO3 (1): Links structure to properties'
              ]
            },
            specReference: 'AQA Chemistry C2.5'
          },
          {
            id: 'c2-q6',
            question: 'Explain why graphite can conduct electricity but diamond cannot. (4 marks)',
            marks: 4,
            modelAnswer: 'In graphite, each carbon atom is bonded to only three other carbon atoms, leaving one electron free to move. These delocalized electrons can carry electric current. In diamond, each carbon atom is bonded to four other carbon atoms, so all electrons are involved in bonding and cannot move freely.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States graphite has 3 bonds per carbon',
                'AO1 (1): States diamond has 4 bonds per carbon',
                'AO2 (1): Explains delocalized electrons in graphite',
                'AO2 (1): Explains all electrons bonded in diamond'
              ]
            },
            specReference: 'AQA Chemistry C2.6'
          },
          {
            id: 'c2-q7',
            question: 'Describe the bonding in metals and explain their properties. (5 marks)',
            marks: 5,
            modelAnswer: 'Metals have metallic bonding where positive metal ions are held together by a sea of delocalized electrons. The electrons are free to move throughout the structure. This explains why metals conduct electricity and heat well. The strong metallic bonds make metals malleable and ductile, as layers can slide over each other without breaking bonds.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): Describes sea of electrons',
                'AO1 (1): States electrons are delocalized',
                'AO2 (1): Explains electrical conductivity',
                'AO2 (1): Explains malleability',
                'AO3 (1): Links structure to properties'
              ]
            },
            specReference: 'AQA Chemistry C2.7'
          },
          {
            id: 'c2-q8',
            question: 'Explain what is meant by a polymer and give an example. (3 marks)',
            marks: 3,
            modelAnswer: 'A polymer is a large molecule made up of many repeating units called monomers joined together by covalent bonds. The process of joining monomers is called polymerization. Example: polyethene is made from ethene monomers.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States polymer made of repeating units',
                'AO2 (1): Mentions monomers and polymerization',
                'AO3 (1): Gives correct example'
              ]
            },
            specReference: 'AQA Chemistry C2.8'
          },
          {
            id: 'c2-q9',
            question: 'Describe the structure and properties of simple molecular compounds. (4 marks)',
            marks: 4,
            modelAnswer: 'Simple molecular compounds consist of small molecules held together by covalent bonds within molecules and weak intermolecular forces between molecules. They have low melting and boiling points because little energy is needed to overcome the weak intermolecular forces. They do not conduct electricity because they have no free electrons or ions.',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): States covalent bonds within molecules',
                'AO1 (1): States weak forces between molecules',
                'AO2 (1): Explains low melting/boiling points',
                'AO2 (1): Explains non-conductivity'
              ]
            },
            specReference: 'AQA Chemistry C2.9'
          },
          {
            id: 'c2-q10',
            question: 'Explain why ionic compounds conduct electricity when molten but not when solid. (3 marks)',
            marks: 3,
            modelAnswer: 'In solid ionic compounds, the ions are held in fixed positions in the crystal lattice and cannot move. When molten, the ionic bonds are broken and the ions become free to move. Moving ions can carry electric current, so molten ionic compounds conduct electricity.',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): States ions fixed in solid',
                'AO2 (1): States ions free when molten',
                'AO3 (1): Links moving ions to conductivity'
              ]
            },
            specReference: 'AQA Chemistry C2.10'
          }
        ]
      },
      {
        id: 'c3-quantitative-chemistry',
        name: 'C3 Quantitative Chemistry',
        questions: [
          {
            id: 'c3-q1',
            question: 'Calculate the relative formula mass of calcium carbonate (CaCO₃). [Ar: Ca = 40, C = 12, O = 16] (2 marks)',
            marks: 2,
            modelAnswer: 'Mr of CaCO₃ = 40 + 12 + (3 × 16) = 40 + 12 + 48 = 100',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Identifies atoms in formula',
                'AO2 (1): Correct calculation = 100'
              ]
            },
            specReference: 'AQA Chemistry C3.1'
          },
          {
            id: 'c3-q2',
            question: 'How many moles are in 88g of carbon dioxide (CO₂)? [Ar: C = 12, O = 16] (3 marks)',
            marks: 3,
            modelAnswer: 'Mr of CO₂ = 12 + (2 × 16) = 44. Number of moles = mass ÷ Mr = 88 ÷ 44 = 2 moles',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 0,
              breakdown: [
                'AO1 (1): Calculates Mr of CO₂ = 44',
                'AO2 (1): Uses correct formula',
                'AO2 (1): Correct answer = 2 moles'
              ]
            },
            specReference: 'AQA Chemistry C3.2'
          },
          {
            id: 'c3-q3',
            question: 'What mass of oxygen is needed to react completely with 24g of magnesium? Mg + ½O₂ → MgO [Ar: Mg = 24, O = 16] (4 marks)',
            marks: 4,
            modelAnswer: 'Moles of Mg = 24 ÷ 24 = 1 mole. From equation: 1 mole Mg reacts with 0.5 moles O₂. Mr of O₂ = 32. Mass of O₂ = 0.5 × 32 = 16g',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): Calculates moles of Mg',
                'AO2 (1): Uses molar ratio from equation',
                'AO2 (1): Calculates mass of O₂',
                'AO3 (1): Correct final answer = 16g'
              ]
            },
            specReference: 'AQA Chemistry C3.3'
          },
          {
            id: 'c3-q4',
            question: 'Calculate the percentage by mass of carbon in methane (CH₄). [Ar: C = 12, H = 1] (3 marks)',
            marks: 3,
            modelAnswer: 'Mr of CH₄ = 12 + (4 × 1) = 16. Mass of carbon = 12. Percentage = (12 ÷ 16) × 100 = 75%',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Calculates Mr of CH₄',
                'AO2 (1): Uses percentage formula',
                'AO3 (1): Correct answer = 75%'
              ]
            },
            specReference: 'AQA Chemistry C3.4'
          },
          {
            id: 'c3-q5',
            question: 'What volume of hydrogen gas is produced when 0.1 moles of zinc react with hydrochloric acid? Zn + 2HCl → ZnCl₂ + H₂ [1 mole of gas occupies 24 dm³ at room temperature] (3 marks)',
            marks: 3,
            modelAnswer: 'From equation: 1 mole Zn produces 1 mole H₂. So 0.1 moles Zn produces 0.1 moles H₂. Volume = 0.1 × 24 = 2.4 dm³',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 1,
              breakdown: [
                'AO1 (1): Uses molar ratio from equation',
                'AO2 (1): Calculates moles of H₂',
                'AO3 (1): Converts to volume = 2.4 dm³'
              ]
            },
            specReference: 'AQA Chemistry C3.5'
          },
          {
            id: 'c3-q6',
            question: 'Calculate the empirical formula of a compound containing 40% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. [Ar: C = 12, H = 1, O = 16] (5 marks)',
            marks: 5,
            modelAnswer: 'C: 40 ÷ 12 = 3.33; H: 6.7 ÷ 1 = 6.7; O: 53.3 ÷ 16 = 3.33. Divide by smallest: C: 3.33 ÷ 3.33 = 1; H: 6.7 ÷ 3.33 = 2; O: 3.33 ÷ 3.33 = 1. Empirical formula = CH₂O',
            markingCriteria: {
              ao1: 2,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): Converts percentages to moles',
                'AO1 (1): Divides by smallest number',
                'AO2 (1): Shows working clearly',
                'AO2 (1): Gets simple whole number ratio',
                'AO3 (1): Correct empirical formula CH₂O'
              ]
            },
            specReference: 'AQA Chemistry C3.6'
          },
          {
            id: 'c3-q7',
            question: 'What is the concentration in g/dm³ of a solution made by dissolving 20g of sodium chloride in 500 cm³ of water? (2 marks)',
            marks: 2,
            modelAnswer: 'Volume = 500 cm³ = 0.5 dm³. Concentration = mass ÷ volume = 20 ÷ 0.5 = 40 g/dm³',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Converts volume to dm³',
                'AO2 (1): Calculates concentration = 40 g/dm³'
              ]
            },
            specReference: 'AQA Chemistry C3.7'
          },
          {
            id: 'c3-q8',
            question: 'Calculate the atom economy for the production of hydrogen in the reaction: Zn + 2HCl → ZnCl₂ + H₂ [Ar: Zn = 65, H = 1, Cl = 35.5] (4 marks)',
            marks: 4,
            modelAnswer: 'Mr of desired product (H₂) = 2. Mr of all products = 136 + 2 = 138. Atom economy = (2 ÷ 138) × 100 = 1.45%',
            markingCriteria: {
              ao1: 1,
              ao2: 2,
              ao3: 1,
              breakdown: [
                'AO1 (1): Identifies desired product',
                'AO2 (1): Calculates Mr of products',
                'AO2 (1): Uses atom economy formula',
                'AO3 (1): Correct answer = 1.45%'
              ]
            },
            specReference: 'AQA Chemistry C3.8'
          },
          {
            id: 'c3-q9',
            question: 'A reaction has a theoretical yield of 50g but only produces 40g of product. What is the percentage yield? (2 marks)',
            marks: 2,
            modelAnswer: 'Percentage yield = (actual yield ÷ theoretical yield) × 100 = (40 ÷ 50) × 100 = 80%',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct formula',
                'AO2 (1): Correct calculation = 80%'
              ]
            },
            specReference: 'AQA Chemistry C3.9'
          },
          {
            id: 'c3-q10',
            question: 'How many molecules are in 0.5 moles of water? [Avogadro constant = 6.02 × 10²³ mol⁻¹] (2 marks)',
            marks: 2,
            modelAnswer: 'Number of molecules = moles × Avogadro constant = 0.5 × 6.02 × 10²³ = 3.01 × 10²³',
            markingCriteria: {
              ao1: 1,
              ao2: 1,
              ao3: 0,
              breakdown: [
                'AO1 (1): Uses correct relationship',
                'AO2 (1): Correct calculation = 3.01 × 10²³'
              ]
            },
            specReference: 'AQA Chemistry C3.10'
          }
        ]
      }
    ]
  }
];
