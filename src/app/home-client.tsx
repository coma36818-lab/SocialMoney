'use client';

import { AiTrendAnalyzer } from '@/components/ai-trend-analyzer';
import { RssFeed } from '@/components/rss-feed';

export function HomeClient() {
  return (
    <>
      <RssFeed />
      <AiTrendAnalyzer />
    </>
  );
}
