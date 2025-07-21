'use client';

import { useState, useEffect } from 'react';
import ProStatsView from '../../components/stats/ProStatsView';
import RankedStatsView from '../../components/stats/RankedStatsView';

// Define a type for the hero stats data
interface HeroStats {
  id: number;
  localized_name: string;
  pro_pick: number;
  pro_win: number;
  pro_ban: number;
  img: string;
  [key: string]: any; // Allow other properties for rank tiers
}

type View = 'pro' | 'ranked';

export default function StatsPage() {
  const [heroStats, setHeroStats] = useState<HeroStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('pro');

  useEffect(() => {
    const fetchHeroStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dota2/hero-stats');
        if (!response.ok) {
          throw new Error(`Failed to fetch hero stats: ${response.statusText}`);
        }
        const data = await response.json();
        setHeroStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroStats();
  }, []);

  return (
    <div className="container mx-auto p-4 mt-24">
      <h1 className="text-4xl font-exo2 font-bold text-text-main mb-6 uppercase text-center">Dota 2 Hero Stats</h1>
      
      <div className="flex justify-center border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveView('pro')} 
          className={`px-6 py-3 font-roboto text-lg transition-colors ${activeView === 'pro' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-text-secondary hover:text-white'}`}>
          Pro Scene
        </button>
        <button 
          onClick={() => setActiveView('ranked')} 
          className={`px-6 py-3 font-roboto text-lg transition-colors ${activeView === 'ranked' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-text-secondary hover:text-white'}`}>
          Ranked
        </button>
      </div>

      {loading && <p className="text-center text-accent-blue font-roboto mt-8">Loading hero stats...</p>}
      {error && <p className="text-center text-accent-orange font-roboto mt-8">Error: {error}</p>}
      {!loading && !error && (
        <div>
          {activeView === 'pro' ? <ProStatsView heroStats={heroStats} /> : <RankedStatsView heroStats={heroStats} />}
        </div>
      )}
    </div>
  );
}
