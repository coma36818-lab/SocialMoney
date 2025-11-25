'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Wallet {
  likes: number; // This will now represent a user's purchased likes, not for spending on other's posts
  uploads: number;
  credits: number; // For authors
}

interface WalletContextType {
  wallet: Wallet;
  addLikes: (amount: number) => void;
  useLike: () => boolean; // This might be deprecated or change purpose
  addUploads: (amount: number) => void;
  useUpload: () => boolean;
  addCredits: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const INITIAL_UPLOADS = 3;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>({
    likes: 0, // Likes are purchased for posts, not held by user
    uploads: INITIAL_UPLOADS,
    credits: 0
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
          credits: parsed.credits ?? 0
        });
      }
    } catch (e) {
      console.error("Failed to load wallet from localStorage", e);
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

  // This function's purpose changes. It's no longer about "spending" a like from a user's balance.
  // Instead, it might represent the action of liking, which triggers a buy flow.
  // Or it could be removed if all liking happens via buyLikes. For now, let's have it return true.
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

  const value = { 
    wallet, 
    addLikes, 
    useLike, 
    addUploads, 
    useUpload,
    addCredits
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
