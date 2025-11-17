'use client';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import PostCard from "@/components/feed/PostCard";
import TopCreators from "@/components/feed/TopCreators";
import UserStats from "@/components/feed/UserStats";
import { base44 } from "@/lib/api";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function FeedPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const queryClient = useQueryClient();
    const { toast } = useToast();

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

    const { data: posts, isLoading: isLoadingPosts } = useQuery({
        queryKey: ['posts'],
        queryFn: () => base44.entities.Post.list('-created_date'),
    });

    const sendLikeMutation = useMutation({
        mutationFn: async ({ postId, postOwner }: { postId: string, postOwner: string }) => {
            if (!user) throw new Error("Utente non autenticato");
            if (user.likes_available <= 0) {
                throw new Error("Non hai like disponibili. Ricarica!");
            }
            await base44.entities.Like.create({ post_id: postId, post_owner_email: postOwner, like_value: 0.01 });

            const post = posts?.find(p => p.id === postId);
            if (!post) throw new Error("Post not found");
            
            await base44.entities.Post.update(postId, { likes_count: (post.likes_count || 0) + 1, earnings: (post.earnings || 0) + 0.01 });
            await base44.auth.updateMe({ likes_available: user.likes_available - 1 });

            const ownerData = await base44.entities.User.filter({ email: postOwner });
            if (ownerData.length > 0) {
                const owner = ownerData[0];
                await base44.entities.User.update(owner.id, { 
                    likes_received: (owner.likes_received || 0) + 1, 
                    balance: (owner.balance || 0) + 0.01, 
                    total_earnings: (owner.total_earnings || 0) + 0.01 
                });
                await base44.entities.Notification.create({ created_by: postOwner, type: "like", message: `${user.full_name} ha inviato un like al tuo post! +0.01€` });
                await base44.entities.Transaction.create({ user_id: owner.id, type: "like_received", description: `Like da ${user.full_name}`, amount: 0.01 });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            loadUser();
        },
        onError: (error: Error) => {
            toast({ variant: 'destructive', title: 'Errore', description: error.message });
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            await base44.entities.Post.delete(postId);
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
            audio.volume = 0.3;
            audio.play();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast({ title: 'Successo', description: 'Post eliminato.'});
        }
    });
    
    if (!user) {
        return (
             <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                        <div className="glass-card rounded-2xl p-4 sm:p-6 neon-glow">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground sm:text-xl mb-1">Pubblica Contenuto</h3>
                                    <p className="text-xs text-muted-foreground sm:text-sm">Carica foto/video/testo e inizia a guadagnare</p>
                                </div>
                                <Button onClick={() => router.push(createPageUrl("Upload"))} className="w-full bg-gradient-to-r from-[#FF0055] to-[#ff3366] hover:opacity-90 text-primary-foreground sm:w-auto" size="lg" >
                                    <Plus className="w-5 h-5 mr-2" /> Pubblica
                                </Button>
                            </div>
                        </div>

                        {isLoadingPosts ? (
                             <div className="space-y-4 sm:space-y-6">
                                {[1, 2, 3].map(i => (
                                <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 animate-pulse">
                                    <div className="h-48 sm:h-64 bg-muted/50 rounded-xl" />
                                </div>
                                ))}
                            </div>
                        ) : !posts || posts.length === 0 ? (
                            <div className="glass-card rounded-2xl p-8 sm:p-12 text-center">
                                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Nessun post ancora</h3>
                                <p className="text-muted-foreground mb-6 text-sm sm:text-base">Sii il primo a pubblicare!</p>
                                <Button onClick={() => router.push(createPageUrl("Upload"))} className="bg-primary hover:bg-primary/90 text-primary-foreground" > Pubblica Ora </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                {posts.map(post => (
                                    <PostCard 
                                        key={post.id} 
                                        post={post} 
                                        onSendLike={() => sendLikeMutation.mutate({ postId: post.id, postOwner: post.created_by })} 
                                        onDelete={() => {
                                            if (confirm("Sei sicuro di voler eliminare questo post?")) {
                                                deletePostMutation.mutate(post.id);
                                            }
                                        }}
                                        user={user} 
                                        isLiking={sendLikeMutation.isPending}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                        {user && <UserStats user={user} />}
                        <TopCreators posts={posts || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
