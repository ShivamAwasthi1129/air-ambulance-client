import mongoose from "mongoose";

const selectedFleetSchema = new mongoose.Schema({
  fleetId: { type: String, required: true },
  registrationNo: { type: String, required: true },
  type: { type: String, required: true },
  model: { type: String, required: true },
  seatingCapacity: { type: Number, required: true },
  price: { type: String, required: true },
  time: { type: String, required: true },
});

const segmentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  flightTypes: [{ type: String, required: true }],
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  passengers: { type: Number, required: true },
  fromCity: { type: String, required: false },
  fromIATA: { type: String, required: false },
  fromICAO: { type: String, required: false },
  toCity: { type: String, required: true },
  toIATA: { type: String, required: true },
  toICAO: { type: String, required: true },
  selectedFleet: selectedFleetSchema,
});

const userInfoSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true },
  loc: { type: String, required: true },
  org: { type: String, required: true },
  postal: { type: String, required: true },
  timezone: { type: String, required: true },
  readme: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    amount_paid: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    segments: [segmentSchema],
    trip_type: { type: String, required: true },
    user_info: userInfoSchema,
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema, "Booking");
