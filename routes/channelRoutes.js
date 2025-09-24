import express from "express";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  toggleSubscription,
  updateChannel,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// only logged-in users can create or update
router.get("/:id", protect, getChannelById);
router.put("/:id", protect, updateChannel);

// anyone can view channels
router.get("/", getAllChannels);
router.post("/", protect, createChannel);
router.post("/:channelId/subscribe", protect, toggleSubscription);

export default router;
