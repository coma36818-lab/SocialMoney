'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { base44 } from '@/lib/api';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
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
    <div className="flex min-h-screen">
      <AppSidebar user={user} />
      <main className="flex-1 pl-0 md:pl-64">
        {children}
      </main>
    </div>
  );
}
