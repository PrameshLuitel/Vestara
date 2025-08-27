import { Briefcase, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-black/30 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <span className="font-bold font-headline text-white">Vestara</span>
        </div>
        <nav>
           <Button variant="ghost" asChild className="text-white hover:bg-white/20 hover:text-white">
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
