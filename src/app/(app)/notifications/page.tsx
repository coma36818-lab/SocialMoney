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
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "earning":
        return <DollarSign className="w-5 h-5 text-accent" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case "like":
        return "bg-primary/10";
      case "follow":
        return "bg-blue-500/10";
      case "earning":
        return "bg-accent/10";
      default:
        return "bg-muted/50";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              <span className="text-primary">Notifiche</span>
            </h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} non lette` : "Tutto letto"}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              variant="outline"
            >
              <Check className="w-4 h-4 mr-2" />
              Segna tutte lette
            </Button>
          )}
        </div>

        {/* Notifications */}
        <Card className="glass-card">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-muted/50 h-20 rounded-xl" />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Nessuna notifica</h3>
                <p className="text-muted-foreground">Le tue notifiche appariranno qui</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-muted/50 transition-colors ${
                      !notification.read ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBg(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium mb-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(notification.created_date), "d MMM yyyy · HH:mm", { locale: it })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteNotificationMutation.mutate(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
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
