
"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, YAxis, CartesianGrid } from 'recharts';

const data = [
  { value: 10 }, { value: 30 }, { value: 20 }, { value: 50 },
  { value: 40 }, { value: 70 }, { value: 60 }, { value: 90 },
  { value: 80 }, { value: 100 },
];

const loadingSteps = [
    "Initializing analysis engine...",
    "Connecting to data sources...",
    "Fetching historical market data...",
    "Running predictive models...",
    "Aggregating ensemble forecasts...",
    "Generating visualizations...",
];

export default function LoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); // Controls the speed of the line drawing

    const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
            if (prev >= loadingSteps.length -1) {
                clearInterval(stepInterval);
                return loadingSteps.length -1;
            }
            return prev + 1;
        })
    }, 1000); // How often the text changes

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const animatedData = data.slice(0, Math.ceil(data.length * (progress / 100)));

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-semibold mb-4 text-primary font-headline">Preparing Your Analysis</h2>
        <div className="w-full max-w-md h-[200px]">
            <LineChart width={400} height={200} data={animatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <YAxis domain={[0, 110]} hide />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false} // We handle animation manually
                />
            </LineChart>
        </div>
        <p className="mt-4 text-muted-foreground w-64 h-10">{loadingSteps[currentStep]}</p>
    </div>
  );
}
