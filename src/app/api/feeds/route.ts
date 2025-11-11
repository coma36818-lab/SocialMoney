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
      console.warn('Feed fetching error for:', feedConfig.url, e);
      return []; // Return an empty array on error to not block other feeds
    }
  });

  try {
    const results = await Promise.all(feedPromises);
    allItems = results.flat();

    // Sort by date to get the most recent, then shuffle for variety
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    // Get top 50 recent items and shuffle them
    allItems = allItems.slice(0, 50).sort(() => Math.random() - 0.5);

    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Error processing feeds:", error);
    return NextResponse.json({ error: "Failed to process feeds" }, { status: 500 });
  }
}

// Revalidate every hour
export const revalidate = 3600;