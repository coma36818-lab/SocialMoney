
'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

const { firestore: db } = initializeFirebase();

const PAYPAL_CLIENT_ID = "ASO-5bJbcS-tklhd-_M-DrZn6lNHwa7FGDjlUajxjiarfLvpAVQiTnO0A5SPDv4HXjlT7hz4St9d7d34";

const boostOptions = [
  { value: '1.00', label: '1 Boost Video', boostAmount: 1 },
  { value: '3.00', label: '5 Boost Videos', boostAmount: 5 },
  { value: '5.00', label: '10 Boost Videos', boostAmount: 10 },
];

type FileType = 'video' | 'audio' | 'image';

const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('likeflow_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('likeflow_userId', userId);
  }
  return userId;
};


async function boostPost(postId: string, boostAmount: number, localUserId: string, priceEuro: number, paypalTxId: string) {
  const postRef = doc(db, "Posts", postId);
  await updateDoc(postRef, {
    boostScore: increment(boostAmount),
    boostPurchased: increment(boostAmount)
  });

  // Registra transazione PayPal
  await addDoc(collection(db, "transactions"), {
    userId: localUserId,
    postId,
    boostAmount,
    pricePaid: priceEuro,
    paypalTxId,
    type: "boostPurchase",
    timestamp: serverTimestamp()
  });
}


export default function SponsorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [postId, setPostId] = useState('');
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

  const uploadFreeFile = async () => {
    alert("This feature is temporarily disabled.");
  };

  const onApprove = (boostAmount: number, price: number): PayPalButtonsComponentProps['onApprove'] => async (data, actions) => {
    if (!postId) {
      alert("Please enter a Post ID to boost.");
      return;
    }
    
    try {
      await actions.order?.capture();
      const localUserId = getOrCreateUserId();
      await boostPost(postId, boostAmount, localUserId, price, data.orderID);
      alert(`Payment completed! Post boosted successfully.`);
    } catch (error) {
      console.error("Payment or boost failed:", error);
      alert("There was an issue with the payment or boost. Please try again.");
    }
  };

  const createOrder = (amount: string): PayPalButtonsComponentProps['createOrder'] => (data, actions) => {
    if (!postId) {
      alert("Please enter a Post ID to boost.");
      return Promise.reject(new Error("No Post ID provided."));
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

  const renderFileInput = () => {
    const acceptMap: Record<FileType, string> = {
      video: "video/mp4,video/*",
      audio: "audio/mpeg,audio/*",
      image: "image/jpeg,image/png,image/gif"
    };
    
    return (
      <div className="box flex flex-col items-center py-8">
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
        <div className="upload-btn mt-8" onClick={uploadFreeFile}>
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
            <TabsTrigger value="image">Image</TabsTrigger>
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
          <div className="w-full max-w-sm mb-6">
            <Input 
              type="text"
              placeholder="Enter Post ID to boost"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              className="text-center bg-background"
            />
          </div>
          <div className="space-y-4">
            {boostOptions.map(option => (
              <div key={option.value} id={`boost-${option.value.split('.')[0]}`} className="text-center">
                <p className="mb-2">{option.label} - €{option.value}</p>
                <PayPalButtons
                  style={{ layout: "horizontal", shape: "pill", color: "gold" }}
                  createOrder={createOrder(option.value)}
                  onApprove={onApprove(option.boostAmount, parseFloat(option.value))}
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
