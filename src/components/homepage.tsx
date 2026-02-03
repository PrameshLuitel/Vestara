
"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Bot, BrainCircuit, TrendingUp, BarChart2, BookOpen } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Make buttons functional by adding scroll behavior
const handleScroll = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

const FeatureCard = ({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) => {
  return (
      // Enhanced glassmorphism: slightly more blur, refined border and shadow on hover.
      <div className={cn("rounded-xl border border-white/10 bg-white/5 text-card-foreground shadow-lg transition-all duration-300 hover:border-primary/70 hover:shadow-primary/20 hover:-translate-y-1.5 relative overflow-hidden p-6 flex flex-col h-full backdrop-blur-md", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                {icon}
            </div>
            <h3 className="text-lg font-bold font-headline text-foreground">{title}</h3>
        </div>
        <p className="relative z-10 text-sm text-muted-foreground flex-grow">{description}</p>
        <div className="absolute -bottom-12 -right-12 text-primary/10 opacity-50">
            {React.cloneElement(icon as React.ReactElement, { className: "w-36 h-36" })}
        </div>
      </div>
  );
};

const BentoMetric = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => {
    return (
        // Enhanced glassmorphism for bento grid
        <div
            className="transition-transform duration-300 ease-out bg-white/5 border border-white/10 hover:border-primary/70 p-4 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:-translate-y-1.5"
        >
            {icon}
            <p className="text-3xl font-bold font-headline mt-2 text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
    );
};


export default function Homepage() {
  return (
    // Add overflow-x-hidden to prevent horizontal scroll from blurred elements
    <div className="flex flex-col items-center p-4 overflow-x-hidden">
      
      <div className="relative w-full min-h-[90vh] flex items-center justify-center rounded-lg overflow-hidden mb-24 text-center">
         {/* More prominent background grid and gradient effects */}
         <div className="absolute inset-0 z-0 bg-grid-slate-900/[0.07] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{ maskImage: 'linear-gradient(to_bottom, transparent, black, transparent)'}}></div>
         <div className="absolute top-0 left-0 h-1/2 w-full bg-gradient-to-br from-primary/15 via-transparent to-transparent -translate-x-1/2 -translate-y-1/2" style={{ filter: 'blur(100px)' }}></div>
         <div className="absolute bottom-0 right-0 h-1/2 w-full bg-gradient-to-tl from-primary/15 via-transparent to-transparent translate-x-1/2 translate-y-1/2" style={{ filter: 'blur(100px)' }}></div>

        <div className="relative z-10 grid grid-cols-1 gap-8 items-center max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center">
                <h1 className="text-6xl md:text-8xl font-bold font-headline mb-4 tracking-tighter text-foreground">
                    Vestara<sup className="text-3xl md:text-5xl font-semibold -top-10 text-primary">AI</sup>
                </h1>
                <p className="text-xl md:text-2xl text-primary font-semibold font-headline mb-8">
                    AI-Powered Intelligence for Nepal's Financial Markets
                </p>
                <p className="text-base text-muted-foreground max-w-3xl mx-auto mb-12">
                    Project Vestara is a state-of-the-art research portal designed to redefine how financial professionals access, interpret, and act on critical regulatory and market data in Nepal.
                </p>
                <div className="flex gap-4">
                    {/* Make buttons functional */}
                    <Button size="lg" className="font-semibold" onClick={(e) => handleScroll(e, 'features')}>
                        Explore Features
                    </Button>
                     <Button size="lg" variant="outline" className="font-semibold" onClick={(e) => handleScroll(e, 'architect')}>
                        Meet the Architect
                    </Button>
                </div>
            </div>
        </div>
      </div>
      
      <div id="features" className="w-full max-w-6xl mb-24 scroll-mt-20">
        <h2 className="text-4xl font-bold font-headline mb-12 text-center text-foreground">Core Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
                icon={<Bot className="h-8 w-8 text-primary" />} 
                title="Vestara GPT" 
                description="Our custom-built RAG model, trained on SEBON/NEPSE regulations and investment banking workflows, delivers precise, context-aware answers to any compliance, operational, or market-related query."
                className="md:col-span-2"
            />
             <FeatureCard 
                icon={<BrainCircuit className="h-8 w-8 text-primary" />} 
                title="Predictive Suite" 
                description="A cutting-edge, multi-model AI prediction engine covering all NEPSE-listed stocks. It leverages a diverse portfolio of ML/DL architectures for data-rich visualizations and high-confidence forecasts."
                className="md:col-span-1"
            />
        </div>
      </div>
      
      <div className="w-full max-w-6xl mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <BentoMetric icon={<TrendingUp className="h-8 w-8 text-primary"/>} value="7-Day" label="Forecast Horizon" />
            <BentoMetric icon={<BarChart2 className="h-8 w-8 text-primary"/>} value="8+" label="Predictive Models" />
            <BentoMetric icon={<BookOpen className="h-8 w-8 text-primary"/>} value="6+" label="Regulatory Sources" />
            <BentoMetric icon={<Bot className="h-8 w-8 text-primary"/>} value="RAG" label="AI Architecture" />
        </div>
      </div>


      <div id="architect" className="w-full max-w-5xl mb-24 scroll-mt-20">
        <h2 className="text-4xl font-bold font-headline mb-12 text-center text-foreground">Founder & Lead Architect</h2>
        {/* Enhance architect card with glassmorphism */}
        <Card className="bg-white/5 border border-white/10 text-card-foreground shadow-xl backdrop-blur-md overflow-hidden">
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

       <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">Project Roadmap</h2>
           {/* Glassmorphism for the roadmap card */}
           <Card className="inline-block bg-white/5 border border-white/10 text-card-foreground p-6 shadow-xl backdrop-blur-md">
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Status:</span> The platform is currently under active development.</p>
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Planned Launch:</span> The official launch is planned for Q2 2026. Stay tuned for updates.</p>
           </Card>
      </div>

    </div>
  );
}
