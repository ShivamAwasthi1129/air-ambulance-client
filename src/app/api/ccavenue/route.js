import { NextResponse } from "next/server";
import { encrypt } from "@/utils/ccavutil";
import Booking from "@/app/models/Booking";

export async function POST(req) {
  const { amount , currency, flightType, segments, tripType, userInfo, totalAmount } = await req.json();

  // CCAvenue credentials
  const merchantId = process.env.CCA_MERCHANT_ID;
  const workingKey = process.env.CCA_WORKING_KEY;
  const accessCode = process.env.CCA_ACCESS_CODE;
  const redirectUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Redirect URL after payment
  const cancelUrl = `${process.env.LOCAL_URL}/api/ccavenue/response`; // Cancel URL

  const bookingInfo = {
    amount_paid: amount,
    currency,
    flight_type: flightType,
    segments,
    trip_type: tripType,
    user_info: userInfo,
    total_amount: totalAmount,
    status: "pending"
  }

  // await Booking.create(bookingInfo);
  const createdBooking = await Booking.create(bookingInfo);
  const orderId = createdBooking._id.toString();
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
