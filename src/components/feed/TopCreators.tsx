'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/lib/api";
import type { Post, User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { useMemo } from "react";

interface Creator extends User {
    likes: number;
}

const TopCreators = ({ posts }: { posts: Post[] }) => {
    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['allUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const topCreators = useMemo(() => {
        const creatorLikes: { [key: string]: number } = {};
        posts.forEach(post => {
            creatorLikes[post.created_by] = (creatorLikes[post.created_by] || 0) + post.likes_count;
        });

        const sortedCreators = Object.entries(creatorLikes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([email, likes]) => {
                const user = users.find(u => u.email === email);
                return { ...user, email, likes };
            });

        return sortedCreators as Creator[];
    }, [posts, users]);

     const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="w-6 h-6 text-accent" />
                    Top Creators
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {topCreators.map((creator, index) => (
                    <div key={creator.email} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10 border-2 border-accent/50">
                                <AvatarImage src={creator.avatar} alt={creator.full_name} className="object-cover"/>
                                <AvatarFallback className="bg-muted-foreground">{getInitials(creator.full_name || creator.email.split('@')[0])}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-white">{creator.full_name || creator.email.split('@')[0]}</p>
                                <p className="text-xs text-gray-500">{creator.likes.toLocaleString('it-IT')} likes</p>
                            </div>
                        </div>
                         <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default TopCreators;
