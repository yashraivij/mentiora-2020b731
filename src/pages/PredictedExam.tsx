import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Crown, Target } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { NotebookGenerator } from "@/components/notebook/NotebookGenerator";
import { supabase } from "@/integrations/supabase/client";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";

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
  
  const subject = curriculum.find(s => s.id === subjectId);
  
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
    if (subjectId === 'maths-edexcel' || subjectId === 'business-edexcel-igcse' || subjectId === 'chemistry-edexcel' || subjectId === 'physics-edexcel') {
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

    // AQA Biology Paper 1 format
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
    if (subjectId !== 'physics' && subjectId !== 'geography' && subjectId !== 'english-literature' && subjectId !== 'history' && subjectId !== 'english-language' && subjectId !== 'religious-studies') {
      const predictedQuestions = generatePredictedExamQuestions(subjectId, subject.topics);
      questions.push(...predictedQuestions);
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
      "religious-studies": 120, // 2h
      business: 105, // 1h 45min
      french: 120, // 2h
      spanish: 120, // 2h
      german: 120, // 2h
      geography: 90, // 1h 30min
      "computer-science": 120, // 2h
      psychology: 135 // 2h 15min
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
    if (subjectId === 'maths') {
      return 80; // AQA Maths Paper 1: 80 marks
    }
    if (subjectId === 'physics') {
      return 100; // 8 MC (8) + 20 SS (47) + 6 LS (33) + 2 Ext (12) = 100 marks
    }
    if (subjectId === 'geography') {
      return 88; // Section A (30) + Section B (29) + Section C (29 including 3 SPaG) = 88 marks
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
      console.error('Error calling Smart Marking function:', error);
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "Smart Marking temporarily unavailable. Answer has been given partial credit.",
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
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
                  <CardTitle className="text-2xl font-bold">{subjectId === 'history' ? 'History Paper 1' : subjectId === 'religious-studies' ? 'Religious Studies Component 1' : subjectId === 'maths' ? 'AQA Maths Paper 1 (Non-Calculator)' : `${subject.name} Predicted Exam`}</CardTitle>
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
                ) : subjectId === 'religious-studies' ? (
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Choose TWO religions</strong> from Buddhism, Christianity, Catholic Christianity, Hinduism, Islam, Judaism, or Sikhism</li>
                    <li>• Answer all questions for your chosen religions only</li>
                    <li>• Each religion has two 5-part question sets (1+2+4+5+12 marks each)</li>
                    <li>• Total: 96 marks + 6 marks for spelling, punctuation and grammar</li>
                    <li>• You have {getExamDuration()} minutes to complete this paper</li>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Fixed Header with Timer */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Crown className="h-6 w-6 text-amber-500" />
              <div>
                 <h1 className="text-lg font-bold text-foreground">
                   {subjectId === 'history' ? 'History Paper 1' : 
                    subjectId === 'religious-studies' ? 'Religious Studies Component 1' : 
                    subjectId === 'geography' ? `Geography ${geographyPaperType}` : 
                    subjectId === 'geography-paper-2' ? 'Geography Paper 2' :
                    subjectId === 'maths' ? 'AQA Maths Paper 1 (Non-Calculator)' :
                    `${subject.name} Predicted Exam`}
                 </h1>
                <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {examQuestions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${isTimeUp ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-card border-border'}`}>
                <Clock className={`h-4 w-4 ${isTimeUp ? 'text-red-600' : 'text-muted-foreground'}`} />
                <span className={`font-mono font-bold ${isTimeUp ? 'text-red-600' : 'text-foreground'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-primary/90"
              >
                <Target className="h-4 w-4 mr-2" />
                Submit for Marking
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{answers.length}/{examQuestions.length} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                  {examQuestions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={currentQuestion === index ? "default" : answers.find(a => a.questionId === q.id) ? "outline" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs ${
                        answers.find(a => a.questionId === q.id) ? 'border-green-300 bg-green-50 dark:bg-green-950/20' : ''
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {answers.find(a => a.questionId === q.id) && (
                        <CheckCircle className="h-3 w-3 text-green-600 absolute top-0 right-0 transform translate-x-1 -translate-y-1" />
                      )}
                      {q.questionNumber}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl">
                        Question {examQuestions[currentQuestion].questionNumber}
                      </CardTitle>
                      <Badge variant={getTierLabel(examQuestions[currentQuestion]).includes('Higher') ? "destructive" : "secondary"} className="text-xs">
                        {getTierLabel(examQuestions[currentQuestion])}
                      </Badge>
                    </div>
                    {examQuestions[currentQuestion].section && (
                      <Badge variant="outline" className="mt-2">
                        Section {examQuestions[currentQuestion].section}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getHistoryTopicInfo(examQuestions[currentQuestion].id) && (
                      <Badge className={`${getHistoryTopicInfo(examQuestions[currentQuestion].id)?.color} text-xs font-medium`}>
                        {getHistoryTopicInfo(examQuestions[currentQuestion].id)?.name}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {examQuestions[currentQuestion].marks} {examQuestions[currentQuestion].marks === 1 ? 'mark' : 'marks'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {examQuestions[currentQuestion].text}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Answer:</label>
                  <Textarea
                    value={getAnswer(examQuestions[currentQuestion].id)}
                    onChange={(e) => handleAnswerChange(examQuestions[currentQuestion].id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Aim for detailed explanations to maximize marks
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion === examQuestions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-primary to-primary/90"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Submit for Marking
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
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