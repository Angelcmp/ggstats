import { FC } from 'react';
import { ItemPopularityDto } from '../../../../../packages/api/src/dota2/dto/hero-complete-stats.dto';
import { Item } from '../../matches/[matchId]/page'; // Reusing Item interface

interface ItemBuildsProps {
  itemPopularity: ItemPopularityDto[];
  allItems: Record<string, Item>;
  limit?: number; // Optional limit for items to display
}

const ItemBuilds: FC<ItemBuildsProps> = ({ itemPopularity, allItems, limit }) => {
  const getItemDetails = (itemId: string) => {
    const item = allItems[itemId];
    const imageUrl = item?.img ? `https://cdn.dota2.com${item.img}` : '';
    return {
      name: item?.localized_name || 'Unknown Item',
      img: imageUrl,
    };
  };

  const filteredItems = (Array.isArray(itemPopularity) ? itemPopularity
    .filter(item => item.item && typeof item.item === 'string' && !item.item.startsWith('recipe_')) : [])
    .sort((a, b) => b.games_played - a.games_played);

  const topItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <div className="mb-10 bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">Ítems Más Usados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700 text-purple-300 uppercase text-sm leading-normal">
              <th className="py-2 px-4 text-left">Ítem</th>
              <th className="py-2 px-4 text-left">Partidas Jugadas</th>
            </tr>
          </thead>
          <tbody className="text-white text-xs font-light">
            {topItems.map(item => (
              <tr key={item.item} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-2 px-4 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={getItemDetails(item.item).img} alt={getItemDetails(item.item).name} className="w-8 h-8 rounded-md mr-2" />
                    <span>{getItemDetails(item.item).name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-left">{item.games_played}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemBuilds;
