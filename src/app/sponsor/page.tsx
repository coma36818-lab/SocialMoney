
'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { storage, db } from '@/firebase/client';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const PAYPAL_CLIENT_ID = "ASO-5bJbcS-tklhd-_M-DrZn6lNHwa7FGDjlUajxjiarfLvpAVQiTnO0A5SPDv4HXjlT7hz4St9d7d34";

const boostOptions = [
  { value: '1.00', label: '1 Boost Video' },
  { value: '3.00', label: '5 Boost Videos' },
  { value: '5.00', label: '10 Boost Videos' },
];

type FileType = 'video' | 'audio' | 'image';

export default function SponsorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FileType>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const getUploadConfig = (type: FileType) => {
    switch (type) {
      case 'video':
        return {
          localStorageKey: "lastFreeVideoUpload",
          storagePath: "videos/free_",
          collectionName: "videos",
          fileTypeMessage: "video"
        };
      case 'audio':
        return {
          localStorageKey: "lastFreeAudioUpload",
          storagePath: "audios/free_",
          collectionName: "audios",
          fileTypeMessage: "audio file"
        };
      case 'image':
        return {
          localStorageKey: "lastFreeImageUpload",
          storagePath: "images/free_",
          collectionName: "images",
          fileTypeMessage: "image"
        };
    }
  };

  const uploadFreeFile = async () => {
    const config = getUploadConfig(activeTab);
    const lastUpload = localStorage.getItem(config.localStorageKey);
    const today = new Date().toDateString();

    if (lastUpload === today) {
      alert(`You have already uploaded 1 ${config.fileTypeMessage} today. Use Boosts!`);
      return;
    }

    if (!file) {
      alert(`Select a ${config.fileTypeMessage}!`);
      return;
    }

    try {
      const extension = file.name.split('.').pop();
      const path = `${config.storagePath}${Date.now()}.${extension}`;
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, config.collectionName), {
        url: url,
        premium: false,
        timestamp: serverTimestamp()
      });

      localStorage.setItem(config.localStorageKey, today);
      alert(`🎉 ${config.fileTypeMessage.charAt(0).toUpperCase() + config.fileTypeMessage.slice(1)} uploaded! It is now at the top of the homepage.`);
    } catch (error) {
      console.error(`Error uploading free ${config.fileTypeMessage}:`, error);
      alert("An error occurred during upload. Please try again.");
    }
  };

  const uploadPremiumVideo = async () => {
    if (!file) {
      alert("Select a video before completing the payment!");
      throw new Error("No video selected");
    }

    try {
      const path = "videos/premium_" + Date.now() + ".mp4";
      const storageRef = ref(storage, path);

      await uploadBytes(storageRef, file);
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
    if (!file || activeTab !== 'video') {
      alert("Select a video before proceeding with the payment!");
      return Promise.reject(new Error("No video file selected for boost."));
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

  const renderFileInput = () => {
    const acceptMap: Record<FileType, string> = {
      video: "video/mp4,video/*",
      audio: "audio/mpeg,audio/*",
      image: "image/jpeg,image/png,image/gif"
    };
    
    return (
      <div className="box flex flex-col items-center py-12">
        <h2 className="text-2xl font-bold mb-4">Free Upload</h2>
        <Input
          type="file"
          id="fileInput"
          accept={acceptMap[activeTab]}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {filePreview && (
          <div className="mt-4 max-w-md w-full">
            {activeTab === 'video' && <video id="videoPreview" controls src={filePreview} className="w-full rounded-lg"></video>}
            {activeTab === 'audio' && <audio id="audioPreview" controls src={filePreview} className="w-full rounded-lg"></audio>}
            {activeTab === 'image' && <img id="imagePreview" src={filePreview} alt="Preview" className="w-full rounded-lg" />}
          </div>
        )}
        <div className="upload-btn mt-4" onClick={uploadFreeFile}>
          Upload for Free
        </div>
      </div>
    );
  };

  return (
    <PayPalScriptProvider options={{ "clientId": PAYPAL_CLIENT_ID, currency: "EUR" }}>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">Upload Your Content</h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Showcase your content on our homepage to a wide international audience of readers and creators.
        </p>

        <Tabs defaultValue="video" onValueChange={(value) => {
          setActiveTab(value as FileType);
          setFile(null);
          setFilePreview(null);
        }} className="w-full max-w-xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio/Music</TabsTrigger>
            <TabsTrigger value="image">Photo/Image</TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            {renderFileInput()}
          </TabsContent>
          <TabsContent value="audio">
            {renderFileInput()}
          </TabsContent>
          <TabsContent value="image">
            {renderFileInput()}
          </TabsContent>
        </Tabs>
        
        <div className="box flex flex-col items-center mt-12 py-8">
          <h2 className="text-2xl font-bold mb-2 text-center">Want to upload more content today?</h2>
          <p className="text-muted-foreground mb-6 text-center">Buy Boosts and get to the TOP of the homepage RIGHT AWAY.</p>
          <div className="space-y-4">
            {boostOptions.map(option => (
              <div key={option.value} id={`boost-${option.value.split('.')[0]}`} className="text-center">
                <p className="mb-2">{option.label} - €{option.value}</p>
                <PayPalButtons
                  style={{ layout: "horizontal", label: 'pay', height: 55, color: 'gold', shape: 'pill' }}
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
