import { NextResponse } from "next/server";
import { encrypt } from "@/utils/ccavutil";

export async function POST(req) {
  const { amount , currency } = await req.json();

  // CCAvenue credentials
  const merchantId = process.env.CCA_MERCHANT_ID;
  const workingKey = process.env.CCA_WORKING_KEY;
  const accessCode = process.env.CCA_ACCESS_CODE;
  const redirectUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Redirect URL after payment
  const cancelUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Cancel URL
  const orderId = `ORD${Date.now()}`;
  // Prepare payload
  const payload = {
    merchant_id: merchantId,
    order_id: orderId,
    amount,
    currency,
    redirect_url: `${redirectUrl}?order_id=${orderId}&amount=${amount}&currency=${currency}&status=success`,
    cancel_url: `${cancelUrl}?status=cancelled`,
    language: "EN",
  };

  const queryString = new URLSearchParams(payload).toString(); 

  const encryptedPayload = encrypt(queryString, workingKey);

  // URL encode the encrypted payload
  const encodedPayload = encodeURIComponent(encryptedPayload);

  // CCAvenue payment URL
  const paymentUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encodedPayload}&access_code=${accessCode}`;

  return NextResponse.json({ paymentUrl });
}
