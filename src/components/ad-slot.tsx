// This component is a placeholder for AdSense ads.
// The actual ad loading is handled by the script in the layout and cookie consent.

'use client';

import { useCookieConsent } from '@/hooks/use-cookie-consent';

export function AdSlot() {
    const { consent } = useCookieConsent();

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
        <div className="flex items-center justify-center min-h-[250px] rounded-lg border-2 border-dashed border-border bg-card/30">
            {/* AdSense will automatically place an ad here if configured correctly */}
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5195762211359589"
                data-ad-slot="6986146564" // Example slot, replace if needed
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            <p className="text-muted-foreground">Advertisement</p>
        </div>
    </div>
  );
}
