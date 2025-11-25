
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader } from '@/components/header';
import { AppFooter } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/cookie-banner';
import { ScrollToTop } from '@/components/scroll-to-top';
import Script from 'next/script';
import { WalletProvider } from '@/context/WalletContext';
import { SoundProvider } from '@/context/SoundContext';

const siteConfig = {
  name: 'MyDatinGame',
  url: 'https://mydatingame.com',
  ogImage: 'https://mydatingame.com/preview.jpg',
  description: 'MyDatinGame – Gossip, lifestyle, influencers, cinema, gaming, recipes, and viral trends. Your always-updated digital magazine.',
  keywords: "gossip, influencers, cinema, recipes, lifestyle, gaming, news, 2025 trends"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: 'MyDatinGame – Trends, Gossip, Fashion & Lifestyle Magazine 2025',
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'MyDatinGame', url: siteConfig.url }],
  creator: 'MyDatinGame',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'MyDatinGame – Trends, Gossip & Lifestyle',
    description: 'The most viral news and trends of 2025.',
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyDatinGame – Gossip and Trends',
    description: 'Everything viral in 2025.',
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon-192.png',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e27' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{scrollBehavior: 'smooth'}}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MyDatinGame",
            "url": "https://mydatingame.com",
            "logo": "https://mydatingame.com/logo.png",
            "sameAs": [
              "https://www.facebook.com/mydatingame",
              "https://www.instagram.com/mydatingame",
              "https://twitter.com/mydatingame"
            ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MyDatinGame",
            "url": "https://mydatingame.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://mydatingame.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
        })}} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5195762211359589" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-5195762211359589" />
        <link rel="manifest" href="/manifest.json" />
        <script>
          {`
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", () => {
                navigator.serviceWorker.register("/service-worker.js");
              });
            }
          `}
        </script>
      </head>
      <body className={cn("font-body antialiased", )}>
        <WalletProvider>
          <SoundProvider>
            <div className="bg-animation"></div>
            <div className="relative z-10 flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
              <AppFooter />
            </div>
            <Toaster />
            <CookieBanner />
            <ScrollToTop />
            <Script id="service-worker-script">
              {`
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js').then(registration => {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }, err => {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  });
                }
              `}
            </Script>
          </SoundProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
