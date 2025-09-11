import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, Crown, Target } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
      'conflict-tension-ww1': { name: 'WWI 1894-1918', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      'conflict-tension-interwar': { name: 'Inter-war 1918-1939', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      'conflict-tension-east-west': { name: 'East-West 1945-1972', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
      'conflict-tension-asia': { name: 'Asia 1950-1975', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
      'conflict-tension-gulf': { name: 'Gulf 1990-2009', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' }
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
    
    // Special format for History
    if (subjectId === 'history') {
      // Section A: Period Studies (choose one)
      const periodStudies = subject.topics.filter(topic => 
        ['america-1840-1895', 'germany-1890-1945', 'russia-1894-1945', 'america-1920-1973'].includes(topic.id)
      );
      
      // Section B: Wider World Depth Studies (choose one)
      const depthStudies = subject.topics.filter(topic => 
        ['conflict-tension-ww1', 'conflict-tension-interwar', 'conflict-tension-east-west', 'conflict-tension-asia', 'conflict-tension-gulf'].includes(topic.id)
      );
      
      // Generate Section A questions
      periodStudies.forEach((topic) => {
        // Source Utility question (8 marks)
        questions.push({
          id: `period-utility-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistorySourceQuestion(topic.id, 'utility'),
          marks: 8,
          section: 'A'
        });
        
        // Narrative Account question (8 marks)
        questions.push({
          id: `period-narrative-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistoryNarrativeQuestion(topic.id),
          marks: 8,
          section: 'A'
        });
        
        // Importance/Consequence question (8 marks)
        questions.push({
          id: `period-importance-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistoryImportanceQuestion(topic.id),
          marks: 8,
          section: 'A'
        });
      });
      
      // Generate Section B questions
      depthStudies.forEach((topic) => {
        // Source Analysis question (8 marks)
        questions.push({
          id: `depth-analysis-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistorySourceAnalysisQuestion(topic.id),
          marks: 8,
          section: 'B'
        });
        
        // Follow-up Inquiry question (4 marks)
        questions.push({
          id: `depth-followup-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistoryFollowupQuestion(topic.id),
          marks: 4,
          section: 'B'
        });
        
        // Write an Account question (8 marks)
        questions.push({
          id: `depth-account-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistoryAccountQuestion(topic.id),
          marks: 8,
          section: 'B'
        });
        
        // Extended Essay question (12 marks)
        questions.push({
          id: `depth-essay-${topic.id}`,
          questionNumber: questions.length + 1,
          text: getHistoryEssayQuestion(topic.id),
          marks: 12,
          section: 'B'
        });
      });
      
      return questions;
    }
    
    // Special format for English Language - AQA GCSE Paper 1
    if (subjectId === 'english-language') {
      const sourceText = `The library was a cathedral of knowledge, its vaulted ceilings disappearing into shadows above towering shelves that stretched impossibly high. Dust motes danced in golden shafts of sunlight streaming through tall, arched windows, each beam illuminating thousands of leather-bound volumes that had witnessed centuries pass. The silence was profound yet somehow alive, broken only by the whispered turning of pages and the soft footfalls of scholars moving reverently between the stacks. Ancient wooden tables, scarred by generations of students, stood like altars where minds came to worship at the shrine of learning. In this sacred space, time seemed suspended, and the weight of accumulated human wisdom pressed gently down upon all who entered, reminding them of their small place in the vast continuum of knowledge.`;
      
      // Section A: Reading - exactly 45 minutes advised
      // Question 1: List 4 things (4 marks)
      questions.push({
        id: 'english-lang-q1',
        questionNumber: 1,
        text: `Read again the first part of the source, from lines 1 to 3.

Source: Extract from "The Scholar's Journey" by Modern Author (2020)

"${sourceText}"

List four things about the library from this part of the source.

[4 marks]`,
        marks: 4,
        section: 'A'
      });

      // Question 2: Language analysis (8 marks)
      questions.push({
        id: 'english-lang-q2',
        questionNumber: 2,
        text: `Look in detail at this extract, from lines 5 to 9 of the source:

"The silence was profound yet somehow alive, broken only by the whispered turning of pages and the soft footfalls of scholars moving reverently between the stacks. Ancient wooden tables, scarred by generations of students, stood like altars where minds came to worship at the shrine of learning."

How does the writer use language here to describe the atmosphere of the library?

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

This text is from a novel describing a character's first visit to an ancient library.

How has the writer structured the text to interest you as a reader?

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
        text: `Focus this part of your answer on the second part of the source, from line 4 to the end.

A student said, "The writer makes it clear that the library is a place of deep reverence and learning. The description shows us why people feel overwhelmed and inspired when they enter."

To what extent do you agree?

In your response, you could:
• consider your own impressions of the library
• evaluate how the writer creates a sense of awe and reverence
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

A magazine has asked for contributions for their creative writing section.

Either:
Write a description of a library as suggested by this source.

Or:
Write a story about discovering a hidden object.

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
          { pattern: 'Solve the equation [mathematical expression]', marks: 3 },
          { pattern: 'Find the [mathematical value] of the shape shown', marks: 4 },
          { pattern: 'Prove that [mathematical statement] using algebraic methods', marks: 5 },
          { pattern: 'A company has data showing [scenario]. Calculate [requirement]', marks: 6 },
          { pattern: 'Given that [conditions], find the probability that [event]', marks: 4 }
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
          `Compare the structure and function of arteries, veins and capillaries. Include diagrams in your answer.`,
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
          `Solve the equation 3x + 7 = 22. Show your working clearly.`,
          `A shop reduces all prices by 15%. A jacket originally costs £80. Calculate the new price.`,
          `The mean of 5 numbers is 12. Four of the numbers are 8, 10, 14, and 15. Find the fifth number.`,
          `Calculate the area of a circle with radius 6 cm. Give your answer to 1 decimal place. [Use π = 3.14]`,
          `A bag contains 3 red balls, 4 blue balls and 5 green balls. Calculate the probability of randomly selecting a blue ball.`,
          `Factorise completely: 6x² + 9x. Show your working.`,
          `The nth term of a sequence is 4n - 1. Find the first four terms of this sequence.`,
          `A rectangle has length (x + 3) cm and width (x - 2) cm. Write an expression for the area in its simplest form.`,
          `Convert 0.75 to a fraction in its simplest form. Show your method.`,
          `Using trigonometry, calculate the height of a building if the angle of elevation from 50m away is 30°. Show your working.`,
          `Solve the simultaneous equations: 2x + y = 7 and x - y = 2. Show your method clearly.`,
          `A cylinder has radius 4cm and height 10cm. Calculate its volume. Give your answer to the nearest cm³.`,
          `Expand and simplify: (x + 3)(x - 5). Show each step of your working.`,
          `A train travels 180km in 2 hours 30 minutes. Calculate the average speed in km/h.`,
          `Plot the graph of y = 2x - 3. State the gradient and y-intercept.`,
          `Calculate the surface area of a cuboid with dimensions 6cm × 4cm × 3cm. Show your working.`,
          `A sequence has first term 3 and common difference 4. Find the 10th term.`,
          `Rearrange the formula v = u + at to make t the subject. Show your working.`,
          `Two fair dice are thrown. Calculate the probability of getting a total of 7.`,
          `Use the quadratic formula to solve x² - 5x + 6 = 0. Show your working clearly.`
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
      } else if (subjectId === 'geography' || subjectId === 'geography-paper-2') {
        questionPool = [
          `Give one way in which a major city in a LIC/NEE is internationally important. [1 mark]`,
          `Explain how urban industrial areas can help encourage development. Use your own understanding. [6 marks]`,
          `To what extent has urban change created opportunities in a UK city you have studied? [9 marks + SPaG]`,
          `Using a case study of a LIC/NEE country, explain how manufacturing industry can encourage economic development. [6 marks]`,
          `Outline one way the political or trading relationship of a named LIC/NEE country with the wider world has changed. [2 marks]`,
          `Explain how the growth of tourism in a LIC/NEE country can reduce the development gap. [4 marks]`,
          `State two characteristics of a sustainable city. [2 marks]`,
          `Using a named example of a LIC/NEE country, explain how international aid has encouraged development. [6 marks]`,
          `Evaluate the success of an urban regeneration project in improving quality of life. [9 marks + SPaG]`,
          `Outline one environmental challenge caused by urban growth in cities in LIC/NEE countries. [2 marks]`,
          `Explain how fair trade can help to reduce inequalities in global trade. [4 marks]`,
          `Using a case study of a UK city, assess the effectiveness of transport strategies in reducing traffic congestion. [6 marks]`,
          `Suggest why some countries have a low level of economic development. [4 marks]`,
          `Give one reason why urban areas in LIC/NEE countries are growing rapidly. [1 mark]`,
          `Using examples, explain how TNCs can have both positive and negative impacts on their host countries. [6 marks]`,
          `Assess the sustainability of different strategies used to increase energy supply. [6 marks]`,
          `Explain how microfinance loans can help to reduce poverty in rural areas of LIC countries. [4 marks]`,
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
        
        // Extract marks from question text
        const marksMatch = questionText.match(/\[(\d+)\s*marks?\]/i);
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

    // Use the new predicted question generator
    const predictedQuestions = generatePredictedExamQuestions(subjectId, subject.topics);
    questions.push(...predictedQuestions);
    
    return questions;
  };

  const [examQuestions] = useState<ExamQuestion[]>(generateExamQuestions());

  const getExamDuration = () => {
    const durations = {
      chemistry: 135, // 2h 15min
      biology: 135, // 2h 15min  
      physics: 135, // 2h 15min
      mathematics: 120, // 2h
      "english-language": 135, // 2h 15min
      "english-literature": 150, // 2h 30min
      history: 135, // 2h 15min
      "religious-studies": 120, // 2h
      business: 105, // 1h 45min
      french: 120, // 2h
      spanish: 120, // 2h
      german: 120, // 2h
      geography: 120, // 2h
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
    if (subjectId === 'history') {
      return 56; // History Paper 1 out of 56 marks
    }
    if (subjectId === 'religious-studies') {
      return 96; // 96 marks total
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

  const markAnswerWithAI = async (question: ExamQuestion, answer: string) => {
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
      console.error('Error calling AI marking function:', error);
      
      // Fallback to basic marking
      return {
        marksAwarded: answer.trim() ? Math.round(question.marks * 0.5) : 0,
        feedback: "AI marking temporarily unavailable. Answer has been given partial credit.",
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
                // Mark the answer with AI
                const markingResult = await markAnswerWithAI(question, answer.answer);
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
              <Button variant="ghost" onClick={() => navigate('/predicted-questions')} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-16 max-w-2xl">
          <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Crown className="h-8 w-8 text-amber-500" />
                <div>
                  <CardTitle className="text-2xl font-bold">{subjectId === 'history' ? 'History Paper 1' : subjectId === 'religious-studies' ? 'Religious Studies Component 1' : `${subject.name} Predicted Exam`}</CardTitle>
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
                <h1 className="text-lg font-bold text-foreground">{subjectId === 'history' ? 'History Paper 1' : subjectId === 'religious-studies' ? 'Religious Studies Component 1' : `${subject.name} Predicted Exam`}</h1>
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
              <ThemeToggle />
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