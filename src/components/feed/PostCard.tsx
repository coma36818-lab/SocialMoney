'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

export function PostCard({ post, onLike, userLikes, isActive, playSound, onOpenComments, onOpenShare }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);
  
  const handleLikeClick = () => {
    playSound('like');
    onLike(post.id);
  }

  const renderMedia = () => {
    if (post.mediaType.startsWith('video')) {
      return <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" src={post.mediaURL} loop muted playsInline />;
    }
    if (post.mediaType.startsWith('image')) {
      return <img className="absolute inset-0 w-full h-full object-cover" src={post.mediaURL} alt={post.postDesc || 'Post image'} />;
    }
    return null;
  }

  return (
    <div className="h-[100dvh] w-full relative snap-start flex items-center justify-center">
      {renderMedia()}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute bottom-24 left-4 text-white z-10 max-w-[calc(100%-8rem)]">
        <div className="flex items-center gap-3 mb-2">
          <img src={post.authorPhoto || '/default-avatar.png'} alt={post.authorName || 'Anonymous'} className="w-12 h-12 rounded-full border-2 border-[#FFD700] object-cover" />
          <h3 className="font-bold text-lg drop-shadow-md">{post.authorName || 'Anonymous'}</h3>
        </div>
        <p className="text-sm drop-shadow-sm">{post.postDesc}</p>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <Music className="w-4 h-4" />
          <span>Original audio</span>
        </div>
      </div>
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-4 z-10">
        <button onClick={handleLikeClick} className="flex flex-col items-center text-white">
          <motion.div whileTap={{ scale: 1.2 }}>
            <Heart className={`w-8 h-8 ${userLikes > 0 ? 'text-[#FFD700]' : 'text-white'}`} fill={userLikes > 0 ? 'currentColor' : 'none'} />
          </motion.div>
          <span className="text-xs font-semibold">{post.likes || 0}</span>
        </button>
        <button onClick={onOpenComments} className="flex flex-col items-center text-white">
          <MessageCircle className="w-8 h-8" />
          <span className="text-xs font-semibold">{post.comments || 0}</span>
        </button>
        <button onClick={onOpenShare} className="flex flex-col items-center text-white">
          <Share2 className="w-8 h-8" />
          <span className="text-xs font-semibold">Share</span>
        </button>
      </div>
    </div>
  );
}
