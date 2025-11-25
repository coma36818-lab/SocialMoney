'use client';
import React from 'react';
import Link from 'next/link';
import { Home, Upload, ShoppingBag, Trophy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppHeader } from '@/components/header';

const navItems = [
  { name: 'Feed', icon: Home, page: '/likeflow/feed' },
  { name: 'Crea', icon: Upload, page: '/likeflow/upload' },
  { name: 'Shop', icon: ShoppingBag, page: '/likeflow/purchase' },
  { name: 'Top', icon: Trophy, page: '/likeflow/top' }
];

const queryClient = new QueryClient();

export default function LikeFlowLayout({ children }: { children: React.ReactNode }) {
  const { wallet } = useWallet();
  const pathname = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
        <div className="min-h-[100dvh] bg-black">
          <style>{`
            :root {
              --background: 0 0% 0%;
              --foreground: 0 0% 100%;
              --primary: 51 100% 50%;
              --primary-foreground: 0 0% 0%;
              --muted: 0 0% 15%;
              --muted-foreground: 0 0% 65%;
              --border: 51 100% 50%;
              --input: 0 0% 15%;
              --ring: 51 100% 50%;
            }
            
            * {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            *::-webkit-scrollbar {
              display: none;
            }
            
            html, body {
              background-color: #000;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              overscroll-behavior: none;
            }

            .mirror-text {
              display: flex;
              flex-direction: column;
              line-height: 1;
            }
            
            .mirror-reflection {
              transform: scaleY(-1);
              background: linear-gradient(to bottom, rgba(255,215,0,0.6) 0%, transparent 80%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              opacity: 0.4;
              filter: blur(0.5px);
            }
          `}</style>
          
          <AppHeader />
          <main className="h-[100dvh]">
            {children}
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-50">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
            
            <div className="relative flex items-center justify-around h-20 max-w-md mx-auto px-4 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.page;
                
                return (
                  <Link
                    key={item.page}
                    href={item.page}
                    className="relative flex flex-col items-center justify-center group"
                  >
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      className="relative"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute -inset-3 bg-[#FFD700]/20 rounded-2xl blur-lg"
                        />
                      )}
                      
                      <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B]' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}>
                        <Icon 
                          className={`w-6 h-6 transition-all ${
                            isActive ? 'text-black' : 'text-white'
                          }`}
                          strokeWidth={isActive ? 2.5 : 1.5}
                        />
                      </div>
                    </motion.div>
                    
                    <span className={`text-[10px] mt-1.5 font-medium transition-colors ${
                      isActive ? 'text-[#FFD700]' : 'text-gray-400'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}

              <Link
                href='/likeflow/purchase'
                className="relative flex flex-col items-center justify-center"
              >
                <motion.div whileTap={{ scale: 0.85 }}>
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-5 h-5 text-purple-400 mx-auto" />
                      <span className="text-purple-400 text-[8px] font-bold">{wallet.uploads}</span>
                    </div>
                  </div>
                </motion.div>
                <span className="text-[10px] mt-1.5 font-medium text-gray-400">Wallet</span>
              </Link>
            </div>
          </nav>
        </div>
    </QueryClientProvider>
  );
}
