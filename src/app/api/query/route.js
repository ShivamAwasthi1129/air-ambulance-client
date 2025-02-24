import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/mongo";
import UserQuery from "@/app/models/UserQuery";
import sendMail from "@/config/nodeMailer";

export const POST = async (req) => {
  try {
    await connectToDatabase();

    const { segments, userInfo, tripType } = await req.json();
    const { name, email, phone, ip, city, region, country, loc, postal, timezone } = userInfo;

    const newUserQuery = new UserQuery({
      userInfo: {
        email,
        name,
        phone,
        ip,
        city,
        region,
        country,
        loc,
        postal
      },
      tripType,
      segments
    });

    await newUserQuery.save();

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Flight Inquiry</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
        h2 {
            text-align: center;
            color: #444;
        }
        .details {
            padding: 10px;
            background: #ffffff;
            border-radius: 5px;
            box-shadow: 0px 0px 5px #ddd;
        }
        .segment {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>New Flight Inquiry</h2>
    
    <div class="details">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${city}, ${region}, ${country}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>Timezone:</strong> ${timezone}</p>
    </div>

    <h3>Trip Details</h3>
    <div class="details">
        <p><strong>Trip Type:</strong> ${tripType}</p>

        ${segments.map(
          (segment) => `<div class="segment">
            <p><strong>From:</strong> ${segment.from}</p>
            <p><strong>To:</strong> ${segment.to}</p>
            <p><strong>Departure Date:</strong> ${segment.departureDate}</p>
            <p><strong>Departure Time:</strong> ${segment.departureTime}</p>
            <p><strong>Passengers:</strong> ${segment.passengers}</p>
        </div>`
        ).join("")}
    </div>

    <div class="footer">
        <p>This is an automated email. Please do not reply directly.</p>
    </div>
</div>

</body>
</html>
`;

    await sendMail("hexerve@gmail.com", `New Flight Inquiry - ${name}`, html);

    return NextResponse.json({ message: "User query submitted successfully" });
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectToDatabase();

    const userQueries = await UserQuery.find();

    if (!userQueries.length) {
      return NextResponse.json({ message: "No records found" }, { status: 404 });
    }

    return NextResponse.json(userQueries);
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
