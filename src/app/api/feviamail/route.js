import sendMail from "@/config/nodeMailer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { email, imageURL } = await req.json();
    const html = `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .footer { text-align: center; padding-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
            <img src="${imageURL}" alt="as">

        <div class="footer">
            <p>Safe travels with Air Ambulance Avaition!</p>
            <p>© 2023 Air Ambulance Aviation. All rights reserved.</p>
            <p style="font-size: 0.8em;">
                <a href="[PRIVACY_POLICY_LINK]" style="color: #666;">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>`;

    await sendMail(email, "Fleet Enquiry", html);

    return NextResponse.json({ message: "success" });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
