import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/mongo";
import Aircraft from "@/app/models/Aircraft";
import {
  haversine,
  searchStation,
  convertToHoursMinutes,
  addHoursToDate,
} from "@/utils/helperFunction";
import FleetTime from "@/app/models/FleetTime";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const departureDate = searchParams.get("departureDate");
    const travelerCount = searchParams.get("travelerCount");

    if (!from || !to || !departureDate || !travelerCount) {
      return NextResponse.json(
        { message: "Missing required parameters." },
        { status: 400 }
      );
    }

    // Query MongoDB for available fleets
    const fleets = await Aircraft.find({
      "fleetDetails.baseStation": from,
      "fleetDetails.restrictedAirports": { $not: { $elemMatch: { $eq: to } } },
      "fleetDetails.seatCapacity": { $gte: Number(travelerCount) }
    });

    const fleetIds = fleets.map((fleet) => fleet._id);

    const fleetTimes = await FleetTime.find({
      _id: { $in: fleetIds },
      departure_time: { $gte: new Date(departureDate) },
      arrival_time: { $lte: new Date(departureDate) },
    }).lean();

    const bookedFleet = fleetTimes.map(fleet => fleet._id);

    const availableFleets = fleets.filter(fleet => !bookedFleet.includes(fleet._id));

    if (availableFleets.length === 0) {
      return NextResponse.json(
        { message: "No available fleets match the criteria." },
        { status: 404 }
      );
    }

    const arrival = await searchStation(from.trim());
    const destination = await searchStation(to.trim());

    const finalFleet = availableFleets.map((fleet) => {
      const { maxSpeed, pricing } = fleet.fleetDetails;
      const cruisingSpeed = parseFloat(maxSpeed) * 1.852; // Convert knots to km/h
      const distance = haversine(
        arrival[0].latitude,
        arrival[0].longitude,
        destination[0].latitude,
        destination[0].longitude
      ).toFixed(2);
      const flightTime = distance / cruisingSpeed; // in hours
      const totalPrice = (flightTime * parseFloat(pricing)).toFixed(0);

      return {
        ...fleet._doc,
        distance: `${distance} km`,
        arrivalTime: addHoursToDate(departureDate, flightTime),
        flightTime: convertToHoursMinutes(flightTime),
        totalPrice: `${totalPrice}`,
      };
    });

    return NextResponse.json({
      message: "Available fleets retrieved successfully.",
      finalFleet,
    });
  } catch (error) {
    console.error("Error retrieving fleets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
