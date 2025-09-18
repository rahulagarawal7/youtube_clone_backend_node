import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hasChannel: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);
