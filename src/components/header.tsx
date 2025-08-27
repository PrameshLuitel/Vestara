import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 border-border backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <span className="font-bold font-headline text-foreground">Vestara</span>
        </div>
        <nav className="flex items-center gap-2">
           <ThemeToggle />
           <Button variant="ghost" asChild className="text-foreground hover:bg-accent hover:text-accent-foreground">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Main Site
              </Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
