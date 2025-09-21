import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, Send, Bot, User } from "lucide-react";
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
    <Card className="fixed right-6 top-6 bottom-6 w-[420px] z-50 bg-background/98 backdrop-blur-xl border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                AI Study Assistant
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Step-by-step guidance</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-8 w-8 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100vh-12rem)] p-0">
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/30">
          <div className="flex items-center gap-3 text-sm text-foreground/80">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            Let's work through this question together step by step!
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-6 py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/80' 
                      : 'bg-gradient-to-br from-secondary to-accent'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md'
                        : 'bg-gradient-to-br from-muted/50 to-muted/30 text-foreground border border-border/50 rounded-bl-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-sm">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                      <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border/50 bg-gradient-to-r from-muted/20 to-muted/10 space-y-3">
          {stage !== 'final' && hintCount >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={showModelAnswer}
              disabled={isLoading}
              className="w-full h-9 text-sm border-primary/30 bg-gradient-to-r from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20 text-foreground hover:text-foreground transition-all duration-300 rounded-xl font-medium"
            >
              <Bot className="h-4 w-4 mr-2" />
              Show me the answer
            </Button>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help or share your thoughts..."
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm text-sm font-medium placeholder:text-muted-foreground/70 focus:border-primary/50 transition-colors"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};