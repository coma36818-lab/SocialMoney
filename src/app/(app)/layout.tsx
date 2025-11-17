'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { doc, getFirestore } from 'firebase/firestore';
import type { User as UserProfile } from '@/lib/types';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = getFirestore();

  // Memoize the document reference
  const userProfileRef = useMemoFirebase(() => {
    if (!authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  // Fetch the user profile from Firestore
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    // If auth has finished loading and there's no user, redirect to login
    if (!isAuthLoading && !authUser) {
      router.replace('/login');
    }
  }, [isAuthLoading, authUser, router]);

  const isLoading = isAuthLoading || isProfileLoading;

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary h-12 w-12 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Combine auth and profile data for the header
  const fullUser = { ...authUser, ...userProfile };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={fullUser} />
      <main className="pt-16 md:pt-20 min-h-screen">
        {children}
      </main>
    </div>
  );
}
