'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Post, User } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Heart, MessageCircle, DollarSign, Trash2, Loader2 } from "lucide-react";
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/lib/api";

interface PostCardProps {
    post: Post;
    user: User | null;
    onSendLike: () => void;
    onDelete: () => void;
    isLiking: boolean;
}

const PostCard = ({ post, user, onSendLike, onDelete, isLiking }: PostCardProps) => {

    const { data: owner } = useQuery({
        queryKey: ['user', post.created_by],
        queryFn: async () => {
            const users = await base44.entities.User.filter({ email: post.created_by });
            return users[0] || null;
        },
        enabled: !!post.created_by,
    });
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    return (
        <Card className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                         <Avatar className="h-11 w-11 border-2 border-primary/50">
                            <AvatarImage src={owner?.avatar} alt={owner?.full_name} className="object-cover" />
                            <AvatarFallback className="bg-muted-foreground">{getInitials(owner?.full_name || post.created_by.split('@')[0])}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-white">{owner?.full_name || post.created_by.split('@')[0]}</p>
                            <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true, locale: it })}</p>
                        </div>
                    </div>
                     {user?.email === post.created_by && (
                        <Button variant="ghost" size="icon" onClick={onDelete}>
                            <Trash2 className="w-5 h-5 text-gray-500 hover:text-destructive" />
                        </Button>
                    )}
                </div>
                {post.description && <p className="text-gray-300 mb-4">{post.description}</p>}
            </div>

            {post.media_type === 'image' && post.media_url && (
                <div className="relative aspect-video bg-black">
                     <Image src={post.media_url} alt="Post media" layout="fill" objectFit="contain" />
                </div>
            )}
            {post.media_type === 'video' && post.media_url && (
                <video controls src={post.media_url} className="w-full aspect-video" />
            )}
            
            <div className="p-4 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-white">{post.likes_count}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold text-white">0</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-accent" />
                        <span className="font-bold text-accent">{post.earnings.toFixed(2)}€</span>
                    </div>
                </div>
                 <Button onClick={onSendLike} className="bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-white" disabled={isLiking || user?.email === post.created_by}>
                    {isLiking ? <Loader2 className="w-5 h-5 animate-spin"/> : <Heart className="w-5 h-5" />}
                </Button>
            </div>
        </Card>
    );
}

export default PostCard;
