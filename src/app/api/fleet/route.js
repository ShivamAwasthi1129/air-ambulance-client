import { NextResponse } from "next/server";
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";

const TABLE_NAME = "AIR_FLEET";

// export async function GET() {
//   try {
//     // Step 1: Scan all records in the table
//     const scanParams = {
//       TableName: TABLE_NAME,
//       ProjectionExpression: "serialNumber",
//     };

//     const scanResult = await ddbDocClient.send(new ScanCommand(scanParams));
//     const records = scanResult.Items;

//     if (records.length === 0) {
//       return NextResponse.json(
//         { message: "No records found in the table." },
//         { status: 200 }
//       );
//     }

//     // Step 2: Iterate through records and update them with the new field
//     const updatePromises = records.map((record) => {
//       const updateParams = {
//         TableName: TABLE_NAME,
//         Key: { serialNumber: record.serialNumber },
//         UpdateExpression: "SET fleetDetails.seatCapacity = :seatCapacity",
//         ExpressionAttributeValues: {
//           ":seatCapacity": Math.floor(Math.random(10) * 8) + 2, // Default seat capacity value (modify as needed)
//         },
//       };

//       return ddbDocClient.send(new UpdateCommand(updateParams));
//     });

//     await Promise.all(updatePromises);

//     return NextResponse.json({
//       message: `Added 'seatCapacity' to ${records.length} records successfully.`,
//       updatedRecords: records.length,
//     });
//   } catch (error) {
//     console.error("Error updating records:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
