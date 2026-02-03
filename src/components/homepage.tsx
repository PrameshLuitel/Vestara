
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Bot, BrainCircuit, TrendingUp, BarChart2, BookOpen } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const FeatureCard = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => {
  return (
      <div className={cn("rounded-lg border bg-card/60 text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20 hover:-translate-y-1 relative overflow-hidden p-6 flex flex-col h-full backdrop-blur-sm", className)}>
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                {icon}
            </div>
            <h3 className="text-lg font-bold font-headline text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground flex-grow">{description}</p>
        <div className="absolute -bottom-10 -right-10 text-primary/5 opacity-50">
            {React.cloneElement(icon as React.ReactElement, { className: "w-32 h-32" })}
        </div>
      </div>
  );
};

const BentoMetric = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => {
    return (
        <div
            className="transition-transform duration-300 ease-out bg-card/60 border border-border hover:border-primary/50 p-4 rounded-lg flex flex-col items-center justify-center text-center backdrop-blur-sm hover:-translate-y-1"
        >
            {icon}
            <p className="text-2xl font-bold font-headline mt-2 text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
};


export default function Homepage() {
  return (
    <div className="flex flex-col items-center p-4 overflow-x-hidden">
      
      <div className="relative w-full min-h-[80vh] flex items-center justify-center rounded-lg overflow-hidden mb-24 text-center">
         <div className="absolute inset-0 z-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{ maskImage: 'linear-gradient(to_bottom, transparent, black, transparent)'}}></div>
         <div className="absolute top-0 left-0 h-1/3 w-full bg-gradient-to-br from-primary/10 via-transparent to-transparent -translate-x-1/3 -translate-y-1/3" style={{ filter: 'blur(80px)' }}></div>
         <div className="absolute bottom-0 right-0 h-1/3 w-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent translate-x-1/3 translate-y-1/3" style={{ filter: 'blur(80px)' }}></div>

        <div className="relative z-10 grid grid-cols-1 gap-8 items-center max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center">
                <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 tracking-tighter text-foreground">
                    Vestara<sup className="text-2xl md:text-4xl font-semibold -top-8 text-primary">AI</sup>
                </h1>
                <p className="text-lg md:text-xl text-primary font-semibold font-headline mb-6">
                    AI-Powered Intelligence for Nepal's Financial Markets
                </p>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10">
                    Project Vestara is a state-of-the-art research portal designed to redefine how financial professionals access, interpret, and act on critical regulatory and market data in Nepal.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" className="font-semibold">
                        Explore Features
                    </Button>
                     <Button size="lg" variant="outline" className="font-semibold">
                        Meet the Architect
                    </Button>
                </div>
            </div>
        </div>
      </div>
      
      <div id="features" className="w-full max-w-6xl mb-24">
        <h2 className="text-4xl font-bold font-headline mb-12 text-center text-foreground">Core Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      <div className="w-full max-w-6xl mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <BentoMetric icon={<TrendingUp className="h-6 w-6 text-primary"/>} value="7-Day" label="Forecast Horizon" />
            <BentoMetric icon={<BarChart2 className="h-6 w-6 text-primary"/>} value="8+" label="Predictive Models" />
            <BentoMetric icon={<BookOpen className="h-6 w-6 text-primary"/>} value="6+" label="Regulatory Sources" />
            <BentoMetric icon={<Bot className="h-6 w-6 text-primary"/>} value="RAG" label="AI Architecture" />
        </div>
      </div>


      <div id="architect" className="w-full max-w-5xl mb-24">
        <h2 className="text-4xl font-bold font-headline mb-12 text-center text-foreground">Founder & Lead Architect</h2>
        <Card className="bg-card/80 border-border text-card-foreground shadow-lg backdrop-blur-sm">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
                    <AvatarImage src="https://prameshluitel.com.np/wp-content/uploads/2024/02/pramesh-luitel-2-768x768.jpg" alt="Pramesh Luitel" />
                    <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg text-foreground font-headline">Pramesh Luitel</h3>
                <p className="text-sm text-muted-foreground mt-1">AI Researcher & Financial Technologist</p>
            </div>
            <div className="md:col-span-3 space-y-4 text-muted-foreground text-sm">
                <p>As the Founder and Lead Architect of Project Vestara, my role is a culmination of my academic research and hands-on experience in the financial sector. My work isn't just about building a product; it's about translating my research into a scalable, real-world application.</p>
                <p>My published papers on sentiment-enhanced stock prediction and AI-driven insights for NEPSE are the very foundation of Vestara's predictive framework. I personally architected the proprietary Large Language Model (LLM) and pioneered the reinforcement learning framework with finance experts.</p>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">Project Roadmap</h2>
           <Card className="inline-block bg-card/80 border-border text-card-foreground p-6 shadow-lg backdrop-blur-sm">
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Status:</span> The platform is currently under active development.</p>
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Planned Launch:</span> The official launch is planned for Q2 2026. Stay tuned for updates.</p>
           </Card>
      </div>

    </div>
  );
}
