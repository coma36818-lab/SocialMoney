'use client';
import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function BuyLikesModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#111] border border-[#FFD700]/30 rounded-2xl p-6 max-w-sm w-full"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-8 h-8 text-black fill-black" />
            </motion.div>

            <h3 className="text-white text-xl font-bold mb-2">
              Like terminati!
            </h3>
            <p className="text-gray-400 mb-6">
              Acquista un pacchetto per continuare a supportare i tuoi creator preferiti
            </p>

            <Link href="/likeflow/purchase" onClick={onClose}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold py-3 rounded-full"
              >
                <Sparkles className="w-5 h-5" />
                Acquista Like
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
