
'use client';
import { AppHeader } from '@/components/header';
import { AppFooter } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/cookie-banner';
import { ScrollToTop } from '@/components/scroll-to-top';
import Script from 'next/script';
import { WalletProvider } from '@/context/WalletContext';
import { SoundProvider } from '@/context/SoundContext';
import { usePathname } from 'next/navigation';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLikeFlowPage = pathname.startsWith('/likeflow');

  return (
    <WalletProvider>
      <SoundProvider>
        <div className="bg-animation"></div>
        <div className="relative z-10 flex min-h-screen flex-col">
          {!isLikeFlowPage && <AppHeader />}
          <main className="flex-1">{children}</main>
          {!isLikeFlowPage && <AppFooter />}
        </div>
        <Toaster />
        {!isLikeFlowPage && <CookieBanner />}
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
  );
}
