import sendMail from "@/config/nodeMailer";
import { convertTo12HourFormat } from "@/utils/helperFunction";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try{
    const { segments, user } = await req.json();
    const html = `<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flight Enquiry</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              background-color: #f9f9f9;
          }
          .header {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #004080;
          }
          .details {
              margin-bottom: 20px;
          }
          .details p {
              margin: 5px 0;
          }
          .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Flight Enquiry</div>
          <div class="details">
            ${segments.map(
              (s) => `<>
            <p><strong>From:</strong> ${s.from}</p>
            <p><strong>To:</strong> ${s.to}</p>
            <p><strong>Departure Date:</strong> ${new Date(
              s.departureDate
            ).toDateString()}</p>
            <p><strong>Departure Time:</strong> ${convertTo12HourFormat(
              s.departureTime
            )}</p>
            <p><strong>Passengers:</strong> ${s.passengers}</p>
            <p><strong>Selected Fleet:</strong></p>
            <ul>
                <li><strong>Registration No:</strong> ${
                  s.selectedFleet.registrationNo
                }</li>
                <li><strong>Type:</strong> ${s.selectedFleet.type}</li>
                <li><strong>Model:</strong> ${s.selectedFleet.model}</li>
                <li><strong>Price:</strong> $${s.selectedFleet.price}</li>
                <li><strong>Flight Duration:</strong> ${s.selectedFleet.time}</li>
            </ul>
            </>`
            )}
          </div>
          <div class="details">
              <p><strong>Enquirer Details:</strong></p>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Phone:</strong> ${user.phone}</p>
          </div>
          <div class="footer">
              <p>This is an automated enquiry. Please respond at the earliest convenience.</p>
              <p>Thank you,</p>
              <p>${user.name}</p>
          </div>
      </div>
  </body>
  </html>`;
    await sendMail(user.email, "Flight enquiry", html);
    return NextResponse.json({ message: "success" });
  }catch(err){
    console.error("Error sending email:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
