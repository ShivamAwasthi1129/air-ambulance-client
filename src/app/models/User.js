import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema, "User");

export default User;
