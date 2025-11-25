
'use client';
import { useEffect } from 'react';
import Head from 'next/head';

export default function PurchasePage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=EUR';
    document.body.appendChild(script);

    const likeflowScript = document.createElement('script');
    likeflowScript.type = 'module';
    likeflowScript.src = '/paypal.js';
    document.body.appendChild(likeflowScript);
    
    return () => {
        if(script.parentNode) document.body.removeChild(script);
        if(likeflowScript.parentNode) document.body.removeChild(likeflowScript);
    };
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow - Buy Likes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container mx-auto px-4 py-12 text-white">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'gold' }}>Buy Like Packs</h1>
        <div className="max-w-md mx-auto">
            <div className="box">
                <h2>💛 Buy Like Packs</h2>
                <div id="likes50" className="mb-4"></div>
                <div id="likes200" className="mb-4"></div>
                <div id="likes500" className="mb-4"></div>
                <div id="likes1500"></div>
            </div>
        </div>
      </div>
    </>
  );
}

    