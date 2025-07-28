import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface NotificationState {
  isVisible: boolean;
  type: "wrong-answer" | "practice-streak" | "weak-topic-recommendation" | "exam-recommendation" | null;
  questionNumber?: number;
  topicName?: string;
  subjectName?: string;
  streakCount?: number;
  weakestTopic?: string;
  subjectId?: string;
}

export const usePersonalizedNotifications = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: null
  });

  // Track consecutive correct answers for practice streak detection
  const getConsecutiveCorrect = useCallback(async (userId: string, subjectId: string) => {
    const storageKey = `streak_${userId}_${subjectId}`;
    const stored = localStorage.getItem(storageKey);
    return stored ? parseInt(stored) : 0;
  }, []);

  const updateConsecutiveCorrect = useCallback(async (
    userId: string, 
    subjectId: string, 
    isCorrect: boolean
  ) => {
    const storageKey = `streak_${userId}_${subjectId}`;
    const current = await getConsecutiveCorrect(userId, subjectId);
    
    if (isCorrect) {
      const newStreak = current + 1;
      localStorage.setItem(storageKey, newStreak.toString());
      return newStreak;
    } else {
      localStorage.setItem(storageKey, "0");
      return 0;
    }
  }, [getConsecutiveCorrect]);

  // Check if user has completed predicted exam for this subject
  const hasCompletedPredictedExam = useCallback(async (userId: string, subjectId: string) => {
    try {
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .limit(1);

      if (error) {
        console.error('Error checking predicted exam completion:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error in hasCompletedPredictedExam:', error);
      return false;
    }
  }, []);

  // Show notification for wrong answer in predicted exam
  const showWrongAnswerNotification = useCallback((
    questionNumber: number,
    topicName: string,
    subjectName: string
  ) => {
    setNotification({
      isVisible: true,
      type: "wrong-answer",
      questionNumber,
      topicName,
      subjectName
    });
  }, []);

  // Show notification for practice streak
  const showPracticeStreakNotification = useCallback(async (
    subjectName: string,
    subjectId: string,
    streakCount: number
  ) => {
    if (!user?.id) return;

    // Only show if user hasn't completed predicted exam
    const hasCompleted = await hasCompletedPredictedExam(user.id, subjectId);
    if (hasCompleted) return;

    setNotification({
      isVisible: true,
      type: "practice-streak",
      subjectName,
      streakCount
    });
  }, [user?.id, hasCompletedPredictedExam]);

  // Check if user should be recommended to take predicted exam based on practice performance
  const checkForExamRecommendation = useCallback(async (subjectId: string, subjectName: string) => {
    if (!user?.id) return;

    // Check if they've already completed the predicted exam
    const hasCompleted = await hasCompletedPredictedExam(user.id, subjectId);
    if (hasCompleted) return;

    // Check recent practice streak
    const streak = await getConsecutiveCorrect(user.id, subjectId);
    
    // Check if we've already shown exam recommendation for this subject recently
    const recommendationKey = `exam_recommendation_${user.id}_${subjectId}`;
    const lastShown = localStorage.getItem(recommendationKey);
    if (lastShown && Date.now() - parseInt(lastShown) < 24 * 60 * 60 * 1000) return;

    if (streak >= 4) {
      setNotification({
        isVisible: true,
        type: "exam-recommendation",
        subjectName,
        subjectId,
        streakCount: streak
      });

      // Mark recommendation as shown
      localStorage.setItem(recommendationKey, Date.now().toString());
    }
  }, [user?.id, hasCompletedPredictedExam, getConsecutiveCorrect]);

  // Handle practice question result
  const handlePracticeQuestionResult = useCallback(async (
    subjectId: string,
    subjectName: string,
    isCorrect: boolean,
    marksAwarded: number,
    totalMarks: number
  ) => {
    if (!user?.id) return;

    const isFullyCorrect = marksAwarded === totalMarks;
    const newStreak = await updateConsecutiveCorrect(user.id, subjectId, isFullyCorrect);

    // Show streak notification if they got 4+ correct in a row
    if (isFullyCorrect && newStreak >= 4) {
      await showPracticeStreakNotification(subjectName, subjectId, newStreak);
    }

    // Also check for exam recommendation after a good streak
    if (isFullyCorrect && newStreak >= 4) {
      await checkForExamRecommendation(subjectId, subjectName);
    }
  }, [user?.id, updateConsecutiveCorrect, showPracticeStreakNotification, checkForExamRecommendation]);

  // Handle predicted exam wrong answer
  const handlePredictedExamWrongAnswer = useCallback((
    questionNumber: number,
    topicName: string,
    subjectName: string,
    marksAwarded: number,
    totalMarks: number
  ) => {
    // Show notification if they got less than full marks
    if (marksAwarded < totalMarks) {
      showWrongAnswerNotification(questionNumber, topicName, subjectName);
    }
  }, [showWrongAnswerNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const clearNotification = useCallback(() => {
    setNotification({
      isVisible: false,
      type: null
    });
  }, []);

  
  // Helper function to extract topic from question text - using actual curriculum topics
  const extractTopicFromText = useCallback((questionText: string, subjectId: string): string => {
    const text = questionText.toLowerCase();
    
    // Biology topics
    if (subjectId === 'biology') {
      if (text.includes('enzyme') || text.includes('protein synthesis') || text.includes('ribosome') || text.includes('cell') || text.includes('nucleus') || text.includes('mitochondria') || text.includes('osmosis') || text.includes('diffusion') || text.includes('active transport')) return 'Cell biology';
      if (text.includes('heart') || text.includes('circulatory') || text.includes('enzyme') || text.includes('digestive') || text.includes('bile') || text.includes('starch') || text.includes('amylase') || text.includes('protease') || text.includes('xylem') || text.includes('phloem')) return 'Organisation';
      if (text.includes('infection') || text.includes('immune') || text.includes('pathogen') || text.includes('antibody') || text.includes('vaccination') || text.includes('antibiotic') || text.includes('drug') || text.includes('disease')) return 'Infection & response';
      if (text.includes('photosynthesis') || text.includes('respiration') || text.includes('glucose') || text.includes('oxygen') || text.includes('carbon dioxide') || text.includes('chlorophyll') || text.includes('atp') || text.includes('energy transfer')) return 'Bioenergetics';
      if (text.includes('homeostasis') || text.includes('temperature') || text.includes('blood sugar') || text.includes('kidney') || text.includes('nervous system') || text.includes('hormone') || text.includes('endocrine') || text.includes('diabetes')) return 'Homeostasis';
      if (text.includes('inheritance') || text.includes('genetic') || text.includes('dna') || text.includes('chromosome') || text.includes('allele') || text.includes('dominant') || text.includes('recessive') || text.includes('mutation') || text.includes('variation')) return 'Inheritance';
      if (text.includes('ecosystem') || text.includes('food chain') || text.includes('population') || text.includes('community') || text.includes('biodiversity') || text.includes('conservation') || text.includes('environmental') || text.includes('habitat')) return 'Ecology';
      return 'Cell biology'; // Default for biology
    }
    
    // Chemistry topics
    if (subjectId === 'chemistry' || subjectId === 'chemistry-edexcel') {
      if (text.includes('atom') || text.includes('proton') || text.includes('neutron') || text.includes('electron') || text.includes('periodic table') || text.includes('isotope') || text.includes('atomic number') || text.includes('alkali') || text.includes('halogen') || text.includes('noble gas')) return 'Atomic structure and the periodic table';
      if (text.includes('ionic') || text.includes('covalent') || text.includes('metallic') || text.includes('bonding') || text.includes('structure') || text.includes('crystal') || text.includes('molecule') || text.includes('compound')) return 'Bonding, structure, and the properties of matter';
      if (text.includes('mole') || text.includes('concentration') || text.includes('yield') || text.includes('equation') || text.includes('calculation') || text.includes('mass') || text.includes('formula')) return 'Quantitative chemistry';
      if (text.includes('acid') || text.includes('base') || text.includes('ph') || text.includes('neutralisation') || text.includes('salt') || text.includes('electrolysis') || text.includes('redox') || text.includes('oxidation') || text.includes('reduction')) return 'Chemical changes';
      if (text.includes('exothermic') || text.includes('endothermic') || text.includes('energy change') || text.includes('bond energy') || text.includes('activation energy') || text.includes('catalyst')) return 'Energy changes';
      if (text.includes('rate of reaction') || text.includes('collision theory') || text.includes('equilibrium') || text.includes('reversible') || text.includes('concentration') || text.includes('pressure') || text.includes('temperature')) return 'The rate and extent of chemical change';
      if (text.includes('hydrocarbon') || text.includes('alkane') || text.includes('alkene') || text.includes('alcohol') || text.includes('carboxylic acid') || text.includes('polymer') || text.includes('crude oil') || text.includes('fractional distillation')) return 'Organic chemistry';
      if (text.includes('chromatography') || text.includes('flame test') || text.includes('spectroscopy') || text.includes('analysis') || text.includes('identification') || text.includes('purity')) return 'Chemical analysis';
      if (text.includes('atmosphere') || text.includes('greenhouse') || text.includes('carbon dioxide') || text.includes('global warming') || text.includes('climate change') || text.includes('pollutant')) return 'Chemistry of the atmosphere';
      if (text.includes('resource') || text.includes('sustainability') || text.includes('recycling') || text.includes('finite') || text.includes('renewable') || text.includes('extraction') || text.includes('life cycle') || text.includes('potable water')) return 'Using resources';
      return 'Key ideas'; // Default for chemistry
    }
    
    // Physics topics
    if (subjectId === 'physics' || subjectId === 'physics-edexcel') {
      if (text.includes('energy') || text.includes('kinetic') || text.includes('potential') || text.includes('work') || text.includes('power') || text.includes('efficiency') || text.includes('conservation') || text.includes('transfer')) return 'Energy';
      if (text.includes('electric') || text.includes('current') || text.includes('voltage') || text.includes('resistance') || text.includes('circuit') || text.includes('charge') || text.includes('power') || text.includes('conductor')) return 'Electricity';
      if (text.includes('particle') || text.includes('atom') || text.includes('radiation') || text.includes('radioactive') || text.includes('nuclear') || text.includes('alpha') || text.includes('beta') || text.includes('gamma')) return 'Particle model of matter';
      if (text.includes('atomic') || text.includes('structure') || text.includes('radiation') || text.includes('radioactivity') || text.includes('nuclear') || text.includes('fission') || text.includes('fusion')) return 'Atomic structure';
      if (text.includes('force') || text.includes('motion') || text.includes('acceleration') || text.includes('velocity') || text.includes('momentum') || text.includes('newton') || text.includes('pressure')) return 'Forces';
      if (text.includes('wave') || text.includes('frequency') || text.includes('wavelength') || text.includes('sound') || text.includes('light') || text.includes('electromagnetic') || text.includes('reflection') || text.includes('refraction')) return 'Waves';
      if (text.includes('magnet') || text.includes('magnetic') || text.includes('field') || text.includes('electromagnet') || text.includes('motor') || text.includes('generator') || text.includes('transformer')) return 'Magnetism and electromagnetism';
      return 'Energy'; // Default for physics
    }
    
    // Business topics
    if (subjectId === 'business' || subjectId === 'business-edexcel-igcse') {
      if (text.includes('entrepreneur') || text.includes('business objective') || text.includes('sole trader') || text.includes('limited company') || text.includes('partnership') || text.includes('stakeholder') || text.includes('location') || text.includes('planning') || text.includes('government') || text.includes('economy')) return 'Business in the real world';
      if (text.includes('cash flow') || text.includes('profit') || text.includes('revenue') || text.includes('costs') || text.includes('break-even') || text.includes('investment') || text.includes('loan') || text.includes('share') || text.includes('crowdfunding') || text.includes('finance') || text.includes('budget')) return 'Business Finance';
      if (text.includes('market research') || text.includes('target market') || text.includes('marketing mix') || text.includes('product life cycle') || text.includes('price') || text.includes('promotion') || text.includes('advertising') || text.includes('brand') || text.includes('digital marketing') || text.includes('social media') || text.includes('segmentation')) return 'Marketing';
      if (text.includes('production') || text.includes('quality') || text.includes('supply chain') || text.includes('procurement') || text.includes('logistics') || text.includes('inventory') || text.includes('customer service') || text.includes('lean production') || text.includes('technology') || text.includes('automation')) return 'Business operations';
      if (text.includes('recruitment') || text.includes('training') || text.includes('motivation') || text.includes('leadership') || text.includes('organisational structure') || text.includes('span of control') || text.includes('staff') || text.includes('employee') || text.includes('human resource') || text.includes('workforce')) return 'Human resources';
      return 'Business in the real world'; // Default for business
    }
    
    // Geography topics
    if (subjectId === 'geography' || subjectId === 'geography-paper-2') {
      if (text.includes('urbanisation') || text.includes('urban') || text.includes('city') || text.includes('megacity') || text.includes('slum') || text.includes('suburb')) return 'Urban Issues and Challenges';
      if (text.includes('economic') || text.includes('development') || text.includes('trade') || text.includes('globalization') || text.includes('tnc') || text.includes('aid')) return 'The Changing Economic World';
      if (text.includes('resource') || text.includes('water') || text.includes('energy') || text.includes('food') || text.includes('sustainability')) return 'Resource Management';
      if (text.includes('hazard') || text.includes('earthquake') || text.includes('volcano') || text.includes('tsunami') || text.includes('disaster')) return 'Natural Hazards';
      if (text.includes('tectonic') || text.includes('plate') || text.includes('continental') || text.includes('destructive') || text.includes('constructive')) return 'Tectonic Hazards';
      if (text.includes('storm') || text.includes('hurricane') || text.includes('typhoon') || text.includes('drought') || text.includes('extreme weather')) return 'Weather Hazards';
      if (text.includes('climate change') || text.includes('greenhouse') || text.includes('global warming') || text.includes('carbon')) return 'Climate Change';
      if (text.includes('ecosystem') || text.includes('biodiversity') || text.includes('food chain') || text.includes('nutrient cycle')) return 'Ecosystems';
      if (text.includes('rainforest') || text.includes('tropical') || text.includes('deforestation') || text.includes('amazon')) return 'Tropical Rainforests';
      if (text.includes('desert') || text.includes('tundra') || text.includes('polar') || text.includes('antarctica')) return 'Hot Deserts/Cold Environments';
      if (text.includes('coast') || text.includes('beach') || text.includes('cliff') || text.includes('wave') || text.includes('erosion') || text.includes('longshore')) return 'Coastal Landscapes in the UK';
      if (text.includes('river') || text.includes('drainage') || text.includes('meander') || text.includes('flood') || text.includes('waterfall')) return 'River Landscapes in the UK';
      if (text.includes('glacier') || text.includes('ice') || text.includes('corrie') || text.includes('moraine') || text.includes('fjord')) return 'Glacial Landscapes in the UK';
      if (text.includes('physical landscape') || text.includes('uk landscape') || text.includes('upland') || text.includes('lowland')) return 'UK Physical Landscapes Overview';
      if (text.includes('migration') || text.includes('refugee') || text.includes('population')) return 'Urban Issues and Challenges';
      return 'Natural Hazards'; // Default for geography
    }
    
    // Subject-specific fallbacks based on common first topics
    if (subjectId === 'maths' || subjectId === 'mathematics') return 'Number';
    if (subjectId === 'english' || subjectId === 'english-literature') return 'Reading';
    if (subjectId === 'history') return 'America, 1840–1895';
    if (subjectId === 'computer-science' || subjectId === 'computing') return 'Computational thinking';
    if (subjectId === 'art') return 'Drawing and Painting';
    if (subjectId === 'music') return 'Performance';
    if (subjectId === 'pe' || subjectId === 'physical-education') return 'Sports Skills';
    if (subjectId === 'french' || subjectId === 'spanish' || subjectId === 'german') return 'Vocabulary';
    
    // Final fallback - try to extract first topic from subject name
    return 'Fundamental Concepts';
  }, []);

  // Check for recent exam completion and show weak topic recommendation
  const checkForWeakTopicRecommendation = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('Checking for weak topic recommendations for user:', user.id);
      
      // Get the most recent exam completion from last 24 hours
      const { data: recentExam, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Recent exam query result:', { recentExam, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error);
        return;
      }
      
      if (!recentExam) {
        console.log('No recent exam found');
        return;
      }

      // Check if we've already shown a notification for this exam
      const notificationKey = `notification_shown_${recentExam.id}`;
      const hasShownNotification = localStorage.getItem(notificationKey);
      console.log('Notification key check:', { notificationKey, hasShownNotification });
      
      if (hasShownNotification) {
        console.log('Notification already shown for exam:', recentExam.id);
        return;
      }

      // Analyze wrong answers to find most frequent weak topic
      const questions = recentExam.questions as any[];
      const answers = recentExam.answers as any[];
      const results = recentExam.results as any[];

      console.log('Analyzing exam data:', { questionsCount: questions?.length, answersCount: answers?.length, resultsCount: results?.length });

      const topicErrors: Record<string, number> = {};

      // Analyze results to find weak topics
      if (results && results.length > 0) {
        results.forEach((result, index) => {
          const question = questions[index];
          if (result && question && result.score < question.marks) {
            // Extract topic with multiple fallback methods
            let topic = question.topic || question.section;
            
            // If no explicit topic, extract from question text
            if (!topic || topic === 'A' || topic.length < 3) {
              topic = extractTopicFromText(question.text || question.question || '', recentExam.subject_id);
            }
            
            // Final fallback based on subject
            if (!topic || topic === 'Geography Topics') {
              topic = recentExam.subject_id === 'geography' ? 'Physical Geography Concepts' : 'General Topics';
            }
            
            topicErrors[topic] = (topicErrors[topic] || 0) + 1;
            console.log(`Found error in topic: ${topic}, total errors: ${topicErrors[topic]}`);
          }
        });
      }

      console.log('Topic errors analysis:', topicErrors);

      // Find the topic with most errors
      const weakestTopic = Object.entries(topicErrors).sort((a, b) => b[1] - a[1])[0];

      if (weakestTopic && weakestTopic[1] >= 1) { // Show if 1+ errors (reduced threshold)
        console.log('Showing weak topic notification for:', weakestTopic[0]);
        setNotification({
          isVisible: true,
          type: "weak-topic-recommendation",
          weakestTopic: weakestTopic[0],
          subjectName: recentExam.subject_id,
          subjectId: recentExam.subject_id
        });

        // Mark notification as shown
        localStorage.setItem(notificationKey, 'true');
      } else {
        console.log('No significant weak topics found or insufficient errors');
      }
    } catch (error) {
      console.error('Error checking for weak topic recommendation:', error);
    }
  }, [user?.id, extractTopicFromText]);


  // Clear notification cache for testing
  const clearNotificationCache = useCallback(() => {
    if (!user?.id) return;
    
    // Clear all notification-related localStorage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('notification_shown_') || key.startsWith('exam_recommendation_'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('Cleared notification cache:', keysToRemove);
  }, [user?.id]);

  return {
    notification,
    handlePracticeQuestionResult,
    handlePredictedExamWrongAnswer,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
    clearNotificationCache,
    hideNotification,
    clearNotification
  };
};