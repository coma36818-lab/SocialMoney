'use client';

import { useEffect, useState, Fragment } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Map feed hostnames to desired names and icons
const feedSources = [
  { name: 'ANSA', icon: '📰', url: 'https://www.ansa.it/sito/ansait_rss.xml', identifier: 'ansa.it' },
  { name: 'BBC News', icon: '🌍', url: 'http://feeds.bbci.co.uk/news/rss.xml', identifier: 'bbci.co.uk' },
  { name: 'Vogue', icon: '👗', url: 'https://www.vogue.it/rss', identifier: 'vogue.it' },
  { name: 'GialloZafferano', icon: '🍳', url: 'https://www.giallozafferano.it/rss', identifier: 'giallozafferano.it' },
  { name: 'ComingSoon', icon: '🎬', url: 'https://www.comingsoon.it/rss', identifier: 'comingsoon.it' },
  { name: 'People', icon: '💋', url: 'https://people.com/feed/', identifier: 'people.com' },
];

const feedSourceDetails: { [key: string]: { name: string; icon: string } } = 
  feedSources.reduce((acc, source) => {
    acc[source.identifier] = { name: source.name, icon: source.icon };
    return acc;
  }, {} as { [key: string]: { name: string; icon: string } });


interface FeedItem {
  title: string;
  link: string;
  image: string;
  description: string;
  pubDate: string;
  source: string; // The identifier, e.g., "vogue.it"
  guid: string;
}

export function RssFeed() {
  const [allFeedItems, setAllFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      
      const feedPromises = feedSources.map(feed => 
        fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`)
          .then(res => {
            if (!res.ok) {
              console.warn(`Failed to fetch feed for ${feed.name}, status: ${res.status}`);
              return null; // Return null for failed feeds
            }
            return res.text();
          })
          .then(text => {
            if (!text) return [];

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'application/xml');
            const items = Array.from(xmlDoc.querySelectorAll('item'));
            
            return items.slice(0, 10).map(item => {
              const title = item.querySelector('title')?.textContent || '';
              const link = item.querySelector('link')?.textContent || '';
              const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
              const guid = item.querySelector('guid')?.textContent || link || title;

              let description = (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').substring(0, 100) + '...';
              
              const extractImage = (item: Element): string => {
                const mediaContent = item.getElementsByTagName('media:content')[0];
                if (mediaContent && mediaContent.getAttribute('url')) {
                    return mediaContent.getAttribute('url')!;
                }

                const enclosure = item.querySelector('enclosure');
                if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
                    return enclosure.getAttribute('url') || '';
                }

                const descriptionContent = item.querySelector('description')?.textContent || '';
                const imgMatch = descriptionContent.match(/<img[^>]+src="([^">]+)"/);
                if (imgMatch) {
                    return imgMatch[1];
                }
                
                return `https://picsum.photos/seed/${guid}/600/400`;
              };

              const image = extractImage(item);

              return {
                title,
                link,
                pubDate,
                description,
                image,
                guid,
                source: feed.identifier,
              };
            });
          })
          .catch(error => {
            console.error(`Error processing feed for ${feed.name}:`, error);
            return []; // Return empty array on error
          })
      );

      try {
        const results = await Promise.all(feedPromises);
        const processedItems = results.flat().filter(item => item !== null) as FeedItem[];
        
        const sortedAndShuffled = processedItems
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 50) // Take top 50 recent
            .sort(() => Math.random() - 0.5); // Then shuffle them

        setAllFeedItems(sortedAndShuffled);
        setFilteredItems(sortedAndShuffled);

      } catch (error) {
        console.error("Error fetching or processing feeds:", error);
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
       const sourceIdentifier = feedSources.find(s => s.name === currentFilter)?.identifier;
       if (sourceIdentifier) {
         setFilteredItems(allFeedItems.filter(item => item.source === sourceIdentifier));
       }
    }
  }, [currentFilter, allFeedItems]);


  return (
    <section id="rss-feeds" className="py-12 md:py-16">
      <h2 className="section-title">📰 Trending News & Celebrity Buzz</h2>
      <p className="text-center text-muted-foreground -mt-8 mb-8 max-w-2xl mx-auto">
        Scopri le tendenze più calde della settimana nel mondo delle celebrità e della moda internazionale, con notizie in tempo reale dalle fonti più autorevoli.
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
                          <span>{feedSourceDetails[item.source]?.icon} {feedSourceDetails[item.source]?.name}</span>
                          <span>{new Date(item.pubDate).toLocaleDateString('it-IT')}</span>
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
