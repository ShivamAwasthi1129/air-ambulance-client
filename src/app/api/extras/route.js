import { NextResponse } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
// import fleets from './fleets.json';

const TABLE_NAME = "AIR_FLEET";

export async function GET() {
  try {
    const fleets = [];
    const updatePromises = fleets.map((record) => {
      const updateParams = {
        TableName: TABLE_NAME,
        Key: { serialNumber: record.serialNumber },
        UpdateExpression: "SET fleetDetails.flightType = :flightType",
        ExpressionAttributeValues: {
          ":flightType": record.flightType || 'Private Jet', // Default seat capacity value (modify as needed)
        },
      };

      return ddbDocClient.send(new UpdateCommand(updateParams));
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: `Added 'flightType' to ${fleets.length} records successfully.`,
      updatedRecords: fleets.length,
    });
  } catch (error) {
    console.error("Error updating records:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}