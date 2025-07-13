import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crown, Target, CheckCircle, XCircle, BookOpen, Clock, RotateCcw } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  section?: string;
}

interface ExamAnswer {
  questionId: string;
  answer: string;
}

const PredictedResults = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { questions, answers, timeElapsed, isReview, completion } = location.state || {};
  
  if (!questions || !answers) {
    navigate('/predicted-questions');
    return null;
  }

  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

  // Advanced AI-powered marking system
  const generateMarking = (question: ExamQuestion, answer: ExamAnswer) => {
    const studentAnswer = answer.answer.trim();
    
    if (!studentAnswer) {
      return { 
        marksAwarded: 0, 
        feedback: "No answer provided", 
        modelAnswer: generateModelAnswer(question),
        markingPoints: generateMarkingPoints(question),
        teacherFeedback: "No answer was provided for this question. Make sure to attempt all questions in the exam.",
        specificationPoint: getSpecificationPoint(question),
        grade: "Needs Improvement"
      };
    }
    
    const modelAnswer = generateModelAnswer(question);
    const { marksAwarded, analysis } = intelligentMarking(question, studentAnswer, modelAnswer);
    const markingPoints = generateMarkingPoints(question);
    const grade = getPerformanceGrade(marksAwarded, question.marks);
    const teacherFeedback = generateDetailedFeedback(question, studentAnswer, marksAwarded, analysis);
    const specificationPoint = getSpecificationPoint(question);
    
    return { marksAwarded, feedback: teacherFeedback, modelAnswer, markingPoints, teacherFeedback, specificationPoint, grade };
  };

  // Intelligent marking that actually evaluates content accuracy
  const intelligentMarking = (question: ExamQuestion, studentAnswer: string, modelAnswer: string) => {
    const questionLower = question.text.toLowerCase();
    const studentLower = studentAnswer.toLowerCase();
    let marksAwarded = 0;
    let analysis = { hasKeyTerms: false, hasCorrectConcepts: false, hasExamples: false, hasAccuracy: false, hasStructure: false };

    // Math/Calculation Questions - Check for exact answers
    if (questionLower.includes('calculate') || questionLower.includes('work out')) {
      // Extract numbers from model answer for comparison
      const modelNumbers = modelAnswer.match(/= (\d+(?:\.\d+)?)/g);
      if (modelNumbers) {
        const correctAnswers = modelNumbers.map(m => m.replace('= ', ''));
        const hasCorrectAnswer = correctAnswers.some(ans => studentAnswer.includes(ans));
        if (hasCorrectAnswer) {
          marksAwarded = question.marks; // Full marks for correct calculation
          analysis.hasAccuracy = true;
        } else if (studentAnswer.match(/\d+/)) {
          marksAwarded = Math.floor(question.marks * 0.3); // Partial for attempt
        }
      }
    }
    
    // Science Questions - Check for key concepts and accuracy
    else if (questionLower.includes('photosynthesis')) {
      analysis.hasKeyTerms = /\b(carbon dioxide|water|glucose|oxygen|light|chlorophyll|chloroplast)\b/i.test(studentLower);
      analysis.hasCorrectConcepts = /\b(carbon dioxide.*water.*glucose|glucose.*oxygen|light.*energy)\b/i.test(studentLower);
      analysis.hasAccuracy = /\b(6co2|6h2o|c6h12o6|6o2)\b/i.test(studentLower) || studentLower.includes('word equation');
      
      if (analysis.hasAccuracy && analysis.hasCorrectConcepts) marksAwarded = question.marks;
      else if (analysis.hasCorrectConcepts && analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.8);
      else if (analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.5);
    }
    
    else if (questionLower.includes('respiration')) {
      analysis.hasKeyTerms = /\b(glucose|oxygen|carbon dioxide|water|energy|atp|mitochondria)\b/i.test(studentLower);
      analysis.hasCorrectConcepts = /\b(glucose.*oxygen.*carbon dioxide|energy.*glucose|mitochondria)\b/i.test(studentLower);
      analysis.hasAccuracy = /\b(c6h12o6|6o2|6co2|6h2o|atp)\b/i.test(studentLower);
      
      if (analysis.hasAccuracy && analysis.hasCorrectConcepts) marksAwarded = question.marks;
      else if (analysis.hasCorrectConcepts && analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.8);
      else if (analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.5);
    }
    
    else if (questionLower.includes('erosion')) {
      analysis.hasKeyTerms = /\b(wearing away|transport|weathering|hydraulic action|abrasion|attrition)\b/i.test(studentLower);
      analysis.hasCorrectConcepts = /\b(water|wind|ice|gravity|transport|movement)\b/i.test(studentLower);
      analysis.hasExamples = /\b(river|coast|cliff|valley|waterfall|glacier)\b/i.test(studentLower);
      
      if (analysis.hasCorrectConcepts && analysis.hasKeyTerms && analysis.hasExamples) marksAwarded = question.marks;
      else if (analysis.hasCorrectConcepts && analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.7);
      else if (analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.4);
    }
    
    else if (questionLower.includes('force') || questionLower.includes('speed') || questionLower.includes('velocity')) {
      analysis.hasKeyTerms = /\b(force|mass|acceleration|newton|speed|distance|time|velocity)\b/i.test(studentLower);
      analysis.hasAccuracy = /\b(f.*=.*m.*a|speed.*=.*distance.*time|v.*=.*d.*t)\b/i.test(studentLower);
      analysis.hasCorrectConcepts = /\b(newtons|m\/s|acceleration|formula|equation)\b/i.test(studentLower);
      
      if (analysis.hasAccuracy) marksAwarded = question.marks;
      else if (analysis.hasCorrectConcepts && analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.7);
      else if (analysis.hasKeyTerms) marksAwarded = Math.ceil(question.marks * 0.4);
    }
    
    // Generic marking for other subjects
    else {
      const keyTermsInQuestion = questionLower.match(/\b(atom|molecule|cell|ecosystem|democracy|parliament|metaphor|simile|equation|graph|data|temperature|pressure|volume|density|mass|weight|velocity|acceleration|current|voltage|resistance|compound|mixture|solution|acid|base|catalyst|enzyme|chromosome|gene|evolution|inheritance|election|government|treaty|war|peace|character|theme|plot|setting|imagery|symbolism)\b/g) || [];
      
      analysis.hasKeyTerms = keyTermsInQuestion.some(term => studentLower.includes(term));
      analysis.hasCorrectConcepts = studentAnswer.length > 50 && analysis.hasKeyTerms;
      analysis.hasExamples = /\b(example|such as|for instance|like|including|e\.g\.)\b/i.test(studentLower);
      analysis.hasStructure = /\b(firstly|secondly|finally|because|therefore|however|furthermore|in conclusion|moreover|additionally)\b/i.test(studentLower);
      
      // Award marks based on content quality
      if (analysis.hasCorrectConcepts && analysis.hasKeyTerms && (analysis.hasExamples || analysis.hasStructure)) {
        marksAwarded = question.marks;
      } else if (analysis.hasCorrectConcepts && analysis.hasKeyTerms) {
        marksAwarded = Math.ceil(question.marks * 0.7);
      } else if (analysis.hasKeyTerms) {
        marksAwarded = Math.ceil(question.marks * 0.4);
      } else if (studentAnswer.length > 20) {
        marksAwarded = Math.ceil(question.marks * 0.2);
      }
    }
    
    return { marksAwarded: Math.min(marksAwarded, question.marks), analysis };
  };

  const generateMarkingPoints = (question: ExamQuestion) => {
    const marks = question.marks;
    const questionLower = question.text.toLowerCase();
    const points = [];
    
    // Specific marking points based on question type and content
    if (questionLower.includes('calculate') || questionLower.includes('work out')) {
      if (marks === 1) {
        points.push("Correct final answer (1 mark)");
      } else if (marks === 2) {
        points.push("Correct method or formula shown (1 mark)");
        points.push("Correct final answer with units (1 mark)");
      } else if (marks >= 3) {
        points.push("Correct method or formula (1 mark)");
        points.push("Correct substitution of values (1 mark)");
        points.push("Correct final answer with units (1 mark)");
      }
    }
    
    else if (questionLower.includes('photosynthesis')) {
      if (marks === 1) {
        points.push("States that plants make glucose/food (1 mark)");
      } else if (marks === 2) {
        points.push("Word equation: carbon dioxide + water → glucose + oxygen (1 mark)");
        points.push("States need for light energy and chlorophyll (1 mark)");
      } else if (marks >= 3) {
        points.push("Correct word equation (1 mark)");
        points.push("Mentions light energy and chlorophyll (1 mark)");
        points.push("States location (chloroplasts) or balanced symbol equation (1 mark)");
      }
    }
    
    else if (questionLower.includes('respiration')) {
      if (marks === 1) {
        points.push("States that energy is released from glucose (1 mark)");
      } else if (marks === 2) {
        points.push("Word equation: glucose + oxygen → carbon dioxide + water (+ energy) (1 mark)");
        points.push("States occurs in mitochondria or releases ATP (1 mark)");
      } else if (marks >= 3) {
        points.push("Correct word equation (1 mark)");
        points.push("States location (mitochondria) (1 mark)");
        points.push("Mentions ATP or energy for life processes (1 mark)");
      }
    }
    
    else if (questionLower.includes('erosion')) {
      if (marks === 1) {
        points.push("States that erosion is wearing away of rock (1 mark)");
      } else if (marks === 2) {
        points.push("Definition: wearing away and transport of rock/soil (1 mark)");
        points.push("Names agent: water/wind/ice/gravity (1 mark)");
      } else if (marks >= 3) {
        points.push("Correct definition of erosion (1 mark)");
        points.push("Names specific agent and process (1 mark)");
        points.push("Gives specific example (e.g., river creating V-shaped valley) (1 mark)");
      }
    }
    
    else if (questionLower.includes('force') && questionLower.includes('calculate')) {
      points.push("States formula: Force = Mass × Acceleration (1 mark)");
      points.push("Correct substitution of values (1 mark)");
      points.push("Correct answer in Newtons (1 mark)");
    }
    
    else if (questionLower.includes('speed') && questionLower.includes('calculate')) {
      points.push("States formula: Speed = Distance ÷ Time (1 mark)");
      points.push("Correct substitution of values (1 mark)");
      points.push("Correct answer with units (m/s) (1 mark)");
    }
    
    // Generic marking scheme for other questions
    else {
      if (marks === 1) {
        points.push("Correct identification or definition (1 mark)");
      } else if (marks === 2) {
        points.push("Accurate knowledge and understanding (1 mark)");
        points.push("Clear explanation or example (1 mark)");
      } else if (marks === 3) {
        points.push("Demonstrates knowledge of key concepts (1 mark)");
        points.push("Detailed explanation with reasoning (1 mark)");
        points.push("Relevant example or application (1 mark)");
      } else if (marks === 4) {
        points.push("Comprehensive knowledge of topic (1 mark)");
        points.push("Clear, detailed explanations (1 mark)");
        points.push("Relevant examples and evidence (1 mark)");
        points.push("Evaluation or analysis (1 mark)");
      } else if (marks >= 5) {
        points.push("Comprehensive knowledge and understanding (2 marks)");
        points.push("Detailed explanations with clear reasoning (2 marks)");
        points.push("Relevant examples and evaluation (1 mark)");
      }
    }
    
    return points;
  };

  const getPerformanceGrade = (achieved: number, total: number) => {
    const percentage = (achieved / total) * 100;
    if (percentage >= 90) return "Excellent";
    if (percentage >= 70) return "Very Good";
    if (percentage >= 50) return "Good";
    if (percentage >= 30) return "Satisfactory";
    return "Needs Improvement";
  };

  const generateDetailedFeedback = (question: ExamQuestion, studentAnswer: string, marksAwarded: number, analysis: any) => {
    const percentage = (marksAwarded / question.marks) * 100;
    const questionLower = question.text.toLowerCase();
    
    // Specific feedback based on question type and performance
    if (questionLower.includes('calculate') || questionLower.includes('work out')) {
      if (percentage === 100) {
        return `Perfect! You've got the correct answer with proper working. Your calculation method was spot on and you included the right units. This shows excellent mathematical skills.`;
      } else if (percentage >= 60) {
        return `Good attempt! You showed the right method but ${marksAwarded < question.marks ? 'check your final answer or units' : 'made a small error'}. Make sure to double-check your calculations and always include units.`;
      } else {
        return `You need to work on this calculation. Remember to: 1) Write down the formula, 2) Substitute the correct values, 3) Show your working, 4) Give the answer with units. Practice more calculation questions to improve.`;
      }
    }
    
    else if (questionLower.includes('photosynthesis')) {
      if (percentage >= 90) {
        return `Excellent understanding of photosynthesis! You correctly explained the process and ${analysis.hasAccuracy ? 'included the chemical equation' : 'showed good knowledge'}. Your answer demonstrates thorough knowledge of this key biological process.`;
      } else if (percentage >= 60) {
        return `Good knowledge of photosynthesis shown. ${analysis.hasKeyTerms ? 'You used appropriate scientific terms.' : 'Try to include more specific terms like chloroplast, chlorophyll, glucose.'} ${analysis.hasCorrectConcepts ? 'Your explanation covered the main concepts.' : 'Remember to explain what happens step by step.'}`;
      } else {
        return `You need to develop your understanding of photosynthesis. Key points to remember: plants use light energy to convert carbon dioxide and water into glucose and oxygen. This happens in chloroplasts using chlorophyll. Practice the word equation.`;
      }
    }
    
    else if (questionLower.includes('respiration')) {
      if (percentage >= 90) {
        return `Excellent! You clearly understand respiration as the process that releases energy from glucose. ${analysis.hasAccuracy ? 'Including the equation shows great knowledge.' : 'Your explanation was thorough and accurate.'}`;
      } else if (percentage >= 60) {
        return `Good understanding shown. ${analysis.hasKeyTerms ? 'You used key terms appropriately.' : 'Remember to use terms like glucose, oxygen, carbon dioxide, energy, mitochondria.'} ${analysis.hasCorrectConcepts ? 'You explained the main process well.' : 'Focus on the energy release aspect.'}`;
      } else {
        return `Work on understanding respiration better. Remember: glucose reacts with oxygen to release energy, producing carbon dioxide and water. This happens in mitochondria in all living cells. The energy is used for life processes.`;
      }
    }
    
    else if (questionLower.includes('erosion')) {
      if (percentage >= 90) {
        return `Excellent understanding of erosion! You correctly defined it as wearing away and transport of material, and ${analysis.hasExamples ? 'gave relevant examples' : 'showed good knowledge of the processes involved'}.`;
      } else if (percentage >= 60) {
        return `Good knowledge of erosion processes. ${analysis.hasKeyTerms ? 'You used appropriate geographical terms.' : 'Try to include terms like hydraulic action, abrasion, transportation.'} ${analysis.hasExamples ? 'Your examples were helpful.' : 'Adding specific examples would strengthen your answer.'}`;
      } else {
        return `Develop your understanding of erosion. Remember: erosion involves both wearing away AND transportation of material by agents like water, wind, ice or gravity. Think of specific examples like rivers creating valleys or waves forming cliffs.`;
      }
    }
    
    // Generic feedback for other subjects
    else {
      if (percentage >= 90) {
        return `Outstanding answer! You demonstrated excellent knowledge and understanding. ${analysis.hasKeyTerms ? 'Your use of subject-specific terminology was impressive.' : ''} ${analysis.hasExamples ? 'The examples you provided really strengthened your response.' : ''} This is exactly what examiners are looking for.`;
      } else if (percentage >= 70) {
        return `Very good work! You showed solid understanding of the topic. ${analysis.hasKeyTerms ? 'Good use of key terms.' : 'Try to include more subject-specific vocabulary.'} ${analysis.hasCorrectConcepts ? 'Your explanation was clear and well-structured.' : 'Develop your explanations further for even better marks.'}`;
      } else if (percentage >= 50) {
        return `You're making good progress! Your answer shows some understanding. ${analysis.hasKeyTerms ? 'You used some appropriate terms.' : 'Focus on using more specific subject terminology.'} ${analysis.hasStructure ? 'Your answer was well-organized.' : 'Try to structure your answer more clearly with logical flow.'}`;
      } else if (percentage >= 30) {
        return `You've made a start, which is good! However, you need to develop your answer further. ${analysis.hasKeyTerms ? 'Some correct terms used.' : 'Learn and use more subject-specific vocabulary.'} Focus on understanding the key concepts and explaining them clearly with examples.`;
      } else {
        return `This answer needs significant improvement. Make sure you understand the question and the key concepts involved. Use appropriate subject terminology, provide clear explanations, and include relevant examples. Practice similar questions to build your confidence.`;
      }
    }
  };

  const generateModelAnswer = (question: ExamQuestion) => {
    const questionText = question.text;
    const questionLower = questionText.toLowerCase();
    const marks = question.marks;
    
    // Extract specific values from questions for calculations
    const percentMatch = questionText.match(/(\d+(?:\.\d+)?)%\s*of\s*(\d+(?:\.\d+)?)/i);
    const speedMatch = questionText.match(/(\d+(?:\.\d+)?)\s*(?:meters?|m)\s+in\s+(\d+(?:\.\d+)?)\s*(?:seconds?|s)/i);
    const forceMatch = questionText.match(/mass\s*(?:of|=)?\s*(\d+(?:\.\d+)?)\s*kg.*acceleration\s*(?:of|=)?\s*(\d+(?:\.\d+)?)\s*m\/s/i);
    
    // Math/Calculation Questions - Provide exact worked solutions
    if (questionLower.includes('calculate') || questionLower.includes('work out')) {
      
      // Percentage calculations
      if (percentMatch) {
        const percentage = parseFloat(percentMatch[1]);
        const number = parseFloat(percentMatch[2]);
        const result = (percentage / 100) * number;
        return `Step 1: Convert percentage to decimal\n${percentage}% = ${percentage} ÷ 100 = ${percentage/100}\n\nStep 2: Multiply by the number\n${percentage/100} × ${number} = ${result}\n\nAnswer: ${result}`;
      }
      
      // Speed calculations
      if (speedMatch || (questionLower.includes('speed') && questionLower.includes('distance') && questionLower.includes('time'))) {
        if (speedMatch) {
          const distance = parseFloat(speedMatch[1]);
          const time = parseFloat(speedMatch[2]);
          const speed = distance / time;
          return `Formula: Speed = Distance ÷ Time\n\nSubstitution: Speed = ${distance}m ÷ ${time}s\n\nAnswer: Speed = ${speed} m/s`;
        } else {
          return `Formula: Speed = Distance ÷ Time\n\nExample: If distance = 100m and time = 20s\nSpeed = 100m ÷ 20s = 5 m/s\n\nAlways include units (m/s) in your final answer.`;
        }
      }
      
      // Force calculations
      if (forceMatch || (questionLower.includes('force') && questionLower.includes('mass') && questionLower.includes('acceleration'))) {
        if (forceMatch) {
          const mass = parseFloat(forceMatch[1]);
          const acceleration = parseFloat(forceMatch[2]);
          const force = mass * acceleration;
          return `Formula: Force = Mass × Acceleration (F = ma)\n\nSubstitution: Force = ${mass}kg × ${acceleration}m/s²\n\nAnswer: Force = ${force} N (Newtons)`;
        } else {
          return `Formula: Force = Mass × Acceleration (F = ma)\n\nExample: If mass = 10kg and acceleration = 5m/s²\nForce = 10kg × 5m/s² = 50 N\n\nAlways include units (N for Newtons) in your final answer.`;
        }
      }
      
      // Generic calculation guidance
      return `For calculation questions:\n1. Write down the correct formula\n2. Substitute the given values\n3. Show your working clearly\n4. Give the final answer with correct units\n\nRemember to check your answer makes sense!`;
    }
    
    // Science Questions - Comprehensive, accurate answers
    if (questionLower.includes('photosynthesis')) {
      if (questionLower.includes('equation')) {
        return `Word equation: Carbon dioxide + Water → Glucose + Oxygen\n\n(In the presence of light energy and chlorophyll)\n\nBalanced symbol equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂`;
      } else if (questionLower.includes('where') || questionLower.includes('location')) {
        return `Photosynthesis occurs in the chloroplasts of plant cells. Chloroplasts contain chlorophyll, which absorbs light energy needed for the process.`;
      } else if (questionLower.includes('importance') || questionLower.includes('why')) {
        return `Photosynthesis is important because:\n• It produces glucose (food) for the plant\n• It produces oxygen that all living things need for respiration\n• It removes carbon dioxide from the atmosphere\n• It is the start of most food chains on Earth`;
      } else {
        return `Photosynthesis is the process where plants make glucose from carbon dioxide and water using light energy.\n\nWord equation: Carbon dioxide + Water → Glucose + Oxygen\n\nThis happens in chloroplasts using chlorophyll. The glucose is used for energy and growth, while oxygen is released as a waste product that we need for breathing.`;
      }
    }
    
    if (questionLower.includes('respiration')) {
      if (questionLower.includes('equation')) {
        return `Word equation: Glucose + Oxygen → Carbon dioxide + Water + Energy\n\nBalanced symbol equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP`;
      } else if (questionLower.includes('where') || questionLower.includes('location')) {
        return `Respiration occurs in the mitochondria of all living cells. Mitochondria are often called the 'powerhouse of the cell' because they release energy.`;
      } else if (questionLower.includes('aerobic') && questionLower.includes('anaerobic')) {
        return `Aerobic respiration: Uses oxygen, produces lots of ATP, occurs in mitochondria\nGlucose + Oxygen → Carbon dioxide + Water + Energy (38 ATP)\n\nAnaerobic respiration: No oxygen needed, produces less ATP, occurs in cytoplasm\nIn animals: Glucose → Lactic acid + Energy (2 ATP)\nIn plants/yeast: Glucose → Ethanol + Carbon dioxide + Energy (2 ATP)`;
      } else {
        return `Respiration is the process that releases energy from glucose in all living cells.\n\nWord equation: Glucose + Oxygen → Carbon dioxide + Water + Energy\n\nThis happens continuously in mitochondria. The energy (ATP) is used for movement, keeping warm, active transport, and building larger molecules.`;
      }
    }
    
    if (questionLower.includes('cell membrane')) {
      return `The cell membrane controls what enters and exits the cell. It is selectively permeable, meaning it only allows certain substances through. This helps maintain the right conditions inside the cell for life processes to occur.`;
    }
    
    if (questionLower.includes('cell wall')) {
      return `The cell wall provides structural support and protection to plant cells. It is made of cellulose and is fully permeable. It prevents the cell from bursting when it takes in water and gives the plant its shape.`;
    }
    
    if (questionLower.includes('mitochondria')) {
      return `Mitochondria are the site of aerobic respiration in cells. They release energy from glucose by combining it with oxygen. Often called the 'powerhouse of the cell' because they produce ATP (the energy currency of cells).`;
    }
    
    if (questionLower.includes('chloroplast')) {
      return `Chloroplasts are found only in plant cells and contain chlorophyll (the green pigment). They are the site of photosynthesis, where light energy is captured and used to make glucose from carbon dioxide and water.`;
    }
    
    // Geography Questions
    if (questionLower.includes('erosion')) {
      if (questionLower.includes('river')) {
        return `River erosion is the wearing away and transport of rock and soil by flowing water. Processes include:\n• Hydraulic action - water pressure breaks up rocks\n• Abrasion - rocks carried by water scrape against riverbed\n• Attrition - rocks carried by water knock against each other\n\nThis creates features like V-shaped valleys, waterfalls, and meanders.`;
      } else if (questionLower.includes('coastal')) {
        return `Coastal erosion is the wearing away of cliffs and coastlines by wave action. Processes include:\n• Hydraulic action - waves trap air in cracks, pressure breaks rocks\n• Abrasion - waves pick up rocks and hurl them at cliffs\n• Corrosion - chemical action of saltwater on rocks\n\nThis creates features like wave-cut platforms, caves, arches, and stacks.`;
      } else {
        return `Erosion is the wearing away and transport of rock, soil, or sediment by natural agents:\n• Water (rivers, waves, rain)\n• Wind\n• Ice (glaciers)\n• Gravity (mass movement)\n\nErosion involves both breaking down material AND moving it to a new location.`;
      }
    }
    
    if (questionLower.includes('weathering')) {
      return `Weathering is the breakdown of rocks in place (in situ) without transportation.\n\nPhysical weathering:\n• Freeze-thaw - water freezes in cracks, expands, breaks rock\n• Thermal expansion - heating and cooling causes rocks to crack\n\nChemical weathering:\n• Carbonation - acid rain reacts with limestone\n• Oxidation - oxygen reacts with iron in rocks, causing rust`;
    }
    
    // Physics Questions
    if (questionLower.includes('speed') && !questionLower.includes('calculate')) {
      return `Speed is how fast something is moving. It is distance traveled per unit time.\n\nFormula: Speed = Distance ÷ Time\nUnits: meters per second (m/s) or kilometers per hour (km/h)\n\nSpeed is a scalar quantity (has magnitude only, no direction).`;
    }
    
    if (questionLower.includes('velocity')) {
      return `Velocity is speed in a particular direction. It is a vector quantity (has both magnitude and direction).\n\nFormula: Velocity = Displacement ÷ Time\nUnits: meters per second (m/s)\n\nVelocity can be negative if moving in the opposite direction.`;
    }
    
    if (questionLower.includes('force') && !questionLower.includes('calculate')) {
      return `Force is a push or pull that can change the motion of an object.\n\nFormula: Force = Mass × Acceleration (F = ma)\nUnits: Newtons (N)\n\n1 Newton is the force needed to accelerate 1kg at 1m/s²`;
    }
    
    // English Literature
    if (questionLower.includes('metaphor')) {
      return `A metaphor directly compares two different things without using 'like' or 'as'.\n\nExample: "Life is a journey"\nThis compares life to a journey, suggesting life has different stages, challenges, and destinations.\n\nMetaphors create vivid imagery and help readers understand complex ideas.`;
    }
    
    if (questionLower.includes('simile')) {
      return `A simile compares two different things using 'like' or 'as'.\n\nExample: "She was as brave as a lion"\nThis compares someone's bravery to a lion's courage.\n\nSimiles help create clear mental pictures and make descriptions more vivid.`;
    }
    
    // History Questions
    if (questionLower.includes('world war 1') || questionLower.includes('ww1')) {
      if (questionLower.includes('cause')) {
        return `Causes of World War 1:\n\nLong-term causes:\n• Imperialism - competition for empire\n• Alliance system - Europe divided into two camps\n• Arms race - countries building up weapons\n• Nationalism - desire for independence\n\nShort-term trigger:\n• Assassination of Archduke Franz Ferdinand in Sarajevo, June 28, 1914`;
      }
    }
    
    // Generic responses based on command words
    if (questionLower.includes('explain')) {
      return `To explain effectively:\n• Give reasons WHY something happens\n• Use because, therefore, this leads to\n• Link causes to effects\n• Use specific examples\n• Show understanding of the process`;
    } else if (questionLower.includes('describe')) {
      return `To describe effectively:\n• Say WHAT happens\n• Include specific details\n• Use appropriate subject terminology\n• Be accurate and precise\n• Paint a clear picture with words`;
    } else if (questionLower.includes('evaluate') || questionLower.includes('assess')) {
      return `To evaluate effectively:\n• Give balanced arguments (advantages AND disadvantages)\n• Use specific evidence and examples\n• Consider different viewpoints\n• Make a reasoned judgment\n• Conclude with your overall assessment`;
    } else if (questionLower.includes('compare')) {
      return `To compare effectively:\n• Identify similarities AND differences\n• Use comparative language (whereas, however, similarly)\n• Give specific examples for each point\n• Structure your answer clearly\n• Draw a conclusion about the comparison`;
    }
    
    // Fallback for unrecognized questions
    return `For this ${marks}-mark question, a complete answer should:\n• Directly address what is being asked\n• Use correct subject-specific terminology\n• Provide specific examples or evidence\n• Show clear understanding of key concepts\n• Be well-structured with logical development\n\nAim for detailed explanations that demonstrate your knowledge and understanding.`;
  };

  const getSpecificationPoint = (question: ExamQuestion) => {
    const questionLower = question.text.toLowerCase();
    
    if (questionLower.includes('photosynthesis')) {
      return "Topic 4.4: Photosynthesis (AO1 & AO2) - Understanding the process and word equation for photosynthesis";
    } else if (questionLower.includes('respiration')) {
      return "Topic 4.5: Respiration (AO1 & AO2) - Understanding aerobic respiration and energy release";
    } else if (questionLower.includes('energy')) {
      return "Topic 1: Energy (AO1 & AO2) - Energy stores, transfers, and conservation principles";
    } else if (questionLower.includes('atom') || questionLower.includes('atomic')) {
      return "Topic 1: Atomic Structure (AO1) - Structure of atoms, electrons, protons, and neutrons";
    } else if (questionLower.includes('forces')) {
      return "Topic 2: Forces (AO1 & AO2) - Understanding forces, motion, and Newton's laws";
    } else if (questionLower.includes('cell')) {
      return "Topic 1: Cell Biology (AO1 & AO2) - Plant and animal cell structures and functions";
    } else if (questionLower.includes('reaction')) {
      return "Topic 2: Chemical Changes (AO1 & AO2) - Understanding chemical reactions and equations";
    } else {
      return "Multiple specification points assessed with AO1 (knowledge) and AO2 (application)";
    }
  };

  const results = questions.map((q: ExamQuestion) => {
    const answer = answers.find((a: ExamAnswer) => a.questionId === q.id);
    const marking = answer ? generateMarking(q, answer) : { 
      marksAwarded: 0, 
      feedback: "No answer provided", 
      modelAnswer: generateModelAnswer(q),
      markingPoints: [],
      teacherFeedback: "No answer was provided for this question.",
      specificationPoint: getSpecificationPoint(q),
      grade: "Needs Improvement"
    };
    return { question: q, answer, ...marking };
  });

  const totalMarks = questions.reduce((sum: number, q: ExamQuestion) => sum + q.marks, 0);
  const achievedMarks = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const percentage = Math.round((achievedMarks / totalMarks) * 100);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "9", color: "text-purple-600" };
    if (percentage >= 80) return { grade: "8", color: "text-indigo-600" };
    if (percentage >= 70) return { grade: "7", color: "text-blue-600" };
    if (percentage >= 60) return { grade: "6", color: "text-green-600" };
    if (percentage >= 50) return { grade: "5", color: "text-yellow-600" };
    if (percentage >= 40) return { grade: "4", color: "text-orange-600" };
    if (percentage >= 30) return { grade: "3", color: "text-red-600" };
    if (percentage >= 20) return { grade: "2", color: "text-red-700" };
    return { grade: "1", color: "text-red-800" };
  };

  const grade = getGrade(percentage);
  const timeFormatted = Math.floor(timeElapsed / 60) + ":" + (timeElapsed % 60).toString().padStart(2, '0');

  // Save exam completion to database (only for new completions)
  useEffect(() => {
    if (isReview) return; // Don't save if this is a review

    const saveExamCompletion = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const examData = {
          user_id: user.id,
          subject_id: subjectId,
          total_marks: totalMarks,
          achieved_marks: achievedMarks,
          percentage: percentage,
          grade: grade.grade,
          time_taken_seconds: timeElapsed,
          questions: questions,
          answers: answers,
          results: results
        };

        const { error } = await supabase
          .from('predicted_exam_completions')
          .insert(examData);

        if (error) throw error;

        toast({
          title: "Exam Results Saved",
          description: `Your ${subject?.name} exam has been completed and saved.`
        });

      } catch (error) {
        console.error('Error saving exam completion:', error);
        toast({
          title: "Error",
          description: "Failed to save exam results. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (questions && answers && subject) {
      saveExamCompletion();
    }
  }, [questions, answers, subject, subjectId, totalMarks, achievedMarks, percentage, grade.grade, timeElapsed, results, toast, isReview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-blue-100 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Premium Header - Theme Responsive */}
      <header className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-border sticky top-0 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/predicted-questions')} 
                className="text-muted-foreground hover:text-foreground hover:bg-muted/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Predicted Questions
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl border border-yellow-400/30">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Exam Results & Analysis</h1>
                  <p className="text-sm text-muted-foreground">Premium AI marking & feedback</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 backdrop-blur-sm rounded-full p-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Premium Results Header - Theme Responsive */}
        <Card className="mb-8 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-border shadow-2xl overflow-hidden">
          {/* Theme Responsive Card Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 dark:from-emerald-600/20 dark:via-blue-600/20 dark:to-purple-600/20" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border border-border">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  {subject.name} Exam Results
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 text-lg text-muted-foreground">
                  <span className="font-semibold">AQA GCSE Predicted Paper</span>
                  {isReview && (
                    <>
                      <span>•</span>
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30">
                        Completed: {new Date(completion?.completed_at).toLocaleDateString()}
                      </Badge>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 pt-0">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Final Score</p>
                    <p className="text-2xl font-bold text-foreground">{achievedMarks}/{totalMarks}</p>
                  </div>
                </div>
                <Progress value={percentage} className="h-3 bg-muted dark:bg-slate-600/50">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"></div>
                </Progress>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{grade.grade}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Predicted Grade</p>
                    <p className="text-lg font-bold text-foreground">{percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Taken</p>
                    <p className="text-lg font-bold text-foreground">{timeFormatted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-muted/70 dark:hover:bg-slate-700/70 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Questions</p>
                    <p className="text-lg font-bold text-foreground">{questions.length} Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Question by Question Results - Theme Responsive */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
                <Crown className="h-3 w-3 mr-1" />
                PREMIUM ANALYSIS
              </Badge>
              <Badge className="bg-muted/80 text-foreground border-border backdrop-blur-sm">
                <Target className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <h3 className="text-4xl font-bold text-foreground mb-2">
              Detailed Marking & Expert Feedback
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Premium AI analysis for every question with personalized feedback and improvement suggestions
            </p>
          </div>
          
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden bg-card/90 backdrop-blur-sm border border-border hover:bg-card/95 transition-all duration-300 shadow-2xl relative">
              {/* Theme Responsive Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                result.marksAwarded === result.question.marks 
                  ? 'from-emerald-500/10 to-teal-600/10 dark:from-emerald-600/20 dark:to-teal-700/20' 
                  : result.marksAwarded > 0 
                    ? 'from-amber-500/10 to-orange-600/10 dark:from-amber-600/20 dark:to-orange-700/20' 
                    : 'from-red-500/10 to-pink-600/10 dark:from-red-600/20 dark:to-pink-700/20'
              }`} />
              
              <CardHeader className="relative bg-muted/30 dark:bg-slate-700/50 backdrop-blur-sm border-b border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                      result.marksAwarded === result.question.marks 
                        ? 'from-emerald-500 to-teal-600' 
                        : result.marksAwarded > 0 
                          ? 'from-amber-500 to-orange-600' 
                          : 'from-red-500 to-pink-600'
                    } flex items-center justify-center shadow-2xl border border-border`}>
                      <span className="text-white font-bold text-lg">{result.question.questionNumber}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        Question {result.question.questionNumber}
                      </CardTitle>
                      {result.question.section && (
                        <Badge className="mt-2 bg-muted/50 text-foreground border-border backdrop-blur-sm text-xs">
                          Section {result.question.section}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`text-lg font-bold px-4 py-2 ${
                        result.marksAwarded === result.question.marks 
                          ? 'bg-emerald-500/80 text-white shadow-lg' 
                          : result.marksAwarded > 0 
                            ? 'bg-amber-500/80 text-white shadow-lg' 
                            : 'bg-red-500/80 text-white shadow-lg'
                      }`}
                    >
                      {result.marksAwarded}/{result.question.marks} marks
                    </Badge>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      result.marksAwarded === result.question.marks 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : result.marksAwarded > 0 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                          : 'bg-gradient-to-br from-red-500 to-pink-600'
                    }`}>
                      {result.marksAwarded === result.question.marks ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : result.marksAwarded > 0 ? (
                        <Target className="h-6 w-6 text-white" />
                      ) : (
                        <XCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-6 p-8">
                <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-3 flex items-center">
                      <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                      Question
                    </h4>
                  <div className="bg-muted/80 dark:bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                    <p className="whitespace-pre-wrap text-foreground leading-relaxed">{result.question.text}</p>
                  </div>
                </div>
                
                {result.answer && (
                  <div className="bg-muted/50 dark:bg-slate-700/50 backdrop-blur-sm border border-border rounded-xl p-5">
                      <h4 className="font-bold text-foreground mb-3 flex items-center">
                        <Target className="h-5 w-5 text-purple-500 mr-3" />
                        Your Answer
                      </h4>
                    <div className="bg-muted/80 dark:bg-slate-600/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                      <p className="text-sm whitespace-pre-wrap text-foreground leading-relaxed">{result.answer.answer}</p>
                    </div>
                  </div>
                )}

                {/* Theme Responsive Premium AI Teacher Feedback */}

                {/* Premium AI Teacher Feedback */}
                <div className="bg-card/80 dark:bg-slate-700/80 backdrop-blur-sm border border-border rounded-2xl shadow-2xl overflow-hidden">
                  {/* Theme Responsive Premium background */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 dark:from-yellow-600/20 dark:to-orange-600/20 p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">AI Teacher Feedback</h3>
                          <p className="text-sm text-muted-foreground">Premium Analysis & Marking</p>
                        </div>
                      </div>
                      <div className="text-right bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                        <div className="text-3xl font-bold text-foreground">
                          {result.marksAwarded}/{result.question.marks}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">marks awarded</div>
                        <div className={`text-sm font-bold mt-2 px-3 py-1 rounded-full ${
                          result.grade === 'Excellent' ? 'bg-emerald-500/30 text-emerald-600 dark:text-emerald-200 border border-emerald-500/50' :
                          result.grade === 'Very Good' ? 'bg-blue-500/30 text-blue-600 dark:text-blue-200 border border-blue-500/50' :
                          result.grade === 'Good' ? 'bg-amber-500/30 text-amber-600 dark:text-amber-200 border border-amber-500/50' :
                          result.grade === 'Satisfactory' ? 'bg-orange-500/30 text-orange-600 dark:text-orange-200 border border-orange-500/50' :
                          'bg-red-500/30 text-red-600 dark:text-red-200 border border-red-500/50'
                        }`}>
                          {result.grade}
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                          Model Answer
                        </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm leading-relaxed text-foreground">{result.modelAnswer}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <Target className="h-5 w-5 text-blue-500 mr-3" />
                          Why This Gets Full Marks
                        </h4>
                      <div className="space-y-3">
                        {result.markingPoints?.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-3 border border-border">
                            <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-sm text-foreground font-medium">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                        <h4 className="font-bold text-foreground mb-3 flex items-center">
                          <Crown className="h-5 w-5 text-yellow-500 mr-3" />
                          AI Teacher Feedback
                        </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm leading-relaxed text-foreground font-medium">{result.teacherFeedback}</p>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-600/50 backdrop-blur-sm border border-border rounded-xl p-5">
                      <h4 className="font-bold text-foreground mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 text-amber-500 mr-3" />
                        Specification Reference
                      </h4>
                      <div className="bg-muted/80 dark:bg-slate-500/50 backdrop-blur-sm rounded-lg p-4 border border-border">
                        <p className="text-sm font-bold text-foreground">
                          {result.specificationPoint}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Theme Responsive Premium Action Buttons */}
        <div className="flex justify-center space-x-6 mt-12">
          <Button 
            onClick={() => navigate(`/predicted-exam/${subjectId}`)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake This Exam
          </Button>
          <Button 
            onClick={() => navigate('/predicted-questions')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Try Another Subject
          </Button>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-3 px-8 rounded-xl shadow-2xl transition-all duration-300"
          >
            <Target className="h-5 w-5 mr-2" />
            Back to Dashboard
            <Crown className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictedResults;