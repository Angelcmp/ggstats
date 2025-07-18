'use client';

import { useState, useEffect } from 'react';
import { ItemDto } from '../../../../packages/api/src/dota2/dto/item.dto';

export default function ItemsPage() {
  const [items, setItems] = useState<Record<string, ItemDto> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/dota2/items');
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p className="text-center text-accent-blue font-roboto mt-8">Loading items...</p>;
  if (error) return <p className="text-center text-accent-orange font-roboto mt-8">Error: {error}</p>;
  if (!items) return <p className="text-center text-text-secondary font-roboto mt-8">No items found.</p>;

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-exo2 font-bold text-text-main mb-6 uppercase text-center">Dota 2 Items</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.keys(items).map((key) => {
          const item = items[key];
          // Ensure item and localized_name exist before rendering
          if (!item || !item.localized_name) return null;

          // Construct image URL using the item's internal name (key)
          const imageUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${key.replace('item_', '')}.png`;

          return (
            <div key={item.id || key} className="bg-background-secondary p-4 rounded-lg shadow-lg border border-gray-800 hover:border-accent-blue hover:shadow-lg hover:shadow-accent-blue/30 transition-all duration-200 flex flex-col items-center text-center">
              <img src={imageUrl} alt={item.localized_name} className="w-24 h-auto mb-2 rounded-md" />
              <h2 className="text-xl font-exo2 font-semibold text-text-main uppercase">{item.localized_name}</h2>
              <p className="text-text-secondary font-roboto text-sm">Cost: {item.cost}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
