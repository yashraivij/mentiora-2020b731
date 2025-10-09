import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Crown, Target, BookOpen } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import mentioraLogo from "@/assets/mentiora-logo.png";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { supabase } from "@/integrations/supabase/client";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { useSubscription } from "@/hooks/useSubscription";

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

const PredictedExam = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const {
    notification,
    handlePredictedExamWrongAnswer,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();
  
  const subject = curriculum.find(s => s.id === subjectId || subjectId?.startsWith(s.id + '-paper-'));
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }


  // Function to determine tier based on question difficulty and content
  const getTierLabel = (question: ExamQuestion): string => {
    // Skip tier labeling for certain subjects that don't use foundation/higher tier system
    if (subjectId === 'english-literature' || subjectId === 'history' || subjectId === 'religious-studies' || subjectId === 'business-edexcel-igcse') {
      return '';
    }
    
    // For Spanish AQA papers, use consistent tier labeling based on subjectId
    if (subjectId === 'spanish-aqa' || subjectId?.startsWith('spanish-aqa-paper-')) {
      if (subjectId?.includes('foundation')) {
        return '[Foundation Tier]';
      } else if (subjectId?.includes('higher')) {
        return '[Higher Tier]';
      }
      return '';
    }
    
    // Get the original question data to check difficulty
    let difficulty = 'easy';
    let marks = question.marks;
    
    // Try to find the original question in curriculum to get difficulty
    for (const topic of subject.topics) {
      const originalQ = topic.questions.find(q => q.question === question.text);
      if (originalQ) {
        difficulty = originalQ.difficulty;
        break;
      }
    }
    
    // Determine tier based on difficulty, marks, and content
    const isHigherTier = 
      difficulty === 'hard' || 
      marks >= 6 || 
      question.text.toLowerCase().includes('evaluate') ||
      question.text.toLowerCase().includes('analyse') ||
      question.text.toLowerCase().includes('compare and contrast') ||
      question.text.toLowerCase().includes('justify') ||
      question.text.toLowerCase().includes('assess') ||
      question.text.toLowerCase().includes('to what extent') ||
      question.text.toLowerCase().includes('discuss') ||
      (question.text.toLowerCase().includes('explain') && marks >= 4) ||
      (question.text.toLowerCase().includes('describe') && marks >= 5);
    
    return isHigherTier ? '[Higher Tier]' : '[Foundation Tier]';
  };

  // Helper functions for English Literature exam format
  const getShakespeareExtract = (playId: string): string => {
    const extracts = {
      'macbeth': `MACBETH: Is this a dagger which I see before me,
The handle toward my hand? Come, let me clutch thee.
I have thee not, and yet I see thee still.
Art thou not, fatal vision, sensible
To feeling as to sight? Or art thou but
A dagger of the mind, a false creation,
Proceeding from the heat-oppressed brain?
I see thee yet, in form as palpable
As this which now I draw.
Thou marshall'st me the way that I was going,
And such an instrument I was to use.
Mine eyes are made the fools o' th' other senses,
Or else worth all the rest. I see thee still,
And on thy blade and dudgeon gouts of blood,
Which was not so before. There's no such thing.
It is the bloody business which informs
Thus to mine eyes. Now o'er the one half-world
Nature seems dead, and wicked dreams abuse
The curtained sleep. Witchcraft celebrates
Pale Hecate's offerings, and withered murder,
Alarumed by his sentinel, the wolf,
Whose howl's his watch, thus with his stealthy pace,
With Tarquin's ravishing strides, towards his design
Moves like a ghost. Thou sure and firm-set earth,
Hear not my steps which way they walk, for fear
Thy very stones prate of my whereabout
And take the present horror from the time,
Which now suits with it. Whiles I threat, he lives.
Words to the heat of deeds too cold breath gives.`,
      'romeo-and-juliet': `JULIET: O Romeo, Romeo, wherefore art thou Romeo?
Deny thy father and refuse thy name,
Or if thou wilt not, be but sworn my love,
And I'll no longer be a Capulet.
ROMEO: Shall I hear more, or shall I speak at this?
JULIET: 'Tis but thy name that is my enemy.
Thou art thyself, though not a Montague.
What's Montague? It is nor hand, nor foot,
Nor arm, nor face, nor any other part
Belonging to a man. O, be some other name!
What's in a name? That which we call a rose
By any other word would smell as sweet.
So Romeo would, were he not Romeo called,
Retain that dear perfection which he owes
Without that title. Romeo, doff thy name,
And for thy name, which is no part of thee,
Take all myself.
ROMEO: I take thee at thy word.
Call me but love, and I'll be new baptized.
Henceforth I never will be Romeo.
JULIET: What man art thou that, thus bescreened in night,
So stumblest on my counsel?
ROMEO: By a name
I know not how to tell thee who I am.
My name, dear saint, is hateful to myself
Because it is an enemy to thee.
Had I it written, I would tear the word.`,
      'the-tempest': `PROSPERO: Our revels now are ended. These our actors,
As I foretold you, were all spirits and
Are melted into air, into thin air;
And like the baseless fabric of this vision,
The cloud-capped towers, the gorgeous palaces,
The solemn temples, the great globe itself,
Yea, all which it inherit, shall dissolve,
And like this insubstantial pageant faded,
Leave not a rack behind. We are such stuff
As dreams are made on, and our little life
Is rounded with a sleep. Sir, I am vexed.
Bear with my weakness. My old brain is troubled.
Be not disturbed with my infirmity.
If you be pleased, retire into my cell
And there repose. A turn or two I'll walk
To still my beating mind.
FERDINAND and MIRANDA: We wish your peace.
PROSPERO: Come with a thought! I thank thee, Ariel. Come.
ARIEL: Thy thoughts I cleave to. What's thy pleasure?
PROSPERO: Spirit,
We must prepare to meet with Caliban.
ARIEL: Ay, my commander. When I presented Ceres,
I thought to have told thee of it, but I feared
Lest I might anger thee.
PROSPERO: Say again, where didst thou leave these varlets?`,
      'merchant-of-venice': `SHYLOCK: Hath not a Jew eyes? Hath not a Jew hands,
organs, dimensions, senses, affections, passions;
fed with the same food, hurt with the same weapons,
subject to the same diseases, healed by the same means,
warmed and cooled by the same winter and summer
as a Christian is? If you prick us, do we not bleed?
If you tickle us, do we not laugh? If you poison us,
do we not die? And if you wrong us, shall we not revenge?
If we are like you in the rest, we will resemble you in that.
If a Jew wrong a Christian, what is his humility?
Revenge. If a Christian wrong a Jew, what should his
sufferance be by Christian example? Why, revenge.
The villainy you teach me I will execute,
and it shall go hard but I will better the instruction.
SALARINO: Here comes another of the tribe. A third
cannot be matched, unless the devil himself turn Jew.
SHYLOCK: How now, Tubal? What news from Genoa?
Hast thou found my daughter?
TUBAL: I often came where I did hear of her, but
cannot find her.
SHYLOCK: Why, there, there, there, there! A diamond gone
cost me two thousand ducats in Frankfurt! The curse
never fell upon our nation till now; I never felt it
till now. Two thousand ducats in that, and other
precious, precious jewels. I would my daughter
were dead at my foot, and the jewels in her ear!`,
      'much-ado-about-nothing': `BEATRICE: I wonder that you will still be talking,
Signior Benedick. Nobody marks you.
BENEDICK: What, my dear Lady Disdain! Are you yet living?
BEATRICE: Is it possible disdain should die while she hath
such meet food to feed it as Signior Benedick?
Courtesy itself must convert to disdain if you come
in her presence.
BENEDICK: Then is courtesy a turncoat. But it is certain I
am loved of all ladies, only you excepted. And I
would I could find in my heart that I had not a hard
heart, for truly I love none.
BEATRICE: A dear happiness to women. They would else have
been troubled with a pernicious suitor. I thank God
and my cold blood I am of your humor for that. I had
rather hear my dog bark at a crow than a man swear
he loves me.
BENEDICK: God keep your ladyship still in that mind! So
some gentleman or other shall 'scape a predestinate
scratched face.
BEATRICE: Scratching could not make it worse an 'twere such
a face as yours were.
BENEDICK: Well, you are a rare parrot-teacher.
BEATRICE: A bird of my tongue is better than a beast of yours.
BENEDICK: I would my horse had the speed of your tongue and
so good a continuer. But keep your way, i' God's name.
I have done.`,
      'julius-caesar': `BRUTUS: It must be by his death, and for my part
I know no personal cause to spurn at him
But for the general. He would be crowned.
How that might change his nature, there's the question.
It is the bright day that brings forth the adder
And that craves wary walking. Crown him that,
And then I grant we put a sting in him
That at his will he may do danger with.
Th' abuse of greatness is when it disjoins
Remorse from power. And to speak truth of Caesar,
I have not known when his affections swayed
More than his reason. But 'tis a common proof
That lowliness is young ambition's ladder,
Whereto the climber upward turns his face;
But when he once attains the utmost round,
He then unto the ladder turns his back,
Looks in the clouds, scorning the base degrees
By which he did ascend. So Caesar may.
Then lest he may, prevent. And since the quarrel
Will bear no color for the thing he is,
Fashion it thus: that what he is, augmented,
Would run to these and these extremities;
And therefore think him as a serpent's egg,
Which, hatched, would as his kind grow mischievous,
And kill him in the shell.`
    };
    return extracts[playId as keyof typeof extracts] || '';
  };

  const getShakespeareTheme = (playId: string): string => {
    const themes = {
      'macbeth': 'ambition and its consequences',
      'romeo-and-juliet': 'love and conflict',
      'the-tempest': 'power and forgiveness',
      'merchant-of-venice': 'prejudice and mercy',
      'much-ado-about-nothing': 'love and deception',
      'julius-caesar': 'honor and betrayal'
    };
    return themes[playId as keyof typeof themes] || '';
  };

  const getNovelExtract = (novelId: string): string => {
    const extracts = {
      'jekyll-and-hyde': `"All at once, I saw two figures: one a little man who was stumping along eastward at a good walk, and the other a girl of maybe eight or ten who was running as hard as she was able down a cross street. Well, sir, the two ran into one another naturally enough at the corner; and then came the horrible part of the thing; for the man trampled calmly over the child's body and left her screaming on the ground. It sounds nothing to hear, but it was hellish to see. It wasn't like a man; it was like some damned Juggernaut. I gave a few halloa, took to my heels, collared my gentleman, and brought him back to where there was already quite a group about the screaming child. He was perfectly cool and made no resistance, but gave me one look, so ugly that it brought out the sweat on me like running. The people who had turned out were the girl's own family; and pretty soon, the doctor, for whom she had been sent put in his appearance. Well, the child was not much the worse, more frightened, according to the Sawbones; and there you might have supposed would be an end to it. But there was one curious circumstance."`,
      'christmas-carol': `"Oh! But he was a tight-fisted hand at the grindstone, Scrooge! a squeezing, wrenching, grasping, scraping, clutching, covetous, old sinner! Hard and sharp as flint, from which no steel had ever struck out generous fire; secret, and self-contained, and solitary as an oyster. The cold within him froze his old features, nipped his pointed nose, shrivelled his cheek, stiffened his gait; made his eyes red, his thin lips blue; and spoke out shrewdly in his grating voice. A frosty rime was on his head, and on his eyebrows, and his wiry chin. He carried his own low temperature always about with him; he iced his office in the dog-days; and didn't thaw it one degree at Christmas. External heat and cold had little influence on Scrooge. No warmth could warm, no wintry weather chill him. No wind that blew was bitterer than he, no falling snow was more intent upon its purpose, no pelting rain less open to entreaty."`,
      'great-expectations': `"My state of mind regarding the pilfering from which I had been so unexpectedly exonerated did not impel me to frank disclosure; but I hope it had some dregs of good at the bottom of it. I do not recall that I felt any tenderness of conscience in reference to Mrs. Joe, when the fear of being found out was lifted off me. But I loved Joe—perhaps for no better reason in those early days than because the dear fellow let me love him—and, as to him, my inner self was not so easily composed. It was much upon my mind (particularly when I first saw him looking about for his file) that I ought to tell Joe the whole truth. Yet I did not, and for the reason that I mistrusted that if I did, he would think me worse than I was. The fear of losing Joe's confidence, and of thenceforth sitting in the chimney corner at night staring drearily at my forever lost companion and friend, tied up my tongue."`,
      'pride-and-prejudice': `"Elizabeth's astonishment was beyond expression. She stared, coloured, and remained silent. This he considered sufficient encouragement; and the avowal of all that he felt, and had long felt for her, immediately followed. He spoke well; but there were feelings besides those of the heart to be detailed; and he was not more eloquent on the subject of tenderness than of pride. His sense of her inferiority—of its being a degradation—of the family obstacles which had always opposed to inclination, were dwelt on with a warmth which seemed due to the consequence he was wounding, but was very unlikely to recommend his suit. In spite of her deeply-rooted dislike, she could not be insensible to the compliment of such a man's affection, and though her intentions did not vary for an instant, she was at first sorry for the pain he was to receive; till, roused to resentment by his subsequent language, she lost all compassion in anger."`,
      'sign-of-four': `"As I listened to the words and realized what they meant, a great shadow seemed to pass from my soul. I do not know how this Agra treasure has weighed down upon me. There was the treasure, half of it was mine by right. Yet I could never bring myself to use it, never bring myself even to tell her of it, because it was gained by such cruel deeds. What was the use of wealth to me? My heart was heavy with sorrow, and how could gold lighten it? If, instead, I could win her, if I could feel that she loved me, if I could take her to my arms and feel that head upon my shoulder, then I could let the treasure sink into the Thames rather than be a barrier between us. Thank God it is not so now. Thank God!" said he, clasping her to him. "It is settled then?"
"Quite settled, Mary. But you must not fear for me. You must not worry yourself on my account. All will be well."
"But the treasure, John?"
"Hang the treasure! It has cost two human lives already. It shall cost no more."`,
      'jane-eyre': `"I am no bird; and no net ensnares me: I am a free human being with an independent will, which I now exert to leave you."
He gazed at me in amazement—perhaps they had never seen that expression of unyielding resolution.
"But I have your promise," said he: "you said you would stay and be my friend."
"Conditions change—and so do people."
"But you promised."
"I'm sorry. Events have released me from my promise."
"What events?"
I was silent.
"You will not tell me?"
"I cannot."
"Is it because of what you have learned?"
I was still silent. I am not naturally a deceitful person, but I thought it better to hold my peace.`,
      'frankenstein': `"I had worked hard for nearly two years, for the sole purpose of infusing life into an inanimate body. For this I had deprived myself of rest and health. I had desired it with an ardour that far exceeded moderation; but now that I had finished, the beauty of the dream vanished, and breathless horror and disgust filled my heart. Unable to endure the aspect of the being I had created, I rushed out of the room and continued a long time traversing my bed-chamber, unable to compose my mind to sleep. At length lassitude succeeded to the tumult I had before endured, and I threw myself on the bed in my clothes, endeavouring to seek a few moments of forgetfulness. But it was in vain; I slept, indeed, but I was disturbed by the wildest dreams."`
    };
    return extracts[novelId as keyof typeof extracts] || '';
  };

  const getNovelDetails = (novelId: string): { author: string; theme: string } => {
    const details = {
      'jekyll-and-hyde': { author: 'Stevenson', theme: 'the duality of human nature' },
      'christmas-carol': { author: 'Dickens', theme: 'redemption and social responsibility' },
      'great-expectations': { author: 'Dickens', theme: 'social class and moral growth' },
      'pride-and-prejudice': { author: 'Austen', theme: 'love and social expectations' },
      'sign-of-four': { author: 'Doyle', theme: 'justice and loyalty' },
      'jane-eyre': { author: 'Brontë', theme: 'independence and equality' },
      'frankenstein': { author: 'Shelley', theme: 'scientific ambition and responsibility' }
    };
    return details[novelId as keyof typeof details] || { author: '', theme: '' };
  };

  const getBadgeText = (subjectId: string) => {
    if (subjectId === 'maths-edexcel' || subjectId === 'business-edexcel-igcse' || subjectId === 'chemistry-edexcel' || subjectId === 'physics-edexcel' || subjectId === 'history-edexcel-gcse') {
      return 'Edexcel GCSE';
    }
    return 'AQA GCSE';
  };

  // History helper functions for generating exam questions with sources
  const getHistorySource = (topicId: string, questionType: string): string => {
    const sources = {
      'america-1840-1895': {
        utility: `Source A: From a newspaper report in 1876 about the treatment of Native Americans:\n\n"The Indian Agency reports that food supplies to the reservation have been cut by half this winter. Many families are going hungry, and the promised blankets and warm clothing have not arrived. The government agent states that funds are limited, but local traders continue to profit from sales of inferior goods at inflated prices to the tribes."`,
        analysis: `Source A: A government report from 1869: "The treatment of Native American tribes has been inconsistent with our national values of justice and fairness."\nSource B: Extract from a settler's diary, 1871: "The Indians have been forced from their traditional hunting grounds and many are now dependent on government rations which are often delayed or insufficient."`
      },
      'germany-1890-1945': {
        utility: `Source A: From a Nazi propaganda poster, 1936:\n\n"Work and Bread! The Führer has given work to 6 million unemployed Germans. German workers, you were unemployed under the old system - now you have work and purpose under National Socialism. Support the Party that delivered on its promises!"`,
        analysis: `Source A: From German unemployment statistics, 1932:\n\n"Unemployment has reached catastrophic levels with over 6 million Germans out of work. Soup kitchens in Berlin are overwhelmed, and many families have lost their homes. The economic crisis has created desperate conditions across the nation."\n\nSource B: From Nazi employment statistics, 1936:\n\n"Unemployment has been reduced from 6 million to 2.5 million through our public works programs, rearmament, and labor conscription. The autobahns project alone has employed 600,000 workers. German industry is thriving under National Socialist economic policies."`
      },
      'russia-1894-1945': {
        utility: `Source A: From a factory worker's account of Bloody Sunday, 1905:\n\n"We marched peacefully to petition the Tsar for better working conditions and an eight-hour day. We carried icons and sang hymns, believing the Little Father would listen to our grievances. Instead, his soldiers opened fire on unarmed men, women and children."`,
        analysis: `Source A: From a Petrograd factory worker's account, February 1917:\n\n"The bread queues grow longer each day. My wife waited four hours yesterday only to be told the bakery had run out of flour. The workers in my factory talk openly of strikes - we cannot feed our families on these wages while the war continues to drain our resources."\n\nSource B: From a Bolshevik proclamation, October 1917:\n\n"The Provisional Government has failed to end the war or solve the land question. Only the Soviets represent the true will of the workers and peasants. We must seize power now and establish a government of the proletariat that will bring peace, bread, and land to the people."`
      },
      'america-1920-1973': {
        utility: `Source A: From a newspaper headline, October 1929:\n\n"WALL STREET CRASHES - Millions of shares dumped as panic selling grips New York. Banking houses report unprecedented losses. Wealthy investors seen jumping from windows. The American dream turns to nightmare."`,
        analysis: `Source A: From an unemployed worker's account, 1932:\n\n"I lost my job at the steel mill last year when they closed down production. My family has been living in a Hooverville shantytown outside Chicago. We survive on soup kitchen meals and whatever odd jobs I can find. This Depression has destroyed the lives of millions of hardworking Americans."\n\nSource B: From President Roosevelt's radio address, 1933:\n\n"My fellow Americans, the only thing we have to fear is fear itself. The New Deal will provide immediate relief for the unemployed, recovery for the economy, and reform to prevent future economic disasters. We will put America back to work through federal programs and restore confidence in our banking system."`
      },
      'conflict-tension-ww1': {
        analysis: `Source A: From a British soldier's letter home, 1916:\n\n"The conditions here are beyond description. We live like rats in these trenches, surrounded by mud, disease and death. The constant shelling never stops and many of my friends are no longer with us. The rats are as big as cats and feed on the corpses scattered across No Man's Land."\n\nSource B: From a British general's report, 1917:\n\n"Despite difficult conditions on the Western Front, morale remains high among the troops. The men show great courage and determination in the face of enemy action. Our spring offensive will surely break through German lines and bring victory within reach."`,
        followup: `Source B: Extract from a British general's report, 1917: "Morale remains high among the troops despite difficult conditions. The men show great courage and determination in the face of enemy action."`
      },
      'conflict-tension-interwar': {
        analysis: `Source A: From a British newspaper report on the Munich Conference, 1938:\n\n"Prime Minister Chamberlain has returned from Munich with an agreement signed by Hitler promising 'peace for our time.' The German demand for the Sudetenland has been accepted by Britain and France in exchange for Hitler's assurance that this is his final territorial claim in Europe."\n\nSource B: From the Munich Agreement, September 1938:\n\n"Germany, the United Kingdom, France and Italy agree that the evacuation of the Sudetenland by Czechoslovak troops shall be completed by October 10th, 1938, and the territory shall be occupied by German troops. The remaining territory of Czechoslovakia shall be guaranteed against unprovoked aggression."`
      },
      'conflict-tension-east-west': {
        analysis: `Source A: From a CIA intelligence report, October 1962:\n\n"Soviet medium-range ballistic missiles have been photographed under construction in Cuba. These weapons have the capability to strike targets throughout the southeastern United States and as far north as Washington D.C. This represents a direct threat to American national security."\n\nSource B: From President Kennedy's television address, October 22, 1962:\n\n"This Government has maintained the closest surveillance of the Soviet military buildup on the island of Cuba. Within the past week, unmistakable evidence has established the fact that offensive nuclear weapons are being prepared on that imprisoned island. We will not permit offensive weapons to remain there."`
      },
      'conflict-tension-asia': {
        analysis: `Source A: From a UN forces commander's report, 1950:\n\n"North Korean forces have crossed the 38th parallel in large numbers, attacking South Korean positions with Soviet-supplied tanks and aircraft. The South Korean army is in full retreat toward Pusan. Without immediate intervention, the entire Korean peninsula will fall under communist control."\n\nSource B: From a Chinese government statement, November 1950:\n\n"The American invasion of Korea and advance toward the Yalu River threatens the security of the Chinese People's Republic. We cannot stand idly by while imperialist forces establish bases on our border. China will take all necessary measures to defend its sovereignty and security."`
      },
      'conflict-tension-gulf': {
        analysis: `Source A: From a Kuwaiti government statement, August 1990:\n\n"Iraqi forces have invaded our sovereign territory without provocation or warning. Saddam Hussein's troops are looting our oil facilities and terrorizing our citizens. We call upon the international community to restore Kuwait's independence and punish this act of naked aggression."\n\nSource B: From UN Resolution 678, November 1990:\n\n"Iraq must comply with Resolution 660 and withdraw immediately and unconditionally from Kuwait. Member states cooperating with Kuwait are authorized to use all necessary means to uphold and implement this resolution and restore international peace and security in the area."`
      }
    };
    return sources[topicId as keyof typeof sources]?.[questionType as keyof typeof sources['america-1840-1895']] || '';
  };

  const getHistorySourceQuestion = (topicId: string, type: string): string => {
    const source = getHistorySource(topicId, type);
    const topics = {
      'america-1840-1895': 'the treatment of Native Americans in the 1850s',
      'germany-1890-1945': 'Nazi economic policies in the 1930s',
      'russia-1894-1945': 'living conditions in revolutionary Russia',
      'america-1920-1973': 'the impact of the Great Depression'
    };
    return `${source}\n\nStudy Source A. How useful is Source A for an enquiry into ${topics[topicId as keyof typeof topics]}?\n\nExplain your answer using Source A and your own knowledge.\n\n[8 marks]`;
  };

  const getHistoryNarrativeQuestion = (topicId: string): string => {
    const narratives = {
      'america-1840-1895': 'Write a narrative account of the events of the California Gold Rush and its impact on westward expansion.',
      'germany-1890-1945': 'Write a narrative account of the events of the Munich Putsch in 1923.',
      'russia-1894-1945': 'Write a narrative account of the events of Bloody Sunday in 1905.',
      'america-1920-1973': 'Write a narrative account of the Wall Street Crash and its immediate aftermath in 1929.'
    };
    return `${narratives[topicId as keyof typeof narratives]}\n\nYou could include:\n• Key events and their sequence\n• Important individuals involved\n• The impact and consequences\n\n[8 marks]`;
  };

  const getHistoryImportanceQuestion = (topicId: string): string => {
    const importance = {
      'america-1840-1895': 'Explain the importance of the Transcontinental Railroad in the development of the American West.',
      'germany-1890-1945': 'Explain the importance of the Enabling Act of 1933 in Hitler\'s consolidation of power.',
      'russia-1894-1945': 'Explain the importance of War Communism in Bolshevik control of Russia.',
      'america-1920-1973': 'Explain the importance of the New Deal in helping the USA recover from the Great Depression.'
    };
    return `${importance[topicId as keyof typeof importance]}\n\nYou could include:\n• The immediate effects\n• The longer-term consequences\n• Links to other events or developments\n\n[8 marks]`;
  };

  const getHistorySourceAnalysisQuestion = (topicId: string): string => {
    const source = getHistorySource(topicId, 'analysis');
    const topics = {
      'conflict-tension-ww1': 'the experience of soldiers in the trenches during the First World War',
      'conflict-tension-interwar': 'the rise of fascism in Europe during the 1930s',
      'conflict-tension-east-west': 'tensions between the USA and USSR during the Cold War',
      'conflict-tension-asia': 'the impact of the Korean War on civilians',
      'conflict-tension-gulf': 'international reactions to the invasion of Kuwait in 1990'
    };
    return `${source}\n\nHow useful are Sources A and B for an enquiry into ${topics[topicId as keyof typeof topics]}?\n\nExplain your answer using Sources A and B and your own knowledge.\n\n[8 marks]`;
  };

  const getHistoryFollowupQuestion = (topicId: string): string => {
    let source = getHistorySource(topicId, 'followup');
    
    // If no specific followup source, create a generic one based on the topic
    if (!source) {
      const followupSources = {
        'conflict-tension-interwar': `Source B: Extract from a British diplomat's report, 1938: "Hitler's promises at Munich appear to have satisfied the German people, but intelligence suggests military preparations continue in secret."`,
        'conflict-tension-east-west': `Source B: Extract from a Soviet government statement, 1962: "The weapons in Cuba are purely defensive and pose no threat to any peaceful nation. The USSR has the right to assist its allies."`,
        'conflict-tension-asia': `Source B: Extract from a UN report, 1951: "Civilian casualties in Korea continue to mount as fighting spreads across the peninsula. Refugee camps are overcrowded and supplies are running low."`,
        'conflict-tension-gulf': `Source B: Extract from President Bush's diary, 1991: "The coalition forces are performing magnificently. Saddam must be shown that aggression will not be tolerated in the new world order."`
      };
      source = followupSources[topicId as keyof typeof followupSources] || source;
    }
    
    const followupTopics = {
      'conflict-tension-ww1': 'conditions in the trenches',
      'conflict-tension-interwar': 'the effectiveness of appeasement',
      'conflict-tension-east-west': 'the Cuban Missile Crisis',
      'conflict-tension-asia': 'the impact of the Korean War',
      'conflict-tension-gulf': 'international reactions to the Gulf War'
    };
    
    return `${source}\n\nStudy Source B. Suggest one way this source could be followed up to find out more about ${followupTopics[topicId as keyof typeof followupTopics]}.\n\nExplain how this would help your enquiry.\n\n[4 marks]`;
  };

  const getHistoryAccountQuestion = (topicId: string): string => {
    const accounts = {
      'conflict-tension-ww1': 'Write an account of how the assassination of Archduke Franz Ferdinand led to the outbreak of World War One.',
      'conflict-tension-interwar': 'Write an account of how the Munich Conference of 1938 failed to prevent war.',
      'conflict-tension-east-west': 'Write an account of how the Cuban Missile Crisis developed in October 1962.',
      'conflict-tension-asia': 'Write an account of how the Korean War began in 1950.',
      'conflict-tension-gulf': 'Write an account of how the Gulf War developed in 1991.'
    };
    return `${accounts[topicId as keyof typeof accounts]}\n\nYou could include:\n• The key events and their sequence\n• The main individuals and countries involved\n• How the situation escalated\n\n[8 marks]`;
  };

  const getHistoryEssayQuestion = (topicId: string): string => {
    const essays = {
      'conflict-tension-ww1': '\'The failure of the Schlieffen Plan was the main reason Germany lost the First World War.\'\n\nHow far do you agree with this statement?\n\nExplain your answer.',
      'conflict-tension-interwar': '\'The Treaty of Versailles was the main cause of the Second World War.\'\n\nHow far do you agree with this statement?\n\nExplain your answer.',
      'conflict-tension-east-west': '\'The Korean War was the most significant conflict during the Cold War between 1945 and 1972.\'\n\nHow far do you agree with this statement?\n\nExplain your answer.',
      'conflict-tension-asia': '\'The Korean War was the most significant conflict in Asia between 1950 and 1975.\'\n\nHow far do you agree with this statement?\n\nExplain your answer.',
      'conflict-tension-gulf': '\'Economic factors were the main cause of conflict in the Gulf region between 1990 and 2009.\'\n\nHow far do you agree with this statement?\n\nExplain your answer.'
    };
    return `${essays[topicId as keyof typeof essays]}\n\n[12 marks]`;
  };

  // Helper function to get topic name from any question ID
  const getTopicNameFromQuestionId = (questionId: string): string => {
    // For regular curriculum questions, extract from the curriculum
    for (const topic of subject.topics) {
      const foundQuestion = topic.questions.find(q => q.id === questionId);
      if (foundQuestion) {
        return topic.name;
      }
    }
    
    // For generated questions, extract from question ID patterns
    if (questionId.includes('shakespeare-')) {
      const playId = questionId.replace('shakespeare-', '');
      const playNames: { [key: string]: string } = {
        'macbeth': 'Macbeth',
        'romeo-and-juliet': 'Romeo and Juliet',
        'the-tempest': 'The Tempest',
        'merchant-of-venice': 'The Merchant of Venice',
        'much-ado-about-nothing': 'Much Ado About Nothing',
        'julius-caesar': 'Julius Caesar'
      };
      return playNames[playId] || 'Shakespeare Literature';
    }
    
    if (questionId.includes('novel-')) {
      const novelId = questionId.replace('novel-', '');
      const novelNames: { [key: string]: string } = {
        'jekyll-and-hyde': 'Jekyll and Hyde',
        'christmas-carol': 'A Christmas Carol',
        'great-expectations': 'Great Expectations',
        'pride-and-prejudice': 'Pride and Prejudice',
        'sign-of-four': 'The Sign of Four',
        'jane-eyre': 'Jane Eyre',
        'frankenstein': 'Frankenstein'
      };
      return novelNames[novelId] || 'Novel Literature';
    }
    
    if (questionId.includes('period-') || questionId.includes('depth-')) {
      const historyTopicMap: { [key: string]: string } = {
        'america-1840-1895': 'America 1840-1895',
        'germany-1890-1945': 'Germany 1890-1945',
        'russia-1894-1945': 'Russia 1894-1945',
        'america-1920-1973': 'America 1920-1973',
        'conflict-tension-ww1': 'Conflict and Tension: WWI',
        'conflict-tension-interwar': 'Conflict and Tension: 1918-1939',
        'conflict-tension-east-west': 'Conflict and Tension: Cold War',
        'conflict-tension-asia': 'Conflict and Tension: Asia',
        'conflict-tension-gulf': 'Conflict and Tension: Gulf'
      };
      
      const topicId = Object.keys(historyTopicMap).find(topic => questionId.includes(topic));
      return topicId ? historyTopicMap[topicId] : 'History';
    }
    
    // Default fallback
    return 'General Topic';
  };

  // Helper function to get topic from History question ID and assign colors
  const getHistoryTopicInfo = (questionId: string): { name: string; color: string } | null => {
    if (subjectId !== 'history') return null;
    
    const topicMap = {
      'america-1840-1895': { name: 'America 1840-1895', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      'germany-1890-1945': { name: 'Germany 1890-1945', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      'russia-1894-1945': { name: 'Russia 1894-1945', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      'america-1920-1973': { name: 'America 1920-1973', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      'conflict-1894-1918': { name: 'WWI 1894-1918', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      'conflict-1918-1939': { name: 'Inter-war 1918-1939', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'conflict-1945-1972': { name: 'Cold War 1945-1972', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      'conflict-asia-1950-1975': { name: 'Asia 1950-1975', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
      'conflict-gulf-1990-2009': { name: 'Gulf 1990-2009', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' }
    };
    
    // Extract topic ID from question ID
    const topicId = Object.keys(topicMap).find(topic => questionId.includes(topic));
    return topicId ? topicMap[topicId as keyof typeof topicMap] : null;
  };

  // Helper functions for Religious Studies exam format
  const getReligiousStudiesQuestions = (religionId: string): ExamQuestion[] => {
    const questions: ExamQuestion[] = [];
    const religions = {
      buddhism: {
        name: 'Buddhism',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of the Four Noble Truths.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Buddhist beliefs about karma.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Buddhists might practice meditation.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Buddhist teachings about the Three Jewels (Buddha, Dharma, Sangha).',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"The Four Noble Truths are the most important Buddhist teachings."\n\nEvaluate this statement. In your answer you should:\n• refer to Buddhist teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one example of Buddhist worship.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two features of the Eightfold Path.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Buddhist festivals might influence a Buddhist\'s life.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two Buddhist teachings about suffering (dukkha).',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"Meditation is the most important Buddhist practice."\n\nEvaluate this statement. In your answer you should:\n• refer to Buddhist teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      christianity: {
        name: 'Christianity',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of Christian worship.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Christian beliefs about Jesus.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Christians might celebrate Easter.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Christian beliefs about the Trinity.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"Jesus\' death on the cross is the most important Christian belief."\n\nEvaluate this statement. In your answer you should:\n• refer to Christian teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one example of a Christian festival.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Christian teachings about salvation.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways the Bible might influence a Christian\'s daily life.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two Christian beliefs about life after death.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"The resurrection is the most important Christian belief."\n\nEvaluate this statement. In your answer you should:\n• refer to Christian teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      'catholic-christianity': {
        name: 'Catholic Christianity',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of a Catholic sacrament.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Catholic beliefs about the Pope.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Catholics might prepare for receiving the Eucharist.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Catholic teachings about papal authority.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"The Eucharist is the most important Catholic sacrament."\n\nEvaluate this statement. In your answer you should:\n• refer to Catholic teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one feature of Catholic Mass.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Catholic beliefs about Mary.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Catholic social teaching might influence a person\'s life.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two Catholic beliefs about purgatory.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"The Pope has too much authority in the Catholic Church."\n\nEvaluate this statement. In your answer you should:\n• refer to Catholic teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      hinduism: {
        name: 'Hinduism',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of a Hindu festival.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Hindu beliefs about dharma.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Hindus might worship in the home.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Hindu teachings about ahimsa (non-violence).',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"Moksha is the ultimate goal for all Hindus."\n\nEvaluate this statement. In your answer you should:\n• refer to Hindu teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one example of Hindu worship.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Hindu beliefs about karma.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Hindu scriptures might influence daily life.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two Hindu beliefs about the caste system.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"The caste system is no longer relevant to modern Hinduism."\n\nEvaluate this statement. In your answer you should:\n• refer to Hindu teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      islam: {
        name: 'Islam',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of the Five Pillars of Islam.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Muslim beliefs about the Quran.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Muslims might observe Ramadan.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Islamic teachings about the oneness of Allah (Tawhid).',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"The Hajj pilgrimage is the most important duty for Muslims."\n\nEvaluate this statement. In your answer you should:\n• refer to Islamic teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one feature of Muslim prayer (Salah).',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Islamic teachings about zakah.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Islamic teachings about jihad might influence Muslim behavior.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two ways Sunni and Shia Muslims differ in their beliefs.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"Prayer (Salah) is the most important of the Five Pillars."\n\nEvaluate this statement. In your answer you should:\n• refer to Islamic teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      judaism: {
        name: 'Judaism',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of a Jewish festival.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Jewish beliefs about the Torah.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Jews might celebrate Passover.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Jewish teachings about the covenant with God.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"The synagogue is the most important place for Jewish worship."\n\nEvaluate this statement. In your answer you should:\n• refer to Jewish teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one feature of Shabbat observance.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Jewish beliefs about the Messiah.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Jewish dietary laws (kashrut) might influence daily life.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two Jewish teachings about tikkun olam (repairing the world).',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"Orthodox Judaism is the only authentic form of Judaism."\n\nEvaluate this statement. In your answer you should:\n• refer to Jewish teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      },
      sikhism: {
        name: 'Sikhism',
        questions: [
          // Question Set 1
          {
            id: `${religionId}-q1a`,
            questionNumber: 1,
            text: 'Give one example of Sikh worship.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2a`,
            questionNumber: 2,
            text: 'Give two Sikh beliefs about the Guru Granth Sahib.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3a`,
            questionNumber: 3,
            text: 'Explain two ways Sikhs might serve in the gurdwara.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4a`,
            questionNumber: 4,
            text: 'Explain two Sikh teachings about the nature of God.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5a`,
            questionNumber: 5,
            text: '"The Five Ks are the most important way for Sikhs to show their faith."\n\nEvaluate this statement. In your answer you should:\n• refer to Sikh teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          },
          // Question Set 2
          {
            id: `${religionId}-q1b`,
            questionNumber: 6,
            text: 'Give one of the Five Ks worn by Sikhs.',
            marks: 1,
            religion: religionId
          },
          {
            id: `${religionId}-q2b`,
            questionNumber: 7,
            text: 'Give two Sikh beliefs about equality.',
            marks: 2,
            religion: religionId
          },
          {
            id: `${religionId}-q3b`,
            questionNumber: 8,
            text: 'Explain two ways Sikh beliefs about seva might influence charitable work.',
            marks: 4,
            religion: religionId
          },
          {
            id: `${religionId}-q4b`,
            questionNumber: 9,
            text: 'Explain two ways the teachings of different Sikh Gurus guide modern Sikh life.',
            marks: 5,
            religion: religionId
          },
          {
            id: `${religionId}-q5b`,
            questionNumber: 10,
            text: '"Seva (service) is more important than wearing the Five Ks."\n\nEvaluate this statement. In your answer you should:\n• refer to Sikh teachings\n• give reasoned arguments to support this view\n• give reasoned arguments to support a different point of view\n• reach a justified conclusion.',
            marks: 12,
            religion: religionId
          }
        ]
      }
    };

    const religion = religions[religionId as keyof typeof religions];
    if (religion) {
      religion.questions.forEach((q, index) => {
        questions.push({
          id: q.id,
          questionNumber: q.questionNumber,
          text: q.text,
          marks: q.marks,
          section: religionId
        });
      });
    }

    return questions;
  };

  // Generate exam questions from subject topics
  const generateExamQuestions = (): ExamQuestion[] => {
    console.log('=== GENERATING EXAM QUESTIONS ===');
    console.log('subjectId:', subjectId);
    console.log('subject found:', !!subject);
    console.log('subject name:', subject?.name);
    const questions: ExamQuestion[] = [];
    
    // Special handling for English Literature Edexcel 2026 Predicted Exam
    if (subjectId === 'english-literature-edexcel') {
      return [
        // Section A - Shakespeare (40 marks) - Students choose ONE question
        {
          id: 'macbeth-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

MACBETH

Starting with this extract, explore how Shakespeare presents ambition and its consequences in Macbeth.

EXTRACT:
${getShakespeareExtract('macbeth')}

Write about:
• how ambition is shown in this extract
• how ambition is shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        {
          id: 'romeo-juliet-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

ROMEO AND JULIET

Starting with this extract, explore how Shakespeare presents love as a powerful force in Romeo and Juliet.

EXTRACT:
${getShakespeareExtract('romeo-and-juliet')}

Write about:
• how love is shown in this extract
• how love is shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        {
          id: 'tempest-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

THE TEMPEST

Starting with this extract, explore how Shakespeare presents the theme of power and control in The Tempest.

EXTRACT:
${getShakespeareExtract('the-tempest')}

Write about:
• how power is shown in this extract
• how power is shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        {
          id: 'much-ado-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

MUCH ADO ABOUT NOTHING

Starting with this extract, explore how Shakespeare presents appearances and deception in Much Ado About Nothing.

EXTRACT:
${getShakespeareExtract('much-ado-about-nothing')}

Write about:
• how deception is shown in this extract
• how deception is shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        {
          id: 'twelfth-night-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

TWELFTH NIGHT

Starting with this extract, explore how Shakespeare presents love and identity in Twelfth Night.

EXTRACT:
"If music be the food of love, play on,
Give me excess of it, that surfeiting,
The appetite may sicken and so die.
That strain again, it had a dying fall.
O, it came o'er my ear like the sweet sound
That breathes upon a bank of violets,
Stealing and giving odour. Enough, no more,
'Tis not so sweet now as it was before.
O spirit of love, how quick and fresh art thou,
That notwithstanding thy capacity
Receiveth as the sea, nought enters there,
Of what validity and pitch soe'er,
But falls into abatement and low price
Even in a minute. So full of shapes is fancy
That it alone is high fantastical."

Write about:
• how love and identity are shown in this extract
• how they are shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        {
          id: 'merchant-venice-2026',
          questionNumber: 1,
          text: `SECTION A - SHAKESPEARE
Answer ONE question on the play you have studied.

THE MERCHANT OF VENICE

Starting with this extract, explore how Shakespeare presents justice and mercy in The Merchant of Venice.

EXTRACT:
${getShakespeareExtract('merchant-of-venice')}

Write about:
• how justice and mercy are shown in this extract
• how they are shown in the play as a whole`,
          marks: 34,
          section: 'Section A - Shakespeare'
        },
        
        // Section B - Post-1914 British Literature (40 marks) - Students choose ONE question
        {
          id: 'inspector-calls-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

AN INSPECTOR CALLS - J.B. Priestley

How does Priestley present responsibility and social class in An Inspector Calls?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'hobsons-choice-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

HOBSON'S CHOICE - Harold Brighouse

How does Brighouse present independence and family expectations in Hobson's Choice?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'blood-brothers-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

BLOOD BROTHERS - Willy Russell

How does Russell present class inequality and fate in Blood Brothers?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'journeys-end-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

JOURNEY'S END - R.C. Sherriff

How does Sherriff present the effects of war on soldiers in Journey's End?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'animal-farm-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

ANIMAL FARM - George Orwell

How does Orwell present corruption and power in Animal Farm?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'lord-flies-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

LORD OF THE FLIES - William Golding

How does Golding present human nature and civilisation in Lord of the Flies?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'anita-me-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

ANITA AND ME - Meera Syal

How does Syal present identity and belonging in Anita and Me?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'woman-black-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

THE WOMAN IN BLACK - Susan Hill

How does Hill create fear and suspense in The Woman in Black?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'empress-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

THE EMPRESS - Tanika Gupta

How does Gupta present race and power in the British Empire in The Empress?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'refugee-boy-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

REFUGEE BOY - Benjamin Zephaniah (adapted by Lemn Sissay)

How does Zephaniah present conflict and belonging in Refugee Boy?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'coram-boy-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

CORAM BOY - Jamila Gavin

How does Gavin present social injustice and morality in Coram Boy?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        },

        {
          id: 'boys-dont-cry-2026',
          questionNumber: 2,
          text: `SECTION B - POST-1914 BRITISH LITERATURE
Answer ONE question on the modern text you have studied.

BOYS DON'T CRY - Malorie Blackman

How does Blackman present gender and identity in Boys Don't Cry?`,
          marks: 34,
          section: 'Section B - Post-1914 Literature'
        }
      ];
    }
    
    // Special handling for English Literature premium exam format
    if (subjectId === 'english-literature') {
      // Section A: Shakespeare plays
      const shakespearePlays = subject.topics.filter(topic => 
        ['macbeth', 'romeo-and-juliet', 'the-tempest', 'merchant-of-venice', 'much-ado-about-nothing', 'julius-caesar'].includes(topic.id)
      );
      
      // Section B: 19th Century novels
      const novels = subject.topics.filter(topic => 
        ['jekyll-and-hyde', 'christmas-carol', 'great-expectations', 'pride-and-prejudice', 'sign-of-four', 'jane-eyre', 'frankenstein'].includes(topic.id)
      );
      
      // Generate Shakespeare questions (Section A)
      shakespearePlays.forEach((topic) => {
        const extractText = getShakespeareExtract(topic.id);
        const theme = getShakespeareTheme(topic.id);
        questions.push({
          id: `shakespeare-${topic.id}`,
          questionNumber: questions.length + 1,
          text: `${extractText}\n\nStarting with this extract, explore how Shakespeare presents ${theme}.\n\nWrite about:\n• how Shakespeare presents ${theme} in this extract\n• how Shakespeare presents ${theme} in the play as a whole\n\n[30 marks]`,
          marks: 30,
          section: 'A'
        });
      });
      
      // Generate 19th Century novel questions (Section B)
      novels.forEach((topic) => {
        const extractText = getNovelExtract(topic.id);
        const { author, theme } = getNovelDetails(topic.id);
        questions.push({
          id: `novel-${topic.id}`,
          questionNumber: questions.length + 1,
          text: `${extractText}\n\nStarting with this extract, explore how ${author} presents ${theme}.\n\nWrite about:\n• how ${author} presents ${theme} in this extract\n• how ${author} presents ${theme} in the novel as a whole\n\n[30 marks]`,
          marks: 30,
          section: 'B'
        });
      });
      
      return questions;
    }
    
    // Special format for Spanish AQA GCSE - 4 papers (Foundation/Higher Reading & Writing)
    if (subjectId === 'spanish-aqa' || subjectId?.startsWith('spanish-aqa-paper-')) {
      const paperType = subjectId?.includes('paper-3') ? 'reading' :
                       subjectId?.includes('paper-4') ? 'writing' : 'general';
      const tier = subjectId?.includes('foundation') ? 'foundation' :
                  subjectId?.includes('higher') ? 'higher' : 'mixed';
      
      if (paperType === 'reading' && tier === 'foundation') {
        // Paper 3: Reading - Foundation
        let questionNumber = 1;

        // Section A - Text 1: Short messages questions
        const text1Passage = `Section A – Reading Comprehension (40 marks)\n\nText 1: Short messages (non-verbal + English answers)\n\nA. Mensajes\n\n"Busco compañeros para un club de lectura los sábados por la tarde."\n\n"Cierro la tienda a las 17:00 hoy por una reunión."\n\n"Se necesitan voluntarios para limpiar el parque este domingo por la mañana."\n\n"Clases de guitarra para principiantes, precio económico."`;

        questions.push({
          id: `${subjectId}-text1-q1`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhich message is about a temporary early closing?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q2`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhich message is about a cheap hobby class?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q3`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhich message is about an activity on Sunday morning?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q4`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhich message is about a book-related activity?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q5a`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nAccording to the messages, will the shop stay open later than usual? Give a reason for your answer.\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q5b`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nAre the guitar lessons only for experts? Give a reason for your answer.\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        // Section A - Text 2: Social post questions
        const text2Passage = `Text 2: Social post (approx. 110 words)\n\nB. Entrada en red social\n"Este trimestre decidí cambiar mis hábitos. Antes pasaba horas con el móvil, pero ahora hago deporte tres veces por semana y preparo mi comida en casa. Me siento con más energía y duermo mejor. Mis amigos dicen que estoy más contento y menos estresado. A veces echo de menos los videojuegos, pero prefiero salir a correr por el parque o cocinar con mi hermana. El mes que viene quiero apuntarme a un club de tenis del instituto para conocer a gente nueva."`;

        questions.push({
          id: `${subjectId}-text2-q1`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWhat two changes has the writer made?\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q2`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nGive one benefit the writer mentions about sleep.\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q3`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWhy does the writer want to join the tennis club?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q4`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWrite down two things the writer now does to maintain a healthy lifestyle.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q5`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nFind a phrase meaning "sign up for".\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q6`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nIn your own words, explain why the writer feels happier.\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        // Section A - Text 3: Email questions
        const text3Passage = `Text 3: Email (approx. 140 words)\n\nC. Correo electrónico\n"Hola Marta,\nEl intercambio a Valencia fue increíble. Mi familia anfitriona vivía cerca del centro y me enseñó muchos lugares de interés. Probé una paella auténtica y visité la Ciudad de las Artes y las Ciencias. El último día, hicimos una excursión a la playa; el agua estaba fría pero el sol brillaba. Lo mejor fue practicar español con chicos de mi edad. A veces me costaba entender los chistes, pero todos tuvieron paciencia. Quiero volver el año que viene y recomendar el programa a mis compañeros. ¿Te gustaría venir conmigo?\nUn abrazo,\nLucía"`;

        questions.push({
          id: `${subjectId}-text3-q1`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhere did the host family live?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q2`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nName two activities Lucía did.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q3`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat difficulty did Lucía have with Spanish?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q4`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat positive does Lucía mention about the people there?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q5`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat are Lucía's future plans about the program?\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q6`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWho is invited to go next year?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        // Section A - Text 4: Noticeboard questions
        const text4Passage = `Text 4: Noticeboard (matching)\n\nD. Anuncios de actividades\n\n"Taller de reciclaje: aprende a separar residuos y reducir plástico."\n\n"Charla: cómo usar la tecnología de forma responsable."\n\n"Ruta a pie por el casco antiguo: historia local."\n\n"Taller de cocina saludable para estudiantes ocupados."`;

        questions.push({
          id: `${subjectId}-text4-q1`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about environmental education?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q2`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about technology safety?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q3`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about local heritage?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q4`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about healthy cooking?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q5`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWrite down the main purpose of each announcement.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        // Section A - Text 5: Short article questions
        const text5Passage = `Text 5: Short article (approx. 160 words)\n\nE. Artículo breve\n"Muchos jóvenes prefieren viajar en tren porque es más cómodo para estudiar o escuchar música. En mi ciudad, el ayuntamiento ha bajado el precio de los abonos para estudiantes, lo que ha aumentado el número de usuarios. Sin embargo, algunos barrios aún no tienen buenas conexiones y los autobuses llegan tarde por las tardes. Una posible solución es crear carriles exclusivos para el transporte público. También se propone ampliar el horario nocturno los fines de semana. Si se aprueban estas medidas, se reducirá el tráfico y la contaminación."`;

        questions.push({
          id: `${subjectId}-text5-q1`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nWhy do young people prefer to travel by train? Give two reasons.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text5-q2`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nWhat has happened to student pass prices? Quote the text to support your answer.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text5-q3`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nWhat problem is mentioned about evening buses?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text5-q4`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nWhat solution is proposed for public transport?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text5-q2`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nGive two benefits expected if the measures are approved.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text5-q3`,
          questionNumber: questionNumber++,
          text: `${text5Passage}\n\nName one current problem with public transport mentioned.\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        // Section B - Translation
        questions.push({
          id: `${subjectId}-translation`,
          questionNumber: questionNumber++,
          text: `Section B – Translation (Spanish → English) (10 marks)\n\nTranslate the following passage into English (about 40–45 words):\n\n"En mi instituto promovemos un estilo de vida sano. Muchos alumnos traen comida casera y participan en actividades deportivas después de clase. Yo prefiero correr con mis amigos los martes. Así descanso mejor por la noche y rindo más en los exámenes."\n\n[10 marks]`,
          marks: 10,
          section: 'B'
        });

      } else if (paperType === 'reading' && tier === 'higher') {
        // Paper 3: Reading - Higher
        let questionNumber = 1;

        // Section A - Text 1: Blog post questions
        const text1Passage = `Section A – Reading Comprehension (40 marks)\n\nText 1: Blog post (approx. 170 words)\n\nVida digital equilibrada\n"Muchos adolescentes creen que desconectar del móvil significa perder contacto con sus amigos. En realidad, cuando limito mi tiempo en redes sociales, organizo mejor mis estudios y duermo sin interrupciones. La clave no es prohibir, sino utilizar la tecnología con intención: responder mensajes en momentos concretos, desactivar notificaciones innecesarias y reservar un rato para leer o salir al aire libre. En casa hemos acordado no usar dispositivos durante la cena. Al principio me costó; ahora disfruto conversando con mis padres. Además, mis notas han mejorado y tengo menos dolores de cabeza. No pienso abandonar las redes, pero sí continuar con hábitos que me hacen sentir bien."`;

        questions.push({
          id: `${subjectId}-text1-q1`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhat misconception about disconnecting is mentioned?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q2`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nGive two strategies the writer uses with technology.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q3`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhat rule was introduced at home and with what effect?\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q4`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nIdentify two benefits the writer reports.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text1-q5`,
          questionNumber: questionNumber++,
          text: `${text1Passage}\n\nWhat is the writer's final position on social media?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        // Section A - Text 2: Formal email questions
        const text2Passage = `Text 2: Formal email to a council (approx. 160 words)\n\n"Estimados señores:\nMe dirijo a ustedes para proponer un proyecto juvenil de voluntariado ambiental. Muchos estudiantes desean colaborar los sábados por la mañana en tareas de limpieza de ríos y parques. Si el ayuntamiento ofrece material y formación básica, podemos coordinar grupos por barrios. También pedimos campañas informativas en los institutos para aumentar la participación. Estoy convencido de que esta iniciativa mejorará la imagen de la ciudad y reducirá la basura en espacios verdes. Agradezco su atención y quedo a la espera de su respuesta.\nAtentamente,\nCarlos Ruiz"`;

        questions.push({
          id: `${subjectId}-text2-q1`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWhat resources are requested from the council?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q2`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWhen would the volunteers work?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q3`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nHow do they plan to recruit more students?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q4`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nGive two expected outcomes of the project.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q5`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nWhat is the tone/register of this message?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text2-q6`,
          questionNumber: questionNumber++,
          text: `${text2Passage}\n\nQuote a phrase that shows politeness.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        // Section A - Text 3: Opinion column questions
        const text3Passage = `Text 3: Opinion column (approx. 190 words, inference)\n\n"La cultura popular cambia rápido: lo que hoy es tendencia, mañana se olvida. Sin embargo, aprender a valorar las tradiciones nos da estabilidad. En mi barrio celebramos una feria cada primavera; algunos critican los gastos, pero la feria atrae visitantes, apoya a pequeños negocios y fortalece el sentido de comunidad. No propongo mantener costumbres por obligación, sino adaptarlas a la realidad actual: reducir residuos, incluir actividades accesibles para todos y ofrecer espacios para artistas jóvenes. Cuando los ciudadanos participan en la organización, el evento deja de ser un espectáculo para convertirse en un proyecto común. Así, la cultura no es solo entretenimiento: es una herramienta para construir barrios más justos y creativos."`;

        questions.push({
          id: `${subjectId}-text3-q1`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat tension does the author describe between trends and traditions?\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q2`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nGive two advantages of the spring fair.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q3`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat three adaptations are suggested to modernise the event?\n\n[3 marks]`,
          marks: 3,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q4`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nExplain how citizen participation changes the nature of the event.\n\n[2 marks]`,
          marks: 2,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text3-q5`,
          questionNumber: questionNumber++,
          text: `${text3Passage}\n\nWhat is the author's overall view of culture?\n\n[3 marks]`,
          marks: 3,
          section: 'A'
        });

        // Section A - Text 4: Short notices questions
        const text4Passage = `Text 4: Short notices (matching)\n\n"Se buscan mentores para ayudar con deberes de primaria."\n\n"Concurso de relatos cortos; fecha límite: 30 de marzo."\n\n"Venta solidaria de ropa usada; sábado, centro juvenil."\n\n"Curso intensivo de conversación para el intercambio internacional."`;

        questions.push({
          id: `${subjectId}-text4-q1`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about helping primary school children?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q2`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about a writing competition?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q3`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about selling second-hand items?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q4`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nWhich announcement is about language learning?\n\n[1 mark]`,
          marks: 1,
          section: 'A'
        });

        questions.push({
          id: `${subjectId}-text4-q5`,
          questionNumber: questionNumber++,
          text: `${text4Passage}\n\nExplain the main purpose of each announcement.\n\n[8 marks]`,
          marks: 8,
          section: 'A'
        });

        // Section B - Translation
        questions.push({
          id: `${subjectId}-translation`,
          questionNumber: questionNumber++,
          text: `Section B – Translation (Spanish → English) (10 marks)\n\nTranslate the following passage into English (≈55–70 words):\n\n"Antes pensaba que para sacar buenas notas había que estudiar muchas horas seguidas. Ahora sé que es más eficaz organizar el tiempo en bloques cortos, con descansos y objetivos claros. También me ayuda explicar en voz alta lo aprendido. Así detecto dudas y pido ayuda a tiempo. Desde que aplico esta técnica, me siento más tranquilo y he mejorado mis resultados."\n\n[10 marks]`,
          marks: 10,
          section: 'B'
        });

      } else if (paperType === 'writing' && tier === 'foundation') {
        // Paper 4: Writing - Foundation
        let questionNumber = 1;

        // Q1 - Five short sentences
        questions.push({
          id: `${subjectId}-q1`,
          questionNumber: questionNumber++,
          text: `Describe five things you can see or do at a local festival in Spain (music, food, place, people, activities).\n\nWrite five separate short sentences in Spanish.`,
          marks: 10,
          section: 'Q1'
        });

        // Q2 - 50 words, five bullet points
        questions.push({
          id: `${subjectId}-q2`,
          questionNumber: questionNumber++,
          text: `Tu vida sana.\n\nWrite approximately 50 words responding to these five points:\n(1) comidas habituales, (2) deporte que haces, (3) una actividad nueva que quieres probar, (4) cómo duermes, (5) por qué es importante para ti.`,
          marks: 10,
          section: 'Q2'
        });

        // Q3 - Grammar tasks
        questions.push({
          id: `${subjectId}-q3`,
          questionNumber: questionNumber++,
          text: `Write a short paragraph in Spanish describing what you did last weekend. Include at least 3 different activities and use the past tense.`,
          marks: 5,
          section: 'Q3'
        });

        // Q4 - Translation English to Spanish
        questions.push({
          id: `${subjectId}-q4`,
          questionNumber: questionNumber++,
          text: `Translate this passage from English to Spanish (minimum 35 words):\n\n"On weekdays I get up early and go to school by bus. After classes I help at home and sometimes I cook dinner. At the weekend I like visiting my grandparents and watching a film with my sister."`,
          marks: 10,
          section: 'Q4'
        });

        // Q5 - Choice writing task
        questions.push({
          id: `${subjectId}-q5`,
          questionNumber: questionNumber++,
          text: `Choose ONE topic and write approximately 90 words covering all three points:\n\n5A. Tus vacaciones recientes — (1) dónde fuiste, (2) qué hiciste, (3) opinión.\n\n5B. Tu instituto — (1) asignaturas favoritas, (2) normas del cole, (3) mejoras que quieres.`,
          marks: 15,
          section: 'Q5'
        });

      } else if (paperType === 'writing' && tier === 'higher') {
        // Paper 4: Writing - Higher
        let questionNumber = 1;

        // Q1 - Translation English to Spanish
        questions.push({
          id: `${subjectId}-q1`,
          questionNumber: questionNumber++,
          text: `Translate this passage from English to Spanish (minimum 50 words):\n\n"Last year I changed my routine because I was always tired. Now I plan my homework, take breaks and do sport three times a week. I have started cooking healthy meals at home. These changes help me sleep better and concentrate more in class."`,
          marks: 10,
          section: 'Q1'
        });

        // Q2 - Choice writing task
        questions.push({
          id: `${subjectId}-q2`,
          questionNumber: questionNumber++,
          text: `Choose ONE topic and write approximately 90 words covering all three points:\n\n2A. Tecnología y vida personal — (1) cómo la usas, (2) ventajas y riesgos, (3) cambios que harás.\n\n2B. Trabajo y futuro — (1) empleo ideal, (2) habilidades necesarias, (3) planes de formación.`,
          marks: 15,
          section: 'Q2'
        });

        // Q3 - Open-ended writing
        questions.push({
          id: `${subjectId}-q3`,
          questionNumber: questionNumber++,
          text: `Choose ONE topic and write approximately 150 words covering both points:\n\n3A. Viajes y medio ambiente — (1) experiencias positivas/negativas de tus viajes, (2) cómo viajar de forma más sostenible en el futuro.\n\n3B. La cultura en tu comunidad — (1) eventos que fortalecen la comunidad, (2) ideas para hacerlos más inclusivos y ecológicos.`,
          marks: 25,
          section: 'Q3'
        });

      } else {
        // General Spanish AQA - show all 4 papers
        const papers = [
          { name: 'Paper 3: Reading – Foundation', marks: 50, time: 45 },
          { name: 'Paper 3: Reading – Higher', marks: 50, time: 60 },
          { name: 'Paper 4: Writing – Foundation', marks: 50, time: 70 },
          { name: 'Paper 4: Writing – Higher', marks: 50, time: 75 }
        ];

        papers.forEach((paper, index) => {
          questions.push({
            id: `spanish-aqa-paper-${index + 1}`,
            questionNumber: index + 1,
            text: `${paper.name}\n\nTime: ${paper.time} minutes\nTotal marks: ${paper.marks}\n\nClick to take this specific paper.`,
            marks: paper.marks,
            section: 'Overview'
          });
        });
      }

      return questions;
    }
    
    // Special format for Physics - AQA GCSE Paper 1 (100 marks total, 23 questions)
    if (subjectId === 'physics') {
      let questionNumber = 1;
      
      // Multiple Choice Questions (8 × 1 mark = 8 marks)
      const multipleChoiceQuestions = [
        {
          id: 'physics-mc-1',
          questionNumber: questionNumber++,
          text: 'Which of the following is a renewable energy resource?\n\nA. Natural gas\nB. Coal\nC. Wind\nD. Oil\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-2',
          questionNumber: questionNumber++,
          text: 'The unit of electric current is:\n\nA. Volt (V)\nB. Ampere (A)\nC. Ohm (Ω)\nD. Watt (W)\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-3',
          questionNumber: questionNumber++,
          text: 'Which particle has no electric charge?\n\nA. Proton\nB. Neutron\nC. Electron\nD. Ion\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-4',
          questionNumber: questionNumber++,
          text: 'The formula for density is:\n\nA. mass × volume\nB. mass ÷ volume\nC. volume ÷ mass\nD. mass + volume\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-5',
          questionNumber: questionNumber++,
          text: 'Which type of nuclear radiation is stopped by a sheet of paper?\n\nA. Alpha\nB. Beta\nC. Gamma\nD. X-ray\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-6',
          questionNumber: questionNumber++,
          text: 'UK mains electricity has a potential difference of:\n\nA. 12 V\nB. 110 V\nC. 230 V\nD. 415 V\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-7',
          questionNumber: questionNumber++,
          text: 'Isotopes are atoms with the same number of:\n\nA. Neutrons but different protons\nB. Protons but different neutrons\nC. Electrons but different protons\nD. Protons and neutrons\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'physics-mc-8',
          questionNumber: questionNumber++,
          text: 'Ohm\'s law states that:\n\nA. V = I × R\nB. V = I ÷ R\nC. V = I + R\nD. V = I - R\n\n[1 mark]',
          marks: 1,
          section: 'A'
        }
      ];

      // Short Structured Questions (20 × 2-4 marks = 47 marks)
      const shortStructuredQuestions = [
        {
          id: 'physics-ss-1',
          questionNumber: questionNumber++,
          text: 'State the law of conservation of energy.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-2',
          questionNumber: questionNumber++,
          text: 'Give two examples of renewable energy resources.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-3',
          questionNumber: questionNumber++,
          text: 'What is meant by "dissipation" of energy?\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-4',
          questionNumber: questionNumber++,
          text: 'Define resistance in an electrical circuit.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-5',
          questionNumber: questionNumber++,
          text: 'What is meant by specific latent heat?\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-6',
          questionNumber: questionNumber++,
          text: 'What are isotopes?\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-7',
          questionNumber: questionNumber++,
          text: 'Name the three types of nuclear radiation.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-8',
          questionNumber: questionNumber++,
          text: 'State the formula for density.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'physics-ss-9',
          questionNumber: questionNumber++,
          text: 'A motor transfers 200 J of energy in 4 s. Calculate the power.\nShow your working and include units in your answer.\n\n[3 marks]',
          marks: 3,
          section: 'A'
        },
        {
          id: 'physics-ss-10',
          questionNumber: questionNumber++,
          text: 'A lamp has a resistance of 12 Ω and a current of 4 A flows through it. Calculate the potential difference.\nShow your working and include units in your answer.\n\n[3 marks]',
          marks: 3,
          section: 'A'
        },
        {
          id: 'physics-ss-11',
          questionNumber: questionNumber++,
          text: 'State two safety precautions when handling radioactive materials.\n\n[2 marks]',
          marks: 2,
          section: 'B'
        },
        {
          id: 'physics-ss-12',
          questionNumber: questionNumber++,
          text: 'A student drops a ball from a height of 5 m. Calculate the velocity just before it hits the ground. (g = 9.8 m/s²)\nShow your working and include units.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        },
        {
          id: 'physics-ss-13',
          questionNumber: questionNumber++,
          text: 'Explain why alpha radiation is the most ionising type of nuclear radiation.\n\n[2 marks]',
          marks: 2,
          section: 'B'
        },
        {
          id: 'physics-ss-14',
          questionNumber: questionNumber++,
          text: 'A wave has a frequency of 50 Hz and wavelength of 6 m. Calculate the wave speed.\nShow your working and include units.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        },
        {
          id: 'physics-ss-15',
          questionNumber: questionNumber++,
          text: 'State the unit of electric charge.\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'physics-ss-16',
          questionNumber: questionNumber++,
          text: 'A transformer has 200 turns on the primary coil and 50 turns on the secondary coil. If the primary voltage is 240 V, calculate the secondary voltage.\nShow your working.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        },
        {
          id: 'physics-ss-17',
          questionNumber: questionNumber++,
          text: 'Name one factor that affects the rate of cooling of an object.\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'physics-ss-18',
          questionNumber: questionNumber++,
          text: 'A spring extends by 0.05 m when a force of 10 N is applied. Calculate the spring constant.\nShow your working and include units.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        },
        {
          id: 'physics-ss-19',
          questionNumber: questionNumber++,
          text: 'State one use of ultrasound in medicine.\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'physics-ss-20',
          questionNumber: questionNumber++,
          text: 'A car accelerates from rest to 20 m/s in 4 s. Calculate the acceleration.\nShow your working and include units.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        }
      ];

      // Longer Structured Questions (6 × 5-6 marks = 33 marks)
      const longerStructuredQuestions = [
        {
          id: 'physics-ls-1',
          questionNumber: questionNumber++,
          text: 'A kettle draws a current of 9 A from a 230 V supply. Calculate the power.\n\nShow your working and include units in your answer.\n\n[5 marks]',
          marks: 5,
          section: 'B'
        },
        {
          id: 'physics-ls-2',
          questionNumber: questionNumber++,
          text: 'A block has a mass of 0.8 kg and volume 0.0002 m³. Calculate its density.\n\nShow your working and include units in your answer.\n\n[5 marks]',
          marks: 5,
          section: 'B'
        },
        {
          id: 'physics-ls-3',
          questionNumber: questionNumber++,
          text: 'A radioactive isotope has a half-life of 5 years. If its activity starts at 400 Bq, calculate the activity after 15 years.\n\nShow your working and include units in your answer.\n\n[5 marks]',
          marks: 5,
          section: 'B'
        },
        {
          id: 'physics-ls-4',
          questionNumber: questionNumber++,
          text: 'Describe how to investigate the relationship between force and extension for a spring.\nInclude the equipment needed and safety precautions.\n\n[6 marks]',
          marks: 6,
          section: 'B'
        },
        {
          id: 'physics-ls-5',
          questionNumber: questionNumber++,
          text: 'Explain how to measure the speed of sound in air using an oscilloscope.\nDescribe the method and state one source of error.\n\n[6 marks]',
          marks: 6,
          section: 'B'
        },
        {
          id: 'physics-ls-6',
          questionNumber: questionNumber++,
          text: 'Describe an experiment to investigate how the temperature of water affects its rate of cooling.\nInclude variables to control and measurements to take.\n\n[6 marks]',
          marks: 6,
          section: 'B'
        }
      ];

      // Extended Response Questions (2 × 6 marks = 12 marks)
      const extendedQuestions = [
        {
          id: 'physics-ext-1',
          questionNumber: questionNumber++,
          text: 'Compare the advantages and disadvantages of wind and nuclear power stations for electricity generation.\n\nIn your answer, you should consider:\n• Environmental impact\n• Reliability\n• Cost factors\n• Energy output\n\n[6 marks]',
          marks: 6,
          section: 'C'
        },
        {
          id: 'physics-ext-2',
          questionNumber: questionNumber++,
          text: 'Explain how energy is transferred and wasted in the home, and suggest ways to improve energy efficiency.\n\nIn your answer, you should consider:\n• Different forms of energy transfer\n• How energy is wasted\n• Methods to reduce energy waste\n• The importance of insulation\n\n[6 marks]',
          marks: 6,
          section: 'C'
        }
      ];

      // Combine all questions (Total: 36 questions, 100 marks)
      // 8 MC (8 marks) + 20 SS (47 marks) + 6 LS (33 marks) + 2 Ext (12 marks) = 100 marks
      questions.push(...multipleChoiceQuestions);
      questions.push(...shortStructuredQuestions);
      questions.push(...longerStructuredQuestions);
      questions.push(...extendedQuestions);

      console.log('Physics questions generated:', questions.length);
      return questions;
    }
    
    // Special format for AQA Maths Paper 1 - Non-Calculator (80 marks total)
    if (subjectId === 'maths') {
      let questionNumber = 1;
      
      // Paper 1: 1hr 30min, 80 marks, No Calculator
      // Distribution: ~20 marks (1-2 mark questions), ~35 marks (3-4 mark questions), ~25 marks (5-6 mark questions)
      
      const questions = [
        // 1-2 Mark Quick Recall Questions (~20 marks total)
        {
          id: 'math-p1-q1',
          questionNumber: questionNumber++,
          text: 'Simplify 36/48\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q2', 
          questionNumber: questionNumber++,
          text: 'Write 0.375 as a fraction in simplest form.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q3',
          questionNumber: questionNumber++,
          text: 'Find the HCF of 48 and 72.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q4',
          questionNumber: questionNumber++,
          text: 'Simplify 5x + 7x - 3\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q5',
          questionNumber: questionNumber++,
          text: 'Expand (x + 4)(x - 2)\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q6',
          questionNumber: questionNumber++,
          text: 'Factorise x² + 7x + 12\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q7',
          questionNumber: questionNumber++,
          text: 'Simplify the ratio 40:50\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q8',
          questionNumber: questionNumber++,
          text: 'Write 300 g as a fraction of 1.5 kg.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-p1-q9',
          questionNumber: questionNumber++,
          text: 'Name the type of triangle with sides 5 cm, 5 cm, 8 cm.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q10',
          questionNumber: questionNumber++,
          text: 'Find the area of a rectangle 7 cm by 4 cm.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q11',
          questionNumber: questionNumber++,
          text: 'Work out the volume of a cube of side 6 cm.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q12',
          questionNumber: questionNumber++,
          text: 'A fair coin is tossed. What is the probability of getting a head?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q13',
          questionNumber: questionNumber++,
          text: 'Write down the mode of these numbers: 4, 7, 7, 9, 10\n\n[1 mark]',
          marks: 1
        },
        
        // 3-4 Mark Structured Questions (~35 marks total)
        {
          id: 'math-p1-q14',
          questionNumber: questionNumber++,
          text: 'A train ticket costs £7.20. It increases by 15%. Work out the new price.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q15',
          questionNumber: questionNumber++,
          text: 'Work out 8.5² - 3.5²\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q16',
          questionNumber: questionNumber++,
          text: 'Share £840 in the ratio 2:3:5.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q17',
          questionNumber: questionNumber++,
          text: 'Solve 3x + 7 = 19\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q18',
          questionNumber: questionNumber++,
          text: 'Solve simultaneously:\n2x + y = 10\nx - y = 1\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-p1-q19',
          questionNumber: questionNumber++,
          text: 'Rearrange the formula A = ½bh to make h the subject.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q20',
          questionNumber: questionNumber++,
          text: 'In a class, the ratio of boys to girls is 3:5. There are 32 students. Work out how many are boys.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q21',
          questionNumber: questionNumber++,
          text: 'A recipe for 12 cookies uses 300 g of flour. Work out how much flour is needed for 18 cookies.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q22',
          questionNumber: questionNumber++,
          text: 'A car travels 180 km in 3 hours. Find the average speed.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q23',
          questionNumber: questionNumber++,
          text: 'The interior angle of a regular polygon is 150°. Find the number of sides.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-p1-q24',
          questionNumber: questionNumber++,
          text: 'A ladder 5 m long rests against a wall. The bottom is 1.2 m from the wall. How high up the wall does it reach?\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-p1-q25',
          questionNumber: questionNumber++,
          text: 'A bag contains 3 red and 7 blue counters. Write down the probability of picking a red counter.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-p1-q26',
          questionNumber: questionNumber++,
          text: 'A spinner has equal sections numbered 1 to 5. Find the probability of getting an even number.\n\n[2 marks]',
          marks: 2
        },

        // 5-6 Mark Problem Solving Questions (~25 marks total)
        {
          id: 'math-p1-q27',
          questionNumber: questionNumber++,
          text: 'A phone costs £300. In a sale it is reduced by 20%. In the following year it increases by 15%. What is the final price?\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'math-p1-q28',
          questionNumber: questionNumber++,
          text: 'The nth term of a sequence is 3n - 2. Write the first 4 terms.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-p1-q29',
          questionNumber: questionNumber++,
          text: 'Show that the difference between the squares of two consecutive integers is always odd.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-p1-q30',
          questionNumber: questionNumber++,
          text: 'Solve 2x² - 5x - 3 = 0\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'math-p1-q31',
          questionNumber: questionNumber++,
          text: '£60 is shared between A and B in the ratio 5:7. A then gives £6 to B. Find the new ratio of A\'s money to B\'s money.\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'math-p1-q32',
          questionNumber: questionNumber++,
          text: 'The value of a car decreases by 15% each year. Initially, it costs £12,000. Work out its value after 3 years.\n\n[5 marks]',
          marks: 5
        }
      ];
      
      console.log('AQA Maths Paper 1 questions generated:', questions.length);
      return questions;
    }

    // AQA A-Level Maths Paper 1: Pure Mathematics
    if (subjectId === 'maths-aqa-alevel') {
      const questions = [
        {
          id: 'math-alevel-q1',
          questionNumber: 1,
          text: 'Proof\nProve by contradiction that there are infinitely many prime numbers.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q2',
          questionNumber: 2,
          text: 'Indices and Surds\nSimplify (a^(3/2) b^(-1))/(a^(-1/2) b^(1/3)).\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q3',
          questionNumber: 3,
          text: 'Indices and Surds\nRationalise the denominator of (5√2)/(2-√3) and simplify.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q4',
          questionNumber: 4,
          text: 'Quadratics and Discriminant\nThe quadratic x² - (k+3)x + 2k = 0 has two distinct real roots.\nFind the condition on k.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q5',
          questionNumber: 5,
          text: 'Quadratics and Discriminant\nFor the least integer k satisfying the condition that x² - (k+3)x + 2k = 0 has two distinct real roots, solve the quadratic.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q6',
          questionNumber: 6,
          text: 'Simultaneous Equations\nSolve the system:\ny = 2x - 3\nx² + y² = 25\nGive exact solutions.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-alevel-q7',
          questionNumber: 7,
          text: 'Inequalities\nSolve the inequality (2x+3)/(x-1) ≤ 3 stating your final answer in interval notation.\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'math-alevel-q8',
          questionNumber: 8,
          text: 'Polynomials & Factor Theorem\nA cubic f(x) = 2x³ + ax² + bx + 12 has a factor (x-2) and leaves remainder 6 when divided by (x+1).\nFind a and b.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q9',
          questionNumber: 9,
          text: 'Polynomials & Factor Theorem\nGiven f(x) = 2x³ + ax² + bx + 12, where you have found a and b, factorise f(x) fully.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q10',
          questionNumber: 10,
          text: 'Functions, Inverses & Transformations\nLet f(x) = (3x-1)/(x+2), x ≠ -2.\nFind f⁻¹(x).\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q11',
          questionNumber: 11,
          text: 'Functions, Inverses & Transformations\nThe graph of y = g(x) is obtained from y = f(x) by the transformation y = f(2x-4) where f(x) = (3x-1)/(x+2).\nDescribe this transformation as a sequence of translations/stretches on the x-axis.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q12',
          questionNumber: 12,
          text: 'Partial Fractions\nExpress (4x+7)/(x(x+2)²) in partial fractions in the form A/x + B/(x+2) + C/(x+2)². Find A, B, C.\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'math-alevel-q13',
          questionNumber: 13,
          text: 'Coordinate Geometry – Line and Circle\nThe circle C has equation x² + y² - 6x + 8y - 11 = 0.\nFind the centre and radius of C.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q14',
          questionNumber: 14,
          text: 'Coordinate Geometry – Line and Circle\nThe line y = mx + 1 is tangent to the circle C with equation x² + y² - 6x + 8y - 11 = 0.\nFind m.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q15',
          questionNumber: 15,
          text: 'Parametric Curves\nA curve is defined parametrically by x = t² + 1, y = ln(t), t > 0.\nFind dy/dx in terms of t.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q16',
          questionNumber: 16,
          text: 'Parametric Curves\nFor the curve defined by x = t² + 1, y = ln(t), t > 0, find the equation of the tangent at t = 1.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q17',
          questionNumber: 17,
          text: 'Binomial Expansion & Approximation\nExpand (1-2x)⁵ up to and including the term in x³.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-alevel-q18',
          questionNumber: 18,
          text: 'Binomial Expansion & Approximation\nUse a suitable binomial expansion to obtain an approximation to (1.02)⁻³, correct to 3 significant figures.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q19',
          questionNumber: 19,
          text: 'Sequences & Limits\nA sequence is defined by u₁ = 1 and u_(n+1) = (1 + 2u_n)/3.\nShow that (u_n) is increasing and bounded above.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q20',
          questionNumber: 20,
          text: 'Sequences & Limits\nFor the sequence defined by u₁ = 1 and u_(n+1) = (1 + 2u_n)/3, find lim(n→∞) u_n.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q21',
          questionNumber: 21,
          text: 'Trigonometry – Identities & Equations\nProve the identity (1 - cos 2θ)/(sin 2θ) ≡ tan θ.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q22',
          questionNumber: 22,
          text: 'Trigonometry – Identities & Equations\nSolve 2sin(3x) = √3 for 0 ≤ x < 2π.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q23',
          questionNumber: 23,
          text: 'Exponentials & Logarithms\nSolve e^(2x) - 5e^x + 6 = 0.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q24',
          questionNumber: 24,
          text: 'Exponentials & Logarithms\nGiven ln(a) = p, ln(b) = q, express ln(a²/√b) in terms of p and q.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-alevel-q25',
          questionNumber: 25,
          text: 'Exponentials & Logarithms\nA population follows P(t) = P₀e^(kt). It doubles in 6 years.\nFind k and hence the time to triple, to 3 s.f.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q26',
          questionNumber: 26,
          text: 'Differentiation – Stationary Points\nLet y = x/(1+x²).\nFind dy/dx.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q27',
          questionNumber: 27,
          text: 'Differentiation – Stationary Points\nFor y = x/(1+x²), find the stationary points and determine their nature.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-alevel-q28',
          questionNumber: 28,
          text: 'Implicit Differentiation\nGiven x² + xy + y² = 7, find dy/dx in terms of x and y.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-alevel-q29',
          questionNumber: 29,
          text: 'Integration – Substitution/Definite\nEvaluate ∫₀^(ln3) e^x/(1+e^x)² dx. Give an exact value.\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'math-alevel-q30',
          questionNumber: 30,
          text: 'Integration – By Parts & Area\nFind ∫ xe^(2x) dx.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q31',
          questionNumber: 31,
          text: 'Integration – By Parts & Area\nThe curve y = xe^(2x) and the x-axis enclose a finite area on [a,0], where a < 0.\nFind a such that the area on [a,0] equals 1/4.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'math-alevel-q32',
          questionNumber: 32,
          text: 'Differential Equations – Separable\nSolve the differential equation dy/dx = (2y+1) with y(0) = 0. Give your answer in the form y = f(x).\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'math-alevel-q33',
          questionNumber: 33,
          text: 'Numerical Methods\nConsider f(x) = x³ - 4x + 1.\nShow that f(x) = 0 has a root in [0,1].\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'math-alevel-q34',
          questionNumber: 34,
          text: 'Numerical Methods\nFor f(x) = x³ - 4x + 1, using Newton–Raphson with initial guess x₀ = 1, compute x₁ and x₂ (3 s.f.).\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'math-alevel-q35',
          questionNumber: 35,
          text: 'Numerical Methods\nUse the trapezium rule with n = 4 equal subintervals to approximate ∫₀¹ (x³ - 4x + 1) dx.\n\n[2 marks]',
          marks: 2
        }
      ];

      console.log('AQA A-Level Maths Paper 1 questions generated:', questions.length);
      return questions;
    }

    // AQA A-Level Biology Paper 1 format (Topics 3.1-3.4)
    if (subjectId === 'biology-aqa-alevel') {
      let questionNumber = 1;
      
      const questions = [
        // Section A - Multiple Choice (15 marks)
        {
          id: 'bio-alevel-p1-q1',
          questionNumber: questionNumber++,
          text: 'Which of the following bonds is formed during a condensation reaction between two amino acids?\nA) Glycosidic\nB) Ester\nC) Peptide\nD) Hydrogen\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q2',
          questionNumber: questionNumber++,
          text: 'Which statement correctly describes a phospholipid molecule?\nA) Three fatty acids and one glycerol\nB) Two fatty acids and one phosphate group attached to glycerol\nC) Three fatty acids and one phosphate group\nD) One fatty acid and one amino acid\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q3',
          questionNumber: questionNumber++,
          text: 'Benedict\'s solution turns brick-red after heating with a solution. This indicates the presence of:\nA) Non-reducing sugar\nB) Reducing sugar\nC) Starch\nD) Protein\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q4',
          questionNumber: questionNumber++,
          text: 'In the induced-fit model of enzyme action, the active site:\nA) is rigid and complementary before binding\nB) changes shape slightly to fit substrate\nC) is identical for all enzymes\nD) is denatured after each reaction\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q5',
          questionNumber: questionNumber++,
          text: 'Which of these organelles contains circular DNA?\nA) Nucleus\nB) Mitochondrion\nC) Lysosome\nD) Golgi apparatus\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q6',
          questionNumber: questionNumber++,
          text: 'Which process requires ATP?\nA) Facilitated diffusion\nB) Osmosis\nC) Active transport\nD) Simple diffusion\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q7',
          questionNumber: questionNumber++,
          text: 'In mitosis, sister chromatids separate during:\nA) Prophase\nB) Metaphase\nC) Anaphase\nD) Telophase\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q8',
          questionNumber: questionNumber++,
          text: 'A virus differs from a bacterial cell because it:\nA) has a nucleus\nB) has ribosomes\nC) contains DNA or RNA but no cytoplasm\nD) has a cell wall made of murein\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q9',
          questionNumber: questionNumber++,
          text: 'Which component of blood carries oxygen?\nA) Platelets\nB) White cells\nC) Plasma\nD) Haemoglobin\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q10',
          questionNumber: questionNumber++,
          text: 'Which feature increases the rate of diffusion in alveoli?\nA) Low surface area\nB) Thick walls\nC) High surface area to volume ratio\nD) Reduced blood flow\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q11',
          questionNumber: questionNumber++,
          text: 'Which base is found in RNA but not in DNA?\nA) Thymine\nB) Cytosine\nC) Uracil\nD) Adenine\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q12',
          questionNumber: questionNumber++,
          text: 'The Bohr effect describes:\nA) increase in CO₂ shifts the oxyhaemoglobin curve to the right\nB) increase in CO₂ shifts it to the left\nC) effect of pH on enzyme activity\nD) effect of temperature on photosynthesis\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q13',
          questionNumber: questionNumber++,
          text: 'During DNA replication, hydrogen bonds are broken by:\nA) DNA ligase\nB) DNA helicase\nC) DNA polymerase\nD) RNA polymerase\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q14',
          questionNumber: questionNumber++,
          text: 'Which structure links adjacent plant cells for transport of water?\nA) Stomata\nB) Xylem vessels\nC) Plasmodesmata\nD) Sieve tubes\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },
        {
          id: 'bio-alevel-p1-q15',
          questionNumber: questionNumber++,
          text: 'A mutation that changes one base but does not alter the amino acid sequence is called a:\nA) Frameshift\nB) Silent\nC) Nonsense\nD) Missense\n\n[1 mark]',
          marks: 1,
          section: 'Section A – Multiple-Choice'
        },

        // Section B - Short Answer (61 marks total)
        {
          id: 'bio-alevel-p1-q16',
          questionNumber: questionNumber++,
          text: 'Describe how you would test a solution for the presence of starch.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q17',
          questionNumber: questionNumber++,
          text: 'Explain why water is described as a good solvent and why this is important for organisms.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q18',
          questionNumber: questionNumber++,
          text: 'The lock-and-key model has been replaced by the induced-fit model. Explain why the induced-fit model is a better representation of enzyme action.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q19',
          questionNumber: questionNumber++,
          text: 'Describe the process of semi-conservative replication of DNA.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q20',
          questionNumber: questionNumber++,
          text: 'Explain how the structure of cellulose makes it suitable for forming cell walls.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q21',
          questionNumber: questionNumber++,
          text: 'Compare the structure of prokaryotic and eukaryotic cells.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q22',
          questionNumber: questionNumber++,
          text: 'Describe the process of mitosis and explain its importance.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q23',
          questionNumber: questionNumber++,
          text: 'Explain how substances move across cell membranes by co-transport, using the sodium–glucose example.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q24',
          questionNumber: questionNumber++,
          text: 'Explain how antibodies lead to the destruction of bacterial cells.\n\n[5 marks]',
          marks: 5,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q25',
          questionNumber: questionNumber++,
          text: 'Describe the roles of the components of blood in the transport of oxygen and carbon dioxide.\n\n[5 marks]',
          marks: 5,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q26',
          questionNumber: questionNumber++,
          text: 'A student investigates the effect of temperature on an enzyme-controlled reaction. Describe how the rate could be measured and how results should be plotted.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q27',
          questionNumber: questionNumber++,
          text: 'Explain how the structure of a chloroplast is related to its function in photosynthesis.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q28',
          questionNumber: questionNumber++,
          text: 'The lungs of a mammal are adapted for efficient gas exchange. Explain how.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q29',
          questionNumber: questionNumber++,
          text: 'Describe the processes that lead to the formation of tissue fluid.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q30',
          questionNumber: questionNumber++,
          text: 'Explain why large organisms need specialised gas-exchange systems.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q31',
          questionNumber: questionNumber++,
          text: 'Outline how the structures of starch and glycogen are related to their functions.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q32',
          questionNumber: questionNumber++,
          text: 'Explain what is meant by a gene and a locus.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q33',
          questionNumber: questionNumber++,
          text: 'Describe the roles of mRNA and tRNA in translation.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q34',
          questionNumber: questionNumber++,
          text: 'Explain how meiosis produces genetic variation.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q35',
          questionNumber: questionNumber++,
          text: 'Define the term species and explain how courtship behaviour ensures successful mating.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q36',
          questionNumber: questionNumber++,
          text: 'A farmer uses fertiliser on his crops. Explain how excessive use of fertiliser can lead to eutrophication.\n\n[4 marks]',
          marks: 4,
          section: 'Section B – Short Answer'
        },
        {
          id: 'bio-alevel-p1-q37',
          questionNumber: questionNumber++,
          text: 'Explain why biodiversity is important for maintaining stable ecosystems.\n\n[3 marks]',
          marks: 3,
          section: 'Section B – Short Answer'
        },

        // Section C - Extended Response (15 marks)
        {
          id: 'bio-alevel-p1-q38',
          questionNumber: questionNumber++,
          text: 'A cycle is a repeated process in which the same substances are reused. Discuss how cycles involving biological molecules and organisms contribute to life on Earth.\n\nIn your answer include at least one example from each of topics 3.1 to 3.4 (e.g., ATP cycle, nitrogen cycle, cell division cycle, carbon cycle, DNA replication cycle).\n\n[15 marks]',
          marks: 15,
          section: 'Section C – Extended Response'
        }
      ];
      
      console.log('AQA A-Level Biology Paper 1 questions generated:', questions.length);
      return questions;
    }

    // AQA GCSE Biology Paper 1 format
    if (subjectId === 'biology') {
      let questionNumber = 1;
      
      const questions = [
        // Multiple Choice Questions (~10 marks)
        {
          id: 'bio-p1-q1',
          questionNumber: questionNumber++,
          text: 'Which of the following is NOT found in a plant cell?\nA) Cell wall\nB) Chloroplasts\nC) Centrioles\nD) Vacuole\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bio-p1-q2',
          questionNumber: questionNumber++,
          text: 'What is the main function of mitochondria?\nA) Protein synthesis\nB) Photosynthesis\nC) Respiration\nD) DNA storage\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bio-p1-q3',
          questionNumber: questionNumber++,
          text: 'Which blood vessel carries oxygenated blood from the lungs to the heart?\nA) Pulmonary artery\nB) Pulmonary vein\nC) Vena cava\nD) Aorta\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bio-p1-q4',
          questionNumber: questionNumber++,
          text: 'What type of pathogen causes malaria?\nA) Bacteria\nB) Virus\nC) Fungus\nD) Protist\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bio-p1-q5',
          questionNumber: questionNumber++,
          text: 'Which gas is produced during photosynthesis?\nA) Carbon dioxide\nB) Oxygen\nC) Nitrogen\nD) Hydrogen\n\n[1 mark]',
          marks: 1
        },

        // Short Factual Recall (1-2 marks) - Cell Biology
        {
          id: 'bio-p1-q6',
          questionNumber: questionNumber++,
          text: 'Name the parts of a plant cell that are not found in an animal cell.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bio-p1-q7',
          questionNumber: questionNumber++,
          text: 'Define diffusion.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bio-p1-q8',
          questionNumber: questionNumber++,
          text: 'What is the function of the ribosomes?\n\n[1 mark]',
          marks: 1
        },

        // Short Factual Recall - Organisation
        {
          id: 'bio-p1-q9',
          questionNumber: questionNumber++,
          text: 'Name the four main components of blood.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bio-p1-q10',
          questionNumber: questionNumber++,
          text: 'What is the function of the alveoli in the lungs?\n\n[1 mark]',
          marks: 1
        },

        // Short Factual Recall - Infection and Response
        {
          id: 'bio-p1-q11',
          questionNumber: questionNumber++,
          text: 'Name the three main types of pathogen.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bio-p1-q12',
          questionNumber: questionNumber++,
          text: 'Give one way white blood cells help defend the body.\n\n[1 mark]',
          marks: 1
        },

        // Short Factual Recall - Bioenergetics
        {
          id: 'bio-p1-q13',
          questionNumber: questionNumber++,
          text: 'Write the word equation for photosynthesis.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bio-p1-q14',
          questionNumber: questionNumber++,
          text: 'What is the role of chlorophyll?\n\n[1 mark]',
          marks: 1
        },

        // Structured Questions (3-4 marks) - Cell Biology
        {
          id: 'bio-p1-q15',
          questionNumber: questionNumber++,
          text: 'Explain how the structure of a root hair cell is adapted to its function.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bio-p1-q16',
          questionNumber: questionNumber++,
          text: 'A cell has an actual diameter of 0.05 mm. Under a microscope, the image diameter is 25 mm. Calculate the magnification.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'bio-p1-q17',
          questionNumber: questionNumber++,
          text: 'Describe the process of mitosis and explain why it is important.\n\n[4 marks]',
          marks: 4
        },

        // Structured Questions - Organisation
        {
          id: 'bio-p1-q18',
          questionNumber: questionNumber++,
          text: 'Explain how the small intestine is adapted for absorption.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bio-p1-q19',
          questionNumber: questionNumber++,
          text: 'Describe how the heart pumps blood around the body.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bio-p1-q20',
          questionNumber: questionNumber++,
          text: 'Explain the effect of coronary heart disease on the heart.\n\n[3 marks]',
          marks: 3
        },

        // Structured Questions - Infection and Response
        {
          id: 'bio-p1-q21',
          questionNumber: questionNumber++,
          text: 'Describe how painkillers and antibiotics differ in their effects on the body.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bio-p1-q22',
          questionNumber: questionNumber++,
          text: 'Explain how vaccination helps protect against disease.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'bio-p1-q23',
          questionNumber: questionNumber++,
          text: 'Give two reasons why new drugs are tested and trialled before use.\n\n[3 marks]',
          marks: 3
        },

        // Structured Questions - Bioenergetics
        {
          id: 'bio-p1-q24',
          questionNumber: questionNumber++,
          text: 'Describe how light intensity affects the rate of photosynthesis. Include a explanation of limiting factors.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bio-p1-q25',
          questionNumber: questionNumber++,
          text: 'Explain how oxygen debt builds up during exercise.\n\n[3 marks]',
          marks: 3
        },

        // Required Practical/Application Questions (~20 marks)
        {
          id: 'bio-p1-q26',
          questionNumber: questionNumber++,
          text: 'A student investigated the effect of sugar concentration on osmosis in plant cells.\n\nDescribe how you would carry out this investigation to obtain valid results.\n\nInclude:\n- The apparatus you would use\n- The measurements you would take\n- How you would ensure the results are reliable\n\n[5 marks]',
          marks: 5
        },
        {
          id: 'bio-p1-q27',
          questionNumber: questionNumber++,
          text: 'The table shows the number of bacteria in a culture over time:\n\nTime (hours) | Number of bacteria\n0           | 100\n2           | 200\n4           | 400\n6           | 800\n\nCalculate the mean rate of reproduction between 0 and 6 hours.\nShow your working.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'bio-p1-q28',
          questionNumber: questionNumber++,
          text: 'A student used a microscope to observe plant cells. Describe how to prepare a slide to observe onion cells and calculate the actual size of a cell.\n\n[4 marks]',
          marks: 4
        },

        // Extended Response Questions (6 marks each)
        {
          id: 'bio-p1-q29',
          questionNumber: questionNumber++,
          text: 'Compare the processes of diffusion, osmosis, and active transport.\n\nIn your answer, explain:\n- How each process works\n- When each process is used in living organisms\n- The factors that affect the rate of each process\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'bio-p1-q30',
          questionNumber: questionNumber++,
          text: 'Evaluate the use of vaccinations in controlling disease outbreaks.\n\nIn your answer, consider:\n- How vaccines work to prevent disease\n- The advantages of vaccination programmes\n- Potential concerns about vaccination\n- The concept of herd immunity\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'bio-p1-q31',
          questionNumber: questionNumber++,
          text: 'Compare aerobic and anaerobic respiration in humans and plants.\n\nIn your answer, explain:\n- The word equations for each type of respiration\n- When each type occurs\n- The differences in energy release\n- The importance of each type to organisms\n\n[6 marks]',
          marks: 6
        }
      ];
      
      console.log('AQA Biology Paper 1 questions generated:', questions.length);
      return questions;
    }

    // Special handling for AQA GCSE Chemistry Paper 1 predicted exam format
    if (subjectId === 'chemistry') {
      let questionNumber = 1;
      
      const chemistryQuestions = [
        // Atomic Structure & the Periodic Table (20 marks)
        {
          id: 'chem-p1-q1',
          questionNumber: questionNumber++,
          text: 'Name the three subatomic particles and their charges.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q2',
          questionNumber: questionNumber++,
          text: 'What is the relative atomic mass of an isotope of chlorine with mass number 37?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q3',
          questionNumber: questionNumber++,
          text: 'Who is credited with developing the periodic table used today?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q4',
          questionNumber: questionNumber++,
          text: 'Explain why atoms have no overall charge.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q5',
          questionNumber: questionNumber++,
          text: 'Describe how Mendeleev arranged the periodic table.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'chem-p1-q6',
          questionNumber: questionNumber++,
          text: 'Compare the reactivity of Group 1 elements lithium and potassium.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q7',
          questionNumber: questionNumber++,
          text: 'Explain why the noble gases are unreactive.\n\n[6 marks]',
          marks: 6
        },

        // Bonding, Structure, and Properties of Matter (20 marks)
        {
          id: 'chem-p1-q8',
          questionNumber: questionNumber++,
          text: 'What type of bond is found in sodium chloride?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q9',
          questionNumber: questionNumber++,
          text: 'Explain how chlorine atoms bond together to form a chlorine molecule.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q10',
          questionNumber: questionNumber++,
          text: 'What is meant by a "giant covalent structure"?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q11',
          questionNumber: questionNumber++,
          text: 'Explain why ionic compounds have high melting points.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q12',
          questionNumber: questionNumber++,
          text: 'Describe how metallic bonding explains the conductivity of metals.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'chem-p1-q13',
          questionNumber: questionNumber++,
          text: 'Explain why simple covalent molecules have low boiling points.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q14',
          questionNumber: questionNumber++,
          text: 'Compare the properties of diamond and graphite.\n\n[6 marks]',
          marks: 6
        },

        // Quantitative Chemistry (20 marks)
        {
          id: 'chem-p1-q15',
          questionNumber: questionNumber++,
          text: 'What is meant by "conservation of mass"?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q16',
          questionNumber: questionNumber++,
          text: 'Define "mole".\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q17',
          questionNumber: questionNumber++,
          text: 'Calculate the relative formula mass (Mr) of CO₂. (Ar: C = 12, O = 16)\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q18',
          questionNumber: questionNumber++,
          text: 'A reaction uses 48 g of magnesium (Ar = 24). How many moles is this?\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q19',
          questionNumber: questionNumber++,
          text: 'A sample of water contains 18 g. Calculate the number of moles (Mr = 18).\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q20',
          questionNumber: questionNumber++,
          text: 'Calculate the percentage mass of oxygen in H₂O. (Ar: H = 1, O = 16)\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'chem-p1-q21',
          questionNumber: questionNumber++,
          text: 'A student reacts hydrochloric acid with calcium carbonate. Describe how they could calculate the concentration of the acid using titration.\n\n[6 marks]',
          marks: 6
        },

        // Chemical Changes (20 marks)
        {
          id: 'chem-p1-q22',
          questionNumber: questionNumber++,
          text: 'What is produced when an acid reacts with a metal?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q23',
          questionNumber: questionNumber++,
          text: 'Give the pH of a neutral solution.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q24',
          questionNumber: questionNumber++,
          text: 'What ions are present in all acids?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q25',
          questionNumber: questionNumber++,
          text: 'Write a balanced symbol equation for the reaction of hydrochloric acid with sodium hydroxide.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q26',
          questionNumber: questionNumber++,
          text: 'Describe how you would carry out a titration to find the concentration of an unknown acid.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'chem-p1-q27',
          questionNumber: questionNumber++,
          text: 'Explain why reactivity increases down Group 1.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q28',
          questionNumber: questionNumber++,
          text: 'Compare the reactivity of zinc, magnesium, and copper with dilute hydrochloric acid, using the reactivity series.\n\n[6 marks]',
          marks: 6
        },

        // Energy Changes (20 marks)
        {
          id: 'chem-p1-q29',
          questionNumber: questionNumber++,
          text: 'What type of reaction releases energy to the surroundings?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q30',
          questionNumber: questionNumber++,
          text: 'Give one example of an endothermic reaction.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'chem-p1-q31',
          questionNumber: questionNumber++,
          text: 'What is meant by "activation energy"?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'chem-p1-q32',
          questionNumber: questionNumber++,
          text: 'Describe the energy changes that occur during an exothermic reaction. Explain the role of activation energy.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'chem-p1-q33',
          questionNumber: questionNumber++,
          text: 'Calculate the energy change of a reaction given: bonds broken = 2500 kJ/mol, bonds formed = 3000 kJ/mol.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q34',
          questionNumber: questionNumber++,
          text: 'Explain why some reactions are exothermic and others endothermic.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'chem-p1-q35',
          questionNumber: questionNumber++,
          text: 'Compare the advantages and disadvantages of hydrogen fuel cells with rechargeable batteries.\n\n[6 marks]',
          marks: 6
        }
      ];
      
      console.log('AQA Chemistry Paper 1 questions generated:', chemistryQuestions.length);
      return chemistryQuestions;
    }

    // Special handling for AQA A-Level Chemistry Paper 1 predicted exam format
    if (subjectId === 'chemistry-aqa-alevel') {
      let questionNumber = 1;
      
      const alevelChemistryQuestions = [
        // Section A – Physical Chemistry
        
        // 1. Atomic structure (6 marks)
        {
          id: 'chem-al-q1',
          questionNumber: questionNumber++,
          section: 'Section A – Physical Chemistry',
          text: 'Define mass number and atomic number.\n\nA sample of magnesium contains three isotopes with mass numbers 24, 25 and 26 and relative abundances 79%, 10% and 11%. Calculate the relative atomic mass of magnesium to three significant figures and explain how a time-of-flight mass spectrometer could be used to obtain these data.\n\n[6 marks]',
          marks: 6
        },
        
        // 2. Ionisation energy (6 marks)
        {
          id: 'chem-al-q2',
          questionNumber: questionNumber++,
          text: 'The first ionisation energies of sodium, magnesium and aluminium are 496, 738 and 578 kJ mol⁻¹ respectively. Explain the general trend across Period 3 and the drop between magnesium and aluminium.\n\n[6 marks]',
          marks: 6
        },
        
        // 3. Amount of substance (6 marks)
        {
          id: 'chem-al-q3',
          questionNumber: questionNumber++,
          text: 'A student dissolves 1.48 g of pure potassium carbonate in water and makes the solution up to 250.0 cm³. Calculate the concentration of the solution in mol dm⁻³ and determine the volume of 0.200 mol dm⁻³ HCl needed to completely react with 25.0 cm³ of this carbonate solution.\n\n[6 marks]',
          marks: 6
        },
        
        // 4. Bonding and structure (6 marks)
        {
          id: 'chem-al-q4',
          questionNumber: questionNumber++,
          text: 'Explain how the differences in bonding and structure account for the contrasting melting points and electrical conductivities of sodium, magnesium oxide and silicon dioxide.\n\n[6 marks]',
          marks: 6
        },
        
        // 5. Shapes of molecules and polarity (5 marks)
        {
          id: 'chem-al-q5',
          questionNumber: questionNumber++,
          text: 'Draw and describe the shapes of NH₃ and BF₃ and explain why ammonia is polar but boron trifluoride is not.\n\n[5 marks]',
          marks: 5
        },
        
        // 6. Enthalpy changes (8 marks)
        {
          id: 'chem-al-q6',
          questionNumber: questionNumber++,
          text: 'When 2.00 g of ethanol (C₂H₅OH) burn completely, the temperature of 100.0 g of water rises by 10.5 °C. Calculate the enthalpy of combustion of ethanol in kJ mol⁻¹ and comment on two reasons why the experimental value differs from the data-book value.\n\n[8 marks]',
          marks: 8
        },
        
        // 7. Hess's law (5 marks)
        {
          id: 'chem-al-q7',
          questionNumber: questionNumber++,
          text: 'Given:\nCH₄ + 2 O₂ → CO₂ + 2 H₂O   ΔH = –890 kJ mol⁻¹\nC + O₂ → CO₂   ΔH = –394 kJ mol⁻¹\nH₂ + ½ O₂ → H₂O   ΔH = –286 kJ mol⁻¹\n\nUse these data to determine the enthalpy change for C + 2 H₂ → CH₄ and describe the principle of Hess\'s law.\n\n[5 marks]',
          marks: 5
        },
        
        // 8. Kinetics (7 marks)
        {
          id: 'chem-al-q8',
          questionNumber: questionNumber++,
          text: 'The decomposition of hydrogen peroxide is studied at several temperatures. A plot of ln k against 1/T gives a straight line. Explain how the activation energy and frequency factor can be obtained from this graph. Describe the shape of a Maxwell–Boltzmann distribution and explain, in terms of the distribution, why increasing the temperature increases the rate of reaction.\n\n[7 marks]',
          marks: 7
        },
        
        // 9. Equilibrium (6 marks)
        {
          id: 'chem-al-q9',
          questionNumber: questionNumber++,
          text: 'For the equilibrium\nN₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)   ΔH = –92 kJ mol⁻¹\n\nExplain the effects of increasing pressure, temperature and adding a catalyst on yield and rate, referring to Le Chatelier\'s principle and collision theory.\n\n[6 marks]',
          marks: 6
        },
        
        // 10. Equilibrium constant Kc (6 marks)
        {
          id: 'chem-al-q10',
          questionNumber: questionNumber++,
          text: 'At 400 °C, the equilibrium mixture for the reaction\n2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)\ncontains [SO₂] = 0.30 mol dm⁻³, [O₂] = 0.20 mol dm⁻³ and [SO₃] = 0.60 mol dm⁻³. Calculate Kc and state its units. Predict the effect on Kc if temperature is increased.\n\n[6 marks]',
          marks: 6
        },
        
        // 11. Thermodynamics (7 marks)
        {
          id: 'chem-al-q11',
          questionNumber: questionNumber++,
          text: 'Define entropy and Gibbs free energy. For a reaction with ΔH = +85 kJ mol⁻¹ and ΔS = +250 J K⁻¹ mol⁻¹, calculate ΔG at 298 K and determine whether the reaction is feasible at this temperature. Calculate the temperature at which it becomes feasible.\n\n[7 marks]',
          marks: 7
        },
        
        // 12. Electrode potentials (7 marks)
        {
          id: 'chem-al-q12',
          questionNumber: questionNumber++,
          text: 'A cell is set up using the half-cells\nFe³⁺(aq) + e⁻ ⇌ Fe²⁺(aq)   E° = +0.77 V\nand Zn²⁺(aq) + 2 e⁻ ⇌ Zn(s)   E° = –0.76 V.\n\nWrite the overall cell equation and calculate the EMF of the cell. Explain what happens to the EMF if the concentration of Fe³⁺ is decreased. Describe how a hydrogen–oxygen fuel cell operates and state one advantage of using fuel cells in vehicles.\n\n[7 marks]',
          marks: 7
        },
        
        // Section B – Inorganic Chemistry
        
        // 13. Periodicity (6 marks)
        {
          id: 'chem-al-q13',
          questionNumber: questionNumber++,
          section: 'Section B – Inorganic Chemistry',
          text: 'Describe and explain the trend in melting point across the elements sodium to argon in Period 3 and explain why aluminium has a higher melting point than sodium while argon has a very low melting point.\n\n[6 marks]',
          marks: 6
        },
        
        // 14. Group 2 (6 marks)
        {
          id: 'chem-al-q14',
          questionNumber: questionNumber++,
          text: 'Describe how the reactivity of Group 2 metals with water changes down the group and write equations for the reactions of magnesium and barium with water. Explain this trend in terms of ionisation energy.\n\n[6 marks]',
          marks: 6
        },
        
        // 15. Group 7 (6 marks)
        {
          id: 'chem-al-q15',
          questionNumber: questionNumber++,
          text: 'Describe and explain the trend in boiling points and oxidising power of the halogens from fluorine to iodine. Write ionic equations to show how chlorine can displace bromine and iodine from their salts and explain why chlorine acts as an oxidising agent.\n\n[6 marks]',
          marks: 6
        },
        
        // 16. Redox titration (8 marks)
        {
          id: 'chem-al-q16',
          questionNumber: questionNumber++,
          text: 'In an experiment, 25.0 cm³ of Fe²⁺ solution required 24.80 cm³ of 0.0200 mol dm⁻³ acidified KMnO₄ for complete oxidation. Write the ionic equation for the reaction and calculate the concentration of Fe²⁺ in mol dm⁻³ and g dm⁻³ as FeSO₄·7H₂O. Explain why no indicator is needed.\n\n[8 marks]',
          marks: 8
        },
        
        // 17. Transition metals (8 marks)
        {
          id: 'chem-al-q17',
          questionNumber: questionNumber++,
          text: 'Describe the bonding and structure of complex ions including the terms ligand, coordination number and dative covalent bond. Explain why transition metals form coloured ions, referring to the splitting of d orbitals. Describe and explain the ligand substitution when aqueous copper(II) ions react with excess ammonia.\n\n[8 marks]',
          marks: 8
        },
        
        // 18. Periodic trends in oxides (7 marks)
        {
          id: 'chem-al-q18',
          questionNumber: questionNumber++,
          text: 'Explain how the reactions of the Period 3 oxides with water show the change from basic to acidic character across the period. Write balanced equations for the reactions of sodium oxide, aluminium oxide and phosphorus(V) oxide with water and state the approximate pH of each resulting solution.\n\n[7 marks]',
          marks: 7
        },
        
        // 19. Qualitative analysis (5 marks)
        {
          id: 'chem-al-q19',
          questionNumber: questionNumber++,
          text: 'Describe chemical tests to distinguish between aqueous solutions containing chloride, bromide and iodide ions. Include observations and any further confirmatory tests required.\n\n[5 marks]',
          marks: 5
        },
        
        // 20. Extended response – industrial chemistry (10 marks)
        {
          id: 'chem-al-q20',
          questionNumber: questionNumber++,
          text: 'Discuss how principles of kinetics, equilibrium and thermodynamics are applied in large-scale industrial manufacture of ammonia by the Haber process. Include reference to operating conditions, energy efficiency, catalysts and the balance between economic and environmental considerations.\n\n[10 marks]',
          marks: 10
        }
      ];
      
      console.log('AQA A-Level Chemistry Paper 1 questions generated:', alevelChemistryQuestions.length);
      return alevelChemistryQuestions;
    }

    // Special handling for AQA GCSE Business Paper 1 predicted exam format
    if (subjectId === 'business') {
      let questionNumber = 1;
      
      const businessQuestions = [
        // Section A: Knowledge & Understanding (~20 marks)
        // Business in the Real World
        {
          id: 'bus-p1-q1',
          questionNumber: questionNumber++,
          text: 'Define "entrepreneur".\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q2',
          questionNumber: questionNumber++,
          text: 'Give one objective of a business.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q3',
          questionNumber: questionNumber++,
          text: 'State one advantage of being a sole trader.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q4',
          questionNumber: questionNumber++,
          text: 'What is the difference between goods and services?\n\n[2 marks]',
          marks: 2
        },

        // Influences on Business
        {
          id: 'bus-p1-q5',
          questionNumber: questionNumber++,
          text: 'Define "stakeholder".\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q6',
          questionNumber: questionNumber++,
          text: 'Give one environmental factor that can influence business activity.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q7',
          questionNumber: questionNumber++,
          text: 'What is meant by "legislation"?\n\n[2 marks]',
          marks: 2
        },

        // Business Operations
        {
          id: 'bus-p1-q8',
          questionNumber: questionNumber++,
          text: 'What is meant by "job production"?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'bus-p1-q9',
          questionNumber: questionNumber++,
          text: 'Give one method of achieving quality in a business.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q10',
          questionNumber: questionNumber++,
          text: 'State one advantage of flow production.\n\n[1 mark]',
          marks: 1
        },

        // Human Resources
        {
          id: 'bus-p1-q11',
          questionNumber: questionNumber++,
          text: 'Define "recruitment".\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q12',
          questionNumber: questionNumber++,
          text: 'Give one reason why a business trains its employees.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q13',
          questionNumber: questionNumber++,
          text: 'State one financial method of motivation.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'bus-p1-q14',
          questionNumber: questionNumber++,
          text: 'What is meant by "flexible working"?\n\n[2 marks]',
          marks: 2
        },

        // Section B: Application & Analysis (~35 marks)
        // 3-4 mark structured questions
        {
          id: 'bus-p1-q15',
          questionNumber: questionNumber++,
          text: 'Explain one advantage and one disadvantage of being a franchisee.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bus-p1-q16',
          questionNumber: questionNumber++,
          text: 'Explain how technology can help a business operate more efficiently.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bus-p1-q17',
          questionNumber: questionNumber++,
          text: 'Explain how pressure groups might affect business behaviour.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'bus-p1-q18',
          questionNumber: questionNumber++,
          text: 'Explain the impact of changing interest rates on a business.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bus-p1-q19',
          questionNumber: questionNumber++,
          text: 'Explain the difference between job and batch production.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bus-p1-q20',
          questionNumber: questionNumber++,
          text: 'Explain how Just-in-Time stock control can help a business.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'bus-p1-q21',
          questionNumber: questionNumber++,
          text: 'Explain the difference between internal and external recruitment.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'bus-p1-q22',
          questionNumber: questionNumber++,
          text: 'Explain one benefit and one drawback of on-the-job training.\n\n[4 marks]',
          marks: 4
        },

        // 6-9 mark application/analysis questions
        {
          id: 'bus-p1-q23',
          questionNumber: questionNumber++,
          text: 'Sarah owns a small bakery and wants to expand her business. She is considering becoming a private limited company.\n\nAnalyse the advantages and disadvantages of Sarah changing her bakery from a sole trader to a private limited company.\n\n[9 marks]',
          marks: 9
        },
        {
          id: 'bus-p1-q24',
          questionNumber: questionNumber++,
          text: 'A clothing company called Fashion Forward imports materials from overseas suppliers.\n\nAnalyse how changes in exchange rates could affect Fashion Forward.\n\n[9 marks]',
          marks: 9
        },

        // Section C: Extended Responses (~35 marks)
        {
          id: 'bus-p1-q25',
          questionNumber: questionNumber++,
          text: 'A furniture manufacturer is deciding between batch production and flow production for their new product line.\n\nAnalyse the advantages and disadvantages of each production method for this furniture manufacturer.\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'bus-p1-q26',
          questionNumber: questionNumber++,
          text: 'Green Electronics is a growing business that needs to recruit more staff. The HR manager is deciding whether to recruit internally or externally.\n\nJustify whether Green Electronics should recruit internally or externally for these new positions.\n\n[9 marks]',
          marks: 9
        },
        {
          id: 'bus-p1-q27',
          questionNumber: questionNumber++,
          text: 'A retail store is considering offering commission to sales staff as a method of motivation instead of just paying hourly wages.\n\nAnalyse the advantages and disadvantages of using commission as a method of motivation for sales staff.\n\n[8 marks]',
          marks: 8
        },

        // 12 mark extended evaluation questions
        {
          id: 'bus-p1-q28',
          questionNumber: questionNumber++,
          text: '"Profit is the most important objective for all businesses."\n\nTo what extent do you agree with this statement?\n\nIn your answer, you should:\n• Consider different business objectives\n• Evaluate the importance of profit compared to other objectives\n• Use examples to support your arguments\n• Reach a justified conclusion\n\n[12 marks]',
          marks: 12
        },
        {
          id: 'bus-p1-q29',
          questionNumber: questionNumber++,
          text: '"The external environment is the most important influence on business success."\n\nTo what extent do you agree with this statement?\n\nIn your answer, you should:\n• Analyse internal and external factors that influence business success\n• Evaluate which factors are most important\n• Use business examples to support your analysis\n• Reach a justified conclusion\n\n[12 marks]',
          marks: 12
        }
      ];
      
      console.log('AQA Business Paper 1 questions generated:', businessQuestions.length);
      return businessQuestions;
    }

    // Special handling for Edexcel GCSE Maths Paper 1 (Non-Calculator) predicted exam format
    if (subjectId === 'maths-edexcel') {
      console.log('🎯 GENERATING EDEXCEL MATHS PAPER 1 QUESTIONS');
      let questionNumber = 1;
      
      const edexcelMathsQuestions = [
        // Number (1-2 mark questions)
        { number: questionNumber++, text: "Simplify 36/48.", marks: 1, topic: "Number" },
        { number: questionNumber++, text: "Find the HCF of 72 and 48.", marks: 2, topic: "Number" },
        
        // Algebra (1-2 mark questions)  
        { number: questionNumber++, text: "Expand (x + 4)(x - 2).", marks: 2, topic: "Algebra" },
        { number: questionNumber++, text: "Solve 3x + 7 = 19.", marks: 2, topic: "Algebra" },
        
        // Ratio, Proportion & Rates (3 mark questions)
        { number: questionNumber++, text: "A recipe for 12 cookies uses 300 g flour. Work out the flour needed for 18 cookies.", marks: 3, topic: "Ratio, Proportion & Rates of Change" },
        { number: questionNumber++, text: "A car travels 180 km in 3 hours. Work out the average speed.", marks: 3, topic: "Ratio, Proportion & Rates of Change" },
        
        // Geometry & Measures (3 mark question)
        { number: questionNumber++, text: "The interior angle of a regular polygon is 150°. Find the number of sides.", marks: 3, topic: "Geometry & Measures" },
        
        // Probability (1-2 mark questions)
        { number: questionNumber++, text: "A bag has 3 red and 7 blue counters. Work out the probability of selecting red.", marks: 1, topic: "Probability" },
        { number: questionNumber++, text: "A spinner has 5 equal sections numbered 1-5. Find the probability of getting an even number.", marks: 2, topic: "Probability" },
        
        // Statistics (2 mark question)
        { number: questionNumber++, text: "The ages of 5 children are 10, 11, 9, 13, 12. Find the median.", marks: 2, topic: "Statistics" },
        
        // Number (3 mark question)
        { number: questionNumber++, text: "Share £840 in the ratio 2:3:5.", marks: 3, topic: "Number" },
        
        // Algebra (4 mark question)
        { number: questionNumber++, text: "Solve simultaneously: 2x + y = 10, x - y = 1.", marks: 4, topic: "Algebra" },
        
        // Geometry & Measures (3 mark question)
        { number: questionNumber++, text: "A sphere has radius 3 cm. Work out its volume. (Use 4/3 πr³)", marks: 3, topic: "Geometry & Measures" },
        
        // Probability (5 mark question)
        { number: questionNumber++, text: "A bag has 5 red and 3 blue counters. Two counters are taken without replacement. Work out the probability both are red.", marks: 5, topic: "Probability" },
        
        // Algebra (6 mark question)
        { number: questionNumber++, text: "Solve 2x² - 5x - 3 = 0.", marks: 6, topic: "Algebra" },
        
        // Number (5 mark question)
        { number: questionNumber++, text: "A car costs £12,000 and decreases by 15% each year. Work out its value after 3 years.", marks: 5, topic: "Number" },
        
        // Geometry & Measures (6 mark question)
        { number: questionNumber++, text: "A cylinder has radius 3 cm and height 10 cm. Calculate its surface area.", marks: 6, topic: "Geometry & Measures" },
        
        // Algebra (6 mark reasoning question)
        { number: questionNumber++, text: "Show that the difference between the squares of two consecutive integers is always odd.", marks: 6, topic: "Algebra" },
        
        // Ratio, Proportion & Rates (6 mark question)
        { number: questionNumber++, text: "£60 is shared between A and B in the ratio 5:7. A gives £6 to B. Find the new ratio.", marks: 6, topic: "Ratio, Proportion & Rates of Change" },
        
        // Statistics (5 mark question)
        { number: questionNumber++, text: "The marks of 40 students are grouped into intervals. Estimate the mean from the frequency table.", marks: 5, topic: "Statistics" }
      ];

      console.log('✅ Generated', edexcelMathsQuestions.length, 'Edexcel Maths Paper 1 questions');
      
      return edexcelMathsQuestions.map(q => ({
        id: `q${q.number}`,
        questionNumber: q.number,
        text: q.text,
        marks: q.marks,
        topic: q.topic,
        userAnswer: '',
        isCorrect: null,
        feedback: '',
        modelAnswer: ''
      }));
    }

    // Special handling for Edexcel IGCSE Business Paper 1 predicted exam format
    if (subjectId === 'business-edexcel-igcse') {
      console.log('🎯 GENERATING EDEXCEL IGCSE BUSINESS PAPER 1 QUESTIONS');
      let questionNumber = 1;
      
      const igcseBusinessQuestions = [
        // Business activity and influences on business
        { number: questionNumber++, text: 'Define "opportunity cost".', marks: 2, topic: "Business Activity" },
        { number: questionNumber++, text: "Explain two reasons why a business might set objectives.", marks: 4, topic: "Business Activity" },
        { number: questionNumber++, text: "A small retailer is considering becoming a private limited company. Analyse the advantages and disadvantages of this change.", marks: 6, topic: "Business Activity" },
        { number: questionNumber++, text: '"The main aim of all businesses is profit." To what extent do you agree? Justify your answer with examples.', marks: 12, topic: "Business Activity" },
        
        // People in business
        { number: questionNumber++, text: 'What is meant by "span of control"?', marks: 2, topic: "People in Business" },
        { number: questionNumber++, text: "Explain the difference between internal and external recruitment.", marks: 3, topic: "People in Business" },
        { number: questionNumber++, text: "A business is expanding and needs more managers. Analyse whether it should promote internally or recruit externally.", marks: 8, topic: "People in Business" },
        { number: questionNumber++, text: '"Motivation is the most important role of Human Resources." To what extent do you agree? Use examples to support your answer.', marks: 12, topic: "People in Business" },
        
        // Business finance
        { number: questionNumber++, text: 'Define "cash flow".', marks: 2, topic: "Business Finance" },
        { number: questionNumber++, text: "Explain one advantage and one disadvantage of using a bank loan as a source of finance.", marks: 4, topic: "Business Finance" },
        { number: questionNumber++, text: "A new café needs £50,000 to expand. Analyse whether it should use retained profit or a bank loan.", marks: 8, topic: "Business Finance" },
        { number: questionNumber++, text: '"Cash flow is more important than profit." To what extent do you agree? Justify your answer.', marks: 12, topic: "Business Finance" },
        
        // Marketing
        { number: questionNumber++, text: 'Define "market segmentation".', marks: 2, topic: "Marketing" },
        { number: questionNumber++, text: "Explain one advantage and one disadvantage of using social media for promotion.", marks: 4, topic: "Marketing" },
        { number: questionNumber++, text: "A new sports drink is being launched. Analyse whether it should use price skimming or penetration pricing.", marks: 8, topic: "Marketing" },
        
        // Business operations
        { number: questionNumber++, text: 'What is meant by "Just in Time" (JIT) stock control?', marks: 2, topic: "Business Operations" },
        { number: questionNumber++, text: "Explain the difference between batch and flow production.", marks: 3, topic: "Business Operations" },
        { number: questionNumber++, text: "A shoe manufacturer is deciding between job production and batch production. Analyse the advantages and disadvantages of each method.", marks: 8, topic: "Business Operations" }
      ];

      console.log('✅ Generated', igcseBusinessQuestions.length, 'IGCSE Business Paper 1 questions');
      
      return igcseBusinessQuestions.map(q => ({
        id: `q${q.number}`,
        questionNumber: q.number,
        text: q.text,
        marks: q.marks,
        topic: q.topic,
        userAnswer: '',
        isCorrect: null,
        feedback: '',
        modelAnswer: ''
      }));
    }

    // Special handling for Edexcel Chemistry Paper 1 predicted exam format
    if (subjectId === 'chemistry-edexcel') {
      console.log('🎯 GENERATING EDEXCEL CHEMISTRY PAPER 1 QUESTIONS');
      let questionNumber = 1;
      
      const edexcelChemistryQuestions = [
        // Atomic Structure & Periodic Table
        { number: questionNumber++, text: 'State the relative charges of protons, neutrons, and electrons.', marks: 2, topic: "Atomic Structure & Periodic Table" },
        { number: questionNumber++, text: "What is the mass number of an atom with 12 protons and 12 neutrons?", marks: 1, topic: "Atomic Structure & Periodic Table" },
        { number: questionNumber++, text: "Name the scientist who arranged the periodic table by atomic number.", marks: 1, topic: "Atomic Structure & Periodic Table" },
        { number: questionNumber++, text: "Explain why atoms have no overall charge.", marks: 3, topic: "Atomic Structure & Periodic Table" },
        { number: questionNumber++, text: "Compare the reactivity of lithium and potassium.", marks: 4, topic: "Atomic Structure & Periodic Table" },
        { number: questionNumber++, text: "Explain how the reactivity of Group 7 elements changes down the group.", marks: 6, topic: "Atomic Structure & Periodic Table" },
        
        // Bonding, Structure & Properties of Matter
        { number: questionNumber++, text: "What type of bond is found in sodium chloride?", marks: 1, topic: "Bonding, Structure & Properties" },
        { number: questionNumber++, text: "Describe the bonding in a molecule of oxygen.", marks: 2, topic: "Bonding, Structure & Properties" },
        { number: questionNumber++, text: "Explain why ionic compounds have high melting points.", marks: 3, topic: "Bonding, Structure & Properties" },
        { number: questionNumber++, text: "Explain why diamond and graphite have very different properties, even though both are forms of carbon.", marks: 4, topic: "Bonding, Structure & Properties" },
        { number: questionNumber++, text: "Evaluate the advantages and disadvantages of using nanoparticles in medicine.", marks: 6, topic: "Bonding, Structure & Properties" },
        
        // Quantitative Chemistry
        { number: questionNumber++, text: 'Define "mole".', marks: 1, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "Calculate the relative formula mass (Mr) of CO₂.", marks: 2, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "A reaction uses 48 g of magnesium (Ar = 24). Calculate the number of moles.", marks: 3, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "Calculate the percentage mass of oxygen in H₂O.", marks: 3, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "A student reacts 25 g of calcium carbonate (Mr = 100) with excess acid. Calculate the number of moles of calcium carbonate.", marks: 3, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "A sample of NaCl contains 0.5 moles. Calculate its mass. (Ar Na=23, Cl=35.5).", marks: 3, topic: "Quantitative Chemistry" },
        { number: questionNumber++, text: "Evaluate the importance of atom economy in chemical reactions.", marks: 6, topic: "Quantitative Chemistry" },
        
        // Chemical Changes
        { number: questionNumber++, text: "Give the pH of a neutral solution.", marks: 1, topic: "Chemical Changes" },
        { number: questionNumber++, text: "What ions are present in all acids?", marks: 1, topic: "Chemical Changes" },
        { number: questionNumber++, text: "What type of reaction takes place when magnesium reacts with hydrochloric acid?", marks: 1, topic: "Chemical Changes" },
        { number: questionNumber++, text: "Write a balanced equation for the reaction of hydrochloric acid with sodium hydroxide.", marks: 3, topic: "Chemical Changes" },
        { number: questionNumber++, text: "Explain why potassium is more reactive than lithium.", marks: 3, topic: "Chemical Changes" },
        { number: questionNumber++, text: "A titration requires 25 cm³ of 0.2 mol/dm³ HCl to neutralise NaOH. Calculate the moles of HCl used.", marks: 3, topic: "Chemical Changes" },
        { number: questionNumber++, text: "Describe how you would carry out a titration to determine the concentration of an acid.", marks: 6, topic: "Chemical Changes" },
        
        // Energy Changes
        { number: questionNumber++, text: "What type of reaction releases energy to the surroundings?", marks: 1, topic: "Energy Changes" },
        { number: questionNumber++, text: "State one everyday use of an endothermic reaction.", marks: 1, topic: "Energy Changes" },
        { number: questionNumber++, text: "Describe the energy changes that occur during an exothermic reaction.", marks: 4, topic: "Energy Changes" },
        { number: questionNumber++, text: "Define activation energy.", marks: 2, topic: "Energy Changes" },
        { number: questionNumber++, text: "The bond energy of H–H is 436 kJ/mol and Cl–Cl is 242 kJ/mol. The bond energy of H–Cl is 431 kJ/mol. Calculate the energy change for the reaction: H₂ + Cl₂ → 2HCl.", marks: 6, topic: "Energy Changes" },
        { number: questionNumber++, text: "Compare the advantages and disadvantages of hydrogen fuel cells and rechargeable batteries.", marks: 6, topic: "Energy Changes" }
      ];

      console.log('✅ Generated', edexcelChemistryQuestions.length, 'Edexcel Chemistry Paper 1 questions');
      
      return edexcelChemistryQuestions.map(q => ({
        id: `q${q.number}`,
        questionNumber: q.number,
        text: q.text,
        marks: q.marks,
        topic: q.topic,
        userAnswer: '',
        isCorrect: null,
        feedback: '',
        modelAnswer: ''
      }));
    }

    // Special handling for Edexcel Physics Paper 1 predicted exam format
    if (subjectId === 'physics-edexcel') {
      console.log('🎯 GENERATING EDEXCEL PHYSICS PAPER 1 QUESTIONS');
      let physicsQuestionNumber = 1;
      
      const edexcelPhysicsQuestions = [
        // Energy
        { number: physicsQuestionNumber++, text: "State the law of conservation of energy.", marks: 1, topic: "Energy" },
        { number: physicsQuestionNumber++, text: "What is meant by efficiency?", marks: 2, topic: "Energy" },
        { number: physicsQuestionNumber++, text: "Give one example of a renewable energy source.", marks: 1, topic: "Energy" },
        { number: physicsQuestionNumber++, text: "A 2 kg object is lifted 5 m. Calculate the increase in gravitational potential energy.", marks: 3, topic: "Energy" },
        { number: physicsQuestionNumber++, text: "A motor transfers 200 J in 4 s. Calculate the power.", marks: 3, topic: "Energy" },
        { number: physicsQuestionNumber++, text: "Compare the advantages and disadvantages of renewable and non-renewable energy resources.", marks: 6, topic: "Energy" },
        
        // Electricity
        { number: physicsQuestionNumber++, text: "State Ohm's Law.", marks: 1, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "What is the potential difference of UK mains electricity?", marks: 1, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "Define resistance.", marks: 2, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "A lamp has a resistance of 12 Ω and a current of 4 A flows. Calculate the potential difference.", marks: 3, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "A circuit transfers 60 J when 3 C of charge flows. Calculate the potential difference.", marks: 3, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "State what a resistor is used for in an electrical circuit.", marks: 1, topic: "Electricity" },
        { number: physicsQuestionNumber++, text: "Explain how resistance changes in a filament lamp as current increases.", marks: 6, topic: "Electricity" },
        
        // Particle Model of Matter
        { number: physicsQuestionNumber++, text: "State the formula for density.", marks: 1, topic: "Particle Model of Matter" },
        { number: physicsQuestionNumber++, text: "What is meant by specific latent heat?", marks: 2, topic: "Particle Model of Matter" },
        { number: physicsQuestionNumber++, text: "Name the change of state from gas to liquid.", marks: 1, topic: "Particle Model of Matter" },
        { number: physicsQuestionNumber++, text: "A block has a mass of 0.8 kg and a volume of 0.0002 m³. Calculate its density.", marks: 3, topic: "Particle Model of Matter" },
        { number: physicsQuestionNumber++, text: "A 2 kg object is heated, increasing its temperature by 15 °C. The specific heat capacity is 4200 J/kg°C. Calculate the energy transferred.", marks: 4, topic: "Particle Model of Matter" },
        { number: physicsQuestionNumber++, text: "Explain the difference in particle behaviour between evaporation and boiling.", marks: 6, topic: "Particle Model of Matter" },
        
        // Atomic Structure
        { number: physicsQuestionNumber++, text: "Name the three types of nuclear radiation.", marks: 2, topic: "Atomic Structure" },
        { number: physicsQuestionNumber++, text: "Which type of radiation is stopped by a sheet of paper?", marks: 1, topic: "Atomic Structure" },
        { number: physicsQuestionNumber++, text: "What is meant by half-life?", marks: 2, topic: "Atomic Structure" },
        { number: physicsQuestionNumber++, text: "A radioactive isotope has a half-life of 5 years. Its activity starts at 400 Bq. Calculate the activity after 15 years.", marks: 3, topic: "Atomic Structure" },
        { number: physicsQuestionNumber++, text: "A nucleus emits an alpha particle. State how the atomic and mass numbers change.", marks: 2, topic: "Atomic Structure" },
        { number: physicsQuestionNumber++, text: "Compare the uses and risks of gamma radiation and alpha radiation in medicine.", marks: 6, topic: "Atomic Structure" }
      ];

      console.log('✅ Generated', edexcelPhysicsQuestions.length, 'Edexcel Physics Paper 1 questions');
      
      return edexcelPhysicsQuestions.map(q => ({
        id: `q${q.number}`,
        questionNumber: q.number,
        text: q.text,
        marks: q.marks,
        topic: q.topic,
        userAnswer: '',
        isCorrect: null,
        feedback: '',
        modelAnswer: ''
      }));
    }

    // Special handling for AQA Combined Science: Trilogy Biology Paper 1 predicted exam format
    if (subjectId === 'combined-science-aqa') {
      console.log('Generating Combined Science Biology Paper 1 questions...');
      let questionNumber = 1;
      
      const combinedScienceBiologyQuestions = [
        // Cell Biology (15 marks)
        {
          id: 'csb-p1-q1',
          questionNumber: questionNumber++,
          text: 'Name the part of a cell where respiration mainly happens.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q2',
          questionNumber: questionNumber++,
          text: 'State one difference between a bacterial cell and an animal cell.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q3',
          questionNumber: questionNumber++,
          text: 'A cell has actual size 0.02 mm. The image size is 20 mm. Calculate magnification.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'csb-p1-q4',
          questionNumber: questionNumber++,
          text: 'Describe the process of mitosis.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'csb-p1-q5',
          questionNumber: questionNumber++,
          text: 'Compare diffusion, osmosis and active transport.\n\n[6 marks]',
          marks: 6
        },

        // Organisation (15 marks)
        {
          id: 'csb-p1-q6',
          questionNumber: questionNumber++,
          text: 'What is the function of red blood cells?\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q7',
          questionNumber: questionNumber++,
          text: 'State the role of the alveoli.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q8',
          questionNumber: questionNumber++,
          text: 'Explain how the small intestine is adapted for absorption.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'csb-p1-q9',
          questionNumber: questionNumber++,
          text: 'Explain how stents help treat coronary heart disease.\n\n[3 marks]',
          marks: 3
        },
        {
          id: 'csb-p1-q10',
          questionNumber: questionNumber++,
          text: 'Compare the structure and function of arteries, veins and capillaries.\n\n[6 marks]',
          marks: 6
        },

        // Infection and Response (15 marks)
        {
          id: 'csb-p1-q11',
          questionNumber: questionNumber++,
          text: 'Name the type of microorganism that causes measles.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q12',
          questionNumber: questionNumber++,
          text: 'What is the purpose of vaccination?\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'csb-p1-q13',
          questionNumber: questionNumber++,
          text: 'Explain how vaccination helps protect the body from infection.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'csb-p1-q14',
          questionNumber: questionNumber++,
          text: 'State one reason why antibiotics do not kill viruses.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q15',
          questionNumber: questionNumber++,
          text: 'Evaluate the use of antibiotics and explain why overuse is a problem.\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'csb-p1-q16',
          questionNumber: questionNumber++,
          text: 'Evaluate the use of vaccination programmes in controlling disease outbreaks.\n\n[6 marks]',
          marks: 6
        },

        // Bioenergetics (25 marks)
        {
          id: 'csb-p1-q17',
          questionNumber: questionNumber++,
          text: 'Write the word equation for photosynthesis.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'csb-p1-q18',
          questionNumber: questionNumber++,
          text: 'State one factor that can limit the rate of photosynthesis.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q19',
          questionNumber: questionNumber++,
          text: 'Describe how light intensity affects the rate of photosynthesis.\n\n[4 marks]',
          marks: 4
        },
        {
          id: 'csb-p1-q20',
          questionNumber: questionNumber++,
          text: 'A student counts 50 bubbles in 1 minute from pondweed. Calculate the rate per second.\n\n[2 marks]',
          marks: 2
        },
        {
          id: 'csb-p1-q21',
          questionNumber: questionNumber++,
          text: 'Suggest one way farmers can increase crop yield in a greenhouse.\n\n[1 mark]',
          marks: 1
        },
        {
          id: 'csb-p1-q22',
          questionNumber: questionNumber++,
          text: 'Compare aerobic and anaerobic respiration in humans.\n\n[6 marks]',
          marks: 6
        },
        {
          id: 'csb-p1-q23',
          questionNumber: questionNumber++,
          text: 'Evaluate the advantages and disadvantages of controlling limiting factors in commercial greenhouses.\n\n[6 marks]',
          marks: 6
        }
      ];
      
      console.log('AQA Combined Science Biology Paper 1 questions generated:', combinedScienceBiologyQuestions.length);
      return combinedScienceBiologyQuestions;
    }

    // Special format for Geography B (OCR) - Paper 1: Our Natural World
    if (subjectId === 'geography-b-ocr') {
      console.log('Loading Geography B (OCR) Paper 1: Our Natural World questions...');
      
      const ocrGeographyQuestions: ExamQuestion[] = [
        // Topic 1 – Global Hazards (20 marks)
        {
          id: 'ocr-geo-1a',
          questionNumber: 1,
          text: 'What is meant by the term natural hazard?',
          marks: 1,
          section: 'Global Hazards'
        },
        {
          id: 'ocr-geo-1b',
          questionNumber: 2,
          text: 'Identify two types of natural hazards.',
          marks: 2,
          section: 'Global Hazards'
        },
        {
          id: 'ocr-geo-1c',
          questionNumber: 3,
          text: 'Explain how convection currents cause tectonic plate movement.',
          marks: 4,
          section: 'Global Hazards'
        },
        {
          id: 'ocr-geo-1d',
          questionNumber: 4,
          text: 'Describe the global distribution of tropical storms.',
          marks: 3,
          section: 'Global Hazards'
        },
        {
          id: 'ocr-geo-1e',
          questionNumber: 5,
          text: 'Explain how the effects of tropical storms differ between LICs and HICs. Use examples.',
          marks: 6,
          section: 'Global Hazards'
        },
        {
          id: 'ocr-geo-1f',
          questionNumber: 6,
          text: 'Evaluate how technology can reduce the impacts of tectonic hazards.',
          marks: 4,
          section: 'Global Hazards'
        },
        
        // Topic 2 – Changing Climate (15 marks)
        {
          id: 'ocr-geo-2a',
          questionNumber: 7,
          text: 'Outline one piece of evidence that shows climate has changed since the Quaternary period.',
          marks: 2,
          section: 'Changing Climate'
        },
        {
          id: 'ocr-geo-2b',
          questionNumber: 8,
          text: 'Explain two natural causes of climate change.',
          marks: 4,
          section: 'Changing Climate'
        },
        {
          id: 'ocr-geo-2c',
          questionNumber: 9,
          text: 'Describe the relationship between CO₂ levels and global temperatures.',
          marks: 3,
          section: 'Changing Climate'
        },
        {
          id: 'ocr-geo-2d',
          questionNumber: 10,
          text: 'Explain how climate change could affect the UK.',
          marks: 4,
          section: 'Changing Climate'
        },
        {
          id: 'ocr-geo-2e',
          questionNumber: 11,
          text: 'Evaluate the effectiveness of one strategy designed to reduce the impacts of climate change.',
          marks: 2,
          section: 'Changing Climate'
        },
        
        // Topic 3 – Distinctive Landscapes (16 marks)
        {
          id: 'ocr-geo-3a',
          questionNumber: 12,
          text: 'Define the term landscape.',
          marks: 1,
          section: 'Distinctive Landscapes'
        },
        {
          id: 'ocr-geo-3b',
          questionNumber: 13,
          text: 'Identify one upland and one lowland area in the UK.',
          marks: 2,
          section: 'Distinctive Landscapes'
        },
        {
          id: 'ocr-geo-3c',
          questionNumber: 14,
          text: 'Explain how geology influences the formation of distinctive landscapes in the UK.',
          marks: 4,
          section: 'Distinctive Landscapes'
        },
        {
          id: 'ocr-geo-3d',
          questionNumber: 15,
          text: 'Describe two coastal landforms and explain how they are formed.',
          marks: 5,
          section: 'Distinctive Landscapes'
        },
        {
          id: 'ocr-geo-3e',
          questionNumber: 16,
          text: 'Assess the effectiveness of one management strategy used to protect a UK coastal landscape.',
          marks: 4,
          section: 'Distinctive Landscapes'
        },
        
        // Topic 4 – Sustaining Ecosystems (16 marks)
        {
          id: 'ocr-geo-4a',
          questionNumber: 17,
          text: 'Define the term ecosystem.',
          marks: 1,
          section: 'Sustaining Ecosystems'
        },
        {
          id: 'ocr-geo-4b',
          questionNumber: 18,
          text: 'Identify two examples of biomes and describe one characteristic of each.',
          marks: 3,
          section: 'Sustaining Ecosystems'
        },
        {
          id: 'ocr-geo-4c',
          questionNumber: 19,
          text: 'Explain how humans are affecting tropical rainforests.',
          marks: 4,
          section: 'Sustaining Ecosystems'
        },
        {
          id: 'ocr-geo-4d',
          questionNumber: 20,
          text: 'Describe the environmental impacts of deforestation in tropical rainforests.',
          marks: 3,
          section: 'Sustaining Ecosystems'
        },
        {
          id: 'ocr-geo-4e',
          questionNumber: 21,
          text: 'Evaluate how sustainable management strategies can protect rainforests for the future.',
          marks: 5,
          section: 'Sustaining Ecosystems'
        },
        
        // Section B: Physical Geography Fieldwork (3 marks)
        {
          id: 'ocr-geo-5a',
          questionNumber: 22,
          text: 'Identify one method of primary data collection used in physical geography fieldwork.',
          marks: 1,
          section: 'Physical Geography Fieldwork'
        },
        {
          id: 'ocr-geo-5b',
          questionNumber: 23,
          text: 'Explain two advantages of using secondary data in geographical investigations.',
          marks: 2,
          section: 'Physical Geography Fieldwork'
        }
      ];
      
      console.log('OCR Geography B Paper 1 questions loaded:', ocrGeographyQuestions.length);
      return ocrGeographyQuestions;
    }

    // Special format for Geography A (Edexcel) - Use curriculum predicted exam questions
    if (subjectId === 'geography-a-edexcel') {
      console.log('Loading Geography A (Edexcel) predicted exam questions...');
      
      // Find the predicted exam topic in the curriculum
      const predictedExamTopic = subject.topics.find(topic => topic.id === 'predicted-exam-2026');
      
      if (predictedExamTopic && predictedExamTopic.questions) {
        console.log('Found predicted exam topic with', predictedExamTopic.questions.length, 'questions');
        
        let questionNumber = 1;
        predictedExamTopic.questions.forEach((curriculumQuestion, index) => {
          questions.push({
            id: curriculumQuestion.id,
            questionNumber: questionNumber++,
            text: curriculumQuestion.question,
            marks: curriculumQuestion.marks
          });
        });
        
        console.log('Geography A (Edexcel) predicted exam questions loaded:', questions.length);
        return questions;
      }
    }

    // Special format for Geography - AQA GCSE (88 marks total including 3 SPaG)
    if (subjectId === 'geography') {
      // Geography Paper 1
      const geographyPaper = 'paper1';
      setGeographyPaperType('Paper 1');
      let questionNumber = 1;
      
      if (geographyPaper === 'paper1') {
        // Paper 1: Living with the Physical Environment
        
        // Section A: The Challenge of Natural Hazards (30 marks)
        const sectionAQuestions = [
          {
            id: 'geo-a-mc-1',
            questionNumber: questionNumber++,
            text: 'Which of the following is an example of a secondary effect of an earthquake?\n\nA. Buildings collapse\nB. Fires break out\nC. Ground shaking\nD. Fault movement\n\n[1 mark]',
            marks: 1,
            section: 'A'
          },
          {
            id: 'geo-a-sr-1',
            questionNumber: questionNumber++,
            text: 'What is meant by a natural hazard?\n\n[2 marks]',
            marks: 2,
            section: 'A'
          },
          {
            id: 'geo-a-sr-2',
            questionNumber: questionNumber++,
            text: 'Give one reason why people live in areas at risk from volcanoes.\n\n[1 mark]',
            marks: 1,
            section: 'A'
          },
          {
            id: 'geo-a-str-1',
            questionNumber: questionNumber++,
            text: 'Explain how monitoring and prediction can reduce the risk from tectonic hazards.\n\n[4 marks]',
            marks: 4,
            section: 'A'
          },
          {
            id: 'geo-a-str-2',
            questionNumber: questionNumber++,
            text: 'Using an example, explain the primary and secondary effects of a tropical storm.\n\n[6 marks]',
            marks: 6,
            section: 'A'
          },
          {
            id: 'geo-a-ext-1',
            questionNumber: questionNumber++,
            text: '"The effects of tropical storms are always more serious in LICs than HICs." To what extent do you agree?\n\n[9 marks]',
            marks: 9,
            section: 'A'
          },
          {
            id: 'geo-a-str-3',
            questionNumber: questionNumber++,
            text: 'Explain the likely effects of climate change on people and the environment.\n\n[6 marks]',
            marks: 6,
            section: 'A'
          }
        ];

        // Section B: The Living World (30 marks)
        const sectionBQuestions = [
          {
            id: 'geo-b-sr-1',
            questionNumber: questionNumber++,
            text: 'What is meant by the term "ecosystem"?\n\n[2 marks]',
            marks: 2,
            section: 'B'
          },
          {
            id: 'geo-b-sr-2',
            questionNumber: questionNumber++,
            text: 'Name one producer and one consumer in a small-scale UK ecosystem.\n\n[2 marks]',
            marks: 2,
            section: 'B'
          },
          {
            id: 'geo-b-str-1',
            questionNumber: questionNumber++,
            text: 'Explain the causes of deforestation in tropical rainforests.\n\n[4 marks]',
            marks: 4,
            section: 'B'
          },
          {
            id: 'geo-b-str-2',
            questionNumber: questionNumber++,
            text: 'Using a case study, explain how tropical rainforests are being managed sustainably.\n\n[6 marks]',
            marks: 6,
            section: 'B'
          },
          {
            id: 'geo-b-str-3',
            questionNumber: questionNumber++,
            text: 'Explain how plants and animals adapt to hot desert environments.\n\n[6 marks]',
            marks: 6,
            section: 'B'
          },
          {
            id: 'geo-b-ext-1',
            questionNumber: questionNumber++,
            text: '"Deforestation in tropical rainforests can never be justified." To what extent do you agree?\n\n[9 marks]',
            marks: 9,
            section: 'B'
          }
        ];

        // Section C: Physical Landscapes in the UK (28 marks + 3 SPaG)
        const sectionCQuestions = [
          {
            id: 'geo-c-mc-1',
            questionNumber: questionNumber++,
            text: 'Which process of river erosion involves material scraping along the riverbed?\n\nA. Hydraulic action\nB. Abrasion\nC. Attrition\nD. Solution\n\n[1 mark]',
            marks: 1,
            section: 'C'
          },
          {
            id: 'geo-c-sr-1',
            questionNumber: questionNumber++,
            text: 'What is meant by longshore drift?\n\n[2 marks]',
            marks: 2,
            section: 'C'
          },
          {
            id: 'geo-c-sr-2',
            questionNumber: questionNumber++,
            text: 'Identify one landform created by coastal deposition.\n\n[1 mark]',
            marks: 1,
            section: 'C'
          },
          {
            id: 'geo-c-str-1',
            questionNumber: questionNumber++,
            text: 'Explain the formation of a waterfall.\n\n[4 marks]',
            marks: 4,
            section: 'C'
          },
          {
            id: 'geo-c-str-2',
            questionNumber: questionNumber++,
            text: 'Explain how human activities can affect flood risk.\n\n[6 marks]',
            marks: 6,
            section: 'C'
          },
          {
            id: 'geo-c-str-3',
            questionNumber: questionNumber++,
            text: 'Using a case study, explain the effects of coastal management strategies.\n\n[6 marks]',
            marks: 6,
            section: 'C'
          },
          {
            id: 'geo-c-ext-1',
            questionNumber: questionNumber++,
            text: '"Hard engineering is the most effective way to reduce the risk of river flooding." To what extent do you agree?\n\n[9 marks + 3 marks for SPaG]',
            marks: 12,
            section: 'C'
          }
        ];

        // Combine all sections (Total: 17 questions, 88 marks including 3 SPaG)
        questions.push(...sectionAQuestions); // 30 marks
        questions.push(...sectionBQuestions); // 29 marks  
        questions.push(...sectionCQuestions); // 29 marks (26 + 3 SPaG)

      } else {
        // Paper 2: Challenges in the Human Environment
        
        // Section A: Urban Issues and Challenges (30 marks)
        const sectionAQuestions = [
          {
            id: 'geo-p2-a-sr-1',
            questionNumber: questionNumber++,
            text: 'Define "urbanisation".\n\n[2 marks]',
            marks: 2,
            section: 'A'
          },
          {
            id: 'geo-p2-a-sr-2',
            questionNumber: questionNumber++,
            text: 'Give one reason for the growth of megacities.\n\n[1 mark]',
            marks: 1,
            section: 'A'
          },
          {
            id: 'geo-p2-a-sr-3',
            questionNumber: questionNumber++,
            text: 'Name one problem caused by rapid urban growth in an LIC/NEE city.\n\n[1 mark]',
            marks: 1,
            section: 'A'
          },
          {
            id: 'geo-p2-a-str-1',
            questionNumber: questionNumber++,
            text: 'Explain two causes of urbanisation.\n\n[4 marks]',
            marks: 4,
            section: 'A'
          },
          {
            id: 'geo-p2-a-str-2',
            questionNumber: questionNumber++,
            text: 'Using an example of an LIC/NEE city, explain the challenges created by rapid urban growth.\n\n[6 marks]',
            marks: 6,
            section: 'A'
          },
          {
            id: 'geo-p2-a-str-3',
            questionNumber: questionNumber++,
            text: 'Explain how urban transport strategies can reduce traffic congestion in a UK city.\n\n[6 marks]',
            marks: 6,
            section: 'A'
          },
          {
            id: 'geo-p2-a-ext-1',
            questionNumber: questionNumber++,
            text: '"Urban planning in LICs and NEEs is more about solving social problems than economic ones." To what extent do you agree?\n\n[9 marks]',
            marks: 9,
            section: 'A'
          }
        ];

        // Section B: The Changing Economic World (30 marks)
        const sectionBQuestions = [
          {
            id: 'geo-p2-b-sr-1',
            questionNumber: questionNumber++,
            text: 'Define "development gap".\n\n[2 marks]',
            marks: 2,
            section: 'B'
          },
          {
            id: 'geo-p2-b-sr-2',
            questionNumber: questionNumber++,
            text: 'Give one indicator of development.\n\n[1 mark]',
            marks: 1,
            section: 'B'
          },
          {
            id: 'geo-p2-b-sr-3',
            questionNumber: questionNumber++,
            text: 'What is meant by "fair trade"?\n\n[2 marks]',
            marks: 2,
            section: 'B'
          },
          {
            id: 'geo-p2-b-str-1',
            questionNumber: questionNumber++,
            text: 'Explain two causes of uneven development.\n\n[4 marks]',
            marks: 4,
            section: 'B'
          },
          {
            id: 'geo-p2-b-str-2',
            questionNumber: questionNumber++,
            text: 'Using an example of an LIC/NEE, explain how industrial development can help reduce the development gap.\n\n[6 marks]',
            marks: 6,
            section: 'B'
          },
          {
            id: 'geo-p2-b-str-3',
            questionNumber: questionNumber++,
            text: 'Explain how international aid can reduce the development gap.\n\n[6 marks]',
            marks: 6,
            section: 'B'
          },
          {
            id: 'geo-p2-b-ext-1',
            questionNumber: questionNumber++,
            text: '"Economic development always leads to improvements in people\'s quality of life." To what extent do you agree?\n\n[9 marks]',
            marks: 9,
            section: 'B'
          }
        ];

        // Section C: The Challenge of Resource Management (28 marks + 3 SPaG)
        const sectionCQuestions = [
          {
            id: 'geo-p2-c-sr-1',
            questionNumber: questionNumber++,
            text: 'Define "resource".\n\n[1 mark]',
            marks: 1,
            section: 'C'
          },
          {
            id: 'geo-p2-c-sr-2',
            questionNumber: questionNumber++,
            text: 'Identify one reason why food consumption is increasing globally.\n\nOR\n\nIdentify one reason why energy consumption is increasing globally.\n\nOR\n\nIdentify one reason why water consumption is increasing globally.\n\n[1 mark]',
            marks: 1,
            section: 'C'
          },
          {
            id: 'geo-p2-c-sr-3',
            questionNumber: questionNumber++,
            text: 'What is meant by "energy security"?\n\nOR\n\nWhat is meant by "food security"?\n\nOR\n\nWhat is meant by "water security"?\n\n[2 marks]',
            marks: 2,
            section: 'C'
          },
          {
            id: 'geo-p2-c-str-1',
            questionNumber: questionNumber++,
            text: 'Explain why water insecurity is increasing in some parts of the world.\n\nOR\n\nExplain why energy insecurity is increasing in some parts of the world.\n\nOR\n\nExplain why food insecurity is increasing in some parts of the world.\n\n[4 marks]',
            marks: 4,
            section: 'C'
          },
          {
            id: 'geo-p2-c-str-2',
            questionNumber: questionNumber++,
            text: 'Explain how energy supply in the UK is changing.\n\nOR\n\nExplain how food supply in the UK is changing.\n\nOR\n\nExplain how water supply in the UK is changing.\n\n[6 marks]',
            marks: 6,
            section: 'C'
          },
          {
            id: 'geo-p2-c-str-3',
            questionNumber: questionNumber++,
            text: 'Using an example, explain how food security can be improved.\n\nOR\n\nUsing an example, explain how energy security can be improved.\n\nOR\n\nUsing an example, explain how water security can be improved.\n\n[6 marks]',
            marks: 6,
            section: 'C'
          },
          {
            id: 'geo-p2-c-ext-1',
            questionNumber: questionNumber++,
            text: '"Increasing energy supply is more important than reducing energy demand." To what extent do you agree?\n\nOR\n\n"Increasing food production is more important than reducing food waste." To what extent do you agree?\n\nOR\n\n"Increasing water supply is more important than reducing water demand." To what extent do you agree?\n\n[9 marks + 3 marks for SPaG]',
            marks: 12,
            section: 'C'
          }
        ];

        // Combine all sections (Total: 21 questions, 88 marks including 3 SPaG)
        questions.push(...sectionAQuestions); // 29 marks
        questions.push(...sectionBQuestions); // 30 marks  
        questions.push(...sectionCQuestions); // 29 marks (26 + 3 SPaG)
      }

      console.log('Geography questions generated:', questions.length);
      return questions;
    }
    
    // Special format for History - Edexcel GCSE Paper 1 (52 marks total)
    if (subjectId === 'history-edexcel-gcse') {
      // Four thematic study options - student chooses ONE
      const thematicOptions = {
        'crime-punishment': {
          name: 'Crime and punishment in Britain, c1000–present and Whitechapel, c1870–c1900',
          questions: [
            {
              id: 'crime-q1',
              questionNumber: 1,
              text: 'Describe two features of law enforcement in medieval England.',
              marks: 4,
              section: 'Crime and Punishment'
            },
            {
              id: 'crime-q2',
              questionNumber: 2,
              text: 'Explain why there was an increase in smuggling in the period c1700–1850.\n\nYou may use the following:\n• High taxes on imported goods\n• Coastal geography\n\nYou must also include information of your own.',
              marks: 12,
              section: 'Crime and Punishment'
            },
            {
              id: 'crime-q3',
              questionNumber: 3,
              text: '"The main reason for changes in punishment between 1900 and the present was changing attitudes in society."\n\nHow far do you agree? Explain your answer.\n\nYou may use the following:\n• Abolition of the death penalty\n• Prison reforms\n• Alternative sentences\n\nYou must also include information of your own.\n\n[16 marks + 4 SPaG]',
              marks: 20,
              section: 'Crime and Punishment'
            },
            {
              id: 'crime-q4',
              questionNumber: 4,
              text: 'Describe two features of housing conditions in Whitechapel, c1870–1900.',
              marks: 4,
              section: 'Whitechapel Historic Environment'
            },
            {
              id: 'crime-q5',
              questionNumber: 5,
              text: 'Study Sources A and B below.\n\nSource A: Extract from H Division police report, 1888, describing difficulty patrolling the narrow alleyways and courtyards in Whitechapel rookeries.\n\nSource B: Newspaper article from The Times, November 1888, criticizing the Metropolitan Police for their failure to catch Jack the Ripper.\n\nHow useful are Sources A and B for an enquiry into the problems faced by police in Whitechapel?\n\nExplain your answer using Sources A and B and your knowledge of the historical context.',
              marks: 8,
              section: 'Whitechapel Historic Environment'
            },
            {
              id: 'crime-q6',
              questionNumber: 6,
              text: 'How could you follow up Source A to find out more about living conditions in Whitechapel?\n\nIn your answer, you must give the question you would ask and the type of source you could use.\n\nComplete the table below.\n\n| Detail in Source A that I would follow up: | Question I would ask: | What type of source I could use: | How this might help answer my question: |\n\nYou must also explain how you would use the source to find out more about living conditions in Whitechapel.',
              marks: 12,
              section: 'Whitechapel Historic Environment'
            }
          ]
        },
        'medicine': {
          name: 'Medicine in Britain, c1250–present and The British sector of the Western Front, 1914–18',
          questions: [
            {
              id: 'med-q1',
              questionNumber: 1,
              text: 'Describe two features of medical care in medieval England.',
              marks: 4,
              section: 'Medicine in Britain'
            },
            {
              id: 'med-q2',
              questionNumber: 2,
              text: 'Explain why there were significant improvements in surgery in the nineteenth century.\n\nYou may use the following:\n• Anaesthetics\n• Antiseptics\n\nYou must also include information of your own.',
              marks: 12,
              section: 'Medicine in Britain'
            },
            {
              id: 'med-q3',
              questionNumber: 3,
              text: '"Scientific discoveries were the most important factor in the development of medicine after 1800."\n\nHow far do you agree? Explain your answer.\n\nYou may use the following:\n• Germ Theory\n• Pasteur and Koch\n• Government action\n\nYou must also include information of your own.\n\n[16 marks + 4 SPaG]',
              marks: 20,
              section: 'Medicine in Britain'
            },
            {
              id: 'med-q4',
              questionNumber: 4,
              text: 'Describe two features of conditions for soldiers in the trenches on the Western Front.',
              marks: 4,
              section: 'Western Front Historic Environment'
            },
            {
              id: 'med-q5',
              questionNumber: 5,
              text: 'Study Sources A and B below.\n\nSource A: Extract from a Royal Army Medical Corps (RAMC) report, 1916, describing the challenges of treating wounded soldiers at a Casualty Clearing Station.\n\nSource B: Photograph showing a mobile X-ray unit being used near the front line at Arras, 1917.\n\nHow useful are Sources A and B for an enquiry into the treatment of injuries on the Western Front?\n\nExplain your answer using Sources A and B and your knowledge of the historical context.',
              marks: 8,
              section: 'Western Front Historic Environment'
            },
            {
              id: 'med-q6',
              questionNumber: 6,
              text: 'How could you follow up Source A to find out more about medical experiments and innovations on the Western Front?\n\nIn your answer, you must give the question you would ask and the type of source you could use.\n\nComplete the table below.\n\n| Detail in Source A that I would follow up: | Question I would ask: | What type of source I could use: | How this might help answer my question: |\n\nYou must also explain how you would use the source to find out more about medical developments on the Western Front.',
              marks: 12,
              section: 'Western Front Historic Environment'
            }
          ]
        },
        'warfare': {
          name: 'Warfare and British Society, c1250–present and London and the Second World War, 1939–45',
          questions: [
            {
              id: 'war-q1',
              questionNumber: 1,
              text: 'Describe two features of the experience of soldiers in medieval warfare.',
              marks: 4,
              section: 'Warfare and British Society'
            },
            {
              id: 'war-q2',
              questionNumber: 2,
              text: 'Explain why the nature of warfare changed between 1500 and 1900.\n\nYou may use the following:\n• Introduction of gunpowder weapons\n• Industrialisation\n\nYou must also include information of your own.',
              marks: 12,
              section: 'Warfare and British Society'
            },
            {
              id: 'war-q3',
              questionNumber: 3,
              text: '"Technology was the main reason for changes in warfare between 1900 and the present day."\n\nHow far do you agree? Explain your answer.\n\nYou may use the following:\n• Machine guns and tanks\n• Aircraft and nuclear weapons\n• Training and tactics\n\nYou must also include information of your own.\n\n[16 marks + 4 SPaG]',
              marks: 20,
              section: 'Warfare and British Society'
            },
            {
              id: 'war-q4',
              questionNumber: 4,
              text: 'Describe two features of civilian life in London during the Blitz, 1940–41.',
              marks: 4,
              section: 'London WWII Historic Environment'
            },
            {
              id: 'war-q5',
              questionNumber: 5,
              text: 'Study Sources A and B below.\n\nSource A: Government poster encouraging Londoners to "Keep Calm and Carry On", issued in 1939 but never widely distributed during the war.\n\nSource B: Mass Observation report from September 1940, documenting civilian reactions to the first night of heavy bombing in London\'s East End.\n\nHow useful are Sources A and B for an enquiry into the government\'s response to air raids in London?\n\nExplain your answer using Sources A and B and your knowledge of the historical context.',
              marks: 8,
              section: 'London WWII Historic Environment'
            },
            {
              id: 'war-q6',
              questionNumber: 6,
              text: 'How could you follow up Source B to find out more about civilian morale during the Blitz?\n\nIn your answer, you must give the question you would ask and the type of source you could use.\n\nComplete the table below.\n\n| Detail in Source B that I would follow up: | Question I would ask: | What type of source I could use: | How this might help answer my question: |\n\nYou must also explain how you would use the source to find out more about civilian responses to the Blitz.',
              marks: 12,
              section: 'London WWII Historic Environment'
            }
          ]
        },
        'migrants': {
          name: 'Migrants in Britain, c800–present and Notting Hill, c1948–c1970',
          questions: [
            {
              id: 'mig-q1',
              questionNumber: 1,
              text: 'Describe two features of migration to Britain during the Viking period, c800–1000.',
              marks: 4,
              section: 'Migrants in Britain'
            },
            {
              id: 'mig-q2',
              questionNumber: 2,
              text: 'Explain why migration from the Caribbean increased after 1945.\n\nYou may use the following:\n• Labour shortages in Britain\n• British Nationality Act 1948\n\nYou must also include information of your own.',
              marks: 12,
              section: 'Migrants in Britain'
            },
            {
              id: 'mig-q3',
              questionNumber: 3,
              text: '"Government policies were the main influence on migration to Britain after 1945."\n\nHow far do you agree? Explain your answer.\n\nYou may use the following:\n• Commonwealth Immigrants Acts\n• Employment opportunities\n• Push factors from countries of origin\n\nYou must also include information of your own.\n\n[16 marks + 4 SPaG]',
              marks: 20,
              section: 'Migrants in Britain'
            },
            {
              id: 'mig-q4',
              questionNumber: 4,
              text: 'Describe two features of the Notting Hill area in the 1950s and 1960s.',
              marks: 4,
              section: 'Notting Hill Historic Environment'
            },
            {
              id: 'mig-q5',
              questionNumber: 5,
              text: 'Study Sources A and B below.\n\nSource A: Extract from the West Indian Gazette, published by Claudia Jones, 1959, describing the Notting Hill race riots of 1958.\n\nSource B: Photograph of the first Caribbean Carnival in Notting Hill, organised by Claudia Jones in 1959.\n\nHow useful are Sources A and B for an enquiry into race relations in Notting Hill in the 1960s?\n\nExplain your answer using Sources A and B and your knowledge of the historical context.',
              marks: 8,
              section: 'Notting Hill Historic Environment'
            },
            {
              id: 'mig-q6',
              questionNumber: 6,
              text: 'How could you follow up Source A to find out more about community responses to racism in Notting Hill?\n\nIn your answer, you must give the question you would ask and the type of source you could use.\n\nComplete the table below.\n\n| Detail in Source A that I would follow up: | Question I would ask: | What type of source I could use: | How this might help answer my question: |\n\nYou must also explain how you would use the source to find out more about how the Caribbean community responded to racism.',
              marks: 12,
              section: 'Notting Hill Historic Environment'
            }
          ]
        }
      };

      // Return all questions from all four options - students choose ONE complete option
      const allQuestions: ExamQuestion[] = [];
      
      Object.entries(thematicOptions).forEach(([key, option]) => {
        option.questions.forEach(q => {
          allQuestions.push(q);
        });
      });

      console.log('History Edexcel questions generated:', allQuestions.length);
      return allQuestions;
    }
    
    // Special format for History - AQA GCSE Paper 1 (84 marks total)
    if (subjectId === 'history') {
      // Section A: Period Studies (44 marks total) - Choose ONE topic
      const periodStudyTopics = {
        'america-1840-1895': {
          name: 'America, 1840–1895: Expansion and Consolidation',
          questions: [
            {
              id: 'america-1840-q1',
              questionNumber: 1,
              text: `Describe two features of Plains Indians' way of life.\n\n[4 marks]`,
              marks: 4,
              section: 'A'
            },
            {
              id: 'america-1840-q2',
              questionNumber: 2,
              text: `Explain why settlers travelled west in the 1840s.\n\nYou may use the following in your answer:\n• Gold Rush\n• Homestead Act\n\nYou must also use information of your own.\n\n[8 marks]`,
              marks: 8,
              section: 'A'
            },
            {
              id: 'america-1840-q3',
              questionNumber: 3,
              text: `Write an account of how the railroads changed the West.\n\nYou may use the following information to help you:\n• Transportation of goods and people\n• Development of towns\n• Impact on Native Americans\n\n[12 marks]`,
              marks: 12,
              section: 'A'
            },
            {
              id: 'america-1840-q4',
              questionNumber: 4,
              text: `"The main reason for the defeat of the Plains Indians was the US Army." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Battle of the Little Bighorn\n• Government policies\n• Disease and the destruction of buffalo\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'A'
            }
          ]
        },
        'germany-1890-1945': {
          name: 'Germany, 1890–1945: Democracy and Dictatorship',
          questions: [
            {
              id: 'germany-q1',
              questionNumber: 1,
              text: `Describe two features of the Weimar Constitution.\n\n[4 marks]`,
              marks: 4,
              section: 'A'
            },
            {
              id: 'germany-q2',
              questionNumber: 2,
              text: `Explain why Hitler became Chancellor in 1933.\n\nYou may use the following in your answer:\n• The Depression\n• Political instability\n\nYou must also use information of your own.\n\n[8 marks]`,
              marks: 8,
              section: 'A'
            },
            {
              id: 'germany-q3',
              questionNumber: 3,
              text: `Write an account of how the Reichstag Fire affected German politics.\n\nYou may use the following information to help you:\n• Emergency powers\n• Arrest of Communists\n• March 1933 elections\n\n[12 marks]`,
              marks: 12,
              section: 'A'
            },
            {
              id: 'germany-q4',
              questionNumber: 4,
              text: `"The most important reason Hitler consolidated power in 1933–34 was the use of violence." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Night of the Long Knives\n• SA and SS\n• Legal methods\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'A'
            }
          ]
        },
        'russia-1894-1945': {
          name: 'Russia/USSR, 1894–1945: Tsardom and Communism',
          questions: [
            {
              id: 'russia-q1',
              questionNumber: 1,
              text: `Describe two features of Tsarist rule before 1905.\n\n[4 marks]`,
              marks: 4,
              section: 'A'
            },
            {
              id: 'russia-q2',
              questionNumber: 2,
              text: `Explain why the February Revolution was successful.\n\nYou may use the following in your answer:\n• Military mutiny\n• Economic problems\n\nYou must also use information of your own.\n\n[8 marks]`,
              marks: 8,
              section: 'A'
            },
            {
              id: 'russia-q3',
              questionNumber: 3,
              text: `Write an account of how the Bolsheviks took power in October 1917.\n\nYou may use the following information to help you:\n• Lenin's return\n• Trotsky's organization\n• Storming of the Winter Palace\n\n[12 marks]`,
              marks: 12,
              section: 'A'
            },
            {
              id: 'russia-q4',
              questionNumber: 4,
              text: `"The most important reason Stalin controlled the USSR was propaganda." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Cult of personality\n• Terror and purges\n• Economic policies\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'A'
            }
          ]
        },
        'america-1920-1973': {
          name: 'America, 1920–1973: Opportunity and Inequality',
          questions: [
            {
              id: 'america-1920-q1',
              questionNumber: 1,
              text: `Describe two features of the economic boom of the 1920s.\n\n[4 marks]`,
              marks: 4,
              section: 'A'
            },
            {
              id: 'america-1920-q2',
              questionNumber: 2,
              text: `Explain why the Ku Klux Klan was powerful in the 1920s.\n\nYou may use the following in your answer:\n• Racial tensions\n• Immigration fears\n\nYou must also use information of your own.\n\n[8 marks]`,
              marks: 8,
              section: 'A'
            },
            {
              id: 'america-1920-q3',
              questionNumber: 3,
              text: `Write an account of how the New Deal attempted to solve America's problems.\n\nYou may use the following information to help you:\n• Alphabet agencies\n• Public works programs\n• Banking reforms\n\n[12 marks]`,
              marks: 12,
              section: 'A'
            },
            {
              id: 'america-1920-q4',
              questionNumber: 4,
              text: `"The most important reason for the growth of the Civil Rights Movement was Martin Luther King." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Montgomery Bus Boycott\n• Other civil rights leaders\n• Government actions\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'A'
            }
          ]
        }
      };

      // Section B: Wider World Depth Studies (40 marks total) - Choose ONE topic
      const depthStudyTopics = {
        'conflict-1894-1918': {
          name: 'Conflict and Tension, 1894–1918 (WWI)',
          questions: [
            {
              id: 'wwi-q1',
              questionNumber: 1,
              text: `Study Source A.\n\nSource A: A photograph showing British soldiers in trenches on the Western Front during World War One, 1916.\n\nThe photograph shows soldiers standing in a muddy trench. Duckboards can be seen on the floor of the trench. Barbed wire is visible in the background. The soldiers are wearing helmets and carrying rifles.\n\nGive two things you can infer from Source A about life in the trenches.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'wwi-q2',
              questionNumber: 2,
              text: `Study Sources B and C.\n\nSource B: From a diary written by a British soldier on the Western Front, 1917.\n"The mud is everywhere. It's impossible to keep clean or dry. The rats are as big as cats. We live in constant fear of gas attacks. Many of my friends have been killed or wounded. I don't know how much longer I can stand this."\n\nSource C: From a British government poster encouraging recruitment, 1915.\n"Your King and Country Need You! Join the Army today and serve with honour. Fight for freedom and justice. Together we will defeat the enemy and return home as heroes."\n\nHow useful are Sources B and C to an historian studying the experiences of soldiers on the Western Front?\n\nExplain your answer using Sources B and C and your own knowledge.\n\n[12 marks]`,
              marks: 12,
              section: 'B'
            },
            {
              id: 'wwi-q3',
              questionNumber: 3,
              text: `Study Interpretations 1 and 2.\n\nInterpretation 1: From a history book written in 1960.\n"The generals of World War One were incompetent leaders who wasted the lives of millions of soldiers through poor planning and outdated tactics."\n\nInterpretation 2: From a history book written in 2010.\n"The generals of World War One faced unprecedented challenges and gradually developed effective tactics that eventually led to victory."\n\nWhat is the main difference between these views about the leadership of generals in World War One?\n\nExplain your answer using details from both interpretations.\n\n[8 marks]`,
              marks: 8,
              section: 'B'
            },
            {
              id: 'wwi-q4',
              questionNumber: 4,
              text: `Suggest one reason why Interpretations 1 and 2 give different views about the leadership of generals in World War One.\n\nYou may use Sources B and C to help explain your answer.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'wwi-q5',
              questionNumber: 5,
              text: `"The main reason the Allies won World War One was the entry of the USA into the war." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• The entry of the USA in 1917\n• The failure of the German spring offensive in 1918\n• The naval blockade of Germany\n• New military technology\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'B'
            }
          ]
        },
        'conflict-1918-1939': {
          name: 'Conflict and Tension, 1918–1939 (Interwar)',
          questions: [
            {
              id: 'interwar-q1',
              questionNumber: 1,
              text: `Study Source A.\n\nSource A: A cartoon from a British newspaper, 1938, showing Chamberlain returning from Munich with a piece of paper.\n\nThe cartoon shows Chamberlain waving a document in the air. He appears confident and is smiling. The caption reads "Peace for our time!" In the background, storm clouds are gathering.\n\nGive two things you can infer from Source A about appeasement.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'interwar-q2',
              questionNumber: 2,
              text: `Study Sources B and C.\n\nSource B: From Chamberlain's speech after Munich, September 1938.\n"We have achieved peace with honour. I believe it is peace for our time. We thank you from the bottom of our hearts. Go home and get a nice quiet sleep."\n\nSource C: From Churchill's speech in Parliament, October 1938.\n"We have suffered a total and unmitigated defeat. The German dictator, instead of snatching his victuals from the table, has been content to have them served to him course by course."\n\nHow useful are Sources B and C to an historian studying Chamberlain's policy of appeasement?\n\nExplain your answer using Sources B and C and your own knowledge.\n\n[12 marks]`,
              marks: 12,
              section: 'B'
            },
            {
              id: 'interwar-q3',
              questionNumber: 3,
              text: `Study Interpretations 1 and 2.\n\nInterpretation 1: From a history book written in 1950.\n"Appeasement was a cowardly policy that encouraged Hitler's aggression and made war inevitable."\n\nInterpretation 2: From a history book written in 1990.\n"Appeasement was a reasonable policy given Britain's military weakness and the need to buy time for rearmament."\n\nWhat is the main difference between these views about appeasement?\n\nExplain your answer using details from both interpretations.\n\n[8 marks]`,
              marks: 8,
              section: 'B'
            },
            {
              id: 'interwar-q4',
              questionNumber: 4,
              text: `Suggest one reason why Interpretations 1 and 2 give different views about appeasement.\n\nYou may use Sources B and C to help explain your answer.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'interwar-q5',
              questionNumber: 5,
              text: `"The main reason WWII broke out was appeasement." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Munich Agreement 1938\n• Hitler's foreign policy\n• The Treaty of Versailles\n• The failure of the League of Nations\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'B'
            }
          ]
        },
        'conflict-1945-1972': {
          name: 'Conflict and Tension, 1945–1972 (Cold War)',
          questions: [
            {
              id: 'coldwar-q1',
              questionNumber: 1,
              text: `Study Source A.\n\nSource A: A photograph of the Berlin Wall, 1962.\n\nThe photograph shows a high concrete wall topped with barbed wire. East German guards can be seen patrolling. On one side, buildings appear run-down. On the other side, there are more modern buildings and cars.\n\nGive two things you can infer from Source A about the Berlin Crisis.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'coldwar-q2',
              questionNumber: 2,
              text: `Study Sources B and C.\n\nSource B: From President Truman's speech to Congress, March 1947.\n"It must be the policy of the United States to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures."\n\nSource C: From Stalin's speech, 1946.\n"The Soviet Union desires peace, but if war is forced upon us, we shall not be found unprepared. Capitalist encirclement threatens our socialist achievements."\n\nHow useful are Sources B and C to an historian studying the origins of the Cold War?\n\nExplain your answer using Sources B and C and your own knowledge.\n\n[12 marks]`,
              marks: 12,
              section: 'B'
            },
            {
              id: 'coldwar-q3',
              questionNumber: 3,
              text: `Study Interpretations 1 and 2.\n\nInterpretation 1: From an American history book, 1960.\n"The Cold War began because of Soviet expansion in Eastern Europe and Stalin's aggressive policies."\n\nInterpretation 2: From a Soviet history book, 1960.\n"The Cold War was caused by American imperialism and the USA's attempt to dominate the world through atomic diplomacy."\n\nWhat is the main difference between these views about the origins of the Cold War?\n\nExplain your answer using details from both interpretations.\n\n[8 marks]`,
              marks: 8,
              section: 'B'
            },
            {
              id: 'coldwar-q4',
              questionNumber: 4,
              text: `Suggest one reason why Interpretations 1 and 2 give different views about the origins of the Cold War.\n\nYou may use Sources B and C to help explain your answer.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'coldwar-q5',
              questionNumber: 5,
              text: `"The most important reason for the Cold War was Soviet expansion in Eastern Europe." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Soviet control of Poland and other Eastern European countries\n• The USA's atomic bomb\n• Disagreements at Yalta and Potsdam\n• The Marshall Plan\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'B'
            }
          ]
        },
        'conflict-asia-1950-1975': {
          name: 'Conflict and Tension in Asia, 1950–1975 (Korea & Vietnam)',
          questions: [
            {
              id: 'asia-q1',
              questionNumber: 1,
              text: `Study Source A.\n\nSource A: A photograph of US soldiers in Vietnam, 1968.\n\nThe photograph shows American soldiers moving through dense jungle. They are carrying heavy equipment and weapons. The soldiers look tired and alert. Vegetation has been damaged, possibly by chemical weapons.\n\nGive two things you can infer from Source A about US soldiers' experiences in Vietnam.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'asia-q2',
              questionNumber: 2,
              text: `Study Sources B and C.\n\nSource B: From a letter written by a US soldier in Vietnam, 1969.\n"We can't tell who is the enemy. The jungle is our enemy. The heat is our enemy. We're fighting ghosts who know this land better than we ever will."\n\nSource C: From a US government report on the Tet Offensive, 1968.\n"Despite initial setbacks, US and South Vietnamese forces have successfully repelled the Communist attacks and inflicted heavy casualties on the enemy."\n\nHow useful are Sources B and C to an historian studying the role of the media in Vietnam?\n\nExplain your answer using Sources B and C and your own knowledge.\n\n[12 marks]`,
              marks: 12,
              section: 'B'
            },
            {
              id: 'asia-q3',
              questionNumber: 3,
              text: `Study Interpretations 1 and 2.\n\nInterpretation 1: From an American history book, 1975.\n"The USA lost the Vietnam War because of the role of the media, which turned public opinion against the war."\n\nInterpretation 2: From a Vietnamese history book, 1985.\n"The USA was defeated in Vietnam because of the determination of the Vietnamese people and effective guerrilla tactics."\n\nWhat is the main difference between these views about why the USA lost the Vietnam War?\n\nExplain your answer using details from both interpretations.\n\n[8 marks]`,
              marks: 8,
              section: 'B'
            },
            {
              id: 'asia-q4',
              questionNumber: 4,
              text: `Suggest one reason why Interpretations 1 and 2 give different views about US defeat in Vietnam.\n\nYou may use Sources B and C to help explain your answer.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'asia-q5',
              questionNumber: 5,
              text: `"The most important reason the USA lost the Vietnam War was the role of the media." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Television coverage of the war\n• Anti-war protests\n• Guerrilla tactics\n• The draft system\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'B'
            }
          ]
        },
        'conflict-gulf-1990-2009': {
          name: 'Conflict and Tension in the Gulf, 1990–2009',
          questions: [
            {
              id: 'gulf-q1',
              questionNumber: 1,
              text: `Study Source A.\n\nSource A: A photograph of burning oil wells in Kuwait, 1991.\n\nThe photograph shows multiple oil wells on fire, creating massive black smoke clouds. Iraqi forces set fire to the wells during their retreat. The landscape is desert, and the destruction appears extensive.\n\nGive two things you can infer from Source A about the invasion of Kuwait in 1990.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'gulf-q2',
              questionNumber: 2,
              text: `Study Sources B and C.\n\nSource B: From President Bush's speech, January 1991.\n"This will not stand, this aggression against Kuwait. We must act to restore the legitimate government of Kuwait and ensure the flow of oil to the world."\n\nSource C: From Saddam Hussein's radio broadcast, 1991.\n"We are fighting against the forces of imperialism and Zionism. Iraq will resist the foreign occupation and emerge victorious."\n\nHow useful are Sources B and C to an historian studying the causes of the Gulf War?\n\nExplain your answer using Sources B and C and your own knowledge.\n\n[12 marks]`,
              marks: 12,
              section: 'B'
            },
            {
              id: 'gulf-q3',
              questionNumber: 3,
              text: `Study Interpretations 1 and 2.\n\nInterpretation 1: From a Western history book, 2003.\n"The 2003 Iraq War was justified because of the threat of weapons of mass destruction and Saddam's links to terrorism."\n\nInterpretation 2: From a Middle Eastern history book, 2010.\n"The 2003 Iraq War was an illegal invasion motivated by oil and American imperial ambitions."\n\nWhat is the main difference between these views about the Iraq War?\n\nExplain your answer using details from both interpretations.\n\n[8 marks]`,
              marks: 8,
              section: 'B'
            },
            {
              id: 'gulf-q4',
              questionNumber: 4,
              text: `Suggest one reason why Interpretations 1 and 2 give different views about the Iraq War.\n\nYou may use Sources B and C to help explain your answer.\n\n[4 marks]`,
              marks: 4,
              section: 'B'
            },
            {
              id: 'gulf-q5',
              questionNumber: 5,
              text: `"The most important reason for the 2003 Iraq War was the threat of weapons of mass destruction." How far do you agree with this statement?\n\nYou may use the following in your answer:\n• Intelligence reports about WMDs\n• September 11th attacks\n• Oil interests\n• Regime change policy\n\nYou must also use information of your own.\n\n[16 marks]\n[4 marks for SPaG]`,
              marks: 20,
              section: 'B'
            }
          ]
        }
      };

      // Add ALL questions from ALL topics
      let questionCounter = 1;
      
      // Add ALL Section A questions (4 questions × 4 topics = 16 questions) - no topic labels
      Object.entries(periodStudyTopics).forEach(([topicKey, topic]) => {
        topic.questions.forEach(q => {
          questions.push({
            ...q,
            id: `${topicKey}-${q.id}`,
            questionNumber: questionCounter++,
            text: q.text,
            section: 'A'
          });
        });
      });
      
      // Add ALL Section B questions (5 questions × 5 topics = 25 questions) - no topic labels, just badges
      Object.entries(depthStudyTopics).forEach(([topicKey, topic]) => {
        topic.questions.forEach(q => {
          questions.push({
            ...q,
            id: `${topicKey}-${q.id}`,
            questionNumber: questionCounter++,
            text: q.text,
            section: 'B'
          });
        });
      });
      
      return questions;
    }
    
    // Special format for English Language - AQA GCSE Paper 1
    if (subjectId === 'english-language') {
      const sourceText = `The storm had been building all day, turning the sky into a churning mass of grey and black clouds. Sarah pressed her face against the cold window of the old cottage, watching as the wind whipped the trees into a frenzied dance. The branches clawed desperately at the air, their leaves torn away and scattered across the moor like confetti at a wild party.

She had been trapped here for three hours now, ever since the bridge had become impassable. The cottage felt smaller with each passing minute, its walls seeming to close in around her. Outside, the rain hammered against the glass with increasing fury, each drop like a tiny fist demanding entry.

Then she heard it - a sound that made her blood freeze. A low, rhythmic tapping coming from somewhere deep within the house. Tap. Tap. Tap. It wasn't the rain. It wasn't the wind. It was something else entirely.

Sarah's heart began to race as she realised she might not be alone after all. The tapping grew louder, more insistent, echoing through the empty rooms like a warning. She backed away from the window, her breath forming small clouds in the suddenly cold air.

The storm outside was nothing compared to the terror that now gripped her heart.`;
      
      // Section A: Reading - exactly 45 minutes advised
      // Question 1: List 4 things (4 marks)
      questions.push({
        id: 'english-lang-q1',
        questionNumber: 1,
        text: `Read again the first part of the source, from lines 1 to 4.

Source: Extract from "The Cottage" by Contemporary Author (2023)

"${sourceText}"

List four things about the weather from this part of the source.

[4 marks]`,
        marks: 4,
        section: 'A'
      });

      // Question 2: Language analysis (8 marks)
      questions.push({
        id: 'english-lang-q2',
        questionNumber: 2,
        text: `Look in detail at this extract from the source:

"Then she heard it - a sound that made her blood freeze. A low, rhythmic tapping coming from somewhere deep within the house. Tap. Tap. Tap. It wasn't the rain. It wasn't the wind. It was something else entirely."

How does the writer use language here to present the character's emotions?

You could include the writer's choice of:
• words and phrases
• language features and techniques  
• sentence forms.

[8 marks]`,
        marks: 8,
        section: 'A'
      });

      // Question 3: Structure analysis (8 marks)
      questions.push({
        id: 'english-lang-q3',
        questionNumber: 3,
        text: `You now need to think about the whole of the source.

This text is from a short story about a woman trapped in a cottage during a storm.

How has the writer structured the text to build tension for the reader?

You could write about:
• what the writer focuses your attention on at the beginning of the source
• how and why the writer changes this focus as the source develops
• any other structural features that interest you.

[8 marks]`,
        marks: 8,
        section: 'A'
      });

      // Question 4: Evaluation (20 marks)
      questions.push({
        id: 'english-lang-q4',
        questionNumber: 4,
        text: `Focus this part of your answer on the second half of the source.

A student said, "The writer makes the main character's fear the most important idea in this passage. The description shows how quickly normal situations can become terrifying."

To what extent do you agree?

In your response, you could:
• consider your own impressions of the character's experience
• evaluate how the writer presents fear and tension
• support your response with references to the text.

[20 marks]`,
        marks: 20,
        section: 'A'
      });

      // Section B: Writing - exactly 45 minutes advised
      // Question 5: Creative writing (40 marks total - 24 content + 16 technical)
      questions.push({
        id: 'english-lang-q5',
        questionNumber: 5,
        text: `Section B: Writing

You are advised to spend about 45 minutes on this section.
Write in full sentences.
You are reminded of the need to plan your answer.
You should leave enough time to check your work at the end.

Choose ONE of the following:

Either:
Write a description of a stormy landscape.

Or:
Write a story about a moment of fear.

(24 marks for content and organisation
16 marks for technical accuracy)

[40 marks]`,
        marks: 40,
        section: 'B'
      });

      return questions;
    }

    // Special format for Religious Studies
    if (subjectId === 'religious-studies') {
      // Generate questions for all 6 religions (students choose 2)
      const religions = ['buddhism', 'christianity', 'catholic-christianity', 'hinduism', 'islam', 'judaism', 'sikhism'];
      
      religions.forEach((religionId) => {
        const religionQuestions = getReligiousStudiesQuestions(religionId);
        questions.push(...religionQuestions);
      });
      
      return questions;
    }
    
    // OCR GCSE Computer Science (J277) - Two Predicted 2026 Exam Papers
    if (subjectId === 'computer-science') {
      let questionNumber = 1;
      
      // Determine which paper to generate based on URL parameter or default to Paper 1
      const paperType = window.location.search.includes('paper=2') ? 'paper2' : 'paper1';
      
      if (paperType === 'paper1') {
        // Paper 1 – J277/01: Computer systems (1h 30min, 80 marks)
        
        // Multiple Choice Questions (8 × 1 mark = 8 marks)
        questions.push({
          id: 'cs-j277-01-q1',
          questionNumber: questionNumber++,
          text: 'Which of the following is NOT a component of the CPU?\nA. ALU\nB. Control Unit\nC. Hard Drive\nD. Cache',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q2',
          questionNumber: questionNumber++,
          text: 'What type of memory is volatile?\nA. ROM\nB. RAM\nC. Flash memory\nD. Hard disk',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q3',
          questionNumber: questionNumber++,
          text: 'Which protocol is used for secure web browsing?\nA. HTTP\nB. FTP\nC. HTTPS\nD. SMTP',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q4',
          questionNumber: questionNumber++,
          text: 'What does LAN stand for?\nA. Large Area Network\nB. Local Access Network\nC. Local Area Network\nD. Limited Access Network',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q5',
          questionNumber: questionNumber++,
          text: 'Which storage device has the fastest access time?\nA. Hard disk drive\nB. Solid state drive\nC. Optical disk\nD. Magnetic tape',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q6',
          questionNumber: questionNumber++,
          text: 'What is malware?\nA. Broken hardware\nB. Malicious software\nC. Memory allocation software\nD. Main software',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q7',
          questionNumber: questionNumber++,
          text: 'Which of these is an example of an embedded system?\nA. Desktop computer\nB. Laptop\nC. Washing machine control system\nD. Server',
          marks: 1,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-01-q8',
          questionNumber: questionNumber++,
          text: 'What does CPU stand for?\nA. Computer Processing Unit\nB. Central Processing Unit\nC. Central Program Unit\nD. Computer Program Unit',
          marks: 1,
          section: 'A'
        });
        
        // Short Answer Questions (15 × 2-4 marks = 40 marks)
        questions.push({
          id: 'cs-j277-01-q9',
          questionNumber: questionNumber++,
          text: 'State two characteristics of ROM.',
          marks: 2,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q10',
          questionNumber: questionNumber++,
          text: 'Explain what is meant by virtual memory.',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q11',
          questionNumber: questionNumber++,
          text: 'Convert the binary number 11010110 to hexadecimal.',
          marks: 2,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q12',
          questionNumber: questionNumber++,
          text: 'Calculate the file size in bytes for an image that is 800 pixels wide, 600 pixels high, with a colour depth of 24 bits.',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q13',
          questionNumber: questionNumber++,
          text: 'State two advantages of using cloud storage.',
          marks: 2,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q14',
          questionNumber: questionNumber++,
          text: 'Explain the difference between a virus and a worm.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q15',
          questionNumber: questionNumber++,
          text: 'Describe how a firewall protects a network.',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q16',
          questionNumber: questionNumber++,
          text: 'State the purpose of the fetch-execute cycle.',
          marks: 2,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q17',
          questionNumber: questionNumber++,
          text: 'Explain how increasing the number of cores affects CPU performance.',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q18',
          questionNumber: questionNumber++,
          text: 'Give two examples of utility software and explain their purpose.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q19',
          questionNumber: questionNumber++,
          text: 'Describe the difference between lossy and lossless compression.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q20',
          questionNumber: questionNumber++,
          text: 'State two factors that affect network performance.',
          marks: 2,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q21',
          questionNumber: questionNumber++,
          text: 'Explain what is meant by encryption and why it is important.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q22',
          questionNumber: questionNumber++,
          text: 'Compare the advantages and disadvantages of star and mesh network topologies.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-01-q23',
          questionNumber: questionNumber++,
          text: 'Describe two ways that organizations can reduce the environmental impact of computing.',
          marks: 4,
          section: 'B'
        });
        
        // Extended Response Questions (4 × 8 marks = 32 marks)
        questions.push({
          id: 'cs-j277-01-q24',
          questionNumber: questionNumber++,
          text: 'A school is planning to upgrade its computer network. Evaluate the advantages and disadvantages of using a client-server network compared to a peer-to-peer network for this school environment.\n\nIn your answer, you should consider:\n• Security\n• Performance\n• Cost\n• Maintenance requirements',
          marks: 8,
          section: 'C'
        });
        
        questions.push({
          id: 'cs-j277-01-q25',
          questionNumber: questionNumber++,
          text: 'Discuss the ethical and legal issues surrounding the collection and use of personal data by social media companies.\n\nIn your answer, you should consider:\n• Data protection legislation\n• User consent\n• Data security\n• Privacy concerns',
          marks: 8,
          section: 'C'
        });
        
        questions.push({
          id: 'cs-j277-01-q26',
          questionNumber: questionNumber++,
          text: 'Analyze the impact of different types of secondary storage on system performance and user experience.\n\nIn your answer, you should consider:\n• Speed of access\n• Capacity\n• Reliability\n• Cost per gigabyte',
          marks: 8,
          section: 'C'
        });
        
        questions.push({
          id: 'cs-j277-01-q27',
          questionNumber: questionNumber++,
          text: 'Evaluate the benefits and drawbacks of using embedded systems in modern vehicles.\n\nIn your answer, you should consider:\n• Safety features\n• User convenience\n• System reliability\n• Security vulnerabilities',
          marks: 8,
          section: 'C'
        });
        
      } else {
        // Paper 2 – J277/02: Computational thinking, algorithms and programming (1h 30min, 80 marks)
        
        // Section A: Computational thinking and algorithms (40 marks)
        questions.push({
          id: 'cs-j277-02-q1',
          questionNumber: questionNumber++,
          text: 'Define the term "algorithm".',
          marks: 2,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q2',
          questionNumber: questionNumber++,
          text: 'Explain what is meant by "decomposition" in computational thinking.',
          marks: 3,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q3',
          questionNumber: questionNumber++,
          text: 'Write pseudocode for a linear search algorithm to find a target value in an array called "numbers".',
          marks: 5,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q4',
          questionNumber: questionNumber++,
          text: 'Complete the trace table for the following algorithm:\n\nBEGIN\n  x = 5\n  y = 3\n  FOR i = 1 TO 3\n    x = x + y\n    y = y + 1\n  ENDFOR\n  OUTPUT x, y\nEND\n\nTrace Table:\ni | x | y\n--|---|---\n  | 5 | 3\n1 |   |   \n2 |   |   \n3 |   |   ',
          marks: 4,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q5',
          questionNumber: questionNumber++,
          text: 'Describe the main steps of the bubble sort algorithm.',
          marks: 4,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q6',
          questionNumber: questionNumber++,
          text: 'State two advantages of using functions in programming.',
          marks: 2,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q7',
          questionNumber: questionNumber++,
          text: 'Explain the difference between a syntax error and a logic error, giving an example of each.',
          marks: 4,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q8',
          questionNumber: questionNumber++,
          text: 'What is meant by "validation" in programming? Give two examples of validation checks.',
          marks: 4,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q9',
          questionNumber: questionNumber++,
          text: 'Complete the truth table for the Boolean expression: A AND (NOT B OR C)\n\nA | B | C | NOT B | NOT B OR C | A AND (NOT B OR C)\n--|---|---|-------|-------------|------------------\n0 | 0 | 0 |       |             |\n0 | 0 | 1 |       |             |\n0 | 1 | 0 |       |             |\n0 | 1 | 1 |       |             |\n1 | 0 | 0 |       |             |\n1 | 0 | 1 |       |             |\n1 | 1 | 0 |       |             |\n1 | 1 | 1 |       |             |',
          marks: 6,
          section: 'A'
        });
        
        questions.push({
          id: 'cs-j277-02-q10',
          questionNumber: questionNumber++,
          text: 'Write an algorithm using the OCR Exam Reference Language or a high-level programming language to calculate the average of numbers stored in an array called "scores".',
          marks: 6,
          section: 'A'
        });
        
        // Section B: Programming and robust programs (40 marks)
        questions.push({
          id: 'cs-j277-02-q11',
          questionNumber: questionNumber++,
          text: 'Explain the difference between a compiler and an interpreter.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q12',
          questionNumber: questionNumber++,
          text: 'State three features that you would expect to find in an Integrated Development Environment (IDE).',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q13',
          questionNumber: questionNumber++,
          text: 'Write a program using the OCR Exam Reference Language or a high-level programming language that:\n• Asks the user to enter a password\n• Checks if the password is at least 8 characters long\n• If valid, outputs "Password accepted"\n• If invalid, outputs "Password too short" and asks again\n• Continues until a valid password is entered',
          marks: 8,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q14',
          questionNumber: questionNumber++,
          text: 'Explain what is meant by "casting" in programming and give an example.',
          marks: 3,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q15',
          questionNumber: questionNumber++,
          text: 'A program stores student records with the following fields:\n• Name (string)\n• Age (integer)\n• Grade (character)\n• Average_mark (real)\n\nWrite an SQL query to select all students who have a grade of "A" and are aged 16 or over.',
          marks: 4,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q16',
          questionNumber: questionNumber++,
          text: 'Describe three defensive design techniques that programmers can use to make their code more robust.',
          marks: 6,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q17',
          questionNumber: questionNumber++,
          text: 'Write a program using the OCR Exam Reference Language or a high-level programming language that:\n• Creates a 2D array to store a 3x3 grid of numbers\n• Fills the array with random numbers between 1 and 10\n• Calculates and outputs the sum of all numbers in the array',
          marks: 8,
          section: 'B'
        });
        
        questions.push({
          id: 'cs-j277-02-q18',
          questionNumber: questionNumber++,
          text: 'Explain why it is important to test programs thoroughly. Describe three different types of test data that should be used.',
          marks: 4,
          section: 'B'
        });
      }
      
      return questions;
    }
    
    // Generate realistic GCSE predicted exam questions - DIFFERENT from practice questions
    const generatePredictedExamQuestions = (subjectId: string, topics: any[]) => {
      const predictedQuestions: ExamQuestion[] = [];
      let questionNumber = 1;
      
      // Subject-specific question patterns based on real GCSE papers
      const questionPatterns = {
        'chemistry': [
          { pattern: 'Describe the structure and bonding in [topic]', marks: 4 },
          { pattern: 'Explain why [concept] occurs and give an example', marks: 5 },
          { pattern: 'Calculate the [value] in this reaction: [scenario]', marks: 6 },
          { pattern: 'Evaluate the advantages and disadvantages of [process]', marks: 8 },
          { pattern: 'A student investigates [topic]. Describe a method to [objective]', marks: 6 }
        ],
        'biology': [
          { pattern: 'Explain how [structure] is adapted for [function]', marks: 4 },
          { pattern: 'Describe the process of [biological process] and explain its importance', marks: 6 },
          { pattern: 'Compare and contrast [process A] and [process B]', marks: 5 },
          { pattern: 'Suggest why [organism/structure] has evolved [feature]', marks: 3 },
          { pattern: 'Analyse the data shown and explain the trend observed', marks: 6 }
        ],
        'physics': [
          { pattern: 'Calculate the [quantity] using the equation [formula]', marks: 4 },
          { pattern: 'Explain why [phenomenon] occurs in terms of [physics concept]', marks: 5 },
          { pattern: 'Describe an experiment to investigate [physics law/principle]', marks: 6 },
          { pattern: 'Compare the [properties] of [physics concept A] and [physics concept B]', marks: 4 },
          { pattern: 'Evaluate the efficiency of [system/process] and suggest improvements', marks: 8 }
        ],
        'mathematics': [
          { pattern: 'Simplify: 3x + 5x - 7', marks: 2 },
          { pattern: 'Solve for x: 4(x - 2) = 16', marks: 3 },
          { pattern: 'Write 35% as a fraction in its simplest form', marks: 2 },
          { pattern: 'Find the missing number in the sequence: 7, ___, 21, 28, 35', marks: 4 },
          { pattern: 'A recipe needs 250 grams of sugar to make 5 portions. How much sugar is needed for 8 portions?', marks: 3 }
        ],
        'business': [
          { pattern: 'Analyse the impact of [business factor] on [business aspect]', marks: 6 },
          { pattern: 'Evaluate whether [business decision] would be beneficial for [company type]', marks: 8 },
          { pattern: 'Calculate the [financial metric] using the data provided', marks: 4 },
          { pattern: 'Explain two advantages of [business strategy] for [stakeholder group]', marks: 4 },
          { pattern: 'Assess the importance of [business concept] in the success of [business context]', marks: 10 }
        ],
         'geography': [
           { pattern: 'Give one way in which a major city in a LIC/NEE is internationally important.', marks: 1 },
           { pattern: 'Explain how urban industrial areas can help encourage development. Use your own understanding.', marks: 6 },
           { pattern: 'To what extent has urban change created opportunities in a UK city you have studied?', marks: 9 },
           { pattern: 'Using a case study of a LIC/NEE country, explain how manufacturing industry can encourage economic development.', marks: 6 },
           { pattern: 'Outline one way the political or trading relationship of a named LIC/NEE country with the wider world has changed.', marks: 2 },
           { pattern: 'Assess the extent to which urban planning can improve quality of life in cities in LIC/NEE countries.', marks: 9 },
           { pattern: 'Explain how the growth of tourism in a LIC/NEE country can reduce the development gap.', marks: 6 },
           { pattern: 'State two characteristics of a sustainable city.', marks: 2 },
           { pattern: 'Using a named example of a LIC/NEE country, explain how international aid has encouraged development.', marks: 6 },
           { pattern: 'Evaluate the success of an urban regeneration project in improving quality of life.', marks: 9 },
           { pattern: 'Outline one environmental challenge caused by urban growth in cities in LIC/NEE countries.', marks: 2 },
           { pattern: 'Explain how fair trade can help to reduce inequalities in global trade.', marks: 4 },
           { pattern: 'Using a case study of a UK city, assess the effectiveness of transport strategies in reducing traffic congestion.', marks: 9 },
           { pattern: 'Suggest why some countries have a low level of economic development.', marks: 4 },
           { pattern: 'Give one reason why urban areas in LIC/NEE countries are growing rapidly.', marks: 1 },
           { pattern: 'Using examples, explain how TNCs can have both positive and negative impacts on their host countries.', marks: 6 },
           { pattern: 'Assess the sustainability of different strategies used to increase energy supply.', marks: 9 },
           { pattern: 'Explain how microfinance loans can help to reduce poverty in rural areas of LIC countries.', marks: 4 },
           { pattern: 'Outline two ways that urban areas can become more sustainable.', marks: 2 },
           { pattern: 'Using a named example, evaluate the success of a bottom-up development project.', marks: 9 }
         ],
        'computer-science': [
          { pattern: 'Write pseudocode to [programming task] and explain your algorithm', marks: 6 },
          { pattern: 'Analyse the advantages and disadvantages of [computer science concept]', marks: 6 },
          { pattern: 'Explain how [data structure] is used to solve [computing problem]', marks: 4 },
          { pattern: 'Evaluate the security implications of [technology] in [context]', marks: 8 },
          { pattern: 'Describe the process of [computing concept] with reference to a practical example', marks: 5 }
        ]
      };
      
      // Get patterns for this subject or use generic ones
      const patterns = questionPatterns[subjectId as keyof typeof questionPatterns] || [
        { pattern: 'Explain the key features of [topic]', marks: 4 },
        { pattern: 'Analyse the importance of [concept] in [context]', marks: 6 },
        { pattern: 'Evaluate the effectiveness of [approach/method]', marks: 8 },
        { pattern: 'Compare and contrast [concept A] with [concept B]', marks: 5 },
        { pattern: 'Describe how [process] works and explain its significance', marks: 6 }
      ];
      
      // Generate questions for each topic
      topics.forEach((topic, topicIndex) => {
        // Generate 2-4 questions per topic based on realistic exam structure
        const questionsPerTopic = Math.min(3, Math.max(2, Math.floor(25 / topics.length)));
        
      });
      
      // Create a comprehensive pool of unique questions for each subject
      let questionPool: string[] = [];
      
      if (subjectId === 'chemistry') {
        questionPool = [
          `Magnesium reacts with hydrochloric acid to produce hydrogen gas. Describe a method to measure the volume of gas produced. Include safety precautions.`,
          `Explain the difference between ionic and covalent bonding. Give examples of compounds that contain each type of bonding.`,
          `A student investigates the effect of temperature on reaction rate. Describe the method and explain the results in terms of collision theory.`,
          `Calculate the relative formula mass of calcium carbonate (CaCO₃). Show your working clearly. [Ar: Ca=40, C=12, O=16]`,
          `Describe the test for carbon dioxide gas. Explain what you would observe and write a word equation for the reaction.`,
          `The Haber process is used to make ammonia. Evaluate the conditions used and explain why they are a compromise.`,
          `Explain how crude oil is separated by fractional distillation. Describe the properties of the different fractions obtained.`,
          `A student electrolyses copper sulfate solution using copper electrodes. Predict what happens at each electrode and explain why.`,
          `Compare the properties of diamond and graphite. Explain the differences in terms of their structures.`,
          `Calculate the percentage by mass of water in hydrated copper sulfate (CuSO₄·5H₂O). Show your working clearly.`,
          `Describe how metals are extracted from their ores. Compare the methods used for reactive and unreactive metals.`,
          `Explain why Group 1 elements become more reactive down the group. Include electronic structure in your answer.`,
          `A student burns different alcohols and measures temperature changes. Describe how to make this a fair test.`,
          `Explain the greenhouse effect. Discuss how human activities contribute to climate change.`,
          `Describe the structure and bonding in polymers. Explain why different polymers have different properties.`,
          `Calculate the volume of gas produced when 24g of magnesium reacts with excess acid at STP. Show your working.`,
          `Explain how catalysts work. Describe their importance in industrial processes.`,
          `Compare the environmental impact of different fuels. Evaluate which would be best for transport.`,
          `Describe what happens during the electrolysis of brine. Write equations for the reactions at each electrode.`,
          `Explain how the pH scale works. Describe how to measure pH using different methods.`
        ];
      } else if (subjectId === 'biology') {
        questionPool = [
          `Explain how the structure of a red blood cell is adapted for its function. Include specific features in your answer.`,
          `Describe what happens during photosynthesis. Write a balanced symbol equation for this process.`,
          `A student investigates the effect of light intensity on the rate of photosynthesis. Describe a suitable method.`,
          `Explain how the digestive system breaks down food. Include the role of enzymes in your answer.`,
          `Compare aerobic and anaerobic respiration. Give examples of when each type occurs in the human body.`,
          `Describe how plants respond to light and gravity. Explain the advantage of these responses.`,
          `Explain how the structure of alveoli makes them efficient for gas exchange. Include specific adaptations.`,
          `A food chain shows: grass → rabbit → fox. Explain what happens to energy as it passes along this food chain.`,
          `Describe the stages of mitosis. Explain why this type of cell division is important for growth.`,
          `Explain how natural selection leads to evolution. Use an example to illustrate your answer.`,
          `Describe the structure of DNA. Explain how genetic information is stored and passed on.`,
          `Explain how antibodies help the body fight disease. Describe the difference between active and passive immunity.`,
          `A student investigates enzyme activity at different temperatures. Predict the results and explain the shape of the graph.`,
          `Describe how water moves through a plant. Explain the importance of transpiration.`,
          `Compare the structure and function of arteries, veins and capillaries.`,
          `Explain how hormones control blood glucose levels. Describe what happens in diabetes.`,
          `Describe the process of protein synthesis. Explain the roles of DNA, mRNA and ribosomes.`,
          `A student counts organisms in different habitats using quadrats. Describe how to make the sampling reliable.`,
          `Explain how characteristics are inherited. Use examples to show dominant and recessive alleles.`,
          `Describe how the nervous system coordinates responses. Compare nervous and hormonal coordination.`
        ];
      } else if (subjectId === 'physics') {
        questionPool = [
          `A car accelerates from rest to 20 m/s in 8 seconds. Calculate the acceleration. Show your working and include units.`,
          `Explain the difference between renewable and non-renewable energy sources. Give examples of each type.`,
          `A student investigates how the extension of a spring varies with applied force. Describe the method and expected results.`,
          `Calculate the power of a motor that does 3000 J of work in 10 seconds. Show your working and include units.`,
          `Explain how a transformer works. Describe one use of step-up transformers and one use of step-down transformers.`,
          `A wave has a frequency of 50 Hz and wavelength of 6 m. Calculate the wave speed. Show your working.`,
          `Describe the structure of an atom. Explain what determines the charge on an ion.`,
          `Compare the advantages and disadvantages of solar panels and wind turbines for generating electricity.`,
          `Explain why objects appear different colours. Describe what happens when white light passes through a prism.`,
          `A pendulum has a period of 2 seconds. Explain what affects the period of a pendulum and describe how to measure it accurately.`,
          `Calculate the kinetic energy of a 1500kg car travelling at 25 m/s. Show your working and include units.`,
          `Explain how nuclear power stations generate electricity. Discuss the advantages and disadvantages of nuclear power.`,
          `A student drops a ball and measures the time taken to fall different distances. Describe how to improve accuracy.`,
          `Explain the difference between transverse and longitudinal waves. Give examples of each type.`,
          `Calculate the resistance of a component when 12V produces a current of 3A. Show your working.`,
          `Describe how electromagnets work. Explain why the magnetic field can be varied.`,
          `A satellite orbits Earth at constant speed. Explain why it doesn't fall to Earth despite gravity acting on it.`,
          `Explain how X-rays are used in medicine. Discuss the risks and precautions needed.`,
          `Calculate the efficiency of a machine that does 800J of useful work from 1000J of input energy.`,
          `Describe the life cycle of stars. Explain how elements heavier than iron are formed.`
        ];
      } else if (subjectId === 'mathematics') {
        questionPool = [
          `Simplify: 3x + 5x - 7. [2 marks]`,
          `Solve for x: 4(x - 2) = 16. [3 marks]`,
          `Write 35% as a fraction in its simplest form. [2 marks]`,
          `Find the missing number in the sequence: 7, ___, 21, 28, 35. [4 marks]`,
          `A recipe needs 250 grams of sugar to make 5 portions. How much sugar is needed for 8 portions? [3 marks]`,
          `What is 7² - 4 × 3? [3 marks]`,
          `Convert 0.075 into a percentage. [4 marks]`,
          `What is the prime factorization of 84? [2 marks]`,
          `Solve: 2x + 3 = 5x - 6. [5 marks]`,
          `If a car travels 150 km in 2.5 hours, what is its average speed in km/h? [4 marks]`,
          `Express 81 as a power of 3. [3 marks]`,
          `A shop offers a discount of 12% on a jacket that costs £85. What is the price after discount? [4 marks]`,
          `Solve for x: x/4 - 2/3 = 1/6. [5 marks]`,
          `A rectangle has perimeter 36 cm. If its length is 11 cm, what is its width? [3 marks]`,
          `Find the lowest common multiple of 12 and 15. [4 marks]`
        ];
      } else if (subjectId === 'business') {
        questionPool = [
          `Analyse the impact of competition on a small business. Consider both positive and negative effects.`,
          `Evaluate whether a business should focus on cost leadership or differentiation as a competitive strategy.`,
          `A business has fixed costs of £10,000 and variable costs of £5 per unit. Calculate the break-even point if selling price is £15 per unit.`,
          `Explain how changes in interest rates affect business decisions. Consider the impact on different stakeholders.`,
          `Assess the importance of cash flow management for a new business. Use examples to support your answer.`,
          `Compare the advantages and disadvantages of partnerships versus limited companies as business structures.`,
          `Analyse the factors a business should consider when choosing a location. Include both qualitative and quantitative factors.`,
          `Evaluate the effectiveness of advertising as a method of promotion for a small retailer.`,
          `Explain how a business can motivate its employees. Discuss both financial and non-financial methods.`,
          `Assess the impact of e-commerce on traditional high street retailers. Consider both challenges and opportunities.`,
          `Analyse the role of market research in business decision making. Evaluate different methods of collecting data.`,
          `Explain how supply and demand affects pricing decisions. Use a real business example to illustrate your answer.`,
          `Evaluate the benefits and drawbacks of franchising for both franchisors and franchisees.`,
          `Assess the importance of corporate social responsibility for modern businesses. Consider different stakeholder views.`,
          `Analyse the factors that influence consumer buying behaviour. Explain how businesses can use this knowledge.`,
          `Evaluate the effectiveness of different recruitment methods. Consider costs and quality of candidates.`,
          `Explain how businesses can achieve sustainable growth. Discuss the challenges they might face.`,
          `Assess the impact of globalisation on UK manufacturing businesses. Consider both opportunities and threats.`,
          `Analyse the importance of brand image for consumer goods companies. Evaluate strategies to build brand loyalty.`,
          `Explain how businesses can use technology to improve efficiency. Consider the potential risks and costs.`
        ];
      } else if (subjectId === 'geography-paper-2') {
        questionPool = [
          `Give one way in which a major city in a LIC/NEE is internationally important. [1 mark]`,
          `Explain how urban industrial areas can help encourage development. Use your own understanding. [6 marks]`,
          `To what extent has urban change created opportunities in a UK city you have studied? [9 marks]`,
          `Using a case study of a LIC/NEE country, explain how manufacturing industry can encourage economic development. [6 marks]`,
          `Outline one way the political or trading relationship of a named LIC/NEE country with the wider world has changed. [2 marks]`,
          `Explain how the growth of tourism in a LIC/NEE country can reduce the development gap. [4 marks]`,
          `State two characteristics of a sustainable city. [2 marks]`,
          `Using a named example of a LIC/NEE country, explain how international aid has encouraged development. [6 marks]`,
          `Evaluate the success of an urban regeneration project in improving quality of life. [9 marks]`,
          `Outline one environmental challenge caused by urban growth in cities in LIC/NEE countries. [2 marks]`,
          `Explain how fair trade can help to reduce inequalities in global trade. [4 marks]`,
          `Using a case study of a UK city, assess the effectiveness of transport strategies in reducing traffic congestion. [6 marks]`,
          `Suggest why some countries have a low level of economic development. [4 marks]`,
          `Give one reason why urban areas in LIC/NEE countries are growing rapidly. [1 mark]`,
          `Using examples, explain how TNCs can have both positive and negative impacts on their host countries. [6 marks]`,
          `Assess the sustainability of different strategies used to increase energy supply.\n\nOR\n\nAssess the sustainability of different strategies used to increase food production.\n\nOR\n\nAssess the sustainability of different strategies used to increase water supply.\n\n[6 marks]`,
          `Explain how economic development can lead to improved access to safe water.\n\nOR\n\nExplain how economic development can lead to improved access to energy.\n\nOR\n\nExplain how economic development can lead to improved access to food.\n\n[4 marks]`,
          `Outline two ways that urban areas can become more sustainable. [2 marks]`,
          `Using a named example, evaluate the success of a bottom-up development project. [6 marks]`,
          `State one advantage of Fair Trade for farmers in LIC countries. [1 mark]`
        ];
      } else if (subjectId === 'computer-science') {
        questionPool = [
          `Explain the difference between RAM and ROM. Give examples of what each type of memory is used for.`,
          `Write pseudocode for an algorithm that finds the largest number in a list. Explain how your algorithm works.`,
          `Describe three types of network topology. Give advantages and disadvantages of each type.`,
          `Explain what is meant by a database. Describe the advantages of using a database compared to a flat file.`,
          `Analyse the ethical issues surrounding the use of artificial intelligence in decision-making systems.`,
          `Explain how data is represented in binary. Convert the decimal number 25 to binary, showing your working.`,
          `Describe the fetch-decode-execute cycle. Explain what happens at each stage.`,
          `Compare the advantages and disadvantages of different user interfaces (GUI, CLI, menu-driven).`,
          `Explain what is meant by encryption. Describe why encryption is important for online transactions.`,
          `Analyse the environmental impact of computing. Suggest ways that the impact could be reduced.`,
          `Describe the main components of the CPU. Explain the function of each component.`,
          `Write an algorithm to sort a list of numbers into ascending order. Explain your method.`,
          `Compare the features of different programming languages. Discuss when each type would be most suitable.`,
          `Explain how compression works. Compare lossless and lossy compression methods.`,
          `Describe the layers of the internet protocol stack. Explain the purpose of each layer.`,
          `Analyse the legal issues relating to data protection. Explain the main principles of data protection law.`,
          `Explain what is meant by computer modelling. Give examples of where computer models are used.`,
          `Describe different methods of preventing unauthorised access to computer systems.`,
          `Compare the advantages and disadvantages of cloud computing versus local storage.`,
          `Explain how search engines work. Describe the algorithms used to rank web pages.`
        ];
      } else if (subjectId === 'music-eduqas-gcse') {
        questionPool = [
          `Identify the form of Badinerie by J.S. Bach.`,
          `What is an anacrusis? Give one reason composers use it.`,
          `Explain how sequence and imitation are used in Baroque melodies.`,
          `Describe how contrast is created through dynamics, texture, or instrumentation in classical music.`,
          `Explain what a cadence is and name two types.`,
          `Define the terms modulation and relative minor.`,
          `Describe how ornamentation and Alberti bass are used to add variety.`,
          `Give two differences between conjunct and disjunct movement.`,
          `Explain the role of repetition in building structure and unity in classical music.`,
          `Discuss how harmony and tonality changed between the Baroque and Romantic periods.`,
          `Define the following textures: monophonic, homophonic, polyphonic.`,
          `Explain how a melody and accompaniment texture differs from a layered one.`,
          `What is a countermelody, and how can it add interest?`,
          `Compare the textures of a vocal trio and a string quartet.`,
          `Describe how a basso continuo functions in Baroque ensemble music.`,
          `Explain how texture can change throughout a piece to affect mood.`,
          `Identify three ways composers achieve balance within an ensemble.`,
          `Discuss how the venue or audience might affect the performance of ensemble music.`,
          `Name one instrumental and one vocal ensemble type and describe their differences.`,
          `Describe how imitation or canon is used in ensemble writing.`,
          `Define the term sonority.`,
          `Describe how a composer can use instrumentation to convey emotion.`,
          `Give two ways dynamics and articulation create expressive contrast.`,
          `Explain the role of the rhythm section in jazz or blues ensembles.`,
          `Compare musical theatre texture to that of chamber music.`,
          `Describe how accompaniment supports a soloist in ensemble performance.`,
          `Discuss how timbre and tone colour are used to create atmosphere.`,
          `Explain why homophonic texture is common in choral music.`,
          `Identify one reason composers choose polyphonic writing.`,
          `Define leitmotif and explain its purpose in film.`,
          `Describe how tempo and rhythm can create tension or suspense.`,
          `Give two ways dynamics are used for dramatic effect.`,
          `Explain how timbre and tone colour evoke emotion.`,
          `Describe how contrast can reflect scene changes or character shifts.`,
          `Name two instruments or technologies often used to enhance atmosphere.`,
          `Define thematic transformation.`,
          `Explain how minimalism might be used to support a repetitive visual scene.`,
          `Discuss how a composer could use silence effectively in film music.`,
          `Explain how musical language communicates setting or mood (e.g., space, fantasy, horror).`,
          `Explain how the audience or venue influences a composer's choices.`,
          `Describe how technology (sampling, sound design) changes modern film scoring.`,
          `Identify three musical elements that contribute to a sense of drama.`,
          `Identify the main song structure used in "Africa" by Toto.`,
          `Define riff and hook, explaining their role in pop music.`,
          `Describe how verse-chorus form creates contrast and familiarity.`,
          `Explain how backing vocals add texture and harmony.`,
          `Identify two common chord progressions in pop (use Roman numerals or chord symbols).`,
          `Describe how technology such as reverb, panning, and looping is used in production.`,
          `Compare how melody and rhythm differ between pop and Bhangra music.`,
          `Define fusion in music.`,
          `Explain how traditional and modern instruments can be combined.`,
          `Describe syncopation and its effect in dance-based music.`,
          `Explain how samples and loops can transform a pop song.`,
          `Compare melismatic vs syllabic vocal writing.`,
          `Discuss how producers use equalisation and mixing to achieve clarity.`,
          `Identify how rhythm and metre create drive in pop or fusion tracks.`,
          `Explain how improvisation adds spontaneity to performance.`,
          `Describe how software and digital effects influence sonority in popular music.`
        ];
      } else if (subjectId === 'statistics-edexcel-gcse') {
        questionPool = [
          // Section A: The Collection of Data (20 marks total)
          `A student believes that "students who revise with AI tools achieve higher mock grades." Write a testable hypothesis for this investigation.`,
          `State two factors that could affect the validity of a hypothesis about revision methods and exam results.`,
          `A school wants to investigate if older teachers mark faster than younger teachers. Identify the explanatory and response variables in this study.`,
          `Suggest one potential constraint that could affect data collection in a school-based survey.`,
          `A university has 12,000 students and a researcher wants a random sample of 120. Explain how a simple random sample could be selected using a random number generator.`,
          `Describe one advantage and one disadvantage of using a simple random sample.`,
          `A researcher uses opportunity sampling to select participants. Explain one risk of bias with this method.`,
          `A supermarket wants to conduct a stratified sample of 100 shoppers. Suggest two appropriate strata they could use.`,
          `Explain how the sample size for each stratum would be determined in a stratified sample.`,
          `You are designing a questionnaire to find out how much students spend on takeaways each week. Write one suitable open question and one suitable closed question.`,
          `Explain two ways to avoid bias when designing a questionnaire.`,
          `Give two reasons why a researcher might run a pilot survey before conducting the main study.`,
          `A company wants to study how long customers spend on their website. Identify one primary data source and one secondary data source they could use.`,
          `Explain what is meant by data cleaning and give one example of why it is necessary.`,
          `Define what is meant by 'population' in a statistical context.`,
          `Define what is meant by 'sampling frame' and explain why it might differ from the population.`,
          `A researcher wants to study "all GCSE students in England." Explain one reason why identifying an accurate sampling frame could be difficult.`,
          `Explain one advantage of using secondary data instead of collecting primary data.`,
          `Explain one limitation of using secondary data for statistical research.`,
          `State one reason for using a sample instead of conducting a census of an entire population.`,

          // Section B: Processing, Representing & Analysing Data (35 marks total)
          `The table shows the number of hours 40 students revised in a week. Class intervals: 0-4 (freq 4), 5-9 (freq 10), 10-14 (freq 13), 15-19 (freq 8), 20-24 (freq 5). Calculate the estimated mean number of hours revised.`,
          `Explain how to calculate frequency density for a histogram with unequal class widths.`,
          `The following data shows weekly pocket money (£) of 10 students: 5, 7, 5, 10, 12, 8, 7, 9, 6, 11. Calculate the mean.`,
          `For the data: 5, 7, 5, 10, 12, 8, 7, 9, 6, 11, calculate the median.`,
          `For the data: 5, 7, 5, 10, 12, 8, 7, 9, 6, 11, calculate the range.`,
          `State which measure of central tendency (mean, median, or mode) would be most appropriate for data containing extreme outliers, and explain why.`,
          `A frequency table shows test scores in grouped classes: 0-10 (freq 4), 11-20 (freq 6), 21-30 (freq 10), 31-40 (freq 8), 41-50 (freq 2). Estimate the mean score using midpoints.`,
          `Explain how to find the interquartile range (IQR) from a cumulative frequency curve.`,
          `A dataset has a mean of 63 and median of 70. Comment on the skewness of this distribution.`,
          `The data shows revision hours (x): 1, 3, 5, 7, 9 and test scores (y): 22, 35, 46, 50, 61. Describe the type of correlation shown.`,
          `For the revision hours and test scores data, calculate the mean point (x̄, ȳ).`,
          `Explain the difference between correlation and causation, using an example.`,
          `Explain the difference between interpolation and extrapolation, and state which is more reliable.`,
          `Two classes took the same test. Class A: mean = 63, SD = 7. Class B: mean = 66, SD = 2. Compare the performance of the two classes.`,
          `What does the difference in standard deviation between Class A (SD = 7) and Class B (SD = 2) tell you about the consistency of results?`,
          `Two machines produce bolts. Machine 1: mean length = 5.0 cm, SD = 0.2 cm. Machine 2: mean length = 4.9 cm, SD = 0.1 cm. Which machine is more reliable? Justify your answer.`,
          `Calculate the range and interquartile range for the data: 12, 15, 18, 22, 25, 30, 35.`,
          `Explain why IQR is often preferred over range as a measure of spread.`,
          `A dataset has lower quartile (LQ) = 20 and upper quartile (UQ) = 40. Calculate the boundaries for identifying outliers using the 1.5 × IQR rule.`,
          `The price of food (index) increased from 120 to 138, with base year = 2015 = 100. Calculate the percentage increase.`,
          `Explain one advantage of using index numbers to compare prices over time.`,
          `A time series shows sales data with a 3-month moving average of: 48, 50, 53, 55. Describe the trend shown.`,
          `Time series data shows regular peaks every 12 months. Describe this pattern and suggest one possible cause.`,
          `Calculate a 4-point moving average for the data: 12, 15, 18, 14, 16, 19, 17, 20 (show the first two values).`,
          `Explain why moving averages are used when analysing time series data.`,
          `A trend line on a time series graph has a gradient of 2.5 sales per month. Interpret what this means in context.`,

          // Section C: Probability (25 marks total)
          `A bag contains 3 red, 5 blue, and 2 green counters. Find the probability of selecting a red counter.`,
          `A bag contains 3 red, 5 blue, and 2 green counters. Find the probability of not selecting a blue counter.`,
          `A bag contains 3 red, 5 blue, and 2 green counters. Two counters are chosen at random without replacement. Calculate the probability that both are green.`,
          `The probability of rain on Saturday is 0.3 and on Sunday is 0.4, and these events are independent. Find the probability it rains on both days.`,
          `The probability of rain on Saturday is 0.3 and on Sunday is 0.4, and these events are independent. Find the probability it rains on neither day.`,
          `The probability that a student studies Maths is 0.6, Physics is 0.4, and both subjects is 0.2. Calculate P(M or P) using the addition law.`,
          `The probability that a student studies Maths is 0.6, Physics is 0.4, and both subjects is 0.2. Calculate P(M|P), the conditional probability of studying Maths given they study Physics.`,
          `A factory has 80 workers: 30 are female (20 full-time, 10 part-time) and 50 are male (35 full-time, 15 part-time). Find the probability a randomly chosen worker is male and full-time.`,
          `A factory has 80 workers: 30 are female (20 full-time, 10 part-time) and 50 are male (35 full-time, 15 part-time). Find the probability a randomly chosen worker is female and part-time.`,
          `A factory has 80 workers: 30 are female (20 full-time, 10 part-time) and 50 are male (35 full-time, 15 part-time). Calculate P(Female | Part-time).`,
          `A biased coin shows heads with probability 0.6. The coin is tossed 5 times. Find the probability of getting exactly 3 heads using the binomial distribution.`,
          `A biased coin shows heads with probability 0.6 and is tossed 5 times. Find the probability of getting at least 1 tail.`,
          `State the three conditions required for a binomial distribution to be appropriate.`,
          `In a normal distribution with μ = 50 and σ = 4, approximately what percentage of values lie between 46 and 54 (within 1 standard deviation)?`,
          `In a normal distribution with μ = 50 and σ = 4, calculate the z-score for x = 58.`,
          `Interpret what it means for a value to be "3 standard deviations above the mean" in a normal distribution.`,
          `State one condition that must be satisfied for data to be appropriately modelled by a normal distribution.`,
          `A driving instructor's students had 18 passes out of 24 tests. Estimate the probability of passing with this instructor using relative frequency.`,
          `One driving instructor has a pass rate of 75% (18 out of 24) and another has 70%. Calculate the relative risk of passing with the first instructor compared to the second.`,
          `A survey found that 20% of people use e-cigarettes. Out of 800 people surveyed, how many would you expect to use e-cigarettes?`,
          `In a survey, you expected 160 people to use e-cigarettes (20% of 800) but the actual number was 140. Suggest one possible reason for this difference.`,
          `In a factory, product lengths should have a mean of 10 cm and standard deviation of 0.3 cm. Calculate the action limits using ±3σ.`,
          `In a factory, product lengths should have a mean of 10 cm and standard deviation of 0.3 cm. Calculate the warning limits using ±2σ.`,
          `Explain what a manager should do if a sample measurement on a control chart falls beyond the action limit.`,
          `A machine fills cereal boxes with mean 500g and SD 10g. Explain the difference between a warning limit and an action limit on a control chart.`,
          `Explain how a control chart can be used to maintain quality in a manufacturing process.`,
          `Events A and B are independent with P(A) = 0.4 and P(B) = 0.3. Calculate P(A and B).`,
          `If P(A|B) = P(A), what does this tell you about events A and B?`,
          `Two events are mutually exclusive with P(A) = 0.3 and P(B) = 0.2. Calculate P(A or B).`,
          `Events C and D are not mutually exclusive: P(C) = 0.5, P(D) = 0.4, P(C and D) = 0.2. Calculate P(C or D) using the general addition law.`,
          `A coin is flipped 100 times and lands on heads 47 times. Estimate P(heads) using relative frequency.`,
          `Explain the difference between experimental probability and theoretical probability.`,
          `A sample of 50 items has a mean of 42. Explain how this could be used to estimate the population mean, and comment on reliability.`,
          `In the Petersen capture-recapture method, 40 fish are tagged in the first capture. In the second capture, 50 fish are caught and 8 are tagged. Estimate the total population of fish.`,
          `State two assumptions that must hold for the capture-recapture method to give accurate results.`,
          `Explain how increasing sample size affects the reliability of population estimates.`
        ];
      } else {
        // Generic questions - generate based on topics
        const topicNames = topics.map(t => t.name);
        questionPool = topicNames.flatMap(topic => [
          `Explain the key features of ${topic.toLowerCase()}. Analyse why these features are important.`,
          `Evaluate different approaches to ${topic.toLowerCase()}. Support your answer with specific examples.`,
          `Analyse the factors that influence ${topic.toLowerCase()}. Consider both advantages and disadvantages.`,
          `Compare and contrast different aspects of ${topic.toLowerCase()}. Use evidence to support your points.`,
          `Assess the significance of ${topic.toLowerCase()} in its wider context. Consider different perspectives.`,
          `Explain how ${topic.toLowerCase()} has developed over time. Analyse the reasons for these changes.`
        ]).slice(0, 25); // Limit to prevent too many questions
      }
      
      // Shuffle questions and ensure no duplicates in the exam
      const shuffledQuestions = [...questionPool].sort(() => Math.random() - 0.5);
      const usedQuestions = new Set<string>();
      
      // Generate questions ensuring no duplicates
      const totalQuestionsNeeded = Math.min(25, Math.max(20, topics.length * 3));
      let questionIndex = 0;
      
      for (let i = 0; i < totalQuestionsNeeded && questionIndex < shuffledQuestions.length; i++) {
        const questionText = shuffledQuestions[questionIndex];
        
        // Skip if question already used
        if (usedQuestions.has(questionText)) {
          questionIndex++;
          i--; // Don't count this iteration
          continue;
        }
        
        usedQuestions.add(questionText);
        
        // Extract marks from question text - handle both "[X marks]" and "[X marks + SPaG]"
        const marksMatch = questionText.match(/\[(\d+)\s*marks?(?:\s*\+\s*SPaG)?\]/i);
        const extractedMarks = marksMatch ? parseInt(marksMatch[1]) : 4;
        
        predictedQuestions.push({
          id: `predicted-${i}`,
          questionNumber: questionNumber++,
          text: questionText,
          marks: extractedMarks,
          section: i < Math.ceil(totalQuestionsNeeded / 2) ? 'A' : 'B'
        });
        
        questionIndex++;
      }
      
      // Ensure we have enough questions for a full exam (20-25 questions)
      const targetQuestions = Math.min(25, Math.max(20, predictedQuestions.length));
      return predictedQuestions.slice(0, targetQuestions);
    };

    // Use the new predicted question generator for subjects that don't have specific exam formats
    if (subjectId !== 'physics' && subjectId !== 'geography' && subjectId !== 'geography-a-edexcel' && subjectId !== 'geography-b-ocr' && subjectId !== 'english-literature' && subjectId !== 'history' && subjectId !== 'english-language' && subjectId !== 'religious-studies' && subjectId !== 'psychology' && subjectId !== 'psychology-aqa-alevel') {
      const predictedQuestions = generatePredictedExamQuestions(subjectId, subject.topics);
      questions.push(...predictedQuestions);
    }
    
    // Special handling for OCR GCSE Psychology Paper 1 predicted exam format
    if (subjectId === 'psychology') {
      console.log('🧠 GENERATING OCR PSYCHOLOGY PAPER 1 QUESTIONS');
      const psychologyQuestions: ExamQuestion[] = [
        // Section A - Criminal Psychology (24 marks)
        // Multiple Choice (3 marks)
        {
          id: 'psych-a-mc1',
          questionNumber: 1,
          text: 'Which of the following best describes a social construct?\nA. A behavior that is biologically determined.\nB. A behavior that is considered acceptable in all cultures.\nC. A behavior defined by society and cultural norms.\nD. A behavior resulting from genetic inheritance.\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'psych-a-mc2',
          questionNumber: 2,
          text: 'Which part of the brain is most linked to psychoticism in Eysenck\'s theory?\nA. The hippocampus\nB. The reticular activating system\nC. The visual cortex\nD. The cerebellum\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        {
          id: 'psych-a-mc3',
          questionNumber: 3,
          text: 'Which research study investigated video games and aggression in children?\nA. Heaven (1996)\nB. Cooper and Mackie (1986)\nC. Piaget (1952)\nD. Bickman (1974)\n\n[1 mark]',
          marks: 1,
          section: 'A'
        },
        
        // Section A - Short Response (8 marks)
        {
          id: 'psych-a-sr1',
          questionNumber: 4,
          text: 'Outline two features of Eysenck\'s Criminal Personality Theory.\n\n[4 marks]',
          marks: 4,
          section: 'A'
        },
        {
          id: 'psych-a-sr2',
          questionNumber: 5,
          text: 'Describe one criticism of the Social Learning Theory of criminality.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'psych-a-sr3',
          questionNumber: 6,
          text: 'Explain how positive role models can be used in rehabilitation to reduce criminal behaviour.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        
        // Section A - Extended Response (13 marks)
        {
          id: 'psych-a-er1',
          questionNumber: 7,
          text: 'Discuss how the Social Learning Theory and Eysenck\'s Criminal Personality Theory explain criminal behaviour.\n\nIn your answer you should refer to:\n• The main features of each theory.\n• Evidence from psychological research.\n• Strengths and weaknesses of both explanations.\n\n[13 marks]',
          marks: 13,
          section: 'A'
        },
        
        // Section B - Development (24 marks) - Multiple Choice (3 marks)
        {
          id: 'psych-b-mc1',
          questionNumber: 8,
          text: 'Which of the following is a key process in Piaget\'s theory?\nA. Rehearsal\nB. Assimilation\nC. Reinforcement\nD. Identification\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'psych-b-mc2',
          questionNumber: 9,
          text: 'Dweck\'s concept of a growth mindset suggests that:\nA. Intelligence is fixed and cannot change.\nB. Success depends entirely on genetics.\nC. Effort and persistence can improve ability.\nD. Learning styles determine academic outcomes.\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'psych-b-mc3',
          questionNumber: 10,
          text: 'Which research study tested fixed and growth mindsets?\nA. Piaget (1952)\nB. Blackwell et al. (2007)\nC. Freud (1918)\nD. Daniel et al. (1991)\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        
        // Section B - Short/Medium Response (9 marks)
        {
          id: 'psych-b-sr1',
          questionNumber: 11,
          text: 'Explain what Piaget meant by object permanence.\n\n[2 marks]',
          marks: 2,
          section: 'B'
        },
        {
          id: 'psych-b-sr2',
          questionNumber: 12,
          text: 'Describe one similarity and one difference between Piaget\'s and Willingham\'s theories of learning.\n\n[4 marks]',
          marks: 4,
          section: 'B'
        },
        {
          id: 'psych-b-sr3',
          questionNumber: 13,
          text: 'Evaluate one strength and one weakness of Dweck\'s mindset theory.\n\n[3 marks]',
          marks: 3,
          section: 'B'
        },
        
        // Section B - Application (12 marks)
        {
          id: 'psych-b-app1',
          questionNumber: 14,
          text: 'A teacher notices that some students give up quickly when challenged.\n\nUsing Dweck\'s mindset theory, explain two ways the teacher could help develop growth mindsets in the classroom.\n\n[4 marks]',
          marks: 4,
          section: 'B'
        },
        {
          id: 'psych-b-app2',
          questionNumber: 15,
          text: 'Discuss how Piaget\'s theory has influenced modern education, referring to examples from classroom practice.\n\n[8 marks]',
          marks: 8,
          section: 'B'
        },
        
        // Section C - Psychological Problems (24 marks) - Multiple Choice (3 marks)
        {
          id: 'psych-c-mc1',
          questionNumber: 16,
          text: 'Which of the following best describes the dopamine hypothesis of schizophrenia?\nA. Low dopamine levels cause hallucinations.\nB. Overactive dopamine systems cause high dopamine activity in the brain.\nC. Dopamine has no role in schizophrenia.\nD. Dopamine levels decrease after taking antipsychotic medication.\n\n[1 mark]',
          marks: 1,
          section: 'C'
        },
        {
          id: 'psych-c-mc2',
          questionNumber: 17,
          text: 'The ABC model of depression suggests that:\nA. Behaviour always causes beliefs.\nB. Beliefs influence emotional consequences.\nC. Activating events are unrelated to emotions.\nD. Depression is caused by low serotonin.\n\n[1 mark]',
          marks: 1,
          section: 'C'
        },
        {
          id: 'psych-c-mc3',
          questionNumber: 18,
          text: 'Which study investigated Facebook use, envy, and depression?\nA. Heaven (1996)\nB. Tandoc et al. (2015)\nC. Daniel et al. (1991)\nD. Cooper and Mackie (1986)\n\n[1 mark]',
          marks: 1,
          section: 'C'
        },
        
        // Section C - Short/Medium Response (9 marks)
        {
          id: 'psych-c-sr1',
          questionNumber: 19,
          text: 'Describe the social drift theory of schizophrenia.\n\n[3 marks]',
          marks: 3,
          section: 'C'
        },
        {
          id: 'psych-c-sr2',
          questionNumber: 20,
          text: 'Outline two symptoms of clinical depression according to the ICD.\n\n[2 marks]',
          marks: 2,
          section: 'C'
        },
        {
          id: 'psych-c-sr3',
          questionNumber: 21,
          text: 'Explain one difference between the biological and psychological explanations of schizophrenia.\n\n[4 marks]',
          marks: 4,
          section: 'C'
        },
        
        // Section C - Extended Response (12 marks)
        {
          id: 'psych-c-er1',
          questionNumber: 22,
          text: 'Evaluate the use of antipsychotic and antidepressant medications for treating mental health problems.\n\nIn your answer, refer to how these treatments work and their strengths and limitations.\n\n[12 marks]',
          marks: 12,
          section: 'C'
        },
        
        // Section D - Research Methods (18 marks)
        {
          id: 'psych-d-sr1',
          questionNumber: 23,
          text: 'Write an alternative hypothesis for this study:\n\nA psychologist predicts that students who revise using flashcards will score higher than those who revise by rereading notes.\n\n[2 marks]',
          marks: 2,
          section: 'D'
        },
        {
          id: 'psych-d-sr2',
          questionNumber: 24,
          text: 'Identify one independent variable and one dependent variable in the study above.\n\n[2 marks]',
          marks: 2,
          section: 'D'
        },
        {
          id: 'psych-d-sr3',
          questionNumber: 25,
          text: 'Name one sampling method the researcher could use and explain one advantage of using it.\n\n[3 marks]',
          marks: 3,
          section: 'D'
        },
        {
          id: 'psych-d-sr4',
          questionNumber: 26,
          text: 'Describe one ethical issue in psychological research and explain how it can be dealt with.\n\n[3 marks]',
          marks: 3,
          section: 'D'
        },
        {
          id: 'psych-d-sr5',
          questionNumber: 27,
          text: 'Outline one strength and one weakness of using a laboratory experiment.\n\n[4 marks]',
          marks: 4,
          section: 'D'
        },
        {
          id: 'psych-d-sr6',
          questionNumber: 28,
          text: 'A researcher finds a positive correlation between stress levels and time spent on social media.\n\nExplain what this means and give one limitation of correlation studies.\n\n[4 marks]',
          marks: 4,
          section: 'D'
        }
      ];
      
      questions.push(...psychologyQuestions);
      console.log('✅ Generated', psychologyQuestions.length, 'OCR Psychology Paper 1 questions (90 marks total)');
    }
    
    // Special handling for AQA A-Level Psychology Paper 1 predicted exam format
    if (subjectId === 'psychology-aqa-alevel') {
      console.log('🧠 GENERATING AQA PSYCHOLOGY A-LEVEL PAPER 1 QUESTIONS');
      const psychologyALevelQuestions: ExamQuestion[] = [
        // Section A - Social Influence (24 marks)
        {
          id: 'psych-al-a-q1',
          questionNumber: 1,
          text: 'Define internalisation.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'psych-al-a-q2',
          questionNumber: 2,
          text: 'Outline informational social influence.\n\n[2 marks]',
          marks: 2,
          section: 'A'
        },
        {
          id: 'psych-al-a-q3',
          questionNumber: 3,
          text: 'Describe and evaluate research into variables affecting conformity.\n\n[8 marks]',
          marks: 8,
          section: 'A'
        },
        {
          id: 'psych-al-a-q4',
          questionNumber: 4,
          text: 'Discuss legitimacy of authority and agentic state in obedience.\n\n[16 marks]',
          marks: 16,
          section: 'A'
        },
        
        // Section B - Memory (24 marks)
        {
          id: 'psych-al-b-q5',
          questionNumber: 5,
          text: 'Identify one difference between STM and LTM.\n\n[1 mark]',
          marks: 1,
          section: 'B'
        },
        {
          id: 'psych-al-b-q6',
          questionNumber: 6,
          text: 'Outline one feature of the working memory model.\n\n[2 marks]',
          marks: 2,
          section: 'B'
        },
        {
          id: 'psych-al-b-q7',
          questionNumber: 7,
          text: 'Explain how retrieval failure may cause forgetting.\n\n[4 marks]',
          marks: 4,
          section: 'B'
        },
        {
          id: 'psych-al-b-q8',
          questionNumber: 8,
          text: 'Discuss research into factors affecting eyewitness testimony.\n\n[16 marks]',
          marks: 16,
          section: 'B'
        },
        
        // Section C - Attachment (24 marks)
        {
          id: 'psych-al-c-q9',
          questionNumber: 9,
          text: 'Outline one finding from Lorenz\'s research.\n\n[2 marks]',
          marks: 2,
          section: 'C'
        },
        {
          id: 'psych-al-c-q10',
          questionNumber: 10,
          text: 'Describe the procedure and findings of Ainsworth\'s Strange Situation.\n\n[6 marks]',
          marks: 6,
          section: 'C'
        },
        {
          id: 'psych-al-c-q11',
          questionNumber: 11,
          text: 'Discuss Bowlby\'s theory of maternal deprivation.\n\n[16 marks]',
          marks: 16,
          section: 'C'
        },
        
        // Section D - Psychopathology (24 marks)
        {
          id: 'psych-al-d-q12',
          questionNumber: 12,
          text: 'Outline two definitions of abnormality.\n\n[4 marks]',
          marks: 4,
          section: 'D'
        },
        {
          id: 'psych-al-d-q13',
          questionNumber: 13,
          text: 'Describe the behavioural characteristics of OCD.\n\n[4 marks]',
          marks: 4,
          section: 'D'
        },
        {
          id: 'psych-al-d-q14',
          questionNumber: 14,
          text: 'Discuss the cognitive approach to explaining and treating depression.\n\n[16 marks]',
          marks: 16,
          section: 'D'
        }
      ];
      
      questions.push(...psychologyALevelQuestions);
      console.log('✅ Generated', psychologyALevelQuestions.length, 'AQA Psychology A-Level Paper 1 questions (96 marks total)');
    }
    
    return questions;
  };

  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [geographyPaperType, setGeographyPaperType] = useState<string>('');
  
  // Generate exam questions when component mounts or subject changes
  useEffect(() => {
    console.log('🔄 useEffect triggered for exam questions generation');
    console.log('Current subjectId:', subjectId);
    const newQuestions = generateExamQuestions();
    console.log('Setting exam questions, count:', newQuestions.length);
    console.log('First question preview:', newQuestions[0]?.text);
    setExamQuestions(newQuestions);
  }, [subjectId, subject]); // Added subject as dependency

  const getExamDuration = () => {
    const durations = {
      chemistry: 135, // 2h 15min
      biology: 105, // 1h 45min (AQA Biology Paper 1)
      physics: 135, // 2h 15min
      mathematics: 120, // 2h
      "mathematics-paper-1": 90, // 1h 30min (AQA Maths Paper 1 Non-Calculator)
      "maths-edexcel": 90, // 1h 30min (Edexcel GCSE Maths Paper 1 Non-Calculator)
      "business-edexcel-igcse": 90, // 1h 30min (Edexcel IGCSE Business Paper 1)
      "chemistry-edexcel": 105, // 1h 45min (Edexcel GCSE Chemistry Paper 1)
      "english-language": 135, // 2h 15min
      "english-literature": 150, // 2h 30min
      history: 120, // 2h
      "history-edexcel-gcse": 75, // 1h 15min (Edexcel GCSE History Paper 1)
      "religious-studies": 120, // 2h
      business: 105, // 1h 45min
      french: 120, // 2h
      spanish: 120, // 2h
      german: 120, // 2h
      geography: 90, // 1h 30min
      "geography-a-edexcel": 90, // 1h 30min
      "geography-b-ocr": 90, // 1h 30min
      "computer-science": 120, // 2h
      psychology: 90, // 1h 30min
      "psychology-aqa-alevel": 120, // 2h (AQA A-Level Psychology Paper 1)
      "maths-aqa-alevel": 120, // 2h (AQA A-Level Maths Paper 1: Pure Mathematics)
      "biology-aqa-alevel": 120, // 2h (AQA A-Level Biology Paper 1)
      "chemistry-aqa-alevel": 120, // 2h (AQA A-Level Chemistry Paper 1)
    };
    return durations[subjectId as keyof typeof durations] || 90;
  };

  const getTotalMarks = () => {
    if (subjectId === 'english-language') {
      return 80; // Section A: 40 marks (4+8+8+20) + Section B: 40 marks
    }
    if (subjectId === 'english-literature') {
      return 60; // Two questions at 30 marks each
    }
    if (subjectId === 'biology') {
      return 100; // AQA Biology Paper 1: 100 marks
    }
    if (subjectId === 'chemistry') {
      return 100; // AQA Chemistry Paper 1: 100 marks
    }
    if (subjectId === 'chemistry-aqa-alevel') {
      return 105; // AQA A-Level Chemistry Paper 1: 105 marks
    }
    if (subjectId === 'maths') {
      return 80; // AQA Maths Paper 1: 80 marks
    }
    if (subjectId === 'physics') {
      return 100; // 8 MC (8) + 20 SS (47) + 6 LS (33) + 2 Ext (12) = 100 marks
    }
    if (subjectId === 'geography') {
      return 88; // Section A (30) + Section B (29) + Section C (29 including 3 SPaG) = 88 marks
    }
    if (subjectId === 'geography-a-edexcel') {
      return 94; // Edexcel Geography A Paper 1: 94 marks total (including SPaG)
    }
    if (subjectId === 'geography-b-ocr') {
      return 70; // OCR Geography B Papers 01/02: 70 marks each, Paper 03: 60 marks
    }
    if (subjectId === 'history-edexcel-gcse') {
      return 52; // History Edexcel Paper 1: 52 marks total (4+12+20+4+8+12)
    }
    if (subjectId === 'history') {
      return 84; // History Paper 1: Section A (44 marks) + Section B (40 marks)
    }
    if (subjectId === 'religious-studies') {
      return 96; // 96 marks total
    }
    if (subjectId === 'business') {
      return 90; // AQA Business Paper 1: 90 marks
    }
    if (subjectId === 'combined-science-aqa') {
      return 70; // AQA Combined Science Biology Paper 1: 70 marks
    }
    if (subjectId === 'maths-edexcel') {
      return 80; // Edexcel GCSE Maths Paper 1: 80 marks
    }
    if (subjectId === 'business-edexcel-igcse') {
      return 80; // Edexcel IGCSE Business Paper 1: 80 marks
    }
    if (subjectId === 'chemistry-edexcel') {
      return 100; // Edexcel GCSE Chemistry Paper 1: 100 marks
    }
    if (subjectId === 'physics-edexcel') {
      return 100; // Edexcel GCSE Physics Paper 1: 100 marks
    }
    if (subjectId === 'psychology') {
      return 90; // OCR GCSE Psychology Paper 1: 90 marks
    }
    if (subjectId === 'psychology-aqa-alevel') {
      return 96; // AQA A-Level Psychology Paper 1: 96 marks
    }
    if (subjectId === 'maths-aqa-alevel') {
      return 100; // AQA A-Level Maths Paper 1: Pure Mathematics: 100 marks
    }
    if (subjectId === 'biology-aqa-alevel') {
      return 91; // AQA A-Level Biology Paper 1: 91 marks (15 + 61 + 15)
    }
    return examQuestions.reduce((total, q) => total + q.marks, 0);
  };

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true);
            toast({
              title: "Time's Up!",
              description: "The exam timer has finished, but you can continue working.",
              variant: "destructive"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft, toast]);

  const startExam = () => {
    setExamStarted(true);
    setTimeLeft(getExamDuration() * 60); // Convert to seconds
    toast({
      title: "Exam Started!",
      description: "Good luck with your predicted exam practice."
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
      }
      return [...prev, { questionId, answer }];
    });
  };

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.answer || '';
  };

  const markAnswerWithSmart = async (question: ExamQuestion, answer: string) => {
    try {
      console.log('Marking predicted exam answer:', { questionId: question.id, marks: question.marks });
      
      // First generate an accurate GCSE model answer
      const modelAnswerResult = await supabase.functions.invoke('generate-model-answer', {
        body: {
          question: question.text,
          subjectId: subjectId,
          marks: question.marks
        }
      });

      const modelAnswer = modelAnswerResult.data?.modelAnswer || 
        `GCSE ${subjectId} ${question.marks} mark question. Answer should demonstrate appropriate knowledge and understanding at GCSE level with correct terminology.`;

      // Then mark against the precise GCSE standard
      const { data, error } = await supabase.functions.invoke('mark-answer', {
        body: {
          question: question.text,
          userAnswer: answer,
          modelAnswer: modelAnswer,
          markingCriteria: `GCSE ${subjectId} marking criteria for ${question.marks} marks:
- Award marks only for content in GCSE specification
- Require appropriate GCSE-level terminology and depth
- Apply official GCSE command word requirements
- Match mark allocation to depth of response expected
- Reject irrelevant or over-complex content not required at GCSE level`,
          totalMarks: question.marks,
          subject: subjectId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      return {
        marksAwarded: data.marksAwarded || 0,
        feedback: data.feedback || "No feedback available",
        assessment: data.assessment || "Needs Review"
      };

    } catch (error) {
      console.error('Error calling Smart marking function:', error);
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "Smart marking temporarily unavailable. Answer has been given partial credit.",
        assessment: "Needs Review"
      };
    }
  };

  const handleSubmit = async () => {
    // Allow submission at any time for all subjects - no validation required
    
    setIsSubmitted(true);
    
    // Show immediate success message
    toast({
      title: "Exam submitted!",
      description: "Processing your results...",
    });
    
    // Generate notebook notes in the background (don't await)
    if (user?.id && answers.length > 0) {
      // Run notebook generation in background without blocking navigation
      (async () => {
        try {
          let notesGenerated = 0;
          
          // Mark each answered question and generate notes for wrong answers
          for (const answer of answers) {
            const question = examQuestions.find(q => q.id === answer.questionId);
            if (question && answer.answer.trim()) {
              try {
                // Mark the answer with Smart system
                const markingResult = await markAnswerWithSmart(question, answer.answer);
                const marksLost = question.marks - markingResult.marksAwarded;
                
                // Handle personalized notification for wrong answers
                if (marksLost > 0) {
                  const topicName = getTopicNameFromQuestionId(question.id);
                  handlePredictedExamWrongAnswer(
                    question.questionNumber,
                    topicName,
                    subject.name,
                    markingResult.marksAwarded,
                    question.marks
                  );
                }
                
                // Only generate notes if marks were lost
                if (marksLost > 0) {
                  // Create a mock Question object compatible with NotebookGenerator
                  const mockQuestion = {
                    id: question.id,
                    question: question.text,
                    marks: question.marks,
                    difficulty: 'medium' as const,
                    modelAnswer: markingResult.feedback || `This is a predicted exam question worth ${question.marks} marks. Focus on addressing the key marking criteria.`,
                    markingCriteria: { 
                      breakdown: [
                        `Analysis and understanding (${Math.ceil(question.marks / 2)} marks)`,
                        `Application and evaluation (${Math.floor(question.marks / 2)} marks)`
                      ] 
                    },
                    specReference: 'Predicted Exam Practice'
                  };
                  
                  const success = await NotebookGenerator.generateAndSaveNotes(
                    user.id,
                    mockQuestion,
                    answer.answer,
                    marksLost,
                    subjectId || '',
                    'predicted-exam'
                  );
                  
                  if (success) {
                    notesGenerated++;
                  }
                }
              } catch (error) {
                console.error('Error processing question:', question.id, error);
              }
            }
          }
          
          // Show final notification once background processing is complete
          if (notesGenerated > 0) {
            toast({
              title: "Notes generated!",
              description: `Smart notes added to your Notebook for ${notesGenerated} question${notesGenerated > 1 ? 's' : ''} where you lost marks.`,
            });
          }
        } catch (error) {
          console.error('Error generating notebook notes:', error);
        }
      })();
    }
    
    navigate(`/predicted-results/${subjectId}`, {
      state: { 
        questions: examQuestions, 
        answers: answers,
        timeElapsed: getExamDuration() * 60 - timeLeft,
        totalMarks: getTotalMarks()
      } 
    });
  };

  const progress = (answers.length / examQuestions.length) * 100;

  if (!examStarted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/10 ${isPremium ? '' : 'pt-12'}`}>
        <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => {
                console.log('Back button clicked (predicted exam)');
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  // Fallback to dashboard if no history
                  window.location.href = '/dashboard';
                }
              }} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16 max-w-2xl">
          <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="h-8 w-8 text-amber-500" />
                <div>
                  <CardTitle className="text-2xl font-bold">{subjectId === 'history-edexcel-gcse' ? 'Edexcel GCSE History – Paper 1' : subjectId === 'history' ? 'History Paper 1' : subjectId === 'religious-studies' ? 'Religious Studies Component 1' : subjectId === 'maths' ? 'AQA Maths Paper 1 (Non-Calculator)' : subjectId === 'maths-aqa-alevel' ? 'A-level Mathematics (AQA) - Paper 1: Pure Mathematics' : subjectId === 'computer-science' ? 'Computer Science Paper 1' : subjectId === 'psychology' ? 'Studies and Applications in Psychology 1 (Component 01)' : subjectId === 'psychology-aqa-alevel' ? 'AQA Psychology A-Level Paper 1' : `${subject.name} Predicted Exam`}</CardTitle>
                  <CardDescription>{getBadgeText(subjectId || '')} • {getExamDuration()} minutes</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary">{examQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 bg-card rounded-xl border">
                  <div className="text-2xl font-bold text-primary">{getExamDuration()}min</div>
                  <div className="text-sm text-muted-foreground">Time Limit</div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-800 dark:text-amber-200">Exam Instructions</span>
                </div>
                {subjectId === 'english-literature' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Section A:</strong> Choose ONE Shakespeare question to answer</li>
                    <li>• <strong>Section B:</strong> Choose ONE 19th Century novel question to answer</li>
                    <li>• Answer TWO questions in total (one from each section)</li>
                    <li>• You have {getExamDuration()} minutes to complete this paper</li>
                    <li>• Each question is worth 30 marks (Total: 60 marks)</li>
                  </ul>
                ) : subjectId === 'history' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Section A:</strong> Choose ONE Period Studies topic (America, Germany, Russia, or America 1920-1973)</li>
                    <li>• <strong>Section B:</strong> Choose ONE Wider World Depth Study (WWI, Inter-War, Cold War, Asia, or Gulf)</li>
                    <li>• Answer questions from your chosen topics only</li>
                    <li>• You have {getExamDuration()} minutes to complete this paper</li>
                    <li>• Questions range from 4-12 marks each</li>
                  </ul>
                ) : subjectId === 'history-edexcel-gcse' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>EDEXCEL GCSE HISTORY – PAPER 1</strong></li>
                    <li>• <strong>Choose ONE</strong> Thematic Study option and answer ALL questions for that option</li>
                    <li>• <strong>Options:</strong> Crime and punishment + Whitechapel | Medicine + Western Front | Warfare + London WWII | Migrants + Notting Hill</li>
                    <li>• Time: {getExamDuration()} minutes | Total marks: {getTotalMarks()}</li>
                    <li>• Questions include: 4, 12, 16+4 SPaG, 4, 8, and 12 marks</li>
                    <li>• Use black ink or ball-point pen</li>
                  </ul>
                ) : subjectId === 'religious-studies' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Choose TWO religions</strong> from Buddhism, Christianity, Catholic Christianity, Hinduism, Islam, Judaism, or Sikhism</li>
                    <li>• Answer all questions for your chosen religions only</li>
                    <li>• Each religion has two 5-part question sets (1+2+4+5+12 marks each)</li>
                    <li>• Total: 96 marks + 6 marks for spelling, punctuation and grammar</li>
                    <li>• You have {getExamDuration()} minutes to complete this paper</li>
                  </ul>
                ) : subjectId === 'spanish-aqa' || subjectId?.startsWith('spanish-aqa-paper-') ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    {subjectId?.includes('paper-3') && subjectId?.includes('foundation') && (
                      <>
                        <li>• <strong>Paper 3: Reading – Foundation Tier</strong></li>
                        <li>• Time: 45 minutes | Total marks: 50 | Weighting: 25%</li>
                        <li>• Answer Section A in English (or non-verbally, as indicated)</li>
                        <li>• Section B is a translation into English</li>
                        <li>• No images are used</li>
                      </>
                    )}
                    {subjectId?.includes('paper-3') && subjectId?.includes('higher') && (
                      <>
                        <li>• <strong>Paper 3: Reading – Higher Tier</strong></li>
                        <li>• Time: 1 hour | Total marks: 50 | Weighting: 25%</li>
                        <li>• Answer Section A in English/non-verbally</li>
                        <li>• Section B is a translation into English</li>
                        <li>• No images are used</li>
                      </>
                    )}
                    {subjectId?.includes('paper-4') && subjectId?.includes('foundation') && (
                      <>
                        <li>• <strong>Paper 4: Writing – Foundation Tier</strong></li>
                        <li>• Time: 1 hour 10 minutes | Total marks: 50 | Weighting: 25%</li>
                        <li>• No images are used</li>
                        <li>• Read each question carefully before answering</li>
                        <li>• Check your work before submitting</li>
                      </>
                    )}
                    {subjectId?.includes('paper-4') && subjectId?.includes('higher') && (
                      <>
                        <li>• <strong>Paper 4: Writing – Higher Tier</strong></li>
                        <li>• Time: 1 hour 15 minutes | Total marks: 50 | Weighting: 25%</li>
                        <li>• No images are used</li>
                        <li>• Read each question carefully before answering</li>
                        <li>• Check your work before submitting</li>
                      </>
                    )}
                    {(!subjectId?.includes('paper-') || subjectId === 'spanish-aqa') && (
                      <>
                        <li>• Choose from 4 predicted papers for AQA GCSE Spanish</li>
                        <li>• Each paper matches official structure, timing and marks</li>
                        <li>• Read each question carefully before answering</li>
                        <li>• Check your work before submitting</li>
                      </>
                    )}
                  </ul>
                ) : subjectId === 'maths-aqa-alevel' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Time allowed:</strong> 2 hours | <strong>Total marks:</strong> 100</li>
                    <li>• Use black ink or black ball-point pen</li>
                    <li>• Answer all questions</li>
                    <li>• You may use a scientific calculator</li>
                    <li>• Give answers to an appropriate degree of accuracy (unless exact values are required)</li>
                    <li>• State your methods clearly; unsupported answers may not receive full credit</li>
                    <li>• Where a result is requested in exact form, leave surds, π, and rational terms exact</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Answer all questions in the spaces provided</li>
                    <li>• You have {getExamDuration()} minutes to complete this paper</li>
                    <li>• Read each question carefully before answering</li>
                    <li>• Check your work before submitting</li>
                  </ul>
                 )}
              </div>
              
              <Button 
                onClick={startExam}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 py-3 font-semibold"
              >
                <Clock className="h-4 w-4 mr-2" />
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPremium ? 'pt-2' : 'pt-16'}`} style={{ backgroundColor: '#ffffff' }}>
      {/* Medly-style Top Navigation */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left: Exam name with navigation */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="h-9 w-9 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center min-w-0 flex-1">
                <h1 className="text-lg font-semibold text-slate-900 truncate">
                  {subjectId === 'history-edexcel-gcse' ? 'Edexcel GCSE History – Paper 1' :
                   subjectId === 'history' ? 'History Paper 1' : 
                   subjectId === 'religious-studies' ? 'Religious Studies Component 1' : 
                   subjectId === 'geography' ? `Geography ${geographyPaperType}` : 
                   subjectId === 'geography-a-edexcel' ? 'Geography A (Edexcel) Paper 1' :
                   subjectId === 'geography-b-ocr' ? 'Geography B (OCR)' :
                   subjectId === 'geography-paper-2' ? 'Geography Paper 2' :
                   subjectId === 'maths' ? 'AQA Maths Paper 1 (Non-Calculator)' :
                   subjectId === 'maths-aqa-alevel' ? 'A-level Mathematics (AQA) - Paper 1: Pure Mathematics' :
                   subjectId === 'computer-science' ? 'Computer Science Paper 1' :
                   subjectId === 'psychology' ? 'Studies and Applications in Psychology 1 (Component 01)' :
                   subjectId === 'psychology-aqa-alevel' ? 'AQA Psychology A-Level Paper 1' :
                   `${subject.name} Predicted Exam`}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
                disabled={currentQuestion >= examQuestions.length - 1}
                className="h-9 w-9 flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>

            {/* Center: Modern Progress indicator */}
            <div className="flex justify-center md:justify-end mt-2 md:mt-0">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {examQuestions.map((question, index) => {
                  // Find the answer for this question
                  const hasAnswer = answers.find(a => a.questionId === question.id);
                  
                  // Determine color based on status
                  let circleColor = 'bg-gray-200 border-gray-300'; // Not attempted yet
                  
                  if (hasAnswer) {
                    circleColor = 'bg-emerald-500 border-emerald-600 shadow-sm shadow-emerald-500/50'; // Answered
                  }
                  
                  // Show logo only on current question if not answered yet
                  const showLogo = index === currentQuestion && !hasAnswer;
                  
                  return (
                    <div key={index} className="relative flex items-center">
                      {/* Connecting line */}
                      {index > 0 && (
                        <div className={`absolute right-full w-2 h-0.5 ${
                          answers.find(a => a.questionId === examQuestions[index - 1].id)
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                        }`} />
                      )}
                      
                      {/* Question circle */}
                      <div className="relative">
                        <div 
                          className={`w-7 h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center cursor-pointer ${circleColor} ${
                            showLogo ? 'ring-2 ring-orange-300 ring-offset-2' : ''
                          }`}
                          onClick={() => setCurrentQuestion(index)}
                        >
                          {/* Show checkmark for answered questions */}
                          {hasAnswer && (
                            <span className="text-white text-sm font-bold">✓</span>
                          )}
                          
                          {/* Mentiora logo on current unanswered question */}
                          {showLogo && (
                            <img src={mentioraLogo} alt="Current question" className="w-5 h-5 object-contain" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Timer and progress row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-5 border-t border-gray-200">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${isTimeUp ? 'bg-destructive/10 dark:bg-destructive/5 border-destructive/50 dark:border-destructive/30' : 'bg-card border-border'}`}>
              <Clock className={`h-4 w-4 ${isTimeUp ? 'text-destructive' : 'text-muted-foreground'}`} />
              <span className={`font-mono font-bold ${isTimeUp ? 'text-destructive' : 'text-foreground'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white rounded-full px-8 py-5 font-semibold text-base shadow-[0_6px_24px_rgba(59,175,218,0.25)] hover:shadow-[0_8px_32px_rgba(59,175,218,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Target className="h-4 w-4 mr-2" />
              Submit for Marking
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-8">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                {/* Question reference numbers */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-1">
                    <span className="inline-block border-2 border-slate-900 px-3 py-1 text-base font-mono font-semibold">0</span>
                    <span className="inline-block border-2 border-slate-900 px-3 py-1 text-base font-mono font-semibold">{currentQuestion + 1}</span>
                  </div>
                  {examQuestions[currentQuestion].section && (
                    <Badge variant="outline" className="ml-2">
                      Section {examQuestions[currentQuestion].section}
                    </Badge>
                  )}
                  {getTierLabel(examQuestions[currentQuestion]) && (
                    <Badge variant={getTierLabel(examQuestions[currentQuestion]).includes('Higher') ? "destructive" : "secondary"} className="text-xs ml-2">
                      {getTierLabel(examQuestions[currentQuestion])}
                    </Badge>
                  )}
                  {getHistoryTopicInfo(examQuestions[currentQuestion].id) && (
                    <Badge className={`${getHistoryTopicInfo(examQuestions[currentQuestion].id)?.color} text-xs font-medium ml-2`}>
                      {getHistoryTopicInfo(examQuestions[currentQuestion].id)?.name}
                    </Badge>
                  )}
                </div>
                
                {/* Question text */}
                <p className="text-base text-slate-900 leading-relaxed mb-2 whitespace-pre-wrap">
                  {examQuestions[currentQuestion].text}
                </p>
              </div>
              
              {/* Marks pill */}
              <div className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                [{examQuestions[currentQuestion].marks} {examQuestions[currentQuestion].marks === 1 ? 'mark' : 'marks'}]
              </div>
            </div>
          </div>

          {/* Answer area - large white space */}
          <div className="min-h-[400px] mb-6">
            <Textarea
              value={getAnswer(examQuestions[currentQuestion].id)}
              onChange={(e) => handleAnswerChange(examQuestions[currentQuestion].id, e.target.value)}
              placeholder=""
              className="w-full h-full min-h-[400px] border border-gray-300 focus:ring-0 text-base resize-none p-4 bg-transparent rounded-md"
            />
          </div>

          {/* Bottom action area */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {examQuestions.length} • {answers.length} answered
            </div>
            
            {currentQuestion === examQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white rounded-full px-10 py-6 font-semibold text-base shadow-[0_6px_24px_rgba(59,175,218,0.25)] hover:shadow-[0_8px_32px_rgba(59,175,218,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-['Inter']"
              >
                <Target className="h-4 w-4 mr-2" />
                Submit for Marking
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
                className="bg-[#3BAFDA] hover:bg-[#2E9DBF] text-white rounded-full px-10 py-6 font-semibold text-base shadow-[0_6px_24px_rgba(59,175,218,0.25)] hover:shadow-[0_8px_32px_rgba(59,175,218,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </main>
      
      {/* Personalized Notification */}
      {notification.isVisible && (
        <PersonalizedNotification
          type={notification.type!}
          questionNumber={notification.questionNumber}
          topicName={notification.topicName}
          subjectName={notification.subjectName}
          streakCount={notification.streakCount}
          onClose={clearNotification}
          onAction={() => {
            if (notification.type === "wrong-answer") {
              navigate(`/subject-topics/${subjectId}`);
            }
            clearNotification();
          }}
        />
      )}
    </div>
  );
};

export default PredictedExam;