
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
            <div className="flex flex-col min-h-screen animate-fade-in">
              <main className="flex-grow">
                {children}
              </main>
              <footer className="w-full py-4 px-8 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Status: Under active development. Planned Launch: Q2 2026.
                </p>
                <p className="text-xs text-muted-foreground">
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
