import { NextResponse } from "next/server";
import OTPTable from "@/app/models/OTPTable";
import { connectToDatabase } from "@/config/mongo";
import sendMail from "@/config/nodeMailer";
import User from "@/app/models/User";

const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || 300; // 5 minutes

export async function POST(req) {
  try {
    const { phone, email, name } = await req.json();
    if (!phone && !email && !name) {
      return NextResponse.json(
        { error: "Name, Phone number and email are required" },
        { status: 400 }
      );
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = Math.floor(Date.now() / 1000) + Number(OTP_EXPIRY_TIME);

    await connectToDatabase();

    await OTPTable.deleteMany({ $or: [{ email }, { phone }] });
    // Store OTP in MongoDB
    await OTPTable.create({
      email,
      name,
      phone,
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
          to: phone,
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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Login</title>
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
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
      text-align: center;
    }
    p {
      color: #555555;
      line-height: 1.6;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #007BFF;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #777777;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
      margin: 20px auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for signing up with us. To complete your login process, please use the One-Time Password (OTP) provided below:</p>
    <div class="otp">
      Your OTP: <strong>${otp}</strong>
    </div>
    <p>Please enter this OTP on the login page to verify your account. This OTP is valid for <strong>5 minutes</strong>.</p>
    <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
    <div class="footer">
      <p>Best regards,</p>
      <p><strong>Air Ambulance Aviation</strong></p>
      <p>Contact us: <a href="mailto:support@airambulanceaviation.com">support@airambulanceaviation.com</a></p>
    </div>
  </div>
</body>
</html>`;

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
    let email = searchParams.get("email");
    const otp = searchParams.get("otp");
    const phone = searchParams.get("phone");

    if (!email || !otp) {
      return NextResponse.json(
        { error: "email and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    // Find the latest OTP for the email
    const result = await OTPTable.findOne({ $or: [{ email }, { phone }] });

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
