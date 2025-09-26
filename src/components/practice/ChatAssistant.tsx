import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { X, GraduationCap, Send, Sparkles, User, BookOpen, Target } from "lucide-react";
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
}

export const ChatAssistant = ({ question, subject, isOpen, onClose }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'intro' | 'guiding' | 'struggling' | 'answer_check' | 'final'>('intro');
  const [hintCount, setHintCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <Card className="fixed right-4 top-4 bottom-4 w-[420px] z-50 shadow-2xl border border-border/50 bg-card/95 backdrop-blur-lg overflow-hidden">
      <CardHeader className="relative bg-gradient-to-br from-primary via-primary/90 to-accent p-6 border-b-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-white drop-shadow-sm">
                AI Study Assistant
              </CardTitle>
              <p className="text-xs text-white/80 font-medium">
                Interactive Learning Guide
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="hover:bg-white/15 text-white/90 hover:text-white transition-all duration-200 w-8 h-8 p-0 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100vh-10rem)] p-0">
        <div className="p-4 bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border-b border-border/30">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-sm">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground/90 mb-1">Learning Objective</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Master this concept through guided practice and personalized feedback
              </p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-6 py-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-md border ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/80 border-primary/20 text-white' 
                      : 'bg-gradient-to-br from-accent to-accent/80 border-accent/20 text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm border backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary/90 to-primary border-primary/20 text-white rounded-tr-md'
                        : 'bg-card/80 border-border/30 text-card-foreground rounded-tl-md'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/80 border border-accent/20 flex items-center justify-center shadow-md text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-md text-sm shadow-sm border border-border/30 bg-card/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-gradient-to-t from-card via-card/95 to-card/80 backdrop-blur-sm border-t border-border/30 space-y-3">
          {stage !== 'final' && hintCount >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={showModelAnswer}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 text-accent hover:bg-accent/15 hover:border-accent/40 transition-all duration-200 font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Model Answer
            </Button>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts or ask for guidance..."
                disabled={isLoading}
                className="pr-12 bg-card/50 backdrop-blur-sm border-border/40 focus:border-primary/40 focus:bg-card/80 transition-all duration-200 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white shadow-md hover:shadow-lg transition-all duration-200 px-4 rounded-xl border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};