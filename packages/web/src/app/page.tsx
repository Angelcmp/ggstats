'use client';

import Dota2Search from '../components/Dota2Search';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <Dota2Search />
    </main>
  );
}