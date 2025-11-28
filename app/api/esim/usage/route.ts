import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { esimTranNo } = await request.json();

    if (!esimTranNo) {
      return NextResponse.json({ error: "Nomor Transaksi eSIM wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.ESIM_ACCESS_CODE; 
    
    if (!apiKey) {
       return NextResponse.json({ error: "API Key belum diisi di file route.ts" }, { status: 500 });
    }

    const apiUrl = "https://api.esimaccess.com/api/v1/open/esim/usage/query"; 

    console.log("--- DEBUG REQUEST ---");
    console.log("API Key Length:", apiKey);
    console.log("Tran No:", esimTranNo);

    // Kirim Request ke Provider
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RT-AccessCode': apiKey, // Menggunakan variable apiKey di atas
      },
      // PERBAIKAN: Payload harus "esimTranNoList" (Array), bukan "esimTranNo" (String)
      body: JSON.stringify({ 
        esimTranNoList: [esimTranNo] 
      }),
    });

    const data = await response.json();
    console.log("Response Provider:", JSON.stringify(data));

    if (data.success && data.obj && data.obj.esimUsageList && data.obj.esimUsageList.length > 0) {
      const usageInfo = data.obj.esimUsageList[0];
      
      return NextResponse.json({
        data: {
          esimTranNo: usageInfo.esimTranNo,
          
          status: "ACTIVE",
          totalData: usageInfo.totalData || 0,
          usedData: usageInfo.dataUsage || 0,
          remainingData: (usageInfo.totalData - usageInfo.dataUsage) || 0,
          lastUpdate: usageInfo.lastUpdateTime,
           bundleName: usageInfo.packageName || "Paket Data eSIM"
        }
      });
    } else {
      const msg = data.errorMsg || "Data tidak ditemukan. Pastikan Nomor Transaksi Benar.";
      return NextResponse.json({ error: `Gagal: ${msg}` }, { status: 404 });
    }

  } catch (error) {
    console.error("SYSTEM ERROR:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}