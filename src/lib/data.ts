
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
  {
    label: 'Explore',
    isDropdown: true,
    items: [
      { href: '/#real-news', label: 'News' },
      { href: '/#gossip', label: 'Gossip' },
      { href: '/#influencer', label: 'Influencer' },
      { href: '/#cucina', label: 'Food' },
      { href: '/#cinema', label: 'Cinema' },
      { href: '/#games', label: 'Games' },
      { href: '/#handmade', label: 'Handmade' },
      { href: '/library', label: 'Game Library' },
    ],
  },
  { href: '/shop', label: 'Shop Page' },
  {
    label: 'LikeFlow',
    isDropdown: true,
    items: [
      { href: '/likeflow/upload', label: 'Upload' },
      { href: '/likeflow/feed', label: 'Feed' },
      { href: '/likeflow/top', label: 'Top Creators' },
      { href: '/likeflow/purchase', label: 'Buy Likes' },
    ],
  },
  { href: '/sponsor', label: 'Sponsor' },
  { href: '/#join-creators', label: 'Join' },
];


export const stats = [
  { number: '1.2M+', label: 'Monthly Readers' },
  { number: '500+', label: 'Daily Articles' },
  { number: '50+', label: 'Affiliate Partners' },
  { number: '24/7', label: 'Live Updates' },
];

export const creatorRoles = [
    { icon: '🎥', title: 'Video Creator', description: 'YouTube, TikTok, Reels' },
    { icon: '✍️', title: 'Blogger', description: 'Articles, Guides, Tutorials' },
    { icon: '📸', title: 'Influencer', description: 'Instagram, Social Media' },
    { icon: '🎨', title: 'Artist', description: 'Handmade, DIY, Art' },
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
                title: 'The VIP Couples of the Moment',
                description: 'Love, breakups, and reconciliations of the most beloved stars of 2025.',
                meta: '⏰ 1 hour ago',
                link: 'https://www.tmz.com/',
                linkText: 'Read the gossip →',
                internalLink: '/gossip/le-coppie-vip',
                internalLinkText: 'Read on DatinGame',
            },
            {
                image: getImage('red-carpet'),
                badge: 'Red Carpet',
                title: 'The Most Iconic Red Carpet Looks',
                description: 'The outfits that got everyone talking at the latest gala events.',
                meta: '⏰ 3 hours ago',
                link: 'https://www.eonline.com/news/red_carpet',
                linkText: 'See photos →',
            },
            {
                image: getImage('celebrity-drama'),
                badge: 'Drama',
                title: 'Celebrity Controversies',
                description: 'The most discussed moments and controversies that shook the VIP world.',
                meta: '⏰ 6 hours ago',
                link: 'https://pagesix.com/',
                linkText: 'Discover all →',
            },
        ],
    },
    {
        id: 'influencer',
        title: '📸 Influencer Posts',
        articles: [
            {
                image: getImage('instagram-influencer'),
                badge: 'Instagram',
                title: 'The Most Viral Posts on Instagram',
                description: 'The photos and reels that have garnered millions of likes this week.',
                meta: '⏰ 30 min ago',
                link: 'https://www.instagram.com/explore/',
                linkText: 'See on IG →',
            },
            {
                image: getImage('tiktok-trends'),
                badge: 'TikTok',
                title: 'TikTok Trends of the Day',
                description: 'The challenges and videos that are currently trending on the platform.',
                meta: '⏰ 1 hour ago',
                link: 'https://www.tiktok.com/discover',
                linkText: 'Watch →',
            },
            {
                image: getImage('youtube-creators'),
                badge: 'YouTube',
                title: 'Viral Videos from Creators',
                description: 'The YouTube content that has reached millions of views.',
                meta: '⏰ 2 hours ago',
                link: 'https://www.youtube.com/feed/trending',
                linkText: 'Watch videos →',
            },
        ],
    },
    {
        id: 'cucina',
        title: '🍳 Recipes & Cooking',
        articles: [
            {
                image: getImage('ricette-veloci'),
                badge: 'Recipes',
                title: 'Quick Everyday Recipes',
                description: 'Delicious dishes ready in 30 minutes or less, perfect for those with little time.',
                meta: '⏰ 2 hours ago',
                link: 'https://www.giallozafferano.it/',
                linkText: 'Cook now →',
            },
            {
                image: getImage('cucina-salutare'),
                badge: 'Healthy',
                title: 'Healthy and Tasty Dishes',
                description: 'Nutritious recipes that don\'t sacrifice flavor for a balanced diet.',
                meta: '⏰ 4 hours ago',
                link: 'https://www.eatingwell.com/',
                linkText: 'Discover →',
            },
            {
                image: getImage('ricette-virali'),
                badge: 'Viral',
                title: 'Viral TikTok Recipes',
                description: 'The dishes that have taken over social media and that you absolutely must try.',
                meta: '⏰ 5 hours ago',
                link: 'https://www.tasty.co/',
                linkText: 'Try it →',
            },
        ],
    },
    {
        id: 'cinema',
        title: '🎬 Cinema & TV Series',
        articles: [
            {
                image: getImage('nuovi-film'),
                badge: 'Cinema',
                title: 'Must-See Films in 2025',
                description: 'The most anticipated movie releases of the year with trailers and reviews.',
                meta: '⏰ 3 hours ago',
                link: 'https://www.imdb.com/movies-coming-soon/',
                linkText: 'Watch trailers →',
            },
            {
                image: getImage('serie-tv'),
                badge: 'TV Series',
                title: 'Binge-Worthy TV Series',
                description: 'The most compelling series on Netflix, Prime Video, and Disney+ to watch right now.',
                meta: '⏰ 4 hours ago',
                link: 'https://www.netflix.com/browse',
                linkText: 'Watch →',
            },
            {
                image: getImage('recensioni-film'),
                badge: 'Reviews',
                title: 'Reviews and Previews',
                description: 'Our opinions on the latest films and series with ratings and comments.',
                meta: '⏰ 6 hours ago',
                link: 'https://www.rottentomatoes.com/',
                linkText: 'Read →',
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
                title: 'New Video Game Releases 2025',
                description: 'The most anticipated games for PC, PlayStation, Xbox, and Nintendo Switch.',
                meta: '⏰ 2 hours ago',
                link: 'https://www.ign.com/games/reviews',
                linkText: 'Discover →',
            },
            {
                image: getImage('gaming-setup'),
                badge: 'Setup',
                title: 'Professional Gaming Setups',
                description: 'The best hardware configurations for an optimal gaming experience.',
                meta: '⏰ 5 hours ago',
                link: 'https://www.pcgamer.com/',
                linkText: 'See setups →',
            },
            {
                image: getImage('esports'),
                badge: 'Esports',
                title: 'Esports Tournaments and Competitions',
                description: 'Follow the best players and teams in international competitions.',
                meta: '⏰ 7 hours ago',
                link: 'https://www.espn.com/esports/',
                linkText: 'Follow →',
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
                title: 'Creative DIY Projects',
                description: 'Original ideas to create unique objects with your own hands.',
                meta: '⏰ 3 hours ago',
                link: 'https://www.etsy.com/c/craft-supplies-and-tools',
                linkText: 'Create →',
            },
            {
                image: getImage('handmade-crafts'),
                badge: 'Handmade',
                title: 'Unique Handmade Creations',
                description: 'Discover the art of handmade: jewelry, decorations, and much more.',
                meta: '⏰ 4 hours ago',
                link: 'https://www.pinterest.com/search/pins/?q=handmade%20crafts',
                linkText: 'Get inspired →',
            },
            {
                image: getImage('home-decor-diy'),
                badge: 'Home Decor',
                title: 'DIY Home Decorations',
                description: 'Transform your home with affordable and impressive DIY projects.',
                meta: '⏰ 6 hours ago',
                link: 'https://www.youtube.com/results?search_query=diy+home+decor',
                linkText: 'Tutorials →',
            },
        ],
    },
     {
        id: 'guadagnare-social',
        title: '💰 How to Earn on Social Media',
        articles: [
            {
                image: getImage('monetizzazione'),
                badge: 'Monetization',
                title: 'Strategies to Monetize Instagram',
                description: 'Learn how to turn your Instagram profile into a source of income with sponsorships and affiliate marketing.',
                meta: '⏰ 1 hour ago',
                link: 'https://business.instagram.com/',
                linkText: 'Start →',
            },
            {
                image: getImage('youtube-earnings'),
                badge: 'YouTube',
                title: 'Earning with YouTube in 2025',
                description: 'Everything you need to know about AdSense, sponsorships, and memberships to monetize your videos.',
                meta: '⏰ 2 hours ago',
                link: 'https://www.youtube.com/creators/',
                linkText: 'Learn how →',
            },
            {
                image: getImage('affiliate-marketing'),
                badge: 'Affiliate',
                title: 'Affiliate Marketing for Beginners',
                description: 'A complete guide to start earning with affiliate programs on TikTok, Instagram, and blogs.',
                meta: '⏰ 3 hours ago',
                link: 'https://www.shopify.com/blog/affiliate-marketing',
                linkText: 'Learn →',
            },
            {
                image: getImage('creator-economy'),
                badge: 'Creator Tips',
                title: 'Become a Professional Creator',
                description: 'The secrets of top creators to build a personal brand and make a living from digital content.',
                meta: '⏰ 4 hours ago',
                link: 'https://creatoreconomy.so/',
                linkText: 'Read →'
            },
            {
                image: getImage('tiktok-money'),
                badge: 'TikTok',
                title: 'TikTok Creator Fund and Sponsorships',
                description: 'How to access the TikTok Creator Fund and get brand deals with companies.',
                meta: '⏰ 5 hours ago',
                link: 'https://www.tiktok.com/creators/',
                linkText: 'Start →'
            },
            {
                image: getImage('digital-products'),
                badge: 'Digital Products',
                title: 'Selling Digital Products Online',
                description: 'Create and sell online courses, ebooks, presets, and templates to generate passive income.',
                meta: '⏰ 6 hours ago',
                link: 'https://gumroad.com/',
                linkText: 'Sell →'
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
    title: '🧠 Fun Fact of the Day',
    description: "Did you know that honey is the only food that never spoils? Archaeologists have found pots of honey in Egyptian tombs that are still perfectly edible after 3000 years!",
  },
  {
    image: getImage('africa'),
    badge: 'Geography',
    title: '🌍 Surprising Geography',
    description: "Africa is the only continent that spans all four hemispheres: north, south, east, and west. Incredible, right?",
  },
  {
    image: getImage('cinema-trivia'),
    badge: 'Cinema',
    title: '🎬 Cinema Trivia',
    description: 'James Cameron\'s movie "Avatar" took 4 years to complete and used technologies never before seen in cinema.',
  },
  {
    image: getImage('minecraft'),
    badge: 'Gaming',
    title: '🎮 Gaming Facts',
    description: 'The best-selling video game of all time is Minecraft with over 300 million copies sold worldwide!',
  },
  {
    image: getImage('pizza-trivia'),
    badge: 'Food',
    title: '🍕 Food Trivia',
    description: 'Margherita pizza is named after Queen Margherita of Savoy and its colors represent the Italian flag: red (tomato), white (mozzarella), green (basil).',
  },
  {
    image: getImage('iphone-trivia'),
    badge: 'Tech',
    title: '📱 Tech Curiosity',
    description: "The first iPhone was launched in 2007 and didn't even have the App Store! Apps arrived only a year later.",
  },
];

export const footerSectionsData = {
    categories: {
        title: 'Categories',
        links: [
            { href: '/#real-news', label: 'News' },
            { href: '/#gossip', label: 'Gossip & VIP' },
            { href: '/#influencer', label: 'Influencers' },
            { href: '/#cucina', label: 'Cooking' },
            { href: '/#cinema', label: 'Cinema & TV Series' },
            { href: '/#games', label: 'Gaming' },
            { href: '/#handmade', label: 'Handmade' },
        ],
    },
    resources: {
        title: 'Resources',
        links: [
            { href: '/#affiliates', label: 'Affiliate Programs' },
            { href: '/#tips', label: 'Creator Tips' },
            { href: '/#ai-analyzer', label: 'AI Trend Analyzer' },
            { href: '/#guadagnare-social', label: 'Monetize Social Media' },
            { href: '/#join-creators', label: 'Participate' },
        ],
    },
};


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

    