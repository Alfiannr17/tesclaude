import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/data/games';

export default function GameCard({ game }: { game: Game }) {

      const targetLink = game.category === 'cek' ? '/usage' : `/game/${game.slug}`;
  return (
    <Link href={targetLink} className="group">
      <div className="bg-white shadow rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 border border-transparent hover:bg-pink-50">
        <div className="relative aspect-square w-full mb-3 rounded-xl overflow-hidden">
          <Image 
            src={game.image} 
            alt={game.name}
            fill
            className="object-cover group-hover:scale-110 transition duration-500"
            unoptimized
            priority
          />
        </div>
        <h3 className="text-center font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
          {game.name}
        </h3>
        <p className="text-center text-xs text-gray-500 mt-1">{game.publisher}</p>
      </div>
    </Link>
  );
}