import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import { haversine, searchStation, convertToHoursMinutes } from "@/utils/helperFunction";

const TABLE_NAME = "AIR_FLEET";

export async function GET(req) {
  try {
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

    console.log("Search Params:", { from, to, departureDate, travelerCount });

    // Scan records with specific filter conditions
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression:
        "fleetDetails.baseStation = :from AND NOT contains(fleetDetails.restrictedAirports, :to) AND fleetDetails.seatCapacity >= :travelerCount AND (fleetDetails.unavailabilityDates.fromDate > :departureDate OR fleetDetails.unavailabilityDates.toDate < :departureDate)",
      ExpressionAttributeValues: {
        ":from": from,
        ":to": to,
        ":travelerCount": Number(travelerCount),
        ":departureDate": departureDate,
      },
    };

    const scanResult = await ddbDocClient.send(new ScanCommand(scanParams));

    let availableFleets = scanResult.Items;
    if (availableFleets.length === 0) {
      return NextResponse.json(
        { message: "No available fleets match the criteria." },
        { status: 404 }
      );
    }
    const arrival = await searchStation(from.trim());
    const destination = await searchStation(to.trim());

    const finalFleet = [];
    // Calculate distance, flight time, and total price for each fleet
    for (const fleet of availableFleets) {
      const { maxSpeed, pricing } = fleet.fleetDetails;
      // Convert knots to km/h (1 knot = 1.852 km/h)
      const cruisingSpeed = parseFloat(maxSpeed) * 1.852;
      // Calculate distance in km
      const distance = haversine(
        arrival[0].latitude,
        arrival[0].longitude,
        destination[0].latitude,
        destination[0].longitude
      ).toFixed(2);
      // Calculate time (time = distance / speed)
      const flightTime = distance / cruisingSpeed; // in hours

      // Calculate total price
      const totalPrice = (flightTime * parseFloat(pricing)).toFixed(0);

      finalFleet.push({ ...fleet, distance: `${distance} km`, flightTime: convertToHoursMinutes(flightTime), totalPrice: `$${totalPrice}` });
    }

    return NextResponse.json({
      message: "Available fleets retrieved successfully.",
      finalFleet,
    });
  } catch (error) {
    console.error("Error updating records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
