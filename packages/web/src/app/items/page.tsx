'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ItemDto } from '../../../../../packages/api/src/dota2/dto/item.dto';

export default function ItemsPage() {
  const [items, setItems] = useState<Record<string, ItemDto> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3002/dota2/items');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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

  const filteredItems = Object.values(items || {}).filter(item => {
    const itemName = item.dname?.toLowerCase() || '';
    const matchesSearchTerm = itemName.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.qual === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'consumable', label: 'Consumibles' },
    { value: 'common', label: 'Comunes' },
    { value: 'rare', label: 'Raros' },
    { value: 'epic', label: 'Épicos' },
    { value: 'legendary', label: 'Legendarios' },
    { value: 'artifact', label: 'Artefactos' },
    { value: 'secret_shop', label: 'Tienda Secreta' },
    { value: 'side_shop', label: 'Tienda Lateral' },
    { value: 'recipe', label: 'Recetas' },
  ];

  const formatSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!items) return <p>No items found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Dota 2 Items</h1>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar ítem..."
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/2 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-700 rounded-md w-full md:w-1/2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/items/${formatSlug(item.dname || '')}`} passHref>
            <div className="bg-gray-800 p-3 rounded-lg shadow-md flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 hover:border-blue-500 h-full">
              <h2 className="text-lg font-semibold text-blue-400 mb-1">{item.dname}</h2>
              {item.img && (
                <img
                  src={`https://cdn.dota2.com${item.img}`}
                  alt={item.dname}
                  className="w-20 h-20 object-contain mb-2"
                  title={item.notes} // Use title for tooltip
                />
              )}
              <p className="text-sm text-yellow-400 font-bold">{item.cost} gold</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
