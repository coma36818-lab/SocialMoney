import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface NewsCardProps {
  article: {
    image: ImagePlaceholder;
    badge: string;
    title: string;
    description: string;
    meta?: string;
    link?: string;
    linkText?: string;
  };
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="bg-card/30 border-border overflow-hidden transition-all duration-300 group hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1">
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
      <CardContent className="p-6">
        <Badge variant="default" className="mb-3 bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
          {article.badge}
        </Badge>
        <h4 className="font-bold text-lg text-foreground mb-2 leading-snug">{article.title}</h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.description}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          {article.meta && <span>{article.meta}</span>}
          {article.link && article.linkText && (
            <Link href={article.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:text-yellow-300 transition-colors">
              {article.linkText}
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
