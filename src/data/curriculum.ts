export interface Question {
  id: string;
  questionText: string;
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

export interface Subject {
  questions: Question[];
}

export interface CurriculumData {
  [subject: string]: {
    [topic: string]: Subject;
  };
}

export const curriculum: CurriculumData = {
  "Mathematics": {
    "Algebra": {
      questions: [
        {
          id: "alg-1",
          questionText: "Solve the quadratic equation: 2x² + 5x - 3 = 0",
          marks: 4,
          modelAnswer: "Using the quadratic formula: x = (-5 ± √(25 + 24))/4 = (-5 ± 7)/4\nTherefore x = 1/2 or x = -3",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct identification of a=2, b=5, c=-3",
              "1 mark for correct substitution into quadratic formula",
              "1 mark for correct calculation of discriminant (49)",
              "1 mark for both correct solutions"
            ]
          },
          specReference: "A1.2"
        },
        {
          id: "alg-2",
          questionText: "Expand and simplify: (2x + 3)(x - 4) - (x + 1)²",
          marks: 5,
          modelAnswer: "(2x + 3)(x - 4) = 2x² - 8x + 3x - 12 = 2x² - 5x - 12\n(x + 1)² = x² + 2x + 1\nFinal answer: 2x² - 5x - 12 - x² - 2x - 1 = x² - 7x - 13",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct expansion of (2x + 3)(x - 4)",
              "1 mark for correct expansion of (x + 1)²",
              "2 marks for correct final simplification"
            ]
          },
          specReference: "A1.1"
        },
        {
          id: "alg-3",
          questionText: "Make x the subject of the formula: y = (3x - 2)/(x + 4)",
          marks: 4,
          modelAnswer: "y(x + 4) = 3x - 2\nyx + 4y = 3x - 2\nyx - 3x = -2 - 4y\nx(y - 3) = -2 - 4y\nx = (-2 - 4y)/(y - 3) or x = (2 + 4y)/(3 - y)",
          markingCriteria: {
            ao1: 1,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for multiplying both sides by (x + 4)",
              "1 mark for collecting x terms on one side",
              "1 mark for factoring out x",
              "1 mark for correct final answer"
            ]
          },
          specReference: "A1.3"
        },
        {
          id: "alg-4",
          questionText: "Solve the simultaneous equations: 3x + 2y = 11 and x - y = 1",
          marks: 4,
          modelAnswer: "From equation 2: x = y + 1\nSubstitute into equation 1: 3(y + 1) + 2y = 11\n3y + 3 + 2y = 11\n5y = 8\ny = 8/5\nx = 8/5 + 1 = 13/5\nSolution: x = 13/5, y = 8/5",
          markingCriteria: {
            ao1: 1,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct method (substitution or elimination)",
              "2 marks for correct algebraic manipulation",
              "1 mark for both correct solutions"
            ]
          },
          specReference: "A2.1"
        },
        {
          id: "alg-5",
          questionText: "Find the equation of the line passing through points (2, 5) and (6, 13) in the form y = mx + c",
          marks: 4,
          modelAnswer: "Gradient m = (13 - 5)/(6 - 2) = 8/4 = 2\nUsing y - y₁ = m(x - x₁) with point (2, 5):\ny - 5 = 2(x - 2)\ny - 5 = 2x - 4\ny = 2x + 1",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct calculation of gradient",
              "1 mark for correct use of point-slope form",
              "1 mark for correct final equation"
            ]
          },
          specReference: "A3.1"
        },
        {
          id: "alg-6",
          questionText: "Solve the inequality: 2x - 3 < 5x + 6",
          marks: 3,
          modelAnswer: "2x - 3 < 5x + 6\n2x - 5x < 6 + 3\n-3x < 9\nx > -3 (dividing by -3 reverses the inequality)",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct rearrangement",
              "1 mark for recognizing that dividing by negative reverses inequality",
              "1 mark for correct final answer x > -3"
            ]
          },
          specReference: "A2.2"
        },
        {
          id: "alg-7",
          questionText: "Express in the form a(x + b)² + c: x² + 6x + 2",
          marks: 4,
          modelAnswer: "x² + 6x + 2\nComplete the square: x² + 6x + 9 - 9 + 2\n= (x + 3)² - 7\nTherefore a = 1, b = 3, c = -7",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for identifying need to add and subtract 9",
              "1 mark for correct perfect square (x + 3)²",
              "2 marks for correct final form (x + 3)² - 7"
            ]
          },
          specReference: "A1.4"
        },
        {
          id: "alg-8",
          questionText: "Factorize completely: 3x³ - 12x",
          marks: 3,
          modelAnswer: "3x³ - 12x = 3x(x² - 4) = 3x(x + 2)(x - 2)",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for taking out common factor 3x",
              "1 mark for recognizing difference of squares",
              "1 mark for complete factorization"
            ]
          },
          specReference: "A1.1"
        },
        {
          id: "alg-9",
          questionText: "Given that f(x) = 2x² - 3x + 1, find f(3) and solve f(x) = 0",
          marks: 5,
          modelAnswer: "f(3) = 2(3)² - 3(3) + 1 = 18 - 9 + 1 = 10\nFor f(x) = 0: 2x² - 3x + 1 = 0\nUsing quadratic formula: x = (3 ± √(9 - 8))/4 = (3 ± 1)/4\nTherefore x = 1 or x = 1/2",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct substitution to find f(3)",
              "1 mark for f(3) = 10",
              "3 marks for solving quadratic equation correctly"
            ]
          },
          specReference: "A1.2"
        },
        {
          id: "alg-10",
          questionText: "Simplify: (x² - 4)/(x² + 4x + 4) ÷ (x - 2)/(x + 2)",
          marks: 4,
          modelAnswer: "(x² - 4)/(x² + 4x + 4) ÷ (x - 2)/(x + 2)\n= (x - 2)(x + 2)/(x + 2)² × (x + 2)/(x - 2)\n= (x - 2)(x + 2) × (x + 2)/[(x + 2)² × (x - 2)]\n= 1",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for factorizing x² - 4 and x² + 4x + 4",
              "1 mark for converting division to multiplication",
              "2 marks for correct simplification to 1"
            ]
          },
          specReference: "A1.5"
        }
      ]
    },
    "Geometry": {
      questions: [
        {
          id: "geo-1",
          questionText: "A triangle has sides of length 5 cm, 12 cm, and 13 cm. Show that this is a right-angled triangle and find its area.",
          marks: 4,
          modelAnswer: "Check: 5² + 12² = 25 + 144 = 169 = 13²\nSince a² + b² = c², this is a right-angled triangle.\nArea = ½ × base × height = ½ × 5 × 12 = 30 cm²",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct application of Pythagoras' theorem",
              "1 mark for concluding it's a right-angled triangle",
              "1 mark for correct area calculation"
            ]
          },
          specReference: "G1.1"
        },
        {
          id: "geo-2",
          questionText: "Find the area of a circle with radius 7 cm. Give your answer in terms of π and as a decimal to 2 decimal places.",
          marks: 3,
          modelAnswer: "Area = πr² = π × 7² = 49π cm²\nDecimal form: 49π ≈ 49 × 3.14159 ≈ 153.94 cm²",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct formula A = πr²",
              "1 mark for 49π cm²",
              "1 mark for correct decimal approximation"
            ]
          },
          specReference: "G2.1"
        },
        {
          id: "geo-3",
          questionText: "A rectangular prism has dimensions 6 cm × 4 cm × 3 cm. Calculate its surface area and volume.",
          marks: 5,
          modelAnswer: "Volume = length × width × height = 6 × 4 × 3 = 72 cm³\nSurface area = 2(lw + lh + wh) = 2(6×4 + 6×3 + 4×3) = 2(24 + 18 + 12) = 2(54) = 108 cm²",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct volume calculation",
              "2 marks for correct surface area formula and calculation",
              "1 mark for correct units"
            ]
          },
          specReference: "G3.1"
        },
        {
          id: "geo-4",
          questionText: "In triangle ABC, angle A = 60°, side b = 8 cm, and side c = 6 cm. Use the cosine rule to find side a.",
          marks: 4,
          modelAnswer: "Using cosine rule: a² = b² + c² - 2bc cos A\na² = 8² + 6² - 2(8)(6) cos 60°\na² = 64 + 36 - 96 × 0.5\na² = 100 - 48 = 52\na = √52 = 2√13 ≈ 7.21 cm",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct cosine rule formula",
              "2 marks for correct substitution and calculation",
              "1 mark for correct final answer"
            ]
          },
          specReference: "G4.1"
        },
        {
          id: "geo-5",
          questionText: "Find the equation of a circle with center (3, -2) and radius 5.",
          marks: 3,
          modelAnswer: "Standard form of circle: (x - h)² + (y - k)² = r²\nWhere (h, k) is the center and r is the radius\n(x - 3)² + (y - (-2))² = 5²\n(x - 3)² + (y + 2)² = 25",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct circle equation format",
              "1 mark for correct substitution of center coordinates",
              "1 mark for correct final equation"
            ]
          },
          specReference: "G2.2"
        },
        {
          id: "geo-6",
          questionText: "A sector of a circle has radius 10 cm and central angle 72°. Find the arc length and sector area.",
          marks: 5,
          modelAnswer: "Convert angle to radians: 72° = 72π/180 = 2π/5 radians\nArc length = rθ = 10 × 2π/5 = 4π cm\nSector area = ½r²θ = ½ × 10² × 2π/5 = ½ × 100 × 2π/5 = 20π cm²",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for converting degrees to radians",
              "2 marks for correct arc length calculation",
              "2 marks for correct sector area calculation"
            ]
          },
          specReference: "G2.3"
        },
        {
          id: "geo-7",
          questionText: "Two parallel lines are cut by a transversal. If one interior angle is 65°, find all other angles formed.",
          marks: 4,
          modelAnswer: "Given one interior angle = 65°\nCorresponding angles: 65°\nAlternate interior angles: 65°\nCo-interior angles: 180° - 65° = 115°\nVertically opposite angles: 65° and 115°\nAll angles: 65°, 65°, 65°, 65°, 115°, 115°, 115°, 115°",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for understanding angle relationships with parallel lines",
              "1 mark for calculating co-interior angles",
              "1 mark for identifying all 8 angles correctly"
            ]
          },
          specReference: "G1.2"
        },
        {
          id: "geo-8",
          questionText: "Find the distance between points A(2, 3) and B(8, 11), and the midpoint of line segment AB.",
          marks: 4,
          modelAnswer: "Distance AB = √[(8-2)² + (11-3)²] = √[6² + 8²] = √[36 + 64] = √100 = 10 units\nMidpoint = ((2+8)/2, (3+11)/2) = (5, 7)",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct distance calculation using distance formula",
              "2 marks for correct midpoint calculation"
            ]
          },
          specReference: "G1.3"
        },
        {
          id: "geo-9",
          questionText: "A cone has base radius 6 cm and height 8 cm. Calculate its volume and curved surface area.",
          marks: 6,
          modelAnswer: "Volume = ⅓πr²h = ⅓π(6²)(8) = ⅓π(36)(8) = 96π cm³\nSlant height l = √(r² + h²) = √(6² + 8²) = √(36 + 64) = √100 = 10 cm\nCurved surface area = πrl = π(6)(10) = 60π cm²",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct volume calculation",
              "2 marks for correct slant height calculation",
              "2 marks for correct curved surface area"
            ]
          },
          specReference: "G3.2"
        },
        {
          id: "geo-10",
          questionText: "In a regular hexagon with side length 4 cm, find the area and perimeter.",
          marks: 5,
          modelAnswer: "Perimeter = 6 × 4 = 24 cm\nFor regular hexagon area: A = (3√3/2) × s²\nA = (3√3/2) × 4² = (3√3/2) × 16 = 24√3 cm²\nA ≈ 24 × 1.732 ≈ 41.57 cm²",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct perimeter calculation",
              "2 marks for correct area formula for regular hexagon",
              "2 marks for correct area calculation"
            ]
          },
          specReference: "G2.4"
        }
      ]
    },
    "Calculus": {
      questions: [
        {
          id: "calc-1",
          questionText: "Find the derivative of f(x) = 3x⁴ - 2x³ + 5x - 7",
          marks: 3,
          modelAnswer: "f'(x) = 12x³ - 6x² + 5",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for understanding power rule",
              "2 marks for correct application to all terms"
            ]
          },
          specReference: "C1.1"
        },
        {
          id: "calc-2",
          questionText: "Find ∫(2x³ - 4x + 3)dx",
          marks: 3,
          modelAnswer: "∫(2x³ - 4x + 3)dx = (2x⁴)/4 - (4x²)/2 + 3x + C = x⁴/2 - 2x² + 3x + C",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for understanding integration rules",
              "1 mark for correct integration of each term",
              "1 mark for including constant of integration"
            ]
          },
          specReference: "C2.1"
        },
        {
          id: "calc-3",
          questionText: "Find the equation of the tangent line to y = x² - 3x + 2 at the point where x = 2",
          marks: 5,
          modelAnswer: "y = x² - 3x + 2\ndy/dx = 2x - 3\nAt x = 2: dy/dx = 2(2) - 3 = 1\nWhen x = 2: y = 4 - 6 + 2 = 0\nTangent line: y - 0 = 1(x - 2)\ny = x - 2",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for finding derivative",
              "1 mark for evaluating derivative at x = 2",
              "1 mark for finding y-coordinate at x = 2",
              "2 marks for correct tangent line equation"
            ]
          },
          specReference: "C1.2"
        },
        {
          id: "calc-4",
          questionText: "Evaluate ∫₁³ (x² + 2x)dx",
          marks: 4,
          modelAnswer: "∫(x² + 2x)dx = x³/3 + x² + C\n∫₁³ (x² + 2x)dx = [x³/3 + x²]₁³\n= (27/3 + 9) - (1/3 + 1)\n= (9 + 9) - (1/3 + 3/3)\n= 18 - 4/3 = 54/3 - 4/3 = 50/3",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct indefinite integral",
              "1 mark for correct substitution of limits",
              "2 marks for correct evaluation"
            ]
          },
          specReference: "C2.2"
        },
        {
          id: "calc-5",
          questionText: "Find the critical points of f(x) = x³ - 6x² + 9x + 1 and determine their nature",
          marks: 6,
          modelAnswer: "f'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3)\nCritical points: x = 1 and x = 3\nf''(x) = 6x - 12\nAt x = 1: f''(1) = 6 - 12 = -6 < 0 (local maximum)\nAt x = 3: f''(3) = 18 - 12 = 6 > 0 (local minimum)",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for finding first derivative and critical points",
              "2 marks for finding second derivative",
              "2 marks for determining nature of critical points"
            ]
          },
          specReference: "C1.3"
        },
        {
          id: "calc-6",
          questionText: "Use the chain rule to find dy/dx for y = (2x + 1)⁵",
          marks: 3,
          modelAnswer: "Let u = 2x + 1, then y = u⁵\ndu/dx = 2\ndy/du = 5u⁴\nBy chain rule: dy/dx = dy/du × du/dx = 5u⁴ × 2 = 10u⁴ = 10(2x + 1)⁴",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for identifying need for chain rule",
              "1 mark for correct application of chain rule",
              "1 mark for correct final answer"
            ]
          },
          specReference: "C1.4"
        },
        {
          id: "calc-7",
          questionText: "Find the area between the curve y = x² and the line y = 4 from x = 0 to x = 2",
          marks: 5,
          modelAnswer: "Area = ∫₀² (4 - x²)dx\n= [4x - x³/3]₀²\n= (8 - 8/3) - (0 - 0)\n= 8 - 8/3 = 24/3 - 8/3 = 16/3 square units",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for identifying upper and lower functions",
              "1 mark for setting up correct integral",
              "3 marks for correct evaluation"
            ]
          },
          specReference: "C2.3"
        },
        {
          id: "calc-8",
          questionText: "Find dy/dx using implicit differentiation for x² + y² = 25",
          marks: 4,
          modelAnswer: "Differentiating both sides with respect to x:\n2x + 2y(dy/dx) = 0\n2y(dy/dx) = -2x\ndy/dx = -x/y",
          markingCriteria: {
            ao1: 1,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for understanding implicit differentiation",
              "2 marks for correct differentiation of both sides",
              "1 mark for solving for dy/dx"
            ]
          },
          specReference: "C1.5"
        },
        {
          id: "calc-9",
          questionText: "A particle moves along a line such that its position is given by s(t) = t³ - 6t² + 9t. Find the velocity and acceleration at t = 2.",
          marks: 5,
          modelAnswer: "Position: s(t) = t³ - 6t² + 9t\nVelocity: v(t) = s'(t) = 3t² - 12t + 9\nAcceleration: a(t) = v'(t) = 6t - 12\nAt t = 2:\nv(2) = 3(4) - 12(2) + 9 = 12 - 24 + 9 = -3\na(2) = 6(2) - 12 = 0",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for finding velocity and acceleration functions",
              "2 marks for correct evaluation at t = 2",
              "1 mark for correct interpretation"
            ]
          },
          specReference: "C1.6"
        },
        {
          id: "calc-10",
          questionText: "Use integration by parts to evaluate ∫x·eˣ dx",
          marks: 5,
          modelAnswer: "Using integration by parts: ∫u dv = uv - ∫v du\nLet u = x, dv = eˣ dx\nThen du = dx, v = eˣ\n∫x·eˣ dx = x·eˣ - ∫eˣ dx = x·eˣ - eˣ + C = eˣ(x - 1) + C",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct choice of u and dv",
              "2 marks for correct application of integration by parts formula",
              "2 marks for correct final answer"
            ]
          },
          specReference: "C2.4"
        }
      ]
    },
    "Statistics": {
      questions: [
        {
          id: "stat-1",
          questionText: "A bag contains 5 red balls, 3 blue balls, and 2 green balls. A ball is drawn at random. Calculate the probability that the ball drawn is: (a) red, (b) not green.",
          marks: 4,
          modelAnswer: "(a) P(red) = 5/10 = 1/2 = 0.5\n(b) P(not green) = 8/10 = 4/5 = 0.8",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for identifying total number of balls (10)",
              "1 mark for correct probability of red ball (1/2 or 0.5)",
              "1 mark for identifying number of non-green balls (8)",
              "1 mark for correct probability of not green (4/5 or 0.8)"
            ]
          },
          specReference: "S1"
        },
        {
          id: "stat-2",
          questionText: "The heights of 20 students were measured. The results are: 160, 165, 162, 158, 170, 164, 159, 167, 161, 163, 168, 166, 157, 169, 164, 162, 165, 160, 158, 171. Calculate the mean, median, and range.",
          marks: 6,
          modelAnswer: "Mean = (160+165+162+...+158+171)/20 = 3280/20 = 164 cm\nMedian = (163+164)/2 = 163.5 cm (when arranged in order)\nRange = 171 - 157 = 14 cm",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct calculation of mean (164)",
              "2 marks for correct median (163.5) with ordered data shown",
              "2 marks for correct range calculation (14)"
            ]
          },
          specReference: "S2"
        },
        {
          id: "stat-3",
          questionText: "A fair six-sided die is rolled twice. Find the probability that: (a) both rolls show an even number, (b) the sum of the two rolls is 7.",
          marks: 5,
          modelAnswer: "(a) P(both even) = P(even) × P(even) = (3/6) × (3/6) = 9/36 = 1/4\n(b) P(sum = 7) = 6/36 = 1/6 (outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1))",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for identifying P(even) = 1/2",
              "2 marks for correct calculation of P(both even) = 1/4",
              "1 mark for identifying favorable outcomes for sum = 7",
              "1 mark for correct probability P(sum = 7) = 1/6"
            ]
          },
          specReference: "S1"
        },
        {
          id: "stat-4",
          questionText: "A survey of 100 people asked about their favorite sport. The results were: Football 35, Basketball 25, Tennis 20, Swimming 15, Other 5. Draw a pie chart to represent this data, showing all calculations.",
          marks: 4,
          modelAnswer: "Football: (35/100) × 360° = 126°\nBasketball: (25/100) × 360° = 90°\nTennis: (20/100) × 360° = 72°\nSwimming: (15/100) × 360° = 54°\nOther: (5/100) × 360° = 18°\nTotal = 360° ✓",
          markingCriteria: {
            ao1: 1,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for understanding that angles must sum to 360°",
              "2 marks for correct angle calculations (at least 3 correct)",
              "1 mark for clearly drawn and labeled pie chart"
            ]
          },
          specReference: "S3"
        },
        {
          id: "stat-5",
          questionText: "The table below shows the number of goals scored by a football team in 30 matches. Calculate the mode, median, and mean number of goals per match.\n\nGoals: 0, 1, 2, 3, 4\nFrequency: 8, 12, 6, 3, 1",
          marks: 6,
          modelAnswer: "Mode = 1 goal (highest frequency of 12)\nTotal matches = 30\nMedian position = 15th and 16th values\nCumulative frequency: 8, 20, 26, 29, 30\nMedian = 1 goal\nMean = (0×8 + 1×12 + 2×6 + 3×3 + 4×1)/30 = 34/30 = 1.13 goals",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "1 mark for correct mode (1)",
              "2 marks for correct median calculation (1)",
              "3 marks for correct mean calculation (1.13)"
            ]
          },
          specReference: "S2"
        },
        {
          id: "stat-6",
          questionText: "Two events A and B are such that P(A) = 0.4, P(B) = 0.3, and P(A ∩ B) = 0.1. Calculate: (a) P(A ∪ B), (b) P(A|B), (c) Are events A and B independent?",
          marks: 6,
          modelAnswer: "(a) P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.4 + 0.3 - 0.1 = 0.6\n(b) P(A|B) = P(A ∩ B)/P(B) = 0.1/0.3 = 1/3\n(c) For independence: P(A) × P(B) = 0.4 × 0.3 = 0.12 ≠ 0.1 = P(A ∩ B)\nTherefore, A and B are not independent.",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for correct P(A ∪ B) using addition rule",
              "2 marks for correct conditional probability P(A|B)",
              "2 marks for testing independence and correct conclusion"
            ]
          },
          specReference: "S4"
        },
        {
          id: "stat-7",
          questionText: "A continuous random variable X has the probability density function f(x) = kx² for 0 ≤ x ≤ 2, and f(x) = 0 elsewhere. Find: (a) the value of k, (b) P(1 < X < 1.5).",
          marks: 7,
          modelAnswer: "(a) ∫₀² kx² dx = 1\nk[x³/3]₀² = k(8/3) = 1\nTherefore k = 3/8\n(b) P(1 < X < 1.5) = ∫₁^1.5 (3/8)x² dx\n= (3/8)[x³/3]₁^1.5 = (1/8)[1.5³ - 1³] = (1/8)[3.375 - 1] = 2.375/8 = 0.297",
          markingCriteria: {
            ao1: 3,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for setting up integral for finding k",
              "2 marks for correct value k = 3/8",
              "3 marks for correct calculation of P(1 < X < 1.5)"
            ]
          },
          specReference: "S5"
        },
        {
          id: "stat-8",
          questionText: "A binomial distribution has parameters n = 10 and p = 0.3. Calculate: (a) P(X = 3), (b) P(X ≤ 2), (c) the mean and variance of X.",
          marks: 8,
          modelAnswer: "(a) P(X = 3) = C(10,3) × 0.3³ × 0.7⁷ = 120 × 0.027 × 0.0824 = 0.267\n(b) P(X ≤ 2) = P(X = 0) + P(X = 1) + P(X = 2)\n= 0.7¹⁰ + 10 × 0.3 × 0.7⁹ + 45 × 0.3² × 0.7⁸ = 0.383\n(c) Mean = np = 10 × 0.3 = 3\nVariance = np(1-p) = 10 × 0.3 × 0.7 = 2.1",
          markingCriteria: {
            ao1: 3,
            ao2: 5,
            ao3: 0,
            breakdown: [
              "3 marks for correct P(X = 3) calculation",
              "3 marks for correct P(X ≤ 2) calculation",
              "2 marks for correct mean and variance"
            ]
          },
          specReference: "S6"
        },
        {
          id: "stat-9",
          questionText: "A sample of 50 students' test scores has a mean of 72 and standard deviation of 8. Construct a 95% confidence interval for the population mean, assuming the population is normally distributed.",
          marks: 5,
          modelAnswer: "95% confidence interval: x̄ ± 1.96 × (σ/√n)\n= 72 ± 1.96 × (8/√50)\n= 72 ± 1.96 × 1.131\n= 72 ± 2.22\n= (69.78, 74.22)",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct formula for confidence interval",
              "1 mark for correct critical value (1.96)",
              "2 marks for correct standard error calculation",
              "1 mark for correct final interval"
            ]
          },
          specReference: "S7"
        },
        {
          id: "stat-10",
          questionText: "The following data shows the relationship between hours studied (x) and test score (y): (2,65), (3,70), (4,75), (5,80), (6,85). Calculate the correlation coefficient and the equation of the regression line y = a + bx.",
          marks: 8,
          modelAnswer: "x̄ = 4, ȳ = 75\nSxx = Σ(x-x̄)² = 10, Syy = Σ(y-ȳ)² = 250, Sxy = Σ(x-x̄)(y-ȳ) = 50\nr = Sxy/√(SxxSyy) = 50/√(10×250) = 50/50 = 1\nb = Sxy/Sxx = 50/10 = 5\na = ȳ - bx̄ = 75 - 5×4 = 55\nRegression line: y = 55 + 5x",
          markingCriteria: {
            ao1: 3,
            ao2: 5,
            ao3: 0,
            breakdown: [
              "2 marks for correct calculation of means",
              "3 marks for correct calculation of Sxx, Syy, Sxy",
              "2 marks for correct correlation coefficient (r = 1)",
              "1 mark for correct regression equation"
            ]
          },
          specReference: "S8"
        }
      ]
    }
  },
  "Physics": {
    "Mechanics": {
      questions: [
        {
          id: "mech-1",
          questionText: "A car accelerates from rest at 2.5 m/s² for 8 seconds. Calculate: (a) the final velocity, (b) the distance traveled.",
          marks: 4,
          modelAnswer: "(a) v = u + at = 0 + 2.5 × 8 = 20 m/s\n(b) s = ut + ½at² = 0 × 8 + ½ × 2.5 × 8² = 80 m",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct equation v = u + at",
              "1 mark for correct final velocity (20 m/s)",
              "1 mark for correct equation s = ut + ½at²",
              "1 mark for correct distance (80 m)"
            ]
          },
          specReference: "M1.1"
        },
        {
          id: "mech-2",
          questionText: "A 5 kg object is pulled by a force of 30 N at an angle of 37° to the horizontal. If the coefficient of friction is 0.2, calculate the acceleration of the object.",
          marks: 6,
          modelAnswer: "Horizontal component of applied force: Fx = 30 cos 37° = 24 N\nVertical component: Fy = 30 sin 37° = 18 N\nNormal force: N = mg - Fy = 5 × 10 - 18 = 32 N\nFriction force: f = μN = 0.2 × 32 = 6.4 N\nNet horizontal force: F_net = 24 - 6.4 = 17.6 N\nAcceleration: a = F_net/m = 17.6/5 = 3.52 m/s²",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for resolving forces correctly",
              "2 marks for calculating normal and friction forces",
              "2 marks for correct final acceleration"
            ]
          },
          specReference: "M2.1"
        },
        {
          id: "mech-3",
          questionText: "A projectile is launched at 25 m/s at an angle of 60° to the horizontal. Calculate: (a) the maximum height reached, (b) the range of the projectile.",
          marks: 8,
          modelAnswer: "Initial velocity components:\nux = 25 cos 60° = 12.5 m/s\nuy = 25 sin 60° = 21.65 m/s\n(a) At maximum height, vy = 0\nv² = u² + 2as gives: 0 = (21.65)² - 2 × 10 × h\nh = 468.9/20 = 23.4 m\n(b) Time of flight: t = 2uy/g = 2 × 21.65/10 = 4.33 s\nRange = ux × t = 12.5 × 4.33 = 54.1 m",
          markingCriteria: {
            ao1: 3,
            ao2: 5,
            ao3: 0,
            breakdown: [
              "2 marks for resolving initial velocity",
              "3 marks for maximum height calculation",
              "3 marks for range calculation"
            ]
          },
          specReference: "M3.1"
        },
        {
          id: "mech-4",
          questionText: "A 2 kg block slides down a frictionless inclined plane of angle 30°. Calculate: (a) the acceleration down the plane, (b) the normal force on the block.",
          marks: 5,
          modelAnswer: "(a) Component of weight down the plane: mg sin 30° = 2 × 10 × 0.5 = 10 N\nAcceleration: a = F/m = 10/2 = 5 m/s²\n(b) Normal force = mg cos 30° = 2 × 10 × (√3/2) = 17.3 N",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for resolving weight components",
              "2 marks for correct acceleration",
              "1 mark for correct normal force"
            ]
          },
          specReference: "M2.2"
        },
        {
          id: "mech-5",
          questionText: "Two objects of masses 3 kg and 5 kg are connected by a string over a pulley. Calculate the acceleration of the system and the tension in the string.",
          marks: 6,
          modelAnswer: "Let a be the acceleration and T be the tension\nFor 5 kg mass: 5g - T = 5a\nFor 3 kg mass: T - 3g = 3a\nAdding equations: 5g - 3g = 8a\n2g = 8a, so a = g/4 = 2.5 m/s²\nTension: T = 3g + 3a = 30 + 7.5 = 37.5 N",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for setting up equations for both masses",
              "2 marks for solving for acceleration",
              "2 marks for calculating tension"
            ]
          },
          specReference: "M2.3"
        },
        {
          id: "mech-6",
          questionText: "A car of mass 1200 kg traveling at 20 m/s brakes to a stop in 50 m. Calculate: (a) the deceleration, (b) the braking force.",
          marks: 4,
          modelAnswer: "(a) Using v² = u² + 2as: 0² = 20² + 2a(50)\n0 = 400 + 100a\na = -4 m/s²\n(b) Braking force = ma = 1200 × 4 = 4800 N",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct use of kinematic equation",
              "1 mark for correct deceleration",
              "1 mark for correct braking force"
            ]
          },
          specReference: "M1.2"
        },
        {
          id: "mech-7",
          questionText: "A satellite orbits Earth at a height of 400 km above the surface. Given Earth's radius is 6400 km and g = 9.8 m/s², calculate the orbital speed.",
          marks: 5,
          modelAnswer: "Orbital radius: r = 6400 + 400 = 6800 km = 6.8 × 10⁶ m\nFor circular orbit: mg = mv²/r\nAt height h: g' = g(R/(R+h))² = 9.8 × (6400/6800)² = 8.7 m/s²\nOrbital speed: v = √(g'r) = √(8.7 × 6.8 × 10⁶) = 7700 m/s",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for calculating orbital radius",
              "2 marks for adjusting g for altitude",
              "2 marks for correct orbital speed calculation"
            ]
          },
          specReference: "M4.1"
        },
        {
          id: "mech-8",
          questionText: "A 0.5 kg ball is thrown vertically upward with initial velocity 15 m/s. Calculate: (a) the time to reach maximum height, (b) the maximum height reached.",
          marks: 4,
          modelAnswer: "(a) At maximum height, v = 0\nUsing v = u + at: 0 = 15 - 10t\nt = 1.5 s\n(b) Using s = ut + ½at²: s = 15 × 1.5 - ½ × 10 × 1.5²\ns = 22.5 - 11.25 = 11.25 m",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct equation v = u + at",
              "1 mark for time to maximum height",
              "2 marks for maximum height calculation"
            ]
          },
          specReference: "M1.3"
        },
        {
          id: "mech-9",
          questionText: "A uniform rod of length 2 m and mass 5 kg is pivoted at its center. Forces of 20 N and 15 N are applied at the ends perpendicular to the rod. Calculate the net torque about the pivot.",
          marks: 4,
          modelAnswer: "Distance from pivot to each end = 1 m\nTorque from 20 N force = 20 × 1 = 20 N⋅m (clockwise)\nTorque from 15 N force = 15 × 1 = 15 N⋅m (anticlockwise)\nNet torque = 20 - 15 = 5 N⋅m (clockwise)",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for identifying moment arms",
              "2 marks for calculating individual torques",
              "1 mark for correct net torque"
            ]
          },
          specReference: "M5.1"
        },
        {
          id: "mech-10",
          questionText: "A 1000 kg car moving at 30 m/s collides with a stationary 1500 kg truck. After collision, they move together. Calculate their common velocity after collision.",
          marks: 4,
          modelAnswer: "Using conservation of momentum:\nBefore collision: p = m₁u₁ + m₂u₂ = 1000 × 30 + 1500 × 0 = 30,000 kg⋅m/s\nAfter collision: p = (m₁ + m₂)v = (1000 + 1500)v = 2500v\nTherefore: 30,000 = 2500v\nv = 12 m/s",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for stating conservation of momentum",
              "2 marks for correct application of momentum conservation",
              "1 mark for correct final velocity"
            ]
          },
          specReference: "M6.1"
        }
      ]
    },
    "Electricity": {
      questions: [
        {
          id: "elec-1",
          questionText: "A circuit contains three resistors of 4Ω, 6Ω, and 12Ω connected in parallel to a 12V battery. Calculate: (a) the total resistance, (b) the total current.",
          marks: 5,
          modelAnswer: "(a) For parallel resistors: 1/R = 1/4 + 1/6 + 1/12 = 3/12 + 2/12 + 1/12 = 6/12 = 1/2\nR = 2Ω\n(b) Total current: I = V/R = 12/2 = 6A",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct parallel resistance formula",
              "2 marks for correct total resistance calculation",
              "1 mark for correct total current"
            ]
          },
          specReference: "E1.1"
        },
        {
          id: "elec-2",
          questionText: "A 60W light bulb operates at 240V. Calculate: (a) the current through the bulb, (b) the resistance of the bulb.",
          marks: 4,
          modelAnswer: "(a) Power P = VI, so I = P/V = 60/240 = 0.25A\n(b) Using V = IR: R = V/I = 240/0.25 = 960Ω",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct power equation P = VI",
              "1 mark for correct current calculation",
              "2 marks for correct resistance calculation"
            ]
          },
          specReference: "E1.2"
        },
        {
          id: "elec-3",
          questionText: "Two capacitors of 4μF and 6μF are connected in series to a 100V supply. Calculate: (a) the total capacitance, (b) the charge on each capacitor.",
          marks: 6,
          modelAnswer: "(a) For series capacitors: 1/C = 1/4 + 1/6 = 3/12 + 2/12 = 5/12\nC = 12/5 = 2.4μF\n(b) In series, charge is same on both: Q = CV = 2.4 × 10⁻⁶ × 100 = 2.4 × 10⁻⁴ C",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for correct series capacitance formula",
              "2 marks for total capacitance calculation",
              "2 marks for charge calculation"
            ]
          },
          specReference: "E2.1"
        },
        {
          id: "elec-4",
          questionText: "An electric field of strength 500 N/C acts on a charge of 2 × 10⁻⁶ C. Calculate: (a) the force on the charge, (b) the work done in moving the charge 0.1 m in the direction of the field.",
          marks: 4,
          modelAnswer: "(a) Force F = qE = 2 × 10⁻⁶ × 500 = 1 × 10⁻³ N\n(b) Work done W = Fd = 1 × 10⁻³ × 0.1 = 1 × 10⁻⁴ J",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct equation F = qE",
              "1 mark for correct force calculation",
              "2 marks for correct work calculation"
            ]
          },
          specReference: "E3.1"
        },
        {
          id: "elec-5",
          questionText: "A wire of length 2 m and cross-sectional area 1 mm² has a resistance of 0.5Ω. Calculate the resistivity of the material.",
          marks: 3,
          modelAnswer: "Using R = ρL/A\n0.5 = ρ × 2/(1 × 10⁻⁶)\nρ = 0.5 × 1 × 10⁻⁶/2 = 2.5 × 10⁻⁷ Ω⋅m",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct resistivity formula",
              "1 mark for correct substitution",
              "1 mark for correct final answer"
            ]
          },
          specReference: "E1.3"
        },
        {
          id: "elec-6",
          questionText: "A battery with EMF 12V and internal resistance 2Ω is connected to an external resistance of 10Ω. Calculate: (a) the current in the circuit, (b) the terminal voltage of the battery.",
          marks: 5,
          modelAnswer: "(a) Total resistance = 2 + 10 = 12Ω\nCurrent I = EMF/R_total = 12/12 = 1A\n(b) Terminal voltage = EMF - I × r = 12 - 1 × 2 = 10V",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for calculating total resistance",
              "2 marks for correct current calculation",
              "2 marks for correct terminal voltage"
            ]
          },
          specReference: "E1.4"
        },
        {
          id: "elec-7",
          questionText: "A solenoid with 500 turns and length 0.2 m carries a current of 2A. Calculate the magnetic field inside the solenoid. (μ₀ = 4π × 10⁻⁷ H/m)",
          marks: 4,
          modelAnswer: "Magnetic field inside solenoid: B = μ₀nI\nwhere n = N/L = 500/0.2 = 2500 turns/m\nB = 4π × 10⁻⁷ × 2500 × 2 = 6.28 × 10⁻³ T",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct formula B = μ₀nI",
              "1 mark for calculating n = N/L",
              "2 marks for correct magnetic field calculation"
            ]
          },
          specReference: "E4.1"
        },
        {
          id: "elec-8",
          questionText: "An AC voltage is given by V = 100 sin(100πt). Calculate: (a) the peak voltage, (b) the RMS voltage, (c) the frequency.",
          marks: 5,
          modelAnswer: "(a) Peak voltage V₀ = 100V\n(b) RMS voltage = V₀/√2 = 100/√2 = 70.7V\n(c) ω = 100π, so f = ω/2π = 100π/2π = 50 Hz",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for identifying peak voltage",
              "2 marks for correct RMS calculation",
              "2 marks for correct frequency calculation"
            ]
          },
          specReference: "E5.1"
        },
        {
          id: "elec-9",
          questionText: "A transformer has 200 turns in the primary coil and 50 turns in the secondary coil. If the primary voltage is 240V, calculate: (a) the secondary voltage, (b) the turns ratio.",
          marks: 4,
          modelAnswer: "(a) For ideal transformer: Vs/Vp = Ns/Np\nVs = Vp × Ns/Np = 240 × 50/200 = 60V\n(b) Turns ratio = Np:Ns = 200:50 = 4:1",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct transformer equation",
              "2 marks for correct secondary voltage",
              "1 mark for correct turns ratio"
            ]
          },
          specReference: "E5.2"
        },
        {
          id: "elec-10",
          questionText: "A parallel plate capacitor has plates of area 0.01 m² separated by 2 mm of air. Calculate the capacitance. (ε₀ = 8.85 × 10⁻¹² F/m)",
          marks: 3,
          modelAnswer: "Capacitance C = ε₀A/d\nC = 8.85 × 10⁻¹² × 0.01/(2 × 10⁻³)\nC = 8.85 × 10⁻¹⁴/2 × 10⁻³ = 4.43 × 10⁻¹¹ F = 44.3 pF",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct capacitance formula",
              "1 mark for correct substitution",
              "1 mark for correct final answer"
            ]
          },
          specReference: "E2.2"
        }
      ]
    },
    "Waves": {
      questions: [
        {
          id: "wave-1",
          questionText: "A wave has frequency 50 Hz and wavelength 6 m. Calculate: (a) the wave speed, (b) the period of the wave.",
          marks: 4,
          modelAnswer: "(a) Wave speed v = fλ = 50 × 6 = 300 m/s\n(b) Period T = 1/f = 1/50 = 0.02 s",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct wave equation v = fλ",
              "1 mark for correct wave speed",
              "1 mark for correct period formula T = 1/f",
              "1 mark for correct period"
            ]
          },
          specReference: "W1.1"
        },
        {
          id: "wave-2",
          questionText: "Light of wavelength 600 nm passes through a single slit of width 0.1 mm. Calculate the angle to the first minimum in the diffraction pattern.",
          marks: 4,
          modelAnswer: "For single slit diffraction, first minimum occurs when:\na sin θ = λ\nsin θ = λ/a = 600 × 10⁻⁹/(0.1 × 10⁻³) = 6 × 10⁻³\nθ = sin⁻¹(6 × 10⁻³) = 0.34°",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct diffraction condition",
              "2 marks for correct calculation",
              "1 mark for correct angle"
            ]
          },
          specReference: "W2.1"
        },
        {
          id: "wave-3",
          questionText: "Two coherent sources produce waves with path difference of 1.5λ. Determine whether this results in constructive or destructive interference and explain why.",
          marks: 3,
          modelAnswer: "Path difference = 1.5λ = (3/2)λ\nFor constructive interference: path difference = nλ (where n = 0, 1, 2, ...)\nFor destructive interference: path difference = (n + ½)λ\nSince 1.5 = 1 + ½, this gives destructive interference.",
          markingCriteria: {
            ao1: 1,
            ao2: 1,
            ao3: 1,
            breakdown: [
              "1 mark for identifying path difference conditions",
              "1 mark for correct classification as destructive",
              "1 mark for clear explanation"
            ]
          },
          specReference: "W3.1"
        },
        {
          id: "wave-4",
          questionText: "A sound wave travels at 340 m/s in air. If the frequency is 440 Hz, calculate: (a) the wavelength, (b) the time for the wave to travel 1 km.",
          marks: 4,
          modelAnswer: "(a) Wavelength λ = v/f = 340/440 = 0.77 m\n(b) Time t = distance/speed = 1000/340 = 2.94 s",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct wavelength formula",
              "1 mark for correct wavelength",
              "1 mark for correct time formula",
              "1 mark for correct time"
            ]
          },
          specReference: "W1.2"
        },
        {
          id: "wave-5",
          questionText: "In Young's double slit experiment, slits separated by 0.5 mm produce fringes on a screen 2 m away. If the fringe separation is 2.4 mm, calculate the wavelength of light used.",
          marks: 5,
          modelAnswer: "For Young's double slit: fringe separation w = λD/a\nwhere w = 2.4 mm, D = 2 m, a = 0.5 mm\nλ = wa/D = (2.4 × 10⁻³ × 0.5 × 10⁻³)/2\nλ = 1.2 × 10⁻⁶/2 = 6 × 10⁻⁷ m = 600 nm",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct Young's slit formula",
              "2 marks for correct substitution and calculation",
              "1 mark for correct wavelength"
            ]
          },
          specReference: "W3.2"
        },
        {
          id: "wave-6",
          questionText: "A wave on a string is described by y = 0.05 sin(10πt - 2πx), where y and x are in meters and t in seconds. Find: (a) amplitude, (b) frequency, (c) wavelength.",
          marks: 6,
          modelAnswer: "Comparing with y = A sin(ωt - kx):\n(a) Amplitude A = 0.05 m\n(b) ω = 10π, so f = ω/2π = 10π/2π = 5 Hz\n(c) k = 2π, so λ = 2π/k = 2π/2π = 1 m",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for identifying amplitude",
              "2 marks for correct frequency calculation",
              "3 marks for correct wavelength calculation"
            ]
          },
          specReference: "W1.3"
        },
        {
          id: "wave-7",
          questionText: "A Doppler radar measures the speed of a car. If the transmitted frequency is 10 GHz and the received frequency is 10.000067 GHz, calculate the speed of the car.",
          marks: 5,
          modelAnswer: "For radar (double Doppler shift): Δf/f = 2v/c\nΔf = 10.000067 - 10 = 0.000067 GHz = 67 kHz\nf = 10 GHz = 10¹⁰ Hz\n67 × 10³/(10 × 10⁹) = 2v/(3 × 10⁸)\nv = (67 × 10³ × 3 × 10⁸)/(2 × 10 × 10⁹) = 10.05 m/s",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct Doppler formula for radar",
              "2 marks for correct calculation setup",
              "1 mark for correct final speed"
            ]
          },
          specReference: "W4.1"
        },
        {
          id: "wave-8",
          questionText: "A standing wave is formed on a string of length 1.2 m fixed at both ends. If the wave speed is 400 m/s, calculate the frequencies of the first three harmonics.",
          marks: 5,
          modelAnswer: "For string fixed at both ends: fn = nv/2L\nwhere n = 1, 2, 3, ...\nf₁ = 1 × 400/(2 × 1.2) = 166.7 Hz\nf₂ = 2 × 400/(2 × 1.2) = 333.3 Hz\nf₃ = 3 × 400/(2 × 1.2) = 500 Hz",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct standing wave formula",
              "1 mark for each correct harmonic frequency"
            ]
          },
          specReference: "W5.1"
        },
        {
          id: "wave-9",
          questionText: "Light travels from air (n = 1.0) into glass (n = 1.5) at an angle of incidence of 30°. Calculate: (a) the angle of refraction, (b) the critical angle for total internal reflection.",
          marks: 6,
          modelAnswer: "(a) Using Snell's law: n₁ sin θ₁ = n₂ sin θ₂\n1.0 × sin 30° = 1.5 × sin θ₂\nsin θ₂ = 0.5/1.5 = 0.333\nθ₂ = 19.5°\n(b) Critical angle: sin θc = n₂/n₁ = 1.0/1.5 = 0.667\nθc = 41.8°",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for correct application of Snell's law",
              "2 marks for angle of refraction",
              "2 marks for critical angle calculation"
            ]
          },
          specReference: "W6.1"
        },
        {
          id: "wave-10",
          questionText: "An electromagnetic wave has electric field amplitude of 100 V/m. Calculate: (a) the magnetic field amplitude, (b) the intensity of the wave.",
          marks: 5,
          modelAnswer: "(a) For EM waves: B₀ = E₀/c = 100/(3 × 10⁸) = 3.33 × 10⁻⁷ T\n(b) Intensity I = ½ε₀cE₀²\nI = ½ × 8.85 × 10⁻¹² × 3 × 10⁸ × (100)²\nI = 13.3 W/m²",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct relationship B₀ = E₀/c",
              "1 mark for magnetic field amplitude",
              "2 marks for correct intensity calculation"
            ]
          },
          specReference: "W7.1"
        }
      ]
    }
  },
  "Chemistry": {
    "Organic Chemistry": {
      questions: [
        {
          id: "org-1",
          questionText: "Draw the structural formula for 2-methylbutanoic acid and identify the functional groups present.",
          marks: 4,
          modelAnswer: "Structure: CH₃-CH(CH₃)-CH₂-COOH\nFunctional groups: Carboxyl group (-COOH) and alkyl groups",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct structural formula",
              "1 mark for identifying carboxyl group",
              "1 mark for correct naming/identification"
            ]
          },
          specReference: "O1.1"
        },
        {
          id: "org-2",
          questionText: "Explain the mechanism of nucleophilic substitution in the reaction between bromoethane and hydroxide ions.",
          marks: 6,
          modelAnswer: "SN2 mechanism:\n1. OH⁻ approaches C-Br bond from opposite side\n2. Transition state forms with partial bonds\n3. C-Br bond breaks as C-OH bond forms\n4. Br⁻ leaves as ethanol is formed\nOverall: CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for identifying SN2 mechanism",
              "3 marks for correct mechanistic steps",
              "1 mark for overall equation"
            ]
          },
          specReference: "O2.1"
        },
        {
          id: "org-3",
          questionText: "Compare the boiling points of ethanol (78°C) and dimethyl ether (−24°C). Explain the difference in terms of intermolecular forces.",
          marks: 5,
          modelAnswer: "Ethanol has much higher boiling point due to hydrogen bonding between OH groups. The O-H bond is highly polar, allowing strong intermolecular hydrogen bonds. Dimethyl ether only has weaker van der Waals forces and dipole-dipole interactions as it lacks OH groups for hydrogen bonding.",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for identifying hydrogen bonding in ethanol",
              "2 marks for explaining weaker forces in ether",
              "1 mark for clear comparison and conclusion"
            ]
          },
          specReference: "O1.2"
        },
        {
          id: "org-4",
          questionText: "Write the equation for the complete combustion of propane and calculate the volume of oxygen required to burn 2.2 g of propane at STP.",
          marks: 6,
          modelAnswer: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O\nMolar mass of C₃H₈ = 44 g/mol\nMoles of propane = 2.2/44 = 0.05 mol\nMoles of O₂ required = 5 × 0.05 = 0.25 mol\nVolume at STP = 0.25 × 22.4 = 5.6 L",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for balanced combustion equation",
              "2 marks for mole calculations",
              "2 marks for volume calculation"
            ]
          },
          specReference: "O3.1"
        },
        {
          id: "org-5",
          questionText: "Describe the preparation of ethyl ethanoate from ethanoic acid and ethanol, including conditions and mechanism type.",
          marks: 7,
          modelAnswer: "Esterification reaction:\nCH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O\nConditions: Concentrated H₂SO₄ catalyst, heat under reflux\nMechanism: Nucleophilic acyl substitution\n1. Protonation of carbonyl oxygen\n2. Nucleophilic attack by ethanol\n3. Elimination of water\n4. Deprotonation to form ester",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for correct equation",
              "2 marks for conditions",
              "3 marks for mechanism description"
            ]
          },
          specReference: "O4.1"
        },
        {
          id: "org-6",
          questionText: "Identify the products formed when but-2-ene undergoes addition reactions with: (a) HBr, (b) Br₂, (c) H₂O/H⁺.",
          marks: 6,
          modelAnswer: "(a) HBr addition: CH₃CHBrCH₂CH₃ (2-bromobutane)\n(b) Br₂ addition: CH₃CHBrCHBrCH₃ (2,3-dibromobutane)\n(c) H₂O/H⁺ addition: CH₃CH(OH)CH₂CH₃ (butan-2-ol)",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for each correct product structure and name"
            ]
          },
          specReference: "O2.2"
        },
        {
          id: "org-7",
          questionText: "Explain why benzene undergoes substitution reactions rather than addition reactions, despite having multiple double bonds.",
          marks: 5,
          modelAnswer: "Benzene has delocalized π electrons forming a stable aromatic system. The π electrons are spread over all 6 carbon atoms, giving extra stability (resonance energy ≈ 150 kJ/mol). Addition reactions would destroy this aromaticity and stability, so substitution reactions occur instead to preserve the aromatic ring system.",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for explaining delocalization/aromaticity",
              "2 marks for stability concept",
              "1 mark for linking to reaction preference"
            ]
          },
          specReference: "O5.1"
        },
        {
          id: "org-8",
          questionText: "Calculate the percentage yield if 3.2 g of ethyl ethanoate is obtained from 2.4 g of ethanoic acid and excess ethanol.",
          marks: 5,
          modelAnswer: "CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O\nMolar masses: CH₃COOH = 60 g/mol, CH₃COOC₂H₅ = 88 g/mol\nMoles of ethanoic acid = 2.4/60 = 0.04 mol\nTheoretical yield = 0.04 × 88 = 3.52 g\nPercentage yield = (3.2/3.52) × 100% = 90.9%",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for balanced equation",
              "2 marks for theoretical yield calculation",
              "2 marks for percentage yield calculation"
            ]
          },
          specReference: "O4.2"
        },
        {
          id: "org-9",
          questionText: "Describe the test to distinguish between aldehydes and ketones, including observations and equations.",
          marks: 6,
          modelAnswer: "Tollens' reagent test:\nAldehydes: Positive test - silver mirror forms\nRCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag + 4NH₃ + 2H₂O\nKetones: Negative test - no reaction, no silver mirror\nAlternatively, Fehling's test: aldehydes give brick-red precipitate of Cu₂O, ketones show no reaction.",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for correct test identification",
              "2 marks for observations",
              "2 marks for chemical equations"
            ]
          },
          specReference: "O6.1"
        },
        {
          id: "org-10",
          questionText: "Explain the concept of optical isomerism using 2-bromobutanoic acid as an example. Draw the two enantiomers.",
          marks: 7,
          modelAnswer: "Optical isomerism occurs when a molecule has a chiral carbon (carbon bonded to 4 different groups). 2-bromobutanoic acid has a chiral carbon at C-2 bonded to: H, Br, CH₃, and COOH.\n\nTwo enantiomers exist that are non-superimposable mirror images. They rotate plane-polarized light in opposite directions but have identical physical and chemical properties otherwise.\n\n[Drawings would show the two 3D structures as mirror images]",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for explaining chirality concept",
              "2 marks for identifying chiral center",
              "2 marks for drawing enantiomers",
              "1 mark for properties explanation"
            ]
          },
          specReference: "O7.1"
        }
      ]
    },
    "Inorganic Chemistry": {
      questions: [
        {
          id: "inorg-1",
          questionText: "Write the electron configuration for Fe³⁺ and explain why iron can form multiple oxidation states.",
          marks: 4,
          modelAnswer: "Fe: [Ar] 3d⁶ 4s²\nFe³⁺: [Ar] 3d⁵ (loses 4s² and one 3d electron)\nIron can form multiple oxidation states because 3d and 4s electrons are close in energy, allowing variable numbers of electrons to be lost in bonding.",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct electron configurations",
              "2 marks for explanation of variable oxidation states"
            ]
          },
          specReference: "I1.1"
        },
        {
          id: "inorg-2",
          questionText: "Balance the redox equation: MnO₄⁻ + Fe²⁺ + H⁺ → Mn²⁺ + Fe³⁺ + H₂O",
          marks: 5,
          modelAnswer: "Half equations:\nReduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O\nOxidation: Fe²⁺ → Fe³⁺ + e⁻\nBalanced equation: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for correct half equations",
              "3 marks for balanced overall equation"
            ]
          },
          specReference: "I2.1"
        },
        {
          id: "inorg-3",
          questionText: "Explain the trend in atomic radius across Period 3 from Na to Cl.",
          marks: 4,
          modelAnswer: "Atomic radius decreases from Na to Cl. As we move across the period, nuclear charge increases while the number of electron shells remains constant. The increased nuclear charge pulls the electrons closer, resulting in smaller atomic radius. Effective nuclear charge increases as shielding remains approximately constant.",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for stating the trend",
              "2 marks for explaining nuclear charge effect",
              "1 mark for mentioning shielding/effective nuclear charge"
            ]
          },
          specReference: "I1.2"
        },
        {
          id: "inorg-4",
          questionText: "Calculate the pH of 0.1 M HCl solution and 0.1 M NaOH solution.",
          marks: 4,
          modelAnswer: "For 0.1 M HCl (strong acid):\n[H⁺] = 0.1 M\npH = -log[H⁺] = -log(0.1) = 1\n\nFor 0.1 M NaOH (strong base):\n[OH⁻] = 0.1 M\npOH = -log[OH⁻] = 1\npH = 14 - pOH = 14 - 1 = 13",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct HCl pH calculation",
              "2 marks for correct NaOH pH calculation"
            ]
          },
          specReference: "I3.1"
        },
        {
          id: "inorg-5",
          questionText: "Describe the structure and bonding in sodium chloride, explaining why it has a high melting point.",
          marks: 6,
          modelAnswer: "NaCl has an ionic crystal structure with Na⁺ and Cl⁻ ions arranged in a cubic lattice. Each Na⁺ is surrounded by 6 Cl⁻ ions and vice versa. Bonding is ionic - electrostatic attraction between oppositely charged ions. High melting point (801°C) due to strong ionic bonds requiring significant energy to break the lattice structure.",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for describing crystal structure",
              "2 marks for explaining ionic bonding",
              "2 marks for linking structure to melting point"
            ]
          },
          specReference: "I4.1"
        },
        {
          id: "inorg-6",
          questionText: "Write equations for the reactions of chlorine with: (a) sodium hydroxide (cold), (b) sodium hydroxide (hot).",
          marks: 4,
          modelAnswer: "(a) Cold NaOH: Cl₂ + 2NaOH → NaCl + NaClO + H₂O\n(b) Hot NaOH: 3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct cold NaOH equation",
              "2 marks for correct hot NaOH equation"
            ]
          },
          specReference: "I5.1"
        },
        {
          id: "inorg-7",
          questionText: "Explain why ammonia acts as a base and write the equation for its reaction with hydrochloric acid.",
          marks: 4,
          modelAnswer: "Ammonia acts as a base because it has a lone pair of electrons on nitrogen that can accept a proton (H⁺). It's a Brønsted-Lowry base.\nNH₃ + HCl → NH₄Cl\nOr: NH₃ + H⁺ → NH₄⁺",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for explaining lone pair/proton acceptance",
              "2 marks for correct chemical equation"
            ]
          },
          specReference: "I3.2"
        },
        {
          id: "inorg-8",
          questionText: "Calculate the mass of copper produced when 2.0 A current is passed through copper(II) sulfate solution for 30 minutes.",
          marks: 5,
          modelAnswer: "At cathode: Cu²⁺ + 2e⁻ → Cu\nCharge = I × t = 2.0 × (30 × 60) = 3600 C\nMoles of electrons = 3600/96500 = 0.0373 mol\nMoles of Cu = 0.0373/2 = 0.0187 mol\nMass of Cu = 0.0187 × 63.5 = 1.19 g",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for electrode equation",
              "2 marks for charge and electron calculations",
              "2 marks for mass calculation"
            ]
          },
          specReference: "I6.1"
        },
        {
          id: "inorg-9",
          questionText: "Describe the test for sulfate ions and write the ionic equation for the reaction.",
          marks: 4,
          modelAnswer: "Test: Add dilute HCl followed by barium chloride solution\nObservation: White precipitate forms if sulfate ions present\nIonic equation: Ba²⁺ + SO₄²⁻ → BaSO₄(s)\nHCl removes interfering ions like CO₃²⁻",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct test procedure",
              "1 mark for observation",
              "1 mark for ionic equation"
            ]
          },
          specReference: "I7.1"
        },
        {
          id: "inorg-10",
          questionText: "Explain the trend in first ionization energy down Group 1 and across Period 2.",
          marks: 6,
          modelAnswer: "Down Group 1: Ionization energy decreases\n- Atomic radius increases\n- Outer electron further from nucleus\n- Increased shielding by inner electrons\n- Weaker attraction, easier to remove electron\n\nAcross Period 2: Ionization energy increases\n- Nuclear charge increases\n- Atomic radius decreases\n- Stronger attraction to outer electrons",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "3 marks for Group 1 trend explanation",
              "3 marks for Period 2 trend explanation"
            ]
          },
          specReference: "I1.3"
        }
      ]
    },
    "Physical Chemistry": {
      questions: [
        {
          id: "phys-1",
          questionText: "Calculate the enthalpy change for the reaction: C₂H₄ + H₂ → C₂H₆, given the bond enthalpies: C=C (612 kJ/mol), H-H (436 kJ/mol), C-H (412 kJ/mol), C-C (348 kJ/mol).",
          marks: 5,
          modelAnswer: "Bonds broken: 1 × C=C + 1 × H-H = 612 + 436 = 1048 kJ/mol\nBonds formed: 1 × C-C + 2 × C-H = 348 + 2(412) = 1172 kJ/mol\nΔH = Bonds broken - Bonds formed = 1048 - 1172 = -124 kJ/mol",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for identifying bonds broken and formed",
              "2 marks for correct calculations",
              "1 mark for correct final answer with sign"
            ]
          },
          specReference: "P1.1"
        },
        {
          id: "phys-2",
          questionText: "For the reaction N₂O₄(g) ⇌ 2NO₂(g), Kc = 0.36 at 100°C. If initial concentration of N₂O₄ is 0.5 M, calculate the equilibrium concentrations.",
          marks: 6,
          modelAnswer: "Let x = moles of N₂O₄ that dissociate\n[N₂O₄] = 0.5 - x, [NO₂] = 2x\nKc = [NO₂]²/[N₂O₄] = (2x)²/(0.5 - x) = 0.36\n4x² = 0.36(0.5 - x)\n4x² + 0.36x - 0.18 = 0\nSolving: x = 0.18\n[N₂O₄] = 0.32 M, [NO₂] = 0.36 M",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for setting up ICE table/equilibrium expressions",
              "3 marks for solving quadratic equation",
              "1 mark for final concentrations"
            ]
          },
          specReference: "P2.1"
        },
        {
          id: "phys-3",
          questionText: "Calculate the pH of a buffer solution containing 0.1 M CH₃COOH and 0.15 M CH₃COONa. (Ka for CH₃COOH = 1.8 × 10⁻⁵)",
          marks: 5,
          modelAnswer: "Using Henderson-Hasselbalch equation:\npH = pKa + log([A⁻]/[HA])\npKa = -log(1.8 × 10⁻⁵) = 4.74\npH = 4.74 + log(0.15/0.1) = 4.74 + log(1.5) = 4.74 + 0.18 = 4.92",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for Henderson-Hasselbalch equation",
              "2 marks for calculating pKa",
              "2 marks for final pH calculation"
            ]
          },
          specReference: "P3.1"
        },
        {
          id: "phys-4",
          questionText: "The rate equation for a reaction is: rate = k[A]²[B]. If [A] is doubled and [B] is tripled, by what factor does the rate increase?",
          marks: 3,
          modelAnswer: "Initial rate = k[A]²[B]\nNew rate = k[2A]²[3B] = k × 4[A]² × 3[B] = 12k[A]²[B]\nRate increases by factor of 12",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for setting up rate expressions",
              "1 mark for correct substitution",
              "1 mark for correct factor"
            ]
          },
          specReference: "P4.1"
        },
        {
          id: "phys-5",
          questionText: "Calculate the standard cell potential for the reaction: Zn + Cu²⁺ → Zn²⁺ + Cu, given E°(Zn²⁺/Zn) = -0.76 V and E°(Cu²⁺/Cu) = +0.34 V.",
          marks: 4,
          modelAnswer: "E°cell = E°cathode - E°anode\nCathode (reduction): Cu²⁺ + 2e⁻ → Cu, E° = +0.34 V\nAnode (oxidation): Zn → Zn²⁺ + 2e⁻, E° = -0.76 V\nE°cell = 0.34 - (-0.76) = 0.34 + 0.76 = +1.10 V",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for identifying cathode and anode",
              "2 marks for correct calculation"
            ]
          },
          specReference: "P5.1"
        },
        {
          id: "phys-6",
          questionText: "Using collision theory, explain why increasing temperature increases reaction rate.",
          marks: 4,
          modelAnswer: "Higher temperature increases kinetic energy of molecules. More molecules have energy ≥ activation energy (Ea). Frequency of effective collisions increases. Also, molecules move faster so collision frequency increases. Both factors lead to increased reaction rate.",
          markingCriteria: {
            ao1: 2,
            ao2: 1,
            ao3: 1,
            breakdown: [
              "2 marks for explaining activation energy concept",
              "1 mark for collision frequency",
              "1 mark for clear conclusion"
            ]
          },
          specReference: "P4.2"
        },
        {
          id: "phys-7",
          questionText: "Calculate the entropy change when 1 mole of ice melts at 0°C. (ΔHfusion = 6.01 kJ/mol)",
          marks: 3,
          modelAnswer: "ΔS = ΔH/T\nT = 0°C = 273 K\nΔS = 6010 J/mol / 273 K = 22.0 J K⁻¹ mol⁻¹",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct formula",
              "1 mark for temperature conversion",
              "1 mark for correct calculation"
            ]
          },
          specReference: "P1.2"
        },
        {
          id: "phys-8",
          questionText: "For a first-order reaction with half-life 20 minutes, calculate the rate constant and the time for 75% completion.",
          marks: 5,
          modelAnswer: "For first-order: k = ln2/t₁/₂ = 0.693/20 = 0.0347 min⁻¹\nFor 75% completion, 25% remains:\nln([A]/[A₀]) = -kt\nln(0.25) = -0.0347 × t\n-1.386 = -0.0347t\nt = 40 minutes (2 half-lives)",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for calculating rate constant",
              "3 marks for time calculation"
            ]
          },
          specReference: "P4.3"
        },
        {
          id: "phys-9",
          questionText: "Calculate the solubility of AgCl in water given Ksp = 1.8 × 10⁻¹⁰.",
          marks: 3,
          modelAnswer: "AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)\nLet solubility = s mol/L\n[Ag⁺] = [Cl⁻] = s\nKsp = [Ag⁺][Cl⁻] = s²\n1.8 × 10⁻¹⁰ = s²\ns = 1.34 × 10⁻⁵ mol/L",
          markingCriteria: {
            ao1: 1,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for equilibrium expression",
              "1 mark for setting up Ksp equation",
              "1 mark for correct solubility"
            ]
          },
          specReference: "P2.2"
        },
        {
          id: "phys-10",
          questionText: "Calculate the work done when 2 moles of ideal gas expand isothermally from 1 L to 5 L at 300 K.",
          marks: 4,
          modelAnswer: "For isothermal expansion of ideal gas:\nw = -nRT ln(Vf/Vi)\nw = -2 × 8.314 × 300 × ln(5/1)\nw = -4988 × ln(5)\nw = -4988 × 1.609 = -8025 J = -8.03 kJ",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "1 mark for correct formula",
              "2 marks for substitution and calculation",
              "1 mark for correct final answer with units"
            ]
          },
          specReference: "P1.3"
        }
      ]
    }
  },
  "Biology": {
    "Cell Biology": {
      questions: [
        {
          id: "cell-1",
          questionText: "Compare and contrast the structure and function of prokaryotic and eukaryotic cells.",
          marks: 8,
          modelAnswer: "Similarities: Both have cell membrane, cytoplasm, ribosomes, genetic material (DNA)\nDifferences:\nProkaryotic: No nucleus, DNA in nucleoid region, no membrane-bound organelles, smaller ribosomes (70S), cell wall present\nEukaryotic: Nucleus present, DNA in chromosomes, membrane-bound organelles (mitochondria, ER, Golgi), larger ribosomes (80S), may have cell wall (plants)",
          markingCriteria: {
            ao1: 4,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for similarities",
              "4 marks for structural differences",
              "2 marks for functional implications"
            ]
          },
          specReference: "B1.1"
        },
        {
          id: "cell-2",
          questionText: "Describe the process of mitosis and explain its biological significance.",
          marks: 10,
          modelAnswer: "Mitosis stages:\n1. Prophase: Chromosomes condense, nuclear envelope breaks down, spindle forms\n2. Metaphase: Chromosomes align at cell equator\n3. Anaphase: Sister chromatids separate and move to opposite poles\n4. Telophase: Nuclear envelopes reform, chromosomes decondense\n5. Cytokinesis: Cytoplasm divides\n\nSignificance: Growth, repair, asexual reproduction, maintains chromosome number, produces genetically identical cells",
          markingCriteria: {
            ao1: 5,
            ao2: 4,
            ao3: 1,
            breakdown: [
              "5 marks for describing mitosis stages",
              "3 marks for biological significance",
              "2 marks for clear organization and accuracy"
            ]
          },
          specReference: "B1.2"
        },
        {
          id: "cell-3",
          questionText: "Explain how the structure of a cell membrane relates to its functions.",
          marks: 6,
          modelAnswer: "Structure: Phospholipid bilayer with embedded proteins, cholesterol, and carbohydrates\nFunctions related to structure:\n- Selective permeability: Hydrophobic core allows lipid-soluble substances through\n- Protein channels/carriers: Allow specific transport of ions and polar molecules\n- Receptor proteins: Enable cell signaling\n- Cholesterol: Maintains membrane fluidity\n- Glycoproteins: Cell recognition and adhesion",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for membrane structure",
              "3 marks for structure-function relationships",
              "1 mark for clear examples"
            ]
          },
          specReference: "B1.3"
        },
        {
          id: "cell-4",
          questionText: "Describe the process of protein synthesis, from gene to protein.",
          marks: 8,
          modelAnswer: "Transcription (nucleus):\n1. DNA unwinds, RNA polymerase binds to promoter\n2. mRNA synthesized using DNA template\n3. mRNA processing: 5' cap, 3' poly-A tail, splicing\n\nTranslation (ribosome):\n1. mRNA binds to ribosome\n2. tRNA brings amino acids according to codon sequence\n3. Peptide bonds form between amino acids\n4. Protein chain elongates until stop codon reached\n5. Protein released and folds into functional shape",
          markingCriteria: {
            ao1: 4,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "3 marks for transcription process",
              "4 marks for translation process",
              "1 mark for overall accuracy"
            ]
          },
          specReference: "B2.1"
        },
        {
          id: "cell-5",
          questionText: "Explain the role of enzymes in cellular metabolism, including factors affecting enzyme activity.",
          marks: 7,
          modelAnswer: "Role of enzymes:\n- Biological catalysts that lower activation energy\n- Speed up metabolic reactions\n- Specific for particular substrates (lock and key/induced fit)\n\nFactors affecting activity:\n1. Temperature: Increases rate until denaturation occurs\n2. pH: Optimal pH for each enzyme, extremes cause denaturation\n3. Substrate concentration: Rate increases until saturation\n4. Enzyme concentration: More enzyme = faster rate\n5. Inhibitors: Competitive and non-competitive inhibition",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for enzyme role/mechanism",
              "4 marks for factors affecting activity",
              "1 mark for clear explanations"
            ]
          },
          specReference: "B1.4"
        },
        {
          id: "cell-6",
          questionText: "Compare aerobic and anaerobic respiration in terms of location, products, and ATP yield.",
          marks: 6,
          modelAnswer: "Aerobic respiration:\n- Location: Mitochondria (mainly)\n- Products: CO₂, H₂O, ATP\n- ATP yield: ~38 molecules per glucose\n- Requires oxygen\n\nAnaerobic respiration:\n- Location: Cytoplasm\n- Products: Lactate (animals) or ethanol + CO₂ (yeast)\n- ATP yield: 2 molecules per glucose\n- No oxygen required\n- Less efficient energy production",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "3 marks for aerobic respiration details",
              "3 marks for anaerobic respiration details"
            ]
          },
          specReference: "B1.5"
        },
        {
          id: "cell-7",
          questionText: "Describe the structure and function of chloroplasts in photosynthesis.",
          marks: 5,
          modelAnswer: "Structure:\n- Double membrane envelope\n- Thylakoids arranged in grana\n- Stroma (fluid-filled space)\n- Contains chlorophyll and other pigments\n\nFunction in photosynthesis:\n- Light reactions occur in thylakoids: light energy captured, ATP and NADPH produced\n- Calvin cycle occurs in stroma: CO₂ fixed into glucose using ATP and NADPH\n- Chlorophyll absorbs light energy for the process",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for chloroplast structure",
              "3 marks for function in photosynthesis"
            ]
          },
          specReference: "B1.6"
        },
        {
          id: "cell-8",
          questionText: "Explain the process of osmosis and its importance in plant and animal cells.",
          marks: 6,
          modelAnswer: "Osmosis: Movement of water across semi-permeable membrane from high water potential to low water potential\n\nIn plant cells:\n- Water enters by osmosis, creates turgor pressure\n- Maintains cell shape and plant structure\n- Cell wall prevents bursting\n\nIn animal cells:\n- Must maintain water balance\n- Hypotonic solutions cause swelling/bursting\n- Hypertonic solutions cause shrinkage\n- Homeostatic mechanisms regulate water content",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "2 marks for defining osmosis",
              "2 marks for importance in plant cells",
              "2 marks for importance in animal cells"
            ]
          },
          specReference: "B1.7"
        },
        {
          id: "cell-9",
          questionText: "Describe the cell cycle and explain how it is regulated.",
          marks: 7,
          modelAnswer: "Cell cycle phases:\n1. G1: Cell growth, organelle duplication\n2. S: DNA replication\n3. G2: Further growth, protein synthesis\n4. M: Mitosis and cytokinesis\n\nRegulation:\n- Checkpoints monitor cell cycle progression\n- G1/S checkpoint: DNA damage check\n- G2/M checkpoint: DNA replication check\n- Spindle checkpoint: Chromosome attachment check\n- Cyclins and CDKs control progression\n- p53 protein can halt cycle if problems detected",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "3 marks for cell cycle phases",
              "3 marks for regulation mechanisms",
              "1 mark for clear organization"
            ]
          },
          specReference: "B1.8"
        },
        {
          id: "cell-10",
          questionText: "Explain the difference between active and passive transport across cell membranes, giving examples.",
          marks: 6,
          modelAnswer: "Passive transport:\n- No energy required\n- Down concentration gradient\n- Examples: Simple diffusion (O₂, CO₂), facilitated diffusion (glucose via carriers), osmosis (water)\n\nActive transport:\n- Energy (ATP) required\n- Against concentration gradient\n- Examples: Sodium-potassium pump, uptake of minerals by plant roots\n- Can be primary (direct ATP use) or secondary (using ion gradients)",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "3 marks for passive transport with examples",
              "3 marks for active transport with examples"
            ]
          },
          specReference: "B1.9"
        }
      ]
    },
    "Genetics": {
      questions: [
        {
          id: "gen-1",
          questionText: "In pea plants, purple flowers (P) are dominant to white flowers (p). Cross a heterozygous purple-flowered plant with a white-flowered plant. Show the genetic cross and predict the phenotypic ratio.",
          marks: 5,
          modelAnswer: "Cross: Pp × pp\nGametes: P, p × p, p\nPunnett square:\n  P  p\np Pp pp\np Pp pp\n\nGenotypic ratio: 1 Pp : 1 pp\nPhenotypic ratio: 1 purple : 1 white (50% each)",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "1 mark for correct parental genotypes",
              "2 marks for Punnett square",
              "2 marks for correct ratios"
            ]
          },
          specReference: "G1.1"
        },
        {
          id: "gen-2",
          questionText: "Explain the difference between genotype and phenotype, using examples from human genetics.",
          marks: 4,
          modelAnswer: "Genotype: The genetic makeup/alleles an organism possesses\nPhenotype: The observable characteristics/traits expressed\n\nExamples:\n- ABO blood groups: Genotype IAIA or IAi = Phenotype Type A blood\n- Eye color: Genotype BB or Bb = Phenotype brown eyes\n- Cystic fibrosis: Genotype cc = Phenotype has cystic fibrosis\n\nPhenotype results from genotype interaction with environment",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for clear definitions",
              "2 marks for appropriate examples"
            ]
          },
          specReference: "G1.2"
        },
        {
          id: "gen-3",
          questionText: "Describe the process of meiosis and explain how it contributes to genetic variation.",
          marks: 8,
          modelAnswer: "Meiosis process:\n1. Prophase I: Homologous chromosomes pair, crossing over occurs\n2. Metaphase I: Bivalents align at equator\n3. Anaphase I: Homologous chromosomes separate\n4. Telophase I: First division complete\n5. Meiosis II: Similar to mitosis, sister chromatids separate\n\nGenetic variation sources:\n1. Crossing over: Exchange of genetic material between homologs\n2. Independent assortment: Random orientation of chromosome pairs\n3. Random fertilization: Any sperm can fertilize any egg",
          markingCriteria: {
            ao1: 4,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "4 marks for meiosis process",
              "3 marks for sources of variation",
              "1 mark for clear explanation"
            ]
          },
          specReference: "G1.3"
        },
        {
          id: "gen-4",
          questionText: "A man with type AB blood marries a woman with type O blood. What are the possible blood types of their children? Show your working.",
          marks: 4,
          modelAnswer: "Man: IAIB (Type AB)\nWoman: ii (Type O)\n\nCross: IAIB × ii\nGametes: IA, IB × i, i\n\nOffspring:\n- IAi (Type A blood)\n- IBi (Type B blood)\n\nPossible blood types: 50% Type A, 50% Type B\nNo Type AB or Type O children possible",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "2 marks for correct parental genotypes",
              "1 mark for genetic cross",
              "1 mark for correct offspring types"
            ]
          },
          specReference: "G1.4"
        },
        {
          id: "gen-5",
          questionText: "Explain sex-linked inheritance using color blindness as an example.",
          marks: 6,
          modelAnswer: "Sex-linked inheritance:\n- Genes located on X chromosome\n- Males more affected (XY - only one X)\n- Females can be carriers (XcX)\n\nColor blindness example:\n- Recessive allele (c) on X chromosome\n- Male genotypes: XCY (normal), XcY (color blind)\n- Female genotypes: XCXC (normal), XCXc (carrier), XcXc (color blind)\n\nInheritance pattern:\n- Affected males cannot pass to sons\n- All daughters of affected males are carriers\n- Carrier mothers have 50% chance of affected sons",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for explaining sex-linkage",
              "2 marks for color blindness genotypes",
              "2 marks for inheritance patterns"
            ]
          },
          specReference: "G1.5"
        },
        {
          id: "gen-6",
          questionText: "Describe the structure of DNA and explain how it replicates.",
          marks: 7,
          modelAnswer: "DNA structure:\n- Double helix with antiparallel strands\n- Sugar-phosphate backbone\n- Complementary base pairs: A-T, G-C\n- Hydrogen bonds between bases\n\nDNA replication:\n1. Helicase unwinds double helix\n2. DNA polymerase adds complementary nucleotides\n3. Leading strand: continuous synthesis\n4. Lagging strand: discontinuous (Okazaki fragments)\n5. Ligase joins fragments\n6. Semi-conservative: each new DNA has one original strand",
          markingCriteria: {
            ao1: 3,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "3 marks for DNA structure",
              "4 marks for replication process"
            ]
          },
          specReference: "G2.1"
        },
        {
          id: "gen-7",
          questionText: "Explain how mutations can affect protein structure and function.",
          marks: 5,
          modelAnswer: "Types of mutations:\n1. Point mutations: Single base changes\n   - Silent: No amino acid change\n   - Missense: Different amino acid\n   - Nonsense: Stop codon created\n\n2. Frameshift: Insertions/deletions changing reading frame\n\nEffects on proteins:\n- Change in amino acid sequence\n- Altered protein folding\n- Loss of function or altered function\n- Example: Sickle cell anemia (glutamic acid → valine)",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for types of mutations",
              "2 marks for effects on proteins",
              "1 mark for example"
            ]
          },
          specReference: "G2.2"
        },
        {
          id: "gen-8",
          questionText: "In a dihybrid cross between two heterozygous individuals (AaBb × AaBb), what is the expected phenotypic ratio? Show your working.",
          marks: 6,
          modelAnswer: "Cross: AaBb × AaBb\nGametes: AB, Ab, aB, ab (from each parent)\n\n16-square Punnett square gives:\n- A_B_: 9 (both dominant)\n- A_bb: 3 (A dominant, b recessive)\n- aaB_: 3 (a recessive, B dominant)\n- aabb: 1 (both recessive)\n\nPhenotypic ratio: 9:3:3:1\n\nThis assumes independent assortment of the two genes",
          markingCriteria: {
            ao1: 2,
            ao2: 4,
            ao3: 0,
            breakdown: [
              "2 marks for identifying gametes",
              "3 marks for correct ratio",
              "1 mark for mentioning independent assortment"
            ]
          },
          specReference: "G1.6"
        },
        {
          id: "gen-9",
          questionText: "Explain the role of genetic counseling and give examples of when it might be recommended.",
          marks: 5,
          modelAnswer: "Genetic counseling role:\n- Assess risk of genetic disorders\n- Provide information about inheritance patterns\n- Support decision-making about reproduction\n- Explain genetic test results\n\nWhen recommended:\n- Family history of genetic disorders\n- Advanced maternal age (>35)\n- Previous child with genetic condition\n- Consanguineous marriages\n- Ethnic groups with higher risk for specific disorders\n- Abnormal prenatal screening results",
          markingCriteria: {
            ao1: 2,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for role of genetic counseling",
              "3 marks for appropriate examples"
            ]
          },
          specReference: "G3.1"
        },
        {
          id: "gen-10",
          questionText: "Describe the genetic basis of cancer and explain how oncogenes and tumor suppressor genes are involved.",
          marks: 6,
          modelAnswer: "Genetic basis of cancer:\n- Multiple mutations accumulate over time\n- Loss of normal cell cycle control\n- Cells divide uncontrollably\n\nOncogenes:\n- Mutated versions of normal genes (proto-oncogenes)\n- Promote cell division when activated\n- Examples: RAS, MYC\n- Dominant mutations\n\nTumor suppressor genes:\n- Normal function: prevent uncontrolled division\n- Examples: p53, RB\n- Recessive mutations (both copies must be lost)\n- 'Two-hit hypothesis'",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for genetic basis explanation",
              "2 marks for oncogenes",
              "2 marks for tumor suppressor genes"
            ]
          },
          specReference: "G3.2"
        }
      ]
    },
    "Ecology": {
      questions: [
        {
          id: "eco-1",
          questionText: "Define ecosystem, population, and community. Explain the relationships between these terms.",
          marks: 5,
          modelAnswer: "Population: Group of individuals of the same species living in the same area\nCommunity: All populations of different species living and interacting in the same area\nEcosystem: Community plus the physical environment (abiotic factors)\n\nRelationships:\nPopulations → Communities → Ecosystems\nEach level includes the previous level plus additional components and interactions",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "3 marks for correct definitions",
              "2 marks for explaining relationships"
            ]
          },
          specReference: "E1.1"
        },
        {
          id: "eco-2",
          questionText: "Describe the carbon cycle and explain its importance in ecosystems.",
          marks: 8,
          modelAnswer: "Carbon cycle processes:\n1. Photosynthesis: CO₂ → organic compounds in plants\n2. Respiration: Organic compounds → CO₂ (all organisms)\n3. Decomposition: Dead organisms → CO₂ (by decomposers)\n4. Combustion: Fossil fuels → CO₂\n5. Ocean exchange: CO₂ ⇌ dissolved CO₂/carbonates\n\nImportance:\n- Maintains atmospheric CO₂ levels\n- Provides carbon for all organic molecules\n- Links all trophic levels\n- Affects global climate\n- Essential for life processes",
          markingCriteria: {
            ao1: 4,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "4 marks for describing cycle processes",
              "3 marks for explaining importance",
              "1 mark for clear organization"
            ]
          },
          specReference: "E2.1"
        },
        {
          id: "eco-3",
          questionText: "Explain the concept of ecological succession, distinguishing between primary and secondary succession.",
          marks: 6,
          modelAnswer: "Ecological succession: Gradual change in species composition over time\n\nPrimary succession:\n- Starts on bare rock/new land\n- No previous soil\n- Pioneer species (lichens, mosses)\n- Very slow process\n- Example: After volcanic eruption\n\nSecondary succession:\n- Starts on disturbed land with existing soil\n- Faster than primary\n- Pioneer species (grasses, weeds)\n- Example: After forest fire or farming abandonment\n\nBoth lead toward climax community (stable, mature ecosystem)",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "2 marks for defining succession",
              "2 marks for primary succession",
              "2 marks for secondary succession"
            ]
          },
          specReference: "E3.1"
        },
        {
          id: "eco-4",
          questionText: "Draw a food web for a woodland ecosystem and explain energy flow through trophic levels.",
          marks: 7,
          modelAnswer: "Food web components:\nProducers: Trees, shrubs, grasses\nPrimary consumers: Rabbits, deer, insects\nSecondary consumers: Foxes, birds, spiders\nTertiary consumers: Hawks, owls\nDecomposers: Bacteria, fungi\n\nEnergy flow:\n- Unidirectional flow from sun through trophic levels\n- ~10% energy transferred between levels (10% rule)\n- Most energy lost as heat through respiration\n- Pyramid of energy: Decreases at each level\n- Decomposers recycle nutrients but not energy",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "3 marks for appropriate food web",
              "3 marks for explaining energy flow",
              "1 mark for mentioning 10% rule"
            ]
          },
          specReference: "E4.1"
        },
        {
          id: "eco-5",
          questionText: "Explain how human activities have impacted biodiversity and suggest conservation strategies.",
          marks: 8,
          modelAnswer: "Human impacts on biodiversity:\n1. Habitat destruction (deforestation, urbanization)\n2. Pollution (chemicals, plastics, noise)\n3. Climate change (global warming)\n4. Overexploitation (overfishing, hunting)\n5. Invasive species introduction\n6. Fragmentation of habitats\n\nConservation strategies:\n1. Protected areas (national parks, reserves)\n2. Habitat restoration\n3. Captive breeding programs\n4. Sustainable resource use\n5. International cooperation (CITES)\n6. Education and awareness\n7. Genetic conservation (seed banks)",
          markingCriteria: {
            ao1: 4,
            ao2: 3,
            ao3: 1,
            breakdown: [
              "4 marks for human impacts",
              "3 marks for conservation strategies",
              "1 mark for clear examples"
            ]
          },
          specReference: "E5.1"
        },
        {
          id: "eco-6",
          questionText: "Describe the nitrogen cycle and explain why nitrogen fixation is important.",
          marks: 6,
          modelAnswer: "Nitrogen cycle:\n1. Nitrogen fixation: N₂ → NH₃ (by bacteria)\n2. Nitrification: NH₃ → NO₂⁻ → NO₃⁻\n3. Assimilation: Plants absorb NO₃⁻/NH₄⁺\n4. Decomposition: Organic N → NH₃\n5. Denitrification: NO₃⁻ → N₂ (back to atmosphere)\n\nImportance of nitrogen fixation:\n- Atmospheric N₂ is unreactive\n- Only certain bacteria can fix nitrogen\n- Converts N₂ to usable forms (NH₃)\n- Essential for amino acid/protein synthesis\n- Limits primary productivity in many ecosystems",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "3 marks for nitrogen cycle steps",
              "3 marks for importance of fixation"
            ]
          },
          specReference: "E2.2"
        },
        {
          id: "eco-7",
          questionText: "Explain the greenhouse effect and discuss its role in climate change.",
          marks: 6,
          modelAnswer: "Greenhouse effect:\n1. Solar radiation reaches Earth\n2. Earth's surface absorbs and re-emits as infrared\n3. Greenhouse gases absorb infrared radiation\n4. Heat trapped in atmosphere\n5. Natural process essential for life\n\nClimate change:\n- Enhanced greenhouse effect due to human activities\n- Increased CO₂, CH₄, N₂O concentrations\n- Global temperature rise\n- Effects: Sea level rise, extreme weather, ecosystem disruption\n- Positive feedback loops amplify warming",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 1,
            breakdown: [
              "3 marks for greenhouse effect mechanism",
              "2 marks for climate change connection",
              "1 mark for effects/consequences"
            ]
          },
          specReference: "E5.2"
        },
        {
          id: "eco-8",
          questionText: "Compare r-selected and K-selected species, giving examples of each.",
          marks: 5,
          modelAnswer: "r-selected species:\n- High reproductive rate\n- Small body size\n- Short lifespan\n- Little parental care\n- Opportunistic\n- Examples: Bacteria, insects, weeds\n\nK-selected species:\n- Low reproductive rate\n- Large body size\n- Long lifespan\n- Extensive parental care\n- Competitive\n- Examples: Elephants, humans, oak trees\n\nMost species show intermediate characteristics",
          markingCriteria: {
            ao1: 3,
            ao2: 2,
            ao3: 0,
            breakdown: [
              "3 marks for comparing characteristics",
              "2 marks for appropriate examples"
            ]
          },
          specReference: "E6.1"
        },
        {
          id: "eco-9",
          questionText: "Explain the concept of carrying capacity and factors that determine it.",
          marks: 5,
          modelAnswer: "Carrying capacity (K): Maximum population size that an environment can sustain indefinitely\n\nDetermining factors:\n1. Food availability\n2. Water supply\n3. Shelter/nesting sites\n4. Disease and parasites\n5. Predation pressure\n6. Competition (intra- and interspecific)\n7. Waste accumulation\n8. Climate conditions\n\nPopulation growth slows as it approaches carrying capacity due to increased competition and resource limitation",
          markingCriteria: {
            ao1: 2,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for defining carrying capacity",
              "3 marks for determining factors"
            ]
          },
          specReference: "E6.2"
        },
        {
          id: "eco-10",
          questionText: "Describe different types of symbiotic relationships with examples from nature.",
          marks: 6,
          modelAnswer: "Types of symbiosis:\n\n1. Mutualism: Both species benefit\n   - Examples: Lichens (algae + fungi), cleaner fish and large fish, flowers and pollinators\n\n2. Commensalism: One benefits, other unaffected\n   - Examples: Barnacles on whales, epiphytes on trees\n\n3. Parasitism: One benefits, other harmed\n   - Examples: Tapeworms in mammals, mistletoe on trees, fleas on dogs\n\nThese relationships can be obligate (essential) or facultative (optional)",
          markingCriteria: {
            ao1: 3,
            ao2: 3,
            ao3: 0,
            breakdown: [
              "2 marks for each type of symbiosis with examples"
            ]
          },
          specReference: "E7.1"
        }
      ]
    }
  }
};
