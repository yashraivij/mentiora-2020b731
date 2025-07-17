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
    if (subjectId === 'english-literature') {
      // For English Literature, check if one question from each section is answered
      const sectionAAnswered = answers.some(a => examQuestions.find(q => q.id === a.questionId)?.section === 'A');
      const sectionBAnswered = answers.some(a => examQuestions.find(q => q.id === a.questionId)?.section === 'B');
      
      if (!sectionAAnswered || !sectionBAnswered) {
        toast({
          title: "Incomplete Exam",
          description: "Please answer one question from Section A (Shakespeare) and one from Section B (19th Century Novel).",
          variant: "destructive"
        });
        return;
      }
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
                  <CardTitle className="text-2xl font-bold">{subject.name} Predicted Exam</CardTitle>
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
                <h1 className="text-lg font-bold text-foreground">{subject.name} Predicted Exam</h1>
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
              {subjectId === 'english-literature' && (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-primary to-primary/90"
                  disabled={
                    !(answers.some(a => examQuestions.find(q => q.id === a.questionId)?.section === 'A') && 
                      answers.some(a => examQuestions.find(q => q.id === a.questionId)?.section === 'B'))
                  }
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
                  <Badge variant="secondary">
                    {examQuestions[currentQuestion].marks} {examQuestions[currentQuestion].marks === 1 ? 'mark' : 'marks'}
                  </Badge>
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
                  
                  {currentQuestion === examQuestions.length - 1 && subjectId !== 'english-literature' ? (
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