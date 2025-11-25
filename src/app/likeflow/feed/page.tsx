
'use client';
import Head from 'next/head';
import { useEffect } from 'react';

export default function LikeFlowFeedPage() {
  useEffect(() => {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/styles.css';
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/likeflow.js';
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(style);
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow - Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div id="walletBox">
        Like disponibili: <span id="walletValue">0</span>
        <button id="buyBtn" onClick={() => window.location.href = '/likeflow/purchase'}>Compra Like</button>
      </div>
      <div id="feedContainer"></div>
    </>
  );
}

    