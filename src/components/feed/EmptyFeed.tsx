import React from 'react';
import { CameraOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyFeed() {
  return (
    <div className="h-[100dvh] w-full bg-black flex flex-col items-center justify-center text-center p-4">
      <CameraOff className="w-20 h-20 text-[#FFD700] mb-6" />
      <h2 className="text-3xl font-bold text-white mb-2">No Posts Yet</h2>
      <p className="text-lg text-gray-400 mb-8">Be the first to share something amazing!</p>
      <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <Link href="/likeflow/upload">Upload a Post</Link>
      </Button>
    </div>
  );
}
