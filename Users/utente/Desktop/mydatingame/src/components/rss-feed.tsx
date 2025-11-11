'use client';

import { useEffect, useState, Fragment } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { newsSections, curiositaArticles } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

// Combine all articles into one list for filtering and shuffling
const allStaticArticles = [
  ...newsSections.flatMap(section => section.articles.map(article => ({ ...article, source: section.title, sourceId: section.id }))),
  ...curiositaArticles.map(article => ({ ...article, source: '🤔 Curiosità & Lo Sapevi Che...', sourceId: 'curiosita' }))
];

const feedSources = [
  { name: 'All', id: 'all', icon: '🌐' },
  ...newsSections.map(s => ({ name: s.title, id: s.id, icon: s.title.split(' ')[0] })),
  { name: '🤔 Curiosità & Lo Sapevi Che...', id: 'curiosita', icon: '🤔' }
];

interface FeedItem {
  image: ImagePlaceholder;
  badge: string;
  title: string;
  description: string;
  meta?: string;
  link?: string;
  linkText?: string;
  source: string;
  sourceId: string;
}

export function RssFeed() {
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching by shuffling the static data
    const shuffledArticles = [...allStaticArticles].sort(() => Math.random() - 0.5);
    setAllFeedItems(shuffledArticles);
    setFilteredItems(shuffledArticles);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredItems(allFeedItems);
    } else {
      setFilteredItems(allFeedItems.filter(item => item.sourceId === currentFilter));
    }
  }, [currentFilter, allFeedItems]);


  return (
    <section id="rss-feeds" className="py-12 md:py-16">
      <h2 className="section-title">📰 Trending News & Celebrity Buzz</h2>
      <p className="text-center text-muted-foreground -mt-8 mb-8 max-w-2xl mx-auto">
        Scopri le tendenze più calde della settimana nel mondo delle celebrità e della moda internazionale, con notizie in tempo reale dalle fonti più autorevoli.
      </p>

      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {feedSources.map(feed => (
          <Button
            key={feed.id}
            variant={currentFilter === feed.id ? 'default' : 'outline'}
            onClick={() => setCurrentFilter(feed.id)}
            className={`transition-all ${currentFilter === feed.id ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : ''}`}
          >
            {feed.icon} {feed.id !== 'all' ? feed.name.split(' ')[1] : 'All'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading news...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Fragment key={`${item.title}-${index}`}>
              <div className="bg-card/30 border border-border rounded-lg overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                  <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer">
                      <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                          src={item.image.imageUrl}
                          alt={item.title || 'Feed image'}
                          width={600}
                          height={400}
                          data-ai-hint={item.image.imageHint}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${item.title}/600/400`; }}
                      />
                      </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-base text-foreground mb-2 leading-snug line-clamp-2 h-[48px]">
                          <Link href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                              {item.title}
                          </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                          <span>{item.badge}</span>
                           <span>{item.meta}</span>
                      </div>
                  </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
       {filteredItems.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground">
                <p>Nessun articolo disponibile per questa categoria.</p>
            </div>
        )}
    </section>
  );
}
