import { NewsCard } from './news-card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface Article {
  image: ImagePlaceholder;
  badge: string;
  title: string;
  description: string;
  meta?: string;
  link?: string;
  linkText?: string;
}

interface NewsSectionProps {
  id: string;
  title: string;
  articles: Article[];
}

export function NewsSection({ id, title, articles }: NewsSectionProps) {
  return (
    <section id={id} className="py-12 md:py-16">
      <h2 className="section-title">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </section>
  );
}
