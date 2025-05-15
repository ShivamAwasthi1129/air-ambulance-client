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
import Amenity from "@/app/models/Amenity";
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Or your specific origin
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function isStringifiedObject(str) {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null; // Check if it's an object (not null)
  } catch (e) {
    return false; // Invalid JSON, so not a stringified object
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const departureDate = searchParams.get("departureDate");
    const travelerCount = searchParams.get("travelerCount");
    const flightTypes = searchParams.get("flightType").split(",");

    if (!from || !to || !departureDate || !travelerCount || !flightTypes) {
      return NextResponse.json(
        { message: "Missing required parameters." },
        { status: 400 }
      );
    }

    let fromStations, toStations;

    if (isStringifiedObject(from)) {
      const { lat, lng } = JSON.parse(from);
      const response = await fetch(
        `${process.env.API_URL}/basesearch?lat=${lat}&lng=${lng}`
      );
      const airports = await response.json();
      fromStations = airports.map((airport) => airport.name);
    }

    if (isStringifiedObject(to)) {
      const { lat, lng } = JSON.parse(to);
      const response = await fetch(
        `${process.env.API_URL}/basesearch?lat=${lat}&lng=${lng}`
      );
      const airports = await response.json();
      toStations = airports.map((airport) => airport.name);
    }

    fromStations = fromStations ?? [from];
    toStations = toStations ?? [to];
    // console.log('Executing Aircraft.find with params:', {
    //   fromStations,
    //   flightTypes,
    //   toStations,
    //   travelerCount,
    // });
    // Query MongoDB for available fleets
    const fleets = await Aircraft.find({
      "fleetDetails.baseStation": { $in: fromStations },
      "fleetDetails.flightType": { $in: flightTypes },
      "fleetDetails.restrictedAirports": {
        $nin: toStations
      },
      "fleetDetails.seatCapacity": { $gte: Number(travelerCount) },
      "fleetDetails.verified": true,
    });
    const fleetIds = fleets.map((fleet) => fleet._id);

    let fleetTimes = await FleetTime.find({
      fleet_id: { $in: fleetIds },
      departure_time: { $gte: new Date(departureDate) },
      arrival_time: { $lte: new Date(departureDate) },
    })
    .lean(); //added

    const bookedFleet = fleetTimes.map((fleet) => fleet._id);

    const availableFleets = fleets.filter(
      (fleet) => !bookedFleet.includes(fleet._id)
    );

    if (availableFleets.length === 0) {
      return NextResponse.json(
        { message: "No available fleets match the criteria." },
        { status: 404 }
      );
    }

    let arrival, destination;
    if (!isStringifiedObject(from)) arrival = await searchStation(from.trim());
    if (!isStringifiedObject(to)) destination = await searchStation(to.trim());

    let addOnService;
    if (!isStringifiedObject(from))
      addOnService = await Amenity.find({
        airports: { $in: [arrival[0].iata_code] },
      });

    const finalFleet = availableFleets.map((fleet) => {
      const { maxSpeed, pricing } = fleet.fleetDetails;
      const cruisingSpeed = parseFloat(maxSpeed) * 1.852; // Convert knots to km/h
      const distance = haversine(
        arrival ? arrival[0].latitude : JSON.parse(from).lat,
        arrival ? arrival[0].longitude : JSON.parse(from).lng,
        destination ? destination[0].latitude : JSON.parse(to).lat,
        destination ? destination[0].longitude : JSON.parse(to).lng
      ).toFixed(2);
      const flightTime = distance / cruisingSpeed; // in hours
      const totalPrice = (flightTime * parseFloat(pricing) * 2).toFixed(0);

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
      addOnService,
    });
  } catch (error) {
    console.error("Error retrieving fleets:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
