'use client';
import { useEffect } from 'react';
import Head from 'next/head';

export default function PurchasePage() {
  useEffect(() => {
    // This script now handles all LikeFlow logic.
    // Ensure it's correctly placed in the /public folder.
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/likeflow.js';
    document.body.appendChild(script);

    // Attach the buyPack function to the window object
    (window as any).buyPack = (id: number) => {
        const pack: { likes: number; price: number } | undefined = {
            1: { likes: 10, price: 1.00 },
            2: { likes: 60, price: 3.00 },
            3: { likes: 150, price: 5.00 }
        }[id as keyof typeof pack];

        if (!pack) return;

        // open paypal
        window.open(
            "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=alibi81@libero.it" +
            "&currency_code=EUR&amount=" + pack.price +
            "&item_name=Acquisto+" + pack.likes + "+Like",
            "_blank"
        );

        // SIMULATION (PayPal redirect IPN)
        setTimeout(() => {
            (window as any).addWallet(pack.likes);
            alert("Like ricevuti!");
            window.location.href = "/likeflow/feed";
        }, 3000);
    };

    return () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Compra Like</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      
      <h1 className="title">❤️ Compra Like</h1>

      <div className="upload-container">
        <div className="pack" onClick={() => (window as any).buyPack(1)}>
            <h2>10 Like</h2>
            <p>€1.00</p>
        </div>

        <div className="pack" onClick={() => (window as any).buyPack(2)}>
            <h2>60 Like</h2>
            <p>€3.00</p>
        </div>

        <div className="pack" onClick={() => (window as any).buyPack(3)}>
            <h2>150 Like</h2>
            <p>€5.00</p>
        </div>
      </div>
    </>
  );
}
