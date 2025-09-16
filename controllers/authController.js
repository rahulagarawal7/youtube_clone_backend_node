import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register new User
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exist" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
    });
    res.status(200).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found " });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "Login successful",
      token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout user
export const logout = (req, res) => {
  res.json({ message: "Logout successful (remove token client-side)" });
};
