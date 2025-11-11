
import { AffiliatePrograms } from '@/components/affiliate-programs';
import { AiTrendAnalyzer } from '@/components/ai-trend-analyzer';
import { ContentSubmission } from '@/components/content-submission';
import { Hero } from '@/components/hero';
import { NewsSection } from '@/components/news-section';
import { PostingTimes } from '@/components/posting-times';
import { RssFeed } from '@/components/rss-feed';
import { StatsBar } from '@/components/stats-bar';
import { newsSections, curiositaArticles } from '@/lib/data';

export default function Home() {
  return (
    <>
      <Hero />
      <div className="py-10">
        <StatsBar />
      </div>

      <RssFeed />
      
      {newsSections.map((section) => (
        <NewsSection key={section.id} {...section} />
      ))}

      <NewsSection
        id="curiosita"
        title="🤔 Curiosità & Lo Sapevi Che..."
        articles={curiositaArticles}
      />

      <AffiliatePrograms />

      <AiTrendAnalyzer />
      
      <PostingTimes />

      <ContentSubmission />
    </>
  );
}
