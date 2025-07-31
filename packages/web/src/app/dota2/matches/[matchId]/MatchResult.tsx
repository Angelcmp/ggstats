import { FC } from 'react';

interface MatchResultProps {
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  duration: number;
}

const MatchResult: FC<MatchResultProps> = ({ radiant_win, radiant_score, dire_score, duration }) => {
  const formatDuration = (d: number) => {
    const minutes = Math.floor(d / 60);
    const seconds = d % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-green-400">Radiant</h3>
        <p className={`text-xl font-bold ${radiant_win ? 'text-green-400' : 'text-red-500'}`}>
          {radiant_win ? 'Victoria' : 'Derrota'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-white">{radiant_score} - {dire_score}</p>
        <p className="text-lg text-gray-400">{formatDuration(duration)}</p>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-red-400">Dire</h3>
        <p className={`text-xl font-bold ${!radiant_win ? 'text-green-400' : 'text-red-500'}`}>
          {!radiant_win ? 'Victoria' : 'Derrota'}
        </p>
      </div>
    </div>
  );
};

export default MatchResult;
