'use client';

import { useEffect } from 'react';
import { Button } from './ui/button';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

export function CookieBanner() {
    const { consent, showBanner, accept, decline } = useCookieConsent();

    // The ad initialization logic has been moved to AdSlot.tsx
    // to ensure ads are only pushed when the slot is rendered.

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 max-w-md w-[calc(100%-2rem)] z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="bg-background/80 backdrop-blur-md border border-border p-6 rounded-lg shadow-2xl">
            <h4 className="font-bold text-lg mb-2">🍪 We Value Your Privacy</h4>
            <p className="text-sm text-muted-foreground mb-4">
                We use cookies and ads to provide personalized content and track affiliate conversions. Accept to enable full functionality.
            </p>
            <div className="flex gap-4">
                <Button onClick={accept} className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg">
                    Accept All
                </Button>
                <Button onClick={decline} variant="outline" className="flex-1">
                    Decline
                </Button>
            </div>
        </div>
    </div>
  );
}
