import express from "express";
import {
  addVideo,
  deleteVideo,
  getAllVideos,
  getMyChannelVideos,
  updateVideo,
  getVideoById,
  getVideosByCategory,
  searchVideos
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addVideo);
router.get("/channel", protect, getMyChannelVideos);
router.get("/", getAllVideos);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.get("/:id", getVideoById);
router.get('/category/:category',getVideosByCategory)
router.get('/search/:query',searchVideos)

export default router;
