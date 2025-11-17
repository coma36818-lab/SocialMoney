'use client';
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Heart, TrendingUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import type { User } from "@/lib/types";

export default function UserStats({ user }: { user: User }) {
  const router = useRouter();

  const stats = [
    {
      label: "Saldo",
      value: `${user.balance?.toFixed(2) || "0.00"}€`,
      icon: Wallet,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      label: "Like Ricevuti",
      value: user.likes_received || 0,
      icon: Heart,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      label: "Like Disponibili",
      value: user.likes_available || 0,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground mb-4">Le Tue Statistiche</h3>
        
        <div className="space-y-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2">
          <Button
            onClick={() => router.push(createPageUrl("Ricarica"))}
            className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ricarica Like
          </Button>
          <Button
            onClick={() => router.push(createPageUrl("Wallet"))}
            className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:opacity-90 text-accent-foreground font-semibold"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Vai al Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
