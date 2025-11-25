'use client';
import React from 'react';
import { useQuery, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Heart, Trophy, Medal, Award, User, Loader2, Crown, Flame, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { initializeFirebase } from '@/firebase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

const { firestore: db } = initializeFirebase();

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Crown className="w-6 h-6 text-[#FFD700]" />;
    case 1:
      return <Medal className="w-6 h-6 text-gray-300" />;
    case 2:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-gray-500 font-bold text-lg">#{index + 1}</span>;
  }
};

const PodiumPlace = ({ post, place, delay }: { post: any, place: number, delay: number }) => {
  const heights: { [key: number]: string } = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const colors: {[key: number]: string} = { 
    1: 'from-[#FFD700] to-[#B8860B]', 
    2: 'from-gray-300 to-gray-400', 
    3: 'from-amber-600 to-amber-700' 
  };
  const glows: {[key: number]: string} = {
    1: 'shadow-[#FFD700]/50',
    2: 'shadow-gray-300/30',
    3: 'shadow-amber-600/30'
  };
  const sizes: { [key: number]: string } = { 1: 'w-20 h-20', 2: 'w-16 h-16', 3: 'w-16 h-16' };
  const badgeSizes: { [key: number]: string } = { 1: 'w-8 h-8 text-lg', 2: 'w-7 h-7 text-base', 3: 'w-7 h-7 text-base' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`flex flex-col items-center ${place === 1 ? 'order-2' : place === 2 ? 'order-1' : 'order-3'}`}
    >
      <motion.div 
        className="relative mb-2"
        whileHover={{ scale: 1.1 }}
      >
        {place === 1 && (
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-8 h-8 text-[#FFD700] drop-shadow-lg" />
          </motion.div>
        )}
        
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors[place]} blur-md opacity-50`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className={`${sizes[place]} rounded-full bg-gradient-to-br ${colors[place]} flex items-center justify-center relative z-10 shadow-xl ${glows[place]}`}>
            <User className={place === 1 ? 'w-10 h-10 text-black' : 'w-8 h-8 text-white'} />
        </div>
        
        <motion.div 
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${badgeSizes[place]} rounded-full bg-gradient-to-r ${colors[place]} flex items-center justify-center font-bold text-black z-20 shadow-lg`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {place}
        </motion.div>
      </motion.div>

      <motion.div 
        className={`${heights[place]} w-24 bg-gradient-to-t ${colors[place]} rounded-t-2xl flex flex-col items-center justify-start pt-4 mt-4 relative overflow-hidden`}
        initial={{ height: 0 }}
        animate={{ height: place === 1 ? 128 : place === 2 ? 96 : 80 }}
        transition={{ delay: delay + 0.3, duration: 0.5, type: "spring" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay }}
        />
        
        <p className="text-black text-xs font-bold truncate max-w-[80px] relative z-10">
          {post.authorName || 'Anonimo'}
        </p>
        <div className="flex items-center gap-1 mt-1 relative z-10">
          <Heart className="w-3 h-3 text-black fill-black" />
          <span className="text-black text-sm font-bold">{post.likes || 0}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

function Ranking() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("likesWeek", "desc"), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const rankedPosts = posts.filter((post: any) => (post.likes || 0) > 0);

  return (
    <div className="min-h-[100dvh] bg-black pb-8 pt-16 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#FFD700]/5 blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ top: '-30%', left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative sticky top-0 bg-black/80 backdrop-blur-xl border-b border-[#FFD700]/10 px-4 py-4 z-10"
      >
        <h1 className="text-white text-2xl font-bold text-center flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="w-6 h-6 text-[#FFD700]" />
          </motion.div>
          Classifica
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-sm text-center mt-1"
        >
          Top creators della settimana
        </motion.p>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-[#FFD700]" />
          </motion.div>
          <motion.p
            className="text-gray-500 mt-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Caricamento classifica...
          </motion.p>
        </div>
      ) : rankedPosts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 px-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-12 h-12 text-gray-600" />
          </motion.div>
          <p className="text-gray-400 text-lg font-medium">Nessuno in classifica</p>
          <p className="text-gray-600 text-sm mt-2">Sii il primo a ricevere like!</p>
        </motion.div>
      ) : (
        <>
          {rankedPosts.length >= 3 && (
            <div className="relative px-4 pt-16 pb-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ 
                    left: `${20 + i * 15}%`, 
                    top: `${10 + (i % 3) * 20}%` 
                  }}
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <Star className="w-3 h-3 text-[#FFD700]/50 fill-[#FFD700]/50" />
                </motion.div>
              ))}

              <div className="flex items-end justify-center gap-2">
                <PodiumPlace post={rankedPosts[1]} place={2} delay={0.2} />
                <PodiumPlace post={rankedPosts[0]} place={1} delay={0.1} />
                <PodiumPlace post={rankedPosts[2]} place={3} delay={0.3} />
              </div>
            </div>
          )}

          <div className="relative px-4 py-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#FFD700]" />
              <h2 className="text-white text-lg font-semibold">Tutti i partecipanti</h2>
            </div>
            
            <div className="space-y-3">
              {rankedPosts.map((post: any, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    index < 3 
                      ? 'bg-gradient-to-r from-[#FFD700]/10 to-transparent border-[#FFD700]/20' 
                      : 'bg-[#111] border-[#222]'
                  }`}
                >
                  <div className="w-10 flex items-center justify-center">
                    {index < 3 ? (
                      <motion.div
                        animate={index === 0 ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {getRankIcon(index)}
                      </motion.div>
                    ) : (
                      getRankIcon(index)
                    )}
                  </div>

                  <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index < 3 
                          ? 'bg-gradient-to-br from-[#FFD700]/30 to-[#B8860B]/30 border-2 border-[#FFD700]' 
                          : 'bg-[#222] border border-[#333]'
                      }`}>
                        <User className={`w-6 h-6 ${index < 3 ? 'text-[#FFD700]' : 'text-gray-500'}`} />
                      </div>
                    {index === 0 && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                      @{post.authorName || 'anonimo'}
                    </p>
                    {post.description && (
                      <p className="text-gray-500 text-sm truncate">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <motion.div 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      index < 3 ? 'bg-[#FFD700]/20' : 'bg-[#222]'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Heart className={`w-4 h-4 ${
                      index < 3 ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-500 fill-gray-500'
                    }`} />
                    <span className={`font-bold ${
                      index < 3 ? 'text-[#FFD700]' : 'text-gray-400'
                    }`}>
                      {post.likes || 0}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
