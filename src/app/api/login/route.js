import User from "@/app/models/User";
import { generateToken } from "@/utils/helperFunction";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/config/mongo";

export async function POST (req){
  const {email, password} = await req.json();
  if (!email ||!password){
    return NextResponse.json({error: 'Email and password are required'}, {status: 400});
  }
  await connectToDatabase();
  // Validate email and password here
  const user = await User.findOne({email: email, password: password});
  if (!user){
    return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
  }

  // Generate JWT token and return it
  const token = generateToken(user);
  return NextResponse.json({token: token, phone: user.phone, name: user.name}, {status: 200});
}