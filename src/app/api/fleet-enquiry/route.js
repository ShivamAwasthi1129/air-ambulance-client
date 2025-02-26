import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { imageURL, name, phone } = await req.json();

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
          to: `whatsapp:${phone}`,
          type: "template",
          template: {
            name: "fleet_enquiry",
            language: {
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: name,
                  },
                  {
                    type: "text",
                    text: imageURL,
                  },
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
