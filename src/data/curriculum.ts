import { Question } from "../types";

type Subject = "Physics" | "Chemistry" | "Mathematics";

type Curriculum = {
  [subject in Subject]: {
    name: string;
    examBoard: string;
    topics: {
      [topic: string]: {
        name: string;
        questions: Question[];
      };
    };
  };
};

export const curriculum: Curriculum = {
  "Physics": {
    name: "Physics",
    examBoard: "AQA",
    topics: {
      "Motion": {
        name: "Motion",
        questions: [
          {
            id: "motion-1",
            question: "What is the SI unit of velocity?",
            options: ["m/s", "m/s²", "N", "kg"],
            correct: 0,
            explanation: "Velocity is measured in meters per second (m/s)."
          },
          {
            id: "motion-2",
            question: "What is the acceleration of a car that goes from 0 to 60 m/s in 6 seconds?",
            options: ["6 m/s²", "10 m/s²", "360 m/s²", "0 m/s²"],
            correct: 1,
            explanation: "Acceleration = (Final Velocity - Initial Velocity) / Time = (60 m/s - 0 m/s) / 6 s = 10 m/s²."
          },
          {
            id: "motion-3",
            question: "A ball is thrown upwards with an initial velocity of 20 m/s. What is its velocity at the highest point?",
            options: ["20 m/s", "9.8 m/s", "0 m/s", "-9.8 m/s"],
            correct: 2,
            explanation: "At the highest point, the ball momentarily stops before falling back down, so its velocity is 0 m/s."
          }
        ]
      },
      "Energy": {
        name: "Energy",
        questions: [
          {
            id: "energy-1",
            question: "What is the law of conservation of energy?",
            options: [
              "Energy can be created but not destroyed.",
              "Energy cannot be created or destroyed.",
              "Energy can be destroyed but not created.",
              "Energy is always constant in any system."
            ],
            correct: 1,
            explanation: "The law of conservation of energy states that energy cannot be created or destroyed, but it can be transformed from one form to another."
          },
          {
            id: "energy-2",
            question: "What type of energy is stored in a stretched spring?",
            options: ["Kinetic energy", "Potential energy", "Thermal energy", "Nuclear energy"],
            correct: 1,
            explanation: "A stretched spring stores potential energy due to its deformation."
          },
          {
            id: "energy-3",
            question: "A 2 kg ball is lifted to a height of 3 meters. What is its potential energy?",
            options: ["6 J", "15 J", "58.8 J", "60 J"],
            correct: 2,
            explanation: "Potential energy (PE) = mgh = 2 kg * 9.8 m/s² * 3 m = 58.8 J."
          }
        ]
      }
    }
  },
  "Chemistry": {
    name: "Chemistry",
    examBoard: "AQA",
    topics: {
      "Atomic Structure": {
        name: "Atomic Structure",
        questions: [
          {
            id: "atomic-1",
            question: "What is the charge of a proton?",
            options: ["Positive", "Negative", "Neutral", "Variable"],
            correct: 0,
            explanation: "Protons have a positive charge."
          },
          {
            id: "atomic-2",
            question: "Which particle is not found in the nucleus of an atom?",
            options: ["Proton", "Neutron", "Electron", "Nucleon"],
            correct: 2,
            explanation: "Electrons orbit the nucleus, but are not found within it."
          },
          {
            id: "atomic-3",
            question: "What is the atomic number?",
            options: [
              "Number of neutrons",
              "Number of protons",
              "Number of electrons",
              "Sum of protons and neutrons"
            ],
            correct: 1,
            explanation: "The atomic number is the number of protons in an atom's nucleus, which defines the element."
          }
        ]
      },
      "Chemical Reactions": {
        name: "Chemical Reactions",
        questions: [
          {
            id: "reaction-1",
            question: "What is a chemical reaction?",
            options: [
              "A change in state",
              "A process that involves rearrangement of atoms",
              "A physical change",
              "A change in temperature"
            ],
            correct: 1,
            explanation: "A chemical reaction involves the rearrangement of atoms and the breaking or forming of chemical bonds."
          },
          {
            id: "reaction-2",
            question: "What is the role of a catalyst in a chemical reaction?",
            options: [
              "To be consumed in the reaction",
              "To slow down the reaction",
              "To provide energy",
              "To speed up the reaction"
            ],
            correct: 3,
            explanation: "A catalyst speeds up a chemical reaction without being consumed in the process."
          },
          {
            id: "reaction-3",
            question: "What type of reaction is combustion?",
            options: ["Endothermic", "Exothermic", "Redox", "Neutralization"],
            correct: 1,
            explanation: "Combustion is an exothermic reaction that releases heat and light."
          }
        ]
      }
    }
  },
  "Mathematics": {
    name: "Mathematics",
    examBoard: "AQA",
    topics: {
      "Algebra": {
        name: "Algebra",
        questions: [
          {
            id: "algebra-1",
            question: "Solve for x: 2x + 3 = 7",
            options: ["x = 1", "x = 2", "x = 3", "x = 4"],
            correct: 1,
            explanation: "Subtract 3 from both sides: 2x = 4. Divide by 2: x = 2."
          },
          {
            id: "algebra-2",
            question: "Simplify: 3(x + 2) - x",
            options: ["2x + 6", "4x + 6", "2x + 2", "4x + 2"],
            correct: 0,
            explanation: "Expand: 3x + 6 - x. Combine like terms: 2x + 6."
          },
          {
            id: "algebra-3",
            question: "Factorize: x² - 4",
            options: [
              "(x - 2)(x - 2)",
              "(x + 2)(x + 2)",
              "(x - 2)(x + 2)",
              "(x - 4)(x + 1)"
            ],
            correct: 2,
            explanation: "This is a difference of squares: (x - 2)(x + 2)."
          }
        ]
      },
      "Geometry": {
        name: "Geometry",
        questions: [
          {
            id: "geometry-1",
            question: "What is the area of a circle with radius 5?",
            options: ["10π", "25π", "5π", "20π"],
            correct: 1,
            explanation: "Area of a circle = πr² = π * 5² = 25π."
          },
          {
            id: "geometry-2",
            question: "What is the sum of angles in a triangle?",
            options: ["90°", "180°", "270°", "360°"],
            correct: 1,
            explanation: "The sum of angles in any triangle is always 180°."
          },
          {
            id: "geometry-3",
            question: "What is the Pythagorean theorem?",
            options: [
              "a² + b² = c²",
              "a² - b² = c²",
              "a + b = c",
              "a - b = c"
            ],
            correct: 0,
            explanation: "The Pythagorean theorem states that in a right-angled triangle, a² + b² = c², where c is the hypotenuse."
          }
        ]
      },
      "Statistics": {
        name: "Statistics",
        questions: [
          {
            id: "stats-1",
            question: "A dataset has the following values: 2, 4, 6, 8, 10. What is the mean?",
            options: ["5", "6", "7", "8"],
            correct: 1,
            explanation: "Mean = (2 + 4 + 6 + 8 + 10) ÷ 5 = 30 ÷ 5 = 6"
          },
          {
            id: "stats-2",
            question: "What is the median of the dataset: 3, 7, 2, 9, 5, 1, 8?",
            options: ["4", "5", "6", "7"],
            correct: 1,
            explanation: "First arrange in order: 1, 2, 3, 5, 7, 8, 9. The median is the middle value = 5"
          },
          {
            id: "stats-3",
            question: "A fair six-sided die is rolled. What is the probability of getting an even number?",
            options: ["1/6", "1/3", "1/2", "2/3"],
            correct: 2,
            explanation: "Even numbers on a die are 2, 4, 6. So P(even) = 3/6 = 1/2"
          },
          {
            id: "stats-4",
            question: "What is the range of the dataset: 15, 8, 23, 4, 19, 12?",
            options: ["15", "19", "23", "19"],
            correct: 1,
            explanation: "Range = Maximum - Minimum = 23 - 4 = 19"
          },
          {
            id: "stats-5",
            question: "In a normal distribution, approximately what percentage of data falls within one standard deviation of the mean?",
            options: ["68%", "95%", "99.7%", "50%"],
            correct: 0,
            explanation: "In a normal distribution, approximately 68% of data falls within one standard deviation of the mean (empirical rule)"
          },
          {
            id: "stats-6",
            question: "Two events A and B are independent. If P(A) = 0.3 and P(B) = 0.4, what is P(A and B)?",
            options: ["0.7", "0.12", "0.1", "0.35"],
            correct: 1,
            explanation: "For independent events, P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12"
          },
          {
            id: "stats-7",
            question: "What type of correlation does a scatter plot show if as x increases, y decreases?",
            options: ["Positive correlation", "Negative correlation", "No correlation", "Perfect correlation"],
            correct: 1,
            explanation: "When x increases and y decreases, this shows a negative correlation"
          },
          {
            id: "stats-8",
            question: "A bag contains 5 red balls and 3 blue balls. What is the probability of drawing a red ball?",
            options: ["3/8", "5/8", "3/5", "5/3"],
            correct: 1,
            explanation: "P(red) = Number of red balls / Total balls = 5/(5+3) = 5/8"
          },
          {
            id: "stats-9",
            question: "What is the mode of the dataset: 2, 3, 3, 5, 5, 5, 7, 8?",
            options: ["3", "5", "2", "7"],
            correct: 1,
            explanation: "The mode is the most frequently occurring value. 5 appears 3 times, more than any other value"
          },
          {
            id: "stats-10",
            question: "In a binomial distribution with n = 10 and p = 0.2, what is the expected value (mean)?",
            options: ["2", "8", "0.2", "10"],
            correct: 0,
            explanation: "For a binomial distribution, expected value = n × p = 10 × 0.2 = 2"
          },
          {
            id: "stats-11",
            question: "What is the interquartile range (IQR) if Q1 = 15 and Q3 = 25?",
            options: ["10", "15", "20", "25"],
            correct: 0,
            explanation: "IQR = Q3 - Q1 = 25 - 15 = 10"
          },
          {
            id: "stats-12",
            question: "A hypothesis test has a p-value of 0.03. Using α = 0.05, what should you conclude?",
            options: ["Accept the null hypothesis", "Reject the null hypothesis", "Inconclusive", "Need more data"],
            correct: 1,
            explanation: "Since p-value (0.03) < α (0.05), we reject the null hypothesis"
          },
          {
            id: "stats-13",
            question: "What is the standard deviation of the dataset: 2, 4, 6? (Population standard deviation)",
            options: ["√8/3", "2", "4/3", "√(8/3)"],
            correct: 3,
            explanation: "Mean = 4. Variance = [(2-4)² + (4-4)² + (6-4)²]/3 = [4+0+4]/3 = 8/3. Standard deviation = √(8/3)"
          },
          {
            id: "stats-14",
            question: "In a contingency table, what test is used to determine if two categorical variables are independent?",
            options: ["t-test", "Chi-square test", "ANOVA", "z-test"],
            correct: 1,
            explanation: "The chi-square test of independence is used to test if two categorical variables are independent"
          },
          {
            id: "stats-15",
            question: "What is the probability of getting exactly 2 heads in 4 coin flips?",
            options: ["1/4", "3/8", "1/2", "1/8"],
            correct: 1,
            explanation: "Using binomial probability: C(4,2) × (1/2)⁴ = 6 × 1/16 = 6/16 = 3/8"
          },
          {
            id: "stats-16",
            question: "A dataset has a mean of 50 and a standard deviation of 10. What is the z-score for a value of 65?",
            options: ["1.5", "2", "0.5", "15"],
            correct: 0,
            explanation: "z-score = (x - μ)/σ = (65 - 50)/10 = 15/10 = 1.5"
          },
          {
            id: "stats-17",
            question: "What type of sampling is used when every 10th person is selected from a list?",
            options: ["Simple random sampling", "Systematic sampling", "Stratified sampling", "Cluster sampling"],
            correct: 1,
            explanation: "Systematic sampling involves selecting every kth item from a list"
          },
          {
            id: "stats-18",
            question: "The correlation coefficient r = -0.8. What does this indicate?",
            options: ["Strong positive correlation", "Strong negative correlation", "Weak correlation", "No correlation"],
            correct: 1,
            explanation: "r = -0.8 indicates a strong negative correlation (close to -1)"
          },
          {
            id: "stats-19",
            question: "In a box plot, what do the 'whiskers' represent?",
            options: ["The mean", "The range of data within 1.5×IQR of Q1 and Q3", "The standard deviation", "The mode"],
            correct: 1,
            explanation: "Whiskers in a box plot extend to the furthest points that are within 1.5×IQR of the first and third quartiles"
          },
          {
            id: "stats-20",
            question: "What is the variance of a dataset with values: 1, 3, 5? (Population variance)",
            options: ["8/3", "4", "2", "16/9"],
            correct: 0,
            explanation: "Mean = 3. Variance = [(1-3)² + (3-3)² + (5-3)²]/3 = [4+0+4]/3 = 8/3"
          },
          {
            id: "stats-21",
            question: "A Type I error in hypothesis testing occurs when:",
            options: ["We accept a false null hypothesis", "We reject a true null hypothesis", "We accept a true null hypothesis", "We reject a false null hypothesis"],
            correct: 1,
            explanation: "A Type I error occurs when we reject a true null hypothesis (false positive)"
          },
          {
            id: "stats-22",
            question: "What is the 75th percentile also known as?",
            options: ["First quartile", "Second quartile", "Third quartile", "Median"],
            correct: 2,
            explanation: "The 75th percentile is the third quartile (Q3), where 75% of data falls below this value"
          },
          {
            id: "stats-23",
            question: "In a Poisson distribution with λ = 3, what is the expected value?",
            options: ["1", "3", "9", "√3"],
            correct: 1,
            explanation: "In a Poisson distribution, the expected value equals the parameter λ = 3"
          },
          {
            id: "stats-24",
            question: "What is the coefficient of variation if the mean is 20 and standard deviation is 4?",
            options: ["5%", "20%", "25%", "80%"],
            correct: 1,
            explanation: "Coefficient of variation = (standard deviation/mean) × 100% = (4/20) × 100% = 20%"
          }
        ]
      }
    }
  }
};
