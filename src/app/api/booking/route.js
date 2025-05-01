import Booking from "@/app/models/Booking";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";
import { generateUniqueString } from "@/utils/helperFunction";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectToDatabase();
    let filter = {};
    if (email) filter = { "user_info.email": email };

    const allBooking = await Booking.find(filter);
    return NextResponse.json(allBooking);
  } catch (err) {
    console.error("error", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    let {
      acc_name,
      acc_no,
      reference_id,
      amount,
      currency,
      segments,
      tripType,
      userInfo,
      totalAmount,
    } = await req.json();

    const orderId = generateUniqueString();
    segments = segments.map((sg, i) => ({ _id: `${orderId}-${i + 1}`, ...sg }));

    const bookingInfo = {
      amount_paid: amount,
      currency,
      payment: {
        payment_via: "others",
        reference_id,
        to_account_no: acc_no,
        to_account_name: acc_name,
      },
      segments,
      trip_type: tripType,
      user_info: userInfo,
      total_amount: totalAmount,
      status: "pending",
    };
    await Booking.create({ _id: orderId, ...bookingInfo });
    return NextResponse.redirect(
      `${process.env.LOCAL_URL}/payment-success?order_id=${orderId}&amount=${amount}&currency=INR&status=success`,
      303
    );
  } catch (err) {
    console.error("error", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
