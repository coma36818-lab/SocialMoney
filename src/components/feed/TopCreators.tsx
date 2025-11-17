'use client';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { Crown } from "lucide-react";
import { useMemo } from "react";

const TopCreators = ({ posts }: { posts: Post[] }) => {
    const topCreators = useMemo(() => {
        const creatorLikes: { [key: string]: number } = {};
        posts.forEach(post => {
            creatorLikes[post.created_by] = (creatorLikes[post.created_by] || 0) + post.likes_count;
        });

        return Object.entries(creatorLikes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([email, likes]) => ({ email, likes }));
    }, [posts]);

     const getInitials = (name: string) => {
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
                                <AvatarFallback className="bg-muted-foreground">{getInitials(creator.email.split('@')[0])}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-white">{creator.email.split('@')[0]}</p>
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
