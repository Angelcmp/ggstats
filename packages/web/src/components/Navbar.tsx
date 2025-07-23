import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          ggstats
        </Link>
        <div className="space-x-4">
          <Link href="/heroes" className="text-gray-300 hover:text-white">
            Heroes
          </Link>
          <Link href="/items" className="text-gray-300 hover:text-white">
            Items
          </Link>
          <Link href="/meta-heroes" className="text-gray-300 hover:text-white">
            Meta Heroes
          </Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
