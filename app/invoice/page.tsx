'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/component/Navbar'; 
import Footer from '@/component/Footer'; 
import { Copy, Clock, ChevronDown, CheckCircle2, AlertCircle, Loader2, SearchX, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { paymentMethods } from '@/data/payment';

export default function InvoicePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  
  useEffect(() => {
    const storedData = localStorage.getItem('current_invoice');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!data) return;
    
    const expiryTime = new Date(data.expiry_time).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("KADALUARSA");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours} jam ${minutes} menit ${seconds} detik`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);


  const handleCopy = (text: string) => {
  
    navigator.clipboard.writeText(text);
 
    setShowCopyPopup(true);


    setTimeout(() => {
      setShowCopyPopup(false);
    }, 2000);
  };

  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin w-10 h-10 text-orange-500 mb-4" />
            <span className="text-gray-500 font-medium">Memuat Data Transaksi...</span>
        </div>
    );
  }

  if (!data) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SearchX className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Transaksi</h2>
                    <p className="text-gray-500 mb-8">
                        Kamu belum melakukan transaksi apapun. Yuk cari game favoritmu dan top up sekarang!
                    </p>
                    <Link href="/" className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                        <ShoppingBag className="w-5 h-5" />
                        Mulai Belanja
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  

  const isQRIS = data.payment_type === 'qris';
  const isVA = data.payment_type === 'bank_transfer';
  const isCStore = data.payment_type === 'cstore';

  let bankName = 'QRIS';
  let paymentCode = '';

  if (isVA) {
    bankName = data.va_numbers[0].bank.toUpperCase();
    paymentCode = data.va_numbers[0].va_number;
  } else if (isCStore) {
    bankName = (data.store || 'minimarket').toUpperCase();
    paymentCode = data.payment_code;
  }

  const qrUrl = isQRIS ? data.actions[0].url : '';

  const paymentMethod = paymentMethods.find(pm => {
  if (isVA) return pm.key?.toLowerCase() === data.va_numbers[0].bank.toLowerCase();
  if (isQRIS) return pm.key?.toLowerCase() === 'qris';
  if (isCStore) return pm.key?.toLowerCase() === (data.store || 'minimarket').toLowerCase();
});


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative"> {/* Tambah relative */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          
          <div className="lg:col-span-1 space-y-4 ">
             <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-200">
                <div className="flex justify-center mb-4">
  {paymentMethod ? (
    <div className="relative w-24 h-12"> 
      <Image
        src={paymentMethod.image}
        alt={paymentMethod.name}
        fill
        className="object-contain scale-200" 
        unoptimized
      />
    </div>
  ) : (
    <div className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-xl text-pink-500 bg-pink-50">
      {bankName}
    </div>
  )}
</div>


                <p className="text-gray-500 text-sm mb-1">Total Pembayaran</p>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    {formatRupiah(Number(data.gross_amount))}
                </h2>

                <p className="text-gray-500 text-sm mb-2">
                    {isQRIS ? 'Scan Kode QR:' : 'Kode Pembayaran / VA:'}
                </p>

                {isQRIS && (
                    <div className="flex justify-center mb-4">
                        <div className="relative w-48 h-48 p-2 rounded">
                            <Image src={qrUrl} alt="QRIS" fill className="object-contain" unoptimized />
                        </div>
                    </div>
                )}

                {(isVA || isCStore) && (
                    <div className="flex items-center justify-center gap-2 mb-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300 group hover:border-pink-300 transition">
                        <span className="text-md font-mono font-bold text-gray-700 tracking-wider">
                            {paymentCode}
                        </span>
                        <button onClick={() => handleCopy(paymentCode)} className="text-pink-500 hover:text-pink-600 transition p-2 hover:bg-pink-50 rounded-full">
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <p className="text-xs text-gray-400 mb-1">Batas Waktu Pembayaran</p>
                <div className="text-pink-500 font-bold text-lg animate-pulse mb-6">
                    {timeLeft}
                </div>

                <div className="text-left border-t  border-gray-400 pt-4">
                    <p className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Butuh Bantuan?
                    </p>
                    <div className="space-y-2">
                        {isCStore && (
                            <details className="group border  border-gray-400 rounded-lg">
                                <summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-medium text-gray-600 hover:bg-pink-50">
                                    Bayar di {bankName}
                                    <ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
                                </summary>
                                <div className="p-3 pt-0 text-xs text-gray-500 leading-relaxed">
                                    1. Pergi ke kasir {bankName} terdekat.<br/>
                                    2. Bilang ingin bayar "Midtrans" atau tunjukkan kode bayar.<br/>
                                    3. Sebutkan kode: <b>{paymentCode}</b><br/>
                                    4. Bayar sesuai total tagihan.
                                </div>
                            </details>
                        )}
                        
                        {(isVA || isQRIS) && ['ATM', 'Mobile Banking', 'Internet Banking'].map((item) => (
                            <details key={item} className="group border border-gray-400 rounded-lg">
                                <summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-medium text-gray-600 hover:bg-pink-50">
                                    {item} {isVA ? bankName : ''}
                                    <ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
                                </summary>
                                <div className="p-3 pt-0 text-xs text-gray-500 leading-relaxed">
                                    {isQRIS ? 'Scan QRIS menggunakan aplikasi E-Wallet/Banking favoritmu.' : (
                                      <>
                                        1. Masukkan kartu ATM dan PIN.<br/>
                                        2. Pilih menu Transaksi Lainnya {'>'} Transfer {'>'} Virtual Account.<br/>
                                        3. Masukkan nomor VA: <b>{paymentCode}</b><br/>
                                        4. Periksa data transaksi lalu tekan YA.
                                      </>
                                    )}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2">
             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center lg:text-left">Rincian Pesanan</h2>

                <div className="flex items-center justify-between mb-8 relative px-4">
                     <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 -z-10 mx-8"></div>
                     <div className="absolute left-0 right-1/2 top-4 h-1 bg-pink-200 -z-10 mx-8"></div>
                     <div className="flex flex-col items-center">
                         <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                             <Clock className="w-4 h-4"/>
                         </div>
                         <span className="text-xs text-pink-500 font-bold mt-2">Menunggu</span>
                     </div>
                     <div className="flex flex-col items-center opacity-50">
                         <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                             $
                         </div>
                         <span className="text-xs text-gray-500 mt-2">Diterima</span>
                     </div>
                     <div className="flex flex-col items-center opacity-50">
                         <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                             <CheckCircle2 className="w-4 h-4"/>
                         </div>
                         <span className="text-xs text-gray-500 mt-2">Selesai</span>
                     </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-400 bg-white shrink-0">
                        {data.gameImage && (
                            <Image src={data.gameImage} alt="Game" fill className="object-cover" unoptimized />
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Produk</p>
                        <h3 className="font-bold text-gray-800 text-lg">{data.itemName}</h3>
                        <p className="text-sm text-gray-600">{data.gameName}</p>
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-gray-400 pb-3">
                        <span className="text-gray-500">No. Transaksi</span>
                        <span className="font-mono font-bold text-gray-800 flex items-center gap-2">
                            {data.transaction_id.substring(0, 15)}... 
                            <button onClick={() => handleCopy(data.transaction_id)} className="text-gray-400 hover:text-orange-500 transition">
                                <Copy className="w-3 h-3" />
                            </button>
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-400 pb-3">
                        <span className="text-gray-500">Status</span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {data.transaction_status}
                        </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-400 pb-3">
                        <span className="text-gray-500">Total Bayar</span>
                        <span className="font-bold text-gray-800">{formatRupiah(Number(data.gross_amount))}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-400 pb-3">
                        <span className="text-gray-500">Waktu Pemesanan</span>
                        <span className="text-gray-800">{new Date(data.createdAt).toLocaleString()}</span>
                    </div>
                    {data.userRef && (
                         <div className="flex justify-between border-b border-gray-400 pb-3">
                            <span className="text-gray-500">User ID</span>
                            <span className="text-gray-800 font-mono">{data.userRef}</span>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 text-center">
                    <Link href="/" className="text-pink-500 font-bold hover:underline">
                        Beli Produk Lainnya
                    </Link>
                </div>
             </div>
          </div>
        </div>
      </main>

      {showCopyPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            {/* Animasi sederhana: Fade in dan sedikit naik */}
            <div className="bg-pink-50  text-gray-500 px-8 py-4 rounded-xl border border-gray-200 flex items-center gap-3 ">
                <div className="bg-green-300 rounded-full border border-white">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-sm">Berhasil Disalin ke Clipboard!</span>
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
}