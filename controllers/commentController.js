import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id; // from auth middleware

    const newComment = await Comment.create({
      text,
      user: userId,
      video: videoId,
    });
    await newComment.populate("user", "name avatar");

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 }); // newest first

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized" });

    comment.text = text;
    await comment.save();
    res.json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Not authorized" });

    // ✅ Use deleteOne instead of remove
    await comment.deleteOne();

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
