
"use client";

import Logo from "./logo";

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-fade-in relative overflow-hidden">
       <div className="absolute inset-0 z-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center animate-pulse">
        <Logo className="h-16 w-16 mb-4"/>
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Vestara
        </h1>
      </div>
    </div>
  );
}
