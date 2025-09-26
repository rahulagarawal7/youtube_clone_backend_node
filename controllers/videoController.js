import Video from "../models/Video.js";

export const addVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoID, category } = req.body;

    // ✅ Get channel from authenticated user
    const user = req.user; // already attached by protect
    if (!user.channel) {
      return res.status(400).json({ message: "User does not have a channel" });
    }

    // ✅ Create new video linked to user's channel
    const newVideo = new Video({
      title,
      description,
      thumbnailUrl,
      videoID,
      channel: user.channel,
      category,
    });

    await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Error in addVideo:", error.message);
    res
      .status(500)
      .json({ success: false, message: error.message, error: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (video.channel.toString() !== req.user.channel.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error in updateVideo:", error.message);
    res
      .status(500)
      .json({ success: false, message: error.message, error: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Ensure video belongs to the authenticated user's channel
    if (video.channel.toString() !== req.user.channel.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error in deleteVideo:", error.message);
    res
      .status(500)
      .json({ success: false, message: error.message, error: error.message });
  }
};

// ✅ Get all videos (public)
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name avatar") // include channel name & avatar
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, message: "successFully get all Videos", videos });
  } catch (error) {
    console.error("❌ Error in getAllVideos:", error.message);
    res.status(500).json({ message: error.message, error: error.message });
  }
};

// ✅ Get videos of logged-in user's channel
export const getMyChannelVideos = async (req, res) => {
  try {
    if (!req.user.channel) {
      return res.status(400).json({ message: "User does not have a channel" });
    }

    const videos = await Video.find({ channel: req.user.channel })
      .populate("channel", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Successfully fetched all the channel videos",
      videos,
    });
  } catch (error) {
    console.error("❌ Error in getMyChannelVideos:", error.message);
    res.status(500).json({ message: error.message, error: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id; // only available if logged in

    const video = await Video.findById(id).populate(
      "channel",
      "name avatar subscribers"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // ✅ check subscription only if user is logged in
    let isSubscribed = false;
    if (userId && video.channel?.subscribers) {
      isSubscribed = video.channel.subscribers.some(
        (subId) => subId.toString() === userId.toString()
      );
    }

    res.json({
      success: true,
      message: "successfully get the details",
      video,
      isSubscribed,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    let videos;

    if (category.toLowerCase() === "all") {
      // fetch all videos
      videos = await Video.find()
        .populate("channel", "name avatar")
        .sort({ createdAt: -1 });
    } else {
      // fetch by category
      videos = await Video.find({ category })
        .populate("channel", "name avatar")
        .sort({ createdAt: -1 });
    }

    if (!videos || videos.length === 0) {
      return res.status(200).json({
        success: false,
        message:
          category.toLowerCase() === "all"
            ? "No videos found"
            : `No videos found in category: ${category}`,
      });
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      videos: videos,
    });
  } catch (error) {
    console.error("Error fetching videos by category:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Search videos by title
export const searchVideos = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    })
      .populate("channel", "name avatar")
      .sort({ createdAt: -1 });

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No videos found for search: ${query}`,
      });
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      videos: videos,
    });
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
