
'use client';
import { useState, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { storage, db } from '@/firebase/client';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PAYPAL_CLIENT_ID = "ASO-5bJbcS-tklhd-_M-DrZn6lNHwa7FGDjlUajxjiarfLvpAVQiTnO0A5SPDv4HXjlT7hz4St9d7d34";

const boostOptions = [
  { value: '1.00', label: '1 Boost Video' },
  { value: '3.00', label: '5 Boost Video' },
  { value: '5.00', label: '10 Boost Video' },
];

export default function SponsorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };

  const uploadFreeVideo = async () => {
    const lastUpload = localStorage.getItem("lastFreeUpload");
    const today = new Date().toDateString();

    if (lastUpload === today) {
      alert("Hai già caricato 1 video oggi. Usa i Boost Video!");
      return;
    }

    if (!videoFile) {
      alert("Seleziona un video!");
      return;
    }

    try {
      const path = "videos/free_" + Date.now() + ".mp4";
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, videoFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "videos"), {
        url: url,
        premium: false,
        timestamp: serverTimestamp()
      });

      localStorage.setItem("lastFreeUpload", today);
      alert("🎉 Video caricato! Ora è in cima alla homepage.");
    } catch (error) {
      console.error("Error uploading free video:", error);
      alert("An error occurred during upload. Please try again.");
    }
  };

  const uploadPremiumVideo = async () => {
    if (!videoFile) {
      alert("Seleziona un video prima di completare il pagamento!");
      throw new Error("No video selected");
    }

    try {
      const path = "videos/premium_" + Date.now() + ".mp4";
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, videoFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "videos"), {
        url: url,
        premium: true,
        boosted: true,
        timestamp: serverTimestamp()
      });

      alert("🚀 Video Premium caricato con successo! È ora al TOP.");
    } catch (error) {
      console.error("Error uploading premium video:", error);
      alert("An error occurred during premium upload. Please contact support.");
      throw error;
    }
  };

  const createOrder = (amount: string): PayPalButtonsComponentProps['createOrder'] => (data, actions) => {
    if (!videoFile) {
      alert("Seleziona un video prima di procedere con il pagamento!");
      return Promise.reject(new Error("No video file selected."));
    }
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount,
          currency_code: 'EUR'
        }
      }]
    });
  };

  const onApprove = (boostLabel: string): PayPalButtonsComponentProps['onApprove'] => async (data, actions) => {
    try {
      await actions.order?.capture();
      await uploadPremiumVideo();
      alert(`Pagamento completato! ${boostLabel} acquistato!`);
    } catch (error) {
      console.error("Payment or upload failed:", error);
      alert("C'è stato un problema con il pagamento o il caricamento. Riprova.");
    }
  };

  return (
    <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, currency: "EUR" }}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Carica i tuo Video</h1>

        <div className="box flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">🔥 Caricamento Gratuito</h2>
          <input
            type="file"
            id="videoInput"
            accept="video/mp4,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {videoPreview && (
            <video id="videoPreview" controls src={videoPreview} className="w-full rounded-lg mt-4"></video>
          )}
          <div className="upload-btn" onClick={uploadFreeVideo}>
            Carica Gratis
          </div>
        </div>

        <div className="box">
          <h2 className="text-2xl font-bold mb-2">🚀 Vuoi caricare più video oggi?</h2>
          <p className="text-muted-foreground mb-6">Compra i Boost Video e finisci SUBITO in alto sulla homepage.</p>
          <div className="space-y-4">
            {boostOptions.map(option => (
              <div key={option.value}>
                <p className="mb-2">{option.label} - €{option.value}</p>
                <PayPalButtons
                  style={{ layout: "horizontal", label: 'pay' }}
                  createOrder={createOrder(option.value)}
                  onApprove={onApprove(option.label)}
                  onError={(err) => console.error("PayPal Error:", err)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
