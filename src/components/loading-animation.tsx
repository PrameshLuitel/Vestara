
"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 20 }, (_, i) => ({
  name: `Page ${i}`,
  uv: Math.random() * 300 + 20,
}));

const loadingSteps = [
    "Initializing analysis engine...",
    "Connecting to secure data streams...",
    "Fetching historical market data...",
    "Compiling time-series datasets...",
    "Executing LSTM model...",
    "Running Prophet forecast...",
    "Processing XGBoost predictions...",
    "Aggregating ensemble models...",
    "Calculating confidence intervals...",
    "Generating final visualizations...",
    "Almost there...",
];

export default function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
            if (prev >= loadingSteps.length -1) {
                clearInterval(stepInterval);
                return loadingSteps.length -1;
            }
            return prev + 1;
        })
    }, 600); // Faster text changes

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
        <div className="relative w-full max-w-md p-8 rounded-xl overflow-hidden">
             <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-xl"></div>
             <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary font-headline">Preparing Your Analysis</h2>
                <div className="w-full h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="uv"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fill="url(#colorUv)"
                                isAnimationActive={true}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="mt-4 text-muted-foreground w-64 h-10 transition-all duration-300 ease-in-out">
                    {loadingSteps[currentStep]}
                </p>
             </div>
        </div>
    </div>
  );
}
