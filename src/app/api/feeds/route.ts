import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const FEEDS = [
  { name: 'ANSA', url: 'https://www.ansa.it/sito/ansait_rss.xml', icon: '📰' },
  { name: 'Vogue', url: 'https://www.vogue.it/rss', icon: '👗' },
  { name: 'GialloZafferano', url: 'https://www.giallozafferano.it/rss', icon: '🍳' },
  { name: 'ComingSoon', url: 'https://www.comingsoon.it/rss', icon: '🎬' },
  { name: 'People', url: 'https://people.com/feed/', icon: '💋' },
];

export async function GET() {
  let allItems: any[] = [];

  const feedPromises = FEEDS.map(async (feedConfig) => {
    try {
      const feed = await parser.parseURL(feedConfig.url);
      const source = new URL(feedConfig.url).hostname.replace('www.', '');

      const items = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        description: (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').substring(0, 120) + '...',
        image: item.enclosure?.url 
               || item.content?.match(/<img.*?src="(.*?)"/)?.[1] 
               || `https://picsum.photos/seed/${item.guid || item.title}/600/400`,
        source: feedConfig.name,
        icon: feedConfig.icon,
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        guid: item.guid || item.link || item.title,
      }));
      return items;
    } catch (e) {
      console.error('Errore feed:', feedConfig.url, e);
      return []; // Restituisce un array vuoto in caso di errore per non bloccare tutto
    }
  });

  const results = await Promise.all(feedPromises);
  allItems = results.flat();

  // mescola per varietà e ordina per data
  allItems = allItems
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return NextResponse.json(allItems);
}

// Revalidate every hour
export const revalidate = 3600;
