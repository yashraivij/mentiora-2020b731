
export interface Question {
  id: string;
  question: string;
  answer: string;
  options?: string[];
  difficulty: "easy" | "medium" | "hard";
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
    id: "web_dev",
    name: "Web Development",
    color: "bg-blue-500",
    topics: [
      {
        id: "html",
        name: "HTML",
        questions: [
          {
            id: "html_1",
            question: "What does HTML stand for?",
            answer: "HyperText Markup Language",
            difficulty: "easy",
          },
          {
            id: "html_2",
            question: "What is the purpose of HTML?",
            answer: "To define the structure of a web page",
            difficulty: "easy",
          },
          {
            id: "html_3",
            question: "What is the root element of an HTML page?",
            answer: "<html>",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "data_science",
    name: "Data Science",
    color: "bg-green-500",
    topics: [
      {
        id: "python",
        name: "Python",
        questions: [
          {
            id: "python_1",
            question: "What is Python?",
            answer: "A high-level programming language",
            difficulty: "easy",
          },
          {
            id: "python_2",
            question: "What is the purpose of Python?",
            answer: "To write code for various applications",
            difficulty: "easy",
          },
          {
            id: "python_3",
            question: "What is a variable in Python?",
            answer: "A named storage location in memory",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "mobile_dev",
    name: "Mobile Development",
    color: "bg-purple-500",
    topics: [
      {
        id: "react_native",
        name: "React Native",
        questions: [
          {
            id: "react_native_1",
            question: "What is React Native?",
            answer: "A framework for building native mobile apps with React",
            difficulty: "easy",
          },
          {
            id: "react_native_2",
            question: "What is the purpose of React Native?",
            answer: "To build mobile apps for iOS and Android",
            difficulty: "easy",
          },
          {
            id: "react_native_3",
            question: "What is a component in React Native?",
            answer: "A reusable UI element",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    color: "bg-orange-500",
    topics: [
      {
        id: "docker",
        name: "Docker",
        questions: [
          {
            id: "docker_1",
            question: "What is Docker?",
            answer: "A platform for containerizing applications",
            difficulty: "easy",
          },
          {
            id: "docker_2",
            question: "What is the purpose of Docker?",
            answer: "To package and run applications in containers",
            difficulty: "easy",
          },
          {
            id: "docker_3",
            question: "What is a Docker image?",
            answer: "A read-only template for creating containers",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    color: "bg-red-500",
    topics: [
      {
        id: "network_security",
        name: "Network Security",
        questions: [
          {
            id: "network_security_1",
            question: "What is network security?",
            answer: "The process of protecting computer networks from unauthorized access",
            difficulty: "easy",
          },
          {
            id: "network_security_2",
            question: "What is a firewall?",
            answer: "A network security system that controls incoming and outgoing network traffic",
            difficulty: "easy",
          },
          {
            id: "network_security_3",
            question: "What is a VPN?",
            answer: "A virtual private network that creates a secure connection over a public network",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "machine_learning",
    name: "Machine Learning",
    color: "bg-indigo-500",
    topics: [
      {
        id: "supervised_learning",
        name: "Supervised Learning",
        questions: [
          {
            id: "supervised_learning_1",
            question: "What is supervised learning?",
            answer: "A type of machine learning where the model is trained on labeled data",
            difficulty: "easy",
          },
          {
            id: "supervised_learning_2",
            question: "What is a classification model?",
            answer: "A model that predicts a category",
            difficulty: "easy",
          },
          {
            id: "supervised_learning_3",
            question: "What is a regression model?",
            answer: "A model that predicts a continuous value",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "blockchain",
    name: "Blockchain",
    color: "bg-yellow-500",
    topics: [
      {
        id: "cryptocurrency",
        name: "Cryptocurrency",
        questions: [
          {
            id: "cryptocurrency_1",
            question: "What is cryptocurrency?",
            answer: "A digital or virtual currency that uses cryptography for security",
            difficulty: "easy",
          },
          {
            id: "cryptocurrency_2",
            question: "What is Bitcoin?",
            answer: "A decentralized digital currency",
            difficulty: "easy",
          },
          {
            id: "cryptocurrency_3",
            question: "What is Ethereum?",
            answer: "A decentralized platform that runs smart contracts",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "game_dev",
    name: "Game Development",
    color: "bg-pink-500",
    topics: [
      {
        id: "unity",
        name: "Unity",
        questions: [
          {
            id: "unity_1",
            question: "What is Unity?",
            answer: "A cross-platform game engine",
            difficulty: "easy",
          },
          {
            id: "unity_2",
            question: "What is the purpose of Unity?",
            answer: "To create video games for various platforms",
            difficulty: "easy",
          },
          {
            id: "unity_3",
            question: "What is a scene in Unity?",
            answer: "A container for game objects",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "ui_ux_design",
    name: "UI/UX Design",
    color: "bg-teal-500",
    topics: [
      {
        id: "user_interface",
        name: "User Interface",
        questions: [
          {
            id: "user_interface_1",
            question: "What is a user interface?",
            answer: "The means by which a user interacts with a computer system",
            difficulty: "easy",
          },
          {
            id: "user_interface_2",
            question: "What is a wireframe?",
            answer: "A low-fidelity visual representation of a user interface",
            difficulty: "easy",
          },
          {
            id: "user_interface_3",
            question: "What is a mockup?",
            answer: "A high-fidelity visual representation of a user interface",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "cloud_computing",
    name: "Cloud Computing",
    color: "bg-cyan-500",
    topics: [
      {
        id: "aws",
        name: "AWS",
        questions: [
          {
            id: "aws_1",
            question: "What is AWS?",
            answer: "A cloud computing platform",
            difficulty: "easy",
          },
          {
            id: "aws_2",
            question: "What is EC2?",
            answer: "A virtual server in the cloud",
            difficulty: "easy",
          },
          {
            id: "aws_3",
            question: "What is S3?",
            answer: "A storage service in the cloud",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    color: "bg-green-600",
    topics: [
      {
        id: "cells",
        name: "Cells",
        questions: [
          {
            id: "cell_1",
            question: "What is the basic unit of life?",
            answer: "Cell",
            difficulty: "easy",
          },
          {
            id: "cell_2",
            question: "What are the main parts of a cell?",
            answer: "Nucleus, cytoplasm, and cell membrane",
            difficulty: "medium",
          },
          {
            id: "cell_3",
            question: "What is the function of the nucleus?",
            answer: "To control the cell's activities",
            difficulty: "medium",
          },
        ],
      },
      {
        id: "genetics",
        name: "Genetics",
        questions: [
          {
            id: "genetics_1",
            question: "What is a gene?",
            answer: "A unit of heredity",
            difficulty: "easy",
          },
          {
            id: "genetics_2",
            question: "What is DNA?",
            answer: "Deoxyribonucleic acid",
            difficulty: "medium",
          },
          {
            id: "genetics_3",
            question: "What is the function of DNA?",
            answer: "To carry genetic information",
            difficulty: "medium",
          },
        ],
      },
      {
        id: "evolution",
        name: "Evolution",
        questions: [
          {
            id: "evolution_1",
            question: "What is evolution?",
            answer: "The process of change in the characteristics of a species over several generations",
            difficulty: "medium",
          },
          {
            id: "evolution_2",
            question: "What is natural selection?",
            answer: "The process by which organisms better adapted to their environment tend to survive and reproduce more",
            difficulty: "medium",
          },
          {
            id: "evolution_3",
            question: "Who proposed the theory of evolution by natural selection?",
            answer: "Charles Darwin",
            difficulty: "medium",
          },
        ],
      },
      {
        id: "bioenergetics",
        name: "Bioenergetics",
        questions: [
          {
            id: "bio_energy_1",
            question: "What is the primary purpose of cellular respiration?",
            answer: "To release energy from glucose for cellular processes",
            options: [
              "To release energy from glucose for cellular processes",
              "To produce glucose from carbon dioxide",
              "To eliminate waste products from cells",
              "To maintain cell membrane structure",
            ],
            difficulty: "medium",
          },
          {
            id: "bio_energy_2",
            question: "Which organelle is primarily responsible for photosynthesis?",
            answer: "Chloroplasts",
            options: ["Mitochondria", "Chloroplasts", "Ribosomes", "Nucleus"],
            difficulty: "easy",
          },
          {
            id: "bio_energy_3",
            question: "What is the balanced equation for photosynthesis?",
            answer: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
            options: [
              "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
              "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP",
              "CO₂ + H₂O → glucose + oxygen",
              "glucose + oxygen → CO₂ + H₂O + energy",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "homeostasis_response",
        name: "Homeostasis and Response",
        questions: [
          {
            id: "homeo_1",
            question: "What is homeostasis?",
            answer: "The maintenance of a stable internal environment",
            options: [
              "The maintenance of a stable internal environment",
              "The response to external stimuli",
              "The process of cell division",
              "The breakdown of nutrients",
            ],
            difficulty: "easy",
          },
          {
            id: "homeo_2",
            question: "Which system coordinates responses in mammals?",
            answer: "Nervous system and endocrine system",
            options: [
              "Digestive system",
              "Respiratory system",
              "Nervous system and endocrine system",
              "Circulatory system only",
            ],
            difficulty: "medium",
          },
          {
            id: "homeo_3",
            question: "What happens when body temperature rises above normal?",
            answer: "Sweating increases and blood vessels dilate",
            options: [
              "Shivering occurs",
              "Blood vessels constrict",
              "Sweating increases and blood vessels dilate",
              "Metabolic rate decreases",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "inheritance_variation_evolution",
        name: "Inheritance, Variation, Evolution",
        questions: [
          {
            id: "inherit_1",
            question: "What is a gene?",
            answer: "A section of DNA that codes for a specific characteristic",
            options: [
              "A type of chromosome",
              "A section of DNA that codes for a specific characteristic",
              "A complete set of genetic information",
              "A reproductive cell",
            ],
            difficulty: "easy",
          },
          {
            id: "inherit_2",
            question: "What is natural selection?",
            answer:
              "The process by which organisms with favorable traits survive and reproduce",
            options: [
              "Random genetic changes",
              "The process by which organisms with favorable traits survive and reproduce",
              "Artificial breeding by humans",
              "The creation of new species",
            ],
            difficulty: "medium",
          },
          {
            id: "inherit_3",
            question: "What causes variation in offspring?",
            answer: "Sexual reproduction and mutations",
            options: [
              "Only environmental factors",
              "Sexual reproduction and mutations",
              "Only genetic factors",
              "Age of the parents",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "ecology",
        name: "Ecology",
        questions: [
          {
            id: "eco_1",
            question: "What is an ecosystem?",
            answer: "A community of organisms and their physical environment",
            options: [
              "A single species population",
              "A community of organisms and their physical environment",
              "Only the living organisms in an area",
              "Only the physical environment",
            ],
            difficulty: "easy",
          },
          {
            id: "eco_2",
            question: "What are producers in a food chain?",
            answer: "Organisms that make their own food through photosynthesis",
            options: [
              "Animals that hunt other animals",
              "Organisms that break down dead material",
              "Organisms that make their own food through photosynthesis",
              "Animals that eat plants",
            ],
            difficulty: "easy",
          },
          {
            id: "eco_3",
            question: "What happens to energy as it moves through a food chain?",
            answer: "It decreases at each level",
            options: [
              "It increases at each level",
              "It stays the same",
              "It decreases at each level",
              "It disappears completely",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "biology_key_ideas",
        name: "Key Ideas",
        questions: [
          {
            id: "bio_key_1",
            question: "What are the characteristics of living organisms?",
            answer:
              "Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition",
            options: [
              "Movement, respiration, sensitivity, growth, reproduction, excretion, nutrition",
              "Only growth and reproduction",
              "Movement and response only",
              "Breathing and eating only",
            ],
            difficulty: "medium",
          },
          {
            id: "bio_key_2",
            question: "What is the basic unit of life?",
            answer: "Cell",
            options: ["Atom", "Molecule", "Cell", "Tissue"],
            difficulty: "easy",
          },
          {
            id: "bio_key_3",
            question: "What is biodiversity?",
            answer: "The variety of life forms in an ecosystem",
            options: [
              "The number of animals in an area",
              "The variety of life forms in an ecosystem",
              "The size of an ecosystem",
              "The age of species",
            ],
            difficulty: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "bg-blue-600",
    topics: [
      {
        id: "atoms",
        name: "Atoms",
        questions: [
          {
            id: "atom_1",
            question: "What is an atom?",
            answer: "The smallest unit of matter that retains the chemical properties of an element",
            difficulty: "easy",
          },
          {
            id: "atom_2",
            question: "What are the main parts of an atom?",
            answer: "Protons, neutrons, and electrons",
            difficulty: "medium",
          },
          {
            id: "atom_3",
            question: "What is the charge of a proton?",
            answer: "Positive",
            difficulty: "easy",
          },
        ],
      },
      {
        id: "chemical_reactions",
        name: "Chemical Reactions",
        questions: [
          {
            id: "reaction_1",
            question: "What is a chemical reaction?",
            answer: "A process that involves the rearrangement of atoms and molecules",
            difficulty: "easy",
          },
          {
            id: "reaction_2",
            question: "What is a reactant?",
            answer: "A substance that takes part in and undergoes change during a reaction",
            difficulty: "medium",
          },
          {
            id: "reaction_3",
            question: "What is a product?",
            answer: "A substance that is formed as the result of a chemical reaction",
            difficulty: "medium",
          },
        ],
      },
      {
        id: "acids_and_bases",
        name: "Acids and Bases",
        questions: [
          {
            id: "acid_base_1",
            question: "What is an acid?",
            answer: "A substance that donates protons or accepts electrons",
            difficulty: "medium",
          },
          {
            id: "acid_base_2",
            question: "What is a base?",
            answer: "A substance that accepts protons or donates electrons",
            difficulty: "medium",
          },
          {
            id: "acid_base_3",
            question: "What is pH?",
            answer: "A measure of the acidity or basicity of a solution",
            difficulty: "medium",
          },
        ],
      },
      {
        id: "chemical_changes",
        name: "Chemical Changes",
        questions: [
          {
            id: "chem_change_1",
            question: "What is a chemical reaction?",
            answer:
              "A process where substances are changed into different substances",
            options: [
              "A physical change in appearance",
              "A process where substances are changed into different substances",
              "A change in temperature only",
              "A change in state of matter",
            ],
            difficulty: "easy",
          },
          {
            id: "chem_change_2",
            question: "What type of reaction is: 2Mg + O₂ → 2MgO?",
            answer: "Oxidation reaction",
            options: [
              "Decomposition reaction",
              "Oxidation reaction",
              "Displacement reaction",
              "Neutralization reaction",
            ],
            difficulty: "medium",
          },
          {
            id: "chem_change_3",
            question: "What happens during a neutralization reaction?",
            answer: "An acid reacts with a base to form salt and water",
            options: [
              "Two metals react together",
              "An acid reacts with a base to form salt and water",
              "A compound breaks down into elements",
              "Oxygen is removed from a compound",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "energy_changes",
        name: "Energy Changes",
        questions: [
          {
            id: "energy_1",
            question: "What is an exothermic reaction?",
            answer: "A reaction that releases energy to the surroundings",
            options: [
              "A reaction that absorbs energy from surroundings",
              "A reaction that releases energy to the surroundings",
              "A reaction with no energy change",
              "A reaction that only occurs at high temperature",
            ],
            difficulty: "easy",
          },
          {
            id: "energy_2",
            question: "Which is an example of an endothermic reaction?",
            answer: "Photosynthesis",
            options: [
              "Combustion of methane",
              "Neutralization of acid and base",
              "Photosynthesis",
              "Respiration",
            ],
            difficulty: "medium",
          },
          {
            id: "energy_3",
            question: "What happens to temperature in an exothermic reaction?",
            answer: "Temperature increases",
            options: [
              "Temperature decreases",
              "Temperature increases",
              "Temperature stays the same",
              "Temperature fluctuates randomly",
            ],
            difficulty: "easy",
          },
        ],
      },
      {
        id: "rate_extent_chemical_change",
        name: "The Rate and Extent of Chemical Change",
        questions: [
          {
            id: "rate_1",
            question: "What factors affect the rate of a chemical reaction?",
            answer: "Temperature, concentration, surface area, and catalysts",
            options: [
              "Only temperature",
              "Temperature, concentration, surface area, and catalysts",
              "Only concentration",
              "Only the presence of catalysts",
            ],
            difficulty: "medium",
          },
          {
            id: "rate_2",
            question: "What is a catalyst?",
            answer: "A substance that speeds up a reaction without being consumed",
            options: [
              "A substance that slows down reactions",
              "A substance that speeds up a reaction without being consumed",
              "A reactant in the chemical equation",
              "A product of the reaction",
            ],
            difficulty: "easy",
          },
          {
            id: "rate_3",
            question: "How does increasing temperature affect reaction rate?",
            answer: "It increases the reaction rate",
            options: [
              "It decreases the reaction rate",
              "It increases the reaction rate",
              "It has no effect",
              "It stops the reaction",
            ],
            difficulty: "easy",
          },
        ],
      },
      {
        id: "organic_chemistry",
        name: "Organic Chemistry",
        questions: [
          {
            id: "organic_1",
            question: "What is organic chemistry?",
            answer: "The study of carbon-based compounds",
            options: [
              "The study of all chemical reactions",
              "The study of carbon-based compounds",
              "The study of metals only",
              "The study of acids and bases",
            ],
            difficulty: "easy",
          },
          {
            id: "organic_2",
            question: "What is the general formula for alkanes?",
            answer: "CₙH₂ₙ₊₂",
            options: ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙH₄ₙ"],
            difficulty: "medium",
          },
          {
            id: "organic_3",
            question: "What type of reaction is used to make polymers?",
            answer: "Polymerization",
            options: ["Combustion", "Polymerization", "Neutralization", "Oxidation"],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "chemical_analysis",
        name: "Chemical Analysis",
        questions: [
          {
            id: "analysis_1",
            question: "What is a flame test used for?",
            answer: "To identify metal ions by their flame color",
            options: [
              "To measure temperature",
              "To identify metal ions by their flame color",
              "To test for acids",
              "To measure concentration",
            ],
            difficulty: "easy",
          },
          {
            id: "analysis_2",
            question: "What color flame does sodium produce?",
            answer: "Yellow",
            options: ["Red", "Blue", "Yellow", "Green"],
            difficulty: "easy",
          },
          {
            id: "analysis_3",
            question: "What is chromatography used for?",
            answer: "To separate and identify components in a mixture",
            options: [
              "To heat substances",
              "To separate and identify components in a mixture",
              "To measure mass",
              "To change the state of matter",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "chemistry_atmosphere",
        name: "Chemistry of the Atmosphere",
        questions: [
          {
            id: "atmos_1",
            question: "What percentage of the atmosphere is nitrogen?",
            answer: "78%",
            options: ["21%", "78%", "1%", "50%"],
            difficulty: "easy",
          },
          {
            id: "atmos_2",
            question: "What causes acid rain?",
            answer: "Sulfur dioxide and nitrogen oxides in the atmosphere",
            options: [
              "Carbon dioxide only",
              "Sulfur dioxide and nitrogen oxides in the atmosphere",
              "Water vapor",
              "Oxygen",
            ],
            difficulty: "medium",
          },
          {
            id: "atmos_3",
            question: "What is the greenhouse effect?",
            answer:
              "The trapping of heat in Earth's atmosphere by greenhouse gases",
            options: [
              "The cooling of Earth's surface",
              "The trapping of heat in Earth's atmosphere by greenhouse gases",
              "The depletion of the ozone layer",
              "The formation of clouds",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "using_resources",
        name: "Using Resources",
        questions: [
          {
            id: "resources_1",
            question: "Why is recycling important?",
            answer: "It conserves natural resources and reduces waste",
            options: [
              "It makes products more expensive",
              "It conserves natural resources and reduces waste",
              "It uses more energy",
              "It creates more pollution",
            ],
            difficulty: "easy",
          },
          {
            id: "resources_2",
            question: "What is sustainable development?",
            answer: "Meeting current needs without compromising future generations",
            options: [
              "Using all resources as quickly as possible",
              "Meeting current needs without compromising future generations",
              "Only using renewable resources",
              "Avoiding all industrial processes",
            ],
            difficulty: "medium",
          },
          {
            id: "resources_3",
            question: "What is the main advantage of renewable resources?",
            answer: "They can be replenished naturally",
            options: [
              "They are always cheaper",
              "They can be replenished naturally",
              "They are easier to extract",
              "They never run out immediately",
            ],
            difficulty: "medium",
          },
        ],
      },
      {
        id: "chemistry_key_ideas",
        name: "Key Ideas",
        questions: [
          {
            id: "chem_key_1",
            question: "What is the atomic number?",
            answer: "The number of protons in an atom's nucleus",
            options: [
              "The number of electrons in an atom",
              "The number of protons in an atom's nucleus",
              "The total number of particles in an atom",
              "The number of neutrons in an atom",
            ],
            difficulty: "easy",
          },
          {
            id: "chem_key_2",
            question: "What is the periodic table organized by?",
            answer: "Atomic number",
            options: [
              "Atomic mass",
              "Atomic number",
              "Number of electrons",
              "Alphabetical order",
            ],
            difficulty: "easy",
          },
          {
            id: "chem_key_3",
            question: "What determines the chemical properties of an element?",
            answer: "The number of electrons in the outer shell",
            options: [
              "The number of protons",
              "The number of neutrons",
              "The number of electrons in the outer shell",
              "The atomic mass",
            ],
            difficulty: "medium",
          },
        ],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    color: "bg-purple-600",
    topics: [
      {
        id: "mechanics",
        name: "Mechanics",
        questions: [
          {
            id: "mech_1",
            question: "What is Newton's first law of motion?",
            answer:
              "An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force",
            difficulty: "medium",
          },
          {
            id: "mech_2",
            question: "What is the formula for kinetic energy?",
            answer: "KE = ½mv²",
            difficulty: "medium",
          },
          {
            id: "mech_3",
            question: "What is acceleration?",
            answer: "The rate of change of velocity",
            difficulty: "easy",
          },
        ],
      },
    ],
  },
];
