'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Upload, Sparkles, Check, Star, Zap, Crown, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

const likePackages = [
  { id: 1, likes: 10, price: 1.00, popular: false, icon: Heart },
  { id: 2, likes: 60, price: 3.00, popular: true, savings: '50%', icon: Zap },
  { id: 3, likes: 150, price: 5.00, popular: false, savings: '67%', icon: Crown }
];

const uploadPackages = [
  { id: 1, uploads: 1, price: 0.50, popular: false, icon: Upload },
  { id: 2, uploads: 5, price: 1.50, popular: true, savings: '40%', icon: Zap },
  { id: 3, uploads: 20, price: 4.00, popular: false, savings: '60%', icon: Crown }
];

const PurchaseSuccess = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 50 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 50 }}
    className="fixed inset-x-4 bottom-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 z-50 shadow-2xl"
  >
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.1 }}
        className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
      >
        <Check className="w-6 h-6 text-green-500" />
      </motion.div>
      <div className="flex-1">
        <p className="text-white font-bold">{message}</p>
        <p className="text-white/70 text-sm">Crediti aggiunti al wallet</p>
      </div>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: 2 }}
      >
        <Gift className="w-6 h-6 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

export default function Packages() {
  const [activeTab, setActiveTab] = useState('likes');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const [wallet, setWallet] = useState(() => {
    if (typeof window === 'undefined') return { likes: 5, uploads: 3 };
    const saved = localStorage.getItem('likeflow_wallet');
    if (saved) return JSON.parse(saved);
    return { likes: 5, uploads: 3 };
  });

  const updateWallet = (newWallet: {likes: number, uploads: number}) => {
    setWallet(newWallet);
    localStorage.setItem('likeflow_wallet', JSON.stringify(newWallet));
  };
  
  const handlePurchase = (type: 'likes' | 'uploads', amount: number, price: number, pkgId: string) => {
    setSelectedPackage(pkgId);
    
    // open paypal
    window.open(
        "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=alibi81@libero.it" +
        "&currency_code=EUR&amount=" + price +
        "&item_name=Acquisto " + amount + " " + type,
        "_blank"
    );

    // SIMULATION (PayPal redirect IPN)
    setTimeout(() => {
      if (type === 'likes') {
        updateWallet({ ...wallet, likes: wallet.likes + amount });
        setPurchaseSuccess(`+${amount} Like aggiunti!`);
      } else {
        updateWallet({ ...wallet, uploads: wallet.uploads + amount });
        setPurchaseSuccess(`+${amount} Upload aggiunti!`);
      }
      setSelectedPackage(null);
      setTimeout(() => setPurchaseSuccess(null), 3000);
    }, 800);
  };

  return (
    <div className="min-h-[100dvh] bg-black pb-8 pt-16 overflow-y-auto">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#FFD700]/10 blur-[100px]"
          animate={{ 
            x: [-200, 200, -200],
            y: [-100, 100, -100],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '-20%', left: '-20%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]"
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
        className="relative sticky top-0 bg-black/80 backdrop-blur-xl border-b border-[#FFD700]/10 px-4 py-4 z-10"
      >
        <h1 className="text-white text-2xl font-bold text-center flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-[#FFD700]" />
          </motion.div>
          Shop
        </h1>
      </motion.div>

      {/* Wallet Summary */}
      <div className="relative px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-6 border border-[#FFD700]/20 relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#FFD700]/20 blur-3xl" />
          
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Il tuo Wallet</h2>
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
                  initial={{ scale: 1.5, color: '#FFD700' }}
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
                  initial={{ scale: 1.5, color: '#A855F7' }}
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

      {/* Success notification */}
      <AnimatePresence>
        {purchaseSuccess && (
          <PurchaseSuccess message={purchaseSuccess} />
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="relative px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#111] border border-[#222] rounded-2xl p-1.5 h-14">
            <TabsTrigger 
              value="likes" 
              className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FFD700] data-[state=active]:to-[#B8860B] data-[state=active]:text-black text-gray-400 font-medium transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              Like
            </TabsTrigger>
            <TabsTrigger 
              value="uploads"
              className="flex-1 h-full rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-400 font-medium transition-all"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="likes" className="mt-6">
            <div className="space-y-4">
              {likePackages.map((pkg, index) => {
                const Icon = pkg.icon;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-3xl p-5 border-2 overflow-hidden ${
                      pkg.popular 
                        ? 'border-[#FFD700] bg-gradient-to-br from-[#1a1500] to-[#0a0800]' 
                        : 'border-[#222] bg-[#111]'
                    }`}
                  >
                    {/* Animated glow for popular */}
                    {pkg.popular && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-transparent to-[#FFD700]/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    {pkg.popular && (
                      <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="absolute -top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black text-xs font-bold px-4 py-1.5 rounded-b-xl flex items-center gap-1 shadow-lg"
                      >
                        <Star className="w-3 h-3 fill-black" />
                        BEST VALUE
                      </motion.div>
                    )}

                    <div className="relative z-10 flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            pkg.popular 
                              ? 'bg-gradient-to-br from-[#FFD700] to-[#B8860B]' 
                              : 'bg-[#FFD700]/10'
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${
                            pkg.popular ? 'text-black' : 'text-[#FFD700]'
                          }`} />
                        </motion.div>
                        <div>
                          <p className="text-white text-2xl font-bold">{pkg.likes}</p>
                          <p className="text-gray-400 text-sm">Like</p>
                          {pkg.savings && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full mt-1"
                            >
                              -{pkg.savings}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePurchase('likes', pkg.likes, pkg.price, `like-${pkg.id}`)}
                        disabled={selectedPackage === `like-${pkg.id}`}
                        className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black shadow-lg shadow-[#FFD700]/30'
                            : 'bg-[#222] text-white hover:bg-[#333]'
                        }`}
                      >
                        {selectedPackage === `like-${pkg.id}` ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : (
                          `€${pkg.price.toFixed(2)}`
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="mt-6">
            <div className="space-y-4">
              {uploadPackages.map((pkg, index) => {
                const Icon = pkg.icon;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-3xl p-5 border-2 overflow-hidden ${
                      pkg.popular 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-[#0a0a0a]' 
                        : 'border-[#222] bg-[#111]'
                    }`}
                  >
                    {pkg.popular && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}

                    {pkg.popular && (
                      <motion.div 
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="absolute -top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-b-xl flex items-center gap-1 shadow-lg"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        BEST VALUE
                      </motion.div>
                    )}

                    <div className="relative z-10 flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                            pkg.popular 
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                              : 'bg-purple-500/10'
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${
                            pkg.popular ? 'text-white' : 'text-purple-400'
                          }`} />
                        </motion.div>
                        <div>
                          <p className="text-white text-2xl font-bold">{pkg.uploads}</p>
                          <p className="text-gray-400 text-sm">Upload</p>
                          {pkg.savings && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full mt-1"
                            >
                              -{pkg.savings}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePurchase('uploads', pkg.uploads, pkg.price, `upload-${pkg.id}`)}
                        disabled={selectedPackage === `upload-${pkg.id}`}
                        className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-[#222] text-white hover:bg-[#333]'
                        }`}
                      >
                        {selectedPackage === `upload-${pkg.id}` ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-6 h-6 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : (
                          `€${pkg.price.toFixed(2)}`
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#222]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">Pagamento sicuro</p>
              <p className="text-gray-500 text-sm">
                I pagamenti sono processati tramite PayPal. I crediti vengono aggiunti istantaneamente.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

