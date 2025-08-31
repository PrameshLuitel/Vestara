import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Bot } from "lucide-react";
import AnimatedHero from "./animated-hero";

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
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative w-full max-w-5xl mx-auto mb-12 min-h-[40vh] flex items-center justify-center rounded-lg overflow-hidden">
        <AnimatedHero />
        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full p-8 bg-background/50 backdrop-blur-sm rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tighter text-foreground">
            Vestara
          </h1>
          <p className="text-lg md:text-xl text-primary font-semibold font-headline mb-4">
            The future of investment strategy, powered by proprietary AI.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl">
            Project Vestara is an advanced AI-powered investment intelligence platform designed to redefine how financial professionals in Nepal access, interpret, and act on critical regulatory and market data. By unifying a specialized large language model with predictive market analytics, Vestara bridges the gap between deep regulatory knowledge and actionable investment insights. The result is a powerful tool that enables decision-makers to operate with unparalleled speed, precision, and confidence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
        {features.map((feature) => (
          <Card key={feature.name} className="text-left bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground transition-all hover:border-primary/40 flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <CardTitle className="text-lg font-medium text-card-foreground pr-4">{feature.name}</CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full max-w-5xl text-left mb-16">
        <h2 className="text-3xl font-bold font-headline mb-6 text-center text-foreground">Founder & Lead Architect</h2>
        <Card className="text-left bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">As the Founder and Lead Architect of Project Vestara, my role is a culmination of my academic research and hands-on experience in the financial sector. I founded this venture with a clear objective: to modernize investment intelligence in emerging markets by bridging the gap between deep regulatory knowledge and actionable insights.</p>
            <br />
            <p className="text-muted-foreground">My work isn't just about building a product; it's about translating my research into a scalable, real-world application. My published papers on sentiment-enhanced stock prediction and AI-driven insights for NEPSE are not abstract academic exercises, but the very foundation of Vestara's predictive framework. I personally architected the proprietary Large Language Model (LLM) and its multi-source data ingestion pipelines, and pioneered the reinforcement learning framework with finance experts.</p>
            <br />
            <p className="text-muted-foreground">The insights and skills that power Vestara's vision were honed through my experience pioneering AI-first solutions and building tools like 'Portfolio Pulse,'. At Global Ime Capital Limited I gained firsthand insight into the operational bottlenecks Vestara is designed to solve. This unique blend of academic rigor, technical execution, and strategic foresight is what defines my role and the future of Vestara.</p>
          </CardContent>
        </Card>
      </div>

       <div className="w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">Launch Information</h2>
           <Card className="inline-block bg-card/60 backdrop-blur-lg border-border/30 text-card-foreground p-6">
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Status:</span> The platform is currently under active development.</p>
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Planned Launch:</span> The official launch is planned for Q3 2025. Stay tuned for updates.</p>
           </Card>
      </div>

    </div>
  );
}
