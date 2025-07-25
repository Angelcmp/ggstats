import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-700 py-4 px-6 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-3xl font-extrabold transition-colors duration-200">
          ggstats
        </Link>
        <div className="space-x-6">
          <Link href="/heroes" className="text-gray-300 hover:text-white text-lg font-medium transform transition-transform duration-200 hover:scale-105">
            Heroes
          </Link>
          <Link href="/items" className="text-gray-300 hover:text-white text-lg font-medium transform transition-transform duration-200 hover:scale-105">
            Items
          </Link>
          <Link href="/meta-heroes" className="text-gray-300 hover:text-white text-lg font-medium transform transition-transform duration-200 hover:scale-105">
            Meta Heroes
          </Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
