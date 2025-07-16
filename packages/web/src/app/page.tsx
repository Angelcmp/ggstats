import SummonerSearch from '../components/SummonerSearch';
import { useState } from 'react';

export default function Page() {
  const [summonerData, setSummonerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (summonerName: string) => {
    setLoading(true);
    setError(null);
    setSummonerData(null);
    try {
      // Assuming your NestJS backend is running on port 3001
      const response = await fetch(`http://localhost:3001/riot-api/summoner/euw1/${summonerName}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSummonerData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to ggstats!</h1>
      <SummonerSearch onSearch={handleSearch} />

      {loading && <p className="mt-4 text-blue-600">Loading summoner data...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {summonerData && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Summoner Found:</h2>
          <p><strong>Name:</strong> {summonerData.name}</p>
          <p><strong>Level:</strong> {summonerData.summonerLevel}</p>
          <p><strong>ID:</strong> {summonerData.id}</p>
          <p><strong>PUUID:</strong> {summonerData.puuid}</p>
        </div>
      )}
    </div>
  );
}
