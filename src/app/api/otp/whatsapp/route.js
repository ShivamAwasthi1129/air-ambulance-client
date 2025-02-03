import { NextResponse } from "next/server";
import { ddbDocClient } from "@/config/docClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || 300; // 5 minutes

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = Math.floor(Date.now() / 1000) + OTP_EXPIRY_TIME;
    const generateId = () => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return arr[0].toString(36);
    };

    const params = {
      TableName: "OTPTable",
      Item: {
        id: generateId(),
        via: "whatsapp",
        address: phoneNumber,
        otp: otp,
        expiryTime: expiryTime,
      },
    };

    await ddbDocClient.send(new PutCommand(params));
    const message = `Your OTP code is: ${otp}`;

    await fetch(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phoneNumber,
          // type: "text",
          // text: { body: `Your OTP is: ${otp}. It expires in 5 minutes.` },
          type: "template",
          template: { name: "hello_world", language: { code: "en_US" } },
        }),
      }
    );

    return NextResponse.json({ success: true, otp });
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
