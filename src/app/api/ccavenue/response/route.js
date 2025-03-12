import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const parsedURL = new URL(req.url);
    const status = parsedURL.searchParams.get("status");
    if (status == "success") {
      return NextResponse.redirect(
        `${process.env.LOCAL_URL}/payment-success${parsedURL.search}`,
        303
      );
    }

    return NextResponse.redirect(
      `${process.env.LOCAL_URL}/payment-cancel`,
      303
    );
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Error decrypting response" },
      { status: 500 }
    );
  }
}
