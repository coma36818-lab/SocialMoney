'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PostCard } from '@/components/feed/PostCard';
import { EmptyFeed } from '@/components/feed/EmptyFeed';
import { BuyLikesModal } from '@/components/ui/BuyLikesModal';
import { CommentsSheet } from '@/components/feed/CommentsSheet';
import { ShareSheet } from '@/components/feed/ShareSheet';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, orderBy, limit } from 'firebase/firestore';
import { app } from '@/firebase/client';

const db = getFirestore(app);


const SOUNDS = {
  like: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYZNJYBOAAAAAAD/+9DEAAAGAAGn9AAAIyYmM/MPJBQAAAGkAAAAIAAABpBnP/u77/+7/v/+7BAQEBBwcEBAQ8PDz//d3/+Hu7u7u7v+7//u77/BAQf/wQEH4ICD/u///+7u7u7vd3f93f/wQeH/5znP+c5z/8xjHMYxjGMYx/8YABgAGAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+9DEUwPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==',
  scroll: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYY4OSQVAAAAAAD/+9DEAAAGAAGn9AAAIwImM/MPJBSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo='
};

function Feed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const queryClient = useQueryClient();
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

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

  const playSound = useCallback((soundName: keyof typeof SOUNDS, volume = 0.5) => {
    try {
      if (!audioRefs.current[soundName]) {
        audioRefs.current[soundName] = new Audio(SOUNDS[soundName]);
      }
      const audio = audioRefs.current[soundName];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("timestamp", "desc"), limit(100));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const post = posts.find((p: any) => p.id === postId);
      if (post) {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            likes: (post.likes || 0) + 1,
            likesWeek: (post.likesWeek || 0) + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  const handleLike = (postId: string) => {
    if (wallet.likes <= 0) {
      setShowBuyModal(true);
      return;
    }
    updateWallet({ ...wallet, likes: wallet.likes - 1 });
    likeMutation.mutate(postId);
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
            userLikes={wallet.likes}
            isActive={index === activeIndex}
            playSound={playSound}
            onOpenComments={() => openComments(post.id)}
            onOpenShare={() => openShare(post.id)}
          />
        ))}
      </div>

      <div className="h-20" />

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

const queryClient = new QueryClient();

export default function FeedPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Feed />
    </QueryClientProvider>
  )
}