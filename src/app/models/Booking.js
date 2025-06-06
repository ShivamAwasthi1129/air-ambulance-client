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
  fromAddress: { type: String, required: false },
  to: { type: String, required: true },
  toAddress: { type: String, required: false },
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  passengers: { type: Number, required: true },
  fromCity: { type: String, required: false },
  fromIATA: { type: String, required: false },
  fromICAO: { type: String, required: false },
  fromLoc: {
    lat: { type: Number },
    lng: { type: Number },
  },
  toLoc: {
    lat: { type: Number },
    lng: { type: Number },
  },
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
  loc: { type: String },
  org: { type: String },
  postal: { type: String, required: true },
  timezone: { type: String },
  readme: { type: String },
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const paymentSchema = new mongoose.Schema({
  payment_via: {type: String, default: "cc"},
  reference_id: {type: String, default: ""},
  to_account_no: {type: String, default: ""},
  to_account_name: {type: String, default: ""},
})

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    amount_paid: { type: Number, required: false },
    payment: paymentSchema,
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
