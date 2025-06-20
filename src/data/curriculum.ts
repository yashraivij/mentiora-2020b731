import { Curriculum } from "../types";

export const curriculum: Curriculum[] = [
  {
    subject: "Mathematics",
    topics: [
      {
        id: "algebra",
        name: "Algebra",
        questions: [
          {
            id: "alg_1",
            question: "Simplify: 3x + 5x",
            options: ["8x", "15x", "2x", "x"],
            correct: 0,
            explanation: "3x + 5x = 8x"
          },
          {
            id: "alg_2",
            question: "Factorize: x^2 - 9",
            options: ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 1)(x + 9)", "Prime"],
            correct: 0,
            explanation: "x^2 - 9 is a difference of squares: (x - 3)(x + 3)"
          }
        ]
      },
      {
        id: "geometry",
        name: "Geometry",
        questions: [
          {
            id: "geo_1",
            question: "What is the sum of angles in a triangle?",
            options: ["180°", "90°", "360°", "270°"],
            correct: 0,
            explanation: "The sum of interior angles in a triangle is always 180 degrees."
          },
          {
            id: "geo_2",
            question: "Calculate the area of a circle with radius 3cm.",
            options: ["28.27 cm²", "18.85 cm²", "9 cm²", "6 cm²"],
            correct: 0,
            explanation: "Area = πr² = π × 3² = 28.27 cm² (approx)"
          }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        questions: [
          {
            id: "stats_1",
            question: "Calculate the mean of the following data set: 12, 15, 18, 22, 25, 30",
            options: ["20.3", "22", "18.5", "21"],
            correct: 0,
            explanation: "Mean = (12 + 15 + 18 + 22 + 25 + 30) ÷ 6 = 122 ÷ 6 = 20.33"
          },
          {
            id: "stats_2",
            question: "What is the median of: 7, 12, 18, 21, 24, 30, 35?",
            options: ["18", "21", "24", "19.5"],
            correct: 1,
            explanation: "The median is the middle value when data is arranged in order. With 7 values, the median is the 4th value: 21"
          },
          {
            id: "stats_3",
            question: "Find the mode of: 3, 7, 9, 7, 12, 7, 15",
            options: ["7", "9", "12", "No mode"],
            correct: 0,
            explanation: "The mode is the most frequently occurring value. 7 appears 3 times, more than any other value"
          },
          {
            id: "stats_4",
            question: "Calculate the range of: 8, 15, 23, 12, 19, 27, 11",
            options: ["19", "23", "15", "16"],
            correct: 0,
            explanation: "Range = Highest value - Lowest value = 27 - 8 = 19"
          },
          {
            id: "stats_5",
            question: "A bag contains 5 red balls and 3 blue balls. What is the probability of drawing a red ball?",
            options: ["5/8", "3/8", "5/3", "1/2"],
            correct: 0,
            explanation: "P(red) = Number of red balls / Total balls = 5/(5+3) = 5/8"
          },
          {
            id: "stats_6",
            question: "What is the probability of rolling an even number on a fair six-sided die?",
            options: ["1/3", "1/2", "2/3", "1/6"],
            correct: 1,
            explanation: "Even numbers on a die are 2, 4, 6. So P(even) = 3/6 = 1/2"
          },
          {
            id: "stats_7",
            question: "Calculate the interquartile range (IQR) for: 10, 12, 15, 18, 20, 22, 25",
            options: ["8", "10", "12", "15"],
            correct: 0,
            explanation: "Q1 = 12, Q3 = 22. IQR = Q3 - Q1 = 22 - 12 = 10"
          },
          {
            id: "stats_8",
            question: "What type of correlation is shown when one variable increases as the other decreases?",
            options: ["Positive", "Negative", "No correlation", "Perfect"],
            correct: 1,
            explanation: "Negative correlation occurs when one variable increases while the other decreases"
          },
          {
            id: "stats_9",
            question: "In a frequency table, if the frequency of class 20-30 is 8 and total frequency is 40, what is the relative frequency?",
            options: ["0.2", "0.25", "0.3", "0.4"],
            correct: 0,
            explanation: "Relative frequency = Class frequency / Total frequency = 8/40 = 0.2"
          },
          {
            id: "stats_10",
            question: "A coin is flipped twice. What is the probability of getting at least one head?",
            options: ["1/4", "1/2", "3/4", "1"],
            correct: 2,
            explanation: "P(at least one head) = 1 - P(no heads) = 1 - P(TT) = 1 - 1/4 = 3/4"
          },
          {
            id: "stats_11",
            question: "Calculate the standard deviation of: 2, 4, 6, 8 (population)",
            options: ["√5", "2.24", "√2.5", "2"],
            correct: 0,
            explanation: "Mean = 5, variance = [(2-5)² + (4-5)² + (6-5)² + (8-5)²]/4 = 20/4 = 5, so σ = √5"
          },
          {
            id: "stats_12",
            question: "What percentage of data falls within one standard deviation of the mean in a normal distribution?",
            options: ["68%", "95%", "99.7%", "50%"],
            correct: 0,
            explanation: "In a normal distribution, approximately 68% of data falls within one standard deviation of the mean"
          },
          {
            id: "stats_13",
            question: "Two events A and B are mutually exclusive. If P(A) = 0.3 and P(B) = 0.4, what is P(A ∪ B)?",
            options: ["0.7", "0.12", "0.1", "1"],
            correct: 0,
            explanation: "For mutually exclusive events: P(A ∪ B) = P(A) + P(B) = 0.3 + 0.4 = 0.7"
          },
          {
            id: "stats_14",
            question: "In a box plot, what does the length of the box represent?",
            options: ["Range", "Interquartile range", "Standard deviation", "Mean"],
            correct: 1,
            explanation: "The box in a box plot represents the interquartile range (IQR), from Q1 to Q3"
          },
          {
            id: "stats_15",
            question: "A sample of 100 students has a mean height of 170cm. What is the sum of all heights?",
            options: ["17000cm", "1700cm", "170cm", "100cm"],
            correct: 0,
            explanation: "Sum = Mean × Number of values = 170 × 100 = 17000cm"
          },
          {
            id: "stats_16",
            question: "What is the probability of drawing two red cards consecutively from a deck without replacement?",
            options: ["25/102", "1/4", "26/51", "1/2"],
            correct: 0,
            explanation: "P(1st red) × P(2nd red|1st red) = (26/52) × (25/51) = 25/102"
          },
          {
            id: "stats_17",
            question: "Calculate the coefficient of variation if mean = 50 and standard deviation = 10",
            options: ["0.2", "20%", "5", "Both A and B"],
            correct: 3,
            explanation: "CV = (σ/μ) × 100% = (10/50) × 100% = 20% = 0.2"
          },
          {
            id: "stats_18",
            question: "In a contingency table, what test is used to determine independence?",
            options: ["t-test", "Chi-square test", "F-test", "Z-test"],
            correct: 1,
            explanation: "Chi-square test of independence is used to test if two categorical variables are independent"
          },
          {
            id: "stats_19",
            question: "What is the 75th percentile also known as?",
            options: ["First quartile", "Second quartile", "Third quartile", "Fourth quartile"],
            correct: 2,
            explanation: "The 75th percentile is the third quartile (Q3), where 75% of data falls below this value"
          },
          {
            id: "stats_20",
            question: "If P(A) = 0.6 and P(B|A) = 0.8, what is P(A ∩ B)?",
            options: ["0.48", "1.4", "0.2", "0.8"],
            correct: 0,
            explanation: "P(A ∩ B) = P(A) × P(B|A) = 0.6 × 0.8 = 0.48"
          },
          {
            id: "stats_21",
            question: "What type of data is 'eye color'?",
            options: ["Discrete quantitative", "Continuous quantitative", "Nominal qualitative", "Ordinal qualitative"],
            correct: 2,
            explanation: "Eye color is nominal qualitative data as it represents categories with no natural order"
          },
          {
            id: "stats_22",
            question: "A histogram shows the distribution is skewed right. Where is the mean relative to the median?",
            options: ["Mean < Median", "Mean = Median", "Mean > Median", "Cannot determine"],
            correct: 2,
            explanation: "In a right-skewed distribution, the mean is pulled towards the tail, so mean > median"
          },
          {
            id: "stats_23",
            question: "What is the expected value of rolling a fair six-sided die?",
            options: ["3", "3.5", "4", "6"],
            correct: 1,
            explanation: "E(X) = (1+2+3+4+5+6)/6 = 21/6 = 3.5"
          },
          {
            id: "stats_24",
            question: "In hypothesis testing, what does a p-value of 0.03 mean at α = 0.05?",
            options: ["Accept H₀", "Reject H₀", "Accept H₁", "Inconclusive"],
            correct: 1,
            explanation: "Since p-value (0.03) < α (0.05), we reject the null hypothesis H₀"
          }
        ]
      }
    ]
  },
  {
    subject: "Physics",
    topics: [
      {
        id: "mechanics",
        name: "Mechanics",
        questions: [
          {
            id: "mech_1",
            question: "What is Newton's second law?",
            options: ["F = ma", "E = mc^2", "V = IR", "p = mv"],
            correct: 0,
            explanation: "Newton's second law states that force equals mass times acceleration."
          }
        ]
      }
    ]
  },
  {
    subject: "Chemistry",
    topics: [
      {
        id: "organic",
        name: "Organic Chemistry",
        questions: [
          {
            id: "org_1",
            question: "What is the functional group of alcohols?",
            options: ["-OH", "-COOH", "-NH2", "-CHO"],
            correct: 0,
            explanation: "Alcohols contain the hydroxyl functional group (-OH)."
          }
        ]
      }
    ]
  }
];
