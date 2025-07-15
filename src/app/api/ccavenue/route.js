import { NextResponse } from "next/server";
import { encrypt } from "@/utils/ccavutil";
import Booking from "@/app/models/Booking";
import { generateUniqueString } from "@/utils/helperFunction";

export async function POST(req) {
  try {
    let { amount, currency, segments, tripType, userInfo, totalAmount } =
      await req.json();

    // CCAvenue credentials
    const merchantId = process.env.CCA_MERCHANT_ID;
    const workingKey = process.env.CCA_WORKING_KEY;
    const accessCode = process.env.CCA_ACCESS_CODE;
    const redirectUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Redirect URL after payment
    const cancelUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Cancel URL

    const orderId = generateUniqueString();

    segments = segments.map((sg, i) => ({ _id: `${orderId}-${i + 1}`, ...sg }));

    const bookingInfo = {
      amount_paid: amount,
      currency,
      payment: { payment_via: "cc" },
      segments,
      trip_type: tripType,
      user_info: userInfo,
      total_amount: totalAmount,
      status: "pending",
    };

    await Booking.create({ _id: orderId, ...bookingInfo });

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
    const paymentUrl = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encodedPayload}&access_code=${accessCode}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
