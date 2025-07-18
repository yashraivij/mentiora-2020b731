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
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const subject = curriculum.find(s => s.id === subjectId);
  
  if (!subject) {
    navigate('/predicted-questions');
    return null;
  }

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
    
    // Standard exam format for other subjects
    let questionNumber = 1;
    subject.topics.forEach((topic, topicIndex) => {
      // Take 2-3 questions from each topic for a full paper
      const topicQuestions = topic.questions.slice(0, 3);
      
      topicQuestions.forEach((q, qIndex) => {
        questions.push({
          id: `${topicIndex}-${qIndex}`,
          questionNumber: questionNumber++,
          text: q.question,
          marks: q.marks || 2,
          section: topicIndex < Math.ceil(subject.topics.length / 2) ? 'A' : 'B'
        });
      });
    });
    
    return questions.slice(0, 20); // Limit to 20 questions for exam length
  };

  const [examQuestions] = useState<ExamQuestion[]>(generateExamQuestions());

  const getExamDuration = () => {
    const durations = {
      chemistry: 105, // 1h 45min
      biology: 105,
      physics: 105,
      mathematics: 90, // 1h 30min
      "english-language": 105,
      "english-literature": 105,
      history: 75, // 1h 15min
      geography: 90,
      "computer-science": 90,
      psychology: 105
    };
    return durations[subjectId as keyof typeof durations] || 90;
  };

  const getTotalMarks = () => {
    if (subjectId === 'english-literature') {
      return 60; // Two questions at 30 marks each
    }
    if (subjectId === 'history') {
      return 56; // History Paper 1 out of 56 marks
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

  const handleSubmit = () => {
    // For English Literature and History, allow submission at any time
    if (subjectId === 'english-literature' || subjectId === 'history') {
      // No validation required - allow submission even with no answers
    } else {
      // For other subjects, require all questions to be answered
      if (answers.length < examQuestions.length) {
        toast({
          title: "Incomplete Exam",
          description: "Please answer all questions before submitting.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsSubmitted(true);
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
                  <CardTitle className="text-2xl font-bold">{subjectId === 'history' ? 'History Paper 1' : `${subject.name} Predicted Exam`}</CardTitle>
                  <CardDescription>AQA GCSE • {getExamDuration()} minutes</CardDescription>
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
                <h1 className="text-lg font-bold text-foreground">{subjectId === 'history' ? 'History Paper 1' : `${subject.name} Predicted Exam`}</h1>
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
              {(subjectId === 'english-literature' || subjectId === 'history') && (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary to-primary/90"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Submit for Marking
                </Button>
              )}
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
                    <CardTitle className="text-xl">
                      Question {examQuestions[currentQuestion].questionNumber}
                    </CardTitle>
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
                  
                  {currentQuestion === examQuestions.length - 1 && subjectId !== 'english-literature' && subjectId !== 'history' ? (
                    <Button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-primary to-primary/90"
                      disabled={answers.length < examQuestions.length}
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
    </div>
  );
};

export default PredictedExam;