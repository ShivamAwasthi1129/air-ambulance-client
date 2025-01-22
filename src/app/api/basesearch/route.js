import { NextResponse } from "next/server";
import { searchStation } from "@/utils/helperFunction";

export async function GET(req) {
    try {
        // Get the query from request URL
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "";

        if (!query) {
            return NextResponse.json(
                { message: "Query parameter is required" },
                { status: 400 }
            );
        }

        const results = await searchStation(query);

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
