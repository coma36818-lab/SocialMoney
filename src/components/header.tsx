
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronDown } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function AppHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4" onClick={() => setIsSheetOpen(false)}>
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
              if (link.isDropdown && link.items) {
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" className="text-muted-foreground hover:text-primary transition-all">
                        {link.label}
                        <ChevronDown className="relative top-[1px] ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {link.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
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
                <Link href={link.href!}>{link.label}</Link>
              </Button>
            )})}
          </nav>
        </div>


        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                   link.isDropdown && link.items ? (
                    <div key={link.label} className="flex flex-col gap-2">
                        <h4 className="font-bold text-lg px-4">{link.label}</h4>
                        {link.items.map(item => (
                            <Button variant="ghost" asChild key={item.href} className="justify-start text-base pl-8">
                                <Link href={item.href} onClick={() => setIsSheetOpen(false)}>{item.label}</Link>
                            </Button>
                        ))}
                    </div>
                ) : (
                  <Button variant="ghost" asChild key={link.href} className="justify-start text-lg">
                    <Link href={link.href!} onClick={() => setIsSheetOpen(false)}>{link.label}</Link>
                  </Button>
                )))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
