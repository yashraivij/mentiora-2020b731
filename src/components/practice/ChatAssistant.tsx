import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, MessageCircle, Send, Bot, User, Mic, StopCircle, Volume2, Sparkles, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "@/data/curriculum";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  question: Question;
  subject: string;
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  isAnswerIncorrect?: boolean;
}

export const ChatAssistant = ({ question, subject, isOpen, onClose, initialMessage, isAnswerIncorrect = false }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'intro' | 'guiding' | 'struggling' | 'answer_check' | 'final'>('intro');
  const [hintCount, setHintCount] = useState(0);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Teach Mentiora Mode states
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackAudio, setFeedbackAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);
  const [showTeachMode, setShowTeachMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
    
    // Reset states when chat is closed
    if (!isOpen) {
      setHasProcessedInitialMessage(false);
      setShowTeachMode(false);
      setTranscription("");
      setFeedbackText("");
      if (feedbackAudio) {
        feedbackAudio.pause();
        setFeedbackAudio(null);
      }
    }
  }, [isOpen]);
  
  // Show Teach Mode if answer is incorrect
  useEffect(() => {
    if (isAnswerIncorrect && isOpen) {
      setShowTeachMode(true);
    }
  }, [isAnswerIncorrect, isOpen]);

  // Send initial message if provided
  useEffect(() => {
    if (isOpen && initialMessage && !hasProcessedInitialMessage && messages.length > 0) {
      setHasProcessedInitialMessage(true);
      sendMessage(initialMessage);
    }
  }, [isOpen, initialMessage, hasProcessedInitialMessage, messages.length]);

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          question: question.question,
          subject,
          conversation: [],
          stage: 'intro'
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages([assistantMessage]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error("Failed to start assistant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Determine conversation stage based on progress
      let currentStage = stage;
      if (hintCount >= 3 && stage !== 'final') {
        currentStage = 'struggling';
      } else if (stage === 'intro') {
        currentStage = 'guiding';
      }

      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          question: question.question,
          studentAnswer: message,
          subject,
          conversation,
          stage: currentStage
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStage(currentStage);
      setHintCount(prev => prev + 1);

      // If we've given several hints, progress towards showing the answer
      if (hintCount >= 4 && currentStage !== 'final') {
        setStage('final');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showModelAnswer = async () => {
    setIsLoading(true);
    try {
      const conversation = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          question: question.question,
          subject,
          conversation,
          stage: 'final'
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Here's the model answer and why it gets full marks:\n\n**Model Answer:** ${question.modelAnswer}\n\n**Why this gets marks:** ${question.markingCriteria.breakdown.join(' ')}\n\n${data.response}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStage('final');
    } catch (error) {
      console.error('Error showing model answer:', error);
      toast.error("Failed to show model answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Teach Mentiora Mode functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started! Speak clearly...");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-speech', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        setTranscription(data.text);
        toast.success("Transcription complete!");
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const submitExplanation = async () => {
    if (!transcription.trim()) {
      toast.error("Please record your explanation first");
      return;
    }

    setIsFeedbackLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('teach-mentiora-feedback', {
        body: {
          transcription,
          question: question.question,
          modelAnswer: question.modelAnswer,
          subject
        }
      });

      if (error) throw error;

      setFeedbackText(data.feedbackText);
      
      // Create audio element and play feedback
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsPlayingFeedback(false);
      audio.onerror = () => {
        toast.error("Failed to play audio feedback");
        setIsPlayingFeedback(false);
      };
      
      setFeedbackAudio(audio);
      setIsPlayingFeedback(true);
      audio.play();
      
      toast.success("Feedback ready!");
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const retryExplanation = () => {
    setTranscription("");
    setFeedbackText("");
    if (feedbackAudio) {
      feedbackAudio.pause();
      setFeedbackAudio(null);
    }
    setIsPlayingFeedback(false);
  };

  const playFeedbackAgain = () => {
    if (feedbackAudio) {
      feedbackAudio.currentTime = 0;
      feedbackAudio.play();
      setIsPlayingFeedback(true);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-96 z-50 shadow-2xl border-2 border-border bg-card/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border" style={{ background: 'var(--gradient-primary)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-sm font-semibold text-white drop-shadow-sm">
            Study Helper
          </CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/20 text-white">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="text-xs mb-2 p-3 rounded-lg border border-border" style={{ background: 'var(--gradient-accent)' }}>
          <div className="flex items-center gap-2 font-medium text-white drop-shadow-sm">
            <Bot className="h-4 w-4 text-white" />
            Let's work through this question together step by step!
          </div>
        </div>
        
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 ${
                    message.role === 'user' 
                      ? 'text-white' 
                      : 'text-white'
                  }`} style={{ background: message.role === 'user' ? 'var(--gradient-primary)' : 'var(--gradient-accent)' }}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl text-sm whitespace-pre-wrap shadow-lg border border-white/20 ${
                      message.role === 'user'
                        ? 'text-white'
                        : 'text-card-foreground'
                    }`}
                    style={{ background: message.role === 'user' ? 'var(--gradient-primary)' : 'var(--gradient-secondary)' }}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 text-white" style={{ background: 'var(--gradient-accent)' }}>
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="px-4 py-3 rounded-xl text-sm shadow-lg border border-white/20 text-card-foreground" style={{ background: 'var(--gradient-secondary)' }}>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'hsl(217 91% 60%)' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'hsl(217 91% 60%)', animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'hsl(217 91% 60%)', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Teach Mentiora Mode Section */}
        {showTeachMode && (
          <div className="border-t border-border pt-3 mt-3 space-y-3 p-4 rounded-lg" style={{ background: 'var(--gradient-accent)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
                <h3 className="text-sm font-semibold text-white">Teach Mentiora What You Understand</h3>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  BETA
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-white/90">
              Explain the topic back to me verbally. I'll analyze your understanding and give you targeted feedback!
            </p>

            {/* Recording Controls */}
            {!transcription && !feedbackText && (
              <div className="space-y-3">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={`w-full shadow-lg text-white transition-all duration-200 ${
                    isRecording ? 'animate-pulse' : ''
                  }`}
                  style={{ background: isRecording ? 'hsl(0 84% 60%)' : 'var(--gradient-primary)' }}
                >
                  {isRecording ? (
                    <>
                      <StopCircle className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : isTranscribing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                
                {isRecording && (
                  <div className="text-xs text-white text-center animate-pulse">
                    🎤 Recording... Speak clearly about the topic
                  </div>
                )}
              </div>
            )}

            {/* Transcription Display */}
            {transcription && !feedbackText && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <p className="text-xs font-medium text-white mb-2">Your Explanation:</p>
                  <p className="text-xs text-white/90">{transcription}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={submitExplanation}
                    disabled={isFeedbackLoading}
                    className="flex-1 shadow-lg text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {isFeedbackLoading ? (
                      <>Analyzing...</>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Get Feedback
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={retryExplanation}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Feedback Display */}
            {feedbackText && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20 max-h-48 overflow-y-auto">
                  <p className="text-xs font-medium text-white mb-2 flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Mentiora's Feedback:
                  </p>
                  <div className="text-xs text-white/90 whitespace-pre-wrap">{feedbackText}</div>
                </div>
                
                {isPlayingFeedback && (
                  <div className="text-xs text-white text-center flex items-center justify-center gap-2 animate-pulse">
                    <Volume2 className="h-4 w-4" />
                    Playing feedback...
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={playFeedbackAgain}
                    disabled={isPlayingFeedback}
                    variant="outline"
                    className="flex-1 text-white border-white/30 hover:bg-white/20"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Replay Feedback
                  </Button>
                  
                  <Button
                    onClick={retryExplanation}
                    className="flex-1 shadow-lg text-white"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-border pt-3 mt-3 space-y-3 p-3 rounded-lg" style={{ background: 'var(--gradient-background)' }}>
          {stage !== 'final' && hintCount >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={showModelAnswer}
              disabled={isLoading}
              className="w-full text-xs text-white border-white/30 hover:bg-white/20 transition-all duration-200"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Bot className="h-3 w-3 mr-1" />
              Show me the answer
            </Button>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer or ask for help..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="shadow-lg text-white hover:opacity-90"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};