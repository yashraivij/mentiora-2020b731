
export interface Question {
  id: string;
  question: string;
  marks: number;
  modelAnswer: string;
  markingCriteria: {
    breakdown: string[];
  };
  specReference: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  topics: Topic[];
}

export const curriculum: Subject[] = [
  {
    id: "web_dev",
    name: "Web Development",
    description: "Learn to build websites and web applications.",
    color: "bg-blue-500",
    topics: [
      {
        id: "html",
        name: "HTML",
        description: "Learn the structure of web pages.",
        questions: []
      },
      {
        id: "css",
        name: "CSS",
        description: "Learn to style web pages.",
        questions: []
      },
      {
        id: "javascript",
        name: "JavaScript",
        description: "Learn to make web pages interactive.",
        questions: []
      },
      {
        id: "react",
        name: "React",
        description: "Learn to build user interfaces with React.",
        questions: []
      },
      {
        id: "node",
        name: "Node.js",
        description: "Learn to build server-side applications with Node.js.",
        questions: []
      },
      {
        id: "mongodb",
        name: "MongoDB",
        description: "Learn to store data in a MongoDB database.",
        questions: []
      }
    ]
  },
  {
    id: "data_science",
    name: "Data Science",
    description: "Learn to analyze data and make predictions.",
    color: "bg-green-500",
    topics: [
      {
        id: "python",
        name: "Python",
        description: "Learn the basics of Python programming.",
        questions: []
      },
      {
        id: "numpy",
        name: "NumPy",
        description: "Learn to work with arrays using NumPy.",
        questions: []
      },
      {
        id: "pandas",
        name: "Pandas",
        description: "Learn to work with data using Pandas.",
        questions: []
      },
      {
        id: "matplotlib",
        name: "Matplotlib",
        description: "Learn to visualize data using Matplotlib.",
        questions: []
      },
      {
        id: "machine_learning",
        name: "Machine Learning",
        description: "Learn the basics of machine learning.",
        questions: []
      }
    ]
  },
  {
    id: "mobile_dev",
    name: "Mobile Development",
    description: "Learn to build mobile applications.",
    color: "bg-purple-500",
    topics: [
      {
        id: "java",
        name: "Java",
        description: "Learn the basics of Java programming.",
        questions: []
      },
      {
        id: "kotlin",
        name: "Kotlin",
        description: "Learn the basics of Kotlin programming.",
        questions: []
      },
      {
        id: "android_studio",
        name: "Android Studio",
        description: "Learn to build Android applications with Android Studio.",
        questions: []
      },
      {
        id: "swift",
        name: "Swift",
        description: "Learn the basics of Swift programming.",
        questions: []
      },
      {
        id: "xcode",
        name: "Xcode",
        description: "Learn to build iOS applications with Xcode.",
        questions: []
      }
    ]
  },
  {
    id: "game_dev",
    name: "Game Development",
    description: "Learn to build video games.",
    color: "bg-red-500",
    topics: [
      {
        id: "csharp",
        name: "C#",
        description: "Learn the basics of C# programming.",
        questions: []
      },
      {
        id: "unity",
        name: "Unity",
        description: "Learn to build games with Unity.",
        questions: []
      },
      {
        id: "unreal_engine",
        name: "Unreal Engine",
        description: "Learn to build games with Unreal Engine.",
        questions: []
      },
      {
        id: "game_design",
        name: "Game Design",
        description: "Learn the principles of game design.",
        questions: []
      }
    ]
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Learn to protect computer systems and networks.",
    color: "bg-orange-500",
    topics: [
      {
        id: "networking",
        name: "Networking",
        description: "Learn the basics of computer networking.",
        questions: []
      },
      {
        id: "security_fundamentals",
        name: "Security Fundamentals",
        description: "Learn the fundamentals of computer security.",
        questions: []
      },
      {
        id: "ethical_hacking",
        name: "Ethical Hacking",
        description: "Learn to hack systems ethically to find vulnerabilities.",
        questions: []
      },
      {
        id: "cryptography",
        name: "Cryptography",
        description: "Learn the basics of cryptography.",
        questions: []
      }
    ]
  },
  {
    id: "cloud_computing",
    name: "Cloud Computing",
    description: "Learn about cloud computing and its services.",
    color: "bg-cyan-500",
    topics: [
      {
        id: "aws",
        name: "Amazon Web Services (AWS)",
        description: "Learn about AWS cloud services.",
        questions: []
      },
      {
        id: "azure",
        name: "Microsoft Azure",
        description: "Learn about Microsoft Azure cloud services.",
        questions: []
      },
      {
        id: "google_cloud",
        name: "Google Cloud Platform (GCP)",
        description: "Learn about Google Cloud Platform services.",
        questions: []
      },
      {
        id: "devops",
        name: "DevOps",
        description: "Learn about DevOps practices and tools.",
        questions: []
      }
    ]
  },
  {
    id: "artificial_intelligence",
    name: "Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning.",
    color: "bg-indigo-500",
    topics: [
      {
        id: "machine_learning",
        name: "Machine Learning",
        description: "Learn the basics of machine learning algorithms.",
        questions: []
      },
      {
        id: "deep_learning",
        name: "Deep Learning",
        description: "Learn about neural networks and deep learning techniques.",
        questions: []
      },
      {
        id: "natural_language_processing",
        name: "Natural Language Processing (NLP)",
        description: "Learn to process and understand human language.",
        questions: []
      },
      {
        id: "computer_vision",
        name: "Computer Vision",
        description: "Learn to enable computers to 'see' and interpret images.",
        questions: []
      },
      {
        id: "ai_ethics",
        name: "AI Ethics",
        description: "Explore the ethical considerations of artificial intelligence.",
        questions: []
      }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Fundamental mathematical concepts and applications",
    color: "bg-slate-500",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        description: "Basic algebraic principles and equation solving",
        questions: [
          {
            id: "alg_001",
            question: "Solve for x: 2x + 5 = 13",
            marks: 2,
            modelAnswer: "x = 4",
            markingCriteria: {
              breakdown: [
                "Subtract 5 from both sides: 2x = 8 (1 mark)",
                "Divide both sides by 2: x = 4 (1 mark)"
              ]
            },
            specReference: "A1.2"
          }
        ]
      },
      {
        id: "calculus",
        name: "Calculus",
        description: "Differential and integral calculus",
        questions: []
      },
      {
        id: "geometry",
        name: "Geometry",
        description: "Euclidean and analytic geometry",
        questions: []
      },
      {
        id: "linear-algebra",
        name: "Linear Algebra",
        description: "Vectors, matrices, and linear transformations",
        questions: []
      },
      {
        id: "discrete-mathematics",
        name: "Discrete Mathematics",
        description: "Logic, sets, and combinatorics",
        questions: []
      },
      {
        id: "quadratic-equations",
        name: "Quadratic Equations",
        description: "Solving quadratic equations using various methods",
        questions: []
      },
      {
        id: "functions-graphs",
        name: "Functions and Graphs",
        description: "Understanding functions and their graphical representations",
        questions: []
      },
      {
        id: "trigonometry",
        name: "Trigonometry",
        description: "Trigonometric ratios and their applications",
        questions: []
      },
      {
        id: "statistics-probability",
        name: "Statistics and Probability",
        description: "Data analysis and probability calculations",
        questions: []
      }
    ]
  },
  {
    id: "science",
    name: "Science",
    description: "General science knowledge",
    color: "bg-emerald-500",
    topics: [
      {
        id: "biology",
        name: "Biology",
        description: "The study of living organisms",
        questions: []
      },
      {
        id: "chemistry",
        name: "Chemistry",
        description: "The study of matter and its properties",
        questions: []
      },
      {
        id: "physics",
        name: "Physics",
        description: "The study of the fundamental laws of nature",
        questions: []
      }
    ]
  },
  {
    id: "history",
    name: "History",
    description: "World history",
    color: "bg-amber-500",
    topics: [
      {
        id: "ancient-history",
        name: "Ancient History",
        description: "The history of the ancient world",
        questions: []
      },
      {
        id: "medieval-history",
        name: "Medieval History",
        description: "The history of the medieval period",
        questions: []
      },
      {
        id: "modern-history",
        name: "Modern History",
        description: "The history of the modern era",
        questions: []
      }
    ]
  }
];
