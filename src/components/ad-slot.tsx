'use client';

import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { useEffect, useRef } from 'react';

export function AdSlot() {
    const { consent } = useCookieConsent();
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consent !== 'accepted' || !adRef.current) {
            return;
        }

        const adElement = adRef.current;
        if (adElement.childElementCount > 0) {
            // Ad already loaded
            return;
        }

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry && entry.contentRect.width > 0) {
                // Now that the container has a width, we can push the ad.
                try {
                    // @ts-ignore
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error("AdSense push error:", e);
                }
                // Once the ad is pushed, we don't need to observe anymore.
                observer.disconnect();
            }
        });

        observer.observe(adElement);

        return () => {
            observer.disconnect();
        };

    }, [consent]);

    if (consent !== 'accepted') {
        return (
            <div className="container my-8">
                <div className="flex items-center justify-center min-h-[250px] rounded-lg border-2 border-dashed border-border bg-card/30">
                    <p className="text-muted-foreground">Ads disabled - Cookie consent required</p>
                </div>
            </div>
        );
    }

  return (
    <div className="container my-8">
        <div ref={adRef} className="flex items-center justify-center min-h-[250px] rounded-lg border-2 border-dashed border-border bg-card/30">
            {/* AdSense will automatically place an ad here if configured correctly */}
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5195762211359589"
                data-ad-slot="6986146564" // Example slot, replace if needed
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    </div>
  );
}
