'use client';

import React from 'react';

interface Peer {
  hero_id: number;
  games_played: number;
  wins: number;
}

interface Hero {
  id: number;
  localized_name: string;
  img: string;
}

interface TeammatesProps {
  peers: Peer[];
  heroes: Hero[];
}

const Teammates: React.FC<TeammatesProps> = ({ peers, heroes }) => {
  if (!peers || peers.length === 0) {
    return null;
  }

  const getHeroData = (heroId: number) => {
    return heroes.find(h => h.id === heroId);
  };

  const teammatesWithData = peers.map(peer => ({
    ...peer,
    winrate: (peer.wins / peer.games_played) * 100,
    hero: getHeroData(peer.hero_id),
  }));

  const goodWith = teammatesWithData
    .filter(m => m.winrate > 50)
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 5);

  const badWith = teammatesWithData
    .filter(m => m.winrate <= 50)
    .sort((a, b) => a.winrate - b.winrate)
    .slice(0, 5);

  return (
    <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-orange-400 text-center">Compañeros de Equipo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-green-400 text-center">Buena Sinergia</h3>
          <div className="space-y-4">
            {goodWith.map(peer => (
              <div key={peer.hero_id} className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                <div className="w-12 h-12 bg-gray-900 rounded-md mr-4 text-xs flex items-center justify-center">IMG</div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{peer.hero?.localized_name}</p>
                  <p className="text-sm text-gray-400">{peer.games_played} partidas</p>
                </div>
                <p className="text-lg font-bold text-green-400">{peer.winrate.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-red-400 text-center">Mala Sinergia</h3>
          <div className="space-y-4">
            {badWith.map(peer => (
              <div key={peer.hero_id} className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                <div className="w-12 h-12 bg-gray-900 rounded-md mr-4 text-xs flex items-center justify-center">IMG</div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{peer.hero?.localized_name}</p>
                  <p className="text-sm text-gray-400">{peer.games_played} partidas</p>
                </div>
                <p className="text-lg font-bold text-red-400">{peer.winrate.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teammates;
