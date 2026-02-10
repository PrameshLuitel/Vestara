
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, LoaderCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Logo from './logo';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const examplePrompts = [
    { title: "Query Compliance", prompt: "What are the SEBON regulations regarding IPO issuance for a private company?" },
    { title: "Analyze Market Operations", prompt: "Explain the workflow for rights share application in Nepal." },
    { title: "Check Forecast Data", prompt: "What is the 7-day forecast for UPPER according to the Predictive Suite?" },
    { title: "Define a Financial Term", prompt: "What constitutes 'insider trading' under Nepalese securities law?" }
]

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function VestaraGpt() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (prompt?: string) => {
    const textToSend = prompt || input;
    if (textToSend.trim() === '' || isLoading) return;
  
    const userMessage: Message = { id: generateUniqueId(), text: textToSend, sender: 'user' };
    
    setMessages(prev => {
        const currentMessages = prev.length > 0 ? prev : [];
        return [...currentMessages, userMessage];
    });
  
    setInput('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/vestara-gpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: textToSend }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'The API returned an error.');
        }

        const data = await response.json();
        const botResponseText = data.response;

        const botResponse: Message = { id: generateUniqueId(), text: botResponseText, sender: 'bot' };
        setMessages(prev => [...prev, botResponse]);
    } catch (error) {
        console.error("Error calling Vestara GPT:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get a response from the AI. Please try again.",
        });
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
        setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col h-[70vh] max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <Logo className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline mb-2">Vestara GPT</h1>
            <p className="text-muted-foreground mb-8">Your AI assistant for the Nepalese financial market.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {examplePrompts.map(ex => (
                    <button key={ex.title} className="text-left p-4 rounded-xl border border-white/10 bg-card/10 backdrop-blur-lg hover:bg-accent/20 hover:border-primary/50 transition-colors" onClick={() => handleSend(ex.prompt)}>
                        <p className="font-semibold text-sm">{ex.title}</p>
                        <p className="text-xs text-muted-foreground">{ex.prompt}</p>
                    </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((message) => (
              <div key={message.id} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50"><Sparkles className="w-5 h-5 text-primary"/></div>}
                <div className={cn(
                  'rounded-xl px-4 py-3 max-w-[85%] shadow-md border', 
                  message.sender === 'user' 
                    ? 'bg-primary/30 border-primary/50 backdrop-blur-md text-primary-foreground' 
                    : 'bg-secondary/30 border-white/10 backdrop-blur-md text-secondary-foreground'
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
             <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="mt-6">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <Input
            className="w-full h-12 pr-14 pl-5 rounded-full bg-black/20 border-white/10 focus:bg-black/30 text-base"
            type="text"
            placeholder="Ask about Nepalese regulations, market operations, or financial terms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full" disabled={isLoading || !input}>
            {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
