
"use client";

import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const loadingSteps = [
    { text: "Initializing analysis engine...", progress: 0 },
    { text: "Connecting to secure data streams...", progress: 15 },
    { text: "Fetching historical market data...", progress: 30 },
    { text: "Compiling time-series datasets...", progress: 45 },
    { text: "Executing LSTM & Prophet models...", progress: 60 },
    { text: "Running XGBoost & Ensemble forecasts...", progress: 75 },
    { text: "Calculating confidence intervals...", progress: 90 },
    { text: "Generating final visualizations...", progress: 100 },
];

const TOTAL_LOAD_TIME_MS = 12000;

export default function LoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState(loadingSteps[0].text);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / TOTAL_LOAD_TIME_MS) * 100);
      setProgress(currentProgress);

      const currentStep = loadingSteps.slice().reverse().find(step => currentProgress >= step.progress);
      if (currentStep) {
        setCurrentStepText(currentStep.text);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const estimatedTimeRemaining = Math.max(0, Math.ceil((TOTAL_LOAD_TIME_MS * (1 - progress / 100)) / 1000));

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-[60vh]">
      <div className="relative w-full max-w-lg p-8 rounded-xl overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold mb-3 text-primary font-headline">Preparing Your Analysis</h2>
          <p className="text-muted-foreground w-full h-10 transition-all duration-300 ease-in-out">
            {currentStepText}
          </p>
          <Progress value={progress} className="w-full mt-4 h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
            <span>{Math.round(progress)}% Complete</span>
            <span>Est. time remaining: {estimatedTimeRemaining}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
