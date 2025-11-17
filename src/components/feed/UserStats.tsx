'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/lib/types";
import { Wallet, Heart, TrendingUp } from "lucide-react";

const UserStats = ({ user }: { user: User }) => {
    const stats = [
        { label: "Saldo", value: `€${user.balance.toFixed(2)}`, icon: Wallet, color: "text-accent" },
        { label: "Like Ricevuti", value: user.likes_received, icon: Heart, color: "text-primary" },
        { label: "Like Disponibili", value: user.likes_available, icon: TrendingUp, color: "text-blue-400" },
    ];

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="text-white">Le Tue Statistiche</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {stats.map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <p className="text-gray-300">{stat.label}</p>
                        </div>
                        <p className={`font-bold text-lg ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default UserStats;
