// app/api/search/route.js
import { NextResponse } from "next/server";

const OPENSEARCH_DOMAIN = "https://search-airbase-search-q5vzxvf7nu2vyeghdh6gqr5xyy.ap-south-1.es.amazonaws.com"; // Replace with your OpenSearch domain
const INDEX_NAME = "id"; // Change based on your OpenSearch index

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

        // OpenSearch Query (Full-Text Search)
        const openSearchQuery = {
            size: 10, // Limit results to 10
            query: {
                multi_match: {
                    query: query,
                    fields: ["name", "iata_code", "icao_code", "city", "country"]
                }
            }
        };

        // OpenSearch API URL
        const url = `${OPENSEARCH_DOMAIN}/${INDEX_NAME}/_search`;

        // Basic Authentication
        const username = process.env.OPENSEARCH_USERNAME;
        const password = process.env.OPENSEARCH_PASSWORD;

        // Send request to OpenSearch
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
            },
            body: JSON.stringify(openSearchQuery)
        });

        if (!response.ok) {
            throw new Error(`OpenSearch Error: ${response.statusText}`);
        }

        const data = await response.json();
        const results = data.hits.hits.map(hit => hit._source);

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
