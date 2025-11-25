'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Upload, Wallet as WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { initializeFirebase } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc, increment } from 'firebase/firestore';

const { firestore: db } = initializeFirebase();

const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('likeflow_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('likeflow_userId', userId);
  }
  return userId;
};

// Mock PayPal payment creation
async function createPayPalPayment(amount: number): Promise<string> {
  console.log(`Simulating PayPal payment creation for €${amount}`);
  // In a real app, this would call the PayPal API
  return `mock_paypal_tx_${Date.now()}`;
}

async function withdrawCredits(localUserId: string) {
  const walletRef = doc(db, "Wallets", localUserId);
  const walletSnap = await getDoc(walletRef);
  
  if (!walletSnap.exists() || walletSnap.data().credit < 5) {
    alert("Minimo €5 per riscuotere.");
    return;
  }
  
  const walletData = walletSnap.data();
  const creditToWithdraw = walletData.credit;

  try {
    // 1. Create PayPal transaction (simulated)
    const paypalTxId = await createPayPalPayment(creditToWithdraw);

    // 2. Update wallet and record transaction
    await setDoc(walletRef, { credit: 0, lastUpdate: serverTimestamp() }, { merge: true });
    await addDoc(collection(db, "Transactions"), {
      userId: localUserId,
      pricePaid: creditToWithdraw,
      paypalTxId,
      type: "withdraw",
      timestamp: serverTimestamp()
    });

    alert(`Riscossione di €${creditToWithdraw.toFixed(2)} completata! Transazione ID: ${paypalTxId}`);
    return paypalTxId;
  } catch (error) {
    console.error("Withdrawal failed:", error);
    alert("Si è verificato un errore durante la riscossione. Riprova.");
  }
}

export default function WalletPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { wallet, addCredits, resetCredits } = useWallet();

  const userId = getOrCreateUserId();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletRef = doc(db, "Wallets", userId);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) {
        addCredits(walletSnap.data().credit);
      }
    };
    fetchWallet();
  }, [userId, addCredits]);
  
  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await withdrawCredits(userId);
    resetCredits();
    setIsWithdrawing(false);
  };

  return (
    <div className="min-h-screen bg-black pb-36 pt-16 overflow-y-auto">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]"
          animate={{ 
            x: [-200, 200, -200],
            y: [-100, 100, -100],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '-20%', left: '-20%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-green-500/10 blur-[100px]"
          animate={{ 
            x: [200, -200, 200],
            y: [100, -100, 100],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ bottom: '-10%', right: '-10%' }}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative sticky top-0 bg-black/80 backdrop-blur-xl border-b border-purple-500/10 px-4 py-4 z-10"
      >
        <h1 className="text-white text-2xl font-bold text-center flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <WalletIcon className="w-6 h-6 text-purple-400" />
          </motion.div>
          Il tuo Wallet
        </h1>
      </motion.div>
      
      {/* Wallet Summary */}
      <div className="relative px-4 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-6 border border-purple-500/20 relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
          
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4">I tuoi Assets</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 rounded-2xl p-4 border border-[#FFD700]/10 relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                  <span className="text-gray-400 text-sm">Like</span>
                </div>
                <motion.p 
                  key={wallet.likes}
                  initial={{ scale: 1.5, color: '#FFFFFF' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  className="text-white text-3xl font-bold"
                >
                  {wallet.likes}
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 rounded-2xl p-4 border border-purple-500/10 relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Upload</span>
                </div>
                <motion.p 
                  key={wallet.uploads}
                  initial={{ scale: 1.5, color: '#FFFFFF' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  className="text-white text-3xl font-bold"
                >
                  {wallet.uploads}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

       {/* Withdraw Section */}
      <div className="relative px-4 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-6 border border-green-500/20 relative overflow-hidden"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-green-500/10 blur-3xl" />
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-2"><WalletIcon className="w-4 h-4"/>Il tuo Guadagno</h2>
          <div className="flex items-center justify-between">
            <p className="text-white text-4xl font-bold">€{wallet.credits.toFixed(2)}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWithdraw}
              disabled={wallet.credits < 5 || isWithdrawing}
              className="px-6 py-3 rounded-2xl font-bold text-lg transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              {isWithdrawing ? "Processing..." : "Riscuoti"}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Minimo per riscuotere: €5.00</p>
        </motion.div>
      </div>

    </div>
  );
}
