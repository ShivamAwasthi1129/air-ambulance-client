import { NextResponse } from "next/server";
import OTPTable from "@/app/models/OTPTable";

const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME || 300; // 5 minutes

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = Math.floor(Date.now() / 1000) + OTP_EXPIRY_TIME;

    await connectToDatabase();
    // Store OTP in MongoDB
    await OTPTable.create({
      via: "email",
      address: email,
      otp,
      expiryTime,
    });

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
    const phoneNumber = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the latest OTP for the phone number
    const result = await OTPTable.findOne({ address: email }, { sort: { expiryTime: -1 } });

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
