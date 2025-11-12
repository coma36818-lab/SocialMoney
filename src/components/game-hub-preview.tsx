
'use client';

import Link from 'next/link';

export function GameHubPreview() {
  return (
    <section className="flex justify-center items-center h-[70vh]">
      <Link href="/library">
        <div className="w-[400px] h-[400px] bg-white rounded-[15px] shadow-[0_10px_20px_rgba(0,0,0,0.3)] text-center cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop"
            alt="Anteprima Game Hub"
            className="w-full rounded-t-[15px]"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold font-headline text-primary">Scopri tutti i giochi!</h2>
          </div>
        </div>
      </Link>
    </section>
  );
}
