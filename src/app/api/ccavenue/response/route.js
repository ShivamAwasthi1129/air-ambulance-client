import Booking from "@/app/models/Booking";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/mongo";
import FleetTime from "@/app/models/FleetTime";
import { addDurationToDate, addTimeToDate } from "@/utils/helperFunction";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const parsedURL = new URL(req.url);
    const status = parsedURL.searchParams.get("status");
    const id = parsedURL.searchParams.get("order_id");
    if (status == "success") {
      await connectToDatabase();
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "success",
          },
        },
        { new: true }
      ).lean();

      if (!updatedBooking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      for(const segment of updatedBooking.segments){
        await FleetTime.create({
          fleet_id: new mongoose.Types.ObjectId(segment["selectedFleet"]["fleetId"]),
          departure_time: segment.departureDate,
          arrival_time: addDurationToDate(addTimeToDate(segment.departureDate, segment.departureTime), segment["selectedFleet"]["time"])
        })
      }

      return NextResponse.redirect(
        `${process.env.LOCAL_URL}/payment-success${parsedURL.search}`,
        303
      );
    }

    return NextResponse.redirect(
      `${process.env.LOCAL_URL}/payment-cancel`,
      303
    );
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Error decrypting response" },
      { status: 500 }
    );
  }
}
