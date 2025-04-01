import Booking from "@/app/models/Booking";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const { id } = await params;
    await connectToDatabase();
    const allBooking = await Booking.findById(id);
    return NextResponse.json(allBooking);
  } catch (err) {
    console.error("error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
