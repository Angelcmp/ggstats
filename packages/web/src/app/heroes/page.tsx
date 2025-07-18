'use client';

import { useState, useEffect } from 'react';
import { HeroDto } from '../../../../packages/api/src/dota2/dto/hero.dto';

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<HeroDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dota2/heroes');
        if (!response.ok) {
          throw new Error(`Failed to fetch heroes: ${response.statusText}`);
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

  if (loading) return <p className="text-center text-accent-blue font-roboto mt-8">Loading heroes...</p>;
  if (error) return <p className="text-center text-accent-orange font-roboto mt-8">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-exo2 font-bold text-text-main mb-6 uppercase text-center">Dota 2 Heroes</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {heroes.map((hero) => (
          <div key={hero.id} className="bg-background-secondary p-4 rounded-lg shadow-lg border border-gray-800 hover:border-accent-blue hover:shadow-lg hover:shadow-accent-blue/30 transition-all duration-200 flex flex-col items-center text-center">
            <img src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png`} alt={hero.localized_name} className="w-24 h-auto mb-2 rounded-md" />
            <h2 className="text-xl font-exo2 font-semibold text-text-main uppercase">{hero.localized_name}</h2>
            <p className="text-text-secondary font-roboto text-sm">{hero.primary_attr} - {hero.attack_type}</p>
            <p className="text-text-secondary font-roboto text-xs">Roles: {hero.roles.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
