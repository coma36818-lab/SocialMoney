'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PostCard } from '@/components/feed/PostCard';
import { EmptyFeed } from '@/components/feed/EmptyFeed';
import { BuyLikesModal } from '@/components/ui/BuyLikesModal';
import { CommentsSheet } from '@/components/feed/CommentsSheet';
import ShareSheet from '@/components/feed/ShareSheet';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, orderBy, limit, increment, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase, updateDocumentNonBlocking } from '@/firebase';
import { useWallet } from '@/context/WalletContext';
import { useSound } from '@/context/SoundContext';

const { firestore: db } = initializeFirebase();

// Funzione per ottenere/creare un userId unico nel localStorage
const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem('likeflow_userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('likeflow_userId', userId);
  }
  return userId;
};


function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { wallet, useLike } = useWallet();
  const { playSound } = useSound();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const postsRef = collection(db, "Posts");
      const q = query(postsRef, orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const postRef = doc(db, "Posts", postId);
      updateDocumentNonBlocking(postRef, {
        likes: increment(1),
        likesWeek: increment(1)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
    playSound('like', 0.6);
  };
  

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current as HTMLDivElement;
      const scrollTop = container.scrollTop;
      const height = window.innerHeight;
      const newIndex = Math.round(scrollTop / height);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        playSound('scroll', 0.2);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 300);
      }
    }
  }, [activeIndex, playSound]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const openComments = (postId: any) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };

  const openShare = (postId: any) => {
    setSelectedPostId(postId);
    setShowShare(true);
  };

  if (isLoading) {
    return (
      <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-[#FFD700]" />
        </motion.div>
        <motion.p
          className="text-[#FFD700] mt-4 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Caricamento...
        </motion.p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <EmptyFeed />;
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="h-[100dvh] w-full bg-black overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <AnimatePresence>
          {isScrolling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <motion.div
                className="w-16 h-16 rounded-full border-2 border-[#FFD700]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {posts.map((post: any, index: number) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            userLikes={wallet.likes} // This prop might be deprecated if likes are infinite now
            isActive={index === activeIndex}
            onOpenComments={() => openComments(post.id)}
            onOpenShare={() => openShare(post.id)}
          />
        ))}
      </div>

      <BuyLikesModal 
        isOpen={showBuyModal} 
        onClose={() => setShowBuyModal(false)} 
      />

      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={selectedPostId}
      />

      <ShareSheet
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        postId={selectedPostId}
      />
    </>
  );
}

export default function FeedPage() {
  return <Feed />;
}
