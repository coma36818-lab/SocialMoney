'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Maximize, Minimize } from 'lucide-react';


const games = [
    {
        id: 1,
        name: 'Asteroids.X',
        imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256ec677?w=600&q=80',
        gameUrl: 'https://idev.games/embed/asteroids-x',
    },
    {
        id: 2,
        name: 'Power of Ball',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
        gameUrl: 'https://idev.games/embed/power-of-ball',
    },
    ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 3,
        name: `Gioco ${i + 3}`,
        imageUrl: `https://images.unsplash.com/photo-1611996575749-79a3a2503948?w=400&h=300&fit=crop&q=80&sig=${i+1}`,
        gameUrl: `https://embed.crazygames.com/game${i + 3}`,
    }))
];

export default function GameLibraryPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isPageFullScreen, setIsPageFullScreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);


  const openGameInModal = (url: string) => {
    setSelectedGame(url);
    setIsPageFullScreen(false); // Reset on new game
  };

  const closeModal = () => {
    setSelectedGame(null);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsPageFullScreen(false);
  }

  const toggleFullScreen = () => {
    const gameContainer = gameContainerRef.current;
    if (!gameContainer) return;

    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        setIsPageFullScreen(true);
    } else {
        document.exitFullscreen();
        setIsPageFullScreen(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-fixed bg-center text-white"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1579546929518-9e396f3a8a09?q=80&w=2070&auto=format&fit=crop")',
      }}
    >
      <header className="text-center py-10 bg-black bg-opacity-50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl shadow-lg">
          Game Library
        </h1>
      </header>

      {selectedGame && (
        <section className={cn("fixed inset-0 z-50 bg-black/80 flex items-center justify-center", isPageFullScreen ? "p-0" : "p-4")}>
          <div 
            ref={gameContainerRef}
            id="game-container" 
            className={cn(
              "relative bg-black rounded-lg overflow-hidden transition-all duration-300", 
              isPageFullScreen ? "w-full h-full aspect-auto rounded-none" : "w-full max-w-7xl aspect-video"
            )}>
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
              <button
                onClick={toggleFullScreen}
                className="bg-white/20 text-white rounded-full p-1.5"
                aria-label="Toggle Fullscreen"
              >
                {isPageFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button
                onClick={closeModal}
                className="bg-white/20 text-white rounded-full p-1.5 leading-none"
                aria-label="Close"
              >
                &#x2715;
              </button>
            </div>
            <iframe
              src={selectedGame}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      <section id="game-library" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12 place-items-center">
          {games.map((game) => (
            <div
              key={game.id}
              className="group [perspective:1000px] w-full max-w-[300px]"
            >
              <div className="relative h-[220px] rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0">
                  <img
                    className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40"
                    src={game.imageUrl}
                    alt={game.name}
                  />
                </div>
                <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-6 py-4 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex min-h-full flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold font-headline text-primary mb-3">{game.name}</h3>
                    <button
                      onClick={() => openGameInModal(game.gameUrl)}
                      className="mt-4 rounded-md bg-primary/90 py-2 px-6 text-lg font-semibold text-white hover:bg-primary transition-colors duration-300 shadow-lg"
                    >
                      Gioca
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 text-center">
        <div className="my-10">
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4 text-white shadow-md">Supporta il Progetto</h3>
            <form action="https://www.paypal.com/donate" method="post" target="_blank" className="flex justify-center">
              <input type="hidden" name="business" value="alibi81@libero.it" />
              <input type="hidden" name="currency_code" value="EUR" />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Dona con PayPal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
