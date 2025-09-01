"use client";

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-foreground">
          Vestara
        </h1>
      </div>
    </div>
  );
}
