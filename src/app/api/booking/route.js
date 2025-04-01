import Booking from "@/app/models/Booking";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";

export const GET = async req => {
  try{
    const {searchParams} = new URL(req.url);
    const email = searchParams.get("email");

    await connectToDatabase();
    let filter = {};
    if(email)
      filter = { "user_info.email": email };

    const allBooking = await Booking.find(filter);
    return NextResponse.json(allBooking);
  }catch(err){
    console.error("error", err.message);
    return NextResponse.json({error: err.message}, {status: 500})
  }
}