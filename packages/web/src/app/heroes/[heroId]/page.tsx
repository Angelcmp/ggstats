'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

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
  base_strength: number;
  base_agility: number;
  base_intelligence: number;
  strength_gain: number;
  agility_gain: number;
  intelligence_gain: number;
  attack_range: number;
  projectile_speed: number;
  attack_rate: number;
  move_speed: number;
  turn_rate: number;
  legs: number;
  hero_id: number;
  turbo_picks: number;
  turbo_wins: number;
  pro_ban: number;
  pro_win: number;
  pro_pick: number;
  abilities?: number[]; // Assuming abilities are listed by ID in hero data
}

interface Ability {
  id: number;
  name: string;
  localized_name: string;
  img: string;
  dname: string;
}

const HeroDetailsPage: React.FC = () => {
  const { heroId } = useParams();
  const [heroDetails, setHeroDetails] = useState<Hero | null>(null);
  const [abilitiesData, setAbilitiesData] = useState<Record<string, Ability>>({});
  const [heroStats, setHeroStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      if (!heroId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all heroes to find the specific hero details
        const heroesResponse = await fetch(`http://localhost:3002/dota2/heroes`);
        if (!heroesResponse.ok) {
          throw new Error(`Error fetching heroes: ${heroesResponse.statusText}`);
        }
        const allHeroes: Hero[] = await heroesResponse.json();
        const foundHero = allHeroes.find(hero => hero.id === Number(heroId));
        setHeroDetails(foundHero || null);

        // Fetch all abilities
        const abilitiesResponse = await fetch(`http://localhost:3002/dota2/abilities`);
        if (!abilitiesResponse.ok) {
          throw new Error(`Error fetching abilities: ${abilitiesResponse.statusText}`);
        }
        const abilities: Record<string, Ability> = await abilitiesResponse.json();
        setAbilitiesData(abilities);

        // Fetch hero stats
        const heroStatsResponse = await fetch(`http://localhost:3002/dota2/hero-stats`);
        if (!heroStatsResponse.ok) {
          throw new Error(`Error fetching hero stats: ${heroStatsResponse.statusText}`);
        }
        const heroStatsData: any[] = await heroStatsResponse.json();
        setHeroStats(heroStatsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, [heroId]);

  const getAbilityDetails = (abilityId: number) => {
    const ability = Object.values(abilitiesData).find(a => a.id === abilityId);
    let imageUrl = '';
    if (ability?.img) {
      imageUrl = `https://cdn.dota2.com${ability.img}`;
    }
    return {
      name: ability?.dname || `Ability ID: ${abilityId}`,
      img: imageUrl,
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Cargando detalles del héroe...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!heroDetails) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">No se encontraron detalles para este héroe.</div>;
  }

  const heroStatsDetails = heroStats.find(stat => stat.id === Number(heroId));

  console.log("Hero Details:", heroDetails);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Hero Overview Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
          <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-lg border-4 border-blue-500 shadow-xl text-gray-400 text-center">
            Imagen del Héroe no disponible
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {heroDetails.localized_name}
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              {heroDetails.primary_attr.toUpperCase()} - {heroDetails.attack_type}
            </p>
            <p className="text-lg text-gray-400 mb-2">
              <strong>Roles:</strong> {heroDetails.roles.join(', ')}
            </p>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <p><strong>Salud Base:</strong> {heroDetails.base_health}</p>
              <p><strong>Mana Base:</strong> {heroDetails.base_mana}</p>
              <p><strong>Armadura Base:</strong> {heroDetails.base_armor}</p>
              <p><strong>Velocidad de Movimiento:</strong> {heroDetails.move_speed}</p>
            </div>
          </div>
        </div>

        {/* General Statistics Section */}
        {heroStatsDetails && (
          <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Estadísticas Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
                <p className="text-xl font-semibold text-green-400">Victorias Pro</p>
                <p className="text-3xl font-bold">{heroStatsDetails.pro_win}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-500">
                <p className="text-xl font-semibold text-blue-400">Picks Pro</p>
                <p className="text-3xl font-bold">{heroStatsDetails.pro_pick}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-red-500">
                <p className="text-xl font-semibold text-red-400">Baneos Pro</p>
                <p className="text-3xl font-bold">{heroStatsDetails.pro_ban}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
                <p className="text-xl font-semibold text-green-400">Victorias Públicas</p>
                <p className="text-3xl font-bold">{heroStatsDetails.pub_win}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-blue-500">
                <p className="text-xl font-semibold text-blue-400">Picks Públicos</p>
                <p className="text-3xl font-bold">{heroStatsDetails.pub_pick}</p>
              </div>
            </div>
          </div>
        )}

        

        {heroStatsDetails && (
          <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">Estadísticas de Atributos y Combate</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Ganancia STR</p>
                <p className="text-2xl font-bold">{heroStatsDetails.strength_gain}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Ganancia AGI</p>
                <p className="text-2xl font-bold">{heroStatsDetails.agility_gain}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Ganancia INT</p>
                <p className="text-2xl font-bold">{heroStatsDetails.intelligence_gain}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Rango de Ataque</p>
                <p className="text-2xl font-bold">{heroStatsDetails.attack_range}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Vel. Proyectil</p>
                <p className="text-2xl font-bold">{heroStatsDetails.projectile_speed}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Tasa de Ataque</p>
                <p className="text-2xl font-bold">{heroStatsDetails.attack_rate}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Visión Diurna</p>
                <p className="text-2xl font-bold">{heroStatsDetails.day_vision}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Visión Nocturna</p>
                <p className="text-2xl font-bold">{heroStatsDetails.night_vision}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Vel. Movimiento</p>
                <p className="text-2xl font-bold">{heroStatsDetails.move_speed}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <p className="text-lg font-semibold text-gray-300">Tasa de Giro</p>
                <p className="text-2xl font-bold">{heroStatsDetails.turn_rate}</p>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default HeroDetailsPage;
