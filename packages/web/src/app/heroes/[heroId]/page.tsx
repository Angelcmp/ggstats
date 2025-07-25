'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Item } from '../../matches/[matchId]/page';

import Matchups from '@/components/Hero/Matchups';
import ItemBuilds from './ItemBuilds';

import { HeroCompleteStatsDto } from '../../../../../packages/api/src/dota2/dto/hero-complete-stats.dto';

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
  const [heroData, setHeroData] = useState<HeroCompleteStatsDto | null>(null);
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [abilitiesData, setAbilitiesData] = useState<Record<string, Ability>>({});
  const [allItems, setAllItems] = useState<Record<string, Item>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      if (!heroId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all data from the new single endpoint
        const [detailsResponse, heroesResponse, abilitiesResponse, itemsResponse] = await Promise.all([
          fetch(`http://localhost:3002/dota2/heroes/${heroId}/stats`),
          fetch(`http://localhost:3002/dota2/heroes`),
          fetch(`http://localhost:3002/dota2/abilities`),
          fetch(`http://localhost:3002/dota2/items`),
        ]);

        if (!detailsResponse.ok) {
          throw new Error(`Error fetching hero stats: ${detailsResponse.statusText}`);
        }
        if (!heroesResponse.ok) {
          throw new Error(`Error fetching heroes list: ${heroesResponse.statusText}`);
        }
        if (!abilitiesResponse.ok) {
          throw new Error(`Error fetching abilities: ${abilitiesResponse.statusText}`);
        }
        if (!itemsResponse.ok) {
          throw new Error(`Error fetching items: ${itemsResponse.statusText}`);
        }

        const detailsData = await detailsResponse.json();
        const heroesList = await heroesResponse.json();
        const abilitiesList = await abilitiesResponse.json();
        const itemsList = await itemsResponse.json();

        const transformedItemPopularity = Object.keys(detailsData.item_popularity).flatMap(category => {
          return Object.entries(detailsData.item_popularity[category]).map(([itemId, gamesPlayed]) => ({
            item: itemId,
            games_played: gamesPlayed as number,
            wins: 0, // API does not provide wins for item popularity, setting to 0
          }));
        });

        setHeroData({ ...detailsData, item_popularity: transformedItemPopularity });
        setAllHeroes(heroesList);
        setAbilitiesData(abilitiesList);
        console.log('heroData.abilities:', detailsData.abilities);
        console.log('abilitiesData (after set):', abilitiesList);
        const itemsById = Object.values(itemsList).reduce((acc, item) => {
          acc[item.id] = { ...item, localized_name: item.dname };
          return acc;
        }, {});
        setAllItems(itemsById);

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
    console.log(`Ability ID: ${abilityId}, Details:`, ability);
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

  if (!heroData) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">No se encontraron detalles para este héroe.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Hero Overview Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="w-48 h-48 rounded-lg border-4 border-blue-500 shadow-xl overflow-hidden">
            {heroData.img ? (
              <img
                src={`https://cdn.dota2.com${heroData.img}`}
                alt={heroData.localized_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-center">
                Imagen no disponible
              </div>
            )}
          </div>

          {/* Hero Abilities Section */}
          {heroData.abilities && heroData.abilities.length > 0 && (
            <div className="flex flex-col items-center md:items-start mt-4">
              <h3 className="text-xl font-bold mb-2 text-blue-300">Habilidades</h3>
              <div className="grid grid-cols-4 gap-2">
                {heroData.abilities.slice(0, 4).map(abilityId => {
                  const abilityDetails = getAbilityDetails(abilityId);
                  return (
                    <div key={abilityId} className="flex flex-col items-center">
                      <img
                        src={abilityDetails.img}
                        alt={abilityDetails.name}
                        className="w-16 h-16 rounded-md border border-gray-600"
                      />
                      <p className="text-xs text-gray-400 text-center mt-1">{abilityDetails.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {heroData.localized_name}
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              {heroData.primary_attr.toUpperCase()} - {heroData.attack_type}
            </p>
            <p className="text-base text-gray-400 mb-2">
              <strong>Roles:</strong> {heroData.roles.join(', ')}
            </p>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <p><strong>Salud Base:</strong> {heroData.base_health}</p>
              <p><strong>Mana Base:</strong> {heroData.base_mana}</p>
              <p><strong>Armadura Base:</strong> {heroData.base_armor}</p>
              <p><strong>Velocidad de Movimiento:</strong> {heroData.move_speed}</p>
            </div>
          </div>
        </div>

        {/* General Statistics Section */}
        <div className="mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded-lg border border-green-500">
              <p className="text-lg font-semibold text-green-400">Victorias Pro</p>
              <p className="text-2xl font-bold">{heroData.pro_win}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-blue-500">
              <p className="text-lg font-semibold text-blue-400">Picks Pro</p>
              <p className="text-2xl font-bold">{heroData.pro_pick}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-red-500">
              <p className="text-lg font-semibold text-red-400">Baneos Pro</p>
              <p className="text-2xl font-bold">{heroData.pro_ban}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-green-500">
              <p className="text-lg font-semibold text-green-400">Victorias Públicas</p>
              <p className="text-2xl font-bold">{heroData.pub_win}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-blue-500">
              <p className="text-lg font-semibold text-blue-400">Picks Públicos</p>
              <p className="text-2xl font-bold">{heroData.pub_pick}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-400 text-center">Estadísticas de Atributos y Combate</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Ganancia STR</p>
              <p className="text-xl font-bold">{heroData.strength_gain}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Ganancia AGI</p>
              <p className="text-xl font-bold">{heroData.agility_gain}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Ganancia INT</p>
              <p className="text-xl font-bold">{heroData.intelligence_gain}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Rango de Ataque</p>
              <p className="text-xl font-bold">{heroData.attack_range}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Vel. Proyectil</p>
              <p className="text-xl font-bold">{heroData.projectile_speed}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Tasa de Ataque</p>
              <p className="text-xl font-bold">{heroData.attack_rate}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Visión Diurna</p>
              <p className="text-xl font-bold">{heroData.day_vision}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Visión Nocturna</p>
              <p className="text-xl font-bold">{heroData.night_vision}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Vel. Movimiento</p>
              <p className="text-xl font-bold">{heroData.move_speed}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
              <p className="text-base font-semibold text-gray-300">Tasa de Giro</p>
              <p className="text-xl font-bold">{heroData.turn_rate}</p>
            </div>
          </div>
        </div>

        {heroData.matchups && (
          <Matchups matchups={heroData.matchups} heroes={allHeroes} />
        )}

        {heroData.item_popularity && (
          <ItemBuilds itemPopularity={heroData.item_popularity || []} allItems={allItems} limit={15} />
        )}

        <div className="text-center mt-8">
          <a href={`/heroes/${heroId}/items`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ver todos los ítems
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroDetailsPage;
