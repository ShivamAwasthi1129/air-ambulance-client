import { NextResponse } from "next/server";
import OTPTable from "@/app/models/OTPTable";
import { connectToDatabase } from "@/config/mongo";
import sendMail from "@/config/nodeMailer";

const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || 300; // 5 minutes

export async function POST(req) {
  try {
    const { phoneNumber, email } = await req.json();
    if (!phoneNumber && !email) {
      return NextResponse.json(
        { error: "Phone number and email are required" },
        { status: 400 }
      );
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = Math.floor(Date.now() / 1000) + Number(OTP_EXPIRY_TIME);

    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=d2e0e29759c1416a8ed262380033504d&email=${email}`);
    const emailValidator = await response.json();

    if(!emailValidator.deliverability == "UNDELIVERABLE")
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    await connectToDatabase();

    const result = await OTPTable.findOne({ address: phoneNumber });

    if (!result) {
      // Store OTP in MongoDB
      await OTPTable.create({
        via: "whatsapp",
        address: phoneNumber,
        otp,
        expiryTime,
      });

      await OTPTable.create({
        via: "email",
        address: email,
        otp,
        expiryTime,
      });
    } else {
      // Update OTP in MongoDB
      await OTPTable.updateOne(
        { _id: result._id },
        { $set: { otp, expiryTime } }
      );

      await OTPTable.updateOne(
        { address: email },
        { $set: { otp, expiryTime } }
      );
    }

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

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Air Aviation OTP Login</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .logo {
                width: 150px;
                margin-bottom: 20px;
            }
            .otp {
                font-size: 24px;
                font-weight: bold;
                color: #0073e6;
                margin: 20px 0;
                padding: 10px;
                background-color: #e6f2ff;
                display: inline-block;
                border-radius: 5px;
            }
            .btn {
                display: inline-block;
                padding: 12px 25px;
                margin-top: 20px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                color: #ffffff;
                background-color: #0073e6;
                border-radius: 5px;
            }
            .btn:hover {
                background-color: #005bb5;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://www.acumen.aero/uploads/blog/blog_image/India-aviation-5.jpg" alt="Air Aviation" class="logo">
            <h2>One-Time Password (OTP) for Login</h2>
            <p>Dear Customer,</p>
            <p>Your OTP for login to Air Aviation is:</p>
            <div class="otp">${otp}</div>
            <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
            <p class="footer">If you did not request this OTP, please ignore this email.</p>
            <p class="footer">&copy; 2025 Air Aviation. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;

    await sendMail(email, "OTP verification", html);

    return NextResponse.json({ success: true, otp });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    let phoneNumber = searchParams.get("phoneNumber");
    const otp = searchParams.get("otp");

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    phoneNumber = `+${phoneNumber.trim()}`;

    // Find the latest OTP for the phone number
    const result = await OTPTable.findOne({ address: phoneNumber });

    if (!result) {
      return NextResponse.json({ message: "OTP not found" }, { status: 400 });
    }

    if (result.otp != otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    const expiryTime = result.expiryTime;
    const currentTime = Math.floor(Date.now() / 1000);
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
