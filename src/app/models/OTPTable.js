import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: [true, "Email already exists"],
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"], 
    unique: [true, "Phone number already exists"],
    trim: true
  },
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true
  },
  otp: { 
    type: Number, 
    required: [true, "OTP is required"]
  },
  expiryTime: { 
    type: Number, 
    required: [true, "Expiry time is required"]
  },
});

export default mongoose.models.OTPTable || mongoose.model("OTPTable", otpSchema, "OTPTable");