import User from "@/app/models/User";
import { connectToDatabase } from "@/config/mongo";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const text = (await params).email;
    await connectToDatabase();

    // if (!text || text.length < 4) {
    //   return NextResponse.json({ error: "Search text must be at least 3 characters long." }, { status: 400 });
    // }

    // const users = await User.aggregate([
    //   {
    //     $addFields: {
    //       emailUsername: { $arrayElemAt: [{ $split: ["$email", "@"] }, 0] }
    //     }
    //   },
    //   {
    //     $match: {
    //       emailUsername: { $regex: new RegExp(`${text}`, "i") }
    //     }
    //   },
    //   {
    //     $project: {
    //       name: 1,
    //       email: 1,
    //       phone: 1
    //     }
    //   }
    // ]);

    if (!text || !text.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const users = await User.aggregate([
      {
        $match: {
          email: { $regex: new RegExp(`^${text}$`, "i") }, // Exact match (case-insensitive)
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
        },
      },
    ]);

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
