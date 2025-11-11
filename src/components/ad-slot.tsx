'use client';

import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { useEffect, useRef } from 'react';

// Ad client from mydatingame/ads.txt
const AD_CLIENT = "ca-pub-5195762211359589";

interface AdSlotProps {
    adSlotId?: string; // Make slot ID optional, we can have a default
}

export function AdSlot({ adSlotId = "6986146564" }: AdSlotProps) {
    const { consent } = useCookieConsent();
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consent !== 'accepted' || !adRef.current) {
            return;
        }

        const pushAd = () => {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error("AdSense push error:", e);
            }
        };

        // Check if the ad container already has a size
        if (adRef.current.offsetWidth > 0) {
            pushAd();
        } else {
            // If not, wait for a bit and try again. This handles cases where CSS isn't fully applied yet.
            const timeoutId = setTimeout(pushAd, 200);
            return () => clearTimeout(timeoutId);
        }

    }, [consent, adSlotId]); // Rerun if consent or slotId changes

    if (consent !== 'accepted') {
        return (
            <div className="my-4">
                <div className="flex items-center justify-center min-h-[100px] md:min-h-[250px] rounded-lg border-2 border-dashed border-border bg-card/30">
                    <p className="text-muted-foreground text-sm p-4 text-center">Ads disabled - Cookie consent required</p>
                </div>
            </div>
        );
    }

  return (
    <div className="my-4">
        <div ref={adRef} className="flex items-center justify-center min-h-[100px] md:min-h-[250px] rounded-lg border-2 border-dashed border-border bg-card/30">
            {/* AdSense will automatically place an ad here if configured correctly */}
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={AD_CLIENT}
                data-ad-slot={adSlotId}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    </div>
  );
}