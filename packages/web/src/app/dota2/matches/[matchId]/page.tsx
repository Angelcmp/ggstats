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

interface PlayerInMatch {
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

const MatchDetailsPage: React.FC = () => {
  const { matchId } = useParams();
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [items, setItems] = useState<Record<string, Item>>({});
  const [abilities, setAbilities] = useState<Record<string, Ability>>({});
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
        console.log("Fetched Abilities Data:", abilitiesData);

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
    let imageUrl = '';
    if (item?.img) {
      imageUrl = `https://cdn.dota2.com${item.img}`;
    }
    return {
      name: item?.localized_name || 'Unknown Item',
      img: imageUrl,
    };
  };

  const getAbilityDetails = (abilityId: number) => {
    const ability = Object.values(abilities).find(a => a.id === abilityId);
    let imageUrl = '';
    if (ability?.img) {
      imageUrl = `https://cdn.cloudflare.steamstatic.com${ability.img}`;
    }
    return {
      name: ability?.dname || `Ability ID: ${abilityId}`,
      img: imageUrl,
    };
  };

  console.log("Raw Gold Advantage Data:", matchDetails.radiant_gold_adv);
  console.log("Processed Gold Advantage Data:", goldAdvantageData);
  console.log("Raw XP Advantage Data:", matchDetails.radiant_xp_adv);
  console.log("Processed XP Advantage Data:", xpAdvantageData);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Detalles de la Partida #{matchDetails.match_id}</h1>
        <p className="text-center text-gray-400 mb-8">Duración: {formatDuration(matchDetails.duration)} | Hora de inicio: {new Date(matchDetails.start_time * 1000).toLocaleString()}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Radiant Team */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-green-400">Radiant {matchDetails.radiant_win ? '(Victoria)' : '(Derrota)'}</h2>
            <div className="mb-4">
              <p className="text-xl">Score: {matchDetails.radiant_score}</p>
              <p className="text-xl">Torres: {matchDetails.tower_status_radiant}</p>
              <p className="text-xl">Barracas: {matchDetails.barracks_status_radiant}</p>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-green-300">Jugadores</h3>
            {radiantPlayers.map(player => (
              <div key={`${player.account_id || 'anonymous'}-${player.player_slot}`} className="flex items-center bg-gray-600 p-3 rounded-lg mb-2">
                <div>
                  <p className="font-medium text-lg">{player.personaname || 'Anónimo'}</p>
                  <p className="text-gray-300 text-sm">Hero ID: {player.hero_id}</p>
                  <p className="text-gray-300 text-sm">KDA: {player.kills}/{player.deaths}/{player.assists}</p>
                  <p className="text-gray-300 text-sm">GPM: {player.gold_per_min} | XPM: {player.xp_per_min}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5].map((itemId, idx) => (
                      itemId !== 0 && (
                        <img
                          key={idx}
                          src={getItemDetails(itemId).img}
                          alt={getItemDetails(itemId).name}
                          className="w-8 h-8 rounded-sm border border-gray-600"
                          title={getItemDetails(itemId).name}
                        />
                      )
                    ))}
                    {[player.backpack_0, player.backpack_1, player.backpack_2].map((itemId, idx) => (
                      itemId !== 0 && (
                        <img
                          key={`bp-${idx}`}
                          src={getItemDetails(itemId).img}
                          alt={getItemDetails(itemId).name}
                          className="w-6 h-6 rounded-sm border border-gray-700 opacity-75"
                          title={getItemDetails(itemId).name}
                        />
                      )
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Habilidades:</h4>
                    <div className="flex flex-wrap gap-1">
                      {player.ability_upgrades_arr.map((abilityId, idx) => (
                        abilityId !== 0 && (
                          <img
                            key={idx}
                            src={getAbilityDetails(abilityId).img}
                            alt={getAbilityDetails(abilityId).name}
                            className="w-8 h-8 rounded-sm border border-gray-600"
                            title={getAbilityDetails(abilityId).name}
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dire Team */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-red-400">Dire {matchDetails.radiant_win ? '(Derrota)' : '(Victoria)'}</h2>
            <div className="mb-4">
              <p className="text-xl">Score: {matchDetails.dire_score}</p>
              <p className="text-xl">Torres: {matchDetails.tower_status_dire}</p>
              <p className="text-xl">Barracas: {matchDetails.barracks_status_dire}</p>
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-red-300">Jugadores</h3>
            {direPlayers.map(player => (
              <div key={`${player.account_id || 'anonymous'}-${player.player_slot}`} className="flex items-center bg-gray-600 p-3 rounded-lg mb-2">
                <div>
                  <p className="font-medium text-lg">{player.personaname || 'Anónimo'}</p>
                  <p className="text-gray-300 text-sm">Hero ID: {player.hero_id}</p>
                  <p className="text-gray-300 text-sm">KDA: {player.kills}/{player.deaths}/{player.assists}</p>
                  <p className="text-gray-300 text-sm">GPM: {player.gold_per_min} | XPM: {player.xp_per_min}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5].map((itemId, idx) => (
                      itemId !== 0 && (
                        <img
                          key={idx}
                          src={getItemDetails(itemId).img}
                          alt={getItemDetails(itemId).name}
                          className="w-8 h-8 rounded-sm border border-gray-600"
                          title={getItemDetails(itemId).name}
                        />
                      )
                    ))}
                    {[player.backpack_0, player.backpack_1, player.backpack_2].map((itemId, idx) => (
                      itemId !== 0 && (
                        <img
                          key={`bp-${idx}`}
                          src={getItemDetails(itemId).img}
                          alt={getItemDetails(itemId).name}
                          className="w-6 h-6 rounded-sm border border-gray-700 opacity-75"
                          title={getItemDetails(itemId).name}
                        />
                      )
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Habilidades:</h4>
                    <div className="flex flex-wrap gap-1">
                      {player.ability_upgrades_arr.map((abilityId, idx) => (
                        abilityId !== 0 && (
                          <img
                            key={idx}
                            src={getAbilityDetails(abilityId).img}
                            alt={getAbilityDetails(abilityId).name}
                            className="w-8 h-8 rounded-sm border border-gray-600"
                            title={getAbilityDetails(abilityId).name}
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <span key={pb.order} className={`px-4 py-2 rounded-full text-sm font-medium ${pb.is_pick ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {pb.is_pick ? 'Pick' : 'Ban'}: Hero ID {pb.hero_id}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-red-500">
                <h3 className="text-2xl font-semibold mb-3 text-red-300">Dire Picks & Bans</h3>
                <div className="flex flex-wrap gap-2">
                  {matchDetails.picks_bans.filter(pb => pb.team === 1).map(pb => (
                    <span key={pb.order} className={`px-4 py-2 rounded-full text-sm font-medium ${pb.is_pick ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {pb.is_pick ? 'Pick' : 'Ban'}: Hero ID {pb.hero_id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gold and XP Advantage Graphs */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4 text-cyan-400">Gráficos de Ventaja (Oro/XP)</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2 text-blue-300">Ventaja de Oro</h3>
            <ResponsiveContainer key="gold-advantage-chart" width="100%" height={300}>
              <LineChart data={goldAdvantageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="minute" stroke="#cbd5e0" />
                <YAxis stroke="#cbd5e0" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="goldAdv" stroke="#f6e05e" name="Ventaja de Oro" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2 text-blue-300">Ventaja de Experiencia</h3>
            <ResponsiveContainer key="xp-advantage-chart" width="100%" height={300}>
              <LineChart data={xpAdvantageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="minute" stroke="#cbd5e0" />
                <YAxis stroke="#cbd5e0" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="xpAdv" stroke="#82ca9d" name="Ventaja de Experiencia" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MatchDetailsPage;
