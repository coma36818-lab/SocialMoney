
'use client';

import Link from 'next/link';
import { Button } from './ui/button';

export function GameHubBanner() {
  return (
    <section id="game-hub" className="py-12 md:py-20 px-6">
      <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-center p-8 border border-primary/20 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=2232&auto=format&fit=crop"
          alt="Girl playing video games"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-white animate-in fade-in-50 duration-700">
          <h2 className="text-4xl md:text-6xl font-black font-headline !leading-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
              Enter the Game Hub
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-lg md:text-xl text-white/80 mb-8">
            Discover a vast library of free-to-play games, from action to strategy.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow transform hover:-translate-y-1 text-base">
            <Link href="/library">Discover All Games</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
