'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Wallet {
  likes: number; 
  uploads: number;
  credits: number;
  commission: number;
}

interface WalletContextType {
  wallet: Wallet;
  addLikes: (amount: number) => void;
  useLike: () => boolean; 
  addUploads: (amount: number) => void;
  useUpload: () => boolean;
  addCredits: (amount: number) => void;
  resetCredits: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const INITIAL_UPLOADS = 3;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>({
    likes: 0,
    uploads: 0, // Set to 0, will be loaded from localStorage
    credits: 0,
    commission: 0,
  });
  
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('likeflow_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWallet({
          likes: parsed.likes ?? 0,
          uploads: parsed.uploads ?? INITIAL_UPLOADS,
          credits: parsed.credits ?? 0,
          commission: parsed.commission ?? 0
        });
      } else {
        // If no saved wallet, initialize uploads
        setWallet(prev => ({ ...prev, uploads: INITIAL_UPLOADS }));
      }
    } catch (e) {
      console.error("Failed to load wallet from localStorage", e);
      // Fallback if localStorage fails
      setWallet(prev => ({ ...prev, uploads: INITIAL_UPLOADS }));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('likeflow_wallet', JSON.stringify(wallet));
    }
  }, [wallet, isHydrated]);

  const addLikes = useCallback((amount: number) => {
    setWallet(prev => ({ ...prev, likes: prev.likes + amount }));
  }, []);

  const useLike = useCallback(() => {
    return true; 
  }, []);

  const addUploads = useCallback((amount: number) => {
    setWallet(prev => ({ ...prev, uploads: prev.uploads + amount }));
  }, []);

  const useUpload = useCallback(() => {
    let success = false;
    setWallet(prev => {
      if (prev.uploads > 0) {
        success = true;
        return { ...prev, uploads: prev.uploads - 1 };
      }
      return prev;
    });
    return success;
  }, []);

  const addCredits = useCallback((amount: number) => {
    setWallet(prev => ({...prev, credits: prev.credits + amount}));
  }, []);

  const resetCredits = useCallback(() => {
    setWallet(prev => ({...prev, credits: 0}));
  }, []);

  const value = { 
    wallet, 
    addLikes, 
    useLike, 
    addUploads, 
    useUpload,
    addCredits,
    resetCredits,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
