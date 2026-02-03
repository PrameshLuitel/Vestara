
"use client";

import { useState, useEffect } from 'react';

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
        setCurrentStep(prev => (prev + 1) % loadingSteps.length);
    }, 1500); 

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
        <div className="relative w-full max-w-md p-8 rounded-xl overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-primary font-headline">Preparing Your Analysis</h2>
                <p className="text-muted-foreground w-72 h-10 transition-all duration-300 ease-in-out">
                    {loadingSteps[currentStep]}
                </p>
             </div>
        </div>
    </div>
  );
}
