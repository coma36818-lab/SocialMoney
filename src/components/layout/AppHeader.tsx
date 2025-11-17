
'use client';

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/app/logo.png';
import { usePathname, useRouter } from 'next/navigation';
import { createPageUrl } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";

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

export function AppHeader({ user }: { user: UserType }) {
  const pathname = usePathname();
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/notifications`), where("read", "==", false));
  }, [firestore, user]);
  const { data: unreadNotifications } = useCollection<Notification>(notificationsQuery);
  
  const messagesQuery = useMemoFirebase(() => {
    if(!user) return null;
    return query(collection(firestore, 'messages'), where('toUserId', '==', user.uid), where('read', '==', false));
  }, [firestore, user]);
  const { data: unreadMessages } = useCollection<Message>(messagesQuery);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { name: "Feed", href: createPageUrl("feed"), icon: Home },
    { name: "Cerca", href: createPageUrl("search"), icon: Search },
    { name: "Profilo", href: createPageUrl("profilo"), icon: User },
    { name: "Wallet", href: createPageUrl("wallet"), icon: Wallet },
    { name: "Upload", href: createPageUrl("upload"), icon: Upload },
    { name: "Messaggi", href: createPageUrl("messages"), icon: MessageCircle, badge: unreadMessages?.length || 0 },
    { name: "Classifica", href: createPageUrl("leaderboard"), icon: Trophy },
    { name: "Notifiche", href: createPageUrl("notifications"), icon: Bell, badge: unreadNotifications?.length || 0 },
    { name: "Impostazioni", href: createPageUrl("impostazioni"), icon: Settings },
  ];

  return (
      <>
        {/* Desktop Navbar */}
        <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-16">
                  <Link href={createPageUrl("feed")} className="flex items-center gap-3 group">
                      <Image src={logo} alt="Social Money" width={40} height={40} className="rounded-xl neon-glow" />
                      <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          Social Money
                      </h1>
                  </Link>
                  <div className="flex items-center gap-2">
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
                  </div>
              </div>

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

    