'use client';
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import PostCard from "@/components/feed/PostCard";
import TopCreators from "@/components/feed/TopCreators";
import UserStats from "@/components/feed/UserStats";
import { useUser, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, getDoc, runTransaction } from "firebase/firestore";
import type { Post, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function FeedPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const { toast } = useToast();

    const postsQuery = useMemoFirebase(() => {
      return query(collection(firestore, "posts"), orderBy("created_date", "desc"));
    }, [firestore]);

    const { data: posts, isLoading: isLoadingPosts } = useCollection<Post>(postsQuery);

    const userProfileQuery = useMemoFirebase(() => {
        if (!authUser) return null;
        return doc(firestore, 'users', authUser.uid);
      }, [firestore, authUser]);
    
      const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileQuery);


    const sendLikeMutation = useMutation({
        mutationFn: async ({ post }: { post: Post }) => {
            if (!authUser || !userProfile) throw new Error("User not authenticated.");
            if (userProfile.likeBalance <= 0) throw new Error("Non hai like disponibili. Ricarica!");
            if (post.userId === authUser.uid) throw new Error("Non puoi mettere like ai tuoi post.");
            
            const likeRef = doc(firestore, "likes", `${authUser.uid}_${post.id}`);
            const postRef = doc(firestore, "posts", post.id);
            const postOwnerRef = doc(firestore, "users", post.userId);
            const likerRef = doc(firestore, "users", authUser.uid);
            const notificationRef = doc(collection(firestore, `users/${post.userId}/notifications`));

            await runTransaction(firestore, async (transaction) => {
                const likeDoc = await transaction.get(likeRef);
                if (likeDoc.exists()) {
                    throw new Error("Hai già messo like a questo post.");
                }

                // 1. Create the like document
                transaction.set(likeRef, {
                    postId: post.id,
                    userId: authUser.uid,
                    created_date: new Date().toISOString(),
                });

                // 2. Update post
                transaction.update(postRef, {
                    likes_count: (post.likes_count || 0) + 1,
                    earnings: (post.earnings || 0) + 0.01
                });
                
                // 3. Update post owner's wallet
                transaction.update(postOwnerRef, {
                    walletBalance: (await transaction.get(postOwnerRef)).data()?.walletBalance + 0.01,
                    totalLikesReceived: (await transaction.get(postOwnerRef)).data()?.totalLikesReceived + 1
                });

                // 4. Decrement liker's like balance
                transaction.update(likerRef, {
                    likeBalance: userProfile.likeBalance - 1,
                    totalLikesSent: userProfile.totalLikesSent + 1,
                });

                // 5. Create notification for post owner
                transaction.set(notificationRef, {
                    userId: post.userId,
                    message: `${userProfile.username} ha inviato un like al tuo post! +0.01€`,
                    type: "like",
                    read: false,
                    created_date: new Date().toISOString()
                });
            });
        },
        onSuccess: () => {
            // Real-time updates handle UI invalidation
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
            audio.volume = 0.4;
            audio.play();
        },
        onError: (error: Error) => {
            toast({ variant: 'destructive', title: 'Errore', description: error.message });
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            const postRef = doc(firestore, 'posts', postId);
            deleteDocumentNonBlocking(postRef);
        },
        onSuccess: () => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
            audio.volume = 0.3;
            audio.play();
            toast({ title: 'Successo', description: 'Post eliminato.'});
        }
    });
    
    if (isAuthLoading || isProfileLoading || !userProfile) {
        return (
             <div className="min-h-screen w-full flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }
    
    const fullUser = { ...authUser, ...userProfile };

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
                                        onSendLike={() => sendLikeMutation.mutate({ post })} 
                                        onDelete={() => {
                                            if (confirm("Sei sicuro di voler eliminare questo post?")) {
                                                deletePostMutation.mutate(post.id);
                                            }
                                        }}
                                        user={fullUser}
                                        isLiking={sendLikeMutation.isPending}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                        <UserStats user={fullUser} />
                        <TopCreators posts={posts || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
