
'use client';
import React from 'react';
import { Upload, Sparkles, Play, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function EmptyFeed() {
  return (
    <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <Heart className="w-4 h-4 text-[#FFD700]/30 fill-[#FFD700]/30" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        {/* Animated icon */}
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center mx-auto shadow-2xl shadow-[#FFD700]/30"
          >
            <Play className="w-16 h-16 text-black ml-2" />
          </motion.div>
          
          {/* Floating sparkles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 20}%`,
                left: i % 2 === 0 ? '-20%' : '100%'
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
            </motion.div>
          ))}
        </div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-3xl font-bold mb-3"
        >
          Il feed è vuoto
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-10 max-w-xs text-lg"
        >
          Sii il primo a condividere qualcosa di speciale!
        </motion.p>
        
        <Link href="/likeflow/upload">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-3 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-[#FFD700]/30"
          >
            <Upload className="w-6 h-6" />
            Crea il primo post
            
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#FFD700]"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
