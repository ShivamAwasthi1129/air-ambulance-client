import { NextResponse } from "next/server";
import { encrypt } from "@/lib/ccavenueEncryption";

const MERCHANT_ID = process.env.CCA_MERCHANT_ID;
const ACCESS_CODE = process.env.CCA_ACCESS_CODE;

export async function POST(req) {
  try {
    const { amount } = await req.json();
    const orderId = `ORD${Date.now()}`; // Unique order ID

    // Prepare transaction request parameters
    const data = `order_id=${orderId}&currency=USD&amount=${amount}`;
    // Encrypt request
    const encRequest = encrypt(data);  

    return NextResponse.json({ encRequest, accessCode: ACCESS_CODE });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
