'use client';
import Navbar from '@/component/Navbar';
import GameCard from '@/component/Gamecard';
import { games } from '@/data/games';
import { Flame, Gamepad2, CardSim } from 'lucide-react';
import Image from 'next/image';
import Footer from '@/component/Footer';
import { banner as banners } from '@/data/banner';
import { useEffect, useState } from 'react';

interface Banner {
  src: string;
  title: string;
  subtitle: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}



export default function Home() {
  const featuredGames = games.slice(0, 4);
  const esim = games.filter((game) => game.slug.includes("esim"));


useEffect(() => {
  const interval = setInterval(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, 5000); 
  return () => clearInterval(interval);
}, []);


const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        
        
          <section className="mb-10 relative w-full h-48 md:h-80 overflow-hidden rounded-2xl">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={banner.src}
            alt={banner.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <h2 className="text-white text-2xl md:text-4xl font-bold">
              {banner.title}
            </h2>
            <p className="text-gray-200 mt-2">{banner.subtitle}</p>
          </div>
        </div>
      ))}

      {/* Tombol navigasi kiri */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-20"
      >
        &#10094; {/* panah kiri */}
      </button>

      {/* Tombol navigasi kanan */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-20"
      >
        &#10095; {/* panah kanan */}
      </button>

      {/* Indikator dot */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </section>    
          


        
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-pink-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Produk Unggulan</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <CardSim className="text-orange-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">eSim</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {esim.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

       
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Gamepad2 className="text-blue-500" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Semua Layanan</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

            
      </main>

      <Footer/>
    </div>
  );
}