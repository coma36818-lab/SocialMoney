'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  adHtml: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adHtml }) => {
  useEffect(() => {
    const scriptContainer = document.createElement('div');
    scriptContainer.innerHTML = adHtml;
    const adContainer = document.getElementById('ad-container');
    if (adContainer) {
      adContainer.appendChild(scriptContainer);
    }

    return () => {
      if (adContainer && adContainer.contains(scriptContainer)) {
        adContainer.removeChild(scriptContainer);
      }
    };
  }, [adHtml]);

  return <div id="ad-container" className="w-[728px] h-[90px] mx-auto"></div>;
};

export default AdBanner;
