'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HeroDto } from '../../../../../packages/api/src/dota2/dto/hero.dto';

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<HeroDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('all');
  const [selectedAttackType, setSelectedAttackType] = useState('all');
  const [sortBy, setSortBy] = useState('localized_name');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await fetch('http://localhost:3002/dota2/heroes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHeroes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const filteredAndSortedHeroes = useMemo(() => {
    let filtered = heroes.filter(hero => {
      const matchesSearchTerm = hero.localized_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAttribute = selectedAttribute === 'all' || hero.primary_attr === selectedAttribute;
      const matchesAttackType = selectedAttackType === 'all' || hero.attack_type === selectedAttackType;
      return matchesSearchTerm && matchesAttribute && matchesAttackType;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'localized_name') {
        return a.localized_name.localeCompare(b.localized_name);
      } else if (sortBy === 'primary_attr') {
        return a.primary_attr.localeCompare(b.primary_attr);
      } else if (sortBy === 'attack_type') {
        return a.attack_type.localeCompare(b.attack_type);
      }
      return 0;
    });

    return filtered;
  }, [heroes, searchTerm, selectedAttribute, selectedAttackType, sortBy]);

  if (loading) return <p>Loading heroes...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!heroes.length) return <p>No heroes found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dota 2 Heroes</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar héroe..."
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/3 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
        >
          <option value="all">Todos los Atributos</option>
          <option value="str">Fuerza</option>
          <option value="agi">Agilidad</option>
          <option value="int">Inteligencia</option>
          <option value="all">Universal</option>
        </select>
        <select
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedAttackType}
          onChange={(e) => setSelectedAttackType(e.target.value)}
        >
          <option value="all">Todos los Tipos de Ataque</option>
          <option value="Melee">Cuerpo a Cuerpo</option>
          <option value="Ranged">A Distancia</option>
        </select>
        <select
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="localized_name">Nombre</option>
          <option value="primary_attr">Atributo Principal</option>
          <option value="attack_type">Tipo de Ataque</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredAndSortedHeroes.map((hero) => (
          <Link href={`/heroes/${hero.id}`} key={hero.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 hover:border-blue-500">
            <h2 className="text-xl font-semibold text-blue-400 mb-1">{hero.localized_name}</h2>
            <span className={`text-sm font-medium mb-2
              ${hero.primary_attr === 'str' ? 'text-red-400' :
                hero.primary_attr === 'agi' ? 'text-green-400' :
                hero.primary_attr === 'int' ? 'text-blue-400' :
                'text-purple-400' // For 'all' attribute
            }`}>
              {hero.primary_attr.toUpperCase()}
            </span>
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
                <span className={`bg-white/10 backdrop-blur-sm border border-white/20 shadow-md ${roleColorClass} text-xs px-2 py-0.5 rounded-full mb-2`}>
                  {hero.roles[0]}
                </span>
              );
            })()}
            {hero.name && (
              <img
                src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png`}
                alt={hero.localized_name}
                className="w-24 h-auto mb-2 rounded-md border border-gray-600"
              />
            )}
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {hero.roles.map((role, index) => {
                let roleColorClass = 'text-gray-300'; // Default color
                switch (role) {
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
                  <span key={index} className={`bg-gray-700 ${roleColorClass} text-xs px-2 py-0.5 rounded-full`}>
                    {role}
                  </span>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
