'use client';
import React, { useState, useEffect } from "react";
import { base44 } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserIcon, Heart, Wallet, TrendingUp, MapPin, Calendar, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { User, Post } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfiloUtentePage() {
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get('email');

  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['userPosts', targetEmail],
    queryFn: () => base44.entities.Post.filter({ created_by: targetEmail! }, '-created_date'),
    enabled: !!targetEmail,
  });

  const targetUser = allUsers.find(u => u.email === targetEmail);

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-400">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  const getGenderLabel = (gender: User['gender']) => {
    const labels = {
      uomo: "Uomo",
      donna: "Donna",
      altro: "Altro",
      'non specificato': "Non specificato"
    };
    return labels[gender] || "";
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  }


  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
              >
                <Avatar className="w-32 h-32 border-4 border-primary neon-glow">
                    <AvatarImage src={targetUser.avatar} alt={targetUser.full_name} className="object-cover" />
                    <AvatarFallback className="bg-muted-foreground text-4xl">
                        {getInitials(targetUser.full_name)}
                    </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{targetUser.full_name}</h1>
                <p className="text-gray-400 mb-4">@{targetUser.email.split('@')[0]}</p>
                
                {targetUser.bio && (
                  <p className="text-gray-300 mb-6">{targetUser.bio}</p>
                )}

                {/* User Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {targetUser.gender && targetUser.gender !== 'non specificato' && (
                    <span>{getGenderLabel(targetUser.gender)}</span>
                  )}
                 
                  {(targetUser.city || targetUser.region) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {[targetUser.city, targetUser.region, targetUser.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {targetUser.created_date && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Iscritto il {new Date(targetUser.created_date).toLocaleDateString('it-IT')}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FF0055] to-[#ff3366] mb-3">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Like Ricevuti</p>
                    <p className="text-2xl font-bold text-[#FF0055]">
                      {targetUser.likes_received || 0}
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] mb-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Post</p>
                    <p className="text-2xl font-bold text-[#FFD700]">
                      {userPosts.length}
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#3D9DF7] to-[#5ba8f7] mb-3">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Guadagni</p>
                    <p className="text-2xl font-bold text-[#3D9DF7]">
                      €{targetUser.total_earnings?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">Post di {targetUser.full_name}</h2>
            <p className="text-gray-400">{userPosts.length} contenuti</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square glass-card rounded-xl animate-pulse bg-white/10" />
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nessun post</h3>
              <p className="text-gray-400">Questo utente non ha ancora pubblicato contenuti</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative aspect-square glass-card rounded-xl overflow-hidden cursor-pointer"
                >
                  {post.media_type === "image" ? (
                    <Image
                      src={post.media_url}
                      alt={post.description || "Post"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={post.media_url}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-accent" fill="hsl(var(--accent))" />
                          <span className="font-bold">{post.likes_count || 0}</span>
                        </div>
                        <span className="font-bold text-accent">
                          {post.earnings?.toFixed(2) || "0.00"}€
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
