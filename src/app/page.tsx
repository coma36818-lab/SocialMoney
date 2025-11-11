
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
      <section id="video-principale" className="py-12 md:py-16">
        <div className="relative w-full overflow-hidden md:rounded-lg border-y md:border shadow-lg" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src="https://www.youtube.com/embed/lTyjzLc-gxg?si=_NzJIAjPSQdIbKyi"
            title="MyDatinGame Official Trailer - Trends, Gossip & Monetize"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <div className="px-6">
        <RssFeed />
        
        {newsSections.map((section) => (
          <NewsSection key={section.id} {...section} />
        ))}

        <NewsSection
          id="curiosita"
          title="🤔 Curiosità & Lo Sapevi Che..."
          articles={curiositaArticles}
        />

        <Hero />

        <div className="py-10">
          <StatsBar />
        </div>

        <AffiliatePrograms />

        <AiTrendAnalyzer />
        
        <PostingTimes />

        <ContentSubmission />
      </div>
    </>
  );
}
