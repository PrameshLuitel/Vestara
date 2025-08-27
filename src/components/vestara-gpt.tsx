
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const examplePrompts = [
    { title: "Query Financial Regulations", prompt: "Explain the liquidity requirements for commercial banks in Nepal." },
    { title: "Analyze Market Indices", prompt: "What is the sentiment-adjusted forecast for the NEPSE index?" },
    { title: "Define a Compliance Term", prompt: "What constitutes 'insider trading' under Nepalese securities law?" },
    { title: "Compare Sector Performance", prompt: "Compare the 10-day volatility forecast for the Banking vs. Hydropower sub-indices." }
]

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function VestaraGpt() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (prompt?: string) => {
    const textToSend = prompt || input;
    if (textToSend.trim() === '') return;
  
    const userMessage: Message = { id: generateUniqueId(), text: textToSend, sender: 'user' };
    
    setMessages(prev => {
        const currentMessages = prev.length > 0 ? prev : [{ id: generateUniqueId(), text: "I am Vestara, your regulatory and market intelligence co-pilot. Built on a custom knowledge base with enhanced RAG, I provide precise, context-aware answers for Nepal's financial markets. How can I assist?", sender: 'bot' }];
        return [...currentMessages, userMessage];
    });
  
    setTimeout(() => {
        const botResponse: Message = { id: generateUniqueId(), text: `This interface is a demonstration. Your query received: "${textToSend}"`, sender: 'bot' };
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
            <p className="text-muted-foreground mb-8">AI co-pilot for Nepal's financial ecosystem, grounded by a custom RAG process for accuracy.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {examplePrompts.map(ex => (
                    <Card key={ex.title} className="hover:bg-accent transition-colors cursor-pointer text-left" onClick={() => handleSend(ex.prompt)}>
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
            placeholder="Query Nepal's financial regulations and markets..."
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
