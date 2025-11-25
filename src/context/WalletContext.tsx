'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Wallet {
  likes: number;
  uploads: number;
}

interface WalletContextType {
  wallet: Wallet;
  addLikes: (amount: number) => void;
  useLike: () => boolean;
  addUploads: (amount: number) => void;
  useUpload: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const INITIAL_LIKES = 5;
const INITIAL_UPLOADS = 3;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>({
    likes: INITIAL_LIKES,
    uploads: INITIAL_UPLOADS
  });
  
  // This state ensures that we only read from localStorage on the client
  // after the component has mounted.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('likeflow_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWallet({
          likes: parsed.likes ?? INITIAL_LIKES,
          uploads: parsed.uploads ?? INITIAL_UPLOADS,
        });
      }
    } catch (e) {
      console.error("Failed to load wallet from localStorage", e);
    }
    setIsHydrated(true);
  }, []);


  useEffect(() => {
    // Only save to localStorage on the client after initial hydration
    if (isHydrated) {
      localStorage.setItem('likeflow_wallet', JSON.stringify(wallet));
    }
  }, [wallet, isHydrated]);

  const addLikes = useCallback((amount: number) => {
    setWallet(prev => ({ ...prev, likes: prev.likes + amount }));
  }, []);

  const useLike = useCallback(() => {
    let success = false;
    setWallet(prev => {
      if (prev.likes > 0) {
        success = true;
        return { ...prev, likes: prev.likes - 1 };
      }
      return prev;
    });
    return success;
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

  const value = { 
    wallet, 
    addLikes, 
    useLike, 
    addUploads, 
    useUpload 
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
