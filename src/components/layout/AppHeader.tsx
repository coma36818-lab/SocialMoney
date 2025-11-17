'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/logo.png';
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
    loadUnreadCounts();

    const interval = setInterval(() => {
      loadUnreadCounts();
    }, 5000);
    return () => clearInterval(interval);
  }, [initialUser]);

  const loadUnreadCounts = async () => {
    try {
        if (!user) return;
        const notifications = await base44.entities.Notification.list('-created_date');
        const unreadNotifs = notifications.filter((n: Notification) => !n.read);
        if (unreadNotifs.length > unreadNotifications) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
            audio.volume = 0.3;
            audio.play();
        }
        setUnreadNotifications(unreadNotifs.length);

        const messages = await base44.entities.Message.filter({ to_user_email: user.email, read: false });
        if (messages.length > unreadMessages) {
             const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
            audio.volume = 0.4;
            audio.play();
        }
        setUnreadMessages(messages.length);

    } catch (error) {
        console.log("Error loading unread counts", error);
    }
  }


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
        <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <Link href={createPageUrl("feed")} className="flex items-center gap-3 group">
                    <Image src={logo} alt="Social Money" width={40} height={40} className="rounded-xl neon-glow" />
                    <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
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
                        ? "bg-primary text-primary-foreground neon-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm hidden lg:inline">{item.name}</span>
                    {item.badge != null && item.badge > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-1.5 py-0 h-5 gold-glow">
                        {item.badge}
                        </Badge>
                    )}
                    </Link>
                ))}

                {user && (
                    <div className="flex items-center gap-3 pl-3 border-l border-border">
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-semibold text-foreground">{user.username}</p>
                        <p className="text-xs text-accent font-bold">{user.walletBalance?.toFixed(2) || "0.00"}€</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted"
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
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
            <div className="flex items-center justify-between px-4 py-3">
                <Link href={createPageUrl("feed")} className="flex items-center gap-2">
                    <Image src={logo} alt="Social Money" width={32} height={32} className="rounded-lg" />
                    <span className="text-lg font-bold text-foreground">Social Money</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-foreground"
                    >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 glass-card border-b border-border p-4 max-h-[80vh] overflow-y-auto">
                <div className="space-y-2">
                {navItems.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge != null && item.badge > 0 && (
                        <Badge className="ml-auto bg-accent text-accent-foreground">
                        {item.badge}
                        </Badge>
                    )}
                    </Link>
                ))}
                
                {user && (
                    <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div>
                        <p className="text-sm font-semibold text-foreground">{user.username}</p>
                        <p className="text-xs text-accent font-bold">{user.walletBalance?.toFixed(2) || "0.00"}€</p>
                        </div>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-muted-foreground"
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
