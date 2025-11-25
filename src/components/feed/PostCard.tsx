'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Heart, Music, User, Volume2, VolumeX, Share2, MessageCircle, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingHeart = ({ id, onComplete, color = '#FFD700' }: { id: any, onComplete: (id: any) => void, color?: string }) => {
  const randomX = Math.random() * 80 - 40;
  const randomRotation = Math.random() * 60 - 30;
  const size = Math.random() * 16 + 20;
  
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [1, 1, 0],
        y: -200,
        x: randomX,
        scale: [0, 1.2, 0.8],
        rotate: randomRotation
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute bottom-0 right-0 pointer-events-none"
    >
      <Heart 
        style={{ width: size, height: size }} 
        className="drop-shadow-lg"
        fill={color}
        color={color}
      />
    </motion.div>
  );
};

const DoubleTapHeart = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.4 }}
        >
          <Heart className="w-32 h-32 fill-[#FFD700] text-[#FFD700] drop-shadow-2xl" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export function PostCard({ post, onLike, userLikes, isActive, playSound, onOpenComments, onOpenShare }: any) {
  const [floatingHearts, setFloatingHearts] = useState<any[]>([]);
  const [isLiking, setIsLiking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const comments = []; // Placeholder

  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  const triggerLike = () => {
    if (userLikes <= 0) return false;
    
    setIsLiking(true);
    setTimeout(() => setIsLiking(false), 200);
    
    const heartColors = ['#FFD700', '#FFA500', '#FF6B6B', '#FF1493', '#FFD700'];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const heartId = Date.now() + Math.random();
        setFloatingHearts(prev => [...prev, { id: heartId, color: heartColors[i % heartColors.length] }]);
      }, i * 50);
    }
    
    playSound?.('like', 0.6);
    onLike(post.id);
    return true;
  };

  const handleLike = () => {
    triggerLike();
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ignore if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    const now = Date.now();
    if (now - lastTap < 300) {
      if (triggerLike()) {
        setShowDoubleTapHeart(true);
        setTimeout(() => setShowDoubleTapHeart(false), 800);
      }
    }
    setLastTap(now);
  };

  const removeHeart = (id: any) => {
    setFloatingHearts(prev => prev.filter(h => h.id !== id));
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    playSound?.('tap', 0.3);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatDate = (dateValue: number | undefined) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  };

  return (
    <div 
      className="h-[100dvh] w-full bg-black relative flex items-center justify-center snap-start snap-always overflow-hidden"
      onClick={handleDoubleTap}
    >
      {/* Media Content - Full Screen */}
      <div className="absolute inset-0 w-full h-full">
        {post.mediaType && post.mediaType.startsWith('video') && (
          <video
            ref={videoRef}
            src={post.mediaURL}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            loop
            muted={isMuted}
            playsInline
            webkit-playsinline="true"
          />
        )}
        
        {post.mediaType && post.mediaType.startsWith('image') && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={post.mediaURL}
            alt={post.postDesc || 'Post'}
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        )}
        
        {post.mediaType && post.mediaType.startsWith('audio') && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
            <motion.div
              animate={isActive ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative w-56 h-56"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] via-[#B8860B] to-[#8B6914] shadow-2xl shadow-[#FFD700]/30" />
              <div className="absolute inset-6 rounded-full bg-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Disc3 className="w-24 h-24 text-[#FFD700]" />
              </div>
              <div className="absolute inset-10 rounded-full border border-[#333]" />
              <div className="absolute inset-16 rounded-full border border-[#333]" />
              <div className="absolute inset-20 rounded-full border border-[#333]" />
            </motion.div>
            <audio
              ref={audioRef}
              src={post.mediaURL}
              loop
              muted={isMuted}
            />
          </div>
        )}
      </div>

      {/* Double tap heart */}
      <DoubleTapHeart show={showDoubleTapHeart} />

      {/* Gradient overlays - only at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Right sidebar - Action buttons */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10">
        {/* Author avatar */}
        <motion.div 
          className="relative mb-2"
          whileHover={{ scale: 1.1 }}
        >
          {post.authorPhoto ? (
            <img 
              src={post.authorPhoto}
              alt={post.authorName || 'Autore'}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center border-2 border-white">
              <User className="w-6 h-6 text-black" />
            </div>
          )}
          <motion.div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-black text-lg font-bold">+</span>
          </motion.div>
        </motion.div>

        {/* Like button */}
        <div className="relative flex flex-col items-center">
          <motion.button
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
            animate={isLiking ? { scale: [1, 1.4, 1] } : { scale: [1, 1.08, 1] }}
            transition={isLiking ? { duration: 0.2 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
            disabled={userLikes <= 0}
            className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
              userLikes > 0 ? '' : 'opacity-40'
            }`}
          >
            <motion.div 
              className="absolute inset-0 rounded-full bg-[#FFD700]/30 blur-lg"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Heart 
              className={`w-9 h-9 relative z-10 drop-shadow-lg ${
                userLikes > 0 ? 'text-white fill-[#FFD700]' : 'text-gray-500'
              }`} 
            />
          </motion.button>
          <motion.span 
            className="text-white font-bold text-xs mt-1"
            animate={isLiking ? { scale: [1, 1.3, 1] } : {}}
          >
            {post.likes || 0}
          </motion.span>
          
          <AnimatePresence>
            {floatingHearts.map(heart => (
              <FloatingHeart 
                key={heart.id} 
                id={heart.id} 
                color={heart.color}
                onComplete={removeHeart} 
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Comment button */}
        <motion.button 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onOpenComments?.(); }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <span className="text-white font-bold text-xs">{comments.length}</span>
        </motion.button>

        {/* Share button */}
        <motion.button 
          className="flex flex-col items-center"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onOpenShare?.(); }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <Share2 className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <span className="text-white font-bold text-xs">Condividi</span>
        </motion.button>

        {/* Mute button */}
        {(post.mediaType === 'video' || post.mediaType === 'audio') && (
          <motion.button
            onClick={toggleMute}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </motion.button>
        )}
      </div>

      {/* Bottom info */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute bottom-28 left-4 right-20 z-10"
      >
        {/* LIKEFLOW Logo */}
        <div className="mb-3">
          <div className="flex items-center gap-1">
            <span className="text-white font-black text-sm tracking-tighter">LIKE</span>
            <span className="text-[#FFD700] font-black text-sm tracking-tighter">FLOW</span>
          </div>
        </div>

        <motion.div 
          className="flex items-center gap-2 mb-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-white font-bold text-base">
            @{post.authorName || 'anonimo'}
          </span>
          <span className="text-gray-400 text-xs">• {formatDate(post.timestamp)}</span>
        </motion.div>

        {post.postDesc && (
          <motion.p 
            className="text-white text-sm line-clamp-2 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {post.postDesc}
          </motion.p>
        )}

        <motion.div 
          className="flex items-center gap-2 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Music className="w-4 h-4 text-white" />
          <div className="overflow-hidden max-w-[200px]">
            <motion.p 
              className="text-white text-xs whitespace-nowrap"
              animate={{ x: isActive ? [0, -100, 0] : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Original Sound - {post.authorName || 'LikeFlow'}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* User likes indicator - Bottom right */}
      <motion.div 
        className="absolute bottom-28 right-4 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 border border-[#FFD700]/30"
          animate={{ boxShadow: ['0 0 10px rgba(255,215,0,0.2)', '0 0 20px rgba(255,215,0,0.4)', '0 0 10px rgba(255,215,0,0.2)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
          <span className="text-white text-sm font-bold">{userLikes}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
