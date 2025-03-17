import mongoose from "mongoose";

const SegmentSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  passengers: { type: Number, required: true },
});

const UserInfoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  ip: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: String, required: true },
  loc: { type: String, required: true },
  postal: { type: String, required: true },
});

const ExistingUserLoginSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
});

const UserQuerySchema = new mongoose.Schema({
  userInfo: UserInfoSchema,
  tripType: { type: String, required: true },
  flightType: { type: String, required: false },
  ExistingUserInfo : ExistingUserLoginSchema ,
  segments: [SegmentSchema],
  timestamp: { type: Date, default: Date.now },
});

const UserQuery =
  mongoose.models.UserQuery ||
  mongoose.model("UserQuery", UserQuerySchema, "UserQuery");

export default UserQuery;
