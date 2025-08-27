import { Briefcase } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Briefcase className="h-6 w-6 mr-2" />
          <span className="font-bold font-headline">Vestara</span>
        </div>
      </div>
    </header>
  );
}
