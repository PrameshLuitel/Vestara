import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, DollarSign, Building2 } from "lucide-react";
import AnimatedHero from "./animated-hero";

export default function Homepage() {
  const sectors = [
    { name: "Technology", icon: <Activity className="h-8 w-8 text-primary" />, change: "+1.2%", color: "text-success" },
    { name: "Finance", icon: <DollarSign className="h-8 w-8 text-primary" />, change: "-0.5%", color: "text-danger" },
    { name: "Real Estate", icon: <Building2 className="h-8 w-8 text-primary" />, change: "+0.8%", color: "text-success" },
    { name: "S&P 500", icon: <TrendingUp className="h-8 w-8 text-primary" />, change: "+0.9%", color: "text-success" },
  ];

  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="relative w-full max-w-5xl mx-auto mb-12 overflow-hidden rounded-lg shadow-xl aspect-[2/1]">
        <AnimatedHero />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30">
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tighter text-white">
                Vestara
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                Harnessing the power of predictive analytics to illuminate your path in the stock market. Your sultry muse for market insights.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {sectors.map((sector) => (
          <Card key={sector.name} className="text-left hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{sector.name}</CardTitle>
              {sector.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Market Overview</div>
              <p className={`text-xs ${sector.color}`}>{sector.change} from yesterday</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 w-full max-w-5xl text-left">
          <h2 className="text-3xl font-bold font-headline mb-6 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Clarity in Complexity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">We decode market complexities into actionable insights, providing clear, data-driven predictions to guide your investment decisions. Our goal is to make sophisticated market analysis accessible to everyone.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Future-Forward Finance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">By leveraging state-of-the-art AI, we aim to be at the forefront of financial technology. We continuously train and refine our models to deliver predictions with the highest possible accuracy.</p>
                </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}
