import { NextResponse } from "next/server";
import OTPTable from "@/app/models/OTPTable";
import { connectToDatabase } from "@/config/mongo";

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

    await connectToDatabase();
    // Store OTP in MongoDB
    await OTPTable.create({
      via: "whatsapp",
      address: phoneNumber,
      otp,
      expiryTime,
    });

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
          to: `whatsapp:${phoneNumber}`,
          type: "template",
          template: {
            name: "otp_verify",
            language: {
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: otp,
                  },
                ],
              },
              {
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                  {
                    type: "text",
                    text: "short-text",
                  },
                ],
              },
            ],
          },
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

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phoneNumber");
    const otp = searchParams.get("otp");

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the latest OTP for the phone number
    const result = await OTPTable.findOne(
      { address: phoneNumber },
      { sort: { expiryTime: -1 } }
    );

    if (!result) {
      return NextResponse.json({ message: "OTP not found" }, { status: 400 });
    }

    if (result.otp != otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    const expiryTime = result.expiryTime;
    const currentTime = Math.floor(Date.now() / 1000) + OTP_EXPIRY_TIME;
    if (expiryTime < currentTime) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
};
