import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ✅ Extract Token
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token received:", token);

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("📥 Decoded payload:", decoded);

      // ✅ Attach user to req
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, invalid token" });
      }
      console.log("👤 Authenticated user:", req.user);

      return next();
    } catch (error) {
      console.error("❌ JWT verification failed:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    console.warn("⚠️ No token provided in request");
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};
