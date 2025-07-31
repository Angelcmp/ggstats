'use client';

import React, { useState, useEffect } from 'react';

interface RankingPlayer {
  account_id: number;
  personaname: string;
  avatar: string;
  winrate: number;
  games_played: number;
  kda: number;
  time_played: number;
}

const RankingsPage = () => {
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RankingPlayer; direction: string } | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/dota2/rankings');
        const data = await response.json();
        // The API returns an object with a 'rankings' property
        setRankings(data.rankings || []);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const sortedRankings = React.useMemo(() => {
    let sortableItems = [...rankings];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [rankings, sortConfig]);

  const requestSort = (key: keyof RankingPlayer) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Rankings</h1>
      <table className="min-w-full bg-gray-800 rounded-lg">
        <thead>
          <tr>
            <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('personaname')}>Player</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('winrate')}>Win Rate</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('games_played')}>Games Played</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('kda')}>KDA</th>
            <th className="p-4 text-left cursor-pointer" onClick={() => requestSort('time_played')}>Time Played</th>
          </tr>
        </thead>
        <tbody>
          {sortedRankings.map(player => (
            <tr key={player.account_id} className="border-t border-gray-700">
              <td className="p-4 flex items-center space-x-4">
                <img src={player.avatar} alt={player.personaname} className="w-10 h-10 rounded-full" />
                <span>{player.personaname}</span>
              </td>
              <td className="p-4">{player.winrate.toFixed(2)}%</td>
              <td className="p-4">{player.games_played}</td>
              <td className="p-4">{player.kda.toFixed(2)}</td>
              <td className="p-4">{(player.time_played / 3600).toFixed(2)} hours</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingsPage;
