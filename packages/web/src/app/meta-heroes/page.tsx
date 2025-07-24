'use client';

import { useState, useEffect } from 'react';
import { MetaHeroDto, MetaHeroMmrStatsDto } from '../../../../../packages/api/src/dota2/dto/meta-hero.dto';

export default function MetaHeroesPage() {
  const [metaHeroes, setMetaHeroes] = useState<MetaHeroDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMmr, setSelectedMmr] = useState<string>('all'); // Default to 'all' or a specific bracket
  const [selectedLobbyType, setSelectedLobbyType] = useState<string>('all'); // Default to 'all'
  const [selectedDate, setSelectedDate] = useState<string>('30'); // Default to 30 days
  const [searchTerm, setSearchTerm] = useState<string>(''); // New state for search term
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const mmrBrackets = [
    { key: 'all', name: 'Todos los MMR' },
    { key: 'herald', name: 'Herald' },
    { key: 'guardian', name: 'Guardian' },
    { key: 'crusader', name: 'Crusader' },
    { key: 'archon', name: 'Archon' },
    { key: 'legend', name: 'Legend' },
    { key: 'ancient', name: 'Ancient' },
    { key: 'divine', name: 'Divine' },
    { key: 'immortal', name: 'Immortal' },
  ];

  const lobbyTypes = [
    { key: 'all', name: 'Todos los Tipos de Partida' },
    { key: '0', name: 'Normal Matchmaking' },
    { key: '7', name: 'Ranked Matchmaking' },
    { key: '9', name: 'Battle Cup' },
    { key: '12', name: 'Turbo' },
  ];

  const dateRanges = [
    { key: '30', name: 'Últimos 30 Días' },
    { key: '7', name: 'Últimos 7 Días' },
    { key: '90', name: 'Últimos 90 Días' },
    { key: '365', name: 'Último Año' },
  ];

  const getTierBadge = (tier: number): JSX.Element => {
    let bgColor = 'bg-white/10'; // Glassmorphism base
    let textColor = 'text-gray-300';
    let description = '';

    switch (tier) {
      case 1:
        textColor = 'text-green-400';
        description = 'Alto';
        break;
      case 2:
        textColor = 'text-blue-400';
        description = 'Bueno';
        break;
      case 3:
        textColor = 'text-yellow-400';
        description = 'Medio';
        break;
      case 4:
        textColor = 'text-red-400';
        description = 'Bajo';
        break;
      default:
        description = 'N/A';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10 ${bgColor} ${textColor}`}>
        {description}
      </span>
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSelectedMmr('all');
    setSelectedLobbyType('all');
    setSelectedDate('30');
    setSearchTerm('');
    setSortColumn(null);
    setSortDirection('asc');
  };

  useEffect(() => {
    const fetchMetaHeroes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedLobbyType !== 'all') {
          params.append('lobbyType', selectedLobbyType);
        }
        if (selectedDate !== 'all') {
          params.append('date', selectedDate);
        }

        const queryString = params.toString();
        const url = `http://localhost:3002/dota2/meta-heroes${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMetaHeroes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetaHeroes();
  }, [selectedMmr, selectedLobbyType, selectedDate]); // Re-fetch when filters change

  const filteredHeroes = metaHeroes.filter(hero => {
    const matchesMmr = selectedMmr === 'all' || (hero.mmr_stats && hero.mmr_stats[selectedMmr]);
    const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMmr && matchesSearch;
  });

  const sortedHeroes = [...filteredHeroes].sort((a, b) => {
    const aStats = a.mmr_stats[selectedMmr] || { pick_rate: 0, win_rate: 0, tier: 4 };
    const bStats = b.mmr_stats[selectedMmr] || { pick_rate: 0, win_rate: 0, tier: 4 };

    let compareValue = 0;
    if (sortColumn === 'name') {
      compareValue = a.name.localeCompare(b.name);
    } else if (sortColumn === 'pick_rate') {
      compareValue = aStats.pick_rate - bStats.pick_rate;
    } else if (sortColumn === 'win_rate') {
      compareValue = aStats.win_rate - bStats.win_rate;
    } else if (sortColumn === 'tier') {
      compareValue = aStats.tier - bStats.tier;
    }

    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  if (loading) return <p className="text-center text-lg">Cargando meta héroes...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  if (metaHeroes.length === 0) return <p className="text-center text-lg">No se encontraron meta héroes.</p>;

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Dota 2 Meta Heroes</h1>
      
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search-term" className="block text-gray-300 text-sm font-bold mb-2">Buscar Héroe:</label>
          <input
            type="text"
            id="search-term"
            className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Anti-Mage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="mmr-select" className="block text-gray-300 text-sm font-bold mb-2">Seleccionar MMR:</label>
          <select
            id="mmr-select"
            className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMmr}
            onChange={(e) => setSelectedMmr(e.target.value)}
          >
            {mmrBrackets.map(bracket => (
              <option key={bracket.key} value={bracket.key}>
                {bracket.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="lobby-type-select" className="block text-gray-300 text-sm font-bold mb-2">Tipo de Partida:</label>
          <select
            id="lobby-type-select"
            className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLobbyType}
            onChange={(e) => setSelectedLobbyType(e.target.value)}
          >
            {lobbyTypes.map(type => (
              <option key={type.key} value={type.key}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="date-range-select" className="block text-gray-300 text-sm font-bold mb-2">Rango de Fechas:</label>
          <select
            id="date-range-select"
            className="p-3 border border-gray-700 rounded-md w-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateRanges.map(range => (
              <option key={range.key} value={range.key}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reiniciar Filtros
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left text-base font-bold text-gray-200 cursor-pointer" onClick={() => handleSort('name')}>Héroe {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th className="p-4 text-left text-base font-bold text-gray-200 cursor-pointer" onClick={() => handleSort('pick_rate')}>Pick Rate {sortColumn === 'pick_rate' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th className="p-4 text-left text-base font-bold text-gray-200 cursor-pointer" onClick={() => handleSort('win_rate')}>Win Rate {sortColumn === 'win_rate' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th className="p-4 text-left text-base font-bold text-gray-200 cursor-pointer" onClick={() => handleSort('tier')}>Tier {sortColumn === 'tier' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedHeroes.map((hero, index) => {
              const stats = hero.mmr_stats[selectedMmr] || { pick_rate: 0, win_rate: 0, tier: 4 }; // Fallback for 'all' or missing data
              const rowBgClass = index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'; // Zebra striping
              return (
                <tr key={hero.id} className={`${rowBgClass} backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-200`}>
                  <td className="p-4 flex items-center">
                    <img src={hero.img} alt={hero.name} className="w-16 h-auto mr-3 rounded-md border border-gray-600 shadow-md" />
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-lg">{hero.name}</span>
                      {hero.roles && hero.roles.length > 0 && (() => {
                        let roleColorClass = 'text-gray-300'; // Default color
                        switch (hero.roles[0]) {
                          case 'Carry':
                            roleColorClass = 'text-yellow-300';
                            break;
                          case 'Support':
                            roleColorClass = 'text-blue-300';
                            break;
                          case 'Nuker':
                            roleColorClass = 'text-red-300';
                            break;
                          case 'Disabler':
                            roleColorClass = 'text-purple-300';
                            break;
                          case 'Initiator':
                            roleColorClass = 'text-green-300';
                            break;
                          case 'Durable':
                            roleColorClass = 'text-orange-300';
                            break;
                          case 'Escape':
                            roleColorClass = 'text-cyan-300';
                            break;
                          case 'Pusher':
                            roleColorClass = 'text-lime-300';
                            break;
                          case 'Jungler':
                            roleColorClass = 'text-emerald-300';
                            break;
                          // Add more roles and colors as needed
                        }
                        return (
                          <span className={`bg-white/10 backdrop-blur-sm border border-white/20 ${roleColorClass} text-xs px-2 py-0.5 rounded-full mt-1`}>
                            {hero.roles[0]}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="p-4" title={`Pick Rate: ${stats.pick_rate}%`}>{stats.pick_rate}%</td>
                  <td className="p-4" title={`Win Rate: ${stats.win_rate}%`}>{stats.win_rate}%</td>
                  <td className="p-4 font-bold">{getTierBadge(stats.tier)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-blue-300 mb-4">Leyenda de Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>{getTierBadge(1)}: Héroes con alto Pick Rate y Win Rate, dominantes en el meta.</p>
          <p>{getTierBadge(2)}: Héroes con buen rendimiento, sólidos en el meta.</p>
          <p>{getTierBadge(3)}: Héroes con rendimiento promedio, situacionales.</p>
          <p>{getTierBadge(4)}: Héroes con bajo Pick Rate y Win Rate, fuera del meta actual.</p>
        </div>
      </div>
    </div>
  );
}