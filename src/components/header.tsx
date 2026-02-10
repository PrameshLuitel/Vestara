import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import Logo from './logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 border-white/10 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold font-headline text-foreground text-lg">
            <Logo className="h-6 w-6"/>
            Vestara
          </Link>
        </div>
        <nav className="flex items-center gap-2">
           <ThemeToggle />
           <Button variant="outline" asChild className="text-foreground border-white/20 hover:bg-white/10">
              <Link href="https://prameshluitel.com.np">
                Return to Main Site
              </Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
