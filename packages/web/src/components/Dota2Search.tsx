'use client';

import { useState } from 'react';
import Dota2PlayerProfile from './Dota2PlayerProfile';

export default function Dota2Search() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!playerName) return;
    setLoading(true);
    setSelectedAccountId(null); // Reset selected player on new search
    try {
      const response = await fetch(`/api/dota2/search/${playerName}`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error searching player:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = (accountId: number) => {
    setSelectedAccountId(accountId);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Dota 2 Player Search</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {players.length > 0 && !selectedAccountId && (
        <ul className="space-y-2">
          {players.map((player: any) => (
            <li
              key={player.account_id}
              onClick={() => handlePlayerSelect(player.account_id)}
              className="flex items-center space-x-3 p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
            >
              <img src={player.avatarfull} alt={player.personaname} className="w-10 h-10 rounded-full" />
              <p className="font-medium text-gray-800">{player.personaname}</p>
            </li>
          ))}
        </ul>
      )}

      {selectedAccountId && <Dota2PlayerProfile accountId={selectedAccountId} />}
    </div>
  );
}
