
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
      <section id="frankenstein-trailer" className="pb-12 md:pb-16 lg:pt-12">
        <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src="https://www.youtube.com/embed/8aulMPhE12g?si=xpIfu7n8J4dm3sLx"
            title="Frankenstein | Guillermo del Toro | Official Trailer | Netflix"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="px-6 py-8 text-center bg-card/10 md:rounded-b-lg">
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">Frankenstein by Guillermo del Toro | Official Trailer</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Oscar-winning director Guillermo del Toro adapts Mary Shelley’s classic tale of Victor Frankenstein, a brilliant but egotistical scientist who brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation. Coming to Netflix on November 7.
          </p>
          <div className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-4 flex-wrap">
            <span>11.6M+ views</span>
            <span>•</span>
            <span>Premiered on Oct 1, 2025</span>
            <span>•</span>
            <span className="font-semibold text-primary">#Frankenstein</span>
          </div>
        </div>
      </section>

      <section id="video-principale" className="pb-12 md:pb-16">
        <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src="https://www.youtube.com/embed/lTyjzLc-gxg?si=_NzJIAjPSQdIbKyi"
            title="Miu Miu Spring/Summer 2026 Fashion Show"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <div className="px-6 py-8 text-center bg-card/10 md:rounded-b-lg">
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">Miu Miu Spring/Summer 2026 by Miuccia Prada</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The Miu Miu Spring/Summer 2026 collection is a consideration of the work of women - its importance, significance, and relevance. It reflects on their challenges and experiences, confronting and valorizing the invisibility of their work. Shoes, handbags, and accessories articulate a sense of robustness and utility—an industrial beauty.
          </p>
          <div className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-4 flex-wrap">
            <span>7.7M+ views</span>
            <span>•</span>
            <span>Live streamed on Oct 6, 2025</span>
            <span>•</span>
            <span className="font-semibold text-primary">#MiuMiuSS26</span>
          </div>
        </div>
      </section>

      <div className="px-6">
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
