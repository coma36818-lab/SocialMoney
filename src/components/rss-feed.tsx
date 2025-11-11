'use client';

import { useEffect, useState, Fragment } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AdSlot } from './ad-slot';

const feedSources = [
  { name: 'ANSA', icon: '📰' },
  { name: 'Vogue', icon: '👗' },
  { name: 'GialloZafferano', icon: '🍳' },
  { name: 'ComingSoon', icon: '🎬' },
  { name: 'People', icon: '💋' },
];

interface FeedItem {
  title: string;
  link: string;
  image: string;
  description: string;
  pubDate: string;
  source: string;
  icon: string;
  guid: string;
}

const AD_INTERVAL = 8; // Show an ad every 8 news items

export function RssFeed() {
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      try {
        const res = await fetch('/api/feeds');
        if (!res.ok) {
          throw new Error('Failed to fetch feeds');
        }
        const items: FeedItem[] = await res.json();
        setAllFeedItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error("Error fetching aggregated feeds:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeeds();
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredItems(allFeedItems);
    } else {
      setFilteredItems(allFeedItems.filter(item => item.source === currentFilter));
    }
  }, [currentFilter, allFeedItems]);


  return (
    <section id="rss-feeds" className="py-12 md:py-16">
      <h2 className="section-title">📰 Trending News & Celebrity Buzz</h2>
      <p className="text-center text-muted-foreground -mt-8 mb-8 max-w-2xl mx-auto">
        Real-time updates from ANSA, Vogue, GialloZafferano, ComingSoon, and People.
      </p>

      <div className="flex justify-center flex-wrap gap-3 mb-8">
        <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentFilter('all')}
            className={`transition-all ${currentFilter === 'all' ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : ''}`}
        >
            All
        </Button>
        {feedSources.map(feed => (
          <Button
            key={feed.name}
            variant={currentFilter === feed.name ? 'default' : 'outline'}
            onClick={() => setCurrentFilter(feed.name)}
            className={`transition-all ${currentFilter === feed.name ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : ''}`}
          >
            {feed.icon} {feed.name}
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
            <Fragment key={`${item.guid}-${index}`}>
              <div className="bg-card/30 border border-border rounded-lg overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                  <Link href={item.link} target="_blank" rel="noopener noreferrer">
                      <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                          src={item.image}
                          alt={item.title || 'Feed image'}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${item.guid || item.title}/600/400`; }}
                      />
                      </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-base text-foreground mb-2 leading-snug line-clamp-2 h-[48px]">
                          <Link href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                              {item.title}
                          </Link>
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{item.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                          <span>{item.icon} {item.source}</span>
                          <span>{new Date(item.pubDate).toLocaleDateString('it-IT')}</span>
                      </div>
                  </div>
              </div>
              {(index + 1) % AD_INTERVAL === 0 && (
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 w-full">
                  <AdSlot adSlotId="9219349887" />
                </div>
              )}
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
