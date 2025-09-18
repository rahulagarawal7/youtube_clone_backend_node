import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//register new User
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Save user
    const user = await User.create({
      fullName,
      email,
      password: hashed,
    });

    // 4. Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
      success: true,
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
  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};
