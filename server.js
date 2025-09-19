import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import channelRouters from "./routes/channelRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
