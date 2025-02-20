import { NextResponse } from "next/server";
import { encrypt } from "@/lib/ccavenueEncryption";

const MERCHANT_ID = process.env.CCA_MERCHANT_ID;
const ACCESS_CODE = process.env.CCA_ACCESS_CODE;
const REDIRECT_URL = process.env.NEXT_PUBLIC_CCAVENUE_REDIRECT_URL;
const CANCEL_URL = process.env.NEXT_PUBLIC_CCAVENUE_CANCEL_URL;

export async function POST(req) {
  try {
    const { amount } = await req.json();
    const orderId = `ORD${Date.now()}`; // Unique order ID

    // Prepare transaction request parameters
    const data = `merchant_id=${MERCHANT_ID}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=${REDIRECT_URL}&cancel_url=${CANCEL_URL}`;
    // Encrypt request
    const encRequest = encrypt(data);

    return NextResponse.json({ url: REDIRECT_URL, encRequest, accessCode: ACCESS_CODE });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
