'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function BuyLikesModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Out of Likes!</DialogTitle>
          <DialogDescription>
            You've run out of likes. Purchase more to continue supporting your favorite creators.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button asChild>
                <Link href="/likeflow/purchase">Buy Likes</Link>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
