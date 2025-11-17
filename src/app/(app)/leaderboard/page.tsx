'use client';
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal, TrendingUp, User, Loader2 } from "lucide-react";
import type { Post, User as UserType } from "@/lib/types";

export default function Classifica() {
  const { data: allUsers, isLoading: usersLoading } = useQuery<UserType[]>({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => base44.entities.Post.list('-created_date'),
    initialData: [],
  });

  const getLeaderboard = () => {
    const userEarnings: {[key: string]: {email: string, earnings: number, likes: number, posts: number, avatar?: string}} = {};
    
    if(!posts) return [];

    posts.forEach(post => {
      if (!userEarnings[post.created_by]) {
        const user = allUsers.find(u => u.email === post.created_by);
        userEarnings[post.created_by] = {
          email: post.created_by,
          earnings: 0,
          likes: 0,
          posts: 0,
          avatar: user?.avatar
        };
      }
      userEarnings[post.created_by].earnings += post.earnings || 0;
      userEarnings[post.created_by].likes += post.likes_count || 0;
      userEarnings[post.created_by].posts += 1;
    });
    
    return Object.values(userEarnings)
      .sort((a, b) => b.earnings - a.earnings)
      .map((user, index) => {
        const userData = allUsers.find(u => u.email === user.email);
        return {
        ...user,
        rank: index + 1,
        username: userData?.full_name || user.email.split('@')[0]
      }});
  };

  const leaderboard = getLeaderboard();
  const isLoading = usersLoading || postsLoading;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-white" />;
      case 2:
        return <Medal className="w-6 h-6 text-white" />;
      case 3:
        return <Medal className="w-6 h-6 text-white" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-[#FFD700] to-[#FFA500] gold-glow";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-[#CD7F32] to-[#8B4513]";
      default:
        return "bg-gradient-to-r from-[#FF0055] to-[#ff3366]";
    }
  };
    
  const getInitials = (name: string) => {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-[#FFA500] rounded-2xl mb-4 gold-glow">
            <Trophy className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Classifica <span className="text-accent">Creator</span>
          </h1>
          <p className="text-gray-400 text-lg">I migliori guadagni della piattaforma</p>
        </div>

        {!isLoading && leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12 items-end">
            <div className="md:order-1 order-2">
              <Card className="glass-card border-gray-400/30 text-center pt-8 h-full flex flex-col justify-end">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <Medal className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1">{leaderboard[1].username}</h3>
                  <p className="text-4xl font-bold text-gray-400 mb-4">
                    €{leaderboard[1].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{leaderboard[1].likes} like · {leaderboard[1].posts} post</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:order-2 order-1">
              <Card className="glass-card border-accent border-2 text-center pt-8 relative gold-glow">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-[#FFA500] rounded-full flex items-center justify-center gold-glow">
                    <Crown className="w-6 h-6 text-black" />
                  </div>
                </div>
                <CardContent>
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent to-[#FFA500] rounded-full flex items-center justify-center gold-glow">
                    <Trophy className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="font-bold text-white text-2xl mb-1">{leaderboard[0].username}</h3>
                  <p className="text-5xl font-bold text-accent mb-4">
                    €{leaderboard[0].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>{leaderboard[0].likes} like · {leaderboard[0].posts} post</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:order-3 order-3">
              <Card className="glass-card border-[#CD7F32]/30 text-center pt-8 h-full flex flex-col justify-end">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#CD7F32] to-[#A0522D] rounded-full flex items-center justify-center">
                    <Medal className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl mb-1">{leaderboard[2].username}</h3>
                  <p className="text-4xl font-bold text-[#CD7F32] mb-4">
                    €{leaderboard[2].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>{leaderboard[2].likes} like · {leaderboard[2].posts} post</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Classifica Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary"/>
               </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Nessun creator ancora</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((creator) => (
                  <div
                    key={creator.email}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center flex-shrink-0">
                        {creator.rank <= 3 ? (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBg(creator.rank)}`}>
                            {getRankIcon(creator.rank)}
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-500">#{creator.rank}</span>
                        )}
                      </div>

                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <p className="font-semibold text-white">{creator.username}</p>
                        <p className="text-sm text-gray-500">
                          {creator.likes} like · {creator.posts} post
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-accent">
                        €{creator.earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
