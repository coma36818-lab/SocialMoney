'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { base44 } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    const checkAuth = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        router.replace('/login');
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isAuthenticating || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary h-12 w-12 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} />
      <main className="pt-16 md:pt-20 min-h-screen">
        {children}
      </main>
    </div>
  );
}
