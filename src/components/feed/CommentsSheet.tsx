'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CommentsSheet({ isOpen, onClose, postId }: { isOpen: boolean, onClose: () => void, postId: string | null }) {
    
    // Mock comments
    const comments = postId ? [
        { id: 1, user: 'User1', text: 'Great post!' },
        { id: 2, user: 'User2', text: 'Awesome!' },
    ] : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-3/4 bg-card text-card-foreground">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
          <SheetDescription>
            {comments.length} comments on this post.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 overflow-y-auto h-[calc(100%-150px)]">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                    <p className="font-bold">{comment.user}:</p>
                    <p>{comment.text}</p>
                </div>
            ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Input placeholder="Add a comment..." />
            <Button>Post</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
