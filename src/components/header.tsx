
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronDown } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4" onClick={() => setIsSheetOpen(false)}>
            <img src="/logo.png" alt="MyDatinGame Logo" className="h-16 w-16 md:h-14 md:w-14" />
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
                <ScrollArea className="h-full w-full">
                  <nav className="flex flex-col gap-4 mt-8 px-4">
                    {navLinks.map((link) => (
                       link.isDropdown && link.items ? (
                        <Collapsible key={link.label}>
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between font-bold text-lg py-2 w-full">
                              <span>{link.label}</span>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="flex flex-col gap-2 pl-4">
                                {link.items.map(subLink => (
                                    <Button variant="ghost" asChild key={subLink.href} className="justify-start text-base">
                                        <Link href={subLink.href} onClick={() => setIsSheetOpen(false)}>{subLink.label}</Link>
                                    </Button>
                                ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                    ) : (
                      <Button variant="ghost" asChild key={link.href} className="justify-start text-lg py-2">
                        <Link href={link.href!} onClick={() => setIsSheetOpen(false)}>{link.label}</Link>
                      </Button>
                    )))}
                  </nav>
                </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
