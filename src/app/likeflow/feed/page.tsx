
'use client';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function LikeFlowFeedPage() {
  useEffect(() => {
    // Inject styles and scripts for the feed functionality
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/styles.css';
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/likeflow.js';
    document.body.appendChild(script);

    return () => {
      // Cleanup on component unmount
      if (style.parentNode) {
          document.head.removeChild(style);
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
        <div id="walletBox" className="bg-card/50 border border-border rounded-lg p-4 mb-8 flex items-center justify-between max-w-md mx-auto">
            <p className="text-muted-foreground">
                Like disponibili: <span id="walletValue" className="font-bold text-primary">0</span>
            </p>
            <Button onClick={() => window.location.href = '/likeflow/purchase'} size="sm">
                Compra Like
            </Button>
        </div>
        <div id="feedContainer"></div>
    </div>
  );
}
