'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayerStatsDto } from '../../packages/api/src/dota2/dto/player-stats.dto';
import { PlayerWinLossDto } from '../../packages/api/src/dota2/dto/player-win-loss.dto';
import { RecentMatchesDto } from '../../packages/api/src/dota2/dto/recent-matches.dto';
import { formatTimeAgo } from '../utils/timeFormatter';

interface Dota2PlayerProfileProps {
  accountId: number;
}

export default function Dota2PlayerProfile({ accountId }: Dota2PlayerProfileProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStatsDto | null>(null);
  const [winLoss, setWinLoss] = useState<PlayerWinLossDto | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatchesDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, wlRes, matchesRes] = await Promise.all([
          fetch(`/api/dota2/player/${accountId}`),
          fetch(`/api/dota2/player/${accountId}/winloss`),
          fetch(`/api/dota2/player/${accountId}/recentMatches`),
        ]);

        if (!statsRes.ok) throw new Error(`Failed to fetch player stats: ${statsRes.statusText}`);
        if (!wlRes.ok) throw new Error(`Failed to fetch win/loss: ${wlRes.statusText}`);
        if (!matchesRes.ok) throw new Error(`Failed to fetch recent matches: ${matchesRes.statusText}`);

        const statsData = await statsRes.json();
        const wlData = await wlRes.json();
        const matchesData = await matchesRes.json();

        setPlayerStats(statsData);
        setWinLoss(wlData);
        setRecentMatches(matchesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchData();
    }
  }, [accountId]);

  if (loading) return <p className="text-center text-blue-600">Loading player profile...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  if (!playerStats) return <p className="text-center text-gray-500">No player data found.</p>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <div className="flex items-center space-x-4 mb-6">
        <img src={playerStats.profile.avatarfull} alt={playerStats.profile.personaname} className="w-24 h-24 rounded-full border-4 border-blue-500" />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{playerStats.profile.personaname}</h2>
          <p className="text-gray-600">MMR Estimate: <span className="font-semibold">{playerStats.mmr_estimate?.estimate || 'N/A'}</span></p>
          {winLoss && (
            <p className="text-gray-600">Wins: <span className="font-semibold text-green-600">{winLoss.win}</span> / Losses: <span className="font-semibold text-red-600">{winLoss.lose}</span></p>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-gray-800">Recent Matches</h3>
      {recentMatches && recentMatches.length > 0 ? (
        <ul className="space-y-3">
          {recentMatches.map((match) => (
            <Link href={`/matches/${match.match_id}`} key={match.match_id}>
              <li className="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center cursor-pointer">
                <div>
                  <p className="font-medium text-gray-700">Match ID: <span className="text-blue-600">{match.match_id}</span></p>
                  <p className="text-sm text-gray-500">Duration: {Math.floor(match.duration / 60)}:{match.duration % 60 < 10 ? '0' : ''}{match.duration % 60}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(match.start_time)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">KDA: {match.kills}/{match.deaths}/{match.assists}</p>
                  <p className="text-sm text-gray-600">GPM: {match.gold_per_min} | XPM: {match.xp_per_min}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No recent matches found.</p>
      )}
    </div>
  );
}