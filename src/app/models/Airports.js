import mongoose from "mongoose";

const AirportSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  region: { type: String, required: true },
  iata_code: { type: String, required: true, uppercase: true, trim: true },
  icao_code: { type: String, required: true, uppercase: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  tags: { type: String, default: "" },
  status: { type: String, enum: ["Active", "Inactive"], required: true }
}, { timestamps: true });

export default mongoose.models.Airports || mongoose.model("Airports", AirportSchema, "Airports");
