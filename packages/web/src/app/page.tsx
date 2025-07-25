'use client';

import Dota2Search from '../components/Dota2Search';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[url('/wdota.jpg')] bg-cover bg-center">
      {/* Overlay for opacity and gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900"></div>
      {/* Content, positioned above the overlay */}
      <div className="relative z-10">
        <Dota2Search />
      </div>
    </main>
  );
}