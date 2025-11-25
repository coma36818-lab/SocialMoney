
'use client'

import { useEffect } from 'react';
import Head from 'next/head';

export default function LikeFlowPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/likeflow.js';
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow - Upload</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
              margin: 0;
              background: #000;
              color: #fff;
              font-family: Arial, sans-serif;
              padding: 20px;
          }
      
          .container {
              max-width: 500px;
              margin: auto;
          }
      
          h1 {
              text-align: center;
              font-size: 26px;
              font-weight: 800;
              color: gold;
          }
      
          label {
              font-size: 14px;
              font-weight: bold;
              color: #fff;
          }
      
          input, textarea {
              width: 100%;
              margin: 8px 0;
              padding: 10px;
              border-radius: 8px;
              border: none;
              background: #222;
              color: #fff;
          }
      
          .upload-box {
              border: 2px dashed gold;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
          }
      
          button {
              width: 100%;
              padding: 15px;
              font-size: 18px;
              background: gold;
              border: none;
              border-radius: 10px;
              color: #000;
              font-weight: bold;
              margin-top: 15px;
              cursor: pointer;
          }
        `}</style>
      </Head>
      <div className="container">
        <h1>Upload Post</h1>
        <label>Nome autore (opzionale)</label>
        <input id="authorName" placeholder="Es. Marco, LadyPhoto, Anonimo…" />
        <label>Foto autore (opzionale)</label>
        <input type="file" id="authorPhoto" accept="image/*" />
        <label>Descrizione del post (opzionale)</label>
        <textarea id="postDesc" rows={3} placeholder="Scrivi una descrizione…"></textarea>
        <label>Carica Video / Foto / Audio</label>
        <div className="upload-box">
            <input type="file" id="mediaFile" accept="video/*,image/*,audio/*" />
        </div>
        <button onClick={() => (window as any).uploadPost()}>Carica Post</button>
      </div>
    </>
  );
}
