
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Bot, BrainCircuit, TrendingUp, BarChart2, BookOpen, User } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => {
  return (
      <div className={cn("rounded-xl border border-border bg-card/50 text-card-foreground shadow-lg transition-all duration-300 hover:border-primary/70 hover:shadow-primary/20 hover:-translate-y-1.5 relative overflow-hidden p-6 flex flex-col h-full backdrop-blur-sm", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                {icon}
            </div>
            <h3 className="text-lg font-bold font-headline text-foreground">{title}</h3>
        </div>
        <p className="relative z-10 text-sm text-muted-foreground flex-grow">{description}</p>
        <div className="absolute -bottom-12 -right-12 text-primary/5 opacity-50">
            {React.cloneElement(icon as React.ReactElement, { className: "w-36 h-36" })}
        </div>
      </div>
  );
};

const BentoMetric = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => {
    return (
        <div
            className="transition-transform duration-300 ease-out bg-card/50 border border-border/80 hover:border-primary/70 p-4 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm hover:-translate-y-1.5"
        >
            {icon}
            <p className="text-3xl font-bold font-headline mt-2 text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
    );
};


export default function Homepage() {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 tracking-tighter text-foreground">
            Vestara<sup className="text-3xl md:text-5xl font-semibold -top-8 text-primary">AI</sup>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Project Vestara is a state-of-the-art research portal designed to redefine how financial professionals access, interpret, and act on critical regulatory and market data in Nepal.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center text-foreground">Core Components</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Bot className="h-8 w-8 text-primary" />} 
                title="Vestara GPT" 
                description="Our custom-built RAG model, trained on SEBON/NEPSE regulations and investment banking workflows, delivers precise, context-aware answers to any compliance, operational, or market-related query."
                className="lg:col-span-2"
            />
             <FeatureCard 
                icon={<BrainCircuit className="h-8 w-8 text-primary" />} 
                title="Predictive Suite" 
                description="A cutting-edge, multi-model AI prediction engine covering all NEPSE-listed stocks. It leverages a diverse portfolio of ML/DL architectures for data-rich visualizations and high-confidence forecasts."
                className="lg:col-span-1"
            />
        </div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <BentoMetric icon={<TrendingUp className="h-8 w-8 text-primary"/>} value="7-Day" label="Forecast Horizon" />
            <BentoMetric icon={<BarChart2 className="h-8 w-8 text-primary"/>} value="8+" label="Predictive Models" />
            <BentoMetric icon={<BookOpen className="h-8 w-8 text-primary"/>} value="6+" label="Regulatory Sources" />
            <BentoMetric icon={<Bot className="h-8 w-8 text-primary"/>} value="RAG" label="AI Architecture" />
        </div>
      </div>


      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center text-foreground">Founder & Lead Architect</h2>
        <Card className="bg-card/50 border border-border/80 text-card-foreground shadow-xl backdrop-blur-sm overflow-hidden">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center text-center">
                <Avatar className="h-28 w-28 mb-4 border-2 border-primary/50">
                    <AvatarImage src="https://prameshluitel.com.np/wp-content/uploads/2024/02/pramesh-luitel-2-768x768.jpg" alt="Pramesh Luitel" />
                    <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl text-foreground font-headline">Pramesh Luitel</h3>
                <p className="text-sm text-muted-foreground mt-1">AI Researcher & Financial Technologist</p>
            </div>
            <div className="md:col-span-3 space-y-4 text-muted-foreground text-sm">
                <p>As the Founder and Lead Architect of Project Vestara, my role is a culmination of my academic research and hands-on experience in the financial sector. My work isn't just about building a product; it's about translating my research into a scalable, real-world application.</p>
                <p>My published papers on sentiment-enhanced stock prediction and AI-driven insights for NEPSE are the very foundation of Vestara's predictive framework. I personally architected the proprietary Large Language Model (LLM) and pioneered the reinforcement learning framework with finance experts.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
