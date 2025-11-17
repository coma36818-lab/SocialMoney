'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createPageUrl } from "@/lib/utils";
import { base44 } from "@/lib/api";
import { 
  Home, 
  User, 
  Wallet, 
  PlusSquare as Upload, 
  Bell, 
  Trophy, 
  Settings, 
  Heart,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User as UserType, Notification, Message } from "@/lib/types";

export function AppHeader({ user: initialUser }: { user: UserType }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(initialUser);
    loadNotifications();
    loadMessages();

    const interval = setInterval(() => {
      loadNotifications();
      loadMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [initialUser]);

  const loadNotifications = async () => {
    try {
      const notifications = await base44.entities.Notification.list('-created_date');
      const unread = notifications.filter((n: Notification) => !n.is_read);

      const previousCount = unreadNotifications;
      setUnreadNotifications(unread.length);
      
      if (unread.length > previousCount && previousCount > 0) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
        audio.volume = 0.3;
        audio.play();
      }
    } catch (error) {
      console.log("Error loading notifications", error);
    }
  };

  const loadMessages = async () => {
    try {
      if (!user) return;
      const messages = await base44.entities.Message.filter({ to_user_email: user.email, read: false });
      const previousCount = unreadMessages;
      setUnreadMessages(messages.length);
      
      if (messages.length > previousCount && previousCount > 0) {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
        audio.volume = 0.4;
        audio.play();
      }
    } catch (error) {
      console.log("Error loading messages", error);
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    router.push('/login');
  };

  const navItems = [
    { name: "Feed", href: createPageUrl("feed"), icon: Home },
    { name: "Cerca", href: createPageUrl("search"), icon: Search },
    { name: "Profilo", href: createPageUrl("profilo"), icon: User },
    { name: "Wallet", href: createPageUrl("wallet"), icon: Wallet },
    { name: "Upload", href: createPageUrl("upload"), icon: Upload },
    { name: "Messaggi", href: createPageUrl("messages"), icon: MessageCircle, badge: unreadMessages },
    { name: "Classifica", href: createPageUrl("leaderboard"), icon: Trophy },
    { name: "Notifiche", href: createPageUrl("notifications"), icon: Bell, badge: unreadNotifications },
    { name: "Impostazioni", href: createPageUrl("impostazioni"), icon: Settings },
  ];

  return (
      <>
        {/* Desktop Navbar */}
        <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <Link href={createPageUrl("feed")} className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-xl flex items-center justify-center neon-glow">
                    <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <h1 className="text-xl font-bold text-white group-hover:text-[#FF0055] transition-colors">
                    Social Money
                </h1>
                </Link>

                <div className="flex items-center gap-4">
                {navItems.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        pathname === item.href
                        ? "bg-[#FF0055] text-white neon-glow"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm hidden lg:inline">{item.name}</span>
                    {item.badge > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-[#FFD700] text-black text-xs px-1.5 py-0 h-5 gold-glow">
                        {item.badge}
                        </Badge>
                    )}
                    </Link>
                ))}

                {user && (
                    <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-semibold text-white">{user.full_name}</p>
                        <p className="text-xs text-[#FFD700] font-bold">{user.balance?.toFixed(2) || "0.00"}€</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                    </div>
                )}
                </div>
            </div>
            </div>
        </nav>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
            <div className="flex items-center justify-between px-4 py-3">
            <Link href={createPageUrl("feed")} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-lg font-bold text-white">Social Money</span>
            </Link>

            <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
                >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 glass-card border-b border-white/5 p-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                {navItems.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        pathname === item.href
                        ? "bg-[#FF0055] text-white"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                    >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge > 0 && (
                        <Badge className="ml-auto bg-[#FFD700] text-black">
                        {item.badge}
                        </Badge>
                    )}
                    </Link>
                ))}
                
                {user && (
                    <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div>
                        <p className="text-sm font-semibold text-white">{user.full_name}</p>
                        <p className="text-xs text-[#FFD700] font-bold">{user.balance?.toFixed(2) || "0.00"}€</p>
                        </div>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-gray-400"
                        >
                        <LogOut className="w-4 h-4 mr-2" />
                        Esci
                        </Button>
                    </div>
                    </div>
                )}
                </div>
            </div>
            )}
        </div>
      </>
  );
}
