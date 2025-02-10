import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  name: { type: String, required: true },
  otp: { type: Number, required: true },
  expiryTime: { type: Number, required: true },
});

export default mongoose.models.OTPTable || mongoose.model("OTPTable", otpSchema, "OTPTable");
