"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm Vestara, your market muse. How can I help you with stock predictions today?", sender: 'bot' },
    { id: 2, text: "For example, you can ask 'What is the prediction for AAPL?' or 'Show me trending tech stocks.'", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = { id: Date.now() + 1, text: `I am currently in a read-only mode. I received your message: "${input}"`, sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <h2 className="text-xl font-semibold font-headline">Chat with Vestara</h2>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn('flex items-start gap-3', message.sender === 'user' ? 'justify-end' : '')}>
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://picsum.photos/40/40" alt="Vestara" data-ai-hint="female robot" />
                      <AvatarFallback>V</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('rounded-lg px-4 py-2 max-w-[75%]', message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                       <AvatarImage src="https://picsum.photos/40/40" alt="User" data-ai-hint="person silhouette" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask about stock predictions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit">
              Send <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
