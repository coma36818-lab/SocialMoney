'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { base44 } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await base44.auth.me();
        router.replace('/feed');
      } catch (error) {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary h-12 w-12 mx-auto mb-4" />
        <p className="text-muted-foreground">Loading Social Money...</p>
      </div>
    </div>
  );
}
