import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";
import { searchStation } from "@/utils/helperFunction";
import Airports from "@/app/models/Airports";

export async function GET(req) {
    // Get the query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    try {
        await connectToDatabase();

        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            const geoResults = await Airports.aggregate([
              {
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [lng, lat],
                  },
                  distanceField: "distance",
                  spherical: true,
                },
              },
              { $limit: 10 },
              {
                $project: {
                  name: 1,
                  city: 1,
                  country: 1,
                  iata_code: 1,
                  icao_code: 1,
                  latitude: 1,
                  longitude: 1,
                  distance: { $divide: ["$distance", 1000] }, // Convert to kilometers
                },
              },
            ]);
      
            return NextResponse.json(geoResults);
          }

          if(query){
              const results = await searchStation(query);
              return NextResponse.json(
                results
              );
          }

        return NextResponse.json(
            { error: "Either valid latitude/longitude or query parameter is required" },
            { status: 400 }
          );
    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
