
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const examplePrompts = [
    { title: "Predict Apple's stock", prompt: "What is the prediction for AAPL?" },
    { title: "Analyze market trends", prompt: "Show me trending tech stocks." },
    { title: "Explain a financial term", prompt: "What is a 'moving average'?" },
    { title: "Compare two stocks", prompt: "Compare the performance of GOOGL and TSLA over the last quarter." }
]

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleInitialMessage = () => {
      setMessages([
          { id: generateUniqueId(), text: "Hello! I'm Vestara, your market muse. How can I help you with stock predictions today?", sender: 'bot' }
      ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (prompt?: string) => {
    const textToSend = prompt || input;
    if (textToSend.trim() === '') return;

    const userMessage: Message = { id: generateUniqueId(), text: textToSend, sender: 'user' };

    setMessages(prev => {
        const currentMessages = prev.length > 0 ? prev : [{ id: generateUniqueId(), text: "Hello! I'm Vestara, your market muse. How can I help you with stock predictions today?", sender: 'bot' }];
        return [...currentMessages, userMessage];
    });

    setTimeout(() => {
      const botResponse: Message = { id: generateUniqueId(), text: `I am currently in a read-only mode. I received your message: "${textToSend}"`, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto pr-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl font-bold font-headline mb-2">Vestara Gpt</h1>
            <p className="text-muted-foreground mb-8">Your AI-powered market analysis partner.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {examplePrompts.map(ex => (
                    <Card key={ex.title} className="hover:bg-accent transition-colors cursor-pointer" onClick={() => handleSend(ex.prompt)}>
                        <CardHeader>
                            <CardTitle className="text-base">{ex.title}</CardTitle>
                            <CardDescription className="text-sm">{ex.prompt}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn('rounded-lg px-4 py-3 max-w-[80%]', message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
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
            className="w-full h-12 pr-12 rounded-full"
            type="text"
            placeholder="Ask Vestara about the market..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
