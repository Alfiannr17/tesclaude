import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';
import { v4 as uuidv4 } from 'uuid';

// Ganti Snap menjadi CoreApi
const core = new Midtrans.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
});

export async function POST(request: Request) {
  try {
    const { productName, price, quantity, name, email, paymentMethod } = await request.json();

    const orderId = `TRX-${uuidv4()}`;
    const grossAmount = parseInt(price) * quantity;

    // Konfigurasi dasar
    let parameter: any = {
      payment_type: '', // Nanti diisi berdasarkan pilihan user
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount
      },
      customer_details: {
        first_name: name,
        email: email
      },
      item_details: [{
         id: "ITEM1",
         price: parseInt(price),
         quantity: quantity,
         name: productName.substring(0, 50)
      }]
    };

    switch (paymentMethod) {
        case 'QRIS':
            parameter.payment_type = 'qris';
            parameter.qris = { acquirer: 'gopay' };
            break;
            
        case 'GOPAY':
            parameter.payment_type = 'gopay';
            break;

        case 'BCAVA':
            parameter.payment_type = 'bank_transfer';
            parameter.bank_transfer = { bank: 'bca' };
            break;

        case 'BNIVA':
            parameter.payment_type = 'bank_transfer';
            parameter.bank_transfer = { bank: 'bni' };
            break;

        case 'BRIVA':
            parameter.payment_type = 'bank_transfer';
            parameter.bank_transfer = { bank: 'bri' };
            break;

             case 'ALFAMART':
            parameter.payment_type = 'cstore';
            parameter.cstore = {
                store: 'alfamart',
                message: 'Topup Gamebrott'
            };
            break;

        case 'INDOMARET':
            parameter.payment_type = 'cstore';
            parameter.cstore = {
                store: 'indomaret',
                message: 'Topup Gamebrott'
            };
            break;
            
        // Tambahkan metode lain sesuai kebutuhan...
        default:
            return NextResponse.json({ error: "Metode pembayaran tidak dikenali" }, { status: 400 });
    }

    console.log("Mengirim ke Core API...", parameter);

    // Minta Data ke Midtrans Core API (Bukan createTransaction tapi charge)
    const response = await core.charge(parameter);
    
    console.log("✅ Respon Midtrans:", response);
    
    return NextResponse.json({ data: response });
    
  } catch (error: any) {
    console.error("❌ ERROR CORE API:", error.message || error); 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}