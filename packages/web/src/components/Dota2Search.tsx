'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Player {
  account_id: number;
  personaname: string;
  avatarfull: string;
}

const Dota2Search: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await fetch(`http://localhost:3002/dota2/search/${playerName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: Player[] = await response.json();
      setSearchResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (accountId: number) => {
    router.push(`/dota2/player/${accountId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        GGStats
      </h1>
      <p className="text-xl mb-10 text-gray-300">
        Encuentra estadísticas de jugadores de Dota 2
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Buscar jugador de Dota 2..."
          className="flex-grow p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {searchResults.length > 0 && (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">Resultados de la búsqueda</h2>
          <ul>
            {searchResults.map((player) => (
              <li
                key={player.account_id}
                className="flex items-center p-3 mb-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                onClick={() => handlePlayerClick(player.account_id)}
              >
                <img
                  src={player.avatarfull}
                  alt={player.personaname}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-400"
                />
                <span className="text-xl font-medium">{player.personaname}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dota2Search;
