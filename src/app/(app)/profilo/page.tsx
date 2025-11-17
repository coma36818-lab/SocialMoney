'use client';
import React, { useState, useEffect } from "react";
import { base44 } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Heart, Wallet, TrendingUp, Edit, Loader2, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import type { User, Post } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


export default function ProfiloPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await base44.auth.me();
            setUser(userData);
        } catch (error) {
            router.push(createPageUrl("login"));
        }
    };

    const { data: userPosts, isLoading } = useQuery({
        queryKey: ['userPosts', user?.email],
        queryFn: () => base44.entities.Post.filter({ created_by: user!.email }, '-created_date'),
        enabled: !!user,
    });
    
    useEffect(() => {
        const refetchUser = async () => {
            if (user) {
                const updatedUser = await base44.auth.me();
                setUser(updatedUser);
            }
        };
        const interval = setInterval(refetchUser, 2000); // Refetch every 2 seconds
        return () => clearInterval(interval);
    }, [user]);


    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary" />
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
        return labels[gender] || gender;
    };

    const stats = [
        { label: "Guadagni", value: `€${user.total_earnings?.toFixed(2) || "0.00"}`, icon: Wallet, color: "text-accent", gradient: "from-accent to-[#FFA500]" },
        { label: "Like Ricevuti", value: user.likes_received || 0, icon: Heart, color: "text-primary", gradient: "from-primary to-[#ff3366]" },
        { label: "Post", value: userPosts?.length || 0, icon: TrendingUp, color: "text-[#3D9DF7]", gradient: "from-[#3D9DF7] to-[#5ba8f7]" },
    ];

    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} >
                    <div className="glass-card rounded-3xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="relative">
                                <motion.div whileHover={{ scale: 1.05, rotate: 5 }} >
                                     <Avatar className="w-32 h-32 border-4 border-primary neon-glow">
                                        <AvatarImage src={user.avatar} alt={user.full_name} className="object-cover" />
                                        <AvatarFallback className="bg-muted-foreground text-4xl">
                                            {getInitials(user.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => router.push(createPageUrl("Impostazioni"))} className="absolute bottom-0 right-0 w-10 h-10 bg-accent rounded-full flex items-center justify-center gold-glow hover:opacity-80 transition-opacity" >
                                    <Edit className="w-5 h-5 text-black" />
                                </motion.button>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{user.full_name}</h1>
                                <p className="text-gray-400 mb-4">@{user.email.split('@')[0]}</p>
                                {user.bio && (<p className="text-gray-300 mb-6">{user.bio}</p>)}
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                                  {user.gender && (
                                    <span>{getGenderLabel(user.gender)}</span>
                                  )}
                                  {(user.city || user.region) && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {[user.city, user.region, user.country].filter(Boolean).join(', ')}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Iscritto il {new Date(user.created_date!).toLocaleDateString('it-IT')}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    {stats.map((stat, index) => (
                                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="glass-card rounded-xl p-4 text-center" >
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} mb-3`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={() => router.push(createPageUrl("Wallet"))} className="bg-gradient-to-r from-accent to-[#FFA500] hover:opacity-90 text-black font-semibold gold-glow" >
                                            <Wallet className="w-4 h-4 mr-2" /> Il mio Wallet
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={() => router.push(createPageUrl("Ricarica"))} className="bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-white neon-glow" >
                                            <Heart className="w-4 h-4 mr-2" /> Ricarica Like
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button onClick={() => router.push(createPageUrl("Impostazioni"))} className="border-white/10 text-white hover:bg-white/5 bg-[#1a1a1a] border" >
                                            <Edit className="w-4 h-4 mr-2" /> Modifica Profilo
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} >
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-white mb-2">I Tuoi Post</h2>
                        <p className="text-gray-400">{userPosts?.length || 0} contenuti pubblicati</p>
                    </div>
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (<div key={i} className="aspect-square glass-card rounded-xl animate-pulse bg-white/10" />))}
                        </div>
                    ) : !userPosts || userPosts.length === 0 ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <UserIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Nessun post ancora</h3>
                            <p className="text-gray-400 mb-6">Inizia a pubblicare contenuti per guadagnare!</p>
                            <Button onClick={() => router.push(createPageUrl("Upload"))} className="bg-primary hover:bg-primary/90 text-white">Pubblica Ora</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                            {userPosts.map((post: Post, index: number) => (
                                <motion.div key={post.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.05 }} className="group relative aspect-square glass-card rounded-xl overflow-hidden cursor-pointer">
                                    {post.media_url ? (
                                        <Image src={post.media_url} alt={post.description || 'Post'} fill className="object-cover" />
                                    ) : null}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                            <div className="flex items-center justify-between text-white">
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-accent" fill="hsl(var(--accent))" />
                                                    <span className="font-bold text-sm">{post.likes_count || 0}</span>
                                                </div>
                                                <span className="font-bold text-accent text-sm">{post.earnings?.toFixed(2) || "0.00"}€</span>
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

    