import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  address: { type: String, required: true },
  otp: { type: Number, required: true },
  expiryTime: { type: Number, required: true },
  via: { type: String, required: true },
});

export default mongoose.models.OTPTable || mongoose.model("OTPTable", otpSchema, "OTPTable");
