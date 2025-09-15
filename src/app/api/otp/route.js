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

    const result = await OTPTable.findOne({ email, phone });

    if (!result) {
      // Store OTP in MongoDB
      await OTPTable.create({
        email,
        phone,
        name,
        otp,
        expiryTime,
      });
    } else {
      // Update OTP in MongoDB
      await OTPTable.updateOne(
        { _id: result._id },
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
          to: `whatsapp:${phone}`,
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
    <title>Verify Your Account - Air Aviation</title>
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
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 150px;
        }
        .header {
            font-size: 24px;
            color: #003366;
            margin-bottom: 10px;
        }
        .content {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
        }
        .details {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: left;
        }
        .details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .otp-box {
            display: inline-block;
            background: #0073e6;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            letter-spacing: 3px;
            margin: 15px 0;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://cdn.vectorstock.com/i/500p/19/86/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg" alt="Air Aviation Logo" class="logo">
        <h2 class="header">Verify Your Account</h2>
        <p class="content">Dear <strong>${name}</strong>,</p>
        <p class="content">Thank you for signing up with <strong>Air Aviation</strong>. Use the OTP below to verify your email.</p>
        
        <div class="details">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
        </div>

        <p class="content">Your OTP is:</p>
        <div class="otp-box">${otp}</div>

        <p class="content">If you did not sign up, please ignore this email.</p>

        <p class="footer">&copy; 2025 Air Aviation. All Rights Reserved.</p>
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
    let email = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (!email || !otp) {
      return NextResponse.json(
        { error: "email and OTP are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    // Find the latest OTP for the email
    const result = await OTPTable.findOne({ email });

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

    if (!(await User.findOne({ email: result.email }))) {
      const obj = {
        email: result.email,
        name: result.name,
        phone: result.phone,
        password: Math.random().toString(36).substring(2, 8),
      };
      await User.create(obj);
      const html = `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Created Successfully</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              background: #ffffff;
              margin: 20px auto;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
              color: #333;
              text-align: center;
          }
          p {
              font-size: 16px;
              color: #555;
          }
          .info-box {
              background: #f9f9f9;
              padding: 10px;
              border-left: 4px solid #4CAF50;
              margin: 10px 0;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #777;
          }
          .button {
              display: inline-block;
              padding: 10px 15px;
              background: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              margin-top: 10px;
          }
          .button:hover {
              background: #45a049;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Welcome to Our Platform, ${obj.name}!</h2>
          <p>We are excited to inform you that your account has been successfully created.</p>
          
          <div class="info-box">
              <p><strong>Email:</strong> ${obj.email}</p>
              <p><strong>Phone:</strong> ${obj.phone}</p>
              <p><strong>Password:</strong> <span style="color: #E53935;"><strong>${obj.password}</strong></span></p>
          </div>
  
          <div style="text-align: center;">
              <a href="http://localhost:3000" class="button">Login to Your Account</a>
          </div>
  
          <p>If you didn’t request this account, please ignore this email or contact support.</p>
  
          <div class="footer">
              <p>Best Regards,</p>
              <p><strong>Air Aviation</strong></p>
              <p><a href="mailto:support@aviation.com">support@aviation.com</a></p>
          </div>
      </div>
  </body>
  </html>
  `;

      await sendMail(email, "User Creation", html);
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
