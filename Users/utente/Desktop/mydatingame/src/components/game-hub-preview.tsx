
'use client';

import Link from 'next/link';

export function GameHubPreview() {
  return (
    <section className="flex justify-center items-center py-16 md:py-20">
      <Link href="/library">
        <div className="w-[340px] h-[340px] md:w-[600px] md:h-[600px] lg:w-[900px] lg:h-[900px] bg-card rounded-2xl shadow-2xl shadow-primary/10 text-center cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-2">
          <div className="relative w-full h-2/3">
            <img
              src="https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=2232&auto=format&fit=crop"
              alt="Girl playing video games"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>
          <div className="p-6 h-1/3 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold font-headline text-primary group-hover:text-yellow-300 transition-colors">Discover all the games!</h2>
            <p className="text-muted-foreground mt-2 md:mt-4 text-base md:text-lg">Enter our game library</p>
          </div>
        </div>
      </Link>
    </section>
  );
}


    