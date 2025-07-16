import React, { useState } from 'react';

interface SummonerSearchProps {
  onSearch: (summonerName: string) => void;
}

const SummonerSearch: React.FC<SummonerSearchProps> = ({ onSearch }) => {
  const [summonerName, setSummonerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (summonerName.trim()) {
      onSearch(summonerName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={summonerName}
        onChange={(e) => setSummonerName(e.target.value)}
        placeholder="Enter Summoner Name"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};

export default SummonerSearch;
