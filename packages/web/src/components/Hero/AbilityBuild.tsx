'use client';

import React from 'react';

interface AbilityBuild {
  ability_id: number;
  level: number;
  time: number;
}

interface Ability {
  id: number;
  dname: string;
  img: string;
}

interface AbilityBuildProps {
  abilityBuild: AbilityBuild[];
  abilities: Record<string, Ability>;
}

const AbilityBuild: React.FC<AbilityBuildProps> = ({ abilityBuild, abilities }) => {
  if (!abilityBuild || abilityBuild.length === 0) {
    return null;
  }

  const getAbilityData = (abilityId: number) => {
    return Object.values(abilities).find(a => a.id === abilityId);
  };

  const sortedBuild = [...abilityBuild].sort((a, b) => a.level - b.level);

  return (
    <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Build de Habilidades Popular</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {sortedBuild.map((build, index) => {
          const ability = getAbilityData(build.ability_id);
          return (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-md border-2 border-gray-600 flex items-center justify-center text-xs p-1 mb-2">
                {ability ? `IMG: ${ability.dname}` : 'Talento'}
              </div>
              <p className="font-bold text-lg">Lvl {build.level}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AbilityBuild;
