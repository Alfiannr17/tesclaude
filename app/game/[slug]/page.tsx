import { games } from '@/data/games';
import Navbar from '@/component/Navbar';
import TopUpForm from '@/component/Topupform';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Undo2, ChevronLeft } from 'lucide-react';
import Footer from '@/component/Footer';

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GameDetail({ params }: PageProps) {
  const { slug } = await params; 

  const game = games.find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Link href="/" className="flex items-center text-xl font-bold text-gray-500 hover:text-pink-500 mb-6 gap-1">
           <ChevronLeft strokeWidth={3} className='flex items-center'/> Kembali ke Beranda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-1 lg:sticky lg:top-24">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-md mb-4">
                   <Image src={game.image} alt={game.name} fill className="object-cover" unoptimized />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-800">{game.name}</h1>
                <p className="text-center text-orange-500 font-medium mb-4">{game.publisher}</p>
                
                <div className="border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-2">
                   <p className="leading-relaxed">
                      Top up {game.name} resmi dan murah.
                   </p>
                   <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500"/>
                      <span>Proses Otomatis</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500"/>
                      <span>Layanan 24 Jam</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2">
             <TopUpForm game={game} />
          </div>``

        </div>
      </main>
      <Footer/>
    </div>
  );
}