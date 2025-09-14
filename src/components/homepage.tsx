"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Bot, TrendingUp, BarChart2, BookOpen } from "lucide-react";
import React from "react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-300 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Card className="text-left bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground transition-all flex flex-col h-full shadow-lg hover:shadow-primary/20">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle className="text-lg font-medium text-card-foreground pr-4">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const BentoMetric = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
    <div className="bg-background/30 p-4 rounded-lg flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/10">
        {icon}
        <p className="text-2xl font-bold font-headline mt-2 text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
    </div>
);


export default function Homepage() {
  const features = [
    {
      name: "Vestara GPT: The Domain-Trained AI Assistant",
      icon: <Bot className="h-8 w-8 text-primary" />,
      description: "Our custom-built large language model has been meticulously trained on the intricacies of SEBON and NEPSE regulations, as well as the unique workflows of investment banking in Nepal. Using Retrieval-Augmented Generation (RAG), Vestara GPT delivers precise, context-aware responses to any compliance, operational, or market-related query. This functions as a real-time regulatory and strategy assistant, an authoritative source of truth for investment bankers, analysts, and compliance teams."
    },
    {
      name: "The AI Predictive Analytics Suite",
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      description: "A cutting-edge, multi-model AI prediction engine that covers the entire universe of NEPSE-listed stocks. It leverages a diverse portfolio of machine learning and deep learning architectures, including LSTM, GRU, Transformers, XGBoost, and ensemble models. By integrating technical indicators, historical patterns, and sentiment data, the engine produces data-rich visualizations and high-confidence forecasts. This suite is designed for both institutional analysis and academic research, augmenting human expertise for data-driven decision-making at scale."
    },
  ];

  return (
    <div className="flex flex-col items-center p-4 overflow-x-hidden">
      
      {/* New Hero Section */}
      <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center rounded-lg overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-background mix-blend-multiply"></div>
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent to-70% animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent animate-[spin_20s_linear_infinite]"></div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-4">
            <div className="flex flex-col text-left">
                <h1 className="text-5xl md:text-7xl font-bold font-headline mb-4 tracking-tighter text-foreground">
                    Vestara<sup>AI</sup>
                </h1>
                <p className="text-lg md:text-xl text-primary font-semibold font-headline mb-6">
                    The future of investment strategy, powered by proprietary AI.
                </p>
                <p className="text-base text-muted-foreground max-w-xl">
                    Project Vestara is an advanced AI-powered investment intelligence platform designed to redefine how financial professionals in Nepal access, interpret, and act on critical regulatory and market data.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <BentoMetric icon={<TrendingUp className="h-6 w-6 text-green-500"/>} value="7-Day" label="Forecast Horizon" />
                <BentoMetric icon={<BarChart2 className="h-6 w-6 text-blue-500"/>} value="8+" label="Predictive Models" />
                <BentoMetric icon={<BookOpen className="h-6 w-6 text-orange-500"/>} value="6+" label="Regulatory Sources" />
                <BentoMetric icon={<Bot className="h-6 w-6 text-purple-500"/>} value="RAG" label="AI Architecture" />
            </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl mb-24">
        {features.map((feature) => (
          <FeatureCard key={feature.name} icon={feature.icon} title={feature.name} description={feature.description} />
        ))}
      </div>

      {/* Founder Section */}
      <div className="w-full max-w-5xl mb-24">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center text-foreground">Founder & Lead Architect</h2>
        <Card className="bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground shadow-lg">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h3 className="font-bold text-lg text-primary font-headline">A Vision for Modern Finance</h3>
                <p className="text-sm text-muted-foreground mt-2">Bridging academic research with hands-on market experience to build the next generation of investment intelligence tools.</p>
            </div>
            <div className="md:col-span-2 space-y-4 text-muted-foreground text-sm">
                <p>As the Founder and Lead Architect of Project Vestara, my role is a culmination of my academic research and hands-on experience in the financial sector. My work isn't just about building a product; it's about translating my research into a scalable, real-world application.</p>
                <p>My published papers on sentiment-enhanced stock prediction and AI-driven insights for NEPSE are the very foundation of Vestara's predictive framework. I personally architected the proprietary Large Language Model (LLM) and pioneered the reinforcement learning framework with finance experts.</p>
            </div>
          </CardContent>
        </Card>
      </div>

       <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">Launch Information</h2>
           <Card className="inline-block bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground p-6 shadow-lg">
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Status:</span> The platform is currently under active development.</p>
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Planned Launch:</span> The official launch is planned for Q3 2025. Stay tuned for updates.</p>
           </Card>
      </div>

    </div>
  );
}
