import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    // Fallback image
    return {
      id: 'fallback',
      imageUrl: 'https://picsum.photos/seed/fallback/600/400',
      description: 'A fallback image',
      imageHint: 'abstract',
    };
  }
  return image;
};

export const navLinks = [
  { href: '#real-news', label: 'Notizie' },
  { href: '#gossip', label: 'Gossip' },
  { href: '#influencer', label: 'Influencer' },
  { href: '#cucina', label: 'Cucina' },
  { href: '#cinema', label: 'Cinema' },
  { href: '#games', label: 'Games' },
  { href: '#handmade', label: 'Handmade' },
  { href: '#join-creators', label: 'Partecipa' },
];

export const stats = [
  { number: '1.2M+', label: 'Monthly Readers' },
  { number: '500+', label: 'Daily Articles' },
  { number: '50+', label: 'Affiliate Partners' },
  { number: '24/7', label: 'Live Updates' },
];

export const creatorRoles = [
    { icon: '🎥', title: 'Video Creator', description: 'YouTube, TikTok, Reels' },
    { icon: '✍️', title: 'Blogger', description: 'Articoli, Guide, Tutorial' },
    { icon: '📸', title: 'Influencer', description: 'Instagram, Social Media' },
    { icon: '🎨', title: 'Artista', description: 'Handmade, DIY, Arte' },
];

export const newsSections = [
    {
        id: 'real-news',
        title: '🔥 Ultime Notizie in Tempo Reale',
        articles: [
            {
                image: getImage('breaking-news'),
                badge: 'Breaking News',
                title: 'Le Notizie Più Importanti del Giorno',
                description: 'Scopri gli eventi più rilevanti che stanno accadendo in questo momento nel mondo.',
                meta: '⏰ 2 ore fa',
                link: 'https://www.bbc.com/news',
                linkText: 'Leggi tutto →',
            },
            {
                image: getImage('tech-news'),
                badge: 'Tecnologia',
                title: 'Nuove Innovazioni Tecnologiche 2025',
                description: 'Le ultime novità dal mondo tech: AI, smartphone, gadget e molto altro.',
                meta: '⏰ 4 ore fa',
                link: 'https://techcrunch.com/',
                linkText: 'Scopri →',
            },
            {
                image: getImage('business-news'),
                badge: 'Business',
                title: 'Tendenze del Mercato Globale',
                description: 'Analisi economiche e opportunità di investimento per il 2025.',
                meta: '⏰ 5 ore fa',
                link: 'https://www.bloomberg.com/',
                linkText: 'Approfondisci →',
            },
        ],
    },
    {
        id: 'gossip',
        title: '💋 Gossip & VIP',
        articles: [
            {
                image: getImage('celebrity-gossip'),
                badge: 'Gossip',
                title: 'Le Coppie VIP del Momento',
                description: 'Amori, rotture e riconciliazioni delle star più amate del 2025.',
                meta: '⏰ 1 ora fa',
                link: 'https://www.tmz.com/',
                linkText: 'Leggi il gossip →',
            },
            {
                image: getImage('red-carpet'),
                badge: 'Red Carpet',
                title: 'I Look Più Iconici del Red Carpet',
                description: 'Gli outfit che hanno fatto parlare di sé agli ultimi eventi di gala.',
                meta: '⏰ 3 ore fa',
                link: 'https://www.eonline.com/news/red_carpet',
                linkText: 'Vedi foto →',
            },
            {
                image: getImage('celebrity-drama'),
                badge: 'Drama',
                title: 'Le Controversie delle Star',
                description: 'I momenti più discussi e le polemiche che hanno scosso il mondo VIP.',
                meta: '⏰ 6 ore fa',
                link: 'https://pagesix.com/',
                linkText: 'Scopri tutto →',
            },
        ],
    },
    {
        id: 'influencer',
        title: '📸 Post degli Influencer',
        articles: [
            {
                image: getImage('instagram-influencer'),
                badge: 'Instagram',
                title: 'I Post Più Virali su Instagram',
                description: 'Le foto e i reel che hanno conquistato milioni di like questa settimana.',
                meta: '⏰ 30 min fa',
                link: 'https://www.instagram.com/explore/',
                linkText: 'Vedi su IG →',
            },
            {
                image: getImage('tiktok-trends'),
                badge: 'TikTok',
                title: 'Trend TikTok del Giorno',
                description: 'Le challenge e i video che stanno spopolando sulla piattaforma.',
                meta: '⏰ 1 ora fa',
                link: 'https://www.tiktok.com/discover',
                linkText: 'Guarda →',
            },
            {
                image: getImage('youtube-creators'),
                badge: 'YouTube',
                title: 'Video Virali dei Creator',
                description: 'I contenuti YouTube che hanno raggiunto milioni di visualizzazioni.',
                meta: '⏰ 2 ore fa',
                link: 'https://www.youtube.com/feed/trending',
                linkText: 'Guarda video →',
            },
        ],
    },
    {
        id: 'cucina',
        title: '🍳 Ricette & Cucina',
        articles: [
            {
                image: getImage('ricette-veloci'),
                badge: 'Ricette',
                title: 'Ricette Veloci per Tutti i Giorni',
                description: 'Piatti deliziosi pronti in 30 minuti o meno, perfetti per chi ha poco tempo.',
                meta: '⏰ 2 ore fa',
                link: 'https://www.giallozafferano.it/',
                linkText: 'Cucina ora →',
            },
            {
                image: getImage('cucina-salutare'),
                badge: 'Healthy',
                title: 'Piatti Sani e Gustosi',
                description: 'Ricette nutrienti che non rinunciano al sapore per una dieta equilibrata.',
                meta: '⏰ 4 ore fa',
                link: 'https://www.eatingwell.com/',
                linkText: 'Scopri →',
            },
            {
                image: getImage('ricette-virali'),
                badge: 'Viral',
                title: 'Le Ricette Virali di TikTok',
                description: 'I piatti che hanno conquistato i social media e che devi assolutamente provare.',
                meta: '⏰ 5 ore fa',
                link: 'https://www.tasty.co/',
                linkText: 'Prova →',
            },
        ],
    },
    {
        id: 'cinema',
        title: '🎬 Cinema & Serie TV',
        articles: [
            {
                image: getImage('nuovi-film'),
                badge: 'Cinema',
                title: 'Film da Non Perdere nel 2025',
                description: 'Le uscite cinematografiche più attese dell\'anno con trailer e recensioni.',
                meta: '⏰ 3 ore fa',
                link: 'https://www.imdb.com/movies-coming-soon/',
                linkText: 'Vedi trailer →',
            },
            {
                image: getImage('serie-tv'),
                badge: 'Serie TV',
                title: 'Serie TV da Binge-Watching',
                description: 'Le serie più avvincenti su Netflix, Prime Video e Disney+ da vedere subito.',
                meta: '⏰ 4 ore fa',
                link: 'https://www.netflix.com/browse',
                linkText: 'Guarda →',
            },
            {
                image: getImage('recensioni-film'),
                badge: 'Recensioni',
                title: 'Recensioni e Anticipazioni',
                description: 'Le nostre opinioni sui film e serie del momento con voti e commenti.',
                meta: '⏰ 6 ore fa',
                link: 'https://www.rottentomatoes.com/',
                linkText: 'Leggi →',
            },
        ],
    },
    {
        id: 'games',
        title: '🎮 Gaming & Esports',
        articles: [
            {
                image: getImage('nuovi-giochi'),
                badge: 'Gaming',
                title: 'Nuove Uscite Videogiochi 2025',
                description: 'I giochi più attesi per PC, PlayStation, Xbox e Nintendo Switch.',
                meta: '⏰ 2 ore fa',
                link: 'https://www.ign.com/games/reviews',
                linkText: 'Scopri →',
            },
            {
                image: getImage('gaming-setup'),
                badge: 'Setup',
                title: 'Setup Gaming Professionali',
                description: 'Le migliori configurazioni hardware per un\'esperienza di gioco ottimale.',
                meta: '⏰ 5 ore fa',
                link: 'https://www.pcgamer.com/',
                linkText: 'Vedi setup →',
            },
            {
                image: getImage('esports'),
                badge: 'Esports',
                title: 'Tornei e Competizioni Esports',
                description: 'Segui i migliori giocatori e team nelle competizioni internazionali.',
                meta: '⏰ 7 ore fa',
                link: 'https://www.espn.com/esports/',
                linkText: 'Segui →',
            },
        ],
    },
    {
        id: 'handmade',
        title: '🎨 Handmade & DIY',
        articles: [
            {
                image: getImage('diy-projects'),
                badge: 'DIY',
                title: 'Progetti Fai-Da-Te Creativi',
                description: 'Idee originali per creare oggetti unici con le tue mani.',
                meta: '⏰ 3 ore fa',
                link: 'https://www.etsy.com/c/craft-supplies-and-tools',
                linkText: 'Crea →',
            },
            {
                image: getImage('handmade-crafts'),
                badge: 'Handmade',
                title: 'Creazioni Artigianali Uniche',
                description: 'Scopri l\'arte del fatto a mano: gioielli, decorazioni e molto altro.',
                meta: '⏰ 4 ore fa',
                link: 'https://www.pinterest.com/search/pins/?q=handmade%20crafts',
                linkText: 'Ispirati →',
            },
            {
                image: getImage('home-decor-diy'),
                badge: 'Home Decor',
                title: 'Decorazioni Casa Fai-Da-Te',
                description: 'Trasforma la tua casa con progetti DIY economici e di grande effetto.',
                meta: '⏰ 6 ore fa',
                link: 'https://www.youtube.com/results?search_query=diy+home+decor',
                linkText: 'Tutorial →',
            },
        ],
    },
     {
        id: 'guadagnare-social',
        title: '💰 Come Guadagnare sui Social Media',
        articles: [
            {
                image: getImage('monetizzazione'),
                badge: 'Monetizzazione',
                title: 'Strategie per Monetizzare Instagram',
                description: 'Scopri come trasformare il tuo profilo Instagram in una fonte di reddito con sponsorizzazioni e affiliate marketing.',
                meta: '⏰ 1 ora fa',
                link: 'https://business.instagram.com/',
                linkText: 'Inizia →',
            },
            {
                image: getImage('youtube-earnings'),
                badge: 'YouTube',
                title: 'Guadagnare con YouTube nel 2025',
                description: 'Tutto quello che devi sapere su AdSense, sponsorizzazioni e membership per monetizzare i tuoi video.',
                meta: '⏰ 2 ore fa',
                link: 'https://www.youtube.com/creators/',
                linkText: 'Scopri come →',
            },
            {
                image: getImage('affiliate-marketing'),
                badge: 'Affiliate',
                title: 'Affiliate Marketing per Principianti',
                description: 'Guida completa per iniziare a guadagnare con i programmi di affiliazione su TikTok, Instagram e blog.',
                meta: '⏰ 3 ore fa',
                link: 'https://www.shopify.com/blog/affiliate-marketing',
                linkText: 'Impara →',
            },
        ],
    },
    {
        id: 'tips',
        title: 'Trending Tips for 2025',
        articles: [
             {
                image: getImage('micro-vlogs'),
                badge: 'Video Tips',
                title: '🎥 Micro-Vlogs Are King',
                description: '30-60 second "day in my life" videos are dominating. Show authentic moments, not perfection. Use trending audio and post consistently.',
            },
            {
                image: getImage('collaboration'),
                badge: 'Growth',
                title: '🤝 Collaboration Power',
                description: 'Partner with 2-3 micro-creators in your niche. Cross-promotion builds trust and expands reach faster than solo content.',
            },
            {
                image: getImage('hashtags'),
                badge: 'Strategy',
                title: '#️⃣ Smart Hashtag Strategy',
                description: 'Use 3 niche hashtags + 1 trending tag. Rotate weekly to avoid shadowban. Research what your audience actually searches for.',
            },
        ]
    }
];

export const affiliatePrograms = [
    { name: 'Amazon Associates', category: 'E-commerce Giant', description: 'Promote millions of products. Earn up to 10% commission on qualifying purchases.', link: 'https://affiliate-program.amazon.com/', logo: 'Amazon' },
    { name: 'Booking.com', category: 'Travel Bookings', description: 'Promote hotels and travel. Earn 25-40% commission on completed bookings.', link: 'https://partner.booking.com/', logo: 'Booking.com' },
    { name: 'Etsy Affiliates', category: 'Handmade & Vintage', description: 'Promote unique handmade items. Earn 4% commission on qualifying sales with 30-day cookies.', link: 'https://www.awin.com/gb/advertiser/etsy', logo: 'Etsy' },
    { name: 'YouTube Partner', category: 'Video Platform', description: 'Monetize your videos with ads, memberships, and Super Chat. Earn revenue from views.', link: 'https://www.youtube.com/creators/how-things-work/monetization/', logo: 'YouTube' },
    { name: 'Shopify Affiliates', category: 'E-commerce Platform', description: 'Promote Shopify stores. Earn up to $2,000 per merchant referral plus recurring commissions.', link: 'https://www.shopify.com/affiliates', logo: 'Shopify' },
    { name: 'Fiverr Affiliates', category: 'Freelance Services', description: 'Promote freelance services. Earn $15-$150 per first-time buyer depending on service category.', link: 'https://affiliates.fiverr.com/', logo: 'Fiverr' },
    { name: 'Canva Pro', category: 'Design Platform', description: 'Create stunning visuals for social media. Earn $36 per referral with 30-day cookie duration.', link: 'https://www.canva.com/affiliates/', logo: 'Canva' },
    { name: 'Bluehost', category: 'Web Hosting', description: 'Promote web hosting services. Earn $65-$130 per qualified signup with high conversion rates.', link: 'https://www.bluehost.com/affiliates', logo: 'Bluehost' },
];

export const postingTimes = [
    { platform: '📱 Instagram', times: 'Weekdays: 6:00 PM - 8:00 PM\nWeekends: 11:00 AM - 1:00 PM', details: 'Peak engagement during evening scrolling sessions.' },
    { platform: '🎵 TikTok', times: 'Daily: 7:00 PM - 10:00 PM\nSaturday: 9:00 AM - 11:00 AM', details: 'Late evening when users unwind with entertainment.' },
    { platform: '📘 Facebook', times: 'Lunch: 12:00 PM - 2:00 PM\nEvening: 5:00 PM - 7:00 PM', details: 'Target lunch breaks and post-work browsing.' },
    { platform: '🎥 YouTube', times: 'Weekdays: 2:00 PM - 4:00 PM\nWeekends: 9:00 AM - 11:00 AM', details: 'Afternoon and weekend morning viewing peaks.' },
    { platform: '🐦 Twitter/X', times: 'Weekdays: 8:00 AM - 10:00 AM\nLunch: 12:00 PM - 1:00 PM', details: 'Morning commute and lunch break engagement.' },
    { platform: '💼 LinkedIn', times: 'Weekdays: 7:00 AM - 9:00 AM\nLunch: 12:00 PM - 1:00 PM', details: 'Professional browsing before and during work.' },
];
