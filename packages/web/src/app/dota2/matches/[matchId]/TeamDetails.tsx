import { FC } from 'react';
import { PlayerInMatch } from './page';
import PlayerStats from './PlayerStats';

interface TeamDetailsProps {
  teamName: string;
  players: PlayerInMatch[];
  score: number;
  towerStatus: number;
  barracksStatus: number;
  teamColor: string;
  win: boolean;
  getHeroDetails: (heroId: number) => { name: string; img: string };
  getItemDetails: (itemId: number) => { name: string; img: string };
  getAbilityDetails: (abilityId: number) => { name: string; img: string };
}

const TeamDetails: FC<TeamDetailsProps> = ({ teamName, players, score, towerStatus, barracksStatus, teamColor, win, getHeroDetails, getItemDetails, getAbilityDetails }) => {
  return (
    <div className={`bg-black/20 backdrop-blur-lg border border-gray-700 p-4 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-3xl font-bold text-${teamColor}-400`}>{teamName}</h2>
        <div className="text-right">
          <p className={`text-2xl font-bold ${win ? 'text-green-400' : 'text-red-400'}`}>{win ? 'Victoria' : 'Derrota'}</p>
          <p className="text-xl">Puntuación: {score}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-4 w-1/4">Jugador</th>
              <th scope="col" className="py-3 px-2 text-center">Nivel</th>
              <th scope="col" className="py-3 px-2 text-center">K/D/A</th>
              <th scope="col" className="py-3 px-2 text-center">GPM/XPM</th>
              <th scope="col" className="py-3 px-2 text-center">LH/DN</th>
              <th scope="col" className="py-3 px-2 text-center">Daño Héroe</th>
              <th scope="col" className="py-3 px-2 text-center">Curación</th>
              <th scope="col" className="py-3 px-2 text-center">Daño Torre</th>
              <th scope="col" className="py-3 px-6 w-1/3">Objetos</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <PlayerStats
                key={`${player.account_id || 'anonymous'}-${player.player_slot}`}
                player={player}
                getHeroDetails={getHeroDetails}
                getItemDetails={getItemDetails}
                getAbilityDetails={getAbilityDetails}
                isZebra={index % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamDetails;
