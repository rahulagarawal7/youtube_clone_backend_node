import express from "express";
import { addVideo, getAllVideos, getMyChannelVideos } from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/",protect, addVideo);
router.get('/channel',protect,getMyChannelVideos)
router.get('/',getAllVideos)

export default router;
