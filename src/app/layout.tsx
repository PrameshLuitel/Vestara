
"use client"

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import SplashScreen from '@/components/splash-screen';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This logic ensures the splash screen is only shown once per session.
    if (sessionStorage.getItem('splashShown')) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 2500); // Duration of the splash screen

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <title>Vestara: AI-Powered Investment Intelligence</title>
        <meta name="description" content="Unifying deep regulatory knowledge with predictive market analytics for Nepal's financial sector." />
      </head>
      <body className={cn("font-sans antialiased", fontInter.variable, fontSpaceGrotesk.variable)}>
        {loading ? (
          <SplashScreen />
        ) : (
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen animate-fade-in relative">
              <div className="absolute top-0 -z-10 h-full w-full bg-background">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
              </div>
              <main className="flex-grow">
                {children}
              </main>
              <footer className="w-full py-2 px-4 text-center border-t border-white/10 bg-background/50 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground mb-1">
                  Status: Under active development. Planned Launch: Q2 2026.
                </p>
                <p className="text-xs text-muted-foreground/80">
                  The Predictive Suite and Vestara GPT are AI-powered. Information is for educational and research purposes only; it is not financial advice.
                </p>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        )}
      </body>
    </html>
  );
}
