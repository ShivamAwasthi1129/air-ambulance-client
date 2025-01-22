import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
// import fleets from "./fleets.json";

// export const GET = async (req) => {
//   try{
//     for(const fleet of fleets){
//       const command = new PutCommand({
//         TableName: "AIR_FLEET",
//         Item: fleet,
//       });
//       await ddbDocClient.send(command);
//     }
//     return NextResponse.json({message: "OK"});
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }