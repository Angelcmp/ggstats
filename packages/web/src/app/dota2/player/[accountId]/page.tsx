'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PlayerDetails {
  profile: {
    account_id: number;
    personaname: string;
    avatarfull: string;
    loccountrycode: string;
    plus: boolean;
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
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  average_rank: number;
  leaver_status: number;
  cluster: number;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage: number;
  hero_healing: number;
  last_hits: number;
  lane: number;
  lane_role: number;
  is_roaming: boolean;
  start_time: number;
  version: number;
  lane_efficiency: number;
  benchmarks: {
    gold_per_min: {
      raw: number;
      pct: number;
    };
    xp_per_min: {
      raw: number;
      pct: number;
    };
    kills_per_min: {
      raw: number;
      pct: number;
    };
    last_hits_per_min: {
      raw: number;
      pct: number;
    };
    hero_damage_per_min: {
      raw: number;
      pct: number;
    };
    hero_healing_per_min: {
      raw: number;
      pct: number;
    };
    tower_damage_per_min: {
      raw: number;
      pct: number;
    };
  };
}

interface Hero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_health_regen: number;
  base_mana: number;
  base_mana_regen: number;
  base_armor: number;
  base_mr: number;
  base_attack_min: number;
  base_attack_max: number;
  base_str: number;
  base_agi: number;
  base_int: number;
  str_gain: number;
  agi_gain: number;
  int_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number;
  base_attack_time: number;
  day_vision: number;
  night_vision: number;
  move_speed: number;
  turn_rate: number;
  legs: number;
  cm_enabled: boolean;
  patches: any[];
  pro_ban: number;
  pro_win: number;
  pro_pick: number;
  "1_pick": number;
  "1_win": number;
  "2_pick": number;
  "2_win": number;
  "3_pick": number;
  "3_win": number;
  "4_pick": number;
  "4_win": number;
  "5_pick": number;
  "5_win": number;
  "6_pick": number;
  "6_win": number;
  "7_pick": number;
  "7_win": number;
  "8_pick": number;
  "8_win": number;
}

const PlayerDetailsPage: React.FC = () => {
  const { accountId } = useParams();
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);
  const [winLoss, setWinLoss] = useState<WinLoss | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      if (!accountId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch player details
        const detailsResponse = await fetch(`http://localhost:3002/dota2/player/${accountId}`);
        if (!detailsResponse.ok) {
          throw new Error(`Error fetching player details: ${detailsResponse.statusText}`);
        }
        const detailsData: PlayerDetails = await detailsResponse.json();
        setPlayerDetails(detailsData);

        // Fetch win/loss
        const winLossResponse = await fetch(`http://localhost:3002/dota2/player/${accountId}/winloss`);
        if (!winLossResponse.ok) {
          throw new Error(`Error fetching win/loss: ${winLossResponse.statusText}`);
        }
        const winLossData: WinLoss = await winLossResponse.json();
        setWinLoss(winLossData);

        // Fetch recent matches
        const recentMatchesResponse = await fetch(`http://localhost:3002/dota2/player/${accountId}/recentMatches`);
        if (!recentMatchesResponse.ok) {
          throw new Error(`Error fetching recent matches: ${recentMatchesResponse.statusText}`);
        }
        const recentMatchesData: RecentMatch[] = await recentMatchesResponse.json();
        setRecentMatches(recentMatchesData);

        // Fetch heroes
        const heroesResponse = await fetch(`http://localhost:3002/dota2/heroes`);
        if (!heroesResponse.ok) {
          throw new Error(`Error fetching heroes: ${heroesResponse.statusText}`);
        }
        const heroesData: Hero[] = await heroesResponse.json();
        setHeroes(heroesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerDetails();
  }, [accountId]);

  const getHeroName = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    return hero ? hero.localized_name : `Hero ID: ${heroId}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!playerDetails) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">No se encontraron detalles del jugador.</div>;
  }

  const totalMatches = (winLoss?.win || 0) + (winLoss?.lose || 0);
  const winRate = totalMatches > 0 ? ((winLoss?.win || 0) / totalMatches * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <img
            src={playerDetails.profile.avatarfull}
            alt={playerDetails.profile.personaname}
            className="w-24 h-24 rounded-full mr-6 border-4 border-blue-500"
          />
          <div>
            <h1 className="text-4xl font-bold text-blue-400">{playerDetails.profile.personaname}</h1>
            <p className="text-gray-400 text-lg">ID de Cuenta: {playerDetails.profile.account_id}</p>
            {playerDetails.profile.loccountrycode && (
              <p className="text-gray-400 text-lg">País: {playerDetails.profile.loccountrycode}</p>
            )}
            {playerDetails.profile.plus && (
              <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">Dota Plus</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2 text-green-400">Estadísticas Generales</h2>
            <p className="text-lg">MMR Estimado: {playerDetails.mmr_estimate?.estimate || 'N/A'}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2 text-purple-400">Victorias / Derrotas</h2>
            <p className="text-lg">Victorias: {winLoss?.win || 0}</p>
            <p className="text-lg">Derrotas: {winLoss?.lose || 0}</p>
            <p className="text-lg">Tasa de Victorias: {winRate}%</p>
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-4 text-orange-400">Partidas Recientes</h2>
        {recentMatches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-600 text-left text-gray-300 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Match ID</th>
                  <th className="py-3 px-6">Resultado</th>
                  <th className="py-3 px-6">Héroe</th>
                  <th className="py-3 px-6">KDA</th>
                  <th className="py-3 px-6">GPM</th>
                  <th className="py-3 px-6">XPM</th>
                  <th className="py-3 px-6">Fecha</th>
                </tr>
              </thead>
              <tbody className="text-gray-200 text-sm font-light">
                {recentMatches.map((match) => (
                  <tr key={match.match_id} className="border-b border-gray-600 hover:bg-gray-600">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <a href={`/dota2/matches/${match.match_id}`} className="text-blue-400 hover:underline">
                        {match.match_id}
                      </a>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`font-bold ${match.radiant_win ? 'text-green-400' : 'text-red-400'}`}>
                        {match.radiant_win ? 'Victoria' : 'Derrota'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{getHeroName(match.hero_id)}</td>
                    <td className="py-3 px-6 text-left">{match.kills}/{match.deaths}/{match.assists}</td>
                    <td className="py-3 px-6 text-left">{match.gold_per_min}</td>
                    <td className="py-3 px-6 text-left">{match.xp_per_min}</td>
                    <td className="py-3 px-6 text-left">{new Date(match.start_time * 1000).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-300 mb-2">No se encontraron partidas recientes para este jugador.</p>
            <p className="text-gray-300">Esto puede deberse a que el perfil de Dota 2 es privado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetailsPage;
