'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MatchDetailsDto, PlayerInMatchDto } from '../../../../../packages/api/src/dota2/dto/match-details.dto';
import { HeroDto } from '../../../../../packages/api/src/dota2/dto/hero.dto';
import { ItemDto } from '../../../../../packages/api/src/dota2/dto/item.dto';

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = params.matchId as string;
  const [matchDetails, setMatchDetails] = useState<MatchDetailsDto | null>(null);
  const [heroes, setHeroes] = useState<HeroDto[]>([]);
  const [items, setItems] = useState<Record<string, ItemDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [matchRes, heroesRes, itemsRes] = await Promise.all([
          fetch(`/api/dota2/matches/${matchId}`),
          fetch('/api/dota2/heroes'),
          fetch('/api/dota2/items'),
        ]);

        if (!matchRes.ok) throw new Error(`Failed to fetch match details: ${matchRes.statusText}`);
        if (!heroesRes.ok) throw new Error(`Failed to fetch heroes: ${heroesRes.statusText}`);
        if (!itemsRes.ok) throw new Error(`Failed to fetch items: ${itemsRes.statusText}`);

        const matchData = await matchRes.json();
        const heroesData = await heroesRes.json();
        const itemsData = await itemsRes.json();

        setMatchDetails(matchData);
        setHeroes(heroesData);
        setItems(itemsData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchData();
    }
  }, [matchId]);

  const getHeroName = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    return hero ? hero.localized_name : `Hero ${heroId}`;
  };

  const getHeroImage = (heroId: number) => {
    const hero = heroes.find(h => h.id === heroId);
    return hero && hero.name ? `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name.replace('npc_dota_hero_', '')}.png` : null;
  };

  const getItemImage = (itemId: number) => {
    if (!items) return null;
    const item = Object.values(items).find(i => i.id === itemId);
    if (item && item.name) {
      return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item.name.replace('item_', '')}.png`;
    }
    return null; // Fallback for missing item or name
  };

  const renderPlayerItems = (player: PlayerInMatchDto) => {
    const itemIds = [player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5];
    const backpackItemIds = [player.backpack_0, player.backpack_1, player.backpack_2];
    const neutralItemIds = [player.item_neutral, player.item_neutral2];

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {itemIds.map((itemId, index) => {
          const imageUrl = getItemImage(itemId);
          return itemId !== 0 && imageUrl && (
            <img key={`item-${index}`} src={imageUrl} alt={`Item ${itemId}`} className="w-8 h-8 rounded-sm" />
          );
        })}
        {backpackItemIds.map((itemId, index) => {
          const imageUrl = getItemImage(itemId);
          return itemId !== 0 && imageUrl && (
            <img key={`bp-item-${index}`} src={imageUrl} alt={`Backpack Item ${itemId}`} className="w-6 h-6 rounded-sm opacity-75" />
          );
        })}
        {neutralItemIds.map((itemId, index) => {
          const imageUrl = getItemImage(itemId);
          return itemId !== 0 && imageUrl && (
            <img key={`neutral-item-${index}`} src={imageUrl} alt={`Neutral Item ${itemId}`} className="w-6 h-6 rounded-sm opacity-75" />
          );
        })}
      </div>
    );
  };

  if (loading) return <p className="text-center text-accent-blue font-roboto mt-8">Loading match details...</p>;
  if (error) return <p className="text-center text-accent-orange font-roboto mt-8">Error: {error}</p>;
  if (!matchDetails) return <p className="text-center text-text-secondary font-roboto mt-8">No match details found.</p>;

  const radiantPlayers = matchDetails.players.filter((player: PlayerInMatchDto) => player.isRadiant);
  const direPlayers = matchDetails.players.filter((player: PlayerInMatchDto) => !player.isRadiant);

  const getTowerStatus = (status: number) => {
    const towers = [];
    for (let i = 0; i < 11; i++) {
      if ((status >> i) & 1) {
        towers.push(<span key={i} className="text-green-500">&#9632;</span>); // Intact tower
      } else {
        towers.push(<span key={i} className="text-red-500">&#9633;</span>); // Destroyed tower
      }
    }
    return towers;
  };

  const getBarracksStatus = (status: number) => {
    const barracks = [];
    for (let i = 0; i < 6; i++) {
      if ((status >> i) & 1) {
        barracks.push(<span key={i} className="text-green-500">&#9632;</span>); // Intact barracks
      } else {
        barracks.push(<span key={i} className="text-red-500">&#9633;</span>); // Destroyed barracks
      }
    }
    return barracks;
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-exo2 font-bold text-text-main mb-6 uppercase text-center">Match Details: {matchDetails.match_id}</h1>
      <div className="bg-background-secondary p-6 rounded-lg shadow-lg border border-gray-800 mb-8">
        <p className="text-text-main font-roboto">Duration: {Math.floor(matchDetails.duration / 60)}:{matchDetails.duration % 60 < 10 ? '0' : ''}{matchDetails.duration % 60}</p>
        <p className="text-text-main font-roboto">Radiant Win: {matchDetails.radiant_win ? 'Yes' : 'No'}</p>
        <p className="text-text-main font-roboto">Game Mode: {matchDetails.game_mode}</p>
        <p className="text-text-main font-roboto">Radiant Score: {matchDetails.radiant_score} / Dire Score: {matchDetails.dire_score}</p>
        
        <div className="mt-4">
          <h3 className="text-xl font-exo2 font-bold text-text-main uppercase">Tower Status:</h3>
          <p className="text-text-main font-roboto">Radiant: {getTowerStatus(matchDetails.tower_status_radiant)}</p>
          <p className="text-text-main font-roboto">Dire: {getTowerStatus(matchDetails.tower_status_dire)}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-exo2 font-bold text-text-main uppercase">Barracks Status:</h3>
          <p className="text-text-main font-roboto">Radiant: {getBarracksStatus(matchDetails.barracks_status_radiant)}</p>
          <p className="text-text-main font-roboto">Dire: {getBarracksStatus(matchDetails.barracks_status_dire)}</p>
        </div>

        <p className="text-text-secondary font-roboto text-sm mt-4">
          <a href={`https://www.dotabuff.com/matches/${matchDetails.match_id}`} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
            View on Dotabuff
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-exo2 font-bold text-text-main mb-4 uppercase">Radiant Team</h2>
          {radiantPlayers.map((player: PlayerInMatchDto) => (
            <div key={player.player_slot} className="bg-background-secondary p-4 rounded-lg shadow-lg border border-gray-800 mb-4 flex items-center space-x-4">
              <img src={getHeroImage(player.hero_id)} alt={getHeroName(player.hero_id)} className="w-16 h-16 rounded-full border-2 border-accent-blue" />
              <div>
                <p className="text-text-main font-roboto font-medium">{player.personaname || 'Anonymous'} ({getHeroName(player.hero_id)})</p>
                <p className="text-text-secondary font-roboto text-sm">KDA: {player.kills}/{player.deaths}/{player.assists}</p>
                <p className="text-text-secondary font-roboto text-sm">Last Hits: {player.last_hits} | Denies: {player.denies}</p>
                <p className="text-text-secondary font-roboto text-sm">GPM: {player.gold_per_min} | XPM: {player.xp_per_min}</p>
                <p className="text-text-secondary font-roboto text-sm">Hero Damage: {player.hero_damage} | Healing: {player.hero_healing}</p>
                {renderPlayerItems(player)}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-exo2 font-bold text-text-main mb-4 uppercase">Dire Team</h2>
          {direPlayers.map((player: PlayerInMatchDto) => (
            <div key={player.player_slot} className="bg-background-secondary p-4 rounded-lg shadow-lg border border-gray-800 mb-4 flex items-center space-x-4">
              <img src={getHeroImage(player.hero_id)} alt={getHeroName(player.hero_id)} className="w-16 h-16 rounded-full border-2 border-accent-orange" />
              <div>
                <p className="text-text-main font-roboto font-medium">{player.personaname || 'Anonymous'} ({getHeroName(player.hero_id)})</p>
                <p className="text-text-secondary font-roboto text-sm">KDA: {player.kills}/{player.deaths}/{player.assists}</p>
                <p className="text-text-secondary font-roboto text-sm">Last Hits: {player.last_hits} | Denies: {player.denies}</p>
                <p className="text-text-secondary font-roboto text-sm">GPM: {player.gold_per_min} | XPM: {player.xp_per_min}</p>
                <p className="text-text-secondary font-roboto text-sm">Hero Damage: {player.hero_damage} | Healing: {player.hero_healing}</p>
                {renderPlayerItems(player)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}