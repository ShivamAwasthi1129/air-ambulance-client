import Booking from "@/app/models/Booking";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";

export const GET = async req => {
  try{
    await connectToDatabase();
    const allBooking = await Booking.find();
    return NextResponse.json(allBooking);
  }catch(err){
    console.error("error", err.message);
    return NextResponse.json({error: err.message}, {status: 500})
  }
}