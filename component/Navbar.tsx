import { Search, GamepadDirectional } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className=" bg-white/70 backdrop-blur-md  sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-pink-500 text-white font-bold p-2 rounded-3xl"><GamepadDirectional /></div>
            <span className="font-bold text-xl text-pink-500">JOKI TUGAS <span className="text-gray-800"></span></span>
          </Link>

          {/* Menu & Search */}
          <div className="flex items-center gap-6">
            <Link href="/invoice" className="hidden md:block text-large font-bold text-gray-500 hover:text-pink-500">
              Cek Transaksi
            </Link>
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Pencarian..." 
                className="pl-4 pr-10 py-1.5 border border-gray-500 rounded-full text-sm focus:outline-none focus:border-pink-500"
              />
              <Search className="w-4 h-4 absolute right-3 top-2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}