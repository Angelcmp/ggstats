'use client';

import React, { useState, useEffect } from 'react';

interface PublicMatch {
  match_id: number;
  match_seq_num: number;
  radiant_win: boolean;
  start_time: number;
  duration: number;
  radiant_team: string;
  dire_team: string;
  avg_mmr: number;
  num_mmr: number;
}

const PublicMatchesPage = () => {
  const [publicMatches, setPublicMatches] = useState<PublicMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPublicMatches = async () => {
      try {
        const response = await fetch('/dota2/public-matches');
        const data = await response.json();
        setPublicMatches(data);
      } catch (error) {
        console.error('Error fetching public matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicMatches();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Public Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicMatches.map(match => (
          <div key={match.match_id} className="bg-gray-800 rounded-lg p-4">
            <p className="text-lg font-bold">Match ID: {match.match_id}</p>
            <p>Duration: {Math.floor(match.duration / 60)} minutes</p>
            <p>Result: {match.radiant_win ? 'Radiant Victory' : 'Dire Victory'}</p>
            <p>Average MMR: {match.avg_mmr}</p>
            <div>
              <p className="font-bold mt-2">Radiant Team:</p>
              <p>{match.radiant_team}</p>
            </div>
            <div>
              <p className="font-bold mt-2">Dire Team:</p>
              <p>{match.dire_team}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicMatchesPage;
