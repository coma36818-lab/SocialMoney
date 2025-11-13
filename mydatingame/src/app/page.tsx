import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Welcome to My Dating Game
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Your portal to fun and exciting browser games.
        </p>
        <Link href="/games" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full transition-transform transform hover:scale-105 text-lg">
          Explore Games
        </Link>
      </div>
    </div>
  );
}
