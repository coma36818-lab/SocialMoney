
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-black text-2xl md:text-3xl text-primary-foreground shadow-lg animate-[pulse_3s_ease-in-out_infinite]">
              CG
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold font-headline bg-gradient-to-r from-primary via-yellow-300 to-accent bg-clip-text text-transparent">
                MyDatinGame
              </h1>
              <p className="text-xs text-muted-foreground tracking-wider">
                Trends • Gossip • Lifestyle • Monetize
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isGameLink = link.label === "Explore Games";
              return (
              <Button 
                variant={isGameLink ? "default" : "link"} 
                asChild 
                key={link.href} 
                className={cn(
                  isGameLink ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40" : "text-muted-foreground hover:text-primary",
                  "transition-all"
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            )})}
          </nav>
        </div>


        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Button variant="ghost" asChild key={link.href} className="justify-start text-lg">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
