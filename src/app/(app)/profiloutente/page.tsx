
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
  const targetEmail = searchParams?.get('email');

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  const getGenderLabel = (gender: User['gender']) => {
    if (!gender) return "";
    const labels: Record<string, string> = {
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
    <div className="min-h-screen bg-background">
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
                    <AvatarImage src={targetUser.avatar} alt={targetUser.username} className="object-cover" />
                    <AvatarFallback className="bg-muted text-4xl">
                        {getInitials(targetUser.username)}
                    </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground mb-2">{targetUser.username}</h1>
                <p className="text-muted-foreground mb-4">@{targetUser.email.split('@')[0]}</p>
                
                {targetUser.bio && (
                  <p className="mb-6">{targetUser.bio}</p>
                )}

                {/* User Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {targetUser.gender && targetUser.gender !== 'non specificato' && (
                    <span>{getGenderLabel(targetUser.gender)}</span>
                  )}
                 
                  {(targetUser.city || targetUser.region) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {[targetUser.city, targetUser.region, targetUser.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {targetUser.createdAt && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Iscritto il {new Date(targetUser.createdAt).toLocaleDateString('it-IT')}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#ff3366] mb-3">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Like Ricevuti</p>
                    <p className="text-2xl font-bold text-primary">
                      {targetUser.totalLikesReceived || 0}
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-accent to-yellow-500 mb-3">
                      <TrendingUp className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Post</p>
                    <p className="text-2xl font-bold text-accent">
                      {userPosts.length}
                    </p>
                  </div>

                  <div className="glass-card rounded-xl p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 mb-3">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Guadagni</p>
                    <p className="text-2xl font-bold text-blue-500">
                      €{targetUser.walletBalance?.toFixed(2) || "0.00"}
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Post di {targetUser.username}</h2>
            <p className="text-muted-foreground">{userPosts.length} contenuti</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square glass-card rounded-xl animate-pulse bg-muted" />
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Nessun post</h3>
              <p className="text-muted-foreground">Questo utente non ha ancora pubblicato contenuti</p>
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
                  {post.media_url && post.media_type === "image" ? (
                    <Image
                      src={post.media_url}
                      alt={post.description || "Post"}
                      fill
                      className="object-cover"
                    />
                  ) : post.media_url && post.media_type === "video" ? (
                    <video
                      src={post.media_url}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  
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
