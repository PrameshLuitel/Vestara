
"use client";

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-fade-in relative overflow-hidden">
       <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-background mix-blend-multiply"></div>
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 to-transparent to-70% animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent animate-[spin_20s_linear_infinite]"></div>
        </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter">
          Vestara<sup>AI</sup>
        </h1>
      </div>
    </div>
  );
}
