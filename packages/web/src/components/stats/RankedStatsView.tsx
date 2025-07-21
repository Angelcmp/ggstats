'use client';

import { useMemo, useState } from 'react';

// Define a type for the hero stats data
interface HeroStats {
  id: number;
  localized_name: string;
  img: string;
  [key: string]: any; // Allow other properties for rank tiers
}

interface HeroWithTier extends HeroStats {
  win_rate: number;
  pick_rate: number;
  score: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
}

type SortKey = 'pick_rate' | 'win_rate' | 'tier';
type SortDirection = 'ascending' | 'descending';

const tierColors: Record<string, string> = {
  S: 'bg-red-600 text-white',
  A: 'bg-orange-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-green-500 text-white',
  D: 'bg-gray-500 text-white',
};

const tierOrder: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

const rankTiers = [
  { id: '1', name: 'Herald' },
  { id: '2', name: 'Guardian' },
  { id: '3', name: 'Crusader' },
  { id: '4', name: 'Archon' },
  { id: '5', name: 'Legend' },
  { id: '6', name: 'Ancient' },
  { id: '7', name: 'Divine' },
  { id: '8', name: 'Immortal' },
];

export default function RankedStatsView({ heroStats }: { heroStats: HeroStats[] }) {
  const [selectedTier, setSelectedTier] = useState('8'); // Default to Immortal
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'tier',
    direction: 'descending',
  });

  const heroesWithTiers = useMemo((): HeroWithTier[] => {
    if (heroStats.length === 0) return [];

    const pickKey = `${selectedTier}_pick`;
    const winKey = `${selectedTier}_win`;

    const filteredStats = heroStats.filter(h => h[pickKey] > 0);

    const totalPicks = filteredStats.reduce((acc, h) => acc + h[pickKey], 1);

    const statsWithRates = filteredStats.map(hero => ({
      ...hero,
      pick_rate: (hero[pickKey] / totalPicks) * 100,
      win_rate: hero[pickKey] > 0 ? (hero[winKey] / hero[pickKey]) * 100 : 0,
    }));

    const maxWinRate = Math.max(...statsWithRates.map(h => h.win_rate));
    const maxPickRate = Math.max(...statsWithRates.map(h => h.pick_rate));

    const scoredHeroes = statsWithRates.map(hero => {
      const normWinRate = hero.win_rate / maxWinRate;
      const normPickRate = hero.pick_rate / maxPickRate;
      const score = (normWinRate * 0.6) + (normPickRate * 0.4);
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

  }, [heroStats, selectedTier]);

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
      <div className="flex justify-center items-center gap-4 mb-6">
        <select 
          onChange={(e) => setSelectedTier(e.target.value)} 
          value={selectedTier}
          className="px-4 py-2 font-roboto rounded-md bg-background-secondary text-text-main border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-blue"
        >
          {rankTiers.map(tier => (
            <option key={tier.id} value={tier.id}>{tier.name}</option>
          ))}
        </select>
        <button onClick={() => requestSort('tier')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'tier' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Tier
        </button>
        <button onClick={() => requestSort('pick_rate')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'pick_rate' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Pick Rate
        </button>
        <button onClick={() => requestSort('win_rate')} className={`px-4 py-2 font-roboto rounded-md transition-colors ${sortConfig.key === 'win_rate' ? 'bg-accent-blue text-white' : 'bg-background-secondary text-text-main hover:bg-gray-700'}`}>
          Sort by Win Rate
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
