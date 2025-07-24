'use client';

import React from 'react';

interface Matchup {
  hero_id: number;
  games_played: number;
  wins: number;
}

interface Hero {
  id: number;
  localized_name: string;
  img: string;
}

interface MatchupsProps {
  matchups: Matchup[];
  heroes: Hero[];
}

const Matchups: React.FC<MatchupsProps> = ({ matchups, heroes }) => {
  if (!matchups || matchups.length === 0) {
    return null;
  }

  const getHeroData = (heroId: number) => {
    return heroes.find(h => h.id === heroId);
  };

  const matchupsWithData = matchups.map(matchup => ({
    ...matchup,
    winrate: (matchup.wins / matchup.games_played) * 100,
    hero: getHeroData(matchup.hero_id),
  }));

  const goodAgainst = matchupsWithData
    .filter(m => m.winrate > 50)
    .sort((a, b) => b.winrate - a.winrate)
    .slice(0, 5);

  const badAgainst = matchupsWithData
    .filter(m => m.winrate <= 50)
    .sort((a, b) => a.winrate - b.winrate)
    .slice(0, 5);

  return (
    <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400 text-center">Enfrentamientos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-green-400 text-center">Fuerte Contra</h3>
          <div className="space-y-4">
            {goodAgainst.map(matchup => (
              <div key={matchup.hero_id} className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                <div className="w-12 h-12 bg-gray-900 rounded-md mr-4 text-xs flex items-center justify-center">IMG</div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{matchup.hero?.localized_name}</p>
                  <p className="text-sm text-gray-400">{matchup.games_played} partidas</p>
                </div>
                <p className="text-lg font-bold text-green-400">{matchup.winrate.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-red-400 text-center">Débil Contra</h3>
          <div className="space-y-4">
            {badAgainst.map(matchup => (
              <div key={matchup.hero_id} className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-600">
                <div className="w-12 h-12 bg-gray-900 rounded-md mr-4 text-xs flex items-center justify-center">IMG</div>
                <div className="flex-1">
                  <p className="font-bold text-lg">{matchup.hero?.localized_name}</p>
                  <p className="text-sm text-gray-400">{matchup.games_played} partidas</p>
                </div>
                <p className="text-lg font-bold text-red-400">{matchup.winrate.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matchups;
