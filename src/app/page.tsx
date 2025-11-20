
import { AffiliatePrograms } from '@/components/affiliate-programs';
import { ContentSubmission } from '@/components/content-submission';
import { NewsSection } from '@/components/news-section';
import { newsSections, curiositaArticles } from '@/lib/data';
import { AiTrendAnalyzer } from '@/components/ai-trend-analyzer';
import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { PostingTimes } from '@/components/posting-times';

export default function Home() {
  return (
    <>
      <div className="px-6 pt-12 md:pt-16">
        {newsSections.map((section) => (
          <NewsSection key={section.id} {...section} />
        ))}

        <NewsSection
          id="curiosita"
          title="🤔 Curiosità & Lo Sapevi Che..."
          articles={curiositaArticles}
        />

        <AiTrendAnalyzer />

        <Hero />
        
        <div className="py-10">
          <StatsBar />
        </div>
        
        <AffiliatePrograms />
        
        <PostingTimes />

        <ContentSubmission />
      </div>
    </>
  );
}
