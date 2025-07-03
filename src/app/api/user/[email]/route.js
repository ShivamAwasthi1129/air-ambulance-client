import User from "@/app/models/User";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const GET = async (req, { params }) => {
  try {
    const text = (await params).email;
    await connectToDatabase();

    if (!text || text.length < 3) {
      return NextResponse.json(
        { error: "Search text must be at least 3 characters long." },
        { status: 400 }
      );
    }

    const regex = new RegExp(escapeRegex(text), "i");

    const users = await User.aggregate([
      {
        $match: {
          $or: [{ email: { $regex: regex } }, { phone: { $regex: regex } }],
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          password: 1,
        },
      },
    ]);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  try {
    const email = (await params).email;
    const body = await req.json();
    await connectToDatabase();
    await User.updateOne(
      {
        email,
      },
      {
        $set: body,
      }
    );
    return NextResponse.json({"message": "User updated"});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
