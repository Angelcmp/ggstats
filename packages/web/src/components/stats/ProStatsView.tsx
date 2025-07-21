'use client';

import { useMemo, useState } from 'react';

// Define a type for the hero stats data
interface HeroStats {
  id: number;
  localized_name: string;
  pro_pick: number;
  pro_win: number;
  pro_ban: number;
  img: string;
}

interface HeroWithTier extends HeroStats {
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
  score: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
}

type SortKey = 'pro_pick' | 'win_rate' | 'pro_ban' | 'tier';
type SortDirection = 'ascending' | 'descending';

const tierColors: Record<string, string> = {
  S: 'bg-red-600 text-white',
  A: 'bg-orange-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-green-500 text-white',
  D: 'bg-gray-500 text-white',
};

const tierOrder: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

export default function ProStatsView({ heroStats }: { heroStats: HeroStats[] }) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'tier',
    direction: 'descending',
  });

  const heroesWithTiers = useMemo((): HeroWithTier[] => {
    if (heroStats.length === 0) return [];

    const totalPicks = heroStats.reduce((acc, h) => acc + h.pro_pick, 1);
    const totalBans = heroStats.reduce((acc, h) => acc + h.pro_ban, 1);

    const statsWithRates = heroStats.map(hero => ({
      ...hero,
      win_rate: hero.pro_pick > 0 ? (hero.pro_win / hero.pro_pick) * 100 : 0,
      pick_rate: (hero.pro_pick / totalPicks) * 100,
      ban_rate: (hero.pro_ban / totalBans) * 100,
    }));

    const maxWinRate = Math.max(...statsWithRates.map(h => h.win_rate));
    const maxPickRate = Math.max(...statsWithRates.map(h => h.pick_rate));
    const maxBanRate = Math.max(...statsWithRates.map(h => h.ban_rate));

    const scoredHeroes = statsWithRates.map(hero => {
      const normWinRate = hero.win_rate / maxWinRate;
      const normPickRate = hero.pick_rate / maxPickRate;
      const normBanRate = hero.ban_rate / maxBanRate;
      const score = (normWinRate * 0.5) + (normPickRate * 0.3) + (normBanRate * 0.2);
      return { ...hero, score };
    });

    scoredHeroes.sort((a, b) => b.score - a.score);

    const totalHeroes = scoredHeroes.length;
    return scoredHeroes.map((hero, index) => {
      const percentile = (index + 1) / totalHeroes;
      let tier: 'S' | 'A' | 'B' | 'C' | 'D';
      if (percentile <= 0.05) tier = 'S';
      else if (percentile <= 0.20) tier = 'A';
      else if (percentile <= 0.50) tier = 'B';
      else if (percentile <= 0.80) tier = 'C';
      else tier = 'D';
      return { ...hero, tier };
    });

  }, [heroStats]);

  const sortedHeroes = useMemo(() => {
    if (heroesWithTiers.length === 0) return [];

    const sortableItems = [...heroesWithTiers];

    sortableItems.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.key === 'tier') {
        aValue = tierOrder[a.tier];
        bValue = tierOrder[b.tier];
      } else {
        aValue = a[sortConfig.key as keyof typeof a];
        bValue = b[sortConfig.key as keyof typeof b];
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [heroesWithTiers, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="flex justify-center flex-wrap gap-4 mb-6">
        <button onClick={() => requestSort('tier')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'tier' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Tier
        </button>
        <button onClick={() => requestSort('pro_pick')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'pro_pick' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Pick Rate
        </button>
        <button onClick={() => requestSort('win_rate')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'win_rate' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Win Rate
        </button>
        <button onClick={() => requestSort('pro_ban')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'pro_ban' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Ban Rate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedHeroes.map((hero) => (
          <div key={hero.id} className="bg-background-secondary p-4 rounded-lg shadow-lg border border-gray-800 hover:border-accent-blue hover:shadow-lg hover:shadow-accent-blue/30 transition-all duration-200 flex items-center">
            <img src={`https://cdn.cloudflare.steamstatic.com${hero.img}`} alt={hero.localized_name} className="w-20 h-auto mr-4 rounded-md" />
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-exo2 font-semibold text-text-main uppercase">{hero.localized_name}</h2>
                <span className={`px-2.5 py-0.5 text-sm font-bold rounded-full ${tierColors[hero.tier]}`}>{hero.tier}</span>
              </div>
              <p className="text-text-secondary font-roboto">Pick Rate: {hero.pick_rate.toFixed(2)}%</p>
              <p className="text-text-secondary font-roboto">Win Rate: {hero.win_rate.toFixed(2)}%</p>
              <p className="text-text-secondary font-roboto">Ban Rate: {hero.ban_rate.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
