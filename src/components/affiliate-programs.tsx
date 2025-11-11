import { affiliatePrograms } from '@/lib/data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

export function AffiliatePrograms() {
  return (
    <section id="affiliates" className="py-12 md:py-20">
      <h2 className="section-title">Top Affiliate Programs for Creators</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {affiliatePrograms.map((program, index) => (
          <Card key={index} className="bg-card/30 border-border flex flex-col transition-all duration-300 hover:bg-card hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50">
            <CardHeader className="flex-row gap-4 items-center">
                <div className="w-16 h-16 bg-white/90 rounded-lg flex items-center justify-center p-2 shrink-0">
                    <span className="font-bold text-center text-sm text-black">{program.logo}</span>
                </div>
                <div>
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <CardDescription>{program.category}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{program.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/30">
                <Link href={program.link} target="_blank" rel="noopener noreferrer">
                  Join Program
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
