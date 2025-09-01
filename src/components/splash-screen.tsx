"use client";

import Logo from './logo';

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-fade-in">
      <div className="relative">
        <Logo className="w-24 h-24 splash-logo" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold font-headline mt-4 tracking-tighter text-foreground animate-fade-in" style={{animationDelay: '1s'}}>
        Vestara
      </h1>
    </div>
  );
}
