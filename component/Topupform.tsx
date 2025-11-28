'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/data/games';
import { paymentMethods } from '@/data/payment';
import { ShoppingCart, User, Wallet, Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function TopUpForm({ game }: { game: Game }) {
  const router = useRouter(); 

  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [email, setEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null); 
  
  const [isLoading, setIsLoading] = useState(false);

  const activeItem = game.items.find((item) => item.id === selectedItem);
  const isEsim = game.category === 'esim';
  const isMLBB = game.slug === 'mobile-legends';

  const getRawPrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''));
  const formatRupiah = (priceStr: string) => {
    const price = getRawPrice(priceStr);
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const isFormValid = () => {

    const paymentCheck = selectedPayment !== null;
    if (isEsim) return email !== '' && selectedItem !== null && paymentCheck;
    if (isMLBB) return userId !== '' && zoneId !==  '' && selectedItem !== null && paymentCheck;
    return userId !== '' && selectedItem !== null && paymentCheck;
  };

  const handlePayment = async () => {
    if (!activeItem || !selectedPayment) return;
    setIsLoading(true);

    const transactionData = {
        productName: `${game.name} - ${activeItem.amount}`,
        price: getRawPrice(activeItem.price),
        quantity: 1,
        name: userId || "Guest",
        email: email || "customer@example.com",
        paymentMethod: selectedPayment 
    };

    try {
        const response = await fetch('/api/tokenizer', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });

        const result = await response.json();

        if (result.data) {
        
            const invoiceData = {
                ...result.data,
                gameName: game.name,
                itemName: activeItem.amount,
                gameImage: game.image, 
                userRef: userId + (zoneId ? ` (${zoneId})` : ''),
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('current_invoice', JSON.stringify(invoiceData));

      
            router.push('/invoice');
        } else {
            alert("Gagal membuat transaksi: " + JSON.stringify(result));
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">


      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="bg-pink-500 px-6 py-3 flex items-center gap-3">
          <span className="bg-white text-pink-500 w-8 h-8 flex items-center justify-center rounded-full font-bold">1</span>
          <h2 className="text-white font-bold text-lg">
            {isEsim ? 'MASUKKAN EMAIL' : 'MASUKKAN DATA AKUN'}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
            {isMLBB && (
             <>
               <label className="text-sm font-semibold text-gray-700 block">User ID & Zone ID</label>
               <div className="flex gap-4">
                 <div className="relative w-2/3">
                    <User className="absolute left-3 top-3 text-gray-900 w-5 h-5"/>
                    <input type="text" placeholder="User ID" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                      value={userId} onChange={(e) => setUserId(e.target.value)} />
                 </div>
                 <div className="relative w-1/3">
                    <input type="text" placeholder="(Zone ID)" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition text-center"
                      value={zoneId} onChange={(e) => setZoneId(e.target.value)} />
                 </div>
               </div>
               <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Email (Opsional)</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                     <input type="email" placeholder="Masukkan Email Kamu..." className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                       value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
               </div>
             </>
            )}
            {!isEsim && !isMLBB && (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">User ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                    <input type="text" placeholder="Masukkan User ID..." className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                      value={userId} onChange={(e) => setUserId(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Email (Opsional)</label>
                  <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                      <input type="email" placeholder="Email..." className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </>
            )}
            {isEsim && (
              <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Email Aktif</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5"/>
                    <input type="email" placeholder="nama@email.com" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
              </div>
            )}
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="bg-pink-500 px-6 py-3 flex items-center gap-3">
          <span className="bg-white text-pink-500 w-8 h-8 flex items-center justify-center rounded-full font-bold">2</span>
          <h2 className="text-white font-bold text-lg">PILIH NOMINAL</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {game.items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`border rounded-xl p-4 text-left transition relative overflow-hidden group ${
                selectedItem === item.id 
                  ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' 
                  : 'hover:border-pink-300 border-gray-300 hover:shadow-md bg-white'
              }`}
            >
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.amount}</h3>
              <div className="flex justify-between items-end mt-4">
                 <p className={`font-semibold ${selectedItem === item.id ? 'text-pink-600' : 'text-gray-500'}`}>
                    {item.price}
                 </p>
                 <ShoppingCart className={`w-5 h-5 ${selectedItem === item.id ? 'text-pink-500' : 'text-gray-300'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="bg-pink-500 px-6 py-3 flex items-center gap-3">
          <span className="bg-white text-pink-500 w-8 h-8 flex items-center justify-center rounded-full font-bold">3</span>
          <h2 className="text-white font-bold text-lg">PILIH PEMBAYARAN</h2>
        </div>
        <div className="p-6 space-y-3">
          {paymentMethods.map((payment) => (
             <button
                key={payment.id}
                onClick={() => setSelectedPayment(payment.id)}
                className={`w-full flex items-center justify-between p-4 border rounded-xl transition ${
                  selectedPayment === payment.id 
                    ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' 
                    : 'hover:border-pink-400 border-gray-300 bg-white'
                }`}
             >
                <div className="flex items-center gap-4">
                   <div className="w-16 h-8 relative rounded overflow-hidden bg-gray-100 border border-gray-200">
                     <Image 
                     src={payment.image} 
                     alt={payment.name} 
                     fill 
                     className="object-cover" 
                     unoptimized />
                   </div>
                   <span className="font-medium text-gray-700">{payment.name}</span>
                </div>
             </button>
          ))}
        </div>
      </div>

     
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6  z-10">
         <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">Total Pembayaran:</div>
            <div className="text-2xl font-bold text-pink-500">
               {activeItem ? activeItem.price : 'Rp 0,-'}
            </div>
         </div>
         <button 
           onClick={handlePayment} 
           disabled={!isFormValid() || isLoading} 
           className={`w-full py-4 rounded-xl font-bold text-lg text-white transition flex items-center justify-center gap-2 ${
             !isFormValid() || isLoading
               ? 'bg-gray-300 cursor-not-allowed'
               : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200 shadow-md'
           }`}
         >
           {isLoading ? <Loader2 className="animate-spin" /> : <Wallet />}
           BAYAR SEKARANG
         </button>
      </div>

    </div>
  );
}