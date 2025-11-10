import { AdSlot } from '@/components/ad-slot';
import { AffiliatePrograms } from '@/components/affiliate-programs';
import { AiTrendAnalyzer } from '@/components/ai-trend-analyzer';
import { ContentSubmission } from '@/components/content-submission';
import { Hero } from '@/components/hero';
import { NewsSection } from '@/components/news-section';
import { PostingTimes } from '@/components/posting-times';
import { StatsBar } from '@/components/stats-bar';
import { newsSections } from '@/lib/data';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ContentSubmission />
      {newsSections.map((section) => {
        if (section.id === 'guadagnare-social' || section.id === 'tips' || section.id === 'ai-analyzer' || section.id === 'affiliates' || section.id === 'posting-times') {
          return null;
        }
        return <NewsSection key={section.id} {...section} />
      })}
      <NewsSection {...newsSections.find(s => s.id === 'guadagnare-social')!} />
      <AdSlot />
      <NewsSection {...newsSections.find(s => s.id === 'tips')!} />
      <AffiliatePrograms />
      <AdSlot />
      <AiTrendAnalyzer />
      <PostingTimes />
    </>
  );
}
