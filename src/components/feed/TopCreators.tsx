'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/lib/api";
import type { Post, User } from "@/lib/types";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator extends Partial<User> {
    email: string;
    earnings: number;
    username: string;
}

export default function TopCreators({ posts }: { posts: Post[] }) {
    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['allUsers'],
        queryFn: () => base44.entities.User.list(),
    });

    const topCreators: Creator[] = useMemo(() => {
        const creatorEarnings: { [key: string]: number } = {};
        
        posts.forEach(post => {
            if (!creatorEarnings[post.created_by]) {
                creatorEarnings[post.created_by] = 0;
            }
            creatorEarnings[post.created_by] += post.earnings || 0;
        });

        return Object.entries(creatorEarnings)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([email, earnings]) => {
                const user = users.find(u => u.email === email);
                return {
                    ...user,
                    email,
                    earnings,
                    username: user?.full_name || email.split('@')[0]
                };
            });
    }, [posts, users]);

    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <Card className="glass-card border-white/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-accent" />
                    Top Creator Oggi
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {topCreators.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                        Nessun creator ancora
                    </p>
                ) : (
                    topCreators.map((creator, index) => (
                        <div
                            key={creator.email}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className={`h-12 w-12 border-2 ${
                                    index === 0 ? "border-accent" :
                                    index === 1 ? "border-gray-400" :
                                    index === 2 ? "border-[#CD7F32]" :
                                    "border-primary/50"
                                }`}>
                                    <AvatarImage src={creator.avatar} alt={creator.username} className="object-cover"/>
                                    <AvatarFallback className="bg-muted-foreground">{getInitials(creator.username)}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="font-semibold text-white text-sm">{creator.username}</p>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                            index === 0 ? "bg-accent" :
                                            index === 1 ? "bg-gray-400" :
                                            index === 2 ? "bg-[#CD7F32]" :
                                            "bg-primary/50"
                                        }`}></div>
                                        <span>#{index + 1}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="font-bold text-accent">
                                {creator.earnings.toFixed(2)}€
                            </p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

    