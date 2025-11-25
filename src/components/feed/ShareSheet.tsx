'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function ShareSheet({ isOpen, onClose, postId }: { isOpen: boolean, onClose: () => void, postId: string | null }) {
  const postUrl = postId ? `${window.location.origin}/post/${postId}` : '';
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-card text-card-foreground">
        <SheetHeader>
          <SheetTitle>Share this Post</SheetTitle>
        </SheetHeader>
        <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">Share this amazing post with your friends!</p>
            <div className="flex gap-4">
                <Button onClick={() => navigator.clipboard.writeText(postUrl)}>Copy Link</Button>
                {/* Add more share options here */}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
