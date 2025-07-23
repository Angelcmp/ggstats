'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ItemDto } from '../../../../../../packages/api/src/dota2/dto/item.dto';

// Helper function to render attributes
const renderAttributes = (attributes: any[]) => {
  if (!attributes || attributes.length === 0) return <p>Ninguno</p>;
  return (
    <ul className="list-disc list-inside">
      {attributes.map((attr, index) => (
        <li key={index} className="text-gray-300">
          <span className="font-semibold text-blue-400">{attr.header}</span> {attr.value} {attr.display}
        </li>
      ))}
    </ul>
  );
};

export default function ItemDetailsPage() {
  const params = useParams();
  const { slug } = params;

  const [item, setItem] = useState<ItemDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!slug) return;

      try {
        const response = await fetch('http://localhost:3002/dota2/items');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items: Record<string, ItemDto> = await response.json();
        
        const formatSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

        const foundItem = Object.values(items).find(
          (i) => formatSlug(i.dname || '') === slug
        );

        if (foundItem) {
          setItem(foundItem);
        } else {
          setError('Item not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [slug]);

  if (loading) return <p className="text-center text-lg">Loading item details...</p>;
  if (error) return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  if (!item) return <p className="text-center text-lg">Item not found.</p>;

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {item.img && (
            <img
              src={`https://cdn.dota2.com${item.img}`}
              alt={item.dname}
              className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg bg-gray-700 p-2"
            />
          )}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              {item.dname}
            </h1>
            <p className="text-lg text-yellow-400 font-bold">{item.cost} gold</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-6">
          <h2 className="text-2xl font-bold text-blue-300 mb-4">Estadísticas y Atributos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <p><span className="font-semibold text-gray-400">Calidad:</span> {item.qual}</p>
              <p><span className="font-semibold text-gray-400">Costo de Maná:</span> {item.mc ?? 'N/A'}</p>
              <p><span className="font-semibold text-gray-400">Cooldown:</span> {item.cd ?? 'N/A'}</p>
              <p><span className="font-semibold text-gray-400">Comportamiento:</span> {item.behavior || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Atributos</h3>
              {renderAttributes(item.attrib)}
            </div>
          </div>
        </div>

        {item.components && (
            <div className="mt-6 border-t border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Componentes</h2>
                <p className="text-gray-300">{item.components.join(', ')}</p>
            </div>
        )}

        {item.lore && (
          <div className="mt-6 border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Lore</h2>
            <p className="text-gray-300 italic">{item.lore}</p>
          </div>
        )}

        {item.notes && (
            <div className="mt-6 border-t border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Notas</h2>
                <p className="text-gray-300">{item.notes}</p>
            </div>
        )}

        {item.hint && item.hint.length > 0 && (
            <div className="mt-6 border-t border-gray-700 pt-6">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">Consejos</h2>
                <ul className="list-disc list-inside">
                    {item.hint.map((h, i) => <li key={i} className="text-gray-300">{h}</li>)}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
}
