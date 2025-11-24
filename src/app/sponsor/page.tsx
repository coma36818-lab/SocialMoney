
'use client';
import { useState, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { storage, db } from '@/firebase/client';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Star } from 'lucide-react';

const PAYPAL_CLIENT_ID = "ASO-5bJbcS-tklhd-_M-DrZn6lNHwa7FGDjlUajxjiarfLvpAVQiTnO0A5SPDv4HXjlT7hz4St9d7d34";

const boostOptions = [
  { value: '1.00', label: '1 Boost Video' },
  { value: '3.00', label: '5 Boost Videos' },
  { value: '5.00', label: '10 Boost Videos' },
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
      alert("You have already uploaded 1 video today. Use Boost Videos!");
      return;
    }

    if (!videoFile) {
      alert("Select a video!");
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
      alert("🎉 Video uploaded! It is now at the top of the homepage.");
    } catch (error) {
      console.error("Error uploading free video:", error);
      alert("An error occurred during upload. Please try again.");
    }
  };

  const uploadPremiumVideo = async () => {
    if (!videoFile) {
      alert("Select a video before completing the payment!");
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

      alert("🚀 Premium Video uploaded successfully! It is now at the TOP.");
    } catch (error) {
      console.error("Error uploading premium video:", error);
      alert("An error occurred during premium upload. Please contact support.");
      throw error;
    }
  };

  const createOrder = (amount: string): PayPalButtonsComponentProps['createOrder'] => (data, actions) => {
    if (!videoFile) {
      alert("Select a video before proceeding with the payment!");
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
      alert(`Payment completed! ${'10 Boost Videos' === boostLabel ? '10 Boost Videos and AI Trend Analyzer' : boostLabel} purchased!`);
    } catch (error) {
      console.error("Payment or upload failed:", error);
      alert("There was an issue with the payment or upload. Please try again.");
    }
  };

  return (
    <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, currency: "EUR" }}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">Upload Your Videos</h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Showcase your content on our homepage to a wide international audience of readers and creators.
        </p>

        <div className="box flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Free Upload</h2>
          <input
            type="file"
            id="videoInput"
            accept="video/mp4,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {videoPreview && (
            <video id="videoPreview" controls src={videoPreview} className="w-full rounded-lg mt-4 max-w-md"></video>
          )}
          <div className="upload-btn" onClick={uploadFreeVideo}>
            Upload for Free
          </div>
        </div>

        <div className="box flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-2">Want to upload more videos today?</h2>
          <p className="text-muted-foreground mb-6 text-center">Buy Boost Videos and get to the TOP of the homepage RIGHT AWAY.</p>
          <div className="space-y-4">
            {boostOptions.map(option => (
              <div key={option.value} id={`boost-${option.value.split('.')[0]}`} className="text-center">
                <p className="mb-2">{option.label} - €{option.value}</p>
                <PayPalButtons
                  style={{ layout: "horizontal", label: 'pay', height: 55, color: 'blue' }}
                  createOrder={createOrder(option.value)}
                  onApprove={onApprove(option.label)}
                  onError={(err) => console.error("PayPal Error:", err)}
                />
                 {option.value === '5.00' && (
                  <p className="text-yellow-300 text-sm mt-2 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" /> Exclusive access to the AI Trend Analyzer
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
