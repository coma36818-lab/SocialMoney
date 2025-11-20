import { creatorRoles } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import Link from 'next/link';

export function ContentSubmission() {
    const bgImage = PlaceHolderImages.find(p => p.id === 'creator-participation-bg');

  return (
    <section id="join-creators" className="py-20 md:py-28">
      <div className="relative rounded-2xl border-2 border-primary p-8 md:p-16 text-center overflow-hidden bg-card/30">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover object-center opacity-20"
                data-ai-hint={bgImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black !leading-tight mb-4">
            <span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
              🌟 Join the MyDatinGame Magazine!
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Are you a <strong className="text-yellow-300">creator</strong>, <strong className="text-yellow-300">influencer</strong>, <strong className="text-yellow-300">YouTuber</strong>, or <strong className="text-yellow-300">content creator</strong>? Submit your videos, articles, and content to be featured on our platform!
          </p>

          <Card className="max-w-2xl mx-auto bg-card/60 backdrop-blur-sm border-border mb-8">
              <CardHeader>
                  <CardTitle className="text-2xl text-foreground">📧 Submit Your Content</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center justify-center gap-4 flex-wrap mb-4">
                      <span className="text-lg text-muted-foreground">Email:</span>
                      <a href="mailto:mydatingame@gmail.com" className="text-xl font-bold text-primary hover:text-yellow-300 transition-colors px-6 py-3 bg-primary/10 rounded-lg">
                        mydatingame@gmail.com
                      </a>
                  </div>
                  <p className="text-sm text-muted-foreground">We accept: YouTube/TikTok Videos, Articles, Tutorials, Reviews, Recipes, Guides, and much more!</p>
              </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {creatorRoles.map((role, i) => (
                  <Card key={i} className="bg-card/50 text-center p-4">
                      <div className="text-4xl mb-2">{role.icon}</div>
                      <h4 className="font-semibold text-foreground">{role.title}</h4>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                  </Card>
              ))}
          </div>

          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow transform hover:-translate-y-1 text-base">
            <Link href="mailto:mydatingame@gmail.com?subject=MyDatingame Magazine Submission&body=Hi, I would like to submit my content to your magazine!">📩 Submit Your Content Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
