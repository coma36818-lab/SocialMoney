
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
      <section id="video-principale" className="pb-12 md:pb-16">
        <div className="relative w-full overflow-hidden md:rounded-lg md:border-y md:border shadow-lg" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src="https://www.youtube.com/embed/lTyjzLc-gxg?si=_NzJIAjPSQdIbKyi"
            title="MyDatinGame Official Trailer - Trends, Gossip & Monetize"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="px-6 py-8 text-center bg-card/10 md:rounded-b-lg">
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">MyDatinGame: La Tua Collezione Digitale per il 2025</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Esplora le ultime tendenze, i gossip più esclusivi e le strategie per monetizzare la tua passione. MyDatinGame è una riflessione sul lavoro dei creator digitali: ne celebra l'importanza e la rilevanza. Affrontiamo le sfide del mondo digitale, dando valore e visibilità al tuo lavoro.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Trasmesso in live streaming il giorno 6 ott 2025
          </p>
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
