'use client';

import React, { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';

// --- Mapeo de Regiones Competitivas de Dota 2 ---
const REGION_MAP: { [key: string]: string[] } = {
  'Americas': ['US', 'CA', 'MX', 'PE', 'BR', 'BO', 'CL', 'CO', 'EC', 'GT', 'DO', 'AR'],
  'Europe': ['SE', 'DE', 'RU', 'UA', 'PL', 'FR', 'GB', 'DK', 'FI', 'NO', 'BG', 'RO', 'RS', 'HR', 'BA', 'MK', 'SI', 'SK', 'CZ', 'EE', 'LV', 'LT', 'MD', 'HU', 'CH', 'ES', 'PT', 'IT', 'GR', 'NL', 'ME', 'BY', 'TR', 'IL', 'JO'],
  'Southeast Asia': ['PH', 'MY', 'SG', 'ID', 'TH', 'VN', 'MM', 'KH', 'LA', 'AU', 'NZ', 'BD', 'KR', 'JP', 'MN'],
  'China': ['CN', 'HK'],
  'Other': ['KZ', 'KG', 'IN', 'PK', 'LB', 'AE', 'BH', 'EG', 'ZA'],
};

const getRegionFromCountry = (countryCode: string): string => {
  for (const region in REGION_MAP) {
    if (REGION_MAP[region].includes(countryCode)) {
      return region;
    }
  }
  return 'Other';
};

// --------------------------------

interface Player {
  account_id: number;
  avatarfull: string;
  personaname: string;
  country_code?: string;
  team_name?: string;
}

const ProPlayersPage = () => {
  const [initialPlayers, setInitialPlayers] = useState<Player[]>([]);
  const [displayPlayers, setDisplayPlayers] = useState<Player[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial list of pro players
  useEffect(() => {
    const fetchProPlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/dota2/pro-players');
        const data: Player[] = await response.json();
        setInitialPlayers(data);
        setDisplayPlayers(data);

        const availableRegions = new Set<string>();
        data.forEach(player => {
            if(player.country_code) {
                availableRegions.add(getRegionFromCountry(player.country_code));
            }
        });
        setRegions(['All', ...Array.from(availableRegions)].sort());
      } catch (error) {
        console.error('Error fetching pro players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProPlayers();
  }, []);

  // Handle search logic
  const handleSearch = useCallback(async (term: string) => {
    if (term.trim() === '') {
      setDisplayPlayers(initialPlayers);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/dota2/search/${term}`);
      const data: Player[] = await response.json();
      setDisplayPlayers(data);
    } catch (error) {
      console.error('Error searching players:', error);
      setDisplayPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [initialPlayers]);

  // Filter logic for the initial pro player list
  useEffect(() => {
    if (searchTerm.trim() === '') {
        let players = initialPlayers;
        if (selectedRegion !== 'All') {
            players = players.filter(p => p.country_code && getRegionFromCountry(p.country_code) === selectedRegion);
        }
        setDisplayPlayers(players);
    }
  }, [selectedRegion, initialPlayers, searchTerm]);


  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Player Search</h1>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
            <label htmlFor="search-term" className="block text-gray-300 text-sm font-bold mb-2">Search Player:</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    id="search-term"
                    className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Dendi, Arteezy, SumaiL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                />
                <button onClick={() => handleSearch(searchTerm)} className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md font-bold">Search</button>
            </div>
        </div>
        <div className="flex-1">
            <label htmlFor="region-select" className="block text-gray-300 text-sm font-bold mb-2">Filter by region (active pros):</label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => {
                    setSearchTerm(''); // Clear search when filtering
                    setSelectedRegion(e.target.value);
                }}
                className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={searchTerm.trim() !== ''}
            >
                {regions.map(region => (
                    <option key={region} value={region}>
                    {region}
                    </option>
                ))}
            </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayPlayers.map(player => (
            <Link href={`/players/${player.account_id}`} key={player.account_id}>
              <div className="bg-white/5 rounded-lg p-4 flex flex-col items-center text-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-200 h-full">
                  <img src={player.avatarfull} alt={player.personaname} className="w-24 h-24 rounded-full mb-4 border-2 border-gray-600 shadow-md" />
                  <p className="text-lg font-bold">{player.personaname || 'Unknown'}</p>
                  {player.team_name && <p className="text-sm text-gray-400 mb-2">{player.team_name}</p>}
                  {player.country_code && (
                      <img 
                          src={`https://flagcdn.com/w40/${player.country_code.toLowerCase()}.png`}
                          alt={`${player.country_code} flag`}
                          className="w-6 h-auto rounded-sm mt-2"                        
                      />
                  )}
              </div>
            </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProPlayersPage;
''
