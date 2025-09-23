import express from "express";
import {
  addVideo,
  deleteVideo,
  getAllVideos,
  getMyChannelVideos,
  updateVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addVideo);
router.get("/channel", protect, getMyChannelVideos);
router.get("/", getAllVideos);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
