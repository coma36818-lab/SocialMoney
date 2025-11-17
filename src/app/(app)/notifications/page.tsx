'use client';
import React, { useState, useEffect } from "react";
import { base44 } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Heart, UserPlus, DollarSign, Info, Check, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import type { User, Notification } from "@/lib/types";

export default function Notifiche() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      router.push(createPageUrl("Login"));
    }
  };

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => base44.entities.Notification.list('-created_date'),
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await base44.entities.Notification.update(notificationId, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await base44.entities.Notification.delete(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(n => !n.read);
      for (const notification of unreadNotifications) {
        await base44.entities.Notification.update(notification.id, { read: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-primary" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-[#3D9DF7]" />;
      case "earning":
        return <DollarSign className="w-5 h-5 text-accent" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case "like":
        return "bg-primary/10";
      case "follow":
        return "bg-[#3D9DF7]/10";
      case "earning":
        return "bg-accent/10";
      default:
        return "bg-white/5";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-primary">Notifiche</span>
            </h1>
            <p className="text-gray-400">
              {unreadCount > 0 ? `${unreadCount} non lette` : "Tutto letto"}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Check className="w-4 h-4 mr-2" />
              Segna tutte lette
            </Button>
          )}
        </div>

        {/* Notifications */}
        <Card className="glass-card border-white/5">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-white/5 h-20 rounded-xl" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Nessuna notifica</h3>
                <p className="text-gray-400">Le tue notifiche appariranno qui</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-white/5 transition-colors ${
                      !notification.read ? "bg-white/3" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(notification.created_date), "d MMM yyyy · HH:mm", { locale: it })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-[#3D9DF7] hover:text-[#3D9DF7] hover:bg-[#3D9DF7]/10"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotificationMutation.mutate(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
