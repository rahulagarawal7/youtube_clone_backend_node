import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hasChannel: { type: Boolean, default: false },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
});

export default mongoose.model("User", userSchema);
