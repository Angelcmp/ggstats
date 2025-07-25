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
  const [searchAttempted, setSearchAttempted] = useState(false); // Nuevo estado
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSearchAttempted(false); // Resetear al inicio de una nueva búsqueda

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
      setSearchAttempted(true); // Marcar que se intentó una búsqueda
    }
  };

  const handlePlayerClick = (accountId: number) => {
    router.push(`/dota2/player/${accountId}`);
  };

  return (
    <div className="flex flex-col items-center items-start text-white">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        GGStats
      </h1>
      <p className="text-xl mb-10 text-gray-300">
        Encuentra estadísticas de jugadores de Dota 2
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative w-full">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (searchAttempted) setSearchAttempted(false); // Resetear si el usuario empieza a escribir de nuevo
            }}
            placeholder="Buscar jugador de Dota 2..."
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg pr-10"
          />
          <button
            type="button"
            onClick={() => {
              setPlayerName('');
              setSearchResults([]);
              setError(null);
              setSearchAttempted(false); // Resetear también al limpiar
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none transition-opacity duration-200 ${playerName ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Buscar'
          )}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {searchAttempted && searchResults.length === 0 && !loading && (
        <p className="text-gray-400 mb-4">No se encontraron jugadores con ese nombre.</p>
      )}

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
