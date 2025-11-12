
'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adHtml: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adHtml }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      adRef.current.innerHTML = adHtml;
      const scripts = Array.from(adRef.current.getElementsByTagName('script'));
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [adHtml]);

  return <div ref={adRef} className="w-full h-full flex items-center justify-center" />;
};

export default AdBanner;
