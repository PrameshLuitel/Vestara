import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Scale, BrainCircuit } from "lucide-react";

export default function Homepage() {
  const features = [
    { name: "Regulatory LLM", icon: <Scale className="h-8 w-8 text-white/80" />, description: "Navigate Nepal's complex financial regulations with an AI-powered legal co-pilot." },
    { name: "Predictive Analytics", icon: <BrainCircuit className="h-8 w-8 text-white/80" />, description: "Leverage deep learning models to forecast market trends with unprecedented accuracy." },
    { name: "Data Transparency", icon: <Activity className="h-8 w-8 text-white/80" />, description: "Bring clarity to an opaque market with data-driven insights and sentiment analysis." },
    { name: "Market Intelligence", icon: <TrendingUp className="h-8 w-8 text-white/80" />, description: "Democratize access to institutional-grade predictive intelligence for all." },
  ];

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative w-full max-w-5xl mx-auto mb-12 flex flex-col items-center justify-center text-center p-4 min-h-[30vh]">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tighter text-white">
            Vestara
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-3xl">
            Pioneering the convergence of AI, regulation, and finance to build the foundational intelligence layer for Nepal's emerging financial ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {features.map((feature) => (
          <Card key={feature.name} className="text-left bg-white/10 backdrop-blur-lg border border-white/20 text-white transition-all hover:border-white/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">{feature.name}</CardTitle>
              {feature.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 w-full max-w-5xl text-left">
          <h2 className="text-3xl font-bold font-headline mb-6 text-center text-white">The Mandate</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="text-left bg-white/10 backdrop-blur-lg border border-white/20 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Architecting Market Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white/70">Vestara is not just an application; it is an intervention. In a financial landscape defined by opacity, we are deploying a regulatory-intelligent LLM architected for precision. By leveraging a custom knowledge base and an enhanced RAG process, Vestara minimizes hallucinations, delivering reliable guidance grounded in Nepal's specific regulatory and market data. This is the first step toward engineering a more transparent, equitable, and efficient market.</p>
                </CardContent>
            </Card>
             <Card className="text-left bg-white/10 backdrop-blur-lg border border-white/20 text-white">
                <CardHeader>
                    <CardTitle className="text-white">Forecasting the Future</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white/70">Beyond compliance, Vestara's predictive suite moves from interpretation to anticipation. By fusing advanced AI models with market sentiment, we provide the forward-looking intelligence required to navigate volatility. We are building the engine for the next generation of financial decision-making.</p>
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
