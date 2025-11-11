'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { XMLParser } from 'fast-xml-parser';

const feeds = [
  { name: 'ANSA', url: 'https://www.ansa.it/sito/ansait_rss.xml', icon: '📰' },
  { name: 'Vogue', url: 'https://www.vogue.it/rss', icon: '👗' },
  { name: 'GialloZafferano', url: 'https://www.giallozafferano.it/rss', icon: '🍳' },
  { name: 'ComingSoon', url: 'https://www.comingsoon.it/rss', icon: '🎬' },
  { name: 'People', url: 'https://people.com/feed/', icon: '💋' },
];

interface FeedItem {
  title: string;
  link: string;
  thumbnail: string;
  description: string;
  pubDate: string;
  source: string;
  icon: string;
  guid: string;
}

function extractImageUrl(item: any): string {
    // 1. Check enclosure (often used for media)
    if (item.enclosure && item.enclosure['@_url'] && item.enclosure['@_type']?.startsWith('image')) {
        return item.enclosure['@_url'];
    }
    // 2. Check for media:content (a common RSS extension)
    if (item['media:content'] && item['media:content']['@_url']) {
        return item['media:content']['@_url'];
    }
    // 3. Check for media:thumbnail
    if (item['media:thumbnail'] && item['media:thumbnail']['@_url']) {
        return item['media:thumbnail']['@_url'];
    }
    // 4. Check for a raw thumbnail field
    if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) {
        return item.thumbnail;
    }
    // 5. Parse description/content for an <img> tag
    const content = item.description || item['content:encoded'] || '';
    if(typeof content === 'string') {
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
            return imgMatch[1];
        }
    }
    // 6. Fallback to a generic placeholder
    return `https://picsum.photos/seed/${item.guid || item.title}/600/400`;
}


export function RssFeed() {
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });

    async function fetchFeeds() {
      setLoading(true);
      const allItems: FeedItem[] = [];
      const promises = feeds.map(feed =>
        fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`)
          .then(res => {
            if (!res.ok) {
              // Non bloccare tutto, logga l'errore e vai avanti.
              console.warn(`Could not fetch feed for ${feed.name}. Status: ${res.status}`);
              return null; // Restituisce null per indicare il fallimento
            }
            return res.text();
          })
          .then(xmlText => {
            if (xmlText) {
              const result = parser.parse(xmlText);
              const itemsFromFeed = result?.rss?.channel?.item || result?.feed?.entry || [];
              const itemsToAdd = Array.isArray(itemsFromFeed) ? itemsFromFeed : [itemsFromFeed];
              
              const parsedItems: FeedItem[] = itemsToAdd.slice(0, 10).map((item: any) => ({
                title: item.title || 'Untitled',
                link: item.link?.['@_href'] || item.link || '#',
                thumbnail: extractImageUrl(item),
                description: (item.description || item.summary || '').replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                pubDate: item.pubDate || item.published || new Date().toISOString(),
                source: feed.name,
                icon: feed.icon,
                guid: item.guid || item.id,
              }));
              allItems.push(...parsedItems);
            }
          })
          .catch(err => console.error(`Failed to load or process RSS feed for ${feed.name}:`, err))
      );

      await Promise.all(promises);

      allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      setAllFeedItems(allItems);
      setFilteredItems(allItems);
      setLoading(false);
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
      <h2 className="section-title">📰 Latest News from Top Portals</h2>
      <p className="text-center text-muted-foreground -mt-8 mb-8 max-w-2xl mx-auto">
        Real-time news from ANSA, Vogue, GialloZafferano, ComingSoon and People - 10 articles per source
      </p>

      <div className="flex justify-center flex-wrap gap-3 mb-8">
        <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentFilter('all')}
            className={`transition-all ${currentFilter === 'all' ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' : ''}`}
        >
            All
        </Button>
        {feeds.map(feed => (
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
            <div key={`${item.guid}-${index}`} className="bg-card/30 border border-border rounded-lg overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1">
                <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${item.guid || item.title}/600/400`; }}
                    />
                    </div>
                </Link>
                <div className="p-4">
                    <h3 className="font-bold text-base text-foreground mb-2 leading-snug line-clamp-2 h-[48px]">
                        <Link href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            {item.title}
                        </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 h-[60px]">{item.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{item.icon} {item.source}</span>
                        <span>{new Date(item.pubDate).toLocaleDateString('it-IT')}</span>
                    </div>
                </div>
            </div>
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
