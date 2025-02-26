import { NextResponse } from "next/server";
function generateWhatsAppMessage(data) {
  const name = data.userInfo.name;
  const passengers = data.segments[0].passengers;
  const email = data.userInfo.email;
  const phone = data.userInfo.phone;

  let flightDetails = "";
  data.segments.forEach((segment, index) => {
    flightDetails += `
📍 *Segment ${index + 1}:*
From: ${segment.from} 🛫  
To: ${segment.to} 🛬  
Departure Date: ${segment.departureDate}  
Departure Time: ${segment.departureTime}  

🚀 *Aircraft Details:*  
✈️ Model: ${segment.selectedFleet.model}  
📌 Type: ${segment.selectedFleet.type}  
💺 Seating Capacity: ${segment.selectedFleet.seatingCapacity}  
💰 Price: $${segment.selectedFleet.price}  
⏳ Flight Duration: ${segment.selectedFleet.time}  
------------------------------
`;
  });

  return flightDetails;
}
export const POST = async (req) => {
  try {
    const data = await req.json();
    const msg = generateWhatsAppMessage(data);

    await fetch(
      `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: `whatsapp:${data.userInfo.phone}`,
          type: "template",
          template: {
            name: "booking_request",
            language: {
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: data.userInfo.name,
                  },
                  {
                    type: "text",
                    text: data.tripType,
                  },
                  {
                    type: "text",
                    text: msg,
                  }
                ],
              },
            ],
          },
        }),
      }
    );

    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
