import { FC } from 'react';
import { PlayerInMatch } from './page';

interface PlayerStatsProps {
  player: PlayerInMatch;
  getHeroDetails: (heroId: number) => { name: string; img: string };
  getItemDetails: (itemId: number) => { name: string; img: string };
  getAbilityDetails: (abilityId: number) => { name: string; img: string };
  isZebra: boolean;
}

const PlayerStats: FC<PlayerStatsProps> = ({ player, getHeroDetails, getItemDetails, getAbilityDetails, isZebra }) => {
  return (
    <tr className={`${isZebra ? 'bg-gray-800' : 'bg-gray-700'} border-b border-gray-600`}>
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <img src={getHeroDetails(player.hero_id).img} alt={getHeroDetails(player.hero_id).name} className="w-10 h-10 rounded-md" />
          <div>
            <p className="font-semibold text-white text-sm">{player.personaname || 'Anónimo'}</p>
            <p className="text-xs text-gray-400">{getHeroDetails(player.hero_id).name}</p>
          </div>
        </div>
      </td>
      <td className="py-2 px-1 text-center text-sm">{player.level}</td>
      <td className="py-2 px-1 text-center text-sm">{player.kills}/{player.deaths}/{player.assists}</td>
      <td className="py-2 px-1 text-center text-sm">{player.gold_per_min}/{player.xp_per_min}</td>
      <td className="py-2 px-1 text-center text-sm">{player.last_hits}/{player.denies}</td>
      <td className="py-2 px-1 text-center text-sm">{player.hero_damage}</td>
      <td className="py-2 px-1 text-center text-sm">{player.hero_healing}</td>
      <td className="py-2 px-1 text-center text-sm">{player.tower_damage}</td>
      <td className="py-2 px-4">
        <div className="flex flex-wrap gap-1">
          {[player.item_0, player.item_1, player.item_2, player.item_3, player.item_4, player.item_5].map((itemId, idx) => (
            <img
              key={idx}
              src={getItemDetails(itemId).img}
              alt={getItemDetails(itemId).name}
              className="w-9 h-7 rounded-sm border border-gray-500"
              title={getItemDetails(itemId).name}
            />
          ))}
          {[player.backpack_0, player.backpack_1, player.backpack_2].map((itemId, idx) => (
            <img
              key={`bp-${idx}`}
              src={getItemDetails(itemId).img}
              alt={getItemDetails(itemId).name}
              className="w-7 h-5 rounded-sm border border-gray-600 opacity-80"
              title={getItemDetails(itemId).name}
            />
          ))}
        </div>
      </td>
    </tr>
  );
};

export default PlayerStats;
