
'use client'

import { useEffect } from 'react';
import Head from 'next/head';

export default function LikeFlowPage() {
  useEffect(() => {
    // This script will be run on the client side after the component mounts.
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      // FIREBASE SETUP
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
      import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
      import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",
        authDomain: "studio-8742723834-1421e.firebaseapp.com",
        projectId: "studio-8742723834-1421e",
        storageBucket: "studio-8742723834-1421e.appspot.com",
        messagingSenderId: "665625375719",
        appId: "1:665625375719:web:d680c46b80cd64e3578342"
      };
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const storage = getStorage(app);

      // PREVIEW
      const mediaFileInput = document.getElementById("mediaFile");
      if (mediaFileInput) {
        mediaFileInput.addEventListener("change", (event) => {
            const f = event.target.files[0];
            if (!f) return;

            const preview = document.getElementById("preview");
            preview.style.display = "block";

            if (f.type.startsWith("video")) {
                preview.innerHTML = \`<video controls style="width:100%;border-radius:10px;"><source src="\${URL.createObjectURL(f)}"></video>\`;
            } else if (f.type.startsWith("image")) {
                preview.innerHTML = \`<img src="\${URL.createObjectURL(f)}" style="width:100%;border-radius:10px;">\`;
            } else {
                preview.innerHTML = \`<audio controls src="\${URL.createObjectURL(f)}"></audio>\`;
            }
        });
      }

      // SAVE POST
      async function savePost(mediaUrl, mediaType, authorPhotoUrl, authorDescription, premium) {
          await addDoc(collection(db, "posts"), {
              mediaUrl,
              mediaType,
              authorPhotoUrl: authorPhotoUrl || null,
              authorDescription: authorDescription || null,
              likes: 0,
              premium: premium,
              timestamp: serverTimestamp()
          });
          alert("Pubblicato con successo!");
      }

      // FREE UPLOAD
      window.uploadFree = async function() {
          const last = localStorage.getItem("lf_last_upload");
          const today = new Date().toDateString();

          if (last === today) {
              alert("Hai già usato l'upload gratis oggi.");
              return;
          }

          await processUpload(false);

          localStorage.setItem("lf_last_upload", today);
      }

      // UPLOAD PROCESS
      async function processUpload(premium) {
          const file = document.getElementById("mediaFile").files[0];
          if (!file) return alert("Seleziona un file!");

          const authorPhoto = document.getElementById("authorPhoto").files[0];
          const desc = document.getElementById("authorDescription").value;

          const mediaPath = "media/" + Date.now() + "_" + file.name;
          const mediaRef = ref(storage, mediaPath);

          await uploadBytes(mediaRef, file);
          const mediaUrl = await getDownloadURL(mediaRef);

          let authorPhotoUrl = null;
          if (authorPhoto) {
              const authPath = "authors/" + Date.now() + "_" + authorPhoto.name;
              const authRef = ref(storage, authPath);
              await uploadBytes(authRef, authorPhoto);
              authorPhotoUrl = await getDownloadURL(authRef);
          }

          const mediaType = file.type.startsWith("video")
                              ? "video" :
                            file.type.startsWith("image")
                              ? "image" :
                              "audio";

          await savePost(mediaUrl, mediaType, authorPhotoUrl, desc, premium);
      }

      // PAYPAL BUTTON GENERATOR
      function paypalBtn(id, price, callback) {
        if(window.paypal) {
          window.paypal.Buttons({
              createOrder: (d,a)=>a.order.create({
                  purchase_units:[{ amount:{ value: price.toString() } }]
              }),
              onApprove: async (d,a)=>{
                  await callback();
              }
          }).render(id);
        }
      }

      // UPLOAD PACKS
      paypalBtn("#upload1", 1.00, async ()=>processUpload(true));
      paypalBtn("#upload10", 2.50, async ()=>processUpload(true));
      paypalBtn("#upload25", 5.00, async ()=>processUpload(true));

      // LIKE PACKS
      paypalBtn("#likes50", 1.00, ()=>alert("50 Like aggiunti al tuo wallet."));
      paypalBtn("#likes200", 3.00, ()=>alert("200 Like aggiunti al tuo wallet."));
      paypalBtn("#likes500", 5.00, ()=>alert("500 Like aggiunti al tuo wallet."));
      paypalBtn("#likes1500", 10.00, ()=>alert("1500 Like aggiunti al tuo wallet."));
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow – Upload</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=EUR" async></script>
        <style>{`
          body {
            background: #000;
            color: #fff;
            font-family: Arial, sans-serif;
          }
          .likeflow-container h1 {
              text-align: center;
              color: gold;
          }
          .likeflow-container .box {
              background: #111;
              padding: 18px;
              border-radius: 18px;
              margin-bottom: 22px;
              border: 1px solid #222;
          }
          .likeflow-container input, .likeflow-container textarea {
              width: 100%;
              margin: 8px 0;
              padding: 10px;
              border-radius: 12px;
              border: none;
              background: #222;
              color: #fff;
          }
          .likeflow-container .upload-btn {
              background: gold;
              color: #000;
              padding: 14px;
              border-radius: 12px;
              text-align: center;
              margin-top: 15px;
              cursor: pointer;
              font-weight: bold;
          }
          .likeflow-container .upload-btn:hover {
              background: #ffdd55;
          }
          .likeflow-container #preview {
              width: 100%;
              margin-top: 12px;
              border-radius: 14px;
              display: none;
          }
        `}</style>
      </Head>
      <div className="likeflow-container container mx-auto px-4 py-12">
        <h1>Upload Your Media</h1>

        <div className="box">
            <h2>🎥 Foto / Video / Audio</h2>
            <input type="file" id="mediaFile" accept="video/*,image/*,audio/*" />
            <div id="preview"></div>
        </div>

        <div className="box">
            <h2>🧑 Creator Info (Opzionale)</h2>

            <label>Foto Autore (opzionale)</label>
            <input type="file" id="authorPhoto" accept="image/*" />

            <label>Descrizione Autore (opzionale)</label>
            <textarea id="authorDescription" placeholder="Scrivi una breve bio..."></textarea>
        </div>

        <div className="box">
            <h2>🔥 1 Upload Gratis al Giorno</h2>
            <div className="upload-btn" onClick={() => (window as any).uploadFree()}>Carica Gratis</div>
        </div>

        <div className="box">
            <h2>🚀 Upload Extra</h2>
            <div id="upload1"></div><br />
            <div id="upload10"></div><br />
            <div id="upload25"></div>
        </div>

        <div className="box">
            <h2>💛 Buy Like Packs</h2>
            <div id="likes50"></div><br />
            <div id="likes200"></div><br />
            <div id="likes500"></div><br />
            <div id="likes1500"></div>
        </div>
      </div>
    </>
  );
}
