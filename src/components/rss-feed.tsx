'use client';

import { useEffect, useState, Fragment } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { AdSlot } from './ad-slot';

// Map feed hostnames to desired names and icons
const feedSourceDetails: { [key: string]: { name: string; icon: string } } = {
  'ansa.it': { name: 'ANSA', icon: '📰' },
  'vogue.it': { name: 'Vogue', icon: '👗' },
  'giallozafferano.it': { name: 'GialloZafferano', icon: '🍳' },
  'comingsoon.it': { name: 'ComingSoon', icon: '🎬' },
  'people.com': { name: 'People', icon: '💋' },
  'feeds.bbci.co.uk': { name: 'BBC News', icon: '🌍' },
};

interface FeedItem {
  title: string;
  link: string;
  image: string;
  description: string;
  pubDate: string;
  source: string; // The hostname, e.g., "vogue.it"
  guid: string;
}

const AD_INTERVAL = 8; // Show an ad every 8 news items

// The single endpoint for all feeds
const feedMixerUrl = 'https://feedmix.novacms.xyz/api/v1/aggregate?feeds=https://www.ansa.it/sito/ansait_rss.xml,https://www.vogue.it/rss,https://people.com/feed/,https://www.giallozafferano.it/rss,https://www.comingsoon.it/rss';

export function RssFeed() {
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      try {
        const res = await fetch(feedMixerUrl);
        if (!res.ok) {
          throw new Error('Failed to fetch feeds from FeedMixer');
        }
        const data = await res.json();
        
        // Process items: add a unique guid, normalize source
        const processedItems = (data.items || []).map((item: any) => ({
            ...item,
            guid: item.id || item.link || item.title,
            pubDate: item.published || new Date().toISOString(),
            description: (item.summary || item.content || '').replace(/<[^>]*>/g, '').substring(0, 100) + '...',
            source: new URL(item.link).hostname.replace('www.', ''),
            image: item.image || `https://picsum.photos/seed/${item.id || item.title}/600/400`,
        }));

        // Sort by date to get the most recent, then shuffle for variety
        const sortedAndShuffled = processedItems
            .sort((a: FeedItem, b: FeedItem) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 50) // Take top 50 recent
            .sort(() => Math.random() - 0.5); // Then shuffle them

        setAllFeedItems(sortedAndShuffled);
        setFilteredItems(sortedAndShuffled);

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
       // Filter by the desired source name (e.g., 'ANSA')
      const sourceHostname = Object.keys(feedSourceDetails).find(host => feedSourceDetails[host].name === currentFilter);
      setFilteredItems(allFeedItems.filter(item => item.source === sourceHostname));
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
        {Object.values(feedSourceDetails).map(feed => (
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
                          <span>{feedSourceDetails[item.source]?.icon} {feedSourceDetails[item.source]?.name}</span>
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
