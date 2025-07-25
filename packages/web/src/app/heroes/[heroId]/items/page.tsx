'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Item } from '../../../../matches/[matchId]/page'; // Reusing Item interface
import { ItemPopularityDto } from '../../../../../../../packages/api/src/dota2/dto/hero-complete-stats.dto';

// This will be a reusable component for displaying item tables
import ItemBuilds from '../ItemBuilds'; 

interface HeroItemsPageProps {
  // No props needed as heroId comes from useParams
}

const HeroItemsPage: React.FC<HeroItemsPageProps> = () => {
  const { heroId } = useParams();
  const [itemPopularity, setItemPopularity] = useState<ItemPopularityDto[]>([]);
  const [allItems, setAllItems] = useState<Record<string, Item>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemsData = async () => {
      if (!heroId) return;

      setLoading(true);
      setError(null);

      try {
        const [detailsResponse, itemsResponse] = await Promise.all([
          fetch(`http://localhost:3002/dota2/heroes/${heroId}/stats`),
          fetch(`http://localhost:3002/dota2/items`),
        ]);

        if (!detailsResponse.ok) {
          throw new Error(`Error fetching hero stats: ${detailsResponse.statusText}`);
        }
        if (!itemsResponse.ok) {
          throw new Error(`Error fetching items list: ${itemsResponse.statusText}`);
        }

        const detailsData = await detailsResponse.json();
        const itemsList = await itemsResponse.json();

        // Transform item_popularity data
        const transformedItemPopularity = Object.keys(detailsData.item_popularity).flatMap(category => {
          return Object.entries(detailsData.item_popularity[category]).map(([itemId, gamesPlayed]) => ({
            item: itemId,
            games_played: gamesPlayed as number,
            wins: 0, // API does not provide wins for item popularity, setting to 0
          }));
        });

        setItemPopularity(transformedItemPopularity);
        
        // Transform itemsList to be keyed by item ID
        const itemsById = Object.values(itemsList).reduce((acc, item: Item) => {
          acc[item.id] = { ...item, localized_name: item.dname };
          return acc;
        }, {});
        setAllItems(itemsById);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemsData();
  }, [heroId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">Cargando ítems del héroe...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (itemPopularity.length === 0) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">No se encontraron ítems de popularidad para este héroe.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">Todos los Ítems Usados por el Héroe</h1>
        <ItemBuilds itemPopularity={itemPopularity} allItems={allItems} />
      </div>
    </div>
  );
};

export default HeroItemsPage;
