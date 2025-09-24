import express from "express";
import {
  addComment,
  getComments,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:videoId", protect, addComment); // Add comment
router.get("/:videoId", getComments); // Get all comments
router.put("/:commentId", protect, editComment); // Edit comment
router.delete("/:commentId", protect, deleteComment); // Delete comment

export default router;
