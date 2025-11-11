import Link from 'next/link';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section className="py-20 md:py-12">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-16 shadow-2xl text-center">
        <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%) animate-[rotate_30s_linear_infinite]"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black font-headline !leading-tight mb-4">
            <span className="bg-gradient-to-r from-foreground to-yellow-300 bg-clip-text text-transparent">
              Discover Trends, Gossip & Monetize Your Passion
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Your ultimate digital magazine for celebrity news, fashion trends, beauty tips, gaming updates, TV series reviews, and influencer strategies for 2025.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow transform hover:-translate-y-1">
              <Link href="#real-news">Explore Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="backdrop-blur-sm">
              <Link href="#join-creators">Join Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
