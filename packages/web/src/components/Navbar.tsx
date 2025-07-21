import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-transparent absolute top-0 left-0 z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-accent-blue text-3xl font-exo2 font-bold uppercase">
          GGSTATS
        </Link>
        <div className="flex items-center">
          <Link href="/dota2" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            Dota 2
          </Link>
          <Link href="/heroes" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            Heroes
          </Link>
          <Link href="/items" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            Items
          </Link>
          <Link href="/stats" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            Stats
          </Link>
          <Link href="/lol" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            League of Legends
          </Link>
          <Link href="/valorant" className="px-3 py-2 text-text-main hover:text-accent-blue transition-colors duration-300 font-roboto rounded-md">
            Valorant
          </Link>
        </div>
      </div>
    </nav>
  );
}