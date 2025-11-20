
import { AffiliatePrograms } from '@/components/affiliate-programs';
import { ContentSubmission } from '@/components/content-submission';
import { NewsSection } from '@/components/news-section';
import { newsSections, curiositaArticles } from '@/lib/data';
import { AiTrendAnalyzer } from '@/components/ai-trend-analyzer';
import { Hero } from '@/components/hero';
import { StatsBar } from '@/components/stats-bar';
import { PostingTimes } from '@/components/posting-times';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function RecommendedProducts() {
  return (
    <section id="recommended-products" className="py-12 md:py-20">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 text-center p-8 md:p-12 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-black text-foreground">🔥 Recommended Products for Creators</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Useful items for photos, videos, streaming, and social media.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40">
            <Link href="/shop">Go to Shop →</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}


export default function Home() {
  return (
    <>
      <div className="px-6 pt-12 md:pt-16">
        <NewsSection
          id="real-news"
          title="🔥 Latest Real-Time News"
          articles={newsSections.find(s => s.id === 'real-news')?.articles || []}
        />
        <NewsSection
          id="gossip"
          title="💋 Gossip & VIP"
          articles={newsSections.find(s => s.id === 'gossip')?.articles || []}
        />
        <NewsSection
          id="influencer"
          title="📸 Post degli Influencer"
          articles={newsSections.find(s => s.id === 'influencer')?.articles || []}
        />
        <NewsSection
          id="cucina"
          title="🍳 Ricette & Cucina"
          articles={newsSections.find(s => s.id === 'cucina')?.articles || []}
        />
        <NewsSection
          id="cinema"
          title="🎬 Cinema & Serie TV"
          articles={newsSections.find(s => s.id === 'cinema')?.articles || []}
        />
        <NewsSection
          id="games"
          title="🎮 Gaming & Esports"
          articles={newsSections.find(s => s.id === 'games')?.articles || []}
        />
        <NewsSection
          id="handmade"
          title="🎨 Handmade & DIY"
          articles={newsSections.find(s => s.id === 'handmade')?.articles || []}
        />

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

        <RecommendedProducts />
        
        <PostingTimes />

        <ContentSubmission />
      </div>
    </>
  );
}
