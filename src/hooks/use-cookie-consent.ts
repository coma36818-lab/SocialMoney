'use client';

import { useState, useEffect, useCallback } from 'react';

const COOKIE_CONSENT_KEY = 'md_cookie_consent';

type Consent = 'accepted' | 'declined' | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as Consent;
    if (storedConsent) {
      setConsent(storedConsent);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setShowBanner(false);
  }, []);

  const decline = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setConsent('declined');
    setShowBanner(false);
  }, []);

  return { consent, showBanner, accept, decline };
}
