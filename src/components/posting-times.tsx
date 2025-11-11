import { postingTimes } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function PostingTimes() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'posting-times-bg');

  return (
    <section id="posting-times" className="py-12 md:py-20">
      <div className="relative rounded-2xl p-8 md:p-16 overflow-hidden border">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover"
                data-ai-hint={bgImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        <div className="relative z-10">
          <h2 className="section-title text-white">Best Times to Post in 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postingTimes.map((item, index) => (
              <Card key={index} className="bg-gradient-to-br from-yellow-300/10 to-primary/10 border-border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-yellow-300/50">
                <CardHeader>
                  <CardTitle className="text-yellow-300">{item.platform}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-line font-semibold">{item.times}</p>
                  <p className="text-muted-foreground text-sm mt-2">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
