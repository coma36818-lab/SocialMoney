import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppHeader } from '@/components/header';
import { AppFooter } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/cookie-banner';

const siteConfig = {
  name: 'MyDatingame',
  url: 'https://mydatingame.com',
  ogImage: 'https://mydatingame.com/og-image.jpg',
  description: 'Your daily hub for influencer tips, trends & opportunities — influencer marketing, AI trends, social media growth and digital news 2025.',
  keywords: "influencer, social media, affiliate marketing, AI trends, creator tools, monetization, digital marketing, 2025 trends"
};

export const metadata: Metadata = {
  title: 'MyDatingame – Grow Your Influence & Earn Online',
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'MyDatingame', url: siteConfig.url }],
  creator: 'MyDatingame',
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
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
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@MyDatingame',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
      'it-IT': '/it',
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e27' },
    { media: '(prefers-color-scheme: light)', color: 'white' },
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "MyDatingame",
            "url": "https://mydatingame.com",
            "logo": "https://mydatingame.com/favicon.ico",
            "sameAs": [
              "https://www.instagram.com/yourprofile",
              "https://www.tiktok.com/@yourprofile"
            ]
        })}} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5195762211359589" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-5195762211359589" />
      </head>
      <body className={cn("font-body antialiased", )}>
        <div className="bg-animation"></div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1">{children}</main>
          <AppFooter />
        </div>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
