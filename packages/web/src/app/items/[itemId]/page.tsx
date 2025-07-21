'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ItemDto } from '../../../../packages/api/src/dota2/dto/item.dto';

export default function ItemDetailsPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState<ItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;

    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/dota2/items/${itemId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch item details: ${response.statusText}`);
        }
        const data = await response.json();
        setItem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (loading) return <p className="text-center text-accent-blue font-roboto mt-8">Loading item details...</p>;
  if (error) return <p className="text-center text-accent-orange font-roboto mt-8">Error: {error}</p>;
  if (!item) return <p className="text-center text-text-secondary font-roboto mt-8">Item not found.</p>;

  const imageUrl = `https://cdn.cloudflare.steamstatic.com${item.img}`;

  return (
    <div className="container mx-auto p-4 mt-24">
      <div className="bg-background-secondary p-8 rounded-lg shadow-lg border border-gray-800 flex flex-col md:flex-row items-center md:items-start gap-8">
        <img src={imageUrl} alt={item.dname || item.localized_name} className="w-48 h-auto rounded-md shadow-md" />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-exo2 font-bold text-text-main mb-2 uppercase">{item.dname || item.localized_name}</h1>
          <p className="text-text-secondary font-roboto text-lg mb-4">Cost: {item.cost}</p>

          {item.lore && (
            <p className="text-text-main font-roboto mb-4 italic">{item.lore}</p>
          )}

          {item.notes && (
            <div className="mb-4">
              <h2 className="text-xl font-exo2 font-semibold text-text-main mb-2">Notes:</h2>
              <p className="text-text-secondary font-roboto">{item.notes}</p>
            </div>
          )}

          {item.attrib && item.attrib.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-exo2 font-semibold text-text-main mb-2">Attributes:</h2>
              <ul className="list-disc list-inside text-text-secondary font-roboto">
                {item.attrib.map((attr: any, index: number) => (
                  <li key={index}>{attr.header} {attr.value} {attr.footer}</li>
                ))}
              </ul>
            </div>
          )}

          {item.qual && (
            <p className="text-text-secondary font-roboto">Quality: {item.qual}</p>
          )}

          {item.mc && (
            <p className="text-text-secondary font-roboto">Mana Cost: {item.mc}</p>
          )}

          {item.cd && (
            <p className="text-text-secondary font-roboto">Cooldown: {item.cd}</p>
          )}

          {item.components && item.components.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-exo2 font-semibold text-text-main mb-2">Components:</h2>
              <ul className="list-disc list-inside text-text-secondary font-roboto">
                {item.components.map((comp: string, index: number) => (
                  <li key={index}>{comp}</li>
                ))}
              </ul>
            </div>
          )}

          {item.created !== undefined && (
            <p className="text-text-secondary font-roboto">Created from recipe: {item.created ? 'Yes' : 'No'}</p>
          )}

          {item.charges !== undefined && (
            <p className="text-text-secondary font-roboto">Has Charges: {item.charges ? 'Yes' : 'No'}</p>
          )}

          {item.behavior && (
            <p className="text-text-secondary font-roboto">Behavior: {item.behavior}</p>
          )}

          {item.target_team && (
            <p className="text-text-secondary font-roboto">Target Team: {item.target_team}</p>
          )}

          {item.target_type && Array.isArray(item.target_type) && item.target_type.length > 0 && (
            <p className="text-text-secondary font-roboto">Target Type: {item.target_type.join(', ')}</p>
          )}
          {item.target_type && !Array.isArray(item.target_type) && (
            <p className="text-text-secondary font-roboto">Target Type: {item.target_type}</p>
          )}

          {item.hint && item.hint.length > 0 && (
            <p className="text-text-secondary font-roboto">Hint: {item.hint.join(', ')}</p>
          )}

        </div>
      </div>
    </div>
  );
}
