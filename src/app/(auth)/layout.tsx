import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
            {children}
        </div>
    </main>
  );
}
