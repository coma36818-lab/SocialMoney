
'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal, TrendingUp, User, Loader2 } from "lucide-react";
import type { Post, User as UserType } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

export default function Classifica() {
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Query for top users based on earnings. Adjust field and limit as needed.
    return query(collection(firestore, "users"), orderBy("walletBalance", "desc"), limit(20));
  }, [firestore]);

  const { data: topUsers, isLoading: usersLoading } = useCollection<UserType>(usersQuery);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-background" />;
      case 2:
        return <Medal className="w-6 h-6 text-background" />;
      case 3:
        return <Medal className="w-6 h-6 text-background" />;
      default:
        return null;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-amber-500 gold-glow";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-500";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-amber-600";
      default:
        return "bg-gradient-to-r from-primary to-[#ff3366]";
    }
  };
    
  const getInitials = (name: string) => {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const leaderboard = topUsers?.map((user, index) => ({
      ...user,
      rank: index + 1,
      username: user.full_name || user.email.split('@')[0],
      earnings: user.walletBalance || 0,
      likes: user.totalLikesReceived || 0,
      posts: 0 // Note: post count is not directly available on user doc in this model
  }));

  const isLoading = usersLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl mb-4 gold-glow">
            <Trophy className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Classifica <span className="text-accent">Creator</span>
          </h1>
          <p className="text-muted-foreground text-lg">I migliori guadagni della piattaforma</p>
        </div>

        {!isLoading && leaderboard && leaderboard.length >= 3 && (
          <div className="grid md:grid-cols-3 gap-6 mb-12 items-end">
            <div className="md:order-1 order-2">
              <Card className="glass-card text-center pt-8 h-full flex flex-col justify-end">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                    <Medal className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-1">{leaderboard[1].username}</h3>
                  <p className="text-4xl font-bold text-slate-400 mb-4">
                    €{leaderboard[1].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{leaderboard[1].likes} like</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:order-2 order-1">
              <Card className="glass-card border-accent border-2 text-center pt-8 relative gold-glow">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center gold-glow">
                    <Crown className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
                <CardContent>
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center gold-glow">
                    <Trophy className="w-12 h-12 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-2xl mb-1">{leaderboard[0].username}</h3>
                  <p className="text-5xl font-bold text-accent mb-4">
                    €{leaderboard[0].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{leaderboard[0].likes} like</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:order-3 order-3">
              <Card className="glass-card text-center pt-8 h-full flex flex-col justify-end">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center">
                    <Medal className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-1">{leaderboard[2].username}</h3>
                  <p className="text-4xl font-bold text-orange-400 mb-4">
                    €{leaderboard[2].earnings.toFixed(2)}
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{leaderboard[2].likes} like</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Classifica Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary"/>
               </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nessun creator ancora</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((creator) => (
                  <div
                    key={creator.email}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center flex-shrink-0">
                        {creator.rank <= 3 ? (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBg(creator.rank)}`}>
                            {getRankIcon(creator.rank)}
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-muted-foreground">#{creator.rank}</span>
                        )}
                      </div>
                      
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} alt={creator.username} className="object-cover"/>
                        <AvatarFallback className="bg-muted-foreground">{getInitials(creator.username)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-semibold text-foreground">{creator.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {creator.likes} like
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

    