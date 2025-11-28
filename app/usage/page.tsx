'use client';

import { useState } from 'react';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import { Search, Wifi, BarChart3, Calendar, Loader2, AlertCircle, CheckCircle2, FileDigit } from 'lucide-react';

export default function CheckUsagePage() {
  const [esimTranNo, setEsimTranNo] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [usageData, setUsageData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esimTranNo) return;

    setLoading(true);
    setError('');
    setUsageData(null);

    try {
      const res = await fetch('/api/esim/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esimTranNo }),
      });

      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        setUsageData(result.data);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculatePercent = (used: number, total: number) => {
    if (!total || total === 0) return 0;
    const percent = (used / total) * 100;
    return Math.min(100, Math.max(0, percent));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className=" max-w-2xl mx-auto w-full px-4 py-8">
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Wifi className="text-pink-500" />
                Cek Data eSim
            </h1>
            <p className="text-gray-500 mt-2">
                Masukkan <b>Nomor Transaksi</b> (Contoh: 2503xxxx)
            </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <form onSubmit={handleCheck} className="flex flex-col gap-4">
                <div className="relative">
                    <FileDigit className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Masukkan Nomor Transaksi..." 
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
                        value={esimTranNo}
                        
                        onChange={(e) => setEsimTranNo(e.target.value)} 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !esimTranNo}
                    className="bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition disabled:bg-gray-300 flex justify-center items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Cek Kuota'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
        </div>

        {usageData && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-pink-500 px-6 py-4 flex justify-between items-center">
                    <div>
                        <p className="text-gray-200 text-xs uppercase tracking-wider">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2 className="text-white w-5 h-5" />
                            <span className="font-bold text-white uppercase">DATA FOUND</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-200 text-xs uppercase tracking-wider">No. Transaksi</p>
                        <p className="text-white font-mono text-sm">{usageData.esimTranNo}</p>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">{usageData.bundleName}</h3>

                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Terpakai: <span className="text-gray-800 font-semibold">{formatBytes(usageData.usedData)}</span></span>
                            <span className="text-gray-500">Total: <span className="text-gray-800 font-semibold">{formatBytes(usageData.totalData)}</span></span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-400">
                            <div 
                                className="bg-red-500 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${calculatePercent(usageData.usedData, usageData.totalData)}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-right">
                             <span className="text-sm text-gray-500">Sisa Kuota: </span>
                             
                             <span className="text-lg font-bold text-pink-500">
                                {formatBytes(usageData.remainingData)}
                             </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-400 pt-6">
                        <div className="bg-pink-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <BarChart3 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Persentase</span>
                            </div>
                            <p className="text-2xl font-bold text-pink-500">
                                {Math.round(calculatePercent(usageData.usedData, usageData.totalData))}%
                            </p>
                            <p className="text-xs text-gray-500">Kuota Terpakai</p>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Terakhir Update</span>
                            </div>
                            <p className=" text-pink-500 text-2xl font-bold mt-1">
                                {usageData.lastUpdate ? new Date(usageData.lastUpdate).toLocaleDateString('id-ID') : '-'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {usageData.lastUpdate ? new Date(usageData.lastUpdate).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
      <Footer />
    </div>
  );
}