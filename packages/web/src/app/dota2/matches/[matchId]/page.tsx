'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MatchDetails {
  match_id: number;
  barracks_status_dire: number;
  barracks_status_radiant: number;
  cluster: number;
  dire_score: number;
  duration: number;
  engine: number;
  first_blood_time: number;
  game_mode: number;
  human_players: number;
  leagueid: number;
  lobby_type: number;
  match_seq_num: number;
  negative_votes: number;
  positive_votes: number;
  radiant_gold_adv: number[];
  radiant_score: number;
  radiant_win: boolean;
  radiant_xp_adv: number[];
  start_time: number;
  teamfights: any[]; // You might want to define a more specific interface for teamfights
  tower_status_dire: number;
  tower_status_radiant: number;
  version: number;
  players: PlayerInMatch[];
  patch: number;
  region: number;
  all_word_counts: any; // Define more specific interfaces if needed
  my_word_counts: any;
  throw: number;
  loss: number;
  replay_salt: number;
  series_id: number;
  series_type: number;
  radiant_team: TeamDetails;
  dire_team: TeamDetails;
  league: LeagueDetails;
  skill: number;
  player_slot: number;
  cosmetics: any; // Define more specific interfaces if needed
  objectives: any[]; // Define more specific interfaces if needed
  picks_bans: PickBan[];
  radiant_captain: number;
  dire_captain: number;
}

export interface PlayerInMatch {
  account_id: number;
  player_slot: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  hero_damage: number;
  hero_healing: number;
  tower_damage: number;
  level: number;
  gold: number;
  gold_spent: number;
  ability_upgrades_arr: number[];
  item_0: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
  backpack_0: number;
  backpack_1: number;
  backpack_2: number;
  personaname: string;
  name: string;
  radiant_win: boolean;
  isRadiant: boolean;
  win: number;
  lose: number;
  item_0_name: string;
  item_1_name: string;
  item_2_name: string;
  item_3_name: string;
  item_4_name: string;
  item_5_name: string;
  backpack_0_name: string;
  backpack_1_name: string;
  backpack_2_name: string;
}

interface TeamDetails {
  team_id: number;
  name: string;
  tag: string;
  logo_url: string;
}

interface LeagueDetails {
  leagueid: number;
  ticket: string;
  banner: string;
  name: string;
  tier: string;
}

interface PickBan {
  is_pick: boolean;
  hero_id: number;
  team: number;
  order: number;
}

interface Item {
  id: number;
  name: string;
  cost: number;
  secret_shop: number;
  side_shop: number;
  recipe: number;
  localized_name: string;
  img: string;
}

interface Ability {
  id: number;
  name: string;
  localized_name: string;
  img: string;
  dname: string;
}

import TeamDetails from './TeamDetails';
import AdvantageGraphs from './AdvantageGraphs';
import MatchResult from './MatchResult';

const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [items, setItems] = useState<Record<string, Item>>({});
  const [abilities, setAbilities] = useState<Record<string, Ability>>({});
  const [heroes, setHeroes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchAndItemData = async () => {
      if (!matchId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch match details
        const matchResponse = await fetch(`http://localhost:3002/dota2/matches/${matchId}`);
        if (!matchResponse.ok) {
          throw new Error(`Error fetching match details: ${matchResponse.statusText}`);
        }
        const matchData: MatchDetails = await matchResponse.json();
        setMatchDetails(matchData);

        // Fetch items
        const itemsResponse = await fetch(`http://localhost:3002/dota2/items`);
        if (!itemsResponse.ok) {
          throw new Error(`Error fetching items: ${itemsResponse.statusText}`);
        }
        const itemsData: Record<string, Item> = await itemsResponse.json();
        setItems(itemsData);

        // Fetch abilities
        const abilitiesResponse = await fetch(`http://localhost:3002/dota2/abilities`);
        if (!abilitiesResponse.ok) {
          throw new Error(`Error fetching abilities: ${abilitiesResponse.statusText}`);
        }
        const abilitiesData: Record<string, Ability> = await abilitiesResponse.json();
        setAbilities(abilitiesData);

        // Fetch heroes
        const heroesResponse = await fetch(`http://localhost:3002/dota2/heroes`);
        if (!heroesResponse.ok) {
          throw new Error(`Error fetching heroes: ${heroesResponse.statusText}`);
        }
        const heroesData = await heroesResponse.json();
        setHeroes(heroesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchAndItemData();
  }, [matchId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Cargando detalles de la partida...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!matchDetails) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">No se encontraron detalles para esta partida.</div>;
  }

  const radiantPlayers = matchDetails.players.filter(player => player.isRadiant);
  const direPlayers = matchDetails.players.filter(player => !player.isRadiant);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const goldAdvantageData = matchDetails.radiant_gold_adv?.map((gold, index) => ({
    minute: index,
    goldAdv: gold,
  })) || [];

  const xpAdvantageData = matchDetails.radiant_xp_adv?.map((xp, index) => ({
    minute: index,
    xpAdv: xp,
  })) || [];

  const getItemDetails = (itemId: number) => {
    const item = Object.values(items).find(i => i.id === itemId);
    return {
      name: item?.localized_name || 'Unknown Item',
      img: item?.img ? `https://cdn.dota2.com${item.img}` : '',
    };
  };

  const getAbilityDetails = (abilityId: number) => {
    const ability = Object.values(abilities).find(a => a.id === abilityId);
    return {
      name: ability?.dname || `Ability ID: ${abilityId}`,
      img: ability?.img ? `https://cdn.dota2.com${ability.img}` : '',
    };
  };

  const getHeroDetails = (heroId: number) => {
    const hero = Object.values(heroes).find(h => h.id === heroId);
    return {
      name: hero?.localized_name || 'Unknown Hero',
      img: hero?.img || '',
    };
  };

  console.log("Raw Gold Advantage Data:", matchDetails.radiant_gold_adv);
  console.log("Processed Gold Advantage Data:", goldAdvantageData);
  console.log("Raw XP Advantage Data:", matchDetails.radiant_xp_adv);
  console.log("Processed XP Advantage Data:", xpAdvantageData);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-black/20 backdrop-blur-lg border border-gray-700 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Detalles de la Partida #{matchDetails.match_id}</h1>
        <MatchResult
          radiant_win={matchDetails.radiant_win}
          radiant_score={matchDetails.radiant_score}
          dire_score={matchDetails.dire_score}
          duration={matchDetails.duration}
        />

        <div className="flex flex-col gap-8 mb-8">
          <TeamDetails
            teamName="Radiant"
            players={radiantPlayers}
            score={matchDetails.radiant_score}
            towerStatus={matchDetails.tower_status_radiant}
            barracksStatus={matchDetails.barracks_status_radiant}
            teamColor="green"
            win={matchDetails.radiant_win}
            getHeroDetails={getHeroDetails}
            getItemDetails={getItemDetails}
            getAbilityDetails={getAbilityDetails}
          />
          <TeamDetails
            teamName="Dire"
            players={direPlayers}
            score={matchDetails.dire_score}
            towerStatus={matchDetails.tower_status_dire}
            barracksStatus={matchDetails.barracks_status_dire}
            teamColor="red"
            win={!matchDetails.radiant_win}
            getHeroDetails={getHeroDetails}
            getItemDetails={getItemDetails}
            getAbilityDetails={getAbilityDetails}
          />
        </div>

        {/* Picks and Bans */}
        {matchDetails.picks_bans && matchDetails.picks_bans.length > 0 && (
          <div className="bg-gray-700 p-6 rounded-lg shadow-md mb-8 border border-gray-600">
            <h2 className="text-3xl font-semibold mb-4 text-yellow-400 text-center">Picks y Bans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
                <h3 className="text-2xl font-semibold mb-3 text-green-300">Radiant Picks & Bans</h3>
                <div className="flex flex-wrap gap-2">
                  {matchDetails.picks_bans.filter(pb => pb.team === 0).map(pb => (
                    <div key={pb.order} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${pb.is_pick ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      <img src={getHeroDetails(pb.hero_id).img} alt={getHeroDetails(pb.hero_id).name} className="w-8 h-8 rounded-full" />
                      <span>{pb.is_pick ? 'Pick' : 'Ban'}: {getHeroDetails(pb.hero_id).name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-red-500">
                <h3 className="text-2xl font-semibold mb-3 text-red-300">Dire Picks & Bans</h3>
                <div className="flex flex-wrap gap-2">
                  {matchDetails.picks_bans.filter(pb => pb.team === 1).map(pb => (
                    <div key={pb.order} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${pb.is_pick ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      <img src={getHeroDetails(pb.hero_id).img} alt={getHeroDetails(pb.hero_id).name} className="w-8 h-8 rounded-full" />
                      <span>{pb.is_pick ? 'Pick' : 'Ban'}: {getHeroDetails(pb.hero_id).name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <AdvantageGraphs goldAdvantageData={goldAdvantageData} xpAdvantageData={xpAdvantageData} />

      </div>
    </div>
  );
};

export default MatchDetailsPage;
