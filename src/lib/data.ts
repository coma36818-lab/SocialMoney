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
  { href: '#real-news', label: 'News' },
  { href: '#gossip', label: 'Gossip' },
  { href: '#influencer', label: 'Influencer' },
  { href: '#cucina', label: 'Food' },
  { href: '#cinema', label: 'Cinema' },
  { href: '#games', label: 'Games' },
  { href: '#handmade', label: 'Handmade' },
  { href: '#join-creators', label: 'Join' },
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
        title: '🔥 Latest Real-Time News',
        articles: [
            {
                image: getImage('breaking-news'),
                badge: 'Breaking News',
                title: 'Today\'s Most Important News',
                description: 'Discover the most relevant events happening right now around the world.',
                meta: '⏰ 2 hours ago',
                link: 'https://www.bbc.com/news',
                linkText: 'Read more →',
            },
            {
                image: getImage('tech-news'),
                badge: 'Technology',
                title: 'New Tech Innovations 2025',
                description: 'Latest news from the tech world: AI, smartphones, gadgets and much more.',
                meta: '⏰ 4 hours ago',
                link: 'https://techcrunch.com/',
                linkText: 'Discover →',
            },
            {
                image: getImage('business-news'),
                badge: 'Business',
                title: 'Global Market Trends',
                description: 'Economic analysis and investment opportunities for 2025.',
                meta: '⏰ 5 hours ago',
                link: 'https://www.bloomberg.com/',
                linkText: 'Learn more →',
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
            {
                image: getImage('creator-economy'),
                badge: 'Creator Tips',
                title: 'Diventare Creator Professionista',
                description: 'I segreti dei top creator per costruire un brand personale e vivere di contenuti digitali.',
                meta: '⏰ 4 ore fa',
                link: 'https://creatoreconomy.so/',
                linkText: 'Leggi →'
            },
            {
                image: getImage('tiktok-money'),
                badge: 'TikTok',
                title: 'TikTok Creator Fund e Sponsorizzazioni',
                description: 'Come accedere al Creator Fund di TikTok e ottenere brand deal con le aziende.',
                meta: '⏰ 5 ore fa',
                link: 'https://www.tiktok.com/creators/',
                linkText: 'Inizia →'
            },
            {
                image: getImage('digital-products'),
                badge: 'Prodotti Digitali',
                title: 'Vendere Prodotti Digitali Online',
                description: 'Crea e vendi corsi online, ebook, preset e template per generare reddito passivo.',
                meta: '⏰ 6 ore fa',
                link: 'https://gumroad.com/',
                linkText: 'Vendi →'
            }
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
             {
                image: getImage('timing'),
                badge: 'Timing',
                title: '⏰ Timing Is Everything',
                description: 'Post when your audience is most active. Instagram: 6-8PM weekdays. TikTok: 7-10PM. Test and track your best times.'
            },
            {
                image: getImage('behind-the-scenes'),
                badge: 'Content',
                title: '💡 Behind-The-Scenes Content',
                description: 'Show your process, failures, and real moments. Authenticity builds deeper connections and higher engagement rates.'
            },
            {
                image: getImage('analytics'),
                badge: 'Analytics',
                title: '📊 Data-Driven Decisions',
                description: 'Analyze your top 10 posts monthly. Double down on what works. Cut what doesn\'t. Let data guide your content strategy.'
            }
        ]
    }
];

export const curiositaArticles = [
  {
    image: getImage('miele'),
    badge: 'Food Facts',
    title: '🧠 Fatto Curioso del Giorno',
    description: "Lo sapevi che il miele è l'unico alimento che non scade mai? Gli archeologi hanno trovato vasetti di miele nelle tombe egizie ancora perfettamente commestibili dopo 3000 anni!",
  },
  {
    image: getImage('africa'),
    badge: 'Geografia',
    title: '🌍 Geografia Sorprendente',
    description: "L'Africa è l'unico continente che si estende in tutti e quattro gli emisferi: nord, sud, est e ovest. Incredibile vero?",
  },
  {
    image: getImage('cinema-trivia'),
    badge: 'Cinema',
    title: '🎬 Cinema Trivia',
    description: 'Il film "Avatar" di James Cameron ha impiegato 4 anni per essere completato e ha utilizzato tecnologie mai viste prima nel cinema.',
  },
  {
    image: getImage('minecraft'),
    badge: 'Gaming',
    title: '🎮 Gaming Facts',
    description: 'Il videogioco più venduto di tutti i tempi è Minecraft con oltre 300 milioni di copie vendute in tutto il mondo!',
  },
  {
    image: getImage('pizza-trivia'),
    badge: 'Food',
    title: '🍕 Food Trivia',
    description: 'La pizza Margherita prende il nome dalla Regina Margherita di Savoia e i suoi colori rappresentano la bandiera italiana: rosso (pomodoro), bianco (mozzarella), verde (basilico).',
  },
  {
    image: getImage('iphone-trivia'),
    badge: 'Tech',
    title: '📱 Tech Curiosity',
    description: "Il primo iPhone è stato lanciato nel 2007 e non aveva nemmeno l'App Store! Le app sono arrivate solo un anno dopo.",
  },
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
