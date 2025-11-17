'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User as UserIcon, Wallet, PlusSquare, Settings, LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { base44 } from '@/lib/api';
import type { User } from '@/lib/types';

const navItems = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/profilo', label: 'Profilo', icon: UserIcon },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/ricarica', label: 'Ricarica', icon: Sparkles },
  { href: '/impostazioni', label: 'Impostazioni', icon: Settings },
];

export function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await base44.auth.logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-white/10 bg-background md:flex">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
        <Link href="/feed" className="text-2xl font-bold text-white">
          Connect<span className="text-primary">Now</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <Link href="/upload" legacyBehavior>
          <a className="block mb-4">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 neon-glow">
              <PlusSquare className="mr-2 h-5 w-5" />
              Pubblica Contenuto
            </Button>
          </a>
        </Link>
        {navItems.map((item) => (
          <Link href={item.href} key={item.href} legacyBehavior>
            <a
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:bg-white/10 hover:text-white',
                pathname === item.href && 'bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback className="bg-muted-foreground">{getInitials(user.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
