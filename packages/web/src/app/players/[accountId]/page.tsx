'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PlayerStats {
  profile: {
    account_id: number;
    personaname: string;
    avatarfull: string;
    steamid: string;
    profileurl: string;
  };
  mmr_estimate: {
    estimate: number;
  };
}

interface WinLoss {
  win: number;
  lose: number;
}

interface RecentMatch {
  match_id: number;
  hero_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  version: number;
  kills: number;
  deaths: number;
  assists: number;
}

interface Hero {
  id: number;
  name: string;
  localized_name: string;
  img: string;
}

const PlayerProfilePage = () => {
  const params = useParams();
  const accountId = params.accountId as string;

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [winLoss, setWinLoss] = useState<WinLoss | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [heroes, setHeroes] = useState<Record<number, Hero>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, wlRes, matchesRes, heroesRes] = await Promise.all([
          fetch(`/dota2/player/${accountId}`),
          fetch(`/dota2/player/${accountId}/winloss`),
          fetch(`/dota2/player/${accountId}/recentMatches`),
          fetch('/dota2/heroes'),
        ]);

        const statsData = await statsRes.json();
        const wlData = await wlRes.json();
        const matchesData = await matchesRes.json();
        const heroesData = await heroesRes.json();

        const heroesMap: Record<number, Hero> = {};
        heroesData.forEach((hero: Hero) => {
          heroesMap[hero.id] = hero;
        });

        setPlayerStats(statsData);
        setWinLoss(wlData);
        setRecentMatches(matchesData);
        setHeroes(heroesMap);

      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  if (loading) {
    return <div className="text-center p-10">Loading player profile...</div>;
  }

  if (!playerStats) {
    return <div className="text-center p-10">Player not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="flex items-center space-x-4 mb-6">
        <img src={playerStats.profile.avatarfull} alt={playerStats.profile.personaname} className="w-24 h-24 rounded-full border-2 border-gray-600" />
        <div>
          <h1 className="text-4xl font-bold">{playerStats.profile.personaname}</h1>
          {playerStats.mmr_estimate?.estimate && <p className="text-xl text-gray-400">MMR Estimate: {playerStats.mmr_estimate.estimate}</p>}
        </div>
      </div>

      {winLoss && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Win/Loss</h2>
          <p className="text-lg">Wins: <span className="text-green-500">{winLoss.win}</span></p>
          <p className="text-lg">Losses: <span className="text-red-500">{winLoss.lose}</span></p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-2">Recent Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentMatches.map(match => {
            const hero = heroes[match.hero_id];
            const isWin = ((match.player_slot < 128 && match.radiant_win) || (match.player_slot >= 128 && !match.radiant_win));
            return (
              <div key={match.match_id} className={`bg-gray-800 p-4 rounded-lg border-l-4 ${isWin ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center space-x-4">
                  {hero && <img src={`https://cdn.dota2.com${hero.img}`} alt={hero.localized_name} className="w-12 h-12 rounded-md" />}
                  <div>
                    <p className="font-bold">{hero ? hero.localized_name : 'Unknown Hero'}</p>
                    <p className={`font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>{isWin ? 'Win' : 'Loss'}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p>KDA: {match.kills}/{match.deaths}/{match.assists}</p>
                  <p>Duration: {Math.floor(match.duration / 60)}m {match.duration % 60}s</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
