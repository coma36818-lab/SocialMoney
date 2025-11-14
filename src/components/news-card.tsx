import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from './ui/button';

interface NewsCardProps {
  article: {
    image: ImagePlaceholder;
    badge: string;
    title: string;
    description: string;
    meta?: string;
    link?: string;
    linkText?: string;
    internalLink?: string;
    internalLinkText?: string;
  };
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="bg-card/30 border-border overflow-hidden transition-all duration-300 group hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      {article.image && (
        <div className="overflow-hidden aspect-[3/2]">
             <Image
                src={article.image.imageUrl}
                alt={article.image.description}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={article.image.imageHint}
            />
        </div>
      )}
      <CardContent className="p-6 flex flex-col flex-grow">
        <Badge variant="default" className="mb-3 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 w-fit">
          {article.badge}
        </Badge>
        <h4 className="font-bold text-lg text-foreground mb-2 leading-snug">{article.title}</h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{article.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border/20">
          {article.meta && <span>{article.meta}</span>}
          <div className="flex items-center gap-2">
            {article.internalLink && article.internalLinkText && (
              <Button asChild variant="secondary" size="sm">
                <Link href={article.internalLink} className="text-xs">
                  {article.internalLinkText}
                </Link>
              </Button>
            )}
            {article.link && article.linkText && (
              <Button asChild variant="link" size="sm" className="text-primary hover:text-yellow-300 transition-colors text-xs p-0 h-auto">
                <Link href={article.link} target="_blank" rel="noopener noreferrer">
                  {article.linkText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
