import Booking from "@/app/models/Booking";
import { NextResponse } from "next/server";
import { ObjectId } from 'bson';
import { connectToDatabase } from "@/config/mongo";

export async function POST(req) {
  try {
    const parsedURL = new URL(req.url);
    const status = parsedURL.searchParams.get("status");
    const id = parsedURL.searchParams.get("orderId");

    if (status == "success") {
      await connectToDatabase();
      const updatedBooking = await Booking.findByIdAndUpdate(new ObjectId(id), {
        $set: {
          status: "success",
        },
      });

      if (!updatedBooking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
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
